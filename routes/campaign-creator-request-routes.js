const express = require('express');
const campaignCreatorRequestController = require('../controllers/campaign-creator-request-controller');

const router = express.Router();

// Route to get all pending reports
router.get('/', campaignCreatorRequestController.getAllPendingCampaignCreatorRequest);

// Route to get a specific report by ID
router.get('/:id', campaignCreatorRequestController.getCampaignCreatorRequestById);

// Route to delete a report by ID
router.delete('/:id', campaignCreatorRequestController.deleteCampaignCreatorRequest);

module.exports = router;