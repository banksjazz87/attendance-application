import React, { useState, useEffect } from "react";
import Navbar from "../components/global/Navbar.tsx";
import { Group, YearsDataResponse, YearsDataObj, MonthsDataObj, MonthsDataResponse, AttendanceTotals } from "../types/interfaces.ts";
import AllDataForm from "../components/dashboard/AllDataForm.tsx";
import DataGraph from "../components/dashboard/DataGraph.tsx";
import "../assets/styles/views/dashboard.scss";
import DateMethods from "../functions/dateMethods.ts";

export default function Dashboard() {
	const [selectedGroup, setSelectedGroup] = useState<string>("");
	const [dataYears, setDataYears] = useState<YearsDataObj[]>([]);
	const [searchYears, setSearchYears] = useState<boolean>(false);
	const [selectedYear, setSelectedYear] = useState<string>("");
	const [searchMonths, setSearchMonths] = useState<boolean>(false);
	const [dataMonths, setDataMonths] = useState<MonthsDataObj[]>([]);
	const [selectedMonth, setSelectedMonth] = useState<string>("");
	const [dataResults, setDataResults] = useState<AttendanceTotals[]>([]);

	//Used to update the valid years that can be used for the selected group.
	useEffect((): void => {
		if (searchYears) {
			fetch(`/group-years/${selectedGroup}`)
				.then((data: Response): Promise<YearsDataResponse> => {
					return data.json();
				})
				.then((final: YearsDataResponse): void => {
					if (final.message === "success") {
						console.log(final.data);
						setDataYears(final.data);
						setSearchYears(false);
					} else {
						alert(`The following error occurred, ${final.error}`);
						setDataYears([]);
						setSearchYears(false);
					}
				});
		}
	}, [searchYears, selectedGroup]);

	//Use to update the valid months according to the selected group and the selected year.
	useEffect((): void => {
		if (searchMonths) {
			fetch(`/group-months/${selectedYear}/${selectedGroup}`)
				.then((data: Response): Promise<MonthsDataResponse> => {
					return data.json();
				})
				.then((final: MonthsDataResponse): void => {
					if (final.message === "success") {
						setDataMonths(final.data);
						setSearchMonths(false);
					} else {
						alert(`The following error occurred, ${final.error}`);
						setDataMonths([]);
						setSearchMonths(false);
					}
				});
		}
	}, [selectedYear, searchMonths, selectedGroup]);

	useEffect((): void => {
		const date: Date = new Date();
		let month = date.getMonth();
		let monthName = DateMethods.getMonthName(month);

		console.log('THIS IS THE MONTH', monthName);
	}, []);

	const updateGroup = (arr: Group[], value: string): void => {
		for (let i = 0; i < arr.length; i++) {
			if (arr[i].displayName === value) {
				setSelectedGroup(arr[i].name);
				setSearchYears(true);
			}
		}
	};

	const yearChangeHandler = (value: string): void => {
		if (value.length > 0) {
			setSelectedYear(value);
			setSearchMonths(true);
		}
	};

	const monthChangeHandler = (value: string): void => {
		if (value.length > 0) {
			setSelectedMonth(value);
		}
	};

	const setAllDataResults = (arr: AttendanceTotals[]): void => {
		setDataResults(arr);
	};

	return (
		<div>
			<Navbar />
			<div className="header_wrapper">
				<h1>Dashboard</h1>
			</div>
			<div id="all_data_form_wrapper">
				<AllDataForm
					yearData={dataYears}
					yearHandler={yearChangeHandler}
					monthData={dataMonths}
					monthHandler={monthChangeHandler}
					group={selectedGroup}
					month={selectedMonth}
					year={selectedYear}
					submitHandler={setAllDataResults}
					groupChange={updateGroup}
				/>
				<DataGraph
					allData={dataResults}
					month={selectedMonth}
					year={selectedYear}
				/>
			</div>
		</div>
	);
}
