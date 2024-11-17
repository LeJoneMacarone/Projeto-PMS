module.exports = (sequelize) => {
    const { DataTypes } = require('sequelize');

    const Report = sequelize.define('Report', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        campaign_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Campaign',
                key: 'id',
            },
            allowNull: false,
        },
        reporter_id: {
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

    Report.associate = (models) => {
        Report.belongsTo(models.Campaign, {
            foreignKey: 'campaign_id',
            as: 'campaign',
        });
        Report.belongsTo(models.User, {
            foreignKey: 'reporter_id',
            as: 'reporter',
        });
    };

    return Report;
};