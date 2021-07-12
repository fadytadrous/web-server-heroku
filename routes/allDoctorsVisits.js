const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/checkAuth");

const db = require('../db/config')

router.get("/showTodaysVisits", authenticateToken, (req, res) => {

    const secretaryId = req.user.secretary_id;
    let today = new Date();
    let day = String(today.getDate()).padStart(2, '0');
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let year = today.getFullYear();
    let full = year + '-' + month + '-' + day;
    db("secretary_works_in").where('secretary_id', secretaryId)
        .then(res => {
            clinicId = res[0].clinic_id;
            console.log("clinic:", clinicId);
        })
        .catch(err => {
            console.log(err);
        })
        .then(() => {
            db("visit")
                .join("doctors", "visit.doctor_id", "=", "doctors.doctor_id")
                .join("patients", "visit.patient_id", "=", "patients.patient_id")
                .where("clinic_id", clinicId)
                .andWhere("date", full)
                .select(["visit.visit_id", "visit.time",
                    "patients.first_name", "patients.last_name",
                    db.ref("doctors.first_name").as("doctor_firstname"),
                    db.ref("doctors.last_name").as("doctor_lastname")])

                .then(todaysVisits => {
                    if (todaysVisits.length) {
                        res.send(todaysVisits);
                    }
                    else {
                        res.json([]);
                    }

                })
                .catch(err => {
                    console.log(err);
                })

        })
})
module.exports = router;