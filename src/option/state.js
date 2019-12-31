/**
 * type OptionState = { addr :: String
 * 					  , token :: String
 * 					  , err :: Maybe String
 * 					  }
 */
const R = require("ramda");
const AppState = require("../state");

// 默认状态 :: OptionState
const 默认状态 = {
	addr: "",
	token: "",
	err: null
};

// addrLens :: Lens OptionState String
const addrLens = R.lensProp("addr");

// tokenLens :: Lens OptionState String
const tokenLens = R.lensProp("token");

// errLens :: Lens OptionState String
const errLens = R.lensProp("err");

// 生于AppState :: Maybe AppState -> OptionState
const 生于AppState = R.ifElse(
	R.isNil,
	R.always(默认状态),
	R.applySpec({
		addr: R.view(AppState.addrLens),
		token: R.view(AppState.tokenLens),
		err: null
	})
);

module.exports = {
	默认状态,
	addrLens,
	tokenLens,
	errLens,

	生于AppState
};
