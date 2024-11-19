const { CampaignCreatorRequest, User } = require('../db/sequelize').models;

exports.getAllPendingCampaignCreatorRequest = async (req, res) => {
    try {
        const { user } = req.session;
        if (!user) {
            res.redirect("/login");
        } else {
            if (user.role == "administrator") {
                const requests = await CampaignCreatorRequest.findAll({
                    where: {
                        status: 'Pending'
                    },
                    include: [
                        { model: User, as: 'campaignCreator' }
                    ]
                });

                res.render('admin_validate_creator_view', { user, requests });
                // res.status(200).json(requests);
            } else {
                res.redirect("/login");
            }
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCampaignCreatorRequestById = async (req, res) => {
    try {
        const { user } = req.session;
        if (!user) {
            res.redirect("/login");
        } else {
            if (user.role == "administrator") {
                const request = await CampaignCreatorRequest.findByPk(req.params.id, {
                    include: [
                        { model: User, as: 'campaignCreator' }
                    ]
                });

                if (!request) {
                    return res.status(404).json({ error: 'Request not found' });
                }

                res.render('admin_validate_creator_info', { user, request });
                // res.status(200).json(request);
            } else {
                res.redirect("/login");
            }
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteCampaignCreatorRequest = async (req, res) => {
    try {
        const { user } = req.session;
        if (!user) {
            res.redirect("/login");
        } else {
            if (user.role == "administrator") {
                const request = await CampaignCreatorRequest.findByPk(req.params.id);
                if (!request) {
                    return res.status(404).json({ error: 'Request not found' });
                }
                await request.destroy();
                res.render("admin_validate_creator_view", { user }); //TODO redirect when the route to admin pages is done
            } else {
                res.redirect("/login");
            }
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
