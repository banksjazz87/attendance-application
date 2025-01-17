import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./views/Login.tsx";
import Attendance from "./views/Attendance.tsx";
import Search from "./views/Search.tsx";
import NewAttendance from "./views/NewAttendance.tsx";
import Dashboard from "./views/Dashboard.tsx";
import People from "./views/People.tsx";
import Visitors from "./views/Visitors.tsx";

export default function AllRoutes(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Login />}
        />
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
        <Route
          path="/new-attendance"
          element={<NewAttendance />}
        />
        <Route
          path="/attendance"
          element={<Attendance />}
        />
        <Route
          path="/search-past-attendance"
          element={<Search />}
        />
        <Route
          path="/people"
          element={<People />}
        />
        <Route
          path="/visitors"
          element={<Visitors />}
        />
      </Routes>
    </BrowserRouter>
  );
}
