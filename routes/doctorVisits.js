const express = require("express");
const router = express.Router();

const db = require('../db/config')

router.get('/doctorVisits/:id', (req, res) => {

    const  id  = req.params.id;
    let today = new Date()
    let day = String(today.getDate()).padStart(2, '0');
    let month = String(today.getMonth()+1).padStart(2, '0');
    let year = today.getFullYear();
    let full =  year+ '-' + month + '-' + day; 
    db('visit')
    .join('patients', 'visit.patient_id', 'patients.patient_id')
    .select('visit.visit_id','visit.time','patients.first_name', 'patients.last_name').where({ doctor_id : id , date: full })

    // db('visit').where({ doctor_id : id , date: full })

    // db.select('clinic_id').from('doctor_works_in').where('doctor_id', id)
      .then(visits => {
          console.log(visits)
        if ((visits.length) ) {
           
            res.send(visits)
        
        } else {
          res.json([])
         
        }
      })
    
      .catch(err => console.log(err))
     
  })
  
module.exports = router;  