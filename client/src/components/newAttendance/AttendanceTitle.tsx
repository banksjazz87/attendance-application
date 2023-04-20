import React, { useState, useEffect } from "react";
import { Str } from "../../types/types.ts";

interface JSDate {
  getMonth: Function;
  getDate: Function;
  getFullYear: Function;
}

export default function AttendanceTitle() {
  const date: JSDate = new Date();

  const months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const month: string = months[date.getMonth()];
  const day: string = date.getDate();
  const year: string = date.getFullYear();

  const currentDate: string = `${month} ${day} ${year}`;

  const [title, setTitle] = useState<Str>(currentDate);

  return (
    <input
      value={title}
      onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
        setTitle(e.target.value);
      }}
    />
  );
}
