import React, { useState, useEffect } from "react";
import Navbar from "../components/global/Navbar.tsx";
import GroupDropDown from "../components/global/GroupDropDown.tsx";
import { Group, YearsDataResponse, YearsDataObj, MonthsDataObj, MonthsDataResponse } from "../types/interfaces.ts";
import YearDropDown from "../components/dashboard/YearDropDown.tsx";
import MonthDropDown from "../components/dashboard/MonthDropDown.tsx";

export default function Dashboard() {
	const [selectedGroup, setSelectedGroup] = useState<string>("");
	const [dataYears, setDataYears] = useState<YearsDataObj[]>([]);
	const [searchYears, setSearchYears] = useState<boolean>(false);
	const [selectedYear, setSelectedYear] = useState<string>("");
	const [searchMonths, setSearchMonths] = useState<boolean>(false);
	const [dataMonths, setDataMonths] = useState<MonthsDataObj[]>([]);
	const [selectedMonth, setSelectedMonth] = useState<string>('');

	//Used to update the valid years that can be used for the selected group.
	useEffect((): void => {
		if (searchYears) {
			fetch(`/group-years/${selectedGroup}`)
				.then((data: Response): Promise<YearsDataResponse> => {
					return data.json();
				})
				.then((final: YearsDataResponse): void => {
					if (final.message === "success") {
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
				})
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
	}

	const monthChangeHandler = (value: string): void => {
		if (value.length > 0) {
			console.log('selected month is ', value);
			setSelectedMonth(value);
		}
	}

	return (
		<div>
			<Navbar />
			<div className="header_wrapper">
				<h1>Dashboard</h1>
			</div>
			<GroupDropDown attendanceGroupSelected={updateGroup} />
			<YearDropDown 
			  yearData={dataYears}
			  changeHandler={yearChangeHandler}
			/>
			<MonthDropDown
			  monthData={dataMonths}
			  changeHandler={monthChangeHandler}
			/>
		</div>
	);
}
