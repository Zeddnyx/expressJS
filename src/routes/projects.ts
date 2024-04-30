import { Router } from "express";
import { v4 as uuidv4 } from "uuid";

import { NOT_FOUND, OK, ERROR, PAGINATION } from "../../utils/response";
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
  try {
    OK(res, PAGINATION(req, ARR));
  } catch (err) {
    ERROR(res, err?.message, 500);
  }
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
  if (result) {
    try {
      OK(res, result);
    } catch (err) {
      ERROR(res, err?.message, err?.code);
    }
  } else {
    NOT_FOUND(res, `Project`);
  }
});

router.delete("/projects/:id", authenticate, (req, res) => {
  const { id } = req.params;
  const result = ARR.find((obj) => obj.id === id);
  if (result) {
    try {
      OK(res, result, "Succes delete data", 200);
    } catch (err) {
      ERROR(res, err?.message, 500);
    }
  } else {
    NOT_FOUND(res, `Project`);
  }
});

router.put("/projects/:id", authenticate, (req, res) => {
  const { id } = req.params;
  const result = ARR.find((obj) => obj.id === id);
  if (result) {
    result.title = req.body.title;
    result.content = req.body.content;
    result.client = req.body.client;
    result.url = req.body.url;
    result.tags = req.body.tags;
    result.image = req.body.image;
    try {
      OK(res, result, "Succes update data");
    } catch (err) {
      ERROR(res);
    }
  } else {
    NOT_FOUND(res, `Project`);
  }
});

export default router;
