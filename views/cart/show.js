const layout = require('../layout');
module.exports = ({ cart, products }) => {
  const productList = products
    .map(product => {
        return `
        <div class="column is-one-quarter">
          <div class="card product-card">
            <figure>
              <img src="data:image/png;base64, ${product.image}"/>
            </figure>
            <div class="card-content">
              <h3 class="subtitle">${product.title}</h3>
              <h5>${product.quantity} @ $${product.price}</h5>
              <h4>Total 
              ${product.total}</h4>
            </div>
          </div>
        </div>
      `;
    })
    .join('\n');

  return layout({
    contents: `
      <section class="banner">
        <div class="container">
          <div class="columns is-centered">
            <img src="/images/banner.jpg" />
          </div>
        </div>
      </section>
      
      <section>
        <div class="container">
          <div class="columns">
            <div class="column "></div>
            <div class="column is-four-fifths">
              <div>
                <h2 class="title text-center">Items in Cart</h2>
                <p>Cart identity: ${cart.id}</p>
                <div class="columns products">
                  ${productList}  
                </div>
              </div>
            </div>
            <div class="column "></div>
          </div>
        </div>
      </section>
    `
  });
};
