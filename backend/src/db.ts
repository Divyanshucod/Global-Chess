import mysql from "mysql2/promise";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};

export async function createDatabaseconnection() {
  try {
    const con = await mysql.createConnection(dbConfig);
    console.log("connected");
    return con;
  } catch (err) {
    console.error("Error connecting to the database:", err);
    throw err;
  }
}

export async function useDatabase(con: any, dataBase_Name: String) {
  try {
    await con.query(`USE ${dataBase_Name}`);
    console.log("Database in use");
  } catch (error) {
    console.error("Error using database:", error);
  }
}
async function checkTableExist(con: any): Promise<boolean> {
  const database = "chess";
  const tableName = "Moves";
  const query = `SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = '${database}' AND table_name = '${tableName}'`;

  try {
    const [results] = await con.query(query);
    const tableExists = results[0].count === 1;
    console.log('inside the checkTable exist', tableExists);
    return tableExists;
  } catch (error) {
    console.error("Error checking table existence:", error);
    throw error;
  }
}

export async function dataBaseDisconnection(con: any) {
  try {
    await con.end();
    console.log("disconnected");
  } catch (err) {
    console.error("Error disconnecting from database:", err);
  }
}

export async function createNewGameInstance(con: any) {
  try {
    let UniqueId = uuidv4();
    const [result] = await con.query('SHOW TABLES LIKE "Games"');

    if (result.length === 0) {
      await con.query(
        `CREATE TABLE Games(
          id INT PRIMARY KEY AUTO_INCREMENT,
          game_id VARCHAR(225)
        )`
      );
      console.log("Table Games created");
    }

    await con.query(`INSERT INTO Games (game_id) VALUES ('${UniqueId}')`);

    const [rows] = await con.query(
      `SELECT id FROM Games WHERE game_id = '${UniqueId}'`
    );
    if (rows.length > 0) {
      UniqueId = rows[0].id;
    } else {
      throw new Error("Game ID not found");
    }

    console.log("Game instance created with ID:", UniqueId);
    return UniqueId;
  } catch (error) {
    console.error("Error creating new game instance:", error);
    return "-1";
  }
}

export async function StoreMovesInDatabase(value: any, id: any) {
  try {
    let con = await createDatabaseconnection();
    let CheckExist = 0;
    await useDatabase(con, "chess")
    const tableExists = await checkTableExist(con);
    CheckExist = tableExists ? 1 : 0;

    if (!CheckExist) {
      await con.query(
        `CREATE TABLE Moves(
          id INT PRIMARY KEY AUTO_INCREMENT,
          fromPos VARCHAR(225),
          toPos VARCHAR(225),
          gameRef_id INT,
          FOREIGN KEY (gameRef_id) 
             REFERENCES Games(id)
             ON DELETE CASCADE
        )`
      );
      console.log("Table Moves created");
    }
    console.log('need to store', value);
    
    while (value.length != 0) {
      let { from, to } = value[0];
      await con.query(
        `INSERT INTO Moves (fromPos, toPos, gameRef_id) VALUES (?, ?, ?)`,
        [from, to, id]
      );
      value.shift();
    }

    await dataBaseDisconnection(con);
    console.log("Move stored in database");
  } catch (error) {
    console.error("Error storing move in database:", error);
  }
}

