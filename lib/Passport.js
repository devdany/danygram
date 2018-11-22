const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const UserService = require('../services/UserService');
const DateFormatConverter = require('./DateFormatConverter');
const {loginAuth} = require('../lib/Auth');

module.exports = {
    defaultLogin: () => {

        passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        }, (email, password, done) => {
            UserService.matchPasswordByEmail(email, password)
                .then(user => {
                    if(!user){
                        return done(null, false)
                    }
                    return done(null, user)
                }).catch(err => done(err))
        }))

        return passport;
    },
    facebookLogin: () => {
        passport.use(new FacebookStrategy({
                // https://developers.facebook.com에서 appId 및 scretID 발급
                clientID: "252746428582593", //입력하세요
                clientSecret: "f71c3f92d6cae7d556fdc9e323e58699", //입력하세요.
                callbackURL: "http://localhost:3000/users/facebook/callback",
                profileFields: ['id', 'displayName', 'photos', 'email', 'gender'] //받고 싶은 필드 나열
            },
            function (accessToken, refreshToken, profile, done) {

                const fbInfo = profile._json
                UserService.isFacebookUser(fbInfo.id, fbInfo.email).then(user => {
                    if(user){
                        done(null, user)
                    }else{
                        UserService.createUser(
                            {
                                username: fbInfo.name,
                                email: fbInfo.email,
                                password: fbInfo.id,
                                profile_img: fbInfo.picture.data.url,
                                gender: fbInfo.gender,
                                isDelete: false,
                                create_dt: DateFormatConverter.convertToSave(new Date()),
                                type: 'FACEBOOK'
                            })
                            .then(user => {
                                done(null, user);
                            })
                    }
                })
            }
        ));

        return passport;
    }
}

