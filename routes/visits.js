var express = require('express');
var router = express.Router();
const knex = require('../db/config')
const authenticateToken = require("../middleware/checkAuth");


// POST Visit diagnosis 
router.put('/:id/prescription', authenticateToken, async function (req, res, next) {

    const id = req.params.id;
    const doctor_id = req.user.doctor_id;
    let diagnosis = req.body.diagnosis;
    let drugs = req.body.drugs;
    let patient, visit;

    await knex.from('visit')
        .where('visit_id', id)
        .first()
        .then((result) => {
            visit = result;
        })

    await knex.from('patients')
        .where('patient_id', visit.patient_id)
        .first()
        .then((result) => {
            patient = result;
        })
        .catch((err) => { res.status(500).send('server error please come back later'); throw err })


    drugs_2 = drugs.map((value, index) => {
        return {
            product_id: value.product_id,
            patient_id: patient.patient_id,
            to_date: value.to_date,
            product_name: value.name,
            dose: value.dose,
            doctor_id: doctor_id
        }
    });
    // update visit
    knex.from('visit')
        .where('visit_id', id)
        .update({ diagnosis: diagnosis,completed:'yes' })
        .then(function () {

        })
        .catch((err) => { res.status(500).send('server error please come back later'); throw err })

    let prescription_id;
    // create prescription
    knex('prescription')
        .insert({ visit_id: id })
        .then(function (result) {
            prescription_id = result[0];
            drugs = drugs.map((value, index) => {
                return {
                    product_id: value.product_id,
                    prescription_id: prescription_id,
                    to_date: value.to_date,
                    dose: value.dose,
                    doctor_id: doctor_id



                }
            });
            // add drugs to prescription 
            knex('prescribed_drugs')
                .insert(drugs)
                .then(function (results) {
                    // add drugs to medications 
                    knex('medications')
                        .insert(drugs_2)
                        .then(function (results) {
                            res.json(prescription_id);
                        })
                        .catch((err) => { res.status(500).send('server error please come back later'); throw err })

                })
                .catch((err) => { res.status(500).send('server error please come back later'); throw err })
        })
        .catch((err) => { res.status(500).send('server error please come back later'); throw err })

});

module.exports = router;