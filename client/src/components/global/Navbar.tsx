import React from "react";
import { Link } from "react-router-dom";
import "../../assets/styles/components/navbar.scss";

export default function Navbar() {
  return (
    <nav id="main_nav_wrapper">
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
        <li>
          <Link to={`/people`}>People</Link>
        </li>
      </ul>
    </nav>
  );
}
