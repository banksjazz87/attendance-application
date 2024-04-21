import mysql from "mysql";
import { SQLResponse } from "../interfaces/interfaces.ts";
import { DBAttendee } from "../../attendanceApplication/interfaces/interfaces.ts";

export class DBMethods {
  hostName: any;
  userName: any;
  userDb: any;
  userPassword: any;
  dbConnection: any;

  constructor(hostName: any, userName: any, userDb: any, userPassword: any) {
    this.hostName = hostName;
    this.userName = userName;
    this.userDb = userDb;
    this.userPassword = userPassword;

    this.dbConnection = mysql.createConnection({
      host: this.hostName,
      user: this.userName,
      database: this.userDb,
      password: this.userPassword,
    });
  }

  getSqlError(obj: SQLResponse): string {
    const message = `The following error has occurred: ${obj.code} with sqlMessage: ${obj.sqlMessage}`;
    return message;
  }

  db(): any {
    let connection = mysql.createConnection({
      host: this.hostName,
      user: this.userName,
      database: this.userDb,
      password: this.userPassword,
    });
    return connection;
  }

  connect(): any {
    const database = this.dbConnection;
    database.connect((err: any): void => {
      if (err) {
        console.log("err", err);
      } else {
        console.log("you are connected");
      }
    });
    database.end((err: any): void => (err ? console.log("error, disconnecting") : console.log("disconnected")));
  }

  endDb() {
    const database = this.dbConnection;
    database.end((err: any): void => {
      err ? console.log("error, disconnecting") : console.log("disconnected");
    });
  }

  prepBulkAddString(arr: Object[]): string {
    let string = '';

    for (let i = 0; i < arr.length; i++) {
        let currentValues = Object.values(arr[i]);
        string += '(';

        for (let j = 0; j < currentValues.length; j++) {
            if (j === currentValues.length - 1) {
                string += `"${currentValues[j]}"), `;
            } else {
                string += `"${currentValues[j]}",`
            }
        }
    }

    let finalString = string.slice(0, string.length - 2);
    return finalString;
  }

  insert(table: string, columns: string, values: string[]): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const database = this.dbConnection;
      let sql = `INSERT INTO ${table} (${columns}) VALUES (?);`;

