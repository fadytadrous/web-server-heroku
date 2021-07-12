var express = require('express');
var router = express.Router();
const knex = require('../db/config')
const authenticateToken = require("../middleware/checkAuth");

/* GET ALL . */
router.get('/', authenticateToken, function (req, res, next) {
    const doctor_id = req.user.doctor_id;
    var date;
    date = new Date();
    date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2);

    knex.from('patients')

        .select([
            'patients.*', 'visit.*'
        ])
        .where('visit.doctor_id', doctor_id)
        .where('visit.date', date)

        .leftOuterJoin(
            'visit',
            'patients.patient_id',
            'visit.patient_id'
        )

        .then((results) => {
            res.send(results);
        })
        .catch((err) => { res.status(500).send('server error please come back later'); throw err })

});

// GET ONE
router.get('/:id', function (req, res, next) {
    const id = req.params.id;
    knex.from('patients')
        .where('patient_id', id)
        .first()
        .then((results) => {
            res.json(results);
        })
        .catch((err) => { res.status(500).send('server error please come back later'); throw err })

});
// GET MEDICATIONS
router.get('/:id/medications', authenticateToken, function (req, res, next) {
    const id = req.params.id;
    var date;
    date = new Date();
    date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2);

    knex.from('drug_products')
        .whereIn('product_id', knex('medications')
            .select('product_id')
            .where('patient_id', id)
            .where('to_date', '>=', date)
            .orWhere('chronic', true)
        )
        .then((results) => {
            res.send(results);
        })
        .catch((err) => { res.status(500).send('server error please come back later'); throw err })

});
// POST CHECK INTERACTIONS
router.post('/:id/check_interactions', async function (req, res, next) {
    const id = req.params.id;
    const page = req.query.inter_page;
    let drugs = [];
    let medications = [];
    drugs = req.body.drugs;
    var date;
    date = new Date();
    date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2);

    //check if there are drugs
    (drugs && drugs.length < 1) ? res.send('there are no drugs provided') : null;

    //get patient medications
    await knex.from('drug_products')
        .whereIn('product_id', knex('medications')
            .select('product_id')
            .where('patient_id', id)
            .where('to_date', '>=', date)
            .orWhere('chronic', true)

        ).then((results) => {
            medications = results;
        })
        .catch((err) => { res.status(500).send('server error please come back laters'); throw err })

    //map to parentkey only
    drugs_ = drugs.map((value, index) => { return value.parent_key });
    //map to parentkey only
    medications_ = medications.map((value, index) => { return value.parent_key });

    //get interesctions table 
    knex.from('drug_drug_interactions')
        .whereIn('drugbank-id', drugs_)
        .whereIn('parent_key', medications_)
        .then((results) => {
            res.json({ results: results, drugs: drugs, medications: medications });
        })
        .catch((err) => { res.status(500).send('server error please come back later'); throw err })

});


module.exports = router;