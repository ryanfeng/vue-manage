
//vue 
/*! 
 * Vue.js v1.0.26
 * (c) 2016 Evan You
 * Released under the MIT License.
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define('common_init',factory) :
            (global.Vue = factory());
}(this, function () {
    

    function set(obj, key, val) {
        if (hasOwn(obj, key)) {
            obj[key] = val;
            return;
        }
        if (obj._isVue) {
            set(obj._data, key, val);
            return;
        }
        var ob = obj.__ob__;
        if (!ob) {
            obj[key] = val;
            return;
        }
        ob.convert(key, val);
        ob.dep.notify();
        if (ob.vms) {
            var i = ob.vms.length;
            while (i--) {
                var vm = ob.vms[i];
                vm._proxy(key);
                vm._digest();
            }
        }
        return val;
    }

    /**
     * Delete a property and trigger change if necessary.
     *
     * @param {Object} obj
     * @param {String} key
     */

    function del(obj, key) {
        if (!hasOwn(obj, key)) {
            return;
        }
        delete obj[key];
        var ob = obj.__ob__;
        if (!ob) {
            if (obj._isVue) {
                delete obj._data[key];
                obj._digest();
            }
            return;
        }
        ob.dep.notify();
        if (ob.vms) {
            var i = ob.vms.length;
            while (i--) {
                var vm = ob.vms[i];
                vm._unproxy(key);
                vm._digest();
            }
        }
    }

    var hasOwnProperty = Object.prototype.hasOwnProperty;
    /**
     * Check whether the object has the property.
     *
     * @param {Object} obj
     * @param {String} key
     * @return {Boolean}
     */

    function hasOwn(obj, key) {
        return hasOwnProperty.call(obj, key);
    }

    /**
     * Check if an expression is a literal value.
     *
     * @param {String} exp
     * @return {Boolean}
     */

    var literalValueRE = /^\s?(true|false|-?[\d\.]+|'[^']*'|"[^"]*")\s?$/;

    function isLiteral(exp) {
        return literalValueRE.test(exp);
    }

    /**
     * Check if a string starts with $ or _
     *
     * @param {String} str
     * @return {Boolean}
     */

    function isReserved(str) {
        var c = (str + '').charCodeAt(0);
        return c === 0x24 || c === 0x5F;
    }

    /**
     * Guard text output, make sure undefined outputs
     * empty string
     *
     * @param {*} value
     * @return {String}
     */

    function _toString(value) {
        return value == null ? '' : value.toString();
    }

    /**
     * Check and convert possible numeric strings to numbers
     * before setting back to data
     *
     * @param {*} value
     * @return {*|Number}
     */

    function toNumber(value) {
        if (typeof value !== 'string') {
            return value;
        } else {
            var parsed = Number(value);
            return isNaN(parsed) ? value : parsed;
        }
    }

    /**
     * Convert string boolean literals into real booleans.
     *
     * @param {*} value
     * @return {*|Boolean}
     */

    function toBoolean(value) {
        return value === 'true' ? true : value === 'false' ? false : value;
    }

    /**
     * Strip quotes from a string
     *
     * @param {String} str
     * @return {String | false}
     */

    function stripQuotes(str) {
        var a = str.charCodeAt(0);
        var b = str.charCodeAt(str.length - 1);
        return a === b && (a === 0x22 || a === 0x27) ? str.slice(1, -1) : str;
    }

    /**
     * Camelize a hyphen-delmited string.
     *
     * @param {String} str
     * @return {String}
     */

    var camelizeRE = /-(\w)/g;

    function camelize(str) {
        return str.replace(camelizeRE, toUpper);
    }

    function toUpper(_, c) {
        return c ? c.toUpperCase() : '';
    }

    /**
     * Hyphenate a camelCase string.
     *
     * @param {String} str
     * @return {String}
     */

    var hyphenateRE = /([a-z\d])([A-Z])/g;

    function hyphenate(str) {
        return str.replace(hyphenateRE, '$1-$2').toLowerCase();
    }

    /**
     * Converts hyphen/underscore/slash delimitered names into
     * camelized classNames.
     *
     * e.g. my-component => MyComponent
     *      some_else    => SomeElse
     *      some/comp    => SomeComp
     *
     * @param {String} str
     * @return {String}
     */

    var classifyRE = /(?:^|[-_\/])(\w)/g;

    function classify(str) {
        return str.replace(classifyRE, toUpper);
    }

    /**
     * Simple bind, faster than native
     *
     * @param {Function} fn
     * @param {Object} ctx
     * @return {Function}
     */

    function bind(fn, ctx) {
        return function (a) {
            var l = arguments.length;
            return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx);
        };
    }

    /**
     * Convert an Array-like object to a real Array.
     *
     * @param {Array-like} list
     * @param {Number} [start] - start index
     * @return {Array}
     */

    function toArray(list, start) {
        start = start || 0;
        var i = list.length - start;
        var ret = new Array(i);
        while (i--) {
            ret[i] = list[i + start];
        }
        return ret;
    }

    /**
     * Mix properties into target object.
     *
     * @param {Object} to
     * @param {Object} from
     */

    function extend(to, from) {
        var keys = Object.keys(from);
        var i = keys.length;
        while (i--) {
            to[keys[i]] = from[keys[i]];
        }
        return to;
    }

    /**
     * Quick object check - this is primarily used to tell
     * Objects from primitive values when we know the value
     * is a JSON-compliant type.
     *
     * @param {*} obj
     * @return {Boolean}
     */

    function isObject(obj) {
        return obj !== null && typeof obj === 'object';
    }

    /**
     * Strict object type check. Only returns true
     * for plain JavaScript objects.
     *
     * @param {*} obj
     * @return {Boolean}
     */

    var toString = Object.prototype.toString;
    var OBJECT_STRING = '[object Object]';

    function isPlainObject(obj) {
        return toString.call(obj) === OBJECT_STRING;
    }

    /**
     * Array type check.
     *
     * @param {*} obj
     * @return {Boolean}
     */

    var isArray = Array.isArray;

    /**
     * Define a property.
     *
     * @param {Object} obj
     * @param {String} key
     * @param {*} val
     * @param {Boolean} [enumerable]
     */

    function def(obj, key, val, enumerable) {
        Object.defineProperty(obj, key, {
            value: val,
            enumerable: !!enumerable,
            writable: true,
            configurable: true
        });
    }

    /**
     * Debounce a function so it only gets called after the
     * input stops arriving after the given wait period.
     *
     * @param {Function} func
     * @param {Number} wait
     * @return {Function} - the debounced function
     */

    function _debounce(func, wait) {
        var timeout, args, context, timestamp, result;
        var later = function later() {
            var last = Date.now() - timestamp;
            if (last < wait && last >= 0) {
                timeout = setTimeout(later, wait - last);
            } else {
                timeout = null;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            }
        };
        return function () {
            context = this;
            args = arguments;
            timestamp = Date.now();
            if (!timeout) {
                timeout = setTimeout(later, wait);
            }
            return result;
        };
    }

    /**
     * Manual indexOf because it's slightly faster than
     * native.
     *
     * @param {Array} arr
     * @param {*} obj
     */

    function indexOf(arr, obj) {
        var i = arr.length;
        while (i--) {
            if (arr[i] === obj) return i;
        }
        return -1;
    }

    /**
     * Make a cancellable version of an async callback.
     *
     * @param {Function} fn
     * @return {Function}
     */

    function cancellable(fn) {
        var cb = function cb() {
            if (!cb.cancelled) {
                return fn.apply(this, arguments);
            }
        };
        cb.cancel = function () {
            cb.cancelled = true;
        };
        return cb;
    }

    /**
     * Check if two values are loosely equal - that is,
     * if they are plain objects, do they have the same shape?
     *
     * @param {*} a
     * @param {*} b
     * @return {Boolean}
     */

    function looseEqual(a, b) {
        /* eslint-disable eqeqeq */
        return a == b || (isObject(a) && isObject(b) ? JSON.stringify(a) === JSON.stringify(b) : false);
        /* eslint-enable eqeqeq */
    }

    var hasProto = ('__proto__' in {});

    // Browser environment sniffing
    var inBrowser = typeof window !== 'undefined' && Object.prototype.toString.call(window) !== '[object Object]';

    // detect devtools
    var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

    // UA sniffing for working around browser-specific quirks
    var UA = inBrowser && window.navigator.userAgent.toLowerCase();
    var isIE = UA && UA.indexOf('trident') > 0;
    var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
    var isAndroid = UA && UA.indexOf('android') > 0;
    var isIos = UA && /(iphone|ipad|ipod|ios)/i.test(UA);
    var iosVersionMatch = isIos && UA.match(/os ([\d_]+)/);
    var iosVersion = iosVersionMatch && iosVersionMatch[1].split('_');

    // detecting iOS UIWebView by indexedDB
    var hasMutationObserverBug = iosVersion && Number(iosVersion[0]) >= 9 && Number(iosVersion[1]) >= 3 && !window.indexedDB;

    var transitionProp = undefined;
    var transitionEndEvent = undefined;
    var animationProp = undefined;
    var animationEndEvent = undefined;

    // Transition property/event sniffing
    if (inBrowser && !isIE9) {
        var isWebkitTrans = window.ontransitionend === undefined && window.onwebkittransitionend !== undefined;
        var isWebkitAnim = window.onanimationend === undefined && window.onwebkitanimationend !== undefined;
        transitionProp = isWebkitTrans ? 'WebkitTransition' : 'transition';
        transitionEndEvent = isWebkitTrans ? 'webkitTransitionEnd' : 'transitionend';
        animationProp = isWebkitAnim ? 'WebkitAnimation' : 'animation';
        animationEndEvent = isWebkitAnim ? 'webkitAnimationEnd' : 'animationend';
    }

    /**
     * Defer a task to execute it asynchronously. Ideally this
     * should be executed as a microtask, so we leverage
     * MutationObserver if it's available, and fallback to
     * setTimeout(0).
     *
     * @param {Function} cb
     * @param {Object} ctx
     */

    var nextTick = (function () {
        var callbacks = [];
        var pending = false;
        var timerFunc;
        function nextTickHandler() {
            pending = false;
            var copies = callbacks.slice(0);
            callbacks = [];
            for (var i = 0; i < copies.length; i++) {
                copies[i]();
            }
        }

        /* istanbul ignore if */
        if (typeof MutationObserver !== 'undefined' && !hasMutationObserverBug) {
            var counter = 1;
            var observer = new MutationObserver(nextTickHandler);
            var textNode = document.createTextNode(counter);
            observer.observe(textNode, {
                characterData: true
            });
            timerFunc = function () {
                counter = (counter + 1) % 2;
                textNode.data = counter;
            };
        } else {
            // webpack attempts to inject a shim for setImmediate
            // if it is used as a global, so we have to work around that to
            // avoid bundling unnecessary code.
            var context = inBrowser ? window : typeof global !== 'undefined' ? global : {};
            timerFunc = context.setImmediate || setTimeout;
        }
        return function (cb, ctx) {
            var func = ctx ? function () {
                cb.call(ctx);
            } : cb;
            callbacks.push(func);
            if (pending) return;
            pending = true;
            timerFunc(nextTickHandler, 0);
        };
    })();

    var _Set = undefined;
    /* istanbul ignore if */
    if (typeof Set !== 'undefined' && Set.toString().match(/native code/)) {
        // use native Set when available.
        _Set = Set;
    } else {
        // a non-standard Set polyfill that only works with primitive keys.
        _Set = function () {
            this.set = Object.create(null);
        };
        _Set.prototype.has = function (key) {
            return this.set[key] !== undefined;
        };
        _Set.prototype.add = function (key) {
            this.set[key] = 1;
        };
        _Set.prototype.clear = function () {
            this.set = Object.create(null);
        };
    }

    function Cache(limit) {
        this.size = 0;
        this.limit = limit;
        this.head = this.tail = undefined;
        this._keymap = Object.create(null);
    }

    var p = Cache.prototype;

    /**
     * Put <value> into the cache associated with <key>.
     * Returns the entry which was removed to make room for
     * the new entry. Otherwise undefined is returned.
     * (i.e. if there was enough room already).
     *
     * @param {String} key
     * @param {*} value
     * @return {Entry|undefined}
     */

    p.put = function (key, value) {
        var removed;

        var entry = this.get(key, true);
        if (!entry) {
            if (this.size === this.limit) {
                removed = this.shift();
            }
            entry = {
                key: key
            };
            this._keymap[key] = entry;
            if (this.tail) {
                this.tail.newer = entry;
                entry.older = this.tail;
            } else {
                this.head = entry;
            }
            this.tail = entry;
            this.size++;
        }
        entry.value = value;

        return removed;
    };

    /**
     * Purge the least recently used (oldest) entry from the
     * cache. Returns the removed entry or undefined if the
     * cache was empty.
     */

    p.shift = function () {
        var entry = this.head;
        if (entry) {
            this.head = this.head.newer;
            this.head.older = undefined;
            entry.newer = entry.older = undefined;
            this._keymap[entry.key] = undefined;
            this.size--;
        }
        return entry;
    };

    /**
     * Get and register recent use of <key>. Returns the value
     * associated with <key> or undefined if not in cache.
     *
     * @param {String} key
     * @param {Boolean} returnEntry
     * @return {Entry|*}
     */

    p.get = function (key, returnEntry) {
        var entry = this._keymap[key];
        if (entry === undefined) return;
        if (entry === this.tail) {
            return returnEntry ? entry : entry.value;
        }
        // HEAD--------------TAIL
        //   <.older   .newer>
        //  <--- add direction --
        //   A  B  C  <D>  E
        if (entry.newer) {
            if (entry === this.head) {
                this.head = entry.newer;
            }
            entry.newer.older = entry.older; // C <-- E.
        }
        if (entry.older) {
            entry.older.newer = entry.newer; // C. --> E
        }
        entry.newer = undefined; // D --x
        entry.older = this.tail; // D. --> E
        if (this.tail) {
            this.tail.newer = entry; // E. <-- D
        }
        this.tail = entry;
        return returnEntry ? entry : entry.value;
    };

    var cache$1 = new Cache(1000);
    var filterTokenRE = /[^\s'"]+|'[^']*'|"[^"]*"/g;
    var reservedArgRE = /^in$|^-?\d+/;

    /**
     * Parser state
     */

    var str;
    var dir;
    var c;
    var prev;
    var i;
    var l;
    var lastFilterIndex;
    var inSingle;
    var inDouble;
    var curly;
    var square;
    var paren;
    /**
     * Push a filter to the current directive object
     */

    function pushFilter() {
        var exp = str.slice(lastFilterIndex, i).trim();
        var filter;
        if (exp) {
            filter = {};
            var tokens = exp.match(filterTokenRE);
            filter.name = tokens[0];
            if (tokens.length > 1) {
                filter.args = tokens.slice(1).map(processFilterArg);
            }
        }
        if (filter) {
            (dir.filters = dir.filters || []).push(filter);
        }
        lastFilterIndex = i + 1;
    }

    /**
     * Check if an argument is dynamic and strip quotes.
     *
     * @param {String} arg
     * @return {Object}
     */

    function processFilterArg(arg) {
        if (reservedArgRE.test(arg)) {
            return {
                value: toNumber(arg),
                dynamic: false
            };
        } else {
            var stripped = stripQuotes(arg);
            var dynamic = stripped === arg;
            return {
                value: dynamic ? arg : stripped,
                dynamic: dynamic
            };
        }
    }

    /**
     * Parse a directive value and extract the expression
     * and its filters into a descriptor.
     *
     * Example:
     *
     * "a + 1 | uppercase" will yield:
     * {
   *   expression: 'a + 1',
   *   filters: [
   *     { name: 'uppercase', args: null }
   *   ]
   * }
     *
     * @param {String} s
     * @return {Object}
     */

    function parseDirective(s) {
        var hit = cache$1.get(s);
        if (hit) {
            return hit;
        }

        // reset parser state
        str = s;
        inSingle = inDouble = false;
        curly = square = paren = 0;
        lastFilterIndex = 0;
        dir = {};

        for (i = 0, l = str.length; i < l; i++) {
            prev = c;
            c = str.charCodeAt(i);
            if (inSingle) {
                // check single quote
                if (c === 0x27 && prev !== 0x5C) inSingle = !inSingle;
            } else if (inDouble) {
                // check double quote
                if (c === 0x22 && prev !== 0x5C) inDouble = !inDouble;
            } else if (c === 0x7C && // pipe
                str.charCodeAt(i + 1) !== 0x7C && str.charCodeAt(i - 1) !== 0x7C) {
                if (dir.expression == null) {
                    // first filter, end of expression
                    lastFilterIndex = i + 1;
                    dir.expression = str.slice(0, i).trim();
                } else {
                    // already has filter
                    pushFilter();
                }
            } else {
                switch (c) {
                    case 0x22:
                        inDouble = true;break; // "
                    case 0x27:
                        inSingle = true;break; // '
                    case 0x28:
                        paren++;break; // (
                    case 0x29:
                        paren--;break; // )
                    case 0x5B:
                        square++;break; // [
                    case 0x5D:
                        square--;break; // ]
                    case 0x7B:
                        curly++;break; // {
                    case 0x7D:
                        curly--;break; // }
                }
            }
        }

        if (dir.expression == null) {
            dir.expression = str.slice(0, i).trim();
        } else if (lastFilterIndex !== 0) {
            pushFilter();
        }

        cache$1.put(s, dir);
        return dir;
    }

    var directive = Object.freeze({
        parseDirective: parseDirective
    });

    var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;
    var cache = undefined;
    var tagRE = undefined;
    var htmlRE = undefined;
    /**
     * Escape a string so it can be used in a RegExp
     * constructor.
     *
     * @param {String} str
     */

    function escapeRegex(str) {
        return str.replace(regexEscapeRE, '\\$&');
    }

    function compileRegex() {
        var open = escapeRegex(config.delimiters[0]);
        var close = escapeRegex(config.delimiters[1]);
        var unsafeOpen = escapeRegex(config.unsafeDelimiters[0]);
        var unsafeClose = escapeRegex(config.unsafeDelimiters[1]);
        tagRE = new RegExp(unsafeOpen + '((?:.|\\n)+?)' + unsafeClose + '|' + open + '((?:.|\\n)+?)' + close, 'g');
        htmlRE = new RegExp('^' + unsafeOpen + '((?:.|\\n)+?)' + unsafeClose + '$');
        // reset cache
        cache = new Cache(1000);
    }

    /**
     * Parse a template text string into an array of tokens.
     *
     * @param {String} text
     * @return {Array<Object> | null}
     *               - {String} type
     *               - {String} value
     *               - {Boolean} [html]
     *               - {Boolean} [oneTime]
     */

    function parseText(text) {
        if (!cache) {
            compileRegex();
        }
        var hit = cache.get(text);
        if (hit) {
            return hit;
        }
        if (!tagRE.test(text)) {
            return null;
        }
        var tokens = [];
        var lastIndex = tagRE.lastIndex = 0;
        var match, index, html, value, first, oneTime;
        /* eslint-disable no-cond-assign */
        while (match = tagRE.exec(text)) {
            /* eslint-enable no-cond-assign */
            index = match.index;
            // push text token
            if (index > lastIndex) {
                tokens.push({
                    value: text.slice(lastIndex, index)
                });
            }
            // tag token
            html = htmlRE.test(match[0]);
            value = html ? match[1] : match[2];
            first = value.charCodeAt(0);
            oneTime = first === 42; // *
            value = oneTime ? value.slice(1) : value;
            tokens.push({
                tag: true,
                value: value.trim(),
                html: html,
                oneTime: oneTime
            });
            lastIndex = index + match[0].length;
        }
        if (lastIndex < text.length) {
            tokens.push({
                value: text.slice(lastIndex)
            });
        }
        cache.put(text, tokens);
        return tokens;
    }

    /**
     * Format a list of tokens into an expression.
     * e.g. tokens parsed from 'a {{b}} c' can be serialized
     * into one single expression as '"a " + b + " c"'.
     *
     * @param {Array} tokens
     * @param {Vue} [vm]
     * @return {String}
     */

    function tokensToExp(tokens, vm) {
        if (tokens.length > 1) {
            return tokens.map(function (token) {
                return formatToken(token, vm);
            }).join('+');
        } else {
            return formatToken(tokens[0], vm, true);
        }
    }

    /**
     * Format a single token.
     *
     * @param {Object} token
     * @param {Vue} [vm]
     * @param {Boolean} [single]
     * @return {String}
     */

    function formatToken(token, vm, single) {
        return token.tag ? token.oneTime && vm ? '"' + vm.$eval(token.value) + '"' : inlineFilters(token.value, single) : '"' + token.value + '"';
    }

    /**
     * For an attribute with multiple interpolation tags,
     * e.g. attr="some-{{thing | filter}}", in order to combine
     * the whole thing into a single watchable expression, we
     * have to inline those filters. This function does exactly
     * that. This is a bit hacky but it avoids heavy changes
     * to directive parser and watcher mechanism.
     *
     * @param {String} exp
     * @param {Boolean} single
     * @return {String}
     */

    var filterRE = /[^|]\|[^|]/;
    function inlineFilters(exp, single) {
        if (!filterRE.test(exp)) {
            return single ? exp : '(' + exp + ')';
        } else {
            var dir = parseDirective(exp);
            if (!dir.filters) {
                return '(' + exp + ')';
            } else {
                return 'this._applyFilters(' + dir.expression + // value
                    ',null,' + // oldValue (null for read)
                    JSON.stringify(dir.filters) + // filter descriptors
                    ',false)'; // write?
            }
        }
    }

    var text = Object.freeze({
        compileRegex: compileRegex,
        parseText: parseText,
        tokensToExp: tokensToExp
    });

    var delimiters = ['{{', '}}'];
    var unsafeDelimiters = ['{{{', '}}}'];

    var config = Object.defineProperties({

        /**
         * Whether to print debug messages.
         * Also enables stack trace for warnings.
         *
         * @type {Boolean}
         */

        debug: false,

        /**
         * Whether to suppress warnings.
         *
         * @type {Boolean}
         */

        silent: false,

        /**
         * Whether to use async rendering.
         */

        async: true,

        /**
         * Whether to warn against errors caught when evaluating
         * expressions.
         */

        warnExpressionErrors: true,

        /**
         * Whether to allow devtools inspection.
         * Disabled by default in production builds.
         */

        devtools: 'development' !== 'production',

        /**
         * Internal flag to indicate the delimiters have been
         * changed.
         *
         * @type {Boolean}
         */

        _delimitersChanged: true,

        /**
         * List of asset types that a component can own.
         *
         * @type {Array}
         */

        _assetTypes: ['component', 'directive', 'elementDirective', 'filter', 'transition', 'partial'],

        /**
         * prop binding modes
         */

        _propBindingModes: {
            ONE_WAY: 0,
            TWO_WAY: 1,
            ONE_TIME: 2
        },

        /**
         * Max circular updates allowed in a batcher flush cycle.
         */

        _maxUpdateCount: 100

    }, {
        delimiters: { /**
         * Interpolation delimiters. Changing these would trigger
         * the text parser to re-compile the regular expressions.
         *
         * @type {Array<String>}
         */

        get: function get() {
            return delimiters;
        },
            set: function set(val) {
                delimiters = val;
                compileRegex();
            },
            configurable: true,
            enumerable: true
        },
        unsafeDelimiters: {
            get: function get() {
                return unsafeDelimiters;
            },
            set: function set(val) {
                unsafeDelimiters = val;
                compileRegex();
            },
            configurable: true,
            enumerable: true
        }
    });

    var warn = undefined;
    var formatComponentName = undefined;

    if ('development' !== 'production') {
        (function () {
            var hasConsole = typeof console !== 'undefined';

            warn = function (msg, vm) {
                if (hasConsole && !config.silent) {
                    console.error('[Vue warn]: ' + msg + (vm ? formatComponentName(vm) : ''));
                }
            };

            formatComponentName = function (vm) {
                var name = vm._isVue ? vm.$options.name : vm.name;
                return name ? ' (found in component: <' + hyphenate(name) + '>)' : '';
            };
        })();
    }

    /**
     * Append with transition.
     *
     * @param {Element} el
     * @param {Element} target
     * @param {Vue} vm
     * @param {Function} [cb]
     */

    function appendWithTransition(el, target, vm, cb) {
        applyTransition(el, 1, function () {
            target.appendChild(el);
        }, vm, cb);
    }

    /**
     * InsertBefore with transition.
     *
     * @param {Element} el
     * @param {Element} target
     * @param {Vue} vm
     * @param {Function} [cb]
     */

    function beforeWithTransition(el, target, vm, cb) {
        applyTransition(el, 1, function () {
            before(el, target);
        }, vm, cb);
    }

    /**
     * Remove with transition.
     *
     * @param {Element} el
     * @param {Vue} vm
     * @param {Function} [cb]
     */

    function removeWithTransition(el, vm, cb) {
        applyTransition(el, -1, function () {
            remove(el);
        }, vm, cb);
    }

    /**
     * Apply transitions with an operation callback.
     *
     * @param {Element} el
     * @param {Number} direction
     *                  1: enter
     *                 -1: leave
     * @param {Function} op - the actual DOM operation
     * @param {Vue} vm
     * @param {Function} [cb]
     */

    function applyTransition(el, direction, op, vm, cb) {
        var transition = el.__v_trans;
        if (!transition ||
            // skip if there are no js hooks and CSS transition is
            // not supported
            !transition.hooks && !transitionEndEvent ||
            // skip transitions for initial compile
            !vm._isCompiled ||
            // if the vm is being manipulated by a parent directive
            // during the parent's compilation phase, skip the
            // animation.
            vm.$parent && !vm.$parent._isCompiled) {
            op();
            if (cb) cb();
            return;
        }
        var action = direction > 0 ? 'enter' : 'leave';
        transition[action](op, cb);
    }

    var transition = Object.freeze({
        appendWithTransition: appendWithTransition,
        beforeWithTransition: beforeWithTransition,
        removeWithTransition: removeWithTransition,
        applyTransition: applyTransition
    });

    /**
     * Query an element selector if it's not an element already.
     *
     * @param {String|Element} el
     * @return {Element}
     */

    function query(el) {
        if (typeof el === 'string') {
            var selector = el;
            el = document.querySelector(el);
            if (!el) {
                'development' !== 'production' && warn('Cannot find element: ' + selector);
            }
        }
        return el;
    }

    /**
     * Check if a node is in the document.
     * Note: document.documentElement.contains should work here
     * but always returns false for comment nodes in phantomjs,
     * making unit tests difficult. This is fixed by doing the
     * contains() check on the node's parentNode instead of
     * the node itself.
     *
     * @param {Node} node
     * @return {Boolean}
     */

    function inDoc(node) {
        if (!node) return false;
        var doc = node.ownerDocument.documentElement;
        var parent = node.parentNode;
        return doc === node || doc === parent || !!(parent && parent.nodeType === 1 && doc.contains(parent));
    }

    /**
     * Get and remove an attribute from a node.
     *
     * @param {Node} node
     * @param {String} _attr
     */

    function getAttr(node, _attr) {
        var val = node.getAttribute(_attr);
        if (val !== null) {
            node.removeAttribute(_attr);
        }
        return val;
    }

    /**
     * Get an attribute with colon or v-bind: prefix.
     *
     * @param {Node} node
     * @param {String} name
     * @return {String|null}
     */

    function getBindAttr(node, name) {
        var val = getAttr(node, ':' + name);
        if (val === null) {
            val = getAttr(node, 'v-bind:' + name);
        }
        return val;
    }

    /**
     * Check the presence of a bind attribute.
     *
     * @param {Node} node
     * @param {String} name
     * @return {Boolean}
     */

    function hasBindAttr(node, name) {
        return node.hasAttribute(name) || node.hasAttribute(':' + name) || node.hasAttribute('v-bind:' + name);
    }

    /**
     * Insert el before target
     *
     * @param {Element} el
     * @param {Element} target
     */

    function before(el, target) {
        target.parentNode.insertBefore(el, target);
    }

    /**
     * Insert el after target
     *
     * @param {Element} el
     * @param {Element} target
     */

    function after(el, target) {
        if (target.nextSibling) {
            before(el, target.nextSibling);
        } else {
            target.parentNode.appendChild(el);
        }
    }

    /**
     * Remove el from DOM
     *
     * @param {Element} el
     */

    function remove(el) {
        el.parentNode.removeChild(el);
    }

    /**
     * Prepend el to target
     *
     * @param {Element} el
     * @param {Element} target
     */

    function prepend(el, target) {
        if (target.firstChild) {
            before(el, target.firstChild);
        } else {
            target.appendChild(el);
        }
    }

    /**
     * Replace target with el
     *
     * @param {Element} target
     * @param {Element} el
     */

    function replace(target, el) {
        var parent = target.parentNode;
        if (parent) {
            parent.replaceChild(el, target);
        }
    }

    /**
     * Add event listener shorthand.
     *
     * @param {Element} el
     * @param {String} event
     * @param {Function} cb
     * @param {Boolean} [useCapture]
     */

    function on(el, event, cb, useCapture) {
        el.addEventListener(event, cb, useCapture);
    }

    /**
     * Remove event listener shorthand.
     *
     * @param {Element} el
     * @param {String} event
     * @param {Function} cb
     */

    function off(el, event, cb) {
        el.removeEventListener(event, cb);
    }

    /**
     * For IE9 compat: when both class and :class are present
     * getAttribute('class') returns wrong value...
     *
     * @param {Element} el
     * @return {String}
     */

    function getClass(el) {
        var classname = el.className;
        if (typeof classname === 'object') {
            classname = classname.baseVal || '';
        }
        return classname;
    }

    /**
     * In IE9, setAttribute('class') will result in empty class
     * if the element also has the :class attribute; However in
     * PhantomJS, setting `className` does not work on SVG elements...
     * So we have to do a conditional check here.
     *
     * @param {Element} el
     * @param {String} cls
     */

    function setClass(el, cls) {
        /* istanbul ignore if */
        if (isIE9 && !/svg$/.test(el.namespaceURI)) {
            el.className = cls;
        } else {
            el.setAttribute('class', cls);
        }
    }

    /**
     * Add class with compatibility for IE & SVG
     *
     * @param {Element} el
     * @param {String} cls
     */

    function addClass(el, cls) {
        if (el.classList) {
            el.classList.add(cls);
        } else {
            var cur = ' ' + getClass(el) + ' ';
            if (cur.indexOf(' ' + cls + ' ') < 0) {
                setClass(el, (cur + cls).trim());
            }
        }
    }

    /**
     * Remove class with compatibility for IE & SVG
     *
     * @param {Element} el
     * @param {String} cls
     */

    function removeClass(el, cls) {
        if (el.classList) {
            el.classList.remove(cls);
        } else {
            var cur = ' ' + getClass(el) + ' ';
            var tar = ' ' + cls + ' ';
            while (cur.indexOf(tar) >= 0) {
                cur = cur.replace(tar, ' ');
            }
            setClass(el, cur.trim());
        }
        if (!el.className) {
            el.removeAttribute('class');
        }
    }

    /**
     * Extract raw content inside an element into a temporary
     * container div
     *
     * @param {Element} el
     * @param {Boolean} asFragment
     * @return {Element|DocumentFragment}
     */

    function extractContent(el, asFragment) {
        var child;
        var rawContent;
        /* istanbul ignore if */
        if (isTemplate(el) && isFragment(el.content)) {
            el = el.content;
        }
        if (el.hasChildNodes()) {
            trimNode(el);
            rawContent = asFragment ? document.createDocumentFragment() : document.createElement('div');
            /* eslint-disable no-cond-assign */
            while (child = el.firstChild) {
                /* eslint-enable no-cond-assign */
                rawContent.appendChild(child);
            }
        }
        return rawContent;
    }

    /**
     * Trim possible empty head/tail text and comment
     * nodes inside a parent.
     *
     * @param {Node} node
     */

    function trimNode(node) {
        var child;
        /* eslint-disable no-sequences */
        while ((child = node.firstChild, isTrimmable(child))) {
            node.removeChild(child);
        }
        while ((child = node.lastChild, isTrimmable(child))) {
            node.removeChild(child);
        }
        /* eslint-enable no-sequences */
    }

    function isTrimmable(node) {
        return node && (node.nodeType === 3 && !node.data.trim() || node.nodeType === 8);
    }

    /**
     * Check if an element is a template tag.
     * Note if the template appears inside an SVG its tagName
     * will be in lowercase.
     *
     * @param {Element} el
     */

    function isTemplate(el) {
        return el.tagName && el.tagName.toLowerCase() === 'template';
    }

    /**
     * Create an "anchor" for performing dom insertion/removals.
     * This is used in a number of scenarios:
     * - fragment instance
     * - v-html
     * - v-if
     * - v-for
     * - component
     *
     * @param {String} content
     * @param {Boolean} persist - IE trashes empty textNodes on
     *                            cloneNode(true), so in certain
     *                            cases the anchor needs to be
     *                            non-empty to be persisted in
     *                            templates.
     * @return {Comment|Text}
     */

    function createAnchor(content, persist) {
        var anchor = config.debug ? document.createComment(content) : document.createTextNode(persist ? ' ' : '');
        anchor.__v_anchor = true;
        return anchor;
    }

    /**
     * Find a component ref attribute that starts with $.
     *
     * @param {Element} node
     * @return {String|undefined}
     */

    var refRE = /^v-ref:/;

    function findRef(node) {
        if (node.hasAttributes()) {
            var attrs = node.attributes;
            for (var i = 0, l = attrs.length; i < l; i++) {
                var name = attrs[i].name;
                if (refRE.test(name)) {
                    return camelize(name.replace(refRE, ''));
                }
            }
        }
    }

    /**
     * Map a function to a range of nodes .
     *
     * @param {Node} node
     * @param {Node} end
     * @param {Function} op
     */

    function mapNodeRange(node, end, op) {
        var next;
        while (node !== end) {
            next = node.nextSibling;
            op(node);
            node = next;
        }
        op(end);
    }

    /**
     * Remove a range of nodes with transition, store
     * the nodes in a fragment with correct ordering,
     * and call callback when done.
     *
     * @param {Node} start
     * @param {Node} end
     * @param {Vue} vm
     * @param {DocumentFragment} frag
     * @param {Function} cb
     */

    function removeNodeRange(start, end, vm, frag, cb) {
        var done = false;
        var removed = 0;
        var nodes = [];
        mapNodeRange(start, end, function (node) {
            if (node === end) done = true;
            nodes.push(node);
            removeWithTransition(node, vm, onRemoved);
        });
        function onRemoved() {
            removed++;
            if (done && removed >= nodes.length) {
                for (var i = 0; i < nodes.length; i++) {
                    frag.appendChild(nodes[i]);
                }
                cb && cb();
            }
        }
    }

    /**
     * Check if a node is a DocumentFragment.
     *
     * @param {Node} node
     * @return {Boolean}
     */

    function isFragment(node) {
        return node && node.nodeType === 11;
    }

    /**
     * Get outerHTML of elements, taking care
     * of SVG elements in IE as well.
     *
     * @param {Element} el
     * @return {String}
     */

    function getOuterHTML(el) {
        if (el.outerHTML) {
            return el.outerHTML;
        } else {
            var container = document.createElement('div');
            container.appendChild(el.cloneNode(true));
            return container.innerHTML;
        }
    }

    var commonTagRE = /^(div|p|span|img|a|b|i|br|ul|ol|li|h1|h2|h3|h4|h5|h6|code|pre|table|th|td|tr|form|label|input|select|option|nav|article|section|header|footer)$/i;
    var reservedTagRE = /^(slot|partial|component)$/i;

    var isUnknownElement = undefined;
    if ('development' !== 'production') {
        isUnknownElement = function (el, tag) {
            if (tag.indexOf('-') > -1) {
                // http://stackoverflow.com/a/28210364/1070244
                return el.constructor === window.HTMLUnknownElement || el.constructor === window.HTMLElement;
            } else {
                return (/HTMLUnknownElement/.test(el.toString()) &&
                    // Chrome returns unknown for several HTML5 elements.
                    // https://code.google.com/p/chromium/issues/detail?id=540526
                    // Firefox returns unknown for some "Interactive elements."
                    !/^(data|time|rtc|rb|details|dialog|summary)$/.test(tag)
                    );
            }
        };
    }

    /**
     * Check if an element is a component, if yes return its
     * component id.
     *
     * @param {Element} el
     * @param {Object} options
     * @return {Object|undefined}
     */

    function checkComponentAttr(el, options) {
        var tag = el.tagName.toLowerCase();
        var hasAttrs = el.hasAttributes();
        if (!commonTagRE.test(tag) && !reservedTagRE.test(tag)) {
            if (resolveAsset(options, 'components', tag)) {
                return { id: tag };
            } else {
                var is = hasAttrs && getIsBinding(el, options);
                if (is) {
                    return is;
                } else if ('development' !== 'production') {
                    var expectedTag = options._componentNameMap && options._componentNameMap[tag];
                    if (expectedTag) {
                        warn('Unknown custom element: <' + tag + '> - ' + 'did you mean <' + expectedTag + '>? ' + 'HTML is case-insensitive, remember to use kebab-case in templates.');
                    } else if (isUnknownElement(el, tag)) {
                        warn('Unknown custom element: <' + tag + '> - did you ' + 'register the component correctly? For recursive components, ' + 'make sure to provide the "name" option.');
                    }
                }
            }
        } else if (hasAttrs) {
            return getIsBinding(el, options);
        }
    }

    /**
     * Get "is" binding from an element.
     *
     * @param {Element} el
     * @param {Object} options
     * @return {Object|undefined}
     */

    function getIsBinding(el, options) {
        // dynamic syntax
        var exp = el.getAttribute('is');
        if (exp != null) {
            if (resolveAsset(options, 'components', exp)) {
                el.removeAttribute('is');
                return { id: exp };
            }
        } else {
            exp = getBindAttr(el, 'is');
            if (exp != null) {
                return { id: exp, dynamic: true };
            }
        }
    }

    /**
     * Option overwriting strategies are functions that handle
     * how to merge a parent option value and a child option
     * value into the final value.
     *
     * All strategy functions follow the same signature:
     *
     * @param {*} parentVal
     * @param {*} childVal
     * @param {Vue} [vm]
     */

    var strats = config.optionMergeStrategies = Object.create(null);

    /**
     * Helper that recursively merges two data objects together.
     */

    function mergeData(to, from) {
        var key, toVal, fromVal;
        for (key in from) {
            toVal = to[key];
            fromVal = from[key];
            if (!hasOwn(to, key)) {
                set(to, key, fromVal);
            } else if (isObject(toVal) && isObject(fromVal)) {
                mergeData(toVal, fromVal);
            }
        }
        return to;
    }

    /**
     * Data
     */

    strats.data = function (parentVal, childVal, vm) {
        if (!vm) {
            // in a Vue.extend merge, both should be functions
            if (!childVal) {
                return parentVal;
            }
            if (typeof childVal !== 'function') {
                'development' !== 'production' && warn('The "data" option should be a function ' + 'that returns a per-instance value in component ' + 'definitions.', vm);
                return parentVal;
            }
            if (!parentVal) {
                return childVal;
            }
            // when parentVal & childVal are both present,
            // we need to return a function that returns the
            // merged result of both functions... no need to
            // check if parentVal is a function here because
            // it has to be a function to pass previous merges.
            return function mergedDataFn() {
                return mergeData(childVal.call(this), parentVal.call(this));
            };
        } else if (parentVal || childVal) {
            return function mergedInstanceDataFn() {
                // instance merge
                var instanceData = typeof childVal === 'function' ? childVal.call(vm) : childVal;
                var defaultData = typeof parentVal === 'function' ? parentVal.call(vm) : undefined;
                if (instanceData) {
                    return mergeData(instanceData, defaultData);
                } else {
                    return defaultData;
                }
            };
        }
    };

    /**
     * El
     */

    strats.el = function (parentVal, childVal, vm) {
        if (!vm && childVal && typeof childVal !== 'function') {
            'development' !== 'production' && warn('The "el" option should be a function ' + 'that returns a per-instance value in component ' + 'definitions.', vm);
            return;
        }
        var ret = childVal || parentVal;
        // invoke the element factory if this is instance merge
        return vm && typeof ret === 'function' ? ret.call(vm) : ret;
    };

    /**
     * Hooks and param attributes are merged as arrays.
     */

    strats.init = strats.created = strats.ready = strats.attached = strats.detached = strats.beforeCompile = strats.compiled = strats.beforeDestroy = strats.destroyed = strats.activate = function (parentVal, childVal) {
        return childVal ? parentVal ? parentVal.concat(childVal) : isArray(childVal) ? childVal : [childVal] : parentVal;
    };

    /**
     * Assets
     *
     * When a vm is present (instance creation), we need to do
     * a three-way merge between constructor options, instance
     * options and parent options.
     */

    function mergeAssets(parentVal, childVal) {
        var res = Object.create(parentVal || null);
        return childVal ? extend(res, guardArrayAssets(childVal)) : res;
    }

    config._assetTypes.forEach(function (type) {
        strats[type + 's'] = mergeAssets;
    });

    /**
     * Events & Watchers.
     *
     * Events & watchers hashes should not overwrite one
     * another, so we merge them as arrays.
     */

    strats.watch = strats.events = function (parentVal, childVal) {
        if (!childVal) return parentVal;
        if (!parentVal) return childVal;
        var ret = {};
        extend(ret, parentVal);
        for (var key in childVal) {
            var parent = ret[key];
            var child = childVal[key];
            if (parent && !isArray(parent)) {
                parent = [parent];
            }
            ret[key] = parent ? parent.concat(child) : [child];
        }
        return ret;
    };

    /**
     * Other object hashes.
     */

    strats.props = strats.methods = strats.computed = function (parentVal, childVal) {
        if (!childVal) return parentVal;
        if (!parentVal) return childVal;
        var ret = Object.create(null);
        extend(ret, parentVal);
        extend(ret, childVal);
        return ret;
    };

    /**
     * Default strategy.
     */

    var defaultStrat = function defaultStrat(parentVal, childVal) {
        return childVal === undefined ? parentVal : childVal;
    };

    /**
     * Make sure component options get converted to actual
     * constructors.
     *
     * @param {Object} options
     */

    function guardComponents(options) {
        if (options.components) {
            var components = options.components = guardArrayAssets(options.components);
            var ids = Object.keys(components);
            var def;
            if ('development' !== 'production') {
                var map = options._componentNameMap = {};
            }
            for (var i = 0, l = ids.length; i < l; i++) {
                var key = ids[i];
                if (commonTagRE.test(key) || reservedTagRE.test(key)) {
                    'development' !== 'production' && warn('Do not use built-in or reserved HTML elements as component ' + 'id: ' + key);
                    continue;
                }
                // record a all lowercase <-> kebab-case mapping for
                // possible custom element case error warning
                if ('development' !== 'production') {
                    map[key.replace(/-/g, '').toLowerCase()] = hyphenate(key);
                }
                def = components[key];
                if (isPlainObject(def)) {
                    components[key] = Vue.extend(def);
                }
            }
        }
    }

    /**
     * Ensure all props option syntax are normalized into the
     * Object-based format.
     *
     * @param {Object} options
     */

    function guardProps(options) {
        var props = options.props;
        var i, val;
        if (isArray(props)) {
            options.props = {};
            i = props.length;
            while (i--) {
                val = props[i];
                if (typeof val === 'string') {
                    options.props[val] = null;
                } else if (val.name) {
                    options.props[val.name] = val;
                }
            }
        } else if (isPlainObject(props)) {
            var keys = Object.keys(props);
            i = keys.length;
            while (i--) {
                val = props[keys[i]];
                if (typeof val === 'function') {
                    props[keys[i]] = { type: val };
                }
            }
        }
    }

    /**
     * Guard an Array-format assets option and converted it
     * into the key-value Object format.
     *
     * @param {Object|Array} assets
     * @return {Object}
     */

    function guardArrayAssets(assets) {
        if (isArray(assets)) {
            var res = {};
            var i = assets.length;
            var asset;
            while (i--) {
                asset = assets[i];
                var id = typeof asset === 'function' ? asset.options && asset.options.name || asset.id : asset.name || asset.id;
                if (!id) {
                    'development' !== 'production' && warn('Array-syntax assets must provide a "name" or "id" field.');
                } else {
                    res[id] = asset;
                }
            }
            return res;
        }
        return assets;
    }

    /**
     * Merge two option objects into a new one.
     * Core utility used in both instantiation and inheritance.
     *
     * @param {Object} parent
     * @param {Object} child
     * @param {Vue} [vm] - if vm is present, indicates this is
     *                     an instantiation merge.
     */

    function mergeOptions(parent, child, vm) {
        guardComponents(child);
        guardProps(child);
        if ('development' !== 'production') {
            if (child.propsData && !vm) {
                warn('propsData can only be used as an instantiation option.');
            }
        }
        var options = {};
        var key;
        if (child['extends']) {
            parent = typeof child['extends'] === 'function' ? mergeOptions(parent, child['extends'].options, vm) : mergeOptions(parent, child['extends'], vm);
        }
        if (child.mixins) {
            for (var i = 0, l = child.mixins.length; i < l; i++) {
                var mixin = child.mixins[i];
                var mixinOptions = mixin.prototype instanceof Vue ? mixin.options : mixin;
                parent = mergeOptions(parent, mixinOptions, vm);
            }
        }
        for (key in parent) {
            mergeField(key);
        }
        for (key in child) {
            if (!hasOwn(parent, key)) {
                mergeField(key);
            }
        }
        function mergeField(key) {
            var strat = strats[key] || defaultStrat;
            options[key] = strat(parent[key], child[key], vm, key);
        }
        return options;
    }

    /**
     * Resolve an asset.
     * This function is used because child instances need access
     * to assets defined in its ancestor chain.
     *
     * @param {Object} options
     * @param {String} type
     * @param {String} id
     * @param {Boolean} warnMissing
     * @return {Object|Function}
     */

    function resolveAsset(options, type, id, warnMissing) {
        /* istanbul ignore if */
        if (typeof id !== 'string') {
            return;
        }
        var assets = options[type];
        var camelizedId;
        var res = assets[id] ||
            // camelCase ID
            assets[camelizedId = camelize(id)] ||
            // Pascal Case ID
            assets[camelizedId.charAt(0).toUpperCase() + camelizedId.slice(1)];
        if ('development' !== 'production' && warnMissing && !res) {
            warn('Failed to resolve ' + type.slice(0, -1) + ': ' + id, options);
        }
        return res;
    }

    var uid$1 = 0;

    /**
     * A dep is an observable that can have multiple
     * directives subscribing to it.
     *
     * @constructor
     */
    function Dep() {
        this.id = uid$1++;
        this.subs = [];
    }

    // the current target watcher being evaluated.
    // this is globally unique because there could be only one
    // watcher being evaluated at any time.
    Dep.target = null;

    /**
     * Add a directive subscriber.
     *
     * @param {Directive} sub
     */

    Dep.prototype.addSub = function (sub) {
        this.subs.push(sub);
    };

    /**
     * Remove a directive subscriber.
     *
     * @param {Directive} sub
     */

    Dep.prototype.removeSub = function (sub) {
        this.subs.$remove(sub);
    };

    /**
     * Add self as a dependency to the target watcher.
     */

    Dep.prototype.depend = function () {
        Dep.target.addDep(this);
    };

    /**
     * Notify all subscribers of a new value.
     */

    Dep.prototype.notify = function () {
        // stablize the subscriber list first
        var subs = toArray(this.subs);
        for (var i = 0, l = subs.length; i < l; i++) {
            subs[i].update();
        }
    };

    var arrayProto = Array.prototype;
    var arrayMethods = Object.create(arrayProto)

    /**
     * Intercept mutating methods and emit events
     */

        ;['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
        // cache original method
        var original = arrayProto[method];
        def(arrayMethods, method, function mutator() {
            // avoid leaking arguments:
            // http://jsperf.com/closure-with-arguments
            var i = arguments.length;
            var args = new Array(i);
            while (i--) {
                args[i] = arguments[i];
            }
            var result = original.apply(this, args);
            var ob = this.__ob__;
            var inserted;
            switch (method) {
                case 'push':
                    inserted = args;
                    break;
                case 'unshift':
                    inserted = args;
                    break;
                case 'splice':
                    inserted = args.slice(2);
                    break;
            }
            if (inserted) ob.observeArray(inserted);
            // notify change
            ob.dep.notify();
            return result;
        });
    });

    /**
     * Swap the element at the given index with a new value
     * and emits corresponding event.
     *
     * @param {Number} index
     * @param {*} val
     * @return {*} - replaced element
     */

    def(arrayProto, '$set', function $set(index, val) {
        if (index >= this.length) {
            this.length = Number(index) + 1;
        }
        return this.splice(index, 1, val)[0];
    });

    /**
     * Convenience method to remove the element at given index or target element reference.
     *
     * @param {*} item
     */

    def(arrayProto, '$remove', function $remove(item) {
        /* istanbul ignore if */
        if (!this.length) return;
        var index = indexOf(this, item);
        if (index > -1) {
            return this.splice(index, 1);
        }
    });

    var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

    /**
     * By default, when a reactive property is set, the new value is
     * also converted to become reactive. However in certain cases, e.g.
     * v-for scope alias and props, we don't want to force conversion
     * because the value may be a nested value under a frozen data structure.
     *
     * So whenever we want to set a reactive property without forcing
     * conversion on the new value, we wrap that call inside this function.
     */

    var shouldConvert = true;

    function withoutConversion(fn) {
        shouldConvert = false;
        fn();
        shouldConvert = true;
    }

    /**
     * Observer class that are attached to each observed
     * object. Once attached, the observer converts target
     * object's property keys into getter/setters that
     * collect dependencies and dispatches updates.
     *
     * @param {Array|Object} value
     * @constructor
     */

    function Observer(value) {
        this.value = value;
        this.dep = new Dep();
        def(value, '__ob__', this);
        if (isArray(value)) {
            var augment = hasProto ? protoAugment : copyAugment;
            augment(value, arrayMethods, arrayKeys);
            this.observeArray(value);
        } else {
            this.walk(value);
        }
    }

    // Instance methods

    /**
     * Walk through each property and convert them into
     * getter/setters. This method should only be called when
     * value type is Object.
     *
     * @param {Object} obj
     */

    Observer.prototype.walk = function (obj) {
        var keys = Object.keys(obj);
        for (var i = 0, l = keys.length; i < l; i++) {
            this.convert(keys[i], obj[keys[i]]);
        }
    };

    /**
     * Observe a list of Array items.
     *
     * @param {Array} items
     */

    Observer.prototype.observeArray = function (items) {
        for (var i = 0, l = items.length; i < l; i++) {
            observe(items[i]);
        }
    };

    /**
     * Convert a property into getter/setter so we can emit
     * the events when the property is accessed/changed.
     *
     * @param {String} key
     * @param {*} val
     */

    Observer.prototype.convert = function (key, val) {
        defineReactive(this.value, key, val);
    };

    /**
     * Add an owner vm, so that when $set/$delete mutations
     * happen we can notify owner vms to proxy the keys and
     * digest the watchers. This is only called when the object
     * is observed as an instance's root $data.
     *
     * @param {Vue} vm
     */

    Observer.prototype.addVm = function (vm) {
        (this.vms || (this.vms = [])).push(vm);
    };

    /**
     * Remove an owner vm. This is called when the object is
     * swapped out as an instance's $data object.
     *
     * @param {Vue} vm
     */

    Observer.prototype.removeVm = function (vm) {
        this.vms.$remove(vm);
    };

    // helpers

    /**
     * Augment an target Object or Array by intercepting
     * the prototype chain using __proto__
     *
     * @param {Object|Array} target
     * @param {Object} src
     */

    function protoAugment(target, src) {
        /* eslint-disable no-proto */
        target.__proto__ = src;
        /* eslint-enable no-proto */
    }

    /**
     * Augment an target Object or Array by defining
     * hidden properties.
     *
     * @param {Object|Array} target
     * @param {Object} proto
     */

    function copyAugment(target, src, keys) {
        for (var i = 0, l = keys.length; i < l; i++) {
            var key = keys[i];
            def(target, key, src[key]);
        }
    }

    /**
     * Attempt to create an observer instance for a value,
     * returns the new observer if successfully observed,
     * or the existing observer if the value already has one.
     *
     * @param {*} value
     * @param {Vue} [vm]
     * @return {Observer|undefined}
     * @static
     */

    function observe(value, vm) {
        if (!value || typeof value !== 'object') {
            return;
        }
        var ob;
        if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
            ob = value.__ob__;
        } else if (shouldConvert && (isArray(value) || isPlainObject(value)) && Object.isExtensible(value) && !value._isVue) {
            ob = new Observer(value);
        }
        if (ob && vm) {
            ob.addVm(vm);
        }
        return ob;
    }

    /**
     * Define a reactive property on an Object.
     *
     * @param {Object} obj
     * @param {String} key
     * @param {*} val
     */

    function defineReactive(obj, key, val) {
        var dep = new Dep();

        var property = Object.getOwnPropertyDescriptor(obj, key);
        if (property && property.configurable === false) {
            return;
        }

        // cater for pre-defined getter/setters
        var getter = property && property.get;
        var setter = property && property.set;

        var childOb = observe(val);
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get: function reactiveGetter() {
                var value = getter ? getter.call(obj) : val;
                if (Dep.target) {
                    dep.depend();
                    if (childOb) {
                        childOb.dep.depend();
                    }
                    if (isArray(value)) {
                        for (var e, i = 0, l = value.length; i < l; i++) {
                            e = value[i];
                            e && e.__ob__ && e.__ob__.dep.depend();
                        }
                    }
                }
                return value;
            },
            set: function reactiveSetter(newVal) {
                var value = getter ? getter.call(obj) : val;
                if (newVal === value) {
                    return;
                }
                if (setter) {
                    setter.call(obj, newVal);
                } else {
                    val = newVal;
                }
                childOb = observe(newVal);
                dep.notify();
            }
        });
    }



    var util = Object.freeze({
        defineReactive: defineReactive,
        set: set,
        del: del,
        hasOwn: hasOwn,
        isLiteral: isLiteral,
        isReserved: isReserved,
        _toString: _toString,
        toNumber: toNumber,
        toBoolean: toBoolean,
        stripQuotes: stripQuotes,
        camelize: camelize,
        hyphenate: hyphenate,
        classify: classify,
        bind: bind,
        toArray: toArray,
        extend: extend,
        isObject: isObject,
        isPlainObject: isPlainObject,
        def: def,
        debounce: _debounce,
        indexOf: indexOf,
        cancellable: cancellable,
        looseEqual: looseEqual,
        isArray: isArray,
        hasProto: hasProto,
        inBrowser: inBrowser,
        devtools: devtools,
        isIE: isIE,
        isIE9: isIE9,
        isAndroid: isAndroid,
        isIos: isIos,
        iosVersionMatch: iosVersionMatch,
        iosVersion: iosVersion,
        hasMutationObserverBug: hasMutationObserverBug,
        get transitionProp () { return transitionProp; },
        get transitionEndEvent () { return transitionEndEvent; },
        get animationProp () { return animationProp; },
        get animationEndEvent () { return animationEndEvent; },
        nextTick: nextTick,
        get _Set () { return _Set; },
        query: query,
        inDoc: inDoc,
        getAttr: getAttr,
        getBindAttr: getBindAttr,
        hasBindAttr: hasBindAttr,
        before: before,
        after: after,
        remove: remove,
        prepend: prepend,
        replace: replace,
        on: on,
        off: off,
        setClass: setClass,
        addClass: addClass,
        removeClass: removeClass,
        extractContent: extractContent,
        trimNode: trimNode,
        isTemplate: isTemplate,
        createAnchor: createAnchor,
        findRef: findRef,
        mapNodeRange: mapNodeRange,
        removeNodeRange: removeNodeRange,
        isFragment: isFragment,
        getOuterHTML: getOuterHTML,
        mergeOptions: mergeOptions,
        resolveAsset: resolveAsset,
        checkComponentAttr: checkComponentAttr,
        commonTagRE: commonTagRE,
        reservedTagRE: reservedTagRE,
        get warn () { return warn; }
    });

    var uid = 0;

    function initMixin (Vue) {
        /**
         * The main init sequence. This is called for every
         * instance, including ones that are created from extended
         * constructors.
         *
         * @param {Object} options - this options object should be
         *                           the result of merging class
         *                           options and the options passed
         *                           in to the constructor.
         */

        Vue.prototype._init = function (options) {
            options = options || {};

            this.$el = null;
            this.$parent = options.parent;
            this.$root = this.$parent ? this.$parent.$root : this;
            this.$children = [];
            this.$refs = {}; // child vm references
            this.$els = {}; // element references
            this._watchers = []; // all watchers as an array
            this._directives = []; // all directives

            // a uid
            this._uid = uid++;

            // a flag to avoid this being observed
            this._isVue = true;

            // events bookkeeping
            this._events = {}; // registered callbacks
            this._eventsCount = {}; // for $broadcast optimization

            // fragment instance properties
            this._isFragment = false;
            this._fragment = // @type {DocumentFragment}
                this._fragmentStart = // @type {Text|Comment}
                    this._fragmentEnd = null; // @type {Text|Comment}

            // lifecycle state
            this._isCompiled = this._isDestroyed = this._isReady = this._isAttached = this._isBeingDestroyed = this._vForRemoving = false;
            this._unlinkFn = null;

            // context:
            // if this is a transcluded component, context
            // will be the common parent vm of this instance
            // and its host.
            this._context = options._context || this.$parent;

            // scope:
            // if this is inside an inline v-for, the scope
            // will be the intermediate scope created for this
            // repeat fragment. this is used for linking props
            // and container directives.
            this._scope = options._scope;

            // fragment:
            // if this instance is compiled inside a Fragment, it
            // needs to reigster itself as a child of that fragment
            // for attach/detach to work properly.
            this._frag = options._frag;
            if (this._frag) {
                this._frag.children.push(this);
            }

            // push self into parent / transclusion host
            if (this.$parent) {
                this.$parent.$children.push(this);
            }

            // merge options.
            options = this.$options = mergeOptions(this.constructor.options, options, this);

            // set ref
            this._updateRef();

            // initialize data as empty object.
            // it will be filled up in _initData().
            this._data = {};

            // call init hook
            this._callHook('init');

            // initialize data observation and scope inheritance.
            this._initState();

            // setup event system and option events.
            this._initEvents();

            // call created hook
            this._callHook('created');

            // if `el` option is passed, start compilation.
            if (options.el) {
                this.$mount(options.el);
            }
        };
    }

    var pathCache = new Cache(1000);

    // actions
    var APPEND = 0;
    var PUSH = 1;
    var INC_SUB_PATH_DEPTH = 2;
    var PUSH_SUB_PATH = 3;

    // states
    var BEFORE_PATH = 0;
    var IN_PATH = 1;
    var BEFORE_IDENT = 2;
    var IN_IDENT = 3;
    var IN_SUB_PATH = 4;
    var IN_SINGLE_QUOTE = 5;
    var IN_DOUBLE_QUOTE = 6;
    var AFTER_PATH = 7;
    var ERROR = 8;

    var pathStateMachine = [];

    pathStateMachine[BEFORE_PATH] = {
        'ws': [BEFORE_PATH],
        'ident': [IN_IDENT, APPEND],
        '[': [IN_SUB_PATH],
        'eof': [AFTER_PATH]
    };

    pathStateMachine[IN_PATH] = {
        'ws': [IN_PATH],
        '.': [BEFORE_IDENT],
        '[': [IN_SUB_PATH],
        'eof': [AFTER_PATH]
    };

    pathStateMachine[BEFORE_IDENT] = {
        'ws': [BEFORE_IDENT],
        'ident': [IN_IDENT, APPEND]
    };

    pathStateMachine[IN_IDENT] = {
        'ident': [IN_IDENT, APPEND],
        '0': [IN_IDENT, APPEND],
        'number': [IN_IDENT, APPEND],
        'ws': [IN_PATH, PUSH],
        '.': [BEFORE_IDENT, PUSH],
        '[': [IN_SUB_PATH, PUSH],
        'eof': [AFTER_PATH, PUSH]
    };

    pathStateMachine[IN_SUB_PATH] = {
        "'": [IN_SINGLE_QUOTE, APPEND],
        '"': [IN_DOUBLE_QUOTE, APPEND],
        '[': [IN_SUB_PATH, INC_SUB_PATH_DEPTH],
        ']': [IN_PATH, PUSH_SUB_PATH],
        'eof': ERROR,
        'else': [IN_SUB_PATH, APPEND]
    };

    pathStateMachine[IN_SINGLE_QUOTE] = {
        "'": [IN_SUB_PATH, APPEND],
        'eof': ERROR,
        'else': [IN_SINGLE_QUOTE, APPEND]
    };

    pathStateMachine[IN_DOUBLE_QUOTE] = {
        '"': [IN_SUB_PATH, APPEND],
        'eof': ERROR,
        'else': [IN_DOUBLE_QUOTE, APPEND]
    };

    /**
     * Determine the type of a character in a keypath.
     *
     * @param {Char} ch
     * @return {String} type
     */

    function getPathCharType(ch) {
        if (ch === undefined) {
            return 'eof';
        }

        var code = ch.charCodeAt(0);

        switch (code) {
            case 0x5B: // [
            case 0x5D: // ]
            case 0x2E: // .
            case 0x22: // "
            case 0x27: // '
            case 0x30:
                // 0
                return ch;

            case 0x5F: // _
            case 0x24:
                // $
                return 'ident';

            case 0x20: // Space
            case 0x09: // Tab
            case 0x0A: // Newline
            case 0x0D: // Return
            case 0xA0: // No-break space
            case 0xFEFF: // Byte Order Mark
            case 0x2028: // Line Separator
            case 0x2029:
                // Paragraph Separator
                return 'ws';
        }

        // a-z, A-Z
        if (code >= 0x61 && code <= 0x7A || code >= 0x41 && code <= 0x5A) {
            return 'ident';
        }

        // 1-9
        if (code >= 0x31 && code <= 0x39) {
            return 'number';
        }

        return 'else';
    }

    /**
     * Format a subPath, return its plain form if it is
     * a literal string or number. Otherwise prepend the
     * dynamic indicator (*).
     *
     * @param {String} path
     * @return {String}
     */

    function formatSubPath(path) {
        var trimmed = path.trim();
        // invalid leading 0
        if (path.charAt(0) === '0' && isNaN(path)) {
            return false;
        }
        return isLiteral(trimmed) ? stripQuotes(trimmed) : '*' + trimmed;
    }

    /**
     * Parse a string path into an array of segments
     *
     * @param {String} path
     * @return {Array|undefined}
     */

    function parse(path) {
        var keys = [];
        var index = -1;
        var mode = BEFORE_PATH;
        var subPathDepth = 0;
        var c, newChar, key, type, transition, action, typeMap;

        var actions = [];

        actions[PUSH] = function () {
            if (key !== undefined) {
                keys.push(key);
                key = undefined;
            }
        };

        actions[APPEND] = function () {
            if (key === undefined) {
                key = newChar;
            } else {
                key += newChar;
            }
        };

        actions[INC_SUB_PATH_DEPTH] = function () {
            actions[APPEND]();
            subPathDepth++;
        };

        actions[PUSH_SUB_PATH] = function () {
            if (subPathDepth > 0) {
                subPathDepth--;
                mode = IN_SUB_PATH;
                actions[APPEND]();
            } else {
                subPathDepth = 0;
                key = formatSubPath(key);
                if (key === false) {
                    return false;
                } else {
                    actions[PUSH]();
                }
            }
        };

        function maybeUnescapeQuote() {
            var nextChar = path[index + 1];
            if (mode === IN_SINGLE_QUOTE && nextChar === "'" || mode === IN_DOUBLE_QUOTE && nextChar === '"') {
                index++;
                newChar = '\\' + nextChar;
                actions[APPEND]();
                return true;
            }
        }

        while (mode != null) {
            index++;
            c = path[index];

            if (c === '\\' && maybeUnescapeQuote()) {
                continue;
            }

            type = getPathCharType(c);
            typeMap = pathStateMachine[mode];
            transition = typeMap[type] || typeMap['else'] || ERROR;

            if (transition === ERROR) {
                return; // parse error
            }

            mode = transition[0];
            action = actions[transition[1]];
            if (action) {
                newChar = transition[2];
                newChar = newChar === undefined ? c : newChar;
                if (action() === false) {
                    return;
                }
            }

            if (mode === AFTER_PATH) {
                keys.raw = path;
                return keys;
            }
        }
    }

    /**
     * External parse that check for a cache hit first
     *
     * @param {String} path
     * @return {Array|undefined}
     */

    function parsePath(path) {
        var hit = pathCache.get(path);
        if (!hit) {
            hit = parse(path);
            if (hit) {
                pathCache.put(path, hit);
            }
        }
        return hit;
    }

    /**
     * Get from an object from a path string
     *
     * @param {Object} obj
     * @param {String} path
     */

    function getPath(obj, path) {
        return parseExpression(path).get(obj);
    }

    /**
     * Warn against setting non-existent root path on a vm.
     */

    var warnNonExistent;
    if ('development' !== 'production') {
        warnNonExistent = function (path, vm) {
            warn('You are setting a non-existent path "' + path.raw + '" ' + 'on a vm instance. Consider pre-initializing the property ' + 'with the "data" option for more reliable reactivity ' + 'and better performance.', vm);
        };
    }

    /**
     * Set on an object from a path
     *
     * @param {Object} obj
     * @param {String | Array} path
     * @param {*} val
     */

    function setPath(obj, path, val) {
        var original = obj;
        if (typeof path === 'string') {
            path = parse(path);
        }
        if (!path || !isObject(obj)) {
            return false;
        }
        var last, key;
        for (var i = 0, l = path.length; i < l; i++) {
            last = obj;
            key = path[i];
            if (key.charAt(0) === '*') {
                key = parseExpression(key.slice(1)).get.call(original, original);
            }
            if (i < l - 1) {
                obj = obj[key];
                if (!isObject(obj)) {
                    obj = {};
                    if ('development' !== 'production' && last._isVue) {
                        warnNonExistent(path, last);
                    }
                    set(last, key, obj);
                }
            } else {
                if (isArray(obj)) {
                    obj.$set(key, val);
                } else if (key in obj) {
                    obj[key] = val;
                } else {
                    if ('development' !== 'production' && obj._isVue) {
                        warnNonExistent(path, obj);
                    }
                    set(obj, key, val);
                }
            }
        }
        return true;
    }

    var path = Object.freeze({
        parsePath: parsePath,
        getPath: getPath,
        setPath: setPath
    });

    var expressionCache = new Cache(1000);

    var allowedKeywords = 'Math,Date,this,true,false,null,undefined,Infinity,NaN,' + 'isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,' + 'encodeURIComponent,parseInt,parseFloat';
    var allowedKeywordsRE = new RegExp('^(' + allowedKeywords.replace(/,/g, '\\b|') + '\\b)');

    // keywords that don't make sense inside expressions
    var improperKeywords = 'break,case,class,catch,const,continue,debugger,default,' + 'delete,do,else,export,extends,finally,for,function,if,' + 'import,in,instanceof,let,return,super,switch,throw,try,' + 'var,while,with,yield,enum,await,implements,package,' + 'protected,static,interface,private,public';
    var improperKeywordsRE = new RegExp('^(' + improperKeywords.replace(/,/g, '\\b|') + '\\b)');

    var wsRE = /\s/g;
    var newlineRE = /\n/g;
    var saveRE = /[\{,]\s*[\w\$_]+\s*:|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`)|new |typeof |void /g;
    var restoreRE = /"(\d+)"/g;
    var pathTestRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/;
    var identRE = /[^\w$\.](?:[A-Za-z_$][\w$]*)/g;
    var literalValueRE$1 = /^(?:true|false|null|undefined|Infinity|NaN)$/;

    function noop() {}

    /**
     * Save / Rewrite / Restore
     *
     * When rewriting paths found in an expression, it is
     * possible for the same letter sequences to be found in
     * strings and Object literal property keys. Therefore we
     * remove and store these parts in a temporary array, and
     * restore them after the path rewrite.
     */

    var saved = [];

    /**
     * Save replacer
     *
     * The save regex can match two possible cases:
     * 1. An opening object literal
     * 2. A string
     * If matched as a plain string, we need to escape its
     * newlines, since the string needs to be preserved when
     * generating the function body.
     *
     * @param {String} str
     * @param {String} isString - str if matched as a string
     * @return {String} - placeholder with index
     */

    function save(str, isString) {
        var i = saved.length;
        saved[i] = isString ? str.replace(newlineRE, '\\n') : str;
        return '"' + i + '"';
    }

    /**
     * Path rewrite replacer
     *
     * @param {String} raw
     * @return {String}
     */

    function rewrite(raw) {
        var c = raw.charAt(0);
        var path = raw.slice(1);
        if (allowedKeywordsRE.test(path)) {
            return raw;
        } else {
            path = path.indexOf('"') > -1 ? path.replace(restoreRE, restore) : path;
            return c + 'scope.' + path;
        }
    }

    /**
     * Restore replacer
     *
     * @param {String} str
     * @param {String} i - matched save index
     * @return {String}
     */

    function restore(str, i) {
        return saved[i];
    }

    /**
     * Rewrite an expression, prefixing all path accessors with
     * `scope.` and generate getter/setter functions.
     *
     * @param {String} exp
     * @return {Function}
     */

    function compileGetter(exp) {
        if (improperKeywordsRE.test(exp)) {
            'development' !== 'production' && warn('Avoid using reserved keywords in expression: ' + exp);
        }
        // reset state
        saved.length = 0;
        // save strings and object literal keys
        var body = exp.replace(saveRE, save).replace(wsRE, '');
        // rewrite all paths
        // pad 1 space here because the regex matches 1 extra char
        body = (' ' + body).replace(identRE, rewrite).replace(restoreRE, restore);
        return makeGetterFn(body);
    }

    /**
     * Build a getter function. Requires eval.
     *
     * We isolate the try/catch so it doesn't affect the
     * optimization of the parse function when it is not called.
     *
     * @param {String} body
     * @return {Function|undefined}
     */

    function makeGetterFn(body) {
        try {
            /* eslint-disable no-new-func */
            return new Function('scope', 'return ' + body + ';');
            /* eslint-enable no-new-func */
        } catch (e) {
            if ('development' !== 'production') {
                /* istanbul ignore if */
                if (e.toString().match(/unsafe-eval|CSP/)) {
                    warn('It seems you are using the default build of Vue.js in an environment ' + 'with Content Security Policy that prohibits unsafe-eval. ' + 'Use the CSP-compliant build instead: ' + 'http://vuejs.org/guide/installation.html#CSP-compliant-build');
                } else {
                    warn('Invalid expression. ' + 'Generated function body: ' + body);
                }
            }
            return noop;
        }
    }

    /**
     * Compile a setter function for the expression.
     *
     * @param {String} exp
     * @return {Function|undefined}
     */

    function compileSetter(exp) {
        var path = parsePath(exp);
        if (path) {
            return function (scope, val) {
                setPath(scope, path, val);
            };
        } else {
            'development' !== 'production' && warn('Invalid setter expression: ' + exp);
        }
    }

    /**
     * Parse an expression into re-written getter/setters.
     *
     * @param {String} exp
     * @param {Boolean} needSet
     * @return {Function}
     */

    function parseExpression(exp, needSet) {
        exp = exp.trim();
        // try cache
        var hit = expressionCache.get(exp);
        if (hit) {
            if (needSet && !hit.set) {
                hit.set = compileSetter(hit.exp);
            }
            return hit;
        }
        var res = { exp: exp };
        res.get = isSimplePath(exp) && exp.indexOf('[') < 0
            // optimized super simple getter
            ? makeGetterFn('scope.' + exp)
            // dynamic getter
            : compileGetter(exp);
        if (needSet) {
            res.set = compileSetter(exp);
        }
        expressionCache.put(exp, res);
        return res;
    }

    /**
     * Check if an expression is a simple path.
     *
     * @param {String} exp
     * @return {Boolean}
     */

    function isSimplePath(exp) {
        return pathTestRE.test(exp) &&
            // don't treat literal values as paths
            !literalValueRE$1.test(exp) &&
            // Math constants e.g. Math.PI, Math.E etc.
            exp.slice(0, 5) !== 'Math.';
    }

    var expression = Object.freeze({
        parseExpression: parseExpression,
        isSimplePath: isSimplePath
    });

    // we have two separate queues: one for directive updates
    // and one for user watcher registered via $watch().
    // we want to guarantee directive updates to be called
    // before user watchers so that when user watchers are
    // triggered, the DOM would have already been in updated
    // state.

    var queue = [];
    var userQueue = [];
    var has = {};
    var circular = {};
    var waiting = false;

    /**
     * Reset the batcher's state.
     */

    function resetBatcherState() {
        queue.length = 0;
        userQueue.length = 0;
        has = {};
        circular = {};
        waiting = false;
    }

    /**
     * Flush both queues and run the watchers.
     */

    function flushBatcherQueue() {
        var _again = true;

        _function: while (_again) {
            _again = false;

            runBatcherQueue(queue);
            runBatcherQueue(userQueue);
            // user watchers triggered more watchers,
            // keep flushing until it depletes
            if (queue.length) {
                _again = true;
                continue _function;
            }
            // dev tool hook
            /* istanbul ignore if */
            if (devtools && config.devtools) {
                devtools.emit('flush');
            }
            resetBatcherState();
        }
    }

    /**
     * Run the watchers in a single queue.
     *
     * @param {Array} queue
     */

    function runBatcherQueue(queue) {
        // do not cache length because more watchers might be pushed
        // as we run existing watchers
        for (var i = 0; i < queue.length; i++) {
            var watcher = queue[i];
            var id = watcher.id;
            has[id] = null;
            watcher.run();
            // in dev build, check and stop circular updates.
            if ('development' !== 'production' && has[id] != null) {
                circular[id] = (circular[id] || 0) + 1;
                if (circular[id] > config._maxUpdateCount) {
                    warn('You may have an infinite update loop for watcher ' + 'with expression "' + watcher.expression + '"', watcher.vm);
                    break;
                }
            }
        }
        queue.length = 0;
    }

    /**
     * Push a watcher into the watcher queue.
     * Jobs with duplicate IDs will be skipped unless it's
     * pushed when the queue is being flushed.
     *
     * @param {Watcher} watcher
     *   properties:
     *   - {Number} id
     *   - {Function} run
     */

    function pushWatcher(watcher) {
        var id = watcher.id;
        if (has[id] == null) {
            // push watcher into appropriate queue
            var q = watcher.user ? userQueue : queue;
            has[id] = q.length;
            q.push(watcher);
            // queue the flush
            if (!waiting) {
                waiting = true;
                nextTick(flushBatcherQueue);
            }
        }
    }

    var uid$2 = 0;

    /**
     * A watcher parses an expression, collects dependencies,
     * and fires callback when the expression value changes.
     * This is used for both the $watch() api and directives.
     *
     * @param {Vue} vm
     * @param {String|Function} expOrFn
     * @param {Function} cb
     * @param {Object} options
     *                 - {Array} filters
     *                 - {Boolean} twoWay
     *                 - {Boolean} deep
     *                 - {Boolean} user
     *                 - {Boolean} sync
     *                 - {Boolean} lazy
     *                 - {Function} [preProcess]
     *                 - {Function} [postProcess]
     * @constructor
     */
    function Watcher(vm, expOrFn, cb, options) {
        // mix in options
        if (options) {
            extend(this, options);
        }
        var isFn = typeof expOrFn === 'function';
        this.vm = vm;
        vm._watchers.push(this);
        this.expression = expOrFn;
        this.cb = cb;
        this.id = ++uid$2; // uid for batching
        this.active = true;
        this.dirty = this.lazy; // for lazy watchers
        this.deps = [];
        this.newDeps = [];
        this.depIds = new _Set();
        this.newDepIds = new _Set();
        this.prevError = null; // for async error stacks
        // parse expression for getter/setter
        if (isFn) {
            this.getter = expOrFn;
            this.setter = undefined;
        } else {
            var res = parseExpression(expOrFn, this.twoWay);
            this.getter = res.get;
            this.setter = res.set;
        }
        this.value = this.lazy ? undefined : this.get();
        // state for avoiding false triggers for deep and Array
        // watchers during vm._digest()
        this.queued = this.shallow = false;
    }

    /**
     * Evaluate the getter, and re-collect dependencies.
     */

    Watcher.prototype.get = function () {
        this.beforeGet();
        var scope = this.scope || this.vm;
        var value;
        try {
            value = this.getter.call(scope, scope);
        } catch (e) {
            if ('development' !== 'production' && config.warnExpressionErrors) {
                warn('Error when evaluating expression ' + '"' + this.expression + '": ' + e.toString(), this.vm);
            }
        }
        // "touch" every property so they are all tracked as
        // dependencies for deep watching
        if (this.deep) {
            traverse(value);
        }
        if (this.preProcess) {
            value = this.preProcess(value);
        }
        if (this.filters) {
            value = scope._applyFilters(value, null, this.filters, false);
        }
        if (this.postProcess) {
            value = this.postProcess(value);
        }
        this.afterGet();
        return value;
    };

    /**
     * Set the corresponding value with the setter.
     *
     * @param {*} value
     */

    Watcher.prototype.set = function (value) {
        var scope = this.scope || this.vm;
        if (this.filters) {
            value = scope._applyFilters(value, this.value, this.filters, true);
        }
        try {
            this.setter.call(scope, scope, value);
        } catch (e) {
            if ('development' !== 'production' && config.warnExpressionErrors) {
                warn('Error when evaluating setter ' + '"' + this.expression + '": ' + e.toString(), this.vm);
            }
        }
        // two-way sync for v-for alias
        var forContext = scope.$forContext;
        if (forContext && forContext.alias === this.expression) {
            if (forContext.filters) {
                'development' !== 'production' && warn('It seems you are using two-way binding on ' + 'a v-for alias (' + this.expression + '), and the ' + 'v-for has filters. This will not work properly. ' + 'Either remove the filters or use an array of ' + 'objects and bind to object properties instead.', this.vm);
                return;
            }
            forContext._withLock(function () {
                if (scope.$key) {
                    // original is an object
                    forContext.rawValue[scope.$key] = value;
                } else {
                    forContext.rawValue.$set(scope.$index, value);
                }
            });
        }
    };

    /**
     * Prepare for dependency collection.
     */

    Watcher.prototype.beforeGet = function () {
        Dep.target = this;
    };

    /**
     * Add a dependency to this directive.
     *
     * @param {Dep} dep
     */

    Watcher.prototype.addDep = function (dep) {
        var id = dep.id;
        if (!this.newDepIds.has(id)) {
            this.newDepIds.add(id);
            this.newDeps.push(dep);
            if (!this.depIds.has(id)) {
                dep.addSub(this);
            }
        }
    };

    /**
     * Clean up for dependency collection.
     */

    Watcher.prototype.afterGet = function () {
        Dep.target = null;
        var i = this.deps.length;
        while (i--) {
            var dep = this.deps[i];
            if (!this.newDepIds.has(dep.id)) {
                dep.removeSub(this);
            }
        }
        var tmp = this.depIds;
        this.depIds = this.newDepIds;
        this.newDepIds = tmp;
        this.newDepIds.clear();
        tmp = this.deps;
        this.deps = this.newDeps;
        this.newDeps = tmp;
        this.newDeps.length = 0;
    };

    /**
     * Subscriber interface.
     * Will be called when a dependency changes.
     *
     * @param {Boolean} shallow
     */

    Watcher.prototype.update = function (shallow) {
        if (this.lazy) {
            this.dirty = true;
        } else if (this.sync || !config.async) {
            this.run();
        } else {
            // if queued, only overwrite shallow with non-shallow,
            // but not the other way around.
            this.shallow = this.queued ? shallow ? this.shallow : false : !!shallow;
            this.queued = true;
            // record before-push error stack in debug mode
            /* istanbul ignore if */
            if ('development' !== 'production' && config.debug) {
                this.prevError = new Error('[vue] async stack trace');
            }
            pushWatcher(this);
        }
    };

    /**
     * Batcher job interface.
     * Will be called by the batcher.
     */

    Watcher.prototype.run = function () {
        if (this.active) {
            var value = this.get();
            if (value !== this.value ||
                // Deep watchers and watchers on Object/Arrays should fire even
                // when the value is the same, because the value may
                // have mutated; but only do so if this is a
                // non-shallow update (caused by a vm digest).
                (isObject(value) || this.deep) && !this.shallow) {
                // set new value
                var oldValue = this.value;
                this.value = value;
                // in debug + async mode, when a watcher callbacks
                // throws, we also throw the saved before-push error
                // so the full cross-tick stack trace is available.
                var prevError = this.prevError;
                /* istanbul ignore if */
                if ('development' !== 'production' && config.debug && prevError) {
                    this.prevError = null;
                    try {
                        this.cb.call(this.vm, value, oldValue);
                    } catch (e) {
                        nextTick(function () {
                            throw prevError;
                        }, 0);
                        throw e;
                    }
                } else {
                    this.cb.call(this.vm, value, oldValue);
                }
            }
            this.queued = this.shallow = false;
        }
    };

    /**
     * Evaluate the value of the watcher.
     * This only gets called for lazy watchers.
     */

    Watcher.prototype.evaluate = function () {
        // avoid overwriting another watcher that is being
        // collected.
        var current = Dep.target;
        this.value = this.get();
        this.dirty = false;
        Dep.target = current;
    };

    /**
     * Depend on all deps collected by this watcher.
     */

    Watcher.prototype.depend = function () {
        var i = this.deps.length;
        while (i--) {
            this.deps[i].depend();
        }
    };

    /**
     * Remove self from all dependencies' subcriber list.
     */

    Watcher.prototype.teardown = function () {
        if (this.active) {
            // remove self from vm's watcher list
            // this is a somewhat expensive operation so we skip it
            // if the vm is being destroyed or is performing a v-for
            // re-render (the watcher list is then filtered by v-for).
            if (!this.vm._isBeingDestroyed && !this.vm._vForRemoving) {
                this.vm._watchers.$remove(this);
            }
            var i = this.deps.length;
            while (i--) {
                this.deps[i].removeSub(this);
            }
            this.active = false;
            this.vm = this.cb = this.value = null;
        }
    };

    /**
     * Recrusively traverse an object to evoke all converted
     * getters, so that every nested property inside the object
     * is collected as a "deep" dependency.
     *
     * @param {*} val
     */

    var seenObjects = new _Set();
    function traverse(val, seen) {
        var i = undefined,
            keys = undefined;
        if (!seen) {
            seen = seenObjects;
            seen.clear();
        }
        var isA = isArray(val);
        var isO = isObject(val);
        if ((isA || isO) && Object.isExtensible(val)) {
            if (val.__ob__) {
                var depId = val.__ob__.dep.id;
                if (seen.has(depId)) {
                    return;
                } else {
                    seen.add(depId);
                }
            }
            if (isA) {
                i = val.length;
                while (i--) traverse(val[i], seen);
            } else if (isO) {
                keys = Object.keys(val);
                i = keys.length;
                while (i--) traverse(val[keys[i]], seen);
            }
        }
    }

    var text$1 = {

        bind: function bind() {
            this.attr = this.el.nodeType === 3 ? 'data' : 'textContent';
        },

        update: function update(value) {
            this.el[this.attr] = _toString(value);
        }
    };

    var templateCache = new Cache(1000);
    var idSelectorCache = new Cache(1000);

    var map = {
        efault: [0, '', ''],
        legend: [1, '<fieldset>', '</fieldset>'],
        tr: [2, '<table><tbody>', '</tbody></table>'],
        col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>']
    };

    map.td = map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

    map.option = map.optgroup = [1, '<select multiple="multiple">', '</select>'];

    map.thead = map.tbody = map.colgroup = map.caption = map.tfoot = [1, '<table>', '</table>'];

    map.g = map.defs = map.symbol = map.use = map.image = map.text = map.circle = map.ellipse = map.line = map.path = map.polygon = map.polyline = map.rect = [1, '<svg ' + 'xmlns="http://www.w3.org/2000/svg" ' + 'xmlns:xlink="http://www.w3.org/1999/xlink" ' + 'xmlns:ev="http://www.w3.org/2001/xml-events"' + 'version="1.1">', '</svg>'];

    /**
     * Check if a node is a supported template node with a
     * DocumentFragment content.
     *
     * @param {Node} node
     * @return {Boolean}
     */

    function isRealTemplate(node) {
        return isTemplate(node) && isFragment(node.content);
    }

    var tagRE$1 = /<([\w:-]+)/;
    var entityRE = /&#?\w+?;/;
    var commentRE = /<!--/;

    /**
     * Convert a string template to a DocumentFragment.
     * Determines correct wrapping by tag types. Wrapping
     * strategy found in jQuery & component/domify.
     *
     * @param {String} templateString
     * @param {Boolean} raw
     * @return {DocumentFragment}
     */

    function stringToFragment(templateString, raw) {
        // try a cache hit first
        var cacheKey = raw ? templateString : templateString.trim();
        var hit = templateCache.get(cacheKey);
        if (hit) {
            return hit;
        }

        var frag = document.createDocumentFragment();
        var tagMatch = templateString.match(tagRE$1);
        var entityMatch = entityRE.test(templateString);
        var commentMatch = commentRE.test(templateString);

        if (!tagMatch && !entityMatch && !commentMatch) {
            // text only, return a single text node.
            frag.appendChild(document.createTextNode(templateString));
        } else {
            var tag = tagMatch && tagMatch[1];
            var wrap = map[tag] || map.efault;
            var depth = wrap[0];
            var prefix = wrap[1];
            var suffix = wrap[2];
            var node = document.createElement('div');

            node.innerHTML = prefix + templateString + suffix;
            while (depth--) {
                node = node.lastChild;
            }

            var child;
            /* eslint-disable no-cond-assign */
            while (child = node.firstChild) {
                /* eslint-enable no-cond-assign */
                frag.appendChild(child);
            }
        }
        if (!raw) {
            trimNode(frag);
        }
        templateCache.put(cacheKey, frag);
        return frag;
    }

    /**
     * Convert a template node to a DocumentFragment.
     *
     * @param {Node} node
     * @return {DocumentFragment}
     */

    function nodeToFragment(node) {
        // if its a template tag and the browser supports it,
        // its content is already a document fragment. However, iOS Safari has
        // bug when using directly cloned template content with touch
        // events and can cause crashes when the nodes are removed from DOM, so we
        // have to treat template elements as string templates. (#2805)
        /* istanbul ignore if */
        if (isRealTemplate(node)) {
            return stringToFragment(node.innerHTML);
        }
        // script template
        if (node.tagName === 'SCRIPT') {
            return stringToFragment(node.textContent);
        }
        // normal node, clone it to avoid mutating the original
        var clonedNode = cloneNode(node);
        var frag = document.createDocumentFragment();
        var child;
        /* eslint-disable no-cond-assign */
        while (child = clonedNode.firstChild) {
            /* eslint-enable no-cond-assign */
            frag.appendChild(child);
        }
        trimNode(frag);
        return frag;
    }

    // Test for the presence of the Safari template cloning bug
    // https://bugs.webkit.org/showug.cgi?id=137755
    var hasBrokenTemplate = (function () {
        /* istanbul ignore else */
        if (inBrowser) {
            var a = document.createElement('div');
            a.innerHTML = '<template>1</template>';
            return !a.cloneNode(true).firstChild.innerHTML;
        } else {
            return false;
        }
    })();

    // Test for IE10/11 textarea placeholder clone bug
    var hasTextareaCloneBug = (function () {
        /* istanbul ignore else */
        if (inBrowser) {
            var t = document.createElement('textarea');
            t.placeholder = 't';
            return t.cloneNode(true).value === 't';
        } else {
            return false;
        }
    })();

    /**
     * 1. Deal with Safari cloning nested <template> bug by
     *    manually cloning all template instances.
     * 2. Deal with IE10/11 textarea placeholder bug by setting
     *    the correct value after cloning.
     *
     * @param {Element|DocumentFragment} node
     * @return {Element|DocumentFragment}
     */

    function cloneNode(node) {
        /* istanbul ignore if */
        if (!node.querySelectorAll) {
            return node.cloneNode();
        }
        var res = node.cloneNode(true);
        var i, original, cloned;
        /* istanbul ignore if */
        if (hasBrokenTemplate) {
            var tempClone = res;
            if (isRealTemplate(node)) {
                node = node.content;
                tempClone = res.content;
            }
            original = node.querySelectorAll('template');
            if (original.length) {
                cloned = tempClone.querySelectorAll('template');
                i = cloned.length;
                while (i--) {
                    cloned[i].parentNode.replaceChild(cloneNode(original[i]), cloned[i]);
                }
            }
        }
        /* istanbul ignore if */
        if (hasTextareaCloneBug) {
            if (node.tagName === 'TEXTAREA') {
                res.value = node.value;
            } else {
                original = node.querySelectorAll('textarea');
                if (original.length) {
                    cloned = res.querySelectorAll('textarea');
                    i = cloned.length;
                    while (i--) {
                        cloned[i].value = original[i].value;
                    }
                }
            }
        }
        return res;
    }

    /**
     * Process the template option and normalizes it into a
     * a DocumentFragment that can be used as a partial or a
     * instance template.
     *
     * @param {*} template
     *        Possible values include:
     *        - DocumentFragment object
     *        - Node object of type Template
     *        - id selector: '#some-template-id'
     *        - template string: '<div><span>{{msg}}</span></div>'
     * @param {Boolean} shouldClone
     * @param {Boolean} raw
     *        inline HTML interpolation. Do not check for id
     *        selector and keep whitespace in the string.
     * @return {DocumentFragment|undefined}
     */

    function parseTemplate(template, shouldClone, raw) {
        var node, frag;

        // if the template is already a document fragment,
        // do nothing
        if (isFragment(template)) {
            trimNode(template);
            return shouldClone ? cloneNode(template) : template;
        }

        if (typeof template === 'string') {
            // id selector
            if (!raw && template.charAt(0) === '#') {
                // id selector can be cached too
                frag = idSelectorCache.get(template);
                if (!frag) {
                    node = document.getElementById(template.slice(1));
                    if (node) {
                        frag = nodeToFragment(node);
                        // save selector to cache
                        idSelectorCache.put(template, frag);
                    }
                }
            } else {
                // normal string template
                frag = stringToFragment(template, raw);
            }
        } else if (template.nodeType) {
            // a direct node
            frag = nodeToFragment(template);
        }

        return frag && shouldClone ? cloneNode(frag) : frag;
    }

    var template = Object.freeze({
        cloneNode: cloneNode,
        parseTemplate: parseTemplate
    });

    var html = {

        bind: function bind() {
            // a comment node means this is a binding for
            // {{{ inline unescaped html }}}
            if (this.el.nodeType === 8) {
                // hold nodes
                this.nodes = [];
                // replace the placeholder with proper anchor
                this.anchor = createAnchor('v-html');
                replace(this.el, this.anchor);
            }
        },

        update: function update(value) {
            value = _toString(value);
            if (this.nodes) {
                this.swap(value);
            } else {
                this.el.innerHTML = value;
            }
        },

        swap: function swap(value) {
            // remove old nodes
            var i = this.nodes.length;
            while (i--) {
                remove(this.nodes[i]);
            }
            // convert new value to a fragment
            // do not attempt to retrieve from id selector
            var frag = parseTemplate(value, true, true);
            // save a reference to these nodes so we can remove later
            this.nodes = toArray(frag.childNodes);
            before(frag, this.anchor);
        }
    };

    /**
     * Abstraction for a partially-compiled fragment.
     * Can optionally compile content with a child scope.
     *
     * @param {Function} linker
     * @param {Vue} vm
     * @param {DocumentFragment} frag
     * @param {Vue} [host]
     * @param {Object} [scope]
     * @param {Fragment} [parentFrag]
     */
    function Fragment(linker, vm, frag, host, scope, parentFrag) {
        this.children = [];
        this.childFrags = [];
        this.vm = vm;
        this.scope = scope;
        this.inserted = false;
        this.parentFrag = parentFrag;
        if (parentFrag) {
            parentFrag.childFrags.push(this);
        }
        this.unlink = linker(vm, frag, host, scope, this);
        var single = this.single = frag.childNodes.length === 1 &&
            // do not go single mode if the only node is an anchor
            !frag.childNodes[0].__v_anchor;
        if (single) {
            this.node = frag.childNodes[0];
            this.before = singleBefore;
            this.remove = singleRemove;
        } else {
            this.node = createAnchor('fragment-start');
            this.end = createAnchor('fragment-end');
            this.frag = frag;
            prepend(this.node, frag);
            frag.appendChild(this.end);
            this.before = multiBefore;
            this.remove = multiRemove;
        }
        this.node.__v_frag = this;
    }

    /**
     * Call attach/detach for all components contained within
     * this fragment. Also do so recursively for all child
     * fragments.
     *
     * @param {Function} hook
     */

    Fragment.prototype.callHook = function (hook) {
        var i, l;
        for (i = 0, l = this.childFrags.length; i < l; i++) {
            this.childFrags[i].callHook(hook);
        }
        for (i = 0, l = this.children.length; i < l; i++) {
            hook(this.children[i]);
        }
    };

    /**
     * Insert fragment before target, single node version
     *
     * @param {Node} target
     * @param {Boolean} withTransition
     */

    function singleBefore(target, withTransition) {
        this.inserted = true;
        var method = withTransition !== false ? beforeWithTransition : before;
        method(this.node, target, this.vm);
        if (inDoc(this.node)) {
            this.callHook(attach);
        }
    }

    /**
     * Remove fragment, single node version
     */

    function singleRemove() {
        this.inserted = false;
        var shouldCallRemove = inDoc(this.node);
        var self = this;
        this.beforeRemove();
        removeWithTransition(this.node, this.vm, function () {
            if (shouldCallRemove) {
                self.callHook(detach);
            }
            self.destroy();
        });
    }

    /**
     * Insert fragment before target, multi-nodes version
     *
     * @param {Node} target
     * @param {Boolean} withTransition
     */

    function multiBefore(target, withTransition) {
        this.inserted = true;
        var vm = this.vm;
        var method = withTransition !== false ? beforeWithTransition : before;
        mapNodeRange(this.node, this.end, function (node) {
            method(node, target, vm);
        });
        if (inDoc(this.node)) {
            this.callHook(attach);
        }
    }

    /**
     * Remove fragment, multi-nodes version
     */

    function multiRemove() {
        this.inserted = false;
        var self = this;
        var shouldCallRemove = inDoc(this.node);
        this.beforeRemove();
        removeNodeRange(this.node, this.end, this.vm, this.frag, function () {
            if (shouldCallRemove) {
                self.callHook(detach);
            }
            self.destroy();
        });
    }

    /**
     * Prepare the fragment for removal.
     */

    Fragment.prototype.beforeRemove = function () {
        var i, l;
        for (i = 0, l = this.childFrags.length; i < l; i++) {
            // call the same method recursively on child
            // fragments, depth-first
            this.childFrags[i].beforeRemove(false);
        }
        for (i = 0, l = this.children.length; i < l; i++) {
            // Call destroy for all contained instances,
            // with remove:false and defer:true.
            // Defer is necessary because we need to
            // keep the children to call detach hooks
            // on them.
            this.children[i].$destroy(false, true);
        }
        var dirs = this.unlink.dirs;
        for (i = 0, l = dirs.length; i < l; i++) {
            // disable the watchers on all the directives
            // so that the rendered content stays the same
            // during removal.
            dirs[i]._watcher && dirs[i]._watcher.teardown();
        }
    };

    /**
     * Destroy the fragment.
     */

    Fragment.prototype.destroy = function () {
        if (this.parentFrag) {
            this.parentFrag.childFrags.$remove(this);
        }
        this.node.__v_frag = null;
        this.unlink();
    };

    /**
     * Call attach hook for a Vue instance.
     *
     * @param {Vue} child
     */

    function attach(child) {
        if (!child._isAttached && inDoc(child.$el)) {
            child._callHook('attached');
        }
    }

    /**
     * Call detach hook for a Vue instance.
     *
     * @param {Vue} child
     */

    function detach(child) {
        if (child._isAttached && !inDoc(child.$el)) {
            child._callHook('detached');
        }
    }

    var linkerCache = new Cache(5000);

    /**
     * A factory that can be used to create instances of a
     * fragment. Caches the compiled linker if possible.
     *
     * @param {Vue} vm
     * @param {Element|String} el
     */
    function FragmentFactory(vm, el) {
        this.vm = vm;
        var template;
        var isString = typeof el === 'string';
        if (isString || isTemplate(el) && !el.hasAttribute('v-if')) {
            template = parseTemplate(el, true);
        } else {
            template = document.createDocumentFragment();
            template.appendChild(el);
        }
        this.template = template;
        // linker can be cached, but only for components
        var linker;
        var cid = vm.constructor.cid;
        if (cid > 0) {
            var cacheId = cid + (isString ? el : getOuterHTML(el));
            linker = linkerCache.get(cacheId);
            if (!linker) {
                linker = compile(template, vm.$options, true);
                linkerCache.put(cacheId, linker);
            }
        } else {
            linker = compile(template, vm.$options, true);
        }
        this.linker = linker;
    }

    /**
     * Create a fragment instance with given host and scope.
     *
     * @param {Vue} host
     * @param {Object} scope
     * @param {Fragment} parentFrag
     */

    FragmentFactory.prototype.create = function (host, scope, parentFrag) {
        var frag = cloneNode(this.template);
        return new Fragment(this.linker, this.vm, frag, host, scope, parentFrag);
    };

    var ON = 700;
    var MODEL = 800;
    var BIND = 850;
    var TRANSITION = 1100;
    var EL = 1500;
    var COMPONENT = 1500;
    var PARTIAL = 1750;
    var IF = 2100;
    var FOR = 2200;
    var SLOT = 2300;

    var uid$3 = 0;

    var vFor = {

        priority: FOR,
        terminal: true,

        params: ['track-by', 'stagger', 'enter-stagger', 'leave-stagger'],

        bind: function bind() {
            // support "item in/of items" syntax
            var inMatch = this.expression.match(/(.*) (?:in|of) (.*)/);
            if (inMatch) {
                var itMatch = inMatch[1].match(/\((.*),(.*)\)/);
                if (itMatch) {
                    this.iterator = itMatch[1].trim();
                    this.alias = itMatch[2].trim();
                } else {
                    this.alias = inMatch[1].trim();
                }
                this.expression = inMatch[2];
            }

            if (!this.alias) {
                'development' !== 'production' && warn('Invalid v-for expression "' + this.descriptor.raw + '": ' + 'alias is required.', this.vm);
                return;
            }

            // uid as a cache identifier
            this.id = '__v-for__' + ++uid$3;

            // check if this is an option list,
            // so that we know if we need to update the <select>'s
            // v-model when the option list has changed.
            // because v-model has a lower priority than v-for,
            // the v-model is not bound here yet, so we have to
            // retrive it in the actual updateModel() function.
            var tag = this.el.tagName;
            this.isOption = (tag === 'OPTION' || tag === 'OPTGROUP') && this.el.parentNode.tagName === 'SELECT';

            // setup anchor nodes
            this.start = createAnchor('v-for-start');
            this.end = createAnchor('v-for-end');
            replace(this.el, this.end);
            before(this.start, this.end);

            // cache
            this.cache = Object.create(null);

            // fragment factory
            this.factory = new FragmentFactory(this.vm, this.el);
        },

        update: function update(data) {
            this.diff(data);
            this.updateRef();
            this.updateModel();
        },

        /**
         * Diff, based on new data and old data, determine the
         * minimum amount of DOM manipulations needed to make the
         * DOM reflect the new data Array.
         *
         * The algorithm diffs the new data Array by storing a
         * hidden reference to an owner vm instance on previously
         * seen data. This allows us to achieve O(n) which is
         * better than a levenshtein distance based algorithm,
         * which is O(m * n).
         *
         * @param {Array} data
         */

        diff: function diff(data) {
            // check if the Array was converted from an Object
            var item = data[0];
            var convertedFromObject = this.fromObject = isObject(item) && hasOwn(item, '$key') && hasOwn(item, '$value');

            var trackByKey = this.params.trackBy;
            var oldFrags = this.frags;
            var frags = this.frags = new Array(data.length);
            var alias = this.alias;
            var iterator = this.iterator;
            var start = this.start;
            var end = this.end;
            var inDocument = inDoc(start);
            var init = !oldFrags;
            var i, l, frag, key, value, primitive;

            // First pass, go through the new Array and fill up
            // the new frags array. If a piece of data has a cached
            // instance for it, we reuse it. Otherwise build a new
            // instance.
            for (i = 0, l = data.length; i < l; i++) {
                item = data[i];
                key = convertedFromObject ? item.$key : null;
                value = convertedFromObject ? item.$value : item;
                primitive = !isObject(value);
                frag = !init && this.getCachedFrag(value, i, key);
                if (frag) {
                    // reusable fragment
                    frag.reused = true;
                    // update $index
                    frag.scope.$index = i;
                    // update $key
                    if (key) {
                        frag.scope.$key = key;
                    }
                    // update iterator
                    if (iterator) {
                        frag.scope[iterator] = key !== null ? key : i;
                    }
                    // update data for track-by, object repeat &
                    // primitive values.
                    if (trackByKey || convertedFromObject || primitive) {
                        withoutConversion(function () {
                            frag.scope[alias] = value;
                        });
                    }
                } else {
                    // new isntance
                    frag = this.create(value, alias, i, key);
                    frag.fresh = !init;
                }
                frags[i] = frag;
                if (init) {
                    frag.before(end);
                }
            }

            // we're done for the initial render.
            if (init) {
                return;
            }

            // Second pass, go through the old fragments and
            // destroy those who are not reused (and remove them
            // from cache)
            var removalIndex = 0;
            var totalRemoved = oldFrags.length - frags.length;
            // when removing a large number of fragments, watcher removal
            // turns out to be a perf bottleneck, so we batch the watcher
            // removals into a single filter call!
            this.vm._vForRemoving = true;
            for (i = 0, l = oldFrags.length; i < l; i++) {
                frag = oldFrags[i];
                if (!frag.reused) {
                    this.deleteCachedFrag(frag);
                    this.remove(frag, removalIndex++, totalRemoved, inDocument);
                }
            }
            this.vm._vForRemoving = false;
            if (removalIndex) {
                this.vm._watchers = this.vm._watchers.filter(function (w) {
                    return w.active;
                });
            }

            // Final pass, move/insert new fragments into the
            // right place.
            var targetPrev, prevEl, currentPrev;
            var insertionIndex = 0;
            for (i = 0, l = frags.length; i < l; i++) {
                frag = frags[i];
                // this is the frag that we should be after
                targetPrev = frags[i - 1];
                prevEl = targetPrev ? targetPrev.staggerCb ? targetPrev.staggerAnchor : targetPrev.end || targetPrev.node : start;
                if (frag.reused && !frag.staggerCb) {
                    currentPrev = findPrevFrag(frag, start, this.id);
                    if (currentPrev !== targetPrev && (!currentPrev ||
                        // optimization for moving a single item.
                        // thanks to suggestions by @livoras in #1807
                        findPrevFrag(currentPrev, start, this.id) !== targetPrev)) {
                        this.move(frag, prevEl);
                    }
                } else {
                    // new instance, or still in stagger.
                    // insert with updated stagger index.
                    this.insert(frag, insertionIndex++, prevEl, inDocument);
                }
                frag.reused = frag.fresh = false;
            }
        },

        /**
         * Create a new fragment instance.
         *
         * @param {*} value
         * @param {String} alias
         * @param {Number} index
         * @param {String} [key]
         * @return {Fragment}
         */

        create: function create(value, alias, index, key) {
            var host = this._host;
            // create iteration scope
            var parentScope = this._scope || this.vm;
            var scope = Object.create(parentScope);
            // ref holder for the scope
            scope.$refs = Object.create(parentScope.$refs);
            scope.$els = Object.create(parentScope.$els);
            // make sure point $parent to parent scope
            scope.$parent = parentScope;
            // for two-way binding on alias
            scope.$forContext = this;
            // define scope properties
            // important: define the scope alias without forced conversion
            // so that frozen data structures remain non-reactive.
            withoutConversion(function () {
                defineReactive(scope, alias, value);
            });
            defineReactive(scope, '$index', index);
            if (key) {
                defineReactive(scope, '$key', key);
            } else if (scope.$key) {
                // avoid accidental fallback
                def(scope, '$key', null);
            }
            if (this.iterator) {
                defineReactive(scope, this.iterator, key !== null ? key : index);
            }
            var frag = this.factory.create(host, scope, this._frag);
            frag.forId = this.id;
            this.cacheFrag(value, frag, index, key);
            return frag;
        },

        /**
         * Update the v-ref on owner vm.
         */

        updateRef: function updateRef() {
            var ref = this.descriptor.ref;
            if (!ref) return;
            var hash = (this._scope || this.vm).$refs;
            var refs;
            if (!this.fromObject) {
                refs = this.frags.map(findVmFromFrag);
            } else {
                refs = {};
                this.frags.forEach(function (frag) {
                    refs[frag.scope.$key] = findVmFromFrag(frag);
                });
            }
            hash[ref] = refs;
        },

        /**
         * For option lists, update the containing v-model on
         * parent <select>.
         */

        updateModel: function updateModel() {
            if (this.isOption) {
                var parent = this.start.parentNode;
                var model = parent && parent.__v_model;
                if (model) {
                    model.forceUpdate();
                }
            }
        },

        /**
         * Insert a fragment. Handles staggering.
         *
         * @param {Fragment} frag
         * @param {Number} index
         * @param {Node} prevEl
         * @param {Boolean} inDocument
         */

        insert: function insert(frag, index, prevEl, inDocument) {
            if (frag.staggerCb) {
                frag.staggerCb.cancel();
                frag.staggerCb = null;
            }
            var staggerAmount = this.getStagger(frag, index, null, 'enter');
            if (inDocument && staggerAmount) {
                // create an anchor and insert it synchronously,
                // so that we can resolve the correct order without
                // worrying about some elements not inserted yet
                var anchor = frag.staggerAnchor;
                if (!anchor) {
                    anchor = frag.staggerAnchor = createAnchor('stagger-anchor');
                    anchor.__v_frag = frag;
                }
                after(anchor, prevEl);
                var op = frag.staggerCb = cancellable(function () {
                    frag.staggerCb = null;
                    frag.before(anchor);
                    remove(anchor);
                });
                setTimeout(op, staggerAmount);
            } else {
                var target = prevEl.nextSibling;
                /* istanbul ignore if */
                if (!target) {
                    // reset end anchor position in case the position was messed up
                    // by an external drag-n-drop library.
                    after(this.end, prevEl);
                    target = this.end;
                }
                frag.before(target);
            }
        },

        /**
         * Remove a fragment. Handles staggering.
         *
         * @param {Fragment} frag
         * @param {Number} index
         * @param {Number} total
         * @param {Boolean} inDocument
         */

        remove: function remove(frag, index, total, inDocument) {
            if (frag.staggerCb) {
                frag.staggerCb.cancel();
                frag.staggerCb = null;
                // it's not possible for the same frag to be removed
                // twice, so if we have a pending stagger callback,
                // it means this frag is queued for enter but removed
                // before its transition started. Since it is already
                // destroyed, we can just leave it in detached state.
                return;
            }
            var staggerAmount = this.getStagger(frag, index, total, 'leave');
            if (inDocument && staggerAmount) {
                var op = frag.staggerCb = cancellable(function () {
                    frag.staggerCb = null;
                    frag.remove();
                });
                setTimeout(op, staggerAmount);
            } else {
                frag.remove();
            }
        },

        /**
         * Move a fragment to a new position.
         * Force no transition.
         *
         * @param {Fragment} frag
         * @param {Node} prevEl
         */

        move: function move(frag, prevEl) {
            // fix a common issue with Sortable:
            // if prevEl doesn't have nextSibling, this means it's
            // been dragged after the end anchor. Just re-position
            // the end anchor to the end of the container.
            /* istanbul ignore if */
            if (!prevEl.nextSibling) {
                this.end.parentNode.appendChild(this.end);
            }
            frag.before(prevEl.nextSibling, false);
        },

        /**
         * Cache a fragment using track-by or the object key.
         *
         * @param {*} value
         * @param {Fragment} frag
         * @param {Number} index
         * @param {String} [key]
         */

        cacheFrag: function cacheFrag(value, frag, index, key) {
            var trackByKey = this.params.trackBy;
            var cache = this.cache;
            var primitive = !isObject(value);
            var id;
            if (key || trackByKey || primitive) {
                id = getTrackByKey(index, key, value, trackByKey);
                if (!cache[id]) {
                    cache[id] = frag;
                } else if (trackByKey !== '$index') {
                    'development' !== 'production' && this.warnDuplicate(value);
                }
            } else {
                id = this.id;
                if (hasOwn(value, id)) {
                    if (value[id] === null) {
                        value[id] = frag;
                    } else {
                        'development' !== 'production' && this.warnDuplicate(value);
                    }
                } else if (Object.isExtensible(value)) {
                    def(value, id, frag);
                } else if ('development' !== 'production') {
                    warn('Frozen v-for objects cannot be automatically tracked, make sure to ' + 'provide a track-by key.');
                }
            }
            frag.raw = value;
        },

        /**
         * Get a cached fragment from the value/index/key
         *
         * @param {*} value
         * @param {Number} index
         * @param {String} key
         * @return {Fragment}
         */

        getCachedFrag: function getCachedFrag(value, index, key) {
            var trackByKey = this.params.trackBy;
            var primitive = !isObject(value);
            var frag;
            if (key || trackByKey || primitive) {
                var id = getTrackByKey(index, key, value, trackByKey);
                frag = this.cache[id];
            } else {
                frag = value[this.id];
            }
            if (frag && (frag.reused || frag.fresh)) {
                'development' !== 'production' && this.warnDuplicate(value);
            }
            return frag;
        },

        /**
         * Delete a fragment from cache.
         *
         * @param {Fragment} frag
         */

        deleteCachedFrag: function deleteCachedFrag(frag) {
            var value = frag.raw;
            var trackByKey = this.params.trackBy;
            var scope = frag.scope;
            var index = scope.$index;
            // fix #948: avoid accidentally fall through to
            // a parent repeater which happens to have $key.
            var key = hasOwn(scope, '$key') && scope.$key;
            var primitive = !isObject(value);
            if (trackByKey || key || primitive) {
                var id = getTrackByKey(index, key, value, trackByKey);
                this.cache[id] = null;
            } else {
                value[this.id] = null;
                frag.raw = null;
            }
        },

        /**
         * Get the stagger amount for an insertion/removal.
         *
         * @param {Fragment} frag
         * @param {Number} index
         * @param {Number} total
         * @param {String} type
         */

        getStagger: function getStagger(frag, index, total, type) {
            type = type + 'Stagger';
            var trans = frag.node.__v_trans;
            var hooks = trans && trans.hooks;
            var hook = hooks && (hooks[type] || hooks.stagger);
            return hook ? hook.call(frag, index, total) : index * parseInt(this.params[type] || this.params.stagger, 10);
        },

        /**
         * Pre-process the value before piping it through the
         * filters. This is passed to and called by the watcher.
         */

        _preProcess: function _preProcess(value) {
            // regardless of type, store the un-filtered raw value.
            this.rawValue = value;
            return value;
        },

        /**
         * Post-process the value after it has been piped through
         * the filters. This is passed to and called by the watcher.
         *
         * It is necessary for this to be called during the
         * watcher's dependency collection phase because we want
         * the v-for to update when the source Object is mutated.
         */

        _postProcess: function _postProcess(value) {
            if (isArray(value)) {
                return value;
            } else if (isPlainObject(value)) {
                // convert plain object to array.
                var keys = Object.keys(value);
                var i = keys.length;
                var res = new Array(i);
                var key;
                while (i--) {
                    key = keys[i];
                    res[i] = {
                        $key: key,
                        $value: value[key]
                    };
                }
                return res;
            } else {
                if (typeof value === 'number' && !isNaN(value)) {
                    value = range(value);
                }
                return value || [];
            }
        },

        unbind: function unbind() {
            if (this.descriptor.ref) {
                (this._scope || this.vm).$refs[this.descriptor.ref] = null;
            }
            if (this.frags) {
                var i = this.frags.length;
                var frag;
                while (i--) {
                    frag = this.frags[i];
                    this.deleteCachedFrag(frag);
                    frag.destroy();
                }
            }
        }
    };

    /**
     * Helper to find the previous element that is a fragment
     * anchor. This is necessary because a destroyed frag's
     * element could still be lingering in the DOM before its
     * leaving transition finishes, but its inserted flag
     * should have been set to false so we can skip them.
     *
     * If this is a block repeat, we want to make sure we only
     * return frag that is bound to this v-for. (see #929)
     *
     * @param {Fragment} frag
     * @param {Comment|Text} anchor
     * @param {String} id
     * @return {Fragment}
     */

    function findPrevFrag(frag, anchor, id) {
        var el = frag.node.previousSibling;
        /* istanbul ignore if */
        if (!el) return;
        frag = el.__v_frag;
        while ((!frag || frag.forId !== id || !frag.inserted) && el !== anchor) {
            el = el.previousSibling;
            /* istanbul ignore if */
            if (!el) return;
            frag = el.__v_frag;
        }
        return frag;
    }

    /**
     * Find a vm from a fragment.
     *
     * @param {Fragment} frag
     * @return {Vue|undefined}
     */

    function findVmFromFrag(frag) {
        var node = frag.node;
        // handle multi-node frag
        if (frag.end) {
            while (!node.__vue__ && node !== frag.end && node.nextSibling) {
                node = node.nextSibling;
            }
        }
        return node.__vue__;
    }

    /**
     * Create a range array from given number.
     *
     * @param {Number} n
     * @return {Array}
     */

    function range(n) {
        var i = -1;
        var ret = new Array(Math.floor(n));
        while (++i < n) {
            ret[i] = i;
        }
        return ret;
    }

    /**
     * Get the track by key for an item.
     *
     * @param {Number} index
     * @param {String} key
     * @param {*} value
     * @param {String} [trackByKey]
     */

    function getTrackByKey(index, key, value, trackByKey) {
        return trackByKey ? trackByKey === '$index' ? index : trackByKey.charAt(0).match(/\w/) ? getPath(value, trackByKey) : value[trackByKey] : key || value;
    }

    if ('development' !== 'production') {
        vFor.warnDuplicate = function (value) {
            warn('Duplicate value found in v-for="' + this.descriptor.raw + '": ' + JSON.stringify(value) + '. Use track-by="$index" if ' + 'you are expecting duplicate values.', this.vm);
        };
    }

    var vIf = {

        priority: IF,
        terminal: true,

        bind: function bind() {
            var el = this.el;
            if (!el.__vue__) {
                // check else block
                var next = el.nextElementSibling;
                if (next && getAttr(next, 'v-else') !== null) {
                    remove(next);
                    this.elseEl = next;
                }
                // check main block
                this.anchor = createAnchor('v-if');
                replace(el, this.anchor);
            } else {
                'development' !== 'production' && warn('v-if="' + this.expression + '" cannot be ' + 'used on an instance root element.', this.vm);
                this.invalid = true;
            }
        },

        update: function update(value) {
            if (this.invalid) return;
            if (value) {
                if (!this.frag) {
                    this.insert();
                }
            } else {
                this.remove();
            }
        },

        insert: function insert() {
            if (this.elseFrag) {
                this.elseFrag.remove();
                this.elseFrag = null;
            }
            // lazy init factory
            if (!this.factory) {
                this.factory = new FragmentFactory(this.vm, this.el);
            }
            this.frag = this.factory.create(this._host, this._scope, this._frag);
            this.frag.before(this.anchor);
        },

        remove: function remove() {
            if (this.frag) {
                this.frag.remove();
                this.frag = null;
            }
            if (this.elseEl && !this.elseFrag) {
                if (!this.elseFactory) {
                    this.elseFactory = new FragmentFactory(this.elseEl._context || this.vm, this.elseEl);
                }
                this.elseFrag = this.elseFactory.create(this._host, this._scope, this._frag);
                this.elseFrag.before(this.anchor);
            }
        },

        unbind: function unbind() {
            if (this.frag) {
                this.frag.destroy();
            }
            if (this.elseFrag) {
                this.elseFrag.destroy();
            }
        }
    };

    var show = {

        bind: function bind() {
            // check else block
            var next = this.el.nextElementSibling;
            if (next && getAttr(next, 'v-else') !== null) {
                this.elseEl = next;
            }
        },

        update: function update(value) {
            this.apply(this.el, value);
            if (this.elseEl) {
                this.apply(this.elseEl, !value);
            }
        },

        apply: function apply(el, value) {
            if (inDoc(el)) {
                applyTransition(el, value ? 1 : -1, toggle, this.vm);
            } else {
                toggle();
            }
            function toggle() {
                el.style.display = value ? '' : 'none';
            }
        }
    };

    var text$2 = {

        bind: function bind() {
            var self = this;
            var el = this.el;
            var isRange = el.type === 'range';
            var lazy = this.params.lazy;
            var number = this.params.number;
            var debounce = this.params.debounce;

            // handle composition events.
            //   http://blog.evanyou.me/2014/01/03/composition-event/
            // skip this for Android because it handles composition
            // events quite differently. Android doesn't trigger
            // composition events for language input methods e.g.
            // Chinese, but instead triggers them for spelling
            // suggestions... (see Discussion/#162)
            var composing = false;
            if (!isAndroid && !isRange) {
                this.on('compositionstart', function () {
                    composing = true;
                });
                this.on('compositionend', function () {
                    composing = false;
                    // in IE11 the "compositionend" event fires AFTER
                    // the "input" event, so the input handler is blocked
                    // at the end... have to call it here.
                    //
                    // #1327: in lazy mode this is unecessary.
                    if (!lazy) {
                        self.listener();
                    }
                });
            }

            // prevent messing with the input when user is typing,
            // and force update on blur.
            this.focused = false;
            if (!isRange && !lazy) {
                this.on('focus', function () {
                    self.focused = true;
                });
                this.on('blur', function () {
                    self.focused = false;
                    // do not sync value after fragment removal (#2017)
                    if (!self._frag || self._frag.inserted) {
                        self.rawListener();
                    }
                });
            }

            // Now attach the main listener
            this.listener = this.rawListener = function () {
                if (composing || !self._bound) {
                    return;
                }
                var val = number || isRange ? toNumber(el.value) : el.value;
                self.set(val);
                // force update on next tick to avoid lock & same value
                // also only update when user is not typing
                nextTick(function () {
                    if (self._bound && !self.focused) {
                        self.update(self._watcher.value);
                    }
                });
            };

            // apply debounce
            if (debounce) {
                this.listener = _debounce(this.listener, debounce);
            }

            // Support jQuery events, since jQuery.trigger() doesn't
            // trigger native events in some cases and some plugins
            // rely on $.trigger()
            //
            // We want to make sure if a listener is attached using
            // jQuery, it is also removed with jQuery, that's why
            // we do the check for each directive instance and
            // store that check result on itself. This also allows
            // easier test coverage control by unsetting the global
            // jQuery variable in tests.
            this.hasjQuery = typeof jQuery === 'function';
            if (this.hasjQuery) {
                var method = jQuery.fn.on ? 'on' : 'bind';
                jQuery(el)[method]('change', this.rawListener);
                if (!lazy) {
                    jQuery(el)[method]('input', this.listener);
                }
            } else {
                this.on('change', this.rawListener);
                if (!lazy) {
                    this.on('input', this.listener);
                }
            }

            // IE9 doesn't fire input event on backspace/del/cut
            if (!lazy && isIE9) {
                this.on('cut', function () {
                    nextTick(self.listener);
                });
                this.on('keyup', function (e) {
                    if (e.keyCode === 46 || e.keyCode === 8) {
                        self.listener();
                    }
                });
            }

            // set initial value if present
            if (el.hasAttribute('value') || el.tagName === 'TEXTAREA' && el.value.trim()) {
                this.afterBind = this.listener;
            }
        },

        update: function update(value) {
            // #3029 only update when the value changes. This prevent
            // browsers from overwriting values like selectionStart
            value = _toString(value);
            if (value !== this.el.value) this.el.value = value;
        },

        unbind: function unbind() {
            var el = this.el;
            if (this.hasjQuery) {
                var method = jQuery.fn.off ? 'off' : 'unbind';
                jQuery(el)[method]('change', this.listener);
                jQuery(el)[method]('input', this.listener);
            }
        }
    };

    var radio = {

        bind: function bind() {
            var self = this;
            var el = this.el;

            this.getValue = function () {
                // value overwrite via v-bind:value
                if (el.hasOwnProperty('_value')) {
                    return el._value;
                }
                var val = el.value;
                if (self.params.number) {
                    val = toNumber(val);
                }
                return val;
            };

            this.listener = function () {
                self.set(self.getValue());
            };
            this.on('change', this.listener);

            if (el.hasAttribute('checked')) {
                this.afterBind = this.listener;
            }
        },

        update: function update(value) {
            this.el.checked = looseEqual(value, this.getValue());
        }
    };

    var select = {

        bind: function bind() {
            var _this = this;

            var self = this;
            var el = this.el;

            // method to force update DOM using latest value.
            this.forceUpdate = function () {
                if (self._watcher) {
                    self.update(self._watcher.get());
                }
            };

            // check if this is a multiple select
            var multiple = this.multiple = el.hasAttribute('multiple');

            // attach listener
            this.listener = function () {
                var value = getValue(el, multiple);
                value = self.params.number ? isArray(value) ? value.map(toNumber) : toNumber(value) : value;
                self.set(value);
            };
            this.on('change', this.listener);

            // if has initial value, set afterBind
            var initValue = getValue(el, multiple, true);
            if (multiple && initValue.length || !multiple && initValue !== null) {
                this.afterBind = this.listener;
            }

            // All major browsers except Firefox resets
            // selectedIndex with value -1 to 0 when the element
            // is appended to a new parent, therefore we have to
            // force a DOM update whenever that happens...
            this.vm.$on('hook:attached', function () {
                nextTick(_this.forceUpdate);
            });
            if (!inDoc(el)) {
                nextTick(this.forceUpdate);
            }
        },

        update: function update(value) {
            var el = this.el;
            el.selectedIndex = -1;
            var multi = this.multiple && isArray(value);
            var options = el.options;
            var i = options.length;
            var op, val;
            while (i--) {
                op = options[i];
                val = op.hasOwnProperty('_value') ? op._value : op.value;
                /* eslint-disable eqeqeq */
                op.selected = multi ? indexOf$1(value, val) > -1 : looseEqual(value, val);
                /* eslint-enable eqeqeq */
            }
        },

        unbind: function unbind() {
            /* istanbul ignore next */
            this.vm.$off('hook:attached', this.forceUpdate);
        }
    };

    /**
     * Get select value
     *
     * @param {SelectElement} el
     * @param {Boolean} multi
     * @param {Boolean} init
     * @return {Array|*}
     */

    function getValue(el, multi, init) {
        var res = multi ? [] : null;
        var op, val, selected;
        for (var i = 0, l = el.options.length; i < l; i++) {
            op = el.options[i];
            selected = init ? op.hasAttribute('selected') : op.selected;
            if (selected) {
                val = op.hasOwnProperty('_value') ? op._value : op.value;
                if (multi) {
                    res.push(val);
                } else {
                    return val;
                }
            }
        }
        return res;
    }

    /**
     * Native Array.indexOf uses strict equal, but in this
     * case we need to match string/numbers with custom equal.
     *
     * @param {Array} arr
     * @param {*} val
     */

    function indexOf$1(arr, val) {
        var i = arr.length;
        while (i--) {
            if (looseEqual(arr[i], val)) {
                return i;
            }
        }
        return -1;
    }

    var checkbox = {

        bind: function bind() {
            var self = this;
            var el = this.el;

            this.getValue = function () {
                return el.hasOwnProperty('_value') ? el._value : self.params.number ? toNumber(el.value) : el.value;
            };

            function getBooleanValue() {
                var val = el.checked;
                if (val && el.hasOwnProperty('_trueValue')) {
                    return el._trueValue;
                }
                if (!val && el.hasOwnProperty('_falseValue')) {
                    return el._falseValue;
                }
                return val;
            }

            this.listener = function () {
                var model = self._watcher.value;
                if (isArray(model)) {
                    var val = self.getValue();
                    if (el.checked) {
                        if (indexOf(model, val) < 0) {
                            model.push(val);
                        }
                    } else {
                        model.$remove(val);
                    }
                } else {
                    self.set(getBooleanValue());
                }
            };

            this.on('change', this.listener);
            if (el.hasAttribute('checked')) {
                this.afterBind = this.listener;
            }
        },

        update: function update(value) {
            var el = this.el;
            if (isArray(value)) {
                el.checked = indexOf(value, this.getValue()) > -1;
            } else {
                if (el.hasOwnProperty('_trueValue')) {
                    el.checked = looseEqual(value, el._trueValue);
                } else {
                    el.checked = !!value;
                }
            }
        }
    };

    var handlers = {
        text: text$2,
        radio: radio,
        select: select,
        checkbox: checkbox
    };

    var model = {

        priority: MODEL,
        twoWay: true,
        handlers: handlers,
        params: ['lazy', 'number', 'debounce'],

        /**
         * Possible elements:
         *   <select>
         *   <textarea>
         *   <input type="*">
         *     - text
         *     - checkbox
         *     - radio
         *     - number
         */

        bind: function bind() {
            // friendly warning...
            this.checkFilters();
            if (this.hasRead && !this.hasWrite) {
                'development' !== 'production' && warn('It seems you are using a read-only filter with ' + 'v-model="' + this.descriptor.raw + '". ' + 'You might want to use a two-way filter to ensure correct behavior.', this.vm);
            }
            var el = this.el;
            var tag = el.tagName;
            var handler;
            if (tag === 'INPUT') {
                handler = handlers[el.type] || handlers.text;
            } else if (tag === 'SELECT') {
                handler = handlers.select;
            } else if (tag === 'TEXTAREA') {
                handler = handlers.text;
            } else {
                'development' !== 'production' && warn('v-model does not support element type: ' + tag, this.vm);
                return;
            }
            el.__v_model = this;
            handler.bind.call(this);
            this.update = handler.update;
            this._unbind = handler.unbind;
        },

        /**
         * Check read/write filter stats.
         */

        checkFilters: function checkFilters() {
            var filters = this.filters;
            if (!filters) return;
            var i = filters.length;
            while (i--) {
                var filter = resolveAsset(this.vm.$options, 'filters', filters[i].name);
                if (typeof filter === 'function' || filter.read) {
                    this.hasRead = true;
                }
                if (filter.write) {
                    this.hasWrite = true;
                }
            }
        },

        unbind: function unbind() {
            this.el.__v_model = null;
            this._unbind && this._unbind();
        }
    };

    // keyCode aliases
    var keyCodes = {
        esc: 27,
        tab: 9,
        enter: 13,
        space: 32,
        'delete': [8, 46],
        up: 38,
        left: 37,
        right: 39,
        down: 40
    };

    function keyFilter(handler, keys) {
        var codes = keys.map(function (key) {
            var charCode = key.charCodeAt(0);
            if (charCode > 47 && charCode < 58) {
                return parseInt(key, 10);
            }
            if (key.length === 1) {
                charCode = key.toUpperCase().charCodeAt(0);
                if (charCode > 64 && charCode < 91) {
                    return charCode;
                }
            }
            return keyCodes[key];
        });
        codes = [].concat.apply([], codes);
        return function keyHandler(e) {
            if (codes.indexOf(e.keyCode) > -1) {
                return handler.call(this, e);
            }
        };
    }

    function stopFilter(handler) {
        return function stopHandler(e) {
            e.stopPropagation();
            return handler.call(this, e);
        };
    }

    function preventFilter(handler) {
        return function preventHandler(e) {
            e.preventDefault();
            return handler.call(this, e);
        };
    }

    function selfFilter(handler) {
        return function selfHandler(e) {
            if (e.target === e.currentTarget) {
                return handler.call(this, e);
            }
        };
    }

    var on$1 = {

        priority: ON,
        acceptStatement: true,
        keyCodes: keyCodes,

        bind: function bind() {
            // deal with iframes
            if (this.el.tagName === 'IFRAME' && this.arg !== 'load') {
                var self = this;
                this.iframeBind = function () {
                    on(self.el.contentWindow, self.arg, self.handler, self.modifiers.capture);
                };
                this.on('load', this.iframeBind);
            }
        },

        update: function update(handler) {
            // stub a noop for v-on with no value,
            // e.g. @mousedown.prevent
            if (!this.descriptor.raw) {
                handler = function () {};
            }

            if (typeof handler !== 'function') {
                'development' !== 'production' && warn('v-on:' + this.arg + '="' + this.expression + '" expects a function value, ' + 'got ' + handler, this.vm);
                return;
            }

            // apply modifiers
            if (this.modifiers.stop) {
                handler = stopFilter(handler);
            }
            if (this.modifiers.prevent) {
                handler = preventFilter(handler);
            }
            if (this.modifiers.self) {
                handler = selfFilter(handler);
            }
            // key filter
            var keys = Object.keys(this.modifiers).filter(function (key) {
                return key !== 'stop' && key !== 'prevent' && key !== 'self' && key !== 'capture';
            });
            if (keys.length) {
                handler = keyFilter(handler, keys);
            }

            this.reset();
            this.handler = handler;

            if (this.iframeBind) {
                this.iframeBind();
            } else {
                on(this.el, this.arg, this.handler, this.modifiers.capture);
            }
        },

        reset: function reset() {
            var el = this.iframeBind ? this.el.contentWindow : this.el;
            if (this.handler) {
                off(el, this.arg, this.handler);
            }
        },

        unbind: function unbind() {
            this.reset();
        }
    };

    var prefixes = ['-webkit-', '-moz-', '-ms-'];
    var camelPrefixes = ['Webkit', 'Moz', 'ms'];
    var importantRE = /!important;?$/;
    var propCache = Object.create(null);

    var testEl = null;

    var style = {

        deep: true,

        update: function update(value) {
            if (typeof value === 'string') {
                this.el.style.cssText = value;
            } else if (isArray(value)) {
                this.handleObject(value.reduce(extend, {}));
            } else {
                this.handleObject(value || {});
            }
        },

        handleObject: function handleObject(value) {
            // cache object styles so that only changed props
            // are actually updated.
            var cache = this.cache || (this.cache = {});
            var name, val;
            for (name in cache) {
                if (!(name in value)) {
                    this.handleSingle(name, null);
                    delete cache[name];
                }
            }
            for (name in value) {
                val = value[name];
                if (val !== cache[name]) {
                    cache[name] = val;
                    this.handleSingle(name, val);
                }
            }
        },

        handleSingle: function handleSingle(prop, value) {
            prop = normalize(prop);
            if (!prop) return; // unsupported prop
            // cast possible numbers/booleans into strings
            if (value != null) value += '';
            if (value) {
                var isImportant = importantRE.test(value) ? 'important' : '';
                if (isImportant) {
                    /* istanbul ignore if */
                    if ('development' !== 'production') {
                        warn('It\'s probably a bad idea to use !important with inline rules. ' + 'This feature will be deprecated in a future version of Vue.');
                    }
                    value = value.replace(importantRE, '').trim();
                    this.el.style.setProperty(prop.kebab, value, isImportant);
                } else {
                    this.el.style[prop.camel] = value;
                }
            } else {
                this.el.style[prop.camel] = '';
            }
        }

    };

    /**
     * Normalize a CSS property name.
     * - cache result
     * - auto prefix
     * - camelCase -> dash-case
     *
     * @param {String} prop
     * @return {String}
     */

    function normalize(prop) {
        if (propCache[prop]) {
            return propCache[prop];
        }
        var res = prefix(prop);
        propCache[prop] = propCache[res] = res;
        return res;
    }

    /**
     * Auto detect the appropriate prefix for a CSS property.
     * https://gist.github.com/paulirish/523692
     *
     * @param {String} prop
     * @return {String}
     */

    function prefix(prop) {
        prop = hyphenate(prop);
        var camel = camelize(prop);
        var upper = camel.charAt(0).toUpperCase() + camel.slice(1);
        if (!testEl) {
            testEl = document.createElement('div');
        }
        var i = prefixes.length;
        var prefixed;
        if (camel !== 'filter' && camel in testEl.style) {
            return {
                kebab: prop,
                camel: camel
            };
        }
        while (i--) {
            prefixed = camelPrefixes[i] + upper;
            if (prefixed in testEl.style) {
                return {
                    kebab: prefixes[i] + prop,
                    camel: prefixed
                };
            }
        }
    }

    // xlink
    var xlinkNS = 'http://www.w3.org/1999/xlink';
    var xlinkRE = /^xlink:/;

    // check for attributes that prohibit interpolations
    var disallowedInterpAttrRE = /^v-|^:|^@|^(?:is|transition|transition-mode|debounce|track-by|stagger|enter-stagger|leave-stagger)$/;
    // these attributes should also set their corresponding properties
    // because they only affect the initial state of the element
    var attrWithPropsRE = /^(?:value|checked|selected|muted)$/;
    // these attributes expect enumrated values of "true" or "false"
    // but are not boolean attributes
    var enumeratedAttrRE = /^(?:draggable|contenteditable|spellcheck)$/;

    // these attributes should set a hidden property for
    // binding v-model to object values
    var modelProps = {
        value: '_value',
        'true-value': '_trueValue',
        'false-value': '_falseValue'
    };

    var bind$1 = {

        priority: BIND,

        bind: function bind() {
            var attr = this.arg;
            var tag = this.el.tagName;
            // should be deep watch on object mode
            if (!attr) {
                this.deep = true;
            }
            // handle interpolation bindings
            var descriptor = this.descriptor;
            var tokens = descriptor.interp;
            if (tokens) {
                // handle interpolations with one-time tokens
                if (descriptor.hasOneTime) {
                    this.expression = tokensToExp(tokens, this._scope || this.vm);
                }

                // only allow binding on native attributes
                if (disallowedInterpAttrRE.test(attr) || attr === 'name' && (tag === 'PARTIAL' || tag === 'SLOT')) {
                    'development' !== 'production' && warn(attr + '="' + descriptor.raw + '": ' + 'attribute interpolation is not allowed in Vue.js ' + 'directives and special attributes.', this.vm);
                    this.el.removeAttribute(attr);
                    this.invalid = true;
                }

                /* istanbul ignore if */
                if ('development' !== 'production') {
                    var raw = attr + '="' + descriptor.raw + '": ';
                    // warn src
                    if (attr === 'src') {
                        warn(raw + 'interpolation in "src" attribute will cause ' + 'a 404 request. Use v-bind:src instead.', this.vm);
                    }

                    // warn style
                    if (attr === 'style') {
                        warn(raw + 'interpolation in "style" attribute will cause ' + 'the attribute to be discarded in Internet Explorer. ' + 'Use v-bind:style instead.', this.vm);
                    }
                }
            }
        },

        update: function update(value) {
            if (this.invalid) {
                return;
            }
            var attr = this.arg;
            if (this.arg) {
                this.handleSingle(attr, value);
            } else {
                this.handleObject(value || {});
            }
        },

        // share object handler with v-bind:class
        handleObject: style.handleObject,

        handleSingle: function handleSingle(attr, value) {
            var el = this.el;
            var interp = this.descriptor.interp;
            if (this.modifiers.camel) {
                attr = camelize(attr);
            }
            if (!interp && attrWithPropsRE.test(attr) && attr in el) {
                var attrValue = attr === 'value' ? value == null // IE9 will set input.value to "null" for null...
                    ? '' : value : value;

                if (el[attr] !== attrValue) {
                    el[attr] = attrValue;
                }
            }
            // set model props
            var modelProp = modelProps[attr];
            if (!interp && modelProp) {
                el[modelProp] = value;
                // update v-model if present
                var model = el.__v_model;
                if (model) {
                    model.listener();
                }
            }
            // do not set value attribute for textarea
            if (attr === 'value' && el.tagName === 'TEXTAREA') {
                el.removeAttribute(attr);
                return;
            }
            // update attribute
            if (enumeratedAttrRE.test(attr)) {
                el.setAttribute(attr, value ? 'true' : 'false');
            } else if (value != null && value !== false) {
                if (attr === 'class') {
                    // handle edge case #1960:
                    // class interpolation should not overwrite Vue transition class
                    if (el.__v_trans) {
                        value += ' ' + el.__v_trans.id + '-transition';
                    }
                    setClass(el, value);
                } else if (xlinkRE.test(attr)) {
                    el.setAttributeNS(xlinkNS, attr, value === true ? '' : value);
                } else {
                    el.setAttribute(attr, value === true ? '' : value);
                }
            } else {
                el.removeAttribute(attr);
            }
        }
    };

    var el = {

        priority: EL,

        bind: function bind() {
            /* istanbul ignore if */
            if (!this.arg) {
                return;
            }
            var id = this.id = camelize(this.arg);
            var refs = (this._scope || this.vm).$els;
            if (hasOwn(refs, id)) {
                refs[id] = this.el;
            } else {
                defineReactive(refs, id, this.el);
            }
        },

        unbind: function unbind() {
            var refs = (this._scope || this.vm).$els;
            if (refs[this.id] === this.el) {
                refs[this.id] = null;
            }
        }
    };

    var ref = {
        bind: function bind() {
            'development' !== 'production' && warn('v-ref:' + this.arg + ' must be used on a child ' + 'component. Found on <' + this.el.tagName.toLowerCase() + '>.', this.vm);
        }
    };

    var cloak = {
        bind: function bind() {
            var el = this.el;
            this.vm.$once('pre-hook:compiled', function () {
                el.removeAttribute('v-cloak');
            });
        }
    };

    // must export plain object
    var directives = {
        text: text$1,
        html: html,
        'for': vFor,
        'if': vIf,
        show: show,
        model: model,
        on: on$1,
        bind: bind$1,
        el: el,
        ref: ref,
        cloak: cloak
    };

    var vClass = {

        deep: true,

        update: function update(value) {
            if (!value) {
                this.cleanup();
            } else if (typeof value === 'string') {
                this.setClass(value.trim().split(/\s+/));
            } else {
                this.setClass(normalize$1(value));
            }
        },

        setClass: function setClass(value) {
            this.cleanup(value);
            for (var i = 0, l = value.length; i < l; i++) {
                var val = value[i];
                if (val) {
                    apply(this.el, val, addClass);
                }
            }
            this.prevKeys = value;
        },

        cleanup: function cleanup(value) {
            var prevKeys = this.prevKeys;
            if (!prevKeys) return;
            var i = prevKeys.length;
            while (i--) {
                var key = prevKeys[i];
                if (!value || value.indexOf(key) < 0) {
                    apply(this.el, key, removeClass);
                }
            }
        }
    };

    /**
     * Normalize objects and arrays (potentially containing objects)
     * into array of strings.
     *
     * @param {Object|Array<String|Object>} value
     * @return {Array<String>}
     */

    function normalize$1(value) {
        var res = [];
        if (isArray(value)) {
            for (var i = 0, l = value.length; i < l; i++) {
                var _key = value[i];
                if (_key) {
                    if (typeof _key === 'string') {
                        res.push(_key);
                    } else {
                        for (var k in _key) {
                            if (_key[k]) res.push(k);
                        }
                    }
                }
            }
        } else if (isObject(value)) {
            for (var key in value) {
                if (value[key]) res.push(key);
            }
        }
        return res;
    }

    /**
     * Add or remove a class/classes on an element
     *
     * @param {Element} el
     * @param {String} key The class name. This may or may not
     *                     contain a space character, in such a
     *                     case we'll deal with multiple class
     *                     names at once.
     * @param {Function} fn
     */

    function apply(el, key, fn) {
        key = key.trim();
        if (key.indexOf(' ') === -1) {
            fn(el, key);
            return;
        }
        // The key contains one or more space characters.
        // Since a class name doesn't accept such characters, we
        // treat it as multiple classes.
        var keys = key.split(/\s+/);
        for (var i = 0, l = keys.length; i < l; i++) {
            fn(el, keys[i]);
        }
    }

    var component = {

        priority: COMPONENT,

        params: ['keep-alive', 'transition-mode', 'inline-template'],

        /**
         * Setup. Two possible usages:
         *
         * - static:
         *   <comp> or <div v-component="comp">
         *
         * - dynamic:
         *   <component :is="view">
         */

        bind: function bind() {
            if (!this.el.__vue__) {
                // keep-alive cache
                this.keepAlive = this.params.keepAlive;
                if (this.keepAlive) {
                    this.cache = {};
                }
                // check inline-template
                if (this.params.inlineTemplate) {
                    // extract inline template as a DocumentFragment
                    this.inlineTemplate = extractContent(this.el, true);
                }
                // component resolution related state
                this.pendingComponentCb = this.Component = null;
                // transition related state
                this.pendingRemovals = 0;
                this.pendingRemovalCb = null;
                // create a ref anchor
                this.anchor = createAnchor('v-component');
                replace(this.el, this.anchor);
                // remove is attribute.
                // this is removed during compilation, but because compilation is
                // cached, when the component is used elsewhere this attribute
                // will remain at link time.
                this.el.removeAttribute('is');
                this.el.removeAttribute(':is');
                // remove ref, same as above
                if (this.descriptor.ref) {
                    this.el.removeAttribute('v-ref:' + hyphenate(this.descriptor.ref));
                }
                // if static, build right now.
                if (this.literal) {
                    this.setComponent(this.expression);
                }
            } else {
                'development' !== 'production' && warn('cannot mount component "' + this.expression + '" ' + 'on already mounted element: ' + this.el);
            }
        },

        /**
         * Public update, called by the watcher in the dynamic
         * literal scenario, e.g. <component :is="view">
         */

        update: function update(value) {
            if (!this.literal) {
                this.setComponent(value);
            }
        },

        /**
         * Switch dynamic components. May resolve the component
         * asynchronously, and perform transition based on
         * specified transition mode. Accepts a few additional
         * arguments specifically for vue-router.
         *
         * The callback is called when the full transition is
         * finished.
         *
         * @param {String} value
         * @param {Function} [cb]
         */

        setComponent: function setComponent(value, cb) {
            this.invalidatePending();
            if (!value) {
                // just remove current
                this.unbuild(true);
                this.remove(this.childVM, cb);
                this.childVM = null;
            } else {
                var self = this;
                this.resolveComponent(value, function () {
                    self.mountComponent(cb);
                });
            }
        },

        /**
         * Resolve the component constructor to use when creating
         * the child vm.
         *
         * @param {String|Function} value
         * @param {Function} cb
         */

        resolveComponent: function resolveComponent(value, cb) {
            var self = this;
            this.pendingComponentCb = cancellable(function (Component) {
                self.ComponentName = Component.options.name || (typeof value === 'string' ? value : null);
                self.Component = Component;
                cb();
            });
            this.vm._resolveComponent(value, this.pendingComponentCb);
        },

        /**
         * Create a new instance using the current constructor and
         * replace the existing instance. This method doesn't care
         * whether the new component and the old one are actually
         * the same.
         *
         * @param {Function} [cb]
         */

        mountComponent: function mountComponent(cb) {
            // actual mount
            this.unbuild(true);
            var self = this;
            var activateHooks = this.Component.options.activate;
            var cached = this.getCached();
            var newComponent = this.build();
            if (activateHooks && !cached) {
                this.waitingFor = newComponent;
                callActivateHooks(activateHooks, newComponent, function () {
                    if (self.waitingFor !== newComponent) {
                        return;
                    }
                    self.waitingFor = null;
                    self.transition(newComponent, cb);
                });
            } else {
                // update ref for kept-alive component
                if (cached) {
                    newComponent._updateRef();
                }
                this.transition(newComponent, cb);
            }
        },

        /**
         * When the component changes or unbinds before an async
         * constructor is resolved, we need to invalidate its
         * pending callback.
         */

        invalidatePending: function invalidatePending() {
            if (this.pendingComponentCb) {
                this.pendingComponentCb.cancel();
                this.pendingComponentCb = null;
            }
        },

        /**
         * Instantiate/insert a new child vm.
         * If keep alive and has cached instance, insert that
         * instance; otherwise build a new one and cache it.
         *
         * @param {Object} [extraOptions]
         * @return {Vue} - the created instance
         */

        build: function build(extraOptions) {
            var cached = this.getCached();
            if (cached) {
                return cached;
            }
            if (this.Component) {
                // default options
                var options = {
                    name: this.ComponentName,
                    el: cloneNode(this.el),
                    template: this.inlineTemplate,
                    // make sure to add the child with correct parent
                    // if this is a transcluded component, its parent
                    // should be the transclusion host.
                    parent: this._host || this.vm,
                    // if no inline-template, then the compiled
                    // linker can be cached for better performance.
                    _linkerCachable: !this.inlineTemplate,
                    _ref: this.descriptor.ref,
                    _asComponent: true,
                    _isRouterView: this._isRouterView,
                    // if this is a transcluded component, context
                    // will be the common parent vm of this instance
                    // and its host.
                    _context: this.vm,
                    // if this is inside an inline v-for, the scope
                    // will be the intermediate scope created for this
                    // repeat fragment. this is used for linking props
                    // and container directives.
                    _scope: this._scope,
                    // pass in the owner fragment of this component.
                    // this is necessary so that the fragment can keep
                    // track of its contained components in order to
                    // call attach/detach hooks for them.
                    _frag: this._frag
                };
                // extra options
                // in 1.0.0 this is used by vue-router only
                /* istanbul ignore if */
                if (extraOptions) {
                    extend(options, extraOptions);
                }
                var child = new this.Component(options);
                if (this.keepAlive) {
                    this.cache[this.Component.cid] = child;
                }
                /* istanbul ignore if */
                if ('development' !== 'production' && this.el.hasAttribute('transition') && child._isFragment) {
                    warn('Transitions will not work on a fragment instance. ' + 'Template: ' + child.$options.template, child);
                }
                return child;
            }
        },

        /**
         * Try to get a cached instance of the current component.
         *
         * @return {Vue|undefined}
         */

        getCached: function getCached() {
            return this.keepAlive && this.cache[this.Component.cid];
        },

        /**
         * Teardown the current child, but defers cleanup so
         * that we can separate the destroy and removal steps.
         *
         * @param {Boolean} defer
         */

        unbuild: function unbuild(defer) {
            if (this.waitingFor) {
                if (!this.keepAlive) {
                    this.waitingFor.$destroy();
                }
                this.waitingFor = null;
            }
            var child = this.childVM;
            if (!child || this.keepAlive) {
                if (child) {
                    // remove ref
                    child._inactive = true;
                    child._updateRef(true);
                }
                return;
            }
            // the sole purpose of `deferCleanup` is so that we can
            // "deactivate" the vm right now and perform DOM removal
            // later.
            child.$destroy(false, defer);
        },

        /**
         * Remove current destroyed child and manually do
         * the cleanup after removal.
         *
         * @param {Function} cb
         */

        remove: function remove(child, cb) {
            var keepAlive = this.keepAlive;
            if (child) {
                // we may have a component switch when a previous
                // component is still being transitioned out.
                // we want to trigger only one lastest insertion cb
                // when the existing transition finishes. (#1119)
                this.pendingRemovals++;
                this.pendingRemovalCb = cb;
                var self = this;
                child.$remove(function () {
                    self.pendingRemovals--;
                    if (!keepAlive) child._cleanup();
                    if (!self.pendingRemovals && self.pendingRemovalCb) {
                        self.pendingRemovalCb();
                        self.pendingRemovalCb = null;
                    }
                });
            } else if (cb) {
                cb();
            }
        },

        /**
         * Actually swap the components, depending on the
         * transition mode. Defaults to simultaneous.
         *
         * @param {Vue} target
         * @param {Function} [cb]
         */

        transition: function transition(target, cb) {
            var self = this;
            var current = this.childVM;
            // for devtool inspection
            if (current) current._inactive = true;
            target._inactive = false;
            this.childVM = target;
            switch (self.params.transitionMode) {
                case 'in-out':
                    target.$before(self.anchor, function () {
                        self.remove(current, cb);
                    });
                    break;
                case 'out-in':
                    self.remove(current, function () {
                        target.$before(self.anchor, cb);
                    });
                    break;
                default:
                    self.remove(current);
                    target.$before(self.anchor, cb);
            }
        },

        /**
         * Unbind.
         */

        unbind: function unbind() {
            this.invalidatePending();
            // Do not defer cleanup when unbinding
            this.unbuild();
            // destroy all keep-alive cached instances
            if (this.cache) {
                for (var key in this.cache) {
                    this.cache[key].$destroy();
                }
                this.cache = null;
            }
        }
    };

    /**
     * Call activate hooks in order (asynchronous)
     *
     * @param {Array} hooks
     * @param {Vue} vm
     * @param {Function} cb
     */

    function callActivateHooks(hooks, vm, cb) {
        var total = hooks.length;
        var called = 0;
        hooks[0].call(vm, next);
        function next() {
            if (++called >= total) {
                cb();
            } else {
                hooks[called].call(vm, next);
            }
        }
    }

    var propBindingModes = config._propBindingModes;
    var empty = {};

    // regexes
    var identRE$1 = /^[$_a-zA-Z]+[\w$]*$/;
    var settablePathRE = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\[[^\[\]]+\])*$/;

    /**
     * Compile props on a root element and return
     * a props link function.
     *
     * @param {Element|DocumentFragment} el
     * @param {Array} propOptions
     * @param {Vue} vm
     * @return {Function} propsLinkFn
     */

    function compileProps(el, propOptions, vm) {
        var props = [];
        var names = Object.keys(propOptions);
        var i = names.length;
        var options, name, attr, value, path, parsed, prop;
        while (i--) {
            name = names[i];
            options = propOptions[name] || empty;

            if ('development' !== 'production' && name === '$data') {
                warn('Do not use $data as prop.', vm);
                continue;
            }

            // props could contain dashes, which will be
            // interpreted as minus calculations by the parser
            // so we need to camelize the path here
            path = camelize(name);
            if (!identRE$1.test(path)) {
                'development' !== 'production' && warn('Invalid prop key: "' + name + '". Prop keys ' + 'must be valid identifiers.', vm);
                continue;
            }

            prop = {
                name: name,
                path: path,
                options: options,
                mode: propBindingModes.ONE_WAY,
                raw: null
            };

            attr = hyphenate(name);
            // first check dynamic version
            if ((value = getBindAttr(el, attr)) === null) {
                if ((value = getBindAttr(el, attr + '.sync')) !== null) {
                    prop.mode = propBindingModes.TWO_WAY;
                } else if ((value = getBindAttr(el, attr + '.once')) !== null) {
                    prop.mode = propBindingModes.ONE_TIME;
                }
            }
            if (value !== null) {
                // has dynamic binding!
                prop.raw = value;
                parsed = parseDirective(value);
                value = parsed.expression;
                prop.filters = parsed.filters;
                // check binding type
                if (isLiteral(value) && !parsed.filters) {
                    // for expressions containing literal numbers and
                    // booleans, there's no need to setup a prop binding,
                    // so we can optimize them as a one-time set.
                    prop.optimizedLiteral = true;
                } else {
                    prop.dynamic = true;
                    // check non-settable path for two-way bindings
                    if ('development' !== 'production' && prop.mode === propBindingModes.TWO_WAY && !settablePathRE.test(value)) {
                        prop.mode = propBindingModes.ONE_WAY;
                        warn('Cannot bind two-way prop with non-settable ' + 'parent path: ' + value, vm);
                    }
                }
                prop.parentPath = value;

                // warn required two-way
                if ('development' !== 'production' && options.twoWay && prop.mode !== propBindingModes.TWO_WAY) {
                    warn('Prop "' + name + '" expects a two-way binding type.', vm);
                }
            } else if ((value = getAttr(el, attr)) !== null) {
                // has literal binding!
                prop.raw = value;
            } else if ('development' !== 'production') {
                // check possible camelCase prop usage
                var lowerCaseName = path.toLowerCase();
                value = /[A-Z\-]/.test(name) && (el.getAttribute(lowerCaseName) || el.getAttribute(':' + lowerCaseName) || el.getAttribute('v-bind:' + lowerCaseName) || el.getAttribute(':' + lowerCaseName + '.once') || el.getAttribute('v-bind:' + lowerCaseName + '.once') || el.getAttribute(':' + lowerCaseName + '.sync') || el.getAttribute('v-bind:' + lowerCaseName + '.sync'));
                if (value) {
                    warn('Possible usage error for prop `' + lowerCaseName + '` - ' + 'did you mean `' + attr + '`? HTML is case-insensitive, remember to use ' + 'kebab-case for props in templates.', vm);
                } else if (options.required) {
                    // warn missing required
                    warn('Missing required prop: ' + name, vm);
                }
            }
            // push prop
            props.push(prop);
        }
        return makePropsLinkFn(props);
    }

    /**
     * Build a function that applies props to a vm.
     *
     * @param {Array} props
     * @return {Function} propsLinkFn
     */

    function makePropsLinkFn(props) {
        return function propsLinkFn(vm, scope) {
            // store resolved props info
            vm._props = {};
            var inlineProps = vm.$options.propsData;
            var i = props.length;
            var prop, path, options, value, raw;
            while (i--) {
                prop = props[i];
                raw = prop.raw;
                path = prop.path;
                options = prop.options;
                vm._props[path] = prop;
                if (inlineProps && hasOwn(inlineProps, path)) {
                    initProp(vm, prop, inlineProps[path]);
                }if (raw === null) {
                    // initialize absent prop
                    initProp(vm, prop, undefined);
                } else if (prop.dynamic) {
                    // dynamic prop
                    if (prop.mode === propBindingModes.ONE_TIME) {
                        // one time binding
                        value = (scope || vm._context || vm).$get(prop.parentPath);
                        initProp(vm, prop, value);
                    } else {
                        if (vm._context) {
                            // dynamic binding
                            vm._bindDir({
                                name: 'prop',
                                def: propDef,
                                prop: prop
                            }, null, null, scope); // el, host, scope
                        } else {
                            // root instance
                            initProp(vm, prop, vm.$get(prop.parentPath));
                        }
                    }
                } else if (prop.optimizedLiteral) {
                    // optimized literal, cast it and just set once
                    var stripped = stripQuotes(raw);
                    value = stripped === raw ? toBoolean(toNumber(raw)) : stripped;
                    initProp(vm, prop, value);
                } else {
                    // string literal, but we need to cater for
                    // Boolean props with no value, or with same
                    // literal value (e.g. disabled="disabled")
                    // see https://github.com/vuejs/vue-loader/issues/182
                    value = options.type === Boolean && (raw === '' || raw === hyphenate(prop.name)) ? true : raw;
                    initProp(vm, prop, value);
                }
            }
        };
    }

    /**
     * Process a prop with a rawValue, applying necessary coersions,
     * default values & assertions and call the given callback with
     * processed value.
     *
     * @param {Vue} vm
     * @param {Object} prop
     * @param {*} rawValue
     * @param {Function} fn
     */

    function processPropValue(vm, prop, rawValue, fn) {
        var isSimple = prop.dynamic && isSimplePath(prop.parentPath);
        var value = rawValue;
        if (value === undefined) {
            value = getPropDefaultValue(vm, prop);
        }
        value = coerceProp(prop, value, vm);
        var coerced = value !== rawValue;
        if (!assertProp(prop, value, vm)) {
            value = undefined;
        }
        if (isSimple && !coerced) {
            withoutConversion(function () {
                fn(value);
            });
        } else {
            fn(value);
        }
    }

    /**
     * Set a prop's initial value on a vm and its data object.
     *
     * @param {Vue} vm
     * @param {Object} prop
     * @param {*} value
     */

    function initProp(vm, prop, value) {
        processPropValue(vm, prop, value, function (value) {
            defineReactive(vm, prop.path, value);
        });
    }

    /**
     * Update a prop's value on a vm.
     *
     * @param {Vue} vm
     * @param {Object} prop
     * @param {*} value
     */

    function updateProp(vm, prop, value) {
        processPropValue(vm, prop, value, function (value) {
            vm[prop.path] = value;
        });
    }

    /**
     * Get the default value of a prop.
     *
     * @param {Vue} vm
     * @param {Object} prop
     * @return {*}
     */

    function getPropDefaultValue(vm, prop) {
        // no default, return undefined
        var options = prop.options;
        if (!hasOwn(options, 'default')) {
            // absent boolean value defaults to false
            return options.type === Boolean ? false : undefined;
        }
        var def = options['default'];
        // warn against non-factory defaults for Object & Array
        if (isObject(def)) {
            'development' !== 'production' && warn('Invalid default value for prop "' + prop.name + '": ' + 'Props with type Object/Array must use a factory function ' + 'to return the default value.', vm);
        }
        // call factory function for non-Function types
        return typeof def === 'function' && options.type !== Function ? def.call(vm) : def;
    }

    /**
     * Assert whether a prop is valid.
     *
     * @param {Object} prop
     * @param {*} value
     * @param {Vue} vm
     */

    function assertProp(prop, value, vm) {
        if (!prop.options.required && ( // non-required
            prop.raw === null || // abscent
                value == null) // null or undefined
            ) {
            return true;
        }
        var options = prop.options;
        var type = options.type;
        var valid = !type;
        var expectedTypes = [];
        if (type) {
            if (!isArray(type)) {
                type = [type];
            }
            for (var i = 0; i < type.length && !valid; i++) {
                var assertedType = assertType(value, type[i]);
                expectedTypes.push(assertedType.expectedType);
                valid = assertedType.valid;
            }
        }
        if (!valid) {
            if ('development' !== 'production') {
                warn('Invalid prop: type check failed for prop "' + prop.name + '".' + ' Expected ' + expectedTypes.map(formatType).join(', ') + ', got ' + formatValue(value) + '.', vm);
            }
            return false;
        }
        var validator = options.validator;
        if (validator) {
            if (!validator(value)) {
                'development' !== 'production' && warn('Invalid prop: custom validator check failed for prop "' + prop.name + '".', vm);
                return false;
            }
        }
        return true;
    }

    /**
     * Force parsing value with coerce option.
     *
     * @param {*} value
     * @param {Object} options
     * @return {*}
     */

    function coerceProp(prop, value, vm) {
        var coerce = prop.options.coerce;
        if (!coerce) {
            return value;
        }
        if (typeof coerce === 'function') {
            return coerce(value);
        } else {
            'development' !== 'production' && warn('Invalid coerce for prop "' + prop.name + '": expected function, got ' + typeof coerce + '.', vm);
            return value;
        }
    }

    /**
     * Assert the type of a value
     *
     * @param {*} value
     * @param {Function} type
     * @return {Object}
     */

    function assertType(value, type) {
        var valid;
        var expectedType;
        if (type === String) {
            expectedType = 'string';
            valid = typeof value === expectedType;
        } else if (type === Number) {
            expectedType = 'number';
            valid = typeof value === expectedType;
        } else if (type === Boolean) {
            expectedType = 'boolean';
            valid = typeof value === expectedType;
        } else if (type === Function) {
            expectedType = 'function';
            valid = typeof value === expectedType;
        } else if (type === Object) {
            expectedType = 'object';
            valid = isPlainObject(value);
        } else if (type === Array) {
            expectedType = 'array';
            valid = isArray(value);
        } else {
            valid = value instanceof type;
        }
        return {
            valid: valid,
            expectedType: expectedType
        };
    }

    /**
     * Format type for output
     *
     * @param {String} type
     * @return {String}
     */

    function formatType(type) {
        return type ? type.charAt(0).toUpperCase() + type.slice(1) : 'custom type';
    }

    /**
     * Format value
     *
     * @param {*} value
     * @return {String}
     */

    function formatValue(val) {
        return Object.prototype.toString.call(val).slice(8, -1);
    }

    var bindingModes = config._propBindingModes;

    var propDef = {

        bind: function bind() {
            var child = this.vm;
            var parent = child._context;
            // passed in from compiler directly
            var prop = this.descriptor.prop;
            var childKey = prop.path;
            var parentKey = prop.parentPath;
            var twoWay = prop.mode === bindingModes.TWO_WAY;

            var parentWatcher = this.parentWatcher = new Watcher(parent, parentKey, function (val) {
                updateProp(child, prop, val);
            }, {
                twoWay: twoWay,
                filters: prop.filters,
                // important: props need to be observed on the
                // v-for scope if present
                scope: this._scope
            });

            // set the child initial value.
            initProp(child, prop, parentWatcher.value);

            // setup two-way binding
            if (twoWay) {
                // important: defer the child watcher creation until
                // the created hook (after data observation)
                var self = this;
                child.$once('pre-hook:created', function () {
                    self.childWatcher = new Watcher(child, childKey, function (val) {
                        parentWatcher.set(val);
                    }, {
                        // ensure sync upward before parent sync down.
                        // this is necessary in cases e.g. the child
                        // mutates a prop array, then replaces it. (#1683)
                        sync: true
                    });
                });
            }
        },

        unbind: function unbind() {
            this.parentWatcher.teardown();
            if (this.childWatcher) {
                this.childWatcher.teardown();
            }
        }
    };

    var queue$1 = [];
    var queued = false;

    /**
     * Push a job into the queue.
     *
     * @param {Function} job
     */

    function pushJob(job) {
        queue$1.push(job);
        if (!queued) {
            queued = true;
            nextTick(flush);
        }
    }

    /**
     * Flush the queue, and do one forced reflow before
     * triggering transitions.
     */

    function flush() {
        // Force layout
        var f = document.documentElement.offsetHeight;
        for (var i = 0; i < queue$1.length; i++) {
            queue$1[i]();
        }
        queue$1 = [];
        queued = false;
        // dummy return, so js linters don't complain about
        // unused variable f
        return f;
    }

    var TYPE_TRANSITION = 'transition';
    var TYPE_ANIMATION = 'animation';
    var transDurationProp = transitionProp + 'Duration';
    var animDurationProp = animationProp + 'Duration';

    /**
     * If a just-entered element is applied the
     * leave class while its enter transition hasn't started yet,
     * and the transitioned property has the same value for both
     * enter/leave, then the leave transition will be skipped and
     * the transitionend event never fires. This function ensures
     * its callback to be called after a transition has started
     * by waiting for double raf.
     *
     * It falls back to setTimeout on devices that support CSS
     * transitions but not raf (e.g. Android 4.2 browser) - since
     * these environments are usually slow, we are giving it a
     * relatively large timeout.
     */

    var raf = inBrowser && window.requestAnimationFrame;
    var waitForTransitionStart = raf
        /* istanbul ignore next */
        ? function (fn) {
        raf(function () {
            raf(fn);
        });
    } : function (fn) {
        setTimeout(fn, 50);
    };

    /**
     * A Transition object that encapsulates the state and logic
     * of the transition.
     *
     * @param {Element} el
     * @param {String} id
     * @param {Object} hooks
     * @param {Vue} vm
     */
    function Transition(el, id, hooks, vm) {
        this.id = id;
        this.el = el;
        this.enterClass = hooks && hooks.enterClass || id + '-enter';
        this.leaveClass = hooks && hooks.leaveClass || id + '-leave';
        this.hooks = hooks;
        this.vm = vm;
        // async state
        this.pendingCssEvent = this.pendingCssCb = this.cancel = this.pendingJsCb = this.op = this.cb = null;
        this.justEntered = false;
        this.entered = this.left = false;
        this.typeCache = {};
        // check css transition type
        this.type = hooks && hooks.type;
        /* istanbul ignore if */
        if ('development' !== 'production') {
            if (this.type && this.type !== TYPE_TRANSITION && this.type !== TYPE_ANIMATION) {
                warn('invalid CSS transition type for transition="' + this.id + '": ' + this.type, vm);
            }
        }
        // bind
        var self = this;['enterNextTick', 'enterDone', 'leaveNextTick', 'leaveDone'].forEach(function (m) {
            self[m] = bind(self[m], self);
        });
    }

    var p$1 = Transition.prototype;

    /**
     * Start an entering transition.
     *
     * 1. enter transition triggered
     * 2. call beforeEnter hook
     * 3. add enter class
     * 4. insert/show element
     * 5. call enter hook (with possible explicit js callback)
     * 6. reflow
     * 7. based on transition type:
     *    - transition:
     *        remove class now, wait for transitionend,
     *        then done if there's no explicit js callback.
     *    - animation:
     *        wait for animationend, remove class,
     *        then done if there's no explicit js callback.
     *    - no css transition:
     *        done now if there's no explicit js callback.
     * 8. wait for either done or js callback, then call
     *    afterEnter hook.
     *
     * @param {Function} op - insert/show the element
     * @param {Function} [cb]
     */

    p$1.enter = function (op, cb) {
        this.cancelPending();
        this.callHook('beforeEnter');
        this.cb = cb;
        addClass(this.el, this.enterClass);
        op();
        this.entered = false;
        this.callHookWithCb('enter');
        if (this.entered) {
            return; // user called done synchronously.
        }
        this.cancel = this.hooks && this.hooks.enterCancelled;
        pushJob(this.enterNextTick);
    };

    /**
     * The "nextTick" phase of an entering transition, which is
     * to be pushed into a queue and executed after a reflow so
     * that removing the class can trigger a CSS transition.
     */

    p$1.enterNextTick = function () {
        var _this = this;

        // prevent transition skipping
        this.justEntered = true;
        waitForTransitionStart(function () {
            _this.justEntered = false;
        });
        var enterDone = this.enterDone;
        var type = this.getCssTransitionType(this.enterClass);
        if (!this.pendingJsCb) {
            if (type === TYPE_TRANSITION) {
                // trigger transition by removing enter class now
                removeClass(this.el, this.enterClass);
                this.setupCssCb(transitionEndEvent, enterDone);
            } else if (type === TYPE_ANIMATION) {
                this.setupCssCb(animationEndEvent, enterDone);
            } else {
                enterDone();
            }
        } else if (type === TYPE_TRANSITION) {
            removeClass(this.el, this.enterClass);
        }
    };

    /**
     * The "cleanup" phase of an entering transition.
     */

    p$1.enterDone = function () {
        this.entered = true;
        this.cancel = this.pendingJsCb = null;
        removeClass(this.el, this.enterClass);
        this.callHook('afterEnter');
        if (this.cb) this.cb();
    };

    /**
     * Start a leaving transition.
     *
     * 1. leave transition triggered.
     * 2. call beforeLeave hook
     * 3. add leave class (trigger css transition)
     * 4. call leave hook (with possible explicit js callback)
     * 5. reflow if no explicit js callback is provided
     * 6. based on transition type:
     *    - transition or animation:
     *        wait for end event, remove class, then done if
     *        there's no explicit js callback.
     *    - no css transition:
     *        done if there's no explicit js callback.
     * 7. wait for either done or js callback, then call
     *    afterLeave hook.
     *
     * @param {Function} op - remove/hide the element
     * @param {Function} [cb]
     */

    p$1.leave = function (op, cb) {
        this.cancelPending();
        this.callHook('beforeLeave');
        this.op = op;
        this.cb = cb;
        addClass(this.el, this.leaveClass);
        this.left = false;
        this.callHookWithCb('leave');
        if (this.left) {
            return; // user called done synchronously.
        }
        this.cancel = this.hooks && this.hooks.leaveCancelled;
        // only need to handle leaveDone if
        // 1. the transition is already done (synchronously called
        //    by the user, which causes this.op set to null)
        // 2. there's no explicit js callback
        if (this.op && !this.pendingJsCb) {
            // if a CSS transition leaves immediately after enter,
            // the transitionend event never fires. therefore we
            // detect such cases and end the leave immediately.
            if (this.justEntered) {
                this.leaveDone();
            } else {
                pushJob(this.leaveNextTick);
            }
        }
    };

    /**
     * The "nextTick" phase of a leaving transition.
     */

    p$1.leaveNextTick = function () {
        var type = this.getCssTransitionType(this.leaveClass);
        if (type) {
            var event = type === TYPE_TRANSITION ? transitionEndEvent : animationEndEvent;
            this.setupCssCb(event, this.leaveDone);
        } else {
            this.leaveDone();
        }
    };

    /**
     * The "cleanup" phase of a leaving transition.
     */

    p$1.leaveDone = function () {
        this.left = true;
        this.cancel = this.pendingJsCb = null;
        this.op();
        removeClass(this.el, this.leaveClass);
        this.callHook('afterLeave');
        if (this.cb) this.cb();
        this.op = null;
    };

    /**
     * Cancel any pending callbacks from a previously running
     * but not finished transition.
     */

    p$1.cancelPending = function () {
        this.op = this.cb = null;
        var hasPending = false;
        if (this.pendingCssCb) {
            hasPending = true;
            off(this.el, this.pendingCssEvent, this.pendingCssCb);
            this.pendingCssEvent = this.pendingCssCb = null;
        }
        if (this.pendingJsCb) {
            hasPending = true;
            this.pendingJsCb.cancel();
            this.pendingJsCb = null;
        }
        if (hasPending) {
            removeClass(this.el, this.enterClass);
            removeClass(this.el, this.leaveClass);
        }
        if (this.cancel) {
            this.cancel.call(this.vm, this.el);
            this.cancel = null;
        }
    };

    /**
     * Call a user-provided synchronous hook function.
     *
     * @param {String} type
     */

    p$1.callHook = function (type) {
        if (this.hooks && this.hooks[type]) {
            this.hooks[type].call(this.vm, this.el);
        }
    };

    /**
     * Call a user-provided, potentially-async hook function.
     * We check for the length of arguments to see if the hook
     * expects a `done` callback. If true, the transition's end
     * will be determined by when the user calls that callback;
     * otherwise, the end is determined by the CSS transition or
     * animation.
     *
     * @param {String} type
     */

    p$1.callHookWithCb = function (type) {
        var hook = this.hooks && this.hooks[type];
        if (hook) {
            if (hook.length > 1) {
                this.pendingJsCb = cancellable(this[type + 'Done']);
            }
            hook.call(this.vm, this.el, this.pendingJsCb);
        }
    };

    /**
     * Get an element's transition type based on the
     * calculated styles.
     *
     * @param {String} className
     * @return {Number}
     */

    p$1.getCssTransitionType = function (className) {
        /* istanbul ignore if */
        if (!transitionEndEvent ||
            // skip CSS transitions if page is not visible -
            // this solves the issue of transitionend events not
            // firing until the page is visible again.
            // pageVisibility API is supported in IE10+, same as
            // CSS transitions.
            document.hidden ||
            // explicit js-only transition
            this.hooks && this.hooks.css === false ||
            // element is hidden
            isHidden(this.el)) {
            return;
        }
        var type = this.type || this.typeCache[className];
        if (type) return type;
        var inlineStyles = this.el.style;
        var computedStyles = window.getComputedStyle(this.el);
        var transDuration = inlineStyles[transDurationProp] || computedStyles[transDurationProp];
        if (transDuration && transDuration !== '0s') {
            type = TYPE_TRANSITION;
        } else {
            var animDuration = inlineStyles[animDurationProp] || computedStyles[animDurationProp];
            if (animDuration && animDuration !== '0s') {
                type = TYPE_ANIMATION;
            }
        }
        if (type) {
            this.typeCache[className] = type;
        }
        return type;
    };

    /**
     * Setup a CSS transitionend/animationend callback.
     *
     * @param {String} event
     * @param {Function} cb
     */

    p$1.setupCssCb = function (event, cb) {
        this.pendingCssEvent = event;
        var self = this;
        var el = this.el;
        var onEnd = this.pendingCssCb = function (e) {
            if (e.target === el) {
                off(el, event, onEnd);
                self.pendingCssEvent = self.pendingCssCb = null;
                if (!self.pendingJsCb && cb) {
                    cb();
                }
            }
        };
        on(el, event, onEnd);
    };

    /**
     * Check if an element is hidden - in that case we can just
     * skip the transition alltogether.
     *
     * @param {Element} el
     * @return {Boolean}
     */

    function isHidden(el) {
        if (/svg$/.test(el.namespaceURI)) {
            // SVG elements do not have offset(Width|Height)
            // so we need to check the client rect
            var rect = el.getBoundingClientRect();
            return !(rect.width || rect.height);
        } else {
            return !(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
        }
    }

    var transition$1 = {

        priority: TRANSITION,

        update: function update(id, oldId) {
            var el = this.el;
            // resolve on owner vm
            var hooks = resolveAsset(this.vm.$options, 'transitions', id);
            id = id || 'v';
            oldId = oldId || 'v';
            el.__v_trans = new Transition(el, id, hooks, this.vm);
            removeClass(el, oldId + '-transition');
            addClass(el, id + '-transition');
        }
    };

    var internalDirectives = {
        style: style,
        'class': vClass,
        component: component,
        prop: propDef,
        transition: transition$1
    };

    // special binding prefixes
    var bindRE = /^v-bind:|^:/;
    var onRE = /^v-on:|^@/;
    var dirAttrRE = /^v-([^:]+)(?:$|:(.*)$)/;
    var modifierRE = /\.[^\.]+/g;
    var transitionRE = /^(v-bind:|:)?transition$/;

    // default directive priority
    var DEFAULT_PRIORITY = 1000;
    var DEFAULT_TERMINAL_PRIORITY = 2000;

    /**
     * Compile a template and return a reusable composite link
     * function, which recursively contains more link functions
     * inside. This top level compile function would normally
     * be called on instance root nodes, but can also be used
     * for partial compilation if the partial argument is true.
     *
     * The returned composite link function, when called, will
     * return an unlink function that tearsdown all directives
     * created during the linking phase.
     *
     * @param {Element|DocumentFragment} el
     * @param {Object} options
     * @param {Boolean} partial
     * @return {Function}
     */

    function compile(el, options, partial) {
        // link function for the node itself.
        var nodeLinkFn = partial || !options._asComponent ? compileNode(el, options) : null;
        // link function for the childNodes
        var childLinkFn = !(nodeLinkFn && nodeLinkFn.terminal) && !isScript(el) && el.hasChildNodes() ? compileNodeList(el.childNodes, options) : null;

        /**
         * A composite linker function to be called on a already
         * compiled piece of DOM, which instantiates all directive
         * instances.
         *
         * @param {Vue} vm
         * @param {Element|DocumentFragment} el
         * @param {Vue} [host] - host vm of transcluded content
         * @param {Object} [scope] - v-for scope
         * @param {Fragment} [frag] - link context fragment
         * @return {Function|undefined}
         */

        return function compositeLinkFn(vm, el, host, scope, frag) {
            // cache childNodes before linking parent, fix #657
            var childNodes = toArray(el.childNodes);
            // link
            var dirs = linkAndCapture(function compositeLinkCapturer() {
                if (nodeLinkFn) nodeLinkFn(vm, el, host, scope, frag);
                if (childLinkFn) childLinkFn(vm, childNodes, host, scope, frag);
            }, vm);
            return makeUnlinkFn(vm, dirs);
        };
    }

    /**
     * Apply a linker to a vm/element pair and capture the
     * directives created during the process.
     *
     * @param {Function} linker
     * @param {Vue} vm
     */

    function linkAndCapture(linker, vm) {
        /* istanbul ignore if */
        if ('development' === 'production') {}
        var originalDirCount = vm._directives.length;
        linker();
        var dirs = vm._directives.slice(originalDirCount);
        dirs.sort(directiveComparator);
        for (var i = 0, l = dirs.length; i < l; i++) {
            dirs[i]._bind();
        }
        return dirs;
    }

    /**
     * Directive priority sort comparator
     *
     * @param {Object} a
     * @param {Object} b
     */

    function directiveComparator(a, b) {
        a = a.descriptor.def.priority || DEFAULT_PRIORITY;
        b = b.descriptor.def.priority || DEFAULT_PRIORITY;
        return a > b ? -1 : a === b ? 0 : 1;
    }

    /**
     * Linker functions return an unlink function that
     * tearsdown all directives instances generated during
     * the process.
     *
     * We create unlink functions with only the necessary
     * information to avoid retaining additional closures.
     *
     * @param {Vue} vm
     * @param {Array} dirs
     * @param {Vue} [context]
     * @param {Array} [contextDirs]
     * @return {Function}
     */

    function makeUnlinkFn(vm, dirs, context, contextDirs) {
        function unlink(destroying) {
            teardownDirs(vm, dirs, destroying);
            if (context && contextDirs) {
                teardownDirs(context, contextDirs);
            }
        }
        // expose linked directives
        unlink.dirs = dirs;
        return unlink;
    }

    /**
     * Teardown partial linked directives.
     *
     * @param {Vue} vm
     * @param {Array} dirs
     * @param {Boolean} destroying
     */

    function teardownDirs(vm, dirs, destroying) {
        var i = dirs.length;
        while (i--) {
            dirs[i]._teardown();
            if ('development' !== 'production' && !destroying) {
                vm._directives.$remove(dirs[i]);
            }
        }
    }

    /**
     * Compile link props on an instance.
     *
     * @param {Vue} vm
     * @param {Element} el
     * @param {Object} props
     * @param {Object} [scope]
     * @return {Function}
     */

    function compileAndLinkProps(vm, el, props, scope) {
        var propsLinkFn = compileProps(el, props, vm);
        var propDirs = linkAndCapture(function () {
            propsLinkFn(vm, scope);
        }, vm);
        return makeUnlinkFn(vm, propDirs);
    }

    /**
     * Compile the root element of an instance.
     *
     * 1. attrs on context container (context scope)
     * 2. attrs on the component template root node, if
     *    replace:true (child scope)
     *
     * If this is a fragment instance, we only need to compile 1.
     *
     * @param {Element} el
     * @param {Object} options
     * @param {Object} contextOptions
     * @return {Function}
     */

    function compileRoot(el, options, contextOptions) {
        var containerAttrs = options._containerAttrs;
        var replacerAttrs = options._replacerAttrs;
        var contextLinkFn, replacerLinkFn;

        // only need to compile other attributes for
        // non-fragment instances
        if (el.nodeType !== 11) {
            // for components, container and replacer need to be
            // compiled separately and linked in different scopes.
            if (options._asComponent) {
                // 2. container attributes
                if (containerAttrs && contextOptions) {
                    contextLinkFn = compileDirectives(containerAttrs, contextOptions);
                }
                if (replacerAttrs) {
                    // 3. replacer attributes
                    replacerLinkFn = compileDirectives(replacerAttrs, options);
                }
            } else {
                // non-component, just compile as a normal element.
                replacerLinkFn = compileDirectives(el.attributes, options);
            }
        } else if ('development' !== 'production' && containerAttrs) {
            // warn container directives for fragment instances
            var names = containerAttrs.filter(function (attr) {
                // allow vue-loader/vueify scoped css attributes
                return attr.name.indexOf('_v-') < 0 &&
                    // allow event listeners
                    !onRE.test(attr.name) &&
                    // allow slots
                    attr.name !== 'slot';
            }).map(function (attr) {
                    return '"' + attr.name + '"';
                });
            if (names.length) {
                var plural = names.length > 1;
                warn('Attribute' + (plural ? 's ' : ' ') + names.join(', ') + (plural ? ' are' : ' is') + ' ignored on component ' + '<' + options.el.tagName.toLowerCase() + '> because ' + 'the component is a fragment instance: ' + 'http://vuejs.org/guide/components.html#Fragment-Instance');
            }
        }

        options._containerAttrs = options._replacerAttrs = null;
        return function rootLinkFn(vm, el, scope) {
            // link context scope dirs
            var context = vm._context;
            var contextDirs;
            if (context && contextLinkFn) {
                contextDirs = linkAndCapture(function () {
                    contextLinkFn(context, el, null, scope);
                }, context);
            }

            // link self
            var selfDirs = linkAndCapture(function () {
                if (replacerLinkFn) replacerLinkFn(vm, el);
            }, vm);

            // return the unlink function that tearsdown context
            // container directives.
            return makeUnlinkFn(vm, selfDirs, context, contextDirs);
        };
    }

    /**
     * Compile a node and return a nodeLinkFn based on the
     * node type.
     *
     * @param {Node} node
     * @param {Object} options
     * @return {Function|null}
     */

    function compileNode(node, options) {
        var type = node.nodeType;
        if (type === 1 && !isScript(node)) {
            return compileElement(node, options);
        } else if (type === 3 && node.data.trim()) {
            return compileTextNode(node, options);
        } else {
            return null;
        }
    }

    /**
     * Compile an element and return a nodeLinkFn.
     *
     * @param {Element} el
     * @param {Object} options
     * @return {Function|null}
     */

    function compileElement(el, options) {
        // preprocess textareas.
        // textarea treats its text content as the initial value.
        // just bind it as an attr directive for value.
        if (el.tagName === 'TEXTAREA') {
            var tokens = parseText(el.value);
            if (tokens) {
                el.setAttribute(':value', tokensToExp(tokens));
                el.value = '';
            }
        }
        var linkFn;
        var hasAttrs = el.hasAttributes();
        var attrs = hasAttrs && toArray(el.attributes);
        // check terminal directives (for & if)
        if (hasAttrs) {
            linkFn = checkTerminalDirectives(el, attrs, options);
        }
        // check element directives
        if (!linkFn) {
            linkFn = checkElementDirectives(el, options);
        }
        // check component
        if (!linkFn) {
            linkFn = checkComponent(el, options);
        }
        // normal directives
        if (!linkFn && hasAttrs) {
            linkFn = compileDirectives(attrs, options);
        }
        return linkFn;
    }

    /**
     * Compile a textNode and return a nodeLinkFn.
     *
     * @param {TextNode} node
     * @param {Object} options
     * @return {Function|null} textNodeLinkFn
     */

    function compileTextNode(node, options) {
        // skip marked text nodes
        if (node._skip) {
            return removeText;
        }

        var tokens = parseText(node.wholeText);
        if (!tokens) {
            return null;
        }

        // mark adjacent text nodes as skipped,
        // because we are using node.wholeText to compile
        // all adjacent text nodes together. This fixes
        // issues in IE where sometimes it splits up a single
        // text node into multiple ones.
        var next = node.nextSibling;
        while (next && next.nodeType === 3) {
            next._skip = true;
            next = next.nextSibling;
        }

        var frag = document.createDocumentFragment();
        var el, token;
        for (var i = 0, l = tokens.length; i < l; i++) {
            token = tokens[i];
            el = token.tag ? processTextToken(token, options) : document.createTextNode(token.value);
            frag.appendChild(el);
        }
        return makeTextNodeLinkFn(tokens, frag, options);
    }

    /**
     * Linker for an skipped text node.
     *
     * @param {Vue} vm
     * @param {Text} node
     */

    function removeText(vm, node) {
        remove(node);
    }

    /**
     * Process a single text token.
     *
     * @param {Object} token
     * @param {Object} options
     * @return {Node}
     */

    function processTextToken(token, options) {
        var el;
        if (token.oneTime) {
            el = document.createTextNode(token.value);
        } else {
            if (token.html) {
                el = document.createComment('v-html');
                setTokenType('html');
            } else {
                // IE will clean up empty textNodes during
                // frag.cloneNode(true), so we have to give it
                // something here...
                el = document.createTextNode(' ');
                setTokenType('text');
            }
        }
        function setTokenType(type) {
            if (token.descriptor) return;
            var parsed = parseDirective(token.value);
            token.descriptor = {
                name: type,
                def: directives[type],
                expression: parsed.expression,
                filters: parsed.filters
            };
        }
        return el;
    }

    /**
     * Build a function that processes a textNode.
     *
     * @param {Array<Object>} tokens
     * @param {DocumentFragment} frag
     */

    function makeTextNodeLinkFn(tokens, frag) {
        return function textNodeLinkFn(vm, el, host, scope) {
            var fragClone = frag.cloneNode(true);
            var childNodes = toArray(fragClone.childNodes);
            var token, value, node;
            for (var i = 0, l = tokens.length; i < l; i++) {
                token = tokens[i];
                value = token.value;
                if (token.tag) {
                    node = childNodes[i];
                    if (token.oneTime) {
                        value = (scope || vm).$eval(value);
                        if (token.html) {
                            replace(node, parseTemplate(value, true));
                        } else {
                            node.data = _toString(value);
                        }
                    } else {
                        vm._bindDir(token.descriptor, node, host, scope);
                    }
                }
            }
            replace(el, fragClone);
        };
    }

    /**
     * Compile a node list and return a childLinkFn.
     *
     * @param {NodeList} nodeList
     * @param {Object} options
     * @return {Function|undefined}
     */

    function compileNodeList(nodeList, options) {
        var linkFns = [];
        var nodeLinkFn, childLinkFn, node;
        for (var i = 0, l = nodeList.length; i < l; i++) {
            node = nodeList[i];
            nodeLinkFn = compileNode(node, options);
            childLinkFn = !(nodeLinkFn && nodeLinkFn.terminal) && node.tagName !== 'SCRIPT' && node.hasChildNodes() ? compileNodeList(node.childNodes, options) : null;
            linkFns.push(nodeLinkFn, childLinkFn);
        }
        return linkFns.length ? makeChildLinkFn(linkFns) : null;
    }

    /**
     * Make a child link function for a node's childNodes.
     *
     * @param {Array<Function>} linkFns
     * @return {Function} childLinkFn
     */

    function makeChildLinkFn(linkFns) {
        return function childLinkFn(vm, nodes, host, scope, frag) {
            var node, nodeLinkFn, childrenLinkFn;
            for (var i = 0, n = 0, l = linkFns.length; i < l; n++) {
                node = nodes[n];
                nodeLinkFn = linkFns[i++];
                childrenLinkFn = linkFns[i++];
                // cache childNodes before linking parent, fix #657
                var childNodes = toArray(node.childNodes);
                if (nodeLinkFn) {
                    nodeLinkFn(vm, node, host, scope, frag);
                }
                if (childrenLinkFn) {
                    childrenLinkFn(vm, childNodes, host, scope, frag);
                }
            }
        };
    }

    /**
     * Check for element directives (custom elements that should
     * be resovled as terminal directives).
     *
     * @param {Element} el
     * @param {Object} options
     */

    function checkElementDirectives(el, options) {
        var tag = el.tagName.toLowerCase();
        if (commonTagRE.test(tag)) {
            return;
        }
        var def = resolveAsset(options, 'elementDirectives', tag);
        if (def) {
            return makeTerminalNodeLinkFn(el, tag, '', options, def);
        }
    }

    /**
     * Check if an element is a component. If yes, return
     * a component link function.
     *
     * @param {Element} el
     * @param {Object} options
     * @return {Function|undefined}
     */

    function checkComponent(el, options) {
        var component = checkComponentAttr(el, options);
        if (component) {
            var ref = findRef(el);
            var descriptor = {
                name: 'component',
                ref: ref,
                expression: component.id,
                def: internalDirectives.component,
                modifiers: {
                    literal: !component.dynamic
                }
            };
            var componentLinkFn = function componentLinkFn(vm, el, host, scope, frag) {
                if (ref) {
                    defineReactive((scope || vm).$refs, ref, null);
                }
                vm._bindDir(descriptor, el, host, scope, frag);
            };
            componentLinkFn.terminal = true;
            return componentLinkFn;
        }
    }

    /**
     * Check an element for terminal directives in fixed order.
     * If it finds one, return a terminal link function.
     *
     * @param {Element} el
     * @param {Array} attrs
     * @param {Object} options
     * @return {Function} terminalLinkFn
     */

    function checkTerminalDirectives(el, attrs, options) {
        // skip v-pre
        if (getAttr(el, 'v-pre') !== null) {
            return skip;
        }
        // skip v-else block, but only if following v-if
        if (el.hasAttribute('v-else')) {
            var prev = el.previousElementSibling;
            if (prev && prev.hasAttribute('v-if')) {
                return skip;
            }
        }

        var attr, name, value, modifiers, matched, dirName, rawName, arg, def, termDef;
        for (var i = 0, j = attrs.length; i < j; i++) {
            attr = attrs[i];
            name = attr.name.replace(modifierRE, '');
            if (matched = name.match(dirAttrRE)) {
                def = resolveAsset(options, 'directives', matched[1]);
                if (def && def.terminal) {
                    if (!termDef || (def.priority || DEFAULT_TERMINAL_PRIORITY) > termDef.priority) {
                        termDef = def;
                        rawName = attr.name;
                        modifiers = parseModifiers(attr.name);
                        value = attr.value;
                        dirName = matched[1];
                        arg = matched[2];
                    }
                }
            }
        }

        if (termDef) {
            return makeTerminalNodeLinkFn(el, dirName, value, options, termDef, rawName, arg, modifiers);
        }
    }

    function skip() {}
    skip.terminal = true;

    /**
     * Build a node link function for a terminal directive.
     * A terminal link function terminates the current
     * compilation recursion and handles compilation of the
     * subtree in the directive.
     *
     * @param {Element} el
     * @param {String} dirName
     * @param {String} value
     * @param {Object} options
     * @param {Object} def
     * @param {String} [rawName]
     * @param {String} [arg]
     * @param {Object} [modifiers]
     * @return {Function} terminalLinkFn
     */

    function makeTerminalNodeLinkFn(el, dirName, value, options, def, rawName, arg, modifiers) {
        var parsed = parseDirective(value);
        var descriptor = {
            name: dirName,
            arg: arg,
            expression: parsed.expression,
            filters: parsed.filters,
            raw: value,
            attr: rawName,
            modifiers: modifiers,
            def: def
        };
        // check ref for v-for and router-view
        if (dirName === 'for' || dirName === 'router-view') {
            descriptor.ref = findRef(el);
        }
        var fn = function terminalNodeLinkFn(vm, el, host, scope, frag) {
            if (descriptor.ref) {
                defineReactive((scope || vm).$refs, descriptor.ref, null);
            }
            vm._bindDir(descriptor, el, host, scope, frag);
        };
        fn.terminal = true;
        return fn;
    }

    /**
     * Compile the directives on an element and return a linker.
     *
     * @param {Array|NamedNodeMap} attrs
     * @param {Object} options
     * @return {Function}
     */

    function compileDirectives(attrs, options) {
        var i = attrs.length;
        var dirs = [];
        var attr, name, value, rawName, rawValue, dirName, arg, modifiers, dirDef, tokens, matched;
        while (i--) {
            attr = attrs[i];
            name = rawName = attr.name;
            value = rawValue = attr.value;
            tokens = parseText(value);
            // reset arg
            arg = null;
            // check modifiers
            modifiers = parseModifiers(name);
            name = name.replace(modifierRE, '');

            // attribute interpolations
            if (tokens) {
                value = tokensToExp(tokens);
                arg = name;
                pushDir('bind', directives.bind, tokens);
                // warn against mixing mustaches with v-bind
                if ('development' !== 'production') {
                    if (name === 'class' && Array.prototype.some.call(attrs, function (attr) {
                        return attr.name === ':class' || attr.name === 'v-bind:class';
                    })) {
                        warn('class="' + rawValue + '": Do not mix mustache interpolation ' + 'and v-bind for "class" on the same element. Use one or the other.', options);
                    }
                }
            } else

            // special attribute: transition
            if (transitionRE.test(name)) {
                modifiers.literal = !bindRE.test(name);
                pushDir('transition', internalDirectives.transition);
            } else

            // event handlers
            if (onRE.test(name)) {
                arg = name.replace(onRE, '');
                pushDir('on', directives.on);
            } else

            // attribute bindings
            if (bindRE.test(name)) {
                dirName = name.replace(bindRE, '');
                if (dirName === 'style' || dirName === 'class') {
                    pushDir(dirName, internalDirectives[dirName]);
                } else {
                    arg = dirName;
                    pushDir('bind', directives.bind);
                }
            } else

            // normal directives
            if (matched = name.match(dirAttrRE)) {
                dirName = matched[1];
                arg = matched[2];

                // skip v-else (when used with v-show)
                if (dirName === 'else') {
                    continue;
                }

                dirDef = resolveAsset(options, 'directives', dirName, true);
                if (dirDef) {
                    pushDir(dirName, dirDef);
                }
            }
        }

        /**
         * Push a directive.
         *
         * @param {String} dirName
         * @param {Object|Function} def
         * @param {Array} [interpTokens]
         */

        function pushDir(dirName, def, interpTokens) {
            var hasOneTimeToken = interpTokens && hasOneTime(interpTokens);
            var parsed = !hasOneTimeToken && parseDirective(value);
            dirs.push({
                name: dirName,
                attr: rawName,
                raw: rawValue,
                def: def,
                arg: arg,
                modifiers: modifiers,
                // conversion from interpolation strings with one-time token
                // to expression is differed until directive bind time so that we
                // have access to the actual vm context for one-time bindings.
                expression: parsed && parsed.expression,
                filters: parsed && parsed.filters,
                interp: interpTokens,
                hasOneTime: hasOneTimeToken
            });
        }

        if (dirs.length) {
            return makeNodeLinkFn(dirs);
        }
    }

    /**
     * Parse modifiers from directive attribute name.
     *
     * @param {String} name
     * @return {Object}
     */

    function parseModifiers(name) {
        var res = Object.create(null);
        var match = name.match(modifierRE);
        if (match) {
            var i = match.length;
            while (i--) {
                res[match[i].slice(1)] = true;
            }
        }
        return res;
    }

    /**
     * Build a link function for all directives on a single node.
     *
     * @param {Array} directives
     * @return {Function} directivesLinkFn
     */

    function makeNodeLinkFn(directives) {
        return function nodeLinkFn(vm, el, host, scope, frag) {
            // reverse apply because it's sorted low to high
            var i = directives.length;
            while (i--) {
                vm._bindDir(directives[i], el, host, scope, frag);
            }
        };
    }

    /**
     * Check if an interpolation string contains one-time tokens.
     *
     * @param {Array} tokens
     * @return {Boolean}
     */

    function hasOneTime(tokens) {
        var i = tokens.length;
        while (i--) {
            if (tokens[i].oneTime) return true;
        }
    }

    function isScript(el) {
        return el.tagName === 'SCRIPT' && (!el.hasAttribute('type') || el.getAttribute('type') === 'text/javascript');
    }

    var specialCharRE = /[^\w\-:\.]/;

    /**
     * Process an element or a DocumentFragment based on a
     * instance option object. This allows us to transclude
     * a template node/fragment before the instance is created,
     * so the processed fragment can then be cloned and reused
     * in v-for.
     *
     * @param {Element} el
     * @param {Object} options
     * @return {Element|DocumentFragment}
     */

    function transclude(el, options) {
        // extract container attributes to pass them down
        // to compiler, because they need to be compiled in
        // parent scope. we are mutating the options object here
        // assuming the same object will be used for compile
        // right after this.
        if (options) {
            options._containerAttrs = extractAttrs(el);
        }
        // for template tags, what we want is its content as
        // a documentFragment (for fragment instances)
        if (isTemplate(el)) {
            el = parseTemplate(el);
        }
        if (options) {
            if (options._asComponent && !options.template) {
                options.template = '<slot></slot>';
            }
            if (options.template) {
                options._content = extractContent(el);
                el = transcludeTemplate(el, options);
            }
        }
        if (isFragment(el)) {
            // anchors for fragment instance
            // passing in `persist: true` to avoid them being
            // discarded by IE during template cloning
            prepend(createAnchor('v-start', true), el);
            el.appendChild(createAnchor('v-end', true));
        }
        return el;
    }

    /**
     * Process the template option.
     * If the replace option is true this will swap the $el.
     *
     * @param {Element} el
     * @param {Object} options
     * @return {Element|DocumentFragment}
     */

    function transcludeTemplate(el, options) {
        var template = options.template;
        var frag = parseTemplate(template, true);
        if (frag) {
            var replacer = frag.firstChild;
            var tag = replacer.tagName && replacer.tagName.toLowerCase();
            if (options.replace) {
                /* istanbul ignore if */
                if (el === document.body) {
                    'development' !== 'production' && warn('You are mounting an instance with a template to ' + '<body>. This will replace <body> entirely. You ' + 'should probably use `replace: false` here.');
                }
                // there are many cases where the instance must
                // become a fragment instance: basically anything that
                // can create more than 1 root nodes.
                if (
                // multi-children template
                    frag.childNodes.length > 1 ||
                        // non-element template
                        replacer.nodeType !== 1 ||
                        // single nested component
                        tag === 'component' || resolveAsset(options, 'components', tag) || hasBindAttr(replacer, 'is') ||
                        // element directive
                        resolveAsset(options, 'elementDirectives', tag) ||
                        // for block
                        replacer.hasAttribute('v-for') ||
                        // if block
                        replacer.hasAttribute('v-if')) {
                    return frag;
                } else {
                    options._replacerAttrs = extractAttrs(replacer);
                    mergeAttrs(el, replacer);
                    return replacer;
                }
            } else {
                el.appendChild(frag);
                return el;
            }
        } else {
            'development' !== 'production' && warn('Invalid template option: ' + template);
        }
    }

    /**
     * Helper to extract a component container's attributes
     * into a plain object array.
     *
     * @param {Element} el
     * @return {Array}
     */

    function extractAttrs(el) {
        if (el.nodeType === 1 && el.hasAttributes()) {
            return toArray(el.attributes);
        }
    }

    /**
     * Merge the attributes of two elements, and make sure
     * the class names are merged properly.
     *
     * @param {Element} from
     * @param {Element} to
     */

    function mergeAttrs(from, to) {
        var attrs = from.attributes;
        var i = attrs.length;
        var name, value;
        while (i--) {
            name = attrs[i].name;
            value = attrs[i].value;
            if (!to.hasAttribute(name) && !specialCharRE.test(name)) {
                to.setAttribute(name, value);
            } else if (name === 'class' && !parseText(value) && (value = value.trim())) {
                value.split(/\s+/).forEach(function (cls) {
                    addClass(to, cls);
                });
            }
        }
    }

    /**
     * Scan and determine slot content distribution.
     * We do this during transclusion instead at compile time so that
     * the distribution is decoupled from the compilation order of
     * the slots.
     *
     * @param {Element|DocumentFragment} template
     * @param {Element} content
     * @param {Vue} vm
     */

    function resolveSlots(vm, content) {
        if (!content) {
            return;
        }
        var contents = vm._slotContents = Object.create(null);
        var el, name;
        for (var i = 0, l = content.children.length; i < l; i++) {
            el = content.children[i];
            /* eslint-disable no-cond-assign */
            if (name = el.getAttribute('slot')) {
                (contents[name] || (contents[name] = [])).push(el);
            }
            /* eslint-enable no-cond-assign */
            if ('development' !== 'production' && getBindAttr(el, 'slot')) {
                warn('The "slot" attribute must be static.', vm.$parent);
            }
        }
        for (name in contents) {
            contents[name] = extractFragment(contents[name], content);
        }
        if (content.hasChildNodes()) {
            var nodes = content.childNodes;
            if (nodes.length === 1 && nodes[0].nodeType === 3 && !nodes[0].data.trim()) {
                return;
            }
            contents['default'] = extractFragment(content.childNodes, content);
        }
    }

    /**
     * Extract qualified content nodes from a node list.
     *
     * @param {NodeList} nodes
     * @return {DocumentFragment}
     */

    function extractFragment(nodes, parent) {
        var frag = document.createDocumentFragment();
        nodes = toArray(nodes);
        for (var i = 0, l = nodes.length; i < l; i++) {
            var node = nodes[i];
            if (isTemplate(node) && !node.hasAttribute('v-if') && !node.hasAttribute('v-for')) {
                parent.removeChild(node);
                node = parseTemplate(node, true);
            }
            frag.appendChild(node);
        }
        return frag;
    }



    var compiler = Object.freeze({
        compile: compile,
        compileAndLinkProps: compileAndLinkProps,
        compileRoot: compileRoot,
        transclude: transclude,
        resolveSlots: resolveSlots
    });

    function stateMixin (Vue) {
        /**
         * Accessor for `$data` property, since setting $data
         * requires observing the new object and updating
         * proxied properties.
         */

        Object.defineProperty(Vue.prototype, '$data', {
            get: function get() {
                return this._data;
            },
            set: function set(newData) {
                if (newData !== this._data) {
                    this._setData(newData);
                }
            }
        });

        /**
         * Setup the scope of an instance, which contains:
         * - observed data
         * - computed properties
         * - user methods
         * - meta properties
         */

        Vue.prototype._initState = function () {
            this._initProps();
            this._initMeta();
            this._initMethods();
            this._initData();
            this._initComputed();
        };

        /**
         * Initialize props.
         */

        Vue.prototype._initProps = function () {
            var options = this.$options;
            var el = options.el;
            var props = options.props;
            if (props && !el) {
                'development' !== 'production' && warn('Props will not be compiled if no `el` option is ' + 'provided at instantiation.', this);
            }
            // make sure to convert string selectors into element now
            el = options.el = query(el);
            this._propsUnlinkFn = el && el.nodeType === 1 && props
                // props must be linked in proper scope if inside v-for
                ? compileAndLinkProps(this, el, props, this._scope) : null;
        };

        /**
         * Initialize the data.
         */

        Vue.prototype._initData = function () {
            var dataFn = this.$options.data;
            var data = this._data = dataFn ? dataFn() : {};
            if (!isPlainObject(data)) {
                data = {};
                'development' !== 'production' && warn('data functions should return an object.', this);
            }
            var props = this._props;
            // proxy data on instance
            var keys = Object.keys(data);
            var i, key;
            i = keys.length;
            while (i--) {
                key = keys[i];
                // there are two scenarios where we can proxy a data key:
                // 1. it's not already defined as a prop
                // 2. it's provided via a instantiation option AND there are no
                //    template prop present
                if (!props || !hasOwn(props, key)) {
                    this._proxy(key);
                } else if ('development' !== 'production') {
                    warn('Data field "' + key + '" is already defined ' + 'as a prop. To provide default value for a prop, use the "default" ' + 'prop option; if you want to pass prop values to an instantiation ' + 'call, use the "propsData" option.', this);
                }
            }
            // observe data
            observe(data, this);
        };

        /**
         * Swap the instance's $data. Called in $data's setter.
         *
         * @param {Object} newData
         */

        Vue.prototype._setData = function (newData) {
            newData = newData || {};
            var oldData = this._data;
            this._data = newData;
            var keys, key, i;
            // unproxy keys not present in new data
            keys = Object.keys(oldData);
            i = keys.length;
            while (i--) {
                key = keys[i];
                if (!(key in newData)) {
                    this._unproxy(key);
                }
            }
            // proxy keys not already proxied,
            // and trigger change for changed values
            keys = Object.keys(newData);
            i = keys.length;
            while (i--) {
                key = keys[i];
                if (!hasOwn(this, key)) {
                    // new property
                    this._proxy(key);
                }
            }
            oldData.__ob__.removeVm(this);
            observe(newData, this);
            this._digest();
        };

        /**
         * Proxy a property, so that
         * vm.prop === vm._data.prop
         *
         * @param {String} key
         */

        Vue.prototype._proxy = function (key) {
            if (!isReserved(key)) {
                // need to store ref to self here
                // because these getter/setters might
                // be called by child scopes via
                // prototype inheritance.
                var self = this;
                Object.defineProperty(self, key, {
                    configurable: true,
                    enumerable: true,
                    get: function proxyGetter() {
                        return self._data[key];
                    },
                    set: function proxySetter(val) {
                        self._data[key] = val;
                    }
                });
            }
        };

        /**
         * Unproxy a property.
         *
         * @param {String} key
         */

        Vue.prototype._unproxy = function (key) {
            if (!isReserved(key)) {
                delete this[key];
            }
        };

        /**
         * Force update on every watcher in scope.
         */

        Vue.prototype._digest = function () {
            for (var i = 0, l = this._watchers.length; i < l; i++) {
                this._watchers[i].update(true); // shallow updates
            }
        };

        /**
         * Setup computed properties. They are essentially
         * special getter/setters
         */

        function noop() {}
        Vue.prototype._initComputed = function () {
            var computed = this.$options.computed;
            if (computed) {
                for (var key in computed) {
                    var userDef = computed[key];
                    var def = {
                        enumerable: true,
                        configurable: true
                    };
                    if (typeof userDef === 'function') {
                        def.get = makeComputedGetter(userDef, this);
                        def.set = noop;
                    } else {
                        def.get = userDef.get ? userDef.cache !== false ? makeComputedGetter(userDef.get, this) : bind(userDef.get, this) : noop;
                        def.set = userDef.set ? bind(userDef.set, this) : noop;
                    }
                    Object.defineProperty(this, key, def);
                }
            }
        };

        function makeComputedGetter(getter, owner) {
            var watcher = new Watcher(owner, getter, null, {
                lazy: true
            });
            return function computedGetter() {
                if (watcher.dirty) {
                    watcher.evaluate();
                }
                if (Dep.target) {
                    watcher.depend();
                }
                return watcher.value;
            };
        }

        /**
         * Setup instance methods. Methods must be bound to the
         * instance since they might be passed down as a prop to
         * child components.
         */

        Vue.prototype._initMethods = function () {
            var methods = this.$options.methods;
            if (methods) {
                for (var key in methods) {
                    this[key] = bind(methods[key], this);
                }
            }
        };

        /**
         * Initialize meta information like $index, $key & $value.
         */

        Vue.prototype._initMeta = function () {
            var metas = this.$options._meta;
            if (metas) {
                for (var key in metas) {
                    defineReactive(this, key, metas[key]);
                }
            }
        };
    }

    var eventRE = /^v-on:|^@/;

    function eventsMixin (Vue) {
        /**
         * Setup the instance's option events & watchers.
         * If the value is a string, we pull it from the
         * instance's methods by name.
         */

        Vue.prototype._initEvents = function () {
            var options = this.$options;
            if (options._asComponent) {
                registerComponentEvents(this, options.el);
            }
            registerCallbacks(this, '$on', options.events);
            registerCallbacks(this, '$watch', options.watch);
        };

        /**
         * Register v-on events on a child component
         *
         * @param {Vue} vm
         * @param {Element} el
         */

        function registerComponentEvents(vm, el) {
            var attrs = el.attributes;
            var name, value, handler;
            for (var i = 0, l = attrs.length; i < l; i++) {
                name = attrs[i].name;
                if (eventRE.test(name)) {
                    name = name.replace(eventRE, '');
                    // force the expression into a statement so that
                    // it always dynamically resolves the method to call (#2670)
                    // kinda ugly hack, but does the job.
                    value = attrs[i].value;
                    if (isSimplePath(value)) {
                        value += '.apply(this, $arguments)';
                    }
                    handler = (vm._scope || vm._context).$eval(value, true);
                    handler._fromParent = true;
                    vm.$on(name.replace(eventRE), handler);
                }
            }
        }

        /**
         * Register callbacks for option events and watchers.
         *
         * @param {Vue} vm
         * @param {String} action
         * @param {Object} hash
         */

        function registerCallbacks(vm, action, hash) {
            if (!hash) return;
            var handlers, key, i, j;
            for (key in hash) {
                handlers = hash[key];
                if (isArray(handlers)) {
                    for (i = 0, j = handlers.length; i < j; i++) {
                        register(vm, action, key, handlers[i]);
                    }
                } else {
                    register(vm, action, key, handlers);
                }
            }
        }

        /**
         * Helper to register an event/watch callback.
         *
         * @param {Vue} vm
         * @param {String} action
         * @param {String} key
         * @param {Function|String|Object} handler
         * @param {Object} [options]
         */

        function register(vm, action, key, handler, options) {
            var type = typeof handler;
            if (type === 'function') {
                vm[action](key, handler, options);
            } else if (type === 'string') {
                var methods = vm.$options.methods;
                var method = methods && methods[handler];
                if (method) {
                    vm[action](key, method, options);
                } else {
                    'development' !== 'production' && warn('Unknown method: "' + handler + '" when ' + 'registering callback for ' + action + ': "' + key + '".', vm);
                }
            } else if (handler && type === 'object') {
                register(vm, action, key, handler.handler, handler);
            }
        }

        /**
         * Setup recursive attached/detached calls
         */

        Vue.prototype._initDOMHooks = function () {
            this.$on('hook:attached', onAttached);
            this.$on('hook:detached', onDetached);
        };

        /**
         * Callback to recursively call attached hook on children
         */

        function onAttached() {
            if (!this._isAttached) {
                this._isAttached = true;
                this.$children.forEach(callAttach);
            }
        }

        /**
         * Iterator to call attached hook
         *
         * @param {Vue} child
         */

        function callAttach(child) {
            if (!child._isAttached && inDoc(child.$el)) {
                child._callHook('attached');
            }
        }

        /**
         * Callback to recursively call detached hook on children
         */

        function onDetached() {
            if (this._isAttached) {
                this._isAttached = false;
                this.$children.forEach(callDetach);
            }
        }

        /**
         * Iterator to call detached hook
         *
         * @param {Vue} child
         */

        function callDetach(child) {
            if (child._isAttached && !inDoc(child.$el)) {
                child._callHook('detached');
            }
        }

        /**
         * Trigger all handlers for a hook
         *
         * @param {String} hook
         */

        Vue.prototype._callHook = function (hook) {
            this.$emit('pre-hook:' + hook);
            var handlers = this.$options[hook];
            if (handlers) {
                for (var i = 0, j = handlers.length; i < j; i++) {
                    handlers[i].call(this);
                }
            }
            this.$emit('hook:' + hook);
        };
    }

    function noop$1() {}

    /**
     * A directive links a DOM element with a piece of data,
     * which is the result of evaluating an expression.
     * It registers a watcher with the expression and calls
     * the DOM update function when a change is triggered.
     *
     * @param {Object} descriptor
     *                 - {String} name
     *                 - {Object} def
     *                 - {String} expression
     *                 - {Array<Object>} [filters]
     *                 - {Object} [modifiers]
     *                 - {Boolean} literal
     *                 - {String} attr
     *                 - {String} arg
     *                 - {String} raw
     *                 - {String} [ref]
     *                 - {Array<Object>} [interp]
     *                 - {Boolean} [hasOneTime]
     * @param {Vue} vm
     * @param {Node} el
     * @param {Vue} [host] - transclusion host component
     * @param {Object} [scope] - v-for scope
     * @param {Fragment} [frag] - owner fragment
     * @constructor
     */
    function Directive(descriptor, vm, el, host, scope, frag) {
        this.vm = vm;
        this.el = el;
        // copy descriptor properties
        this.descriptor = descriptor;
        this.name = descriptor.name;
        this.expression = descriptor.expression;
        this.arg = descriptor.arg;
        this.modifiers = descriptor.modifiers;
        this.filters = descriptor.filters;
        this.literal = this.modifiers && this.modifiers.literal;
        // private
        this._locked = false;
        this._bound = false;
        this._listeners = null;
        // link context
        this._host = host;
        this._scope = scope;
        this._frag = frag;
        // store directives on node in dev mode
        if ('development' !== 'production' && this.el) {
            this.el._vue_directives = this.el._vue_directives || [];
            this.el._vue_directives.push(this);
        }
    }

    /**
     * Initialize the directive, mixin definition properties,
     * setup the watcher, call definition bind() and update()
     * if present.
     */

    Directive.prototype._bind = function () {
        var name = this.name;
        var descriptor = this.descriptor;

        // remove attribute
        if ((name !== 'cloak' || this.vm._isCompiled) && this.el && this.el.removeAttribute) {
            var attr = descriptor.attr || 'v-' + name;
            this.el.removeAttribute(attr);
        }

        // copy def properties
        var def = descriptor.def;
        if (typeof def === 'function') {
            this.update = def;
        } else {
            extend(this, def);
        }

        // setup directive params
        this._setupParams();

        // initial bind
        if (this.bind) {
            this.bind();
        }
        this._bound = true;

        if (this.literal) {
            this.update && this.update(descriptor.raw);
        } else if ((this.expression || this.modifiers) && (this.update || this.twoWay) && !this._checkStatement()) {
            // wrapped updater for context
            var dir = this;
            if (this.update) {
                this._update = function (val, oldVal) {
                    if (!dir._locked) {
                        dir.update(val, oldVal);
                    }
                };
            } else {
                this._update = noop$1;
            }
            var preProcess = this._preProcess ? bind(this._preProcess, this) : null;
            var postProcess = this._postProcess ? bind(this._postProcess, this) : null;
            var watcher = this._watcher = new Watcher(this.vm, this.expression, this._update, // callback
                {
                    filters: this.filters,
                    twoWay: this.twoWay,
                    deep: this.deep,
                    preProcess: preProcess,
                    postProcess: postProcess,
                    scope: this._scope
                });
            // v-model with inital inline value need to sync back to
            // model instead of update to DOM on init. They would
            // set the afterBind hook to indicate that.
            if (this.afterBind) {
                this.afterBind();
            } else if (this.update) {
                this.update(watcher.value);
            }
        }
    };

    /**
     * Setup all param attributes, e.g. track-by,
     * transition-mode, etc...
     */

    Directive.prototype._setupParams = function () {
        if (!this.params) {
            return;
        }
        var params = this.params;
        // swap the params array with a fresh object.
        this.params = Object.create(null);
        var i = params.length;
        var key, val, mappedKey;
        while (i--) {
            key = hyphenate(params[i]);
            mappedKey = camelize(key);
            val = getBindAttr(this.el, key);
            if (val != null) {
                // dynamic
                this._setupParamWatcher(mappedKey, val);
            } else {
                // static
                val = getAttr(this.el, key);
                if (val != null) {
                    this.params[mappedKey] = val === '' ? true : val;
                }
            }
        }
    };

    /**
     * Setup a watcher for a dynamic param.
     *
     * @param {String} key
     * @param {String} expression
     */

    Directive.prototype._setupParamWatcher = function (key, expression) {
        var self = this;
        var called = false;
        var unwatch = (this._scope || this.vm).$watch(expression, function (val, oldVal) {
            self.params[key] = val;
            // since we are in immediate mode,
            // only call the param change callbacks if this is not the first update.
            if (called) {
                var cb = self.paramWatchers && self.paramWatchers[key];
                if (cb) {
                    cb.call(self, val, oldVal);
                }
            } else {
                called = true;
            }
        }, {
            immediate: true,
            user: false
        });(this._paramUnwatchFns || (this._paramUnwatchFns = [])).push(unwatch);
    };

    /**
     * Check if the directive is a function caller
     * and if the expression is a callable one. If both true,
     * we wrap up the expression and use it as the event
     * handler.
     *
     * e.g. on-click="a++"
     *
     * @return {Boolean}
     */

    Directive.prototype._checkStatement = function () {
        var expression = this.expression;
        if (expression && this.acceptStatement && !isSimplePath(expression)) {
            var fn = parseExpression(expression).get;
            var scope = this._scope || this.vm;
            var handler = function handler(e) {
                scope.$event = e;
                fn.call(scope, scope);
                scope.$event = null;
            };
            if (this.filters) {
                handler = scope._applyFilters(handler, null, this.filters);
            }
            this.update(handler);
            return true;
        }
    };

    /**
     * Set the corresponding value with the setter.
     * This should only be used in two-way directives
     * e.g. v-model.
     *
     * @param {*} value
     * @public
     */

    Directive.prototype.set = function (value) {
        /* istanbul ignore else */
        if (this.twoWay) {
            this._withLock(function () {
                this._watcher.set(value);
            });
        } else if ('development' !== 'production') {
            warn('Directive.set() can only be used inside twoWay' + 'directives.');
        }
    };

    /**
     * Execute a function while preventing that function from
     * triggering updates on this directive instance.
     *
     * @param {Function} fn
     */

    Directive.prototype._withLock = function (fn) {
        var self = this;
        self._locked = true;
        fn.call(self);
        nextTick(function () {
            self._locked = false;
        });
    };

    /**
     * Convenience method that attaches a DOM event listener
     * to the directive element and autometically tears it down
     * during unbind.
     *
     * @param {String} event
     * @param {Function} handler
     * @param {Boolean} [useCapture]
     */

    Directive.prototype.on = function (event, handler, useCapture) {
        on(this.el, event, handler, useCapture);(this._listeners || (this._listeners = [])).push([event, handler]);
    };

    /**
     * Teardown the watcher and call unbind.
     */

    Directive.prototype._teardown = function () {
        if (this._bound) {
            this._bound = false;
            if (this.unbind) {
                this.unbind();
            }
            if (this._watcher) {
                this._watcher.teardown();
            }
            var listeners = this._listeners;
            var i;
            if (listeners) {
                i = listeners.length;
                while (i--) {
                    off(this.el, listeners[i][0], listeners[i][1]);
                }
            }
            var unwatchFns = this._paramUnwatchFns;
            if (unwatchFns) {
                i = unwatchFns.length;
                while (i--) {
                    unwatchFns[i]();
                }
            }
            if ('development' !== 'production' && this.el) {
                this.el._vue_directives.$remove(this);
            }
            this.vm = this.el = this._watcher = this._listeners = null;
        }
    };

    function lifecycleMixin (Vue) {
        /**
         * Update v-ref for component.
         *
         * @param {Boolean} remove
         */

        Vue.prototype._updateRef = function (remove) {
            var ref = this.$options._ref;
            if (ref) {
                var refs = (this._scope || this._context).$refs;
                if (remove) {
                    if (refs[ref] === this) {
                        refs[ref] = null;
                    }
                } else {
                    refs[ref] = this;
                }
            }
        };

        /**
         * Transclude, compile and link element.
         *
         * If a pre-compiled linker is available, that means the
         * passed in element will be pre-transcluded and compiled
         * as well - all we need to do is to call the linker.
         *
         * Otherwise we need to call transclude/compile/link here.
         *
         * @param {Element} el
         */

        Vue.prototype._compile = function (el) {
            var options = this.$options;

            // transclude and init element
            // transclude can potentially replace original
            // so we need to keep reference; this step also injects
            // the template and caches the original attributes
            // on the container node and replacer node.
            var original = el;
            el = transclude(el, options);
            this._initElement(el);

            // handle v-pre on root node (#2026)
            if (el.nodeType === 1 && getAttr(el, 'v-pre') !== null) {
                return;
            }

            // root is always compiled per-instance, because
            // container attrs and props can be different every time.
            var contextOptions = this._context && this._context.$options;
            var rootLinker = compileRoot(el, options, contextOptions);

            // resolve slot distribution
            resolveSlots(this, options._content);

            // compile and link the rest
            var contentLinkFn;
            var ctor = this.constructor;
            // component compilation can be cached
            // as long as it's not using inline-template
            if (options._linkerCachable) {
                contentLinkFn = ctor.linker;
                if (!contentLinkFn) {
                    contentLinkFn = ctor.linker = compile(el, options);
                }
            }

            // link phase
            // make sure to link root with prop scope!
            var rootUnlinkFn = rootLinker(this, el, this._scope);
            var contentUnlinkFn = contentLinkFn ? contentLinkFn(this, el) : compile(el, options)(this, el);

            // register composite unlink function
            // to be called during instance destruction
            this._unlinkFn = function () {
                rootUnlinkFn();
                // passing destroying: true to avoid searching and
                // splicing the directives
                contentUnlinkFn(true);
            };

            // finally replace original
            if (options.replace) {
                replace(original, el);
            }

            this._isCompiled = true;
            this._callHook('compiled');
        };

        /**
         * Initialize instance element. Called in the public
         * $mount() method.
         *
         * @param {Element} el
         */

        Vue.prototype._initElement = function (el) {
            if (isFragment(el)) {
                this._isFragment = true;
                this.$el = this._fragmentStart = el.firstChild;
                this._fragmentEnd = el.lastChild;
                // set persisted text anchors to empty
                if (this._fragmentStart.nodeType === 3) {
                    this._fragmentStart.data = this._fragmentEnd.data = '';
                }
                this._fragment = el;
            } else {
                this.$el = el;
            }
            this.$el.__vue__ = this;
            this._callHook('beforeCompile');
        };

        /**
         * Create and bind a directive to an element.
         *
         * @param {Object} descriptor - parsed directive descriptor
         * @param {Node} node   - target node
         * @param {Vue} [host] - transclusion host component
         * @param {Object} [scope] - v-for scope
         * @param {Fragment} [frag] - owner fragment
         */

        Vue.prototype._bindDir = function (descriptor, node, host, scope, frag) {
            this._directives.push(new Directive(descriptor, this, node, host, scope, frag));
        };

        /**
         * Teardown an instance, unobserves the data, unbind all the
         * directives, turn off all the event listeners, etc.
         *
         * @param {Boolean} remove - whether to remove the DOM node.
         * @param {Boolean} deferCleanup - if true, defer cleanup to
         *                                 be called later
         */

        Vue.prototype._destroy = function (remove, deferCleanup) {
            if (this._isBeingDestroyed) {
                if (!deferCleanup) {
                    this._cleanup();
                }
                return;
            }

            var destroyReady;
            var pendingRemoval;

            var self = this;
            // Cleanup should be called either synchronously or asynchronoysly as
            // callback of this.$remove(), or if remove and deferCleanup are false.
            // In any case it should be called after all other removing, unbinding and
            // turning of is done
            var cleanupIfPossible = function cleanupIfPossible() {
                if (destroyReady && !pendingRemoval && !deferCleanup) {
                    self._cleanup();
                }
            };

            // remove DOM element
            if (remove && this.$el) {
                pendingRemoval = true;
                this.$remove(function () {
                    pendingRemoval = false;
                    cleanupIfPossible();
                });
            }

            this._callHook('beforeDestroy');
            this._isBeingDestroyed = true;
            var i;
            // remove self from parent. only necessary
            // if parent is not being destroyed as well.
            var parent = this.$parent;
            if (parent && !parent._isBeingDestroyed) {
                parent.$children.$remove(this);
                // unregister ref (remove: true)
                this._updateRef(true);
            }
            // destroy all children.
            i = this.$children.length;
            while (i--) {
                this.$children[i].$destroy();
            }
            // teardown props
            if (this._propsUnlinkFn) {
                this._propsUnlinkFn();
            }
            // teardown all directives. this also tearsdown all
            // directive-owned watchers.
            if (this._unlinkFn) {
                this._unlinkFn();
            }
            i = this._watchers.length;
            while (i--) {
                this._watchers[i].teardown();
            }
            // remove reference to self on $el
            if (this.$el) {
                this.$el.__vue__ = null;
            }

            destroyReady = true;
            cleanupIfPossible();
        };

        /**
         * Clean up to ensure garbage collection.
         * This is called after the leave transition if there
         * is any.
         */

        Vue.prototype._cleanup = function () {
            if (this._isDestroyed) {
                return;
            }
            // remove self from owner fragment
            // do it in cleanup so that we can call $destroy with
            // defer right when a fragment is about to be removed.
            if (this._frag) {
                this._frag.children.$remove(this);
            }
            // remove reference from data ob
            // frozen object may not have observer.
            if (this._data && this._data.__ob__) {
                this._data.__ob__.removeVm(this);
            }
            // Clean up references to private properties and other
            // instances. preserve reference to _data so that proxy
            // accessors still work. The only potential side effect
            // here is that mutating the instance after it's destroyed
            // may affect the state of other components that are still
            // observing the same object, but that seems to be a
            // reasonable responsibility for the user rather than
            // always throwing an error on them.
            this.$el = this.$parent = this.$root = this.$children = this._watchers = this._context = this._scope = this._directives = null;
            // call the last hook...
            this._isDestroyed = true;
            this._callHook('destroyed');
            // turn off all instance listeners.
            this.$off();
        };
    }

    function miscMixin (Vue) {
        /**
         * Apply a list of filter (descriptors) to a value.
         * Using plain for loops here because this will be called in
         * the getter of any watcher with filters so it is very
         * performance sensitive.
         *
         * @param {*} value
         * @param {*} [oldValue]
         * @param {Array} filters
         * @param {Boolean} write
         * @return {*}
         */

        Vue.prototype._applyFilters = function (value, oldValue, filters, write) {
            var filter, fn, args, arg, offset, i, l, j, k;
            for (i = 0, l = filters.length; i < l; i++) {
                filter = filters[write ? l - i - 1 : i];
                fn = resolveAsset(this.$options, 'filters', filter.name, true);
                if (!fn) continue;
                fn = write ? fn.write : fn.read || fn;
                if (typeof fn !== 'function') continue;
                args = write ? [value, oldValue] : [value];
                offset = write ? 2 : 1;
                if (filter.args) {
                    for (j = 0, k = filter.args.length; j < k; j++) {
                        arg = filter.args[j];
                        args[j + offset] = arg.dynamic ? this.$get(arg.value) : arg.value;
                    }
                }
                value = fn.apply(this, args);
            }
            return value;
        };

        /**
         * Resolve a component, depending on whether the component
         * is defined normally or using an async factory function.
         * Resolves synchronously if already resolved, otherwise
         * resolves asynchronously and caches the resolved
         * constructor on the factory.
         *
         * @param {String|Function} value
         * @param {Function} cb
         */

        Vue.prototype._resolveComponent = function (value, cb) {
            var factory;
            if (typeof value === 'function') {
                factory = value;
            } else {
                factory = resolveAsset(this.$options, 'components', value, true);
            }
            /* istanbul ignore if */
            if (!factory) {
                return;
            }
            // async component factory
            if (!factory.options) {
                if (factory.resolved) {
                    // cached
                    cb(factory.resolved);
                } else if (factory.requested) {
                    // pool callbacks
                    factory.pendingCallbacks.push(cb);
                } else {
                    factory.requested = true;
                    var cbs = factory.pendingCallbacks = [cb];
                    factory.call(this, function resolve(res) {
                        if (isPlainObject(res)) {
                            res = Vue.extend(res);
                        }
                        // cache resolved
                        factory.resolved = res;
                        // invoke callbacks
                        for (var i = 0, l = cbs.length; i < l; i++) {
                            cbs[i](res);
                        }
                    }, function reject(reason) {
                        'development' !== 'production' && warn('Failed to resolve async component' + (typeof value === 'string' ? ': ' + value : '') + '. ' + (reason ? '\nReason: ' + reason : ''));
                    });
                }
            } else {
                // normal component
                cb(factory);
            }
        };
    }

    var filterRE$1 = /[^|]\|[^|]/;

    function dataAPI (Vue) {
        /**
         * Get the value from an expression on this vm.
         *
         * @param {String} exp
         * @param {Boolean} [asStatement]
         * @return {*}
         */

        Vue.prototype.$get = function (exp, asStatement) {
            var res = parseExpression(exp);
            if (res) {
                if (asStatement) {
                    var self = this;
                    return function statementHandler() {
                        self.$arguments = toArray(arguments);
                        var result = res.get.call(self, self);
                        self.$arguments = null;
                        return result;
                    };
                } else {
                    try {
                        return res.get.call(this, this);
                    } catch (e) {}
                }
            }
        };

        /**
         * Set the value from an expression on this vm.
         * The expression must be a valid left-hand
         * expression in an assignment.
         *
         * @param {String} exp
         * @param {*} val
         */

        Vue.prototype.$set = function (exp, val) {
            var res = parseExpression(exp, true);
            if (res && res.set) {
                res.set.call(this, this, val);
            }
        };

        /**
         * Delete a property on the VM
         *
         * @param {String} key
         */

        Vue.prototype.$delete = function (key) {
            del(this._data, key);
        };

        /**
         * Watch an expression, trigger callback when its
         * value changes.
         *
         * @param {String|Function} expOrFn
         * @param {Function} cb
         * @param {Object} [options]
         *                 - {Boolean} deep
         *                 - {Boolean} immediate
         * @return {Function} - unwatchFn
         */

        Vue.prototype.$watch = function (expOrFn, cb, options) {
            var vm = this;
            var parsed;
            if (typeof expOrFn === 'string') {
                parsed = parseDirective(expOrFn);
                expOrFn = parsed.expression;
            }
            var watcher = new Watcher(vm, expOrFn, cb, {
                deep: options && options.deep,
                sync: options && options.sync,
                filters: parsed && parsed.filters,
                user: !options || options.user !== false
            });
            if (options && options.immediate) {
                cb.call(vm, watcher.value);
            }
            return function unwatchFn() {
                watcher.teardown();
            };
        };

        /**
         * Evaluate a text directive, including filters.
         *
         * @param {String} text
         * @param {Boolean} [asStatement]
         * @return {String}
         */

        Vue.prototype.$eval = function (text, asStatement) {
            // check for filters.
            if (filterRE$1.test(text)) {
                var dir = parseDirective(text);
                // the filter regex check might give false positive
                // for pipes inside strings, so it's possible that
                // we don't get any filters here
                var val = this.$get(dir.expression, asStatement);
                return dir.filters ? this._applyFilters(val, null, dir.filters) : val;
            } else {
                // no filter
                return this.$get(text, asStatement);
            }
        };

        /**
         * Interpolate a piece of template text.
         *
         * @param {String} text
         * @return {String}
         */

        Vue.prototype.$interpolate = function (text) {
            var tokens = parseText(text);
            var vm = this;
            if (tokens) {
                if (tokens.length === 1) {
                    return vm.$eval(tokens[0].value) + '';
                } else {
                    return tokens.map(function (token) {
                        return token.tag ? vm.$eval(token.value) : token.value;
                    }).join('');
                }
            } else {
                return text;
            }
        };

        /**
         * Log instance data as a plain JS object
         * so that it is easier to inspect in console.
         * This method assumes console is available.
         *
         * @param {String} [path]
         */

        Vue.prototype.$log = function (path) {
            var data = path ? getPath(this._data, path) : this._data;
            if (data) {
                data = clean(data);
            }
            // include computed fields
            if (!path) {
                var key;
                for (key in this.$options.computed) {
                    data[key] = clean(this[key]);
                }
                if (this._props) {
                    for (key in this._props) {
                        data[key] = clean(this[key]);
                    }
                }
            }
            console.log(data);
        };

        /**
         * "clean" a getter/setter converted object into a plain
         * object copy.
         *
         * @param {Object} - obj
         * @return {Object}
         */

        function clean(obj) {
            return JSON.parse(JSON.stringify(obj));
        }
    }

    function domAPI (Vue) {
        /**
         * Convenience on-instance nextTick. The callback is
         * auto-bound to the instance, and this avoids component
         * modules having to rely on the global Vue.
         *
         * @param {Function} fn
         */

        Vue.prototype.$nextTick = function (fn) {
            nextTick(fn, this);
        };

        /**
         * Append instance to target
         *
         * @param {Node} target
         * @param {Function} [cb]
         * @param {Boolean} [withTransition] - defaults to true
         */

        Vue.prototype.$appendTo = function (target, cb, withTransition) {
            return insert(this, target, cb, withTransition, append, appendWithTransition);
        };

        /**
         * Prepend instance to target
         *
         * @param {Node} target
         * @param {Function} [cb]
         * @param {Boolean} [withTransition] - defaults to true
         */

        Vue.prototype.$prependTo = function (target, cb, withTransition) {
            target = query(target);
            if (target.hasChildNodes()) {
                this.$before(target.firstChild, cb, withTransition);
            } else {
                this.$appendTo(target, cb, withTransition);
            }
            return this;
        };

        /**
         * Insert instance before target
         *
         * @param {Node} target
         * @param {Function} [cb]
         * @param {Boolean} [withTransition] - defaults to true
         */

        Vue.prototype.$before = function (target, cb, withTransition) {
            return insert(this, target, cb, withTransition, beforeWithCb, beforeWithTransition);
        };

        /**
         * Insert instance after target
         *
         * @param {Node} target
         * @param {Function} [cb]
         * @param {Boolean} [withTransition] - defaults to true
         */

        Vue.prototype.$after = function (target, cb, withTransition) {
            target = query(target);
            if (target.nextSibling) {
                this.$before(target.nextSibling, cb, withTransition);
            } else {
                this.$appendTo(target.parentNode, cb, withTransition);
            }
            return this;
        };

        /**
         * Remove instance from DOM
         *
         * @param {Function} [cb]
         * @param {Boolean} [withTransition] - defaults to true
         */

        Vue.prototype.$remove = function (cb, withTransition) {
            if (!this.$el.parentNode) {
                return cb && cb();
            }
            var inDocument = this._isAttached && inDoc(this.$el);
            // if we are not in document, no need to check
            // for transitions
            if (!inDocument) withTransition = false;
            var self = this;
            var realCb = function realCb() {
                if (inDocument) self._callHook('detached');
                if (cb) cb();
            };
            if (this._isFragment) {
                removeNodeRange(this._fragmentStart, this._fragmentEnd, this, this._fragment, realCb);
            } else {
                var op = withTransition === false ? removeWithCb : removeWithTransition;
                op(this.$el, this, realCb);
            }
            return this;
        };

        /**
         * Shared DOM insertion function.
         *
         * @param {Vue} vm
         * @param {Element} target
         * @param {Function} [cb]
         * @param {Boolean} [withTransition]
         * @param {Function} op1 - op for non-transition insert
         * @param {Function} op2 - op for transition insert
         * @return vm
         */

        function insert(vm, target, cb, withTransition, op1, op2) {
            target = query(target);
            var targetIsDetached = !inDoc(target);
            var op = withTransition === false || targetIsDetached ? op1 : op2;
            var shouldCallHook = !targetIsDetached && !vm._isAttached && !inDoc(vm.$el);
            if (vm._isFragment) {
                mapNodeRange(vm._fragmentStart, vm._fragmentEnd, function (node) {
                    op(node, target, vm);
                });
                cb && cb();
            } else {
                op(vm.$el, target, vm, cb);
            }
            if (shouldCallHook) {
                vm._callHook('attached');
            }
            return vm;
        }

        /**
         * Check for selectors
         *
         * @param {String|Element} el
         */

        function query(el) {
            return typeof el === 'string' ? document.querySelector(el) : el;
        }

        /**
         * Append operation that takes a callback.
         *
         * @param {Node} el
         * @param {Node} target
         * @param {Vue} vm - unused
         * @param {Function} [cb]
         */

        function append(el, target, vm, cb) {
            target.appendChild(el);
            if (cb) cb();
        }

        /**
         * InsertBefore operation that takes a callback.
         *
         * @param {Node} el
         * @param {Node} target
         * @param {Vue} vm - unused
         * @param {Function} [cb]
         */

        function beforeWithCb(el, target, vm, cb) {
            before(el, target);
            if (cb) cb();
        }

        /**
         * Remove operation that takes a callback.
         *
         * @param {Node} el
         * @param {Vue} vm - unused
         * @param {Function} [cb]
         */

        function removeWithCb(el, vm, cb) {
            remove(el);
            if (cb) cb();
        }
    }

    function eventsAPI (Vue) {
        /**
         * Listen on the given `event` with `fn`.
         *
         * @param {String} event
         * @param {Function} fn
         */

        Vue.prototype.$on = function (event, fn) {
            (this._events[event] || (this._events[event] = [])).push(fn);
            modifyListenerCount(this, event, 1);
            return this;
        };

        /**
         * Adds an `event` listener that will be invoked a single
         * time then automatically removed.
         *
         * @param {String} event
         * @param {Function} fn
         */

        Vue.prototype.$once = function (event, fn) {
            var self = this;
            function on() {
                self.$off(event, on);
                fn.apply(this, arguments);
            }
            on.fn = fn;
            this.$on(event, on);
            return this;
        };

        /**
         * Remove the given callback for `event` or all
         * registered callbacks.
         *
         * @param {String} event
         * @param {Function} fn
         */

        Vue.prototype.$off = function (event, fn) {
            var cbs;
            // all
            if (!arguments.length) {
                if (this.$parent) {
                    for (event in this._events) {
                        cbs = this._events[event];
                        if (cbs) {
                            modifyListenerCount(this, event, -cbs.length);
                        }
                    }
                }
                this._events = {};
                return this;
            }
            // specific event
            cbs = this._events[event];
            if (!cbs) {
                return this;
            }
            if (arguments.length === 1) {
                modifyListenerCount(this, event, -cbs.length);
                this._events[event] = null;
                return this;
            }
            // specific handler
            var cb;
            var i = cbs.length;
            while (i--) {
                cb = cbs[i];
                if (cb === fn || cb.fn === fn) {
                    modifyListenerCount(this, event, -1);
                    cbs.splice(i, 1);
                    break;
                }
            }
            return this;
        };

        /**
         * Trigger an event on self.
         *
         * @param {String|Object} event
         * @return {Boolean} shouldPropagate
         */

        Vue.prototype.$emit = function (event) {
            var isSource = typeof event === 'string';
            event = isSource ? event : event.name;
            var cbs = this._events[event];
            var shouldPropagate = isSource || !cbs;
            if (cbs) {
                cbs = cbs.length > 1 ? toArray(cbs) : cbs;
                // this is a somewhat hacky solution to the question raised
                // in #2102: for an inline component listener like <comp @test="doThis">,
                // the propagation handling is somewhat broken. Therefore we
                // need to treat these inline callbacks differently.
                var hasParentCbs = isSource && cbs.some(function (cb) {
                    return cb._fromParent;
                });
                if (hasParentCbs) {
                    shouldPropagate = false;
                }
                var args = toArray(arguments, 1);
                for (var i = 0, l = cbs.length; i < l; i++) {
                    var cb = cbs[i];
                    var res = cb.apply(this, args);
                    if (res === true && (!hasParentCbs || cb._fromParent)) {
                        shouldPropagate = true;
                    }
                }
            }
            return shouldPropagate;
        };

        /**
         * Recursively broadcast an event to all children instances.
         *
         * @param {String|Object} event
         * @param {...*} additional arguments
         */

        Vue.prototype.$broadcast = function (event) {
            var isSource = typeof event === 'string';
            event = isSource ? event : event.name;
            // if no child has registered for this event,
            // then there's no need to broadcast.
            if (!this._eventsCount[event]) return;
            var children = this.$children;
            var args = toArray(arguments);
            if (isSource) {
                // use object event to indicate non-source emit
                // on children
                args[0] = { name: event, source: this };
            }
            for (var i = 0, l = children.length; i < l; i++) {
                var child = children[i];
                var shouldPropagate = child.$emit.apply(child, args);
                if (shouldPropagate) {
                    child.$broadcast.apply(child, args);
                }
            }
            return this;
        };

        /**
         * Recursively propagate an event up the parent chain.
         *
         * @param {String} event
         * @param {...*} additional arguments
         */

        Vue.prototype.$dispatch = function (event) {
            var shouldPropagate = this.$emit.apply(this, arguments);
            if (!shouldPropagate) return;
            var parent = this.$parent;
            var args = toArray(arguments);
            // use object event to indicate non-source emit
            // on parents
            args[0] = { name: event, source: this };
            while (parent) {
                shouldPropagate = parent.$emit.apply(parent, args);
                parent = shouldPropagate ? parent.$parent : null;
            }
            return this;
        };

        /**
         * Modify the listener counts on all parents.
         * This bookkeeping allows $broadcast to return early when
         * no child has listened to a certain event.
         *
         * @param {Vue} vm
         * @param {String} event
         * @param {Number} count
         */

        var hookRE = /^hook:/;
        function modifyListenerCount(vm, event, count) {
            var parent = vm.$parent;
            // hooks do not get broadcasted so no need
            // to do bookkeeping for them
            if (!parent || !count || hookRE.test(event)) return;
            while (parent) {
                parent._eventsCount[event] = (parent._eventsCount[event] || 0) + count;
                parent = parent.$parent;
            }
        }
    }

    function lifecycleAPI (Vue) {
        /**
         * Set instance target element and kick off the compilation
         * process. The passed in `el` can be a selector string, an
         * existing Element, or a DocumentFragment (for block
         * instances).
         *
         * @param {Element|DocumentFragment|string} el
         * @public
         */

        Vue.prototype.$mount = function (el) {
            if (this._isCompiled) {
                'development' !== 'production' && warn('$mount() should be called only once.', this);
                return;
            }
            el = query(el);
            if (!el) {
                el = document.createElement('div');
            }
            this._compile(el);
            this._initDOMHooks();
            if (inDoc(this.$el)) {
                this._callHook('attached');
                ready.call(this);
            } else {
                this.$once('hook:attached', ready);
            }
            return this;
        };

        /**
         * Mark an instance as ready.
         */

        function ready() {
            this._isAttached = true;
            this._isReady = true;
            this._callHook('ready');
        }

        /**
         * Teardown the instance, simply delegate to the internal
         * _destroy.
         *
         * @param {Boolean} remove
         * @param {Boolean} deferCleanup
         */

        Vue.prototype.$destroy = function (remove, deferCleanup) {
            this._destroy(remove, deferCleanup);
        };

        /**
         * Partially compile a piece of DOM and return a
         * decompile function.
         *
         * @param {Element|DocumentFragment} el
         * @param {Vue} [host]
         * @param {Object} [scope]
         * @param {Fragment} [frag]
         * @return {Function}
         */

        Vue.prototype.$compile = function (el, host, scope, frag) {
            return compile(el, this.$options, true)(this, el, host, scope, frag);
        };
    }

    /**
     * The exposed Vue constructor.
     *
     * API conventions:
     * - public API methods/properties are prefixed with `$`
     * - internal methods/properties are prefixed with `_`
     * - non-prefixed properties are assumed to be proxied user
     *   data.
     *
     * @constructor
     * @param {Object} [options]
     * @public
     */

    function Vue(options) {
        this._init(options);
    }

    // install internals
    initMixin(Vue);
    stateMixin(Vue);
    eventsMixin(Vue);
    lifecycleMixin(Vue);
    miscMixin(Vue);

    // install instance APIs
    dataAPI(Vue);
    domAPI(Vue);
    eventsAPI(Vue);
    lifecycleAPI(Vue);

    var slot = {

        priority: SLOT,
        params: ['name'],

        bind: function bind() {
            // this was resolved during component transclusion
            var name = this.params.name || 'default';
            var content = this.vm._slotContents && this.vm._slotContents[name];
            if (!content || !content.hasChildNodes()) {
                this.fallback();
            } else {
                this.compile(content.cloneNode(true), this.vm._context, this.vm);
            }
        },

        compile: function compile(content, context, host) {
            if (content && context) {
                if (this.el.hasChildNodes() && content.childNodes.length === 1 && content.childNodes[0].nodeType === 1 && content.childNodes[0].hasAttribute('v-if')) {
                    // if the inserted slot has v-if
                    // inject fallback content as the v-else
                    var elseBlock = document.createElement('template');
                    elseBlock.setAttribute('v-else', '');
                    elseBlock.innerHTML = this.el.innerHTML;
                    // the else block should be compiled in child scope
                    elseBlock._context = this.vm;
                    content.appendChild(elseBlock);
                }
                var scope = host ? host._scope : this._scope;
                this.unlink = context.$compile(content, host, scope, this._frag);
            }
            if (content) {
                replace(this.el, content);
            } else {
                remove(this.el);
            }
        },

        fallback: function fallback() {
            this.compile(extractContent(this.el, true), this.vm);
        },

        unbind: function unbind() {
            if (this.unlink) {
                this.unlink();
            }
        }
    };

    var partial = {

        priority: PARTIAL,

        params: ['name'],

        // watch changes to name for dynamic partials
        paramWatchers: {
            name: function name(value) {
                vIf.remove.call(this);
                if (value) {
                    this.insert(value);
                }
            }
        },

        bind: function bind() {
            this.anchor = createAnchor('v-partial');
            replace(this.el, this.anchor);
            this.insert(this.params.name);
        },

        insert: function insert(id) {
            var partial = resolveAsset(this.vm.$options, 'partials', id, true);
            if (partial) {
                this.factory = new FragmentFactory(this.vm, partial);
                vIf.insert.call(this);
            }
        },

        unbind: function unbind() {
            if (this.frag) {
                this.frag.destroy();
            }
        }
    };

    var elementDirectives = {
        slot: slot,
        partial: partial
    };

    var convertArray = vFor._postProcess;

    /**
     * Limit filter for arrays
     *
     * @param {Number} n
     * @param {Number} offset (Decimal expected)
     */

    function limitBy(arr, n, offset) {
        offset = offset ? parseInt(offset, 10) : 0;
        n = toNumber(n);
        return typeof n === 'number' ? arr.slice(offset, offset + n) : arr;
    }

    /**
     * Filter filter for arrays
     *
     * @param {String} search
     * @param {String} [delimiter]
     * @param {String} ...dataKeys
     */

    function filterBy(arr, search, delimiter) {
        arr = convertArray(arr);
        if (search == null) {
            return arr;
        }
        if (typeof search === 'function') {
            return arr.filter(search);
        }
        // cast to lowercase string
        search = ('' + search).toLowerCase();
        // allow optional `in` delimiter
        // because why not
        var n = delimiter === 'in' ? 3 : 2;
        // extract and flatten keys
        var keys = Array.prototype.concat.apply([], toArray(arguments, n));
        var res = [];
        var item, key, val, j;
        for (var i = 0, l = arr.length; i < l; i++) {
            item = arr[i];
            val = item && item.$value || item;
            j = keys.length;
            if (j) {
                while (j--) {
                    key = keys[j];
                    if (key === '$key' && contains(item.$key, search) || contains(getPath(val, key), search)) {
                        res.push(item);
                        break;
                    }
                }
            } else if (contains(item, search)) {
                res.push(item);
            }
        }
        return res;
    }

    /**
     * Filter filter for arrays
     *
     * @param {String|Array<String>|Function} ...sortKeys
     * @param {Number} [order]
     */

    function orderBy(arr) {
        var comparator = null;
        var sortKeys = undefined;
        arr = convertArray(arr);

        // determine order (last argument)
        var args = toArray(arguments, 1);
        var order = args[args.length - 1];
        if (typeof order === 'number') {
            order = order < 0 ? -1 : 1;
            args = args.length > 1 ? args.slice(0, -1) : args;
        } else {
            order = 1;
        }

        // determine sortKeys & comparator
        var firstArg = args[0];
        if (!firstArg) {
            return arr;
        } else if (typeof firstArg === 'function') {
            // custom comparator
            comparator = function (a, b) {
                return firstArg(a, b) * order;
            };
        } else {
            // string keys. flatten first
            sortKeys = Array.prototype.concat.apply([], args);
            comparator = function (a, b, i) {
                i = i || 0;
                return i >= sortKeys.length - 1 ? baseCompare(a, b, i) : baseCompare(a, b, i) || comparator(a, b, i + 1);
            };
        }

        function baseCompare(a, b, sortKeyIndex) {
            var sortKey = sortKeys[sortKeyIndex];
            if (sortKey) {
                if (sortKey !== '$key') {
                    if (isObject(a) && '$value' in a) a = a.$value;
                    if (isObject(b) && '$value' in b) b = b.$value;
                }
                a = isObject(a) ? getPath(a, sortKey) : a;
                b = isObject(b) ? getPath(b, sortKey) : b;
            }
            return a === b ? 0 : a > b ? order : -order;
        }

        // sort on a copy to avoid mutating original array
        return arr.slice().sort(comparator);
    }

    /**
     * String contain helper
     *
     * @param {*} val
     * @param {String} search
     */

    function contains(val, search) {
        var i;
        if (isPlainObject(val)) {
            var keys = Object.keys(val);
            i = keys.length;
            while (i--) {
                if (contains(val[keys[i]], search)) {
                    return true;
                }
            }
        } else if (isArray(val)) {
            i = val.length;
            while (i--) {
                if (contains(val[i], search)) {
                    return true;
                }
            }
        } else if (val != null) {
            return val.toString().toLowerCase().indexOf(search) > -1;
        }
    }

    var digitsRE = /(\d{3})(?=\d)/g;

    // asset collections must be a plain object.
    var filters = {

        orderBy: orderBy,
        filterBy: filterBy,
        limitBy: limitBy,

        /**
         * Stringify value.
         *
         * @param {Number} indent
         */

        json: {
            read: function read(value, indent) {
                return typeof value === 'string' ? value : JSON.stringify(value, null, arguments.length > 1 ? indent : 2);
            },
            write: function write(value) {
                try {
                    return JSON.parse(value);
                } catch (e) {
                    return value;
                }
            }
        },

        /**
         * 'abc' => 'Abc'
         */

        capitalize: function capitalize(value) {
            if (!value && value !== 0) return '';
            value = value.toString();
            return value.charAt(0).toUpperCase() + value.slice(1);
        },

        /**
         * 'abc' => 'ABC'
         */

        uppercase: function uppercase(value) {
            return value || value === 0 ? value.toString().toUpperCase() : '';
        },

        /**
         * 'AbC' => 'abc'
         */

        lowercase: function lowercase(value) {
            return value || value === 0 ? value.toString().toLowerCase() : '';
        },

        /**
         * 12345 => $12,345.00
         *
         * @param {String} sign
         * @param {Number} decimals Decimal places
         */

        currency: function currency(value, _currency, decimals) {
            value = parseFloat(value);
            if (!isFinite(value) || !value && value !== 0) return '';
            _currency = _currency != null ? _currency : '$';
            decimals = decimals != null ? decimals : 2;
            var stringified = Math.abs(value).toFixed(decimals);
            var _int = decimals ? stringified.slice(0, -1 - decimals) : stringified;
            var i = _int.length % 3;
            var head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? ',' : '') : '';
            var _float = decimals ? stringified.slice(-1 - decimals) : '';
            var sign = value < 0 ? '-' : '';
            return sign + _currency + head + _int.slice(i).replace(digitsRE, '$1,') + _float;
        },

        /**
         * 'item' => 'items'
         *
         * @params
         *  an array of strings corresponding to
         *  the single, double, triple ... forms of the word to
         *  be pluralized. When the number to be pluralized
         *  exceeds the length of the args, it will use the last
         *  entry in the array.
         *
         *  e.g. ['single', 'double', 'triple', 'multiple']
         */

        pluralize: function pluralize(value) {
            var args = toArray(arguments, 1);
            var length = args.length;
            if (length > 1) {
                var index = value % 10 - 1;
                return index in args ? args[index] : args[length - 1];
            } else {
                return args[0] + (value === 1 ? '' : 's');
            }
        },

        /**
         * Debounce a handler function.
         *
         * @param {Function} handler
         * @param {Number} delay = 300
         * @return {Function}
         */

        debounce: function debounce(handler, delay) {
            if (!handler) return;
            if (!delay) {
                delay = 300;
            }
            return _debounce(handler, delay);
        }
    };

    function installGlobalAPI (Vue) {
        /**
         * Vue and every constructor that extends Vue has an
         * associated options object, which can be accessed during
         * compilation steps as `this.constructor.options`.
         *
         * These can be seen as the default options of every
         * Vue instance.
         */

        Vue.options = {
            directives: directives,
            elementDirectives: elementDirectives,
            filters: filters,
            transitions: {},
            components: {},
            partials: {},
            replace: true
        };

        /**
         * Expose useful internals
         */

        Vue.util = util;
        Vue.config = config;
        Vue.set = set;
        Vue['delete'] = del;
        Vue.nextTick = nextTick;

        /**
         * The following are exposed for advanced usage / plugins
         */

        Vue.compiler = compiler;
        Vue.FragmentFactory = FragmentFactory;
        Vue.internalDirectives = internalDirectives;
        Vue.parsers = {
            path: path,
            text: text,
            template: template,
            directive: directive,
            expression: expression
        };

        /**
         * Each instance constructor, including Vue, has a unique
         * cid. This enables us to create wrapped "child
         * constructors" for prototypal inheritance and cache them.
         */

        Vue.cid = 0;
        var cid = 1;

        /**
         * Class inheritance
         *
         * @param {Object} extendOptions
         */

        Vue.extend = function (extendOptions) {
            extendOptions = extendOptions || {};
            var Super = this;
            var isFirstExtend = Super.cid === 0;
            if (isFirstExtend && extendOptions._Ctor) {
                return extendOptions._Ctor;
            }
            var name = extendOptions.name || Super.options.name;
            if ('development' !== 'production') {
                if (!/^[a-zA-Z][\w-]*$/.test(name)) {
                    warn('Invalid component name: "' + name + '". Component names ' + 'can only contain alphanumeric characaters and the hyphen.');
                    name = null;
                }
            }
            var Sub = createClass(name || 'VueComponent');
            Sub.prototype = Object.create(Super.prototype);
            Sub.prototype.constructor = Sub;
            Sub.cid = cid++;
            Sub.options = mergeOptions(Super.options, extendOptions);
            Sub['super'] = Super;
            // allow further extension
            Sub.extend = Super.extend;
            // create asset registers, so extended classes
            // can have their private assets too.
            config._assetTypes.forEach(function (type) {
                Sub[type] = Super[type];
            });
            // enable recursive self-lookup
            if (name) {
                Sub.options.components[name] = Sub;
            }
            // cache constructor
            if (isFirstExtend) {
                extendOptions._Ctor = Sub;
            }
            return Sub;
        };

        /**
         * A function that returns a sub-class constructor with the
         * given name. This gives us much nicer output when
         * logging instances in the console.
         *
         * @param {String} name
         * @return {Function}
         */

        function createClass(name) {
            /* eslint-disable no-new-func */
            return new Function('return function ' + classify(name) + ' (options) { this._init(options) }')();
            /* eslint-enable no-new-func */
        }

        /**
         * Plugin system
         *
         * @param {Object} plugin
         */

        Vue.use = function (plugin) {
            /* istanbul ignore if */
            if (plugin.installed) {
                return;
            }
            // additional parameters
            var args = toArray(arguments, 1);
            args.unshift(this);
            if (typeof plugin.install === 'function') {
                plugin.install.apply(plugin, args);
            } else {
                plugin.apply(null, args);
            }
            plugin.installed = true;
            return this;
        };

        /**
         * Apply a global mixin by merging it into the default
         * options.
         */

        Vue.mixin = function (mixin) {
            Vue.options = mergeOptions(Vue.options, mixin);
        };

        /**
         * Create asset registration methods with the following
         * signature:
         *
         * @param {String} id
         * @param {*} definition
         */

        config._assetTypes.forEach(function (type) {
            Vue[type] = function (id, definition) {
                if (!definition) {
                    return this.options[type + 's'][id];
                } else {
                    /* istanbul ignore if */
                    if ('development' !== 'production') {
                        if (type === 'component' && (commonTagRE.test(id) || reservedTagRE.test(id))) {
                            warn('Do not use built-in or reserved HTML elements as component ' + 'id: ' + id);
                        }
                    }
                    if (type === 'component' && isPlainObject(definition)) {
                        if (!definition.name) {
                            definition.name = id;
                        }
                        definition = Vue.extend(definition);
                    }
                    this.options[type + 's'][id] = definition;
                    return definition;
                }
            };
        });

        // expose internal transition API
        extend(Vue.transition, transition);
    }

    installGlobalAPI(Vue);

    Vue.version = '1.0.26';

    // devtools global hook
    /* istanbul ignore next */
    setTimeout(function () {
        if (config.devtools) { 
            if (devtools) {
                devtools.emit('init', Vue);
            } else if ('development' !== 'production' && inBrowser && /Chrome\/\d+/.test(window.navigator.userAgent)) {
                // console.log('Download the Vue Devtools for a better development experience:\n' + 'https://github.com/vuejs/vue-devtools');
            }
        }
    }, 0);
    window.Vue = Vue;
    return Vue;
}));
//requirejs
/*
 RequireJS 2.2.0 Copyright jQuery Foundation and other contributors.
 Released under MIT license, http://github.com/requirejs/requirejs/LICENSE
*/
var requirejs,require,define;
(function(ga){function ka(b,c,d,g){return g||""}function K(b){return"[object Function]"===Q.call(b)}function L(b){return"[object Array]"===Q.call(b)}function y(b,c){if(b){var d;for(d=0;d<b.length&&(!b[d]||!c(b[d],d,b));d+=1);}}function X(b,c){if(b){var d;for(d=b.length-1;-1<d&&(!b[d]||!c(b[d],d,b));--d);}}function x(b,c){return la.call(b,c)}function e(b,c){return x(b,c)&&b[c]}function D(b,c){for(var d in b)if(x(b,d)&&c(b[d],d))break}function Y(b,c,d,g){c&&D(c,function(c,e){if(d||!x(b,e))!g||"object"!==
typeof c||!c||L(c)||K(c)||c instanceof RegExp?b[e]=c:(b[e]||(b[e]={}),Y(b[e],c,d,g))});return b}function z(b,c){return function(){return c.apply(b,arguments)}}function ha(b){throw b;}function ia(b){if(!b)return b;var c=ga;y(b.split("."),function(b){c=c[b]});return c}function F(b,c,d,g){c=Error(c+"\nhttp://requirejs.org/docs/errors.html#"+b);c.requireType=b;c.requireModules=g;d&&(c.originalError=d);return c}function ma(b){function c(a,n,b){var h,k,f,c,d,l,g,r;n=n&&n.split("/");var q=p.map,m=q&&q["*"];
if(a){a=a.split("/");k=a.length-1;p.nodeIdCompat&&U.test(a[k])&&(a[k]=a[k].replace(U,""));"."===a[0].charAt(0)&&n&&(k=n.slice(0,n.length-1),a=k.concat(a));k=a;for(f=0;f<k.length;f++)c=k[f],"."===c?(k.splice(f,1),--f):".."===c&&0!==f&&(1!==f||".."!==k[2])&&".."!==k[f-1]&&0<f&&(k.splice(f-1,2),f-=2);a=a.join("/")}if(b&&q&&(n||m)){k=a.split("/");f=k.length;a:for(;0<f;--f){d=k.slice(0,f).join("/");if(n)for(c=n.length;0<c;--c)if(b=e(q,n.slice(0,c).join("/")))if(b=e(b,d)){h=b;l=f;break a}!g&&m&&e(m,d)&&
(g=e(m,d),r=f)}!h&&g&&(h=g,l=r);h&&(k.splice(0,l,h),a=k.join("/"))}return(h=e(p.pkgs,a))?h:a}function d(a){E&&y(document.getElementsByTagName("script"),function(n){if(n.getAttribute("data-requiremodule")===a&&n.getAttribute("data-requirecontext")===l.contextName)return n.parentNode.removeChild(n),!0})}function m(a){var n=e(p.paths,a);if(n&&L(n)&&1<n.length)return n.shift(),l.require.undef(a),l.makeRequire(null,{skipMap:!0})([a]),!0}function r(a){var n,b=a?a.indexOf("!"):-1;-1<b&&(n=a.substring(0,
b),a=a.substring(b+1,a.length));return[n,a]}function q(a,n,b,h){var k,f,d=null,g=n?n.name:null,p=a,q=!0,m="";a||(q=!1,a="_@r"+(Q+=1));a=r(a);d=a[0];a=a[1];d&&(d=c(d,g,h),f=e(v,d));a&&(d?m=f&&f.normalize?f.normalize(a,function(a){return c(a,g,h)}):-1===a.indexOf("!")?c(a,g,h):a:(m=c(a,g,h),a=r(m),d=a[0],m=a[1],b=!0,k=l.nameToUrl(m)));b=!d||f||b?"":"_unnormalized"+(T+=1);return{prefix:d,name:m,parentMap:n,unnormalized:!!b,url:k,originalName:p,isDefine:q,id:(d?d+"!"+m:m)+b}}function u(a){var b=a.id,
c=e(t,b);c||(c=t[b]=new l.Module(a));return c}function w(a,b,c){var h=a.id,k=e(t,h);if(!x(v,h)||k&&!k.defineEmitComplete)if(k=u(a),k.error&&"error"===b)c(k.error);else k.on(b,c);else"defined"===b&&c(v[h])}function A(a,b){var c=a.requireModules,h=!1;if(b)b(a);else if(y(c,function(b){if(b=e(t,b))b.error=a,b.events.error&&(h=!0,b.emit("error",a))}),!h)g.onError(a)}function B(){V.length&&(y(V,function(a){var b=a[0];"string"===typeof b&&(l.defQueueMap[b]=!0);G.push(a)}),V=[])}function C(a){delete t[a];
delete Z[a]}function J(a,b,c){var h=a.map.id;a.error?a.emit("error",a.error):(b[h]=!0,y(a.depMaps,function(h,f){var d=h.id,g=e(t,d);!g||a.depMatched[f]||c[d]||(e(b,d)?(a.defineDep(f,v[d]),a.check()):J(g,b,c))}),c[h]=!0)}function H(){var a,b,c=(a=1E3*p.waitSeconds)&&l.startTime+a<(new Date).getTime(),h=[],k=[],f=!1,g=!0;if(!aa){aa=!0;D(Z,function(a){var l=a.map,e=l.id;if(a.enabled&&(l.isDefine||k.push(a),!a.error))if(!a.inited&&c)m(e)?f=b=!0:(h.push(e),d(e));else if(!a.inited&&a.fetched&&l.isDefine&&
(f=!0,!l.prefix))return g=!1});if(c&&h.length)return a=F("timeout","Load timeout for modules: "+h,null,h),a.contextName=l.contextName,A(a);g&&y(k,function(a){J(a,{},{})});c&&!b||!f||!E&&!ja||ba||(ba=setTimeout(function(){ba=0;H()},50));aa=!1}}function I(a){x(v,a[0])||u(q(a[0],null,!0)).init(a[1],a[2])}function O(a){a=a.currentTarget||a.srcElement;var b=l.onScriptLoad;a.detachEvent&&!ca?a.detachEvent("onreadystatechange",b):a.removeEventListener("load",b,!1);b=l.onScriptError;a.detachEvent&&!ca||a.removeEventListener("error",
b,!1);return{node:a,id:a&&a.getAttribute("data-requiremodule")}}function P(){var a;for(B();G.length;){a=G.shift();if(null===a[0])return A(F("mismatch","Mismatched anonymous define() module: "+a[a.length-1]));I(a)}l.defQueueMap={}}var aa,da,l,R,ba,p={waitSeconds:0,baseUrl:"./",paths:{},bundles:{},pkgs:{},shim:{},config:{}},t={},Z={},ea={},G=[],v={},W={},fa={},Q=1,T=1;R={require:function(a){return a.require?a.require:a.require=l.makeRequire(a.map)},exports:function(a){a.usingExports=!0;if(a.map.isDefine)return a.exports?
v[a.map.id]=a.exports:a.exports=v[a.map.id]={}},module:function(a){return a.module?a.module:a.module={id:a.map.id,uri:a.map.url,config:function(){return e(p.config,a.map.id)||{}},exports:a.exports||(a.exports={})}}};da=function(a){this.events=e(ea,a.id)||{};this.map=a;this.shim=e(p.shim,a.id);this.depExports=[];this.depMaps=[];this.depMatched=[];this.pluginMaps={};this.depCount=0};da.prototype={init:function(a,b,c,h){h=h||{};if(!this.inited){this.factory=b;if(c)this.on("error",c);else this.events.error&&
(c=z(this,function(a){this.emit("error",a)}));this.depMaps=a&&a.slice(0);this.errback=c;this.inited=!0;this.ignore=h.ignore;h.enabled||this.enabled?this.enable():this.check()}},defineDep:function(a,b){this.depMatched[a]||(this.depMatched[a]=!0,--this.depCount,this.depExports[a]=b)},fetch:function(){if(!this.fetched){this.fetched=!0;l.startTime=(new Date).getTime();var a=this.map;if(this.shim)l.makeRequire(this.map,{enableBuildCallback:!0})(this.shim.deps||[],z(this,function(){return a.prefix?this.callPlugin():
this.load()}));else return a.prefix?this.callPlugin():this.load()}},load:function(){var a=this.map.url;W[a]||(W[a]=!0,l.load(this.map.id,a))},check:function(){if(this.enabled&&!this.enabling){var a,b,c=this.map.id;b=this.depExports;var h=this.exports,k=this.factory;if(!this.inited)x(l.defQueueMap,c)||this.fetch();else if(this.error)this.emit("error",this.error);else if(!this.defining){this.defining=!0;if(1>this.depCount&&!this.defined){if(K(k)){if(this.events.error&&this.map.isDefine||g.onError!==
ha)try{h=l.execCb(c,k,b,h)}catch(d){a=d}else h=l.execCb(c,k,b,h);this.map.isDefine&&void 0===h&&((b=this.module)?h=b.exports:this.usingExports&&(h=this.exports));if(a)return a.requireMap=this.map,a.requireModules=this.map.isDefine?[this.map.id]:null,a.requireType=this.map.isDefine?"define":"require",A(this.error=a)}else h=k;this.exports=h;if(this.map.isDefine&&!this.ignore&&(v[c]=h,g.onResourceLoad)){var f=[];y(this.depMaps,function(a){f.push(a.normalizedMap||a)});g.onResourceLoad(l,this.map,f)}C(c);
this.defined=!0}this.defining=!1;this.defined&&!this.defineEmitted&&(this.defineEmitted=!0,this.emit("defined",this.exports),this.defineEmitComplete=!0)}}},callPlugin:function(){var a=this.map,b=a.id,d=q(a.prefix);this.depMaps.push(d);w(d,"defined",z(this,function(h){var k,f,d=e(fa,this.map.id),M=this.map.name,r=this.map.parentMap?this.map.parentMap.name:null,m=l.makeRequire(a.parentMap,{enableBuildCallback:!0});if(this.map.unnormalized){if(h.normalize&&(M=h.normalize(M,function(a){return c(a,r,!0)})||
""),f=q(a.prefix+"!"+M,this.map.parentMap),w(f,"defined",z(this,function(a){this.map.normalizedMap=f;this.init([],function(){return a},null,{enabled:!0,ignore:!0})})),h=e(t,f.id)){this.depMaps.push(f);if(this.events.error)h.on("error",z(this,function(a){this.emit("error",a)}));h.enable()}}else d?(this.map.url=l.nameToUrl(d),this.load()):(k=z(this,function(a){this.init([],function(){return a},null,{enabled:!0})}),k.error=z(this,function(a){this.inited=!0;this.error=a;a.requireModules=[b];D(t,function(a){0===
a.map.id.indexOf(b+"_unnormalized")&&C(a.map.id)});A(a)}),k.fromText=z(this,function(h,c){var d=a.name,f=q(d),M=S;c&&(h=c);M&&(S=!1);u(f);x(p.config,b)&&(p.config[d]=p.config[b]);try{g.exec(h)}catch(e){return A(F("fromtexteval","fromText eval for "+b+" failed: "+e,e,[b]))}M&&(S=!0);this.depMaps.push(f);l.completeLoad(d);m([d],k)}),h.load(a.name,m,k,p))}));l.enable(d,this);this.pluginMaps[d.id]=d},enable:function(){Z[this.map.id]=this;this.enabling=this.enabled=!0;y(this.depMaps,z(this,function(a,
b){var c,h;if("string"===typeof a){a=q(a,this.map.isDefine?this.map:this.map.parentMap,!1,!this.skipMap);this.depMaps[b]=a;if(c=e(R,a.id)){this.depExports[b]=c(this);return}this.depCount+=1;w(a,"defined",z(this,function(a){this.undefed||(this.defineDep(b,a),this.check())}));this.errback?w(a,"error",z(this,this.errback)):this.events.error&&w(a,"error",z(this,function(a){this.emit("error",a)}))}c=a.id;h=t[c];x(R,c)||!h||h.enabled||l.enable(a,this)}));D(this.pluginMaps,z(this,function(a){var b=e(t,a.id);
b&&!b.enabled&&l.enable(a,this)}));this.enabling=!1;this.check()},on:function(a,b){var c=this.events[a];c||(c=this.events[a]=[]);c.push(b)},emit:function(a,b){y(this.events[a],function(a){a(b)});"error"===a&&delete this.events[a]}};l={config:p,contextName:b,registry:t,defined:v,urlFetched:W,defQueue:G,defQueueMap:{},Module:da,makeModuleMap:q,nextTick:g.nextTick,onError:A,configure:function(a){a.baseUrl&&"/"!==a.baseUrl.charAt(a.baseUrl.length-1)&&(a.baseUrl+="/");if("string"===typeof a.urlArgs){var b=
a.urlArgs;a.urlArgs=function(a,c){return(-1===c.indexOf("?")?"?":"&")+b}}var c=p.shim,h={paths:!0,bundles:!0,config:!0,map:!0};D(a,function(a,b){h[b]?(p[b]||(p[b]={}),Y(p[b],a,!0,!0)):p[b]=a});a.bundles&&D(a.bundles,function(a,b){y(a,function(a){a!==b&&(fa[a]=b)})});a.shim&&(D(a.shim,function(a,b){L(a)&&(a={deps:a});!a.exports&&!a.init||a.exportsFn||(a.exportsFn=l.makeShimExports(a));c[b]=a}),p.shim=c);a.packages&&y(a.packages,function(a){var b;a="string"===typeof a?{name:a}:a;b=a.name;a.location&&
(p.paths[b]=a.location);p.pkgs[b]=a.name+"/"+(a.main||"main").replace(na,"").replace(U,"")});D(t,function(a,b){a.inited||a.map.unnormalized||(a.map=q(b,null,!0))});(a.deps||a.callback)&&l.require(a.deps||[],a.callback)},makeShimExports:function(a){return function(){var b;a.init&&(b=a.init.apply(ga,arguments));return b||a.exports&&ia(a.exports)}},makeRequire:function(a,n){function m(c,d,f){var e,r;n.enableBuildCallback&&d&&K(d)&&(d.__requireJsBuild=!0);if("string"===typeof c){if(K(d))return A(F("requireargs",
"Invalid require call"),f);if(a&&x(R,c))return R[c](t[a.id]);if(g.get)return g.get(l,c,a,m);e=q(c,a,!1,!0);e=e.id;return x(v,e)?v[e]:A(F("notloaded",'Module name "'+e+'" has not been loaded yet for context: '+b+(a?"":". Use require([])")))}P();l.nextTick(function(){P();r=u(q(null,a));r.skipMap=n.skipMap;r.init(c,d,f,{enabled:!0});H()});return m}n=n||{};Y(m,{isBrowser:E,toUrl:function(b){var d,f=b.lastIndexOf("."),g=b.split("/")[0];-1!==f&&("."!==g&&".."!==g||1<f)&&(d=b.substring(f,b.length),b=b.substring(0,
f));return l.nameToUrl(c(b,a&&a.id,!0),d,!0)},defined:function(b){return x(v,q(b,a,!1,!0).id)},specified:function(b){b=q(b,a,!1,!0).id;return x(v,b)||x(t,b)}});a||(m.undef=function(b){B();var c=q(b,a,!0),f=e(t,b);f.undefed=!0;d(b);delete v[b];delete W[c.url];delete ea[b];X(G,function(a,c){a[0]===b&&G.splice(c,1)});delete l.defQueueMap[b];f&&(f.events.defined&&(ea[b]=f.events),C(b))});return m},enable:function(a){e(t,a.id)&&u(a).enable()},completeLoad:function(a){var b,c,d=e(p.shim,a)||{},g=d.exports;
for(B();G.length;){c=G.shift();if(null===c[0]){c[0]=a;if(b)break;b=!0}else c[0]===a&&(b=!0);I(c)}l.defQueueMap={};c=e(t,a);if(!b&&!x(v,a)&&c&&!c.inited)if(!p.enforceDefine||g&&ia(g))I([a,d.deps||[],d.exportsFn]);else return m(a)?void 0:A(F("nodefine","No define call for "+a,null,[a]));H()},nameToUrl:function(a,b,c){var d,k,f,m;(d=e(p.pkgs,a))&&(a=d);if(d=e(fa,a))return l.nameToUrl(d,b,c);if(g.jsExtRegExp.test(a))d=a+(b||"");else{d=p.paths;k=a.split("/");for(f=k.length;0<f;--f)if(m=k.slice(0,f).join("/"),
m=e(d,m)){L(m)&&(m=m[0]);k.splice(0,f,m);break}d=k.join("/");d+=b||(/^data\:|^blob\:|\?/.test(d)||c?"":".js");d=("/"===d.charAt(0)||d.match(/^[\w\+\.\-]+:/)?"":p.baseUrl)+d}return p.urlArgs&&!/^blob\:/.test(d)?d+p.urlArgs(a,d):d},load:function(a,b){g.load(l,a,b)},execCb:function(a,b,c,d){return b.apply(d,c)},onScriptLoad:function(a){if("load"===a.type||oa.test((a.currentTarget||a.srcElement).readyState))N=null,a=O(a),l.completeLoad(a.id)},onScriptError:function(a){var b=O(a);if(!m(b.id)){var c=[];
D(t,function(a,d){0!==d.indexOf("_@r")&&y(a.depMaps,function(a){if(a.id===b.id)return c.push(d),!0})});return A(F("scripterror",'Script error for "'+b.id+(c.length?'", needed by: '+c.join(", "):'"'),a,[b.id]))}}};l.require=l.makeRequire();return l}function pa(){if(N&&"interactive"===N.readyState)return N;X(document.getElementsByTagName("script"),function(b){if("interactive"===b.readyState)return N=b});return N}var g,B,C,H,O,I,N,P,u,T,qa=/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,ra=/[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,
U=/\.js$/,na=/^\.\//;B=Object.prototype;var Q=B.toString,la=B.hasOwnProperty,E=!("undefined"===typeof window||"undefined"===typeof navigator||!window.document),ja=!E&&"undefined"!==typeof importScripts,oa=E&&"PLAYSTATION 3"===navigator.platform?/^complete$/:/^(complete|loaded)$/,ca="undefined"!==typeof opera&&"[object Opera]"===opera.toString(),J={},w={},V=[],S=!1;if("undefined"===typeof define){if("undefined"!==typeof requirejs){if(K(requirejs))return;w=requirejs;requirejs=void 0}"undefined"===typeof require||
K(require)||(w=require,require=void 0);g=requirejs=function(b,c,d,m){var r,q="_";L(b)||"string"===typeof b||(r=b,L(c)?(b=c,c=d,d=m):b=[]);r&&r.context&&(q=r.context);(m=e(J,q))||(m=J[q]=g.s.newContext(q));r&&m.configure(r);return m.require(b,c,d)};g.config=function(b){return g(b)};g.nextTick="undefined"!==typeof setTimeout?function(b){setTimeout(b,4)}:function(b){b()};require||(require=g);g.version="2.2.0";g.jsExtRegExp=/^\/|:|\?|\.js$/;g.isBrowser=E;B=g.s={contexts:J,newContext:ma};g({});y(["toUrl",
"undef","defined","specified"],function(b){g[b]=function(){var c=J._;return c.require[b].apply(c,arguments)}});E&&(C=B.head=document.getElementsByTagName("head")[0],H=document.getElementsByTagName("base")[0])&&(C=B.head=H.parentNode);g.onError=ha;g.createNode=function(b,c,d){c=b.xhtml?document.createElementNS("http://www.w3.org/1999/xhtml","html:script"):document.createElement("script");c.type=b.scriptType||"text/javascript";c.charset="utf-8";c.async=!0;return c};g.load=function(b,c,d){var m=b&&b.config||
{},e;if(E){e=g.createNode(m,c,d);e.setAttribute("data-requirecontext",b.contextName);e.setAttribute("data-requiremodule",c);!e.attachEvent||e.attachEvent.toString&&0>e.attachEvent.toString().indexOf("[native code")||ca?(e.addEventListener("load",b.onScriptLoad,!1),e.addEventListener("error",b.onScriptError,!1)):(S=!0,e.attachEvent("onreadystatechange",b.onScriptLoad));e.src=d;if(m.onNodeCreated)m.onNodeCreated(e,m,c,d);P=e;H?C.insertBefore(e,H):C.appendChild(e);P=null;return e}if(ja)try{setTimeout(function(){},
0),importScripts(d),b.completeLoad(c)}catch(q){b.onError(F("importscripts","importScripts failed for "+c+" at "+d,q,[c]))}};E&&!w.skipDataMain&&X(document.getElementsByTagName("script"),function(b){C||(C=b.parentNode);if(O=b.getAttribute("data-main"))return u=O,w.baseUrl||-1!==u.indexOf("!")||(I=u.split("/"),u=I.pop(),T=I.length?I.join("/")+"/":"./",w.baseUrl=T),u=u.replace(U,""),g.jsExtRegExp.test(u)&&(u=O),w.deps=w.deps?w.deps.concat(u):[u],!0});define=function(b,c,d){var e,g;"string"!==typeof b&&
(d=c,c=b,b=null);L(c)||(d=c,c=null);!c&&K(d)&&(c=[],d.length&&(d.toString().replace(qa,ka).replace(ra,function(b,d){c.push(d)}),c=(1===d.length?["require"]:["require","exports","module"]).concat(c)));S&&(e=P||pa())&&(b||(b=e.getAttribute("data-requiremodule")),g=J[e.getAttribute("data-requirecontext")]);g?(g.defQueue.push([b,c,d]),g.defQueueMap[b]=!0):V.push([b,c,d])};define.amd={jQuery:!0};g.exec=function(b){return eval(b)};g(w)}})(this);
//引入echarts图表插件 
// require(['/plugIn/echarts.min.js'],function(echarts){
//     window.echarts = echarts;
// });

require(['common_main'], function(){
    require(['config'], function(){});
});
/*
* 调用方法示例
 // 创建搜索
 //html
 <!--搜索-->
 <div class="search">
 <search></search>
 </div>

 component.search({
    btnText : "文案"
 });
 new Vue({
 el: '.search'
 });

* */
define('component',[],function(header,nav){
    window.component = {
        //顶部位置组件
        location : function(info){
            //数据集合
            info = info || {};
            var data = {
                list : [
                    { text : "位置" }
                ]
            } 
            $.extend(data,info);
            // 定义组件
            var location = Vue.extend({
                template:
                    '<ul>'+
                        '<li v-for="val in list"><a class="{{val.class}}" href="{{val.href}}">{{val.text}}</a></li>'+
                    '</ul>',
                data: function(){
                    return data
                }
            })
            // 全局注册组件
            Vue.component('location', location);
        },
        //搜索框组件
        search : function(info,callback){
            //数据集合
            info = info || {};
            var data = {
                placeholder : "请输入关键字查询",
                btnText : "查询",
                btnClass : "btn-success",
                value : ""
            }
            //扩展查询
            if(info.select){
                $.extend(data,{
                    selectClass : "searchClass",
                    searchValClass : "hasSelect",
                    option : [
                        { text : "销售区域", placeholder : "请输入销售区域查询"},
                        { text : "入驻时间", placeholder : "请输入入驻时间查询" },
                        { text : "联系人", placeholder : "请输入联系人查询" },
                        { text : "手机号码", placeholder : "请输入手机号码查询" },
                        { text : "联系地址", placeholder : "请输入联系地址查询" }
                    ]
                });
            }
            // 定义组件
            $.extend(data,info);
            var search = Vue.extend({
                template:
                    '<template v-if="select">' +
                        '<div class="sod_select define">'+
                            '<div class="sod_label">{{optionDefault||"关键字"}}</div>'+
                            '<div class="sod_list">'+
                                '<ul>'+
                                    '<li class="{{val.class}}" v-on:click="optionVal(val)" v-for="val in option">{{val.text}}</li>'+
                                '</ul>'+
                            '</div>'+
                        '</div>'+
                    '</template>'+
                    '<input type="text" v-model="value" class="input searchVal mr10 {{searchValClass}}" v-on:keyup="keyup" placeholder="{{placeholder}}" value="{{val}}"/>' +
                    '<input type="button" v-on:click="submitSearch" class="btn {{btnClass}}" value="{{btnText}}"/>'+
                    '<template v-if="value">'+
                        '<i class="icon icon-clean" v-on:click="clean">&#xe607;</i>'+
                    '</template>',
                data: function(){
                    return data 
                },
                methods:{
                    //提交搜索
                    submitSearch : function(){
                        var $val = $.trim($(".searchVal").val());
                        //搜索返回
                        callback["submitSearch"]($val,this);
                    },
                    //清楚输入框文字
                    clean : function(){
                        this.value = "";
                    },
                    //快速提交搜索
                    keyup : function(e){
                        if(e.keyCode==13){
                            //提交登录
                            this.submitSearch();
                        } 
                    },
                    //选项值
                    optionVal : function(val){ 
                        this.optionDefault = val.text;
                        this.selectActive = val;
                        this.placeholder = val.placeholder;
                        // for(var i=0;i<this.option.length;i++){
                        //     if(val==this.option[i].text){
                        //         this.placeholder = this.option[i].placeholder;
                        //         this.optionDefault = this.option[i].text;
                        //         return;
                        //     }
                        // }
                    }
                }
            })
            // 全局注册组件
            Vue.component('search', search);
        },
        //页面码组件
        page : function(info,callback){
            //数据集合
            var data = {
                prev : "上一页",
                pages : Tool.pageData(info),
                next : "下一页",
                number : info.currentPage
//                currentPage : 8,
//                currentSize : 2,
//                totalNum : 48,
//                totalPage : 12
            }
            $.extend(data,info);
            //当前为首页
            if(data.currentPage==1){
                data.prevClass = "disabled";
            }
            //当前为末页
            if(data.totalPage==data.currentPage){
                data.nextClass = "disabled";
            }
            // 定义组件
            var page = Vue.extend({
                template:
                    '<aside>显示1到{{totalNum}}的{{currentSize}}个条目</aside>'+
                    '<ul>'+
                        '<li class="" v-on:click=""><input class="pageNumber" v-model="number" /></li>'+
                        '<li class="prev" v-on:click="(number != currentPage)&&(number <= totalPage)&&changePage(number)">跳转</li>'+
                        '<li class="prev {{prevClass}}" v-on:click="!prevClass&&changePage(currentPage-1)"><i class="icon">&#xe62e;</i>{{prev}}</li>'+
                        '<li v-for="page in pages" class="{{page.active}} {{page.omit}}" v-on:click="(!page.active&&!page.omit)&&changePage(page.num)">{{page.num}}</li>'+
                        '<li v-on:click="!nextClass&&changePage(currentPage+1)" class="next {{nextClass}}"><i class="icon">&#xe611;</i>{{next}}</li>'+
                    '</ul>', 
                data: function(){
                    return data 
                },
                methods:{
                    //改变页码
                    changePage : function(num){
                        if(num>0){
                            callback["changePage"](num-1);
                        }
                    },
                    //清楚输入框文字
                    clean : function(){
                        $(".searchVal").val("").focus();
                    }
                }
            })
            // 全局注册组件
            Vue.component('page', page);

        },
        //没有结果
        nothing : function(info){
            //数据集合
            info = info || {};
            var data = {
                searchVal : "",
                hints : [
                    { text : "请检查您的输入是否正确" },
                    { text : "请更换关键词重新搜索。" }
                ]
            }
            $.extend(data,info);
            // 定义组件
            var nothing = Vue.extend({
                template:
                    '<div v-if="!hide" class="box">'+
                        '<h4 v-if="searchVal" class="caption">很抱歉，没有找到与“<span class="warningColor">{{searchVal}}</span>”相关的内容。</h4>'+
                        '<h4 v-if="!searchVal" class="caption"><span class="warningColor">{{question||"很抱歉，没有相关的内容。"}}</span></h4>'+
                        '<dl>' +
                            '<dt v-if="hints.length">温馨提示：</dt>'+
                            '<dd v-for="info in hints">{{info.text}}</dd>'+
                        '</dl>'+
                    '</div>', 
                data: function(){
                    return data
                },
                created : function(){
                    //延时展示
                    this.delayedShow&&this.show();
                }, 
                methods : {
                    //延时展示 
                    show : function(){
                        var self = this;  
                        var time = setTimeout(function(){
                            //删除正在加载中
                            Tool.removeLoadding([],info.removeLoadding);
                            self.hide = "";
                        },self.delayedTime||250000);
                    }
                }
            })
            // 全局注册组件
            Vue.component('nothing', nothing);
        },
        //重置密码
        resetPasswordModal : function(info){
            //数据集合
            info = info || {};
            var data = {
                show : "",
                hint : "<b>密码重置成功</b>新密码默认为123456",
                num : 5
            }
            $.extend(data,info);
            // 定义组件
            var resetPasswordModal = Vue.extend({
                template:
                    '<div class="modal modal-resetPassword hide {{show}}">'+
                        '<i class="bg"></i>'+
                        '<div class="center-box">'+
                            '<!--重置密码-->'+
                            '<div class="box reset-password">'+
                                '<i class="icon modal-close icon-close" v-on:click="hide" >&#xe607;</i>'+
                                '<!--提示-->'+
                                '<div class="reset-success">'+
                                    '<i class="icon icon-success">&#xe60a;</i>'+
                                    '<div class="hint">{{{hint}}}</div>'+
                                '</div>'+
                                '<div class="footer-modal">({{num}}秒后自动关闭此窗口)</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>',
                data: function(){
                    return data
                },
                created : function(){
                    var self = this;
                    //倒计时
                    var time = setInterval(function(){
                        if(!self.num){
                            self.show = "";
                            clearInterval(time);
                        }else{
                            self.num--;
                        }
                    },1000);
                    self.show = "show";
                },
                //事件
                methods : {
                    //添加角色
                    hide : function(){
                        this.show = "";
                    }
                }
            });
            // 全局注册组件
            Vue.component('resetpasswordmodal', resetPasswordModal);

        },
        //分类
        category : function(info,callback){
            //数据集合
            info = info || {};
            var data = {
                list : info.list||[
                    { text : "全部分类" ,active:"active"},
                    { text : "空气复原机"  ,active:""},
                    { text : "滤网"  ,active:""},
                    { text : "检测仪"  ,active:""}
                ]
            }
            $.extend(data,info);
            // 定义组件
            var category = Vue.extend({
                template:
                    '<ul>'+
                        '<li v-for="val in list" class="{{val.active}}" v-on:click="select($index,val)">{{val.text}}</li>'+
                    '</ul>',
                data: function(){
                    return data;
                },
                methods : {
                    //选中列表
                    select : function(index,val){
                        //取消选中
                        this.cancelActive();
                        this.list[index].active = "active";
                        //选中返回
                        if(callback){
                            callback["select"](val,this);
                        }
                    },
                    //取消选中
                    cancelActive : function(){
                        for(var i=0;i<this.list.length;i++){ 
                            this.list[i].active = "";
                        }
                    }
                }
            })
            // 全局注册组件
            Vue.component('category', category);
        },
        //加载数据中
        loaddinginfo : function(info){
            //数据集合
            info = info || {};
            var data = {
                img : '<img src="/images/public/loaddinginfo.gif"/>',
                text : "正在加载，请稍等..."
            }
            $.extend(data,info); 
            // 定义组件
            var loaddinginfo = Vue.extend({
                template:
                    '{{{img}}}<h5>{{text}}</h5>',
                data: function(){
                    return data;
                },
                methods : {
                    
                }
            })
            // 全局注册组件
            Vue.component('loaddinginfo', loaddinginfo);
        },
        //提示框
        alertbox  : function(info){
            //数据集合
            info = info || {};
            var data = {
                hint : "",
                statusShow : false,
                //状态
                status : {
                    show : false,
                    //错误
                    error : {
                        class : "warningColor",
                        icon : "&#xe612;"
                    },
                    //警告
                    warning : {
                        class : "primaryColor",
                        icon : "&#xe619;"
                    },
                    //成功
                    success : {
                        class : "openColor",
                        icon : "&#xe61a;"
                    },
                    //等待
                    loadding : {
                        class : "secondTextColor",
                        icon : "&#xe617;"
                    }
                },
                groupStatus : false,
                group : { 
                    submitText : "确定",
                    cancelText : "取消"
                }
            } 
            $.extend(data,info); 
            console.log(data);
            // 定义组件 
            var alertbox = Vue.extend({ 
                template:
                    '<div class="center-box">'+ 
                        '<i class="bg" v-on:click="clickBG"></i>'+
                        '<div class="box">'+  
                            '<i v-if="statusShow" class="icon mr5 main-icon {{status[statusShow].class}}">{{{status[statusShow].icon}}}</i>'+
                            '<span class="vm">{{hint}}</span>'+
                            '<div v-if="groupStatus" class="btn-group tl mt15">'+
                                '<input type="button" class="btn btn-success" value="{{group.submitText}}">'+
                                '<input type="button" class="btn btn-cancel" v-on:click="close" value="{{group.cancelText}}">'+
                            '</div>'+
                        '</div>'+ 
                    '</div>', 
                data: function(){  
                    return data;  
                },
                methods : {  
                    //点击背景   
                    clickBG : function(){
                        console.log(this.clickBGclose);
                        if(this.clickBGclose){
                            this.close();
                        }
                    }, 
                    //关闭 
                    close : function(){ 
                        var self = this;
                        $(self.box).animate({opacity:0},200,function(){
                            $(this).remove();
                        });
                    }
                }
            })
            // 全局注册组件
            Vue.component('alertbox', alertbox);
        },
    };
    
    return component;
});
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));
/**
 * @license RequireJS text 2.0.9 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/text for details
 */
/*jslint regexp: true */
/*global require, XMLHttpRequest, ActiveXObject,
  define, window, process, Packages,
  java, location, Components, FileUtils */

define('text',[],function () {
    
    var text, fs, Cc, Ci, xpcIsWindows,
        module = {},
        progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],
        xmlRegExp = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,
        bodyRegExp = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,
        hasLocation = typeof location !== 'undefined' && location.href,
        defaultProtocol = hasLocation && location.protocol && location.protocol.replace(/\:/, ''),
        defaultHostName = hasLocation && location.hostname,
        defaultPort = hasLocation && (location.port || undefined),
        buildMap = {},
        masterConfig = (module.config && module.config()) || {};

    text = {
        version: '2.0.9',

        strip: function (content) {
            //Strips <?xml ...?> declarations so that external SVG and XML
            //documents can be added to a document without worry. Also, if the string
            //is an HTML document, only the part inside the body tag is returned.
            if (content) {
                content = content.replace(xmlRegExp, "");
                var matches = content.match(bodyRegExp);
                if (matches) {
                    content = matches[1];
                }
            } else {
                content = "";
            }
            return content;
        },

        jsEscape: function (content) {
            return content.replace(/(['\\])/g, '\\$1')
                .replace(/[\f]/g, "\\f")
                .replace(/[\b]/g, "\\b")
                .replace(/[\n]/g, "\\n")
                .replace(/[\t]/g, "\\t")
                .replace(/[\r]/g, "\\r")
                .replace(/[\u2028]/g, "\\u2028")
                .replace(/[\u2029]/g, "\\u2029");
        },

        createXhr: masterConfig.createXhr || function () {
            //Would love to dump the ActiveX crap in here. Need IE 6 to die first.
            var xhr, i, progId;
            if (typeof XMLHttpRequest !== "undefined") {
                return new XMLHttpRequest();
            } else if (typeof ActiveXObject !== "undefined") {
                for (i = 0; i < 3; i += 1) {
                    progId = progIds[i];
                    try {
                        xhr = new ActiveXObject(progId);
                    } catch (e) {}

                    if (xhr) {
                        progIds = [progId];  // so faster next time
                        break;
                    }
                }
            }

            return xhr;
        },

        /**
         * Parses a resource name into its component parts. Resource names
         * look like: module/name.ext!strip, where the !strip part is
         * optional.
         * @param {String} name the resource name
         * @returns {Object} with properties "moduleName", "ext" and "strip"
         * where strip is a boolean.
         */
        parseName: function (name) {
            var modName, ext, temp,
                strip = false,
                index = name.indexOf("."),
                isRelative = name.indexOf('./') === 0 ||
                             name.indexOf('../') === 0;

            if (index !== -1 && (!isRelative || index > 1)) {
                modName = name.substring(0, index);
                ext = name.substring(index + 1, name.length);
            } else {
                modName = name;
            }

            temp = ext || modName;
            index = temp.indexOf("!");
            if (index !== -1) {
                //Pull off the strip arg.
                strip = temp.substring(index + 1) === "strip";
                temp = temp.substring(0, index);
                if (ext) {
                    ext = temp;
                } else {
                    modName = temp;
                }
            }

            return {
                moduleName: modName,
                ext: ext,
                strip: strip
            };
        },

        xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,
        
        useCrossHTML: function(url){
            if(url.indexOf('.html') > -1){
                return true;
            }
            return false;
        },

        /**
         * Is an URL on another domain. Only works for browser use, returns
         * false in non-browser environments. Only used to know if an
         * optimized .js version of a text resource should be loaded
         * instead.
         * @param {String} url
         * @returns Boolean
         */
        useXhr: function (url, protocol, hostname, port) {
            var uProtocol, uHostName, uPort,
                match = text.xdRegExp.exec(url);
            if (!match) {
                return true;
            }
            uProtocol = match[2];
            uHostName = match[3];

            uHostName = uHostName.split(':');
            uPort = uHostName[1];
            uHostName = uHostName[0];

            return (!uProtocol || uProtocol === protocol) &&
                   (!uHostName || uHostName.toLowerCase() === hostname.toLowerCase()) &&
                   ((!uPort && !uHostName) || uPort === port);
        },

        finishLoad: function (name, strip, content, onLoad) {
            content = strip ? text.strip(content) : content;
            if (masterConfig.isBuild) {
                buildMap[name] = content;
            }
            onLoad(content);
        },

        load: function (name, req, onLoad, config) {
            //Name has format: some.module.filext!strip
            //The strip part is optional.
            //if strip is present, then that means only get the string contents
            //inside a body tag in an HTML string. For XML/SVG content it means
            //removing the <?xml ...?> declarations so the content can be inserted
            //into the current doc without problems.

            // Do not bother with the work if a build and text will
            // not be inlined.
            
            if (config.isBuild && !config.inlineText) {
                onLoad();
                return;
            }

            masterConfig.isBuild = config.isBuild;

            var parsed = text.parseName(name),
                nonStripName = parsed.moduleName +
                    (parsed.ext ? '.' + parsed.ext : ''),
                url = req.toUrl(nonStripName),
                useXhr = (masterConfig.useXhr) ||
                         text.useXhr;

            //Load the text. Use XHR if possible and in a browser.
            if (!hasLocation || useXhr(url, defaultProtocol, defaultHostName, defaultPort)) {
                text.get(url, function (content) {
                    text.finishLoad(name, parsed.strip, content, onLoad);
                }, function (err) {
                    if (onLoad.error) {
                        onLoad.error(err);
                    }
                });
            } else if(text.useCrossHTML(url)){
                htmlLoad(url, function(content){
                   text.finishLoad(parsed.moduleName + '.' + parsed.ext,
                                    parsed.strip, content.content, onLoad); 
                })
                
            }else{
                //Need to fetch the resource across domains. Assume
                //the resource has been optimized into a JS module. Fetch
                //by the module name + extension, but do not include the
                //!strip part to avoid file system issues.
                req([nonStripName], function (content) {
                    text.finishLoad(parsed.moduleName + '.' + parsed.ext,
                                    parsed.strip, content, onLoad);
                });
            }
        },

        write: function (pluginName, moduleName, write, config) {
            if (buildMap.hasOwnProperty(moduleName)) {
                var content = text.jsEscape(buildMap[moduleName]);
                write.asModule(pluginName + "!" + moduleName,
                               "define(function () { return '" +
                                   content +
                               "';});\n");
            }
        },

        writeFile: function (pluginName, moduleName, req, write, config) {
            var parsed = text.parseName(moduleName),
                extPart = parsed.ext ? '.' + parsed.ext : '',
                nonStripName = parsed.moduleName + extPart,
                //Use a '.js' file name so that it indicates it is a
                //script that can be loaded across domains.
                fileName = req.toUrl(parsed.moduleName + extPart) + '.js';

            //Leverage own load() method to load plugin value, but only
            //write out values that do not have the strip argument,
            //to avoid any potential issues with ! in file names.
            text.load(nonStripName, req, function (value) {
                //Use own write() method to construct full module value.
                //But need to create shell that translates writeFile's
                //write() to the right interface.
                var textWrite = function (contents) {
                    return write(fileName, contents);
                };
                textWrite.asModule = function (moduleName, contents) {
                    return write.asModule(moduleName, fileName, contents);
                };

                text.write(pluginName, nonStripName, textWrite, config);
            }, config);
        }
    };
    
    // <link> load method
   var htmlLoad = function(url, callback) {
       // require(['Infrastructure'], function(Infrastructure){
       //     Infrastructure.alinkSDK.getRemoteContent(url, callback);
       // })
        
    }

    if (masterConfig.env === 'node' || (!masterConfig.env &&
            typeof process !== "undefined" &&
            process.versions &&
            !!process.versions.node &&
            !process.versions['node-webkit'])) {
        //Using special require.nodeRequire, something added by r.js.
        fs = require.nodeRequire('fs');

        text.get = function (url, callback, errback) {
            try {
                var file = fs.readFileSync(url, 'utf8');
                //Remove BOM (Byte Mark Order) from utf8 files if it is there.
                if (file.indexOf('\uFEFF') === 0) {
                    file = file.substring(1);
                }
                callback(file);
            } catch (e) {
                errback(e);
            }
        };
    } else if (masterConfig.env === 'xhr' || (!masterConfig.env &&
            text.createXhr())) {
        text.get = function (url, callback, errback, headers) {
            var xhr = text.createXhr(), header;
            xhr.open('GET', url, true);

            //Allow plugins direct access to xhr headers
            if (headers) {
                for (header in headers) {
                    if (headers.hasOwnProperty(header)) {
                        xhr.setRequestHeader(header.toLowerCase(), headers[header]);
                    }
                }
            }

            //Allow overrides specified in config
            if (masterConfig.onXhr) {
                masterConfig.onXhr(xhr, url);
            }

            xhr.onreadystatechange = function (evt) {
                var status, err;
                //Do not explicitly handle errors, those should be
                //visible via console output in the browser.
                if (xhr.readyState === 4) {
                    status = xhr.status;
                    if (status > 399 && status < 600) {
                        //An http 4xx or 5xx error. Signal an error.
                        err = new Error(url + ' HTTP status: ' + status);
                        err.xhr = xhr;
                        errback(err);
                    } else {
                        callback(xhr.responseText);
                    }

                    if (masterConfig.onXhrComplete) {
                        masterConfig.onXhrComplete(xhr, url);
                    }
                }
            };
            xhr.send(null);
        };
    } else if (masterConfig.env === 'rhino' || (!masterConfig.env &&
            typeof Packages !== 'undefined' && typeof java !== 'undefined')) {
        //Why Java, why is this so awkward?
        text.get = function (url, callback) {
            var stringBuffer, line,
                encoding = "utf-8",
                file = new java.io.File(url),
                lineSeparator = java.lang.System.getProperty("line.separator"),
                input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), encoding)),
                content = '';
            try {
                stringBuffer = new java.lang.StringBuffer();
                line = input.readLine();

                // Byte Order Mark (BOM) - The Unicode Standard, version 3.0, page 324
                // http://www.unicode.org/faq/utf_bom.html

                // Note that when we use utf-8, the BOM should appear as "EF BB BF", but it doesn't due to this bug in the JDK:
                // http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=4508058
                if (line && line.length() && line.charAt(0) === 0xfeff) {
                    // Eat the BOM, since we've already found the encoding on this file,
                    // and we plan to concatenating this buffer with others; the BOM should
                    // only appear at the top of a file.
                    line = line.substring(1);
                }

                if (line !== null) {
                    stringBuffer.append(line);
                }

                while ((line = input.readLine()) !== null) {
                    stringBuffer.append(lineSeparator);
                    stringBuffer.append(line);
                }
                //Make sure we return a JavaScript string and not a Java string.
                content = String(stringBuffer.toString()); //String
            } finally {
                input.close();
            }
            callback(content);
        };
    } else if (masterConfig.env === 'xpconnect' || (!masterConfig.env &&
            typeof Components !== 'undefined' && Components.classes &&
            Components.interfaces)) {
        //Avert your gaze!
        Cc = Components.classes,
        Ci = Components.interfaces;
        Components.utils['import']('resource://gre/modules/FileUtils.jsm');
        xpcIsWindows = ('@mozilla.org/windows-registry-key;1' in Cc);

        text.get = function (url, callback) {
            var inStream, convertStream, fileObj,
                readData = {};

            if (xpcIsWindows) {
                url = url.replace(/\//g, '\\');
            }

            fileObj = new FileUtils.File(url);

            //XPCOM, you so crazy
            try {
                inStream = Cc['@mozilla.org/network/file-input-stream;1']
                           .createInstance(Ci.nsIFileInputStream);
                inStream.init(fileObj, 1, 0, false);

                convertStream = Cc['@mozilla.org/intl/converter-input-stream;1']
                                .createInstance(Ci.nsIConverterInputStream);
                convertStream.init(inStream, "utf-8", inStream.available(),
                Ci.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);

                convertStream.readString(inStream.available(), readData);
                convertStream.close();
                inStream.close();
                callback(readData.value);
            } catch (e) {
                throw new Error((fileObj && fileObj.path || '') + ': ' + e);
            }
        };
    }
    return text;
});
/*! jQuery v1.11.3 | (c) 2005, 2015 jQuery Foundation, Inc. | jquery.org/license */
!function(a,b){"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){var c=[],d=c.slice,e=c.concat,f=c.push,g=c.indexOf,h={},i=h.toString,j=h.hasOwnProperty,k={},l="1.11.3",m=function(a,b){return new m.fn.init(a,b)},n=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,o=/^-ms-/,p=/-([\da-z])/gi,q=function(a,b){return b.toUpperCase()};m.fn=m.prototype={jquery:l,constructor:m,selector:"",length:0,toArray:function(){return d.call(this)},get:function(a){return null!=a?0>a?this[a+this.length]:this[a]:d.call(this)},pushStack:function(a){var b=m.merge(this.constructor(),a);return b.prevObject=this,b.context=this.context,b},each:function(a,b){return m.each(this,a,b)},map:function(a){return this.pushStack(m.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(d.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(0>a?b:0);return this.pushStack(c>=0&&b>c?[this[c]]:[])},end:function(){return this.prevObject||this.constructor(null)},push:f,sort:c.sort,splice:c.splice},m.extend=m.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||m.isFunction(g)||(g={}),h===i&&(g=this,h--);i>h;h++)if(null!=(e=arguments[h]))for(d in e)a=g[d],c=e[d],g!==c&&(j&&c&&(m.isPlainObject(c)||(b=m.isArray(c)))?(b?(b=!1,f=a&&m.isArray(a)?a:[]):f=a&&m.isPlainObject(a)?a:{},g[d]=m.extend(j,f,c)):void 0!==c&&(g[d]=c));return g},m.extend({expando:"jQuery"+(l+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===m.type(a)},isArray:Array.isArray||function(a){return"array"===m.type(a)},isWindow:function(a){return null!=a&&a==a.window},isNumeric:function(a){return!m.isArray(a)&&a-parseFloat(a)+1>=0},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},isPlainObject:function(a){var b;if(!a||"object"!==m.type(a)||a.nodeType||m.isWindow(a))return!1;try{if(a.constructor&&!j.call(a,"constructor")&&!j.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}if(k.ownLast)for(b in a)return j.call(a,b);for(b in a);return void 0===b||j.call(a,b)},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?h[i.call(a)]||"object":typeof a},globalEval:function(b){b&&m.trim(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(o,"ms-").replace(p,q)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b,c){var d,e=0,f=a.length,g=r(a);if(c){if(g){for(;f>e;e++)if(d=b.apply(a[e],c),d===!1)break}else for(e in a)if(d=b.apply(a[e],c),d===!1)break}else if(g){for(;f>e;e++)if(d=b.call(a[e],e,a[e]),d===!1)break}else for(e in a)if(d=b.call(a[e],e,a[e]),d===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(n,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(r(Object(a))?m.merge(c,"string"==typeof a?[a]:a):f.call(c,a)),c},inArray:function(a,b,c){var d;if(b){if(g)return g.call(b,a,c);for(d=b.length,c=c?0>c?Math.max(0,d+c):c:0;d>c;c++)if(c in b&&b[c]===a)return c}return-1},merge:function(a,b){var c=+b.length,d=0,e=a.length;while(c>d)a[e++]=b[d++];if(c!==c)while(void 0!==b[d])a[e++]=b[d++];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;g>f;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,f=0,g=a.length,h=r(a),i=[];if(h)for(;g>f;f++)d=b(a[f],f,c),null!=d&&i.push(d);else for(f in a)d=b(a[f],f,c),null!=d&&i.push(d);return e.apply([],i)},guid:1,proxy:function(a,b){var c,e,f;return"string"==typeof b&&(f=a[b],b=a,a=f),m.isFunction(a)?(c=d.call(arguments,2),e=function(){return a.apply(b||this,c.concat(d.call(arguments)))},e.guid=a.guid=a.guid||m.guid++,e):void 0},now:function(){return+new Date},support:k}),m.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(a,b){h["[object "+b+"]"]=b.toLowerCase()});function r(a){var b="length"in a&&a.length,c=m.type(a);return"function"===c||m.isWindow(a)?!1:1===a.nodeType&&b?!0:"array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a}var s=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+1*new Date,v=a.document,w=0,x=0,y=ha(),z=ha(),A=ha(),B=function(a,b){return a===b&&(l=!0),0},C=1<<31,D={}.hasOwnProperty,E=[],F=E.pop,G=E.push,H=E.push,I=E.slice,J=function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return c;return-1},K="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",L="[\\x20\\t\\r\\n\\f]",M="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",N=M.replace("w","w#"),O="\\["+L+"*("+M+")(?:"+L+"*([*^$|!~]?=)"+L+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+N+"))|)"+L+"*\\]",P=":("+M+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+O+")*)|.*)\\)|)",Q=new RegExp(L+"+","g"),R=new RegExp("^"+L+"+|((?:^|[^\\\\])(?:\\\\.)*)"+L+"+$","g"),S=new RegExp("^"+L+"*,"+L+"*"),T=new RegExp("^"+L+"*([>+~]|"+L+")"+L+"*"),U=new RegExp("="+L+"*([^\\]'\"]*?)"+L+"*\\]","g"),V=new RegExp(P),W=new RegExp("^"+N+"$"),X={ID:new RegExp("^#("+M+")"),CLASS:new RegExp("^\\.("+M+")"),TAG:new RegExp("^("+M.replace("w","w*")+")"),ATTR:new RegExp("^"+O),PSEUDO:new RegExp("^"+P),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+L+"*(even|odd|(([+-]|)(\\d*)n|)"+L+"*(?:([+-]|)"+L+"*(\\d+)|))"+L+"*\\)|)","i"),bool:new RegExp("^(?:"+K+")$","i"),needsContext:new RegExp("^"+L+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+L+"*((?:-\\d)?\\d*)"+L+"*\\)|)(?=[^-]|$)","i")},Y=/^(?:input|select|textarea|button)$/i,Z=/^h\d$/i,$=/^[^{]+\{\s*\[native \w/,_=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,aa=/[+~]/,ba=/'|\\/g,ca=new RegExp("\\\\([\\da-f]{1,6}"+L+"?|("+L+")|.)","ig"),da=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:0>d?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},ea=function(){m()};try{H.apply(E=I.call(v.childNodes),v.childNodes),E[v.childNodes.length].nodeType}catch(fa){H={apply:E.length?function(a,b){G.apply(a,I.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function ga(a,b,d,e){var f,h,j,k,l,o,r,s,w,x;if((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,d=d||[],k=b.nodeType,"string"!=typeof a||!a||1!==k&&9!==k&&11!==k)return d;if(!e&&p){if(11!==k&&(f=_.exec(a)))if(j=f[1]){if(9===k){if(h=b.getElementById(j),!h||!h.parentNode)return d;if(h.id===j)return d.push(h),d}else if(b.ownerDocument&&(h=b.ownerDocument.getElementById(j))&&t(b,h)&&h.id===j)return d.push(h),d}else{if(f[2])return H.apply(d,b.getElementsByTagName(a)),d;if((j=f[3])&&c.getElementsByClassName)return H.apply(d,b.getElementsByClassName(j)),d}if(c.qsa&&(!q||!q.test(a))){if(s=r=u,w=b,x=1!==k&&a,1===k&&"object"!==b.nodeName.toLowerCase()){o=g(a),(r=b.getAttribute("id"))?s=r.replace(ba,"\\$&"):b.setAttribute("id",s),s="[id='"+s+"'] ",l=o.length;while(l--)o[l]=s+ra(o[l]);w=aa.test(a)&&pa(b.parentNode)||b,x=o.join(",")}if(x)try{return H.apply(d,w.querySelectorAll(x)),d}catch(y){}finally{r||b.removeAttribute("id")}}}return i(a.replace(R,"$1"),b,d,e)}function ha(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function ia(a){return a[u]=!0,a}function ja(a){var b=n.createElement("div");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function ka(a,b){var c=a.split("|"),e=a.length;while(e--)d.attrHandle[c[e]]=b}function la(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||C)-(~a.sourceIndex||C);if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function ma(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function na(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function oa(a){return ia(function(b){return b=+b,ia(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function pa(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}c=ga.support={},f=ga.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?"HTML"!==b.nodeName:!1},m=ga.setDocument=function(a){var b,e,g=a?a.ownerDocument||a:v;return g!==n&&9===g.nodeType&&g.documentElement?(n=g,o=g.documentElement,e=g.defaultView,e&&e!==e.top&&(e.addEventListener?e.addEventListener("unload",ea,!1):e.attachEvent&&e.attachEvent("onunload",ea)),p=!f(g),c.attributes=ja(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=ja(function(a){return a.appendChild(g.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=$.test(g.getElementsByClassName),c.getById=ja(function(a){return o.appendChild(a).id=u,!g.getElementsByName||!g.getElementsByName(u).length}),c.getById?(d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c=b.getElementById(a);return c&&c.parentNode?[c]:[]}},d.filter.ID=function(a){var b=a.replace(ca,da);return function(a){return a.getAttribute("id")===b}}):(delete d.find.ID,d.filter.ID=function(a){var b=a.replace(ca,da);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}}),d.find.TAG=c.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):c.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){return p?b.getElementsByClassName(a):void 0},r=[],q=[],(c.qsa=$.test(g.querySelectorAll))&&(ja(function(a){o.appendChild(a).innerHTML="<a id='"+u+"'></a><select id='"+u+"-\f]' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+L+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+L+"*(?:value|"+K+")"),a.querySelectorAll("[id~="+u+"-]").length||q.push("~="),a.querySelectorAll(":checked").length||q.push(":checked"),a.querySelectorAll("a#"+u+"+*").length||q.push(".#.+[+~]")}),ja(function(a){var b=g.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+L+"*[*^$|!~]?="),a.querySelectorAll(":enabled").length||q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=$.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&ja(function(a){c.disconnectedMatch=s.call(a,"div"),s.call(a,"[s!='']:x"),r.push("!=",P)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=$.test(o.compareDocumentPosition),t=b||$.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===g||a.ownerDocument===v&&t(v,a)?-1:b===g||b.ownerDocument===v&&t(v,b)?1:k?J(k,a)-J(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,e=a.parentNode,f=b.parentNode,h=[a],i=[b];if(!e||!f)return a===g?-1:b===g?1:e?-1:f?1:k?J(k,a)-J(k,b):0;if(e===f)return la(a,b);c=a;while(c=c.parentNode)h.unshift(c);c=b;while(c=c.parentNode)i.unshift(c);while(h[d]===i[d])d++;return d?la(h[d],i[d]):h[d]===v?-1:i[d]===v?1:0},g):n},ga.matches=function(a,b){return ga(a,null,null,b)},ga.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(U,"='$1']"),!(!c.matchesSelector||!p||r&&r.test(b)||q&&q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return ga(b,n,null,[a]).length>0},ga.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},ga.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&D.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},ga.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},ga.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=ga.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=ga.selectors={cacheLength:50,createPseudo:ia,match:X,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(ca,da),a[3]=(a[3]||a[4]||a[5]||"").replace(ca,da),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||ga.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&ga.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return X.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&V.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(ca,da).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+L+")"+a+"("+L+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=ga.attr(d,a);return null==e?"!="===b:b?(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e.replace(Q," ")+" ").indexOf(c)>-1:"|="===b?e===c||e.slice(0,c.length+1)===c+"-":!1):!0}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h;if(q){if(f){while(p){l=b;while(l=l[p])if(h?l.nodeName.toLowerCase()===r:1===l.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){k=q[u]||(q[u]={}),j=k[a]||[],n=j[0]===w&&j[1],m=j[0]===w&&j[2],l=n&&q.childNodes[n];while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if(1===l.nodeType&&++m&&l===b){k[a]=[w,n,m];break}}else if(s&&(j=(b[u]||(b[u]={}))[a])&&j[0]===w)m=j[1];else while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if((h?l.nodeName.toLowerCase()===r:1===l.nodeType)&&++m&&(s&&((l[u]||(l[u]={}))[a]=[w,m]),l===b))break;return m-=e,m===d||m%d===0&&m/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||ga.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?ia(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=J(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:ia(function(a){var b=[],c=[],d=h(a.replace(R,"$1"));return d[u]?ia(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),b[0]=null,!c.pop()}}),has:ia(function(a){return function(b){return ga(a,b).length>0}}),contains:ia(function(a){return a=a.replace(ca,da),function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:ia(function(a){return W.test(a||"")||ga.error("unsupported lang: "+a),a=a.replace(ca,da).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return Z.test(a.nodeName)},input:function(a){return Y.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:oa(function(){return[0]}),last:oa(function(a,b){return[b-1]}),eq:oa(function(a,b,c){return[0>c?c+b:c]}),even:oa(function(a,b){for(var c=0;b>c;c+=2)a.push(c);return a}),odd:oa(function(a,b){for(var c=1;b>c;c+=2)a.push(c);return a}),lt:oa(function(a,b,c){for(var d=0>c?c+b:c;--d>=0;)a.push(d);return a}),gt:oa(function(a,b,c){for(var d=0>c?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=ma(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=na(b);function qa(){}qa.prototype=d.filters=d.pseudos,d.setFilters=new qa,g=ga.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){(!c||(e=S.exec(h)))&&(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=T.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(R," ")}),h=h.slice(c.length));for(g in d.filter)!(e=X[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?ga.error(a):z(a,i).slice(0)};function ra(a){for(var b=0,c=a.length,d="";c>b;b++)d+=a[b].value;return d}function sa(a,b,c){var d=b.dir,e=c&&"parentNode"===d,f=x++;return b.first?function(b,c,f){while(b=b[d])if(1===b.nodeType||e)return a(b,c,f)}:function(b,c,g){var h,i,j=[w,f];if(g){while(b=b[d])if((1===b.nodeType||e)&&a(b,c,g))return!0}else while(b=b[d])if(1===b.nodeType||e){if(i=b[u]||(b[u]={}),(h=i[d])&&h[0]===w&&h[1]===f)return j[2]=h[2];if(i[d]=j,j[2]=a(b,c,g))return!0}}}function ta(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function ua(a,b,c){for(var d=0,e=b.length;e>d;d++)ga(a,b[d],c);return c}function va(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;i>h;h++)(f=a[h])&&(!c||c(f,d,e))&&(g.push(f),j&&b.push(h));return g}function wa(a,b,c,d,e,f){return d&&!d[u]&&(d=wa(d)),e&&!e[u]&&(e=wa(e,f)),ia(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||ua(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:va(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=va(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?J(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=va(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):H.apply(g,r)})}function xa(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=sa(function(a){return a===b},h,!0),l=sa(function(a){return J(b,a)>-1},h,!0),m=[function(a,c,d){var e=!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d));return b=null,e}];f>i;i++)if(c=d.relative[a[i].type])m=[sa(ta(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;f>e;e++)if(d.relative[a[e].type])break;return wa(i>1&&ta(m),i>1&&ra(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(R,"$1"),c,e>i&&xa(a.slice(i,e)),f>e&&xa(a=a.slice(e)),f>e&&ra(a))}m.push(c)}return ta(m)}function ya(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,m,o,p=0,q="0",r=f&&[],s=[],t=j,u=f||e&&d.find.TAG("*",k),v=w+=null==t?1:Math.random()||.1,x=u.length;for(k&&(j=g!==n&&g);q!==x&&null!=(l=u[q]);q++){if(e&&l){m=0;while(o=a[m++])if(o(l,g,h)){i.push(l);break}k&&(w=v)}c&&((l=!o&&l)&&p--,f&&r.push(l))}if(p+=q,c&&q!==p){m=0;while(o=b[m++])o(r,s,g,h);if(f){if(p>0)while(q--)r[q]||s[q]||(s[q]=F.call(i));s=va(s)}H.apply(i,s),k&&!f&&s.length>0&&p+b.length>1&&ga.uniqueSort(i)}return k&&(w=v,j=t),r};return c?ia(f):f}return h=ga.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=xa(b[c]),f[u]?d.push(f):e.push(f);f=A(a,ya(e,d)),f.selector=a}return f},i=ga.select=function(a,b,e,f){var i,j,k,l,m,n="function"==typeof a&&a,o=!f&&g(a=n.selector||a);if(e=e||[],1===o.length){if(j=o[0]=o[0].slice(0),j.length>2&&"ID"===(k=j[0]).type&&c.getById&&9===b.nodeType&&p&&d.relative[j[1].type]){if(b=(d.find.ID(k.matches[0].replace(ca,da),b)||[])[0],!b)return e;n&&(b=b.parentNode),a=a.slice(j.shift().value.length)}i=X.needsContext.test(a)?0:j.length;while(i--){if(k=j[i],d.relative[l=k.type])break;if((m=d.find[l])&&(f=m(k.matches[0].replace(ca,da),aa.test(j[0].type)&&pa(b.parentNode)||b))){if(j.splice(i,1),a=f.length&&ra(j),!a)return H.apply(e,f),e;break}}}return(n||h(a,o))(f,b,!p,e,aa.test(a)&&pa(b.parentNode)||b),e},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=ja(function(a){return 1&a.compareDocumentPosition(n.createElement("div"))}),ja(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||ka("type|href|height|width",function(a,b,c){return c?void 0:a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&ja(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||ka("value",function(a,b,c){return c||"input"!==a.nodeName.toLowerCase()?void 0:a.defaultValue}),ja(function(a){return null==a.getAttribute("disabled")})||ka(K,function(a,b,c){var d;return c?void 0:a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),ga}(a);m.find=s,m.expr=s.selectors,m.expr[":"]=m.expr.pseudos,m.unique=s.uniqueSort,m.text=s.getText,m.isXMLDoc=s.isXML,m.contains=s.contains;var t=m.expr.match.needsContext,u=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,v=/^.[^:#\[\.,]*$/;function w(a,b,c){if(m.isFunction(b))return m.grep(a,function(a,d){return!!b.call(a,d,a)!==c});if(b.nodeType)return m.grep(a,function(a){return a===b!==c});if("string"==typeof b){if(v.test(b))return m.filter(b,a,c);b=m.filter(b,a)}return m.grep(a,function(a){return m.inArray(a,b)>=0!==c})}m.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?m.find.matchesSelector(d,a)?[d]:[]:m.find.matches(a,m.grep(b,function(a){return 1===a.nodeType}))},m.fn.extend({find:function(a){var b,c=[],d=this,e=d.length;if("string"!=typeof a)return this.pushStack(m(a).filter(function(){for(b=0;e>b;b++)if(m.contains(d[b],this))return!0}));for(b=0;e>b;b++)m.find(a,d[b],c);return c=this.pushStack(e>1?m.unique(c):c),c.selector=this.selector?this.selector+" "+a:a,c},filter:function(a){return this.pushStack(w(this,a||[],!1))},not:function(a){return this.pushStack(w(this,a||[],!0))},is:function(a){return!!w(this,"string"==typeof a&&t.test(a)?m(a):a||[],!1).length}});var x,y=a.document,z=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,A=m.fn.init=function(a,b){var c,d;if(!a)return this;if("string"==typeof a){if(c="<"===a.charAt(0)&&">"===a.charAt(a.length-1)&&a.length>=3?[null,a,null]:z.exec(a),!c||!c[1]&&b)return!b||b.jquery?(b||x).find(a):this.constructor(b).find(a);if(c[1]){if(b=b instanceof m?b[0]:b,m.merge(this,m.parseHTML(c[1],b&&b.nodeType?b.ownerDocument||b:y,!0)),u.test(c[1])&&m.isPlainObject(b))for(c in b)m.isFunction(this[c])?this[c](b[c]):this.attr(c,b[c]);return this}if(d=y.getElementById(c[2]),d&&d.parentNode){if(d.id!==c[2])return x.find(a);this.length=1,this[0]=d}return this.context=y,this.selector=a,this}return a.nodeType?(this.context=this[0]=a,this.length=1,this):m.isFunction(a)?"undefined"!=typeof x.ready?x.ready(a):a(m):(void 0!==a.selector&&(this.selector=a.selector,this.context=a.context),m.makeArray(a,this))};A.prototype=m.fn,x=m(y);var B=/^(?:parents|prev(?:Until|All))/,C={children:!0,contents:!0,next:!0,prev:!0};m.extend({dir:function(a,b,c){var d=[],e=a[b];while(e&&9!==e.nodeType&&(void 0===c||1!==e.nodeType||!m(e).is(c)))1===e.nodeType&&d.push(e),e=e[b];return d},sibling:function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c}}),m.fn.extend({has:function(a){var b,c=m(a,this),d=c.length;return this.filter(function(){for(b=0;d>b;b++)if(m.contains(this,c[b]))return!0})},closest:function(a,b){for(var c,d=0,e=this.length,f=[],g=t.test(a)||"string"!=typeof a?m(a,b||this.context):0;e>d;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&m.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?m.unique(f):f)},index:function(a){return a?"string"==typeof a?m.inArray(this[0],m(a)):m.inArray(a.jquery?a[0]:a,this):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(m.unique(m.merge(this.get(),m(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function D(a,b){do a=a[b];while(a&&1!==a.nodeType);return a}m.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return m.dir(a,"parentNode")},parentsUntil:function(a,b,c){return m.dir(a,"parentNode",c)},next:function(a){return D(a,"nextSibling")},prev:function(a){return D(a,"previousSibling")},nextAll:function(a){return m.dir(a,"nextSibling")},prevAll:function(a){return m.dir(a,"previousSibling")},nextUntil:function(a,b,c){return m.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return m.dir(a,"previousSibling",c)},siblings:function(a){return m.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return m.sibling(a.firstChild)},contents:function(a){return m.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:m.merge([],a.childNodes)}},function(a,b){m.fn[a]=function(c,d){var e=m.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=m.filter(d,e)),this.length>1&&(C[a]||(e=m.unique(e)),B.test(a)&&(e=e.reverse())),this.pushStack(e)}});var E=/\S+/g,F={};function G(a){var b=F[a]={};return m.each(a.match(E)||[],function(a,c){b[c]=!0}),b}m.Callbacks=function(a){a="string"==typeof a?F[a]||G(a):m.extend({},a);var b,c,d,e,f,g,h=[],i=!a.once&&[],j=function(l){for(c=a.memory&&l,d=!0,f=g||0,g=0,e=h.length,b=!0;h&&e>f;f++)if(h[f].apply(l[0],l[1])===!1&&a.stopOnFalse){c=!1;break}b=!1,h&&(i?i.length&&j(i.shift()):c?h=[]:k.disable())},k={add:function(){if(h){var d=h.length;!function f(b){m.each(b,function(b,c){var d=m.type(c);"function"===d?a.unique&&k.has(c)||h.push(c):c&&c.length&&"string"!==d&&f(c)})}(arguments),b?e=h.length:c&&(g=d,j(c))}return this},remove:function(){return h&&m.each(arguments,function(a,c){var d;while((d=m.inArray(c,h,d))>-1)h.splice(d,1),b&&(e>=d&&e--,f>=d&&f--)}),this},has:function(a){return a?m.inArray(a,h)>-1:!(!h||!h.length)},empty:function(){return h=[],e=0,this},disable:function(){return h=i=c=void 0,this},disabled:function(){return!h},lock:function(){return i=void 0,c||k.disable(),this},locked:function(){return!i},fireWith:function(a,c){return!h||d&&!i||(c=c||[],c=[a,c.slice?c.slice():c],b?i.push(c):j(c)),this},fire:function(){return k.fireWith(this,arguments),this},fired:function(){return!!d}};return k},m.extend({Deferred:function(a){var b=[["resolve","done",m.Callbacks("once memory"),"resolved"],["reject","fail",m.Callbacks("once memory"),"rejected"],["notify","progress",m.Callbacks("memory")]],c="pending",d={state:function(){return c},always:function(){return e.done(arguments).fail(arguments),this},then:function(){var a=arguments;return m.Deferred(function(c){m.each(b,function(b,f){var g=m.isFunction(a[b])&&a[b];e[f[1]](function(){var a=g&&g.apply(this,arguments);a&&m.isFunction(a.promise)?a.promise().done(c.resolve).fail(c.reject).progress(c.notify):c[f[0]+"With"](this===d?c.promise():this,g?[a]:arguments)})}),a=null}).promise()},promise:function(a){return null!=a?m.extend(a,d):d}},e={};return d.pipe=d.then,m.each(b,function(a,f){var g=f[2],h=f[3];d[f[1]]=g.add,h&&g.add(function(){c=h},b[1^a][2].disable,b[2][2].lock),e[f[0]]=function(){return e[f[0]+"With"](this===e?d:this,arguments),this},e[f[0]+"With"]=g.fireWith}),d.promise(e),a&&a.call(e,e),e},when:function(a){var b=0,c=d.call(arguments),e=c.length,f=1!==e||a&&m.isFunction(a.promise)?e:0,g=1===f?a:m.Deferred(),h=function(a,b,c){return function(e){b[a]=this,c[a]=arguments.length>1?d.call(arguments):e,c===i?g.notifyWith(b,c):--f||g.resolveWith(b,c)}},i,j,k;if(e>1)for(i=new Array(e),j=new Array(e),k=new Array(e);e>b;b++)c[b]&&m.isFunction(c[b].promise)?c[b].promise().done(h(b,k,c)).fail(g.reject).progress(h(b,j,i)):--f;return f||g.resolveWith(k,c),g.promise()}});var H;m.fn.ready=function(a){return m.ready.promise().done(a),this},m.extend({isReady:!1,readyWait:1,holdReady:function(a){a?m.readyWait++:m.ready(!0)},ready:function(a){if(a===!0?!--m.readyWait:!m.isReady){if(!y.body)return setTimeout(m.ready);m.isReady=!0,a!==!0&&--m.readyWait>0||(H.resolveWith(y,[m]),m.fn.triggerHandler&&(m(y).triggerHandler("ready"),m(y).off("ready")))}}});function I(){y.addEventListener?(y.removeEventListener("DOMContentLoaded",J,!1),a.removeEventListener("load",J,!1)):(y.detachEvent("onreadystatechange",J),a.detachEvent("onload",J))}function J(){(y.addEventListener||"load"===event.type||"complete"===y.readyState)&&(I(),m.ready())}m.ready.promise=function(b){if(!H)if(H=m.Deferred(),"complete"===y.readyState)setTimeout(m.ready);else if(y.addEventListener)y.addEventListener("DOMContentLoaded",J,!1),a.addEventListener("load",J,!1);else{y.attachEvent("onreadystatechange",J),a.attachEvent("onload",J);var c=!1;try{c=null==a.frameElement&&y.documentElement}catch(d){}c&&c.doScroll&&!function e(){if(!m.isReady){try{c.doScroll("left")}catch(a){return setTimeout(e,50)}I(),m.ready()}}()}return H.promise(b)};var K="undefined",L;for(L in m(k))break;k.ownLast="0"!==L,k.inlineBlockNeedsLayout=!1,m(function(){var a,b,c,d;c=y.getElementsByTagName("body")[0],c&&c.style&&(b=y.createElement("div"),d=y.createElement("div"),d.style.cssText="position:absolute;border:0;width:0;height:0;top:0;left:-9999px",c.appendChild(d).appendChild(b),typeof b.style.zoom!==K&&(b.style.cssText="display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1",k.inlineBlockNeedsLayout=a=3===b.offsetWidth,a&&(c.style.zoom=1)),c.removeChild(d))}),function(){var a=y.createElement("div");if(null==k.deleteExpando){k.deleteExpando=!0;try{delete a.test}catch(b){k.deleteExpando=!1}}a=null}(),m.acceptData=function(a){var b=m.noData[(a.nodeName+" ").toLowerCase()],c=+a.nodeType||1;return 1!==c&&9!==c?!1:!b||b!==!0&&a.getAttribute("classid")===b};var M=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,N=/([A-Z])/g;function O(a,b,c){if(void 0===c&&1===a.nodeType){var d="data-"+b.replace(N,"-$1").toLowerCase();if(c=a.getAttribute(d),"string"==typeof c){try{c="true"===c?!0:"false"===c?!1:"null"===c?null:+c+""===c?+c:M.test(c)?m.parseJSON(c):c}catch(e){}m.data(a,b,c)}else c=void 0}return c}function P(a){var b;for(b in a)if(("data"!==b||!m.isEmptyObject(a[b]))&&"toJSON"!==b)return!1;

    return!0}function Q(a,b,d,e){if(m.acceptData(a)){var f,g,h=m.expando,i=a.nodeType,j=i?m.cache:a,k=i?a[h]:a[h]&&h;if(k&&j[k]&&(e||j[k].data)||void 0!==d||"string"!=typeof b)return k||(k=i?a[h]=c.pop()||m.guid++:h),j[k]||(j[k]=i?{}:{toJSON:m.noop}),("object"==typeof b||"function"==typeof b)&&(e?j[k]=m.extend(j[k],b):j[k].data=m.extend(j[k].data,b)),g=j[k],e||(g.data||(g.data={}),g=g.data),void 0!==d&&(g[m.camelCase(b)]=d),"string"==typeof b?(f=g[b],null==f&&(f=g[m.camelCase(b)])):f=g,f}}function R(a,b,c){if(m.acceptData(a)){var d,e,f=a.nodeType,g=f?m.cache:a,h=f?a[m.expando]:m.expando;if(g[h]){if(b&&(d=c?g[h]:g[h].data)){m.isArray(b)?b=b.concat(m.map(b,m.camelCase)):b in d?b=[b]:(b=m.camelCase(b),b=b in d?[b]:b.split(" ")),e=b.length;while(e--)delete d[b[e]];if(c?!P(d):!m.isEmptyObject(d))return}(c||(delete g[h].data,P(g[h])))&&(f?m.cleanData([a],!0):k.deleteExpando||g!=g.window?delete g[h]:g[h]=null)}}}m.extend({cache:{},noData:{"applet ":!0,"embed ":!0,"object ":"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"},hasData:function(a){return a=a.nodeType?m.cache[a[m.expando]]:a[m.expando],!!a&&!P(a)},data:function(a,b,c){return Q(a,b,c)},removeData:function(a,b){return R(a,b)},_data:function(a,b,c){return Q(a,b,c,!0)},_removeData:function(a,b){return R(a,b,!0)}}),m.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=m.data(f),1===f.nodeType&&!m._data(f,"parsedAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=m.camelCase(d.slice(5)),O(f,d,e[d])));m._data(f,"parsedAttrs",!0)}return e}return"object"==typeof a?this.each(function(){m.data(this,a)}):arguments.length>1?this.each(function(){m.data(this,a,b)}):f?O(f,a,m.data(f,a)):void 0},removeData:function(a){return this.each(function(){m.removeData(this,a)})}}),m.extend({queue:function(a,b,c){var d;return a?(b=(b||"fx")+"queue",d=m._data(a,b),c&&(!d||m.isArray(c)?d=m._data(a,b,m.makeArray(c)):d.push(c)),d||[]):void 0},dequeue:function(a,b){b=b||"fx";var c=m.queue(a,b),d=c.length,e=c.shift(),f=m._queueHooks(a,b),g=function(){m.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return m._data(a,c)||m._data(a,c,{empty:m.Callbacks("once memory").add(function(){m._removeData(a,b+"queue"),m._removeData(a,c)})})}}),m.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?m.queue(this[0],a):void 0===b?this:this.each(function(){var c=m.queue(this,a,b);m._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&m.dequeue(this,a)})},dequeue:function(a){return this.each(function(){m.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=m.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=m._data(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var S=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,T=["Top","Right","Bottom","Left"],U=function(a,b){return a=b||a,"none"===m.css(a,"display")||!m.contains(a.ownerDocument,a)},V=m.access=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===m.type(c)){e=!0;for(h in c)m.access(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,m.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(m(a),c)})),b))for(;i>h;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f},W=/^(?:checkbox|radio)$/i;!function(){var a=y.createElement("input"),b=y.createElement("div"),c=y.createDocumentFragment();if(b.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",k.leadingWhitespace=3===b.firstChild.nodeType,k.tbody=!b.getElementsByTagName("tbody").length,k.htmlSerialize=!!b.getElementsByTagName("link").length,k.html5Clone="<:nav></:nav>"!==y.createElement("nav").cloneNode(!0).outerHTML,a.type="checkbox",a.checked=!0,c.appendChild(a),k.appendChecked=a.checked,b.innerHTML="<textarea>x</textarea>",k.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue,c.appendChild(b),b.innerHTML="<input type='radio' checked='checked' name='t'/>",k.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,k.noCloneEvent=!0,b.attachEvent&&(b.attachEvent("onclick",function(){k.noCloneEvent=!1}),b.cloneNode(!0).click()),null==k.deleteExpando){k.deleteExpando=!0;try{delete b.test}catch(d){k.deleteExpando=!1}}}(),function(){var b,c,d=y.createElement("div");for(b in{submit:!0,change:!0,focusin:!0})c="on"+b,(k[b+"Bubbles"]=c in a)||(d.setAttribute(c,"t"),k[b+"Bubbles"]=d.attributes[c].expando===!1);d=null}();var X=/^(?:input|select|textarea)$/i,Y=/^key/,Z=/^(?:mouse|pointer|contextmenu)|click/,$=/^(?:focusinfocus|focusoutblur)$/,_=/^([^.]*)(?:\.(.+)|)$/;function aa(){return!0}function ba(){return!1}function ca(){try{return y.activeElement}catch(a){}}m.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,n,o,p,q,r=m._data(a);if(r){c.handler&&(i=c,c=i.handler,e=i.selector),c.guid||(c.guid=m.guid++),(g=r.events)||(g=r.events={}),(k=r.handle)||(k=r.handle=function(a){return typeof m===K||a&&m.event.triggered===a.type?void 0:m.event.dispatch.apply(k.elem,arguments)},k.elem=a),b=(b||"").match(E)||[""],h=b.length;while(h--)f=_.exec(b[h])||[],o=q=f[1],p=(f[2]||"").split(".").sort(),o&&(j=m.event.special[o]||{},o=(e?j.delegateType:j.bindType)||o,j=m.event.special[o]||{},l=m.extend({type:o,origType:q,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&m.expr.match.needsContext.test(e),namespace:p.join(".")},i),(n=g[o])||(n=g[o]=[],n.delegateCount=0,j.setup&&j.setup.call(a,d,p,k)!==!1||(a.addEventListener?a.addEventListener(o,k,!1):a.attachEvent&&a.attachEvent("on"+o,k))),j.add&&(j.add.call(a,l),l.handler.guid||(l.handler.guid=c.guid)),e?n.splice(n.delegateCount++,0,l):n.push(l),m.event.global[o]=!0);a=null}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,n,o,p,q,r=m.hasData(a)&&m._data(a);if(r&&(k=r.events)){b=(b||"").match(E)||[""],j=b.length;while(j--)if(h=_.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o){l=m.event.special[o]||{},o=(d?l.delegateType:l.bindType)||o,n=k[o]||[],h=h[2]&&new RegExp("(^|\\.)"+p.join("\\.(?:.*\\.|)")+"(\\.|$)"),i=f=n.length;while(f--)g=n[f],!e&&q!==g.origType||c&&c.guid!==g.guid||h&&!h.test(g.namespace)||d&&d!==g.selector&&("**"!==d||!g.selector)||(n.splice(f,1),g.selector&&n.delegateCount--,l.remove&&l.remove.call(a,g));i&&!n.length&&(l.teardown&&l.teardown.call(a,p,r.handle)!==!1||m.removeEvent(a,o,r.handle),delete k[o])}else for(o in k)m.event.remove(a,o+b[j],c,d,!0);m.isEmptyObject(k)&&(delete r.handle,m._removeData(a,"events"))}},trigger:function(b,c,d,e){var f,g,h,i,k,l,n,o=[d||y],p=j.call(b,"type")?b.type:b,q=j.call(b,"namespace")?b.namespace.split("."):[];if(h=l=d=d||y,3!==d.nodeType&&8!==d.nodeType&&!$.test(p+m.event.triggered)&&(p.indexOf(".")>=0&&(q=p.split("."),p=q.shift(),q.sort()),g=p.indexOf(":")<0&&"on"+p,b=b[m.expando]?b:new m.Event(p,"object"==typeof b&&b),b.isTrigger=e?2:3,b.namespace=q.join("."),b.namespace_re=b.namespace?new RegExp("(^|\\.)"+q.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=d),c=null==c?[b]:m.makeArray(c,[b]),k=m.event.special[p]||{},e||!k.trigger||k.trigger.apply(d,c)!==!1)){if(!e&&!k.noBubble&&!m.isWindow(d)){for(i=k.delegateType||p,$.test(i+p)||(h=h.parentNode);h;h=h.parentNode)o.push(h),l=h;l===(d.ownerDocument||y)&&o.push(l.defaultView||l.parentWindow||a)}n=0;while((h=o[n++])&&!b.isPropagationStopped())b.type=n>1?i:k.bindType||p,f=(m._data(h,"events")||{})[b.type]&&m._data(h,"handle"),f&&f.apply(h,c),f=g&&h[g],f&&f.apply&&m.acceptData(h)&&(b.result=f.apply(h,c),b.result===!1&&b.preventDefault());if(b.type=p,!e&&!b.isDefaultPrevented()&&(!k._default||k._default.apply(o.pop(),c)===!1)&&m.acceptData(d)&&g&&d[p]&&!m.isWindow(d)){l=d[g],l&&(d[g]=null),m.event.triggered=p;try{d[p]()}catch(r){}m.event.triggered=void 0,l&&(d[g]=l)}return b.result}},dispatch:function(a){a=m.event.fix(a);var b,c,e,f,g,h=[],i=d.call(arguments),j=(m._data(this,"events")||{})[a.type]||[],k=m.event.special[a.type]||{};if(i[0]=a,a.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,a)!==!1){h=m.event.handlers.call(this,a,j),b=0;while((f=h[b++])&&!a.isPropagationStopped()){a.currentTarget=f.elem,g=0;while((e=f.handlers[g++])&&!a.isImmediatePropagationStopped())(!a.namespace_re||a.namespace_re.test(e.namespace))&&(a.handleObj=e,a.data=e.data,c=((m.event.special[e.origType]||{}).handle||e.handler).apply(f.elem,i),void 0!==c&&(a.result=c)===!1&&(a.preventDefault(),a.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,a),a.result}},handlers:function(a,b){var c,d,e,f,g=[],h=b.delegateCount,i=a.target;if(h&&i.nodeType&&(!a.button||"click"!==a.type))for(;i!=this;i=i.parentNode||this)if(1===i.nodeType&&(i.disabled!==!0||"click"!==a.type)){for(e=[],f=0;h>f;f++)d=b[f],c=d.selector+" ",void 0===e[c]&&(e[c]=d.needsContext?m(c,this).index(i)>=0:m.find(c,this,null,[i]).length),e[c]&&e.push(d);e.length&&g.push({elem:i,handlers:e})}return h<b.length&&g.push({elem:this,handlers:b.slice(h)}),g},fix:function(a){if(a[m.expando])return a;var b,c,d,e=a.type,f=a,g=this.fixHooks[e];g||(this.fixHooks[e]=g=Z.test(e)?this.mouseHooks:Y.test(e)?this.keyHooks:{}),d=g.props?this.props.concat(g.props):this.props,a=new m.Event(f),b=d.length;while(b--)c=d[b],a[c]=f[c];return a.target||(a.target=f.srcElement||y),3===a.target.nodeType&&(a.target=a.target.parentNode),a.metaKey=!!a.metaKey,g.filter?g.filter(a,f):a},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){return null==a.which&&(a.which=null!=b.charCode?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,b){var c,d,e,f=b.button,g=b.fromElement;return null==a.pageX&&null!=b.clientX&&(d=a.target.ownerDocument||y,e=d.documentElement,c=d.body,a.pageX=b.clientX+(e&&e.scrollLeft||c&&c.scrollLeft||0)-(e&&e.clientLeft||c&&c.clientLeft||0),a.pageY=b.clientY+(e&&e.scrollTop||c&&c.scrollTop||0)-(e&&e.clientTop||c&&c.clientTop||0)),!a.relatedTarget&&g&&(a.relatedTarget=g===a.target?b.toElement:g),a.which||void 0===f||(a.which=1&f?1:2&f?3:4&f?2:0),a}},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==ca()&&this.focus)try{return this.focus(),!1}catch(a){}},delegateType:"focusin"},blur:{trigger:function(){return this===ca()&&this.blur?(this.blur(),!1):void 0},delegateType:"focusout"},click:{trigger:function(){return m.nodeName(this,"input")&&"checkbox"===this.type&&this.click?(this.click(),!1):void 0},_default:function(a){return m.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}},simulate:function(a,b,c,d){var e=m.extend(new m.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?m.event.trigger(e,null,b):m.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},m.removeEvent=y.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){var d="on"+b;a.detachEvent&&(typeof a[d]===K&&(a[d]=null),a.detachEvent(d,c))},m.Event=function(a,b){return this instanceof m.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?aa:ba):this.type=a,b&&m.extend(this,b),this.timeStamp=a&&a.timeStamp||m.now(),void(this[m.expando]=!0)):new m.Event(a,b)},m.Event.prototype={isDefaultPrevented:ba,isPropagationStopped:ba,isImmediatePropagationStopped:ba,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=aa,a&&(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=aa,a&&(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=aa,a&&a.stopImmediatePropagation&&a.stopImmediatePropagation(),this.stopPropagation()}},m.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){m.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return(!e||e!==d&&!m.contains(d,e))&&(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),k.submitBubbles||(m.event.special.submit={setup:function(){return m.nodeName(this,"form")?!1:void m.event.add(this,"click._submit keypress._submit",function(a){var b=a.target,c=m.nodeName(b,"input")||m.nodeName(b,"button")?b.form:void 0;c&&!m._data(c,"submitBubbles")&&(m.event.add(c,"submit._submit",function(a){a._submit_bubble=!0}),m._data(c,"submitBubbles",!0))})},postDispatch:function(a){a._submit_bubble&&(delete a._submit_bubble,this.parentNode&&!a.isTrigger&&m.event.simulate("submit",this.parentNode,a,!0))},teardown:function(){return m.nodeName(this,"form")?!1:void m.event.remove(this,"._submit")}}),k.changeBubbles||(m.event.special.change={setup:function(){return X.test(this.nodeName)?(("checkbox"===this.type||"radio"===this.type)&&(m.event.add(this,"propertychange._change",function(a){"checked"===a.originalEvent.propertyName&&(this._just_changed=!0)}),m.event.add(this,"click._change",function(a){this._just_changed&&!a.isTrigger&&(this._just_changed=!1),m.event.simulate("change",this,a,!0)})),!1):void m.event.add(this,"beforeactivate._change",function(a){var b=a.target;X.test(b.nodeName)&&!m._data(b,"changeBubbles")&&(m.event.add(b,"change._change",function(a){!this.parentNode||a.isSimulated||a.isTrigger||m.event.simulate("change",this.parentNode,a,!0)}),m._data(b,"changeBubbles",!0))})},handle:function(a){var b=a.target;return this!==b||a.isSimulated||a.isTrigger||"radio"!==b.type&&"checkbox"!==b.type?a.handleObj.handler.apply(this,arguments):void 0},teardown:function(){return m.event.remove(this,"._change"),!X.test(this.nodeName)}}),k.focusinBubbles||m.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){m.event.simulate(b,a.target,m.event.fix(a),!0)};m.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=m._data(d,b);e||d.addEventListener(a,c,!0),m._data(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=m._data(d,b)-1;e?m._data(d,b,e):(d.removeEventListener(a,c,!0),m._removeData(d,b))}}}),m.fn.extend({on:function(a,b,c,d,e){var f,g;if("object"==typeof a){"string"!=typeof b&&(c=c||b,b=void 0);for(f in a)this.on(f,b,c,a[f],e);return this}if(null==c&&null==d?(d=b,c=b=void 0):null==d&&("string"==typeof b?(d=c,c=void 0):(d=c,c=b,b=void 0)),d===!1)d=ba;else if(!d)return this;return 1===e&&(g=d,d=function(a){return m().off(a),g.apply(this,arguments)},d.guid=g.guid||(g.guid=m.guid++)),this.each(function(){m.event.add(this,a,d,c,b)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,m(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return(b===!1||"function"==typeof b)&&(c=b,b=void 0),c===!1&&(c=ba),this.each(function(){m.event.remove(this,a,c,b)})},trigger:function(a,b){return this.each(function(){m.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];return c?m.event.trigger(a,b,c,!0):void 0}});function da(a){var b=ea.split("|"),c=a.createDocumentFragment();if(c.createElement)while(b.length)c.createElement(b.pop());return c}var ea="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",fa=/ jQuery\d+="(?:null|\d+)"/g,ga=new RegExp("<(?:"+ea+")[\\s/>]","i"),ha=/^\s+/,ia=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,ja=/<([\w:]+)/,ka=/<tbody/i,la=/<|&#?\w+;/,ma=/<(?:script|style|link)/i,na=/checked\s*(?:[^=]|=\s*.checked.)/i,oa=/^$|\/(?:java|ecma)script/i,pa=/^true\/(.*)/,qa=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,ra={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],area:[1,"<map>","</map>"],param:[1,"<object>","</object>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:k.htmlSerialize?[0,"",""]:[1,"X<div>","</div>"]},sa=da(y),ta=sa.appendChild(y.createElement("div"));ra.optgroup=ra.option,ra.tbody=ra.tfoot=ra.colgroup=ra.caption=ra.thead,ra.th=ra.td;function ua(a,b){var c,d,e=0,f=typeof a.getElementsByTagName!==K?a.getElementsByTagName(b||"*"):typeof a.querySelectorAll!==K?a.querySelectorAll(b||"*"):void 0;if(!f)for(f=[],c=a.childNodes||a;null!=(d=c[e]);e++)!b||m.nodeName(d,b)?f.push(d):m.merge(f,ua(d,b));return void 0===b||b&&m.nodeName(a,b)?m.merge([a],f):f}function va(a){W.test(a.type)&&(a.defaultChecked=a.checked)}function wa(a,b){return m.nodeName(a,"table")&&m.nodeName(11!==b.nodeType?b:b.firstChild,"tr")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function xa(a){return a.type=(null!==m.find.attr(a,"type"))+"/"+a.type,a}function ya(a){var b=pa.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function za(a,b){for(var c,d=0;null!=(c=a[d]);d++)m._data(c,"globalEval",!b||m._data(b[d],"globalEval"))}function Aa(a,b){if(1===b.nodeType&&m.hasData(a)){var c,d,e,f=m._data(a),g=m._data(b,f),h=f.events;if(h){delete g.handle,g.events={};for(c in h)for(d=0,e=h[c].length;e>d;d++)m.event.add(b,c,h[c][d])}g.data&&(g.data=m.extend({},g.data))}}function Ba(a,b){var c,d,e;if(1===b.nodeType){if(c=b.nodeName.toLowerCase(),!k.noCloneEvent&&b[m.expando]){e=m._data(b);for(d in e.events)m.removeEvent(b,d,e.handle);b.removeAttribute(m.expando)}"script"===c&&b.text!==a.text?(xa(b).text=a.text,ya(b)):"object"===c?(b.parentNode&&(b.outerHTML=a.outerHTML),k.html5Clone&&a.innerHTML&&!m.trim(b.innerHTML)&&(b.innerHTML=a.innerHTML)):"input"===c&&W.test(a.type)?(b.defaultChecked=b.checked=a.checked,b.value!==a.value&&(b.value=a.value)):"option"===c?b.defaultSelected=b.selected=a.defaultSelected:("input"===c||"textarea"===c)&&(b.defaultValue=a.defaultValue)}}m.extend({clone:function(a,b,c){var d,e,f,g,h,i=m.contains(a.ownerDocument,a);if(k.html5Clone||m.isXMLDoc(a)||!ga.test("<"+a.nodeName+">")?f=a.cloneNode(!0):(ta.innerHTML=a.outerHTML,ta.removeChild(f=ta.firstChild)),!(k.noCloneEvent&&k.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||m.isXMLDoc(a)))for(d=ua(f),h=ua(a),g=0;null!=(e=h[g]);++g)d[g]&&Ba(e,d[g]);if(b)if(c)for(h=h||ua(a),d=d||ua(f),g=0;null!=(e=h[g]);g++)Aa(e,d[g]);else Aa(a,f);return d=ua(f,"script"),d.length>0&&za(d,!i&&ua(a,"script")),d=h=e=null,f},buildFragment:function(a,b,c,d){for(var e,f,g,h,i,j,l,n=a.length,o=da(b),p=[],q=0;n>q;q++)if(f=a[q],f||0===f)if("object"===m.type(f))m.merge(p,f.nodeType?[f]:f);else if(la.test(f)){h=h||o.appendChild(b.createElement("div")),i=(ja.exec(f)||["",""])[1].toLowerCase(),l=ra[i]||ra._default,h.innerHTML=l[1]+f.replace(ia,"<$1></$2>")+l[2],e=l[0];while(e--)h=h.lastChild;if(!k.leadingWhitespace&&ha.test(f)&&p.push(b.createTextNode(ha.exec(f)[0])),!k.tbody){f="table"!==i||ka.test(f)?"<table>"!==l[1]||ka.test(f)?0:h:h.firstChild,e=f&&f.childNodes.length;while(e--)m.nodeName(j=f.childNodes[e],"tbody")&&!j.childNodes.length&&f.removeChild(j)}m.merge(p,h.childNodes),h.textContent="";while(h.firstChild)h.removeChild(h.firstChild);h=o.lastChild}else p.push(b.createTextNode(f));h&&o.removeChild(h),k.appendChecked||m.grep(ua(p,"input"),va),q=0;while(f=p[q++])if((!d||-1===m.inArray(f,d))&&(g=m.contains(f.ownerDocument,f),h=ua(o.appendChild(f),"script"),g&&za(h),c)){e=0;while(f=h[e++])oa.test(f.type||"")&&c.push(f)}return h=null,o},cleanData:function(a,b){for(var d,e,f,g,h=0,i=m.expando,j=m.cache,l=k.deleteExpando,n=m.event.special;null!=(d=a[h]);h++)if((b||m.acceptData(d))&&(f=d[i],g=f&&j[f])){if(g.events)for(e in g.events)n[e]?m.event.remove(d,e):m.removeEvent(d,e,g.handle);j[f]&&(delete j[f],l?delete d[i]:typeof d.removeAttribute!==K?d.removeAttribute(i):d[i]=null,c.push(f))}}}),m.fn.extend({text:function(a){return V(this,function(a){return void 0===a?m.text(this):this.empty().append((this[0]&&this[0].ownerDocument||y).createTextNode(a))},null,a,arguments.length)},append:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=wa(this,a);b.appendChild(a)}})},prepend:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=wa(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},remove:function(a,b){for(var c,d=a?m.filter(a,this):this,e=0;null!=(c=d[e]);e++)b||1!==c.nodeType||m.cleanData(ua(c)),c.parentNode&&(b&&m.contains(c.ownerDocument,c)&&za(ua(c,"script")),c.parentNode.removeChild(c));return this},empty:function(){for(var a,b=0;null!=(a=this[b]);b++){1===a.nodeType&&m.cleanData(ua(a,!1));while(a.firstChild)a.removeChild(a.firstChild);a.options&&m.nodeName(a,"select")&&(a.options.length=0)}return this},clone:function(a,b){return a=null==a?!1:a,b=null==b?a:b,this.map(function(){return m.clone(this,a,b)})},html:function(a){return V(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a)return 1===b.nodeType?b.innerHTML.replace(fa,""):void 0;if(!("string"!=typeof a||ma.test(a)||!k.htmlSerialize&&ga.test(a)||!k.leadingWhitespace&&ha.test(a)||ra[(ja.exec(a)||["",""])[1].toLowerCase()])){a=a.replace(ia,"<$1></$2>");try{for(;d>c;c++)b=this[c]||{},1===b.nodeType&&(m.cleanData(ua(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=arguments[0];return this.domManip(arguments,function(b){a=this.parentNode,m.cleanData(ua(this)),a&&a.replaceChild(b,this)}),a&&(a.length||a.nodeType)?this:this.remove()},detach:function(a){return this.remove(a,!0)},domManip:function(a,b){a=e.apply([],a);var c,d,f,g,h,i,j=0,l=this.length,n=this,o=l-1,p=a[0],q=m.isFunction(p);if(q||l>1&&"string"==typeof p&&!k.checkClone&&na.test(p))return this.each(function(c){var d=n.eq(c);q&&(a[0]=p.call(this,c,d.html())),d.domManip(a,b)});if(l&&(i=m.buildFragment(a,this[0].ownerDocument,!1,this),c=i.firstChild,1===i.childNodes.length&&(i=c),c)){for(g=m.map(ua(i,"script"),xa),f=g.length;l>j;j++)d=i,j!==o&&(d=m.clone(d,!0,!0),f&&m.merge(g,ua(d,"script"))),b.call(this[j],d,j);if(f)for(h=g[g.length-1].ownerDocument,m.map(g,ya),j=0;f>j;j++)d=g[j],oa.test(d.type||"")&&!m._data(d,"globalEval")&&m.contains(h,d)&&(d.src?m._evalUrl&&m._evalUrl(d.src):m.globalEval((d.text||d.textContent||d.innerHTML||"").replace(qa,"")));i=c=null}return this}}),m.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){m.fn[a]=function(a){for(var c,d=0,e=[],g=m(a),h=g.length-1;h>=d;d++)c=d===h?this:this.clone(!0),m(g[d])[b](c),f.apply(e,c.get());return this.pushStack(e)}});var Ca,Da={};function Ea(b,c){var d,e=m(c.createElement(b)).appendTo(c.body),f=a.getDefaultComputedStyle&&(d=a.getDefaultComputedStyle(e[0]))?d.display:m.css(e[0],"display");return e.detach(),f}function Fa(a){var b=y,c=Da[a];return c||(c=Ea(a,b),"none"!==c&&c||(Ca=(Ca||m("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement),b=(Ca[0].contentWindow||Ca[0].contentDocument).document,b.write(),b.close(),c=Ea(a,b),Ca.detach()),Da[a]=c),c}!function(){var a;k.shrinkWrapBlocks=function(){if(null!=a)return a;a=!1;var b,c,d;return c=y.getElementsByTagName("body")[0],c&&c.style?(b=y.createElement("div"),d=y.createElement("div"),d.style.cssText="position:absolute;border:0;width:0;height:0;top:0;left:-9999px",c.appendChild(d).appendChild(b),typeof b.style.zoom!==K&&(b.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1",b.appendChild(y.createElement("div")).style.width="5px",a=3!==b.offsetWidth),c.removeChild(d),a):void 0}}();var Ga=/^margin/,Ha=new RegExp("^("+S+")(?!px)[a-z%]+$","i"),Ia,Ja,Ka=/^(top|right|bottom|left)$/;a.getComputedStyle?(Ia=function(b){return b.ownerDocument.defaultView.opener?b.ownerDocument.defaultView.getComputedStyle(b,null):a.getComputedStyle(b,null)},Ja=function(a,b,c){var d,e,f,g,h=a.style;return c=c||Ia(a),g=c?c.getPropertyValue(b)||c[b]:void 0,c&&(""!==g||m.contains(a.ownerDocument,a)||(g=m.style(a,b)),Ha.test(g)&&Ga.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f)),void 0===g?g:g+""}):y.documentElement.currentStyle&&(Ia=function(a){return a.currentStyle},Ja=function(a,b,c){var d,e,f,g,h=a.style;return c=c||Ia(a),g=c?c[b]:void 0,null==g&&h&&h[b]&&(g=h[b]),Ha.test(g)&&!Ka.test(b)&&(d=h.left,e=a.runtimeStyle,f=e&&e.left,f&&(e.left=a.currentStyle.left),h.left="fontSize"===b?"1em":g,g=h.pixelLeft+"px",h.left=d,f&&(e.left=f)),void 0===g?g:g+""||"auto"});function La(a,b){return{get:function(){var c=a();if(null!=c)return c?void delete this.get:(this.get=b).apply(this,arguments)}}}!function(){var b,c,d,e,f,g,h;if(b=y.createElement("div"),b.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",d=b.getElementsByTagName("a")[0],c=d&&d.style){c.cssText="float:left;opacity:.5",k.opacity="0.5"===c.opacity,k.cssFloat=!!c.cssFloat,b.style.backgroundClip="content-box",b.cloneNode(!0).style.backgroundClip="",k.clearCloneStyle="content-box"===b.style.backgroundClip,k.boxSizing=""===c.boxSizing||""===c.MozBoxSizing||""===c.WebkitBoxSizing,m.extend(k,{reliableHiddenOffsets:function(){return null==g&&i(),g},boxSizingReliable:function(){return null==f&&i(),f},pixelPosition:function(){return null==e&&i(),e},reliableMarginRight:function(){return null==h&&i(),h}});function i(){var b,c,d,i;c=y.getElementsByTagName("body")[0],c&&c.style&&(b=y.createElement("div"),d=y.createElement("div"),d.style.cssText="position:absolute;border:0;width:0;height:0;top:0;left:-9999px",c.appendChild(d).appendChild(b),b.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute",e=f=!1,h=!0,a.getComputedStyle&&(e="1%"!==(a.getComputedStyle(b,null)||{}).top,f="4px"===(a.getComputedStyle(b,null)||{width:"4px"}).width,i=b.appendChild(y.createElement("div")),i.style.cssText=b.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",i.style.marginRight=i.style.width="0",b.style.width="1px",h=!parseFloat((a.getComputedStyle(i,null)||{}).marginRight),b.removeChild(i)),b.innerHTML="<table><tr><td></td><td>t</td></tr></table>",i=b.getElementsByTagName("td"),i[0].style.cssText="margin:0;border:0;padding:0;display:none",g=0===i[0].offsetHeight,g&&(i[0].style.display="",i[1].style.display="none",g=0===i[0].offsetHeight),c.removeChild(d))}}}(),m.swap=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e};var Ma=/alpha\([^)]*\)/i,Na=/opacity\s*=\s*([^)]*)/,Oa=/^(none|table(?!-c[ea]).+)/,Pa=new RegExp("^("+S+")(.*)$","i"),Qa=new RegExp("^([+-])=("+S+")","i"),Ra={position:"absolute",visibility:"hidden",display:"block"},Sa={letterSpacing:"0",fontWeight:"400"},Ta=["Webkit","O","Moz","ms"];function Ua(a,b){if(b in a)return b;var c=b.charAt(0).toUpperCase()+b.slice(1),d=b,e=Ta.length;while(e--)if(b=Ta[e]+c,b in a)return b;return d}function Va(a,b){for(var c,d,e,f=[],g=0,h=a.length;h>g;g++)d=a[g],d.style&&(f[g]=m._data(d,"olddisplay"),c=d.style.display,b?(f[g]||"none"!==c||(d.style.display=""),""===d.style.display&&U(d)&&(f[g]=m._data(d,"olddisplay",Fa(d.nodeName)))):(e=U(d),(c&&"none"!==c||!e)&&m._data(d,"olddisplay",e?c:m.css(d,"display"))));for(g=0;h>g;g++)d=a[g],d.style&&(b&&"none"!==d.style.display&&""!==d.style.display||(d.style.display=b?f[g]||"":"none"));return a}function Wa(a,b,c){var d=Pa.exec(b);return d?Math.max(0,d[1]-(c||0))+(d[2]||"px"):b}function Xa(a,b,c,d,e){for(var f=c===(d?"border":"content")?4:"width"===b?1:0,g=0;4>f;f+=2)"margin"===c&&(g+=m.css(a,c+T[f],!0,e)),d?("content"===c&&(g-=m.css(a,"padding"+T[f],!0,e)),"margin"!==c&&(g-=m.css(a,"border"+T[f]+"Width",!0,e))):(g+=m.css(a,"padding"+T[f],!0,e),"padding"!==c&&(g+=m.css(a,"border"+T[f]+"Width",!0,e)));return g}function Ya(a,b,c){var d=!0,e="width"===b?a.offsetWidth:a.offsetHeight,f=Ia(a),g=k.boxSizing&&"border-box"===m.css(a,"boxSizing",!1,f);if(0>=e||null==e){if(e=Ja(a,b,f),(0>e||null==e)&&(e=a.style[b]),Ha.test(e))return e;d=g&&(k.boxSizingReliable()||e===a.style[b]),e=parseFloat(e)||0}return e+Xa(a,b,c||(g?"border":"content"),d,f)+"px"}m.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=Ja(a,"opacity");return""===c?"1":c}}}},cssNumber:{columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":k.cssFloat?"cssFloat":"styleFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=m.camelCase(b),i=a.style;if(b=m.cssProps[h]||(m.cssProps[h]=Ua(i,h)),g=m.cssHooks[b]||m.cssHooks[h],void 0===c)return g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:i[b];if(f=typeof c,"string"===f&&(e=Qa.exec(c))&&(c=(e[1]+1)*e[2]+parseFloat(m.css(a,b)),f="number"),null!=c&&c===c&&("number"!==f||m.cssNumber[h]||(c+="px"),k.clearCloneStyle||""!==c||0!==b.indexOf("background")||(i[b]="inherit"),!(g&&"set"in g&&void 0===(c=g.set(a,c,d)))))try{i[b]=c}catch(j){}}},css:function(a,b,c,d){var e,f,g,h=m.camelCase(b);return b=m.cssProps[h]||(m.cssProps[h]=Ua(a.style,h)),g=m.cssHooks[b]||m.cssHooks[h],g&&"get"in g&&(f=g.get(a,!0,c)),void 0===f&&(f=Ja(a,b,d)),"normal"===f&&b in Sa&&(f=Sa[b]),""===c||c?(e=parseFloat(f),c===!0||m.isNumeric(e)?e||0:f):f}}),m.each(["height","width"],function(a,b){m.cssHooks[b]={get:function(a,c,d){return c?Oa.test(m.css(a,"display"))&&0===a.offsetWidth?m.swap(a,Ra,function(){return Ya(a,b,d)}):Ya(a,b,d):void 0},set:function(a,c,d){var e=d&&Ia(a);return Wa(a,c,d?Xa(a,b,d,k.boxSizing&&"border-box"===m.css(a,"boxSizing",!1,e),e):0)}}}),k.opacity||(m.cssHooks.opacity={get:function(a,b){return Na.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=m.isNumeric(b)?"alpha(opacity="+100*b+")":"",f=d&&d.filter||c.filter||"";c.zoom=1,(b>=1||""===b)&&""===m.trim(f.replace(Ma,""))&&c.removeAttribute&&(c.removeAttribute("filter"),""===b||d&&!d.filter)||(c.filter=Ma.test(f)?f.replace(Ma,e):f+" "+e)}}),m.cssHooks.marginRight=La(k.reliableMarginRight,function(a,b){return b?m.swap(a,{display:"inline-block"},Ja,[a,"marginRight"]):void 0}),m.each({margin:"",padding:"",border:"Width"},function(a,b){m.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];4>d;d++)e[a+T[d]+b]=f[d]||f[d-2]||f[0];return e}},Ga.test(a)||(m.cssHooks[a+b].set=Wa)}),m.fn.extend({css:function(a,b){return V(this,function(a,b,c){var d,e,f={},g=0;if(m.isArray(b)){for(d=Ia(a),e=b.length;e>g;g++)f[b[g]]=m.css(a,b[g],!1,d);return f}return void 0!==c?m.style(a,b,c):m.css(a,b)},a,b,arguments.length>1)},show:function(){return Va(this,!0)},hide:function(){return Va(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){U(this)?m(this).show():m(this).hide()})}});function Za(a,b,c,d,e){
    return new Za.prototype.init(a,b,c,d,e)}m.Tween=Za,Za.prototype={constructor:Za,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||"swing",this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(m.cssNumber[c]?"":"px")},cur:function(){var a=Za.propHooks[this.prop];return a&&a.get?a.get(this):Za.propHooks._default.get(this)},run:function(a){var b,c=Za.propHooks[this.prop];return this.options.duration?this.pos=b=m.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):this.pos=b=a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):Za.propHooks._default.set(this),this}},Za.prototype.init.prototype=Za.prototype,Za.propHooks={_default:{get:function(a){var b;return null==a.elem[a.prop]||a.elem.style&&null!=a.elem.style[a.prop]?(b=m.css(a.elem,a.prop,""),b&&"auto"!==b?b:0):a.elem[a.prop]},set:function(a){m.fx.step[a.prop]?m.fx.step[a.prop](a):a.elem.style&&(null!=a.elem.style[m.cssProps[a.prop]]||m.cssHooks[a.prop])?m.style(a.elem,a.prop,a.now+a.unit):a.elem[a.prop]=a.now}}},Za.propHooks.scrollTop=Za.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},m.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2}},m.fx=Za.prototype.init,m.fx.step={};var $a,_a,ab=/^(?:toggle|show|hide)$/,bb=new RegExp("^(?:([+-])=|)("+S+")([a-z%]*)$","i"),cb=/queueHooks$/,db=[ib],eb={"*":[function(a,b){var c=this.createTween(a,b),d=c.cur(),e=bb.exec(b),f=e&&e[3]||(m.cssNumber[a]?"":"px"),g=(m.cssNumber[a]||"px"!==f&&+d)&&bb.exec(m.css(c.elem,a)),h=1,i=20;if(g&&g[3]!==f){f=f||g[3],e=e||[],g=+d||1;do h=h||".5",g/=h,m.style(c.elem,a,g+f);while(h!==(h=c.cur()/d)&&1!==h&&--i)}return e&&(g=c.start=+g||+d||0,c.unit=f,c.end=e[1]?g+(e[1]+1)*e[2]:+e[2]),c}]};function fb(){return setTimeout(function(){$a=void 0}),$a=m.now()}function gb(a,b){var c,d={height:a},e=0;for(b=b?1:0;4>e;e+=2-b)c=T[e],d["margin"+c]=d["padding"+c]=a;return b&&(d.opacity=d.width=a),d}function hb(a,b,c){for(var d,e=(eb[b]||[]).concat(eb["*"]),f=0,g=e.length;g>f;f++)if(d=e[f].call(c,b,a))return d}function ib(a,b,c){var d,e,f,g,h,i,j,l,n=this,o={},p=a.style,q=a.nodeType&&U(a),r=m._data(a,"fxshow");c.queue||(h=m._queueHooks(a,"fx"),null==h.unqueued&&(h.unqueued=0,i=h.empty.fire,h.empty.fire=function(){h.unqueued||i()}),h.unqueued++,n.always(function(){n.always(function(){h.unqueued--,m.queue(a,"fx").length||h.empty.fire()})})),1===a.nodeType&&("height"in b||"width"in b)&&(c.overflow=[p.overflow,p.overflowX,p.overflowY],j=m.css(a,"display"),l="none"===j?m._data(a,"olddisplay")||Fa(a.nodeName):j,"inline"===l&&"none"===m.css(a,"float")&&(k.inlineBlockNeedsLayout&&"inline"!==Fa(a.nodeName)?p.zoom=1:p.display="inline-block")),c.overflow&&(p.overflow="hidden",k.shrinkWrapBlocks()||n.always(function(){p.overflow=c.overflow[0],p.overflowX=c.overflow[1],p.overflowY=c.overflow[2]}));for(d in b)if(e=b[d],ab.exec(e)){if(delete b[d],f=f||"toggle"===e,e===(q?"hide":"show")){if("show"!==e||!r||void 0===r[d])continue;q=!0}o[d]=r&&r[d]||m.style(a,d)}else j=void 0;if(m.isEmptyObject(o))"inline"===("none"===j?Fa(a.nodeName):j)&&(p.display=j);else{r?"hidden"in r&&(q=r.hidden):r=m._data(a,"fxshow",{}),f&&(r.hidden=!q),q?m(a).show():n.done(function(){m(a).hide()}),n.done(function(){var b;m._removeData(a,"fxshow");for(b in o)m.style(a,b,o[b])});for(d in o)g=hb(q?r[d]:0,d,n),d in r||(r[d]=g.start,q&&(g.end=g.start,g.start="width"===d||"height"===d?1:0))}}function jb(a,b){var c,d,e,f,g;for(c in a)if(d=m.camelCase(c),e=b[d],f=a[c],m.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=m.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function kb(a,b,c){var d,e,f=0,g=db.length,h=m.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=$a||fb(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;i>g;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),1>f&&i?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:m.extend({},b),opts:m.extend(!0,{specialEasing:{}},c),originalProperties:b,originalOptions:c,startTime:$a||fb(),duration:c.duration,tweens:[],createTween:function(b,c){var d=m.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;d>c;c++)j.tweens[c].run(1);return b?h.resolveWith(a,[j,b]):h.rejectWith(a,[j,b]),this}}),k=j.props;for(jb(k,j.opts.specialEasing);g>f;f++)if(d=db[f].call(j,a,k,j.opts))return d;return m.map(k,hb,j),m.isFunction(j.opts.start)&&j.opts.start.call(a,j),m.fx.timer(m.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}m.Animation=m.extend(kb,{tweener:function(a,b){m.isFunction(a)?(b=a,a=["*"]):a=a.split(" ");for(var c,d=0,e=a.length;e>d;d++)c=a[d],eb[c]=eb[c]||[],eb[c].unshift(b)},prefilter:function(a,b){b?db.unshift(a):db.push(a)}}),m.speed=function(a,b,c){var d=a&&"object"==typeof a?m.extend({},a):{complete:c||!c&&b||m.isFunction(a)&&a,duration:a,easing:c&&b||b&&!m.isFunction(b)&&b};return d.duration=m.fx.off?0:"number"==typeof d.duration?d.duration:d.duration in m.fx.speeds?m.fx.speeds[d.duration]:m.fx.speeds._default,(null==d.queue||d.queue===!0)&&(d.queue="fx"),d.old=d.complete,d.complete=function(){m.isFunction(d.old)&&d.old.call(this),d.queue&&m.dequeue(this,d.queue)},d},m.fn.extend({fadeTo:function(a,b,c,d){return this.filter(U).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=m.isEmptyObject(a),f=m.speed(b,c,d),g=function(){var b=kb(this,m.extend({},a),f);(e||m._data(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=m.timers,g=m._data(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&cb.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));(b||!c)&&m.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=m._data(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=m.timers,g=d?d.length:0;for(c.finish=!0,m.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;g>b;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),m.each(["toggle","show","hide"],function(a,b){var c=m.fn[b];m.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(gb(b,!0),a,d,e)}}),m.each({slideDown:gb("show"),slideUp:gb("hide"),slideToggle:gb("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){m.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),m.timers=[],m.fx.tick=function(){var a,b=m.timers,c=0;for($a=m.now();c<b.length;c++)a=b[c],a()||b[c]!==a||b.splice(c--,1);b.length||m.fx.stop(),$a=void 0},m.fx.timer=function(a){m.timers.push(a),a()?m.fx.start():m.timers.pop()},m.fx.interval=13,m.fx.start=function(){_a||(_a=setInterval(m.fx.tick,m.fx.interval))},m.fx.stop=function(){clearInterval(_a),_a=null},m.fx.speeds={slow:600,fast:200,_default:400},m.fn.delay=function(a,b){return a=m.fx?m.fx.speeds[a]||a:a,b=b||"fx",this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},function(){var a,b,c,d,e;b=y.createElement("div"),b.setAttribute("className","t"),b.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",d=b.getElementsByTagName("a")[0],c=y.createElement("select"),e=c.appendChild(y.createElement("option")),a=b.getElementsByTagName("input")[0],d.style.cssText="top:1px",k.getSetAttribute="t"!==b.className,k.style=/top/.test(d.getAttribute("style")),k.hrefNormalized="/a"===d.getAttribute("href"),k.checkOn=!!a.value,k.optSelected=e.selected,k.enctype=!!y.createElement("form").enctype,c.disabled=!0,k.optDisabled=!e.disabled,a=y.createElement("input"),a.setAttribute("value",""),k.input=""===a.getAttribute("value"),a.value="t",a.setAttribute("type","radio"),k.radioValue="t"===a.value}();var lb=/\r/g;m.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=m.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,m(this).val()):a,null==e?e="":"number"==typeof e?e+="":m.isArray(e)&&(e=m.map(e,function(a){return null==a?"":a+""})),b=m.valHooks[this.type]||m.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=m.valHooks[e.type]||m.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(lb,""):null==c?"":c)}}}),m.extend({valHooks:{option:{get:function(a){var b=m.find.attr(a,"value");return null!=b?b:m.trim(m.text(a))}},select:{get:function(a){for(var b,c,d=a.options,e=a.selectedIndex,f="select-one"===a.type||0>e,g=f?null:[],h=f?e+1:d.length,i=0>e?h:f?e:0;h>i;i++)if(c=d[i],!(!c.selected&&i!==e||(k.optDisabled?c.disabled:null!==c.getAttribute("disabled"))||c.parentNode.disabled&&m.nodeName(c.parentNode,"optgroup"))){if(b=m(c).val(),f)return b;g.push(b)}return g},set:function(a,b){var c,d,e=a.options,f=m.makeArray(b),g=e.length;while(g--)if(d=e[g],m.inArray(m.valHooks.option.get(d),f)>=0)try{d.selected=c=!0}catch(h){d.scrollHeight}else d.selected=!1;return c||(a.selectedIndex=-1),e}}}}),m.each(["radio","checkbox"],function(){m.valHooks[this]={set:function(a,b){return m.isArray(b)?a.checked=m.inArray(m(a).val(),b)>=0:void 0}},k.checkOn||(m.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})});var mb,nb,ob=m.expr.attrHandle,pb=/^(?:checked|selected)$/i,qb=k.getSetAttribute,rb=k.input;m.fn.extend({attr:function(a,b){return V(this,m.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){m.removeAttr(this,a)})}}),m.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(a&&3!==f&&8!==f&&2!==f)return typeof a.getAttribute===K?m.prop(a,b,c):(1===f&&m.isXMLDoc(a)||(b=b.toLowerCase(),d=m.attrHooks[b]||(m.expr.match.bool.test(b)?nb:mb)),void 0===c?d&&"get"in d&&null!==(e=d.get(a,b))?e:(e=m.find.attr(a,b),null==e?void 0:e):null!==c?d&&"set"in d&&void 0!==(e=d.set(a,c,b))?e:(a.setAttribute(b,c+""),c):void m.removeAttr(a,b))},removeAttr:function(a,b){var c,d,e=0,f=b&&b.match(E);if(f&&1===a.nodeType)while(c=f[e++])d=m.propFix[c]||c,m.expr.match.bool.test(c)?rb&&qb||!pb.test(c)?a[d]=!1:a[m.camelCase("default-"+c)]=a[d]=!1:m.attr(a,c,""),a.removeAttribute(qb?c:d)},attrHooks:{type:{set:function(a,b){if(!k.radioValue&&"radio"===b&&m.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}}}),nb={set:function(a,b,c){return b===!1?m.removeAttr(a,c):rb&&qb||!pb.test(c)?a.setAttribute(!qb&&m.propFix[c]||c,c):a[m.camelCase("default-"+c)]=a[c]=!0,c}},m.each(m.expr.match.bool.source.match(/\w+/g),function(a,b){var c=ob[b]||m.find.attr;ob[b]=rb&&qb||!pb.test(b)?function(a,b,d){var e,f;return d||(f=ob[b],ob[b]=e,e=null!=c(a,b,d)?b.toLowerCase():null,ob[b]=f),e}:function(a,b,c){return c?void 0:a[m.camelCase("default-"+b)]?b.toLowerCase():null}}),rb&&qb||(m.attrHooks.value={set:function(a,b,c){return m.nodeName(a,"input")?void(a.defaultValue=b):mb&&mb.set(a,b,c)}}),qb||(mb={set:function(a,b,c){var d=a.getAttributeNode(c);return d||a.setAttributeNode(d=a.ownerDocument.createAttribute(c)),d.value=b+="","value"===c||b===a.getAttribute(c)?b:void 0}},ob.id=ob.name=ob.coords=function(a,b,c){var d;return c?void 0:(d=a.getAttributeNode(b))&&""!==d.value?d.value:null},m.valHooks.button={get:function(a,b){var c=a.getAttributeNode(b);return c&&c.specified?c.value:void 0},set:mb.set},m.attrHooks.contenteditable={set:function(a,b,c){mb.set(a,""===b?!1:b,c)}},m.each(["width","height"],function(a,b){m.attrHooks[b]={set:function(a,c){return""===c?(a.setAttribute(b,"auto"),c):void 0}}})),k.style||(m.attrHooks.style={get:function(a){return a.style.cssText||void 0},set:function(a,b){return a.style.cssText=b+""}});var sb=/^(?:input|select|textarea|button|object)$/i,tb=/^(?:a|area)$/i;m.fn.extend({prop:function(a,b){return V(this,m.prop,a,b,arguments.length>1)},removeProp:function(a){return a=m.propFix[a]||a,this.each(function(){try{this[a]=void 0,delete this[a]}catch(b){}})}}),m.extend({propFix:{"for":"htmlFor","class":"className"},prop:function(a,b,c){var d,e,f,g=a.nodeType;if(a&&3!==g&&8!==g&&2!==g)return f=1!==g||!m.isXMLDoc(a),f&&(b=m.propFix[b]||b,e=m.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){var b=m.find.attr(a,"tabindex");return b?parseInt(b,10):sb.test(a.nodeName)||tb.test(a.nodeName)&&a.href?0:-1}}}}),k.hrefNormalized||m.each(["href","src"],function(a,b){m.propHooks[b]={get:function(a){return a.getAttribute(b,4)}}}),k.optSelected||(m.propHooks.selected={get:function(a){var b=a.parentNode;return b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex),null}}),m.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){m.propFix[this.toLowerCase()]=this}),k.enctype||(m.propFix.enctype="encoding");var ub=/[\t\r\n\f]/g;m.fn.extend({addClass:function(a){var b,c,d,e,f,g,h=0,i=this.length,j="string"==typeof a&&a;if(m.isFunction(a))return this.each(function(b){m(this).addClass(a.call(this,b,this.className))});if(j)for(b=(a||"").match(E)||[];i>h;h++)if(c=this[h],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(ub," "):" ")){f=0;while(e=b[f++])d.indexOf(" "+e+" ")<0&&(d+=e+" ");g=m.trim(d),c.className!==g&&(c.className=g)}return this},removeClass:function(a){var b,c,d,e,f,g,h=0,i=this.length,j=0===arguments.length||"string"==typeof a&&a;if(m.isFunction(a))return this.each(function(b){m(this).removeClass(a.call(this,b,this.className))});if(j)for(b=(a||"").match(E)||[];i>h;h++)if(c=this[h],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(ub," "):"")){f=0;while(e=b[f++])while(d.indexOf(" "+e+" ")>=0)d=d.replace(" "+e+" "," ");g=a?m.trim(d):"",c.className!==g&&(c.className=g)}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):this.each(m.isFunction(a)?function(c){m(this).toggleClass(a.call(this,c,this.className,b),b)}:function(){if("string"===c){var b,d=0,e=m(this),f=a.match(E)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else(c===K||"boolean"===c)&&(this.className&&m._data(this,"__className__",this.className),this.className=this.className||a===!1?"":m._data(this,"__className__")||"")})},hasClass:function(a){for(var b=" "+a+" ",c=0,d=this.length;d>c;c++)if(1===this[c].nodeType&&(" "+this[c].className+" ").replace(ub," ").indexOf(b)>=0)return!0;return!1}}),m.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){m.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),m.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)}});var vb=m.now(),wb=/\?/,xb=/(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;m.parseJSON=function(b){if(a.JSON&&a.JSON.parse)return a.JSON.parse(b+"");var c,d=null,e=m.trim(b+"");return e&&!m.trim(e.replace(xb,function(a,b,e,f){return c&&b&&(d=0),0===d?a:(c=e||b,d+=!f-!e,"")}))?Function("return "+e)():m.error("Invalid JSON: "+b)},m.parseXML=function(b){var c,d;if(!b||"string"!=typeof b)return null;try{a.DOMParser?(d=new DOMParser,c=d.parseFromString(b,"text/xml")):(c=new ActiveXObject("Microsoft.XMLDOM"),c.async="false",c.loadXML(b))}catch(e){c=void 0}return c&&c.documentElement&&!c.getElementsByTagName("parsererror").length||m.error("Invalid XML: "+b),c};var yb,zb,Ab=/#.*$/,Bb=/([?&])_=[^&]*/,Cb=/^(.*?):[ \t]*([^\r\n]*)\r?$/gm,Db=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Eb=/^(?:GET|HEAD)$/,Fb=/^\/\//,Gb=/^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,Hb={},Ib={},Jb="*/".concat("*");try{zb=location.href}catch(Kb){zb=y.createElement("a"),zb.href="",zb=zb.href}yb=Gb.exec(zb.toLowerCase())||[];function Lb(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(E)||[];if(m.isFunction(c))while(d=f[e++])"+"===d.charAt(0)?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function Mb(a,b,c,d){var e={},f=a===Ib;function g(h){var i;return e[h]=!0,m.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function Nb(a,b){var c,d,e=m.ajaxSettings.flatOptions||{};for(d in b)void 0!==b[d]&&((e[d]?a:c||(c={}))[d]=b[d]);return c&&m.extend(!0,a,c),a}function Ob(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===e&&(e=a.mimeType||b.getResponseHeader("Content-Type"));if(e)for(g in h)if(h[g]&&h[g].test(e)){i.unshift(g);break}if(i[0]in c)f=i[0];else{for(g in c){if(!i[0]||a.converters[g+" "+i[0]]){f=g;break}d||(d=g)}f=f||d}return f?(f!==i[0]&&i.unshift(f),c[f]):void 0}function Pb(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}m.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:zb,type:"GET",isLocal:Db.test(yb[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Jb,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":m.parseJSON,"text xml":m.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?Nb(Nb(a,m.ajaxSettings),b):Nb(m.ajaxSettings,a)},ajaxPrefilter:Lb(Hb),ajaxTransport:Lb(Ib),ajax:function(a,b){"object"==typeof a&&(b=a,a=void 0),b=b||{};var c,d,e,f,g,h,i,j,k=m.ajaxSetup({},b),l=k.context||k,n=k.context&&(l.nodeType||l.jquery)?m(l):m.event,o=m.Deferred(),p=m.Callbacks("once memory"),q=k.statusCode||{},r={},s={},t=0,u="canceled",v={readyState:0,getResponseHeader:function(a){var b;if(2===t){if(!j){j={};while(b=Cb.exec(f))j[b[1].toLowerCase()]=b[2]}b=j[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return 2===t?f:null},setRequestHeader:function(a,b){var c=a.toLowerCase();return t||(a=s[c]=s[c]||a,r[a]=b),this},overrideMimeType:function(a){return t||(k.mimeType=a),this},statusCode:function(a){var b;if(a)if(2>t)for(b in a)q[b]=[q[b],a[b]];else v.always(a[v.status]);return this},abort:function(a){var b=a||u;return i&&i.abort(b),x(0,b),this}};if(o.promise(v).complete=p.add,v.success=v.done,v.error=v.fail,k.url=((a||k.url||zb)+"").replace(Ab,"").replace(Fb,yb[1]+"//"),k.type=b.method||b.type||k.method||k.type,k.dataTypes=m.trim(k.dataType||"*").toLowerCase().match(E)||[""],null==k.crossDomain&&(c=Gb.exec(k.url.toLowerCase()),k.crossDomain=!(!c||c[1]===yb[1]&&c[2]===yb[2]&&(c[3]||("http:"===c[1]?"80":"443"))===(yb[3]||("http:"===yb[1]?"80":"443")))),k.data&&k.processData&&"string"!=typeof k.data&&(k.data=m.param(k.data,k.traditional)),Mb(Hb,k,b,v),2===t)return v;h=m.event&&k.global,h&&0===m.active++&&m.event.trigger("ajaxStart"),k.type=k.type.toUpperCase(),k.hasContent=!Eb.test(k.type),e=k.url,k.hasContent||(k.data&&(e=k.url+=(wb.test(e)?"&":"?")+k.data,delete k.data),k.cache===!1&&(k.url=Bb.test(e)?e.replace(Bb,"$1_="+vb++):e+(wb.test(e)?"&":"?")+"_="+vb++)),k.ifModified&&(m.lastModified[e]&&v.setRequestHeader("If-Modified-Since",m.lastModified[e]),m.etag[e]&&v.setRequestHeader("If-None-Match",m.etag[e])),(k.data&&k.hasContent&&k.contentType!==!1||b.contentType)&&v.setRequestHeader("Content-Type",k.contentType),v.setRequestHeader("Accept",k.dataTypes[0]&&k.accepts[k.dataTypes[0]]?k.accepts[k.dataTypes[0]]+("*"!==k.dataTypes[0]?", "+Jb+"; q=0.01":""):k.accepts["*"]);for(d in k.headers)v.setRequestHeader(d,k.headers[d]);if(k.beforeSend&&(k.beforeSend.call(l,v,k)===!1||2===t))return v.abort();u="abort";for(d in{success:1,error:1,complete:1})v[d](k[d]);if(i=Mb(Ib,k,b,v)){v.readyState=1,h&&n.trigger("ajaxSend",[v,k]),k.async&&k.timeout>0&&(g=setTimeout(function(){v.abort("timeout")},k.timeout));try{t=1,i.send(r,x)}catch(w){if(!(2>t))throw w;x(-1,w)}}else x(-1,"No Transport");function x(a,b,c,d){var j,r,s,u,w,x=b;2!==t&&(t=2,g&&clearTimeout(g),i=void 0,f=d||"",v.readyState=a>0?4:0,j=a>=200&&300>a||304===a,c&&(u=Ob(k,v,c)),u=Pb(k,u,v,j),j?(k.ifModified&&(w=v.getResponseHeader("Last-Modified"),w&&(m.lastModified[e]=w),w=v.getResponseHeader("etag"),w&&(m.etag[e]=w)),204===a||"HEAD"===k.type?x="nocontent":304===a?x="notmodified":(x=u.state,r=u.data,s=u.error,j=!s)):(s=x,(a||!x)&&(x="error",0>a&&(a=0))),v.status=a,v.statusText=(b||x)+"",j?o.resolveWith(l,[r,x,v]):o.rejectWith(l,[v,x,s]),v.statusCode(q),q=void 0,h&&n.trigger(j?"ajaxSuccess":"ajaxError",[v,k,j?r:s]),p.fireWith(l,[v,x]),h&&(n.trigger("ajaxComplete",[v,k]),--m.active||m.event.trigger("ajaxStop")))}return v},getJSON:function(a,b,c){return m.get(a,b,c,"json")},getScript:function(a,b){return m.get(a,void 0,b,"script")}}),m.each(["get","post"],function(a,b){m[b]=function(a,c,d,e){return m.isFunction(c)&&(e=e||d,d=c,c=void 0),m.ajax({url:a,type:b,dataType:e,data:c,success:d})}}),m._evalUrl=function(a){return m.ajax({url:a,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})},m.fn.extend({wrapAll:function(a){if(m.isFunction(a))return this.each(function(b){m(this).wrapAll(a.call(this,b))});if(this[0]){var b=m(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&1===a.firstChild.nodeType)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){return this.each(m.isFunction(a)?function(b){m(this).wrapInner(a.call(this,b))}:function(){var b=m(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=m.isFunction(a);return this.each(function(c){m(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){m.nodeName(this,"body")||m(this).replaceWith(this.childNodes)}).end()}}),m.expr.filters.hidden=function(a){return a.offsetWidth<=0&&a.offsetHeight<=0||!k.reliableHiddenOffsets()&&"none"===(a.style&&a.style.display||m.css(a,"display"))},m.expr.filters.visible=function(a){return!m.expr.filters.hidden(a)};var Qb=/%20/g,Rb=/\[\]$/,Sb=/\r?\n/g,Tb=/^(?:submit|button|image|reset|file)$/i,Ub=/^(?:input|select|textarea|keygen)/i;function Vb(a,b,c,d){var e;if(m.isArray(b))m.each(b,function(b,e){c||Rb.test(a)?d(a,e):Vb(a+"["+("object"==typeof e?b:"")+"]",e,c,d)});else if(c||"object"!==m.type(b))d(a,b);else for(e in b)Vb(a+"["+e+"]",b[e],c,d)}m.param=function(a,b){var c,d=[],e=function(a,b){b=m.isFunction(b)?b():null==b?"":b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};if(void 0===b&&(b=m.ajaxSettings&&m.ajaxSettings.traditional),m.isArray(a)||a.jquery&&!m.isPlainObject(a))m.each(a,function(){e(this.name,this.value)});else for(c in a)Vb(c,a[c],b,e);return d.join("&").replace(Qb,"+")},m.fn.extend({serialize:function(){return m.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=m.prop(this,"elements");return a?m.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!m(this).is(":disabled")&&Ub.test(this.nodeName)&&!Tb.test(a)&&(this.checked||!W.test(a))}).map(function(a,b){var c=m(this).val();return null==c?null:m.isArray(c)?m.map(c,function(a){return{name:b.name,value:a.replace(Sb,"\r\n")}}):{name:b.name,value:c.replace(Sb,"\r\n")}}).get()}}),m.ajaxSettings.xhr=void 0!==a.ActiveXObject?function(){return!this.isLocal&&/^(get|post|head|put|delete|options)$/i.test(this.type)&&Zb()||$b()}:Zb;var Wb=0,Xb={},Yb=m.ajaxSettings.xhr();a.attachEvent&&a.attachEvent("onunload",function(){for(var a in Xb)Xb[a](void 0,!0)}),k.cors=!!Yb&&"withCredentials"in Yb,Yb=k.ajax=!!Yb,Yb&&m.ajaxTransport(function(a){if(!a.crossDomain||k.cors){var b;return{send:function(c,d){var e,f=a.xhr(),g=++Wb;if(f.open(a.type,a.url,a.async,a.username,a.password),a.xhrFields)for(e in a.xhrFields)f[e]=a.xhrFields[e];a.mimeType&&f.overrideMimeType&&f.overrideMimeType(a.mimeType),a.crossDomain||c["X-Requested-With"]||(c["X-Requested-With"]="XMLHttpRequest");for(e in c)void 0!==c[e]&&f.setRequestHeader(e,c[e]+"");f.send(a.hasContent&&a.data||null),b=function(c,e){var h,i,j;if(b&&(e||4===f.readyState))if(delete Xb[g],b=void 0,f.onreadystatechange=m.noop,e)4!==f.readyState&&f.abort();else{j={},h=f.status,"string"==typeof f.responseText&&(j.text=f.responseText);try{i=f.statusText}catch(k){i=""}h||!a.isLocal||a.crossDomain?1223===h&&(h=204):h=j.text?200:404}j&&d(h,i,j,f.getAllResponseHeaders())},a.async?4===f.readyState?setTimeout(b):f.onreadystatechange=Xb[g]=b:b()},abort:function(){b&&b(void 0,!0)}}}});function Zb(){try{return new a.XMLHttpRequest}catch(b){}}function $b(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}m.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(a){return m.globalEval(a),a}}}),m.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),m.ajaxTransport("script",function(a){if(a.crossDomain){var b,c=y.head||m("head")[0]||y.documentElement;return{send:function(d,e){b=y.createElement("script"),b.async=!0,a.scriptCharset&&(b.charset=a.scriptCharset),b.src=a.url,b.onload=b.onreadystatechange=function(a,c){(c||!b.readyState||/loaded|complete/.test(b.readyState))&&(b.onload=b.onreadystatechange=null,b.parentNode&&b.parentNode.removeChild(b),b=null,c||e(200,"success"))},c.insertBefore(b,c.firstChild)},abort:function(){b&&b.onload(void 0,!0)}}}});var _b=[],ac=/(=)\?(?=&|$)|\?\?/;m.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=_b.pop()||m.expando+"_"+vb++;return this[a]=!0,a}}),m.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(ac.test(b.url)?"url":"string"==typeof b.data&&!(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&ac.test(b.data)&&"data");return h||"jsonp"===b.dataTypes[0]?(e=b.jsonpCallback=m.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(ac,"$1"+e):b.jsonp!==!1&&(b.url+=(wb.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||m.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,_b.push(e)),g&&m.isFunction(f)&&f(g[0]),g=f=void 0}),"script"):void 0}),m.parseHTML=function(a,b,c){if(!a||"string"!=typeof a)return null;"boolean"==typeof b&&(c=b,b=!1),b=b||y;var d=u.exec(a),e=!c&&[];return d?[b.createElement(d[1])]:(d=m.buildFragment([a],b,e),e&&e.length&&m(e).remove(),m.merge([],d.childNodes))};var bc=m.fn.load;m.fn.load=function(a,b,c){if("string"!=typeof a&&bc)return bc.apply(this,arguments);var d,e,f,g=this,h=a.indexOf(" ");return h>=0&&(d=m.trim(a.slice(h,a.length)),a=a.slice(0,h)),m.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(f="POST"),g.length>0&&m.ajax({url:a,type:f,dataType:"html",data:b}).done(function(a){e=arguments,g.html(d?m("<div>").append(m.parseHTML(a)).find(d):a)}).complete(c&&function(a,b){g.each(c,e||[a.responseText,b,a])}),this},m.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){m.fn[b]=function(a){return this.on(b,a)}}),m.expr.filters.animated=function(a){return m.grep(m.timers,function(b){return a===b.elem}).length};var cc=a.document.documentElement;function dc(a){return m.isWindow(a)?a:9===a.nodeType?a.defaultView||a.parentWindow:!1}m.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=m.css(a,"position"),l=m(a),n={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=m.css(a,"top"),i=m.css(a,"left"),j=("absolute"===k||"fixed"===k)&&m.inArray("auto",[f,i])>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),m.isFunction(b)&&(b=b.call(a,c,h)),null!=b.top&&(n.top=b.top-h.top+g),null!=b.left&&(n.left=b.left-h.left+e),"using"in b?b.using.call(a,n):l.css(n)}},m.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){m.offset.setOffset(this,a,b)});var b,c,d={top:0,left:0},e=this[0],f=e&&e.ownerDocument;if(f)return b=f.documentElement,m.contains(b,e)?(typeof e.getBoundingClientRect!==K&&(d=e.getBoundingClientRect()),c=dc(f),{top:d.top+(c.pageYOffset||b.scrollTop)-(b.clientTop||0),left:d.left+(c.pageXOffset||b.scrollLeft)-(b.clientLeft||0)}):d},position:function(){if(this[0]){var a,b,c={top:0,left:0},d=this[0];return"fixed"===m.css(d,"position")?b=d.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),m.nodeName(a[0],"html")||(c=a.offset()),c.top+=m.css(a[0],"borderTopWidth",!0),c.left+=m.css(a[0],"borderLeftWidth",!0)),{top:b.top-c.top-m.css(d,"marginTop",!0),left:b.left-c.left-m.css(d,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||cc;while(a&&!m.nodeName(a,"html")&&"static"===m.css(a,"position"))a=a.offsetParent;return a||cc})}}),m.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,b){var c=/Y/.test(b);m.fn[a]=function(d){return V(this,function(a,d,e){var f=dc(a);return void 0===e?f?b in f?f[b]:f.document.documentElement[d]:a[d]:void(f?f.scrollTo(c?m(f).scrollLeft():e,c?e:m(f).scrollTop()):a[d]=e)},a,d,arguments.length,null)}}),m.each(["top","left"],function(a,b){m.cssHooks[b]=La(k.pixelPosition,function(a,c){return c?(c=Ja(a,b),Ha.test(c)?m(a).position()[b]+"px":c):void 0})}),m.each({Height:"height",Width:"width"},function(a,b){m.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){m.fn[d]=function(d,e){var f=arguments.length&&(c||"boolean"!=typeof d),g=c||(d===!0||e===!0?"margin":"border");return V(this,function(b,c,d){var e;return m.isWindow(b)?b.document.documentElement["client"+a]:9===b.nodeType?(e=b.documentElement,Math.max(b.body["scroll"+a],e["scroll"+a],b.body["offset"+a],e["offset"+a],e["client"+a])):void 0===d?m.css(b,c,g):m.style(b,c,d,g)},b,f?d:void 0,f,null)}})}),m.fn.size=function(){return this.length},m.fn.andSelf=m.fn.addBack,"function"==typeof define&&define.amd&&define("jquery",[],function(){return m});var ec=a.jQuery,fc=a.$;return m.noConflict=function(b){return a.$===m&&(a.$=fc),b&&a.jQuery===m&&(a.jQuery=ec),m},typeof b===K&&(a.jQuery=a.$=m),m});
if(typeof define === "function" && define.amd){
    define("jquery",[],function(){
        return jQuery;
    });
};
/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */
var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */
var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */
function hex_md5(s){ return binl2hex(core_md5(str2binl(s), s.length * chrsz));}
function b64_md5(s){ return binl2b64(core_md5(str2binl(s), s.length * chrsz));}
function str_md5(s){ return binl2str(core_md5(str2binl(s), s.length * chrsz));}
function hex_hmac_md5(key, data) { return binl2hex(core_hmac_md5(key, data)); }
function b64_hmac_md5(key, data) { return binl2b64(core_hmac_md5(key, data)); }
function str_hmac_md5(key, data) { return binl2str(core_hmac_md5(key, data)); }

/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test()
{
  return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5(x, len)
{
  /* append padding */
  x[len >> 5] |= 0x80 << ((len) % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  var a =  1732584193;
  var b = -271733879;
  var c = -1732584194;
  var d =  271733878;

  for(var i = 0; i < x.length; i += 16)
  {
    var olda = a;
    var oldb = b;
    var oldc = c;
    var oldd = d;

    a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
    b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
    c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

    a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
    b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
    b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

    a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
    a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
    c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
    b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

    a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
    b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
    c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

    a = safe_add(a, olda);
    b = safe_add(b, oldb);
    c = safe_add(c, oldc);
    d = safe_add(d, oldd);
  }
  return Array(a, b, c, d);

}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t)
{
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
}
function md5_ff(a, b, c, d, x, s, t)
{
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t)
{
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t)
{
  return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t)
{
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Calculate the HMAC-MD5, of a key and some data
 */
function core_hmac_md5(key, data)
{
  var bkey = str2binl(key);
  if(bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

  var ipad = Array(16), opad = Array(16);
  for(var i = 0; i < 16; i++)
  {
    ipad[i] = bkey[i] ^ 0x36363636;
    opad[i] = bkey[i] ^ 0x5C5C5C5C;
  }

  var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
  return core_md5(opad.concat(hash), 512 + 128);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * Convert a string to an array of little-endian words
 * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
 */
function str2binl(str)
{
  var bin = Array();
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < str.length * chrsz; i += chrsz)
    bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
  return bin;
}

/*
 * Convert an array of little-endian words to a string
 */
function binl2str(bin)
{
  var str = "";
  var mask = (1 << chrsz) - 1;
  for(var i = 0; i < bin.length * 32; i += chrsz)
    str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
  return str;
}

/*
 * Convert an array of little-endian words to a hex string.
 */
function binl2hex(binarray)
{
  var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i++)
  {
    str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
           hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
  }
  return str;
}

/*
 * Convert an array of little-endian words to a base-64 string
 */
function binl2b64(binarray)
{
  var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var str = "";
  for(var i = 0; i < binarray.length * 4; i += 3)
  {
    var triplet = (((binarray[i   >> 2] >> 8 * ( i   %4)) & 0xFF) << 16)
                | (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 )
                |  ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
    for(var j = 0; j < 4; j++)
    {
      if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
      else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
    }
  }
  return str;
};
define("md5", function(){});

/*
API
*/
define('ajaxAPI',[],function(){
    // var head = "http://192.168.5.122:8080/manageSystem/";
    // var head = "http://120.26.87.159:18080/manageSystem/";
    var head = "/manageSystem/"; 
    // window.API.login = "localhost:8888/manageSystem/web/user/login";
    window.API = { 
        //用户管理
        login : head+"web/user/login",//登录
        logout : head+"web/user/logout",//登出
        userCurrent : head+"web/user/current",//获取当前登陆用户信息
        changePwd : head+"web/user/pwd/modify",//修改密码
        resetPwd : head+"web/user/pwd/reset",//重置密码
        userList : head+"web/user/list",//用户列表
        userDel : head+"/web/user/del",//用户删除
        userDetail : head+"web/user/detail",//用户详情
        saveUser : head+"web/user/save",//新增/修改用户
        lockUser : head+"web/user/lock",//禁用/启用用户
        photoByName : head+"web/user/get/by/name",//根据电话号码查找用户
        photoByDealer : head+"web/dealer/find/by/phone",//根据经销商电话查找经销商
        deviceListUsers : head+"web/device/list/users",//获取设备用户列表
        deviceUserDevice : head+"web/device/user/device/num",//获取用户设备数量
        factoryUser : head+"web/user/list/factory/users",//获取工厂的登录用户
        
        //地区管理
        areaChildren : head+"web/area/children",//获取地区

        //角色管理
        roleList : head+"web/role/list",//角色列表
        roleSave : head+"web/role/save",//新增/修改角色
        roleDetail : head+"web/role/detail",//角色详情
        roleDel : head+"/web/role/del", //删除角色
        permissionList : head+"web/permission/list",//权限列表

        //经销商管理
        dealerSave : head+"web/dealer/save",//新增/修改零售/行业经销商
        dealerDel : head+"/web/dealer/del",//删除经销商
        retailDetail : head+"web/dealer/retail/detail",//零售经销商详情
        retailList : head+"web/dealer/retail/list",//零售经销商列表
        industryDetail : head+"web/dealer/industry/detail",//行业经销商详情
        industryList : head+"web/dealer/industry/list",//行业经销商列表
        deviceList : head+"web/dealer/list/device",//经销商设备列表
        industrySave : head+"web/industry/save",//新增行业
        industryNameList : head+"web/industry/list",//行业列表
        
        /****售前设备****/
        //设备分类
        categorySave : head+"web/device/category/save",//新增/修改设备分类
        categoryList : head+"web/device/category/list",//获取设备分类列表
        modelSave : head+"web/device/model/save",//新增/修改设备型号
        modelList : head+"web/device/model/list",//获取设备型号列表

        //生产厂商
        factorySave : head+"web/factory/save",//新增/修改生产厂商
        factoryList : head+"web/factory/list",//获取生产厂商列表
        factoryDetail : head+"web/factory/detail",//获取生产厂商详情
        factoryLock : head+"web/factory/lock",//锁定生产厂商
        factoryBindersList : head+"web/factory/list/binders",//查询工厂员工列表
        factoryBindUser : head+"web/factory/bind/user",//绑定工厂用户
        factoryUnbindUser : head+"web/factory/unbind/user",//解除绑定工厂用户

        //批次管理
        batchAdd : head+"web/device/batch/add",//创建生产批次
        batchList : head+"web/device/batch/list",//查询生产批次
        batchDetail : head+"web/device/batch/detail",//查看批次详情
        batchSnList : head+"web/device/batch/list/sn",//查询SN列表
        batchDiscardSn : head+"web/device/batch/discardSn",//作废SN编码
        batchExport : head+"web/device/batch/export",//导出生产批次
        deviceAllocate : head+"web/device/allocate",//设置出厂身份
        deviceResetInitState : head+"web/device/resetInitState",//设置出厂身份

        /****售后设备****/
        //订单管理
        newOrder : head+"web/order/add",//新增订单
        orderList : head+"web/order/list",//订单列表
        orderDetail : head+"web/order/detail",//订单详情
        orderListDevice : head+"web/order/list/device",//获取订单设备列表
        channelList : head+"web/channel/list",//订单类型列表
        orderTemplateDownload : head+"web/order/template/download",//下载订单上传模版
        
        //设备管理
        sellDeviceList : head+"web/device/list",//获取设备列表
        sellDeviceDetail : head+"web/device/detail",//获取设备详情
        sellDeviceStrainerList : head+"web/device/strainer/list",//获取滤网列表  
        sellDeviceStrainerDetail : head+"web/device/strainer/detail",//获取滤网详情
        findByCategory : head+"web/device/model/find/by/category",//根据设备分类获取设备型号
 
        //校园新风
        schoolSave : head+"web/school/save",//保存学校
        schoolEdit : head+"/web/school/detail",//修改学校
        schoolClassDetail : head+"web/school/class/detail",//获取班级详情
        schoolClassSave : head+"web/school/class/save",//保存班级
        schoolClassList : head+"web/school/class/list",//获取班级列表
        schoolServiceFeeSet : head+"web/school/service/fee/set",//服务费设置
        schoolServiceFeeGet : head+"web/school/service/fee/get",//服务费设置
        schoolDeviceList : head+"web/school/list/device",//获取学校设备列表
        schoolList : head+"web/school/list",//获取学校列表
        schoolClassListDevice : head+"web/school/class/list/device",//获取班级设备列表
        schoolClassServiceList : head+"web/school/class/service/list",//获取服务购买记录
        deviceUvRun : head+"web/device/uv/run",//Uv开启状态改变
        
        //数据统计
        statisticsDeviceGeneral : head+"web/statistics/device/general",//应用概况统计
        statisticsMonthlyNewUsers : head+"web/statistics/monthly/new/users",//月度新增用户统计
        statisticsMonthlyNewDevices : head+"web/statistics/monthly/new/devices",//月度新增设备统计
        statisticsTendencyAnalyze : head+"web/statistics/tendency/analyze",//趋势分析统计
        statisticsDeviceStatistics : head+"web/statistics/device/statistics",//趋势设备统计
        statisticsTerminalStatistics : head+"web/statistics/terminal/statistics",//终端统计
        statisticsDeviceDistribution : head+"web/statistics/devices/distribution",//按省份统计设备
        statisticsExpiringStrainers : head+"web/statistics/expiring/strainers",// 统计即将到期滤网
        statisticsSchoolDeviceNum : head+"web/statistics/school/device/num",//获取校园设备统计列表
        statisticsSchoolGeneral : head+"web/statistics/school/general",//校园设备概况
        statisticsUsersByModel : head+"web/statistics/users/by/model",//根据设备类型统计用户数量


        //设备定位
        gisGetonlineCount: head+"/web/gis/getAllGisDev/onlineCount",
        gisGetAllGisDevView: head+"/web/gis/getAllGisDev/view"
    };
    return API;
});
define('base',[], function (header) {
    //全局公用参数
    window.publicParams = {};
    var init = {
        default: function () {
            init.base();
            init.getUserInfo();
        },
        base: function () {
            //容器最小高度获取
            if ($(".container").length) {
                $(window).bind("resize", function () {
                    var $container = $(".container"),
                        $top = $container.offset().top,
                        $H = $(window).height(),
                        $main = parseInt($("#main").css("margin-bottom"));
                    $container.css({
                        minHeight: $H - $top - 15
                    });
                }).trigger("resize");
            }
        },
        //获取用户信息
        getUserInfo: function () {
            $.ajax({
                url: API.userCurrent,
                type: "post",
                success: function (resp) {
                    if (resp.code == 0) {
                        publicParams.userInfo = resp.data;
                        localStorage.name = resp.data.userName;
                        $(".name").find(">span").text(resp.data.userName);
                        //获取用户信息回调
                        if (publicParams.getUserInfoBack) {
                            publicParams.getUserInfoBack(resp.data);
                        }

                        if ($("#login").length) {
                            location.href = "/html/map/device-map.html";
                        }
                    } else {
                        init.notLogin();
                    }
                },
                error: function () {
                    Tool.alertboxError("服务器连接失败,请联系后台管理人员.");
                    if (!$("#login").length) {
                        setTimeout(function () {
                            location.href = "/html/login/login.html";
                        }, 3000);
                    }
                }
            });
        },
        //未登陆处理
        notLogin: function () {
            if (!$("#login").length) {
                location.href = "/html/login/login.html";
            }
        }
    };
    init.default();
});
define('form',[],function(header){
    var params = {};
    var init = {
        default : function(){
            init.event();
            //选项事件
            init.selectEvent();
        },
        event : function(){
            //按扭按下/松开  
            $("body").on("mousedown",".btn:not(.disabled)",function(){
                $(this).addClass("btn-active");
            }).on("mouseup",function(){
                $(".btn-active").removeClass("btn-active");
            });
            //点击input选框
            $("body").on("click",".checkout-box:not(.disabled):not(.notClick)",function(){
                if($(this).hasClass("on")){
                    $(this).removeClass("on").find("input").attr("checked",false);
                }else{
                    $(this).addClass("on").find("input").attr("checked",true);
                }
            });
            //input获取/推动焦点
            $("body").on("focus",".input",function(){
                var self = $(this);
                setTimeout(function(){
                    self.addClass("focus");
                });
            }).on("blur",".input",function(){
                $(this).removeClass("focus");
            }); 
        },
        //选项事件
        selectEvent : function(){
            $("body").on("click",function(){
                $(".sod_list").hide();  
            });
            //点击select
            $("body").on("click",".sod_select",function(){
                //清楚另外一些select选择效果
                $(this).addClass("now"); 
                $(".sod_select:not(.now)").find(".sod_list").hide();
                $(this).removeClass("now");
                //隐藏/显示选择 
                var $list = $(this).find(".sod_list");
                if($list.css("display")=="block"){ 
                    $list.hide();
                }else{
                    $list.show();
                }
                return false;
            });
            //点击select option 
            $("body").on("click",".sod_select .sod_list li:not(.notSetVal)",function(){
                var $val = $(this).text(); 
                $(this).closest(".sod_select").find(".sod_label").text($val);
                $(this).addClass("selected").siblings().removeClass("selected");
            });
            //点击select option
            $("body").on("click",".sod_select .sod_list li.notSetVal",function(){
                $(".sod_list").hide();
                $(this).addClass("selected").siblings().removeClass("selected");
                return false;
            });
        }
    };

    init.default();
});
/*
 验证包
 */
define('Check',[], function () {
    window.Check = {};
    //验证是否有值
    Check.haveValue = function (val, hint) {
        if (val.value) {
            val.warning = false;
            val.hint = "";
            val.success = true;
        } else {
            val.warning = true;
            val.hint = hint;
            val.success = false;
        }
    };
    //验证联系电话
    Check.ifPhone = function (val, hint) {
        hint = hint || [];
        val.warning = true;
        val.success = false;
        if (!val.value) {
            val.hint = hint[0] || "联系电话不能为空";
        } else if (!RegEx.regExpPhone(val.value)) {
            val.hint = hint[1] || "联系电话不正确";
        } else {
            val.warning = false;
            val.hint = "";
            val.success = true;
        }
    };
    //验证密码
    Check.ifPassword = function (val, hint) {
        hint = hint || [];
        val.warning = true;
        val.success = false;
        if (!val.value) {
            val.hint = hint[0] || "当前密码不能为空";
        } else if (!RegEx.RegExpPassword(val.value)) {
            val.hint = hint[1] || "请输入6-16位不含特殊符号的密码";
        } else {
            val.warning = false;
            val.hint = "";
            val.success = true;
        }
    };
    //确认验证新密码
    Check.reIfPassword = function (val, list) {
        val.warning = true;
        val.success = false;
        if (!val.value) {
            val.hint = "确认密码不能为空";
        } else if (!RegEx.RegExpPassword(val.value)) {
            val.hint = "请输入6-16位不含特殊符号的密码";
        } else if (val.value != list[1].value) {
            val.hint = "两次密码输入不一致";
        } else if (RegEx.RegExpPassword(val.value)) {
            val.warning = false;
            val.success = true;
            val.hint = "";
        }
    };
    //验证列表不正确
    Check.list = function (list, params) {
        for (var i = 0; i < list.length; i++) {
            if (!list[i].success) {
                list[i].blur(list[i], list, params);
                return true;
            }
        }
    };
    //验证联系电话是否正确 在获取信息
    Check.ifPhoneGetInfo = function (val, callback) {
        //添加失败参数
        if (!val.value || !RegEx.regExpPhone(val.value)) {
            val.user.value = "";
            val.warning = true;
            val.class = "warning";
            val.success = false;
        }
        //判断逻辑
        if (!val.value) {
            val.hint = "联系电话不能为空";
        } else if (!RegEx.regExpPhone(val.value)) {
            val.hint = "联系电话不正确";
        } else {
            var data = {};
            val.paramPhone = val.paramPhone || "loginName";
            data[val.paramPhone] = val.value;
            $.ajax({
                url: val.API || API.photoByName,
                type: "post",
                data: data,
                success: function (resp) {
                    if (resp.code == 0) {
                        val.hint = "";
                        val.class = "";
                        val.warning = false;
                        val.success = true;
                        val.user.id = resp.data.id;
                        val.user.value = resp.data.userName;
                        if (callback) {
                            callback("success", resp);
                        }
                    } else {
                        val.hint = resp.msg;
                        if (callback) {
                            callback("error", resp);
                        }
                    }
                },
                error: function (resp) {
                    val.hint = "失败";
                    val.class = "warning";
                    val.warning = true;
                    val.success = false;
                    val.user.value = "";
                    if (callback) {
                        callback("error", resp);
                    }
                }
            });
        }
    };
    Check.ifPhoneGetInfoId = function (val, callback) {
        //添加失败参数
        if (!val.value || !RegEx.regExpPhone(val.value)) {
            val.user.value = "";
            val.warning = true;
            val.class = "warning";
            val.success = false;
        }
        //判断逻辑
        if (!val.value) {
            val.hint = "联系电话不能为空";
        } else if (!RegEx.regExpPhone(val.value)) {
            val.hint = "联系电话不正确";
        } else {
            var data = {};
            val.paramPhone = val.paramPhone || "phone";
            data[val.paramPhone] = val.value;
            $.ajax({
                url: val.API || API.photoByDealer,
                type: "post",
                data: data,
                async: false,
                success: function (resp) {
                    if (resp.code == 0) {
                        val.hint = "";
                        val.class = "";
                        val.warning = false;
                        val.success = true;
                        val.user.id = resp.data.id;
                        val.user.value = resp.data.userName;
                        if (callback) {
                            callback("success", resp);
                        }
                    } else {
                        val.hint = resp.msg;
                        if (callback) {
                            callback("error", resp);
                        }
                    }
                },
                error: function (resp) {
                    val.hint = "失败";
                    val.class = "warning";
                    val.warning = true;
                    val.success = false;
                    val.user.value = "";
                    if (callback) {
                        callback("error", resp);
                    }
                }
            });
        }
    };
    //验证正数金额
    Check.ifPositive = function (val, hint) {
        hint = hint || [];
        val.warning = true;
        val.success = false;
        if (!val.value) {
            val.hint = hint[0] || "金额不能为空";
        } else if (!RegEx.RegExpPositive(val.value)) {
            val.hint = hint[1] || "请填写正确的金额数";
        } else {
            val.warning = false;
            val.hint = "";
            val.success = true;
        }
    };
    //验证正整数
    Check.ifPositiveInteger = function (val, hint) {
        hint = hint || [];
        val.warning = true;
        val.success = false;
        if (!val.value) {
            val.hint = hint[0] || "数量不能为空";
        } else if (!RegEx.RegExpInteger(val.value)) {
            val.hint = hint[1] || "请填写正确的正整数";
        } else {
            val.warning = false;
            val.hint = "";
            val.success = true;
        }
    };
    //验证日期
    Check.ifDate = function (val, hint) {
        hint = hint || [];
        val.warning = true;
        val.success = false;
        if (!val.value) {
            val.hint = hint[0] || "日期不能为空";
        } else if (!RegEx.RegExpDate(val.value)) {
            val.hint = hint[1] || "日期格式错误 例：1995-10-08";
        } else {
            val.warning = false;
            val.hint = "";
            val.success = true;
        }
    }
    return Check;
});
/*
 工具包
 */
define('Tool',[], function () {
    window.Tool = {};
    //经过提示信息
    Tool.Tooltip = function (info) {
        info.status = info.status || "append";  //append 添加事件  remove 删除事件
        this.init = function () {
            //删除事件
            if (info.status == "remove") {
                this.unbindEvent();
                return;
            }
            //添加事件
            info.box.mouseover(function () {
                $(".tooptip").remove();
                var $title = info.message;
                if (!$title) {
                    return;
                }
                $("body").append("<i class='tooptip'>" + $title + "</i>");
                var $offset = info.input.offset()
                //箭头位置
                if (info.status == "right") {
                    $(".tooptip").css({
                        right: $(window).width() - $offset.left
                    });
                } else {
                    $(".tooptip").css({
                        left: $offset.left
                    });
                }
                $(".tooptip").css({
                    width: info.width,
                    top: $offset.top,
//                    left:$offset.left,//info.left||0,
                    whiteSpace: info.whiteSpace || "normal",
                    lineHeight: info.lineHeight
                }).animate({
                    opacity: 1
                }, 100);
            });
            info.box.mouseout(function () {
//                $(".tooptip").remove();
            });
            if (!!info.input) {
                info.input.blur(function () {
//                    $(".tooptip").remove();
                });
            }
        };
        this.unbindEvent = function () {
            info.box.unbind("mouseover");
            info.box.unbind("mouseout");
        }
        this.init();
    };
//    Tool.Tooltip({box:$('.aa').closest("li"),message:"请填写正确的邮箱！",input:$('.aa'),status:"right"});
    //获取链接
    Tool.getUrlParam = function (val) {
        var href = location.href.replace("?", "&");
        href = href.split("&");
        href.shift();
        var data = {
            urlParamVal: 0
        };
        for (var i = 0; i < href.length; i++) {
            var val = href[i].split("=");
            if (val[1]) {
                data[val[0]] = val[1];
                data.urlParamVal++;
            }
        }
        return data;
    };
    //改变链接值
    Tool.changeUrlVal = function (data, status) {
        //清理location
        if (status == "clean") {
            Tool.setUrlParam({});
        }
        //获取location信息
        data = data || [];
        var urlParam = Tool.getUrlParam();
        for (var i = 0; i < data.length; i++) {
            if (data[i].val) {
                urlParam[data[i].name] = data[i].val;
            } else {
                delete urlParam[data[i].name];
            }
        }
        //设置location值
        Tool.setUrlParam(urlParam);
    };
    //设置href值
    Tool.setUrlParam = function (info) {
        var data = "";
        for (var i in info) {
            if (i != "urlParamVal") {
                data += i + "=" + info[i] + "&";
            }
        }
        data = data.slice(0, data.length - 1);
        history.pushState({}, ".html", "?" + data);
    };
    //页码整理  
    Tool.pageData = function (data) {
        data = data || {};
        var pages = [];
        //小于6页全部展示
        if (data.totalPage <= 6) {
            for (var i = 0; i < data.totalPage; i++) {
                pages.push({
                    num: i + 1,
                    active: i == data.currentPage - 1 ? "active" : ""
                });
            }
        }
        if (data.totalPage > 6) {
            //当前页面小于4前面全部展示
            if (data.currentPage < 5) {
                for (var i = 0; i < 4; i++) {
                    pages.push({
                        num: i + 1,
                        active: i == data.currentPage - 1 ? "active" : ""
                    });
                }
                if (data.currentPage == 4) {
                    pages.push({num: 5});
                }
                pages.push({num: "...", omit: "omit"});
                pages.push({num: data.totalPage});
            } else
            //当前页面在最后3页后面全部展示
            if (data.currentPage >= data.totalPage - 4) {
                pages.push({num: 1});
                pages.push({num: "...", omit: "omit"});
                for (var i = data.totalPage - 4; i < data.totalPage; i++) {
                    pages.push({
                        num: i + 1,
                        active: i == data.currentPage - 1 ? "active" : ""
                    });
                }
            } else
            //页面在中间
            if (data.currentPage >= 5 && data.currentPage < data.totalPage - 4) {
                pages.push({num: 1});
                pages.push({num: "...", omit: "omit"});
                for (var i = data.currentPage - 1; i < data.currentPage + 3; i++) {
                    pages.push({
                        num: i + 1,
                        active: i == data.currentPage - 1 ? "active" : ""
                    });
                }
                pages.push({num: "...", omit: "omit"});
                pages.push({num: data.totalPage});
            }
        }
        return pages;
    };
    //省份获取
    Tool.area = function (data, callback) {
        data = data || {areaId: 0};
        $.ajax({
            url: API.areaChildren,
            type: "post",
            data: data,
            success: function (resp) {
                if (callback) {
                    callback(resp.data);
                } else {
                    return resp.data;
                }
            },
            error: function (resp) {
                console.log(resp, "失败");
            }
        });
    };
    //加载数据中
    Tool.loaddding = function (data) {
        data.status = data.status || "add";
        this.init = function () {
            this[data.status]();
        };
        //删除
        this.remove = function () {
            for (var i = 0; i < data.box.length; i++) {
                $(data.box[i]).find(".loaddinginfo").remove();
            }
            if (data.selfBox) {
                for (var i = 0; i < data.selfBox.length; i++) {
                    $(data.selfBox[i]).remove();
                }
            }
        };
        this.add = function () {
            //添加
            component.loaddinginfo();
            var newBox = [];
            for (var i = 0; i < data.box.length; i++) {
                var $box = "loaddinginfo" + $.now() + i;
                newBox.push("." + $box);
                if (data.cover) {
                    $(data.box[i]).html('<div class="loaddinginfo ' + $box + '"><loaddinginfo></loaddinginfo></div>');
                } else {
                    $(data.box[i]).append('<div class="loaddinginfo ' + $box + '"><loaddinginfo></loaddinginfo></div>');
                }
                new Vue({
                    el: "." + $box
                });
                if (data.delayShow) {
                    $("." + $box).css({display: "none"});
                    //延时展示
                    this.delayShow($box);
                }
            }
            if (data.callback) {
                data.callback(newBox, data.box);
            }
        };
        //延时展示
        this.delayShow = function ($box) {
            setTimeout(function () {
                $("." + $box).css({display: "block"});
            }, data.timeout || 100);
        };
        this.init();
    };
    //加载数据中-生成loadding
    Tool.createLoadding = function (box, cover, callback) {
        if (!box) {
            $(".page").html("");
        }
        Tool.loaddding({
            box: box || [".info-table-box"],
            cover: cover == false ? false : true,//覆盖
            delayShow: true,//N毫秒后展示 默认N毫秒"timeOut:N" 时间太快不显示正在加载中...
            callback: function (newBox, box) {
                //超时
                Tool.nothing({
                    question: "获取数据超时，请再刷新试试",
                    hints: [{
                        text: "请检查您的网络是否连接正常"
                    }],
                    removeLoadding: newBox,
                    hide: true,
                    delayedShow: true
                }, box, callback);
            }
        });
    };
    //删除正在加载中
    Tool.removeLoadding = function (box, selfBox) {
        box = box || [".loadding-box"];
        Tool.loaddding({
            box: box || [".loadding-box"],
            selfBox: selfBox || [],
            status: "remove"
        });
        //删除超时会展示的提示文字
        for (var i = 0; i < box.length; i++) {
            $(box[i]).find(".nothing").remove();
        }
    };
    //btn处理
    Tool.btnStauts = function (data) {
        var self = this;
        self.init = function () {
            //设置状态
            self.common();
            //设置值
            if (data.val) {
                self.setValue(data.val);
            }
            //设置状态
            self[data.status]();
        };
        //还原
        self.common = function () {
            //设置状态
            $(data.box).removeClass("submit-save submit-success submit-error disabled").find("i").remove();
            if (data.common) {
                $(data.box).text(data.common);
            }
        };
        //保存中 
        self.save = function () {
            $(data.box).addClass("submit-save disabled");
        };
        //成功 
        self.success = function () {
            $(data.box).addClass("submit-success disabled").append("<i class='icon'>&#xe61c;</i>");
            self.callback();
        };
        //失败
        self.error = function () {
            $(data.box).addClass("submit-error disabled").append("<i class='icon'>&#xe607;</i>");
            self.callback();
        };
        //setValue  
        self.setValue = function (val) {
            $(data.box).text(val);
        };
        //回调  
        self.callback = function () {
            setTimeout(function () {
                self.common();
                if (data.callback) {
                    data.callback();
                }
            }, data.outTime || 1500);
        };
        self.init();
    };
    //btn提交等待中
    Tool.btnStautsBusy = function (text) {
        //按扭状态改变
        Tool.btnStauts({
            status: "save",
            box: ".btn-submit",
            val: text || "正在保存"
        });
    };
    //btn提交成功
    Tool.btnStautsSuccess = function (text, common, callback) {
        //按扭状态改变
        Tool.btnStauts({
            status: "success",
            box: ".btn-submit",
            common: common || "保存",
            val: text || "保存成功",
            callback: function () {
                if (callback) {
                    callback();
                }
            }
        });
    };
    //btn提交失败
    Tool.btnStautsError = function (text, common, callback) {
        //按扭状态改变
        Tool.btnStauts({
            status: "error",
            box: ".btn-submit",
            common: common || "保存",
            val: text || "保存失败",
            callback: function () {
                if (callback) {
                    callback();
                }
            }
        });
    };
    //提示框
    Tool.alertbox = function (data) {
        var self = this;
        self.init = function () {
            //添加基础容器
            self.addBox();
            //使用组件
            self.useComponent();
            //显示提示框
            self.show();
            //自动隐藏
            self.autoHide();
        };
        //添加基础容器
        self.addBox = function () {
            self.box = "alertbox" + $.now();
            $("body").append('<div class="alertbox ' + self.box + ' ' + data.box + '"><alertbox></alertbox></div> ')
        };
        //使用组件
        self.useComponent = function () {
            data.data.box = "." + self.box;
            component.alertbox(data.data);
            new Vue({
                el: '.' + self.box
            });
        };
        //show 
        self.show = function () {
            //延时展示 调用接口快的时候用上 
            if (data.delayShow) {
                setTimeout(function () {
                    $("." + self.box).animate({opacity: 1}, 200);
                }, data.delayTime || 200);
            } else {
                $("." + self.box).animate({opacity: 1}, 200);
            }
        };
        //自动隐藏      
        self.autoHide = function () {
            data.hideTime = data.hideTime || [2000, 200];
            if (data.autoHide) {
                clearTimeout(self.time);
                self.time = setTimeout(function () {
                    $("." + self.box).animate({opacity: 0}, data.hideTime[1], function () {
                        $(this).remove();
                    });
                }, data.hideTime[0]);
            }
        };
        self.init();
    };
    //提示框-成功
    Tool.alertboxSuccess = function (text) {
        Tool.alertbox({
            autoHide: true,
            data: {
                clickBGclose: false,
                statusShow: "success",
                hint: text || "保存成功"
            },
        });
    };
    //提示框-错误
    Tool.alertboxError = function (text) {
        //展示报错信息
        Tool.alertbox({
            autoHide: true,
            data: {
                clickBGclose: true,
                statusShow: "error",
                hint: text || "保存失败"
            },
        });
    };
    //提示框-警告
    Tool.alertboxWarning = function (text, autoHide, clickBGclose) {
        autoHide = autoHide || true;
        clickBGclose = clickBGclose || true;
        //提示框 
        Tool.alertbox({
            autoHide: autoHide,
            data: {
                clickBGclose: clickBGclose,
                statusShow: "warning",
                hint: text || "警告"
            },
        });
    };
    //位置信息
    Tool.location = function (list) {
        // 创建位置
        component.location({
            list: list
        });
        new Vue({
            el: '.location'
        });
    };
    //搜索
    Tool.search = function (data, methods) {
        component.search(data, methods);
        new Vue({
            el: '.search'
        });
    };
    //无结果
    Tool.nothing = function (data, box, callback) {
        callback = callback || function () {
            };
        var $nothing;
        //添加nothing标签
        if (box && box.length) {
            for (var i = 0; i < box.length; i++) {
                $nothing = "nothing" + $.now() + i;
                $(box[i]).append('<div class="nothing ' + $nothing + '"><nothing></nothing></div>');
                component.nothing(data);
                new Vue({
                    el: "." + $nothing
                });
            }
            callback();
            return;
        } else {
            $nothing = "nothing" + $.now();
            $(".info-table-box").append('<div class="nothing ' + $nothing + '"><nothing></nothing></div>');
        }
        component.nothing(data);
        new Vue({
            el: "." + $nothing
        });
        callback();
    };
    //返回报错信息
    Tool.showErrorMsg = function (val, box) {
        //没有结果
        $(box || '.info-table-box').html("");
        Tool.nothing({
            question: val || "", hints: []
        }, [box || '.info-table-box']);
    };
    //页码 
    Tool.page = function (info, changePage) {
        $(".page").html("<page></page>");
        // 创建搜索
        component.page(info, {
            changePage: function (num) {
                changePage(num);
            }
        });
        new Vue({
            el: '.page'
        });
    };
    //分类
    Tool.category = function (info, methods) {
        component.category(info, methods);
        new Vue({
            el: '.category'
        });
    };
    //获取整十
    Tool.tenNum = function (val) {
        val += "";
        if (val.length === 1) {
            return 0 + val;
        } else {


            return val;
        }
    };
    //获取时间
    Tool.getTime = function (n) {
        var now = new Date;
        now.setDate(now.getDate() - n);
        return now;
    };
    //获取时间日期  
    Tool.getTimeDate = function (date) {
        var time = Tool.getTime(date);
        return Tool.tenNum(time.getFullYear()) + "-" + Tool.tenNum((time.getMonth() + 1)) + "-" + Tool.tenNum(time.getDate());
    };
    //获取next时间
    Tool.getNextTime = function (str) {
        var date = new Date(str);
        date.setDate(date.getDate() + 1);
        return Tool.tenNum(date.getFullYear()) + "-" + Tool.tenNum((date.getMonth() + 1)) + "-" + Tool.tenNum(date.getDate());
    };
    //获取现在月份至之后
    Tool.getNowMonthAndAfter = function () {
        var time = new Date(),
            nowMonth = time.getMonth() + 1,
            month = [];
        for (var i = 1; i < 12; i++) {
            var val = nowMonth + i;
            month.push((val > 12 ? val % 12 : val) + "月");
        }
        month.push(nowMonth + "月");
        return month;
    };
    return Tool;
});    
define('text!../tpl/public/header.html',[],function () { return '<!--公用头部-->\r\n<header id="header">\r\n    <h1 id="LOGO"><a href="javascript:void(0)"><img src="../../images/public/LOGO.png"></a></h1>\r\n    <!--用户信息-->\r\n    <div class="user-info">\r\n        <a href="javascript:void(0)">\r\n            <i class="icon icon-user">&#xe600;</i>\r\n            <strong class="name"><span class="pr5">{{name}}</span><i class="icon icon-arrow">&#xe602;</i></strong>\r\n        </a>\r\n        <!--工具-->\r\n        <ul class="tools">\r\n            <li v-show="username != \'admin\'">\r\n                <a href="{{tools.editPassword.href}}">\r\n                    <i class="icon">{{{tools.editPassword.icon}}}</i>\r\n                    <h5>{{tools.editPassword.text}}</h5>\r\n                </a>\r\n            </li>\r\n            <li v-on:click="userLogout">\r\n                <a href="{{tools.logout.href}}">\r\n                    <i class="icon">{{{tools.logout.icon}}}</i>\r\n                    <h5>{{tools.logout.text}}</h5>\r\n                </a>\r\n            </li>\r\n        </ul>\r\n    </div>\r\n</header>\r\n';});

define('text!../tpl/public/nav.html',[],function () { return '<!--公用头部-->\r\n<nav id="nav">\r\n    <ul> \r\n        <li v-for="(index, val) in navData" v-if="val.show!=false" class="{{val.active}}">\r\n            <h3 v-on:click="clickList($event)" class="caption">\r\n                <i class="icon" v-if="index == 3"><img src="/images/public/icon-sale-before.png"/></i>\r\n                <i class="icon" v-if="index == 4"><img src="/images/public/icon-sale.png"/></i>\r\n                <i class="icon" v-if="index != 3 && index != 4">{{{val.icon}}}</i>{{val.title}}\r\n                <i class="icon icon-arrow">&#xe604;</i>\r\n            </h3>\r\n            <!--二级菜单-->\r\n            <ul class="sub-nav {{val.active&&\'show\'}}">\r\n                <li v-for="subVal in val.subVal" v-if="subVal.show!=false" class="{{subVal.active}} {{subVal.class}}">\r\n                    <h4><a href="{{subVal.href}}">{{subVal.title}}</a></h4>\r\n                </li>\r\n            </ul>\r\n        </li>\r\n    </ul>\r\n</nav>';});

define('publicHtml',['Tool', 'text!../tpl/public/header.html', 'text!../tpl/public/nav.html'], function (Tool, header, nav) {
    if ($("#login").length) {
        return;
    }
    var init = {
        default: function () {
            init.base();
            init.nav();
            init.header();
            init.event();
        },
        base: function () {
            //导入html
            $("body").prepend(nav);
            $("body").prepend(header);

            //nav菜单高度
            $(window).bind("resize", function () {
                var H = $(window).height(),
                    $header = $("#header").height();
                $("#nav>ul").css({height: H - $header});
            }).trigger("resize");

            //admin用户
            if (localStorage.username == "admin") {
                $(".name").find(">span").text("admin");
            }
        },
        nav: function () {
            //菜单信息
            new Vue({
                el: '#nav',
                //数据
                data: {
                    navData: [
                        {
                            icon: '&#xe62b;',
                            title: "设备地图",
                            show: localStorage.permissions.indexOf(",device:map,") > -1 ? true : false,
                            active: $("#map").length && "active",
                            subVal: [
                                {
                                    href: "/html/map/device-map.html",
                                    title: "设备地图",
                                    show: localStorage.permissions.indexOf(",device:map,") > -1 ? true : false,
                                    active: $(".map-index").length && "active"
                                }
                            ]
                        },
                        {
                            icon: '&#xe616;',
                            title: "系统管理",
                            active: $("#system-manage").length && "active",
                            show: localStorage.permissions.indexOf(",sys,") > -1 ? true : false,
                            subVal: [
                                {
                                    href: "/html/system-manage/role.html",
                                    title: "角色管理",
                                    show: localStorage.permissions.indexOf(",sys:role,") > -1 ? true : false,
                                    class: "system-manage-role",
                                    active: $(".system-manage-role").length && "active"
                                },
                                {
                                    href: "/html/system-manage/user.html",
                                    title: "用户管理",
                                    show: localStorage.permissions.indexOf(",sys:user,") > -1 ? true : false,
                                    class: "system-manage-user",
                                    active: $(".system-manage-user").length && "active"
                                }
                            ]
                        },
                        {
                            icon: '&#xe608;',
                            title: "经销商管理",
                            show: localStorage.permissions.indexOf(",dealer,") > -1 ? true : false,
                            active: $("#system-dealer").length && "active",
                            subVal: [
                                {
                                    href: "/html/system-dealer/retail.html",
                                    title: "零售经销商",
                                    show: localStorage.permissions.indexOf(",dealer:retail,") > -1 ? true : false,
                                    class: "system-dealer-retail",
                                    active: $(".system-dealer-retail").length && "active"
                                },
                                {
                                    href: "/html/system-dealer/trade.html",
                                    title: "行业经销商",
                                    show: localStorage.permissions.indexOf(",dealer:industry,") > -1 ? true : false,
                                    class: "system-dealer-trade",
                                    active: $(".system-dealer-trade").length && "active"
                                }
                            ]
                        },
                        {
                            icon: '&#xe615;',
                            title: "售前设备",
                            show: localStorage.permissions.indexOf(",device:pre,") > -1 ? true : false,
                            active: $("#pre-sales").length && "active",
                            subVal: [
                                {
                                    href: "/html/pre-sales/device.html",
                                    title: "设备分类",
                                    show: localStorage.permissions.indexOf(",device:category,") > -1 ? true : false,
                                    active: $(".pre-sales-device").length && "active"
                                },
                                {
                                    href: "/html/pre-sales/manufacturer.html",
                                    title: "生产厂商",
                                    show: localStorage.permissions.indexOf(",device:factory,") > -1 ? true : false,
                                    active: $(".pre-sales-manufacturer").length && "active"
                                },
                                {
                                    href: "/html/pre-sales/batch-list.html",
                                    title: "批次管理",
                                    show: localStorage.permissions.indexOf(",device:batch,") > -1 ? true : false,
                                    active: $(".pre-sales-batch-list").length && "active"
                                }

                            ]
                        },
                        {
                            icon: '&#xe615;',
                            title: "售后设备",
                            show: localStorage.permissions.indexOf(",device:after,") > -1 ? true : false,
                            active: $("#sell-after").length && "active",
                            subVal: [
                                {
                                    href: "/html/sell-after/order.html",
                                    title: "订单管理",
                                    show: localStorage.permissions.indexOf(",device:order,") > -1 ? true : false,
                                    active: $(".sell-after-order").length && "active"
                                },
                                {
                                    href: "/html/sell-after/device.html",
                                    title: "设备管理",
                                    show: localStorage.permissions.indexOf(",device:mgr,") > -1 ? true : false,
                                    active: $(".sell-after-device").length && "active"
                                },
                                {
                                    href: "/html/sell-after/school-device.html",
                                    title: "校园新风",
                                    show: localStorage.permissions.indexOf(",device:school,") > -1 ? true : false,
                                    active: $(".sell-after-school-device").length && "active"
                                }
                            ]
                        },
                        {
                            icon: '&#xe60b;',
                            title: "设备用户",
                            show: localStorage.permissions.indexOf(",device:user,") > -1 ? true : false,
                            active: $("#user").length && "active",
                            subVal: [
                                {
                                    href: "/html/user/device-user.html",
                                    title: "设备用户",
                                    show: localStorage.permissions.indexOf(",device:user,") > -1 ? true : false,
                                    active: $(".user-device-user").length && "active"
                                }
                            ]
                        },
                        {
                            icon: '&#xe61d;',
                            title: "数据统计",
                            show: (localStorage.permissions.indexOf(",statistics:general,") > -1 || localStorage.permissions.indexOf(",statistics:dealer:general,") > -1 || localStorage.permissions.indexOf(",statistics:school,") > -1) ? true : false,
                            active: $("#data-count").length && "active",
                            subVal: [
                                {
                                    href: "/html/data-count/index.html",
                                    title: "数据统计",
                                    show: localStorage.permissions.indexOf(",statistics:general,") > -1 ? true : false,
                                    active: $(".data-count-index").length && "active"
                                },
                                {
                                    href: "/html/data-count/data-system-dealer.html",
                                    title: "数据统计",
                                    show: localStorage.permissions.indexOf(",statistics:dealer:general,") > -1 ? true : false,
                                    active: $(".data-count-system-dealer").length && "active"
                                },
                                {
                                    href: "/html/data-count/school.html",
                                    title: "校园新风",
                                    show: localStorage.permissions.indexOf(",statistics:school,") > -1 ? true : false,
                                    active: $(".data-count-school").length && "active"
                                }
                            ]
                        },
                        {
                            icon: '&#xe60c;',
                            title: "生产批次",
                            show: localStorage.permissions.indexOf(",batch,") > -1 ? true : false,
                            active: $("#yield-batch").length && "active",
                            subVal: [
                                {
                                    href: "/html/yield-batch/list.html",
                                    title: "生产批次",
                                    show: localStorage.permissions.indexOf(",batch,") > -1 ? true : false,
                                    active: $(".yield-batch-list").length && "active"
                                }
                            ]
                        }
                    ]
                },
                created: function () {

                },
                //方法
                methods: {
                    login: function () {
                        location.href = "/html/map/device-map.html";
                    },
                    clickList: function (event) {
                        //var height = event.target.nextElementSibling.scrollHeight;
                        //var count = event.target.nextElementSibling.childElementCount;
                    }
                }
            });
        },
        header: function () {
            //头部信息
            new Vue({
                el: '#header',
                //数据
                data: {
                    name: localStorage.name || "",
                    username: localStorage.username,
                    tools: {
                        editPassword: {
                            href: "/html/user/editPassword.html",
                            icon: "&#xe61f;",
                            text: "修改密码"
                        },
                        logout: {
                            href: "javascript:void(0)",
                            icon: "&#xe61e;",
                            text: "退出"
                        }
                    }
                },
                methods: {
                    //退出登录
                    userLogout: function () {
                        $.ajax({
                            url: API.logout,
                            type: "POST",
                            success: function () {
                                location.href = "/html/login/login.html";
                            },
                            error: function (resp) {
                                console.log(resp, '失败')
                            }
                        });
                    }
                }
            });
        },
        event: function () {
            //展开菜单
            $("body").on("click", "#nav>ul>li:not(.active)", function () {
                var $li = $(this).find("li"),
                    $len = $li.length,
                    $height = $li.height();
                $(this).addClass("active").find(".sub-nav").stop(true).slideDown();
                $(this).siblings("li").removeClass("active").find(".sub-nav").stop(true).slideUp();
            });
            //收缩菜单
            $("body").on("click", "#nav>ul>li.active .caption", function () {
                var $li = $(this).closest("li");
                $li.removeClass("active").find(".sub-nav").stop(true).slideUp();
            });
        }
    };
    init.default();
});
define('RegEx',[],function(){
    window.RegEx = {
        //手机正则表达式
        regExpPhone : function(val) {
            //return val.length==11?true:false;
            return /^1[34578]\d{9}$/.test(val) ? true : false;
        },
        //邮箱正则表达式
        RegExpEmail : function(val) {
            return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(val) ? true : false;
        },
        //验证密码
        RegExpPassword : function(val) {
            return /^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~\_\-]{6,16}$/.test(val) ? true : false;
        },
        //正整数
        RegExpInteger : function(val){
            return /^[1-9]\d*$/.test(val) ? true : false;
        },
        //正数
        RegExpPositive : function(val){
            return /^[+]?[\d]+(([\.]{1}[\d]+)|([\d]*))$/.test(val) ? true : false;
        }, 
        //验证日期
        RegExpDate : function(val){
             return /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))$/.test(val); 
        }, 
        
    };
});
require([
    //优先级高
    'component',

    //插件
    'underscore',
    'text', 
    'jquery',
    'md5',
    // 'selectordie',

    //公用js
    'ajaxAPI',    
    'base',
    'form',
    'Check',
    'Tool',
    'publicHtml',
    'RegEx'
]); 
define("common_main", function(){});

require.config({
    paths: {
        //插件
        dateTimePicker: '/js/plugIn/jquery.datetimepicker.full.min',
        numRun: '/js/plugIn/animateBackground-plugin',
        selectordie: './plugIn/selectordie.min',
        underscore: './plugIn/underscore-min',
        jquery: './plugIn/jquery-1.11.3.min',
        echarts: '/js/plugIn/echarts.min',
        text: './plugIn/require.text',
        Vue: './plugIn/vue',
        md5: './plugIn/md5',

        //公用js
        publicHtml: './public/publicHtml',
        component: "./public/component",
        ajaxAPI: "./public/ajaxAPI",
        Check: './public/Check',
        RegEx: "./public/RegEx",
        Tool: './public/Tool',
        base: './public/base',
        form: './public/form'
    },
    shim: {
        'jquery': {
            exports: 'jquery'
        },
        'template': {
            exports: 'template'
        }
    },
    waitSeconds: 0
});
define("config", function(){});
