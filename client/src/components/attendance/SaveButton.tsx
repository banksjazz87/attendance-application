import React from "react";
import {TotalSum} from "../../types/interfaces.tsx";

interface SaveButtonProps {
    tableTitle: string;
    totalData: TotalSum
}
export default function SaveButton ({tableTitle, totalData}: SaveButtonProps): JSX.Element {
    return (
        <button type="button" onClick={(e: React.MouseEvent<HTMLButtonElement>): void => console.log(totalData)}>Save</button>
    )
}