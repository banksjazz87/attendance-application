import React from "react";
import {APIResponse, SaveButtonProps, SentData} from "../../types/interfaces.ts";
import putData from "../../functions/api/put.ts";

export default function SaveButton ({tableTitle, totalData}: SaveButtonProps): JSX.Element {

    const clickHandler = (e: React.MouseEvent<HTMLButtonElement>): void => {
        let allTotalData: SentData = {
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