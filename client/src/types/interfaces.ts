export interface Attendee {
    firstName: string;
    lastName: string;
    adult: number;
    child: number;
    teen: number;
    present: number;
  }
  
  export interface AttendanceProps {
      show: boolean;
      title: string;
  }

  export interface Group {
    id?: number;
    name: string;
    age_group: string;
    displayName: string;
  }
  
  export interface GroupProps {
    clickHandler?: Function;
    groupHandler?: Function;
    name?: string;
    groupSelected?: Function;
    titleHandler?: Function;
    attendanceTitle?: string;
    getGroups?: Function;
    currentGroups?: Group[];
    ageHandler?: Function;
  }

  export interface User {
    name: string;
    password: string;
  }
  
  export interface UserProps {
    showForm: boolean;
    logIn: any;
  }

  export interface JSDate {
    getMonth: Function;
    getDate: Function;
    getFullYear: Function;
  }