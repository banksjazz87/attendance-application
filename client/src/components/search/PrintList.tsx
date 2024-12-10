import React from "react";
import { PrintListStruct } from "../../types/interfaces";

interface PrintListProps {
	printListData: PrintListStruct[];
}

export default function PrintList({ printListData }: PrintListProps): JSX.Element {
	
	const tableHeaders: string[] = ["", "Group", "Attendance", "View", "Print", "Delete"];

	const headers = tableHeaders.map((x: string, y: number) => {
        return <th key={`print_list_table_header_${y}`}>{x}</th>;
    });

       

	const generateList: JSX.Element[] = printListData.map((x: PrintListStruct, y: number): JSX.Element => {
		return (
			<tr key={`printList_item_${y}`}>
				<td>
					<p>{y + 1}</p>
				</td>
				<td>
					<p>{x.groupDisplayName}</p>
				</td>
				<td>
					<p>{x.displayTitle}</p>
				</td>
				<td>
					<button type="button">View</button>
				</td>
				<td>
					<button type="button">Print</button>
				</td>
				<td>
					<button type="button">Remove</button>
				</td>
			</tr>
		);
	});

	if (printListData.length > 0) {
		return (
			<div>
				<p>Print List</p>
				<tbody>
                    <tr>{headers}</tr>
					{generateList}
				</tbody>
			</div>
		);
    } else {
        return (
            <div></div>
        );
    }
}
