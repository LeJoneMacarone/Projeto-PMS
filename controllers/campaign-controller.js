/** 
 * Render the campaigns.
 *
 * @param{import("express").Request} req - The express request object.
 * @param{import("express").Response} res - The express response object.
 *
 * @returns{void}
 */
function viewCampaigns(req, res) {
	// TODO: fetch user from user repository or session variable
	let user = "admin"

	// TODO: fetch campaign from campaigns repo
	let campaigns = [
		{
			title: "Title",
			creator: null,
			description: "Description.",
			goal: 100000,
			donationsPercentage: 20,
			updates: null,
			creator: {
				username: "name",
			},
		}
	]

	res.render("home", { user, campaigns });
}

module.exports = { viewCampaigns }
