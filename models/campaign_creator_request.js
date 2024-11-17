module.exports = (sequelize) => {
    const { DataTypes } = require('sequelize');

    const CampaignCreatorRequest = sequelize.define('CampaignCreatorRequest', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        identificationDocument: {
            type: DataTypes.BLOB,
            allowNull: false,
        },
        status: { // needs to be re-evaluated which implies rejecting a request
            type: DataTypes.ENUM('Pending', 'Accepted', 'Rejected'),
            allowNull: false,
            defaultValue: 'Pending',
        },
        campaign_creator_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'User',
                key: 'id',
            },
            allowNull: false,
        },
    }, {
        freezeTableName: true,
        timestamps: true
    });

    CampaignCreatorRequest.associate = (models) => {
        CampaignCreatorRequest.belongsTo(models.User, {
            foreignKey: 'campaign_creator_id',
            as: 'campaign_creator',
        });
    };

    return CampaignCreatorRequest;
};