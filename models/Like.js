const connector = require('../dbConnector');
const Sequelize = require('sequelize');
const metaFields = require('./MetaFields');

const {create_dt, delete_dt} = metaFields;

const Like = connector.define('Like', {
    no: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    image_id: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    isDelete: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    create_dt,
    delete_dt
},{
    freezeTableName: true,
    underscored: true,
    timestamps: false
})

module.exports = Like;