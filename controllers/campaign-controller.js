const CAMPAIGNS = require("../models/campaigns-model");
const USERS = require("../models/users-model");
const DONATIONS = require("../models/donations-model");
const UPDATES = require("../models/updates-model");

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
	let user = "admin";

	// TODO: fetch campaign from campaigns repo
	let campaigns = [
		{
			title: "Title",
			creator: null,
			description: "Description.",
			goal: 100000,
			donationsPercentage: 0,
			updates: null,
			creator: {
				username: "name",
			},
		}
	];

	res.render("home", { user, campaigns });
}

/** 
 * Render the campaign with the specified id.
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

	// TODO: get user role from session variable
	const user = "donor"

	res.render("campaign", { user, campaign });
}

module.exports = { viewCampaigns, viewCampaign }
