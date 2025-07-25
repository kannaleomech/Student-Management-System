import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchStudents, fetchStudentById, addStudent, updateStudent, deleteStudent, bulkUploadStudents } from '../api/student';

// Fetch students list
export const useStudents = ({ page, limit, search, classId, gender }) =>
  useQuery({
    queryKey: ['students', { page, limit, search, classId, gender }],
    queryFn: () => fetchStudents(page, limit, search, classId, gender),
    keepPreviousData: true,
  });


// Fetch single student
export const useStudent = (id) => useQuery({
  queryKey: ['student', id],
  queryFn: () => fetchStudentById(id),
  enabled: !!id,
});

// Add student
export const useAddStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addStudent,
    onSuccess: () => {
      queryClient.invalidateQueries(['students']);
    },
  });
};

// Update student
export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateStudent,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(["students"]);
      queryClient.invalidateQueries(["student", id]);
    },
  });
};
;

// Delete student
export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries(['students']);
    },
  });
};

// Bulk upload students
export const useBulkUploadStudents = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkUploadStudents,
    onSuccess: () => {
      // refresh students list
      queryClient.invalidateQueries(["students"]);
    },
  });
};
