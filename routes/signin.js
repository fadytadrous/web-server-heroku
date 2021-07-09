require('dotenv').config()
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db/config')
const jwt = require("jsonwebtoken");

router.post('/signin', (req, res) => {
    const {email, password,proficiency} = req.body;
  
    if(proficiency === 'doctor'){
      db.select('email', 'password').from('doctors')
      .where('email', '=', email)
      .then(async (data) => {
        const isValid = await bcrypt.compareSync(password, data[0].password);
        if (isValid) {
          return db.select( 'doctor_id').from('doctors')
            .where('email', '=', email)
            .then(user => {
              // console.log(user[0])
              const userobject = {doctor_id: user[0].doctor_id}
              const accessToken = jwt.sign(userobject, process.env.ACCESS_TOKEN_SECRET);
              console.log(accessToken)
              res.json({ accessToken: accessToken})
              // res.json(user[0])
            })
            .catch(err => res.status(400).json('unable to get user'))
        } else {
          res.status(400).json('wrong credentials')
        }
      })
      .catch(err => res.status(400).json('wrong credentials'))
    }
    else if(proficiency === 'secretary'){
      db.select('email', 'password').from('secretary')
      .where('email', '=', email)
      .then(async (data) => {
        const isValid = await bcrypt.compareSync(password, data[0].password);
        console.log(email)
        if (isValid) {
          return db.select( 'secretary_id').from('secretary')
            .where('email', '=', email)
            .then(user => {
              // console.log(user[0])
              const userobject = {secretary_id: user[0].secretary_id}
              const accessToken = jwt.sign(userobject, process.env.ACCESS_TOKEN_SECRET);
              res.json({ accessToken: accessToken})
              // res.json(user[0])
            })
            .catch(err => res.status(400).json('unable to get user'))
        } else {
          res.status(400).json('wrong credentials')
        }
      })
      .catch(err => res.status(400).json('wrong credentials'))
    }
  
   
  })


module.exports = router;