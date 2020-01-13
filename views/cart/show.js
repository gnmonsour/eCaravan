const layout = require('../layout');
module.exports = ({ cart, products, grandTotal }) => {
  const productList = products
    .map(product => {
        return `
        <div class="cart-item message">
          <h3 class="subtitle">${product.title}</h3>
          <div class="cart-right">
              <div>${product.quantity} @ $${product.price} = </div>
              <div class="price is-size-4">
              ${product.total}</div>
              <div class="remove">
                <form method="POST" action="/cart/products/remove">
                  <input hidden value="${product.id}" name="productId" >
                  <button class="button is-danger">
                    <span class="icon is-small">
                      <i class="fas fa-times"></i>
                    </span>
                  </button>
                </form>
              </div>
            </div>
        </div>
      `;
    })
    .join('\n');

  return layout({
    contents: `

        <div id="cart" class="container">
          <div class="columns">
            <div class="column "></div>
            <div class="column is-four-fifths">
              <div>
                <h3 class="subtitle"><b>Items in Cart</b></h3>
                <p>Cart identity: ${cart.id}</p>
                <div>
                  ${productList}  
                </div>
                <div class="total message is-info">
                  <div class="message-header">
                  Total
                  </div>
                  <h1 class="title">$${grandTotal}</h1>
                  <button class="button is-primary">Buy</button> 
                </div>
              </div>
            </div>
            <div class="column "></div>
          </div>
        </div>

    `
  });
};
