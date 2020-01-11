const R = require("ramda");
const { fmap } = require("XGLib/ext");
const EmojiState = require("XGState/emoji");

/**
 * type State = { 名字 :: String
 * 				, 链接 :: String
 * 				, 分组 :: [Group],
 * 				, 选中 :: Group
 * 				}
 */
// 生成 :: [Group] -> Group -> Maybe Emoji -> State
const 生成 = R.curry((分组, 选中, 表情) => {
	const [_, 名字, 链接] = R.pipe(
		fmap(EmojiState.常用字段),
		R.defaultTo([0, "", ""])
	)(表情);

	return {
		名字,
		链接,
		分组,
		选中
	};
});

// 名字lens :: Lens State String
const 名字lens = R.lensProp("名字");

// 链接lens :: Lens State String
const 链接lens = R.lensProp("链接");

// 分组lens :: Lens State [Group]
const 分组lens = R.lensProp("分组");

// 选中lens :: Lens State Group
const 选中lens = R.lensProp("选中");

module.exports = {
	生成,
	名字lens,
	链接lens,
	分组lens,
	选中lens
};
