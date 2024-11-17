// Dependencies
const express = require("express");
const session = require("express-session");

// Controllers
const campaignController = require("./controllers/campaign-controller");
const userController = require("./controllers/user-controller.js")

// Variables
const PORT = 3000;
const ONEDAY = 24 * 60 * 60 * 1000;
const SECRET = "secret"
const app = express();

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
app.get("/register", userController.renderRegisterPage);
app.get("/login", userController.renderLoginPage);
app.get("/profile", userController.renderProfilePage);
app.post("/register", userController.register);
app.post("/login", userController.login);
app.post("/logout", userController.logout);
app.post("/profile", userController.update);
app.get("/", campaignController.renderCampaigns);
app.get("/campaign/:id", campaignController.renderCampaign);

// Entry point
app.listen(PORT, () => {
	console.log(`Listenning at port ${PORT}`)
});

