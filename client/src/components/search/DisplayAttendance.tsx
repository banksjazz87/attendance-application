import React from "react";
import { Attendee } from "../../types/interfaces.ts";

interface DisplayAttendanceProps {
  sheetData: Attendee[];
  sheetTitle: string;
}

export default function DisplayAttendance({ sheetData, sheetTitle }: DisplayAttendanceProps): JSX.Element {
  const returnFields: JSX.Element[] = sheetData?.map((x: Attendee, y: number): JSX.Element => {
    return (
      <tr key={`attendee_${x}`}>
        <td>{`${y + 1}.`}</td>
        <td>{`${x.firstName}`}</td>
        <td>{`${x.lastName}`}</td>
        <td>{`${x.age}`}</td>
        <td>{`${x.memberType}`}</td>
        <td>{x.present === 0 ? "-" : "√"}</td>
      </tr>
    );
  });

  return (
    <div
      id="display_attendance_wrapper"
      style={sheetData.length > 0 ? { display: "" } : { display: "none" }}
    >
      <h1>{sheetTitle}</h1>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Age</th>
            <th>Member</th>
            <th>Present</th>
          </tr>
          {returnFields}
        </tbody>
      </table>
    </div>
  );
}
