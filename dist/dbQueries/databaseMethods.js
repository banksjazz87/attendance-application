"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBMethods = void 0;
const mysql_1 = __importDefault(require("mysql"));
class DBMethods {
    constructor(hostName, userName, userDb, userPassword) {
        this.hostName = hostName;
        this.userName = userName;
        this.userDb = userDb;
        this.userPassword = userPassword;
    }
    getSqlError(obj) {
        const message = `The following error has occurred: ${obj.code} with sqlMessage: ${obj.sqlMessage}`;
        return message;
    }
    db() {
        let connection = mysql_1.default.createConnection({
            host: this.hostName,
            user: this.userName,
            database: this.userDb,
            password: this.userPassword,
        });
        return connection;
    }
    connect() {
        const database = this.db();
        database.connect((err) => {
            if (err) {
                console.log("err", err);
            }
            else {
                console.log("you are connected");
            }
        });
        database.end((err) => err ? console.log("error, disconnecting") : console.log("disconnected"));
    }
    endDb() {
        const database = this.db();
        database.end((err) => {
            err ? console.log("error, disconnecting") : console.log("disconnected");
        });
    }
    insert(table, columns, values) {
        return new Promise((resolve, reject) => {
            const database = this.db();
            let sql = `INSERT INTO ${table} (${columns}) VALUES (?);`;
            database.query(sql, [values], (err, results) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(results);
                }
            });
            this.endDb();
        });
    }
    searchByName(table, column, value) {
        return new Promise((resolve, reject) => {
            const database = this.db();
            let sql = `SELECT * FROM ${table} WHERE ${column} = "${value}";`;
            database.query(sql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
}
exports.DBMethods = DBMethods;
