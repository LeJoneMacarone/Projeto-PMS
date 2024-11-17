const fs = require("fs")
const express = require("express");
const { Report } = require('./db/sequelize').models;
const reportRoutes = require('./routes/report-routes');

const app = express();
app.use(express.json());

app.use('/reports', reportRoutes);

const PORT = 3000;

app.get("/", (_, res) => {
	let content = fs.readFileSync("views/index.html");
	res.send(content.toString());
});

app.listen(PORT, () => {
	console.log(`Listenning at port ${PORT}`)
});

