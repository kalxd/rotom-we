/**
 * 存储相关
 */
const R = require("ramda");
const S = require("sanctuary");
const store = browser.storage.local;

const OPTION_KEY = "option";

// getOption :: () -> Promise (Maybe Object)
const getOption = () => store.get(OPTION_KEY)
    .then(R.prop(OPTION_KEY))
	.then(S.toMaybe)
;

// saveOption :: Object -> Promise ()
const saveOption = state => store.set({ [OPTION_KEY]: state })

exports.store = store;
exports.getOption = getOption;
exports.saveOption = saveOption;
