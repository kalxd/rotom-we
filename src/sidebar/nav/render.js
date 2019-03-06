const dom = require("@cycle/dom");

const render = groupSelectView => dom.div(".ui.menu", [
	groupSelectView,

	dom.div(".right.menu", [
		dom.div(".item", [
			dom.button(".ui.primary.small.vertical.animated.button", [
				dom.div(".hidden.content", "添加表情"),
				dom.div(".visible.content", dom.i(".icon.square.plus.outline"))
			])
		])
	])
]);

module.exports = render;
