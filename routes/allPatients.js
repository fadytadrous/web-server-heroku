var express = require('express');
var router = express.Router();
const knex = require('../db/config');
var pa;
/* GET ALL . */
router.get('/allPatients', function (req, res) {

    console.log("here");

    knex.select('patients.*',
        knex.raw('GROUP_CONCAT(??.??) AS ?? ',
        ['medications','product_name',"medications"]),'medical_history.*')
            .from('patients')
            .leftOuterJoin('medications', 'patients.patient_id', '=', 'medications.patient_id')
        .leftOuterJoin('medical_history', 'patients.patient_id', '=', 'medical_history.patient_id').groupBy('patients.patient_id')
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
router.get('/allPatients/:id', function (req, res) {
    const id = req.params.id;
    console.log(id);

    knex.select('patients.*',
        knex.raw('GROUP_CONCAT(??.??) AS ?? ',
            ['medications', 'product_name', "medications"]),
        'medical_history.*')
        .from('patients')
        .leftOuterJoin('medications', 'patients.patient_id', '=', 'medications.patient_id')
        .leftOuterJoin('medical_history', 'patients.patient_id', '=', 'medical_history.patient_id')
        .innerJoin('visit', 'patients.patient_id', '=', 'visit.patient_id').where('visit.doctor_id', id)
        .groupBy('patients.patient_id')
        .then((patients) => {
            if (patients.length) {
                pa = patients;
//                res.json(patients);

                console.log(patients);
            } else {
                res.json([])
            }
        })

        .catch((err) => {
            res.status(500).send('server error please come back later');
            throw err
        });

    knex.select('patient_id',knex.raw('GROUP_CONCAT(??) AS ?? ',
        [ 'date', "visits"]))
        .from('visit')
        .where('doctor_id', id).andWhere(function () {
        this.where('date', '<', (new Date()))
    })
        .groupBy('patient_id')
        .then((patients) => {
            if (patients.length) {
                //var pa = patients;
                res.json({patient:pa, visit: patients});

                console.log( patients);
            } else {
                res.json([])
            }
        })
        .catch((err) => {
            res.status(500).send('server error please come back later');
            throw err
        });
});


module.exports = router;