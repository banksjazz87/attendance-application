import React, { useState, useEffect } from "react";
import { Attendee, AttendanceProps, UpdateAttendant, APIResponse } from "../../types/interfaces.tsx";
import putData from "../../functions/api/put.ts";
import deleteData from "../../functions/api/delete.ts";
import "../../assets/styles/components/attendance/attendanceSheet.scss";

//For Development
import { attendantData } from "../../variables/dummyAttendant.ts";

export default function AttendanceSheet({ show, title, attendanceData, parentTitle, tableName }: AttendanceProps) {
  //The below is for production
  //const [memberData, setMemberData] = useState<Attendee[]>(attendanceData);

  //The below is for development
  const [memberData, setMemberData] = useState<Attendee[]>(attendantData);

  //The below is for production
  // useEffect((): void => {
  //   setMemberData(attendanceData);
  // }, [attendanceData]);

  const checkedHandler = (e: React.ChangeEvent<HTMLInputElement>, index: number): void => {
    const copy: Attendee[] = memberData.slice();

    let currentObj: UpdateAttendant = {
      firstName: copy[index].firstName,
      lastName: copy[index].lastName,
      attendantId: copy[index].id,
      table: tableName,
      presentValue: 0,
    };

    if (copy[index].present === 0) {
      copy[index].present = 1;
      setMemberData(copy);
      currentObj.presentValue = 1;

      putData("/attendance/update-table", currentObj).then((data: APIResponse): void => {
        if (data.message === "success") {
          alert(`${currentObj.firstName} ${currentObj.lastName} has been marked present`);
        } else {
          alert(data.data);
        }
      });
    } else {
      copy[index].present = 0;
      setMemberData(copy);
      currentObj.presentValue = 0;

      putData("/attendance/update-table", currentObj).then((data: APIResponse): void => {
        if (data.message === "success") {
          alert(`${currentObj.firstName} ${currentObj.lastName} has been marked NOT present`);
        } else {
          alert(data.data);
        }
      });
    }
  };

  const removeAttendee = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number): void => {
    let selectedAtt = memberData[index];
    deleteData(`/attendance-sheet/remove-person/${selectedAtt.firstName}/${selectedAtt.lastName}/${selectedAtt.id}/${tableName}`).then((data: APIResponse): void => {
      if (data.message === "success") {
        alert(`${selectedAtt.firstName} ${selectedAtt.lastName} has been deleted`);
        window.location.reload();
      } else {
        alert(`${data.data}`);
      }
    });
  };

  const checkedOrNot = (value: number | undefined, index: number): JSX.Element => {
    if (value === 0) {
      return (
        <input
          type="checkbox"
          id="present_click"
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => checkedHandler(e, index)}
        />
      );
    } else {
      return (
        <input
          type="checkbox"
          id="present_click"
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => checkedHandler(e, index)}
          checked
        />
      );
    }
  };

  const dataPoints = memberData.map((x: Attendee, y: number): JSX.Element => {
    return (
      <tr
        key={`attendant_row_${y}`}
        id={`attendant_row_${y}`}
      >
        <td>{x.lastName}</td>
        <td>{x.firstName}</td>
        <td>{checkedOrNot(x.present, y)}</td>
        <td>
          <button
            type="button"
            onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
              removeAttendee(event, y);
            }}
          >
            X
          </button>
        </td>
      </tr>
    );
  });

  //FOR PRODUCTION change the below divs style={show ? { display: "" } : { display: "" }} for production. Remove conditionals from h2 and h3.
  return (
    <div
      className="attendance_table_wrapper"
      style={show ? { display: "" } : { display: "" }}
    >
      <h2>{parentTitle.length > 0 ? parentTitle : "Parent Title"}</h2>
      <h3>{title.length > 0 ? title : "Table Name"}</h3>
      <table>
        <tbody>
          <tr>
            <th>Last Name</th>
            <th>First Name</th>
            <th>Present</th>
            <th>Delete</th>
          </tr>
          {dataPoints}
        </tbody>
      </table>
    </div>
  );
}
