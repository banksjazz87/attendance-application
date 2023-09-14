import React from "react";
import { AttendanceTotals } from "../../types/interfaces.ts";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import "../../assets/styles/components/dashboard/dataGraph.scss";

interface DataGraphProps {
	allData: AttendanceTotals[];
    month: string;
}

interface DataGraphSet {
	name: string;
	children: number;
	youth: number;
	adults: number;
	visitors: number;
	total: number;
}

export default function DataGraph({ allData, month }: DataGraphProps): JSX.Element {
	const neededData = (arr: AttendanceTotals[]): DataGraphSet[] => {
		let array = [];
		for (let i = 0; i < arr.length; i++) {
			let dataSet = {
				name: arr[i].displayTitle,
				children: arr[i].totalChildren,
				youth: arr[i].totalYouth,
				adults: arr[i].totalAdults,
				visitors: arr[i].totalVisitors,
				total: arr[i].totalCount,
			};

			array.push(dataSet);
		}

		console.log("original one", array);
		return array;
	};

    const removeUnderScore = (value: string): string => {
		const regex = /_/g;
		let finalStr = value.replace(regex, " ");
		return finalStr;
	}

	return (
		<div
			id="line_graph"
			style={allData.length > 0 ? { marginTop: "4rem", display: "" } : { display: "none" }}
		>
            <h2>{allData.length > 0 ? removeUnderScore(allData[0].groupName) : ""}</h2>
            <h3>{month}</h3>
			<LineChart
				width={750}
				height={500}
				data={neededData(allData)}
				margin={{
					top: 5,
					right: 30,
					left: 20,
					bottom: 5,
				}}
			>
				<CartesianGrid  />
				<XAxis dataKey="name"/>
				<YAxis />
				<Tooltip />
				<Legend style={{marginTop: "140px"}} />
                <Line
					type="monotone"
					dataKey="total"
					stroke="#9a031e"
					strokeWidth="2"
					activeDot={{ r: 8 }}
				/>
                <Line
					type="monotone"
					dataKey="visitors"
					stroke="#5f0f40"
					strokeWidth="2"
				/>
				<Line
					type="monotone"
					dataKey="children"
					stroke="#ee6c4d"
					strokeWidth="2"
				/>
				<Line
					type="monotone"
					dataKey="youth"
					stroke="#3d5a80"
					strokeWidth="2"
				/>
				<Line
					type="monotone"
					dataKey="adults"
					stroke="#0f4c5c"
					strokeWidth="2"
				/>
			</LineChart>
		</div>
	);
}
