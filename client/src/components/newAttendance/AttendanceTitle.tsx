import React from "react";
import { GroupProps } from "../../types/interfaces.ts";
import "../../assets/styles/components/newAttendance/attendanceTitle.scss";

export default function AttendanceTitle({ titleHandler, attendanceTitle }: GroupProps) {

  /**
   * 
   * @param e change event on an input element
   * @return void
   * @description update the attendance title.
   * 
   */
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (titleHandler) {
      titleHandler(e.target.value);
    }
  };

  return (
    <div id="attendance_title_wrapper">
      <div className="input_pair">
        <label htmlFor="attendance_title">Title</label>
        <input
          id="attendance_title"
          type="text"
          value={attendanceTitle}
          onChange={changeHandler}
        />
      </div>
    </div>
  );
}
