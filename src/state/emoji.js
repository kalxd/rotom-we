const R = require("ramda");

/**
 * type Emoji = { id :: Int
 * 				, 名字 :: String
 * 				, 链接 :: String
 * 				, 分组id :: Int
 * 				, 创建日期 :: String
 * 				}
 */

// idlens :: Lens Emoji Int
const idlens = R.lensProp("id");

// 名字lens :: Lens Emoji String
const 名字lens = R.lensProp("名字");

// 链接lens :: Lens Emoji String
const 链接lens = R.lensProp("链接");

// 分组idlens :: Lens Emoji Int
const 分组idlens = R.lensProp("分组id");

// 创建日期lens :: Lens Emoji Date
const 创建日期lens = R.lensProp("创建日期lens");

// 常用字段 :: Emoji -> (Int, String, String)
const 常用字段 = R.props(["id", "名字", "链接"]);

module.exports = {
	idlens,
	名字lens,
	链接lens,
	分组lens,
	创建日期lens,
	常用字段
};
