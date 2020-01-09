function testError(errors, key) {
	try {
		return `${errors.mapped()[key].msg}`;
	} catch (err) {
		return '';
	}
}

function repopulateInput(req, key) {
	try {
        // console.log('repopulate body', req.body[key]);
		const retVal = req.body[key] ? req.body[key] : '' ;
        // console.log('retVal',retVal);
        return retVal === 'NaN' ? '' : retVal;
	} catch (err) {
		return '';
	}
}
module.exports = { testError, repopulateInput };
