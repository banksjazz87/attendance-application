import React, { useState, useEffect } from "react";
import Navbar from "../components/global/Navbar.tsx";
import { Group, YearsDataResponse, YearsDataObj, MonthsDataObj, MonthsDataResponse, AttendanceTotals, AttendanceResponse } from "../types/interfaces.ts";
import AllDataForm from "../components/dashboard/AllDataForm.tsx";
import DataGraph from "../components/dashboard/DataGraph.tsx";
import "../assets/styles/views/dashboard.scss";
import DateMethods from "../functions/dateMethods.ts";
import LoadingBar from "../components/global/LoadingBar.tsx";
import { faScaleUnbalancedFlip } from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
	const [selectedGroup, setSelectedGroup] = useState<string>("");
	const [dataYears, setDataYears] = useState<YearsDataObj[]>([]);
	const [searchYears, setSearchYears] = useState<boolean>(false);
	const [selectedYear, setSelectedYear] = useState<string>("");
	const [searchMonths, setSearchMonths] = useState<boolean>(false);
	const [dataMonths, setDataMonths] = useState<MonthsDataObj[]>([]);
	const [selectedMonth, setSelectedMonth] = useState<string>("");
	const [dataResults, setDataResults] = useState<AttendanceTotals[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	//Main attendance to display for the user.
	const mainAttendance: string = "Sunday_Service";

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

		//Get month name
		let month = date.getMonth();
		let monthName = DateMethods.getMonthName(month + 1);

		//Get the year
		let year: string = date.getUTCFullYear().toString();

		//Update the current states
		setSelectedMonth(monthName ? monthName : "");
		setSelectedYear(year);
		setSelectedGroup(mainAttendance);

		setIsLoading(true);

		//Get current statistics for the current month
		fetch(`/group-statistics/${mainAttendance}/${monthName}/${year}`)
			.then((data: Response): Promise<AttendanceResponse> => {
				return data.json();
			})
			.then((final: AttendanceResponse): void => {
				if (final.message === "success") {
					setDataResults(final.data);
					setIsLoading(false);
				} else {
					alert(final.error);
					setIsLoading(false);
				}
			});
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
					startLoading={() => setIsLoading(true)}
					stopLoading={() => setIsLoading(false)}
				/>
				<DataGraph
					allData={dataResults}
					month={selectedMonth}
					year={selectedYear}
				/>
				<LoadingBar show={isLoading} />
			</div>
		</div>
	);
}
