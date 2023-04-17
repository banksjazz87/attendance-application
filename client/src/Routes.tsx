import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./views/Login.tsx";
import Attendance from "./views/Attendance.tsx";
import Search from "./views/Search.tsx";
import NewAttendance from "./views/NewAttendance.tsx";
import Dashboard from "./views/Dashboard.tsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />
    }, 
    {
        path: "/dashboard",
        element: <Dashboard />
    }, 
     {
        path: '/new-attendance',
        element: <NewAttendance />
     }, 
     {
        path: "/attendance",
        element: <Attendance />
    }, 
     {
        path: '/search',
        element: <Search />
     }, 

]);

export default function Routes() {
    return (
        <RouterProvider router={router} />
    );
}

