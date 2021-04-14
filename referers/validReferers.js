const referers = [
    'https://ecografia-owner-app.herokuapp.com/', 
    'https://www.matteolecca.com/',
    'https://ecografia-app.herokuapp.com/',
    'http://localhost:3000/'
]

exports.validateReferer = (referer) =>{
    console.log(referers.includes(referer))
    return referers.includes(referer)
}