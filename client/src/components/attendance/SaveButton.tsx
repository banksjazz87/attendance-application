import React from "react";
import {TotalSum, APIResponse} from "../../types/interfaces.ts";
import putData from "../../functions/api/put.ts";

interface SaveButtonProps {
    tableTitle: string;
    totalData: TotalSum
}

interface sentData {
    title: string;
    data: TotalSum
}
export default function SaveButton ({tableTitle, totalData}: SaveButtonProps): JSX.Element {

    const clickHandler = (e: React.MouseEvent<HTMLButtonElement>): void => {
        let allTotalData: sentData = {
            title: tableTitle,
            data: totalData
        }

        putData('/attendance-total/update/', allTotalData).then((data: APIResponse): void => {
                if (data.message === "success") {
                    alert(`${allTotalData.title} has been saved.`)
                } else {
                    alert(`The following error has occured: ${data.error}`);
                }
            });
    }

    return (
        <button type="button" onClick={clickHandler}>Save</button>
    )
}