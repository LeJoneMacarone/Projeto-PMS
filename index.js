// Dependencies
const express = require("express");
const session = require("express-session");

// Routes
const userRoutes = require("./routes/user-routes.js");
const reportRoutes = require("./routes/report-routes");

// Controllers
const campaignController = require("./controllers/campaign-controller");

// Variables
const PORT = 3000;
const ONEDAY = 24 * 60 * 60 * 1000;
const SECRET = "secret"
const app = express();
app.use(express.json());

// Config
app.set('views', `${__dirname}/views`);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: SECRET,
    saveUninitialized: true,
    cookie: { maxAge: ONEDAY },
    resave: false
}));

// Routes
app.use("/", userRoutes);
app.use("/reports", reportRoutes);
app.get("/", campaignController.renderCampaigns);
app.get("/campaign/:id", campaignController.renderCampaign);

// Entry point
app.listen(PORT, () => {
	console.log(`Listenning at port ${PORT}`)
});

