import React, { useEffect, useState } from "react";
import { Attendee } from "../../types/interfaces.ts";
import "../../assets/styles/components/search/displayAttendance.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCircle } from "@fortawesome/free-solid-svg-icons";
import { ValuesAndClass } from "../../types/interfaces.ts";

interface DisplayAttendanceProps {
  sheetData: Attendee[];
  sheetTitle: string;
}

export default function DisplayAttendance({ sheetData, sheetTitle }: DisplayAttendanceProps): JSX.Element {
  let currentWidth = window.innerWidth;
  const [screenSize, setScreenSize] = useState<number>(currentWidth);

  useEffect(() => {
    window.addEventListener("resize", (e): void => {
      let width = window.innerWidth;
      setScreenSize(width);
    });
  });
  const returnFields: JSX.Element[] = sheetData?.map((x: Attendee, y: number): JSX.Element => {
    if (screenSize > 1024) {
      return (
        <tr key={`attendee_${y}`}>
          <td className="id_data">{`${y + 1}.`}</td>
          <td>{`${x.firstName}`}</td>
          <td>{`${x.lastName}`}</td>
          <td>{`${x.age}`}</td>
          <td>{`${x.memberType}`}</td>
          <td className="present_data">
            <FontAwesomeIcon
              className={x.present === 0 ? "circle" : "check"}
              icon={x.present === 0 ? faCircle : faCheck}
            />
          </td>
        </tr>
      );
    } else {
      return (
        <tr key={`mobile_attendee_${y}`}>
          <td>{`${x.firstName}, ${x.lastName}`}</td>
          <td>{`${x.memberType}`}</td>
          <td className="present_data">
            <FontAwesomeIcon
              className={x.present === 0 ? "circle" : "check"}
              icon={x.present === 0 ? faCircle : faCheck}
            />
          </td>
        </tr>
      );
    }
  });

  const largeScreenHeaders: ValuesAndClass[] = [
    { value: "", class: "id_number" },
    { value: "First Name", class: "first_name" },
    { value: "Last Name", class: "last_name" },
    { value: "Age", class: "age" },
    { value: "Member", class: "member" },
    { value: "Present", class: "present_header" },
  ];

  const mobileHeaders: ValuesAndClass[] = [
    { value: "Name", class: "name" },
    { value: "Member", class: "member" },
    { value: "Present", class: "present_header" },
  ];

  const returnHeaders = (arr: ValuesAndClass[]): JSX.Element[] => {
    const displayHeaders = arr.map((x: ValuesAndClass, y: number): JSX.Element => {
      return (
        <th
          key={`header_${y}`}
          className={x.class}
        >
          {x.value}
        </th>
      );
    });
    return displayHeaders;
  };

  //Remove conditional from h1
  return (
    <div
      id="display_attendance_wrapper"
      style={sheetData.length > 0 ? { display: "" } : { display: "none" }}
    >
      <h2>{sheetTitle.length > 0 ? sheetTitle : "Test Name"}</h2>
      <table>
        <tbody>
          <tr>{screenSize > 1024 ? returnHeaders(largeScreenHeaders) : returnHeaders(mobileHeaders)}</tr>
          {returnFields}
        </tbody>
      </table>
    </div>
  );
}
