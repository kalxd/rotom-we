const R = require("ramda");
const Most = require("most");

const GroupState = require("XGState/group");

/**
 * type SidebarState = { fetch :: FetchReader
 * 					   , 分组 :: [分组]
 * 					   , 选中分组 :: Maybe 分组
 * 					   }
 */

// 生成 :: FetchReader -> SidebarState
const 生成 = fetch => ({
	fetch,
	分组: [],
	选中分组: null
});

// 分组lens :: Lens SidebarState [分组]
const 分组lens = R.lensProp("分组");

// 选中分组lens :: Lens SidebarState (Maybe 分组)
const 选中分组lens = R.lensProp("选中分组");

// 获取分组列表 :: SidebarState -> Stream [分组]
const 获取分组列表 = state => state.fetch.GET_("/分组/列表");

// 更新分组列表 :: SidebarState -> Stream (SidebarState -> SidebarState)
const 更新分组列表 = state => {
	return 获取分组列表(state)
		.map(R.set(分组lens))
	;
};

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
	分组lens,
	选中分组lens,

	获取分组列表,
	更新分组列表,
	新建分组,
	更新分组,
	删除分组
};
