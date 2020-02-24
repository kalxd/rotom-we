/** 加载中 */

/**
 * data LoadState a = Loading | Finish a
 *
 * type LoadState a = { 已完成 :: Bool
 *					  , 内容 :: Maybe a
 *					  }
 */

const R = require("ramda");

// 已完成lens :: Lens (LoadState a) Bool
const 已完成lens = R.lensProp("已完成");

// 内容lens :: Lens (LoadState a) a
const 内容lens = R.lensProp("内容");

// 是否完在 :: LoadState -> Bool
const 是否完成 = R.view(已完成lens);

// empty :: LoadState a
const empty = {
	已完成: false,
	内容: null
};

// fmap :: (a -> b) -> LoadState a -> LoadState b
const fmap = R.curry((f, state) => {
	if (R.view(已完成lens, state)) {
		return R.over(内容lens, f, state);
	}
	else {
		return state;
	}
});

// pure :: a -> LoadState a
const pure = a => ({
	已完成: true,
	内容: a
});

module.exports = {
	已完成lens,
	内容lens,
	是否完成,
	empty,
	fmap,
	pure
};
