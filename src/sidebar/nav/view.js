const dom = require("@cycle/dom");

const renderSelect = groups => (
	dom.div(".item", [
		dom.select(".item", [
			dom.option("- 选择分组 -"),
			...groups.map(g => dom.option(g.name))
		])
	])
);

const render = state => dom.div(".ui.mini.menu", [
	renderSelect(state),
	dom.div(".item", [
		dom.button(".ui.small.button", "添加分组")
	]),

	dom.div(".right.menu", [
		dom.div(".item", "上传"),
		dom.div(".item", "添加")
	])
]);

module.exports = render;
