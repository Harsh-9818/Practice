const express =  require('express');
const userModel = require('./models/user');
const postModel = require('./models/post');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const ejs = require('ejs');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());


app.get('/', (req, res) => {
    res.render('index'); 
});

app.get('/login', (req, res) => {
    res.render('login'); 
});

app.get('/profile', isLoggedIn, async (req, res) => {
    //console.log(req.user); //user ki details console mai print kiya
    let user = await userModel.findOne({email: req.user.email}).populate('posts'); //email se user ki details fetch kiya aur posts ko populate kiya
    res.render('profile', { user }); //user ki details ko profile page pe render kiya
});    

//like
app.get('/like/:id', isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({_id: req.params.id}).populate('user'); //post ki id se post ki details fetch kiya aur user ko populate kiya
    
    if(post.likes.indexOf(req.user.userid) === -1) { //agar user ki id likes mai hai to
        post.likes.push(req.user.userid);
    }
    else{
        post.likes.splice(post.likes.indexOf(req.user.userid), 1); //agar nahi hai to likes se remove kiya
    }
    await post.save(); 
    res.redirect('/profile');
})

//post create
app.post('/post', isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({email: req.user.email}); //email se user ki details fetch kiya
    let {content} = req.body; //body se content extract kiya

    let post = await postModel.create({
        user: user._id, //user ki id se post create kiya
        content: content //content ko post mai store kiya
    });

    user.posts.push(post._id); //user ki posts mai post ki id push kiya
    await user.save(); //user ko save kiya
    res.redirect('/profile'); 
});

//register page
app.post('/register', async (req, res) => {
    let { username, name, age, email, password } = req.body; //body mai se ye sb chize extract kri 

    let user = await userModel.findOne({email});
    if (user) return res.status(500).send( "User already exists" );

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => { //req.body.password likhna hota agr phele hi extract nhi krte
          let user = await userModel.create({
            username,
            name,
            age,
            email,
            password: hash
          });

          let token = jwt.sign({ email: email, userid: user._id }, "Shhh"); //token generate kiya
          res.cookie("token", token); //cookie mai token store kiya
          res.send("User registered successfully"); //response send kiya
        });
    });
});


//Login page
app.post('/login', async (req, res) => {
    let { email, password } = req.body; 

    let user = await userModel.findOne({email});
    if (!user) return res.status(500).send("User not found");

    bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
            let token = jwt.sign({ email: email, userid: user._id   }, "Shhh"); 
            res.cookie("token", token); //cookie mai token store kiya
            //res.status(200).send("Login successful");
            res.status(200).redirect("/profile"); //login hone ke baad profile page pe redirect kiya
        }
        else res.redirect('/login'); // agar password match nahi hota to login page pe redirect kiya
    });
});


//Logout page
app.get('/logout', (req, res) => {
    res.cookie("token", ""); //cookie clear kiya
    res.redirect('/login'); //home page pe redirect kiya
});

function isLoggedIn(req, res, next) {
    if(req.cookies.token === "") res.redirect("/login"); // agar cookie mai token nahi hai to login page pe redirect kiya
    else{
        let data = jwt.verify(req.cookies.token, "Shhh"); //token verify kiya
        req.user = data; //data ko request object mai store kiya
        next(); //next function call kiya 
    }   
}

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})
