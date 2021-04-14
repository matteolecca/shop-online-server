const db = require('../config/db-connect')

//INSERT RESERVATION
module.exports.insertReservation = async (ID, reservation, userID) => {
    let query = 'INSERT INTO appuntamenti (ID,day, time, exam, userID) values '
    query += '(?,?,?,?,?)'
    const result = await tryCcatch(query, [ID, reservation.date, reservation.time, reservation.exam, userID])
    return result
}

//INSERT USER
module.exports.insertUser = async user => {
    let query = 'INSERT INTO user (name, surname, birthdate, taxcode, sex, telephone, email) values '
    query += '(?,?,?,?,?,?,?)'
    const result = await tryCcatch(query, [user.name, user.surname, user.date, user.taxcode, user.sesso, user.telephone, user.email])
    return result
}

//GET USER
module.exports.getUser = async taxcode => {
    let query = 'SELECT ID from user where taxcode = ?'
    const result = await tryCcatch(query, taxcode, true)
    return result
}
//GET RESERVATION
module.exports.getReservationCount = async reservation => {
    const query = 'SELECT COUNT(*) as existingReservation FROM appuntamenti WHERE day = ? and time = ?'
    const result = await tryCcatch(query, [reservation.date, reservation.time], true)
    return result
}
//GET RESERVATION
module.exports.getReservation = async ID => {
    const query = 'select exam, day, time, name, surname, taxcode, email, telephone, prep from appuntamenti ' + 
    'join user join subexams where user.ID = appuntamenti.userID and appuntamenti.ID = ? AND subexams.subexam = appuntamenti.exam ' 
    const result = await tryCcatch(query, [ID], true)
    return result
}

//GET FREE SLOTS FOR SINGLE DAY
module.exports.getFreeSlots = async (date, duration, day, doctorID, examID) => {
    console.log('Free slots database')
    const query = 'SELECT slots.slot, slots.slottype, slots.slotduration FROM slots ' +
        'LEFT JOIN appuntamenti ' +
        'ON slots.slot = appuntamenti.time ' +
        'and appuntamenti.day = ? ' +
        'WHERE appuntamenti.time IS NULL and slots.slotduration = ? and slots.dayofweek = ? and slots.doctor = ? and examtype = ?'
    const result = tryCcatch(query, [date, duration, day, doctorID, examID])
    console.log('FEREE SLOTS ERRUTRENETX')
    return result
}
module.exports.checkIfDateAvailable = async  date =>{
    const query = 'select * from unavailabledates where date = ? '
    const result = await tryCcatch(query, date, true)
    return result
}
module.exports.getFirstslotAvailable = async (date, duration, day, doctorID, examID) => {
    const query = 'SELECT slots.slot, slots.slottype, slots.slotduration FROM slots ' +
        'LEFT JOIN appuntamenti ' +
        'ON slots.slot = appuntamenti.time ' +
        'and appuntamenti.day = ? ' +
        'WHERE appuntamenti.time IS NULL and slots.slotduration = ? and slots.dayofweek = ? and slots.doctor = ? and examtype = ? '
    const result = await tryCcatch(query, [date, duration, day, doctorID, examID], true)
    return result
}

module.exports.getAppuntamentiByDate = async date => {
    const query = 'select exam, day, time, name, surname, taxcode, email, telephone, appuntamenti.ID, doctor from appuntamenti ' +
        'join user join subexams ' +
        'where user.ID = appuntamenti.userID ' +
        'and subexams.subexam = appuntamenti.exam and appuntamenti.day = ? order by time asc'
    const result = await tryCcatch(query, [date])
    return result
}
module.exports.filtraAppuntamentiByDate = async (value, type, date) => {
    let query = 'select exam, day, time, name, surname, taxcode, email, telephone, appuntamenti.ID, doctor from appuntamenti ' +
        'join user join subexams ' +
        'where user.ID = appuntamenti.userID ' +
        'and subexams.subexam = appuntamenti.exam and appuntamenti.day = ? ' 
    query += `and ?? LIKE CONCAT('%', ?,  '%')`
    const result = await tryCcatch(query, [date, type, value])
    return result
}

module.exports.filtraAppuntamenti = async (value, type) => {
    let query = 'select exam, day, time, name, surname, taxcode, email, telephone, appuntamenti.ID, doctor from appuntamenti ' +
        'join user join subexams ' +
        'where user.ID = appuntamenti.userID ' +
        'and subexams.subexam = appuntamenti.exam ' 
    query += `and name LIKE CONCAT('%', ?,  '%')`
    query += `and surname = ?`
    const result = await tryCcatch(query, [ value.split(' ')[0], value.split(' ')[1]])
    return result
}

module.exports.getDatesWhenBooked = async () =>{
    const query = 'select distinct day from appuntamenti order by day asc'
    const result = await tryCcatch(query)
    return result
}


module.exports.getPassword = async () =>{
    const query = 'SELECT * from authdata'
    const result = await tryCcatch(query, null, true)
    return result
}




//GET AVAILABLE DAYS _ NO WEEKENDS
module.exports.getAvailableDays = async day => {
    const query = 'SELECT * FROM daysavailable WHERE day = ?'
    const result = await tryCcatch(query, day, true)
    return result
}
module.exports.getExams = async () => {
    const query = 'SELECT * FROM exams'
    const result = tryCcatch(query, true)
    return result
}
module.exports.getExamDuration = async (exam) => {
    const query = 'SELECT duration FROM subexams WHERE subexam = ?'
    const result = await tryCcatch(query, exam, true)
    return result
}
module.exports.getExamtype = async exam => {
    const query = 'select examID from subexams where subexam = ?'
    const result = await tryCcatch(query, exam, true)
    return result
}
module.exports.getSubexams = async doctor => {
    let query = 'SELECT subexam, duration FROM subexams join doctors where subexams.doctor = doctors.ID and doctors.ID = ?'
    if( !doctor ) query = 'SELECT subexam, duration, doctor FROM subexams join doctors where subexams.doctor = doctors.ID '
    const result = await tryCcatch(query, doctor)
    return result
}
module.exports.getAllSubexams = async doctor => {
    const query = 'SELECT subexam, duration FROM subexams join doctors where subexams.doctor = doctors.ID'
    const result = await tryCcatch(query, doctor)
    return result
}

module.exports.getProvinces = async () => {
    const query = 'SELECT * FROM province'
    const result = await tryCcatch(query)
    return result
}

module.exports.getValidExam = async (exam, doctorID, time) => {
    const query =
        'select count(*) as count from subexams ' +
        'join slots where subexams.doctor = slots.doctor and ' +
        'subexams.duration = slots.slotduration and ' +
        'subexams.subexam = ? and slots.doctor = ? and slots.slot = ?'
    const result = await tryCcatch(query, [exam, doctorID, time], true)
    return result
}

module.exports.deleteReservation = async reservationID =>{
    const query = 'DELETE FROM appuntamenti where ID = ?'
    const result = await tryCcatch(query, reservationID)
    return result

}


const tryCcatch = async (query, params, deeper) => {
    let result = null
    try {
        result = await db.query(query, params);
        
    }
    catch (error) {
        return ({ error: error.message })
    }
    if (deeper) return result[0][0]
    return result[0]
}



