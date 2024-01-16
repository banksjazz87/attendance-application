import React from "react";
import { GroupProps } from "../../types/interfaces.ts";
import "../../assets/styles/components/newAttendance/newGroupForm.scss";

export default function NewGroupForm({ groupSelected, ageHandler, createBlankListHandler }: GroupProps): JSX.Element {
	const groupAge = ["Select One", "All", "Adult", "Youth", "Child"];

	/**
	 *
	 * @param e change event on an input element.
	 * @returns void
	 * @description updates the group selected state.
	 */
	const changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
		if (groupSelected) {
			groupSelected(e.target.value);
		}
	};

	/**
	 *
	 * @param e change event on a select field
	 * @returns void
	 * @description updates the target age of the group.
	 */
	const selectAgeHandler = (e: React.ChangeEvent<HTMLSelectElement>): void => {
		if (ageHandler) {
			ageHandler(e.target.value);
		}
	};

	//Display the group ages that can be chosen.
	const groupOptions = groupAge.map((x: string, y: number): JSX.Element => {
		return (
			<option
				key={`groupNames_${y}`}
				value={x === "Select One" ? "" : x}
			>
				{x}
			</option>
		);
	});

	//Used to update the state to determine if an attendance sheet should be blank.
	const blankListHandler = (e: React.MouseEvent<HTMLInputElement, MouseEvent>): void | undefined => {
		if (createBlankListHandler) {
			let selectedElement = e.target as HTMLInputElement;
			createBlankListHandler(selectedElement.value);
		}
	};

	return (
		<div id="new_group_wrapper">
			<div className="input_wrapper">
				<label
					id="new_group"
					htmlFor="new_group"
				>
					Group Name
				</label>
				<input
					type="text"
					id="new_group"
					onChange={changeHandler}
				/>
			</div>
			<div className="input_wrapper">
				<label htmlFor="group_age_select">Select Age</label>
				<select
					id="group_age_select"
					onChange={selectAgeHandler}
				>
					{groupOptions}
				</select>
			</div>
			<div
				id="create_blank_sheet_wrapper"
				className="input_wrapper"
			>
				<p>Would you like to create a blank attendance sheet?</p>
				<div className="two_col_input_wrapper">
					<div className="inner_input_wrapper">
						<input
							id="yes"
							type="radio"
							name="insert-group"
							value="yes"
							onClick={blankListHandler}
						/>
            <label htmlFor="yes">Yes</label>
					</div>
					<div className="inner_input_wrapper">
						<input
							id="no"
							type="radio"
							name="insert-group"
							value="no"
							onClick={blankListHandler}
						/>
            <label htmlFor="no">No, add the selected age group.</label>
					</div>
				</div>
			</div>
		</div>
	);
}
