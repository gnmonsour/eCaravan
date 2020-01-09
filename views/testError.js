module.exports = {
	testError(errors, key) {
		try {
			return `${errors.mapped()[key].msg}`;
		} catch (err) {
			return '';
		}
	}
};
