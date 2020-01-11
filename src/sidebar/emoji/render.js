const R = require("ramda");
const dom = require("@cycle/dom");
const { fmap } = require("XGLib/ext");
const State = require("./state");

// 搜索表单 :: State -> View
const 搜索表单 = state => {
	return dom.div(".ui.mini.form", [
		dom.div(".inline.fields", [
			dom.div(".field", [
				dom.div(".ui.input.icon", [
					dom.i(".icon.search"),
					dom.input(".__search__", {
						props: {
							placeholder: "搜索"
						}
					})
				])
			]),
			dom.div(".field", [
				dom.button(".ui.mini.primary.button", "新建表情")
			])
		])
	]);
};

const renderCard = emoji => dom.div(".ui.raised.card", [
	dom.div(".image", [
		dom.img({ attrs: { src: emoji.link } })
	]),

	dom.div(".content", emoji.name),

	dom.div(".extra.content", [
		dom.div(".ui.two.mini.buttons", [
			dom.button(".ui.green.basic._xg_edit_.button", "编辑"),
			dom.button(".ui.red.basic._xg_delete_.button", "删除")
		])
	])
]);

// render :: State -> View
const render = state => {
	return dom.div(".ui.teal.segment", [
		搜索表单(state),
		"hello world"
	]);
};

module.exports = render;
