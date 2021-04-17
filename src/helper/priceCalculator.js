const dbAsync = require ('../db/asyncDB')
exports.calculatePrice = async  (items) => {
    let totalPrice = 0
    for (let i in items){
        const itemPrice = await dbAsync.calculatePrice(items[i].ID)
        totalPrice = totalPrice +  itemPrice.price 
    }
    return totalPrice
}

