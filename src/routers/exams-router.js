const express = require('express')
const router = new express.Router()
const db = require('../db/db')
const fetch = require('node-fetch');
const preparazioni = require('../../preparazioni');
const { validateReferer } = require('../../referers/validReferers');
const { esami } = require ('../../esami')
router.get('/exams', async (req, res) => {
    res.send(esami)
})
router.get('/subexams/:doctor', async (req, res) => {
    if (!req.params.doctor) return res.status(400).send()
    const exams = await db.getSubexams(req.params.doctor)
    if (exams.error) return res.status(400).send()
    return res.send(exams)
})
router.get('/subexams', async (req, res) => {
    console.log('Subexams getted...')
    const exams = await db.getSubexams()
    if (exams.error) return res.status(400).send()
    return res.send(exams)
})
router.get('/provinces', async (req, res) => {
    const provinces = await db.getProvinces()
    if (provinces.error) return res.status(400).send()
    return res.send(provinces)
})

router.get('/countries', async (req, res) => {
    console.log('Countries getted...')
    const response = await fetch(
        'https://parseapi.back4app.com/classes/Country?limit=10000000&order=name&keys=name&keys=code',
        {
            headers: {
                'X-Parse-Application-Id': 'mxsebv4KoWIGkRntXwyzg6c6DhKWQuit8Ry9sHja', // This is the fake app's application id
                'X-Parse-Master-Key': 'TpO0j3lG2PmEVMXlKYQACoOXKQrL3lwM0HwR9dbH', // This is the fake app's readonly master key
            }
        }
    );
    const data = await response.json(); // Here you have the data that you need
    const countries = data.results.map(country => {
        let prefix = ''
        try {
            prefix = prefixes.byCountryName(country.name)[0].callingCode
        } catch (error) {
            prefix = ''
        }
        return { value: country.name, subvalue: country.name }
        // return {country  : country.name, objectId : country.objectId, code : country.code, prefix : prefix}
    })
    return res.send(countries)
})

router.get('/preparazioni', async (req, res) => {
    console.log('preparazioni....')
    return res.send(preparazioni.preparazioni)
})


module.exports = router