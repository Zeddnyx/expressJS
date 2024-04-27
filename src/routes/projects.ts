import { Router } from "express";

import { DELETE, NOT_FOUND, OK, ERROR } from "../../utils/response";

const router = Router();
const ARR = [
  {
    id: 1,
    title: "zedd",
    content:
      "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit",
  },
];

router.get("/projects", (req, res) => {
  OK(res, ARR);
});

router.post("/projects", (req, res) => {
  ARR.push(req.body);
  const CODE = 200;
  res.statusCode == CODE ? OK(res, req.body, "Succes add data") : ERROR(res);
});

router.get("/projects/:id", (req, res) => {
  const { id } = req.params;
  const result = ARR.find((obj) => obj.id === Number(id));
  result ? OK(res, result) : NOT_FOUND(res);
});

router.delete("/projects/:id", (req, res) => {
  const { id } = req.params;
  const result = ARR.find((obj) => obj.id === Number(id));
  result ? res.send(DELETE) : NOT_FOUND(res)
});

router.put("/projects/:id", (req, res) => {
  const { id } = req.params;
  const result = ARR.find((obj) => obj.id === Number(id));
  result.title = req.body.title;
  result.content = req.body.content;
  result ? OK(res, result) : NOT_FOUND(res)
});

export default router;
