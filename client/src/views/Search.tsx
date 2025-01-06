import React, { useState, useEffect } from "react";
import Navbar from "../components/global/Navbar.tsx";
import GroupDropDown from "../components/global/GroupDropDown.tsx";
import AttendanceDropDown from "../components/search/AttendanceDropdown.tsx";
import DisplayAttendance from "../components/search/DisplayAttendance.tsx";
import DeleteAlert from "../components/global/DeleteAlert.tsx";
import SuccessMessage from "../components/global/SuccessMessage.tsx";
import LoadingBar from "../components/global/LoadingBar.tsx";
import PrintList from "../components/search/PrintList.tsx";
import { resetInputValue } from "../functions/DOMUpdaters.ts";
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
	const [newAttendanceSelected, setNewAttendanceSelected] = useState<boolean>(false);

	const [printListData, setPrintListData] = useState<PrintListStruct[]>([initPrintList]);
	const [printCount, setPrintCount] = useState<number>(0);

	const [attendanceToShow, setAttendanceToShow] = useState<PrintListStruct>(initPrintList);
	const [attendanceData, setAttendanceData] = useState<Attendee[]>([]);

	const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
	const [tableToDelete, setTableToDelete] = useState<PrintListStruct>(initPrintList);

	const [showSuccess, setShowSuccess] = useState<boolean>(false);
	const [successMessage, setSuccessMessage] = useState<string>('');

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isDataUpdated, setIsDataUpdated] = useState<boolean>(false);


	//Update the print list data after a new group has been selected.
	useEffect((): void => {
		//Setting the first print list item
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

	
	//Used to update the printListData, after a new attendance has been selected.
	useEffect((): void => {
		if (newAttendanceSelected) {
			setNewAttendanceSelected(false);

			//Check if the item already exists in the export table
			let printListHasIndexOfSelected = false;
			for (let i = 0; i < printListData.length; i++) {
				if (printListData[i].title === selectedTable.title) {
					printListHasIndexOfSelected = true;
				}
			}
			//The ideal conditions are met
			if (selectedTable.title.length > 0 && !printListHasIndexOfSelected) {
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
				}

			//The item already exists in the export list
			} else if (printListHasIndexOfSelected && selectedTable.title.length > 0) {
				alert("This item is already included in the export list.");
				resetInputValue("table_selection");
			//An empty option has been selected.
			} else {
				alert("Please select a valid option");
				resetInputValue("table_selection");
			}
		}
	}, [selectedTable, newAttendanceSelected]);



	/**
	 * 
	 * @param currentGroup Object of the type Group
	 * @returns void
	 * @description get all of the attendances associated with the selected group.
	 */
	const getAttendanceLists = (currentGroup: Group): void => {
		fetch(`/group-lists/attendance/${currentGroup.name}`)
			.then((data: Response): Promise<APIAttendanceTitles> => {
				return data.json();
			})
			.then((final: APIAttendanceTitles): void => {
				if (final.message === "success") {
					setAttendanceTables(final.data);
					setShowAttendanceDropDown(true);
					setIsLoading(false);
				} else {
					setIsLoading(false);
					alert(final.error);
				}
			});
	}

	//Get attendance options based on the group that has been selected.
	useEffect(() => {
		if (groupTable.name.length > 0) {
			getAttendanceLists(groupTable);
		}
	}, [groupTable]);


	//Update the print count any time the print list changes.
	useEffect((): void => {
		setPrintCount(printListData.length);
	}, [printListData]);

	//Use to check if the data has been updated, this is fired after deleting an attendance.
	useEffect((): void => {
		if (isDataUpdated) {
			let currentPrintList: PrintListStruct[] = printListData.slice();
			let targetIndex: number = -1;

			//Get the index of the item that needs to be removed
			for (let i: number = 0; i < currentPrintList.length; i++) {
				if (currentPrintList[i].id === tableToDelete.id) {
					targetIndex = i;
				}
			}
			removeOneFromPrintList(targetIndex);
			getAttendanceLists(groupTable);
			setIsDataUpdated(false);
		}
	}, [isDataUpdated]);


	/**
	 * 
	 * @param arr array of type of Group
	 * @param value string
	 * @returns number or void
	 * @description returns the index of the selected group.
	 */
	const returnIndexOfSelected = (arr: Group[], value: string): number => {
		let index: number = -1;
		for (let i: number = 0; i < arr.length; i++) {
			if (arr[i].displayName === value) {
				index = i;
			}
		}
		return index;
	};


	/**
	 * @param void
	 * @return void
	 * @description Used to reset all of the state values, this will be used to reset everything if a new selection is selected from the group dropdown.
	 */
	const resetAllState = (): void => {
		setGroupTable(initGroup);
		setAttendanceTables([]);
		setShowAttendanceDropDown(false);
		setSelectedTable(initTable);
		setPrintListData([initPrintList]);
		setPrintCount(0);
		setAttendanceToShow(initPrintList);
		setAttendanceData([]);
	};

	/**
	 * 
	 * @param arr array of type of Group
	 * @param value string
	 * @returns void
	 * @description Gets the index of the selected group and updates the state of the group table, if a group has already been selected, all state will be set back to the init values.
	 */
	const dropDownChangeHandler = (arr: Group[], value: string): void => {
		let index = returnIndexOfSelected(arr, value);
		if (index > -1) {

			if (groupTable.name === '') {
				setGroupTable({
					...groupTable,
					name: arr[index]["name"],
					age_group: arr[index]["age_group"],
					displayName: value,
				});
				setShowAttendanceDropDown(false);
			} else {
				resetAllState();
				setGroupTable({
					...groupTable,
					name: arr[index]["name"],
					age_group: arr[index]["age_group"],
					displayName: value,
				});
			}
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


	//Updates the selected attendance, this happens after an option is selected from the "Select Attendance" field.
	const attDropDownChangeHandler = (arr: DBAttendanceTitle[], value: string): void => {
		updateSelectedTable(arr, value);
		setNewAttendanceSelected(true);
	};


	/**
	 * 
	 * @param index the index number of the item that needs to be removed.
	 * @returns void
	 * @description used to remove an item from the print list.
	 */
	const removeOneFromPrintList = (index: number): void => {

		if (printCount === 1) {
			setPrintListData([initPrintList]);

		} else {
			const currentList = printListData.slice();
			currentList.splice(index, 1);
			setPrintListData(currentList);
		}
	}


	/**
	 * 
	 * @param obj <PrintListStruct>
	 * @description pulls the needed attendance data, that needs to be shown, and scrolls into view of the attendance.
	 * @returns void
	 */
	const attendanceToShowUpdater = (obj: PrintListStruct): void => {
		setAttendanceToShow({
			...attendanceToShow,
			id: obj.id,
			title: obj.title,
			displayTitle: obj.displayTitle,
			dateCreated: obj.dateCreated,
			groupName: obj.groupName,
			groupDisplayName: obj.groupDisplayName
		});

		const groupTableName = `${obj.groupName}_attendance`;
		fetch(`/attendance/get-list-by-name/${groupTableName}/${obj.title}`)
			.then((data: Response): Promise<APIAttendanceSheet> => {
				return data.json();
			})
			.then((final: APIAttendanceSheet): void => {
				if (final.message === "success") {
					setAttendanceData(final.data);

					//Scroll to the new table
					setTimeout((): void => {
						const newTable = document.getElementById("display_attendance_wrapper");
						newTable?.scrollIntoView({ behavior: "smooth" });
					}, 200);
				} else {
					alert(final.error);
				}
			});
	}


	//Used to update the tableToDelete Object
	const setDeleteListHandler = (selectedObj: PrintListStruct): void => {
		setTableToDelete({
			...tableToDelete,
			id: selectedObj.id,
			title: selectedObj.title,
			displayTitle: selectedObj.displayTitle,
			dateCreated: selectedObj.dateCreated,
			groupName: selectedObj.groupName,
			groupDisplayName: selectedObj.groupDisplayName
		});
		setShowDeleteAlert(true);
	}



	return (
		<div>
			<Navbar />
			<div className="header_wrapper">
				<h1>Past Attendance</h1>
			</div>
			<div id="search_content_wrapper">
				<div id="form_download_wrapper">
					<h2>Create Export List</h2>
					<form>
						<GroupDropDown attendanceGroupSelected={dropDownChangeHandler} />

						<AttendanceDropDown
							attendanceSheets={attendanceTables}
							show={showAttendanceDropDown}
							changeHandler={attDropDownChangeHandler}
							allTitles={attendanceTables}
						/>
					</form>

					<PrintList
						printListData={printListData}
						currentPrintCount={printCount}
						viewHandler={attendanceToShowUpdater}
						removeHandler={removeOneFromPrintList}
						deleteHandler={setDeleteListHandler}
					/>
				</div>
				<DisplayAttendance
					sheetData={attendanceData}
					sheetTitle={attendanceToShow.displayTitle}
					presentColumn={attendanceToShow.title}
				/>

				<DeleteAlert
					message="Are you sure that you would like to permanently delete this attendance?"
					hideHandler={(): void => setShowDeleteAlert(false)}
					url={`/delete-attendance/${tableToDelete.groupName}/${tableToDelete.title}`}
					show={showDeleteAlert}
					triggerSuccessMessage={(): void => setShowSuccess(true) }
					updateSuccessMessage={(): void => setSuccessMessage(`${tableToDelete.displayTitle} has been deleted.`)}
					deleteBody={tableToDelete}
					updateLoadingStatus={(): void => setIsLoading(!isLoading)}
					updateTheData={(): void => setIsDataUpdated(true)}
				/>

				<SuccessMessage
					message={successMessage}
					show={showSuccess}
					closeMessage={(): void => setShowSuccess(false)}
				/>

				<LoadingBar 
					show={isLoading}
				/>
			</div>
		</div>
	);
}
