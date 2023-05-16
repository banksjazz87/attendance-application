import React, { useState, useEffect } from "react";
import GroupDropDown from "../../components/global/GroupDropDown.tsx";
import AttendanceTitle from "../../components/newAttendance/AttendanceTitle.tsx";
import NewGroupForm from "../../components/newAttendance/NewGroupForm.tsx";
import { Group } from "../../types/interfaces.ts";
import { currentDate } from "../../variables/date.ts";
import postData from "../../functions/api/post.ts";
import { APIResponse, FormProps } from "../../types/interfaces.ts";

interface NewAttendance {
  title: string;
  group: string;
  ageGroup: string;
  groupDisplayName: string;
}

interface ApiResponse {
  message: string;
  data: [] | string;
}

export default function Form({ show, formToShow }: FormProps): JSX.Element {
  const [form, setForm] = useState<NewAttendance>({
    title: currentDate,
    group: "",
    ageGroup: "",
    groupDisplayName: "",
  });

  //Using this to get all of the group names to compare against to determine if a new table needs to be created.
  const [allGroups, setAllGroups] = useState<Group[]>([]);

  //Used to get all of the current group names in the database.
  const setGroups = (arr: Group[]): void => {
    setAllGroups(arr);
  };

  //Change handler for the select element for selecting a group.
  const groupChange = (arr: Group[], value: string): void => {
    let index: number = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].displayName === value) {
        index = i;

        console.log("Index is", i);
      }
    }

    console.log(allGroups);
    setForm({
      ...form,
      groupDisplayName: value,
      group: arr[index]["name"],
      ageGroup: arr[index]["age_group"],
    });
  };

  const titleChange = (value: string): void => {
    setForm({ ...form, title: value });
  };

  const searchForGroup = (value: string, arr: Group[]): boolean => {
    let final = false;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].displayName === value) {
        final = true;
      }
    }
    return final;
  };

  const setGroupAge = (value: string): void => {
    setForm({ ...form, ageGroup: value });
  };

  const setNewGroupName = (value: string): void => {
    setForm({ ...form, groupDisplayName: value, group: value });
  };

  return (
    <form
      id="new_attendance_form"
      method="post"
      action="/new-group/create"
      onSubmit={(e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if (searchForGroup(form.groupDisplayName, allGroups)) {
          if (form.ageGroup === "All") {
            postData("/new-attendance/create/all-attendants", form).then(
              (data: APIResponse): void => {
                if (data.message === "success") {
                  alert("Success");
                } else {
                  alert(`Failure, ${data.error}`);
                }
              }
            );
          } else {
            postData("/new-attendance/create/select-attendants", form).then(
              (data: APIResponse): void => {
                if (data.message === "success") {
                  alert("Success");
                } else {
                  alert(`Failure ${data.error}`);
                }
              }
            );
          }
        } else {
          console.log("here here", form);
          postData("/new-group", form).then((data: ApiResponse): void => {
            if (data.message === "success") {
              postData("/new-group/create", form).then(
                (data: ApiResponse): void => {
                  if (data.message === "success") {
                    alert("Success");
                  } else {
                    alert(`Failure with new-group/create ${data.data}`);
                  }
                }
              );
            } else {
              alert(`Failure with new-group ${data.data}`);
            }
          });
        }
      }}
    >
      <div id="form_group_dropdown_wrapper">
        <GroupDropDown
          currentGroups={allGroups}
          groupSelected={groupChange}
          getGroups={setGroups}
        />
      </div>
      <div id="form_new_group_form_wrapper">
        <NewGroupForm
          groupSelected={setNewGroupName}
          ageHandler={setGroupAge}
        />
        <AttendanceTitle
          titleHandler={titleChange}
          attendanceTitle={form.title}
        />
      </div>
      <input type="submit" value="submit" />
    </form>
  );
}
