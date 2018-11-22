const connector = require('../dbConnector');
const Sequelize = require('sequelize');

const metaFields = {
    create_dt: {
        type: Sequelize.STRING,
        allowNull: false
    },
    update_dt: {
        type: Sequelize.STRING,
        allowNull: true
    },
    delete_dt: {
        type: Sequelize.STRING,
        allowNull: true
    }
}

module.exports = metaFields;