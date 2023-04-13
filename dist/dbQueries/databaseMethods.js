"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBMethods = void 0;
const mysql_1 = __importDefault(require("mysql"));
class DBMethods {
    constructor(hostName, userName, userPassword) {
        this.hostName = hostName;
        this.userName = userName;
        this.userPassword = userPassword;
    }
    db() {
        let connection = mysql_1.default.createConnection({
            host: this.hostName,
            user: this.userName,
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
}
exports.DBMethods = DBMethods;
