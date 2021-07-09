const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/checkAuth");
const db = require('../db/config')

router.get('/secworksIn', authenticateToken , (req, res) => {

    const  id  = req.user.secretary_id;
    db('clinics')
    .join('secretary_works_in', 'clinics.clinic_id', 'secretary_works_in.clinic_id')
    .select('clinics.clinic_id','clinics.clinic_name', 'clinics.address').where('secretary_id', id)

    // db.select('clinic_id').from('doctor_works_in').where('doctor_id', id)
      .then(clinics => {
          console.log(clinics)
        if ((clinics.length) ) {
           
            res.send(clinics)
        
        } else {
          res.json([])
         
        }
      })
  
      .catch(err => console.log(err))
     
  })

  router.get('/secretaryProfile', authenticateToken , (req, res) => {

    const  secretary_id  = req.user.secretary_id;
    console.log(secretary_id)
    db.select( 'secretary_id', 'first_name', 'last_name','gender','ssn',
                            'phone_number','birth_date', 'education',
                            'address','email','photo').from('secretary')
            .where('secretary_id', '=', secretary_id)

      .then(secretary => {
          // console.log(doctor)
        if ((secretary.length) ) {
           
            res.send(secretary[0])
        
        } else {
          res.json([])
         
        }
      })
    
      .catch(err => console.log(err))
     
  })  
module.exports = router;  