export const NOT_FOUND = {
  message: "not found",
  success: false,
  status: 404,
};

export const BAD_REQUEST = {
  message: "bad request",
  success: false,
  status: 400,
}

export const DELETE = {
  message: "success delete data",
  success: true,
  status: 200,
}

export const OK = (data:any) => ({
  message: "success retrieve data",
  success: true,
  data: data,
})
