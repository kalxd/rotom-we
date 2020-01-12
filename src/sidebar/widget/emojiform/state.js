const R = require("ramda");
const { fmap, fmap2 } = require("XGLib/ext");
const EmojiState = require("XGState/emoji");
const GroupState = require("XGState/group");
const DropdownState = require("../dropdown/state");

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

// 生成EmojiForm :: State -> Maybe EmojiForm
const 生成EmojiForm = state => {
	const [名字, 链接] = 常用字段(state);
	const 选中分组 = R.pipe(
		R.view(dropdownlens),
		DropdownState.当前分组
	)(state);

	// 非空链接 :: String -> Maybe String
	const 非空链接 = (s => {
		if (R.isEmpty(s)) {
			return null;
		}
		else {
			return s;
		}
	})(链接);

	return fmap2(
		(链接, 分组) => ({
			名字,
			链接,
			分组id: R.view(GroupState.idlens, 分组)
		})
	)(非空链接, 选中分组);
};

module.exports = {
	生成,
	名字lens,
	链接lens,
	dropdownlens,
	常用字段,

	生成EmojiForm
};
