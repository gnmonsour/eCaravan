const layout = require('../layout');
// strings to handle inventory state
const availableElement = (productId) => `
<footer class="card-footer">
  <form action="/cart/products" method="POST">
  <input hidden value="${productId}" name="productId" >  
  <button class="button has-icon is-inverted">
    <i class="fa fa-shopping-cart"></i> Add to cart
  </button>
  </form>
</footer>
`;
// match css to cart button & icon
const unAvailableElement = `
<footer class="card-footer">
  <div class="no-stock has-icon is-inverted button"> 
    <i class="fa fa-cloud"></i> Unavailable
  </div>
</footer>
`
module.exports = ({ products, count }) => {
  const productList = products
    .map(product => {
      const showCart = product.inventory > 0 ? availableElement(product.id) : unAvailableElement;
      return `
        <div class="column is-one-quarter">
          <div class="card product-card">
            <figure>
              <img src="data:image/png;base64, ${product.image}"/>
            </figure>
            <div class="card-content">
              <h3 class="subtitle">${product.title}</h3>
              <h5>$${product.price}</h5>
            </div>
            ${showCart}
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
                <h2 class="title text-center">Featured Items</h2>
                <div class="columns products">
                  ${productList}  
                </div>
              </div>
            </div>
            <div class="column "></div>
          </div>
        </div>
      </section>
    `, count
  });
};
