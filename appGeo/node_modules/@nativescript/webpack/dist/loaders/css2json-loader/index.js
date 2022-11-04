"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const css_1 = require("css");
const loader_utils_1 = require("loader-utils");
const ts_dedent_1 = require("ts-dedent");
const betweenQuotesPattern = /('|")(.*?)\1/;
const unpackUrlPattern = /url\(([^\)]+)\)/;
const inlineLoader = '!css2json-loader?useForImports!';
function loader(content, map) {
    const options = this.getOptions() || {};
    const inline = !!options.useForImports;
    const requirePrefix = inline ? inlineLoader : '';
    const ast = (0, css_1.parse)(content);
    // todo: revise if this is necessary
    // todo: perhaps use postCSS and just build imports into a single file?
    let dependencies = [];
    getAndRemoveImportRules(ast)
        .map(extractUrlFromRule)
        .map(createRequireUri)
        .forEach(({ uri, requireURI }) => {
        dependencies.push(`require("${requirePrefix}${requireURI}")`);
    });
    const str = JSON.stringify(ast, (k, v) => (k === 'position' ? undefined : v));
    // map.mappings = map.mappings.replace(/;{2,}/, '')
    const code = (0, ts_dedent_1.dedent) `
	/* CSS2JSON */
	${dependencies.join('\n')}
	const ___CSS2JSON_LOADER_EXPORT___ = ${str}
	export default ___CSS2JSON_LOADER_EXPORT___
	`;
    this.callback(null, code, //`${dependencies.join('\n')}module.exports = ${str};`,
    map);
}
exports.default = loader;
function getImportRules(ast) {
    if (!ast || ast.type !== 'stylesheet' || !ast.stylesheet) {
        return [];
    }
    return (ast.stylesheet.rules.filter((rule) => rule.type === 'import' && rule.import));
}
function getAndRemoveImportRules(ast) {
    const imports = getImportRules(ast);
    ast.stylesheet.rules = ast.stylesheet.rules.filter((rule) => rule.type !== 'import');
    return imports;
}
/**
 * Extracts the url from import rule (ex. `url("./platform.css")`)
 */
function extractUrlFromRule(importRule) {
    const urlValue = importRule.import;
    const unpackedUrlMatch = urlValue.match(unpackUrlPattern);
    const unpackedValue = unpackedUrlMatch ? unpackedUrlMatch[1] : urlValue;
    const quotesMatch = unpackedValue.match(betweenQuotesPattern);
    return quotesMatch ? quotesMatch[2] : unpackedValue;
}
function createRequireUri(uri) {
    return {
        uri: uri,
        requireURI: (0, loader_utils_1.urlToRequest)(uri),
    };
}
//# sourceMappingURL=index.js.map