const express = require('express');

const fs = require("fs")

var app = express()

var port = Number(process.env.PORT || 3000);

const cartDataPath = 'jsons/myCart.json';

var jsonProductsData = require('./jsons/products.json');

app.get('/', (req, res) => {

	res.send('<div align = "center">Yell India Rockzz</div>');
	
});

//LANDING PAGE DATA
app.get('/getLandingPageData/:userId', (req, res) => {

	var userId = req.params.userId;

	var resData = {

		new_arrivals : newArrivals,

		products : [],

		cartItemCount : 0
	}

	// console.log(Object.keys(jsonProductsData).length)

	// console.log(Object.keys(jsonProductsData))

	var productKeys = Object.keys(jsonProductsData)

	for (x in productKeys) {

		console.log(x, productKeys);

		resData.products.push(jsonProductsData[productKeys[x]]);

	}

	fs.readFile(cartDataPath, 'utf8', function (err, data) {

		resData.cartItemCount = (JSON.parse(data))[userId].length

		res.send(JSON.stringify(prepareResponseData(resData)))

	});
	
});

//Single product details

app.get('/product/details/:id', (req, res) => {

	var productId = req.params.id;

	console.log(jsonProductsData[productId])

	res.send(JSON.stringify(prepareResponseData(jsonProductsData[productId])));

});


//CART DETAILS OF A USER
app.get('/getCartDetails/:userId', (req, res) => {

  var id = req.params.userId;
  
  var cartData = []

  fs.readFile(cartDataPath, 'utf8', function (err, data) {
  	
  	if (err) throw err;
	
	var userCartProductIdArray = JSON.parse(data)[id];
	var cartdata = []
	var x;

	for (x in userCartProductIdArray) {
		
		item = jsonProductsData[userCartProductIdArray[x]]
		
		var resData = {
			id : item.id,
			name : item.name,
			image_url : item.image_url1,
			quantity : 1,
			tax: item.tax,
			price : item.price
		}

		cartData.push(resData);

		// console.log(resData)
		// cartData.push(jsonProductsData[userCartProductIdArray[x]]);

	}

	res.send(JSON.stringify(prepareResponseData(cartData)));

  });

});

//CLEAR CART
app.get('/clearCart/:userId', (req, res) => {

	var userId = req.params.userId;

	console.log("req received")
	
	fs.readFile(cartDataPath, 'utf8', (err, data) => {

		data = JSON.parse(data);
		
		cartProductsId = data[userId];

		data[userId]  = [];

		console.log(data);

		var response = {
		
		message : "success"
		
		}
		
		fs.writeFile(cartDataPath, JSON.stringify(data), function (err) {
			  
			  if (err) return console.log(err);
			  			  
			  console.log('writing to ' + cartDataPath);

	  		res.send(JSON.stringify(prepareResponseData(response)));

		});



	})

});

//INSERT ITEM INTO CART
app.get('/insertItemIntoCart/:userId/:productId', (req, res) => {
	
	var userId = req.params.userId;
	
	var productId = Number(req.params.productId);

	fs.readFile(cartDataPath, 'utf8', (err, data) => {

		data = JSON.parse(data);
		
		cartProductsId = data[userId];

		cartProductsId.push(productId);

		data[userId]  = cartProductsId;
		
		
		var response = {
		
		message : "success"
		
		}

		fs.writeFile(cartDataPath, JSON.stringify(data), function (err) {
			  
			  if (err) return console.log(err);
			  			  
			  console.log('writing to ' + cartDataPath);
		});

		res.send(JSON.stringify(prepareResponseData(response)));
	})

});

app.get('/getImage/product/:productId/:imageNo', (req, res) => {

  var productId = req.params.productId

  var imageNo = req.params.imageNo

  console.log(productId, imageNo)
   
  res.sendFile(__dirname + '/images/products/' + productId + '/' + imageNo + '.png');

});

app.get('/img/new_arrivals/:id', (req, res) => {

  var id = req.params.id;

  res.sendFile(__dirname + '/images/new_arrivals/' + id +'.png')

});

var newArrivals = [
      {
        "new_arrival_imageurl": "http://localhost:3000/img/new_arrivals/1",
        "id" : 1
      },
      {
        "new_arrival_imageurl": "http://localhost:3000/img/new_arrivals/2",
        "id" : 2
      },
      {
        "new_arrival_imageurl": "http://localhost:3000/img/new_arrivals/3",
        "id" : 3
      }
    ]

function prepareResponseData (data){
	
	var response = {

		status : true,
		
		data : data,
		
		error_message : ""
	}
	
	return response
}



app.listen(port, () => {

  console.log("listen on 3000");

});
