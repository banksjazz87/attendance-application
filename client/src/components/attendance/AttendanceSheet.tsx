import React, { useState, useEffect } from "react";

interface Attendee {
  firstName: string;
  lastName: string;
  adult: number;
  child: number;
  teen: number;
  present: number;
}

interface AttendanceProps {
    show: boolean;
    title: string;
}


export default function AttendanceSheet({show, title}: AttendanceProps) {
  //Dummy Data
  const attendantData: Attendee[] = [
    {
      firstName: "Chuck",
      lastName: "Barley",
      adult: 0,
      child: 0,
      teen: 1,
      present: 0,
    },
    {
      firstName: "Chuck",
      lastName: "Berry",
      adult: 1,
      child: 0,
      teen: 0,
      present: 0,
    },
    {
      firstName: "Chuck",
      lastName: "Larry",
      adult: 1,
      child: 0,
      teen: 0,
      present: 0,
    },
  ];

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
