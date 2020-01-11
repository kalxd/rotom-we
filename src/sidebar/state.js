const R = require("ramda");
const Most = require("most");
const { fmap } = require("XGLib/ext");

const GroupState = require("XGState/group");

/**
 * type SidebarState = { fetch :: FetchReader
 * 					   , 分组 :: [Group]
 * 					   , 位置 :: Maybe Int
 * 					   }
 */

// 生成 :: FetchReader -> SidebarState
const 生成 = fetch => ({
	fetch,
	分组: [],
	位置: null
});

// fetchlens :: Lens SidebarState FetchReader
const fetchlens = R.lensProp("fetch");

// 分组lens :: Lens SidebarState [分组]
const 分组lens = R.lensProp("分组");

// 位置lens :: Lens SidebarState (Maybe Int)
const 位置lens = R.lensProp("位置");

// 常用字段 :: SidebarState -> ([Group], Maybe Int)
const 常用字段 = R.props(["分组", "位置"]);

// 选中分组 :: SidebarState -> Maybe Group
const 选中分组 = state => {
	const [分组, 位置] = 常用字段(state);

	return fmap(R.flip(R.nth)(分组))(位置);
};

// 获取分组列表 :: SidebarState -> Stream [Group]
const 获取分组列表 = state => state.fetch.GET_("/分组/列表");

// 新建分组 :: SidebarState -> String -> Stream Group
const 新建分组 = R.curry((state, 名字) => {
	const body = GroupState.生成创建表单(名字);
	return state.fetch.POST("/分组/创建", body);
});

// 更新分组 :: SidebarState -> Group -> String -> Stream Group
const 更新分组 = R.curry((state, 旧分组, 新名字) => {
	const [id] = GroupState.常用字段(旧分组);
	const body = GroupState.生成更新表单(新名字);
	return state.fetch.PATCH(`/分组/${id}/更新`, body);
});

// 删除分组 :: SidebarState -> Int -> Stream ()
const 删除分组 = R.curry((state, id) => {
	return state.fetch.DELETE_(`/分组/${id}/全部清除`);
});

module.exports = {
	生成,
	fetchlens,
	分组lens,
	位置lens,

	常用字段,
	选中分组,

	获取分组列表,
	新建分组,
	更新分组,
	删除分组
};
