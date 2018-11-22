const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const passport = require('passport');

const dbConnector = require('./dbConnector');
dbConnector.authenticate()
    .then(() => {
        console.log('Connection Success');
    })
    .catch(err => {
        console.log(err);
    })

const Comment = require('./models/Comment');
const Image = require('./models/Image');
const User = require('./models/User');
const Like = require('./models/Like');
const Follow = require('./models/Follow');
const Notification = require('./models/Notification');


User.sync({force: false});
Image.sync({force: false});
Comment.sync({force: false});
Like.sync({force: false});
Follow.sync({force: false});
Notification.sync({force: false});

//join

User.hasMany(Image, {foreignKey: 'user_id'})
Image.belongsTo(User, {foreignKey: 'user_id'})

User.hasMany(Comment, {foreignKey: 'user_id'})
Comment.belongsTo(User, {foreignKey: 'user_id'})

Image.hasMany(Comment, {foreignKey: 'image_id'})
Comment.belongsTo(Image, {foreignKey: 'image_id'})

User.hasMany(Like, {foreignKey: 'user_id'})
Like.belongsTo(User, {foreignKey: 'user_id'})

Image.hasMany(Like, {foreignKey: 'image_id'})
Like.belongsTo(Image, {foreignKey: 'image_id'})

User.hasMany(Follow, {foreignKey: 'follower_id', as: 'following'})
Follow.belongsTo(User, {foreignKey: 'follower_id', as: 'following'})

User.hasMany(Follow, {foreignKey: 'target_id', as: 'followed'})
Follow.belongsTo(User, {foreignKey: 'target_id', as: 'followed'})

User.hasMany(Notification, {foreignKey: 'from_id'})
Notification.belongsTo(User, {foreignKey: 'from_id', as: 'from'})

User.hasMany(Notification, {foreignKey: 'to_id'})
Notification.belongsTo(User, {foreignKey: 'to_id', as: 'to'})

Image.hasMany(Notification, {foreignKey: 'image_id'})
Notification.belongsTo(Image, {foreignKey: 'image_id'})

Comment.hasMany(Notification, {foreignKey: 'comment_id'})
Notification.belongsTo(Comment, {foreignKey: 'comment_id'})





const usersRouter = require('./routes/users');
const imagesRouter = require('./routes/images');
const commentRouter = require('./routes/comments');
const likeRouter = require('./routes/like');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use('/users', usersRouter);
app.use('/images', imagesRouter);
app.use('/comments', commentRouter);
app.use('/likes', likeRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
