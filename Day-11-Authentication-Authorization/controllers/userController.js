export function createUserController(authService) {
  return {
    async getUsers(_req, res) {
      const users = await authService.getUsers();
      return res.status(200).json({ success: true, data: users });
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
