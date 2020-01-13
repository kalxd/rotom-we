const R = require("ramda");

const GroupState = require("XGState/group");
const EmojiState = require("XGState/emoji");
const SidebarState = require("../state");

/**
 * type EmojiState = { fetch :: FetchReader
 * 					 , 表情列表 :: [Emoji]
 * 					 , 当前分组 :: Group,
 * 					 , 搜索词 :: String
 * 					 }
 */

// 生成 :: FetchReader -> Group -> EmojiState
const 生成 = R.curry((fetch, 分组) => ({
	fetch,
	表情列表: [],
	当前分组: 分组,
	搜索词: ""
}));

// 表情列表lens :: Lens EmojiState [Emoji]
const 表情列表lens = R.lensProp("表情列表");

// 当前分组lens :: Lens EmojiState Group
const 当前分组lens = R.lensProp("当前分组");

// 搜索词lens :: Lens EmojiState String
const 搜索词lens = R.lensProp("搜索词");

// 获取表情列表 :: EmojiState -> Stream [Emoji]
const 获取表情列表 = state => {
	const id = R.pipe(
		R.view(当前分组lens),
		R.view(GroupEmojiState.idlens)
	)(state);
	return state.fetch.GET_(`/分组/${id}/表情列表`);
};

// 新建表情 :: EmojiState -> EmojiForm -> Stream Emoji
const 新建表情 = R.curry((state, body) => {
	return state.fetch.POST("/表情/创建", body);
});

// 更新表情 :: EmojiState -> Emoji -> EmojiForm -> Stream Emoji
const 更新表情 = R.curry((state, 旧表情, body) => {
	const id = R.view(EmojiState.idlens, 旧表情);
	return state.fetch.PATCH(`/表情/${id}/更新`, body);
});

// 删除表情 :: EmojiState -> Emoji -> Stream ()
const 删除表情 = R.curry((state, 表情) => {
	const id = R.view(EmojiState.idlens, 表情);
	return state.fetch.DELETE_(`/表情/${id}/删除`);
});

module.exports = {
	生成,
	表情列表lens,
	当前分组lens,
	搜索词lens,

	获取表情列表,
	新建表情,
	更新表情,
	删除表情
};
