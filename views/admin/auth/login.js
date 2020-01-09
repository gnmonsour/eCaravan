const { testError} = require("../../testError");
const layout = require('../../layout');
module.exports = ({ errors, formData, nav})=> {
    const formEmail = formData.email ? formData.email : "";
return layout({contents: `
<div class="container">
    <div class="columns is-centered">
        <div class="column is-one-half">
            <form method="POST">
                <h1>Log In</h1>
                <div class="field>
                    <label class="label">Email</label>
                    <input required class="input" name="email" type="email" placeholder="Email" value=${formEmail}>
                    <p class="help is-danger">
                    ${testError(errors, 'email')}
                    </p>
                </div>
                <div class="field>
                    <label class="label">Password</label>
                    <input required class="input"  name="password" type="password" placeholder="Password" >
                    <p class="help is-danger">
                        ${testError(errors, 'password')}
                    </p>
                </div>
                <div class="field is-grouped formBtn">
                    <div class="control">
                    <button class="button is-primary">Log In</button>
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
`, pageTitle: `Log In`})};