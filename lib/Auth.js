const jwt = require('jsonwebtoken');

module.exports = {
    loginAuth: (email) => {
        return new Promise((resolve, reject) => {
            jwt.sign(
                {
                    email: email
                },
                'danystagram_jwt',
                {
                    expiresIn: '100d',
                    issuer: 'github/devdany',
                    subject: 'loginUser'
                },(err, token) => {
                    if(err) reject(err)
                    resolve(token)
                }
            )
        })
    }
}