import React from "react";
import Navbar from "../components/global/Navbar.tsx";
import GroupDropDown from "../components/global/GroupDropDown.tsx";


export default function Search() {
    return (
        <div>
            <Navbar />
            <h1>This Will be the search page. </h1>
            <GroupDropDown />
        </div>
    );
}