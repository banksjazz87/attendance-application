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

export default function AttendanceSheet({
	show,
	title,
	attendanceData,
	parentTitle,
	tableName,
	deleteMemberHandler,
	updatePartial,
	startLoading,
	stopLoading,
	triggerSuccessMessage,
	hideSuccessMessage,
	updateSuccessMessage,
	parentName,
	partialSearch
}: AttendanceProps): JSX.Element {
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

	const [totalPresent, setTotalPresent] = useState<number>(0);

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
		const attendanceColumn = tableName as keyof Attendee;

		for (let i = 0; i < memberData.length; i++) {
			if (memberData[i][attendanceColumn] === 1) {
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


	//Used to update the number of the total present, this result is displayed in the attendance table.
	useEffect((): void => {
		const {
			totalChildren,
			totalYouth,
			totalAdults
		} = sumOfPresent;

		const total = totalChildren + totalYouth + totalAdults;
		setTotalPresent(total);
	}, [sumOfPresent]);

	const displaySuccessMessage = (str: string): void => {
		updateSuccessMessage(str);
		triggerSuccessMessage();
	};

	/**
	 *
	 * @param index number
	 * @returns void
	 * @description this is used to update the attendant, in regards to if they're present or not.  If they're present, their status is updated to 1 if they are not present their status is 0.
	 */
	const checkedHandler = (index: number): void => {
		const copy: Attendee[] = memberData.slice();

		//Object to represent the values for the attendant with the corresponding index number.
		let currentObj: UpdateAttendant = {
			firstName: copy[index].firstName,
			lastName: copy[index].lastName,
			attendantId: copy[index].id,
			table: `${parentName}_attendance`,
		};

		hideSuccessMessage();

		if (copy[index][tableName] === 0) {
			//Update the component's state.
			copy[index][tableName] = 1;
			setMemberData(copy);

			//Update the database.
			putData(`/attendance/update-table/${tableName}/1`, currentObj).then((data: APIResponse): void => {
				if (data.message === "success") {
					let successMessage: string = `${currentObj.firstName} ${currentObj.lastName} has been marked present.`;
					displaySuccessMessage(successMessage);
				} else {
					alert(data.data);
				}
			});
		} else {
			//Update the component's state.
			copy[index][tableName] = 0;
			setMemberData(copy);

			//Update the database.
			putData(`/attendance/update-table/${tableName}/0`, currentObj).then((data: APIResponse): void => {
				if (data.message === "success") {
					let successMessage: string = `${currentObj.firstName} ${currentObj.lastName} has been marked NOT present`;
					displaySuccessMessage(successMessage);
				} else {
					alert(data.data);
				}
			});
		}
	};

	/**
	 *
	 * @param value number or undefined
	 * @param index number
	 * @returns JSX element.
	 * @description checks to see if the current attendant is present or not, and updates the present icon.
	 *
	 */
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

	//Returns the data points for the desktop view.
	const dataPointsLgScreen = memberData.map((x: Attendee, y: number): JSX.Element => {
		const tableTitle = tableName as keyof Attendee;

		return (
			<tr
				key={`attendant_row_${y}`}
				id={`attendant_row_${y}`}
				className={MathMethods.checkForEven(y) ? "" : "dark_row"}
			>
				<td>{x.lastName}</td>
				<td>{x.firstName}</td>
				<td className="present_data">{checkedOrNot(x[tableTitle] as number, y)}</td>
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

	//Returns the data points for mobile devices, this is a limited view so that the most important fields are displayed.
	const dataPointsMobile = memberData.map((x: Attendee, y: number): JSX.Element => {
		const tableTitle = tableName as keyof Attendee;

		return (
			<tr
				key={`attendant_row_${y}`}
				id={`attendant_row_${y}`}
				className={MathMethods.checkForEven(y) ? "" : "dark_row"}
			>
				<td>{`${x.lastName}, ${x.firstName}`}</td>
				<td className="present_data">{checkedOrNot(x[tableTitle] as number, y)}</td>
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

	//Table headers for large screen devices.
	const headersLgScreen: ValuesAndClass[] = [
		{ value: "Last Name", class: "last_name" },
		{ value: "First Name", class: "first_name" },
		{ value: "Present", class: "present_header" },
		{ value: "Delete", class: "delete" },
	];

	//Table headers for mobile devices.
	const headersMobileScreen: ValuesAndClass[] = [
		{ value: "Name", class: "name" },
		{ value: "Present", class: "present_header" },
		{ value: "Delete", class: "delete" },
	];

	/**
	 *
	 * @param arr Array of ValuesAndClass type.
	 * @returns Array of JSX elements.
	 * @description returns the needed table headers.
	 */
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

	/**
	 *
	 * @returns JSX Element
	 * @description returns the main content needed for the UI.
	 */
	const mainContent = (): JSX.Element => {
		return (
			<div
				className="attendance_table_wrapper"
				style={show ? { display: "" } : { display: "none" }}
			>
				<h2>{parentTitle}</h2>
				<h3>{title}</h3>
				<p>
					<strong>{totalPresent > 0 ? `Current Count: ${totalPresent}` : ""}</strong>{" "}
				</p>
				<div className="btn_group">
					<SearchBar updatePartial={updatePartial} />
					<SaveButton
						tableTitle={title}
						totalData={sumOfPresent}
						startLoading={startLoading}
						stopLoading={stopLoading}
						groupName={parentName}
						successHandler={displaySuccessMessage}
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

	const partialContent = (): JSX.Element => {
		return (
			<div
				className="attendance_table_wrapper"
				style={show ? { display: "" } : { display: "none" }}
			>
				<h2>{parentTitle}</h2>
				<h3>{title}</h3>
				<p>
					<strong>{totalPresent > 0 ? `Current Count: ${totalPresent}` : ""}</strong>{" "}
				</p>
				<div className="btn_group">
					<SearchBar updatePartial={updatePartial} />
				</div>
				<p>No results found.</p>
			</div>
		);
	}

	//If the attendance is 0, return a shell of what's needed, if not zero return the main content.
	if (partialSearch.length > 0 && attendanceData.length === 0) {
		return partialContent();
	} else if (attendanceData.length === 0) {
		return partialContent();
	} else {
		return mainContent();
	}
}
