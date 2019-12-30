/** 全局状态，一般指用户保存的数据。 */

/**
 * type AppState = { token :: String
 * 				   , addr :: String
 * 				   }
 */
const R = require("ramda");

// tokenLens :: Lens AppState String
const tokenLens = R.lensProp("token");

// addrLens :: Lens AppState String
const addrLens = R.lensProp("addr");

exports = {
	tokenLens,
	addrLens
};
