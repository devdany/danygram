const express = require('express');
const router = express.Router();
const {
    findAll,
    latestUser,
    checkFollow,
    getProfile,
    getFollowers,
    getFollowings,
    findByUsername,
    updateProfile,
    matchPasswordByLoginuser_id,
    createUser,
    isFacebookUser,
    alreadyUser
} = require('../services/UserService');

const {getNotifications, createNotification} = require('../services/NotificationService')
const {ErrorTemplate} = require('../lib/Templates');
const dateFormatConverter = require('../lib/DateFormatConverter');
const {defaultLogin} = require('../lib/Passport');
const {loginAuth} = require('../lib/Auth');
const FaceBookAuth = require('fb');


/* GET users listing. */

const loginUser_id = 1;
router.get('/all', (req, res) => {
    findAll()
        .then(users => res.send(users))
        .catch(err => res.send(new ErrorTemplate(2, '유저 정보를 읽는데 실패했습니다.')))
});

router.get('/latest/:amount', (req, res) => {
    let {amount} = req.params;

    if (!amount) {
        amount = 5;
    }

    latestUser(Number(amount))
        .then(users => res.send(users))
        .catch(err => {
            console.log(err);
            res.send(new ErrorTemplate(2, '유저 정보를 읽는데 실패했습니다.'))
        })
})

//loginuser profile
router.get('/profile', (req, res) => {
    //temp
    getProfile(loginUser_id)
        .then(profile => res.send(profile))
        .catch(err => {
            console.log(err);
            res.send(new ErrorTemplate(2, '프로필 정보를 얻는데 실패했습니다.'))
        })
})

//search by username profile
router.get('/profile/:username', (req, res) => {
    const {username} = req.params;

    if (username) {
        res.send(new ErrorTemplate(0, '유저이름을 입력하세요.'))
    } else {
        findByUsername(username)
            .then(users => res.send(users))
            .catch(err => {
                console.log(err);
                res.send(new ErrorTemplate(2, '유저 정보를 불러오지 못했습니다.'));
            })
    }
})

router.get('/followers', (req, res) => {
    //temp
    getFollowers(loginUser_id)
        .then(followers => res.send(followers))
        .catch(err => {
            console.log(err);
            res.send(new ErrorTemplate(2, '팔로우 정보를 불러오는데 실패했습니다.'))
        })
})

router.get('/followings', (req, res) => {
    //temp
    getFollowings(loginUser_id)
        .then(followings => res.send(followings))
        .catch(err => {
            console.log(err);
            res.send(new ErrorTemplate(2, '팔로우 정보를 불러오는데 실패했습니다.'))
        })
})

//test
router.get('/notifications', (req, res) => {
    getNotifications(loginUser_id)
        .then(notifications => res.send(notifications))
        .catch(err => {
            console.log(err);
            res.send(new ErrorTemplate(2, '알림 정보를 불러오는데 실패했습니다.'))
        })
})

router.post('/facebookLogin', (req, res) => {

    FaceBookAuth.api('me', {
        fields: ['name','email','picture','gender','id'],
        access_token: req.body.access_token
    }, fbInfo => {
        const {name, email, gender, id, picture} = fbInfo;

        isFacebookUser(id, email).then(user => {
            if(user){
                //로그인 토큰
                loginAuth(email).then(token => {
                    res.send({token: token})
                });
            }else{
                //회원가입
                createUser(
                    {
                        username: name,
                        email: email,
                        password: id,
                        profile_img: picture.data.url,
                        gender: gender,
                        isDelete: false,
                        create_dt: dateFormatConverter.convertToSave(new Date()),
                        type: 'FACEBOOK'
                    })
                    .then(user => {
                        //로그인 토큰
                        loginAuth(email).then(token => {
                            res.send({token: token})
                        });
                    })
            }
        })
    })

})

router.get('/facebook/fail', (req, res) => {
    res.send('facebook login fail');
});


router.post('/follow', (req, res) => {
    let {target_id} = req.body;
    if (!target_id) {
        res.send(new ErrorTemplate(0, '대상이 분명하지 않습니다.'))
    } else {
        checkFollow(loginUser_id, target_id)
            .then(follow => {
                res.send(follow)
            })
            .catch(err => {
                console.log(err);
                res.send(new ErrorTemplate(2, '유저 정보를 변경하는데 실패했습니다.'))
            })
    }
})

router.post('/login', defaultLogin().authenticate('local', {session:false}), (req, res) => {
    const {email} = req.body;

    loginAuth(email).then(token => res.send({token: token}));
})

router.post('/signUp', (req, res) => {

    const {username, email, password, fullname} = req.body;

    alreadyUser(email).then(isUser => {
        if(isUser){
            res.send(new ErrorTemplate(0, '이미 가입되어있는 이메일 주소입니다!'))
        }else{
            if(username && email && password && fullname){
                createUser({
                    username: username,
                    email: email,
                    fullname: fullname,
                    password: password,
                    isDelete: false,
                    create_dt: dateFormatConverter.convertToSave(new Date()),
                    type: 'GENERAL'
                }).then(user => {
                    loginAuth(user.dataValues.email).then(token => res.send({token:token}));
                })
            }else{
                res.send(new ErrorTemplate(0, '필수 입력 항목을 모두 입력해주세요'))
            }
        }
    });

})


router.put('/profile', (req, res) => {

    /*const {
        username,
        email,
        password,
        profile_img,
        bio,
        phone,
        gender,
        website
    } = req.body;*/

    getProfile(loginUser_id)
        .then(user => {
            if (user) {
                updateProfile(loginUser_id, {
                    ...user, ...req.body,
                    update_dt: dateFormatConverter.convertToSave(new Date())
                })
                    .then(result => res.send(result))
                    .catch(err => {
                        console.log(err);
                        res.send(new ErrorTemplate(1, '프로필 업데이트에 실패했습니다.'))
                    })
            } else {
                res.send(new ErrorTemplate(1, '해당 유저가 존재하지 않습니다.'))
            }
        })
})

router.put('/password', (req, res) => {
    const {currentPassword, exPassword} = req.body;
    if (!currentPassword || !exPassword) {
        res.send(new ErrorTemplate(0, '현재비밀번호 / 변경하실 비밀번호를 입력해 주세요.'))
    } else {
        matchPasswordByLoginuser_id(loginUser_id, currentPassword)
            .then(user => {
                if (user) {
                    updateProfile(loginUser_id, {
                        ...user,
                        password: exPassword,
                        update_dt: dateFormatConverter.convertToSave(new Date())
                    })
                        .then(result => res.send(result))
                        .catch(err => {
                            console.log(err);
                            res.send(new ErrorTemplate(1, '비밀번호 업데이트에 실패했습니다.'))
                        })
                } else {
                    res.send(new ErrorTemplate(4, '패스워드 정보가 맞지 않습니다.'))
                }
            })
    }
})

module.exports = router;