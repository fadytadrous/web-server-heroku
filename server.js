const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000
app.use(cors())
// app.use(bodyParser.json());


app.use(express.json({limit: '50mb', extended: true}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
// app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res)=> {
  res.send(console.log('Hi'));
})

app.use('/', require("./routes/register"));
app.use('/', require("./routes/signin"));
app.use('/', require("./routes/clinics"));
app.use('/', require("./routes/isAuthorized"));
app.use('/', require("./routes/registerPurchase"));
app.use('/', require("./routes/signinPurchase"));
app.use('/', require("./routes/sendcode"));
app.use('/', require("./routes/addClinic"));
app.use('/', require('./routes/index'));

app.use('/', require('./routes/allPatients'));

app.use('/', require('./routes/doctorProfile'));
app.use('/', require('./routes/doctorVisits'));
app.use('/', require('./routes/secretaryProfile'));

app.use('/', require('./routes/addpatient'));

app.use('/', require('./routes/scheduleVisit'));
app.use('/', require('./routes/allDoctors'));


// starting the server
app.listen(PORT, ()=> {
    console.log('app is running on port' , PORT);
  })




