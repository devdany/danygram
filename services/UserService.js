const User = require('../models/User');
const Image = require('../models/Image');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
const Follow = require('../models/Follow');
const {createNotification} = require('./NotificationService');
const dateFormatConverter = require('../lib/DateFormatConverter');

const relatedModel = {
    include: [
        {
            model: Image,
            include: [
                {
                    model: Like,
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
            ],
            where: {
                isDelete: false
            }
        }
    ]
}

const service = {
    findAll: () => User.findAll({
        where: {
            isDelete: false
        },
        ...relatedModel
    }),
    alreadyUser: (email) => {
        return User.findOne({
            where:{
                email: email
            }
        }).then(user => {

            return user !== null
        })
    },

    latestUser: (amount) => User.findAll({
        where: {
            isDelete: false
        },
        order: [['no', 'DESC']],
        limit: amount
    }),

    checkFollow: async (loginUser_id, target_id) => {
        const alreadyFollow = await Follow.findOne({
            where: {
                follower_id: loginUser_id,
                target_id: target_id
            }
        })

        if (alreadyFollow === null) {
            return Follow.create({
                follower_id: loginUser_id,
                target_id: target_id,
                isDelete: false,
                create_dt: dateFormatConverter.convertToSave(new Date())
            }).then(follow => {
                createNotification(loginUser_id, target_id, null, null, 'follow');
                return follow;
            })
        } else {
            return Follow.update({
                isDelete: !alreadyFollow.dataValues.isDelete,
                delete_dt: !alreadyFollow.dataValues.delete_dt ? dateFormatConverter.convertToSave(new Date()) : null
            }, {
                where: {
                    no: alreadyFollow.dataValues.no
                }
            }).then(result => {
                if (alreadyFollow.dataValues.isDelete) {
                    createNotification(loginUser_id, target_id, null, null, 'follow')
                }
                return result;
            })
        }
    },
    getProfile: async (loginUser_id) => User.findOne({
        where: {
            no: loginUser_id,
            isDelete: false
        },
        include: [
            {
                model: Image,
                where: {
                    isDelete: false
                }
            },
            {
                model: Follow,
                as: 'following',
                where: {
                    isDelete: false
                }
            },
            {
                model: Follow,
                as: 'followed',
                where: {
                    isDelete: false
                }
            }
        ]

    }),
    getFollowers: (loginUser_id) => Follow.findAll(
        {
            where: {
                isDelete: false,
                target_id: loginUser_id
            }
        })
    ,
    getFollowings: (loginUser_id) => Follow.findAll(
        {
            where: {
                isDelete: false,
                follower_id: loginUser_id
            }
        }),
    findByUsername: (username) => User.findAll({
        where: {
            isDelete: false,
            username: {
                $like: '%' + username + '%'
            }
        }
    }),
    updateProfile: (loginUser_id, profile) => User.update(profile, {where: {no: loginUser_id}}),
    matchPasswordByLoginuser_id: (loginUser_id, password) => User.findOne({
        where: {
            no: loginUser_id,
            password: password,
            isDelete: false
        }
    }),
    matchPasswordByEmail: (email, password) => User.findOne({
        where: {
            email: email,
            password: password,
            isDelete: false
        }
    }),
    isFacebookUser: (id, email) => User.findOne({
        where: {
            email: email,
            type: 'FACEBOOK',
            password: id
        }
    })
    ,
    createUser: (user) => User.create(user)

}

module.exports = service