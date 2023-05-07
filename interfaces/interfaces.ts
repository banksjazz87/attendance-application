export interface SQLResponse {
    code: string;
    sqlMessage: string;
  }

export interface DBAttendee {
    firstName: string;
    lastName: string;
    adult: number;
    child: number;
    youth: number;
    member: number;
    visitor: number;
    id: number;
}