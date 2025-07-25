import Api from "./axios";

export const fetchDashboardStats = async () => {
  const { data } = await Api.get('/dashboard');
  return data;
};