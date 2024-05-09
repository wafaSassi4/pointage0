import { config } from "dotenv";
import jsonwebtoken from "jsonwebtoken";

config();

// Middleware d'authentification
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Token non fourni" });
  }

  jsonwebtoken.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token invalide" });
    }
    req.user = decoded;
    next();
  });
};

export { authenticateUser };