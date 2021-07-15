var express = require('express');
var router = express.Router();

const drugsRouter = require('./drugs');
const interRouter = require('./interactions');
const patientsRouter = require('./patients');
const visitsRouter = require('./visits.js')
const prescriptionRouter = require('./prescriptions.js')

router.use('/drugs', drugsRouter);
router.use('/interactions', interRouter);
router.use('/patients', patientsRouter);
router.use('/visits', visitsRouter);
router.use('/prescriptions', prescriptionRouter);

module.exports = router;