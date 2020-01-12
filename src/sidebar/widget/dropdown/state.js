const R = require("ramda");
const { fmap } = require("XGLib/ext");
const State = require("../../state");

/**
 * type State = { 显示 :: Bool
 * 				, 当前选择 :: Maybe Int
 * 				, 列表元素 :: [Group]
 * 				}
 */

// 生于SidebarState :: SidebarState -> State
const 生于SidebarState = state => {
	const [列表元素, 当前选择] = State.常用字段(state);

	return {
		显示: false,
		当前选择,
		列表元素
	};
};

// 显示lens :: Lens State Bool
const 显示lens = R.lensProp("显示");

// 当前选择lens :: Lens State (Maybe Int)
const 当前选择lens = R.lensProp("当前选择");

// 列表元素lens :: Lens State [Group]
const 列表元素lens = R.lensProp("列表元素");

// 当前分组 :: State -> Maybe Group
const 当前分组 = state => {
	const 当前选择 = R.view(当前选择lens, state);
	const 列表元素 = R.view(列表元素lens, state);
	return fmap(R.flip(R.nth)(列表元素), 当前选择);
};

module.exports = {
	显示lens,
	当前选择lens,
	列表元素lens,
	生于SidebarState,
	当前分组
};
