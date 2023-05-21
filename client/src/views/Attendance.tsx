import React, { useState } from "react";
import Navbar from "../components/global/Navbar.tsx";
import DropDownForm from "../components/attendance/DropDownForm.tsx";
import AttendanceSheet from "../components/attendance/AttendanceSheet.tsx";
import NewMember from "../components/people/NewMember.tsx";
import { Str, Bool } from "../../src/types/types.ts";
import { Group, APIResponse } from "../../src/types/interfaces.ts";

export default function Attendance(): JSX.Element {
  const [displayAttendance, setDisplayAttendance] = useState<Bool>(false);
  const [attendanceTitle, setAttendanceTitle] = useState<Str>("");
  const [selectedGroup, setSelectedGroup] = useState<Group[]>([{ id: 0, name: "", age_group: "", displayName: "" }]);

  const showAttendanceHandler = (): void => {
    setDisplayAttendance(true);
  };

  const setTitle = (value: string): void => {
    setAttendanceTitle(value);
  };

  const selectGroup = (groupArray: Group[], value: string): void => {
    let arrayCopy = groupArray.slice();
    let index = 0;
    let copyOfCurrentSelected = selectedGroup.slice();

    for (let i = 0; i < arrayCopy.length; i++) {
      if (arrayCopy[i].displayName === value) {
        index = i;
      }
    }

    copyOfCurrentSelected[0] = arrayCopy[index];
    setSelectedGroup(copyOfCurrentSelected);
    console.log(value);
    console.log(selectedGroup);
  };

  const dropDownSubmit = (value: string): void => {
    console.log(value);
    fetch(`/group-lists/attendance/${value}`)
      .then((data: Response): Promise<APIResponse> => {
        return data.json();
      })
      .then((final: APIResponse) => {
        console.log(final.data);
      });
  };

  return (
    <div>
      <Navbar />
      <h1>This Will be the attendance page. </h1>
      <DropDownForm
        clickHandler={showAttendanceHandler}
        name={selectedGroup[0].name}
        groupSelectedHandler={selectGroup}
        groupHandler={dropDownSubmit}
      />
      <AttendanceSheet
        show={displayAttendance}
        title={attendanceTitle}
      />
      <p>{selectedGroup[0].name}</p>
      <NewMember />
    </div>
  );
}
