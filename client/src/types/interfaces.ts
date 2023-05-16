export interface Attendee {
    firstName: string;
    lastName: string;
    age: string;
    memberType: string;
    present?: number;
    id?: number;
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

  export interface AttendanceInputs {
    placeholder: string,
    type: string,
    name: string,
    id: string,
    value: string,
    label: string
  }


  export interface AttendanceLayout {
    name: AttendanceInputs[], 
    ageGroup: AttendanceInputs[], 
    memberStatus: AttendanceInputs[]
  }

  export interface APIResponse {
    message: string;
    data: string[];
    error: string;
  }

  export interface APIPeople {
    message: string;
    data: Attendee[];
    error: string;
  }

  export interface AllPeopleProps {
    allPeople: Attendee[];
    deletePersonHandler: Function;
    editPersonHandler: Function;
  }

  export interface DeleteProps {
    message: string;
    url: string;
    show: boolean;
    deleteUser: Attendee;
    hideHandler: Function;
  }
  
  export interface DeleteResponse {
      message: string;
      error: string;
  }

  export interface FormProps {
    show: boolean;
    formToShow: "New" | "Existing";
  }
