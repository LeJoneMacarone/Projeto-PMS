// TODO: use database models instead
const USERS = require("../models/users-model");

/** 
 * Render the register page.
 *
 * @param{import("express").Request} req - The express request object.
 * @param{import("express").Response} res - The express response object.
 *
 * @returns{void}
 */
function renderRegisterPage(req, res) {
	const error = req.session.message;
	req.session.message = "";
	res.render("register", { error });
}

/** 
 * Render the login page.
 *
 * @param{import("express").Request} req - The express request object.
 * @param{import("express").Response} res - The express response object.
 *
 * @returns{void}
 */
function renderLoginPage(req, res) {
	req.session.user = {};

	const error = req.session.message;
	req.session.message = "";
	
	res.render("login", { error });
}

/** 
 * Render the user profile.
 *
 * @param{import("express").Request} req - The express request object.
 * @param{import("express").Response} res - The express response object.
 *
 * @returns{void}
 */
function renderProfilePage(req, res) {
	const { user } = req.session;
	res.render("profile", { user });
}

/** 
 * Register the user in the platform.
 *
 * @param{import("express").Request} req - The express request object.
 * @param{import("express").Response} res - The express response object.
 *
 * @returns{void}
 */
function register(req, res) {
	const { username, password, confirm_password, role } = req.body;

	if (!password || !username || !confirm_password || !role) {
		req.session.message = "Empty fields.";
		res.redirect("/register");
		return; 
	}

	if (password != confirm_password) {
		req.session.message = "Different passwords.";
		res.redirect("/register");
		return; 
	}

	// TODO: implement with database operations
	if (USERS.some(user => user.username == username)) {
		req.session.message = "Username already taken.";
		res.redirect("/register");
		return; 
	}
	
	// TODO: implement with database operations
	const id = USERS
		.sort((u1, u2) => u1.id - u2.id)
		.id + 1;
	// TODO: use a default profile picture
	const user = { id, username, password, role, profilePicture: null };
	USERS.push(user);

	res.redirect("/login");
}

/** 
 * Login the user, saving data on a session variable.
 *
 * @param{import("express").Request} req - The express request object.
 * @param{import("express").Response} res - The express response object.
 *
 * @returns{void}
 */
function login(req, res) {
	const { username, password } = req.body;
	
	// TODO: implement with database operations
	const user = USERS
		.find(user => user.username == username && user.password == password);

	if (!user) {
		req.session.message = "User not found."
		res.redirect("/login");
		return;
	}

	req.session.user = user;
	res.redirect("/");
}

/** 
 * Update the user information.
 *
 * @param{import("express").Request} req - The express request object.
 * @param{import("express").Response} res - The express response object.
 *
 * @returns{void}
 */
function update(req, res) {
	// TODO: implement the function
	res.redirect("/profile");
}

module.exports = { renderRegisterPage, renderLoginPage, renderProfilePage, login, register, update }
