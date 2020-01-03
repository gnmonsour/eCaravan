const layout = require('./layout');
const usersRepo = require('../repositories/UsersRepository');

module.exports = async ({ req, nav }) => {
	let userDetail = ``;
	if (req.session.userId) {
		const user = await usersRepo.getOne(req.session.userId);
		if (user) {
			userDetail = `<div>${user.email}</div>`;
		}
	}

	const contents = `<h2>Caravan Commerce</h2>
    ${userDetail}
    <div>${nav}</div>`;
	const pageTitle = `Caravan Commerce`;
	return layout({ contents, pageTitle });
};
