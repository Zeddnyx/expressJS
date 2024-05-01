import { ERROR } from "./response";

export default function validationBlog(payload: any, res: any) {
  const validations = [
    { field: "title", message: "title is required" },
    { field: "content", message: "content is required" },
    { field: "category", message: "category is required" },
  ];

  for (const validation of validations) {
    if (!payload[validation.field]) {
      ERROR(res, validation.message, 400);
      throw new Error(validation.message);
    }
  }

  if (!payload.slug) {
    payload.slug = payload.title.replace(/\s+/g, "-").toLowerCase();
  }
}
