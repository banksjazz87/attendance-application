import React, { useState, useEffect } from "react";
import Navbar from "../components/global/Navbar.tsx";
import DropDownForm from "../components/attendance/DropDownForm.tsx";
import AttendanceSheet from "../components/attendance/AttendanceSheet.tsx";
import NewMember from "../components/people/NewMember.tsx";
import { Bool } from "../../src/types/types.ts";
import { Group, DBAttendanceTitle, APIAttendanceTitles, APIAttendanceSheet, Attendee } from "../../src/types/interfaces.ts";

export default function Attendance(): JSX.Element {
  const [displayAttendance, setDisplayAttendance] = useState<Bool>(false);
  const [selectedGroup, setSelectedGroup] = useState<Group[]>([{ id: 0, name: "", age_group: "", displayName: "" }]);
  const [selectedAttendance, setSelectedAttendance] = useState<DBAttendanceTitle>({
    id: 0,
    title: "",
    displayTitle: "",
    dateCreated: "",
  });
  const [currentListData, setCurrentListData] = useState<Attendee[]>([]);

  useEffect((): void => {
    if (sessionStorage.selectedTable) {
      let tableToDisplay = JSON.parse(sessionStorage.selectedTable);

      setSelectedAttendance({
        ...selectedAttendance,
        id: tableToDisplay.id,
        title: tableToDisplay.title,
        displayTitle: tableToDisplay.displayTitle,
        dateCreated: tableToDisplay.dateCreated,
      });

      fetch(`/attendance/get-list/${tableToDisplay.title}`)
        .then((data: Response): Promise<APIAttendanceSheet> => {
          return data.json();
        })
        .then((final: APIAttendanceSheet): void => {
          selectAttendanceSheet(final.data);
        });
    }
  }, []);

  const showAttendanceHandler = (): void => {
    setDisplayAttendance(true);
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
    setDisplayAttendance(false);
  };

  const selectAttendanceSheet = (arr: Attendee[]): void => {
    setCurrentListData(arr);
    setDisplayAttendance(true);
  };

  const dropDownSubmit = (value: string): void => {
    console.log(value);
    fetch(`/group-lists/attendance/${value}`)
      .then((data: Response): Promise<APIAttendanceTitles> => {
        return data.json();
      })
      .then((final: APIAttendanceTitles): void => {
        setSelectedAttendance({ ...selectedAttendance, id: final.data[0].id, title: final.data[0].title, displayTitle: final.data[0].displayTitle, dateCreated: final.data[0].dateCreated });

        const displayedSheet = {
          id: final.data[0].id,
          title: final.data[0].title,
          displayTitle: final.data[0].displayTitle,
          dateCreated: final.data[0].dateCreated,
        };

        const displayedJSON = JSON.stringify(displayedSheet);
        sessionStorage.setItem("selectedTable", displayedJSON);

        fetch(`/attendance/get-list/${final.data[0].title}`)
          .then((data: Response): Promise<APIAttendanceSheet> => {
            return data.json();
          })
          .then((final: APIAttendanceSheet): void => {
            selectAttendanceSheet(final.data);
          });
      });
  };

  return (
    <div id="attendance_wrapper">
      <Navbar />
      <div className="header_wrapper">
        <h1>Attendance</h1>
      </div>
      <div id="attendance_content_wrapper">
        <DropDownForm
          clickHandler={showAttendanceHandler}
          name={selectedGroup[0].name}
          groupSelectedHandler={selectGroup}
          groupHandler={dropDownSubmit}
        />
        <AttendanceSheet
          show={displayAttendance}
          title={selectedAttendance.displayTitle}
          tableName={selectedAttendance.title}
          attendanceData={currentListData}
          parentTitle={selectedGroup[0].displayName}
        />
        <NewMember currentTable={selectedAttendance.title} />
      </div>
    </div>
  );
}
