import React, { useState, useEffect } from "react";
import Navbar from "../components/global/Navbar.tsx";
import GroupDropDown from "../components/global/GroupDropDown.tsx";
import { Group, YearsDataResponse, YearsDataObj } from "../types/interfaces.ts";
import YearDropDown from "../components/dashboard/YearDropDown.tsx";

export default function Dashboard() {
	const [selectedGroup, setSelectedGroup] = useState<string>("");
	const [dataYears, setDataYears] = useState<YearsDataObj[]>([]);
	const [searchYears, setSearchYears] = useState<boolean>(false);
	const [selectedYear, setSelectedYear] = useState<string>("");

	useEffect((): void => {
		if (searchYears) {
			fetch(`/group-statistics/years/${selectedGroup}`)
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
			  years={dataYears}
			  changeHandler={yearChangeHandler}
			/>
		</div>
	);
}
