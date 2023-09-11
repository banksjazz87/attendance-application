import React from "react";
import GroupDropDown from "../global/GroupDropDown.tsx";
import DateDropDown from "../dashboard/DateDropDown.tsx";
import {MonthsDataObj, YearsDataObj, AttendanceResponse} from "../../types/interfaces.ts";

interface AllDataFormProps {
    yearData: YearsDataObj[];
	yearHandler: Function;
	yearKeyWord: string;
    yearIdTag: string;
    monthData: MonthsDataObj[];
	monthHandler: Function;
    monthKeyWord: string;
	monthIdTag: string;
	group: string;
	month: string;
	year: string;
	submitHandler: Function;
    groupChange: Function
}
export default function AllDataForm({yearData, yearHandler, yearKeyWord, yearIdTag, monthData, monthHandler, monthKeyWord, monthIdTag, group, month, year, submitHandler, groupChange}: AllDataFormProps) {
    return (
        <form
				method="GET"
				action={`/group-statistics/${group}/${month}/${year}`}
				onSubmit={(e: React.FormEvent<HTMLFormElement>): void => {
					e.preventDefault();
					fetch(`/group-statistics/${group}/${month}/${year}`)
						.then((data: Response): Promise<AttendanceResponse> => {
							return data.json();
						})
						.then((final: AttendanceResponse): void => {
							if (final.message === "success") {
								console.log(final);
								submitHandler(final.data)
							} else {
								console.log(final);
								alert(`The following error occurred: ${final.error}`);
							}	
						});
				}}
			>
				<GroupDropDown attendanceGroupSelected={groupChange} />
				<DateDropDown
					dateData={yearData}
					changeHandler={yearHandler}
					keyWord="years"
					idTag="year_search"
				/>
				<DateDropDown
					dateData={monthData}
					changeHandler={monthHandler}
					keyWord="months"
					idTag="month_search"
				/>
				<input
					type="submit"
					value="Submit"
				/>
			</form>
    )
}