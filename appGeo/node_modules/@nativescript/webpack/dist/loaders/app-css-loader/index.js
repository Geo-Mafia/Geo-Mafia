"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_dedent_1 = require("ts-dedent");
const path_1 = require("path");
/**
 * This loader tries to load an `app.scss` or and `app.css` relative to the main entry
 */
function loader(content, map) {
    const { platform } = this.getOptions();
    const callback = this.async();
    const resolve = this.getResolve({
        extensions: [`.${platform}.scss`, `.${platform}.css`, '.scss', '.css'],
    });
    resolve(this.context, './app', (err, res) => {
        if (err || !res) {
            // if we ran into an error or there's no css file found, we just return
            // original content and not append any additional imports.
            return callback(null, content, map);
        }
        const code = (0, ts_dedent_1.dedent) `
			// Added by app-css-loader
			import "./${(0, path_1.basename)(res)}";
			${content}
		`;
        callback(null, code, map);
    });
}
exports.default = loader;
//# sourceMappingURL=index.js.map