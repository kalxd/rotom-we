/** 全局状态，一般指用户保存的数据。 */

/**
 * type AppState = { token :: String
 * 				   , addr :: String
 * 				   }
 */
const R = require("ramda");
const Most = require("most");
const Store = browser.storage.local;

const STORE_KEY = "option";

// tokenLens :: Lens AppState String
const tokenLens = R.lensProp("token");

// addrLens :: Lens AppState String
const addrLens = R.lensProp("addr");

// 各个值 :: AppState -> (String, String)
const 各个值 = R.props(["addr", "token"]);

// 保存选项 :: AppState -> IO ()
const 保存选项 = 状态 => {
	Store.set({ [STORE_KEY]: 状态 });
};

// 读取选项 :: () -> Stream (Maybe AppState)
const 读取选项 = () => {
	return Most.fromPromise(Store.get(STORE_KEY))
		.map(R.prop(STORE_KEY))
		.multicast()
	;
};

module.exports = {
	tokenLens,
	addrLens,
	各个值,
	保存选项,
	读取选项
};
