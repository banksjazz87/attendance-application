import React, { useState, useEffect } from "react";
import Navbar from "../components/global/Navbar.tsx";
import GroupDropDown from "../components/global/GroupDropDown.tsx";
import { Group, YearsDataResponse, YearsDataObj, MonthsDataObj, MonthsDataResponse, AttendanceResponse, AttendanceTotals } from "../types/interfaces.ts";
import DateDropDown from "../components/dashboard/DateDropDown.tsx";
import AllDataForm from "../components/dashboard/AllDataForm.tsx";

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
						console.log(final);
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
			console.log(value);
			setSelectedYear(value);
			setSearchMonths(true);
		}
	};

	const monthChangeHandler = (value: string): void => {
		if (value.length > 0) {
			console.log("selected month is ", value);
			setSelectedMonth(value);
		}
	};

	const setAllDataResults = (arr: AttendanceTotals[]): void => {
		setDataResults(arr);
	}

	return (
		<div>
			<Navbar />
			<div className="header_wrapper">
				<h1>Dashboard</h1>
			</div>
			{/* <form
				method="GET"
				action={`/group-statistics/${selectedGroup}/${selectedMonth}/${selectedYear}`}
				onSubmit={(e: React.FormEvent<HTMLFormElement>): void => {
					e.preventDefault();
					fetch(`/group-statistics/${selectedGroup}/${selectedMonth}/${selectedYear}`)
						.then((data: Response): Promise<AttendanceResponse> => {
							return data.json();
						})
						.then((final: AttendanceResponse): void => {
							if (final.message === "success") {
								console.log(final);
								setDataResults(final.data)
							} else {
								console.log(final);
								alert(`The following error occurred: ${final.error}`);
							}	
						});
				}}
			>
				<GroupDropDown attendanceGroupSelected={updateGroup} />
				<DateDropDown
					dateData={dataYears}
					changeHandler={yearChangeHandler}
					keyWord="years"
					idTag="year_search"
				/>
				<DateDropDown
					dateData={dataMonths}
					changeHandler={monthChangeHandler}
					keyWord="months"
					idTag="month_search"
				/>
				<input
					type="submit"
					value="Submit"
				/>
			</form> */}
			<AllDataForm
				yearData={dataYears}
				yearHandler={yearChangeHandler}
				yearKeyWord="years"
				yearIdTag="year_search"

				monthData={dataMonths}
				monthHandler={monthChangeHandler}
				monthKeyWord="months"
				monthIdTag="month_search"
				group={selectedGroup}
				month={selectedMonth}
				year={selectedYear}
				submitHandler={setAllDataResults}
				groupChange={updateGroup}
			/>
		</div>
	);
}
