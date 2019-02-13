/**
 * 存储相关
 */
const R = require("ramda");
const store = browser.storage.local;

const OPTION_KEY = "option";

// getOption :: () -> Promise State
const getOption = () => store.get(OPTION_KEY)
    .then(R.prop(OPTION_KEY))
;

// saveOption :: State -> Promise ()
const saveOption = state => store.set({ [OPTION_KEY]: state })

exports.store = store;
exports.getOption = getOption;
exports.saveOption = saveOption;
