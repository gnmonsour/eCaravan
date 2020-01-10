const { testError, repopulateInput } = require("../../testError");

const layout = require('../layout');

module.exports = ({ errors, req }) => {
    const pageTitleHasErrors = !errors ? '' : " With Errors";
    return layout({ contents: `
    <div class="container">
    <div class="columns is-centered">
        <div class="column is-one-half">
        <h1>Create a Product</h1>
            <form method="POST" enctype="multipart/form-data">
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
                <div class="control">
                    <div class="file">
                        <label class="label">
                            <input  class="file-input" name="image" type="file">
                            <span class="file-cta">
                                <span class="file-icon">
                                    <i class="fas fa-upload"></i>
                                </span>
                                <span class="file-label">
                                    Upload an Image
                                </span>
                            </span>
                        </label>
                        <p class="help is-danger">
                        ${testError(errors, 'image')}
                        </p>
                    </div>
                    <div class="field is-grouped" >
                        <div class="control">
                            <button class="button is-primary">Create</button>
                        </div>
                        <div class="control">
                            <a class="button is-light" href="/admin/products">Cancel</a>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
    `, pageTitle: `New Product${pageTitleHasErrors}`})
}