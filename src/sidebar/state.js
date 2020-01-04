const R = require("ramda");

/**
 * type 分组 = { id :: Int
 * 			   , 名字 :: String
 * 			   , 创建日期 :: String
 * 			   }
 */

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

module.exports = {
	生成,
	分组lens,
	选中分组lens,

	获取分组列表,
	更新分组列表
};
