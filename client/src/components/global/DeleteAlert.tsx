import React from "react";
import { DeleteProps, DeleteResponse } from "../../types/interfaces.ts";
import deleteData from "../../functions/api/delete.ts";
import putData from "../../functions/api/put.ts";
import "../../assets/styles/components/global/deleteAlert.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

export default function DeleteAlert({ message, hideHandler, url, show, deleteUser, triggerSuccessMessage, updateSuccessMessage, deleteBody, updateLoadingStatus, updateTheData, isMasterVisitor }: DeleteProps) {
	/**
	 *
	 * @param obj takes on an object of type of DeleteResponse
	 * @returns void
	 * @description triggers a succes message, updates the contents of the message and reloads the page.
	 */
	const deleteConfirmation = (obj: DeleteResponse): void => {
		triggerSuccessMessage();
		updateSuccessMessage(obj.message);
		updateLoadingStatus();
		updateTheData();
		hideHandler();
	};


	/**
	 * @returns void
	 * @description a general delete request.
	 */
	const generalDeleteMethod = (): void => {
		deleteData(url, deleteBody).then((data: DeleteResponse): void => {
			if (data.message === "failure") {
				updateLoadingStatus();
				setTimeout((): void => {
					alert(data.error);
				}, 200);
			} else {
				deleteConfirmation(data);
			}
		});
	};

	/**
	 *
	 * @param event Pointer event on a button
	 * @returns void
	 * @description deletes the data from database and then displays a confirmation or an alert.
	 */
	const deleteHandler = (event: React.PointerEvent<HTMLButtonElement>): void => {
		if (deleteUser) {
			updateLoadingStatus();

			//Checking this primarily for the People view, we are going to update a master visitor instead of deleting them completely.
			if (isMasterVisitor && isMasterVisitor === true) {
				putData(url, deleteUser).then((data: DeleteResponse): void => {
					if (data.message === "failure") {
						updateLoadingStatus();
						setTimeout(() => {
							alert(data.error);
						}, 200);
					} else {
						deleteConfirmation(data);
					}
				});
			} else {
				generalDeleteMethod();
			}
		} else {
			updateLoadingStatus();
			generalDeleteMethod();
		}
	};

	/**
	 *
	 * @param e Pointer event
	 * @returns void
	 * @description hides the alert.
	 */
	const hideAlert = (e: React.PointerEvent<HTMLButtonElement>): void => {
		hideHandler();
	};

	return (
		<div
			className="delete_alert_wrapper"
			style={show ? { display: "" } : { display: "none" }}
		>
			<div className="delete_alert">
				<button
					className="close_btn"
					onClick={hideAlert}
				>
					<FontAwesomeIcon icon={faClose} />
				</button>
				<p className="delete_message">{message}</p>
				<div className="button_wrapper">
					<button
						type="button"
						onClick={deleteHandler}
					>
						Yes
					</button>
					<button
						type="button"
						onClick={hideAlert}
					>
						No
					</button>
				</div>
			</div>
		</div>
	);
}
