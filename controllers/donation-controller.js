const { Donation } = require("../db/sequelize.js").models;

/** 
 * Create a donation.
 *
 * @param{import("express").Request} req - The express request object.
 * @param{import("express").Response} res - The express response object.
 *
 * @returns{void}
 */
async function createDonation(req, res) {
	const { user } = req.session;

	if (!user || user.role != "donor") {
		req.session = "Login as a donor to access this feature.";
		res.redirect("login");
		return;
	}

	const { campaignId, amount } = req.body;
	await Donation.create({ donorId: user.id, campaignId, value: amount });

	res.redirect(`/campaigns/${campaignId}`);
}

module.exports = { createDonation };
