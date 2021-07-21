const express = require ('express')
const router = new express.Router()
const dbAsync = require ('../db/asyncDB')


router.post('/order', async (req,res)=>{
    let user = await dbAsync.getUserByEmail(req.body.order.email)
    if(!user) user = await dbAsync.createUser(req.body.order)
    console.log(user)
    if(user.error)return res.status(400).send({error : 'Unable to insert user data'})
    let address = await dbAsync.getAddress(req.body.order)
    if(!address) address = await dbAsync.insertAddress(req.body.order)
    if(address.error)return res.status(400).send({error : 'Unable to insert address'})
    // const totalPrice = await calculatePrice(req.body.products)
    const order = await dbAsync.insertOrder(user.insertId, address.insertId, 200)
    if(order.error)return res.status(400).send({error : 'Unable to insert order'})
    const orderedproducts = await dbAsync.insertOrderedProducts(order.insertId, req.body.products)
    if(orderedproducts.error)return res.status(400).send({error : 'Unable to insert order'})
    console.log('INSERT ID ', order.insertId)
    return res.send({orderID : order.insertId})
})

router.get('/order/:orderID', async (req,res) =>{
    const order = await dbAsync.getOrder(req.params.orderID)
    if(!order)return res.status(400).send({error : 'Order not found'})
    if(order.error)return res.status(400).send({error : 'Order not found'})
    const address = await dbAsync.getAddressData(order.address)
    const customer = await dbAsync.getUser(order.user)
    if(!customer)return res.status(400).send({error : 'Order not found'})
    if(customer.error)return res.status(400).send({error : 'Order not found'})
    const orderedproducts = await dbAsync.getOrderedProducts(req.params.orderID)
    if(!orderedproducts)return res.status(400).send({error : 'Order not found'})
    if(orderedproducts.error)return res.status(400).send({error : 'Order not found'})
    return res.send({order : order, customer : customer, products : orderedproducts, address : address})
})
router.get('/calculateprice', async (req,res)=>{
    
    
})

// router.get('/orders/:token', async (req,res) =>{
//     const token = req.params.token
//     try{
//         var decoded = jwt.verify(token, process.env.TOKEN_SECRET)
//     }
//     catch(error){
//         return res.status(400).send()
//     }
//     const userID = decoded.id
//     const orders = await dbAsync.getOrders(userID)
//     if(orders.error) return  res.status(400).send(orders.error)
//     return res.send(orders)
// })
module.exports = router




