const dom = require("@cycle/dom");

// render :: (SidebarState, View) -> View
const render = ([state, dropdownDOM]) => {
	return dom.div(".ui.menu", [
		dom.div(".item", dropdownDOM),
		dom.div(".item", [
			dom.button(".ui.mini.primary.button.__add-group__", "添加分组")
		]),
		dom.div(".item", [
			dom.button(".ui.mini.green.button.__add-emoji__", "添加表情")
		])
	]);
};

module.exports = render;
