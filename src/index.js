"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.attr = exports.ATTR = exports.Attr = exports.attribute = exports.ATTRIBUTE = exports.Attribute = exports.css = exports.CSS = exports.Css = exports.html = exports.HTML = exports.Html = exports.zeph = exports.ZEPH = exports.Zeph = void 0;
if (!window.customElements || !window.ShadowRoot) {
    /* eslint-disable no-console */
    console.error("ZephJS is not supported by this browser. Please consult the Browser Support section of the ZephJS documentation for more details.");
    /* eslint-enable no-console */
}
var $COMPONENT = Symbol('ZephComponent');
var $SHADOW = Symbol('ShadowRoot');
var READY = true;
var Check = /** @class */ (function () {
    function Check() {
    }
    // throw an exception if arg is not of the given type (via typeof).
    Check.type = function (arg, type, name) {
        if (typeof arg !== type)
            throw new Error("Invalid " + name + "; must be a " + type + ".");
    };
    // throw an exception if arg is not a string.
    Check.string = function (arg, name) {
        Check.type(arg, "string", name);
    };
    // throw an exception if arg is undefined or null, not a string, or empty.
    Check.posstr = function (arg, name) {
        Check.not.uon(arg, name);
        Check.string(arg, name);
        Check.not.empty(arg, name);
    };
    // throw an exception if arg is not a number.
    Check.number = function (arg, name) {
        Check.type(arg, "number", name);
    };
    // throw an exception if arg is not a boolean.
    Check.boolean = function (arg, name) {
        Check.type(arg, "boolean", name);
    };
    // throw an exception if arg is not a function.
    Check["function"] = function (arg, name) {
        if (!(arg instanceof Function))
            throw new Error("Invalid " + name + "; must be a Function.");
    };
    // throw an exception if arg is not an array.
    Check.array = function (arg, type, name) {
        if (!(arg instanceof Array))
            throw new Error("Invalid " + name + "; must be an Array.");
    };
    Check.not = {
        // throw an exception if arg is undefined.
        undefined: function (arg, name) {
            if (arg === undefined)
                throw new Error("Undefined " + name + ".");
        },
        // throw an exception if arg is null.
        "null": function (arg, name) {
            if (arg === null)
                throw new Error("Null " + name + ".");
        },
        // throw an exception if arg is undefined or null.
        uon: function (arg, name) {
            Check.not.undefined(arg, name);
            Check.not["null"](arg, name);
        },
        // throw an exception if arg is a string and it is empty.
        empty: function (arg, name) {
            if (typeof arg === "string" && arg === "")
                throw new Error("Empty " + name + ".");
        }
    };
    return Check;
}());
var Utils = /** @class */ (function () {
    function Utils() {
        throw new Error('Singleton. Do not instantiate.');
    }
    Utils.ready = function () {
        return READY;
    };
    Utils.tryprom = function (f) {
        Check.not.uon(f, "argument");
        Check["function"](f, "argument");
        return new Promise(function (resolve, reject) {
            try {
                f(resolve, reject);
            }
            catch (ex) {
                return reject(ex);
            }
        });
    };
    Utils.exists = function (url, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        if (url === undefined || url === null || url === "")
            return Promise.resolve(false);
        options = Object.assign({}, options, {
            method: "HEAD"
        });
        return Utils.tryprom(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(url, options)];
                    case 1:
                        response = _a.sent();
                        if (response.ok)
                            resolve(true);
                        else
                            resolve(false);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    Utils.fetch = function (url, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        Check.not.uon(url, "url");
        Check.not.empty(url, "url");
        return Utils.tryprom(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(url, options)];
                    case 1:
                        response = _a.sent();
                        if (response.ok)
                            return [2 /*return*/, resolve(response)];
                        resolve(undefined);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    Utils.fetchText = function (url, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        Check.not.uon(url, "url");
        Check.not.empty(url, "url");
        return Utils.tryprom(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
            var response, text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.fetch(url, options)];
                    case 1:
                        response = _a.sent();
                        if (!response)
                            resolve(undefined);
                        return [4 /*yield*/, response.text()];
                    case 2:
                        text = _a.sent();
                        resolve(text);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    Utils.fetchBinary = function (url, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        Check.not.uon(url, "url");
        Check.not.empty(url, "url");
        return Utils.tryprom(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
            var response, contentType, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Utils.fetch(url, options)];
                    case 1:
                        response = _a.sent();
                        if (!response)
                            resolve(undefined);
                        contentType = response.headers && response.headers.get("Content-Type") || null;
                        return [4 /*yield*/, response.arrayBuffer()];
                    case 2:
                        data = _a.sent();
                        resolve({ data: data, contentType: contentType });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    Utils.resolve = function (url, base) {
        if (base === void 0) { base = document.URL; }
        Check.not.uon(url, "url");
        Check.not.empty(url, "url");
        if (!(url instanceof URL) && typeof url !== "string")
            throw new Error("Invalid url; must be a string or URL.");
        try {
            if (typeof url === "string" && url.startsWith("data:"))
                return "" + new URL(url);
            return "" + new URL(url, base);
        }
        catch (ex) {
            return null;
        }
    };
    Utils.resolveName = function (url, base, extension) {
        var _this = this;
        if (base === void 0) { base = document.URL; }
        if (extension === void 0) { extension = ".js"; }
        var urlstr = "" + url;
        if (urlstr.match(/^data:/))
            return Promise.resolve("" + new URL(url));
        if (!urlstr.match(/^http:\/\/|^https:\/\/|^ftp:\/\/|^\.\/|^\.\.\//))
            return Promise.resolve(null);
        if (url instanceof URL)
            url = "" + url;
        return Utils.tryprom(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
            var resolved, extended, resolveExtended;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resolved = Utils.resolve(url, base);
                        if (!resolved)
                            return [2 /*return*/, null];
                        resolved = "" + resolved;
                        return [4 /*yield*/, Utils.exists(resolved)];
                    case 1:
                        if (_a.sent())
                            return [2 /*return*/, resolve(resolved)];
                        if (!extension) return [3 /*break*/, 4];
                        extended = url + extension;
                        resolveExtended = Utils.resolve(extended, base);
                        if (!resolveExtended)
                            return [2 /*return*/, resolve(null)];
                        return [4 /*yield*/, Utils.exists(resolveExtended)];
                    case 2:
                        if (_a.sent())
                            return [2 /*return*/, resolve(resolveExtended)];
                        return [4 /*yield*/, Utils.exists(extended)];
                    case 3:
                        if (_a.sent())
                            return [2 /*return*/, resolve(extended)];
                        _a.label = 4;
                    case 4:
                        resolve(undefined);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    Utils.parseDataURL = function (url) {
        Check.not.uon(url, "url");
        if (!(url instanceof URL))
            throw new Error("Invalid url.");
        if (url.protocol !== "data:")
            return null;
        if (!url.href)
            return null;
        var match = url.href.match(/^data:([^;]+)(([^;]+;)?;base64)?,(.*)$/);
        var contentType = match && match[1] || "";
        var data = match && match[4] || null;
        return {
            contentType: contentType,
            data: data
        };
    };
    return Utils;
}());
var ZephComponent = /** @class */ (function () {
    function ZephComponent() {
        this.name = null;
        this.html = null;
    }
    ZephComponent.prototype.restyle = function (element) {
        return __awaiter(this, void 0, void 0, function () {
            var component, shadow, clone;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!element)
                            return [2 /*return*/];
                        component = element[$COMPONENT];
                        if (!component)
                            return [2 /*return*/];
                        if (!component.css)
                            return [2 /*return*/];
                        if (!(component.css instanceof Promise)) return [3 /*break*/, 2];
                        return [4 /*yield*/, component.css];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        shadow = element[$SHADOW];
                        clone = component.css.template.content.cloneNode(true);
                        if (shadow) {
                            __spreadArray([], shadow.childNodes, true).forEach(function (child) {
                                if (child.tagName === 'STYLE')
                                    child.remove();
                            });
                            shadow.appendChild(clone);
                        }
                        else {
                            __spreadArray([], element.childNodes, true).forEach(function (child) {
                                if (child.tagName === 'STYLE')
                                    child.remove();
                            });
                            element.appendChild(clone);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ZephComponent.prototype.repaint = function (element) {
        return __awaiter(this, void 0, void 0, function () {
            var component, shadow, clone;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!element)
                            return [2 /*return*/];
                        component = element[$COMPONENT];
                        if (!component)
                            return [2 /*return*/];
                        if (!component.html)
                            return [2 /*return*/];
                        if (!(component.html instanceof Promise)) return [3 /*break*/, 2];
                        return [4 /*yield*/, component.html];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        shadow = element[$SHADOW];
                        clone = component.html.template.content.cloneNode(true);
                        if (shadow) {
                            __spreadArray([], shadow.childNodes, true).forEach(function (child) {
                                if (child.tagName !== 'STYLE')
                                    child.remove();
                            });
                            shadow.appendChild(clone);
                        }
                        else {
                            __spreadArray([], element.childNodes, true).forEach(function (child) {
                                if (child.tagName !== 'STYLE')
                                    child.remove();
                            });
                            element.appendChild(clone);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return ZephComponent;
}());
function Zeph(name) {
    return function (ctor) {
        var elementName = name || null;
        if (!elementName)
            throw new Error('ZephJS Components must have a name and it must have a dash character. Please provide the name via the @zeph(<name>) argument.');
        if (elementName.indexOf("-") < 0)
            throw new Error('ZephJS Component must have a dash character in their element names. This is required, by the underlying WebComponents customElements.define call.');
        if (!(ctor instanceof HTMLElement) && !(ctor.prototype instanceof HTMLElement))
            throw new Error('ZephJS Components must extend HTML or a child that extends HTLMElement.');
        var component = ctor[$COMPONENT] = ctor[$COMPONENT] || new ZephComponent();
        component.elementName = elementName;
        component.parentClass = ctor;
        var elementClass = /** @class */ (function (_super) {
            __extends(ZephElement, _super);
            function ZephElement() {
                var _this = _super.call(this) || this;
                // element exist as this. populate it.
                var element = _this;
                element[$COMPONENT] = component;
                var shadow = null;
                if (!component.disableShadowRoot) {
                    shadow = element.shadowRoot || element.attachShadow({
                        mode: "open"
                    });
                }
                element[$SHADOW] = shadow;
                component.restyle(element);
                component.repaint(element);
                return element;
            }
            return ZephElement;
        }(ctor));
        elementClass[$COMPONENT] = component;
        component.elementClass = elementClass;
        window.customElements.define(elementName, elementClass);
        return elementClass;
    };
}
exports.Zeph = Zeph;
exports.ZEPH = Zeph;
exports.zeph = Zeph;
function Html(content, options) {
    options = Object.assign({
        noRemote: false
    }, options || {});
    return function (ctor) {
        var _this = this;
        var component = ctor[$COMPONENT] = ctor[$COMPONENT] || new ZephComponent();
        if (!options.noRemote && content.match(/^\.\/|^\.\.\//)) {
            try {
                var prom = Utils.tryprom(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                    var url, template;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, Utils.resolveName(content, component.origin || document.URL.toString(), ".html")];
                            case 1:
                                url = _a.sent();
                                if (!url) return [3 /*break*/, 3];
                                return [4 /*yield*/, Utils.fetchText(url)];
                            case 2:
                                content = _a.sent();
                                _a.label = 3;
                            case 3:
                                template = document.createElement("template");
                                template.innerHTML = content;
                                component.html = { template: template, options: options };
                                resolve();
                                return [2 /*return*/];
                        }
                    });
                }); });
                component.html = prom;
            }
            catch (err) {
                console.error("Unable to resolve or otherwise load '" + content + "'.", err);
            }
        }
        else {
            var template = document.createElement("template");
            template.innerHTML = content;
            component.html = { template: template, options: options };
        }
        return ctor;
    };
}
exports.Html = Html;
exports.HTML = Html;
exports.html = Html;
function Css(content, options) {
    options = Object.assign({
        noRemote: false
    }, options || {});
    return function (ctor) {
        var _this = this;
        var component = ctor[$COMPONENT] = ctor[$COMPONENT] || new ZephComponent();
        if (!options.noRemote && content.match(/^\.\/|^\.\.\//)) {
            try {
                var prom = Utils.tryprom(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                    var url, template;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, Utils.resolveName(content, component.origin || document.URL.toString(), ".css")];
                            case 1:
                                url = _a.sent();
                                if (!url) return [3 /*break*/, 3];
                                return [4 /*yield*/, Utils.fetchText(url)];
                            case 2:
                                content = _a.sent();
                                _a.label = 3;
                            case 3:
                                template = document.createElement("template");
                                template.innerHTML = "<style>\n" + content + "\n</style>";
                                component.css = { template: template, options: options };
                                resolve();
                                return [2 /*return*/];
                        }
                    });
                }); });
                component.css = prom;
            }
            catch (err) {
                console.error("Unable to resolve or otherwise load '" + content + "'.", err);
            }
        }
        else {
            var template = document.createElement("template");
            template.innerHTML = "<style>\n" + content + "\n</style>";
            component.css = { template: template, options: options };
        }
        return ctor;
    };
}
exports.Css = Css;
exports.CSS = Css;
exports.css = Css;
function Attribute(name) {
    if (typeof name !== 'string')
        name = null;
    console.log(0);
    return function (target, propertyName) {
        name = name || propertyName || null;
        if (!name)
            throw new Error('Unable to determine name for @attribute decorator.');
        console.log(1, name, target, propertyName);
    };
}
exports.Attribute = Attribute;
exports.ATTRIBUTE = Attribute;
exports.attribute = Attribute;
exports.Attr = Attribute;
exports.ATTR = Attribute;
exports.attr = Attribute;
