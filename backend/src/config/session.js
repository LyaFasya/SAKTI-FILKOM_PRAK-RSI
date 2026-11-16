import "dotenv/config";
import session from "express-session";

const secret = process.env.SESSION_SECRET;

if (!secret || secret.length < 32) {
  throw new Error("Isi SESSION_SECRET di .env dengan minimal 32 karakter.");
}

export const namaCookieSession = "sakti.sid";

export default session({
  name: namaCookieSession,
  secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 2 * 60 * 60 * 1000,
  },
});