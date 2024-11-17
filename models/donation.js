module.exports = (sequelize) => {
    const { DataTypes } = require('sequelize');

    const Donation = sequelize.define('Donation', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        value: {
            type: DataTypes.DECIMAL(10, 2),  // 10 digits total, 8 before and 2 after '.'
            allowNull: false,
        },
        date: {
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
        donorId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'User',
                key: 'id',
            },
            allowNull: false,
        },
    });

    Donation.associate = (models) => {
        Donation.belongsTo(models.Campaign, {
            foreignKey: 'campaignId',
            as: 'campaign',
        });
        Donation.belongsTo(models.User, {
            foreignKey: 'donorId',
            as: 'donor',
        });
    };

    return Donation;
};
