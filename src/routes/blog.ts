import { Router } from "express";

import { DELETE, NOT_FOUND, OK, ERROR } from "../../utils/response";

const router = Router();
const OBJ = {
  id: 1,
  title: "zedd",
  content:
    "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit",
};
const ARR = [OBJ];

router.get("/blog", (_, res) => {
  OK(res, ARR);
});

router.get("/blog/:id", (req, res) => {
  const { id } = req.params;
  const result = ARR.find((obj) => obj.id === Number(id));
  result ? OK(res, result) : NOT_FOUND(res);
});

router.post("/blog", (req, res) => {
  ARR.push(req.body);
  const CODE = 200;
  res.statusCode == CODE ? OK(res, req.body, "Succes add data") : ERROR(res);
});

router.put("/blog/:id", (req, res) => {
  const { id } = req.params;
  const result = ARR.find((obj) => obj.id === Number(id));
  result.title = req.body.title;
  result.content = req.body.content;
  result ? OK(res, result) : NOT_FOUND(res);
});

router.delete("/blog/:id", (req, res) => {
  const { id } = req.params;
  const result = ARR.find((obj) => obj.id === Number(id));
  if (result) {
    ARR.splice(ARR.indexOf(result), 1);
    res.send(DELETE);
  } else {
    NOT_FOUND(res);
  }
});

export default router;
