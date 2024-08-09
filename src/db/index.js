import mysql from "mysql";

export const connectToDB = () => {
  const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  db.connect((err) => {
    if (err) {
      console.error("Error connecting to database: ", err);
      return;
    }
    console.log("Connected to database");
  });

  //   connection.query('SELECT 1 + 1 AS solution', (err, rows, fields) => {
  //     if (err) throw err

  //     console.log('The solution is: ', rows[0].solution)
  //   })

  //   connection.end()
};
