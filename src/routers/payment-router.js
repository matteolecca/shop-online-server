const express = require("express");
const router = new express.Router()
const { resolve } = require("path");
// This is your real test secret API key.
const stripe = require("stripe")("sk_test_51HkFeOA6e3WOyQYgTfJCz0nMUC3iDnaDu8pQDXppYaZjkYK0lR7eMCY5G8dA1YjvxoztQ6u4x7vC3rjxJ7bjy0rG00i4gFjGtu");

router.use(express.static("."));
router.use(express.json());
const cors = require('cors')

const calculateOrderAmount = cart => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  let amount = 0
  for(i in cart){
    amount += cart[i].price * cart[i].quantity
  }
  return amount * 100;
};

router.post("/create-payment-intent", async (req, res) => {

    console.log("Request sent",req.body)
  const cart = req.body.order.cart
  const ID = req.body.ID
 
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(cart),
    currency: "usd",
    metadata:{
      userID : ID,
      order: JSON.stringify(cart)
    }
  });

  res.send({
    clientSecret: paymentIntent.client_secret
  });
});


module.exports = router