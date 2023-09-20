import React from "react";
import GroupDropDown from "../global/GroupDropDown.tsx";
import DateDropDown from "../dashboard/DateDropDown.tsx";
import { MonthsDataObj, YearsDataObj, AttendanceResponse, AttendanceTotals } from "../../types/interfaces.ts";
import "../../assets/styles/components/dashboard/allDataForm.scss";

interface AllDataFormProps {
	yearData: YearsDataObj[];
	yearHandler: Function;
	monthData: MonthsDataObj[];
	monthHandler: Function;
	group: string;
	month: string;
	year: string;
	submitHandler: Function;
	groupChange: Function;
	startLoading: Function;
	stopLoading: Function;
}

interface DataGraphSet {
	name: string;
	children: number;
	youth: number;
	adults: number;
	visitors: number;
	total: number;
}
export default function AllDataForm({ yearData, yearHandler, monthData, monthHandler, group, month, year, submitHandler, groupChange, startLoading, stopLoading }: AllDataFormProps) {
	const neededData = (arr: AttendanceTotals[]): DataGraphSet[] => {
		let array = [];
		for (let i = 0; i < arr.length; i++) {
			let dataSet = {
				name: arr[i].title,
				children: arr[i].totalChildren,
				youth: arr[i].totalYouth,
				adults: arr[i].totalAdults,
				visitors: arr[i].totalVisitors,
				total: arr[i].totalCount,
			};

			array.push(dataSet);
		}
		return array;
	};


	const scrollToGraph = (): void => {
		const graphElement = document.getElementById("line_graph") as HTMLElement;
		setTimeout(() => {
			graphElement.scrollIntoView({ behavior: "smooth" });
		}, 1000);
	};


	const formHandler = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault();
		startLoading();
		fetch(`/group-statistics/${group}/${month}/${year}`)
			.then((data: Response): Promise<AttendanceResponse> => {
				return data.json();
			})
			.then((final: AttendanceResponse): void => {
				if (final.message === "success") {
					neededData(final.data);
					submitHandler(final.data);
					scrollToGraph();
					stopLoading();
				} else {
					alert(`The following error occurred: ${final.error}`);
					stopLoading();
				}
			});
	};

	return (
		<form
			id="all_data_form"
			method="GET"
			action={`/group-statistics/${group}/${month}/${year}`}
			onSubmit={formHandler}
		>
			<h2>Statistics Selector</h2>
			<GroupDropDown attendanceGroupSelected={groupChange} />
			<div className="year_month_options">
				<DateDropDown
					dateData={yearData}
					changeHandler={yearHandler}
					keyWord="years"
					idTag="year_search"
					title="year"
				/>
				<DateDropDown
					dateData={monthData}
					changeHandler={monthHandler}
					keyWord="months"
					idTag="month_search"
					title="month"
				/>
			</div>
			<input
				type="submit"
				value="Submit"
				className="submit_button"
			/>
		</form>
	);
}
