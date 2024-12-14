import React from "react";
import { PrintListStruct } from "../../types/interfaces";

interface PrintListProps {
	printListData: PrintListStruct[];
	currentPrintCount: number;
	viewHandler: Function;
	removeHandler: Function;
}

export default function PrintList({ printListData, currentPrintCount, viewHandler, removeHandler }: PrintListProps): JSX.Element {
	
	const tableHeaders: string[] = ["", "Group", "Attendance", "View", "Delete"];

	const headers = tableHeaders.map((x: string, y: number) => {
        return <th key={`print_list_table_header_${y}`}>{x}</th>;
	});

	const viewClickHandler = (listData: PrintListStruct): void => {
		viewHandler(listData);
	}

       

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
					<button type="button" onClick={() => viewClickHandler(x)}>View</button>
				</td>
				<td>
					<button type="button" onClick={(): void => removeHandler(y)}>Remove</button>
				</td>
			</tr>
		);
	});

	if (printListData.length > 0 && printListData[0].displayTitle.length > 0) {
		return (
			<div>
				<p>Print List</p>
				<tbody>
					<tr>{headers}</tr>
					{generateList}
				</tbody>
				<button type="button">{`Print all ${currentPrintCount}`}</button>
			</div>
		);
    } else {
        return (
            <div></div>
        );
    }
}
