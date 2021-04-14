//Router responsible for handling email reset request
require('dotenv').config()
const moment = require('moment')
const express = require('express')
const router = new express.Router()
var nodemailer = require('nodemailer');
const hbs = require("nodemailer-express-handlebars");
const dateConverter = require('../utils/dateConverter')
//Create object email
var transporter = nodemailer.createTransport({
   service: 'hotmail',
   auth: {
      user: process.env.EMAIL,
      pass: process.env.MAIL_PASSWORD
   }
});


exports.sendRemainderEmail = async (exam) => {
   console.log('Sending email....')
   //options object contains path to render email 
   const options = {
      viewEngine: {
         partialsDir: __dirname + "/../email",
         layoutsDir: __dirname + "/../email",
         extname: ".hbs",
         defaultLayout: '',
      },
      extName: ".hbs",
      viewPath: __dirname + "/../email"
   };

   //Email options
   var mailOptions = {
      from: '"Studio Radiologico" <studio-lecca-deiana@outlook.it>',
      subject: 'Promemoria',
      template: "reminderEmail",

   };
   transporter.use("compile", hbs(options));
   mailOptions.to = exam.email
   mailOptions.context = {
      name: exam.name + ' ' + exam.surname,
      date: dateConverter.convertToItalianDate(moment(exam.day).format('YYYY-MM-DD')),
      time: exam.time.slice(0,5),
      exam: exam.exam,
      ID : exam.ID
   }
   let result = null
   try{
      result = await transporter.sendMail(mailOptions)
      console.log('TRy catch result ok')
   }
   catch(error){
      console.log('Error email send')
      console.log(error.message)
   }
   return result
}



exports.sendEmail = async (exam, user, ID) => {
   //options object contains path to render email 
   const options = {
      viewEngine: {
         partialsDir: __dirname + "/../email",
         layoutsDir: __dirname + "/../email",
         extname: ".hbs",
         defaultLayout: '',

      },
      extName: ".hbs",
      viewPath: __dirname + "/../email"
   };

   //Email options
   var mailOptions = {
      from: '"Studio Radiologico" <studio-lecca-deiana@outlook.it>',
      subject: 'Conferma prenotazione',
      template: "main",

   };
   transporter.use("compile", hbs(options));
   mailOptions.to = user.email
   mailOptions.context = {
      name: user.name + ' ' + user.surname,
      date: dateConverter.convertToItalianDate(exam.date),
      time: exam.time.slice(0,5),
      exam: exam.exam,
   }
   let result = null
   console.log(exam.date)
   try{

      result = await transporter.sendMail(mailOptions)
      console.log('TRy catch result ok')
   }
   catch(error){
      console.log('Error email send')
      console.log(error.message)
   }
   return result
}


exports.sendDeletedEmail = async (reservation) => {
   //options object contains path to render email 
   const options = {
      viewEngine: {
         partialsDir: __dirname + "/../email",
         layoutsDir: __dirname + "/../email/deleteEmail",
         defaultLayout: '',
         extname: ".hbs"
      },
      extName: ".hbs",
      viewPath: __dirname + "/../email"
   };

   //Email options
   var mailOptions = {
      from: '"Studio Radiologico" <taskmanagementappbristol@gmail.com>',
      subject: 'Conferma cancellazizone',
      template: "deleteEmail",

   };
   transporter.use("compile", hbs(options));
   mailOptions.to = 'matteolecca00@gmail.com'
   mailOptions.context = {
      name: reservation.name + ' ' + reservation.surname,
      date: dateConverter.convertToItalianDate(reservation.day),
      time: reservation.time,
      exam: reservation.exam,
   }
   const result = await transporter.sendMail(mailOptions)
   return result
}
