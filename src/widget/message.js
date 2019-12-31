const R = require("ramda");
const Most = require("most");

/**
 * type State = { 显示 :: Bool
 * 				, 提示信息 :: String
 * 				}
 */

// 初始状态 :: State
const 初始状态 = {
	显示: false,
	提示信息: ""
};

// 显示lens :: Lens State Bool
const 显示lens = R.lensProp("显示");

// 提示信息 :: Lens State String
const 提示信息lens = R.lensProp("提示信息");

// render :: State -> View
const render = state => {
	if (!state.显示) {
		return null;
	}

	return dom.div(".notification.is-danger", [
		dom.button(".delete.__close__"),
		state.提示信息
	]);
};

// main :: Source -> Stream String -> Application
const main = R.curry((source, 信息$) => {
	const 点击关闭$ = source.DOM$.select(".__close__")
		.events("click")
	;

	const 新信息$ = 信息$
		.map(提示信息 => ({ 显示: true, 提示信息 }))
	;

	const 关闭$ = 信息$
		.sampleWith(点击关闭$)
		.map(提示信息 => ({ 显示: false, 提示信息 }))
	;

	const DOM$ = 新信息$.merge(关闭$).map(render);

	return {
		DOM$
	};
});

module.exports = main;
