module.exports = ({req})=> {
return `<h2>Log In</h2><div>
<form method="POST">
<input name="email" type="email" placeholder="Email">
<input name="password" type="password" placeholder="Password">
<button>Log In</button>
</form>
<p><a href="/">Home</a></p>
</div>`;};