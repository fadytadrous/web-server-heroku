const express = require("express");
const router = express.Router();
const db = require('../db/config');


router.get('/showDoctors', (req, res) => {
    // res.send("This is test for heroku")
    db.select().table('doctors').then(data => {
        res.send(data)
    })
        .catch(err => {
            console.log(err);
        })
})
module.exports = router;