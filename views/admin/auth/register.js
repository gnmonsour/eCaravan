const { testError } = require("../../testError");

const layout = require('../../layout');

module.exports = ({errors, formData, nav}) => {
    const {email, password} = formData;
    const formEmail = email ? email : "";
    const formPassword = password ? password : "";
    const contents = 
    `
    <div class="container">
        <div class="columns is-centered">
<div class="column is-one-half">
    <form method="POST">
        <h1>Register</h1>
        <div class="field">
            <label class="label">Email</label>
            <input class="input" name="email" type="email" placeholder="Email" value=${formEmail}>
            <p class="help is-danger">
            ${testError(errors, 'email')}
            </p>
        </div>
        <div class="field">
            <label class="label">Password</label>
            <input class="input" name="password" type="password" placeholder="Password" value=${formPassword}>
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
        <div class="field is-grouped formBtn">
            <div class="control">
                <button class="button is-primary">Sign Up</button>
            </div>
            <div class="control">
                <a class="button is-light" href="/">Cancel</a>
            </div>
        </div>
    </form>
    ${nav}
</div>
        </div>
    </div>

 
   
    `;
    const pageTitle = `Register`;
    return layout({contents, pageTitle});
};