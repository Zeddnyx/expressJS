export const ERROR = (res: any, msg?: string, code?: number) =>
  res.status(code ? code : 500).send({
    message: msg ? msg : "Internal Server Error",
    success: false,
    status: code ? code : 500,
  });

export const NOT_FOUND = (res: any, msg?: string, code?: number) =>
  res.status(code ? code : 404).send({
    message: `${msg} not Found`,
    success: false,
    status: code ? code : 404,
  });

export const OK = (res: any, data: any, msg?: string, code?: number) =>
  res.status(code ? code : 200).send({
    message: msg ? msg : "Success retrieve data",
    success: true,
    data: data,
  });

export const PAGINATION = (req: any, items: any[], searchKey?: string) => {
  const { limit = 10, page = 1, search, category } = req.query as any;

  let filteredItems = items;
  if (search) {
    filteredItems = items.filter(
      (item: any) =>
        item[searchKey]?.toLowerCase()?.includes(search.toLowerCase()),
    );
  }

  if (category) {
    filteredItems = filteredItems.filter(
      (item: any) => item.category === category,
    );
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedResults = filteredItems.slice(startIndex, endIndex);

  const total_item = items.length;
  const total_page = Math.ceil(total_item / limit);

  return {
    items: paginatedResults,
    pagination: {
      limit: parseInt(limit),
      page: parseInt(page),
      total_item,
      total_page,
    },
  };
};
