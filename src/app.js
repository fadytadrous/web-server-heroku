const express = require('express')
var cors = require('cors');
const knex = require('knex')


const db = knex({
    // Enter your own database information here based on what you created
    client: 'mysql2',
    connection: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'DruGuide'
    }
});



// testing sequelize
// const { Sequelize } = require('sequelize');
// const sequelize = new Sequelize('sqlite::memory:') // Example for sqlite
// console.log(sequelize)
// try {
//     sequelize.authenticate();
//     console.log('Connection has been established successfully.');
// } catch (error) {
//     console.error('Unable to connect to the database:', error);
// }
const app = express()
// use it before all route definitions
app.use(cors({ origin: '*' }));

// var data = [
//     {
//         id: "u1",
//         fullName: "Max shwartz",
//         role: "nurse",
//         time: "all day"
//     },
//     {
//         id: "u2",
//         fullName: "Fady Tadrous",
//         role: "Surgeon",
//         time: "from 7 to 9 PM",
//     },
//     {
//         id: "u3",
//         fullName: "Menna ",
//         role: "Pediatric",
//         time: "from 7 to 10 PM",
//     },
//     {
//         id: "u4",
//         fullName: "Nouran",
//         role: "Dentist",
//         time: "from 8 to 9 PM",
//     },

//     {
//         id: "u5",
//         fullName: "Nancy",
//         role: "Dermatology",
//         time: "from 7 to 12 PM",
//     },
// ]
app.set('view engine', 'hbs')

app.get('', (req, res) => {
    res.send("This is test for heroku")
    // db.select().table('doctors').then(data => {
    //     res.send(data)
    // })
})
app.get('/help', (req, res) => {
    res.send("This is help")
})
app.get('/weather', (req, res) => {
    res.send("weather")
})
app.listen(process.env.PORT || 3000, () => {
    console.log("listening on port 3000!")
})