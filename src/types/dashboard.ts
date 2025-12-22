export type DashboardStats = {
  total_applications: number;
  active_applications: number;
  inactive_applications: number;
  total_application_letters: number;
  total_cvs: number;
  total_portfolios: number;
};

export type DashboardStatsResponse = {
  data: DashboardStats;
};
