import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "../../assets/styles/components/login/welcomeUser.scss";

interface WelcomeUserProps {
	userName: string;
}
export default function WelcomeUser({ userName }: WelcomeUserProps): JSX.Element {
	const navigate: Function = useNavigate();

	const yesHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
		navigate("/new-attendance", { replace: "true" });
	};

	const noHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
		Cookies.remove("account");
		Cookies.remove("loggedIn");
		window.location.reload();
	};

	return (
		<div
			id="welcome_page_wrapper"
			style={userName.length > 0 ? { opacity: "1", marginLeft: "0" } : { opacity: "0", marginLeft: "-1280px" }}
		>
			<div id="welcome_wrapper">
				<p>{`Welcome ${userName} would you like to continue as ${userName}?`} </p>
				<div className="button_group">
					<button
						type="button"
						onClick={yesHandler}
					>
						Yes
					</button>
					<button
						type="button"
						onClick={noHandler}
					>
						No
					</button>
				</div>
			</div>
		</div>
	);
}
