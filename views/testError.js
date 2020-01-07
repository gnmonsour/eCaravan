function testError(errors, key) {
	try {
		return `${errors.mapped()[key].msg}`;
	} catch (err) {
		return '';
	}
}

function repopulateInput(req, key) {
	try {
		const retVal = req ? `${req.body[key]}` : '';
		return retVal === 'NaN' ? '' : retVal;
	} catch (err) {
		return '';
	}
}
module.exports = { testError, repopulateInput };
