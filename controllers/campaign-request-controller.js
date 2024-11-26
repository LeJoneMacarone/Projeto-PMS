const { Campaign, CampaignRequest, User } = require("../utils/sequelize.js").models;

/** 
 * Updates a campaign request status to either approved or rejected.
 *
 * @param{import("express").Request} req - The express request object.
 * @param{import("express").Response} res - The express response object.
 *
 * @returns{void}
 */
async function updateCampaignRequestStatus(req, res) {
	const { user } = req.session;
	const { campaignRequestId, status } = req.body;

	console.log({ validatorId: user.id, campaignRequestId, status });

	// TODO: check status before updating

	await Campaign.update({ validatorId: user.id }, { where: { campaignRequestId } });
	await CampaignRequest.update({ status }, { where: { id: campaignRequestId } });

	res.redirect("/requests/campaigns");
}

/** 
 * Render camapaign requests.
 *
 * @param{import("express").Request} req - The express request object.
 * @param{import("express").Response} res - The express response object.
 *
 * @returns{void}
 */
async function renderCampaignRequests(req, res) {

	const { user } = req.session;

	if (!user) {
		res.redirect("/login");
	}

	if (!(user.role == "administrator" || user.role == "root_administrator")) {
		req.session.error = "Login as administrator or root_administrator to access this feature";
		res.redirect("/login");
	}

	const campaigns = await Campaign.findAll({
		include: [{
			model: CampaignRequest,
			as: "campaignRequest",
			required: true,
			where: {
				status: "Pending",
			},
		}, {
			model: User,
			as: "creator",
			required: true,
		}],
	});

	res.render("admin_validate_campaigns_view", { user, campaigns });
}

/** 
 * Render a specific camapaign request, based on the specified id.
 *
 * @param{import("express").Request} req - The express request object.
 * @param{import("express").Response} res - The express response object.
 *
 * @returns{void}
 */
async function renderCampaignRequest(req, res) {
	// TODO: implement this function
}

module.exports = { renderCampaignRequests, renderCampaignRequest, updateCampaignRequestStatus };
