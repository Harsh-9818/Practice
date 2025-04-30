const express = require('express');
const path = require('path');
const app = express();
const upload = require('./config/multerconfig.js');
const userModel = require('./models/user');

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.send("Hello World!");
});

app.get('/create', async (req, res) => {
  let createdUser = await userModel.create({
      username: "Harsh",
      age: 25,
      email: "Harsh@gmail.com",
      avatar: "default.png"
  });

  res.send(createdUser);
})

app.get('/avatar', async (req, res) => {
  // Find a user - this is just an example. You could query based on specific needs.
  const user = await userModel.findOne(); // Finds the first user
  res.render('index', { avatar: user.avatar }); // Pass avatar to EJS
});

app.get("/upload", (req, res) => {
  res.render("profileupload"); // Render the profile upload page
});

app.post('/upload', upload.single('avatar'), async (req, res) => {
  let user = await userModel.findOne();
  user.avatar = req.file.filename; // Update the avatar field with the new filename
  await user.save();
  res.redirect('/avatar'); // Redirect to the avatar page to see the updated image
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
