export const ERROR = (res: any, msg?: string, code?: number) =>
  res.status(code ? code : 500).send({
    message: msg ? msg : "Internal Server Error",
    success: false,
    status: code ? code : 500,
  });

export const NOT_FOUND = (res: any, msg?: string, code?: number) =>
  res.status(code ? code : 404).send({
    message: `${msg}  not Found`,
    success: false,
    status: code ? code : 404,
  });

export const DELETE = {
  message: "Success delete item",
  success: true,
  status: 200,
};

export const OK = (res: any, data: any, msg?: string) =>
  res.status(200).send({
    message: msg ? msg : "Success retrieve data",
    success: true,
    data: data,
  });
