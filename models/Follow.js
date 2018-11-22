const connector = require('../dbConnector');
const Sequelize = require('sequelize');
const metaFields = require('./MetaFields');

const {create_dt, delete_dt} = metaFields;

const Follow = connector.define('Follow', {
    no: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    follower_id: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    target_id: {
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

module.exports = Follow;