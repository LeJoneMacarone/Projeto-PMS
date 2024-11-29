const { sequelize } = require("../utils/sequelize");
const { Campaign, User, Donation, CampaignUpdate, CampaignRequest } = require("../utils/sequelize").models;

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

	const request = await CampaignRequest.create({ status: "Pending" });
	const campaign = { title, description, goal, endDate, iban, creatorId, campaignRequestId: request.id };
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
	const page = req.params.page || 0;

	const result = await Campaign.findAll({ 
		include: [
			{ 
				model: User, 
				as: "creator",
				required: true,
			},
			{ 
				model: CampaignRequest, 
				as: "campaignRequest",
				where: { status: "Approved" },
			},
		],
		limit: CAMPAIGNS_PER_PAGE,
		offset: page,
	}) || [];

	const campaigns = result.map(({ dataValues, creator }) => { 
		const { id, title, description, goal } = dataValues;
		let campaign = { id, title, description, goal };
		campaign.creator = creator.dataValues;
		return campaign;
	});

	res.render("home", { user, campaigns });
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

	const campaign = await Campaign.findOne({ 
		where: { id },
		include: [{
			model: User,
			required: true,
			as: "creator",
		}],
	}) || {};

	const updates = await CampaignUpdate.findAll({
		where: { campaignId: id },
	});

	const totalDonated = await Donation.sum("value", {
		where: { campaignId: id },
	}) || 0;
	
	// TODO: exclude password field
	// TODO: move to another function
	const topDonations = await Donation.findAll({
		include : [{
			model: User,
			as: "donor",
		}],
		attributes: {
			include: [
				[sequelize.fn("SUM", sequelize.col("value")), "totalAmount"]
			],
		},
		where: { campaignId: id },
		group: "donorId",
		order: [
			["totalAmount", "DESC"],
		],
		limit: 5,
	});

	// TODO: exclude password field
	// TODO: move to another function
	const latestDonations = await Donation.findAll({
		include: [{
			model: User,
			as: "donor",
		}],
		group: ["donorId"],
		order: [
			["createdAt", "DESC"]
		],
		limit: 5,
	});

	const topDonors = topDonations.map(row => { 
		return {
			id: row.dataValues.donor.dataValues.id,
			username: row.dataValues.donor.dataValues.username,
			profile: row.dataValues.donor.dataValues.profilePicture,
			amountDonated: row.dataValues.totalAmount,
		}
	});
	
	const latestDonors = latestDonations.map(row => { 
		return {
			id: row.dataValues.donor.dataValues.id,
			username: row.dataValues.donor.dataValues.username,
			profile: row.dataValues.donor.dataValues.profilePicture,
			amountDonated: row.dataValues.value,
		}
	});

	const { user } = req.session;
	res.render("campaign", { user, campaign, totalDonated, updates, topDonors, latestDonors });
}

/** 
 * Render the campaigns owned by the current loggedd user. Returns to the 
 * login screen if the user is not a creator.
 *
 * @param{import("express").Request} req - The express request object.
 * @param{import("express").Response} res - The express response object.
 *
 * @returns{void}
 */
async function renderCampaignsOfCreator(req, res) {
	const { user } = req.session;

	if (!user || user.role != "campaign_creator") {
		req.session.error = "Login as a campaign creator to access this page.";
		res.redirect("/login");
		return;
	}

	const data = await Campaign.findAll({
		attributes: {
			include: [
				[sequelize.literal(`COALESCE(SUM("donations"."value"), 0)`), "totalDonated"],
			],
		},
		where: { creatorId: user.id },
		include: [
			{
				model: Donation,
				as: "donations",
				attributes: [],
			},
			{
				model: CampaignRequest,
				as: "campaignRequest",
			}
		],
		group: ["Campaign.id"],
	});

	const campaigns = data.map(({ dataValues, campaignRequest }) => {
		const { id, title, goal, totalDonated } = dataValues;
		const { status } = campaignRequest;
		return { id, title, goal, totalDonated, status };
	});

	res.render("creator_campaigns_on", { user, campaigns });
}

module.exports = { 
	renderCampaigns, 
	renderCampaignsOfCreator, 
	renderCampaign, 
	renderCampaignForm, 
	createCampaign 
};
