import { Router } from "express";

import { DELETE, NOT_FOUND, OK,ERROR } from "../../utils/response";

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
  res.send(OK(ARR));
});

router.post("/projects", (req, res) => {
  ARR.push(req.body);
  const CODE = 200
  res.statusCode == CODE ?res.send(OK(req.body,"Succes add data")) : res.send(ERROR());
});

router.get("/projects/:id", (req, res) => {
  const { id } = req.params;
  const result = ARR.find((obj) => obj.id === Number(id));
  result ? res.send(OK(result)) : res.send(NOT_FOUND());
});

router.delete("/projects/:id", (req, res) => {
  const { id } = req.params;
  const result = ARR.find((obj) => obj.id === Number(id));
  result ? res.send(DELETE) : res.send(NOT_FOUND());
});

router.put("/projects/:id", (req, res) => {
  const { id } = req.params;
  const result = ARR.find((obj) => obj.id === Number(id));
  result.title = req.body.title;
  result.content = req.body.content;
  result ? res.send(OK(result)) : res.send(NOT_FOUND());
});


export default router;
