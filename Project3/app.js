const expresss = require('express');
const app = expresss();
const userModel = require("./models/user")
const postModel = require("./models/post")

app.get('/' , (req,res) => {
    res.send("hello world")
});

app.get('/create', async (req, res) => {
    let createdUser = await userModel.create({
        username: "Harsh",
        age: 25,
        email: "Harsh@gmail.com"
    });

    res.send(createdUser);
})

app.get("/posts/create", async (Req,res) => {
    let post = await postModel.create({
        podtdata: "Hello kaise hoo",
        user: "67debfc20b1af8c4ded9f561"
    })

    let user = await userModel.findOne({_id: "67debfc20b1af8c4ded9f561"});
    user.posts.push(post._id);
    await user.save();
    res.send({post, user});
})

app.listen(3000);