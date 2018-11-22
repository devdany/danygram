const connector = require('../dbConnector');
const Sequelize = require('sequelize');
const metaFields = require('./MetaFields');

const {create_dt, delete_dt} = metaFields;

const Notification = connector.define('Notification', {
    no: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    from_id: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    to_id: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    image_id: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    comment_id: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    isDelete: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false
    },
    create_dt,
    delete_dt
},{
    freezeTableName: true,
    underscored: true,
    timestamps: false
})

module.exports = Notification;