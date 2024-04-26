import { Router } from "express";

import { DELETE, NOT_FOUND, OK,ERROR } from "../../utils/response";

const router = Router();
const OBJ = {
  id: 1,
  title: "zedd",
  content:
    "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit",
};
const ARR = [OBJ];

router.get("/blog", (_, res) => {
  res.send(OK(ARR));
});

router.get("/blog/:id", (req, res) => {
  const { id } = req.params;
  const result = ARR.find((obj) => obj.id === Number(id));
  result ? res.send(OK(result)) : res.send(NOT_FOUND());
});

router.post("/blog", (req, res) => {
  ARR.push(req.body);
  const CODE = 200
  res.statusCode == CODE ?res.send(OK(req.body,"Succes add data")) : res.send(ERROR());
});

router.put("/blog/:id", (req, res) => {
  const { id } = req.params;
  const result = ARR.find((obj) => obj.id === Number(id));
  result.title = req.body.title;
  result.content = req.body.content;
  result ? res.send(OK(result)) : res.send(NOT_FOUND());
});

router.delete("/blog/:id", (req, res) => {
  const { id } = req.params;
  const result = ARR.find((obj) => obj.id === Number(id));
  if (result) {
    ARR.splice(ARR.indexOf(result), 1);
    res.send(DELETE);
  } else {
    res.send(NOT_FOUND());
  }
});

export default router;
