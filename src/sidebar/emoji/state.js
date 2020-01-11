const R = require("ramda");

const GroupState = require("XGState/group");
const SidebarState = require("../state");

/**
 * type State = { fetch :: FetchReader
 * 				, 表情列表 :: [Emoji]
 * 				, 当前分组 :: Group,
 * 				, 搜索词 :: String
 * 				}
 */

// 生成 :: FetchReader -> Group -> State
const 生成 = R.curry((fetch, 分组) => ({
	fetch,
	表情列表: [],
	当前分组: 分组,
	搜索词: ""
}));

// 表情列表lens :: Lens State [Emoji]
const 表情列表lens = R.lensProp("表情列表");

// 当前分组lens :: Lens State Group
const 当前分组lens = R.lensProp("当前分组");

// 搜索词lens :: Lens State String
const 搜索词lens = R.lensProp("搜索词");

// 获取表情列表 :: State -> Stream [Emoji]
const 获取表情列表 = state => {
	const id = R.pipe(
		R.view(当前分组lens),
		R.view(GroupState.idlens)
	)(state);
	return state.fetch.GET_(`/分组/${id}/表情列表`);
};

module.exports = {
	生成,
	表情列表lens,
	当前分组lens,
	搜索词lens,

	获取表情列表
};
