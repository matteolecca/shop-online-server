const express = require ('express')
const router = new express.Router()
const db = require ('../db/asyncDB')
const webpush = require('web-push')


router.get('/subscribe', (req,res)=>{
    const {subscription} = req.body
    const payload  = JSON.stringify({title : 'HI BITCH'})
    webpush.sendNotification(subscription,payload).catch(e=>console.log(e))
    return res.send()
})



module.exports = router




