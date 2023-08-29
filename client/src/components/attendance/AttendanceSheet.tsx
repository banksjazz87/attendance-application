import React, { useState, useEffect } from "react";
import { Attendee, AttendanceProps, UpdateAttendant, APIResponse } from "../../types/interfaces.tsx";
import putData from "../../functions/api/put.ts";
import MathMethods from "../../functions/math.ts";
import SearchBar from "../global/SearchBar.tsx";
import "../../assets/styles/components/attendance/attendanceSheet.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCircle, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { ValuesAndClass } from "../../types/interfaces.ts";

//For Development
//import { attendantData } from "../../variables/dummyAttendant.ts";

export default function AttendanceSheet({ show, title, attendanceData, parentTitle, tableName, deleteMemberHandler, updatePartial, activeSearch }: AttendanceProps) {
	//The below is for production
	const [memberData, setMemberData] = useState<Attendee[]>(attendanceData);

	//The below is for development
	//const [memberData, setMemberData] = useState<Attendee[]>(attendantData);
	const [screenSize, setScreenSize] = useState<number>(window.innerWidth);

	//The below is for production
	useEffect((): void => {
		setMemberData(attendanceData);
	}, [attendanceData]);


	// function updateMember(member: string, objVal: string) {
		
	// }
	// function updateSum() {
	// 	const members = memberData.filter((x, y) => {
	// 		if (x.present === 1) {
				
	// 		}
	// 	})
	// }
	//Used to check the current screen size
	useEffect((): void => {
		window.addEventListener("resize", (e: UIEvent): void => {
			setScreenSize(window.innerWidth);
		});
	}, [screenSize]);

	const checkedHandler = (index: number): void => {
		const copy: Attendee[] = memberData.slice();

		let currentObj: UpdateAttendant = {
			firstName: copy[index].firstName,
			lastName: copy[index].lastName,
			attendantId: copy[index].id,
			table: tableName,
			presentValue: 0,
		};

		if (copy[index].present === 0) {
			copy[index].present = 1;
			setMemberData(copy);
			currentObj.presentValue = 1;

			putData("/attendance/update-table", currentObj).then((data: APIResponse): void => {
				if (data.message === "success") {
					alert(`${currentObj.firstName} ${currentObj.lastName} has been marked present`);
				} else {
					alert(data.data);
				}
			});
		} else {
			copy[index].present = 0;
			setMemberData(copy);
			currentObj.presentValue = 0;

			putData("/attendance/update-table", currentObj).then((data: APIResponse): void => {
				if (data.message === "success") {
					alert(`${currentObj.firstName} ${currentObj.lastName} has been marked NOT present`);
				} else {
					alert(data.data);
				}
			});
		}
	};

	const checkedOrNot = (value: number | undefined, index: number): JSX.Element => {
		if (value === 0) {
			return (
				<button
					type="button"
					className="present_click"
					onClick={(e: React.MouseEvent<HTMLButtonElement>): void => {
						checkedHandler(index);
					}}
				>
					<FontAwesomeIcon
						className="circle"
						icon={faCircle}
					/>
				</button>
			);
		} else {
			return (
				<button
					type="button"
					className="present_click"
					onClick={(e: React.MouseEvent<HTMLButtonElement>): void => {
						checkedHandler(index);
					}}
				>
					<FontAwesomeIcon
						className="check"
						icon={faCheck}
					/>
				</button>
			);
		}
	};

	const dataPointsLgScreen = memberData.map((x: Attendee, y: number): JSX.Element => {
		return (
			<tr
				key={`attendant_row_${y}`}
				id={`attendant_row_${y}`}
				className={MathMethods.checkForEven(y) ? "" : "dark_row"}
			>
				<td>{x.lastName}</td>
				<td>{x.firstName}</td>
				<td className="present_data">{checkedOrNot(x.present, y)}</td>
				<td className="delete_button">
					<button
						type="button"
						className="trash_btn"
						onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
							deleteMemberHandler(memberData, y);
						}}
					>
						<FontAwesomeIcon
							className="trash_can"
							icon={faTrashCan}
						/>
					</button>
				</td>
			</tr>
		);
	});

	const dataPointsMobile = memberData.map((x: Attendee, y: number): JSX.Element => {
		return (
			<tr
				key={`attendant_row_${y}`}
				id={`attendant_row_${y}`}
				className={MathMethods.checkForEven(y) ? "" : "dark_row"}
			>
				<td>{`${x.lastName}, ${x.firstName}`}</td>
				<td className="present_data">{checkedOrNot(x.present, y)}</td>
				<td className="delete_button">
					<button
						type="button"
						className="trash_btn"
						onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
							deleteMemberHandler(event, y);
						}}
					>
						<FontAwesomeIcon
							className="trash_can"
							icon={faTrashCan}
						/>
					</button>
				</td>
			</tr>
		);
	});

	const headersLgScreen: ValuesAndClass[] = [
		{ value: "Last Name", class: "last_name" },
		{ value: "First Name", class: "first_name" },
		{ value: "Present", class: "present_header" },
		{ value: "Delete", class: "delete" },
	];
	const headersMobileScreen: ValuesAndClass[] = [
		{ value: "Name", class: "name" },
		{ value: "Present", class: "present_header" },
		{ value: "Delete", class: "delete" },
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

	const mainContent = (): JSX.Element => {
		return (
			<div
				className="attendance_table_wrapper"
				style={show ? { display: "" } : { display: "none" }}
			>
				<h2>{parentTitle}</h2>
				<h3>{title}</h3>
				<SearchBar updatePartial={updatePartial} />
				<table>
					<tbody>
						<tr>{screenSize > 767 ? returnHeaders(headersLgScreen) : returnHeaders(headersMobileScreen)}</tr>
						{screenSize > 767 ? dataPointsLgScreen : dataPointsMobile}
					</tbody>
				</table>
			</div>
		);
	};

	//FOR PRODUCTION change the below divs style={show ? { display: "" } : { display: "" }} for production. Remove conditionals from h2 and h3.
	if (attendanceData.length > 0) {
		return mainContent();
	} else {
		return (
			<div
				className="attendance_table_wrapper"
				style={show ? { display: "" } : { display: "none" }}
			>
				<h2>{parentTitle}</h2>
				<h3>{title}</h3>
				<SearchBar updatePartial={updatePartial} />
				<p>Rendering...</p>
			</div>
		);
	}
}
