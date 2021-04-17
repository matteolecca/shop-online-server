const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const paymentRouter = require('./src/routers/payment-router')
const ordersRouter = require('./src/routers/orders-router')
const productRouter = require('./src/routers/products-router')
const userRouter = require('./src/routers/users-router')
const cors = require('cors')
const session = require('./src/session/session')

var corsOptions = {
    origin : [ 'http://localhost:3000','http://192.168.1.146:3000','http://192.168.1.146:3001', 'https://matteolecca-shop-online-server.herokuapp.com'],
    credentials:true,
    methods:['GET','POST'],
    sameSite : 'none'
}
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(paymentRouter)
app.use(ordersRouter)
app.use(productRouter)
app.use(userRouter) 
const PORT = process.env.PORT || 8080;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

