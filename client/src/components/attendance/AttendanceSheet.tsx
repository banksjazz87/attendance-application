import React, { useState, useEffect } from "react";
import { Attendee, AttendanceProps, UpdateAttendant, APIResponse, TotalSum } from "../../types/interfaces.tsx";
import putData from "../../functions/api/put.ts";
import MathMethods from "../../functions/math.ts";
import SearchBar from "../global/SearchBar.tsx";
import SaveButton from "../attendance/SaveButton.tsx";
import "../../assets/styles/components/attendance/attendanceSheet.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCircle, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { ValuesAndClass } from "../../types/interfaces.ts";

//For Development
//import { attendantData } from "../../variables/dummyAttendant.ts";

export default function AttendanceSheet({ show, title, attendanceData, parentTitle, tableName, deleteMemberHandler, updatePartial, activeSearch, startLoading, stopLoading, triggerSuccessMessage, hideSuccessMessage, updateSuccessMessage }: AttendanceProps): JSX.Element {
	//The below is for production
	const [memberData, setMemberData] = useState<Attendee[]>(attendanceData);

	//The below is for development
	//const [memberData, setMemberData] = useState<Attendee[]>(attendantData);
	const [screenSize, setScreenSize] = useState<number>(window.innerWidth);

	const [sumOfPresent, setSumOfPresent] = useState<TotalSum>({
		totalChildren: 0,
		totalYouth: 0,
		totalAdults: 0,
		totalMembers: 0,
		totalVisitors: 0,
	});

	//The below is for production
	useEffect((): void => {
		setMemberData(attendanceData);
	}, [attendanceData]);

	//Used to check the current screen size
	useEffect((): void => {
		window.addEventListener("resize", (e: UIEvent): void => {
			setScreenSize(window.innerWidth);
		});
	}, [screenSize]);

	//Used to update the total number of people present.
	useEffect((): void => {
		let child = 0;
		let adult = 0;
		let youth = 0;
		let member = 0;
		let visitor = 0;

		for (let i = 0; i < memberData.length; i++) {
			if (memberData[i].present === 1) {
				let currentAge = memberData[i].age;
				let currentMember = memberData[i].memberType;

				if (currentAge === "child") {
					if (currentMember === "member") {
						child = child + 1;
						member = member + 1;
					} else {
						child = child + 1;
						visitor = visitor + 1;
					}
				} else if (currentAge === "youth") {
					if (currentMember === "member") {
						youth = youth + 1;
						member = member + 1;
					} else {
						youth = youth + 1;
						visitor = visitor + 1;
					}
				} else {
					if (currentMember === "member") {
						adult = adult + 1;
						member = member + 1;
					} else {
						adult = adult + 1;
						visitor = visitor + 1;
					}
				}
			}
		}

		setSumOfPresent({ ...sumOfPresent, totalChildren: child, totalYouth: youth, totalAdults: adult, totalMembers: member, totalVisitors: visitor });
	}, [memberData]);


	const displaySuccessMessage = (str: string): void => {
		updateSuccessMessage(str);
		triggerSuccessMessage();
	}

	const checkedHandler = (index: number): void => {
		const copy: Attendee[] = memberData.slice();
		let currentObj: UpdateAttendant = {
			firstName: copy[index].firstName,
			lastName: copy[index].lastName,
			attendantId: copy[index].id,
			table: tableName,
			presentValue: 0,
		};

		hideSuccessMessage();

		if (copy[index].present === 0) {
			copy[index].present = 1;
			setMemberData(copy);
			currentObj.presentValue = 1;

			putData("/attendance/update-table", currentObj).then((data: APIResponse): void => {
				if (data.message === "success") {
					let successMessage: string = `${currentObj.firstName} ${currentObj.lastName} has been marked present.`;
					displaySuccessMessage(successMessage);
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
					let successMessage: string = `${currentObj.firstName} ${currentObj.lastName} has been marked NOT present`;
					displaySuccessMessage(successMessage);
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
				<div className="btn_group">
					<SearchBar updatePartial={updatePartial} />
					<SaveButton
						tableTitle={tableName}
						totalData={sumOfPresent}
						startLoading={startLoading}
						stopLoading={stopLoading}
					 />
				</div>
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
				<div className="btn_group">
					<SearchBar updatePartial={updatePartial} />
				</div>
				<p>Rendering...</p>
			</div>
		);
	}
}
