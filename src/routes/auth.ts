import { Router } from "express";
import bcrypt from "bcrypt";
import passport from "passport";
import jwt from "jsonwebtoken";
import { v4 as id } from "uuid";

import { NOT_FOUND, OK, ERROR } from "../../utils/response";
import { config } from "../../config";
import { generateToken } from "../../utils/authenticate";
import passportConfig from "../../passport-config";

const router = Router();
passportConfig(
  passport,
  (email: any) => USERS.find((user: any) => user.email === email),
  (id: any) => USERS.find((user: any) => user.id === id),
);
let USERS: any = [];
let REFRESH_TOKEN: any = [];

router.post("/login", async (req, res) => {
  const user = USERS.find((user: any) => user.email === req.body.email);
  if (!user) return NOT_FOUND(res, "User");

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const token = generateToken(req.body);
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

router.post("/register", async (req, res) => {
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

router.post("/refresh", (req, res) => { // ERROR issue from this route 
  const refreshToken = req.body.token;
  if (refreshToken == null)
    return NOT_FOUND(res, "Refresh token", 401);
  if (!REFRESH_TOKEN.includes(refreshToken))
    return ERROR(res, "Refresh token not valid", 403);
  jwt.verify(refreshToken, config.REFRESH_KEY, (err: any, user: any) => {
    if (err) return ERROR(res, err?.message, 403);
    const token = generateToken({email: user.email});
    OK(res, { token });
  });
});

router.delete("/logout", (req, res) => {
  const { refreshToken } = req.body;
  REFRESH_TOKEN = REFRESH_TOKEN.filter(
    (token: string) => token !== refreshToken,
  );
  OK(res, {}, "Logout success");
});

export default router;
