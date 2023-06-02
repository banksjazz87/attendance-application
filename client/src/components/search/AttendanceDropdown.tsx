import React from "react";
import { DBAttendanceTitle } from "../../types/interfaces.ts";

interface AttendanceDropDownProps {
  attendanceSheets?: DBAttendanceTitle[];
  show: boolean;
  changeHandler: Function;
  allTitles: DBAttendanceTitle[];
}
export default function AttendanceDropDown({ attendanceSheets, show, changeHandler, allTitles }: AttendanceDropDownProps) {
  const options = attendanceSheets?.map((x: DBAttendanceTitle, y: number): JSX.Element => {
    return (
      <option
        key={`option_${y}`}
        value={x.title}
      >
        {x.displayTitle}
      </option>
    );
  });

  return (
    <div
      id="attendance_drop_down_wrapper"
      style={show ? { display: "" } : { display: "none" }}
    >
      <select
        onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => {
          console.log(e.target.value);
          changeHandler(allTitles, e.target.value);
        }}
      >
        <option value="">Please Choose One of the following</option>
        {options}
      </select>
    </div>
  );
}
