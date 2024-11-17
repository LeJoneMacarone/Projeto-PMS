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
        multimediaFiles: { // (e.g., images, videos)
            type: DataTypes.BLOB,
            allowNull: true, // This field can be null if no files are uploaded
        },
        publicationDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        campaignId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Campaign',
                key: 'id',
            },
            allowNull: false,
        },
    });

    CampaignUpdate.associate = (models) => {
        CampaignUpdate.belongsTo(models.Campaign, {
            foreignKey: 'campaignId',
            as: 'campaign',
        });
    };

    return CampaignUpdate;
};
