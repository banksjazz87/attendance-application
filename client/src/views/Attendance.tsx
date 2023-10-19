import React, { useState, useEffect } from "react";
import Navbar from "../components/global/Navbar.tsx";
import DropDownForm from "../components/attendance/DropDownForm.tsx";
import AttendanceSheet from "../components/attendance/AttendanceSheet.tsx";
import NewMember from "../components/people/NewMember.tsx";
import TextAndIconButton from "../components/global/TextAndIconButton.tsx";
import DeleteAlert from "../components/global/DeleteAlert.tsx";
import SuccessMessage from "../components/global/SuccessMessage.tsx";
import LoadingBar from "../components/global/LoadingBar.tsx";
import { InitAttendee } from "../variables/initAttendee.ts";
import { Bool } from "../../src/types/types.ts";
import { Group, DBAttendanceTitle, APIAttendanceTitles, APIAttendanceSheet, Attendee, DBAllAttendance, APIAttendanceAllTitles } from "../../src/types/interfaces.ts";
import "../assets/styles/views/attendance.scss";
import { faUserPlus, faFile } from "@fortawesome/free-solid-svg-icons";

export default function Attendance(): JSX.Element {
	const [displayAttendance, setDisplayAttendance] = useState<Bool>(false);
	const [selectedGroup, setSelectedGroup] = useState<Group[]>([{ id: 0, name: "", age_group: "", displayName: "" }]);
	const [selectedAttendance, setSelectedAttendance] = useState<DBAllAttendance>({
		id: 0,
		title: "",
		displayTitle: "",
		parentGroup: "",
		dateCreated: "",
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

	//Used to pull data from the session storage.
	useEffect((): void => {
		if (sessionStorage.selectedTable && sessionStorage.selectedParent) {
			let tableToDisplay = JSON.parse(sessionStorage.selectedTable);
			let parentTable = JSON.parse(sessionStorage.selectedParent);
			let tableTitle = `${parentTable.name}_attendance`;

			setSelectedAttendance({
				...selectedAttendance,
				id: tableToDisplay.id,
				title: tableToDisplay.title,
				displayTitle: tableToDisplay.displayTitle,
				dateCreated: tableToDisplay.dateCreated,
			});

			let parent = JSON.parse(sessionStorage.selectedParent);
			setSelectedGroup([parent]);

			if (partialName.length > 0) {
				fetch(`/people/search/${tableTitle}/${partialName}`)
					.then((data: Response): Promise<APIAttendanceSheet> => {
						return data.json();
					})
					.then((final: APIAttendanceSheet): void => {
						if (final.message === "success") {
							selectAttendanceSheet(final.data);
						}
					});
			} else {
				fetch(`/attendance/get-list/${tableTitle}`)
					.then((data: Response): Promise<APIAttendanceSheet> => {
						return data.json();
					})
					.then((final: APIAttendanceSheet): void => {
						selectAttendanceSheet(final.data);
						console.log(final.data[0]);
					});
			}
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

	const showAttendanceHandler = (): void => {
		setDisplayAttendance(true);
	};

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

	const selectAttendanceSheet = (arr: Attendee[]): void => {
		setCurrentListData(arr);
		setDisplayAttendance(true);
	};

	const showNewMemberHandler = (): void => {
		showAddNewMember ? setShowAddNewMember(false) : setShowAddNewMember(true);
	};

	const dropDownSubmit = (value: string): void => {
		setSearching(true);

		fetch(`/group-lists/attendance/${value}`)
			.then((data: Response): Promise<APIAttendanceAllTitles> => {
				return data.json();
			})
			.then((final: APIAttendanceAllTitles): void => {
				setSelectedAttendance({ ...selectedAttendance, id: final.data[0].id, title: final.data[0].title, displayTitle: final.data[0].displayTitle, dateCreated: final.data[0].dateCreated });

				//Used to set the session storage
				const displayedSheet = {
					id: final.data[0].id,
					title: final.data[0].title,
					displayTitle: final.data[0].displayTitle,
					dateCreated: final.data[0].dateCreated,
				};

				const displayedJSON = JSON.stringify(displayedSheet);
				sessionStorage.setItem("selectedTable", displayedJSON);

				const selectedParent: Group = {
					id: selectedGroup[0].id,
					name: selectedGroup[0].name,
					age_group: selectedGroup[0].age_group,
					displayName: selectedGroup[0].displayName,
				};

				const jsonSelectedParent = JSON.stringify(selectedParent);
				sessionStorage.setItem("selectedParent", jsonSelectedParent);

				setSearching(false);
				console.log(final.data);

				const parentAttendanceList = `${final.data[0].parentGroup}_attendance`;

				fetch(`/attendance/get-list/${parentAttendanceList}`)
					.then((data: Response): Promise<APIAttendanceSheet> => {
						return data.json();
					})
					.then((final: APIAttendanceSheet): void => {
						selectAttendanceSheet(final.data);
						setShowOptionButtons(true);
						setShowDropDown(false);
						setSearching(false);
					});
			});
	};

	const updateDeleteMemberHandler = (arr: Attendee[], key: number): void => {
		let selectedAtt = arr[key];
		setUserToDelete(selectedAtt);
		setShowDeleteAlert(true);
	};

	const updatePartialName = (string: string): void => {
		setPartialName(string);
	};

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
					name={selectedGroup[0].name}
					groupSelectedHandler={selectGroup}
					groupHandler={dropDownSubmit}
					show={showDropDown}
				/>
				<div className="button_group">
					<TextAndIconButton
						show={showOptionButtons}
						text={"Add New Member"}
						iconName={faUserPlus}
						clickHandler={() => setShowAddNewMember(true)}
					/>
					<TextAndIconButton
						show={showOptionButtons}
						text={"Different Attendance"}
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
				/>
				<NewMember
					currentTable={selectedAttendance.title}
					show={showAddNewMember}
					showHandler={showNewMemberHandler}
					masterTable={false}
					triggerSuccessMessage={() => setShowSuccessMessage(true)}
					updateSuccessMessage={setNewSuccessMessage}
				/>
				<DeleteAlert
					message={`Are sure that you would like to delete ${userToDelete.firstName} ${userToDelete.lastName} from this attendance sheet?`}
					url={`/attendance-sheet/remove-person/${userToDelete.firstName}/${userToDelete.lastName}/${userToDelete.id}/${selectedGroup[0].name}`}
					show={showDeleteAlert}
					deleteUser={userToDelete}
					hideHandler={(): void => setShowDeleteAlert(false)}
					triggerSuccessMessage={() => setShowSuccessMessage(true)}
					updateSuccessMessage={setNewSuccessMessage}
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
