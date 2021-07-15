const express = require("express");
const router = express.Router();
const db = require('../db/config')
const { v4: uuidv4 } = require('uuid');
const nodemailer = require("nodemailer");
const authenticateToken = require("../middleware/checkAuth");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
     user: 'DruGuide4@gmail.com',
     pass: 'drug123456'
  }
});
  
  router.post('/sendcode',authenticateToken , (req, res) => {
    const customer_id = req.user.customer_id;
    const {email} = req.body;
    const uuid = uuidv4();
    console.log(uuid);
    const options = {
      from: "DruGuide4@gmail.com",
      to: email,
      subject: "DruGuide Registration Code",
      text: `Dear user Please use this code when registering to 
      DruGuide :  ${uuid}`
    };
  
  
    
  
    db.insert({
      customer_id: customer_id, uuid: uuid ,email: email
      })
    .into('authorized_users')
    .then(()=>{
      return transporter.sendMail(options);
      
    }).then((info)=>{
      console.log("Message sent: %s", info.messageId);
      res.status(200).json('Success')
    })
    .catch(err => {
      console.log(err)
      res.status(400).json('unable to send code')
    }
      )
  })
module.exports = router;  