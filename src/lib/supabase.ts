import { createClient } from "@supabase/supabase-js";

// Browser/server Supabase client.
// Keys come from .env.local — see .env.example. The anon key is safe to
// expose client-side because Row Level Security guards every table.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = "admin" | "doctor" | "technician" | "staff";

export type HelmetStatus =
  | "designed"
  | "in_production"
  | "fitted"
  | "delivered"
  | "adjusted";

export interface Patient {
  id: string;
  code: string;
  full_name: string;
  date_of_birth: string;
  gender: "male" | "female" | null;
  guardian_name: string | null;
  guardian_phone: string | null;
  address: string | null;
  intake_date: string;
  notes: string | null;
}

export interface Assessment {
  id: string;
  patient_id: string;
  assessed_at: string;
  head_circumference_mm: number | null;
  cephalic_index: number | null;
  cvai: number | null;
  diagnosis: string | null;
  notes: string | null;
}
