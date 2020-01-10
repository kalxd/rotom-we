const R = require("ramda");
const dom = require("@cycle/dom");
const State = require("./state");

const { fmap } = require("XGLib/ext");

// renderDropdown :: State -> View -> View
const renderDropdown = R.curry((state, dropdownDOM) => {
	const 当前分组 = State.选中分组(state);

	return dom.div(".ui.segment", [
		dom.div(".ui.small.form", [
			dom.div(".field", [
				dom.label("选择一个分类"),
				dom.div(".field", [dropdownDOM])
			]),
			dom.div(".field", [
				dom.button(".ui.primary.mini.button.__add-group__", "添加分组"),
				fmap(
					_ => dom.button(".ui.orange.mini.button.__edit-group__", "编辑分组")
				)(当前分组),

				fmap(
					_ => dom.button(".ui.red.mini.button.__delete-group__", "删除分组")
				)(当前分组)
			])
		])
	]);
});

// render :: (SidebarState, View, View) -> View
const render = ([state, dropdownDOM, emojiDOM]) => {
	return dom.div(".ui.stacked.segments", [
		renderDropdown(state, dropdownDOM),
		emojiDOM
	]);
};

module.exports = render;
