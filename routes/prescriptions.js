var express = require('express');
var router = express.Router();
const knex = require('../db/config')
const authenticateToken = require("../middleware/checkAuth");


/* GET ALL . */
router.get('/:id', authenticateToken, async function   (req, res, next) {
    const doctor_id = req.user.doctor_id;
    const prescription_id = req.params.id;
    let prescription;
    let diagnosis,drugs,patient,visit;

    await knex.from('prescription')
        .where('prescription_id', prescription_id)
        .first()
        .then((result) => {
            prescription=result;
             
        })
        .catch((err) => { res.status(500).send('server error please come back later'); throw err })

        await knex.from('visit')
        .where('visit_id',prescription.visit_id)
        .first()
        .then((result) => {
            diagnosis=result.diagnosis;
            visit =result;
        })
        .catch((err) => { res.status(500).send('server error please come back later'); throw err })

        await knex.from('patients')
        .where('patient_id',visit.patient_id)
        .first()
        .then((result) => {
            patient=result;
        })
        .catch((err) => { res.status(500).send('server error please come back later'); throw err })

        await knex.from('prescribed_drugs')
        .where('prescription_id',prescription_id)
        .leftOuterJoin('drug_products','drug_products.product_id','prescribed_drugs.product_id')
        .then((result) => {
            return res.json([{"drugs":result,"patient":patient,"diagnosis":diagnosis}]);
        })
        .catch((err) => { res.status(500).send('server error please come back later'); throw err })


});

module.exports = router;