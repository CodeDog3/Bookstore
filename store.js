//////////////////////////DOM Variables////////////////////////
const productsDOM = document.querySelector('.products-center');


const searchBar = document.getElementById('searchBar');
const searchIcon = document.getElementById('magnify');
const cart = document.getElementById("cart");
const closeCart = document.querySelector('.fa-chevron-left');
const openCart = document.querySelector('.cart-btn');

const cartContent = document.getElementById("cart-row");
const cartTotal = document.querySelector(".cart-total");
const cartTotal2 = document.querySelector(".cart-total2");
const cartItems = document.querySelector('.cart-items');

const checkout = document.querySelector('.submit-button');
const checkoutWindow = document.querySelector('.payment');
const closeCheckout = document.querySelector('.fa-circle-xmark');
const closeUser = document.querySelector('.fa-xmark');
const userIcon = document.querySelector('.fa-user');
const userPage = document.querySelector('.user-page');

const price = document.getElementById("pricing");
const books = document.getElementById("books");
const clearCart = document.getElementById("clearing-cart");

let cartProducts = [];

//////////////////////////Functions////////////////////////

    async function  getProducts(){
        try {
            let result = await fetch('/products');
            
            let data = await result.json();
            
            let products = data.items;
           
            products = products.map(item =>{
                const {title, price} = item.fields;
                const {id} = item.sys;
                const image =item.fields.image.fields.file.url;
                return {title, price, id, image}
            })
            
            return products;
        } catch (error) {
            console.log(error);
        }
    };

    function displayMain(){
        while(productsDOM.firstChild){
            productsDOM.removeChild(productsDOM.firstChild);
          }

       let products = JSON.parse(localStorage.getItem('products'));
       products.forEach(item =>{
           const article = document.createElement('article'); 
           article.classList.add('product');   
           article.innerHTML = `
           <div class="img-container">
           <img src=${item.image} alt="" class="product-img" height=400>
           <button class="bag-btn" data-id=${item.id}>
               <i class="fas fa-shopping-cart"></i>
               Add to Cart
           </button>
           </div>
           <h3>${item.title}</h3>
           <h4>$${item.price}</h4>`;
           productsDOM.appendChild(article);

       });
       
   };

//////////////////////////Static helpers////////////////////////
class Storage{ 
    
    static saveCart(cartItems){
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }
    static getStorageCart(){ 
        return JSON.parse(localStorage.getItem('cart'));
        
    }
    ////
    static saveProducts(products){
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id){ 
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find( product=> product.id === id);
    }

    static getStorageProducts(){ 
        return JSON.parse(localStorage.getItem('products'));
        
    }
    
};
///////////////////////Listners/////////////////////////////////

//Start up
document.addEventListener("DOMContentLoaded", ()=>{ 
    getProducts().then(products => Storage.saveProducts(products));  
    if (cartProducts.length === 0){
    cartProducts = Storage.getStorageCart() ?? []; 
    }
    
    displayMain();
    
    cartProducts.forEach(item => addCartItem(item));
    setCartValues();
    displayProductButtons();
    cartLogic();
    
});

// open and close cart
closeCart.addEventListener("click", () => cart.style.visibility = "hidden");
openCart.addEventListener("click", () =>  cart.style.visibility = "visible" );

checkout.addEventListener("click", () => {
  if(Storage.getStorageCart()){
    checkoutWindow.style.visibility ="visible";
    price.value = cartTotal2.innerHTML;
    console.log(JSON.parse(localStorage.getItem('cart')).map(x => x.title).join(","));
    books.value = Storage.getStorageCart().map(x => x.title).join(",");
  }
})

closeCheckout.addEventListener("click", () => checkoutWindow.style.visibility ="hidden");
closeUser.addEventListener("click", () => userPage.style.visibility ="hidden");
userIcon.addEventListener("click", () => userPage.style.visibility ="visible");
clearCart.addEventListener("click", () => localStorage.removeItem("cart"));



//enter key
searchBar.addEventListener("keyup", (e)=>{
    if (e.key === "Enter" ){
        e.preventDefault();
        var searchString = e.target.value;
        searchString = searchString.toLowerCase();
        
        let filtered = Storage.getStorageProducts().filter(item =>{
            return item.title.toLowerCase().includes(searchString);
        })

        if (filtered.length === 0){
            filtered = Storage.getStorageProducts().filter(item =>{
                return parseFloat(item.price) <= parseFloat(searchString)
            })
    }
        
        localStorage.removeItem("products");
        Storage.saveProducts(filtered);
        displayMain();
        getProducts().then(products => Storage.saveProducts(products));   
        displayProductButtons();
        
} 
})

