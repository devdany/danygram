var express = require('express');
var router = express.Router();
const likeService = require('../services/LikeService');

const {findAll, checkLike, likeUsersByImage} = likeService;
const {ErrorTemplate} = require('../lib/Templates')

const loginUser_id = 1;
/* GET home page. */
router.get('/all', (req, res) => {
    findAll()
        .then(result => res.send(result));
})

router.get('/user/:image_id', (req, res) => {
    const {image_id} = req.params;
    if(image_id){
        likeUsersByImage(image_id)
            .then(users => res.send(users))
            .catch(err => {
                console.log(err);
                res.send(new ErrorTemplate(2, '유저정보를 불러오는데 실패했습니다.'))
            })
    }else{
        res.send(new ErrorTemplate(0, '대상이 분명하지 않습니다.'))
    }

})

router.post('/check', (req, res) => {
    const {target} = req.body;

    if(!target){
        checkLike(loginUser_id, target)
            .then(result => res.send(result))
            .catch(err => {
                console.log(err);
                res.send(new ErrorTemplate(2, '좋아요 정보를 변경하는데 실패했습니다.'))
            });
    }else{
        res.send(new ErrorTemplate(0, '대상이 분명하지 않습니다.'));
    }
})


module.exports = router;
