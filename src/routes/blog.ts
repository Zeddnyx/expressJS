import { Router } from "express";
import { v4 as uuidv4 } from "uuid";

import { NOT_FOUND, OK, ERROR, PAGINATION } from "../../utils/response";
import authenticate from "../../utils/authenticate";

const router = Router();
const OBJ = {
  id: uuidv4(),
  title: "zedd",
  content:
    "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit",
  date: new Date().toLocaleDateString(),
};
const ARR = [OBJ];

router.get("/blog", (req, res) => {
  try {
    OK(res, PAGINATION(req, ARR));
  } catch (err) {
    ERROR(res, err?.message, 500);
  }
});

router.get("/blog/:id", (req, res) => {
  const { id } = req.params;
  const result = ARR.find((obj) => obj.id === id);
  try {
    result ? OK(res, result) : NOT_FOUND(res, `Blog`);
  } catch (err) {
    ERROR(res, err?.message, err?.code);
  }
});

router.post("/blog", authenticate, (req, res) => {
  const payload = {
    id: uuidv4(),
    ...req.body,
    date: new Date().toLocaleDateString(),
  };
  try {
    ARR.push(payload);
    OK(res, payload, "Succes add data");
  } catch (err) {
    ERROR(res);
  }
});

router.put("/blog/:id", authenticate, (req, res) => {
  const { id } = req.params;
  const result = ARR.find((obj) => obj.id === id);

  try {
    if (result) {
      result.title = req.body.title;
      result.content = req.body.content;
      OK(res, result, "Succes update data");
    } else {
      NOT_FOUND(res, `Blog`);
    }
  } catch (err) {
    console.log(err);
    ERROR(res);
  }
});

router.delete("/blog/:id", authenticate, (req, res) => {
  const { id } = req.params;
  const result = ARR.find((obj) => obj.id === id);
  if (result) {
    try {
      ARR.splice(ARR.indexOf(result), 1);
      OK(res, {}, "Succes delete data", 200);
    } catch (err) {
      ERROR(res, err?.message, err?.code);
    }
  } else {
    NOT_FOUND(res, `Blog`);
  }
});

export default router;
