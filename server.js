const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const paymentRouter = require('./src/routers/payment-router')
const ordersRouter = require('./src/routers/orders-router')
const productRouter = require('./src/routers/products-router')
const userRouter = require('./src/routers/users-router')
const notificationRouter = require('./src/routers/notification-router')
const cors = require('cors')
const webpush = require('web-push')
const PORT = process.env.PORT || 8080;

var corsOptions = {
    origin : [ 'http://localhost:3000','http://192.168.1.146:3000','http://192.168.1.146:3001', 'https://matteolecca-shop-online-app.herokuapp.com'],
    credentials:true,
    methods:['GET','POST'],
    sameSite : 'none'
}
app.use(cors(corsOptions));


app.use(paymentRouter)
app.use(ordersRouter)
app.use(productRouter)
app.use(userRouter) 
app.use(notificationRouter) 

const keys = webpush.generateVAPIDKeys()
webpush.setVapidDetails('mailto:matteolecca00@gmail.com',keys.publicKey, keys.privateKey)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

