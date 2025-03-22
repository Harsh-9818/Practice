const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/practice3");

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    age: String,
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId, //is array mai id store hoyegi post ki
            ref: 'post' //or upar wale array mai jo id hogi wo post wali file se aayegi
        }
    ]
})

module.exports = mongoose.model('user', userSchema)