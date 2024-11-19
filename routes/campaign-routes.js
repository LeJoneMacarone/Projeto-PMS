const express = require('express');
const campaignController = require('../controllers/campaign-controller');

const router = express.Router();

router.get("/", campaignController.renderCampaigns);

router.get("/:id(\\d+)", campaignController.renderCampaign);

router.get("/create", campaignController.renderCampaignForm);

router.post("/create", campaignController.createCampaign);

module.exports = router;