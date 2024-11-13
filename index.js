const fs = require("fs")
const express = require("express");

const app = express();

const PORT = 3000;


app.set('views', `${__dirname}/views`)
app.set('views engine', 'ejs')

app.get("/", (_, res) => {
	let content = fs.readFileSync("views/home.html");
	res.send(content.toString());
});

app.listen(PORT, () => {
	console.log(`Listenning at port ${PORT}`)
});

