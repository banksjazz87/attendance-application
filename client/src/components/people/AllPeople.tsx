import React, {useEffect, useState} from "react";
import {AllPeopleProps} from "../../types/interfaces.ts";
import {Attendee} from "../../types/interfaces.ts";


export default function AllPeople({allPeople, deletePersonHandler}: AllPeopleProps): JSX.Element {
    
    const tableHeaders = ["Last Name", "First Name", "Age Group", "Member Status", "Delete"];
    
    const returnHeaders = tableHeaders.map((x: string, y: number): JSX.Element => {
        return (
                <th key={`header_${y}`}>{x}</th>
        );
    });

    const filterForAge = (obj: Attendee): string[]=> {
        const keys = Object.keys(obj);
        const age = keys.filter((x: string | any, y: number): string => {
            if (x === "adult" && obj["adult"] > 0) {
                return "Adult";
            } else if (x === "child" && obj["child"] > 0) {
                return "Child";
            } else if (x === "youth" && obj["youth"] > 0) {
                return "Youth";
            } else {
                return "";
            }
        });
        return age;
    }

    const filterForMember = (obj: Attendee): string[] => {
        const keys = Object.keys(obj);
        const status = keys.filter((x: string | any, y: number): string => {
            if (x === "member" && obj["member"] > 0) {
                return "Member";
            } else if (x === "visitor" && obj["visitor"] > 0) {
                return "Visitor";
            } else {
                return "";
            }
        });
        return status;
    }

    const returnallPeople = allPeople?.map((x: Attendee, y: number): JSX.Element => {
        return (
            <tr key={`row_${y}`}>
                <td>{x.lastName}</td>
                <td>{x.firstName}</td>
                <td>{filterForAge(x)}</td>
                <td>{filterForMember(x)}</td>
                <td><button type="button" onClick={(e: React.PointerEvent<HTMLButtonElement>): void => {
                    deletePersonHandler(allPeople[y]);
                }
                }>X</button></td>
            </tr>
        );
    });

    
    if (allPeople) {
        filterForAge(allPeople[0]);
        return (
        <table>
            <tbody>
                <tr>
                    {returnHeaders}
                </tr>
                {returnallPeople}
            </tbody>
        </table>
    );
        }else{
            return (
                <h1>Fetching</h1>
            )
        }
}