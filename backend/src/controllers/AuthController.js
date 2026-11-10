import { namaCookieSession } from "../config/session.js";

export function melihatSession(req, res) {
  return res.status(200).json({
    message: "Session aktif.",
    data: req.akun,
  });
}

export function logout(req, res, next) {
  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }

    res.clearCookie(namaCookieSession, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "Logout berhasil.",
    });
  });
}