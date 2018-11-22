const User = require('../models/User');
const Image = require('../models/Image');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification')
const DateFormatConverter = require('../lib/DateFormatConverter');

const relatedModel = {
    include: [
        {
            model: Image,
            where: {
                isDelete: false
            }
        },
        {
            model: User,
            as: 'from',
            where: {
                isDelete: false
            }
        },
        {
            model: Comment,
            where: {
                isDelete: false
            }
        }
    ]
}


const service = {
    getNotifications: (loginUser_id) => Notification.findAll(
        {
            ...relatedModel,

            where: {
                to_id: loginUser_id,
                isDelete: false
            }
        }),
    createNotification: (from, to, image_id, comment_id, type) => {

        //팔로우나 좋아요 같이 체크형태의 테이블(선택 & 취소)은 기존 알람이 있는 경우 없데이트, 아닌경우 알람 생성
        if(type === 'follow' || type === 'like'){
            Notification.findOne({
                where: {
                    from_id: from,
                    to_id: to,
                    image_id: image_id,
                    isDelete: false
                }
            }).then(notification => {
                if(notification === null){
                    return Notification.create({
                        from_id: from,
                        to_id: to,
                        image_id: image_id,
                        comment_id: comment_id,
                        isDelete: false,
                        type: type,
                        create_dt: DateFormatConverter.convertToSave(new Date())
                    })
                }else{
                    return Notification.update({
                        create_dt: DateFormatConverter.convertToSave(new Date())
                    },{
                        where: {
                            no: notification.dataValues.no
                        }
                    })
                }
            })

        //댓글같이 계속 기록되는 로우는 그냥 알람 생성
        } else{
            return Notification.create({
                from_id: from,
                to_id: to,
                image_id: image_id,
                comment_id: comment_id,
                isDelete: false,
                type: type,
                create_dt: DateFormatConverter.convertToSave(new Date())
            })
        }

    }
}

module.exports = service