import { Routes, Route } from "react-router-dom";
import ListStudents from "./ListStudents";
import AddStudent from "./AddStudent";
import EditStudent from "./EditStudent";
import ViewStudent from "./ViewStudent";

export default function StudentsRoutes() {
  return (
    <Routes>
      <Route index path="/" element={<ListStudents />} />
      <Route path="add" element={<AddStudent />} />
      <Route path="/edit/:id" element={<EditStudent />} />
      <Route path="/view/:id" element={<ViewStudent />} />
    </Routes>
  );
}
