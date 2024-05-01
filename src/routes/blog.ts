import { Router } from "express";
import { v4 as uuidv4 } from "uuid";

import { IComment, IBlog } from "../types";
import { NOT_FOUND, OK, ERROR, PAGINATION } from "../utils/response";
import authenticate, { apiKey } from "../utils/middleware";
import hideEmails from "../utils/hideEmails";

const router = Router();
const OBJ: IBlog = {
  id: uuidv4(),
  title: "zedd",
  content:
    "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit",
  date: new Date().toLocaleDateString(),
  category: "react",
};
const ARR: IBlog[] = [OBJ];
let comments: IComment[] = [];

router.get("/blog", apiKey, (req, res) => {
  try {
    OK(res, PAGINATION(req, ARR, "title"));
  } catch (err) {
    ERROR(res, err?.message, 500);
  }
});

router.get("/blog/:id", apiKey, (req, res) => {
  const { id } = req.params;
  const result = ARR.find((obj) => obj.id === id);
  try {
    result ? OK(res, result) : NOT_FOUND(res, `Blog`);
  } catch (err) {
    ERROR(res, err?.message, err?.code);
  }
});

router.post("/blog", apiKey, authenticate, (req, res) => {
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

router.put("/blog/:id", apiKey, authenticate, (req, res) => {
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

router.delete("/blog/:id", apiKey, authenticate, (req, res) => {
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

// New comment
router.post("/blog/comment/:id", apiKey, (req, res) => {
  const { id } = req.params;
  const { content, email, name } = req.body;

  const commentId = uuidv4();

  const newComment: IComment = {
    id: commentId,
    articleId: id,
    content,
    email,
    name,
    date: new Date().toLocaleDateString(),
  };

  comments.push(newComment);

  try {
    OK(res, newComment, "Comment added successfully");
  } catch (err) {
    ERROR(res, err?.message, err?.code);
  }
});

router.get("/blog/comment/:id", apiKey, (req, res) => {
  const { id } = req.params;

  // Filter comments based on the article ID
  const articleComments = comments.filter(
    (comment) => comment.articleId === id,
  );

  articleComments.forEach((comment) => hideEmails(comment));

  try {
    OK(res, articleComments, "Comments retrieved successfully");
  } catch (err) {
    ERROR(res, err?.message, err?.code);
  }
});

// Replying to a comment
router.post("/blog/reply-comment/:id", apiKey, (req, res) => {
  const { id } = req.params;
  const { content, name, email } = req.body;

  const replyId = uuidv4();

  const newReply: IComment = {
    parentId: id,
    id: replyId,
    content,
    email,
    name,
    date: new Date().toLocaleDateString(),
  };

  const addReply = (commentsArray: IComment[]) => {
    for (let comment of commentsArray) {
      if (comment.id === id) {
        if (!comment.replies) {
          comment.replies = [];
        }
        comment.replies.push(newReply);
        return true;
      }
      if (comment.replies && addReply(comment.replies)) {
        return true;
      }
    }
    return false;
  };

  if (addReply(comments)) {
    try {
      OK(res, newReply, "Replied comment successfully");
    } catch (err) {
      ERROR(res, err?.message, err?.code);
    }
  } else {
    NOT_FOUND(res, "Parent comment not found");
  }
});

export default router;
