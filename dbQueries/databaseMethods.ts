import mysql from "mysql";
import { SQLResponse } from "../interfaces/interfaces.ts";

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
    database.end((err: any): void =>
      err ? console.log("error, disconnecting") : console.log("disconnected")
    );
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
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
      this.endDb();
    });
  }

  searchByValue(table: string,column: string,value: string): Promise<string[]> {
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
      let sql = `CREATE TABLE ${tableName} (id int NOT NUll AUTO_INCREMENT, title varchar(50) DEFAULT NULL, dateCreated datetime DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id));`;

      database.query(sql, (err: string[], results: string[]): void => {
        err ? reject(err) : resolve(results)
      });
      this.endDb();
    });
    }

    createTableName(table: string): string {
      let result: string = table.replace(/[.-/?! ]/g, '_');
      let resultNoSpaces: string = result.replace(/ /g, '_');

      return resultNoSpaces;
    }
}
