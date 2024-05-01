import { Router } from "express";
import { v4 as uuidv4 } from "uuid";

import { PAGINATION, NOT_FOUND, OK, ERROR } from "../utils/response";
import validationColumn from "../utils/validationColumn";
import authenticate, { apiKey } from "../utils/middleware";
import { ITask } from "../types";

const router = Router();
const OBJ: ITask = {
  id: uuidv4(),
  task: "task",
  column: "backlog", // "backlog" | "todo" | "inProgress" | "completed";
  date: new Date().toLocaleDateString(),
};
const ARR: ITask[] = [OBJ];

router.get("/task", apiKey, (req, res) => {
  try {
    OK(res, PAGINATION(req, ARR, "task"));
  } catch (err) {
    ERROR(res, err?.message, 500);
  }
});

router.get("/task/:id", apiKey, (req, res) => {
  const { id } = req.params;
  const result = ARR.find((obj) => obj.id == id);
  try {
    result ? OK(res, result) : NOT_FOUND(res);
  } catch (err) {
    ERROR(res, err?.message, 500);
  }
});

router.post("/task", apiKey, authenticate, (req, res) => {
  const { column } = req.body;

  try {
    validationColumn(column, res);
    const payload = {
      id: uuidv4(),
      ...req.body,
      date: new Date().toLocaleDateString(),
    };
    ARR.push(payload);
    OK(res, payload, "Succes add data");
  } catch (err) {
    ERROR(res);
  }
});

router.put("/task/:id", apiKey, authenticate, (req, res) => {
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
      NOT_FOUND(res, `Task`);
    }
  } catch (err) {
    console.log(err);
    ERROR(res);
  }
});

router.delete("/task/:id", apiKey, authenticate, (req, res) => {
  const { id } = req.params;
  const result = ARR.find((obj) => obj.id == id);
  try {
    ARR.splice(ARR.indexOf(result), 1);
    result ? OK(res, {}, "Succes delete data", 200) : NOT_FOUND(res, `Task`);
  } catch (err) {
    ERROR(res, err?.message, err?.code);
  }
});

export default router;
