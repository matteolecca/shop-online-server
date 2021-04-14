const mesi = ['', 'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre']

exports.convertToItalianDate = date => {
    values = date.split('-')
    const year = values[0]
    const month = mesi[parseInt(values[1])]
    const day = values[2]
    return `${day ? day : null} ${month ? month : null} ${year}`
}