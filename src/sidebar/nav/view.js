const dom = require("@cycle/dom");

const renderSelect = groups => (
	dom.div(".item", [
		dom.select(".item", [
			dom.option("- 选择分组 -"),
			...groups.map(g => dom.option(g.name))
		])
	])
);

const render = state => dom.div(".ui.menu", [
	renderSelect(state),
	dom.div(".item", [
		dom.button(".ui.small.button", "添加分组")
	])
]);

module.exports = render;
