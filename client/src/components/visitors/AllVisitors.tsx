import React from "react";
import { Attendee } from "../../types/interfaces.ts";

interface AllVisitorProps {
    allPeople: Attendee[];
    totalRows: number;
    updateOffsetHandler: Function;
    offSetIncrement: number;
    updatePartial: Function;
    activeSearch: boolean;
}

export default function AllVisitors({allPeople, totalRows, updateOffsetHandler, offSetIncrement, updatePartial, activeSearch}: AllVisitorProps) {
    return (
        <>
            <h1>All Visitors here</h1>
        </>
    )
}