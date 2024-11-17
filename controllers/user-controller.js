const { User } = require("../db/sequelize").models;

/** 
 * Render the register page.
 *
 * @param{import("express").Request} req - The express request object.
 * @param{import("express").Response} res - The express response object.
 *
 * @returns{void}
 */
function renderRegisterPage(req, res) {
	const { user, error } = req.session;
	req.session.error = "";
	res.render("register", { user, error });
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
	const { user, error } = req.session;
	req.session.error = "";
	res.render("login", { user, error });
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

	if (!user) {
		req.session.error = "Log in to access the profile page.";
		res.redirect("/login"); 
		return;
	}

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
async function register(req, res) {
	const { username, password, confirm_password, role } = req.body;
		
	if (!password || !username || !confirm_password || !role) {
		req.session.error = "Empty fields.";
		res.redirect("/register");
		return; 
	}

	if (password != confirm_password) {
		req.session.error = "Different passwords.";
		res.redirect("/register");
		return; 
	}

	let user = await User.findOne({ where: { username }});

	if (user) {
		req.session.error = "Username already taken.";
		res.redirect("/register");
		return; 
	}
	
	user = { username, password, role, profilePicture: null };
	await User.create(user);

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
async function login(req, res) {
	const { username, password } = req.body;
	
	const user = await User.findOne({ where: { username, password }});

	if (!user) {
		req.session.error = "User not found."
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

/** 
 * Logout the user.
 *
 * @param{import("express").Request} req - The express request object.
 * @param{import("express").Response} res - The express response object.
 *
 * @returns{void}
 */
function logout(req, res) {
	req.session.destroy();
	res.redirect("/login");
}

module.exports = { renderRegisterPage, renderLoginPage, renderProfilePage, login, logout, register, update };
