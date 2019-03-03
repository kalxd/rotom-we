const R = require("ramda");
const Most = require("most");
const isolate = require("@cycle/isolate").default;

const render = require("./render");
const ST = require("../state");

const MenuSelect = require("XGWidget/menuselect");

const main = (source, prop) => {
	const itemVec$ = prop.group$
		.map(R.compose(
			R.prepend(["全部", null]),
			R.map(R.converge(R.pair, [R.prop("name"), R.identity]))
		))
	;
	const menuSelect = isolate(MenuSelect)(source, itemVec$, prop.curGroup$);

	const update$ = menuSelect.change$
		.map(R.compose(
			R.set(ST.curGroupLens),
			R.prop("id")
		))
	;

	return {
		DOM: menuSelect.DOM.map(render),
		state: update$
	};
};

module.exports = main;
