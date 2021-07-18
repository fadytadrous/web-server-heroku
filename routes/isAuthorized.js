const express = require("express");
const router = express.Router();

const db = require('../db/config')

router.post('/isAuthorized', (req, res) => {
    const {uuid} = req.body;
    db.select('*').from('authorized_users').where('uuid', uuid)
      .then(user => {
        if (user.length) {
          if(user[0].doctor_id === null && user[0].secretary_id === null){
            console.log("yes user")
            res.json(user)
          }else {
            console.log("Used code")
            res.status(400).json('Used code')
          }
          
        } else {
          console.log("no user")
          res.status(400).json('no user')
        }
        
      })
      .catch(err => res.status(400))
  })

module.exports = router;  