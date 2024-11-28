const { CampaignUpdate } = require("../utils/sequelize.js").models

/** 
 * Create an update for the campaign.
 *
 * @param{import("express").Request} req - The express request object.
 * @param{import("express").Response} res - The express response object.
 *
 * @returns{void}
 */
async function createCampaignUpdate(req, res) {	
	let data = {};
	data.campaignId = req.body.campaignId;
	data.content = req.body.content;
	if (req.file) data.media = req.file.buffer;

	await CampaignUpdate.create(data);

	res.redirect("/campaigns");
}

module.exports = { createCampaignUpdate };
