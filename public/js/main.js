const updateCartBadge = () => {
	const counter = document.querySelector('#cartCount');
	const styleSheetRef = document.styleSheets[2];
	let cartRule;

	for (let i = 0; i < styleSheetRef.cssRules.length; i++) {
		if (styleSheetRef.cssRules[i].selectorText == 'body') {
            cartRule = styleSheetRef.cssRules[i];
            break;
		}
	}
	let count = +counter.textContent;
	if (count && count > 0) {
		// console.log(cartRule);
		cartRule.style.setProperty('--cart-badge-content', `"${count}"` );
		// console.log('cartContent', cartRule.style.getPropertyValue('--cart-badge-content'));
		cartRule.style.setProperty('--cart-badge-visibility', 'visible');
		// console.log('cartContent', cartRule.style.getPropertyValue('--cart-badge-visibility'));
	}
	else {
		cartRule.style.setProperty('--cart-badge-content', '');
		cartRule.style.setProperty('--cart-badge-visibility', 'hidden');
	}
};

updateCartBadge();
