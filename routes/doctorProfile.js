const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/checkAuth");
const db = require('../db/config')

router.get('/docworksIn', authenticateToken , (req, res) => {

    const  id  = req.user.doctor_id;
    db('clinics')
    .join('doctor_works_in', 'clinics.clinic_id', 'doctor_works_in.clinic_id')
    .select('clinics.clinic_id','clinics.clinic_name', 'clinics.address').where('doctor_id', id)

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

router.get('/doctorProfile', authenticateToken , (req, res) => {

    const  doctor_id  = req.user.doctor_id;
    console.log(doctor_id)
    db.select( 'doctor_id', 'first_name', 'last_name','gender','ssn',
                            'phone_number','birth_date','specialty', 'education',
                            'address','email','photo').from('doctors')
            .where('doctor_id', '=', doctor_id)

      .then(doctor => {
          // console.log(doctor)
        if ((doctor.length) ) {
           
            res.send(doctor[0])
        
        } else {
          res.json([])
         
        }
      })
    
      .catch(err => console.log(err))
     
  })
  
module.exports = router;  