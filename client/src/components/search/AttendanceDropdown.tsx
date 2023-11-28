import React from "react";
import { DBAttendanceTitle, AttendanceDropDownProps } from "../../types/interfaces.ts";
import "../../assets/styles/components/search/attendanceDropDown.scss";

export default function AttendanceDropDown({ attendanceSheets, show, changeHandler, allTitles }: AttendanceDropDownProps) {


	//Set the options for the available attendance sheets.
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
			<div className="input_wrapper">
				<label htmlFor="table_selection">Select Attendance</label>
				<select
					id="table_selection"
					name="table_selection"
					onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => {
						changeHandler(allTitles, e.target.value);
					}}
				>
					<option value="">Please Choose One of the following</option>
					{options}
				</select>
			</div>
		</div>
	);
}
