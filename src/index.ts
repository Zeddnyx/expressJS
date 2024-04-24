import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";

import { DELETE, NOT_FOUND, OK } from "./utils/message";

const app = express();
app.use(
  cors({
    credentials: true,
  }),
);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);
const PORT = 8080;
const OBJ = {
  id: 1,
  title: "zedd",
  content:
    "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit",
};
const ARR = [OBJ];

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.get("/blog", (req, res) => {
  res.send(OK(ARR));
});

app.get("/blog/:id", (req, res) => {
  const { id } = req.params;
  const result = ARR.find((obj) => obj.id === Number(id));
  result ? res.send(OK(result)) : res.send(NOT_FOUND);
});

app.post("/blog", (req, res) => {
  ARR.push(req.body);
  res.send(OK(req.body));
});

app.put("/blog/:id", (req, res) => {
  const { id } = req.params;
  const result = ARR.find((obj) => obj.id === Number(id));
  result.title = req.body.title;
  result.content = req.body.content;
  result ? res.send(OK(result)) : res.send(NOT_FOUND);
});

app.delete("/blog/:id", (req, res) => {
  const { id } = req.params;
  const result = ARR.find((obj) => obj.id === Number(id));
  if (result) {
    ARR.splice(ARR.indexOf(result), 1);
    res.send(DELETE);
  } else {
    res.send(NOT_FOUND);
  }
});
