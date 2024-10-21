import React, { useEffect, useState } from "react";
import { Attendee, APIPeople, APIResponse } from "../../types/interfaces.ts";
import postData from "../../functions/api/post.ts";
import { faTrashCan, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../assets/styles/components/global/attendantDropdown.scss";

interface AttendantDropdownProps {
	show: boolean;
	currentAttendance: Attendee[];
	currentTable: string;
	showHandler: Function;
	updateLoadingStatus: Function;
	updateData: Function;
	setSuccessText: Function;
	showSuccessMessage: Function;
}
export default function AttendantDropdown({ show, currentAttendance, currentTable, showHandler, updateLoadingStatus, updateData, setSuccessText, showSuccessMessage }: AttendantDropdownProps): JSX.Element {
	const initAttendee: Attendee = {
		firstName: "",
		lastName: "",
		age: "",
		memberType: "",
		active: 0,
		id: -1,
		visitorInActive: 0
	};
	const [attendants, setAttendants] = useState<Attendee[]>([initAttendee]);
	const [selectedAttendants, setSelectedAttendants] = useState<Attendee[]>([initAttendee]);

	//Get all of the available attendants, and set the attendants array.
	useEffect(() => {
		fetch("/all-attendants")
			.then((data: Response): Promise<APIPeople> => {
				return data.json();
			})
			.then((final: APIPeople): void => {
				if (final.message === "Success") {
					setAttendants(final.data);
				} else {
					alert(`The following error has occured: ${final.error}`);
				}
			});
	}, []);

	/**
	 *
	 * @param selectedAttendants Attendee[]
	 * @param currentAttendant Attendee
	 * @returns boolean
	 * @description check to see if the selected attendant already exists in an array, returns true if there's a match and false if there's no match.
	 */
	const checkForMatch = (selectedAttendants: Attendee[], currentAttendant: Attendee): boolean => {
		let match = false;
		for (let i = 0; i < selectedAttendants.length; i++) {
			if (selectedAttendants[i].id === currentAttendant.id) {
				match = true;
			}
		}
		return match;
	};

	/**
	 *
	 * @param e React.ChangeEvent<HTMLSelectElement>
	 * @returns void
	 * @description this is the change handler that is fired when an option is selected from the dropdown.  First checks to see if the attendant alread exists in either the main array from the Attendance view, or if it already exists in the current list.
	 */
	const changeHandler = (e: React.ChangeEvent<HTMLSelectElement>): void => {
		const copyOfCurrent: Attendee[] = selectedAttendants.slice();
		const currentUser: Attendee = attendants[parseInt(e.target.value as string)];

		if (checkForMatch(copyOfCurrent, currentUser) || checkForMatch(currentAttendance, currentUser)) {
			alert(`${currentUser.firstName} ${currentUser.lastName} is already included on this list.`);
		} else {
			if (selectedAttendants[0].firstName.length < 1) {
				setSelectedAttendants([currentUser]);
			} else {
				setSelectedAttendants(copyOfCurrent.concat(currentUser));
			}
		}
	};

	//Used to display the attendant options.
	const attendantOptions: JSX.Element[] = attendants.map((x: Attendee, y: number): JSX.Element => {
		return (
			<option
				key="attendee_y"
				value={y}
			>{`${x.lastName}, ${x.firstName}`}</option>
		);
	});

	/**
	 *
	 * @param e React.MouseEvent<HTMLButtonElement>
	 * @returns void
	 * @description removes the selected attendant from the current list.
	 */
	const removeMember = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
		const currentItem: HTMLElement = e.target as HTMLElement;
		const dataId: HTMLElement = currentItem.closest(".list_data") as HTMLElement;
		const idValue: string | null = dataId.getAttribute("data-reactId");
		let indexOfId = -1;

		for (let i = 0; i < selectedAttendants.length; i++) {
			if (selectedAttendants[i].id === parseInt(idValue as string)) {
				indexOfId = i;
			}
		}

		const copyOfAllAdded = selectedAttendants.slice();
		copyOfAllAdded.splice(indexOfId, 1);
		setSelectedAttendants(copyOfAllAdded);
	};

	//Reset the member array to the default value
	const resetMemberArray = (): void => {
		setSelectedAttendants([initAttendee]);
	};

	//Function that fires off when removing an existing member.
	const removeClickHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
		if (selectedAttendants.length === 1) {
			resetMemberArray();
		} else {
			removeMember(e);
		}
	};

	//Used to display the options for the select dropdown.
	const showOptions: Function = (): JSX.Element => {
		if (attendants[0].firstName.length > 1) {
			return (
				<select
					id="existing_attendant_dropdown"
					onChange={changeHandler}
				>
					<option>Choose from the following</option>
					{attendantOptions}
				</select>
			);
		} else {
			return (
				<select>
					<option>No options found</option>
				</select>
			);
		}
	};

	//Used to display any selected applicant, as a list item.
	const displaySelected: JSX.Element[] = selectedAttendants.map((x: Attendee, y: number): JSX.Element => {
		return (
			<div
				className="list_data"
				data-reactId={x.id}
			>
				<li key="selected_y">{`${y + 1}. ${x.lastName}, ${x.firstName}`}</li>
				<button
					type="button"
					className="trash_btn"
					onClick={removeClickHandler}
				>
					<FontAwesomeIcon
						className="trash_can"
						icon={faTrashCan}
					/>
				</button>
			</div>
		);
	});


	//This function fires if attendants have been added successfully.
	const successHandler = (): void => {
		setSuccessText("Success!  All attendants have been added.");
		updateData();
		showSuccessMessage();
		setTimeout((): void => {
			showHandler();
		}, 1500);
	}

	/**
	 *
	 * @param e React.FormEvent<HTMLFormElement>
	 * @returns void
	 * @description used for the final submit, adds all of the selected attendants to the list.
	 */
	const submitHandler = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault();
		updateLoadingStatus();

		//Create an array of the fields that we need for the database.
		const neededFields = selectedAttendants.map((x: Attendee, y: number): Object => {
			let currentObj = {
				id: x.id,
				firstName: x.firstName,
				lastName: x.lastName,
				age: x.age,
				memberType: x.memberType,
			};

			return currentObj;
		});

		//Put the array of needed fields in an object.
		const data: Object = { neededFields };

		//Make a post request to insert the new attendants.
		postData(`/attendance/insert/new-attendants/${currentTable}`, data).then((data: APIResponse): void => {
			if (data.message === "success") {
				successHandler();
			} else {
				setSuccessText(`Failure! The following error occurred: ${data.data}`);
				updateLoadingStatus();
			}
		});
	};

	return (
		<div
			className="full_height_popout"
			style={show ? { display: "" } : { display: "none" }}
		>
			<div id="attendant_dropdown_wrapper">
				<button
					className="close_btn"
					onClick={(e: React.MouseEvent<HTMLButtonElement>): void => showHandler()}
				>
					<FontAwesomeIcon icon={faClose} />
				</button>
				<div id="attendant_dropdown_box_wrapper">
					<h2>Add Existing Members</h2>
					<form
						method="get"
						onSubmit={submitHandler}
					>
						{showOptions()}
						<input
							type="submit"
							value="Submit"
						></input>
					</form>
					<div id="display_attendants_wrapper">
						<h3>Members set to be added:</h3>
						<ul>{selectedAttendants[0].firstName.length > 0 && selectedAttendants.length > 0 ? displaySelected : ""}</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
