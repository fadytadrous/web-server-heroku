var express = require('express');
var router = express.Router();
const knex = require('../db/config');
var pa={};
const authenticateToken = require("../middleware/checkAuth");

router.get('/allPatients/:id',authenticateToken, function (req, res) {
    const doctor_id = req.user.doctor_id;
    const id = req.params.id;
    if(id ==='1'){
    knex.select('patients.*',
        knex.raw('GROUP_CONCAT(??.??) AS ?? ',
            ['medications', 'product_name', "medications"]),
        'medical_history.*')
        .from('patients')
        .leftOuterJoin('medications', 'patients.patient_id', '=', 'medications.patient_id')
        .leftOuterJoin('medical_history', 'patients.patient_id', '=', 'medical_history.patient_id')
        .innerJoin('visit', 'patients.patient_id', '=', 'visit.patient_id').where('visit.doctor_id', doctor_id)
        .groupBy('patients.patient_id')
        .then((patients) => {

            if (patients.length) {
                pa = patients;

            }
        })
        .catch(err => {
            console.log(err);
        });
    knex.select('patient_id',knex.raw('GROUP_CONCAT(??) AS ?? ',
        [ 'date', "visits"])
        ,knex.raw('GROUP_CONCAT(??) AS ?? ',
            [ 'diagnosis', "diagnosis"]))
        .from('visit')
        .where('doctor_id', doctor_id).andWhere(function () {
        this.where('date', '=<', (new Date())).where({completed : 'yes'})
    })
        .groupBy('patient_id')
        .then((patients) => {
            if (patients.length) {
                res.json({patient:pa, visit: patients});
                console.log({patient:pa, visit: patients})
            } else {
                res.json({patient:pa});
            }
        })
        .catch(err => {
            console.log(err);
        });}
        else if(id === '2'){


    knex.select('patients.*',
        knex.raw('GROUP_CONCAT(??.??) AS ?? ',
        ['medications','product_name',"medications"]),'medical_history.*')
            .from('patients')
            .leftOuterJoin('medications', 'patients.patient_id', '=', 'medications.patient_id')
        .leftOuterJoin('medical_history', 'patients.patient_id', '=', 'medical_history.patient_id')
        .innerJoin('visit', 'patients.patient_id', '=', 'visit.patient_id')
        .innerJoin('secretary_works_in','secretary_works_in.clinic_id','=','visit.clinic_id')
        .groupBy('patients.patient_id')
        .then((patients) => {
            if (patients.length) {

                res.json(patients);


            } else {
                res.json([])
            }
        })
        .catch(err => {
            console.log(err);
        });

    }
});


module.exports = router;