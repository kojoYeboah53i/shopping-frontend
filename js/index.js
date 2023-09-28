// localStorage.removeItem('customer_token')
// localStorage.removeItem('customer_id')

window.addEventListener('load', async () => {

//get all products
const products = await fetch(`http://localhost:9222/shop/v1/products`);
console.log('products')
let productItem = await products.json();
console.log(productItem)

const productWrapper = document.querySelector('.product-wrapper')

const productList = document.createElement('div');
productList.classList.add('product-container');

  let market = '';
  productItem.forEach(product => {
    market += `
    <div class="product" id=${product.id}>
    <img src=${product.image} alt="Product 2">
    <h2>${product.name}</h2>
    <p>${product.description}</p>
    <p class="price">${product.price}</p>
    <button class="add-to-cart" id=${product.id}>Add to Cart</button>
    </div>
    `;
})


productList.innerHTML = market;
productWrapper.appendChild(productList)

//add to cart or create new order
const addToCartBtn = document.querySelectorAll('.add-to-cart');
addToCartBtn.forEach(btn => {

btn.addEventListener('click', async (e) => {
        e.preventDefault();
        //code 
        let product_id = btn.id;
        // console.log('product id')
        console.log(product_id)
        console.log("customer_id")


        let customerId = localStorage.getItem('customer_id');

        //if customer id is not found then create it
        if(customerId == null || customerId == ''){
            createNewCustomerId();
            return;
        }

        let customer_id = localStorage.getItem('customer_id');

        console.log(customer_id)


        console.log('product price')
        let mainEL = e.target.parentElement;
        const price = mainEL.querySelector('p.price')
        const priceVal = price.innerHTML;
        // console.log(priceVal)


        alert('attempting to add new item to shopping cart' + product_id)
   

        const newOrder = fetch('http://localhost:9222/shop/v1/order', {
            method: 'POST',
            headers: {
                "content-type" : "application/json "
            },
            body: JSON.stringify({
                product_id: +product_id, //Number(product_id)
                customer_id: +customer_id,
                price: +priceVal //Number(priceVal)
            })

        }) 
        if(newOrder.status == 409){
            alert("this product has already been added to cart")
            return;
        }
        if(newOrder.status == 200){
            let res = newOrder.json();
            console.log(res)
      
        }
    })
})


});

//self invoking function 
const createNewCustomerId = async () => {
    

//get customer token
let customer_token = localStorage.getItem('customer_token');

if (customer_token == null || customer_token == ''){
    customer_token = Math.random() +  new Date().toLocaleDateString()
    console.log("customer token")

    console.log(customer_token)
    //create new customer

const url = 'http://localhost:9222/shop/v1/customer';
 const result = await fetch(url, {
    method: 'POST',
    headers: {
        "content-type" : "application/json"
    },
    body: JSON.stringify({
        name: "Jane Doe",
        city: "Random city",
        token: customer_token
    })
 })

  if(result.status == 200){
    localStorage.setItem('customer_token', customer_token)
  }

}
console.log('customer already created')
}

createNewCustomerId();

const cartNumber = async () => {
console.log("getting cart items list")
let customerToken = localStorage.getItem('customer_token')

//if customer is not in localstorage then, store again
if(customerToken == null || customerToken == ''){
    createNewCustomerId();
}


console.log("attempting to send customer token")
console.log(customerToken)

//get cart items number

  const result =  await  fetch('http://localhost:9222/shop/v1/customer-with-token',{
    method: 'POST',
    headers: {
                "content-type" : "application/json"
            },
            body: JSON.stringify({
                token : customerToken
            })
  })
  if(result.status == 200){
    let response = await result.json();
    // console.log(response)
    // console.log("response id")
    const id = response[0].id;
    // console.log(id) 

    //store customer id in localstorage
   let customer_id = localStorage.getItem('customer_id');

   if(customer_id == null || customer_id == ''){
    localStorage.setItem('customer_id', id);
   }
 
    //get orders with customer id 

    const rs = await fetch('http://localhost:9222/shop/v1/orders-with-customerId', {
        method: 'POST',
        headers: {
            "content-type" : "application/json"
        },
        body: JSON.stringify({
            customer_id : id
        })

     });

    if(rs.status == 200){
        let orderArray = await rs.json();
        console.log(orders)

        //deconstruct order from array
        const {order } = orderArray;
        const orderCount = order.reduce((count, items)=> {
            return count + 1;
        }, 0)

        console.log(orderCount)
        
        const cList = document.querySelector('.cart-number')
        cList.innerHTML = orderCount;
    }


  }
    

}

// setInterval(() => {
    

cartNumber();

// }, 2000);