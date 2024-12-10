import React, { useState, useEffect } from "react";
import Navbar from "../components/global/Navbar.tsx";
import GroupDropDown from "../components/global/GroupDropDown.tsx";
import AttendanceDropDown from "../components/search/AttendanceDropdown.tsx";
import DisplayAttendance from "../components/search/DisplayAttendance.tsx";
import PrintList from "../components/search/PrintList.tsx";
import { Group, APIAttendanceTitles, DBAttendanceTitle, Attendee, APIAttendanceSheet, PrintListStruct } from "../types/interfaces.ts";
import "../assets/styles/views/search.scss";


export default function Search(): JSX.Element {
	const initGroup = {
		name: "",
		age_group: "",
		displayName: "",
	};

	const initTable = {
		id: -1,
		title: "",
		displayTitle: "",
		dateCreated: "",
	};

	const initPrintList: PrintListStruct = {
		id: -1,
		title: "",
		displayTitle: "",
		dateCreated: "",
		groupName: '', 
		groupDisplayName: '',
	}

	const [groupTable, setGroupTable] = useState<Group>(initGroup);
	const [attendanceTables, setAttendanceTables] = useState<DBAttendanceTitle[]>([]);
	const [showAttendanceDropDown, setShowAttendanceDropDown] = useState<boolean>(false);
	const [selectedTable, setSelectedTable] = useState<DBAttendanceTitle>(initTable);
	const [selectedAttendance, setSelectedAttendance] = useState<Attendee[]>([]);

	const [printListData, setPrintListData] = useState<PrintListStruct[]>([initPrintList]);
	const [printCount, setPrintCount] = useState<number>(0);



	useEffect((): void => {
		if (printListData.length === 1 && printListData[0].id === -1) {
			const copyOfPrint: PrintListStruct[] = printListData.slice();
			const firstPrint = copyOfPrint[0];
			firstPrint.groupName = groupTable.name;
			firstPrint.groupDisplayName = groupTable.displayName;

			setPrintListData(copyOfPrint);

		} else {
			const copyOfPrint: PrintListStruct[] = printListData.slice();
			let newGroup: PrintListStruct[] = [initPrintList];
			newGroup[0].groupName = groupTable.name;
			newGroup[0].groupDisplayName = groupTable.displayName;

			setPrintListData(copyOfPrint.concat(newGroup));
		}

	}, [groupTable]);

	
	useEffect((): void => {
		const lastItem: number = printListData.length - 1;
		const currentList: PrintListStruct[] = printListData.slice();

		if (printListData[lastItem].title === "") {
			currentList[lastItem] = {
				id: selectedTable.id,
				title: selectedTable.title,
				displayTitle: selectedTable.displayTitle,
				dateCreated: selectedTable.dateCreated,
				groupName: currentList[lastItem].groupName,
				groupDisplayName: currentList[lastItem].groupDisplayName,
			};

			setPrintListData(currentList);
			setPrintCount((c) => printCount + c);

		} else {
			const newEntry: PrintListStruct = {
				id: selectedTable.id,
				title: selectedTable.title,
				displayTitle: selectedTable.displayTitle,
				dateCreated: selectedTable.dateCreated,
				groupName: currentList[lastItem].groupName,
				groupDisplayName: currentList[lastItem].groupDisplayName,
			};

			const updatedArray = currentList.concat(newEntry);
			setPrintListData(updatedArray);
			setPrintCount((c) => printCount + c);
		}
	}, [selectedTable]);




	/**
	 * 
	 * @param arr array of type of Group
	 * @param value string
	 * @returns number or void
	 * @description returns the index of the selected group.
	 */
	const returnIndexOfSelected = (arr: Group[], value: string): number => {
		let index = -1;
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].displayName === value) {
				index = i;
			}
		}
		return index;
	};


	/**
	 * 
	 * @param arr array of type of Group
	 * @param value string
	 * @returns void
	 * @description Gets the index of the selected group and updates the state of the group table.
	 */
	const dropDownChangeHandler = (arr: Group[], value: string): void => {
		let index = returnIndexOfSelected(arr, value);
		if (index > -1) {
			setGroupTable({
				...groupTable,
				name: arr[index]["name"],
				age_group: arr[index]["age_group"],
				displayName: value,
			});
			setShowAttendanceDropDown(false);	
		} 
	};


	/**
	 * 
	 * @param arr array with type of DBAttendanceTitle
	 * @param value string
	 * @returns void
	 * @description updates the state of the selected table.
	 */
	const updateSelectedTable = (arr: DBAttendanceTitle[], value: string): void => {
		let index = 0;

		for (let i = 0; i < arr.length; i++) {
			if (arr[i].title === value) {
				index = i;
			}
		}

		setSelectedTable({
			...selectedTable,
			id: arr[index].id,
			title: arr[index].title,
			displayTitle: arr[index].displayTitle,
			dateCreated: arr[index].dateCreated,
		});
	};


	//Gets the attendance information from the selected group and updates the selected table and sets the selected attendance.
	const attDropDownChangeHandler = (arr: DBAttendanceTitle[], value: string): void => {
		const groupTableName = `${groupTable.name}_attendance`;
		fetch(`/attendance/get-list-by-name/${groupTableName}/${value}`)
			.then((data: Response): Promise<APIAttendanceSheet> => {
				return data.json();
			})
			.then((final: APIAttendanceSheet): void => {
				if (final.message === "success") {
					updateSelectedTable(arr, value);
					setSelectedAttendance(final.data);
				} else {
					alert(final.error);
				}
			});
	};


	//Returns all of the attendance titles found for the selected group name.
	const submitHandler = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault();
		fetch(`/group-lists/attendance/${groupTable.name}`)
			.then((data: Response): Promise<APIAttendanceTitles> => {
				return data.json();
			})
			.then((final: APIAttendanceTitles): void => {
				if (final.message === "success") {
					setAttendanceTables(final.data);
					setShowAttendanceDropDown(true);
				} else {
					alert(final.error);
				}
			});
	};

	return (
		<div>
			<Navbar />
			<div className="header_wrapper">
				<h1>Past Attendance</h1>
			</div>
			<div id="search_content_wrapper">
				<form
					method="GET"
					action="/group-lists/attendance/"
					onSubmit={submitHandler}
				>
					<GroupDropDown attendanceGroupSelected={dropDownChangeHandler} />
					<input
						type="submit"
						value="Submit"
					/>

					<AttendanceDropDown
						attendanceSheets={attendanceTables}
						show={showAttendanceDropDown}
						changeHandler={attDropDownChangeHandler}
						allTitles={attendanceTables}
					/>
				</form>

				<PrintList 
					printListData={printListData}
				/>

				<DisplayAttendance
					sheetData={selectedAttendance}
					sheetTitle={selectedTable.displayTitle}
					presentColumn={selectedTable.title}
				/>
			</div>
		</div>
	);
}
