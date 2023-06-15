import React, { useState } from "react";
import Navbar from "../components/global/Navbar.tsx";
import GroupDropDown from "../components/global/GroupDropDown.tsx";
import AttendanceDropDown from "../components/search/AttendanceDropdown.tsx";
import DisplayAttendance from "../components/search/DisplayAttendance.tsx";
import { Group, APIAttendanceTitles, DBAttendanceTitle, Attendee, APIAttendanceSheet } from "../types/interfaces.ts";
import "../assets/styles/views/search.scss";

export default function Search() {
  const initGroup = {
    name: "",
    age_group: "",
    displayName: "",
  };

  const initTable = {
    id: -1,
    title: "",
    displayTitle: "",
    dateCreated: "",
  };

  const [groupTable, setGroupTable] = useState<Group>(initGroup);
  const [attendanceTables, setAttendanceTables] = useState<DBAttendanceTitle[]>([]);
  const [showAttendanceDropDown, setShowAttendanceDropDown] = useState<boolean>(false);
  const [selectedTable, setSelectedTable] = useState<DBAttendanceTitle>(initTable);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendee[]>([]);

  const returnIndexOfSelected = (arr: Group[], value: string): number | void => {
    let index = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].displayName === value) {
        index = i;
        return index;
      }
    }
  };

  const dropDownChangeHandler = (arr: Group[], value: string): void => {
    let index = returnIndexOfSelected(arr, value);
    if (index) {
      setGroupTable({
        ...groupTable,
        name: arr[index]["name"],
        age_group: arr[index]["age_group"],
        displayName: value,
      });
      setShowAttendanceDropDown(false);
    }
  };

  const updateSelectedTable = (arr: DBAttendanceTitle[], value: string): void => {
    let index = 0;

    for (let i = 0; i < arr.length; i++) {
      if (arr[i].title === value) {
        index = i;
      }
    }

    setSelectedTable({
      ...selectedTable,
      id: arr[index].id,
      title: arr[index].title,
      displayTitle: arr[index].displayTitle,
      dateCreated: arr[index].dateCreated,
    });
  };

  const attDropDownChangeHandler = (arr: DBAttendanceTitle[], value: string): void => {
    fetch(`/attendance/get-list/${value}`)
      .then((data: Response): Promise<APIAttendanceSheet> => {
        return data.json();
      })
      .then((final: APIAttendanceSheet): void => {
        if (final.message === "success") {
          updateSelectedTable(arr, value);
          setSelectedAttendance(final.data);
        } else {
          alert(final.error);
        }
      });
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    fetch(`/group-lists/attendance/${groupTable.name}`)
      .then((data: Response): Promise<APIAttendanceTitles> => {
        return data.json();
      })
      .then((final: APIAttendanceTitles): void => {
        if (final.message === "success") {
          setAttendanceTables(final.data);
          setShowAttendanceDropDown(true);
        } else {
          alert(final.error);
        }
      });
  };

  return (
    <div>
      <Navbar />
      <div className="header_wrapper">
        <h1>Search</h1>
      </div>
      <div id="search_content_wrapper">
        <form
          method="GET"
          action="/group-lists/attendance/"
          onSubmit={submitHandler}
        >
          <GroupDropDown attendanceGroupSelected={dropDownChangeHandler} />
          <input
            type="submit"
            value="Submit"
          />
          <AttendanceDropDown
            attendanceSheets={attendanceTables}
            show={showAttendanceDropDown}
            changeHandler={attDropDownChangeHandler}
            allTitles={attendanceTables}
          />
        </form>

        <DisplayAttendance
          sheetData={selectedAttendance}
          sheetTitle={selectedTable.displayTitle}
        />
      </div>
    </div>
  );
}
