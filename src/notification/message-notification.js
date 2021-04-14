require('dotenv').config()
var twilio = require('twilio');
var client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

exports.sendConfirmMessage = async (exam, user, ID)=>{
    const message = createMessage(exam, ID)
    console.log(message)
    client.messages.create({
        body: message,
        to: '+393201924284',  // Text this number
        from: 'Ecografia' // From a valid Twilio number
    })
    .then((message) => console.log(message.sid));
}

const createMessage = (exam,ID)=>{
    const message = 
    `Prenotazione confermata\n` + 
    `ESAME: ${exam.exam}\n` + 
    `DATA: ${exam.date}\n` + 
    `ORARIO: ${exam.time}\n` + 
    `Puoi vedere un resoconto della sua prenotazione al link\n` + 
    `https://www.matteolecca.com/conferma-prenotazione/${ID}`
    return message
}
