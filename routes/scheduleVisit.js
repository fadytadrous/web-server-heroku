const express = require("express");
const router = express.Router();

const db = require('../db/config');

router.post('/submitBooking', (req, res) => {
    console.log(req.body.name);
    console.log(req.body.patientSSN);
    const data = req.body;
    console.log(data);
    res.send(data);
    db('visit')
        .insert({ patient_id: 123, doctor_id: 434, clinic_id: 32, secretary_id: 54, visit_id: 12 }, { includeTriggerModifications: true })

})
router.get('/submitBooking', (req, res) => {
    res.send("API Test");
})

module.exports = router;  
