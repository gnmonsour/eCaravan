const { testError, repopulateInput } = require("../../testError");
const layout = require('../../layout');
module.exports = ({nav, errors, req})=> {
return layout({contents: `
<div class="container">
    <div class="columns is-centered">
        <div class="column is-one-quarter">
            <form method="POST">
                <h1>Log In</h1>
                <div class="field>
                    <label class="label">Email</label>
                    <input required class="input" name="email" type="email" placeholder="Email" value=${repopulateInput(req, 'email')}>
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
                <p class="formBtn">
                    <button class="button is-primary">Log In</button>
                </p>
            </form>
        ${nav}
        </div>
    </div>
</div>
`, pageTitle: `Log In`})};