const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());  //setting up parsers 
app.use(express.urlencoded({extended: true})); //setting up parsers
//Without above two lines, your app wouldn’t understand the data sent in requests properly. 

app.use(express.static(path.join(__dirname, 'public')));  //path.join means(__dirmane + public) __dirname contanin path of our project means project 1's path i.e, user/harsh/d/practice/project1 & this line use to access static files like vanilla js , css, images

app.set('view engine', 'ejs');  //setting up ejs after installing it / render kr skte hai ejs pages ko (npm i ejs)

app.get("/", (req, res) => {
    res.render("index")  //ejs file render krwa rhe hai direct
});

app.get("/profile/:username", (req,res) => {  //: colun se ab username dynamic ho gaya hai means ab hum username ki jgha kuch bhi likhenge to run hoga wo route

    req.params.username //jis bhi naam ke aage colon(:) hota hai usko hum params bolte hai
    // res.send("Dynamic routing work");
    res.send(`Welcome ${req.params.username}`)
})

app.listen(3000, ()=>{
    console.log("Listening");
});