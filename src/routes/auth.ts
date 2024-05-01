import { Router } from "express";
import bcrypt from "bcrypt";
import passport from "passport";
import jwt from "jsonwebtoken";
import { v4 as id } from "uuid";

import { NOT_FOUND, OK, ERROR } from "../utils/response";
import { config } from "../../config";
import { apiKey, generateToken } from "../utils/middleware";
import passportConfig from "../../passport-config";

const router = Router();
passportConfig(
  passport,
  (email: any) => USERS.find((user: any) => user.email === email),
  (id: any) => USERS.find((user: any) => user.id === id),
);
let USERS: any = [];
let REFRESH_TOKEN: any = [];

router.post("/login", apiKey, async (req, res) => {
  const { email, rememberMe } = req.body;
  const user = USERS.find((user: any) => user.email === email);
  if (!user) return NOT_FOUND(res, "User");

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const token = generateToken(req.body, rememberMe ? "7d" : "1d");
      const refreshToken = jwt.sign(user, config.REFRESH_KEY);

      const USER_LOGIN = {
        id: user.id,
        name: user.name,
        email: user.email,
        token,
        refreshToken,
      };
      OK(res, USER_LOGIN);
    } else {
      NOT_FOUND(res, "Wrong Email or Password");
    }
  } catch (err) {
    ERROR(res, err);
  }
});

router.post("/register", apiKey, async (req, res) => {
  try {
    const { name, email } = req.body;
    const passwordEncrypted = await bcrypt.hash(req.body.password, 10);
    const token = generateToken(req.body);
    const refreshToken = jwt.sign(req.body, config.REFRESH_KEY);
    REFRESH_TOKEN.push(refreshToken);

    const newUser = {
      id,
      name,
      email,
      password: passwordEncrypted,
      token,
      refreshToken,
    };
    const { password, ...otherDetails } = newUser;
    USERS.push(newUser);
    OK(res, otherDetails);
  } catch (err) {
    ERROR(res, err?.message, 400);
  }
});

router.post("/forgot-password", apiKey, (req, res) => {
  const { email } = req.body;
  const user = USERS.find((user: any) => user.email === email);
  if (!user) {
    return NOT_FOUND(res, "Email");
  }

  const token = jwt.sign({ email: user.email }, config.KEY, {
    expiresIn: "5m",
  });

  try {
    OK(res, { token }, "Check your email");
  } catch (err) {
    ERROR(res, err?.message, err?.code);
  }
});

router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  !password && NOT_FOUND(res, "Password");

  try {
    const decodedToken = jwt.verify(token, config.KEY);
    const user = USERS.find((user: any) => user.email === req.body.email);

    const passwordEncrypted = await bcrypt.hash(password, 10);
    user.password = passwordEncrypted;
    OK(res, {}, "Password reset success");
  } catch (err) {
    ERROR(res, err?.message, err?.code);
  }
});

router.post("/refresh", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return NOT_FOUND(res, "Refresh token", 401);
  if (!REFRESH_TOKEN.includes(refreshToken))
    return ERROR(res, "Refresh token not valid", 403);
  jwt.verify(refreshToken, config.REFRESH_KEY, (err: any, user: any) => {
    if (err) return ERROR(res, err?.message, 403);
    const token = generateToken({ email: user.email });
    OK(res, { token });
  });
});

router.delete("/logout", (req, res) => {
  const { token } = req.body;
  REFRESH_TOKEN = REFRESH_TOKEN.filter(
    (tokenOriginal: string) => tokenOriginal !== token,
  );
  OK(res, {}, "Logout success");
});

export default router;
