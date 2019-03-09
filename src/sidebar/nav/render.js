const dom = require("@cycle/dom");

const render = groupSelectView => dom.div(".ui.menu", [
	groupSelectView,

	dom.div(".right.menu", [
		dom.div(".item", [
			dom.button(".ui._xg_create_emoji_.primary.small.basic.button", [
				dom.i(".icon.plus.circle"),
				"添加表情"
			])
		])
	])
]);

module.exports = render;
