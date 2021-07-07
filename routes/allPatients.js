var express = require('express');
var router = express.Router();
const knex = require('../db/config');

/* GET ALL . */
router.get('/allPatients', function (req, res) {

    console.log("here");

    knex.select('patients.*',
        knex.raw('GROUP_CONCAT(??.??) AS ?? ',
        ['medications','product_name',"medications"]),'medical_history.*')
            .from('patients')
            .join('medications', 'patients.patient_id', '=', 'medications.patient_id')
        .join('medical_history', 'patients.patient_id', '=', 'medical_history.patient_id').groupBy('patients.patient_id')
        .then((patients) => {
            if (patients.length) {

                res.json(patients);

                console.log(patients);
            } else {
                res.json([])
            }
        })
        .catch((err) => { res.status(500).send('server error please come back later'); throw err })

});

module.exports = router;