/**
 * type OptionState = { addr :: String
 * 					  , token :: String
 * 					  , err :: Maybe String
 * 					  }
 */
const R = require("ramda");
const { isEmpty } = require("XGLib/ext");

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

// errLens :: Lens OptionState (Maybe String)
const errLens = R.lensProp("err");

// validate :: OptionState -> Maybe String
const validate = state => {
	const addr = R.view(addrLens, state);
	const token = R.view(tokenLens, state);

	if (isEmpty(addr)) {
		return "服务器地址不能为空！";
	}
	else if (isEmpty(token)) {
		return "神秘代码不能为空！";
	}
	else {
		return null;
	}
};

// 生于AppState :: Maybe AppState -> OptionState
const 生于AppState = R.ifElse(
	R.isNil,
	R.always(默认状态),
	R.applySpec({
		addr: R.view(AppState.addrLens),
		token: R.view(AppState.tokenLens),
		err: R.always(null)
	})
);

// 还于AppState :: OptionState -> AppState
const 还于AppState = R.pick(["addr", "token"]);

module.exports = {
	默认状态,
	addrLens,
	tokenLens,
	errLens,
	validate,

	生于AppState,
	还于AppState
};
