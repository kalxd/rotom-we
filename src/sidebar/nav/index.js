const R = require("ramda");
const Most = require("most");

const render = require("./view");

const main = (source, group$) => {
	return {
		DOM: group$.map(render),
	};
};

module.exports = main;
