import React from "react";
import { MonthsDataObj } from "../../types/interfaces.ts";

interface MonthDropDownProps {
	monthData: MonthsDataObj[];
	changeHandler: Function;
}

export default function MonthDropDown({ monthData, changeHandler }: MonthDropDownProps): JSX.Element {
	
    const returnMonthOptions = (arr: MonthsDataObj[]): JSX.Element[] | undefined => {
		const options = arr.map((x: MonthsDataObj, y: number): JSX.Element => {
            return (
				<option
					key={`year_option_${y}`}
					value={x.months}
				>
					{x.months}
				</option>
			);
		});

		if (arr.length > 0) {
			return options;
		}
	};

	return (
		<div
			id="month_search_wrapper"
			style={monthData.length > 0 ? { display: "" } : { display: "none" }}
		>
			<label htmlFor="month_search">Select a year</label>
			<select
				id="month_search"
				name="month_search"
				onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => {
					changeHandler(e.target.value);
				}}
			>
				<option value="">Select one...</option>
				{returnMonthOptions(monthData)}
			</select>
		</div>
	);
}
