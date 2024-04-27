import React from "react";

interface VisitorRowProps {
    title: string;
    text: string;
    linkURL?: string;
}


export default function VisitorRow({title, text, linkURL}: VisitorRowProps) {

    if (linkURL) {
        return (
        <div className="visitorRow">
            <p>{title}</p>
            <a href={linkURL} target="_blank" rel="noreferrer">{text}</a>
        </div>
        );

    } else {
        return (
            <div className="visitorRow">
                <p>{title}</p>
                <p>{text}</p>
            </div>
        );
    }
}