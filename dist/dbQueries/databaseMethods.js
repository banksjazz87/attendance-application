"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBMethods = void 0;
const mysql_1 = __importDefault(require("mysql"));
class DBMethods {
    constructor(hostName, userName, userDb, userPassword) {
        this.insertGroup = (table, columns, values) => {
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
        };
        this.hostName = hostName;
        this.userName = userName;
        this.userDb = userDb;
        this.userPassword = userPassword;
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
            err ? console.log('error, disconnecting') : console.log('disconnected');
        });
    }
}
exports.DBMethods = DBMethods;
