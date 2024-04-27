import { Router } from "express";
import bcrypt from "bcrypt";
import passport from "passport";

import { DELETE, NOT_FOUND, OK, ERROR } from "../../utils/response";
import passportConfig from "../../utils/passport-config";

const router = Router();
passportConfig(
  passport,
  (email: any) => users.find((user: any) => user.email === email),
  (id: any) => users.find((user: any) => user.id === id),
);
const users: any = [];

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {

  },
);

router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    res.redirect("/login");
  } finally {
    res.redirect("/register");
  }
});

export default router;
