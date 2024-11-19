const { Report, Campaign, User } = require('../db/sequelize').models;

// Renders the page with all reports
exports.getAllReports = async (req, res) => {
    try {
        const reports = await Report.findAll({
            include: [
                { model: Campaign, as: 'campaign' },
                { model: User, as: 'reporter' }
            ]
        });
        const { user } = req.session;
        res.render('admin_validate_reports_view', { user , reports: reports });
        //res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Renders a specific report by its ID
exports.getReportById = async (req, res) => {
    try {
        const report = await Report.findByPk(req.params.id, {
            include: [
                { model: Campaign, as: 'campaign' },
                { model: User, as: 'reporter' }
            ]
        });
        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }
        const { user } = req.session;
        res.render('admin_validate_report_info', { user , report: report });
        //res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Creates a new report
exports.createReport = async (req, res) => {
    try {
        const { description, campaign_id, reporter_id } = req.body;
        const newReport = await Report.create({ description: description, campaignId: campaign_id, reporterId: reporter_id });
        res.status(201).json(newReport);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Deletes a specific report
exports.deleteReport = async (req, res) => {
    try {
        const report = await Report.findByPk(req.params.id);
        if (!report) {
            return res.status(404).json({ error: 'Report not found' });
        }
        await report.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};