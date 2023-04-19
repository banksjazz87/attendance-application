import React, {useState} from "react";
import Navbar from "../components/global/Navbar.tsx";
import GroupDropDown from "../components/global/GroupDropDown.tsx";
import AttendanceSheet from "../components/attendance/AttendanceSheet.tsx"
import {Str, Bool} from "../../src/types/types.ts";


export default function Attendance() {
    const [displayDropDown, setdisplayDropDown] = useState<Bool>(true);
    const [displayAttendance, setDisplayAttendance] = useState<Bool>(false);
    const [attendanceTitle, setAttendanceTitle] = useState<Str>('');

    const showAttendanceHandler = (): void => {
        if (!displayAttendance) {
            setDisplayAttendance(true);
        }
    }

    const setTitle = (value: string): void => {
        setAttendanceTitle(value);
    }

    return (
        <div>
            <Navbar />
            <h1>This Will be the attendance page. </h1>
            <GroupDropDown 
                clickHandler={showAttendanceHandler}
                groupHandler={setTitle}
            />
            <AttendanceSheet 
                show={displayAttendance}
                title={attendanceTitle}
            />
        </div>
    );
}