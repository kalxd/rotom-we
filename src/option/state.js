/**
 * type OptionState = { addr :: String
 * 					  , token :: String
 * 					  , err :: Maybe String
 * 					  }
 */
const R = require("ramda");

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

exports = {
	def,
	addrLens,
	tokenLens,
	errLens
};
