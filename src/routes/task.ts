import { Router } from "express";

import { DELETE, NOT_FOUND, OK, ERROR } from "../../utils/response";
import validationColumn from "../../utils/validationColumn";

const router = Router();
const OBJ = {
  id: Date.now().toString(),
  task: "task",
  column: "backlog", // "backlog" | "todo" | "inProgress" | "completed";
  date: new Date().toLocaleDateString(),
};
const ARR = [OBJ];

router.get("/task", (req, res) => {
  OK(res, ARR);
});

router.get("/task/:id", (req, res) => {
  const { id } = req.params;
  const result = ARR.find((obj) => obj.id == id);
  result ? OK(res, result) : NOT_FOUND(res);
});

router.post("/task", (req, res) => {
  const { column } = req.body;

  try {
    validationColumn(column, res);
    const payload = {
      id: new Date().getTime().toString(),
      ...req.body,
      date: new Date().toLocaleDateString(),
    };
    ARR.push(payload);
    OK(res, payload, "Succes add data");
  } catch (err) {
    ERROR(res);
  }
});

router.put("/task/:id", (req, res) => {
  const { id } = req.params;
  const { column } = req.body;

  try {
    const result = ARR.find((obj) => obj.id == id);
    if (result) {
      validationColumn(column, res);
      result.column = req.body.column;
      result.task = req.body.task;
      OK(res, result, "Succes update data");
    } else {
      NOT_FOUND(res, `Task with id ${id} not found`);
    }
  } catch (err) {
    console.log(err);
    ERROR(res);
  }
});

router.delete("/task/:id", (req, res) => {
  const { id } = req.params;
  const result = ARR.find((obj) => obj.id == id);
  if (result) {
    ARR.splice(ARR.indexOf(result), 1);
    res.send(DELETE);
  } else {
    NOT_FOUND(res);
  }
});

export default router;
