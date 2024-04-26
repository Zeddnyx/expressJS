import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import projects from "./routes/projects"
import blog  from "./routes/blog"

const app = express();
app.use(
  cors({
    credentials: true,
  }),
);
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const server = http.createServer(app);
const PORT = 8080;

app.use((req, _, next) => {
  console.log("---------------------");
  console.log(`req url: ${req.url}\nreq method: ${req.method}\n`);
  next();
});

app.use("/api", projects);
app.use("/api", blog);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
