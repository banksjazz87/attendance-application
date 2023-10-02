import React from "react";
import "../../assets/styles/components/global/successMessage.scss";

interface SuccessMessageProps {
    message: string;
    show: boolean;
}

export default function SuccessMessage({message, show}: SuccessMessageProps): JSX.Element {
    
    return (
        <div 
            className="alert_message_wrapper"
            style={show ? {display: ''} : {display: 'none'}}>
            <p className="alert_message_text">{message}</p>
        </div>
    )
}