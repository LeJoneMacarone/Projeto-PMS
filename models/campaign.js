module.exports = (sequelize) => {
    const { DataTypes } = require('sequelize');

    const Campaign = sequelize.define('Campaign', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        goal: {
            type: DataTypes.DECIMAL(10, 2), // 10 digits total, 8 before and 2 after '.'
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        iban: {
            type: DataTypes.STRING(34),
            allowNull: false,
        },
        creatorId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'User',
                key: 'id',
            },
            allowNull: false,
        },
        validatorId: { // if null then dont show for donors
            type: DataTypes.INTEGER,
            references: {
                model: 'User',
                key: 'id',
            },
            allowNull: true,
        },

        campaignRequestId: { // null if request expired after being accepted (?)
            type: DataTypes.INTEGER,
            references: {
                model: 'CampaignRequest',
                key: 'id',
            },
            allowNull: true, 
        },
    });
    Campaign.associate = (models) => {
        Campaign.belongsTo(models.User, {
            foreignKey: 'creatorId',
            as: 'creator',
        });

        Campaign.belongsTo(models.User, {
            foreignKey: 'validatorId',
            as: 'validator',
        });

        Campaign.belongsTo(models.CampaignRequest, {
            foreignKey: 'campaignRequestId',
            as: 'campaignRequest',
        });
    };

    return Campaign;
};
