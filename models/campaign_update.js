module.exports = (sequelize) => {
    const { DataTypes } = require('sequelize');

    const CampaignUpdate = sequelize.define('CampaignUpdate', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
		// TODO: needs to be rethought
        media: {
            type: DataTypes.BLOB,
            allowNull: true, // This field can be null if no files are uploaded
        },
        campaignId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Campaign',
                key: 'id',
            },
            allowNull: false,
        },
    }, {
        freezeTableName: true,
        timestamps: true
    });

    CampaignUpdate.associate = (models) => {
        CampaignUpdate.belongsTo(models.Campaign, {
            foreignKey: 'campaignId',
            as: 'campaign',
        });
    };

    return CampaignUpdate;
};
