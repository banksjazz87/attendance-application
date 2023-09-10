import React from "react";

interface DateDropDownProps<T extends object, K extends keyof T> {
	dateData: T[];
	keyWord: K;
	changeHandler: Function;
	idTag: string;
}


export default function YearDropDown<T extends object, K extends keyof T>({ dateData, changeHandler, keyWord, idTag }: DateDropDownProps<T, K>): JSX.Element {
	
    const returnDateOptions = (arr: T[]): JSX.Element[] | undefined => {
		
		const options = arr.map((x: T, y: number): JSX.Element => {
			const currentValue = x[keyWord] as string | number;
			console.log('Look here', typeof(currentValue));
			console.log(currentValue);
				return (
					<option
						key={`${y}`}
						value={currentValue}
					>
						{currentValue}
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
			
			<label htmlFor={idTag}>Select a year</label>
			<p>{keyWord.toString()}</p>
			<select
				id={idTag}
				name={idTag}
				onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => {
					changeHandler(e.target.value);
				}}
			>
				<option value="">Select one...</option>
				{returnDateOptions(dateData)}
			</select>
		</div>
	);
}
