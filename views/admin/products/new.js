const { testError, repopulateInput } = require("../../testError");

const layout = require('../../layout');

module.exports = ({ errors, req }) => {
    return layout({ contents: `
    <div class="container">
    <div class="columns is-centered">
        <div class="column is-one-quarter">
            <form method="POST" enctype="multipart/form-data">
                <h1>New Product</h1>
                <div class="field">
                    <label class="label">Title</label>
                    <input class="input" name="title" type="text" value="${repopulateInput(req, 'title')}" placeholder="Product Title">
                    <p class="help is-danger">
                    ${testError(errors, 'title')}
                    </p>
                </div>
                <div class="field">
                    <label class="label">Price</label>
                    <input class="input" name="price" type="price" value="${repopulateInput(req, 'price')}" placeholder="Price">
                    <p class="help is-danger">
                    ${testError(errors, 'price')}
                    </p>
                </div>
                <div class="field">
                    <label class="label">Image</label>
                    <input class="input" name="image" type="file" placeholder="Upload Image">
                    <p class="help is-danger">
                    ${testError(errors, 'image')}
                    </p>
                </div>
            <button class="button is-primary">Create</button>
            </form>
        </div>
    </div>
</div>
    `, pageTitle: `New Product`})
}