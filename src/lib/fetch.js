const Most = require("most");
const R = require("ramda");

// send :: Object -> String -> Object -> Promise a
const send = R.curry((option, endpoint, data) => {
	const url = `${option.addr}`;
	const headers = {
		"content-type": "application/json",
		"rotom-yjvgma": option.token
	};

	const init = {
		method: "post",
		body: R.pipe(R.defaultTo({}), JSON.stringify)(data),
		headers
	};

	return fetch(`${url}${endpoint}`, init)
		.then(r => {
			if (r.ok) {
				return r;
			}

			const e = new Error(r.statusText);
			return Promise.reject(e);
		})
		.then(r => r.json())
	;
});


const setup = input$ => {
	// send :: String -> Object -> Stream a
	const send$ = R.curry((endpoint, data) => {
		return input$
			.map(option => send(option, endpoint, data))
			.awaitPromises()
		;
	});

	const send_$ = R.flip(send$)(null);

	return {
		send$,
		send_$
	};
};

module.exports = setup;
