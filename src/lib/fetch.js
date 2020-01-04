const Most = require("most");
const R = require("ramda");

const AppState = require("XGState/app");

// querify :: {|r} -> String
const querify = R.compose(
	R.join("&"),
	R.map(R.join("=")),
	R.toPairs
);

// sendBody :: String -> {|r} -> String -> String -> {|r} -> Stream JSON
const sendBody = R.curry((method, 请求头, 域名, 请求路径, body) => {
	const init = {
		method,
		headers: 请求头,
		body: JSON.stringify(body)
	};

	const 完整地址 = `${域名}${请求路径}`;

	const r = fetch(完整地址, init).then(r => r.json());
	return Most.fromPromise(r);
});

// sendQuery :: String -> {|r} -> String -> String -> {|r} -> Stream JSON
const sendQuery = R.curry((method, 请求头, 域名, 请求路径, query) => {
	const init = {
		method,
		headers: 请求头
	};

	const 完整地址 = (域名 => {
		const 完整地址 = `${域名}${请求路径}`;
		if (R.isEmpty(query)) {
			return 完整地址;
		}
		else {
			return `${完整地址}?${querify(query)}`;
		}
	})(域名);

	const r = fetch(完整地址, init).then(r => r.json());
	return Most.fromPromise(r);
});

// 组装 :: AppState -> FetchReader
const 组装 = state => {
	const [addr, token] = AppState.各个值(state);

	const 请求头 = {
		"content-type": "application/json",
		"rotom": token
	};

	// GET :: String -> {|r} -> Stream JSON
	const GET = sendQuery("GET", 请求头, addr);

	// GET_ :: String-> Stream JSON
	const GET_ = R.flip(GET)({});

	// POST :: String -> {|r} -> Stream JSON
	const POST = sendBody("POST", 请求头, addr);

	// POST_ :: String -> Stream JSON
	const POST_ = R.flip(POST)({});

	// PATCH :: String -> {|r} -> Stream JSON
	const PATCH = sendBody("PATCH", 请求头, addr);

	// PATCH_ :: String -> Stream JSON
	const PATCH_ = R.flip(PATCH)({});

	// PUT :: String -> {|r} -> Stream JSON
	const PUT = sendBody("PUT", 请求头, addr);

	// PUT_ :: String -> Stream JSON
	const PUT_ = R.flip(PUT)({});

	// DELETE :: String -> {|r} -> Stream JSON
	const DELETE = sendQuery("DELETE", 请求头, addr);

	// DELETE_ :: String -> Stream JSON
	const DELETE_ = R.flip(DELETE)({});

	return {
		GET,
		GET_,
		POST,
		POST_,
		PATCH,
		PATCH_,
		PUT,
		PUT_,
		DELETE,
		DELETE_
	};
};

module.exports = {
	组装
};
