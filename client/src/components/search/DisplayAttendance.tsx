import React, { useEffect, useState } from "react";
import { Attendee } from "../../types/interfaces.ts";
import "../../assets/styles/components/search/displayAttendance.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCircle } from "@fortawesome/free-solid-svg-icons";

interface DisplayAttendanceProps {
  sheetData: Attendee[];
  sheetTitle: string;
}

export default function DisplayAttendance({ sheetData, sheetTitle }: DisplayAttendanceProps): JSX.Element {
  const [screenSize, setScreenSize] = useState<number>(0);

  useEffect(() => {
    window.addEventListener("DOMContentLoaded", () => {
      let width = window.innerWidth;
      setScreenSize(width);
    });

    window.addEventListener("resize", (e): void => {
      let width = window.innerWidth;
      setScreenSize(width);
    });
  });
  const returnFields: JSX.Element[] = sheetData?.map((x: Attendee, y: number): JSX.Element => {
    if (screenSize > 1024) {
      return (
        <tr key={`attendee_${y}`}>
          <td>{`${y + 1}.`}</td>
          <td>{`${x.firstName}`}</td>
          <td>{`${x.lastName}`}</td>
          <td>{`${x.age}`}</td>
          <td>{`${x.memberType}`}</td>
          <td>
            <FontAwesomeIcon
              className="check"
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
          <td>
            <FontAwesomeIcon
              className="check"
              icon={x.present === 0 ? faCircle : faCheck}
            />
          </td>
        </tr>
      );
    }
  });

  const largeScreenHeaders: string[] = ["", "First Name", "Last Name", "Age", "Member", "Present"];
  const mobileHeaders: string[] = ["Name", "Member", "Present"];

  const returnHeaders = (arr: string[]): JSX.Element[] => {
    const displayHeaders = arr.map((x: string, y: number): JSX.Element => {
      return <th key={`header_${y}`}>{x}</th>;
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
