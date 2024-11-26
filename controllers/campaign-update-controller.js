const { CampaignUpdate } = require("../db/sequelize.js").models

/** 
 * Create an update for the campaign.
 *
 * @param{import("express").Request} req - The express request object.
 * @param{import("express").Response} res - The express response object.
 *
 * @returns{void}
 */
async function createCampaignUpdate(req, res) {
	const { campaignId, content } = req.body;
	const media = req.file.buffer;

	await CampaignUpdate.create({ campaignId, content, media });

	res.redirect("/campaigns");
}

module.exports = { createCampaignUpdate };
