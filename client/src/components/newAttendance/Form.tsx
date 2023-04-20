import React, {useState, useEffect} from "react";
import GroupDropDown from "../../components/global/GroupDropDown.tsx";
import AttendanceTitle from "../../components/newAttendance/AttendanceTitle.tsx";
import {Str} from "../../types/types.ts";

export default function Form() {
    const [selectedGroup, setSelectedGroup] = useState<Str>('');

    const groupChange = (value: string): void => {
        setSelectedGroup(value);
    }

    return (
        <form 
            id="new_attendance_form"
            onSubmit={(e: React.FormEvent<HTMLFormElement>): void => {
                e.preventDefault();
                console.log(selectedGroup);
            }}>
            <GroupDropDown groupSelected={groupChange} />
            <AttendanceTitle />
            <input type="submit" value="submit"/>
        </form>
    )
}