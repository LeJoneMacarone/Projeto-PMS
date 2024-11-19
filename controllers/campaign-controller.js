const { sequelize } = require("../db/sequelize");
const { Campaign, User, Donation, CampaignUpdate } = require("../db/sequelize").models;

const CAMPAIGNS_PER_PAGE = 6;

/** 
 * Create a campaign.
 *
 * @param{import("express").Request} req - The express request object.
 * @param{import("express").Response} res - The express response object.
 *
 * @returns{void}
 */
async function createCampaign(req, res) {
	// TODO: maybe check if user is actually a creator(?) 
	
	const creatorId = req.session.user.id;
	const { title, description, goal, endDate, iban } = req.body;

	const campaign = { title, description, goal, endDate, iban, creatorId };
	await Campaign.create(campaign);
	
	res.redirect("/campaigns");
}

/** 
 * Render the campaign creation form.
 *
 * @param{import("express").Request} req - The express request object.
 * @param{import("express").Response} res - The express response object.
 *
 * @returns{void}
 */
function renderCampaignForm(req, res) {
	const { user } = req.session;
	
	if (!user || user.role != "campaign_creator") {
		req.session.error = "Login as a campaign creator to access this page."
		res.redirect("/login");
		return;
	}

	res.render("creator_generate_campaign", { user });
}

/** 
 * Render the campaigns page.
 *
 * @param{import("express").Request} req - The express request object.
 * @param{import("express").Response} res - The express response object.
 *
 * @returns{void}
 */
async function renderCampaigns(req, res) {
	const { user } = req.session;
	
	// TODO: dinamically get the page number
	const page = 0
	const campaigns = await Campaign.findAndCountAll({ 
		limit: page,
		offset: CAMPAIGNS_PER_PAGE,
	}).rows || [];

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
async function renderCampaign(req, res) {
	const id = req.params["id"];

	const campaign = Campaign.findOne({ 
		where: { id },
		include: [{
			model: User,
			required: true,
			as: "creator",
		}],
	}) || {};

	const topDonations = User.findAll("value", {
		where: { campaignId: id },
		include: [
			{ model: User, as: "donor", required: true }
		],
		group: "userId",
		order: [sequelize.fn("sum", sequelize.col("value")), "DESC"],
		limit: 5,
	});

	
	/*
	let campaign = CAMPAIGNS.find(campaign => campaign.id == id);

	campaign.creator = USERS.find(user => user.id == campaign.creatorId);

	const donations = DONATIONS.filter(donation => donation.campaignId == campaign.id);
	campaign.totalDonated = donations
		.map(donation => donation.value)
		.reduce((accumulator, current) => accumulator + current);

	campaign.topDonors = [];
	campaign.newDonors = [];
	
	const accumulatedDonations = new Map();

	donations.forEach(({ donorId, value }) => {
		const donationValue = accumulatedDonations.get(donorId) || 0;
		accumulatedDonations.set(donorId, donationValue + value);
	});

	for (const [donorId, totalDonated] of accumulatedDonations) {
		if (campaign.topDonors.length == 5) break;

		let user = Object.assign({}, USERS.find(user => user.id == donorId));
		user.amountDonated = totalDonated;
		campaign.topDonors.push(user);
	}

	donations.sort((d1, d2) => d1.date.getTime() - d2.date.getTime());

	const latestDonations = new Map();

	for (const donation of donations) {
		if (latestDonations == 5) break;
		latestDonations.set(donation.donorId, donation.id);
	}

	for (const [donorId, id] of latestDonations) {
		let user = Object.assign({}, USERS.find(user => user.id == donorId));
		user.amountDonated = DONATIONS.find(donation => donation.id = id).value;
		campaign.newDonors.push(user);
	}

	campaign.updates = UPDATES.filter(update => update.campaignId == id)
	*/
	
	const { user } = req.session;
	res.render("campaign", { user, campaign });
}

module.exports = { renderCampaigns, renderCampaign }
