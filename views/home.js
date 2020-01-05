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

	const contents = `
	<div class="container">
		<div class="column is-centered">
			<div class="column is-one-half">
				<h1 class="title">Caravan Commerce</h1>
				${userDetail}
				<div>${nav}</div>
			</div>
		</div>
	</div>`;
	const pageTitle = `Caravan Commerce`;
	return layout({ contents, pageTitle });
};
