const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const fs = require('fs');

const sequelize = new Sequelize({ dialect: 'sqlite', storage: './db/database.sqlite' });

const models = {};

fs.readdirSync(path.join(__dirname, '../models'))
    .filter(file => file.endsWith('.js'))
    .forEach(file => {
        const model = require(path.join(__dirname, '../models/', file))(sequelize, DataTypes);
        models[model.name] = model;
    });


Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

sequelize.sync()
    .then(() => console.log('DB synced successfully'))
    .catch(err => console.error('Error syncing DB:', err));

module.exports = { sequelize, models };