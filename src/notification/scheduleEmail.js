const moment =require('moment')
const db =  require('../db/db');
const { sendRemainderEmail } = require('../email/email-sender');



const asyncForeach = async (array, callback )=>{
    for(let i = 0 ; i < array.length; i++){
        await callback(array[i])
    }
}

exports.scheduleEmail = async () => {
    console.log('Checking for appointments....')
    const today = new Date()
    today.setDate(today.getDate() + 1)
    const dateFormatted = moment(today).format('YYYY-MM-DD') 
    const result =  await db.getAppuntamentiByDate(dateFormatted)
    asyncForeach(result, element => sendRemainderEmail(element))
   
}