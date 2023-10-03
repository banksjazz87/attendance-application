import React, {useEffect} from "react";
import "../../assets/styles/components/global/successMessage.scss";

interface SuccessMessageProps {
    message: string;
    show: boolean;
    closeMessage: Function;
}

export default function SuccessMessage({message, show, closeMessage}: SuccessMessageProps): JSX.Element {

    useEffect((): void => {
        if (show) {
            setTimeout((): void => {
                closeMessage();
            }, 3200);
        }
    }, [show, closeMessage]);
    
    return (
        <div 
            className="alert_message_wrapper"
            style={show ? {opacity: '1'} : {opacity: '0'}}>
            <p className="alert_message_text">{message}</p>
        </div>
    )
}