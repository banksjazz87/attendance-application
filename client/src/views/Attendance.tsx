import React, { useState, useEffect } from "react";
import Navbar from "../components/global/Navbar.tsx";
import DropDownForm from "../components/attendance/DropDownForm.tsx";
import AttendanceSheet from "../components/attendance/AttendanceSheet.tsx";
import NewMember from "../components/people/NewMember.tsx";
import TextAndIconButton from "../components/global/TextAndIconButton.tsx";
import DeleteAlert from "../components/global/DeleteAlert.tsx";
import SuccessMessage from "../components/global/SuccessMessage.tsx";
import LoadingBar from "../components/global/LoadingBar.tsx";
import AttendantDropdown from "../components/global/AttendantDropdown.tsx";
import { InitAttendee } from "../variables/initAttendee.ts";
import { Group, APIAttendanceSheet, Attendee, DBPartialAttendanceFields, PartialGroupFields, APIAttendanceAllTitles } from "../../src/types/interfaces.ts";
import "../assets/styles/views/attendance.scss";
import { faUserPlus, faFile, faUser } from "@fortawesome/free-solid-svg-icons";

export default function Attendance(): JSX.Element {
	const [displayAttendance, setDisplayAttendance] = useState<boolean>(false);
	const [selectedGroup, setSelectedGroup] = useState<PartialGroupFields[]>([{ name: "", displayName: "" }]);
	const [selectedAttendance, setSelectedAttendance] = useState<DBPartialAttendanceFields>({
		title: "",
		displayTitle: "",
	});

	const [showDropDown, setShowDropDown] = useState<boolean>(true);
	const [currentListData, setCurrentListData] = useState<Attendee[]>([]);
	const [showAddNewMember, setShowAddNewMember] = useState<boolean>(false);
	const [showOptionButtons, setShowOptionButtons] = useState<boolean>(false);
	const [userToDelete, setUserToDelete] = useState<Attendee>(InitAttendee);
	const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
	const [partialName, setPartialName] = useState<string>("");
	const [searching, setSearching] = useState<boolean>(false);
	const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
	const [successMessage, setSuccessMessage] = useState<string>("");
	const [showAttendantDropdown, setShowAttendantDropdown] = useState<boolean>(false);
	const [dataUpdated, setUpdatedData] = useState<boolean>(false);

	//Used to pull in the the main attendance that's needed.
	const getMainAttendance = async (title: string): Promise<void> => {
		const getTable: Response = await fetch(`/attendance/get-list/${title}`);
		const tableJSON: APIAttendanceSheet = await getTable.json();

		try {
			if (tableJSON.message === "success") {
				selectAttendanceSheet(tableJSON.data);
				setSearching(false);
			} else {
				setSearching(false);
				alert("/attendance/get-list/ error" + tableJSON.error);
			}
		} catch (e) {
			console.log("Error with the /attendance/get-list", e);
		}
	};

	//Used to check if an attendance is stored in the session storage and displays the attendance sheet if that's the case.
	useEffect((): void => {
		if (sessionStorage.selectedAttendance && sessionStorage.selectedParent) {
			let tableToDisplay = JSON.parse(sessionStorage.selectedAttendance);
			let parentTable = JSON.parse(sessionStorage.selectedParent);
			let tableTitle = `${parentTable.name}_attendance`;

			setSelectedAttendance({
				...selectedAttendance,
				title: tableToDisplay.title,
				displayTitle: tableToDisplay.displayTitle,
			});

			let parent = JSON.parse(sessionStorage.selectedParent);
			setSelectedGroup([parent]);
			getMainAttendance(tableTitle);
		}
	}, []);

	//Pulls data from the session storage for the selected parent to get the attendance title, and checks for a partial name search in the First or Last Name search box.
	useEffect((): void => {

		if (partialName.length > 0 && sessionStorage.selectedParent) {
			let parentTable = JSON.parse(sessionStorage.selectedParent);
			let tableTitle = `${parentTable.name}_attendance`;

			fetch(`/people/search/${tableTitle}/${partialName}`)
				.then((data: Response): Promise<APIAttendanceSheet> => {
					return data.json();
				})
				.then((final: APIAttendanceSheet): void => {
					if (final.message === "success") {
						selectAttendanceSheet(final.data);
						setSearching(false);
					} else {
						setSearching(false);
						alert(final.error);
					}
				});
		} else if (partialName.length === 0 && sessionStorage.selectedParent && sessionStorage.selectedAttendance) {
			let parentTable = JSON.parse(sessionStorage.selectedParent);
			let tableTitle = `${parentTable.name}_attendance`;
			getMainAttendance(tableTitle);
		} else {
			return;
		}
	}, [partialName]);

	//Used to determine if the dropdown and the show option buttons should be displayed.
	useEffect((): void => {
		if (displayAttendance) {
			setShowDropDown(false);
			setShowOptionButtons(true);
		} else {
			setShowDropDown(true);
			setShowOptionButtons(false);
		}
	}, [displayAttendance]);


	//Check to see if any of the data has been updated, if so get the table.
	useEffect((): void => {
		if (dataUpdated) {
			const tableName: string = `${selectedGroup[0].name}_attendance`;
			getMainAttendance(tableName).then(data => {
				setUpdatedData(false);
			});
		}
	}, [dataUpdated]);



	const showAttendanceHandler = (): void => {
		setDisplayAttendance(true);
	};

	/**
	 *
	 * @param groupArray array of type group
	 * @param value string
	 * @returns void
	 * @description updates the state of the group that's selected.
	 */
	const selectGroup = (groupArray: Group[], value: string): void => {
		let arrayCopy = groupArray.slice();
		let index = 0;
		let copyOfCurrentSelected = selectedGroup.slice();

		for (let i = 0; i < arrayCopy.length; i++) {
			if (arrayCopy[i].displayName === value) {
				index = i;
			}
		}

		copyOfCurrentSelected[0] = arrayCopy[index];
		setSelectedGroup(copyOfCurrentSelected);
		setDisplayAttendance(false);
		setShowOptionButtons(false);
	};

	//Used to select the attendance sheet and display it.
	const selectAttendanceSheet = (arr: Attendee[]): void => {
		setCurrentListData(arr);
		setDisplayAttendance(true);
	};

	//Displays the option to add a new member.
	const showNewMemberHandler = (): void => {
		showAddNewMember ? setShowAddNewMember(false) : setShowAddNewMember(true);
	};

	/**
	 *
	 * @param value string
	 * @returns void
	 * @description returns the most recent attendance sheet for the selected group.
	 */
	const dropDownSubmit = (value: string): void => {
		setSearching(true);
		fetch(`/group-lists/attendance/${value}`)
			.then((data: Response): Promise<APIAttendanceAllTitles> => {
				return data.json();
			})
			.then((final: APIAttendanceAllTitles): void => {
				if (final.data.length === 0 && final.message === "success") {
					setSearching(false);
					setTimeout(() => alert("No data has been found for this group, please create a new attendance sheet."), 500);
					setDisplayAttendance(false);
				} else if (final.message === "success" && final.data.length > 0) {
					setSelectedAttendance({ ...selectedAttendance, title: final.data[0].title, displayTitle: final.data[0].displayTitle });

					// Used to set the session storage for the selected attendance.
					const displayedSheet = {
						title: final.data[0].title,
						displayTitle: final.data[0].displayTitle,
					};

					const displayedJSON = JSON.stringify(displayedSheet);
					sessionStorage.setItem("selectedAttendance", displayedJSON);

					// Set the session storage for the selected group
					const selectedParent: PartialGroupFields = {
						name: selectedGroup[0].name,
						displayName: selectedGroup[0].displayName,
					};

					const jsonSelectedParent = JSON.stringify(selectedParent);
					sessionStorage.setItem("selectedParent", jsonSelectedParent);

					const parentAttendanceList = `${final.data[0].parentGroupValue}_attendance`;

					fetch(`/attendance/get-list/${parentAttendanceList}`)
						.then((data: Response): Promise<APIAttendanceSheet> => {
							return data.json();
						})
						.then((final: APIAttendanceSheet): void => {
							if (final.message === "success") {
								selectAttendanceSheet(final.data);
								setShowOptionButtons(true);
								setShowDropDown(false);
								setSearching(false);
							} else {
								setSearching(false);
								alert(final.error);
							}
						});
				} else {
					setSearching(false);
					alert(final.error);
				}
			});
	};

	//Used to delete a member.
	const updateDeleteMemberHandler = (arr: Attendee[], key: number): void => {
		let selectedAtt = arr[key];
		setUserToDelete(selectedAtt);
		setShowDeleteAlert(true);
	};

	//Used to update the state of the parital name, this is passed through the search bar.
	const updatePartialName = (string: string): void => {
		setPartialName(string);
	};

	//Used to set the contents of the success message.
	const setNewSuccessMessage = (str: string): void => {
		setSuccessMessage(str);
	};

	return (
		<div id="attendance_wrapper">
			<Navbar />
			<div className="header_wrapper">
				<h1>Attendance</h1>
			</div>
			<div id="attendance_content_wrapper">
				<DropDownForm
					clickHandler={showAttendanceHandler}
					name={selectedGroup[0].displayName}
					groupSelectedHandler={selectGroup}
					groupHandler={dropDownSubmit}
					show={showDropDown}
				/>
				<div className="button_group">
					<TextAndIconButton
						show={showOptionButtons}
						text={"Add\r\nNew"}
						iconName={faUserPlus}
						clickHandler={() => setShowAddNewMember(true)}
					/>
					<TextAndIconButton
						show={showOptionButtons}
						text={"Add\r\nExisting"}
						iconName={faUser}
						clickHandler={() => setShowAttendantDropdown(true)}
					/>
					<TextAndIconButton
						show={showOptionButtons}
						text={"Different\r\nAttendance"}
						iconName={faFile}
						clickHandler={() => {
							setDisplayAttendance(false);
							setShowDropDown(true);
						}}
					/>
				</div>
				<AttendanceSheet
					show={displayAttendance}
					title={selectedAttendance.displayTitle}
					tableName={selectedAttendance.title}
					parentName={selectedGroup[0].name}
					attendanceData={currentListData}
					parentTitle={selectedGroup[0].displayName}
					deleteMemberHandler={updateDeleteMemberHandler}
					updatePartial={updatePartialName}
					activeSearch={searching}
					startLoading={() => setSearching(true)}
					stopLoading={() => setSearching(false)}
					triggerSuccessMessage={(): void => setShowSuccessMessage(true)}
					hideSuccessMessage={(): void => setShowSuccessMessage(false)}
					updateSuccessMessage={setNewSuccessMessage}
					partialSearch={partialName}
				/>
				<NewMember
					currentTable={`${selectedGroup[0].name}_attendance`}
					currentAttendanceColumn={selectedAttendance.title}
					show={showAddNewMember}
					showHandler={showNewMemberHandler}
					masterTable={false}
					triggerSuccessMessage={(): void => setShowSuccessMessage(true)}
					updateSuccessMessage={setNewSuccessMessage}
					updateLoadingStatus={(): void => setSearching(!searching)}
				/>
				<AttendantDropdown
					show={showAttendantDropdown}
					currentAttendance={currentListData}
					currentTable={`${selectedGroup[0].name}_attendance`}
					showHandler={(): void => setShowAttendantDropdown(false)}
					updateLoadingStatus={(): void => setSearching(!searching)}
					updateData={(): void => setUpdatedData(true)}
				/>
				<DeleteAlert
					message={`Are sure that you would like to delete ${userToDelete.firstName} ${userToDelete.lastName} from this attendance sheet?`}
					url={`/attendance-sheet/remove-person/${userToDelete.firstName}/${userToDelete.lastName}/${userToDelete.id}/${selectedGroup[0].name}`}
					show={showDeleteAlert}
					deleteUser={userToDelete}
					hideHandler={(): void => setShowDeleteAlert(false)}
					triggerSuccessMessage={() => setShowSuccessMessage(true)}
					updateSuccessMessage={setNewSuccessMessage}
					deleteBody={{}}
					updateLoadingStatus={(): void => setSearching(!searching)}
				/>
				<LoadingBar show={searching} />
				<SuccessMessage
					message={successMessage}
					show={showSuccessMessage}
					closeMessage={() => setShowSuccessMessage(false)}
				/>
			</div>
		</div>
	);
}
