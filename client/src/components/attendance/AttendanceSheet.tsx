import React, { useState, useEffect } from "react";
import {Attendee, AttendanceProps} from "../../types/interfaces.tsx";
import {attendantData} from "../../variables/dummyAttendant.ts";



export default function AttendanceSheet({show, title}: AttendanceProps) {
  
  const [memberData, setMemberData] = useState<Attendee[]>(attendantData);

  const clickHandler = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ): void => {
    const copy = memberData.slice();

    if (copy[index].present === 0) {
      copy[index].present = 1;
      setMemberData(copy);
      console.log(memberData[index].lastName, memberData[index].present);
    } else {
      copy[index].present = 0;
      setMemberData(copy);
      console.log(memberData[index].lastName, memberData[index].present);
    }
  };

  const dataPoints = memberData.map((x: Attendee, y: number) => {
    return (
      <tr key={`attendant_row_${y}`} id={`attendant_row_${y}`}>
        <td>{x.lastName}</td>
        <td>{x.firstName}</td>
        <td>
          <button type="button" onClick={(e) => clickHandler(e, y)}>
            {x.present === 0 ? "Not Present" : "Present"}
          </button>
        </td>
      </tr>
    );
  });

  return (
    <div className="attendance_table_wrapper" style={show ? {display: ""} : {display: "none"}}>
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
