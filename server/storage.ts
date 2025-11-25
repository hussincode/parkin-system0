import { drizzle } from "drizzle-orm/node-postgres";
import fs from "fs";
import pg from "pg";
import { users, cars, visits, type User, type InsertUser, type Car, type InsertCar, type Visit } from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { createClient } from '@supabase/supabase-js';

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

// Configure SSL based on environment or defaults
let sslConfig: any = undefined;
if (process.env.NODE_EXTRA_CA_CERTS && fs.existsSync(process.env.NODE_EXTRA_CA_CERTS)) {
  sslConfig = { ca: fs.readFileSync(process.env.NODE_EXTRA_CA_CERTS).toString() };
} else if (process.env.NODE_ENV === 'production') {
  // In production, always require proper SSL
  sslConfig = { rejectUnauthorized: true };
} else {
  // In development, allow self-signed certs for quick testing
  sslConfig = { rejectUnauthorized: false };
}

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
});
const db = drizzle(pool);

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;

if (!SUPABASE_URL) {
  throw new Error("SUPABASE_URL must be set");
}
if (!SUPABASE_KEY) {
  throw new Error("SUPABASE_SERVICE_KEY or SUPABASE_KEY must be set");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false }});

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Car operations
  getCarByQrValue(qrValue: string): Promise<Car | undefined>;
  getCarByPlateNumber(plateNumber: string): Promise<Car | undefined>;
  createCar(car: InsertCar & { qrValue: string; qrCode: string }): Promise<Car>;
  getAllCars(): Promise<Car[]>;
  
  // Visit operations
  createVisit(visit: { carId: string; plateNumber: string; ownerName: string }): Promise<Visit>;
  getActiveVisitByCarId(carId: string): Promise<Visit | undefined>;
  updateVisitCheckout(visitId: string, checkOutTime: Date, duration: number, fee: number): Promise<Visit>;
  getAllVisits(): Promise<Visit[]>;
}

export class DbStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Car operations
  async getCarByQrValue(qrValue: string): Promise<Car | undefined> {
    const [car] = await db.select().from(cars).where(eq(cars.qrValue, qrValue)).limit(1);
    return car;
  }

  async getCarByPlateNumber(plateNumber: string): Promise<Car | undefined> {
    const [car] = await db.select().from(cars).where(eq(cars.plateNumber, plateNumber)).limit(1);
    return car;
  }

  async createCar(car: InsertCar & { qrValue: string; qrCode: string }): Promise<Car> {
    const [newCar] = await db.insert(cars).values(car).returning();
    return newCar;
  }

  async getAllCars(): Promise<Car[]> {
    return await db.select().from(cars);
  }

  // Visit operations
  async createVisit(visit: { carId: string; plateNumber: string; ownerName: string }): Promise<Visit> {
    const [newVisit] = await db.insert(visits).values(visit).returning();
    return newVisit;
  }

  async getActiveVisitByCarId(carId: string): Promise<Visit | undefined> {
    const [visit] = await db
      .select()
      .from(visits)
      .where(eq(visits.carId, carId))
      .orderBy(desc(visits.checkInTime))
      .limit(1);
    
    return visit && visit.isCheckedIn ? visit : undefined;
  }

  async updateVisitCheckout(visitId: string, checkOutTime: Date, duration: number, fee: number): Promise<Visit> {
    const [updatedVisit] = await db
      .update(visits)
      .set({
        checkOutTime,
        duration,
        fee,
        isCheckedIn: false,
      })
      .where(eq(visits.id, visitId))
      .returning();
    
    return updatedVisit;
  }

  async getAllVisits(): Promise<Visit[]> {
    return await db.select().from(visits).orderBy(desc(visits.checkInTime));
  }
}

export const storage = new DbStorage();
