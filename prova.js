const db = require('./src/db/asyncDB')
const products = [
    { name: 'trouser', image: 'https://i.ibb.co/MNXZbxc/trouser-beige.jpg', image_low: 'https://i.ibb.co/x54Xyt1/trouser-beige.jpg', category: 3, price: 125, description: 'Stretched trouser 100% cotton' },
    { name: 'trouser', image: 'https://i.ibb.co/F73K1X1/trouser-blue.jpg', image_low: 'https://i.ibb.co/w6gRq7q/trouser-blue.jpg', category: 3, price: 125, description: 'Stretched trouser 100% cotton' },
    { name: 'trouser', image: 'https://i.ibb.co/qDYjHFq/trouser-green.png', image_low: 'https://i.ibb.co/JcjtYF6/trouser-green.png', category: 3, price: 125, description: 'Stretched trouser 100% cotton' },
    { name: 'trouser', image: 'https://i.ibb.co/xXmGHWz/trousers-black.jpg', image_low: 'https://i.ibb.co/ckbtL02/trousers-black.jpg', category: 3, price: 125, description: 'Stretched trouser 100% cotton' },
]
const insert = async () => {

    for (let i in products) {
        const result = await db.insertProduct(products[i])
        console.log(result)
    }
}
insert()