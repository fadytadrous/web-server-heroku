const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const cors = require('cors');
const knex = require('../db/config');
let id;
let patient= new Object();

router.post('/updateMedicalHistory', async (req, res) => {

    const myArray = Object.keys(req.body);



    for(const x of myArray) {
        if (x !== 'id') {
            if(x==='diabetes' || x==='tobacco'){
                patient[x]= (req.body[x]==='yes')? 1 : 0
            }
            else {
                patient[x] = req.body[x];
            }
        }

    }
    id = req.body.id;
    console.log(patient);
    if(!(Object.keys(patient).length === 0 && patient.constructor === Object)){

        knex('medical_history').update(patient).where('patient_id','=',id).then(rows => {
            if (!rows){
                return res.status(404).json({success:false});
            }
            return res.json({success:true});
        })
            .catch( e => res.status(500).json(e));
    }else{
        res.json([]);
    }


});

module.exports = router;