import React from "react";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../assets/styles/components/visitors/formDeleteModal.scss";

type FormDeleteModalProps = {
	show: boolean;
	hideHandler: Function;
	deleteAllHandler: Function;
	deleteFormOnlyHandler: Function;
	userName: string;
};

export default function FormDeleteModal({ show, hideHandler, deleteAllHandler, deleteFormOnlyHandler, userName }: FormDeleteModalProps): JSX.Element {

	const hideAlert = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => hideHandler();
	const deleteAll = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => deleteAllHandler();
	const deleteForm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => deleteFormOnlyHandler();

	return (
		<div
			className="form_delete_alert_wrapper"
			style={show ? { display: "" } : { display: "none" }}
		>
			<div className="delete_alert">
				<button
					className="close_btn"
					onClick={hideAlert}
				>
					<FontAwesomeIcon icon={faClose} />
				</button>
				<p className="delete_message">
					Would you like to delete all records associated with {userName}, or just the form data?
					<br />
					<span style={{ fontWeight: 500, fontSize: "16px", marginTop: "10px"}}>
						*<span style={{ fontWeight: 600 }} >Delete All</span> <em>will delete the following items: form data, visitor data, visitor's children data, visitor's spouse data, and remove all family members from the attendance sheet.</em>
					</span>
				</p>
				<div className="button_wrapper">
					<button
						type="button"
						onClick={deleteAll}
					>
						Delete All
					</button>
					<button
						type="button"
						onClick={deleteForm}
					>
						Delete the Form
					</button>
				</div>
			</div>
		</div>
	);
}

