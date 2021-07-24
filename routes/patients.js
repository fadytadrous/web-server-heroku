var express = require("express");
var router = express.Router();
const knex = require("../db/config");
const authenticateToken = require("../middleware/checkAuth");

/* GET ALL . */
router.get("/", authenticateToken, function (req, res, next) {
  const doctor_id = req.user.doctor_id;
  var date;
  date = new Date();
  date =
    date.getUTCFullYear() +
    "-" +
    ("00" + (date.getUTCMonth() + 1)).slice(-2) +
    "-" +
    ("00" + date.getUTCDate()).slice(-2);

  knex
    .from("patients")

    .select(["patients.*", "visit.*"])
    .where("visit.doctor_id", doctor_id)
    .where("visit.date", date)
    .where("completed", "no")

    .leftOuterJoin("visit", "patients.patient_id", "visit.patient_id")

    .then((results) => {
      res.send(results);
    })
    .catch((err) => {
      res.status(500).send("server error please come back later");
      throw err;
    });
});

// GET ONE
router.get("/:id", function (req, res, next) {
  const id = req.params.id;
  knex
    .from("patients")
    .where("patient_id", id)
    .first()
    .then((results) => {
      res.json(results);
    })
    .catch((err) => {
      res.status(500).send("server error please come back later");
      throw err;
    });
});
// GET MEDICATIONS
router.get("/:id/medications", authenticateToken, function (req, res, next) {
  const id = req.params.id;
  var date;
  date = new Date();
  date =
    date.getUTCFullYear() +
    "-" +
    ("00" + (date.getUTCMonth() + 1)).slice(-2) +
    "-" +
    ("00" + date.getUTCDate()).slice(-2);
  knex
    .from("drug_products")
    .select([
      "drug_products.*",
      "medications.*",
      "doctors.doctor_id",
      "doctors.first_name",
      "doctors.last_name",
      "doctors.email",
      "doctors.specialty",
      "doctors.phone_number",
    ])
    .where("patient_id", id)
    .where(function () {
      this.where("to_date", ">=", date).orWhereNull("to_date");
    })

    .leftOuterJoin(
      "medications",
      "drug_products.product_id",
      "medications.product_id"
    )
    .leftOuterJoin("doctors", "doctors.doctor_id", "medications.doctor_id")
    .then((results) => {
      res.send(results);
    })
    .catch((err) => {
      res.status(500).send("server error please come back later");
      throw err;
    });
});
router.post("/:id/check_interactions", async function (req, res, next) {
  const id = req.params.id;
  let medications = [];
  let drug = req.body.drug;
  // get current date
  var date;
  date = new Date();
  date =
    date.getUTCFullYear() +
    "-" +
    ("00" + (date.getUTCMonth() + 1)).slice(-2) +
    "-" +
    ("00" + date.getUTCDate()).slice(-2);

  // get patient medications
  await knex
    .from("drug_products")
    .select([
      "drug_products.*",
      "drug_drug_interactions.name as interaction_name",
      "drug_drug_interactions.description",
    ])
    .whereIn(
      "product_id",
      knex("medications")
        .select("product_id")
        .where("patient_id", id)
        .where(function () {
          this.where("to_date", ">=", date).orWhereNull("to_date");
        })
    )
    .join(
      "drug_drug_interactions",
      "drug_drug_interactions.parent_key",
      "drug_products.parent_key"
    )
    .where("drugbank-id", drug.parent_key)

    .then((results) => {
      return res.json({ results, drug });
    })
    .catch((err) => {
      res.status(500).send("server error please come back later");
      throw err;
    });
});

module.exports = router;
