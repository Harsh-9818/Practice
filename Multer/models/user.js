const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/multer');

const userSchema = new mongoose.Schema({
    username: String,
    age: Number,
    email: String,
    avatar: {
        type: String,
        default: 'default.png'
    }
});

module.exports = mongoose.model('User', userSchema);