const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/checkAuth");
const db = require("../db/config");

router.post("/submitBooking", authenticateToken, (req, res) => {
  const data = req.body;
  console.log(data);

  console.log(req.user.secretary_id);

  const patientSSN = req.body.patientSSN;
  const doctor = req.body.name;
  const doctorNameArr = doctor.split(" ");
  const visitDate = req.body.day;
  const visitTime = req.body.time;
  const secretaryId = req.user.secretary_id;
  db("patients")
    .where("ssn", patientSSN)
    .then((res) => {
      patientId = res[0].patient_id;
      console.log(patientId);
    })
    .catch((err) => {
      res.status(400).json("unable to send code");
    })
    .then(() => {
      db("doctors")
        .where("first_name", doctorNameArr[0])
        .andWhere("last_name", doctorNameArr[1])
        .then((res) => {
          doctorId = res[0].doctor_id;
          console.log(doctorId);
        })
        .catch((err) => {
          res.status(400).json("unable to send code");
        })
        .then(() => {
          db("secretary_works_in")
            .where("secretary_id", secretaryId)
            .then((res) => {
              clinicId = res[0].clinic_id;
            })
            .catch((err) => {
              res.status(400).json("unable to send code");
            })
            .then(() => {
              db("visit")
                .insert(
                  {
                    patient_id: patientId,
                    doctor_id: doctorId,
                    clinic_id: clinicId,
                    secretary_id: secretaryId,
                    date: visitDate,
                    time: visitTime,
                  },
                  { includeTriggerModifications: true }
                )
                .then((res) => {
                  console.log(res);
                  res.json("200");
                })
                .catch((err) => {
                  console.log(err);
                  res.json("400");
                });
            });
        });
    });
});
router.get("/submitBooking", (req, res) => {
  res.send("API Test");
});

module.exports = router;
