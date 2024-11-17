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
        campaign_id: {
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
            foreignKey: 'campaign_id',
            as: 'campaign',
        });
    };

    return CampaignUpdate;
};