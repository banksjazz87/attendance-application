import React from "react";
import { AttendanceTotals } from "../../types/interfaces.ts";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface DataGraphProps {
	allData: AttendanceTotals[];
}

interface DataGraphSet {
	name: string;
	children: number;
	youth: number;
	adults: number;
	visitors: number;
	total: number;
}

export default function DataGraph({ allData }: DataGraphProps): JSX.Element {
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

	return (
		<div style={allData.length > 0 ? { marginTop: "4rem", display: "" } : { display: "none" }}>
			<LineChart
				width={1000}
				height={600}
				data={neededData(allData)}
				margin={{
					top: 5,
					right: 30,
					left: 20,
					bottom: 5,
				}}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="name" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Line
					type="monotone"
					dataKey="children"
					stroke="#8884d8"
					strokeWidth="2"
				/>
				<Line
					type="monotone"
					dataKey="youth"
					stroke="#82ca9d"
					strokeWidth="2"
				/>
				<Line
					type="monotone"
					dataKey="adults"
					stroke="#CC76A1"
					strokeWidth="2"
				/>
				<Line
					type="monotone"
					dataKey="visitors"
					stroke="#87B38D"
					strokeWidth="2"
				/>
				<Line
					type="monotone"
					dataKey="total"
					stroke="#1C448E"
					strokeWidth="2"
					activeDot={{ r: 8 }}
				/>
			</LineChart>
		</div>
	);
}
