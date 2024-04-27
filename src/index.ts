if (process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv");
  dotenv.config();
}

import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import passport from "passport";
import flash from "express-flash";
import session from "express-session";
import { exec } from "child_process";

import projects from "./routes/projects";
import blog from "./routes/blog";
import task from "./routes/task";
import auth from "./routes/auth";

const app = express();
app.use(
  cors({
    credentials: true,
  }),
);
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const PORT = 8080;

app.use((req, _, next) => {
  exec("clear", (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
    console.log(`req url: ${req.url}\nreq method: ${req.method}\n`);
  });
  next();
});

app.use("/api", projects);
app.use("/api", blog);
app.use("/api", task);
app.use("/api/auth", auth);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
