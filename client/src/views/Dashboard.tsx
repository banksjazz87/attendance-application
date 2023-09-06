import React, {useState, useEffect} from "react";
import Navbar from "../components/global/Navbar.tsx";
import GroupDropDown from "../components/global/GroupDropDown.tsx";
import {Group, APIResponse} from "../types/interfaces.ts";


export default function Dashboard() {

  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [years, setYears] = useState<string[]>([]);
  const [searchYears, setSearchYears] = useState<boolean>(false);

  useEffect((): void => {
   if (searchYears) {
      fetch(`/group-statistics/years/${selectedGroup}`)
        .then((data: Response): Promise<APIResponse> => {
          return data.json();
        })
        .then((final: APIResponse): void => {
          if (final.message === "success") {
            console.log(final.data);
            setYears(final.data);
            setSearchYears(false);
          } else {
            alert(`The following error occurred, ${final.error}`); 
            setYears([]);
            setSearchYears(false); 
          }
        });
      }
  }, [searchYears, selectedGroup]);

  const updateGroup = (arr: Group[], value: string): void => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].displayName === value) {
        setSelectedGroup(arr[i].name);
        setSearchYears(true);
      }
    }
  }

  // const returnOptions = (arr: string[]): JSX.Element[] => {
  //   const options = arr.map((x: string, y: number): JSX.Element => {
  //     return (
  //       <option key={`year_option_${y}`}>{x.years}</option>
  //     )
  //   });
    
  //   return options;
  // }


  return (
    <div>
      <Navbar />
      <div className="header_wrapper">
        <h1>Dashboard</h1>
      </div>
      <GroupDropDown 
        attendanceGroupSelected={updateGroup}
      />

      <label htmlFor="year_search">Select a year</label>
      <select id="year_search" name="year_search">
        <label htmlFor="year_search">
          {/* {returnOptions(years)} */}
        </label>
      </select>
      <p>{`The selected group is ${selectedGroup}`}</p>
    </div>
  );
}
