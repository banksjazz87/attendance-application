import React from "react";
import Navbar from "../components/global/Navbar.tsx";
import GroupDropDown from "../components/global/GroupDropDown.tsx";


export default function Attendance() {
    return (
        <div>
            <Navbar />
            <h1>This Will be the attendance page. </h1>
            <GroupDropDown />
        </div>
    );
}