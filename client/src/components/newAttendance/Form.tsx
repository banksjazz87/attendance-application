import React, {useState, useEffect} from "react";
import GroupDropDown from "../../components/global/GroupDropDown.tsx";
import AttendanceTitle from "../../components/newAttendance/AttendanceTitle.tsx";
import NewGroupForm from "../../components/newAttendance/NewGroupForm.tsx";
import {Group} from "../../types/interfaces.ts";
import {currentDate} from "../../variables/date.ts";


interface NewAttendance {
    title: string;
    group: string;
}



export default function Form(): JSX.Element {
    const [form, setForm] = useState<NewAttendance>({title: currentDate, group: ''});

    //Using this to get all of the group names to compare against to determine if a new table needs to be created.
    const [allGroups, setAllGroups] = useState<Group[]>([]);

    const groupChange = (value: string): void => {
        setForm({...form, group: value});
    }

    const titleChange = (value: string): void => {
        setForm({...form, title: value})
    }

    const setGroups = (arr: Group[]): void => {
        setAllGroups(arr);
    };

    const searchForGroup = (value: string, arr: Group[]): boolean => {
        let final = false;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].name === value) {
                final = true;
            }
        }
        return final;
    }

    return (
        <form 
            id="new_attendance_form"
            onSubmit={(e: React.FormEvent<HTMLFormElement>): void => {
                e.preventDefault();
                console.log('this is the form',form);

                if (searchForGroup(form.group, allGroups)) {
                    alert('This group already exists');
                } else {
                    alert('This group does not exist');
                }
            }}>
                
            <GroupDropDown groupSelected={groupChange} getGroups={setGroups} />
            <NewGroupForm groupSelected={groupChange}/>
            <AttendanceTitle titleHandler={titleChange} attendanceTitle={form.title}/>
            <input type="submit" value="submit"/>
        </form>
    )
}