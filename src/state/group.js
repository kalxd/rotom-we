const R = require("ramda");

/**
 * type Group = { id :: Int
 * 				, 名字 :: String
 * 				, 用户id :: Int
 * 				, 创建日期 :: Date
 * 				, 数量 :: Int
 * 				}
 */

// idlens :: Lens Group Int
const idlens = R.lensProp("id");

// 名字lens :: Lens Group String
const 名字lens = R.lensProp("名字");

// 用户idlens :: Lens Group Int
const 用户idlens = R.lensProp("用户id");

// 创建日期lens :: Lens Group Date
const 创建日期lens = R.lensProp("创建日期");

// 数量lens :: Lens Group Int
const 数量lens = R.lensProp("数量");

// 常用字段 :: Group -> (Int, String, Date, Int)
const 常用字段 = R.props(["id", "名字", "创建日期", "数量"]);

// 就是这个 :: Int -> Group -> Bool
const 就是这个 = R.propEq("id");

/**
 * type GroupPostForm = { 名字 :: String }
 */

// 生成创建表单 :: String -> GroupPostForm
const 生成创建表单 = R.objOf("名字");

/**
 * type GroupPatchForm = { 名字 :: String }
 *
 */

// 生成更新表单 :: String -> GroupPatchForm
const 生成更新表单 = 生成创建表单;

module.exports = {
	idlens,
	名字lens,
	用户idlens,
	创建日期lens,
	数量lens,
	常用字段,
	就是这个,

	生成创建表单,
	生成更新表单
};
