import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const envFileName = process.env.NODE_ENV === "production" ? ".env" : ".env.development";

dotenv.config({
  path: path.resolve(currentDir, "../../", envFileName),
});

function parseBoolean(value, defaultValue = false) {
  if (value === undefined) {
    return defaultValue;
  }

  return String(value).trim().toLowerCase() === "true";
}

function parseCommaSeparatedList(value, fallback = []) {
  if (!value) {
    return fallback;
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 3000,
  APP_URL: process.env.APP_URL || "http://localhost:3000",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
  CORS_ALLOWED_ORIGINS: parseCommaSeparatedList(process.env.CORS_ALLOWED_ORIGINS),
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
  TRUST_PROXY: parseBoolean(process.env.TRUST_PROXY, true),
  DB_HOST: process.env.DB_HOST,
  DB_PORT: Number(process.env.DB_PORT) || 5432,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DATABASE_URL: process.env.DATABASE_URL,
  DB_SSL: parseBoolean(process.env.DB_SSL, process.env.NODE_ENV === "production"),
  DB_SSL_REJECT_UNAUTHORIZED: parseBoolean(process.env.DB_SSL_REJECT_UNAUTHORIZED, false),
  SECRET_KEY: process.env.SECRET_KEY,
  JWT_SECRET: process.env.JWT_SECRET || process.env.SECRET_KEY,
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: Number(process.env.EMAIL_PORT) || 0,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  CONTACT_RECEIVER: process.env.CONTACT_RECEIVER,
  ALLOW_DB_TEST_ROUTE: parseBoolean(process.env.ALLOW_DB_TEST_ROUTE, false),
  ALLOW_SEQUELIZE_SYNC: parseBoolean(process.env.ALLOW_SEQUELIZE_SYNC, false),
};
