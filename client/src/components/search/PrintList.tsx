import React from "react";
import { PrintListStruct, APIResponse } from "../../types/interfaces";
import postData from "../../functions/api/post.ts";

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
	};

	const requestCSV = (): void => {
		const requestedAttendanceTables = printListData.map((x: PrintListStruct): string => {
			return x.title;
		});

		let data = {
			columns: requestedAttendanceTables,
			table: `${printListData[0].groupName}_attendance`
		};

		postData('/export-attendance/', data)
			.then((data: APIResponse): void => {
				if (data.message === 'Success') {
					const downloadButton: HTMLElement | null = document.getElementById("export_csv_data_button");
					downloadButton?.click();
				}
			})
			.catch((error: APIResponse): void => {
				console.log('Error ', error.error)
			});
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
					<button
						type="button"
						onClick={() => viewClickHandler(x)}
					>
						View
					</button>
				</td>
				<td>
					<button
						type="button"
						onClick={(): void => removeHandler(y)}
					>
						Remove
					</button>
					<a href="/attendance-csv" target="_blank"> Export Data</a>
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
				<button
					type="button"
					onClick={() => requestCSV()}
				>{`Print all ${currentPrintCount}`}</button>
				<a
					id="export_csv_data_button"
					href={`/attendance-csv/${printListData[0].groupName}-Attendance`}
					target="_blank"
					rel="noreferrer"
				>
					Export Data
				</a>
			</div>
		);
	} else {
		return <div></div>;
	}
}
