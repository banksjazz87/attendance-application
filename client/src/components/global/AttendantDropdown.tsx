import React, { useEffect, useState } from "react";
import { Attendee, APIPeople } from "../../types/interfaces.ts";
import postData from "../../functions/api/post.ts";

interface AttendantDropdownProps {
	show: boolean;
}
export default function AttendantDropdown({ show }: AttendantDropdownProps) {
	const initAttendee = {
		firstName: "",
		lastName: "",
		age: "",
		memberType: "",
		active: 0,
		id: -1,
	};
	const [attendants, setAttendants] = useState<Attendee[]>([initAttendee]);
	const [selectedAttendants, setSelectedAttendants] = useState<Attendee[]>([initAttendee]);

	useEffect(() => {
		fetch("/all-attendants")
			.then((data: Response): Promise<APIPeople> => {
				return data.json();
			})
			.then((final: APIPeople): void => {
				if (final.message === "Success") {
					console.log(final.data);
					setAttendants(final.data);
				} else {
					console.log("The following error has occured", final.error);
				}
			});
	}, []);

	const checkForMatch = (selectedAttendants: Attendee[], currentAttendant: Attendee): boolean => {
		let match = false;
		for (let i = 0; i < selectedAttendants.length; i++) {
			if (selectedAttendants[i].id === currentAttendant.id) {
				match = true;
			}
		}
		return match;
	};

	const changeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const copyOfCurrent = selectedAttendants.slice();
		const currentUser = attendants[parseInt(e.target.value as string)];

		if (checkForMatch(copyOfCurrent, currentUser)) {
			alert(`${currentUser.firstName} ${currentUser.lastName} has already been added to the list.`);
		} else {
			if (selectedAttendants[0].firstName.length < 1) {
				setSelectedAttendants([currentUser]);
			} else {
				setSelectedAttendants(copyOfCurrent.concat(currentUser));
			}
		}
	};

	const attendantOptions: JSX.Element[] = attendants.map((x: Attendee, y: number): JSX.Element => {
		return (
			<option
				key="attendee_y"
				value={y}
			>{`${x.lastName}, ${x.firstName}`}</option>
		);
	});

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

	const displaySelected: JSX.Element[] = selectedAttendants.map((x: Attendee, y: number): JSX.Element => {
		return <li key="selected_y">{`${y + 1}. ${x.lastName}, ${x.firstName}`}</li>;
	});

	const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log("This is the selected value");
	};

	return (
		<div
			id="attendant_dropdown_wrapper"
			style={show ? { display: "" } : { display: "none" }}
		>
			<div id="attendant_dropdown_box_wrapper">
				<form method="get">
					{showOptions()}
					<input
						type="submit"
						value="Submit"
					></input>
				</form>
				<div id="display_attendants_wrapper">
					<ul>{selectedAttendants[0].firstName.length > 0 && selectedAttendants.length > 0 ? displaySelected : ""}</ul>
				</div>
			</div>
		</div>
	);
}