//clicked search icon
searchIcon.addEventListener("click", (e)=>{
    
        e.preventDefault();
        var searchString = searchBar.value;
        console.log(typeof(searchString))
        let filtered = Storage.getStorageProducts().filter(item =>{
            return item.title.toLowerCase().includes(searchString);
        })

        if (filtered.length === 0){
            filtered = Storage.getStorageProducts().filter(item =>{
                return parseFloat(item.price) <= parseFloat(searchString)
            })
        }
        
        localStorage.removeItem("products");
        Storage.saveProducts(filtered);
        displayMain();
        getProducts().then(products => Storage.saveProducts(products));   
        displayProductButtons();
        
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        function displayProductButtons(){
            const btns = document.querySelectorAll('.bag-btn');
        
            btns.forEach(element =>{  //element is a variable for EACH BUTTON
 
                let id = element.dataset.id;
                let inCart = cartProducts.find(item => item.id === id);
            
                if(inCart){
                element.innerText ="In Cart";
                element.disabled = true;
                }

            element.addEventListener('click', (event)=>{
                event.target.innerText = "In Cart";
                event.target.disabled = true;
                let cartItem = {...Storage.getProduct(id), amount: 1};   
                cartProducts = [...cartProducts, cartItem]; //...cart means everything we had in cart
                Storage.saveCart(cartProducts);
                setCartValues(cartProducts);
                addCartItem(cartItem)
                })
            })
        }
    
    
  

  function addCartItem(item){
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
                   <img src=${item.image}>
                   <div>
                   <h4>${item.title}</h4>
                   <h5>$${item.price}</h5> 
                   <span class="remove-item" data-id =${item.id}>remove</span>
                   </div>
                   <div>
                   <i class="fas fa-chevron-up" data-id =${item.id}></i>
                   <p class="item-amount">${item.amount}</p>
                   <i class="fas fa-chevron-down" data-id =${item.id}></i>
                   </div>
    `;
    cartContent.appendChild(div);
  }

  function setCartValues(){
    let tempTotal = 0;
    let itemsTotal = 0;
    cartProducts.forEach(item =>{
      tempTotal += item.price* item.amount;
      itemsTotal += item.amount;
    })
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartTotal2.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }

  ////////////////////////

   function cartLogic(){
    // const btns = document.querySelectorAll('.bag-btn');
    // clearCartBtn.addEventListener('click', ()=>{
    //   cartProducts = [];
    //   Storage.saveCart(cartProducts);
    //   setCartValues(cartProducts);
    //   btns.forEach(element =>{
    //     element.innerHTML = `<i class="fas fa-shopping-cart"></i>
    //           Add to Cart`;
    //     element.disabled = false;
    //   });
    //   while(cartContent.children.length > 0){
    //     cartContent.removeChild(cartContent.children[0]);
    //   }
    // });
    cartContent.addEventListener('click', (event)=>{
      if(event.target.classList.contains('remove-item')){
        let removedItem = event.target;
        let id = removedItem.dataset.id;
        removeItem(id);
        cartContent.removeChild(removedItem.parentElement.parentElement);
      }
      if(event.target.classList.contains('fa-chevron-up')){
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let tempItem = cartProducts.find(item => item.id === id);
        tempItem.amount ++;
        Storage.saveCart(cartProducts);
        setCartValues(cartProducts);
        addAmount.nextElementSibling.innerText = tempItem.amount;
      }

      if(event.target.classList.contains('fa-chevron-down')){
        let subAmount = event.target;
        let id = subAmount.dataset.id;
        let tempItem = cartProducts.find(item => item.id === id);
        tempItem.amount --;
        if(tempItem.amount > 0){
         Storage.saveCart(cartProducts);
          this.setCartValues(cartProducts);
          subAmount.previousElementSibling.innerText = tempItem.amount;
        }else{
          cartContent.removeChild(subAmount.parentElement.parentElement);
          removeItem(id);
        }
      }
    

    });
  }

  function removeItem(id){
    cartProducts = cartProducts.filter(item => item.id !== id);
    setCartValues(cartProducts);
    Storage.saveCart(cartProducts);
    let button = getSingleBtn(id);
    if(button){
        button.disabled = false;
        button.innerHTML =`<i class="fas fa-shopping-cart"></i>
                Add to Cart`;
    }
  }

  function getSingleBtn(id){
    const btns = document.querySelectorAll('.bag-btn');
    let button;
    btns.forEach(element =>{
      if(element.dataset.id === id){
        button = element;
      }
    });
    return button;
  }

