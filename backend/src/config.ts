import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_STORAGE_BUCKET: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  EMAIL_FROM: z.string().min(1),
  COMPANY_EMAIL: z.string().email().default("info@tekmaglobalpartners.com.ng"),
  ALLOWED_ORIGINS: z.string().min(1),
  PORT: z.coerce.number().int().positive().default(4000),
});

export const env = envSchema.parse(process.env);
export const allowedOrigins = env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim());
