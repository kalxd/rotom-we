const R = require("ramda");
const dom = require("@cycle/dom");
const State = require("./state");

const { fmap } = require("XGLib/ext");

// renderDropdown :: View -> View
const renderDropdown = dropdownDOM => dom.div(".ui.segment", [
	dom.div(".ui.form", [
		dom.div(".inline.fields", [
			dom.label("选择一个分类"),
			dom.div(".field", [dropdownDOM])
		])
	])
])

// render :: (SidebarState, View) -> View
const render = ([state, dropdownDOM]) => {
	const 当前分组 = State.选中分组(state);

	return dom.div(".ui.stacked.segments", [
		renderDropdown(dropdownDOM),

		dom.div(".ui.segment", [
			dom.button(".ui.primary.button.__add-group__", "添加分组"),
			fmap(
				_ => dom.button(".ui.orange.button.__edit-group__", "编辑分组")
			)(当前分组),

			fmap(
				_ => dom.button(".ui.red.button.__delete-group__", "删除分组")
			)(当前分组)
		])
	]);
};

module.exports = render;
