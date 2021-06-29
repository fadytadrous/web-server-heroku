const express = require('express')
var cors = require('cors');
const bodyParser = require('body-parser');

const knex = require('knex')
const PORT = process.env.PORT || 5000

// mysql://b37927204c73ea:ee372baa@eu-cdbr-west-01.cleardb.com/heroku_e70fec14c252d2b?reconnect=true
const db = knex({
    client: 'mysql2',
    // Enter your own database information here based on what you created
    connection: {
        host: 'eu-cdbr-west-01.cleardb.com',
        user: 'b37927204c73ea',
        password: 'ee372baa',
        database: 'heroku_e70fec14c252d2b'
    }
    /*                 LOCAL CONNECTION TO DB     */
    // connection: {
    //     host: 'localhost',
    //     user: 'root',
    //     password: '',
    //     database: 'druGuide'
    // }
});

const app = express()
// use it before all route definitions
app.use(cors({ origin: '*' }));


app.set('view engine', 'hbs')

app.get('', (req, res) => {
    // res.send("This is test for heroku")
    db.select().table('doctors').then(data => {
        res.send(data)
    })
        .catch(err => {
            console.log(err);
        })
})
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// app.use(bodyParser.json());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Access the parse results as request.body
app.post('/submitBooking', (req, res) => {
    console.log(req.body.name);
    console.log(req.body.patientSSN);
    const data = req.body;
    console.log(data);
    res.send(data);
});
app.get('/submitBooking', (req, res) => {
    res.send("API Test");
})

// app.get('/help', (req, res) => {
//     res.send("This is help")
// })
// app.get('/weather', (req, res) => {
//     res.send("weather")
// })
app.listen(PORT, () => {
    console.log("site working...");
})