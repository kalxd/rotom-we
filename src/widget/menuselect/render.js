const dom = require("@cycle/dom");
const { renderWhen } = require("../../lib/ext");

const menuOption = {
	style: {
		transition: "transform .5s, opacity .5s",
		opacity: 0,
		transformOrigin: "top",
		transform: "rotateX(0.25turn)",
		delayed: {
			opacity: 1,
			transform: "rotateX(0)"
		},
		remove: {
			opacity: 0,
			transform: "rotateX(0.25turn)"
		}
	}
};

const renderDropMenu = itemVec => (
	dom.div(".menu.transition.visible", menuOption, [
		...itemVec.map(([name]) => dom.div(".item", name))
	])
);

const render = state => {
	return (
		dom.div(".ui.pointing.dropdown.link.item", [
			dom.span(".text", "标题"),
			dom.i(".icon.dropdown"),
			renderWhen(state.visible, _ => renderDropMenu(state.itemVec))
		])
	);
};

module.exports = render;
