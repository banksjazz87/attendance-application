import React from "react";
import Navbar from "../components/global/Navbar.tsx";
import Form from "../components/newAttendance/Form.tsx";


export default function NewAttendance() {
    return (
        <div>
            <Navbar />
            <h1>This Will be the  new attendance page. </h1>
            <Form />
        </div>
    );
}