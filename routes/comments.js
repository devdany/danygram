var express = require('express');
var router = express.Router();

const {findAll, remove, write, findOne} = require('../services/CommentService');
const {ErrorTemplate} = require('../lib/Templates');

const loginUser_id = 1;

/* GET home page. */
router.get('/all', (req, res) => {
    findAll()
        .then(result => res.send(result));
});

router.post('/write', (req, res) => {
    const {text, target_id} = req.body;
    if (text && target_id) {
        write(text, loginUser_id, target_id)
            .then(result => res.send(result))
            .catch(err => {
                console.log(err);
                res.send(new ErrorTemplate(2, '댓글 저장에 실패했습니다.'))
            })
    } else {
        res.send(new ErrorTemplate(0, '대상이 분명하지 않습니다.'))
    }
})

router.put('/delete', (req, res) => {
    const {comment_id} = req.body;
    if (comment_id) {
        findOne(comment_id)
            .then(comment => {
                if(comment){
                    if(comment.dataValues.user_id === loginUser_id || comment.Image.dataValues.user_id === loginUser_id){
                        remove(comment_id)
                            .then(result => res.send(result))
                            .catch(err => {
                                console.log(err);
                                res.send(new ErrorTemplate(2, '댓글 삭제에 실패했습니다.'))
                            })
                    }else{
                        res.send(new ErrorTemplate(4, '해당 댓글에 삭제 권한이 없습니다.'))
                    }
                }else{
                    res.send(new ErrorTemplate(1, '해당 댓글이 존재하지 않습니다.'))
                }
            })
    } else {
        res.send(new ErrorTemplate(0, '대상이 분명하지 않습니다.'))
    }
})

module.exports = router;
