import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GroupDropDown from "../../components/global/GroupDropDown.tsx";
import AttendanceTitle from "../../components/newAttendance/AttendanceTitle.tsx";
import NewGroupForm from "../../components/newAttendance/NewGroupForm.tsx";
import { Group } from "../../types/interfaces.ts";
import { currentDate } from "../../variables/date.ts";
import postData from "../../functions/api/post.ts";
import { APIResponse, FormProps, APINewTable, NewAttendance, ApiResponse } from "../../types/interfaces.ts";
import "../../assets/styles/components/newAttendance/form.scss";

export default function Form({ show, formToShow, startLoading, stopLoading }: FormProps): JSX.Element {
	const navigate = useNavigate();

	const [form, setForm] = useState<NewAttendance>({
		title: currentDate,
		group: "",
		ageGroup: "",
		groupDisplayName: "",
	});

	//Using this to get all of the group names to compare against to determine if a new table needs to be created.
	const [allGroups, setAllGroups] = useState<Group[]>([]);

	//Used to get all of the current group names in the database.
	const setGroups = (arr: Group[]): void => {
		setAllGroups(arr);
	};

	//Change handler for the select element for selecting a group.
	const groupChange = (arr: Group[], value: string): void => {
		let index: number = 0;
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].displayName === value) {
				index = i;
			}
		}
		setForm({
			...form,
			groupDisplayName: value,
			group: arr[index]["name"],
			ageGroup: arr[index]["age_group"],
		});
	};

	//Update the title of the form.
	const titleChange = (value: string): void => {
		setForm({ ...form, title: value });
	};

	/**
	 *
	 * @param value string
	 * @param arr an array of the type Group.
	 * @returns boolean
	 * @description searches to see if a group already exists.
	 */
	const searchForGroup = (value: string, arr: Group[]): boolean => {
		let final = false;
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].displayName === value) {
				final = true;
			}
		}
		return final;
	};

	/**
	 *
	 * @param value
	 * @returns void
	 * @description updates the age group value.
	 */
	const setGroupAge = (value: string): void => {
		setForm({ ...form, ageGroup: value });
	};

	/**
	 *
	 * @param value string
	 * @returns void
	 * @description updates the group display name value and the group value.
	 */
	const setNewGroupName = (value: string): void => {
		setForm({ ...form, groupDisplayName: value, group: value });
	};

	/**
	 *
	 * @param str
	 * @returns string
	 * @description creates a database appropriate table name.
	 */
	const convertToDbTitle = (str: string): string => {
		let result: string = str.replace(/[.-/?!]/g, "_");
		let resultNoSpaces: string = result.replace(/ /g, "_");
		return resultNoSpaces;
	};

	/**
	 * @return void
	 * @description update the session storage for the current table to display.
	 */
	const updateSessionStorage = (): void => {
		const currentParent = {
			name: convertToDbTitle(form.group),
			displayName: form.groupDisplayName,
		};

		const currentAttendance = {
			title: convertToDbTitle(form.title),
			displayTitle: form.title,
		};

		const stringifyParent = JSON.stringify(currentParent);
		const stringifyAttendance = JSON.stringify(currentAttendance);

		sessionStorage.setItem("selectedParent", stringifyParent);
		sessionStorage.setItem("selectedAttendance", stringifyAttendance);
		sessionStorage.setItem("currentAttendancePage", "0");
	};

	/**
	 * 
	 * @param table string for the current table name, just needs to be the displayed group name.
	 * @param column string for the column (date) that you want to search for.
	 * @returns Promise<boolean | void> This will only return void if something goes wrong in getting the data, otherwise it will return true or false.
	 */
	const tableExists = async (table: string, column: string): Promise<boolean | void> => {

		const groupAttendanceName = `${table} attendance`;
		const tableResults: Response = await fetch(`/attendance/get-list-by-name/${groupAttendanceName}/${column}`);
		const results: ApiResponse = await tableResults.json();

		try {
			if (results.message === "success") {
				return true;
			} else {
				return false;
			}
		} catch (e: unknown) {
			console.log("error with the /attendance/get-list-by-name", e);
		}
	};

	//This adds the new attendance to the needed tables and adds a column to the end of the master table.
	const createNewAttendance = (): void => {
		postData("/new-attendance/create", form).then((data: APINewTable): void => {
			if (data.message === "success") {
				updateSessionStorage();
				setTimeout(() => {
					stopLoading();
					navigate("/attendance", { replace: true });
				}, 500);
			} else {
				stopLoading();
				alert("An error has occurred with the /new-attendance/create api.");
			}
		});
	};

	//Insert all attendants into the new table.
	const insertAll = (): void => {
		postData("/new-attendance/insert/all", form).then((data: APIResponse): void => {
			if (data.message === "success") {
				createNewAttendance();
			} else {
				alert("error with /new-attendance/insert/all");
			}
		});
	};

	//Insert all attendants with the correct age group into a new table.
	const insertSelectAttendants = (): void => {
		postData("/new-attendance/insert/select-attendants", form).then((data: APIResponse): void => {
			if (data.message === "success") {
				createNewAttendance();
			} else {
				alert("error with /new-attendance/insert/select-attendants");
			}
		});
	};

	//Insert the needed attendnts into a table.
	const insertNeededAttendants = (value: string): void => {
		if (value === "All") {
			insertAll();
		} else {
			insertSelectAttendants();
		}
	};


	//This is called in the submit handler only if an attendance sheet with the same name doesn't already exist.
	const createAllNeededTables = (): void => {
		if (formToShow === "Existing" && searchForGroup(form.groupDisplayName, allGroups)) {
			createNewAttendance();
		} else if (formToShow === "New" && searchForGroup(form.groupDisplayName, allGroups)) {
			alert("This group has already been created.");
			window.location.reload();
		} else if (formToShow === "New" && form.groupDisplayName.length === 0) {
			stopLoading();
			alert("Please create a group name.");
		} else {
			postData("/new-group", form).then((data: ApiResponse): void => {
				if (data.message === "success") {
					postData("/new-attendance/create/master/table", form).then((data: APINewTable): void => {
						if (data.message === "success") {
							insertNeededAttendants(form.ageGroup);
						} else {
							alert("Error with /new-attendance/master/table");
						}
					});
				} else {
					stopLoading();
					alert(`Failure with new-group ${data.data}`);
				}
			});
		}
	};

	/**
	 *
	 * @param e takes on the parameter of an event.
	 * @description final submithandler for the form, runs a number of different functions to create a new attendance sheet.
	 */
	const submitHandler = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();
		startLoading();
		
		const attendanceExists = await tableExists(form.groupDisplayName, form.title);

		try {
			if (attendanceExists === true) {
				alert("An attendance sheet for this name has already been created.  Please go to the attendance sheet view and select it from the dropdown.  Or you can create one with a different name.");
				stopLoading();
			} else if (attendanceExists === false) {
				createAllNeededTables();
			}
		} catch (e: unknown) {
			alert(`The following error has occured ${e}`);
		}
	};

	return (
		<form
			id="new_attendance_form"
			method="post"
			style={show ? { display: "" } : { display: "none" }}
			onSubmit={submitHandler}
		>
			<div
				id="form_group_dropdown_wrapper"
				style={formToShow === "Existing" ? { display: "" } : { display: "none" }}
			>
				<GroupDropDown
					currentGroups={allGroups}
					groupSelected={groupChange}
					getGroups={setGroups}
				/>
			</div>
			<div
				id="form_new_group_form_wrapper"
				style={formToShow === "New" ? { display: "" } : { display: "none" }}
			>
				<NewGroupForm
					groupSelected={setNewGroupName}
					ageHandler={setGroupAge}
				/>
			</div>
			<AttendanceTitle
				titleHandler={titleChange}
				attendanceTitle={form.title}
			/>
			<input
				type="submit"
				value="Submit"
			/>
		</form>
	);
}
