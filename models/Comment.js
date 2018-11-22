const connector = require('../dbConnector');
const Sequelize = require('sequelize');
const metaFields = require('./MetaFields');

const {create_dt, update_dt, delete_dt} = metaFields;

const Comment = connector.define('Comment', {
    no: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    text: {
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
    },
    image_id: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
},{
    freezeTableName: true,
    underscored: true,
    timestamps: false
})

module.exports = Comment;