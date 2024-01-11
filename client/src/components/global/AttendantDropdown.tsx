import React, { useEffect, useState } from "react";
import { Attendee, APIPeople, APIResponse } from "../../types/interfaces.ts";
import postData from "../../functions/api/post.ts";
import { faTrashCan, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SuccessMessage from "../../components/global/SuccessMessage.tsx";
import "../../assets/styles/components/global/attendantDropdown.scss";

interface AttendantDropdownProps {
	show: boolean;
    currentAttendance: Attendee[];
    currentTable: string;
    showHandler: Function;
}
export default function AttendantDropdown({ show, currentAttendance, currentTable, showHandler }: AttendantDropdownProps) {
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
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const [successText, setSuccessText] = useState<string>('');

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

	const attendantOptions: JSX.Element[] = attendants.map((x: Attendee, y: number): JSX.Element => {
		return (
			<option
				key="attendee_y"
				value={y}
			>{`${x.lastName}, ${x.firstName}`}</option>
		);
	});

    const removeClickHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        const currentItem = e.target as HTMLElement;
        const dataId = currentItem.closest('.list_data') as HTMLElement;
        const idValue = dataId.getAttribute('data-reactId');
        let indexOfId = -1;

        for (let i = 0; i < selectedAttendants.length; i++) {
            if (selectedAttendants[i].id === parseInt(idValue as string)) {
                indexOfId = i;
            }
        }

        const copyOfAllAdded = selectedAttendants.slice();
        copyOfAllAdded.splice(indexOfId, 1);
        setSelectedAttendants(copyOfAllAdded);
    }


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
		return (
            <div className="list_data" data-reactId={x.id}>
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
        ) 
	});

    const closeMessageHandler = (text: string): void => {
        if (text.includes('Success')) {
            setShowSuccess(false);
            setTimeout(() => {
                window.location.reload();
        }, 1500);   
        } else {
            setShowSuccess(false);
        }
    }

	const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
        
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

        const data = {neededFields};

		postData(`/attendance/insert/new-attendants/${currentTable}`, data)
            .then((data: APIResponse): void => {
                if (data.message === 'success') {
                    setSuccessText('Success!  All attendants have been added.')
                    setShowSuccess(true);
                } else {
                    setSuccessText(`Failure! The following error occurred: ${data.data}`)
                }
            });
	};

	return (
        <div className="full_height_popout" style={show ? { display: "" } : { display: "none" }}>
		<div
			id="attendant_dropdown_wrapper"
		>
            <button
                className="close_btn"
                onClick={(e: React.MouseEvent<HTMLButtonElement>): void => showHandler()}
            >
                <FontAwesomeIcon icon={faClose}/>
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
            <SuccessMessage 
                message={successText}
                show={showSuccess}
                closeMessage={() => closeMessageHandler(successText)}

            />
			</div>
		</div>
        </div>
	);
}
