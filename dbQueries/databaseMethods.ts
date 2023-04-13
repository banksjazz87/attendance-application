import mysql from "mysql";

export class DBMethods {
  hostName: any;
  userName: any;
  userPassword: any;

  constructor(hostName: any, userName: any, userPassword: any) {
    this.hostName = hostName;
    this.userName = userName;
    this.userPassword = userPassword;
  }

  db(): any {
    let connection = mysql.createConnection({
      host: this.hostName,
      user: this.userName,
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
}
