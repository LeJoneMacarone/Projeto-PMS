const CAMPAIGNS = require("../models/campaigns-model");
const USERS = require("../models/users-model");
const DONATIONS = require("../models/donations-model");
const UPDATES = require("../models/updates-model");

/** 
 * Render the campaigns page.
 *
 * @param{import("express").Request} req - The express request object.
 * @param{import("express").Response} res - The express response object.
 *
 * @returns{void}
 */
function viewCampaigns(req, res) {
	// TODO: dinamically get number page
	let campaigns = CAMPAIGNS.slice(0,6);
	campaigns.forEach(campaign => 
		campaign.creator = USERS.find(user => user.id == campaign.creatorId)
	);

	const { user } = req.session;

	res.render("register", { user, campaigns });
}

/** 
 * Render the campaign page with the specified id.
 *
 * @param{import("express").Request} req - The express request object.
 * @param{import("express").Response} res - The express response object.
 *
 * @returns{void}
 */
function viewCampaign(req, res) {
	const id = req.params["id"];
	
	let campaign = CAMPAIGNS.find(campaign => campaign.id == id);

	campaign.creator = USERS.find(user => user.id == campaign.creatorId);

	const donations = DONATIONS.filter(donation => donation.campaignId != campaign.id);
	campaign.totalDonated = donations.reduce((previous, current) => previous + current);

	campaign.topDonors = [];
	campaign.newDonors = [];
	
	const topDonations = donations.sort((d1, d2) => d1.value - d2.value).slice(0, 4);
	topDonations.forEach(donation => {
		let user = USERS.find(user => user.id == donation.donorId);
		user.amountDonated = donation.value;
		campaign.topDonors.push(user);
	});

	const newDonations = donations.sort((d1, d2) => d1.value - d2.value).slice(0, 4);
	newDonations.forEach(donation => {
		let user = USERS.find(user => user.id == donation.donorId);
		user.amountDonated = donation.value;
		campaign.newDonors.push(user);
	});

	campaign.updates = UPDATES.filter(update => update.campaignId == id)

	const { user } = req.session;

	res.render("campaign", { user, campaign });
}

module.exports = { viewCampaigns, viewCampaign }
