import { Routes, Route } from "react-router-dom";
import ListLogs from "./ListLogs";


export default function AuditLogsRoutes() {
  return (
    <Routes>
      <Route index path="/" element={<ListLogs />} />
    </Routes>
  );
}
