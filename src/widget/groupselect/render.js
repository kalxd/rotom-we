const R = require("ramda");
const dom = require("@cycle/dom");
const { renderWhen, fmap } = require("XGLib/ext");
const { randomColorIO } = require("XGLib/constant");

const menuOption = {
	style: {
		transition: "transform .3s linear, opacity .3s linear",
		opacity: 1,
		transformOrigin: "top",
		transform: "rotateX(0.25turn)",
		zIndex: 10,
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

const renderColorLabel = () => {
	const color = randomColorIO();
	return dom.label(`.ui.${color}.circular.empty.label`);
};

const renderOpMenu = state => [
	dom.div(".header", [
		dom.i(".icon.paint.brush"),
		"其它操作"
	]),
	dom.div("._xg_new_.item", [
		renderColorLabel(),
		"新建"
	]),

	fmap(_ => dom.div("._xg_edit_.item", [
		renderColorLabel(),
		"编辑"
	]), state.select),
	fmap(_ => dom.div("._xg_delete_.item", [
		renderColorLabel(),
		"删除"
	]), state.select)
];

const renderDropMenu = state => (
	dom.div(".menu.transition.visible", /* menuOption, */ [
		dom.div(".header", [
			dom.i(".icon.tags"),
			"选择分组"
		]),
		...state.itemVec.map(([name]) => dom.div("._xg_item_.item", [renderColorLabel(), name])),

		dom.div(".ui.divider"),
		...renderOpMenu(state)
	])
);

const render = state => {
	const [title] = R.find(([_, item]) => item === state.select)(state.itemVec);

	return (
		dom.div(".ui.pointing.dropdown.link.item", [
			dom.span(".text", title),
			dom.i(".icon.dropdown"),
			renderWhen(state.visible, _ => renderDropMenu(state)),
		])
	);
};

module.exports = render;
