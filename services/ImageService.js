const Image = require('../models/Image');
const User = require('../models/User');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
const Follow = require('../models/Follow');
const dateFormatConverter = require('../lib/DateFormatConverter');

const relatedModels = {
    include:[
        {
            model: User,
            required: true,
            where: {
                isDelete: false
            }
        },
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
    ]
}

const service = {
    findAll: () => Image.findAll({
        ...relatedModels,
        where:{
            isDelete: false
        }
    }),

    getFeedImages: async (loginUser_id, amount) => {
        const followerImages = await Follow.findAll({
            attributes: [],
            where: {
                follower_id: loginUser_id,
                isDelete: false
            },
            include: [
                {
                    model: User,
                    as:'followed',
                    required: true,
                    attributes: ['username', 'email', 'profile_img'],
                    include: [
                        {
                            model: Image,
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
        })



        //sequelize issue include limit not working...
        await followerImages.map(follower => {
            if (follower.dataValues.followed.dataValues.Images.length > 2){
                follower.dataValues.followed.dataValues.Images = follower.dataValues.followed.dataValues.Images.slice(0, amount);
            }
            return follower;
        })

        //i consider use raw query...
        /* Follow.sequelize.query('select * from danystagram.Follow').then(res => {
             console.log(res);
         })*/

        return followerImages;

    },
    findByHastag: async (hashtag) => Image.findAll({
        where: {
            tags: {
                $like: '%' + hashtag + '%'
            },
            isDelete: false
        }
    }),
    findOne: (no) =>
        Image.findOne({
            where: {
                no: no,
                isDelete: false
            },
            ...relatedModels

        }),
    update: (image_id, updateImageObj) => Image.update(updateImageObj, {where: {no: image_id}}),
    deleteImage: (image) => image.update({
        ...image.dataValues,
        isDelete: true,
        delete_dt: dateFormatConverter.convertToSave(new Date())
    },{
        where: {
            no: image.dataValues.no
        }
    })
}


module.exports = service