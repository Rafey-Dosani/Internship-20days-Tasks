import { HttpError } from "../utils/httpError.js";

function parsePagination(query) {
  if (
    Object.keys(query).some((key) => key !== "page" && key !== "limit")
  ) {
    throw new HttpError(400, "Only page and limit query parameters are allowed.");
  }

  const pageValue = query.page === undefined ? "1" : query.page;
  const limitValue = query.limit === undefined ? "10" : query.limit;
  if (typeof pageValue !== "string" || !/^[1-9]\d*$/.test(pageValue)) {
    throw new HttpError(400, "Page must be a positive integer.");
  }
  if (typeof limitValue !== "string" || !/^[1-9]\d*$/.test(limitValue)) {
    throw new HttpError(400, "Limit must be an integer between 1 and 100.");
  }

  const page = Number(pageValue);
  const limit = Number(limitValue);
  if (!Number.isSafeInteger(page)) {
    throw new HttpError(400, "Page must be a positive integer.");
  }
  if (!Number.isSafeInteger(limit) || limit > 100) {
    throw new HttpError(400, "Limit must be an integer between 1 and 100.");
  }
  if ((page - 1) * limit > Number.MAX_SAFE_INTEGER) {
    throw new HttpError(400, "Page is too large.");
  }

  return { page, limit, offset: (page - 1) * limit };
}

export function createUserController(authService) {
  return {
    async getUsers(req, res) {
      const pagination = parsePagination(req.query);
      const result = await authService.getUsers(pagination);
      return res.status(200).json({
        success: true,
        data: result.users,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          totalRecords: result.total,
          totalPages: Math.ceil(result.total / pagination.limit),
        },
      });
    },

    getUserDashboard(req, res) {
      return res.status(200).json({
        success: true,
        data: { message: "Welcome to your dashboard.", user: req.user },
      });
    },

    getAdminDashboard(req, res) {
      return res.status(200).json({
        success: true,
        data: { message: "Welcome to the admin dashboard.", user: req.user },
      });
    },
  };
}
