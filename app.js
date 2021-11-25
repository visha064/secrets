//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
const md5 =require("md5");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

console.log(process.env.API_KEY);

// userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["password"]});

const User = new mongoose.model("User", userSchema);

app.route("/")
    .get(function (req, res) {
        res.render("home");
    });

app.get("/login", function (req, res) {
    res.render("login");
});
app.post("/login", function (req, res) {
    User.findOne({ email: req.body.username },
        function (err, foundAccount) {
            if (err) {
                console.log(err);
            } else {
                if (foundAccount) {
                    if (foundAccount.password ===md5(req.body.password)) {
                        res.render("secrets");
                    }
                } else {
                    console.log("Account doesnot exist");
                    res.redirect("/login");
                }
            }
        });

});




app.get("/register", function (req, res) {
    res.render("register");
});
app.post("/register", function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password:md5(req.body.password)
    });
    newUser.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});




app.listen(3000, function () {
    console.log("server is listening on 3000");
});