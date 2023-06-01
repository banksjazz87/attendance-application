import React, { useState } from "react";
import Navbar from "../components/global/Navbar.tsx";
import GroupDropDown from "../components/global/GroupDropDown.tsx";
import AttendanceDropDown from "../components/search/AttendanceDropdown.tsx";
import { Group, APIAttendanceTitles, DBAttendanceTitle } from "../types/interfaces.ts";

export default function Search() {
  const [groupTable, setGroupTable] = useState<Group>({
    name: "",
    age_group: "",
    displayName: "",
  });

  const [attendanceTables, setAttendanceTables] = useState<DBAttendanceTitle[]>([]);

  const dropDownChangeHandler = (arr: Group[], value: string): void => {
    let index = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].displayName === value) {
        index = i;
      }
    }

    setGroupTable({
      ...groupTable,
      name: arr[index]["name"],
      age_group: arr[index]["age_group"],
      displayName: value,
    });

    console.log(groupTable);
  };

  return (
    <div>
      <Navbar />
      <h1>This Will be the search page. </h1>
      <form
        method="GET"
        action="/group-lists/attendance/"
        onSubmit={(e: React.FormEvent<HTMLFormElement>): void => {
          e.preventDefault();
          fetch(`/group-lists/attendance/${groupTable.name}`)
            .then((data: Response): Promise<APIAttendanceTitles> => {
              return data.json();
            })
            .then((final: APIAttendanceTitles): void => {
              if (final.message === "success") {
                setAttendanceTables(final.data);
              } else {
                alert(final.error);
              }
            });
        }}
      >
        <GroupDropDown attendanceGroupSelected={dropDownChangeHandler} />
        <input
          type="submit"
          value="Submit"
        />
        <AttendanceDropDown attendanceSheets={attendanceTables} />
      </form>
    </div>
  );
}
