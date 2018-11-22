const Like = require('../models/Like');
const User = require('../models/User');
const Image = require('../models/Image');
const DateFormatConverter = require('../lib/DateFormatConverter');
const {createNotification} = require('./NotificationService');


const relatedModel = {
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
    ]
}


const service = {
    findAll: () => Like.findAll({
        ...relatedModel,
        where: {
            isDelete: false
        }
    }),

    checkLike: async (loginUser_id, target_id) => {
        const alreadyLike = await Like.findOne({
            where: {
                user_id: loginUser_id,
                image_id: target_id,
                isDelete: false
            }
        })


        //아직 좋아요 한 이미지가 아닌 경우
        if (alreadyLike === null) {
            //좋아요 생성
            return Like.create({
                user_id: loginUser_id,
                image_id: target_id,
                isDelete: false,
                create_dt: DateFormatConverter.convertToSave(new Date())
            }).then(like => {

                //좋아요 후 알람 생성
                Image.findOne({
                    where: {
                        no: target_id,
                        where: {
                            isDelete: false
                        }
                    }
                }).then(image => {
                    createNotification(loginUser_id, image.dataValues.user_id, target_id, null, 'like');
                });

                return like;

            })

            //좋아요 한적 있는 이미지인 경우 (했다가 취소)
        } else {

            //좋아요 했던 이미지는 좋아요 취소( isDelete = true ), 취소되어 있던 이미지는 다시 좋아요
            return Like.update({
                isDelete: !alreadyLike.dataValues.isDelete,
                delete_dt: !alreadyLike.dataValues.delete_dt ? DateFormatConverter.convertToSave(new Date()) : null
            }, {
                where: {
                    no: alreadyLike.dataValues.no
                }
            }).then(result => {

                //기존에 좋아요 취소되어 있다가 다시 좋아요 되는 경우에는 알람 생성
                if (alreadyLike.dataValues.isDelete) {
                    Image.findOne({
                        where: {
                            no: target_id
                        }
                    }).then(image => {
                        createNotification(loginUser_id, image.dataValues.user_id, target_id, null, 'like');
                    });
                }

                return result;
            })
        }
    },
    likeUsersByImage: (image_id) => Like.findAll(
        {
            where: {
                image_id: image_id,
                isDelete: false
            },
            attributes:[],
            include: [
                {
                    model: User,
                    required: true,
                    attributes:['no', 'profile_img', 'username'],
                    where: {
                        isDelete: false
                    }
                }
            ]
        })
}


module.exports = service