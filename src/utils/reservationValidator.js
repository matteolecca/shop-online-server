const regex = {
    time : /^(((([0-1][0-9])|(2[0-3])):?[0-5][0-9]:?[0-5][0-9]+$))/,
}

exports.validateReservation = (reservation) => {
    console.log(reservation)
    if(!reservation.exam || !reservation.user ) return false
    const date = new Date(reservation.exam.date)
    return regex.time.test(reservation.exam.time) && !isNaN(date) && date instanceof Date
}


