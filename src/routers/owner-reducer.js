const express = require('express')
const router = new express.Router()
const db = require('../db/db')
const ownerdb = require('../db/owner-db')
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
const tokenGenerator = require ('../utils/webTokenValidator')

router.get('/appuntamenti/:date', async (req, res) => {
    const date = req.params.date
    const appuntamenti = await db.getAppuntamentiByDate(date)
    if (appuntamenti.error) return res.status(400).send()
    const leccaAppuntamenti = await appuntamenti.filter(a => a.doctor === 0)
    const deianaAppuntamenti = await appuntamenti.filter(a => a.doctor === 1)
    setTimeout(() => {
        return res.send(
            {
                results:
                    [{
                        date: req.params.date,
                        lecca: leccaAppuntamenti,
                        deiana: deianaAppuntamenti
                    }]
            }
        )
    }, 2000);

})
router.get('/appuntamenti/:value/:type', async (req, res) => {
    console.log('Filtra per nome', req.params)
    const dates = await db.getDatesWhenBooked()
    const appuntamenti = await db.filtraAppuntamenti(req.params.value, req.params.type)
    if (appuntamenti.error) return res.status(400).send()
    if(appuntamenti.length === 0) return res.send({results : []})
    let appByDate = []
    await dates.forEach(async day => {
        const allapp = await appuntamenti.filter(a => (new Date(a.day).getTime() === new Date(day.day).getTime()))
        if(allapp.length === 0 ) return
        const leccaAppuntamenti =  allapp.filter(a => a.doctor === 0)
        const deianaAppuntamenti =  allapp.filter(a => a.doctor === 1)
         appByDate.push({
            date: day.day,
            lecca: leccaAppuntamenti,
            deiana: deianaAppuntamenti
        })
    });
        return res.send({results:appByDate})
})
router.get('/appuntamenti/:value/:type/:date', async (req, res) => {
    const date = req.params.date
    const appuntamenti = await db.filtraAppuntamentiByDate(req.params.value, req.params.type, date)
    if (appuntamenti.error) return res.status(400).send()
    const leccaAppuntamenti = await appuntamenti.filter(a => a.doctor === 0)
    const deianaAppuntamenti = await appuntamenti.filter(a => a.doctor === 1)
    setTimeout(() => {
        return res.send(
            {
                results:
                    [{
                        date: req.params.date,
                        lecca: leccaAppuntamenti,
                        deiana: deianaAppuntamenti
                    }]
            }
        )
    }, 2000);
})

router.get('/allsubexams', async (req, res) => {
    const subexams = await db.getAllSubexams()
    if (subexams.error) return res.status(400).send()
    return res.send(subexams)
})

router.post('/auth', async (req,res)=>{
    const insertedPassword = req.body.password
    if(!insertedPassword || insertedPassword === '') return res.send({logged : false})
    const user = await db.getPassword()
    if(user.error) return res.send({message : 'Problema tecnico'})
    const isPasswordValid = await bcrypt.compare(insertedPassword, user.password)
    if(isPasswordValid) {
        const token = tokenGenerator.generateToken(user.username)
        return res.send({ logged  : true, token : token})
    }
    else {return res.send({ logged  : false, message : 'Password non valida'})}
})

router.post('/validatetoken', (req,res)=>{
    const token = req.body.token
    if(!token ) return res.send()
    const isvalid = tokenGenerator.validateToken(token)
    if(isvalid.id) return res.send({valid : true})
    return res.send({valid : false})
})


router.post('/insertart', async (req, res) =>{
    const result = await ownerdb.insertArticolo(req.body.link, req.body.title, req.body.subtitle)
    if(result.error ) return res.status(400).send({error : 'Errore inserendo articolo'})
    return res.send({ status : "inserted"})
})

router.get('/loadart', async (req, res) =>{
    const result = await ownerdb.getArticoli()
    if(result.error ) return res.status(400).send({error : 'Errore caricando articoli'})
    return res.send({ articoli : result})
})

router.post('/deleteart/:ID', async (req, res) =>{
    const result = await ownerdb.deleteArticolo(req.params.ID)
    if(result.error ) return res.status(400).send({error : 'Errore cancellando articolo'})
    return res.send({ deleted : true})
})


module.exports = router
