const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const cors = require('cors');
const knex = require('../db/config');
let id;
let patient= new Object();

router.post('/updatePatient', async (req, res) => {

    const myArray = Object.keys(req.body);



        for(const x of myArray) {
            if (x !== 'id') {

                patient[x] = req.body[x];

            }
        }
        id = req.body.id;
console.log(patient);
        if(!(Object.keys(patient).length === 0 && patient.constructor === Object)){

    knex('patients').update(patient).where('patient_id','=',id).then(rows => {
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
router.post('/updatePatient/:id', async (req, res) => {
console.log(req.body.item);
    if(req.params.id ==='1') {
        try {
            await knex.transaction(async trx => {

                const addmedication = await trx('drug_products').select("product_id").where({name: req.body.item});
                let medication =
                    {
                        patient_id: req.body.patient_id,
                        product_id: addmedication[0]["product_id"],
                        product_name: req.body.item,
                    };
                // medication.product_name = m ;
                console.log("id", addmedication[0]["product_id"]);
                const add2 = await trx('medications').insert(medication);
            });
        } catch (err) {
            console.log(err);
            res.status(400).json('Unable to update');
        }
    }
    else if(req.params.id ==='2'){
        knex('medications').where({patient_id:req.body.patient_id,product_name:req.body.item}).del().then(rows => {
            if (!rows){
                return res.status(404).json({success:false});
            }
            return res.json({success:true});
        })
            .catch( e => res.status(500).json(e));
    }
    else{
        res.json([]);
    }


});
module.exports = router;