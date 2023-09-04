import mysql from "mysql";
import { SQLResponse } from "../interfaces/interfaces.ts";
import { DBAttendee } from "../../attendanceApplication/interfaces/interfaces.ts";

export class DBMethods {
  hostName: any;
  userName: any;
  userDb: any;
  userPassword: any;

  constructor(hostName: any, userName: any, userDb: any, userPassword: any) {
    this.hostName = hostName;
    this.userName = userName;
    this.userDb = userDb;
    this.userPassword = userPassword;
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
    const database = this.db();
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
    const database = this.db();
    database.end((err: any): void => {
      err ? console.log("error, disconnecting") : console.log("disconnected");
    });
  }

  insert(table: string, columns: string, values: string[]): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const database = this.db();
      let sql = `INSERT INTO ${table} (${columns}) VALUES (?);`;

      database.query(sql, [values], (err: string[], results: string[]) => {
        err ? reject(err) : resolve(results);
      });
      this.endDb();
    });
  }

  searchByValue(table: string, column: string, value: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const database = this.db();
      let sql = `SELECT * FROM ${table} WHERE ${column} = "${value}";`;

      database.query(sql, (err: string[], results: string[]) => {
        err ? reject(err) : resolve(results);
      });
      this.endDb();
    });
  }

  getTable(table: string, order: string, column: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const database = this.db();
      let sql = `SELECT * FROM ${table} ORDER BY ${column} ${order};`;

      database.query(sql, (err: string[], results: string[]): void => {
        err ? reject(err) : resolve(results);
      });
      this.endDb();
    });
  }

  createGroupTable(tableName: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const database = this.db();
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
      const database = this.db();
      let sql = `CREATE TABLE ${tableName} (id smallint NOT NULL AUTO_INCREMENT, firstName varchar(40) DEFAULT NULL,
        lastName varchar(40) DEFAULT NULL, age varchar(30), memberType varchar(30), present tinyint DEFAULT 0, PRIMARY KEY (id));`;

      database.query(sql, (err: string[], results: string[]) => {
        err ? reject(err) : resolve(results);
      });
      this.endDb();
    });
  }

  //This will be used to insert all of the people of a certain age group into an attendance table.
  insertAgeGroup(tableName: string, group: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const database = this.db();
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
      const database = this.db();
      const neededSql = `DELETE FROM ${tableName} WHERE firstName = "${firstName}" AND lastName = "${lastName}" AND id = ${id};`;

      database.query(neededSql, (err: string[], results: string[]) => {
        err ? reject(err) : resolve(results);
      });
      this.endDb();
    });
  }

  getPerson(tableName: string, first: string, last: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const database = this.db();
      const neededSql = `SELECT * FROM ${tableName} WHERE firstName = "${first}" AND lastName = "${last}";`;

      database.query(neededSql, (err: string[], results: string[]) => {
        err ? reject(err) : resolve(results);
      });
      this.endDb();
    });
  }

  updatePerson(tableName: string, obj: DBAttendee): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const database = this.db();
      const neededSql = `UPDATE ${tableName} SET firstName = "${obj.firstName}", lastName = "${obj.lastName}", age = "${obj.age}", memberType = "${obj.memberType}" WHERE id = ${obj.id};`;

      database.query(neededSql, (err: string[], results: string[]) => {
        err ? reject(err) : resolve(results);
      });
      this.endDb();
    });
  }

  addAllApplicants(table: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const database = this.db();
      const neededSql = `INSERT INTO ${table} (id, firstName, lastName, age, memberType) SELECT * FROM Attendants;`;

      database.query(neededSql, (err: string[], results: string[]) => {
        err ? reject(err) : resolve(results);
      });
      this.endDb();
    });
  }

  addSelectApplicants(table: string, neededAge: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const database = this.db();
      const neededSql = `INSERT INTO ${table} (id, firstName, lastName, age, memberType) SELECT * FROM Attendants WHERE age = "${neededAge}";`;

      database.query(neededSql, (err: string[], results: string[]) => {
        err ? reject(err) : resolve(results);
      });
      this.endDb();
    });
  }

  updateAttendance(table: string, attendeeId: number, attendeeLastName: string, status: number): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const database = this.db();
      const neededSql = `UPDATE ${table} SET present = ${status} WHERE id = ${attendeeId} AND lastName = "${attendeeLastName}";`;

      database.query(neededSql, (err: string[], results: string[]): void => {
        err ? reject(err) : resolve(results);
      });
      this.endDb();
    });
  }

  //Used to return the number of rows in a table.
  numberOfRows(table: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const database = this.db();
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
      const database = this.db();
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
      const database = this.db();
      const neededSql = `SELECT * FROM ${table} WHERE firstName LIKE "%${partialName}%" OR lastName LIKE "%${partialName}%"`;

      database.query(neededSql, (err: string[], results: string[]): void => {
        err ? reject(err) : resolve(results);
      });
      this.endDb();
    });
  }

  updateTotalTable(currentTable: string, children: number, youth: number, adults: number, members: number, visitors: number): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const database = this.db();
      const total = children + youth + adults;
      const neededSql = `UPDATE Attendance_Totals SET totalChildren = ${children}, totalYouth = ${youth}, totalAdults = ${adults}, totalMembers = ${members}, totalVisitors = ${visitors}, totalCount = ${total} WHERE title = "${currentTable}";`;

      database.query(neededSql, (err: string[], results: string[]): void => {
        err ? reject(err) : resolve(results);
      });
      this.endDb();
    });
  }
}
