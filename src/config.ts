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
  MONGODB_URI: z.string().nonempty({ message: "MONGODB_URI is required" }),
  MONGODB_DB: z.string().nonempty({ message: "MONGODB_DB is required" }),
  SENDGRID_API_KEY: z
    .string()
    .nonempty({ message: "SENDGRID_API_KEY is required" }),
  SEND_GRID_SENDER: z
    .string()
    .email({ message: "SEND_GRID_SENDER must be a valid email address" }),
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
  TWILIO_ACCOUNT_SID: z
    .string()
    .nonempty({ message: "TWILIO_ACCOUNT_SID is required" }),
  TWILIO_AUTH_TOKEN: z
    .string()
    .nonempty({ message: "TWILIO_AUTH_TOKEN is required" }),
  TWILIO_FROM: z
    .string()
    .nonempty({ message: "TWILIO_FROM is required" })
    .regex(/^\+\d{10,15}$/, {
      message: "TWILIO_FROM must be in valid E.164 format (e.g. +1234567890)",
    }),
  TWILIO_TO: z
    .string()
    .nonempty({ message: "TWILIO_TO is required" })
    .transform((toStr) =>
      toStr
        .split(",")
        .map((phone) => phone.trim())
        .filter((phone) => phone !== "")
    )
    .refine((phones) => phones.every((phone) => /^\+\d{10,15}$/.test(phone)), {
      message:
        "Each TWILIO_TO number must be in valid E.164 format (e.g. +1234567890)",
    }),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:");
  console.error(parsedEnv.error.format());
  process.exit(1);
}

const env = parsedEnv.data;

export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  from: string;
  to: string[];
}

export interface Config {
  urls: string[];
  scheduleInterval: number;
  mongodbUri: string;
  mongodbDb: string;
  sendgridApiKey: string;
  sendgridSender: string;
  emailRecipients: string[];
  twilio: TwilioConfig;
}

export const config: Config = {
  urls: env.URLS,
  scheduleInterval: 60000,
  mongodbUri: env.MONGODB_URI,
  mongodbDb: env.MONGODB_DB,
  sendgridApiKey: env.SENDGRID_API_KEY,
  sendgridSender: env.SEND_GRID_SENDER,
  emailRecipients: env.EMAIL_RECIPIENTS,
  twilio: {
    accountSid: env.TWILIO_ACCOUNT_SID,
    authToken: env.TWILIO_AUTH_TOKEN,
    from: env.TWILIO_FROM,
    to: env.TWILIO_TO,
  },
};
