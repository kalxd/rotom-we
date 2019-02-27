const Most = require("most");
const R = require("ramda");

// 老子的全局变量
let g_option = {};

// setup :: Object -> IO ()
const setup = option => g_option = option;

// send :: String -> Object -> Promise a
const send = R.curry((endpoint, data) => {
	console.log(g_option);

	const url = `${g_option.addr}`;
	const headers = {
		"content-type": "application/json",
		"rotom-yjvgma": g_option.token
	};

	const init = {
		method: "post",
		body: R.pipe(R.defaultTo({}), JSON.stringify)(data),
		headers
	};

	return fetch(`${url}${endpoint}`, init)
		.then(r => r.json())
	;
});

// send$ :: String -> Object -> Stream a
const send$ = R.curry((endpoint, data) => {
	return Most.fromPromise(send(endpoint, data));
});

// send_$ :: String -> Stream a
const send_$ = R.flip(send$)({});

exports.setup = setup;
exports.send = send;
exports.send$ = send$;
exports.send_$ = send_$;
