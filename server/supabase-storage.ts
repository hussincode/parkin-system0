import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { users, cars, visits, type User, type InsertUser, type Car, type InsertCar, type Visit } from "@shared/schema";

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://livjynuyaafvijfeaaxe.supabase.co';
// Prefer the service role key on the server to bypass RLS for trusted server-side operations.
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxpdmp5bnV5YWFmdmlqZmVhYXhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NTI1NzEsImV4cCI6MjA3OTUyODU3MX0.LMhWSyfUuAIQj3XIEiQJy2bNYos5mFZdEBxk403BByc';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("SUPABASE_URL or SUPABASE_KEY (or SUPABASE_SERVICE_KEY) must be set");
}

// Do not log the full key; only indicate which key type is being used.
if (process.env.SUPABASE_SERVICE_KEY) {
  console.log('Supabase storage: using service role key (server-only).');
} else if (process.env.SUPABASE_KEY) {
  console.log('Supabase storage: using anon/public key. RLS may block some operations.');
} else {
  console.log('Supabase storage: using embedded default key (for local testing only).');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

// Helper to convert snake_case from Supabase to camelCase for TypeScript types
function mapSnakeToCamel(obj: any): any {
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

export class SupabaseStorage implements IStorage {
  private supabase: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.supabase = client;
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user:', error);
      throw error;
    }
    return data as User | undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user by username:', error);
      throw error;
    }
    return data as User | undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { data, error } = await this.supabase
      .from('users')
      .insert([insertUser])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user:', error);
      throw error;
    }
    return data as User;
  }

  // Car operations
  async getCarByQrValue(qrValue: string): Promise<Car | undefined> {
    const { data, error } = await this.supabase
      .from('cars')
      .select('*')
      .eq('qr_value', qrValue)
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching car by QR value:', error);
      throw error;
    }
    return data ? (mapSnakeToCamel(data) as Car) : undefined;
  }

  async getCarByPlateNumber(plateNumber: string): Promise<Car | undefined> {
    const { data, error } = await this.supabase
      .from('cars')
      .select('*')
      .eq('plate_number', plateNumber)
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching car by plate number:', error);
      throw error;
    }
    return data as Car | undefined;
  }

  async createCar(car: InsertCar & { qrValue: string; qrCode: string }): Promise<Car> {
    const carData = {
      plate_number: car.plateNumber,
      owner_name: car.ownerName,
      qr_value: car.qrValue,
      qr_code: car.qrCode,
    };

    const { data, error } = await this.supabase
      .from('cars')
      .insert([carData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating car:', error);
      throw error;
    }
    return data as Car;
  }

  async getAllCars(): Promise<Car[]> {
    const { data, error } = await this.supabase
      .from('cars')
      .select('*');
    
    if (error) {
      console.error('Error fetching cars:', error);
      throw error;
    }
    return (data || []) as Car[];
  }

  // Visit operations
  async createVisit(visit: { carId: string; plateNumber: string; ownerName: string }): Promise<Visit> {
    const visitData = {
      car_id: visit.carId,
      plate_number: visit.plateNumber,
      owner_name: visit.ownerName,
      check_in_time: new Date().toISOString(),
      is_checked_in: true,
    };

    console.log('createVisit: sending data:', visitData);

    const { data, error } = await this.supabase
      .from('visits')
      .insert([visitData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating visit:', error);
      console.error('Failed visitData was:', visitData);
      throw error;
    }
    return data as Visit;
  }

  async getActiveVisitByCarId(carId: string): Promise<Visit | undefined> {
    const { data, error } = await this.supabase
      .from('visits')
      .select('*')
      .eq('car_id', carId)
      .eq('is_checked_in', true)
      .order('check_in_time', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching active visit:', error);
      throw error;
    }
    return data ? (mapSnakeToCamel(data) as Visit) : undefined;
  }

  async updateVisitCheckout(visitId: string, checkOutTime: Date, duration: number, fee: number): Promise<Visit> {
    const { data, error } = await this.supabase
      .from('visits')
      .update({
        check_out_time: checkOutTime.toISOString(),
        duration,
        fee,
        is_checked_in: false,
      })
      .eq('id', visitId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating visit checkout:', error);
      throw error;
    }
    return mapSnakeToCamel(data) as Visit;
  }

  async getAllVisits(): Promise<Visit[]> {
    const { data, error } = await this.supabase
      .from('visits')
      .select('*')
      .order('check_in_time', { ascending: false });
    
    if (error) {
      console.error('Error fetching visits:', error);
      throw error;
    }
    return (data || []).map(mapSnakeToCamel) as Visit[];
  }
}

export const storage = new SupabaseStorage(supabase);
