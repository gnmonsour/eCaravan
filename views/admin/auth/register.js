const { testError, repopulateInput } = require("../../testError");

const layout = require('../../layout');

module.exports = ({nav, errors, req}) => {
    const contents = 
    `
    <div class="container">
        <div class="columns is-centered">
<div class="column is-one-quarter">
    <form method="POST">
        <h1>Register</h1>
        <div class="field">
            <label class="label">Email</label>
            <input class="input" name="email" type="email" placeholder="Email" value=${repopulateInput(req, 'email')}>
            <p class="help is-danger">
            ${testError(errors, 'email')}
            </p>
        </div>
        <div class="field">
            <label class="label">Password</label>
            <input class="input" name="password" type="password" placeholder="Password" value=${repopulateInput(req, 'password')}>
            <p class="help is-danger">
            ${testError(errors, 'password')}
            </p>
        </div>
        <div class="field">
            <label class="label">Confirm Password</label>
            <input class="input" name="passwordConfirmation" type="password" placeholder="Confirm Password">
            <p class="help is-danger">
            ${testError(errors, 'passwordConfirmation')}
            </p>
        </div>
        <p class="formBtn">
            <button class="button is-primary">Sign Up</button>
        </p>
    </form>
    ${nav}
</div>
        </div>
    </div>

 
   
    `;
    const pageTitle = `Register`;
    return layout({contents, pageTitle});
};