      database.query(sql, [values], (err: string[], results: string[]) => {
        err ? reject(err) : resolve(results);
      });
      this.endDb();
    });
  }

  insertNoEnd(table: string, columns: string, values: string[]): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const database = this.dbConnection;
      let sql = `INSERT INTO ${table} (${columns}) VALUES (?);`;

      database.query(sql, [values], (err: string[], results: string[]) => {
        err ? reject(err) : resolve(results);
      });
    });
  }

  searchByValue(table: string, column: string, value: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const database = this.dbConnection;
      let sql = `SELECT * FROM ${table} WHERE ${column} = "${value}";`;

      database.query(sql, (err: string[], results: string[]) => {
        err ? reject(err) : resolve(results);
      });
      this.endDb();
    });
  }

  getTable(table: string, order: string, column: string): Promise<string[]> {
    return new Promise<string[]> ((resolve, reject)=> {
      const database = this.dbConnection;
      let sql = "";

      if (column === 'lastName') {
        sql = `SELECT * FROM ${table} ORDER BY ${column} ${order}, firstName ${order}`;
      } else {
        sql = `SELECT * FROM ${table} ORDER BY ${column} ${order};`;
      }

      database.query(sql, (err: string[], results: string[]): void => {
        err ? reject(err) : resolve(results);
      });
      this.endDb();
    });
  }

  getTableByColumn(table: string, order: string, targetColumn: string, orderColumn: string): Promise<string[]> {
    return new Promise<string[]> ((resolve, reject) => {
      const database = this.dbConnection;
      let sql = `SELECT id, firstName, lastName, age, memberType, ${targetColumn} FROM ${table} ORDER BY ${orderColumn} ${order};`;

      database.query(sql, (err: string[], results: string[]): void => {
        err ? reject(err) : resolve(results);
      });
      this.endDb();
    });
  }

  createGroupTable(tableName: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const database = this.dbConnection;
      let sql = `CREATE TABLE ${tableName} (id int NOT NUll AUTO_INCREMENT, title varchar(50) DEFAULT NULL, displayTitle varchar(50) DEFAULT NULL, dateCreated datetime DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id));`;

      database.query(sql, (err: string[], results: string[]): void => {
        err ? reject(err) : resolve(results);
      });
      this.endDb();
    });
  }

  createTableName(table: string): string {
    let result: string = table.replace(/[.-/?! ]/g, "_");
    let resultNoSpaces: string = result.replace(/ /g, "_");
    return resultNoSpaces;
  }

  //This will be used to create a new attendance table.
  createNewAttendance(tableName: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const database = this.dbConnection;
      let sql = `CREATE TABLE ${tableName} (id smallint NOT NULL AUTO_INCREMENT, firstName varchar(40) DEFAULT NULL,
        lastName varchar(40) DEFAULT NULL, age varchar(30), memberType varchar(30), PRIMARY KEY (id));`;

      database.query(sql, (err: string[], results: string[]) => {
        err ? reject(err) : resolve(results);
      });
      this.endDb();
    });
  }

  //This will be used to add a new attendance column to the group master attendance.
  addNewColumnToMasterNoEnd(tableName: string, columnName: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const database = this.dbConnection;
      let sql = `ALTER TABLE ${tableName} ADD ${columnName} tinyInt(1) NOT NULL DEFAULT 0;`;

      database.query(sql, (err: string[], results: string[]) => {
        err ? reject(err) : resolve(results);
      });
    });
  }


  //This will be used to insert all of the people of a certain age group into an attendance table.
  insertAgeGroup(tableName: string, group: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const database = this.dbConnection;
      const neededSql = (): string => {
        if (group === "all") {
          return `INSERT INTO ${tableName} (id, firstName, lastName, age, memberType) SELECT * FROM People;`;
        } else {
          return `INSERT INTO ${tableName} (id, firstName, lastName, age, memberType) SELECT * FROM People WHERE memberType = ${group};`;
        }
      };
      let sql = neededSql();
      database.query(sql, (err: string[], results: string[]) => {
        err ? reject(err) : resolve(results);
      });
      this.endDb();
    });
  }

  removePerson(tableName: string, firstName: string, lastName: string, id: number): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const database = this.dbConnection;
      const neededSql = `DELETE FROM ${tableName} WHERE firstName = "${firstName}" AND lastName = "${lastName}" AND id = ${id};`;

      database.query(neededSql, (err: string[], results: string[]) => {
        err ? reject(err) : resolve(results);
      });
      this.endDb();
    });
  }

  getPerson(tableName: string, first: string, last: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const database = this.dbConnection;
      const neededSql = `SELECT * FROM ${tableName} WHERE firstName = "${first}" AND lastName = "${last}";`;

      database.query(neededSql, (err: string[], results: string[]) => {
        err ? reject(err) : resolve(results);
      });
      this.endDb();
    });
  }

  updatePerson(tableName: string, obj: DBAttendee): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const database = this.dbConnection;
      const neededSql = `UPDATE ${tableName} SET firstName = "${obj.firstName}", lastName = "${obj.lastName}", age = "${obj.age}", active = ${obj.active},  memberType = "${obj.memberType}" WHERE id = ${obj.id};`;

      database.query(neededSql, (err: string[], results: string[]) => {
        err ? reject(err) : resolve(results);
      });
      this.endDb();
    });
  }

  addAllApplicants(table: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const database = this.dbConnection;
      const neededSql = `INSERT INTO ${table} (id, firstName, lastName, age, memberType) SELECT * FROM Attendants;`;

      database.query(neededSql, (err: string[], results: string[]) => {
        err ? reject(err) : resolve(results);
      });
      this.endDb();
    });
  }







  addBulkSelectApplicants(table: string, columns: string, obj: Object[]): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const database = this.dbConnection;
      const mysqlMultipleString = this.prepBulkAddString(obj);

      const sql = `INSERT INTO ${table} (${columns}) VALUES ${mysqlMultipleString};`;

      database.query(sql, (err: string[], results: string[]) => {
        err ? reject(err) : resolve(results);
      });
      this.endDb();
    });
  }


  addAllActiveApplicants(table: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const database = this.dbConnection;
      const neededSql = `INSERT INTO ${table} (id, firstName, lastName, age, memberType) SELECT id, firstName, lastName, age, memberType FROM Attendants WHERE active = 1;`;

      database.query(neededSql, (err: string[], results: string[]) => {
        err ? reject(err) : resolve(results);
      });
      this.endDb();
    });
  }

  addSelectApplicants(table: string, neededAge: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const database = this.dbConnection;
      const neededSql = `INSERT INTO ${table} (id, firstName, lastName, age, memberType) SELECT id, firstName, lastName, age, memberType FROM Attendants WHERE age = "${neededAge}" AND active = 1;`;

      database.query(neededSql, (err: string[], results: string[]) => {
        err ? reject(err) : resolve(results);
      });
      this.endDb();
    });
  }

  updateAttendance(table: string, columnName: string, attendeeId: number, attendeeLastName: string, status: number): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const database = this.dbConnection;
      const neededSql = `UPDATE ${table} SET ${columnName} = ${status} WHERE id = ${attendeeId} AND lastName = "${attendeeLastName}";`;

      database.query(neededSql, (err: string[], results: string[]): void => {
        err ? reject(err) : resolve(results);
      });
      this.endDb();
    });
  }

  //Used to return the number of rows in a table.
  numberOfRows(table: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const database = this.dbConnection;
      const neededSql = `SELECT COUNT(*) AS total FROM ${table};`;

      database.query(neededSql, (err: string[], results: string[]): void => {
        err ? reject(err) : resolve(results);
      });
      this.endDb();
    });
  }

  //Used to return a limited number of rows from a table.
  limitNumberOfRowsReturned(table: string, limit: number, offset: number, fieldOrder: string, order: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const database = this.dbConnection;
      const neededSql = `SELECT * FROM ${table} ORDER BY ${fieldOrder} ${order} LIMIT ${limit} OFFSET ${offset}`;

      database.query(neededSql, (err: string[], results: string[]): void => {
        err ? reject(err) : resolve(results);
      });
      this.endDb();
    });
  }

  //Used to return a partial match of rows from a table.
  searchForPartialName(table: string, partialName: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const database = this.dbConnection;
      const neededSql = `SELECT * FROM ${table} WHERE firstName LIKE "%${partialName}%" OR lastName LIKE "%${partialName}%"`;

      database.query(neededSql, (err: string[], results: string[]): void => {
        err ? reject(err) : resolve(results);
      });
      this.endDb();
    });
  }

  updateTotalTable(currentTable: string, group: string, children: number, youth: number, adults: number, members: number, visitors: number): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const database = this.dbConnection;
      const total = children + youth + adults;
      const neededSql = `UPDATE Attendance_Totals SET totalChildren = ${children}, totalYouth = ${youth}, totalAdults = ${adults}, totalMembers = ${members}, totalVisitors = ${visitors}, totalCount = ${total} WHERE groupName = "${group}" AND title = "${currentTable}";`;

      database.query(neededSql, (err: string[], results: string[]): void => {
        err ? reject(err) : resolve(results);
      });
      this.endDb();
    });
  }

  getMonthStatistics(groupName: string, monthName: string, yearDate: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const database = this.dbConnection;
      const neededSql = `SELECT * FROM Attendance_Totals WHERE MONTHNAME(dateCreated) = "${monthName}" AND YEAR(dateCreated) = "${yearDate}" AND groupName = "${groupName}" ORDER BY dateCreated ASC;`;

      database.query(neededSql, (err: string[], results: string[]): void => {
        err ? reject(err) : resolve(results);
      });
      this.endDb();
    });
  }

  getDistinctStatisticYears(groupName: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const database = this.dbConnection;
      const neededSql = `SELECT DISTINCT YEAR(dateCreated) AS years FROM Attendance_Totals WHERE groupName = "${groupName}" ORDER BY years DESC;`;

      database.query(neededSql, (err: string[], results: string[]): void => {
        err ? reject(err) : resolve(results);
      });
      this.endDb();
    });
  }

  getDistinctStatisticMonths(groupName: string, yearDate: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const database = this.dbConnection;
      const neededSql = `SELECT DISTINCT MONTHNAME(dateCreated) AS months FROM Attendance_Totals WHERE groupName = "${groupName}" AND YEAR(dateCreated) = ${yearDate} ORDER BY months DESC;`;

      database.query(neededSql, (err: string[], results: string[]): void => {
        err ? reject(err) : resolve(results);
      });
      this.endDb();
    });
  }

  getAttendanceByGroupName(groupName: string, column: string, order: "asc" | "desc"): Promise <string[]> {
    return new Promise<string[]>((resolve, reject): void => {
      const database = this.dbConnection;
      const neededSql = `SELECT * FROM all_attendance WHERE parentGroupValue = "${groupName}" ORDER BY ${column} ${order};`;

      database.query(neededSql, (err: string[], results: string[]): void => {
        err ? reject(err) : resolve(results);
      });
      this.endDb();
    });
  }


   //Used to return a limited number of rows from a table.
   selectFewWithLimit(table: string, columns: string[], limit: number, offset: number, fieldOrder: string, order: string, countField: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const database = this.dbConnection;
      const stringOfColumns = columns.join(', ');

      const neededSql = `SELECT ${stringOfColumns} FROM ${table} ORDER BY ${fieldOrder} ${order} LIMIT ${limit} OFFSET ${offset}`;

      database.query(neededSql, (err: string[], results: string[]): void => {
        err ? reject(err) : resolve(results);
      });
      this.endDb();
    });
  }

}
