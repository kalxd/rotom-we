/**
 * type OptionState = { addr :: String
 * 					  , token :: String
 * 					  , err :: Maybe String
 * 					  }
 */
const R = require("ramda");
const AppState = require("../state");

// def :: OptionState
const def = {
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

// fromAppState :: AppState -> OptionState
const fromAppState = R.applySpec({
	addr: R.view(AppState.addrLens),
	token: R.view(AppState.tokenLens),
	err: null
});

exports = {
	def,
	addrLens,
	tokenLens,
	errLens
};
