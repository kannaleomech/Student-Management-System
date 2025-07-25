import Api from "./axios";

export const fetchRoles = async () => {
  const { data } = await Api.get('/list/roles');
  return data;
};

export const fetchClasses = async () => {
  const { data } = await Api.get('/list/classes');
  return data;
};
