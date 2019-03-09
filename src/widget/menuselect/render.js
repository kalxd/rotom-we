const R = require("ramda");
const dom = require("@cycle/dom");
const { renderWhen, fmap } = require("XGLib/ext");

const renderDropMenu = itemVec => (
	dom.div(".menu.transition.visible", [
		...itemVec.map(([name]) => dom.div("._xg_item_.item", name))
	])
);

const render = state => {
	console.info(state);
	const title = R.pipe(
		R.find(([_, item]) => item === state.select),
		fmap(R.head)
	)(state.itemVec);
		
	return (
		dom.div(
			`.ui._xg_menuselect_.transition.dropdown${state.class}`,
			{
				class: {
					active: state.visible
				}
			},
			[
				dom.span(".text", title || ""),
				dom.i(".icon.dropdown"),
				renderWhen(state.visible, _ => renderDropMenu(state.itemVec))
			]
		)
	);
};

module.exports = render;
