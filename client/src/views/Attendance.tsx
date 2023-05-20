import React, { useState } from "react";
import Navbar from "../components/global/Navbar.tsx";
import DropDownForm from "../components/attendance/DropDownForm.tsx";
import AttendanceSheet from "../components/attendance/AttendanceSheet.tsx";
import NewMember from "../components/people/NewMember.tsx";
import { Str, Bool } from "../../src/types/types.ts";

export default function Attendance() {
  const [displayAttendance, setDisplayAttendance] = useState<Bool>(false);
  const [attendanceTitle, setAttendanceTitle] = useState<Str>("");
  const [selectedGroup, setSelectedGroup] = useState<Str>("");

  const showAttendanceHandler = (): void => {
    if (!displayAttendance) {
      setDisplayAttendance(true);
    }
  };

  const setTitle = (value: string): void => {
    setAttendanceTitle(value);
  };

  const selectGroup = (value: string): void => {
    setSelectedGroup(value);
  };

  return (
    <div>
      <Navbar />
      <h1>This Will be the attendance page. </h1>
      <DropDownForm
        clickHandler={showAttendanceHandler}
        groupHandler={setTitle}
        name={selectedGroup}
        groupSelected={selectGroup}
      />
      <AttendanceSheet
        show={displayAttendance}
        title={attendanceTitle}
      />
      <NewMember />
    </div>
  );
}
