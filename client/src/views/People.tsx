import React, {useState, useEffect} from "react";
import Navbar from "../components/global/Navbar.tsx";
import NewMember from "../components/people/NewMember.tsx";
import AllPeople from "../components/people/AllPeople.tsx";

export default function People() {
    return (
        <div id="people_page_wrapper">
            <Navbar />
            <h1>This is where the user will be able to create, read, update and delete People</h1>
            <NewMember />
            <AllPeople />
        </div>
    );
}