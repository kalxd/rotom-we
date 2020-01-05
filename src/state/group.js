const R = require("ramda");

/**
 * type Group = { id :: Int
 * 				, 名字 :: String
 * 				, 用户id :: Int
 * 				, 创建日期 :: Date
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

	生成创建表单,
	生成更新表单
};
