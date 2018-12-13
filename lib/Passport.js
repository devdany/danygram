const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const UserService = require('../services/UserService');


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
    }
}

