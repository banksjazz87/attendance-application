export interface SQLResponse {
  code: string;
  sqlMessage: string;
}

export interface DBAttendee {
  firstName: string;
  lastName: string;
  age: string;
  memberType: string;
  active: number;
  visitorInActive: number;
  id: number;
}
