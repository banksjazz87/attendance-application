import React, { useState, useEffect } from "react";
import { Attendee, AttendanceProps } from "../../types/interfaces.tsx";
import { attendantData } from "../../variables/dummyAttendant.ts";

export default function AttendanceSheet({ show, title }: AttendanceProps) {
  const [memberData, setMemberData] = useState<Attendee[]>(attendantData);

  const checkedHandler = (e: React.ChangeEvent<HTMLInputElement>, index: number): void => {
    const copy = memberData.slice();
    if (copy[index].present === 0) {
      copy[index].present = 1;
      setMemberData(copy);
    } else {
      copy[index].present = 0;
      setMemberData(copy);
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
      <h2>{title}</h2>
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
