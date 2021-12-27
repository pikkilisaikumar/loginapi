const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
app.use(express.json());
const dbPath = path.join(__dirname, "userData.db");
const bcrypt = require("bcrypt");
let db = null;
const intitailzeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("The server is started at 3000 port");
    });
  } catch (e) {
    console.log(`DB Error ${e.message}`);
    process.exit(1);
  }
};

intitailzeDbAndServer();
// console.log(db);

app.post("/register", async (request, response) => {
  const { username, name, password, gender, location } = request.body;
  const selectedQuery = `SELECT * FROM user WHERE username='${username}'`;
  const selectedone = await db.get(selectedQuery);
  if (selectedone === undefined) {
    const len_of_password = password.length;
    if (len_of_password < 5) {
      response.status(400); //bad request
      response.send("Password is too short");
    } else {
      const hashedpassword = await bcrypt.hash(password, 10);
      const newData = `
       INSERT INTO user(username,name,password,gender,location)
       VALUES 
        ('${username}','${name}','${hashedpassword}','${gender}','${location}');
      `;
      await db.run(newData);
      response.send("User created successfully");
    }
  } else {
    response.status(400); //that means from the client this is a bad request
    response.send("User already exists");
  }
});

app.post("/login", async (request, response) => {
  response.send("Hello");
});

module.exports = app;
