const express = require('express')
const router = new express.Router()
const db = require('../db/db')
const notificationMessage = require('../notification/message-notification')
const { v4: uuidv4 } = require('uuid');
const reservationValidator = require('../utils/reservationValidator')
const dateConverter = require('../utils/dateConverter')
const emailSender = require('../email/email-sender')
const cors = require('cors')

router.post('/reservation', async (req, res) => {
    console.log('Reservation submitted...')
    if (!reservationValidator.validateReservation(req.body)) return res.status(400).send({ error: 'Invalid params' })
    const validExam = await db.getValidExam(req.body.exam.exam, req.body.exam.doctor, req.body.exam.time)
    if (validExam.count < 1) return res.status(400).send()
    let result = {}
    const ID = uuidv4()
    const existingReservation = await db.getReservationCount(req.body.exam)
    if (existingReservation.error) return res.status(400).send({ error: "No space avaìlable" })
    if (existingReservation.existingReservation > 0) return res.status(400).send({ error: "No space avaìlable" })

    // const existingUser = await db.getUser(req.body.user.taxcode)
    // if (existingUser) {
    //     if (existingUser.error) return res.status(400).send({ error: "No space avaìlable" })
    //     result = await db.insertReservation(ID, req.body.exam, existingUser.ID)
    //     if (result.error) return res.status(400).send({ error: 'Error inserting reservation' })
    // }
    // else {
    //     const user = await db.insertUser(req.body.user)
    //     if (user.error) return res.status(400).send({ error: 'Error inserting user' })
    //     result = await db.insertReservation(ID, req.body.exam, user.insertId)
    //     if (result.error) return res.status(400).send({ error: 'Error inserting reservation' })
    // }
    const user = await db.insertUser(req.body.user)
    if (user.error) return res.status(400).send({ error: 'Error inserting user' })
    result = await db.insertReservation(ID, req.body.exam, user.insertId)
    if (result.error) return res.status(400).send({ error: 'Error inserting reservation' })
    // const notification =  notificationMessage.sendConfirmMessage(req.body.exam, req.body.user, ID)
    const email =  emailSender.sendEmail(req.body.exam, req.body.user, ID)
    return res.send({ insertId: ID })
})

router.post('/delete', async (req, res) => {
    const reservation = await db.getReservation(req.body.reservationID)
    if (!reservation) return res.status(400).send()
    const deleted = await db.deleteReservation(req.body.reservationID)
    if (deleted.error) return res.status(400).send()
    // const email = await emailSender.sendDeletedEmail(reservation)
    return res.send()
})
router.get('/reservation/:ID', async (req, res) => {
    const reservation = await db.getReservation(req.params.ID)
    if (!reservation) return res.send(null)
    return res.send(reservation)
})

router.get('/firstavailableslot/:exam/:doctor', async (req, res) => {
    console.log('First available slot...')
    const examduration = await db.getExamDuration(req.params.exam)
    if (!examduration) return res.status(400).send()
    if (examduration.error) return res.status(400).send()
    const examType = await db.getExamtype(req.params.exam)
    if (!examType) return res.send([])
    const today = new Date()
    today.setDate(today.getDate() + 1)
    const month = today.getMonth() + 1
    let slotfound = null
    while (!slotfound && today.getMonth() <= month) {
        const dayofweek = today.getDay()
        const dateformatted = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
        const isdayunavailable = await db.checkIfDateAvailable(dateformatted)
        if (isdayunavailable) {
            console.log('undavailable', dateformatted)
            today.setDate(today.getDate() + 1)
        }
        else {
            const result = await db.getFirstslotAvailable(dateformatted, examduration.duration, dayofweek, req.params.doctor, examType.examID)
            if (result) slotfound = result
            else today.setDate(today.getDate() + 1)
        }

    }
    if (!slotfound) return res.send(null)
    if (req.aborted) { console.log('aborted'); return res.send(); }
    else {
        return res.send({ date: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`, slot: slotfound })
    }
})


router.get('/freeslots/:date/:exam/:doctor', async (req, res) => {
    console.log(req.params.date, req.params.exam, req.params.doctor)
    console.log('Free slots...')
    const isdayunavailable = await db.checkIfDateAvailable(req.params.date)
    if (isdayunavailable) return res.send([])
    const examduration = await db.getExamDuration(req.params.exam)
    if (!examduration) return res.status(400).send()
    if (examduration.error) return res.status(400).send()
    const day = new Date(req.params.date).getDay()
    if (day === 6 || day === 7) return res.send([])
    const availableday = await db.getAvailableDays(day)
    if (!availableday) return res.send([])
    const examType = await db.getExamtype(req.params.exam)
    if (!examType) return res.send([])
    const freeSlots = await db.getFreeSlots(req.params.date, examduration.duration, availableday.day, req.params.doctor, examType.examID)
    if (freeSlots.error) return res.status(400).send()
    if (req.aborted) { console.log('aborted'); return res.send(); }
    else {
        return res.send(freeSlots)
    }
})

module.exports = router

