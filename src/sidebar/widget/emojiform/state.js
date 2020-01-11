const R = require("ramda");
const { fmap } = require("XGLib/ext");
const EmojiState = require("XGState/emoji");

/**
 * type State = { 名字 :: String
 * 				, 链接 :: String
 * 				, dropdown :: DropdownState
 * 				}
 */
// 生成 :: Maybe Emoji -> DropdownState -> State
const 生成 = R.curry((表情, dropdown) => {
	const [_, 名字, 链接] = R.pipe(
		fmap(EmojiState.常用字段),
		R.defaultTo([0, "", ""])
	)(表情);

	return {
		名字,
		链接,
		dropdown
	};
});

// 名字lens :: Lens State String
const 名字lens = R.lensProp("名字");

// 链接lens :: Lens State String
const 链接lens = R.lensProp("链接");

// dropdownlens :: Lens State Group
const dropdownlens = R.lensProp("dropdown");

// 常用字段 :: State -> (String, String)
const 常用字段 = R.props(["名字", "链接"]);

module.exports = {
	生成,
	名字lens,
	链接lens,
	dropdownlens,
	常用字段
};
