import React from "react";
import { YearsDataObj } from "../../types/interfaces.ts";

interface YearDropDownProps {
	dateData: YearsDataObj[];
	changeHandler: Function;
}

export default function YearDropDown({ dateData, changeHandler }: YearDropDownProps): JSX.Element {
	
    const returnOptions = (arr: YearsDataObj[]): JSX.Element[] | undefined => {
		const options = arr.map((x: YearsDataObj, y: number): JSX.Element => {
			return (
				<option
					key={`year_option_${y}`}
					value={x.years}
				>
					{x.years}
				</option>
			);
		});

		if (arr.length > 0) {
			return options;
		}
	};

	return (
		<div
			id="year_search_wrapper"
			style={dateData.length > 0 ? { display: "" } : { display: "none" }}
		>
			<label htmlFor="year_search">Select a year</label>
			<select
				id="year_search"
				name="year_search"
				onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => {
					changeHandler(e.target.value);
				}}
			>
				<option value="">Select one...</option>
				{returnOptions(dateData)}
			</select>
		</div>
	);
}
