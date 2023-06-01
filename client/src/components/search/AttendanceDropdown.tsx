import React from "react";
import { DBAttendanceTitle } from "../../types/interfaces.ts";

interface AttendanceDropDownProps {
  attendanceSheets?: DBAttendanceTitle[];
}
export default function AttendanceDropDown({ attendanceSheets }: AttendanceDropDownProps) {
  return <select></select>;
}
