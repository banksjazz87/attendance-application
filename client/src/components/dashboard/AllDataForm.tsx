import React from "react";
import GroupDropDown from "../global/GroupDropDown.tsx";
import DateDropDown from "../dashboard/DateDropDown.tsx";
import { MonthsDataObj, YearsDataObj, AttendanceResponse } from "../../types/interfaces.ts";
import "../../assets/styles/components/dashboard/allDataForm.scss";

interface AllDataFormProps {
	yearData: YearsDataObj[];
	yearHandler: Function;
	monthData: MonthsDataObj[];
	monthHandler: Function;
	group: string;
	month: string;
	year: string;
	submitHandler: Function;
	groupChange: Function;
}
export default function AllDataForm({ yearData, yearHandler, monthData, monthHandler, group, month, year, submitHandler, groupChange }: AllDataFormProps) {
	const formHandler = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault();
		fetch(`/group-statistics/${group}/${month}/${year}`)
			.then((data: Response): Promise<AttendanceResponse> => {
				return data.json();
			})
			.then((final: AttendanceResponse): void => {
				if (final.message === "success") {
					submitHandler(final.data);
				} else {
					alert(`The following error occurred: ${final.error}`);
				}
			});
	};

	return (
		<form
			id="all_data_form"
			method="GET"
			action={`/group-statistics/${group}/${month}/${year}`}
			onSubmit={formHandler}
		>
			<GroupDropDown attendanceGroupSelected={groupChange} />
			<div className="year_month_options">
				<DateDropDown
					dateData={yearData}
					changeHandler={yearHandler}
					keyWord="years"
					idTag="year_search"
                    title="year"
				/>
				<DateDropDown
					dateData={monthData}
					changeHandler={monthHandler}
					keyWord="months"
					idTag="month_search"
                    title="month"
				/>
			</div>
			<input
				type="submit"
				value="Submit"
			/>
		</form>
	);
}
