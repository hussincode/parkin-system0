import { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import session from "express-session";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import QRCode from "qrcode";
import { randomBytes } from "crypto";
import ExcelJS from "exceljs";
import { fromError } from "zod-validation-error";
import {
  insertUserSchema,
  loginSchema,
  insertCarSchema,
  scanSchema,
} from "../shared/schema";

// ============ Supabase Storage ============
const SUPABASE_URL = process.env.SUPABASE_URL || "https://livjynuyaafvijfeaaxe.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY || "";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_KEY (or SUPABASE_SERVICE_KEY) must be set");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

function mapSnakeToCamel(obj: any) {
  if (!obj) return obj;
  return {
    id: obj.id,
    username: obj.username,
    password: obj.password,
    role: obj.role,
    createdAt: obj.created_at,
    plateNumber: obj.plate_number,
    ownerName: obj.owner_name,
    qrValue: obj.qr_value,
    qrCode: obj.qr_code,
    carId: obj.car_id,
    checkInTime: obj.check_in_time,
    checkOutTime: obj.check_out_time,
    duration: obj.duration,
    fee: obj.fee,
    isCheckedIn: obj.is_checked_in,
  };
}

class SupabaseStorage {
  supabase;

  constructor(client: any) {
    this.supabase = client;
  }

  async getUser(id: string) {
    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching user:", error);
      throw error;
    }
    return data;
  }

  async getUserByUsername(username: string) {
    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching user by username:", error);
      throw error;
    }
    return data;
  }

  async createUser(insertUser: any) {
    const { data, error } = await this.supabase
      .from("users")
      .insert([insertUser])
      .select()
      .single();

    if (error) {
      console.error("Error creating user:", error);
      throw error;
    }
    return data;
  }

  async getCarByQrValue(qrValue: string) {
    const { data, error } = await this.supabase
      .from("cars")
      .select("*")
      .eq("qr_value", qrValue)
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching car by QR value:", error);
      throw error;
    }
    return data ? mapSnakeToCamel(data) : undefined;
  }

  async getCarByPlateNumber(plateNumber: string) {
    const { data, error } = await this.supabase
      .from("cars")
      .select("*")
      .eq("plate_number", plateNumber)
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching car by plate number:", error);
      throw error;
    }
    return data;
  }

  async createCar(car: any) {
    const carData = {
      plate_number: car.plateNumber,
      owner_name: car.ownerName,
      qr_value: car.qrValue,
      qr_code: car.qrCode,
    };

    const { data, error } = await this.supabase
      .from("cars")
      .insert([carData])
      .select()
      .single();

    if (error) {
      console.error("Error creating car:", error);
      throw error;
    }
    return data;
  }

  async getAllCars() {
    const { data, error } = await this.supabase.from("cars").select("*");

    if (error) {
      console.error("Error fetching cars:", error);
      throw error;
    }
    return data || [];
  }

  async createVisit(visit: any) {
    const visitData = {
      car_id: visit.carId,
      plate_number: visit.plateNumber,
      owner_name: visit.ownerName,
      check_in_time: new Date().toISOString(),
      is_checked_in: true,
    };

    console.log("createVisit: sending data:", visitData);
    const { data, error } = await this.supabase
      .from("visits")
      .insert([visitData])
      .select()
      .single();

    if (error) {
      console.error("Error creating visit:", error);
      throw error;
    }
    return data;
  }

  async getActiveVisitByCarId(carId: string) {
    const { data, error } = await this.supabase
      .from("visits")
      .select("*")
      .eq("car_id", carId)
      .eq("is_checked_in", true)
      .order("check_in_time", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching active visit:", error);
      throw error;
    }
    return data ? mapSnakeToCamel(data) : undefined;
  }

  async updateVisitCheckout(visitId: string, checkOutTime: Date, duration: number, fee: number) {
    const { data, error } = await this.supabase
      .from("visits")
      .update({
        check_out_time: checkOutTime.toISOString(),
        duration,
        fee,
        is_checked_in: false,
      })
      .eq("id", visitId)
      .select()
      .single();

    if (error) {
      console.error("Error updating visit checkout:", error);
      throw error;
    }
    return mapSnakeToCamel(data);
  }

  async getAllVisits() {
    const { data, error } = await this.supabase
      .from("visits")
      .select("*")
      .order("check_in_time", { ascending: false });

    if (error) {
      console.error("Error fetching visits:", error);
      throw error;
    }
    return (data || []).map(mapSnakeToCamel);
  }
}

const storage = new SupabaseStorage(supabase);

// ============ Express App ============
const app = express();

// Session middleware - use memory store for serverless (sessions won't persist across functions)
const MemoryStore = require("memorystore")(session);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "smart-parking-secret-key",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore(),
    cookie: {
      secure: true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  })
);

// ============ Auth Middleware ============
async function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const user = await storage.getUser(req.session.userId);
  if (!user) {
    return res.status(401).json({ message: "Invalid session" });
  }

  req.user = user;
  next();
}

