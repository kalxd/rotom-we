const R = require("ramda");
const Most = require("most");
const isolate = require("@cycle/isolate").default;

const render = require("./render");

const MenuSelect = require("../../widget/menuselect");

const main = (source, prop) => {
	const menuSelect = isolate(MenuSelect)(source, prop.group$, prop.curGroup$);

	return {
		DOM: menuSelect.DOM.map(render),
		state: Most.of(R.always(null))
	};
};

module.exports = main;
