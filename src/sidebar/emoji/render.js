const R = require("ramda");
const dom = require("@cycle/dom");
const { fmap } = require("XGLib/ext");
const EmojiState = require("XGState/emoji");
const State = require("./state");

// 搜索表单 :: State -> View
const 搜索表单 = state => {
	const 搜索词 = R.view(State.搜索词lens, state);

	const icon = (s => {
		if (R.isEmpty(s)) {
			return dom.button(".ui.basic.icon.mini.button", [
				dom.i(".icon.search")
			]);
		}
		else {
			return dom.button(".ui.basic.icon.mini.button.__reset__", [
				dom.i(".icon.times")
			]);
		}
	})(搜索词);

	return dom.div(".ui.mini.form", [
		dom.div(".inline.fields", [
			dom.div(".field", [
				dom.div(".ui.action.input", [
					dom.input(".__search__", {
						props: {
							placeholder: "搜索",
							value: 搜索词
						}
					}),
					icon
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
			dom.button(".ui.mini.tertiary.button.__edit__", "编辑"),
			dom.button(".ui.mini.tertiary.red.button.__del__", "删除")
		])
	]);
});

// render :: EmojiState -> View
const render = state => {
	const 搜索词 = R.view(State.搜索词lens, state);

	// 过滤 :: Emoji -> Bool
	const 过滤 = (s => {
		if (R.isEmpty(s)) {
			return R.T;
		}
		else {
			return R.compose(
				R.includes(s),
				R.compose(
					R.toLower,
					R.view(EmojiState.名字lens)
				)
			);
		}
	})(搜索词);

	const 表情列表 = R.pipe(
		R.view(State.表情列表lens),
		R.filter(过滤)
	)(state);

	return dom.div(".ui.teal.segment", [
		搜索表单(state),
		dom.div(".ui.two.cards", R.addIndex(R.map)(renderCard, 表情列表))
	]);
};

module.exports = render;
