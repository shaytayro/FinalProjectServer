
const express = require("express");
const app = express();
var DButilsAzure = require('./DButils');
const jwt = require("jsonwebtoken");
app.use(express.json());
secret = "kofkofkofi";
const router=express.Router();
module.exports = router;

router.post('/Login/JsonLogin',(req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    DButilsAzure.execQuery(`select * FROM users Where username= '` + username + `' And password='` + password + `' `)

        .then(function (result) {
            if (result == "") {
                res.status(400).send({ err: "Login Failed,Username or password inccorrect" });
            }
            else {
                payload = { username: result[0].username };
                options = { expiresIn: "1d" };
                const token = jwt.sign(payload, secret, options);
                res.send(token);
            }

        })

        .catch(function (err) {
            console.log(err);
            res.status(400).send({ err: "There is a problem with username " });
        });




});

router.post('/Registration/JsonRegister',(req, res,next) => {
    DButilsAzure.execQuery(`SELECT * FROM users Where username= '` + req.body.username + `'`)
        .then(function (result) {
            if(result==""){
                next()
            }
            else{
                res.status(400).send({ err: "The username already exists " });
            }
        })

        .catch(function (err) {
            res.status(400).send({ err: "Error " });
        });

});

router.post('/Registration/JsonRegister',(req, res,next)=> {

    var name = req.body.username;
    var pass = req.body.password;
    if (name.length < 3 || name.length > 8) {
        res.status(400).send({err: "The Username must be 3-8 length"});
        return;
    }
    if (pass.length < 5 || pass.length > 10) {
        res.status(400).send({err: "password must be 5-10 characters"});
        return;
    }
    DButilsAzure.execQuery("insert into users(username, password,FirstName,LastName,City,Country,Email) values('" + req.body.username + "','" + req.body.password + "','" + req.body.FirstName + "','" +
        req.body.LastName + "','" + req.body.City + "','" + req.body.Country + "','" + req.body.Email+ "')")
        .then(function (result) {
            next();
            return;

        })

        .catch(function (err) {
            res.status(400).send({ err: "There is a problem insert to db maybe username already exist" });
            return;
        });





});
router.post('/Registration/JsonRegister',(req, res,next) => {

    DButilsAzure.execQuery("insert into Questions(username, question1,answer1,question2,answer2) values('" + req.body.username + "','" + req.body.question1 + "','" + req.body.answer1 + "','" +
        req.body.question2 + "','" + req.body.answer2 + "')")
        .then(function (result) {
            res.status(201).send("Registration sucess");
            ;
        })

        .catch(function (err) {
            res.status(400).send({ err: "There is a problem with insert user to db" });
        });




});

var isverified = false;
router.post('/restorePassword',( req, res,next) => {

    var name = req.body.username;
    var ans1 = req.body.answer1;
    var ans2 = req.body.answer2;

    DButilsAzure.execQuery(`SELECT * FROM Questions Where username= '` + name + `'`)
        .then(function (result) {
            if (result == "") {
                res.status(400).send({ err: "The username not exists" });
                return;
            }

            if (ans1 == result[0].answer1 && ans2 == result[0].answer2) {
                isverified = true;
                next();
            }
            else {
                res.status(400).send({ err: "incorrect answer" });
                return;
            }

        })

        .catch(function (err) {
            console.log(err);
            res.status(400).send({ err: "The username not exists" });
        });


});
router.post('/restorePassword', (req, res)=> {

    if (isverified == true) {
        DButilsAzure.execQuery(`SELECT * FROM users Where username= '` + req.body.username + `'`)
            .then(function (result) {
                const pass = {
                    password: result[0].password,
                };
                res.status(201).send(pass);
                isverified=false;

            })
            .catch(function (err) {
                console.log(err);
                res.status(400).send({ err: "The username not exists" });
                isverified=false;
            });

    }


});

router.get('/getQuestions/:username',(req, res )=> {

    var name = req.params.username;

    DButilsAzure.execQuery(`SELECT * FROM Questions Where username= '` + name + `'`)
        .then(function (result) {
            if(result==""){
                res.status(400).send({err:"The username not exists"});
                return;
            }
            const questions= {
                question1: result[0].question1,
                question2:result[0].question2,

            };
            res.status(201).send(questions)


        })
        .catch(function (err) {
            console.log(err);
            res.status(400).send({err:"The username not exists"});
        });
});