async function requireAdmin(req: any, res: any, next: any) {
  const user = req.user;
  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

// ============ Routes ============
app.post("/api/auth/signup", async (req: any, res: any) => {
  try {
    const result = insertUserSchema.safeParse(req.body);
    if (!result.success) {
      const error = fromError(result.error);
      return res.status(400).json({ message: error.toString() });
    }

    const { username, password, role } = result.data;
    const existingUser = await storage.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await storage.createUser({
      username,
      password: hashedPassword,
      role,
    });

    req.session.userId = user.id;
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error: any) {
    console.error("Signup error:", error);
    res.status(500).json({ message: error.message || "Signup failed" });
  }
});

app.post("/api/auth/login", async (req: any, res: any) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      const error = fromError(result.error);
      return res.status(400).json({ message: error.toString() });
    }

    const { username, password } = result.data;
    const user = await storage.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    req.session.userId = user.id;
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message || "Login failed" });
  }
});

app.post("/api/auth/logout", (req: any, res: any) => {
  req.session.destroy((err: any) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

app.get("/api/auth/me", requireAuth, async (req: any, res: any) => {
  const user = req.user;
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

app.post("/api/cars", requireAuth, requireAdmin, async (req: any, res: any) => {
  try {
    const result = insertCarSchema.safeParse(req.body);
    if (!result.success) {
      const error = fromError(result.error);
      return res.status(400).json({ message: error.toString() });
    }

    const { plateNumber, ownerName } = result.data;
    const existingCar = await storage.getCarByPlateNumber(plateNumber);
    if (existingCar) {
      return res.status(400).json({ message: "Vehicle with this plate number already registered" });
    }

    const timestamp = Date.now();
    const randomId = randomBytes(3).toString("hex");
    const qrValue = `CAR-${timestamp}-${randomId}`;
    const qrCode = await QRCode.toDataURL(qrValue);

    const car = await storage.createCar({
      plateNumber,
      ownerName,
      qrValue,
      qrCode,
    });

    res.json({ car, qrCode });
  } catch (error: any) {
    console.error("Car registration error:", error);
    res.status(500).json({ message: error.message || "Registration failed" });
  }
});

app.post("/api/scan", async (req: any, res: any) => {
  try {
    const result = scanSchema.safeParse(req.body);
    if (!result.success) {
      const error = fromError(result.error);
      return res.status(400).json({ message: error.toString() });
    }

    const { qrCode } = result.data;
    const car = await storage.getCarByQrValue(qrCode);
    if (!car) {
      return res.status(404).json({ message: "Invalid QR code - Vehicle not registered" });
    }

    const activeVisit = await storage.getActiveVisitByCarId(car.id);
    if (activeVisit) {
      const checkOutTime = new Date();
      const checkInTime = new Date(activeVisit.checkInTime);
      const durationMs = checkOutTime.getTime() - checkInTime.getTime();
      const durationMinutes = Math.round(durationMs / (1000 * 60));
      const fee = 20;

      const updatedVisit = await storage.updateVisitCheckout(
        activeVisit.id,
        checkOutTime,
        durationMinutes,
        fee
      );

      res.json({
        message: `✓ Check-out successful! Duration: ${durationMinutes} min, Fee: ${fee} EGP`,
        type: "checkout",
        visit: updatedVisit,
      });
    } else {
      const visit = await storage.createVisit({
        carId: car.id,
        plateNumber: car.plateNumber,
        ownerName: car.ownerName,
      });

      res.json({
        message: `✓ Check-in successful! Welcome ${car.ownerName}`,
        type: "checkin",
        visit,
      });
    }
  } catch (error: any) {
    console.error("Scan error:", error);
    res.status(500).json({ message: error.message || "Scan failed" });
  }
});

app.get("/api/visits", requireAuth, requireAdmin, async (req: any, res: any) => {
  try {
    const visits = await storage.getAllVisits();
    res.json(visits);
  } catch (error: any) {
    console.error("Get visits error:", error);
    res.status(500).json({ message: error.message || "Failed to fetch visits" });
  }
});

app.get("/api/visits/export", requireAuth, requireAdmin, async (req: any, res: any) => {
  try {
    const visits = await storage.getAllVisits();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Parking Visits");

    worksheet.columns = [
      { header: "Plate Number", key: "plateNumber", width: 15 },
      { header: "Owner Name", key: "ownerName", width: 20 },
      { header: "Check In", key: "checkInTime", width: 20 },
      { header: "Check Out", key: "checkOutTime", width: 20 },
      { header: "Duration (min)", key: "duration", width: 15 },
      { header: "Fee (EGP)", key: "fee", width: 12 },
      { header: "Status", key: "status", width: 12 },
    ];

    visits.forEach((visit: any) => {
      worksheet.addRow({
        plateNumber: visit.plateNumber,
        ownerName: visit.ownerName,
        checkInTime: new Date(visit.checkInTime).toLocaleString(),
        checkOutTime: visit.checkOutTime ? new Date(visit.checkOutTime).toLocaleString() : "-",
        duration: visit.duration || "-",
        fee: visit.fee || "-",
        status: visit.isCheckedIn ? "Checked In" : "Checked Out",
      });
    });

    worksheet.getRow(1).font = { bold: true };
    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=parking-visits.xlsx");
    res.send(buffer);
  } catch (error: any) {
    console.error("Export error:", error);
    res.status(500).json({ message: error.message || "Export failed" });
  }
});

// ============ Vercel Serverless Handler ============
export default (req: VercelRequest, res: VercelResponse) => {
  app(req, res);
};
