import mysql from "mysql";

export const connectToDB = () => {
  const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin",
    database: "election",
  });

  db.connect((err) => {
    if (err) {
      console.error("Error connecting to database: ", err);
      return;
    }
    console.log("Connected to database");
  });
  return db;
};
