import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../assets/styles/components/global/textAndIconButton.scss";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface AddNewMemberButtonProps {
	show: boolean;
	clickHandler: Function;
	text: string;
	iconName: IconDefinition;
}

export default function TextAndIconButton({ show, clickHandler, text, iconName }: AddNewMemberButtonProps): JSX.Element {
	/**
	 *
	 * @param e button click
	 * @return void
	 * @description runs whatevern function is passed in as the clickHandler.
	 */
	const btnClickHandler = (e: React.MouseEvent<HTMLButtonElement>): void => {
		e.preventDefault();
		clickHandler();
	};

	return (
		<button
			style={show ? { display: "" } : { display: "none" }}
			type="button"
			onClick={btnClickHandler}
			className="add_new_member_btn"
		>
			<pre className="add_new_member_btn_text">{text}</pre>
			<FontAwesomeIcon
				className="add_member_icon"
				icon={iconName}
			/>
		</button>
	);
}
