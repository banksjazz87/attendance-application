import React, { useState, useEffect } from "react";
import Navbar from "../components/global/Navbar.tsx";
import GroupDropDown from "../components/global/GroupDropDown.tsx";
import { Group, YearsDataResponse, YearsDataObj } from "../types/interfaces.ts";

export default function Dashboard() {
	const [selectedGroup, setSelectedGroup] = useState<string>("");
	const [dataYears, setDataYears] = useState<YearsDataObj[]>([]);
	const [searchYears, setSearchYears] = useState<boolean>(false);

	useEffect((): void => {
		if (searchYears) {
			fetch(`/group-statistics/years/${selectedGroup}`)
				.then((data: Response): Promise<YearsDataResponse> => {
					return data.json();
				})
				.then((final: YearsDataResponse): void => {
					if (final.message === "success") {
						console.log(final.data[0]);
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

	const returnOptions = (arr: YearsDataObj[]): JSX.Element[] | JSX.Element => {
		const options = arr.map((x: YearsDataObj, y: number): JSX.Element => {
			return <option key={`year_option_${y}`}>{x.years}</option>;
		});

		if (arr.length > 0) {
			return options;
		} else {
			return <option>{"No Options Available"}</option>;
		}
	};

	return (
		<div>
			<Navbar />
			<div className="header_wrapper">
				<h1>Dashboard</h1>
			</div>
			<GroupDropDown attendanceGroupSelected={updateGroup} />

			<label htmlFor="year_search">Select a year</label>
			<select
				id="year_search"
				name="year_search"
			>
				{returnOptions(dataYears)}
			</select>
		</div>
	);
}
