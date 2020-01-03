const layout = require('../../layout');
module.exports = ({req, nav})=> {
return layout({contents: `<h2>Log In</h2>
<div>
    <form method="POST">
        <input name="email" type="email" placeholder="Email">
        <input name="password" type="password" placeholder="Password">
        <button>Log In</button>
    </form>
</div>
${nav}`, pageTitle: `Log In`})};