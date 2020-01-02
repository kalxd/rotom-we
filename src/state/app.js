/** 全局状态，一般指用户保存的数据。 */

/**
 * type AppState = { token :: String
 * 				   , addr :: String
 * 				   }
 */
const R = require("ramda");
const Store = browser.storage.local;

const STORE_KEY = "option";

// tokenLens :: Lens AppState String
const tokenLens = R.lensProp("token");

// addrLens :: Lens AppState String
const addrLens = R.lensProp("addr");

// 保存选项 :: AppState -> IO ()
const 保存选项 = 状态 => {
	Store.set({ [STORE_KEY]: 状态 });
};

// 读取选项 :: () -> IO AppState
const 读取选项 = () => {
	return Store.get(STORE_KEY)
		.then(R.prop(STORE_KEY))
	;
};

module.exports = {
	tokenLens,
	addrLens,
	保存选项,
	读取选项
};
