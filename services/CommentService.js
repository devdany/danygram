const Image = require('../models/Image');
const User = require('../models/User');
const Comment = require('../models/Comment');
const dateFormatConverter = require('../lib/DateFormatConverter');
const {createNotification} = require('./NotificationService');

const service = {
    findAll: () => Comment.findAll({
        include: [
            {
                model: User,
                required: true,
                where: {
                    isDelete: false
                }
            },
            {
                model: Image,
                required: true,
                where: {
                    isDelete: false
                }
            }
        ],
        where: {
            isDelete: false
        }
    }),
    write: (text, loginUser_id, target_id) => Comment.create({
        text: text,
        isDelete: false,
        create_dt: dateFormatConverter.convertToSave(new Date()),
        user_id: loginUser_id,
        image_id: target_id
    }).then(comment => {

        Image.findOne({
            where: {
                no: target_id,
                isDelete: false
            }
        }).then(image => {
            createNotification(loginUser_id, image.dataValues.user_id, target_id, comment.dataValues.no, 'comment');
        });

        return comment;

    }),
    remove: (comment_id) => Comment.update({
        isDelete: true,
        delete_dt: dateFormatConverter.convertToSave(new Date())
    },{
        where: {
            no: comment_id
        }
    }),
    findOne: (comment_id) => Comment.findOne({
        where:{
            no: comment_id,
            isDelete: false
        },
        include:[
            {
                model: Image,
                required: true,
                where: {
                    isDelete: false
                }
            }
        ]
    })
}

module.exports = service