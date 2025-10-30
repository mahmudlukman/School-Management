import dotenv from "dotenv";
import type ms from "ms";
dotenv.config();

const config = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV,
  WHITELIST_ORIGINS: ["https://ngecp-v1.netlify.app", "http://localhost:5173"],
  FRONTEND_URL: process.env.FRONTEND_URL!,
  DB_URL: process.env.DB_URL!,
  ACTIVATION_SECRET: process.env.ACTIVATION_SECRET!,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY!,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET!,
  JWT_EXPIRES: process.env.JWT_EXPIRES as ms.StringValue,
  REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES as ms.StringValue,
  defaultResLimit: 20,
  defaultResOffset: 0,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,
  RESEND_API_KEY: process.env.RESEND_API_KEY!,
  PAYSTACK_PUBLIC_KEY: process.env.PAYSTACK_PUBLIC_KEY!,
  PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY!,
};

export default config;
