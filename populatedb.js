const products = [
    {name : "hoodie", category : "2", price : 40.5, image : "//cdn.shopify.com/s/files/1/0323/5826/8972/products/MONO-CHROME-BLack_5721305f-401b-47f8-92cd-06a67e1a7c47_1000x.progressive.jpg?v=1595324434", description : "The Monochrome Hood", color : "black"},
    {name : "The 24 trouser", category : "3", price : 120.5 , image : "//cdn.shopify.com/s/files/1/0323/5826/8972/products/24T___Navy_1000x.progressive.jpg?v=1595323118", description : "The 24 trouser, stretch cotton 60z", color : "navy"},
    {name : "The 24 trouser", category : "3", price : 120.5 , image : "//cdn.shopify.com/s/files/1/0323/5826/8972/products/24T___Navy_1000x.progressive.jpg?v=1595323118", description : "The 24 trouser, stretch cotton 60z", color : "black"},
    {name : "The 24 trouser", category : "3", price : 120.5 , image : "//cdn.shopify.com/s/files/1/0323/5826/8972/products/24T_Sage_1000x.progressive.jpg?v=1595325657", description : "The 24 trouser, stretch cotton 60z", color : "beige"},
    {name : "The 24 trouser", category : "3", price : 120.5 , image : "//cdn.shopify.com/s/files/1/0323/5826/8972/products/24T___Beige_1000x.progressive.jpg?v=1595323788", description : "The 24 trouser, stretch cotton 60z", color : "green"},
    {name : "t-shirt", category : "0", price : 45.5 , image : "//cdn.shopify.com/s/files/1/0323/5826/8972/products/TT-_-black_db8b6018-2ce9-41f7-b75b-10b23edcce41_1000x.progressive.jpg?v=1595324008", description : "T-shirt customized", color : "black"},
    {name : "t-shirt", category : "0", price : 45.5 , image : "//cdn.shopify.com/s/files/1/0323/5826/8972/products/TT_Sage_1000x.progressive.jpg?v=1610551946", description : "T-shirt customized", color : "beige"},
    {name : "t-shirt", category : "0", price : 45.5 , image : "//cdn.shopify.com/s/files/1/0323/5826/8972/products/TT-White-NEW-2-800x1035_1000x.progressive.jpg?v=1595322323", description : "T-shirt customized", color : "white"},
    {name : "shirt", category : "1", price : 80.5 , image : "//cdn.shopify.com/s/files/1/0323/5826/8972/products/ADSO_LightBlue_1000x.progressive.jpg?v=1595325244", description : "The all day Oxford shirt", color : "light blue"},
    {name : "shirt", category : "1", price : 80.5 , image : "//cdn.shopify.com/s/files/1/0323/5826/8972/products/ADSO_White_1000x.progressive.jpg?v=1595325267", description : "The all day Oxford shirt", color : "white"},

]

const dbAsync = require ('./src/db/asyncDB')

products.forEach(async element => {
    console.log(await dbAsync.insertProduct(element))
});

//cdn.shopify.com/s/files/1/0323/5826/8972/products/24T_Sage_1000x.progressive.jpg?v=1595325657


// dbAsync.insertProduct(products[0])

