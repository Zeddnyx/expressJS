import { Router } from "express";
import { v4 as uuidv4 } from "uuid";

import { DELETE, NOT_FOUND, OK, ERROR } from "../../utils/response";
import authenticate from "../../utils/authenticate";

const router = Router();
const ARR = [
  {
    id: uuidv4(),
    title: "zedd",
    content:
      "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit",
    client: "zedd",
    url: "https://zedd.com",
    tags: ["zedd", "zedd", "zedd"],
    image: "https://zedd.com",
  },
];

router.get("/projects", (req, res) => {
  OK(res, ARR);
});

router.post("/projects", authenticate, (req, res) => {
  const payload = {
    id: uuidv4(),
    ...req.body,
    date: new Date().toLocaleDateString(),
  };
  try {
    ARR.push(payload);
    OK(res, payload, "Succes add data");
  } catch (err) {
    ERROR(res, err);
  }
});

router.get("/projects/:id", (req, res) => {
  const { id } = req.params;
  const result = ARR.find((obj) => obj.id === id);
  result ? OK(res, result) : NOT_FOUND(res);
});

router.delete("/projects/:id", authenticate, (req, res) => {
  const { id } = req.params;
  const result = ARR.find((obj) => obj.id === id);
  result ? res.send(DELETE) : NOT_FOUND(res);
});

router.put("/projects/:id", authenticate, (req, res) => {
  const { id } = req.params;
  const result = ARR.find((obj) => obj.id === id);

  try {
    if (result) {
      result.title = req.body.title;
      result.content = req.body.content;
      result.client = req.body.client;
      result.url = req.body.url;
      result.tags = req.body.tags;
      result.image = req.body.image;
      OK(res, result, "Succes update data");
    } else {
      NOT_FOUND(res, `Not found`);
    }
  } catch (err) {
    ERROR(res);
  }
});

export default router;
