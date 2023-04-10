import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./views/Home.tsx";
import Login from "./views/Login.tsx";
import Attendance from "./views/Attendance.tsx";
import Search from "./views/Search.tsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    }, 
     {
        path: '/login',
        element: <Login />
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

