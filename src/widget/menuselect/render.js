const dom = require("@cycle/dom");

const renderDropMenu = itemVec => (
	dom.div(".menu", itemVec.map(item => dom.div(".item", item)))
);

const render = state => {
	return (
		dom.div(".ui.pointing.dropdown.link.item", [
			dom.span(".text", "标题"),
			dom.i(".icon.dropdown"),
			renderDropMenu(state.itemVec)
		])
	);
};

module.exports = render;
