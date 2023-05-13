import { SQLResponse } from "../interfaces/interfaces.ts";
import { DBAttendee } from "../../attendanceApplication/interfaces/interfaces.ts";
export declare class DBMethods {
    hostName: any;
    userName: any;
    userDb: any;
    userPassword: any;
    constructor(hostName: any, userName: any, userDb: any, userPassword: any);
    getSqlError(obj: SQLResponse): string;
    db(): any;
    connect(): any;
    endDb(): void;
    insert(table: string, columns: string, values: string[]): Promise<string[]>;
    searchByValue(table: string, column: string, value: string): Promise<string[]>;
    getTable(table: string, order: string, column: string): Promise<string[]>;
    createGroupTable(tableName: string): Promise<string[]>;
    createTableName(table: string): string;
    createNewAttendance(tableName: string): Promise<string[]>;
    insertAgeGroup(tableName: string, group: string): Promise<string[]>;
    removePerson(tableName: string, firstName: string, lastName: string, id: number): Promise<string[]>;
    updatePerson(tableName: string, obj: DBAttendee): Promise<string[]>;
}
