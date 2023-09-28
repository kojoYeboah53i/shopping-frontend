

window.addEventListener('load', async () => {

    //fetch all cart items for this customer
    let customerId = localStorage.getItem('customer_id')
    console.log("customer id")
    console.log(customerId)

    if(customerId > 0){

     

        // fetch all orders
        let rs = await fetch('http://localhost:9222/shop/v1/orderWithCustomerId',{
            method:  'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({customer_id : customerId})
        })
        if(rs.status == 200){
            
            const cartContainer = document.querySelector('.cart-container');
            let product = document.createElement('div');
            product.classList.add('product')
            
            const orders = await rs.json()
            console.log(orders)

            // const { products } = orders;
            
            // console.log(products)
           
            let item = '';
            //create item list
            orders.forEach( order => {

            item += `
            <div class="item">
            <div>
            <span>
                <img src="${order.products.image}" alt="" srcset="">
            </span>
            <span class="details">
                <p class="name"><h1>${order.products.name}</h1></p>
                <p class="price"><h3> ${order.products.price} </h3></p>

            </span>
            </div>

            <div class="action">
                <div class="top">
                    <span class="material-icons-sharp id=${order.id}">delete</span>

                </div>
        </div>
       

    </div>

            `
        })

        product.innerHTML = item;
        cartContainer.appendChild(product);
        }





    }

})