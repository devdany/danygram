var express = require('express');
var router = express.Router();
const {findByHastag, findOne, getFeedImages, update, deleteImage} = require('../services/ImageService');
const {ErrorTemplate} = require('../lib/Templates')
const dateFormatConverter = require('../lib/DateFormatConverter')

const loginUser_id = 1;
/* GET home page. */
router.get('/:amount', (req, res) => {
    //1st arg = loginUser, 2nd arg = image amount per follower

    const {amount} = req.params;

    if (!amount) {
        res.send(new ErrorTemplate(0, '팔로워당 로드할 이미지 개수를 입력하세요!'))
    } else {
        getFeedImages(loginUser_id, Number(amount))
            .then(images => res.send(images))
            .catch(err => {
                console.log(err);
                res.send(new ErrorTemplate(2, '이미지를 불러오는데 실패했습니다.'));
            })
    }
});

router.get('/tagged/:hashtag', (req, res) => {
    const {hashtag} = req.params;

    if (!hashtag) {
        res.send(new ErrorTemplate(0, 'hashtag를 입력해주세요!'))
    } else {
        findByHastag(hashtag)
            .then(images => res.send(images))
            .catch(err => {
                console.log(err);
                res.send(new ErrorTemplate(2, '이미지를 불러오는데 실패했습니다.'));
            })
    }
});

router.get('/detail/:no', (req, res) => {
    const {no} = req.params;

    if (!no) {
        res.send(new ErrorTemplate(0, '불러올 이미지 대상이 불분명합니다.'))
    } else {
        findOne(no)
            .then(image => res.send(image))
            .catch(err => {
                console.log(err);
                res.send(new ErrorTemplate(2, '이미지를 불러오는데 실패했습니다.'));
            })
    }
})

router.put('/', async (req, res) => {
    const {image_id, location, caption, tags} = req.body;

    if (image_id) {
        const imageReq = {
            location: location,
            caption: caption,
            tags: tags
        }

        findOne(image_id)
            .then(image => {
                if (image) {
                    const isLoginUsersImage = image.dataValues.user_id === loginUser_id;

                    if (!isLoginUsersImage) {
                        res.send(new ErrorTemplate(4, '해당 이미지에 대한 수정권한이 없습니다.'));
                    } else {
                        update(image_id, {...image.dataValues, ...imageReq, update_dt: dateFormatConverter.convertToSave(new Date())})
                            .then(result => res.send(result))
                            .catch(err => {
                                console.log(err);
                                res.send(new ErrorTemplate(2, '이미지를 업데이트하는데 실패했습니다.'));
                            })
                    }
                } else {
                    res.send(new ErrorTemplate(1, '해당 이미지가 존재하지 않습니다.'));
                }
            })
    }else{
        res.send(new ErrorTemplate(0, '대상이 분명하지 않습니다.'))}
    }
)

router.put('/delete', async (req, res) => {
    const {image_id} = req.body;
    if (image_id) {
        findOne(image_id)
            .then(image => {
                if (image) {
                    const isLoginUsersImage = image.dataValues.user_id === loginUser_id;

                    if (!isLoginUsersImage) {
                        res.send(new ErrorTemplate(4, '해당 이미지에 대한 삭제권한이 없습니다.'));
                    } else {
                        deleteImage(image)
                            .then(result => res.send(result))
                            .catch(err => {
                                console.log(err);
                                res.send(new ErrorTemplate(2, '이미지를 삭제하는데 실패했습니다.'));
                            })
                    }
                } else {
                    res.send(new ErrorTemplate(1, '해당 이미지가 존재하지 않습니다.'));
                }
            })
    } else {
        res.send(new ErrorTemplate(0, '대상이 분명하지 않습니다.'))
    }

})

module.exports = router;
