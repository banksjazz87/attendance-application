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
        this.dbConnection = mysql_1.default.createConnection({
            host: this.hostName,
            user: this.userName,
            database: this.userDb,
            password: this.userPassword,
        });
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
        const database = this.dbConnection;
        database.connect((err) => {
            if (err) {
                console.log("err", err);
            }
            else {
                console.log("you are connected");
            }
        });
        database.end((err) => (err ? console.log("error, disconnecting") : console.log("disconnected")));
    }
    endDb() {
        const database = this.dbConnection;
        database.end((err) => {
            err ? console.log("error, disconnecting") : console.log("disconnected");
        });
    }
    prepBulkAddString(arr) {
        let string = '';
        for (let i = 0; i < arr.length; i++) {
            let currentValues = Object.values(arr[i]);
            string += '(';
            for (let j = 0; j < currentValues.length; j++) {
                if (j === currentValues.length - 1) {
                    string += `"${currentValues[j]}"), `;
                }
                else {
                    string += `"${currentValues[j]}",`;
                }
            }
        }
        let finalString = string.slice(0, string.length - 2);
        return finalString;
    }
    insert(table, columns, values) {
        return new Promise((resolve, reject) => {
            const database = this.dbConnection;
            let sql = `INSERT INTO ${table} (${columns}) VALUES (?);`;
            database.query(sql, [values], (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    insertNoEnd(table, columns, values) {
        return new Promise((resolve, reject) => {
            const database = this.dbConnection;
            let sql = `INSERT INTO ${table} (${columns}) VALUES (?);`;
            database.query(sql, [values], (err, results) => {
                err ? reject(err) : resolve(results);
            });
        });
    }
    searchByValue(table, column, value) {
        return new Promise((resolve, reject) => {
            const database = this.dbConnection;
            let sql = `SELECT * FROM ${table} WHERE ${column} = "${value}";`;
            database.query(sql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    getTable(table, order, column) {
        return new Promise((resolve, reject) => {
            const database = this.dbConnection;
            let sql = "";
            if (column === 'lastName') {
                sql = `SELECT * FROM ${table} ORDER BY ${column} ${order}, firstName ${order}`;
            }
            else {
                sql = `SELECT * FROM ${table} ORDER BY ${column} ${order};`;
            }
            database.query(sql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    getTableByColumn(table, order, targetColumn, orderColumn) {
        return new Promise((resolve, reject) => {
            const database = this.dbConnection;
            let sql = `SELECT id, firstName, lastName, age, memberType, ${targetColumn} FROM ${table} ORDER BY ${orderColumn} ${order};`;
            database.query(sql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    createGroupTable(tableName) {
        return new Promise((resolve, reject) => {
            const database = this.dbConnection;
            let sql = `CREATE TABLE ${tableName} (id int NOT NUll AUTO_INCREMENT, title varchar(50) DEFAULT NULL, displayTitle varchar(50) DEFAULT NULL, dateCreated datetime DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id));`;
            database.query(sql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    createTableName(table) {
        let result = table.replace(/[.-/?! ]/g, "_");
        let resultNoSpaces = result.replace(/ /g, "_");
        return resultNoSpaces;
    }
    //This will be used to create a new attendance table.
    createNewAttendance(tableName) {
        return new Promise((resolve, reject) => {
            const database = this.dbConnection;
            let sql = `CREATE TABLE ${tableName} (id smallint NOT NULL AUTO_INCREMENT, firstName varchar(40) DEFAULT NULL,
        lastName varchar(40) DEFAULT NULL, age varchar(30), memberType varchar(30), PRIMARY KEY (id));`;
            database.query(sql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    //This will be used to add a new attendance column to the group master attendance.
    addNewColumnToMasterNoEnd(tableName, columnName) {
        return new Promise((resolve, reject) => {
            const database = this.dbConnection;
            let sql = `ALTER TABLE ${tableName} ADD ${columnName} tinyInt(1) NOT NULL DEFAULT 0;`;
            database.query(sql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
        });
    }
    //This will be used to insert all of the people of a certain age group into an attendance table.
    insertAgeGroup(tableName, group) {
        return new Promise((resolve, reject) => {
            const database = this.dbConnection;
            const neededSql = () => {
                if (group === "all") {
                    return `INSERT INTO ${tableName} (id, firstName, lastName, age, memberType) SELECT * FROM People;`;
                }
                else {
                    return `INSERT INTO ${tableName} (id, firstName, lastName, age, memberType) SELECT * FROM People WHERE memberType = ${group};`;
                }
            };
            let sql = neededSql();
            database.query(sql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    removePerson(tableName, firstName, lastName, id) {
        return new Promise((resolve, reject) => {
            const database = this.dbConnection;
            const neededSql = `DELETE FROM ${tableName} WHERE firstName = "${firstName}" AND lastName = "${lastName}" AND id = ${id};`;
            database.query(neededSql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    getPerson(tableName, first, last) {
        return new Promise((resolve, reject) => {
            const database = this.dbConnection;
            const neededSql = `SELECT * FROM ${tableName} WHERE firstName = "${first}" AND lastName = "${last}";`;
            database.query(neededSql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    updatePerson(tableName, obj) {
        return new Promise((resolve, reject) => {
            const database = this.dbConnection;
            const neededSql = `UPDATE ${tableName} SET firstName = "${obj.firstName}", lastName = "${obj.lastName}", age = "${obj.age}", active = ${obj.active},  memberType = "${obj.memberType}" WHERE id = ${obj.id};`;
            database.query(neededSql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    addAllApplicants(table) {
        return new Promise((resolve, reject) => {
            const database = this.dbConnection;
            const neededSql = `INSERT INTO ${table} (id, firstName, lastName, age, memberType) SELECT * FROM Attendants;`;
            database.query(neededSql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    addBulkSelectApplicants(table, columns, obj) {
        return new Promise((resolve, reject) => {
            const database = this.dbConnection;
            const mysqlMultipleString = this.prepBulkAddString(obj);
            const sql = `INSERT INTO ${table} (${columns}) VALUES ${mysqlMultipleString};`;
            database.query(sql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    addAllActiveApplicants(table) {
        return new Promise((resolve, reject) => {
            const database = this.dbConnection;
            const neededSql = `INSERT INTO ${table} (id, firstName, lastName, age, memberType) SELECT id, firstName, lastName, age, memberType FROM Attendants WHERE active = 1;`;
            database.query(neededSql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    addSelectApplicants(table, neededAge) {
        return new Promise((resolve, reject) => {
            const database = this.dbConnection;
            const neededSql = `INSERT INTO ${table} (id, firstName, lastName, age, memberType) SELECT id, firstName, lastName, age, memberType FROM Attendants WHERE age = "${neededAge}" AND active = 1;`;
            database.query(neededSql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    updateAttendance(table, columnName, attendeeId, attendeeLastName, status) {
        return new Promise((resolve, reject) => {
            const database = this.dbConnection;
            const neededSql = `UPDATE ${table} SET ${columnName} = ${status} WHERE id = ${attendeeId} AND lastName = "${attendeeLastName}";`;
            database.query(neededSql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    //Used to return the number of rows in a table.
    numberOfRows(table) {
        return new Promise((resolve, reject) => {
            const database = this.dbConnection;
            const neededSql = `SELECT COUNT(*) AS total FROM ${table};`;
            database.query(neededSql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    //Used to return a limited number of rows from a table.
    limitNumberOfRowsReturned(table, limit, offset, fieldOrder, order) {
        return new Promise((resolve, reject) => {
            const database = this.dbConnection;
            const neededSql = `SELECT * FROM ${table} ORDER BY ${fieldOrder} ${order} LIMIT ${limit} OFFSET ${offset}`;
            database.query(neededSql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    //Used to return a partial match of rows from a table.
    searchForPartialName(table, partialName) {
        return new Promise((resolve, reject) => {
            const database = this.dbConnection;
            const neededSql = `SELECT * FROM ${table} WHERE firstName LIKE "%${partialName}%" OR lastName LIKE "%${partialName}%"`;
            database.query(neededSql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    updateTotalTable(currentTable, group, children, youth, adults, members, visitors) {
        return new Promise((resolve, reject) => {
            const database = this.dbConnection;
            const total = children + youth + adults;
            const neededSql = `UPDATE Attendance_Totals SET totalChildren = ${children}, totalYouth = ${youth}, totalAdults = ${adults}, totalMembers = ${members}, totalVisitors = ${visitors}, totalCount = ${total} WHERE groupName = "${group}" AND title = "${currentTable}";`;
            database.query(neededSql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    getMonthStatistics(groupName, monthName, yearDate) {
        return new Promise((resolve, reject) => {
            const database = this.dbConnection;
            const neededSql = `SELECT * FROM Attendance_Totals WHERE MONTHNAME(dateCreated) = "${monthName}" AND YEAR(dateCreated) = "${yearDate}" AND groupName = "${groupName}" ORDER BY dateCreated ASC;`;
            database.query(neededSql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    getDistinctStatisticYears(groupName) {
        return new Promise((resolve, reject) => {
            const database = this.dbConnection;
            const neededSql = `SELECT DISTINCT YEAR(dateCreated) AS years FROM Attendance_Totals WHERE groupName = "${groupName}" ORDER BY years DESC;`;
            database.query(neededSql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    getDistinctStatisticMonths(groupName, yearDate) {
        return new Promise((resolve, reject) => {
            const database = this.dbConnection;
            const neededSql = `SELECT DISTINCT MONTHNAME(dateCreated) AS months FROM Attendance_Totals WHERE groupName = "${groupName}" AND YEAR(dateCreated) = ${yearDate} ORDER BY months DESC;`;
            database.query(neededSql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
    getAttendanceByGroupName(groupName, column, order) {
        return new Promise((resolve, reject) => {
            const database = this.dbConnection;
            const neededSql = `SELECT * FROM all_attendance WHERE parentGroupValue = "${groupName}" ORDER BY ${column} ${order};`;
            database.query(neededSql, (err, results) => {
                err ? reject(err) : resolve(results);
            });
            this.endDb();
        });
    }
}
exports.DBMethods = DBMethods;
