const { check } = require('express-validator');
const usersRepo = require('../../repositories/UsersRepository');

const emailError = `Valid email required`;
const emailDuplicateError = `Email already in use!`;
const passwordError = `Password error! Requires 4-20 characters.`;
const confirmationError = `Password confirmation error!`;
const emailLoginError = `User (email) not found!`;
const loginPasswordError = `Password error! Login password is invalid.`;

// Found that the custom validation need to return true
// otherwise an error is raised.

module.exports = {
	requireEmail: check('email').trim().normalizeEmail().isEmail().withMessage(emailError).custom(async (email) => {
		const isExistingUser = await usersRepo.getFirst({ email });
		if (isExistingUser) {
			throw new Error(emailDuplicateError);
		}
		return true;
	}),
	requirePassword: check('password').trim().isLength({ min: 4, max: 20 }).withMessage(passwordError),
	requireLoginEmail: check('email')
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage(emailError)
		.custom(async (email) => {
			const isExistingUser = await usersRepo.getFirst({ email });
			if (!isExistingUser) {
				throw new Error(emailLoginError);
			}
			return true;
		}),
    requireLoginPassword: check('password')
        .trim()
        .custom(async(password, {req}) => {
            const candidate = await usersRepo.getFirst({ email: req.body.email });
            if( !candidate) {
                throw new Error(loginPasswordError);
            }
            const isValidPassword = await usersRepo.validatedPassword(password, candidate.password);
			if (!isValidPassword) {
				throw new Error(loginPasswordError);
            }
            return true;
    }),
	requirePasswordConfirmation: check('passwordConfirmation')
		.isLength({ min: 4, max: 20 })
		.withMessage(passwordError)
		.custom((passwordConfirmation, { req }) => {
			if (passwordConfirmation !== req.body.password) {
				throw new Error(confirmationError);
			}
			return true;
		})
};
