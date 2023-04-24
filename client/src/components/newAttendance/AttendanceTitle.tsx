import React from "react";
import { GroupProps } from "../../types/interfaces.ts";

export default function AttendanceTitle({
  titleHandler,
  attendanceTitle,
}: GroupProps) {
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (titleHandler) {
      titleHandler(e.target.value);
    }
  };

  return (
    <div id="attendance_title_wrapper">
      <label htmlFor="attendance_title">Title</label>
      <input
        id="attendance_title"
        type="text"
        value={attendanceTitle}
        onChange={changeHandler}
      />
    </div>
  );
}
