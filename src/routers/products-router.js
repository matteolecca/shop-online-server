const express = require ('express')
const router = new express.Router()
const cors = require ('cors')
const dbAsync = require ('../db/asyncDB')

router.get('/', async (req,res) =>{
})

router.get('/products', async (req,res) =>{
    console.log('CATEGORIES GETTED')
    const products = await dbAsync.getProducts()
    if(products.error) return res.status(400).send()
    return res.send(products)
})

router.get('/categories', async (req,res) =>{
    const categories = await dbAsync.getCategories()
    return res.send(categories)
})

module.exports = router

