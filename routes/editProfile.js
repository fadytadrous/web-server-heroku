const express = require("express");
const router = express.Router();
const db = require('../db/config')
const authenticateToken = require("../middleware/checkAuth");

router.put('/editDoctor', authenticateToken , (req, res) => {
    const doctor_id = req.user.doctor_id;
    // console.log(req.body)

    db.from('doctors')
        .where('doctor_id', doctor_id)
        .update(req.body)
        .then(function () {
            res.status(200).json('Success')
        })
        .catch((err) => { res.status(500).send('server error please come back later'); throw err })
  })


router.put('/editSecretary',authenticateToken, (req, res) => {

    const secretary_id = req.user.secretary_id;
    // console.log(req.body)
    db.from('secretary')
        .where('secretary_id', secretary_id)
        .update(req.body)
        .then(function () {
            res.status(200).json('Success')
        })
        .catch((err) => { res.status(500).send('server error please come back later'); throw err })
    
  });

module.exports = router;  