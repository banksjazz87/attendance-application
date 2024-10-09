import React, { useEffect, useState } from "react";
import "../../assets/styles/components/global/successMessage.scss";

interface SuccessMessageProps {
	message: string;
	show: boolean;
	closeMessage: Function;
}

export default function SuccessMessage({ message, show, closeMessage }: SuccessMessageProps): JSX.Element {
	const [showMessage, setShowMessage] = useState<boolean>(false);

	//If the message is set to show it will close the message after a certain amount of time.
	// useEffect((): void => {
	//     if (show) {
	//         let i: number = 0;
	//         let id: NodeJS.Timer = setInterval((): void => {
	//             i++;
	//             if (i === 2) {
	//                 clearInterval(id);
	//                 closeMessage();
	//             }
	//         }, 1000);
	//     } else {
	//         closeMessage();
	//     }
	// }, [show, closeMessage]);

	useEffect((): void => {
        if (show) {
            setShowMessage(true);
			setTimeout((): void => {
				closeMessage();
				setShowMessage(false);
			}, 1200);
		} else {
			setShowMessage(false);
		}
	}, [show]);

	return (
		<div
			className="alert_message_wrapper"
			style={showMessage ? { opacity: "1", zIndex: "25" } : { opacity: "0", zIndex: "0" }}
		>
			<p className="alert_message_text">{message}</p>
		</div>
	);
}
