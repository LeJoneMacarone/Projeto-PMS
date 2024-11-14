const fs = require("fs")
const express = require("express");
const sqlite3 = require("sqlite3").verbose();

let sql;

//Connect to DB
const db = new sqlite3.Database("./database.db", sqlite3.OPEN_READWRITE, (err) => {
	if (err) {
		console.error(err.message);
	} else {
		console.log('Connected to the database.');
	}
});

//Create tables
const createTable = (tableName, columns) => {
    const query = `CREATE TABLE IF NOT EXISTS ${tableName} ( ${columns} )`;
    db.run(query, (err) => {
        if (err) {
            console.error(err.message)
        } else {
            console.log(`Existence of table ${tableName} successfully verified.`);
        }
    });
};

createTable('Role', "id INTEGER PRIMARY KEY, name TEXT NOT NULL");

createTable('User', "id INTEGER PRIMARY KEY, username TEXT NOT NULL, password TEXT NOT NULL, profilePicture BLOB, role_id INTEGER REFERENCES Role(id)");

createTable('Campaign', "id INTEGER PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL, goal REAL NOT NULL, endDate DATE NOT NULL, iban TEXT NOT NULL, creator_id INTEGER REFERENCES User(id), validator_id INTEGER REFERENCES User(id)");

createTable('Donation', "id INTEGER PRIMARY KEY, value REAL NOT NULL, date DATE NOT NULL, campaign_id INTEGER REFERENCES Campaign(id), user_id INTEGER REFERENCES User(id)");

createTable('Report', "id INTEGER PRIMARY KEY, description TEXT NOT NULL, campaign_id INTEGER REFERENCES Campaign(id), user_id INTEGER REFERENCES User(id)");

createTable('CampaignCreatorRequest', "id INTEGER PRIMARY KEY, identificationDocument BLOB, creationDate BLOB, status TEXT NOT NULL, role_id INTEGER REFERENCES Role(id)");

createTable('CampaignRequest', "id INTEGER PRIMARY KEY, creationDate BLOB NOT NULL, status TEXT NOT NULL, campaign_id INTEGER REFERENCES Campaign(id)");

createTable('CampaignUpdate', "id INTEGER PRIMARY KEY, content TEXT NOT NULL, multimediaFiles BLOB, publicationDate DATE NOT NULL, campaign_id INTEGER REFERENCES Campaign(id)");

const app = express();

const PORT = 3000;

app.get("/", (_, res) => {
	let content = fs.readFileSync("views/index.html");
	res.send(content.toString());
});

app.listen(PORT, () => {
	console.log(`Listenning at port ${PORT}`)
});

