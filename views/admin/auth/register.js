module.exports = ({req}) => {
    return `<h2>Register</h2><div>
    <form method="POST">
    <input name="email" type="email" placeholder="Email">
    <input name="password" type="password" placeholder="Password">
    <input name="passwordConfirmation" type="password" placeholder="Confirm Password">
    <button>Sign Up</button>
    </form>
    </div>`;
};