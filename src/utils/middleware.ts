import jwt from "jsonwebtoken";

import { config } from "../../config";
import { ERROR } from "./response";

export default function authenticate(req: any, res: any, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return ERROR(res, "Unauthorized", 401);
  jwt.verify(token, config.KEY, (err: any, user: any) => {
    if (err) return ERROR(res, err.message, 403);
    req.user = user;
    next();
  });
}

export const generateToken = (user: any, exp?: string) => {
  return jwt.sign({ ...user }, config.KEY, { expiresIn: exp ? exp : "1d" });
};

export function apiKey(req: any, res: any, next: any) {
  const apiKey = req.headers["api-key"];

  if (!apiKey) {
    return ERROR(res, "API key is required", 401);
  }

  next();
}
