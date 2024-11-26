const express = require('express');
const upload = require("../utils/upload");
const campaignUpdateController = require("../controllers/campaign-update-controller");

const router = express.Router();

router.post("/", upload.single("media"), campaignUpdateController.createCampaignUpdate);

module.exports = router;
