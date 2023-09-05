import React from "react";
import Navbar from "../components/global/Navbar.tsx";
import GroupDropDown from "../components/global/GroupDropDown.tsx";

export default function Dashboard() {
  return (
    <div>
      <Navbar />
      <div className="header_wrapper">
        <h1>Dashboard</h1>
      </div>
      <GroupDropDown />
    </div>
  );
}
