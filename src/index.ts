import cors from "cors";
import http from "http";
import express from "express";
import passport from "passport";
import flash from "express-flash";
import compression from "compression";
import session from "express-session";
import cookieParser from "cookie-parser";
import { exec } from "child_process";

import blog from "./routes/blog";
import task from "./routes/task";
import auth from "./routes/auth";
import projects from "./routes/projects";
import { config } from "../config/";

if (config.NODE_ENV !== "production") {
  const dotenv = require("dotenv");
  dotenv.config();
}

const app = express();
app.use(
  cors({
    credentials: true,
  }),
);
app.use(flash());
app.use(
  session({
    secret: config.KEY,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(passport.session());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const PORT = 8080;

app.use((req, _, next) => {
  exec("clear", (err, stdout) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
    console.log(`req url: ${req.url}\nreq method: ${req.method}\n`);
  });
  next();
});

app.use("/api", blog);
app.use("/api", task);
app.use("/api", projects);
app.use("/api/auth", auth);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
