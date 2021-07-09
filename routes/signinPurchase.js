require('dotenv').config()
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db/config')
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/checkAuth");

router.post('/signinPurchase', (req, res) => {
    db.select('email', 'password').from('purchasing_accounts')
      .where('email', '=', req.body.email)
      .then(async (data) => {
        const isValid = await bcrypt.compareSync(req.body.password, data[0].password);
        if (isValid) {
          return db.select( 'customer_id', 'first_name', 'last_name').from('purchasing_accounts')
            .where('email', '=', req.body.email)
            .then(user => {
              const userobject = {customer_id:user[0].customer_id, first_name:user[0].first_name, last_name:user[0].last_name }
              const accessToken = jwt.sign(userobject, process.env.ACCESS_TOKEN_SECRET);
              res.json({ accessToken: accessToken})
              // res.json(user[0])
            })
            .catch(err => { console.log(err);res.status(400).json('unable to get user')})
        } else {
          res.status(400).json('wrong credentials')
        }
      })
      .catch(err => res.status(400).json('wrong credentials'))
  })



  router.get('/try/:id', (req, res) => {

    const  id  = req.params.id;
    
    // db.select('*').from('clinics')
    db.select('*').from('clinics').where('customer_id', id)
      .then(clinics => {
        if (clinics.length) {
          res.json(clinics)
        } else {
          res.json([])
          // res.status(400).json('Not found')
        }
      })
      .catch(err => console.log(err))
      // .catch(err => res.status(400).json('error getting clinics'))
  });

module.exports = router;  