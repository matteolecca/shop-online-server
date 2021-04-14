const express = require('express')
require('dotenv').config()
const app = express()
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8080;
const reservationRouter = require('./src/routers/reservation-router')
const examsRouter = require('./src/routers/exams-router')
const ownerRouter = require('./src/routers/owner-reducer')
const cors = require('cors')
var cron = require('node-cron');
const { scheduleEmail } = require('./src/notification/scheduleEmail');
const { request } = require('express');
const { validateReferer } = require('./referers/validReferers');

var corsOptions = {
    origin: ['https://ecografia-app.herokuapp.com', 'https://ecografia-owner-app.herokuapp.com', 'https://www.matteolecca.com', 'http://192.168.1.146:3000', 'http://192.168.1.146:3001', 'http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['POST', 'GET'],
    sameSite: 'none'
}
app.use(express.json());
app.use(cors(corsOptions));

app.get('/', (req, res) => {
    return res.send({ status: 'alive' })
})

app.get('*', (req, res, next) => {
    if (!validateReferer(req.headers.referer)) return res.status(400).send({ error: 'unhautorized' })
    else return next()
})
app.post('*', (req, res, next) => {
    if (!validateReferer(req.headers.referer)) return res.status(400).send({ error: 'unhautorized' })
    else return next()
})

app.use(reservationRouter)
app.use(examsRouter)
app.use(ownerRouter)


app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT${PORT}`)
    cron.schedule('0 09 * * *', async () => {
        scheduleEmail()
    },{timezone : 'Europe/Rome'})
})




