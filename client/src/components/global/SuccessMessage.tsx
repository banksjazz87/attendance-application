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
            let i: number = 0;
            let id: NodeJS.Timer = setInterval((): void => {
                i++;
                if (i === 1000) {
                    clearInterval(id);
                    closeMessage();
                }
            }, 1200);
        } else {
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