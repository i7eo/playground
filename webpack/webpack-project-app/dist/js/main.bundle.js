/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = "data:image/jpeg;base64,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"

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _layer = __webpack_require__(8);

var _layer2 = _interopRequireDefault(_layer);

__webpack_require__(9);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var layer = function layer() {
	return {
		name: 'layer',
		tpl: _layer2.default
	};
};

exports.default = layer;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(6);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js??ref--1-1!../../node_modules/postcss-loader/index.js??ref--1-2!./commons.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js??ref--1-1!../../node_modules/postcss-loader/index.js??ref--1-2!./commons.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".flex-box {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n.layer {\n  width: 600px;\n  height: 400px;\n  background-color: green;\n}\n.layer > div {\n  width: 400px;\n  height: 200px;\n  background: url(" + __webpack_require__(2) + ");\n}\n", ""]);

// exports


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports
exports.i(__webpack_require__(7), "");

// module
exports.push([module.i, "html , body{\r\n\tpadding: 0px;\r\n\tmargin: 0px;\r\n\tbackground-color: red;\r\n}\r\n\r\nul , li{\r\n\tpadding: 0px;\r\n\tmargin: 0px;\r\n\tlist-style: none;\r\n}\r\n", ""]);

// exports


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)();
// imports


// module
exports.push([module.i, ".flex-box{\r\n\tdisplay: flex;\r\n}", ""]);

// exports


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function (obj) {
obj || (obj = {});
var __t, __p = '', __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class="layer">\r\n	<div>This is ' +
((__t = ( name)) == null ? '' : __t) +
'</div>\r\n	<img src="' +
((__t = (__webpack_require__(2))) == null ? '' : __t) +
'" />	\r\n	<p>\r\n		';
 for(var i = 0; i<arr.length; i++){;
__p += '\r\n			<span>' +
((__t = ( arr[i])) == null ? '' : __t) +
'</span>\r\n		';
};
__p += '\r\n	</p>\r\n</div>';

}
return __p
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(5);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/index.js??ref--2-2!../../../node_modules/less-loader/index.js!./layer.less", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/index.js??ref--2-2!../../../node_modules/less-loader/index.js!./layer.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(4);

var _layer = __webpack_require__(3);

var _layer2 = _interopRequireDefault(_layer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var App = function App() {
	console.log(layer);
	var dom = document.getElementById('app');
	var layer = new _layer2.default();
	dom.innerHTML = layer.tpl({
		name: 'tan',
		arr: ['apple', 'sauming', 'huawei']
	});
};

App();

/***/ })
/******/ ]);