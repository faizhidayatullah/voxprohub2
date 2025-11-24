import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ message: "Token tidak ada" });

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ message: "Token tidak valid" });
    req.user = user;
    next();
  });
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Akses ditolak" });
  next();
};
