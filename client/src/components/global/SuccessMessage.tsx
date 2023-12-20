import React, {useEffect} from "react";
import "../../assets/styles/components/global/successMessage.scss";

interface SuccessMessageProps {
    message: string;
    show: boolean;
    closeMessage: Function;
}

export default function SuccessMessage({message, show, closeMessage}: SuccessMessageProps): JSX.Element {

    //If the message is set to show it will close the message after a certain amount of time.
    useEffect((): void => {
        if (show) {
            setTimeout((): void => {
                closeMessage();
            }, 1000);
        } else {
            clearTimeout(1);
            closeMessage();
        }
    }, [show, closeMessage]);
    
    return (
        <div 
            className="alert_message_wrapper"
            style={show ? {opacity: '1', zIndex: "12"} : {opacity: '0', zIndex: "0"}}>
            <p className="alert_message_text">{message}</p>
        </div>
    )
}