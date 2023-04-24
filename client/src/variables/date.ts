import {JSDate} from "../types/interfaces.ts";

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

export const currentDate: string = `${month} ${day} ${year}`;