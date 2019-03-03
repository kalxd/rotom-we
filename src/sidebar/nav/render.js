const dom = require("@cycle/dom");

const render = selectView => dom.div(".ui.mini.menu", [
	selectView,
	dom.div(".item", [
		dom.button(".ui.small.button", "添加分组")
	]),

	dom.div(".right.menu", [
		dom.div(".item", "上传"),
		dom.div(".item", "添加")
	])
]);

module.exports = render;
