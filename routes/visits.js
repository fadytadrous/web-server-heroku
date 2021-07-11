var express = require('express');
var router = express.Router();
const knex = require('../db/config')
const authenticateToken = require("../middleware/checkAuth");


// POST Visit diagnosis 
router.put('/:id/prescription', async function (req, res, next) {

    const id = req.params.id;
    let diagnosis = req.body.diagnosis;
    let drugs = req.body.drugs;

    //update visit
    knex.from('visit')
        .where('visit_id', id)
        .update({ diagnosis: diagnosis })
        .then(function () {

        })
        .catch((err) => { res.status(500).send('server error please come back later'); throw err })

    let prescription_id;
    //create prescription
    knex('prescription')
        .insert({ visit_id: id })
        .then(function (result) {
            prescription_id = result[0];
            drugs = drugs.map((value, index) => {
                return {
                    product_id: value.product_id,
                    prescription_id: prescription_id
                }
            });
            // //add drugs to prescription 
            knex('prescribed_drugs')
                .insert(drugs)
                .then(function () {
                    res.json("success");
                })
                .catch((err) => { res.status(500).send('server error please come back later'); throw err })
        })
        .catch((err) => { res.status(500).send('server error please come back later'); throw err })

});

module.exports = router;