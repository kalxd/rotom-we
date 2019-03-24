const R = require("ramda");
const S = require("sanctuary");
const dom = require("@cycle/dom");
const { renderWhen, orEmpty } = require("XGLib/ext");

const renderDropMenu = itemVec => (
	dom.div(".menu.transition.visible", [
		...itemVec.map(([name]) => dom.div("._xg_item_.item", name))
	])
);

const render = state => {
	const title = R.pipe(
		S.map(select => R.find(([_, item]) => item === select)(state.itemVec)),
		S.map(R.head),
		orEmpty
	)(state.select);
		
	return (
		dom.div(
			`.ui._xg_menuselect_.transition.dropdown${state.klass}`,
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
