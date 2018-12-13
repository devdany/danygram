const {ErrorTemplate} = require('../lib/Templates');
const jwt = require('jsonwebtoken');


const isLogin = (req, res, next) => {
    if(!req.headers.authorization){
        res.send(new ErrorTemplate(4, '로그인 세션이 만료되었습니다.'))
    }

    new Promise(
        (resolve, reject) => {
            jwt.verify(req.headers.authorization, 'danystagram_jwt', (err, decoded) => {
                if(err) reject(err)
                resolve(decoded)
            })
        }
    ).then(decoded => {
        req.loginAuth = decoded
        next()
    }).catch(err => {
        console.log(err);
        res.send(new ErrorTemplate(4, '로그인 인증정보가 맞지 않습니다.'))
    })
}


module.exports = isLogin