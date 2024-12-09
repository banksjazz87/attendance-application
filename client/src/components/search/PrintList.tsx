import React from "react";
import { PrintListStruct } from "../../types/interfaces";

interface PrintListProps {
	printList: PrintListStruct[];
}

export default function PrintList({ printList }: PrintListProps): JSX.Element {

	const generateTableHeaders = (): JSX.Element => {
        const tableHeaders: string[] = ["", "Group", "Attendance", "View", "Print", "Delete"];
        
		const headers = tableHeaders.map((x: string, y: number) => {
			return <th key={`print_list_table_header_${y}`}></th>;
		});

		return <tr>{headers}</tr>;
	};

	const generateList: JSX.Element[] = printList.map((x: PrintListStruct, y: number): JSX.Element => {
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

	return (
		<div>
			<p>Print List</p>
			<tbody>
				{generateTableHeaders()}
				{generateList}
			</tbody>
		</div>
	);
}