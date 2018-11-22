const connector = require('../dbConnector');
const Sequelize = require('sequelize');
const metaFields = require('./MetaFields');

const {create_dt, update_dt, delete_dt} = metaFields;

const Image = connector.define('Image', {
    no: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    file: {
        type: Sequelize.STRING,
        allowNull: false
    },
    location: {
        type: Sequelize.STRING,
        allowNull: true
    },
    caption: {
        type: Sequelize.STRING,
        allowNull: true
    },
    tags: {
        type: Sequelize.STRING,
        allowNull: true
    },
    isDelete: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    create_dt,
    update_dt,
    delete_dt,
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
},{
    freezeTableName: true,
    underscored: true,
    timestamps: false
})

module.exports = Image;