/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = void 0;
const vscode = __webpack_require__(1);
const fs = __webpack_require__(5);
const index_1 = __webpack_require__(2);
function activate(context) {
    let openPlatform = vscode.commands.registerCommand('HxmIcon.OpenPlatform', () => {
        const panel = vscode.window.createWebviewPanel('webview', '同花顺Icon', vscode.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true,
        });
        panel.webview.html = index_1.getTemplateFileContent(context, 'index.html', panel.webview);
        panel.webview.onDidReceiveMessage((message) => __awaiter(this, void 0, void 0, function* () {
            switch (message.command) {
                case 'exportSvgSymbolsFile':
                    const uri = yield vscode.window.showSaveDialog({
                        filters: {
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            'Javascript': ['js']
                        }
                    });
                    // 获取保存路径
                    // 生成svg-symbols.js
                    const dir = uri.path.split('/').slice(0, -1).join('/');
                    fs.readFile(`${dir}/sss.js`, (err, data) => {
                        console.log(err);
                        console.log(data.toString());
                    });
                    console.log(dir);
                    console.log(message.data);
                    break;
            }
        }), undefined, context.subscriptions);
    });
    context.subscriptions.push(openPlatform);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(3), exports);


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getTemplateFileContent = exports.formatHTMLWebviewResourcesUrl = void 0;
const path_1 = __webpack_require__(4);
const vscode_1 = __webpack_require__(1);
const fs = __webpack_require__(5);
function isRemoteLink(link) {
    return /^(https?|vscode-webview-resource|javascript):/.test(link);
}
function formatHTMLWebviewResourcesUrl(html, conversionUrlFn) {
    const linkRegexp = /\s?(?:src|href)=('|")(.*?)\1/gi;
    let matcher = linkRegexp.exec(html);
    while (matcher) {
        const origin = matcher[0];
        const originLen = origin.length;
        const link = matcher[2];
        if (!isRemoteLink(link)) {
            let resourceLink = link;
            try {
                resourceLink = conversionUrlFn(link);
                html =
                    html.substring(0, matcher.index) +
                        origin.replace(link, resourceLink) +
                        html.substring(matcher.index + originLen);
            }
            catch (err) {
                console.error(err);
            }
        }
        matcher = linkRegexp.exec(html);
    }
    return html;
}
exports.formatHTMLWebviewResourcesUrl = formatHTMLWebviewResourcesUrl;
function getTemplateFileContent(context, tplPaths, webview) {
    if (!Array.isArray(tplPaths)) {
        tplPaths = [tplPaths];
    }
    const tplPath = path_1.join(context.extensionPath, 'src/views', ...tplPaths);
    const html = fs.readFileSync(tplPath, 'utf-8');
    const extensionUri = context.extensionUri;
    const dirUri = tplPaths.slice(0, -1).join('/');
    return formatHTMLWebviewResourcesUrl(html, (link) => {
        return webview
            .asWebviewUri(vscode_1.Uri.parse([extensionUri, 'src/views', dirUri, link].join('/')))
            .toString();
    });
}
exports.getTemplateFileContent = getTemplateFileContent;


/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("fs");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=extension.js.map