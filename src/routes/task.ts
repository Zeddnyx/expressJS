import { Router } from "express";

import { DELETE, NOT_FOUND, OK, ERROR } from "../../utils/response";

const router = Router();
const OBJ = {
  id: "1",
  task: "task",
  column: "backlog", // "backlog" | "todo" | "inProgress" | "completed";
  date: new Date().toLocaleDateString(),
};
const ARR = [OBJ];

router.get("/task", (req, res) => {
  res.send(OK(ARR));
});

router.get("/task/:id", (req, res) => {
  const { id } = req.params;
  const result = ARR.find((obj) => obj.id == id);
  result ? res.send(OK(result)) : res.send(NOT_FOUND());
});

router.post("/task", (req, res) => {
  ARR.push(req.body);
  const CODE = 200;
  res.statusCode == CODE
    ? res.send(OK(req.body, "Succes add data"))
    : res.send(ERROR());
});

router.put("/task/:id", (req, res) => {
  const { id } = req.params;
  const result = ARR.find((obj) => obj.id == id);
  if (result) {
    result.column = req.body.column;
    res.send(OK(result));
  } else {
    res.send(NOT_FOUND());
  }
});

router.delete("/task/:id", (req, res) => {
  const { id } = req.params;
  const result = ARR.find((obj) => obj.id == id);
  if (result) {
    ARR.splice(ARR.indexOf(result), 1);
    res.send(DELETE);
  } else {
    res.send(NOT_FOUND());
  }
})

export default router;
