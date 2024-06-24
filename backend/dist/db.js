"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreMovesInDatabase = exports.createNewGameInstance = exports.dataBaseDisconnection = exports.useDatabase = exports.createDatabaseconnection = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
};
function createDatabaseconnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const con = yield promise_1.default.createConnection(dbConfig);
            console.log("connected");
            return con;
        }
        catch (err) {
            console.error("Error connecting to the database:", err);
            throw err;
        }
    });
}
exports.createDatabaseconnection = createDatabaseconnection;
function useDatabase(con, dataBase_Name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield con.query(`USE ${dataBase_Name}`);
            console.log("Database in use");
        }
        catch (error) {
            console.error("Error using database:", error);
        }
    });
}
exports.useDatabase = useDatabase;
function checkTableExist(con) {
    return __awaiter(this, void 0, void 0, function* () {
        const database = "chess";
        const tableName = "Moves";
        const query = `SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = '${database}' AND table_name = '${tableName}'`;
        try {
            const [results] = yield con.query(query);
            const tableExists = results[0].count === 1;
            console.log('inside the checkTable exist', tableExists);
            return tableExists;
        }
        catch (error) {
            console.error("Error checking table existence:", error);
            throw error;
        }
    });
}
function dataBaseDisconnection(con) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield con.end();
            console.log("disconnected");
        }
        catch (err) {
            console.error("Error disconnecting from database:", err);
        }
    });
}
exports.dataBaseDisconnection = dataBaseDisconnection;
function createNewGameInstance(con) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let UniqueId = (0, uuid_1.v4)();
            const [result] = yield con.query('SHOW TABLES LIKE "Games"');
            if (result.length === 0) {
                yield con.query(`CREATE TABLE Games(
          id INT PRIMARY KEY AUTO_INCREMENT,
          game_id VARCHAR(225)
        )`);
                console.log("Table Games created");
            }
            yield con.query(`INSERT INTO Games (game_id) VALUES ('${UniqueId}')`);
            const [rows] = yield con.query(`SELECT id FROM Games WHERE game_id = '${UniqueId}'`);
            if (rows.length > 0) {
                UniqueId = rows[0].id;
            }
            else {
                throw new Error("Game ID not found");
            }
            console.log("Game instance created with ID:", UniqueId);
            return UniqueId;
        }
        catch (error) {
            console.error("Error creating new game instance:", error);
            return "-1";
        }
    });
}
exports.createNewGameInstance = createNewGameInstance;
function StoreMovesInDatabase(value, id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let con = yield createDatabaseconnection();
            let CheckExist = 0;
            yield useDatabase(con, "chess");
            const tableExists = yield checkTableExist(con);
            CheckExist = tableExists ? 1 : 0;
            if (!CheckExist) {
                yield con.query(`CREATE TABLE Moves(
          id INT PRIMARY KEY AUTO_INCREMENT,
          fromPos VARCHAR(225),
          toPos VARCHAR(225),
          gameRef_id INT,
          FOREIGN KEY (gameRef_id) 
             REFERENCES Games(id)
             ON DELETE CASCADE
        )`);
                console.log("Table Moves created");
            }
            console.log('need to store', value);
            while (value.length != 0) {
                let { from, to } = value[0];
                yield con.query(`INSERT INTO Moves (fromPos, toPos, gameRef_id) VALUES (?, ?, ?)`, [from, to, id]);
                value.shift();
            }
            yield dataBaseDisconnection(con);
            console.log("Move stored in database");
        }
        catch (error) {
            console.error("Error storing move in database:", error);
        }
    });
}
exports.StoreMovesInDatabase = StoreMovesInDatabase;
