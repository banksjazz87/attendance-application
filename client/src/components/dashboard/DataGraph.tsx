import React from "react";
import {AttendanceTotals} from "../../types/interfaces.ts";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';

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

export default function DataGraph({allData}: DataGraphProps ): JSX.Element {

    const neededData = (arr: AttendanceTotals[]): DataGraphSet[] => {
       let array = [];
       for (let i = 0; i < arr.length; i++) {
        let dataSet = {
            name: arr[i].displayTitle,
            children: arr[i].totalChildren,
            youth: arr[i].totalYouth,
            adults: arr[i].totalAdults,
            visitors: arr[i].totalVisitors,
            total: arr[i].totalCount
        }

        array.push(dataSet);
       }

       console.log('original one', array);
        return array;
       
    }

    return (
      <div>
        <AreaChart
          width={500}
          height={400}
          data={neededData(allData).length > 0 ? neededData(allData): [{
            name: 'tesing',
            children: 1,
            youth: 3,
            adults: 20,
            visitors: 2,
            total: 26
          }]}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="children" stackId="1" stroke="#8884d8" fill="#8884d8" />
          <Area type="monotone" dataKey="youth" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
          <Area type="monotone" dataKey="adults" stackId="1" stroke="#ffc658" fill="#ffc658" />
          <Area type="monotone" dataKey="visitors" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
          <Area type="monotone" dataKey="total" stackId="1" stroke="#ffc658" fill="#ffc658" />
        </AreaChart>
      </div>
    );
}