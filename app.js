//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
// const md5 =require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


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
                    bcrypt.compare(req.body.password, foundAccount.password,
                        function (err, result) {
                            if (result) {
                                res.render("secrets");
                            }
                        });
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

    bcrypt.hash(req.body.password, saltRounds, function (err, result) {
        const newUser = new User({
            email: req.body.username,
            password: result
        });
        newUser.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                res.render("secrets");
            }
        });
    });

});




app.listen(3000, function () {
    console.log("server is listening on 3000");
});