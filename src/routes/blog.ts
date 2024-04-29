import { Router } from "express";
import { v4 as uuidv4 } from "uuid";

import { DELETE, NOT_FOUND, OK, ERROR } from "../../utils/response";
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

router.get("/blog", (_, res) => {
  OK(res, ARR);
});

router.get("/blog/:id", (req, res) => {
  const { id } = req.params;
  const result = ARR.find((obj) => obj.id === id);
  result ? OK(res, result) : NOT_FOUND(res);
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
      NOT_FOUND(res, `Not found`);
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
    ARR.splice(ARR.indexOf(result), 1);
    res.send(DELETE);
  } else {
    NOT_FOUND(res);
  }
});

export default router;
