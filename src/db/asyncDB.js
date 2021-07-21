const db = require('../config/db-connect')
const { v4: uuidv4 } = require('uuid');
const bcrypt = require ('bcrypt')


/*****************PRODUCTS***********************************/
exports.getProducts = async type => {
    const query = 'select products.ID as ID, name, price, image, description, color, categories.category as category from products join categories where categories.ID = products.category order by category;'
    let result = await tryCcatch(query)
    return result
}
exports.getCategories = async () =>{
    const query = "select category from categories"
    const result = await tryCcatch(query)
    if(result.error)return result
    const categories = result.map(c=>c.category)
    return categories
}

exports.insertProduct = async (product) =>{
    let query = 'insert into products (name, category, price, image,image_low, description ) values (?,?,?,?,?,?)'
    const params = [product.name, product.category, product.price, product.image,product.image_low, product.description]
    const result = await tryCcatch(query, params)
    return result
}

/*****************USERS***********************************/

exports.createUser = async order =>{
    let query = "INSERT INTO USERS (name, surname, email) "
    query += 'VALUES (?,?,?)'
    const result = await tryCcatch(query, [order.name, order.surname, order.email])
    return result
}

exports.insertAddress = async order =>{
    let query = "INSERT INTO addresses (address, postcode, city) "
    query += 'VALUES (?,?,?)'
    const result = await tryCcatch(query, [order.address, order.postcode, order.city])
    return result
}
exports.getAddress = async  address =>{
    const query = 'SELECT ID as insertId FROM addresses WHERE address = ? and city = ? and postcode = ?'
    const result = await tryCcatch(query, [address.address, address.city, address.postcode], true)
    console.log(result)
    return result
}
exports.getUserByEmail = async  email =>{
    const query = 'SELECT ID as insertId FROM users WHERE email = ?'
    const result = await tryCcatch(query, email, true)
    console.log(result)
    return result
}

exports.getUser = async userID =>{
    const query = "select * from users where ID = ?"
    let customer = await tryCcatch(query, userID, true)
    return customer
}

/******************************ORDER*****************************/
exports.insertOrder = async (userID, addressID, total) =>{
    let query = 'INSERT INTO orders (ID, user, address, total) '
    query += 'values (?,?,?,?)'
    const ID = uuidv4()
    const result = await tryCcatch(query, [ID,userID, addressID, total])
    if(result.error)return result
    return {insertId : ID}
}
exports.insertOrderedProducts = async (orderID, products) =>{
    let query = 'INSERT INTO orderedproducts (orderID, productID,quantity, size) values ?'
    let productsQuery = products.map(product =>{
       return [orderID,product.ID, product.quantity, product.size]
    })
    const result = await tryCcatch(query, [productsQuery])
    console.log(result)
    return result
}

exports.getOrder = async orderID => {
    const query = "select * from orders where ID = ?"
    const order = await tryCcatch(query, orderID, true)
    return order
}

exports.getOrderedProducts = async orderID => {
    const query = "select name, products.ID as ID, color, size, quantity, price from orderedproducts join products where orderedproducts.productID = products.ID and orderID = ?"
    let itemsOrdered = await tryCcatch(query, orderID,)
    return itemsOrdered
}

exports.getAddressData = async addressID =>{
    console.log(addressID)
    const query = "SELECT * FROM addresses where ID = ?"
    let result = await tryCcatch(query, addressID, true)
    return result
}

// exports.getCustomer = async customerID =>{
//     const query = "select * from customers where ID = ?"
//     let customer = await tryCcatch(query, customerID, true)
//     return customer
// }

// exports.calculatePrice = async itemID =>{
//     const query  = 'select price from products where ID = ?'
//     const price = await tryCcatch(query, itemID, true)
//     return price
// }

// exports.insertOrder = async (customerID, total) =>{
//     let query = 'INSERT INTO ORDERS (ID, date, total,  customer) '
//     query += 'VALUES (?,?,?,?)'
//     const ID = uuidv4()
//     const result = await tryCcatch(query, [ID,new Date(), total, customerID])
//     if(!result.error) result.insertId = ID
//     return result
// }
// exports.createAddress = () =>{
//     let query = 'INSERT INTO addresses ( street, postcode, number, user )'
//     query += 'VALUES (?,?,?,?)'


// }
// exports.isertOrderCustomer = async customer =>{
//     let query = 'INSERT INTO customers ( email, name, surname, address, city, postcode) '
//     query += 'VALUES (?,?,?,?,?,?)'
//     const result = await tryCcatch(query, [customer.email, customer.name, customer.surname, customer.address, customer.city, customer.postcode])
//     return result
// }

// exports.insertOrderItems = async (products,orderID) =>{
//     let query = 'INSERT INTO orderedproducts (orderID, productID,quantity, size) values ?'
//     let productsQuery = products.map(product =>{
//        return [orderID,product.ID, product.quantity, product.size]
//     })
//     const result = await tryCcatch(query, [productsQuery])
//     return result
// }

// exports.deleteOrder = async (orderID) =>{
//     let query = 'DELETE FROM orders where ID = ?'
//     const result = await tryCcatch(query, orderID)
//     if(!result.error) console.log(result)
//     return result
// }

// exports.insertAddress = async (address, userID) =>{
//     let addressCopy = {...address}
//     let query = 'INSERT INTO orderaddress (streetName, postcode, city, prov, name, userID)'
//     query += 'VALUES (?,?,?,?,?,?)'
//     const result = await tryCcatch(query, [address.streetName, address.postcode, address.city, address.prov, address.name,userID])
//     if(!result.error){
//         addressCopy.ID = result.insertId
//         return addressCopy
//     }
//     return result
// }
// exports.findAddress = async address => {
//     const query = "SELECT * FROM orderAddress where streetname = ? and postcode = ?"
//     const params = [address.streetName, address.postcode]
//     const order = await tryCcatch(query, params, true)
//     return order
// }
// exports.findAddressByID = async addressID => {
//     const query = "SELECT * FROM orderAddress where ID = ?"
//     const order = await tryCcatch(query, addressID, true)
//     return order
// }

// exports.getUser = async userID =>{
//     const query = 'SELECT * FROM shopusers where ID = ?'
//     const result = await tryCcatch(query,userID, true)
//     return result
// }

// exports.getUserByEmail = async userEmail =>{
//     const query = 'SELECT * FROM shopusers where email = ?'
//     const result = await tryCcatch(query,userEmail, true)
//     return result
// }

// exports.createUser = async user =>{
//     let query = 'INSERT INTO shopusers (name,email,telephone,password) values'
//     query += '(?,?,?,?)'
//     const params = [user.name, user.email, user.telephone, user.password]
//     const result = await tryCcatch(query,params)
//     return result
// }

// exports.resetPassword = async (password, ID) =>{
//     let query = 'UPDATE shopusers SET password = ? where ID = ?;'
//     const hashPwd = await bcrypt.hash(password, 8)
//     const params = [hashPwd,ID]
//     const result = await tryCcatch(query,params)
//     return result
// }


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
