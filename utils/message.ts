export const ERROR = (msg?: string,code?: number) => ({
  message: msg ? msg : "Internal Server Error",
  success: false,
  status: code ? code : 500,
})

export const NOT_FOUND = (msg?: string) => ({
  message: msg ? msg : "Not Found",
  success: false,
  status: 404,
});

export const BAD_REQUEST = (msg?: string) => ({
  message: msg ? msg : "Bad Request",
  success: false,
  status: 400,
});

export const DELETE = {
  message: "Success delete item",
  success: true,
  status: 200,
};

export const OK = (data: any,msg?: string) => ({
  message: msg ? msg : "Success retrieve data",
  success: true,
  data: data,
});
