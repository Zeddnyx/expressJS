import { ERROR } from "./response";

export default function validationColumn(column: string, res: any) {
  const columnOpt = ["backlog", "todo", "inProgress", "completed"];
  if (!column || !columnOpt.includes(column)) {
    ERROR(res, "Invalid column value", 400);
    throw new Error("Invalid column value");
  }
}
