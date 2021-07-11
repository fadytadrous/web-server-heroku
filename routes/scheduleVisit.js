const express = require("express");
const router = express.Router();

const db = require('../db/config');

router.post('/submitBooking', (req, res) => {
    console.log(req.body.name);
    console.log(req.body.patientSSN);

    const data = req.body;
    console.log(data);

    const patientSSN = req.body.patientSSN;
    const doctor = req.body.name;
    const doctorNameArr = doctor.split(" ");
    const visitDate = req.body.day;
    const visitTime = req.body.time;
    db('patients').where('ssn', patientSSN)
        .then((res) => {
            patientId = res[0].patient_id;
            console.log(patientId);
        })
        .catch(err => console.log(err))
        .then(() => {
            db('doctors').where('first_name', doctorNameArr[0]).andWhere('last_name', doctorNameArr[1])
                .then((res) => {
                    doctorId = res[0].doctor_id;
                    console.log(doctorId);
                })
                .catch(err => console.log(err))
                .then(() => {
                    db('visit')
                        .insert({
                            patient_id: patientId, doctor_id: doctorId,
                            clinic_id: 15, secretary_id: 25, date: visitDate, time: visitTime
                        }, { includeTriggerModifications: true })
                        .then((res) => {
                            console.log(res);
                        })
                        .catch(err => { console.log(err) })

                })

        });



})
router.get('/submitBooking', (req, res) => {
    res.send("API Test");
})

module.exports = router;
