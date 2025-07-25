import Api from "./axios";
import { toast } from "react-toastify";

export const fetchStudents = async (page, limit, search, classId, gender) => {
  const { data } = await Api.get("/students/query", {
    params: {
      page,
      limit,
      search,
      classId,
      gender
    },
  });
  return data;
};

export const fetchStudentById = async (id) => {
  const { data } = await Api.get(`/students/view/${id}`);
  return data;
};

export const addStudent = async (studentData) => {
  try {
    const { data } = await Api.post("/students/add", studentData);
    toast.success("Student added successfully!");
    return data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to add student");
    throw err;
  }
};

export const updateStudent = async ({ id, formData }) => {
  try {
    const { data } = await Api.put(`/students/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    toast.success("Student updated successfully!");
    return data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to update student");
    throw err;
  }
};


export const deleteStudent = async (id) => {
  try {
    const { data } = await Api.patch(`/students/delete/${id}`);
    toast.success("Student deleted successfully!");
    return data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to delete student");
    throw err;
  }
};

export const bulkUploadStudents = async (file) => {
  const fd = new FormData();
  fd.append("file", file);

  try {
    const { data } = await Api.post("/students/bulk-upload", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success(`${data.inserted} students imported successfully`);
    return data; 
  } catch (err) {
    const apiMsg =
      err.response?.data?.error ||
      err.response?.data?.message ||
      "Failed to import students";
    toast.error(apiMsg);
    throw err;
  }
};

