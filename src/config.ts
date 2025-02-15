import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  URLS: z
    .string()
    .nonempty({ message: "URLS is required" })
    .transform((val) =>
      val
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url !== "")
    )
    .refine(
      (urls) =>
        urls.every((url) => {
          try {
            new URL(url);
            return true;
          } catch (e) {
            return false;
          }
        }),
      { message: "Each URL in URLS must be valid." }
    ),
  SCHEDULE_INTERVAL: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 60000))
    .refine((interval) => !isNaN(interval) && interval > 0, {
      message: "SCHEDULE_INTERVAL must be a positive integer",
    }),
  // MongoDB Settings
  MONGODB_URI: z.string().nonempty({ message: "MONGODB_URI is required" }),
  MONGODB_DB: z.string().nonempty({ message: "MONGODB_DB is required" }),
  // SMTP Settings for Nodemailer
  SMTP_HOST: z.string().nonempty({ message: "SMTP_HOST is required" }),
  SMTP_PORT: z
    .string()
    .nonempty({ message: "SMTP_PORT is required" })
    .transform((val) => parseInt(val, 10))
    .refine((port) => port > 0, {
      message: "SMTP_PORT must be a positive number",
    }),
  SMTP_USER: z.string().nonempty({ message: "SMTP_USER is required" }),
  SMTP_PASS: z.string().nonempty({ message: "SMTP_PASS is required" }),
  EMAIL_RECIPIENTS: z
    .string()
    .nonempty({ message: "EMAIL_RECIPIENTS is required" })
    .transform((val) =>
      val
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email !== "")
    )
    .refine(
      (emails) =>
        emails.every((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)),
      {
        message: "Each email in EMAIL_RECIPIENTS must be a valid email address",
      }
    ),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:");
  console.error(parsedEnv.error.format());
  process.exit(1);
}

const validatedEnv = parsedEnv.data;

export interface Config {
  urls: string[];
  scheduleInterval: number;
  mongodbUri: string;
  mongodbDb: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  emailRecipients: string[];
}

export const config: Config = {
  urls: validatedEnv.URLS,
  scheduleInterval: validatedEnv.SCHEDULE_INTERVAL,
  mongodbUri: validatedEnv.MONGODB_URI,
  mongodbDb: validatedEnv.MONGODB_DB,
  smtpHost: validatedEnv.SMTP_HOST,
  smtpPort: validatedEnv.SMTP_PORT,
  smtpUser: validatedEnv.SMTP_USER,
  smtpPass: validatedEnv.SMTP_PASS,
  emailRecipients: validatedEnv.EMAIL_RECIPIENTS,
};
