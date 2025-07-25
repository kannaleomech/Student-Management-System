import Api from "./axios";

export const fetchAudidLogs = async (page, limit, ) => {
  const { data } = await Api.get("/audit-logs/query", {
    params: {
      page,
      limit
    },
  });
  return data;
};