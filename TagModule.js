const express = require("express");
const app = express();
var DButilsAzure = require('./DButils');
const jwt = require("jsonwebtoken");
app.use(express.json());
secret = "kofkofkofi";
const router=express.Router();

module.exports = router;

var fs = require('fs'),
    xml2js = require('xml2js');

var parser = new xml2js.Parser();
var CVEs=[]
var Descriptions=[]


fs.readFile('CVEs-2019.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        for (i=0;i<result.cvrfdoc.Vulnerability.length;i++){
            CVEs[i]=result.cvrfdoc.Vulnerability[i].Title[0]
            Descriptions[i]=result.cvrfdoc.Vulnerability[i].Notes[0].Note[0]._
        }
    });

});


router.post("/GetTagFromTheAlgorithm", function(req, res,next) {
    Labels = ["Software or Service","Version","Operating System","Network Protocol","Port","Means","Impact","Hardware","Privilege","Attack Vector","Attack Technique"]
    Tokens = req.body.tokens
     Tags=[]
    for(i=0;i<Tokens.length;i++){
        Tags[i] =Labels[Math.floor(Math.random() * 10)]
    }
    res.status(200).send(Tags)
});

router.get("/GetUnTaggedCve", function(req, res,next) {
    DButilsAzure.execQuery(`select * FROM AlreadyTaggedCVEs`)
        .then(function (result) {
            ID=[]
            for(j=0;j<result.length;j++){
                ID[j]=result[j].ID
            }
            for(i=0;i<CVEs.length;i++) {
                if(ID.includes(CVEs[i])){
                    continue;
                }

                else{
                    const cve={
                        CveId:CVEs[i],
                        CVEDescription:Descriptions[i]
                    };
                    res.status(200).send(cve)
                    break;
                }
            }
        })
        .catch(function (err) {
            console.log(err);
        })


});

router.post("/SubmitTag", function(req, res,next) {
    DButilsAzure.execQuery("insert into AlreadyTaggedCVEs(ID) values('" + req.body.ID + "')")
        .then(function (result) {
            next();
        })

        .catch(function (err) {
            console.log(err);
        })

});

router.post("/SubmitTag", function(req, res,next) {
        words=req.body.WordsList
        Labels=req.body.LabelList
        Promises=[]
        for(i=0;i<words.length;i++) {
                Promises.push(DButilsAzure.execQuery("insert into Tags(CVEID, Word,Tag) values('" + req.body.ID + "','" + words[i] + "','" + Labels[i] + "')"))
        }
                Promise.all(Promises)
                .then(function (result) {
                    res.status(200).send("submitted success")

                })

                .catch(function (err) {
                    console.log(err);
                })



});


