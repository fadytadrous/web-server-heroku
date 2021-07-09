const express = require("express");
const router = express.Router();
const db = require('../db/config')
const authenticateToken = require("../middleware/checkAuth");

router.post('/addClinic', authenticateToken , (req, res) => {
    const customer_id = req.user.customer_id;
    const {clinic_name , address } = req.body;
    
  
  
    db.insert({
      customer_id: customer_id, clinic_name: clinic_name ,address: address
      })
    .into('clinics')
    .then(()=>{
      res.status(200).json('Success')
  
      
    })
    .catch(err => {
      console.log(err)
      res.status(400).json('unable to send code')
    }
      )
  })


  router.get('/myclinics',authenticateToken, (req, res) => {

    const customer_id = req.user.customer_id;
    
    // db.select('*').from('clinics')
    db.select('*').from('clinics').where('customer_id', customer_id)
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