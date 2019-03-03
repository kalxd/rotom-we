const R = require("ramda");
const Most = require("most");
const isolate = require("@cycle/isolate").default;

const render = require("./render");

const MenuSelect = require("../../widget/menuselect");

const main = (source, prop) => {
	const itemVec$ = prop.group$
		.map(R.compose(
			R.prepend(["全部", null]),
			R.map(R.converge(R.pair, [R.prop("name"), R.identity]))
		))
	;
	const menuSelect = isolate(MenuSelect)(source, itemVec$, prop.curGroup$);

	return {
		DOM: menuSelect.DOM.map(render),
		state: Most.of(R.always(null))
	};
};

module.exports = main;
