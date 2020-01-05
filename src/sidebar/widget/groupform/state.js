const R = require("ramda");

/**
 * type FormState = { 名字 :: String }
 */

// 新建表单 :: String -> FormState
const 新建表单 = 名字 => ({ 名字 });

// 名字lens :: Lens FormState String
const 名字lens = R.lensProp("名字");

module.exports = {
	新建表单,
	名字lens
};
