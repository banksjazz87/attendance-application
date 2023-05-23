import React, { useState, useEffect } from "react";
import { Attendee, AttendanceProps, UpdateAttendant, APIResponse } from "../../types/interfaces.tsx";
import putData from "../../functions/api/put.ts";

export default function AttendanceSheet({ show, title, attendanceData, parentTitle, tableName }: AttendanceProps) {
  const [memberData, setMemberData] = useState<Attendee[]>(attendanceData);

  useEffect((): void => {
    setMemberData(attendanceData);
  }, [attendanceData]);

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
        console.log(data);
      });
    } else {
      copy[index].present = 0;
      setMemberData(copy);
      currentObj.presentValue = 0;
      putData("/attendance/update-table", currentObj).then((data: APIResponse): void => {
        console.log(data);
      });
    }
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
      </tr>
    );
  });

  return (
    <div
      className="attendance_table_wrapper"
      style={show ? { display: "" } : { display: "none" }}
    >
      <h2>{parentTitle}</h2>
      <h3>{title}</h3>
      <table>
        <tbody>
          <tr>
            <th>Last Name</th>
            <th>First Name</th>
            <th>Present</th>
          </tr>
          {dataPoints}
        </tbody>
      </table>
    </div>
  );
}
