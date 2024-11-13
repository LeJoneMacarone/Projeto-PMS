const express = require("express");

const campaignController = require("./controllers/campaign-controller");

const app = express();

const PORT = 3000;

app.set('views', `${__dirname}/views`)
app.set('view engine', 'ejs')

app.get("/", campaignController.viewCampaigns);

app.listen(PORT, () => {
	console.log(`Listenning at port ${PORT}`)
});

