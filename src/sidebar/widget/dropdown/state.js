const R = require("ramda");

/**
 * type State = { 显示 :: Bool
 * 				, 当前选择 :: Maybe 分组
 * 				, 列表元素 :: [分组]
 * 				}
 */

// 生成 :: Maybe 分组 -> [分组] -> State
const 生成 = R.curry((当前选择, 列表元素) => ({
	显示: false,
	当前选择,
	列表元素
}));

// 初始 :: [分组] -> State
const 初始 = 生成(null);

// 显示lens :: Lens State Bool
const 显示lens = R.lensProp("显示");

// 当前选择lens :: Lens State (Maybe 分组)
const 当前选择lens = R.lensProp("当前选择");

// 列表元素lens :: Lens State [分组]
const 列表元素lens = R.lensProp("列表元素");

module.exports = {
	生成,
	初始,
	显示lens,
	当前选择lens,
	列表元素lens
};
