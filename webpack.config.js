const R = require("ramda");
const fs = require("fs");
const path = require("path");

const CWD = path.resolve(__dirname);
const SRC = path.join(CWD, "src");

// readEntry :: [String] -> Object
const readEntry = R.compose(
	R.fromPairs,
	R.map(name => {
		const value = path.join(SRC, `${name}.js`);
		return [name, value];
	})
);

const config = {
	mode: "none",

	entry: readEntry(["option", "sidebar"]),

	output: {
		filename: "[name].js",
		path: path.join(CWD, "addon")
	}
};

module.exports = config;
