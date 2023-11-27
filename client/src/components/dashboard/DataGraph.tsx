import React, { useState, useEffect } from "react";
import { AttendanceTotals, DataGraphProps, DataGraphSet } from "../../types/interfaces.ts";
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from "recharts";
import "../../assets/styles/components/dashboard/dataGraph.scss";
import DateMethods from "../../functions/dateMethods.ts";

export default function DataGraph({ allData, month, year }: DataGraphProps): JSX.Element {
	const [isMobile, setIsMobile] = useState<boolean>(false);

	/**
	 *
	 * @param num number
	 * @returns void
	 * @descriptions updates the is mobile state based on the current width of the device.
	 */
	const checkForMobile = (num: number): void => {
		if (num > 767) {
			setIsMobile(false);
		} else {
			setIsMobile(true);
		}
	};

	//Add an event listener for an resize event, and checks to see if the width is mobile or not.
	useEffect(() => {
		window.addEventListener("resize", (e: UIEvent): void => {
			checkForMobile(window.innerWidth);
		});
		checkForMobile(window.innerWidth);
	});

	/**
	 *
	 * @param arr Array of Attendance Totals
	 * @returns Array of the type Data graph set.
	 * @description return the needed array.
	 */
	const neededData = (arr: AttendanceTotals[]): DataGraphSet[] => {
		let array = [];
		for (let i = 0; i < arr.length; i++) {
			let dataSet = {
				name: DateMethods.getMonthDay(arr[i].displayTitle),
				children: arr[i].totalChildren,
				youth: arr[i].totalYouth,
				adults: arr[i].totalAdults,
				visitors: arr[i].totalVisitors,
				total: arr[i].totalCount,
			};

			array.push(dataSet);
		}

		return array;
	};

	/**
	 *
	 * @param value string
	 * @returns a string with all underscores replaced with a space.
	 */
	const removeUnderScore = (value: string): string => {
		const regex = /_/g;
		let finalStr = value.replace(regex, " ");
		return finalStr;
	};

	return (
		<div
			id="line_graph"
			style={allData.length > 0 ? { marginTop: "4rem", display: "" } : { display: "none" }}
		>
			<h2>{allData.length > 0 ? removeUnderScore(allData[0].groupName) : ""}</h2>
			<h3>{`${month} ${year}`}</h3>
			<BarChart
				width={isMobile ? 450 : 750}
				height={isMobile ? 200 : 500}
				data={neededData(allData)}
				margin={{
					top: 5,
					right: 30,
					left: 20,
					bottom: 5,
				}}
			>
				<CartesianGrid />
				<XAxis dataKey="name" />
				<YAxis />
				<Tooltip />
				<Legend style={{ backgroundColor: "rgba(0, 0, 0, .2)" }} />
				<Bar
					dataKey="total"
					fill="#fd7f6f"
				/>
				<Bar
					dataKey="visitors"
					fill="#7eb0d5"
				/>
				<Bar
					dataKey="children"
					fill="#b2e061"
				/>
				<Bar
					dataKey="youth"
					fill="#bd7ebe"
				/>
				<Bar
					dataKey="adults"
					fill="#beb9db"
				/>
			</BarChart>
		</div>
	);
}
