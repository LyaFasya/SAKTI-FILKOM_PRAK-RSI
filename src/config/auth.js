import "dotenv/config";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error(
    "JWT_SECRET harus diisi dengan nilai acak minimal 32 karakter."
  );
}

export { jwtSecret };