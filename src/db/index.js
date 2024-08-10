import mysql from "mysql";

export const connectToDB = () => {
  const db = mysql.createConnection({
<<<<<<< HEAD
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
=======
    host: "localhost",
    user: "root",
    password: "admin",
    database: "election",
>>>>>>> roshan
  });

  db.connect((err) => {
    if (err) {
      console.error("Error connecting to database: ", err);
      return;
    }
    console.log("Connected to database");
  });
  return db;
<<<<<<< HEAD

  //   connection.query('SELECT 1 + 1 AS solution', (err, rows, fields) => {
  //     if (err) throw err

  //     console.log('The solution is: ', rows[0].solution)
  //   })

  //   connection.end()
=======
>>>>>>> roshan
};
