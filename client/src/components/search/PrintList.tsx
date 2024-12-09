import React from "react";
import { DBAttendanceTitle } from "../../types/interfaces";

interface PrintListProps {
	printList: DBAttendanceTitle[];
}

export default function PrintList({printList}: PrintListProps): JSX.Element {

    const generateList: JSX.Element[] = printList.map((x: DBAttendanceTitle, y: number): JSX.Element => {
        return (
            <tr key={`printList_item_${y}`}>
                <td>
                    <p>{y + 1}</p>
                </td>
                <td>
                    <p>{x.title}</p>
                </td>
                <td>
                    <button type='button'>
                        View
                    </button>
                </td>
                <td>
                    <button type='button'>
                        Print
                    </button>
                </td>
                <td>
                    <button type='button'>
                        Remove
                    </button>
                </td>
            </tr>
        );
    });
    

    return (
        <div>
            <p>Print List</p>
            <ul>
                {generateList}
            </ul>


        </div>
    )
}