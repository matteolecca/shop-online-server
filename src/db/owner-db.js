const db = require('../config/db-connect')
const moment = require('moment')

module.exports.insertArticolo = async (link, title, subtitle) =>{
    let query = 'INSERT INTO articoli (link, title, subtitle,date) values '
    query += '(?,?,?,?)'
    const date = moment(new Date()).format('YYYY-MM-DD')
    const result = await tryCcatch(query, [link, title,subtitle, date])
    return result
}


module.exports.getArticoli = async (link, title) =>{
    let query = 'SELECT * FROM articoli order by date DESC'
    const result = await tryCcatch(query)
    return result
}

module.exports.deleteArticolo = async ID =>{
    let query = 'DELETE  FROM articoli where ID = ?'
    const result = await tryCcatch(query, [ID])
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

