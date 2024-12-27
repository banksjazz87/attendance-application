import React from "react";
import { PrintListStruct, APIResponse } from "../../types/interfaces";
import postData from "../../functions/api/post.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faDownload, faFile, faFileCircleXmark } from "@fortawesome/free-solid-svg-icons";
import "../../assets/styles/components/search/printList.scss";

interface PrintListProps {
	printListData: PrintListStruct[];
	currentPrintCount: number;
	viewHandler: Function;
	removeHandler: Function;
	deleteHandler: Function;
}

export default function PrintList({ printListData, currentPrintCount, viewHandler, removeHandler, deleteHandler }: PrintListProps): JSX.Element {
	//Define our table headers
	const tableHeaders: string[] = ["Attendance", "View", "Remove", "Delete"];

	//Create our table headers
	const headers = tableHeaders.map((x: string, y: number) => {
		return <th key={`print_list_table_header_${y}`}>{x}</th>;
	});

	//Used to display the selected item
	const viewClickHandler = (listData: PrintListStruct): void => {
		viewHandler(listData);
	};

	//This is called to create new CSV files that we can then download
	const requestCSV = (): void => {
		const requestedAttendanceTables = printListData.map((x: PrintListStruct): string => {
			return x.title;
		});

		let data = {
			columns: requestedAttendanceTables,
			table: `${printListData[0].groupName}_attendance`,
			group: `${printListData[0].groupName}`,
		};

		postData("/export-attendance/", data)
			.then((data: APIResponse): void => {
				if (data.message === "Success") {
					const downloadAttendanceButton: HTMLElement | null = document.getElementById("export_csv_data_button");

					downloadAttendanceButton?.click();
				}
			})
			.catch((error: APIResponse): void => {
				console.log("Error ", error.error);
			});
	};

	const generateList: JSX.Element[] = printListData.map((x: PrintListStruct, y: number): JSX.Element => {
		return (
			<tr key={`printList_item_${y}`}>
				<td>
					<p>{x.displayTitle}</p>
				</td>
				<td className="align_center">
					<button
						type="button"
						className="icon_button"
						onClick={() => viewClickHandler(x)}
					>
						<FontAwesomeIcon icon={faFile} />
					</button>
				</td>
				<td className="align_center">
					<button
						className="icon_button"
						type="button"
						onClick={(): void => removeHandler(y)}
					>
						<FontAwesomeIcon icon={faFileCircleXmark} />
					</button>
				</td>
				<td className="align_center">
					<button
						className="trash_can icon_button"
						type="button"
						onClick={(): void => deleteHandler(x)}
					>
						<FontAwesomeIcon icon={faTrashCan} />
					</button>
				</td>
			</tr>
		);
	});

	if (printListData.length > 0 && printListData[0].displayTitle.length > 0) {
		return (
			<div id="print_list_wrapper">
				<div id="table_wrapper">
					<h3>Documents set to export</h3>
					<table>
						<thead>
							<tr>{headers}</tr>
						</thead>
						<tbody>{generateList}</tbody>
					</table>
				</div>
				<div id="print_list_wrapper_footer">
					<button
						style={{ display: "none" }}
						type="button"
						onClick={() => requestCSV()}
					>
						{`Print all ${currentPrintCount}`}
					</button>

					<a
						id="export_csv_data_button"
						href={`/attendance-csv/${printListData[0].groupName}-Attendance`}
					>
						Download
						<FontAwesomeIcon icon={faDownload} />
					</a>
				</div>
			</div>
		);
	} else {
		return <div></div>;
	}
}
