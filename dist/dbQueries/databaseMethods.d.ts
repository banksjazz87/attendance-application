import { SQLResponse } from "../interfaces/interfaces.ts";
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
}
