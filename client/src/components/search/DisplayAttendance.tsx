import React, { useEffect, useState } from "react";
import { Attendee, DisplayAttendanceProps } from "../../types/interfaces.ts";
import "../../assets/styles/components/search/displayAttendance.scss";
import MathMethods from "../../functions/math.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCircle } from "@fortawesome/free-solid-svg-icons";
import { ValuesAndClass } from "../../types/interfaces.ts";



export default function DisplayAttendance({ sheetData, sheetTitle, presentColumn }: DisplayAttendanceProps): JSX.Element {
	//Get the current screen size.
	let currentWidth = window.innerWidth;

	//Set the current screen size.
	const [screenSize, setScreenSize] = useState<number>(currentWidth);

	//Checking the screen size, and updating the state.
	useEffect(() => {
		window.addEventListener("resize", (e): void => {
			let width = window.innerWidth;
			setScreenSize(width);
		});
	});

	//Return all of the needed fields.
	const returnFields: JSX.Element[] = sheetData?.map((x: Attendee, y: number): JSX.Element => {
		//This is the title of the column that holds the value of whether the attendant is present or not.
		const present = presentColumn as keyof Attendee;

		if (screenSize > 1024) {
			return (
				<tr
					key={`attendee_${y}`}
					className={MathMethods.checkForEven(y) ? "" : "dark_row"}
				>
					<td className="id_data">{`${y + 1}.`}</td>
					<td>{`${x.firstName}`}</td>
					<td>{`${x.lastName}`}</td>
					<td>{`${x.age}`}</td>
					<td>{`${x.memberType}`}</td>
					<td className="present_data">
						<FontAwesomeIcon
							className={(x[present] as number) === 0 ? "circle" : "check"}
							icon={x[present] === 0 ? faCircle : faCheck}
						/>
					</td>
				</tr>
			);
		} else {
			return (
				<tr
					key={`mobile_attendee_${y}`}
					className={MathMethods.checkForEven(y) ? "" : "dark_row"}
				>
					<td>{`${x.firstName}, ${x.lastName}`}</td>
					<td className="present_data">
						<FontAwesomeIcon
							className={(x[present] as number) === 0 ? "circle" : "check"}
							icon={(x[present] as number) === 0 ? faCircle : faCheck}
						/>
					</td>
				</tr>
			);
		}
	});

	//Headers for large screen sizes.
	const largeScreenHeaders: ValuesAndClass[] = [
		{ value: "", class: "id_number" },
		{ value: "First Name", class: "first_name" },
		{ value: "Last Name", class: "last_name" },
		{ value: "Age", class: "age" },
		{ value: "Member", class: "member" },
		{ value: "Present", class: "present_header" },
	];

	//Headers for mobile devices.
	const mobileHeaders: ValuesAndClass[] = [
		{ value: "Name", class: "name" },
		{ value: "Present", class: "present_header" },
	];

	//Return the headers
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

	//Final return to return the elements.
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
