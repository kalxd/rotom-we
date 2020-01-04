const dom = require("@cycle/dom");

// render :: SidebarState -> View
const render = state => {
	return dom.div(".ui.menu", [
		dom.div(".item", [
			dom.button(".ui.mini.primary.button.__add-group__", "添加分组")
		]),
		dom.div(".item", [
			dom.button(".ui.mini.green.button.__add-emoji__", "添加表情")
		])
	]);
};

module.exports = render;
