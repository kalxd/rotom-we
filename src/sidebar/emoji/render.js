const R = require("ramda");
const dom = require("@cycle/dom");
const { fmap } = require("XGLib/ext");
const EmojiState = require("XGState/emoji");
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
				dom.button(".ui.mini.primary.button.__add__", "新建表情")
			])
		])
	]);
};

// renderCard :: Emoji -> Int -> View
const renderCard = R.curry((emoji, index) => {
	const [id, 名字, 链接] = EmojiState.常用字段(emoji);

	return dom.div(".ui.raised.card", [
		dom.div(".image", [
			dom.img({ attrs: { src: 链接 } })
		]),

		dom.div(".content", 名字),

		dom.div(".extra.content", [
			dom.button(".ui.mini.tertiary.button.__edit__", [
				dom.i(".icon.edit"),
				"编辑"
			]),
			dom.button(".ui.mini.tertiary.red.button.__del__", [
				dom.i(".icon.trash"),
				"删除"
			])
		])
	]);
});

// render :: EmojiState -> View
const render = state => {
	const 表情列表 = R.view(State.表情列表lens, state);

	return dom.div(".ui.teal.segment", [
		搜索表单(state),
		dom.div(".ui.two.cards", R.addIndex(R.map)(renderCard, 表情列表))
	]);
};

module.exports = render;
