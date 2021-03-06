const layout = require('../layout');

module.exports = ({ products }) => {
    const productList = products.map((product) => {
        return `
        <tr>
        <td>${product.inventory}</td>
        <td>${product.title}</td>
        <td>${product.price}</td>
        <td>
            <a href="/admin/products/${product.id}/edit">
                <button class="button is-link">
                Edit
                </button>
          </a>
        </td>
        <td>
            <form method="POST" action="/admin/products/${product.id}/delete">
                <button class="button is-danger is-link" >Delete</button>
            </form>
        </td>
      </tr>`
    }).join('');

	return layout({
		contents: `
        <div class="control">
            <h1 class="title">Products List</h1>
            <a href="/admin/products/new" class="button is-primary">Create Product</a>
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th>Inventory</th>
                    <th>Title</th>
                    <th>Price</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                ${productList}
            </tbody>
        </table>
        `, pageTitle: "Products List"
	});
};
