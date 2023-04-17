import React from 'react';
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav>
            <ul>
                <li>
                    <Link to={`/`}>Login</Link>
                </li>
                <li>
                    <Link to={`/dashboard`}>Dashboard</Link>
                </li>
                <li>
                    <Link to={`/new-attendance`}>New Attendance</Link>
                </li>
                <li>
                    <Link to={`/attendance`}>Attendance</Link>
                </li>
                <li>
                    <Link to={`/search`}>Search</Link>
                </li>
            </ul>
        </nav>
    );
}