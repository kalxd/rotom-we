const R = require("ramda");

const intent = (source, change$) => {
};

const connect = (source, change$) => {
	const action = intent(source, change$);

	return {
		fetch$: action.fetchEmoji$
	};
};

module.exports = connect;
