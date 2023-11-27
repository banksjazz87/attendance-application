import React from "react";
import { APIResponse, SaveButtonProps, SentData } from "../../types/interfaces.ts";
import putData from "../../functions/api/put.ts";

export default function SaveButton({ tableTitle, groupName, totalData, startLoading, stopLoading, successHandler }: SaveButtonProps): JSX.Element {
	/**
	 *
	 * @param e React mouse event
	 * @returns void
	 * @description sets up needed data in an object, starts the loading graphic, updates the total value data in database, stops loading and fires a success message, or an alert.
	 */
	const clickHandler = (e: React.MouseEvent<HTMLButtonElement>): void => {
		//An object containing all of the data that's needed.
		let allTotalData: SentData = {
			title: tableTitle,
			group: groupName,
			data: totalData,
		};

		//Start the loading graphic.
		startLoading();

		//Update the database.
		putData("/attendance-total/update/", allTotalData).then((data: APIResponse): void => {
			if (data.message === "success") {
				stopLoading();
				successHandler(`${allTotalData.title} has been saved.`);
			} else {
				stopLoading();
				alert(`The following error has occured: ${data.error}`);
			}
		});
	};

	return (
		<button
			type="button"
			onClick={clickHandler}
		>
			Save
		</button>
	);
}
