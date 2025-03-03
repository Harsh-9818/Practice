const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs')



app.get("/", (req, res) => {
    fs.readdir('./files', function(err, files){
        res.render("index", {files: files})
    })
});

app.post('create', (req,res) => {
    
})

app.listen(3000, () => {
    console.log("Listening");
    
})