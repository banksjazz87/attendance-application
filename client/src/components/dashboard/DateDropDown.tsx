import React from "react";
import "../../assets/styles/components/dashboard/dateDropDown.scss";

interface DateDropDownProps<T extends object, K extends keyof T> {
	dateData: T[];
	keyWord: K;
	changeHandler: Function;
	idTag: string;
	title: string;
}

export default function DateDropDown<T extends object, K extends keyof T>({ dateData, changeHandler, keyWord, idTag, title }: DateDropDownProps<T, K>): JSX.Element {


	/**
	 * 
	 * @param arr Array of objects.
	 * @returns an array of jsx elements or undefined.
	 * @description returns the date options.
	 */
	const returnDateOptions = (arr: T[]): JSX.Element[] | undefined => {
		const options = arr.map((x: T, y: number): JSX.Element => {
			const currentValue = x[keyWord] as string | number;
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
			id={`${idTag}_wrapper`}
			className="date_wrapper"
		>
			<label htmlFor={idTag}>{`Select a ${title}`}</label>
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
