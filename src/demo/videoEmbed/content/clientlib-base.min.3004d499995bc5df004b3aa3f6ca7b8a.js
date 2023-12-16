

// ----------------------------------------------------------------------------
// Custom Polyfills for AEM Core Component - Data Layer
// ----------------------------------------------------------------------------

if (window.NodeList && !NodeList.prototype.forEach) {
	NodeList.prototype.forEach = Array.prototype.forEach;
}


/* Polyfill service v3.16.0
 * For detailed credits and licence information see https://github.com/financial-times/polyfill-service.
 *
 * UA detected: ie/11.0.0
 * Features requested: default
 *
 * - Array.from, License: CC0 (required by "default")
 * - Array.of, License: MIT (required by "default")
 * - Array.prototype.fill, License: CC0 (required by "default")
 * - Event, License: CC0 (required by "default", "CustomEvent", "Promise")
 * - CustomEvent, License: CC0 (required by "default")
 * - _DOMTokenList, License: CC0 (required by "DOMTokenList", "default")
 * - DOMTokenList, License: CC0 (required by "default")
 * - _mutation, License: CC0 (required by "Element.prototype.after", "default", "Element.prototype.append", "Element.prototype.before", "Element.prototype.prepend", "Element.prototype.remove", "Element.prototype.replaceWith")
 * - Element.prototype.after, License: CC0 (required by "default")
 * - Element.prototype.append, License: CC0 (required by "default")
 * - Element.prototype.before, License: CC0 (required by "default")
 * - Element.prototype.matches, License: CC0 (required by "default", "Element.prototype.closest")
 * - Element.prototype.closest, License: CC0 (required by "default")
 * - Element.prototype.prepend, License: CC0 (required by "default")
 * - Element.prototype.remove, License: CC0 (required by "default")
 * - Element.prototype.replaceWith, License: CC0 (required by "default")
 * - Symbol, License: MIT (required by "Map", "default", "Set", "Symbol.iterator", "Symbol.species")
 * - Symbol.iterator, License: MIT (required by "Map", "default", "Set")
 * - Symbol.species, License: MIT (required by "Map", "default", "Set")
 * - Number.isNaN, License: MIT (required by "default", "Map", "Set")
 * - Map, License: CC0 (required by "default")
 * - Node.prototype.contains, License: CC0 (required by "default")
 * - Object.assign, License: CC0 (required by "default")
 * - Promise, License: MIT (required by "default")
 * - Set, License: CC0 (required by "default")
 * - String.prototype.endsWith, License: CC0 (required by "default")
 * - String.prototype.includes, License: CC0 (required by "default")
 * - String.prototype.startsWith, License: CC0 (required by "default")
 * - URL, License: CC0 (required by "default") */

(function(undefined) {

// Array.from

// Wrapped in IIFE to prevent leaking to global scope.
(function () {
	function parseIterable (arraylike) {
		var done = false;
		var iterableResponse;
		var tempArray = [];

		// if the iterable doesn't have next;
		// it is an iterable if 'next' is a function but it has not been defined on
		// the object itself.
		if (typeof arraylike.next === 'function') {
			while (!done) {
				iterableResponse = arraylike.next();
				if (
					iterableResponse.hasOwnProperty('value') &&
					iterableResponse.hasOwnProperty('done')
				) {
					if (iterableResponse.done === true) {
						done = true;
						break;

					// handle the case where the done value is not Boolean
					} else if (iterableResponse.done !== false) {
						break;
					}

					tempArray.push(iterableResponse.value);
				} else {

					// it does not conform to the iterable pattern
					break;
				}
			}
		}

		if (done) {
			return tempArray;
		} else {

			// something went wrong return false;
			return false;
		}

	}

	Object.defineProperty(Array, 'from', {
		configurable: true,
		value: function from(source) {
			// handle non-objects
			if (source === undefined || source === null) {
				throw new TypeError(source + ' is not an object');
			}

			// handle maps that are not functions
			if (1 in arguments && !(arguments[1] instanceof Function)) {
				throw new TypeError(arguments[1] + ' is not a function');
			}

			var arraylike = typeof source === 'string' ? source.split('') : Object(source);
			var map = arguments[1];
			var scope = arguments[2];
			var array = [];
			var index = -1;
			var length = Math.min(Math.max(Number(arraylike.length) || 0, 0), 9007199254740991);
			var value;

			// variables for rebuilding array from iterator
			var arrayFromIterable;

			// if it is an iterable treat like one
			arrayFromIterable = parseIterable(arraylike);

			//if it is a Map or a Set then handle them appropriately
			if (
				typeof arraylike.entries === 'function' &&
				typeof arraylike.values === 'function'
			) {
				if (arraylike.constructor.name === 'Set' && 'values' in Set.prototype) {
					arrayFromIterable = parseIterable(arraylike.values());
				}
				if (arraylike.constructor.name === 'Map' && 'entries' in Map.prototype) {
					arrayFromIterable = parseIterable(arraylike.entries());
				}
			}

			if (arrayFromIterable) {
				arraylike = arrayFromIterable;
				length = arrayFromIterable.length;
			}

			while (++index < length) {
					value = arraylike[index];

					array[index] = map ? map.call(scope, value, index) : value;
			}

			array.length = length;

			return array;
		},
		writable: true
	});
}());

// Array.of
/*! https://mths.be/array-of v0.1.0 by @mathias */
(function () {
	'use strict';
	var defineProperty = (function () {
		// IE 8 only supports `Object.defineProperty` on DOM elements
		try {
			var object = {};
			var $defineProperty = Object.defineProperty;
			var result = $defineProperty(object, object, object) && $defineProperty;
		} catch (error) { /**/ }
		return result;
	}());
	var isConstructor = function isConstructor(Constructor) {
		try {
			return !!new Constructor();
		} catch (_) {
			return false;
		}
	};
	var of = function of() {
		var items = arguments;
		var length = items.length;
		var Me = this;
		var result = isConstructor(Me) ? new Me(length) : new Array(length);
		var index = 0;
		var value;
		while (index < length) {
			value = items[index];
			if (defineProperty) {
				defineProperty(result, index, {
					'value': value,
					'writable': true,
					'enumerable': true,
					'configurable': true
				});
			} else {
				result[index] = value;
			}
			index += 1;
		}
		result.length = length;
		return result;
	};
	if (defineProperty) {
		defineProperty(Array, 'of', {
			'value': of,
			'configurable': true,
			'writable': true
		});
	} else {
		Array.of = of;
	}
}());

// Array.prototype.fill
Object.defineProperty(Array.prototype, 'fill', {
	configurable: true,
	value: function fill(value) {
		if (this === undefined || this === null) {
			throw new TypeError(this + ' is not an object');
		}

		var arrayLike = Object(this);

		var length = Math.max(Math.min(arrayLike.length, 9007199254740991), 0) || 0;

		var relativeStart = 1 in arguments ? parseInt(Number(arguments[1]), 10) || 0 : 0;

		relativeStart = relativeStart < 0 ? Math.max(length + relativeStart, 0) : Math.min(relativeStart, length);

		var relativeEnd = 2 in arguments && arguments[2] !== undefined ? parseInt(Number(arguments[2]), 10) || 0 : length;

		relativeEnd = relativeEnd < 0 ? Math.max(length + arguments[2], 0) : Math.min(relativeEnd, length);

		while (relativeStart < relativeEnd) {
			arrayLike[relativeStart] = value;

			++relativeStart;
		}

		return arrayLike;
	},
	writable: true
});

// Event
(function () {
	var unlistenableWindowEvents = {
		click: 1,
		dblclick: 1,
		keyup: 1,
		keypress: 1,
		keydown: 1,
		mousedown: 1,
		mouseup: 1,
		mousemove: 1,
		mouseover: 1,
		mouseenter: 1,
		mouseleave: 1,
		mouseout: 1,
		storage: 1,
		storagecommit: 1,
		textinput: 1
	};

	function indexOf(array, element) {
		var
		index = -1,
		length = array.length;

		while (++index < length) {
			if (index in array && array[index] === element) {
				return index;
			}
		}

		return -1;
	}

	var existingProto = (window.Event && window.Event.prototype) || null;
	window.Event = Window.prototype.Event = function Event(type, eventInitDict) {
		if (!type) {
			throw new Error('Not enough arguments');
		}

		// Shortcut if browser supports createEvent
		if ('createEvent' in document) {
			var event = document.createEvent('Event');
			var bubbles = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false;
			var cancelable = eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : false;

			event.initEvent(type, bubbles, cancelable);

			return event;
		}

		var event = document.createEventObject();

		event.type = type;
		event.bubbles = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false;
		event.cancelable = eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : false;

		return event;
	};
	if (existingProto) {
		Object.defineProperty(window.Event, 'prototype', {
			configurable: false,
			enumerable: false,
			writable: true,
			value: existingProto
		});
	}

	if (!('createEvent' in document)) {
		window.addEventListener = Window.prototype.addEventListener = Document.prototype.addEventListener = Element.prototype.addEventListener = function addEventListener() {
			var
			element = this,
			type = arguments[0],
			listener = arguments[1];

			if (element === window && type in unlistenableWindowEvents) {
				throw new Error('In IE8 the event: ' + type + ' is not available on the window object. Please see https://github.com/Financial-Times/polyfill-service/issues/317 for more information.');
			}

			if (!element._events) {
				element._events = {};
			}

			if (!element._events[type]) {
				element._events[type] = function (event) {
					var
					list = element._events[event.type].list,
					events = list.slice(),
					index = -1,
					length = events.length,
					eventElement;

					event.preventDefault = function preventDefault() {
						if (event.cancelable !== false) {
							event.returnValue = false;
						}
					};

					event.stopPropagation = function stopPropagation() {
						event.cancelBubble = true;
					};

					event.stopImmediatePropagation = function stopImmediatePropagation() {
						event.cancelBubble = true;
						event.cancelImmediate = true;
					};

					event.currentTarget = element;
					event.relatedTarget = event.fromElement || null;
					event.target = event.target || event.srcElement || element;
					event.timeStamp = new Date().getTime();

					if (event.clientX) {
						event.pageX = event.clientX + document.documentElement.scrollLeft;
						event.pageY = event.clientY + document.documentElement.scrollTop;
					}

					while (++index < length && !event.cancelImmediate) {
						if (index in events) {
							eventElement = events[index];

							if (indexOf(list, eventElement) !== -1 && typeof eventElement === 'function') {
								eventElement.call(element, event);
							}
						}
					}
				};

				element._events[type].list = [];

				if (element.attachEvent) {
					element.attachEvent('on' + type, element._events[type]);
				}
			}

			element._events[type].list.push(listener);
		};

		window.removeEventListener = Window.prototype.removeEventListener = Document.prototype.removeEventListener = Element.prototype.removeEventListener = function removeEventListener() {
			var
			element = this,
			type = arguments[0],
			listener = arguments[1],
			index;

			if (element._events && element._events[type] && element._events[type].list) {
				index = indexOf(element._events[type].list, listener);

				if (index !== -1) {
					element._events[type].list.splice(index, 1);

					if (!element._events[type].list.length) {
						if (element.detachEvent) {
							element.detachEvent('on' + type, element._events[type]);
						}
						delete element._events[type];
					}
				}
			}
		};

		window.dispatchEvent = Window.prototype.dispatchEvent = Document.prototype.dispatchEvent = Element.prototype.dispatchEvent = function dispatchEvent(event) {
			if (!arguments.length) {
				throw new Error('Not enough arguments');
			}

			if (!event || typeof event.type !== 'string') {
				throw new Error('DOM Events Exception 0');
			}

			var element = this, type = event.type;

			try {
				if (!event.bubbles) {
					event.cancelBubble = true;

					var cancelBubbleEvent = function (event) {
						event.cancelBubble = true;

						(element || window).detachEvent('on' + type, cancelBubbleEvent);
					};

					this.attachEvent('on' + type, cancelBubbleEvent);
				}

				this.fireEvent('on' + type, event);
			} catch (error) {
				event.target = element;

				do {
					event.currentTarget = element;

					if ('_events' in element && typeof element._events[type] === 'function') {
						element._events[type].call(element, event);
					}

					if (typeof element['on' + type] === 'function') {
						element['on' + type].call(element, event);
					}

					element = element.nodeType === 9 ? element.parentWindow : element.parentNode;
				} while (element && !event.cancelBubble);
			}

			return true;
		};

		// Add the DOMContentLoaded Event
		document.attachEvent('onreadystatechange', function() {
			if (document.readyState === 'complete') {
				document.dispatchEvent(new Event('DOMContentLoaded', {
					bubbles: true
				}));
			}
		});
	}
}());

// CustomEvent
this.CustomEvent = function CustomEvent(type, eventInitDict) {
	if (!type) {
		throw Error('TypeError: Failed to construct "CustomEvent": An event name must be provided.');
	}

	var event;
	eventInitDict = eventInitDict || {bubbles: false, cancelable: false, detail: null};

	if ('createEvent' in document) {
		try {
			event = document.createEvent('CustomEvent');
			event.initCustomEvent(type, eventInitDict.bubbles, eventInitDict.cancelable, eventInitDict.detail);
		} catch (error) {
			// for browsers which don't support CustomEvent at all, we use a regular event instead
			event = document.createEvent('Event');
			event.initEvent(type, eventInitDict.bubbles, eventInitDict.cancelable);
			event.detail = eventInitDict.detail;
		}
	} else {

		// IE8
		event = new Event(type, eventInitDict);
		event.detail = eventInitDict && eventInitDict.detail || null;
	}
	return event;
};

CustomEvent.prototype = Event.prototype;

// _DOMTokenList
var _DOMTokenList = (function () { // eslint-disable-line no-unused-vars

	function tokenize(token) {
		if (/^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/.test(token)) {
			return String(token);
		} else {
			throw new Error('InvalidCharacterError: DOM Exception 5');
		}
	}

	function toObject(self) {
		for (var index = -1, object = {}, element; element = self[++index];) {
			object[element] = true;
		}

		return object;
	}

	function fromObject(self, object) {
		var array = [], token;

		for (token in object) {
			if (object[token]) {
				array.push(token);
			}
		}

		[].splice.apply(self, [0, self.length].concat(array));
	}

	var DTL = function() {};

	DTL.prototype = {
		constructor: DTL,
		item: function item(index) {
			return this[parseFloat(index)] || null;
		},
		length: Array.prototype.length,
		toString: function toString() {
			return [].join.call(this, ' ');
		},

		add: function add() {
			for (var object = toObject(this), index = 0, token; index in arguments; ++index) {
				token = tokenize(arguments[index]);

				object[token] = true;
			}

			fromObject(this, object);
		},
		contains: function contains(token) {
			return token in toObject(this);
		},
		remove: function remove() {
			for (var object = toObject(this), index = 0, token; index in arguments; ++index) {
				token = tokenize(arguments[index]);

				object[token] = false;
			}

			fromObject(this, object);
		},
		toggle: function toggle(token) {
			var
			object = toObject(this),
			contains = 1 in arguments ? !arguments[1] : tokenize(token) in object;

			object[token] = !contains;

			fromObject(this, object);

			return !contains;
		}
	};

	return DTL;

}());

// DOMTokenList
(function (global) {
	var nativeImpl = "DOMTokenList" in global && global.DOMTokenList;

	if (!nativeImpl) {
		global.DOMTokenList = _DOMTokenList;
	} else {
		var NativeToggle = nativeImpl.prototype.toggle;

		nativeImpl.prototype.toggle = function toggle(token) {
			if (1 in arguments) {
				var contains = this.contains(token);
				var force = !!arguments[1];

				if ((contains && force) || (!contains && !force)) {
					return force;
				}
			}

			return NativeToggle.call(this, token);
		};

	}

}(this));

// _mutation
// http://dom.spec.whatwg.org/#mutation-method-macro
function _mutation(nodes) { // eslint-disable-line no-unused-vars
	if (!nodes.length) {
		throw new Error('DOM Exception 8');
	} else if (nodes.length === 1) {
		return typeof nodes[0] === 'string' ? document.createTextNode(nodes[0]) : nodes[0];
	} else {
		var
		fragment = document.createDocumentFragment(),
		length = nodes.length,
		index = -1,
		node;

		while (++index < length) {
			node = nodes[index];

			fragment.appendChild(typeof node === 'string' ? document.createTextNode(node) : node);
		}

		return fragment;
	}
}

// Element.prototype.after
Document.prototype.after = Element.prototype.after = function after() {
	if (this.parentNode) {
		this.parentNode.insertBefore(_mutation(arguments), this.nextSibling);
	}
};

// Not all UAs support the Text constructor.  Polyfill on the Text constructor only where it exists
// TODO: Add a polyfill for the Text constructor, and make it a dependency of this polyfill.
if ("Text" in this) {
	Text.prototype.after = Element.prototype.after;
}

// Element.prototype.append
Document.prototype.append = Element.prototype.append = function append() {
	this.appendChild(_mutation(arguments));
};

// Element.prototype.before
Document.prototype.before = Element.prototype.before = function before() {
	if (this.parentNode) {
		this.parentNode.insertBefore(_mutation(arguments), this);
	}
};

// Not all UAs support the Text constructor.  Polyfill on the Text constructor only where it exists
// TODO: Add a polyfill for the Text constructor, and make it a dependency of this polyfill.
if ("Text" in this) {
	Text.prototype.before = Element.prototype.before;
}

// Element.prototype.matches
Element.prototype.matches = Element.prototype.webkitMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector || function matches(selector) {

	var element = this;
	var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
	var index = 0;

	while (elements[index] && elements[index] !== element) {
		++index;
	}

	return !!elements[index];
};

// Element.prototype.closest
Element.prototype.closest = function closest(selector) {
	var node = this;

	while (node) {
		if (node.matches(selector)) return node;
		else node = node.parentElement;
	}

	return null;
};

// Element.prototype.prepend
Document.prototype.prepend = Element.prototype.prepend = function prepend() {
	this.insertBefore(_mutation(arguments), this.firstChild);
};

// Element.prototype.remove
Document.prototype.remove = Element.prototype.remove = function remove() {
	if (this.parentNode) {
		this.parentNode.removeChild(this);
	}
};

// Not all UAs support the Text constructor.  Polyfill on the Text constructor only where it exists
// TODO: Add a polyfill for the Text constructor, and make it a dependency of this polyfill.
if ("Text" in this) {
	Text.prototype.remove = Element.prototype.remove;
}

// Element.prototype.replaceWith
Document.prototype.replaceWith = Element.prototype.replaceWith = function replaceWith() {
	if (this.parentNode) {
		this.parentNode.replaceChild(_mutation(arguments), this);
	}
};

// Not all UAs support the Text constructor.  Polyfill on the Text constructor only where it exists
// TODO: Add a polyfill for the Text constructor, and make it a dependency of this polyfill.
if ('Text' in this) {
	Text.prototype.replaceWith = Element.prototype.replaceWith;
}

// Symbol
// A modification of https://github.com/WebReflection/get-own-property-symbols
// (C) Andrea Giammarchi - MIT Licensed

(function (Object, GOPS, global) {

	var	setDescriptor;
	var id = 0;
	var random = '' + Math.random();
	var prefix = '__\x01symbol:';
	var prefixLength = prefix.length;
	var internalSymbol = '__\x01symbol@@' + random;
	var DP = 'defineProperty';
	var DPies = 'defineProperties';
	var GOPN = 'getOwnPropertyNames';
	var GOPD = 'getOwnPropertyDescriptor';
	var PIE = 'propertyIsEnumerable';
	var ObjectProto = Object.prototype;
	var hOP = ObjectProto.hasOwnProperty;
	var pIE = ObjectProto[PIE];
	var toString = ObjectProto.toString;
	var concat = Array.prototype.concat;
	var cachedWindowNames = typeof window === 'object' ? Object.getOwnPropertyNames(window) : [];
	var nGOPN = Object[GOPN];
	var gOPN = function getOwnPropertyNames (obj) {
		if (toString.call(obj) === '[object Window]') {
			try {
				return nGOPN(obj);
			} catch (e) {
				// IE bug where layout engine calls userland gOPN for cross-domain `window` objects
				return concat.call([], cachedWindowNames);
			}
		}
		return nGOPN(obj);
	};
	var gOPD = Object[GOPD];
	var create = Object.create;
	var keys = Object.keys;
	var freeze = Object.freeze || Object;
	var defineProperty = Object[DP];
	var $defineProperties = Object[DPies];
	var descriptor = gOPD(Object, GOPN);
	var addInternalIfNeeded = function (o, uid, enumerable) {
		if (!hOP.call(o, internalSymbol)) {
			try {
				defineProperty(o, internalSymbol, {
					enumerable: false,
					configurable: false,
					writable: false,
					value: {}
				});
			} catch (e) {
				o.internalSymbol = {};
			}
		}
		o[internalSymbol]['@@' + uid] = enumerable;
	};
	var createWithSymbols = function (proto, descriptors) {
		var self = create(proto);
		gOPN(descriptors).forEach(function (key) {
			if (propertyIsEnumerable.call(descriptors, key)) {
				$defineProperty(self, key, descriptors[key]);
			}
		});
		return self;
	};
	var copyAsNonEnumerable = function (descriptor) {
		var newDescriptor = create(descriptor);
		newDescriptor.enumerable = false;
		return newDescriptor;
	};
	var get = function get(){};
	var onlyNonSymbols = function (name) {
		return name != internalSymbol &&
			!hOP.call(source, name);
	};
	var onlySymbols = function (name) {
		return name != internalSymbol &&
			hOP.call(source, name);
	};
	var propertyIsEnumerable = function propertyIsEnumerable(key) {
		var uid = '' + key;
		if(this[internalSymbol] == undefined){
			return pIE.call(this, key);
		}
		return onlySymbols(uid) ? (
			hOP.call(this, uid) &&
			this[internalSymbol]['@@' + uid]
		) : pIE.call(this, key);
	};
	var setAndGetSymbol = function (uid) {
		var descriptor = {
			enumerable: false,
			configurable: true,
			get: get,
			set: function (value) {
			setDescriptor(this, uid, {
				enumerable: false,
				configurable: true,
				writable: true,
				value: value
			});
			addInternalIfNeeded(this, uid, true);
			}
		};
		try {
			defineProperty(ObjectProto, uid, descriptor);
		} catch (e) {
			ObjectProto[uid] = descriptor.value;
		}
		return freeze(source[uid] = defineProperty(
			Object(uid),
			'constructor',
			sourceConstructor
		));
	};
	var Symbol = function Symbol(description) {
		if (this instanceof Symbol) {
			throw new TypeError('Symbol is not a constructor');
		}
		return setAndGetSymbol(
			prefix.concat(description || '', random, ++id)
		);
		};
	var source = create(null);
	var sourceConstructor = {value: Symbol};
	var sourceMap = function (uid) {
		return source[uid];
		};
	var $defineProperty = function defineProp(o, key, descriptor) {
		var uid = '' + key;
		if (onlySymbols(uid)) {
			setDescriptor(o, uid, descriptor.enumerable ?
				copyAsNonEnumerable(descriptor) : descriptor);
			addInternalIfNeeded(o, uid, !!descriptor.enumerable);
		} else {
			defineProperty(o, key, descriptor);
		}
		return o;
		};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(o) {
		return gOPN(o).filter(onlySymbols).map(sourceMap);
		}
	;

	descriptor.value = $defineProperty;
	defineProperty(Object, DP, descriptor);

	descriptor.value = $getOwnPropertySymbols;
	defineProperty(Object, GOPS, descriptor);

	descriptor.value = function getOwnPropertyNames(o) {
		return gOPN(o).filter(onlyNonSymbols);
	};
	defineProperty(Object, GOPN, descriptor);

	descriptor.value = function defineProperties(o, descriptors) {
		var symbols = $getOwnPropertySymbols(descriptors);
		if (symbols.length) {
		keys(descriptors).concat(symbols).forEach(function (uid) {
			if (propertyIsEnumerable.call(descriptors, uid)) {
			$defineProperty(o, uid, descriptors[uid]);
			}
		});
		} else {
		$defineProperties(o, descriptors);
		}
		return o;
	};
	defineProperty(Object, DPies, descriptor);

	descriptor.value = propertyIsEnumerable;
	defineProperty(ObjectProto, PIE, descriptor);

	descriptor.value = Symbol;
	defineProperty(global, 'Symbol', descriptor);

	// defining `Symbol.for(key)`
	descriptor.value = function (key) {
		var uid = prefix.concat(prefix, key, random);
		return uid in ObjectProto ? source[uid] : setAndGetSymbol(uid);
	};
	defineProperty(Symbol, 'for', descriptor);

	// defining `Symbol.keyFor(symbol)`
	descriptor.value = function (symbol) {
		if (onlyNonSymbols(symbol))
		throw new TypeError(symbol + ' is not a symbol');
		return hOP.call(source, symbol) ?
		symbol.slice(prefixLength * 2, -random.length) :
		void 0
		;
	};
	defineProperty(Symbol, 'keyFor', descriptor);

	descriptor.value = function getOwnPropertyDescriptor(o, key) {
		var descriptor = gOPD(o, key);
		if (descriptor && onlySymbols(key)) {
		descriptor.enumerable = propertyIsEnumerable.call(o, key);
		}
		return descriptor;
	};
	defineProperty(Object, GOPD, descriptor);

	descriptor.value = function (proto, descriptors) {
		return arguments.length === 1 || typeof descriptors === "undefined" ?
		create(proto) :
		createWithSymbols(proto, descriptors);
	};
	defineProperty(Object, 'create', descriptor);

	descriptor.value = function () {
		var str = toString.call(this);
		return (str === '[object String]' && onlySymbols(this)) ? '[object Symbol]' : str;
	};
	defineProperty(ObjectProto, 'toString', descriptor);


	setDescriptor = function (o, key, descriptor) {
		var protoDescriptor = gOPD(ObjectProto, key);
		delete ObjectProto[key];
		defineProperty(o, key, descriptor);
		defineProperty(ObjectProto, key, protoDescriptor);
	};

}(Object, 'getOwnPropertySymbols', this));

// Symbol.iterator
Object.defineProperty(Symbol, 'iterator', {value: Symbol('iterator')});

// Symbol.species
Object.defineProperty(Symbol, 'species', {value: Symbol('species')});

// Number.isNaN
Number.isNaN = Number.isNaN || function(value) {
    return typeof value === "number" && isNaN(value);
};

// Map
(function(global) {


	// Deleted map items mess with iterator pointers, so rather than removing them mark them as deleted. Can't use undefined or null since those both valid keys so use a private symbol.
	var undefMarker = Symbol('undef');

	// NaN cannot be found in an array using indexOf, so we encode NaNs using a private symbol.
	var NaNMarker = Symbol('NaN');

	function encodeKey(key) {
		return Number.isNaN(key) ? NaNMarker : key;
	}
	function decodeKey(encodedKey) {
		return (encodedKey === NaNMarker) ? NaN : encodedKey;
	}

	function makeIterator(mapInst, getter) {
		var nextIdx = 0;
		var done = false;
		return {
			next: function() {
				if (nextIdx === mapInst._keys.length) done = true;
				if (!done) {
					while (mapInst._keys[nextIdx] === undefMarker) nextIdx++;
					return {value: getter.call(mapInst, nextIdx++), done: false};
				} else {
					return {value: void 0, done:true};
				}
			}
		};
	}

	function calcSize(mapInst) {
		var size = 0;
		for (var i=0, s=mapInst._keys.length; i<s; i++) {
			if (mapInst._keys[i] !== undefMarker) size++;
		}
		return size;
	}

	var ACCESSOR_SUPPORT = true;

	var Map = function(data) {
		this._keys = [];
		this._values = [];

		// If `data` is iterable (indicated by presence of a forEach method), pre-populate the map
		data && (typeof data.forEach === 'function') && data.forEach(function (item) {
			this.set.apply(this, item);
		}, this);

		if (!ACCESSOR_SUPPORT) this.size = calcSize(this);
	};
	Map.prototype = {};

	// Some old engines do not support ES5 getters/setters.  Since Map only requires these for the size property, we can fall back to setting the size property statically each time the size of the map changes.
	try {
		Object.defineProperty(Map.prototype, 'size', {
			get: function() {
				return calcSize(this);
			}
		});
	} catch(e) {
		ACCESSOR_SUPPORT = false;
	}

	Map.prototype['get'] = function(key) {
		var idx = this._keys.indexOf(encodeKey(key));
		return (idx !== -1) ? this._values[idx] : undefined;
	};
	Map.prototype['set'] = function(key, value) {
		var idx = this._keys.indexOf(encodeKey(key));
		if (idx !== -1) {
			this._values[idx] = value;
		} else {
			this._keys.push(encodeKey(key));
			this._values.push(value);
			if (!ACCESSOR_SUPPORT) this.size = calcSize(this);
		}
		return this;
	};
	Map.prototype['has'] = function(key) {
		return (this._keys.indexOf(encodeKey(key)) !== -1);
	};
	Map.prototype['delete'] = function(key) {
		var idx = this._keys.indexOf(encodeKey(key));
		if (idx === -1) return false;
		this._keys[idx] = undefMarker;
		this._values[idx] = undefMarker;
		if (!ACCESSOR_SUPPORT) this.size = calcSize(this);
		return true;
	};
	Map.prototype['clear'] = function() {
		this._keys = this._values = [];
		if (!ACCESSOR_SUPPORT) this.size = 0;
	};
	Map.prototype['values'] = function() {
		return makeIterator(this, function(i) { return this._values[i]; });
	};
	Map.prototype['keys'] = function() {
		return makeIterator(this, function(i) { return decodeKey(this._keys[i]); });
	};
	Map.prototype['entries'] =
	Map.prototype[Symbol.iterator] = function() {
		return makeIterator(this, function(i) { return [decodeKey(this._keys[i]), this._values[i]]; });
	};
	Map.prototype['forEach'] = function(callbackFn, thisArg) {
		thisArg = thisArg || global;
		var iterator = this.entries();
		var result = iterator.next();
		while (result.done === false) {
			callbackFn.call(thisArg, result.value[1], result.value[0], this);
			result = iterator.next();
		}
	};
	Map.prototype['constructor'] =
	Map.prototype[Symbol.species] = Map;

	Map.length = 0;

	// Export the object
	this.Map = Map;

}(this));

// Node.prototype.contains
(function() {

	function contains(node) {
		if (!(0 in arguments)) {
			throw new TypeError('1 argument is required');
		}

		do {
			if (this === node) {
				return true;
			}
		} while (node = node && node.parentNode);

		return false;
	}

	// IE
	if ('HTMLElement' in this && 'contains' in HTMLElement.prototype) {
		try {
			delete HTMLElement.prototype.contains;
		} catch (e) {}
	}

	if ('Node' in this) {
		Node.prototype.contains = contains;
	} else {
		document.contains = Element.prototype.contains = contains;
	}

}());

// Object.assign
Object.assign = function assign(target, source) { // eslint-disable-line no-unused-vars
	for (var index = 1, key, src; index < arguments.length; ++index) {
		src = arguments[index];

		for (key in src) {
			if (Object.prototype.hasOwnProperty.call(src, key)) {
				target[key] = src[key];
			}
		}
	}

	return target;
};

// Promise
!function(n){function t(e){if(r[e])return r[e].exports;var o=r[e]={exports:{},id:e,loaded:!1};return n[e].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}var r={};return t.m=n,t.c=r,t.p="",t(0)}({0:/*!***********************!*\
  !*** ./src/global.js ***!
  \***********************/
function(n,t,r){(function(n){var t=r(/*! ./yaku */84);try{n.Promise=t,window.Promise=t}catch(e){}}).call(t,function(){return this}())},84:/*!*********************!*\
  !*** ./src/yaku.js ***!
  \*********************/
function(n,t){(function(t){!function(){"use strict";function r(){return en[$][z]||B}function e(n,t){for(var r in t)n.prototype[r]=t[r];return n}function o(n){return n&&"object"==typeof n}function i(n){return"function"==typeof n}function u(n,t){return n instanceof t}function c(n){return u(n,L)}function f(n,t,r){if(!t(n))throw v(r)}function a(){try{return S.apply(F,arguments)}catch(n){return nn.e=n,nn}}function s(n,t){return S=n,F=t,a}function l(n,t){function r(){for(var r=0;r<o;)t(e[r],e[r+1]),e[r++]=R,e[r++]=R;o=0,e.length>n&&(e.length=n)}var e=I(n),o=0;return function(n,t){e[o++]=n,e[o++]=t,2===o&&en.nextTick(r)}}function h(n,t){var r,e,o,c,f=0;if(!n)throw v(N);var a=n[en[$][q]];if(i(a))e=a.call(n);else{if(!i(n.next)){if(u(n,I)){for(r=n.length;f<r;)t(n[f],f++);return f}throw v(N)}e=n}for(;!(o=e.next()).done;)if(c=s(t)(o.value,f++),c===nn)throw i(e[D])&&e[D](),c.e;return f}function v(n){return new TypeError(n)}function _(n){return(n?"":Q)+(new L).stack}function p(n,t){var r="on"+n.toLowerCase(),e=Y[r];H&&H.listeners(n).length?n===Z?H.emit(n,t._v,t):H.emit(n,t):e?e({reason:t._v,promise:t}):en[n](t._v,t)}function d(n){return n&&n._Yaku}function w(n){if(d(n))return new n(tn);var t,r,e;return t=new n(function(n,o){if(t)throw v();r=n,e=o}),f(r,i),f(e,i),t}function m(n,t){return function(r){E&&(n[K]=_(!0)),t===O?C(n,r):g(n,t,r)}}function k(n,t,r,e){return i(r)&&(t._onFulfilled=r),i(e)&&(n[G]&&p(X,n),t._onRejected=e),E&&(t._pre=n),n[n._pCount++]=t,n._s!==U&&on(n,t),t}function y(n){if(n._umark)return!0;n._umark=!0;for(var t,r=0,e=n._pCount;r<e;)if(t=n[r++],t._onRejected||y(t))return!0}function j(n,t){function r(n){return e.push(n.replace(/^\s+|\s+$/g,""))}var e=[];return E&&(t[K]&&r(t[K]),function o(n){n&&J in n&&(o(n._next),r(n[J]+""),o(n._pre))}(t)),n.stack+("\n"+e.join("\n")).replace(rn,"")}function x(n,t){return n(t)}function g(n,t,r){var e=0,o=n._pCount;if(n._s===U)for(n._s=t,n._v=r,t===A&&(E&&c(r)&&(r.longStack=j(r,n)),un(n));e<o;)on(n,n[e++]);return n}function C(n,t){if(t===n&&t)return g(n,A,v(V)),n;if(t!==P&&(i(t)||o(t))){var r=s(T)(t);if(r===nn)return g(n,A,r.e),n;i(r)?(E&&d(t)&&(n._next=t),d(t)?b(n,t,r):en.nextTick(function(){b(n,t,r)})):g(n,O,t)}else g(n,O,t);return n}function T(n){return n.then}function b(n,t,r){var e=s(r,t)(function(r){t&&(t=P,C(n,r))},function(r){t&&(t=P,g(n,A,r))});e===nn&&t&&(g(n,A,e.e),t=P)}var R,S,F,P=null,Y="object"==typeof window?window:t,E=!1,H=Y.process,I=Array,L=Error,A=0,O=1,U=2,$="Symbol",q="iterator",z="species",B=$+"("+z+")",D="return",G="_uh",J="_pt",K="_st",M="Invalid this",N="Invalid argument",Q="\nFrom previous ",V="Chaining cycle detected for promise",W="Uncaught (in promise)",X="rejectionHandled",Z="unhandledRejection",nn={e:P},tn=function(){},rn=/^.+\/node_modules\/yaku\/.+\n?/gm,en=n.exports=function(n){var t,r=this;if(!o(r)||r._s!==R)throw v(M);if(r._s=U,E&&(r[J]=_()),n!==tn){if(!i(n))throw v(N);t=s(n)(m(r,O),m(r,A)),t===nn&&g(r,A,t.e)}};en["default"]=en,e(en,{then:function(n,t){if(void 0===this._s)throw v();return k(this,w(en.speciesConstructor(this,en)),n,t)},"catch":function(n){return this.then(R,n)},_pCount:0,_pre:P,_Yaku:1}),en.resolve=function(n){return d(n)?n:C(w(this),n)},en.reject=function(n){return g(w(this),A,n)},en.race=function(n){var t=this,r=w(t),e=function(n){g(r,O,n)},o=function(n){g(r,A,n)},i=s(h)(n,function(n){t.resolve(n).then(e,o)});return i===nn?t.reject(i.e):r},en.all=function(n){function t(n){g(o,A,n)}var r,e=this,o=w(e),i=[];return r=s(h)(n,function(n,u){e.resolve(n).then(function(n){i[u]=n,--r||g(o,O,i)},t)}),r===nn?e.reject(r.e):(r||g(o,O,[]),o)},en.Symbol=Y[$]||{},s(function(){Object.defineProperty(en,r(),{get:function(){return this}})})(),en.speciesConstructor=function(n,t){var e=n.constructor;return e?e[r()]||t:t},en.unhandledRejection=function(n,t){try{Y.console.error(W,E?t.longStack:j(n,t))}catch(r){}},en.rejectionHandled=tn,en.enableLongStackTrace=function(){E=!0},en.nextTick=H?H.nextTick:function(n){setTimeout(n)},en._Yaku=1;var on=l(999,function(n,t){var r,e;return e=n._s?t._onFulfilled:t._onRejected,e===R?void g(t,n._s,n._v):(r=s(x)(e,n._v),r===nn?void g(t,A,r.e):void C(t,r))}),un=l(9,function(n){y(n)||(n[G]=1,p(Z,n))})}()}).call(t,function(){return this}())}});
// Set
(function(global) {


	// Deleted map items mess with iterator pointers, so rather than removing them mark them as deleted. Can't use undefined or null since those both valid keys so use a private symbol.
	var undefMarker = Symbol('undef');

	// NaN cannot be found in an array using indexOf, so we encode NaNs using a private symbol.
	var NaNMarker = Symbol('NaN');

	function encodeVal(data) {
		return Number.isNaN(data) ? NaNMarker : data;
	}
	function decodeVal(encodedData) {
		return (encodedData === NaNMarker) ? NaN : encodedData;
	}

	function makeIterator(setInst, getter) {
		var nextIdx = 0;
		return {
			next: function() {
				while (setInst._values[nextIdx] === undefMarker) nextIdx++;
				if (nextIdx === setInst._values.length) {
					return {value: void 0, done: true};
				}
				else {
					return {value: getter.call(setInst, nextIdx++), done: false};
				}
			}
		};
	}

	function calcSize(setInst) {
		var size = 0;
		for (var i=0, s=setInst._values.length; i<s; i++) {
			if (setInst._values[i] !== undefMarker) size++;
		}
		return size;
	}

	var ACCESSOR_SUPPORT = true;

	var Set = function(data) {
		this._values = [];

		// If `data` is iterable (indicated by presence of a forEach method), pre-populate the set
		data && (typeof data.forEach === 'function') && data.forEach(function (item) {
			this.add.call(this, item);
		}, this);

		if (!ACCESSOR_SUPPORT) this.size = calcSize(this);
	};

	// Some old engines do not support ES5 getters/setters.  Since Set only requires these for the size property, we can fall back to setting the size property statically each time the size of the set changes.
	try {
		Object.defineProperty(Set.prototype, 'size', {
			get: function() {
				return calcSize(this);
			}
		});
	} catch(e) {
		ACCESSOR_SUPPORT = false;
	}

	Set.prototype['add'] = function(value) {
		value = encodeVal(value);
		if (this._values.indexOf(value) === -1) {
			this._values.push(value);
			if (!ACCESSOR_SUPPORT) this.size = calcSize(this);
		}
		return this;
	};
	Set.prototype['has'] = function(value) {
		return (this._values.indexOf(encodeVal(value)) !== -1);
	};
	Set.prototype['delete'] = function(value) {
		var idx = this._values.indexOf(encodeVal(value));
		if (idx === -1) return false;
		this._values[idx] = undefMarker;
		if (!ACCESSOR_SUPPORT) this.size = calcSize(this);
		return true;
	};
	Set.prototype['clear'] = function() {
		this._values = [];
		if (!ACCESSOR_SUPPORT) this.size = 0;
	};
	Set.prototype['values'] =
	Set.prototype['keys'] = function() {
		return makeIterator(this, function(i) { return decodeVal(this._values[i]); });
	};
	Set.prototype['entries'] =
	Set.prototype[Symbol.iterator] = function() {
		return makeIterator(this, function(i) { return [decodeVal(this._values[i]), decodeVal(this._values[i])]; });
	};
	Set.prototype['forEach'] = function(callbackFn, thisArg) {
		thisArg = thisArg || global;
		var iterator = this.entries();
		var result = iterator.next();
		while (result.done === false) {
			callbackFn.call(thisArg, result.value[1], result.value[0], this);
			result = iterator.next();
		}
	};
	Set.prototype['constructor'] =
	Set.prototype[Symbol.species] = Set;

	Set.length = 0;

	// Export the object
	this.Set = Set;

}(this));

// String.prototype.endsWith
String.prototype.endsWith = function (string) {
	var index = arguments.length < 2 ? this.length : arguments[1];
	var foundIndex = this.lastIndexOf(string);
	return foundIndex !== -1 && foundIndex === index - string.length;
};

// String.prototype.includes
String.prototype.includes = function (string, index) {
	if (typeof string === 'object' && string instanceof RegExp) throw new TypeError("First argument to String.prototype.includes must not be a regular expression");
	return this.indexOf(string, index) !== -1;
};

// String.prototype.startsWith
String.prototype.startsWith = function (string) {
	var index = arguments.length < 2 ? 0 : arguments[1];

	return this.slice(index).indexOf(string) === 0;
};

// URL
// URL Polyfill
// Draft specification: https://url.spec.whatwg.org

// Notes:
// - Primarily useful for parsing URLs and modifying query parameters
// - Should work in IE8+ and everything more modern

(function (global) {
  'use strict';

  // Browsers may have:
  // * No global URL object
  // * URL with static methods only - may have a dummy constructor
  // * URL with members except searchParams
  // * Full URL API support
  var origURL = global.URL;
  var nativeURL;
  try {
    if (origURL) {
      nativeURL = new global.URL('http://example.com');
      if ('searchParams' in nativeURL)
        return;
      if (!('href' in nativeURL))
        nativeURL = undefined;
    }
  } catch (_) {}

  // NOTE: Doesn't do the encoding/decoding dance
  function urlencoded_serialize(pairs) {
    var output = '', first = true;
    pairs.forEach(function (pair) {
      var name = encodeURIComponent(pair.name);
      var value = encodeURIComponent(pair.value);
      if (!first) output += '&';
      output += name + '=' + value;
      first = false;
    });
    return output.replace(/%20/g, '+');
  }

  // NOTE: Doesn't do the encoding/decoding dance
  function urlencoded_parse(input, isindex) {
    var sequences = input.split('&');
    if (isindex && sequences[0].indexOf('=') === -1)
      sequences[0] = '=' + sequences[0];
    var pairs = [];
    sequences.forEach(function (bytes) {
      if (bytes.length === 0) return;
      var index = bytes.indexOf('=');
      if (index !== -1) {
        var name = bytes.substring(0, index);
        var value = bytes.substring(index + 1);
      } else {
        name = bytes;
        value = '';
      }
      name = name.replace(/\+/g, ' ');
      value = value.replace(/\+/g, ' ');
      pairs.push({ name: name, value: value });
    });
    var output = [];
    pairs.forEach(function (pair) {
      output.push({
        name: decodeURIComponent(pair.name),
        value: decodeURIComponent(pair.value)
      });
    });
    return output;
  }


  function URLUtils(url) {
    if (nativeURL)
      return new origURL(url);
    var anchor = document.createElement('a');
    anchor.href = url;
    return anchor;
  }

  function URLSearchParams(init) {
    var $this = this;
    this._list = [];

    if (init === undefined || init === null)
      init = '';

    if (Object(init) !== init || !(init instanceof URLSearchParams))
      init = String(init);

    if (typeof init === 'string' && init.substring(0, 1) === '?')
      init = init.substring(1);

    if (typeof init === 'string')
      this._list = urlencoded_parse(init);
    else
      this._list = init._list.slice();

    this._url_object = null;
    this._setList = function (list) { if (!updating) $this._list = list; };

    var updating = false;
    this._update_steps = function() {
      if (updating) return;
      updating = true;

      if (!$this._url_object) return;

      // Partial workaround for IE issue with 'about:'
      if ($this._url_object.protocol === 'about:' &&
          $this._url_object.pathname.indexOf('?') !== -1) {
          $this._url_object.pathname = $this._url_object.pathname.split('?')[0];
      }

      $this._url_object.search = urlencoded_serialize($this._list);

      updating = false;
    };
  }


  Object.defineProperties(URLSearchParams.prototype, {
    append: {
      value: function (name, value) {
        this._list.push({ name: name, value: value });
        this._update_steps();
      }, writable: true, enumerable: true, configurable: true
    },

    'delete': {
      value: function (name) {
        for (var i = 0; i < this._list.length;) {
          if (this._list[i].name === name)
            this._list.splice(i, 1);
          else
            ++i;
        }
        this._update_steps();
      }, writable: true, enumerable: true, configurable: true
    },

    get: {
      value: function (name) {
        for (var i = 0; i < this._list.length; ++i) {
          if (this._list[i].name === name)
            return this._list[i].value;
        }
        return null;
      }, writable: true, enumerable: true, configurable: true
    },

    getAll: {
      value: function (name) {
        var result = [];
        for (var i = 0; i < this._list.length; ++i) {
          if (this._list[i].name === name)
            result.push(this._list[i].value);
        }
        return result;
      }, writable: true, enumerable: true, configurable: true
    },

    has: {
      value: function (name) {
        for (var i = 0; i < this._list.length; ++i) {
          if (this._list[i].name === name)
            return true;
        }
        return false;
      }, writable: true, enumerable: true, configurable: true
    },

    set: {
      value: function (name, value) {
        var found = false;
        for (var i = 0; i < this._list.length;) {
          if (this._list[i].name === name) {
            if (!found) {
              this._list[i].value = value;
              found = true;
              ++i;
            } else {
              this._list.splice(i, 1);
            }
          } else {
            ++i;
          }
        }

        if (!found)
          this._list.push({ name: name, value: value });

        this._update_steps();
      }, writable: true, enumerable: true, configurable: true
    },

    entries: {
      value: function() {
        var $this = this, index = 0;
        return { next: function() {
          if (index >= $this._list.length)
            return {done: true, value: undefined};
          var pair = $this._list[index++];
          return {done: false, value: [pair.name, pair.value]};
        }};
      }, writable: true, enumerable: true, configurable: true
    },

    keys: {
      value: function() {
        var $this = this, index = 0;
        return { next: function() {
          if (index >= $this._list.length)
            return {done: true, value: undefined};
          var pair = $this._list[index++];
          return {done: false, value: pair.name};
        }};
      }, writable: true, enumerable: true, configurable: true
    },

    values: {
      value: function() {
        var $this = this, index = 0;
        return { next: function() {
          if (index >= $this._list.length)
            return {done: true, value: undefined};
          var pair = $this._list[index++];
          return {done: false, value: pair.value};
        }};
      }, writable: true, enumerable: true, configurable: true
    },

    forEach: {
      value: function(callback) {
        var thisArg = (arguments.length > 1) ? arguments[1] : undefined;
        this._list.forEach(function(pair, index) {
          callback.call(thisArg, pair.name, pair.value);
        });

      }, writable: true, enumerable: true, configurable: true
    },

    toString: {
      value: function () {
        return urlencoded_serialize(this._list);
      }, writable: true, enumerable: false, configurable: true
    }
  });

  if ('Symbol' in global && 'iterator' in global.Symbol) {
    Object.defineProperty(URLSearchParams.prototype, global.Symbol.iterator, {
      value: URLSearchParams.prototype.entries,
      writable: true, enumerable: true, configurable: true});
  }

  function URL(url, base) {
    if (!(this instanceof global.URL))
      throw new TypeError("Failed to construct 'URL': Please use the 'new' operator.");

    if (base) {
      url = (function () {
        if (nativeURL) return new origURL(url, base).href;

        var doc;
        // Use another document/base tag/anchor for relative URL resolution, if possible
        if (document.implementation && document.implementation.createHTMLDocument) {
          doc = document.implementation.createHTMLDocument('');
        } else if (document.implementation && document.implementation.createDocument) {
          doc = document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'html', null);
          doc.documentElement.appendChild(doc.createElement('head'));
          doc.documentElement.appendChild(doc.createElement('body'));
        } else if (window.ActiveXObject) {
          doc = new window.ActiveXObject('htmlfile');
          doc.write('<head><\/head><body><\/body>');
          doc.close();
        }

        if (!doc) throw Error('base not supported');

        var baseTag = doc.createElement('base');
        baseTag.href = base;
        doc.getElementsByTagName('head')[0].appendChild(baseTag);
        var anchor = doc.createElement('a');
        anchor.href = url;
        return anchor.href;
      }());
    }

    // An inner object implementing URLUtils (either a native URL
    // object or an HTMLAnchorElement instance) is used to perform the
    // URL algorithms. With full ES5 getter/setter support, return a
    // regular object For IE8's limited getter/setter support, a
    // different HTMLAnchorElement is returned with properties
    // overridden

    var instance = URLUtils(url || '');

    // Detect for ES5 getter/setter support
    // (an Object.defineProperties polyfill that doesn't support getters/setters may throw)
    var ES5_GET_SET = (function() {
      if (!('defineProperties' in Object)) return false;
      try {
        var obj = {};
        Object.defineProperties(obj, { prop: { 'get': function () { return true; } } });
        return obj.prop;
      } catch (_) {
        return false;
      }
    })();

    var self = ES5_GET_SET ? this : document.createElement('a');



    var query_object = new URLSearchParams(
      instance.search ? instance.search.substring(1) : null);
    query_object._url_object = self;

    Object.defineProperties(self, {
      href: {
        get: function () { return instance.href; },
        set: function (v) { instance.href = v; tidy_instance(); update_steps(); },
        enumerable: true, configurable: true
      },
      origin: {
        get: function () {
          if ('origin' in instance) return instance.origin;
          return this.protocol + '//' + this.host;
        },
        enumerable: true, configurable: true
      },
      protocol: {
        get: function () { return instance.protocol; },
        set: function (v) { instance.protocol = v; },
        enumerable: true, configurable: true
      },
      username: {
        get: function () { return instance.username; },
        set: function (v) { instance.username = v; },
        enumerable: true, configurable: true
      },
      password: {
        get: function () { return instance.password; },
        set: function (v) { instance.password = v; },
        enumerable: true, configurable: true
      },
      host: {
        get: function () {
          // IE returns default port in |host|
          var re = {'http:': /:80$/, 'https:': /:443$/, 'ftp:': /:21$/}[instance.protocol];
          return re ? instance.host.replace(re, '') : instance.host;
        },
        set: function (v) { instance.host = v; },
        enumerable: true, configurable: true
      },
      hostname: {
        get: function () { return instance.hostname; },
        set: function (v) { instance.hostname = v; },
        enumerable: true, configurable: true
      },
      port: {
        get: function () { return instance.port; },
        set: function (v) { instance.port = v; },
        enumerable: true, configurable: true
      },
      pathname: {
        get: function () {
          // IE does not include leading '/' in |pathname|
          if (instance.pathname.charAt(0) !== '/') return '/' + instance.pathname;
          return instance.pathname;
        },
        set: function (v) { instance.pathname = v; },
        enumerable: true, configurable: true
      },
      search: {
        get: function () { return instance.search; },
        set: function (v) {
          if (instance.search === v) return;
          instance.search = v; tidy_instance(); update_steps();
        },
        enumerable: true, configurable: true
      },
      searchParams: {
        get: function () { return query_object; },
        enumerable: true, configurable: true
      },
      hash: {
        get: function () { return instance.hash; },
        set: function (v) { instance.hash = v; tidy_instance(); },
        enumerable: true, configurable: true
      },
      toString: {
        value: function() { return instance.toString(); },
        enumerable: false, configurable: true
      },
      valueOf: {
        value: function() { return instance.valueOf(); },
        enumerable: false, configurable: true
      }
    });

    function tidy_instance() {
      var href = instance.href.replace(/#$|\?$|\?(?=#)/g, '');
      if (instance.href !== href)
        instance.href = href;
    }

    function update_steps() {
      query_object._setList(instance.search ? urlencoded_parse(instance.search.substring(1)) : []);
      query_object._update_steps();
    };

    return self;
  }

  if (origURL) {
    for (var i in origURL) {
      if (origURL.hasOwnProperty(i) && typeof origURL[i] === 'function')
        URL[i] = origURL[i];
    }
  }

  global.URL = URL;
  global.URLSearchParams = URLSearchParams;

}(self));
})
.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
/*----------------------------------------
 * objectFitPolyfill 2.3.5
 *
 * Made by Constance Chen
 * Released under the ISC license
 *
 * https://github.com/constancecchen/object-fit-polyfill
 *--------------------------------------*/

(function() {
  'use strict';

  // if the page is being rendered on the server, don't continue
  if (typeof window === 'undefined') return;

  // Workaround for Edge 16-18, which only implemented object-fit for <img> tags
  var edgeMatch = window.navigator.userAgent.match(/Edge\/(\d{2})\./);
  var edgeVersion = edgeMatch ? parseInt(edgeMatch[1], 10) : null;
  var edgePartialSupport = edgeVersion
    ? edgeVersion >= 16 && edgeVersion <= 18
    : false;

  // If the browser does support object-fit, we don't need to continue
  var hasSupport = 'objectFit' in document.documentElement.style !== false;
  if (hasSupport && !edgePartialSupport) {
    window.objectFitPolyfill = function() {
      return false;
    };
    return;
  }

  /**
   * Check the container's parent element to make sure it will
   * correctly handle and clip absolutely positioned children
   *
   * @param {node} $container - parent element
   */
  var checkParentContainer = function($container) {
    var styles = window.getComputedStyle($container, null);
    var position = styles.getPropertyValue('position');
    var overflow = styles.getPropertyValue('overflow');
    var display = styles.getPropertyValue('display');

    if (!position || position === 'static') {
      $container.style.position = 'relative';
    }
    if (overflow !== 'hidden') {
      $container.style.overflow = 'hidden';
    }
    // Guesstimating that people want the parent to act like full width/height wrapper here.
    // Mostly attempts to target <picture> elements, which default to inline.
    if (!display || display === 'inline') {
      $container.style.display = 'block';
    }
    if ($container.clientHeight === 0) {
      $container.style.height = '100%';
    }

    // Add a CSS class hook, in case people need to override styles for any reason.
    if ($container.className.indexOf('object-fit-polyfill') === -1) {
      $container.className = $container.className + ' object-fit-polyfill';
    }
  };

  /**
   * Check for pre-set max-width/height, min-width/height,
   * positioning, or margins, which can mess up image calculations
   *
   * @param {node} $media - img/video element
   */
  var checkMediaProperties = function($media) {
    var styles = window.getComputedStyle($media, null);
    var constraints = {
      'max-width': 'none',
      'max-height': 'none',
      'min-width': '0px',
      'min-height': '0px',
      top: 'auto',
      right: 'auto',
      bottom: 'auto',
      left: 'auto',
      'margin-top': '0px',
      'margin-right': '0px',
      'margin-bottom': '0px',
      'margin-left': '0px',
    };

    for (var property in constraints) {
      var constraint = styles.getPropertyValue(property);

      if (constraint !== constraints[property]) {
        $media.style[property] = constraints[property];
      }
    }
  };

  /**
   * Calculate & set object-position
   *
   * @param {string} axis - either "x" or "y"
   * @param {node} $media - img or video element
   * @param {string} objectPosition - e.g. "50% 50%", "top left"
   */
  var setPosition = function(axis, $media, objectPosition) {
    var position, other, start, end, side;
    objectPosition = objectPosition.split(' ');

    if (objectPosition.length < 2) {
      objectPosition[1] = objectPosition[0];
    }

    /* istanbul ignore else */
    if (axis === 'x') {
      position = objectPosition[0];
      other = objectPosition[1];
      start = 'left';
      end = 'right';
      side = $media.clientWidth;
    } else if (axis === 'y') {
      position = objectPosition[1];
      other = objectPosition[0];
      start = 'top';
      end = 'bottom';
      side = $media.clientHeight;
    } else {
      return; // Neither x or y axis specified
    }

    if (position === start || other === start) {
      $media.style[start] = '0';
      return;
    }

    if (position === end || other === end) {
      $media.style[end] = '0';
      return;
    }

    if (position === 'center' || position === '50%') {
      $media.style[start] = '50%';
      $media.style['margin-' + start] = side / -2 + 'px';
      return;
    }

    // Percentage values (e.g., 30% 10%)
    if (position.indexOf('%') >= 0) {
      position = parseInt(position, 10);

      if (position < 50) {
        $media.style[start] = position + '%';
        $media.style['margin-' + start] = side * (position / -100) + 'px';
      } else {
        position = 100 - position;
        $media.style[end] = position + '%';
        $media.style['margin-' + end] = side * (position / -100) + 'px';
      }

      return;
    }
    // Length-based values (e.g. 10px / 10em)
    else {
      $media.style[start] = position;
    }
  };

  /**
   * Calculate & set object-fit
   *
   * @param {node} $media - img/video/picture element
   */
  var objectFit = function($media) {
    // IE 10- data polyfill
    var fit = $media.dataset
      ? $media.dataset.objectFit
      : $media.getAttribute('data-object-fit');
    var position = $media.dataset
      ? $media.dataset.objectPosition
      : $media.getAttribute('data-object-position');

    // Default fallbacks
    fit = fit || 'cover';
    position = position || '50% 50%';

    // If necessary, make the parent container work with absolutely positioned elements
    var $container = $media.parentNode;
    checkParentContainer($container);

    // Check for any pre-set CSS which could mess up image calculations
    checkMediaProperties($media);

    // Reset any pre-set width/height CSS and handle fit positioning
    $media.style.position = 'absolute';
    $media.style.width = 'auto';
    $media.style.height = 'auto';

    // `scale-down` chooses either `none` or `contain`, whichever is smaller
    if (fit === 'scale-down') {
      if (
        $media.clientWidth < $container.clientWidth &&
        $media.clientHeight < $container.clientHeight
      ) {
        fit = 'none';
      } else {
        fit = 'contain';
      }
    }

    // `none` (width/height auto) and `fill` (100%) and are straightforward
    if (fit === 'none') {
      setPosition('x', $media, position);
      setPosition('y', $media, position);
      return;
    }

    if (fit === 'fill') {
      $media.style.width = '100%';
      $media.style.height = '100%';
      setPosition('x', $media, position);
      setPosition('y', $media, position);
      return;
    }

    // `cover` and `contain` must figure out which side needs covering, and add CSS positioning & centering
    $media.style.height = '100%';

    if (
      (fit === 'cover' && $media.clientWidth > $container.clientWidth) ||
      (fit === 'contain' && $media.clientWidth < $container.clientWidth)
    ) {
      $media.style.top = '0';
      $media.style.marginTop = '0';
      setPosition('x', $media, position);
    } else {
      $media.style.width = '100%';
      $media.style.height = 'auto';
      $media.style.left = '0';
      $media.style.marginLeft = '0';
      setPosition('y', $media, position);
    }
  };

  /**
   * Initialize plugin
   *
   * @param {node} media - Optional specific DOM node(s) to be polyfilled
   */
  var objectFitPolyfill = function(media) {
    if (typeof media === 'undefined' || media instanceof Event) {
      // If left blank, or a default event, all media on the page will be polyfilled.
      media = document.querySelectorAll('[data-object-fit]');
    } else if (media && media.nodeName) {
      // If it's a single node, wrap it in an array so it works.
      media = [media];
    } else if (typeof media === 'object' && media.length && media[0].nodeName) {
      // If it's an array of DOM nodes (e.g. a jQuery selector), it's fine as-is.
      media = media;
    } else {
      // Otherwise, if it's invalid or an incorrect type, return false to let people know.
      return false;
    }

    for (var i = 0; i < media.length; i++) {
      if (!media[i].nodeName) continue;

      var mediaType = media[i].nodeName.toLowerCase();

      if (mediaType === 'img') {
        if (edgePartialSupport) continue; // Edge supports object-fit for images (but nothing else), so no need to polyfill

        if (media[i].complete) {
          objectFit(media[i]);
        } else {
          media[i].addEventListener('load', function() {
            objectFit(this);
          });
        }
      } else if (mediaType === 'video') {
        if (media[i].readyState > 0) {
          objectFit(media[i]);
        } else {
          media[i].addEventListener('loadedmetadata', function() {
            objectFit(this);
          });
        }
      } else {
        objectFit(media[i]);
      }
    }

    return true;
  };

  if (document.readyState === 'loading') {
    // Loading hasn't finished yet
    document.addEventListener('DOMContentLoaded', objectFitPolyfill);
  } else {
    // `DOMContentLoaded` has already fired
    objectFitPolyfill();
  }

  window.addEventListener('resize', objectFitPolyfill);

  window.objectFitPolyfill = objectFitPolyfill;
})();

/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the W3C SOFTWARE AND DOCUMENT NOTICE AND LICENSE.
 *
 *  https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 */
(function() {
'use strict';

// Exit early if we're not running in a browser.
if (typeof window !== 'object') {
  return;
}

// Exit early if all IntersectionObserver and IntersectionObserverEntry
// features are natively supported.
if ('IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    'intersectionRatio' in window.IntersectionObserverEntry.prototype) {

  // Minimal polyfill for Edge 15's lack of `isIntersecting`
  // See: https://github.com/w3c/IntersectionObserver/issues/211
  if (!('isIntersecting' in window.IntersectionObserverEntry.prototype)) {
    Object.defineProperty(window.IntersectionObserverEntry.prototype,
      'isIntersecting', {
      get: function () {
        return this.intersectionRatio > 0;
      }
    });
  }
  return;
}

/**
 * Returns the embedding frame element, if any.
 * @param {!Document} doc
 * @return {!Element}
 */
function getFrameElement(doc) {
  try {
    return doc.defaultView && doc.defaultView.frameElement || null;
  } catch (e) {
    // Ignore the error.
    return null;
  }
}

/**
 * A local reference to the root document.
 */
var document = (function(startDoc) {
  var doc = startDoc;
  var frame = getFrameElement(doc);
  while (frame) {
    doc = frame.ownerDocument;
    frame = getFrameElement(doc);
  }
  return doc;
})(window.document);

/**
 * An IntersectionObserver registry. This registry exists to hold a strong
 * reference to IntersectionObserver instances currently observing a target
 * element. Without this registry, instances without another reference may be
 * garbage collected.
 */
var registry = [];

/**
 * The signal updater for cross-origin intersection. When not null, it means
 * that the polyfill is configured to work in a cross-origin mode.
 * @type {function(DOMRect|ClientRect, DOMRect|ClientRect)}
 */
var crossOriginUpdater = null;

/**
 * The current cross-origin intersection. Only used in the cross-origin mode.
 * @type {DOMRect|ClientRect}
 */
var crossOriginRect = null;


/**
 * Creates the global IntersectionObserverEntry constructor.
 * https://w3c.github.io/IntersectionObserver/#intersection-observer-entry
 * @param {Object} entry A dictionary of instance properties.
 * @constructor
 */
function IntersectionObserverEntry(entry) {
  this.time = entry.time;
  this.target = entry.target;
  this.rootBounds = ensureDOMRect(entry.rootBounds);
  this.boundingClientRect = ensureDOMRect(entry.boundingClientRect);
  this.intersectionRect = ensureDOMRect(entry.intersectionRect || getEmptyRect());
  this.isIntersecting = !!entry.intersectionRect;

  // Calculates the intersection ratio.
  var targetRect = this.boundingClientRect;
  var targetArea = targetRect.width * targetRect.height;
  var intersectionRect = this.intersectionRect;
  var intersectionArea = intersectionRect.width * intersectionRect.height;

  // Sets intersection ratio.
  if (targetArea) {
    // Round the intersection ratio to avoid floating point math issues:
    // https://github.com/w3c/IntersectionObserver/issues/324
    this.intersectionRatio = Number((intersectionArea / targetArea).toFixed(4));
  } else {
    // If area is zero and is intersecting, sets to 1, otherwise to 0
    this.intersectionRatio = this.isIntersecting ? 1 : 0;
  }
}


/**
 * Creates the global IntersectionObserver constructor.
 * https://w3c.github.io/IntersectionObserver/#intersection-observer-interface
 * @param {Function} callback The function to be invoked after intersection
 *     changes have queued. The function is not invoked if the queue has
 *     been emptied by calling the `takeRecords` method.
 * @param {Object=} opt_options Optional configuration options.
 * @constructor
 */
function IntersectionObserver(callback, opt_options) {

  var options = opt_options || {};

  if (typeof callback != 'function') {
    throw new Error('callback must be a function');
  }

  if (
    options.root &&
    options.root.nodeType != 1 &&
    options.root.nodeType != 9
  ) {
    throw new Error('root must be a Document or Element');
  }

  // Binds and throttles `this._checkForIntersections`.
  this._checkForIntersections = throttle(
      this._checkForIntersections.bind(this), this.THROTTLE_TIMEOUT);

  // Private properties.
  this._callback = callback;
  this._observationTargets = [];
  this._queuedEntries = [];
  this._rootMarginValues = this._parseRootMargin(options.rootMargin);

  // Public properties.
  this.thresholds = this._initThresholds(options.threshold);
  this.root = options.root || null;
  this.rootMargin = this._rootMarginValues.map(function(margin) {
    return margin.value + margin.unit;
  }).join(' ');

  /** @private @const {!Array<!Document>} */
  this._monitoringDocuments = [];
  /** @private @const {!Array<function()>} */
  this._monitoringUnsubscribes = [];
}


/**
 * The minimum interval within which the document will be checked for
 * intersection changes.
 */
IntersectionObserver.prototype.THROTTLE_TIMEOUT = 100;


/**
 * The frequency in which the polyfill polls for intersection changes.
 * this can be updated on a per instance basis and must be set prior to
 * calling `observe` on the first target.
 */
IntersectionObserver.prototype.POLL_INTERVAL = null;

/**
 * Use a mutation observer on the root element
 * to detect intersection changes.
 */
IntersectionObserver.prototype.USE_MUTATION_OBSERVER = true;


/**
 * Sets up the polyfill in the cross-origin mode. The result is the
 * updater function that accepts two arguments: `boundingClientRect` and
 * `intersectionRect` - just as these fields would be available to the
 * parent via `IntersectionObserverEntry`. This function should be called
 * each time the iframe receives intersection information from the parent
 * window, e.g. via messaging.
 * @return {function(DOMRect|ClientRect, DOMRect|ClientRect)}
 */
IntersectionObserver._setupCrossOriginUpdater = function() {
  if (!crossOriginUpdater) {
    /**
     * @param {DOMRect|ClientRect} boundingClientRect
     * @param {DOMRect|ClientRect} intersectionRect
     */
    crossOriginUpdater = function(boundingClientRect, intersectionRect) {
      if (!boundingClientRect || !intersectionRect) {
        crossOriginRect = getEmptyRect();
      } else {
        crossOriginRect = convertFromParentRect(boundingClientRect, intersectionRect);
      }
      registry.forEach(function(observer) {
        observer._checkForIntersections();
      });
    };
  }
  return crossOriginUpdater;
};


/**
 * Resets the cross-origin mode.
 */
IntersectionObserver._resetCrossOriginUpdater = function() {
  crossOriginUpdater = null;
  crossOriginRect = null;
};


/**
 * Starts observing a target element for intersection changes based on
 * the thresholds values.
 * @param {Element} target The DOM element to observe.
 */
IntersectionObserver.prototype.observe = function(target) {
  var isTargetAlreadyObserved = this._observationTargets.some(function(item) {
    return item.element == target;
  });

  if (isTargetAlreadyObserved) {
    return;
  }

  if (!(target && target.nodeType == 1)) {
    throw new Error('target must be an Element');
  }

  this._registerInstance();
  this._observationTargets.push({element: target, entry: null});
  this._monitorIntersections(target.ownerDocument);
  this._checkForIntersections();
};


/**
 * Stops observing a target element for intersection changes.
 * @param {Element} target The DOM element to observe.
 */
IntersectionObserver.prototype.unobserve = function(target) {
  this._observationTargets =
      this._observationTargets.filter(function(item) {
        return item.element != target;
      });
  this._unmonitorIntersections(target.ownerDocument);
  if (this._observationTargets.length == 0) {
    this._unregisterInstance();
  }
};


/**
 * Stops observing all target elements for intersection changes.
 */
IntersectionObserver.prototype.disconnect = function() {
  this._observationTargets = [];
  this._unmonitorAllIntersections();
  this._unregisterInstance();
};


/**
 * Returns any queue entries that have not yet been reported to the
 * callback and clears the queue. This can be used in conjunction with the
 * callback to obtain the absolute most up-to-date intersection information.
 * @return {Array} The currently queued entries.
 */
IntersectionObserver.prototype.takeRecords = function() {
  var records = this._queuedEntries.slice();
  this._queuedEntries = [];
  return records;
};


/**
 * Accepts the threshold value from the user configuration object and
 * returns a sorted array of unique threshold values. If a value is not
 * between 0 and 1 and error is thrown.
 * @private
 * @param {Array|number=} opt_threshold An optional threshold value or
 *     a list of threshold values, defaulting to [0].
 * @return {Array} A sorted list of unique and valid threshold values.
 */
IntersectionObserver.prototype._initThresholds = function(opt_threshold) {
  var threshold = opt_threshold || [0];
  if (!Array.isArray(threshold)) threshold = [threshold];

  return threshold.sort().filter(function(t, i, a) {
    if (typeof t != 'number' || isNaN(t) || t < 0 || t > 1) {
      throw new Error('threshold must be a number between 0 and 1 inclusively');
    }
    return t !== a[i - 1];
  });
};


/**
 * Accepts the rootMargin value from the user configuration object
 * and returns an array of the four margin values as an object containing
 * the value and unit properties. If any of the values are not properly
 * formatted or use a unit other than px or %, and error is thrown.
 * @private
 * @param {string=} opt_rootMargin An optional rootMargin value,
 *     defaulting to '0px'.
 * @return {Array<Object>} An array of margin objects with the keys
 *     value and unit.
 */
IntersectionObserver.prototype._parseRootMargin = function(opt_rootMargin) {
  var marginString = opt_rootMargin || '0px';
  var margins = marginString.split(/\s+/).map(function(margin) {
    var parts = /^(-?\d*\.?\d+)(px|%)$/.exec(margin);
    if (!parts) {
      throw new Error('rootMargin must be specified in pixels or percent');
    }
    return {value: parseFloat(parts[1]), unit: parts[2]};
  });

  // Handles shorthand.
  margins[1] = margins[1] || margins[0];
  margins[2] = margins[2] || margins[0];
  margins[3] = margins[3] || margins[1];

  return margins;
};


/**
 * Starts polling for intersection changes if the polling is not already
 * happening, and if the page's visibility state is visible.
 * @param {!Document} doc
 * @private
 */
IntersectionObserver.prototype._monitorIntersections = function(doc) {
  var win = doc.defaultView;
  if (!win) {
    // Already destroyed.
    return;
  }
  if (this._monitoringDocuments.indexOf(doc) != -1) {
    // Already monitoring.
    return;
  }

  // Private state for monitoring.
  var callback = this._checkForIntersections;
  var monitoringInterval = null;
  var domObserver = null;

  // If a poll interval is set, use polling instead of listening to
  // resize and scroll events or DOM mutations.
  if (this.POLL_INTERVAL) {
    monitoringInterval = win.setInterval(callback, this.POLL_INTERVAL);
  } else {
    addEvent(win, 'resize', callback, true);
    addEvent(doc, 'scroll', callback, true);
    if (this.USE_MUTATION_OBSERVER && 'MutationObserver' in win) {
      domObserver = new win.MutationObserver(callback);
      domObserver.observe(doc, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true
      });
    }
  }

  this._monitoringDocuments.push(doc);
  this._monitoringUnsubscribes.push(function() {
    // Get the window object again. When a friendly iframe is destroyed, it
    // will be null.
    var win = doc.defaultView;

    if (win) {
      if (monitoringInterval) {
        win.clearInterval(monitoringInterval);
      }
      removeEvent(win, 'resize', callback, true);
    }

    removeEvent(doc, 'scroll', callback, true);
    if (domObserver) {
      domObserver.disconnect();
    }
  });

  // Also monitor the parent.
  var rootDoc =
    (this.root && (this.root.ownerDocument || this.root)) || document;
  if (doc != rootDoc) {
    var frame = getFrameElement(doc);
    if (frame) {
      this._monitorIntersections(frame.ownerDocument);
    }
  }
};


/**
 * Stops polling for intersection changes.
 * @param {!Document} doc
 * @private
 */
IntersectionObserver.prototype._unmonitorIntersections = function(doc) {
  var index = this._monitoringDocuments.indexOf(doc);
  if (index == -1) {
    return;
  }

  var rootDoc =
    (this.root && (this.root.ownerDocument || this.root)) || document;

  // Check if any dependent targets are still remaining.
  var hasDependentTargets =
      this._observationTargets.some(function(item) {
        var itemDoc = item.element.ownerDocument;
        // Target is in this context.
        if (itemDoc == doc) {
          return true;
        }
        // Target is nested in this context.
        while (itemDoc && itemDoc != rootDoc) {
          var frame = getFrameElement(itemDoc);
          itemDoc = frame && frame.ownerDocument;
          if (itemDoc == doc) {
            return true;
          }
        }
        return false;
      });
  if (hasDependentTargets) {
    return;
  }

  // Unsubscribe.
  var unsubscribe = this._monitoringUnsubscribes[index];
  this._monitoringDocuments.splice(index, 1);
  this._monitoringUnsubscribes.splice(index, 1);
  unsubscribe();

  // Also unmonitor the parent.
  if (doc != rootDoc) {
    var frame = getFrameElement(doc);
    if (frame) {
      this._unmonitorIntersections(frame.ownerDocument);
    }
  }
};


/**
 * Stops polling for intersection changes.
 * @param {!Document} doc
 * @private
 */
IntersectionObserver.prototype._unmonitorAllIntersections = function() {
  var unsubscribes = this._monitoringUnsubscribes.slice(0);
  this._monitoringDocuments.length = 0;
  this._monitoringUnsubscribes.length = 0;
  for (var i = 0; i < unsubscribes.length; i++) {
    unsubscribes[i]();
  }
};


/**
 * Scans each observation target for intersection changes and adds them
 * to the internal entries queue. If new entries are found, it
 * schedules the callback to be invoked.
 * @private
 */
IntersectionObserver.prototype._checkForIntersections = function() {
  if (!this.root && crossOriginUpdater && !crossOriginRect) {
    // Cross origin monitoring, but no initial data available yet.
    return;
  }

  var rootIsInDom = this._rootIsInDom();
  var rootRect = rootIsInDom ? this._getRootRect() : getEmptyRect();

  this._observationTargets.forEach(function(item) {
    var target = item.element;
    var targetRect = getBoundingClientRect(target);
    var rootContainsTarget = this._rootContainsTarget(target);
    var oldEntry = item.entry;
    var intersectionRect = rootIsInDom && rootContainsTarget &&
        this._computeTargetAndRootIntersection(target, targetRect, rootRect);

    var rootBounds = null;
    if (!this._rootContainsTarget(target)) {
      rootBounds = getEmptyRect();
    } else if (!crossOriginUpdater || this.root) {
      rootBounds = rootRect;
    }

    var newEntry = item.entry = new IntersectionObserverEntry({
      time: now(),
      target: target,
      boundingClientRect: targetRect,
      rootBounds: rootBounds,
      intersectionRect: intersectionRect
    });

    if (!oldEntry) {
      this._queuedEntries.push(newEntry);
    } else if (rootIsInDom && rootContainsTarget) {
      // If the new entry intersection ratio has crossed any of the
      // thresholds, add a new entry.
      if (this._hasCrossedThreshold(oldEntry, newEntry)) {
        this._queuedEntries.push(newEntry);
      }
    } else {
      // If the root is not in the DOM or target is not contained within
      // root but the previous entry for this target had an intersection,
      // add a new record indicating removal.
      if (oldEntry && oldEntry.isIntersecting) {
        this._queuedEntries.push(newEntry);
      }
    }
  }, this);

  if (this._queuedEntries.length) {
    this._callback(this.takeRecords(), this);
  }
};


/**
 * Accepts a target and root rect computes the intersection between then
 * following the algorithm in the spec.
 * TODO(philipwalton): at this time clip-path is not considered.
 * https://w3c.github.io/IntersectionObserver/#calculate-intersection-rect-algo
 * @param {Element} target The target DOM element
 * @param {Object} targetRect The bounding rect of the target.
 * @param {Object} rootRect The bounding rect of the root after being
 *     expanded by the rootMargin value.
 * @return {?Object} The final intersection rect object or undefined if no
 *     intersection is found.
 * @private
 */
IntersectionObserver.prototype._computeTargetAndRootIntersection =
    function(target, targetRect, rootRect) {
  // If the element isn't displayed, an intersection can't happen.
  if (window.getComputedStyle(target).display == 'none') return;

  var intersectionRect = targetRect;
  var parent = getParentNode(target);
  var atRoot = false;

  while (!atRoot && parent) {
    var parentRect = null;
    var parentComputedStyle = parent.nodeType == 1 ?
        window.getComputedStyle(parent) : {};

    // If the parent isn't displayed, an intersection can't happen.
    if (parentComputedStyle.display == 'none') return null;

    if (parent == this.root || parent.nodeType == /* DOCUMENT */ 9) {
      atRoot = true;
      if (parent == this.root || parent == document) {
        if (crossOriginUpdater && !this.root) {
          if (!crossOriginRect ||
              crossOriginRect.width == 0 && crossOriginRect.height == 0) {
            // A 0-size cross-origin intersection means no-intersection.
            parent = null;
            parentRect = null;
            intersectionRect = null;
          } else {
            parentRect = crossOriginRect;
          }
        } else {
          parentRect = rootRect;
        }
      } else {
        // Check if there's a frame that can be navigated to.
        var frame = getParentNode(parent);
        var frameRect = frame && getBoundingClientRect(frame);
        var frameIntersect =
            frame &&
            this._computeTargetAndRootIntersection(frame, frameRect, rootRect);
        if (frameRect && frameIntersect) {
          parent = frame;
          parentRect = convertFromParentRect(frameRect, frameIntersect);
        } else {
          parent = null;
          intersectionRect = null;
        }
      }
    } else {
      // If the element has a non-visible overflow, and it's not the <body>
      // or <html> element, update the intersection rect.
      // Note: <body> and <html> cannot be clipped to a rect that's not also
      // the document rect, so no need to compute a new intersection.
      var doc = parent.ownerDocument;
      if (parent != doc.body &&
          parent != doc.documentElement &&
          parentComputedStyle.overflow != 'visible') {
        parentRect = getBoundingClientRect(parent);
      }
    }

    // If either of the above conditionals set a new parentRect,
    // calculate new intersection data.
    if (parentRect) {
      intersectionRect = computeRectIntersection(parentRect, intersectionRect);
    }
    if (!intersectionRect) break;
    parent = parent && getParentNode(parent);
  }
  return intersectionRect;
};


/**
 * Returns the root rect after being expanded by the rootMargin value.
 * @return {ClientRect} The expanded root rect.
 * @private
 */
IntersectionObserver.prototype._getRootRect = function() {
  var rootRect;
  if (this.root && !isDoc(this.root)) {
    rootRect = getBoundingClientRect(this.root);
  } else {
    // Use <html>/<body> instead of window since scroll bars affect size.
    var doc = isDoc(this.root) ? this.root : document;
    var html = doc.documentElement;
    var body = doc.body;
    rootRect = {
      top: 0,
      left: 0,
      right: html.clientWidth || body.clientWidth,
      width: html.clientWidth || body.clientWidth,
      bottom: html.clientHeight || body.clientHeight,
      height: html.clientHeight || body.clientHeight
    };
  }
  return this._expandRectByRootMargin(rootRect);
};


/**
 * Accepts a rect and expands it by the rootMargin value.
 * @param {DOMRect|ClientRect} rect The rect object to expand.
 * @return {ClientRect} The expanded rect.
 * @private
 */
IntersectionObserver.prototype._expandRectByRootMargin = function(rect) {
  var margins = this._rootMarginValues.map(function(margin, i) {
    return margin.unit == 'px' ? margin.value :
        margin.value * (i % 2 ? rect.width : rect.height) / 100;
  });
  var newRect = {
    top: rect.top - margins[0],
    right: rect.right + margins[1],
    bottom: rect.bottom + margins[2],
    left: rect.left - margins[3]
  };
  newRect.width = newRect.right - newRect.left;
  newRect.height = newRect.bottom - newRect.top;

  return newRect;
};


/**
 * Accepts an old and new entry and returns true if at least one of the
 * threshold values has been crossed.
 * @param {?IntersectionObserverEntry} oldEntry The previous entry for a
 *    particular target element or null if no previous entry exists.
 * @param {IntersectionObserverEntry} newEntry The current entry for a
 *    particular target element.
 * @return {boolean} Returns true if a any threshold has been crossed.
 * @private
 */
IntersectionObserver.prototype._hasCrossedThreshold =
    function(oldEntry, newEntry) {

  // To make comparing easier, an entry that has a ratio of 0
  // but does not actually intersect is given a value of -1
  var oldRatio = oldEntry && oldEntry.isIntersecting ?
      oldEntry.intersectionRatio || 0 : -1;
  var newRatio = newEntry.isIntersecting ?
      newEntry.intersectionRatio || 0 : -1;

  // Ignore unchanged ratios
  if (oldRatio === newRatio) return;

  for (var i = 0; i < this.thresholds.length; i++) {
    var threshold = this.thresholds[i];

    // Return true if an entry matches a threshold or if the new ratio
    // and the old ratio are on the opposite sides of a threshold.
    if (threshold == oldRatio || threshold == newRatio ||
        threshold < oldRatio !== threshold < newRatio) {
      return true;
    }
  }
};


/**
 * Returns whether or not the root element is an element and is in the DOM.
 * @return {boolean} True if the root element is an element and is in the DOM.
 * @private
 */
IntersectionObserver.prototype._rootIsInDom = function() {
  return !this.root || containsDeep(document, this.root);
};


/**
 * Returns whether or not the target element is a child of root.
 * @param {Element} target The target element to check.
 * @return {boolean} True if the target element is a child of root.
 * @private
 */
IntersectionObserver.prototype._rootContainsTarget = function(target) {
  var rootDoc =
    (this.root && (this.root.ownerDocument || this.root)) || document;
  return (
    containsDeep(rootDoc, target) &&
    (!this.root || rootDoc == target.ownerDocument)
  );
};


/**
 * Adds the instance to the global IntersectionObserver registry if it isn't
 * already present.
 * @private
 */
IntersectionObserver.prototype._registerInstance = function() {
  if (registry.indexOf(this) < 0) {
    registry.push(this);
  }
};


/**
 * Removes the instance from the global IntersectionObserver registry.
 * @private
 */
IntersectionObserver.prototype._unregisterInstance = function() {
  var index = registry.indexOf(this);
  if (index != -1) registry.splice(index, 1);
};


/**
 * Returns the result of the performance.now() method or null in browsers
 * that don't support the API.
 * @return {number} The elapsed time since the page was requested.
 */
function now() {
  return window.performance && performance.now && performance.now();
}


/**
 * Throttles a function and delays its execution, so it's only called at most
 * once within a given time period.
 * @param {Function} fn The function to throttle.
 * @param {number} timeout The amount of time that must pass before the
 *     function can be called again.
 * @return {Function} The throttled function.
 */
function throttle(fn, timeout) {
  var timer = null;
  return function () {
    if (!timer) {
      timer = setTimeout(function() {
        fn();
        timer = null;
      }, timeout);
    }
  };
}


/**
 * Adds an event handler to a DOM node ensuring cross-browser compatibility.
 * @param {Node} node The DOM node to add the event handler to.
 * @param {string} event The event name.
 * @param {Function} fn The event handler to add.
 * @param {boolean} opt_useCapture Optionally adds the even to the capture
 *     phase. Note: this only works in modern browsers.
 */
function addEvent(node, event, fn, opt_useCapture) {
  if (typeof node.addEventListener == 'function') {
    node.addEventListener(event, fn, opt_useCapture || false);
  }
  else if (typeof node.attachEvent == 'function') {
    node.attachEvent('on' + event, fn);
  }
}


/**
 * Removes a previously added event handler from a DOM node.
 * @param {Node} node The DOM node to remove the event handler from.
 * @param {string} event The event name.
 * @param {Function} fn The event handler to remove.
 * @param {boolean} opt_useCapture If the event handler was added with this
 *     flag set to true, it should be set to true here in order to remove it.
 */
function removeEvent(node, event, fn, opt_useCapture) {
  if (typeof node.removeEventListener == 'function') {
    node.removeEventListener(event, fn, opt_useCapture || false);
  }
  else if (typeof node.detatchEvent == 'function') {
    node.detatchEvent('on' + event, fn);
  }
}


/**
 * Returns the intersection between two rect objects.
 * @param {Object} rect1 The first rect.
 * @param {Object} rect2 The second rect.
 * @return {?Object|?ClientRect} The intersection rect or undefined if no
 *     intersection is found.
 */
function computeRectIntersection(rect1, rect2) {
  var top = Math.max(rect1.top, rect2.top);
  var bottom = Math.min(rect1.bottom, rect2.bottom);
  var left = Math.max(rect1.left, rect2.left);
  var right = Math.min(rect1.right, rect2.right);
  var width = right - left;
  var height = bottom - top;

  return (width >= 0 && height >= 0) && {
    top: top,
    bottom: bottom,
    left: left,
    right: right,
    width: width,
    height: height
  } || null;
}


/**
 * Shims the native getBoundingClientRect for compatibility with older IE.
 * @param {Element} el The element whose bounding rect to get.
 * @return {DOMRect|ClientRect} The (possibly shimmed) rect of the element.
 */
function getBoundingClientRect(el) {
  var rect;

  try {
    rect = el.getBoundingClientRect();
  } catch (err) {
    // Ignore Windows 7 IE11 "Unspecified error"
    // https://github.com/w3c/IntersectionObserver/pull/205
  }

  if (!rect) return getEmptyRect();

  // Older IE
  if (!(rect.width && rect.height)) {
    rect = {
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
      width: rect.right - rect.left,
      height: rect.bottom - rect.top
    };
  }
  return rect;
}


/**
 * Returns an empty rect object. An empty rect is returned when an element
 * is not in the DOM.
 * @return {ClientRect} The empty rect.
 */
function getEmptyRect() {
  return {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: 0,
    height: 0
  };
}


/**
 * Ensure that the result has all of the necessary fields of the DOMRect.
 * Specifically this ensures that `x` and `y` fields are set.
 *
 * @param {?DOMRect|?ClientRect} rect
 * @return {?DOMRect}
 */
function ensureDOMRect(rect) {
  // A `DOMRect` object has `x` and `y` fields.
  if (!rect || 'x' in rect) {
    return rect;
  }
  // A IE's `ClientRect` type does not have `x` and `y`. The same is the case
  // for internally calculated Rect objects. For the purposes of
  // `IntersectionObserver`, it's sufficient to simply mirror `left` and `top`
  // for these fields.
  return {
    top: rect.top,
    y: rect.top,
    bottom: rect.bottom,
    left: rect.left,
    x: rect.left,
    right: rect.right,
    width: rect.width,
    height: rect.height
  };
}


/**
 * Inverts the intersection and bounding rect from the parent (frame) BCR to
 * the local BCR space.
 * @param {DOMRect|ClientRect} parentBoundingRect The parent's bound client rect.
 * @param {DOMRect|ClientRect} parentIntersectionRect The parent's own intersection rect.
 * @return {ClientRect} The local root bounding rect for the parent's children.
 */
function convertFromParentRect(parentBoundingRect, parentIntersectionRect) {
  var top = parentIntersectionRect.top - parentBoundingRect.top;
  var left = parentIntersectionRect.left - parentBoundingRect.left;
  return {
    top: top,
    left: left,
    height: parentIntersectionRect.height,
    width: parentIntersectionRect.width,
    bottom: top + parentIntersectionRect.height,
    right: left + parentIntersectionRect.width
  };
}


/**
 * Checks to see if a parent element contains a child element (including inside
 * shadow DOM).
 * @param {Node} parent The parent element.
 * @param {Node} child The child element.
 * @return {boolean} True if the parent node contains the child node.
 */
function containsDeep(parent, child) {
  var node = child;
  while (node) {
    if (node == parent) return true;

    node = getParentNode(node);
  }
  return false;
}


/**
 * Gets the parent node of an element or its host element if the parent node
 * is a shadow root.
 * @param {Node} node The node whose parent to get.
 * @return {Node|null} The parent node or null if no parent exists.
 */
function getParentNode(node) {
  var parent = node.parentNode;

  if (node.nodeType == /* DOCUMENT */ 9 && node != document) {
    // If this node is a document node, look for the embedding frame.
    return getFrameElement(node);
  }

  // If the parent has element that is assigned through shadow root slot
  if (parent && parent.assignedSlot) {
    parent = parent.assignedSlot.parentNode
  }

  if (parent && parent.nodeType == 11 && parent.host) {
    // If the parent is a shadow root, return the host element.
    return parent.host;
  }

  return parent;
}

/**
 * Returns true if `node` is a Document.
 * @param {!Node} node
 * @returns {boolean}
 */
function isDoc(node) {
  return node && node.nodeType === 9;
}


// Exposes the constructors globally.
window.IntersectionObserver = IntersectionObserver;
window.IntersectionObserverEntry = IntersectionObserverEntry;

}());

/*! jQuery v3.5.1 | (c) JS Foundation and other contributors | jquery.org/license */
!function(e,t){"use strict";"object"==typeof module&&"object"==typeof module.exports?module.exports=e.document?t(e,!0):function(e){if(!e.document)throw new Error("jQuery requires a window with a document");return t(e)}:t(e)}("undefined"!=typeof window?window:this,function(C,e){"use strict";var t=[],r=Object.getPrototypeOf,s=t.slice,g=t.flat?function(e){return t.flat.call(e)}:function(e){return t.concat.apply([],e)},u=t.push,i=t.indexOf,n={},o=n.toString,v=n.hasOwnProperty,a=v.toString,l=a.call(Object),y={},m=function(e){return"function"==typeof e&&"number"!=typeof e.nodeType},x=function(e){return null!=e&&e===e.window},E=C.document,c={type:!0,src:!0,nonce:!0,noModule:!0};function b(e,t,n){var r,i,o=(n=n||E).createElement("script");if(o.text=e,t)for(r in c)(i=t[r]||t.getAttribute&&t.getAttribute(r))&&o.setAttribute(r,i);n.head.appendChild(o).parentNode.removeChild(o)}function w(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?n[o.call(e)]||"object":typeof e}var f="3.5.1",S=function(e,t){return new S.fn.init(e,t)};function p(e){var t=!!e&&"length"in e&&e.length,n=w(e);return!m(e)&&!x(e)&&("array"===n||0===t||"number"==typeof t&&0<t&&t-1 in e)}S.fn=S.prototype={jquery:f,constructor:S,length:0,toArray:function(){return s.call(this)},get:function(e){return null==e?s.call(this):e<0?this[e+this.length]:this[e]},pushStack:function(e){var t=S.merge(this.constructor(),e);return t.prevObject=this,t},each:function(e){return S.each(this,e)},map:function(n){return this.pushStack(S.map(this,function(e,t){return n.call(e,t,e)}))},slice:function(){return this.pushStack(s.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},even:function(){return this.pushStack(S.grep(this,function(e,t){return(t+1)%2}))},odd:function(){return this.pushStack(S.grep(this,function(e,t){return t%2}))},eq:function(e){var t=this.length,n=+e+(e<0?t:0);return this.pushStack(0<=n&&n<t?[this[n]]:[])},end:function(){return this.prevObject||this.constructor()},push:u,sort:t.sort,splice:t.splice},S.extend=S.fn.extend=function(){var e,t,n,r,i,o,a=arguments[0]||{},s=1,u=arguments.length,l=!1;for("boolean"==typeof a&&(l=a,a=arguments[s]||{},s++),"object"==typeof a||m(a)||(a={}),s===u&&(a=this,s--);s<u;s++)if(null!=(e=arguments[s]))for(t in e)r=e[t],"__proto__"!==t&&a!==r&&(l&&r&&(S.isPlainObject(r)||(i=Array.isArray(r)))?(n=a[t],o=i&&!Array.isArray(n)?[]:i||S.isPlainObject(n)?n:{},i=!1,a[t]=S.extend(l,o,r)):void 0!==r&&(a[t]=r));return a},S.extend({expando:"jQuery"+(f+Math.random()).replace(/\D/g,""),isReady:!0,error:function(e){throw new Error(e)},noop:function(){},isPlainObject:function(e){var t,n;return!(!e||"[object Object]"!==o.call(e))&&(!(t=r(e))||"function"==typeof(n=v.call(t,"constructor")&&t.constructor)&&a.call(n)===l)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},globalEval:function(e,t,n){b(e,{nonce:t&&t.nonce},n)},each:function(e,t){var n,r=0;if(p(e)){for(n=e.length;r<n;r++)if(!1===t.call(e[r],r,e[r]))break}else for(r in e)if(!1===t.call(e[r],r,e[r]))break;return e},makeArray:function(e,t){var n=t||[];return null!=e&&(p(Object(e))?S.merge(n,"string"==typeof e?[e]:e):u.call(n,e)),n},inArray:function(e,t,n){return null==t?-1:i.call(t,e,n)},merge:function(e,t){for(var n=+t.length,r=0,i=e.length;r<n;r++)e[i++]=t[r];return e.length=i,e},grep:function(e,t,n){for(var r=[],i=0,o=e.length,a=!n;i<o;i++)!t(e[i],i)!==a&&r.push(e[i]);return r},map:function(e,t,n){var r,i,o=0,a=[];if(p(e))for(r=e.length;o<r;o++)null!=(i=t(e[o],o,n))&&a.push(i);else for(o in e)null!=(i=t(e[o],o,n))&&a.push(i);return g(a)},guid:1,support:y}),"function"==typeof Symbol&&(S.fn[Symbol.iterator]=t[Symbol.iterator]),S.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(e,t){n["[object "+t+"]"]=t.toLowerCase()});var d=function(n){var e,d,b,o,i,h,f,g,w,u,l,T,C,a,E,v,s,c,y,S="sizzle"+1*new Date,p=n.document,k=0,r=0,m=ue(),x=ue(),A=ue(),N=ue(),D=function(e,t){return e===t&&(l=!0),0},j={}.hasOwnProperty,t=[],q=t.pop,L=t.push,H=t.push,O=t.slice,P=function(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1},R="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",M="[\\x20\\t\\r\\n\\f]",I="(?:\\\\[\\da-fA-F]{1,6}"+M+"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",W="\\["+M+"*("+I+")(?:"+M+"*([*^$|!~]?=)"+M+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+I+"))|)"+M+"*\\]",F=":("+I+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+W+")*)|.*)\\)|)",B=new RegExp(M+"+","g"),$=new RegExp("^"+M+"+|((?:^|[^\\\\])(?:\\\\.)*)"+M+"+$","g"),_=new RegExp("^"+M+"*,"+M+"*"),z=new RegExp("^"+M+"*([>+~]|"+M+")"+M+"*"),U=new RegExp(M+"|>"),X=new RegExp(F),V=new RegExp("^"+I+"$"),G={ID:new RegExp("^#("+I+")"),CLASS:new RegExp("^\\.("+I+")"),TAG:new RegExp("^("+I+"|[*])"),ATTR:new RegExp("^"+W),PSEUDO:new RegExp("^"+F),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+M+"*(even|odd|(([+-]|)(\\d*)n|)"+M+"*(?:([+-]|)"+M+"*(\\d+)|))"+M+"*\\)|)","i"),bool:new RegExp("^(?:"+R+")$","i"),needsContext:new RegExp("^"+M+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+M+"*((?:-\\d)?\\d*)"+M+"*\\)|)(?=[^-]|$)","i")},Y=/HTML$/i,Q=/^(?:input|select|textarea|button)$/i,J=/^h\d$/i,K=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,ee=/[+~]/,te=new RegExp("\\\\[\\da-fA-F]{1,6}"+M+"?|\\\\([^\\r\\n\\f])","g"),ne=function(e,t){var n="0x"+e.slice(1)-65536;return t||(n<0?String.fromCharCode(n+65536):String.fromCharCode(n>>10|55296,1023&n|56320))},re=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,ie=function(e,t){return t?"\0"===e?"\ufffd":e.slice(0,-1)+"\\"+e.charCodeAt(e.length-1).toString(16)+" ":"\\"+e},oe=function(){T()},ae=be(function(e){return!0===e.disabled&&"fieldset"===e.nodeName.toLowerCase()},{dir:"parentNode",next:"legend"});try{H.apply(t=O.call(p.childNodes),p.childNodes),t[p.childNodes.length].nodeType}catch(e){H={apply:t.length?function(e,t){L.apply(e,O.call(t))}:function(e,t){var n=e.length,r=0;while(e[n++]=t[r++]);e.length=n-1}}}function se(t,e,n,r){var i,o,a,s,u,l,c,f=e&&e.ownerDocument,p=e?e.nodeType:9;if(n=n||[],"string"!=typeof t||!t||1!==p&&9!==p&&11!==p)return n;if(!r&&(T(e),e=e||C,E)){if(11!==p&&(u=Z.exec(t)))if(i=u[1]){if(9===p){if(!(a=e.getElementById(i)))return n;if(a.id===i)return n.push(a),n}else if(f&&(a=f.getElementById(i))&&y(e,a)&&a.id===i)return n.push(a),n}else{if(u[2])return H.apply(n,e.getElementsByTagName(t)),n;if((i=u[3])&&d.getElementsByClassName&&e.getElementsByClassName)return H.apply(n,e.getElementsByClassName(i)),n}if(d.qsa&&!N[t+" "]&&(!v||!v.test(t))&&(1!==p||"object"!==e.nodeName.toLowerCase())){if(c=t,f=e,1===p&&(U.test(t)||z.test(t))){(f=ee.test(t)&&ye(e.parentNode)||e)===e&&d.scope||((s=e.getAttribute("id"))?s=s.replace(re,ie):e.setAttribute("id",s=S)),o=(l=h(t)).length;while(o--)l[o]=(s?"#"+s:":scope")+" "+xe(l[o]);c=l.join(",")}try{return H.apply(n,f.querySelectorAll(c)),n}catch(e){N(t,!0)}finally{s===S&&e.removeAttribute("id")}}}return g(t.replace($,"$1"),e,n,r)}function ue(){var r=[];return function e(t,n){return r.push(t+" ")>b.cacheLength&&delete e[r.shift()],e[t+" "]=n}}function le(e){return e[S]=!0,e}function ce(e){var t=C.createElement("fieldset");try{return!!e(t)}catch(e){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function fe(e,t){var n=e.split("|"),r=n.length;while(r--)b.attrHandle[n[r]]=t}function pe(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&e.sourceIndex-t.sourceIndex;if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return-1;return e?1:-1}function de(t){return function(e){return"input"===e.nodeName.toLowerCase()&&e.type===t}}function he(n){return function(e){var t=e.nodeName.toLowerCase();return("input"===t||"button"===t)&&e.type===n}}function ge(t){return function(e){return"form"in e?e.parentNode&&!1===e.disabled?"label"in e?"label"in e.parentNode?e.parentNode.disabled===t:e.disabled===t:e.isDisabled===t||e.isDisabled!==!t&&ae(e)===t:e.disabled===t:"label"in e&&e.disabled===t}}function ve(a){return le(function(o){return o=+o,le(function(e,t){var n,r=a([],e.length,o),i=r.length;while(i--)e[n=r[i]]&&(e[n]=!(t[n]=e[n]))})})}function ye(e){return e&&"undefined"!=typeof e.getElementsByTagName&&e}for(e in d=se.support={},i=se.isXML=function(e){var t=e.namespaceURI,n=(e.ownerDocument||e).documentElement;return!Y.test(t||n&&n.nodeName||"HTML")},T=se.setDocument=function(e){var t,n,r=e?e.ownerDocument||e:p;return r!=C&&9===r.nodeType&&r.documentElement&&(a=(C=r).documentElement,E=!i(C),p!=C&&(n=C.defaultView)&&n.top!==n&&(n.addEventListener?n.addEventListener("unload",oe,!1):n.attachEvent&&n.attachEvent("onunload",oe)),d.scope=ce(function(e){return a.appendChild(e).appendChild(C.createElement("div")),"undefined"!=typeof e.querySelectorAll&&!e.querySelectorAll(":scope fieldset div").length}),d.attributes=ce(function(e){return e.className="i",!e.getAttribute("className")}),d.getElementsByTagName=ce(function(e){return e.appendChild(C.createComment("")),!e.getElementsByTagName("*").length}),d.getElementsByClassName=K.test(C.getElementsByClassName),d.getById=ce(function(e){return a.appendChild(e).id=S,!C.getElementsByName||!C.getElementsByName(S).length}),d.getById?(b.filter.ID=function(e){var t=e.replace(te,ne);return function(e){return e.getAttribute("id")===t}},b.find.ID=function(e,t){if("undefined"!=typeof t.getElementById&&E){var n=t.getElementById(e);return n?[n]:[]}}):(b.filter.ID=function(e){var n=e.replace(te,ne);return function(e){var t="undefined"!=typeof e.getAttributeNode&&e.getAttributeNode("id");return t&&t.value===n}},b.find.ID=function(e,t){if("undefined"!=typeof t.getElementById&&E){var n,r,i,o=t.getElementById(e);if(o){if((n=o.getAttributeNode("id"))&&n.value===e)return[o];i=t.getElementsByName(e),r=0;while(o=i[r++])if((n=o.getAttributeNode("id"))&&n.value===e)return[o]}return[]}}),b.find.TAG=d.getElementsByTagName?function(e,t){return"undefined"!=typeof t.getElementsByTagName?t.getElementsByTagName(e):d.qsa?t.querySelectorAll(e):void 0}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},b.find.CLASS=d.getElementsByClassName&&function(e,t){if("undefined"!=typeof t.getElementsByClassName&&E)return t.getElementsByClassName(e)},s=[],v=[],(d.qsa=K.test(C.querySelectorAll))&&(ce(function(e){var t;a.appendChild(e).innerHTML="<a id='"+S+"'></a><select id='"+S+"-\r\\' msallowcapture=''><option selected=''></option></select>",e.querySelectorAll("[msallowcapture^='']").length&&v.push("[*^$]="+M+"*(?:''|\"\")"),e.querySelectorAll("[selected]").length||v.push("\\["+M+"*(?:value|"+R+")"),e.querySelectorAll("[id~="+S+"-]").length||v.push("~="),(t=C.createElement("input")).setAttribute("name",""),e.appendChild(t),e.querySelectorAll("[name='']").length||v.push("\\["+M+"*name"+M+"*="+M+"*(?:''|\"\")"),e.querySelectorAll(":checked").length||v.push(":checked"),e.querySelectorAll("a#"+S+"+*").length||v.push(".#.+[+~]"),e.querySelectorAll("\\\f"),v.push("[\\r\\n\\f]")}),ce(function(e){e.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var t=C.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("name","D"),e.querySelectorAll("[name=d]").length&&v.push("name"+M+"*[*^$|!~]?="),2!==e.querySelectorAll(":enabled").length&&v.push(":enabled",":disabled"),a.appendChild(e).disabled=!0,2!==e.querySelectorAll(":disabled").length&&v.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),v.push(",.*:")})),(d.matchesSelector=K.test(c=a.matches||a.webkitMatchesSelector||a.mozMatchesSelector||a.oMatchesSelector||a.msMatchesSelector))&&ce(function(e){d.disconnectedMatch=c.call(e,"*"),c.call(e,"[s!='']:x"),s.push("!=",F)}),v=v.length&&new RegExp(v.join("|")),s=s.length&&new RegExp(s.join("|")),t=K.test(a.compareDocumentPosition),y=t||K.test(a.contains)?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return!0;return!1},D=t?function(e,t){if(e===t)return l=!0,0;var n=!e.compareDocumentPosition-!t.compareDocumentPosition;return n||(1&(n=(e.ownerDocument||e)==(t.ownerDocument||t)?e.compareDocumentPosition(t):1)||!d.sortDetached&&t.compareDocumentPosition(e)===n?e==C||e.ownerDocument==p&&y(p,e)?-1:t==C||t.ownerDocument==p&&y(p,t)?1:u?P(u,e)-P(u,t):0:4&n?-1:1)}:function(e,t){if(e===t)return l=!0,0;var n,r=0,i=e.parentNode,o=t.parentNode,a=[e],s=[t];if(!i||!o)return e==C?-1:t==C?1:i?-1:o?1:u?P(u,e)-P(u,t):0;if(i===o)return pe(e,t);n=e;while(n=n.parentNode)a.unshift(n);n=t;while(n=n.parentNode)s.unshift(n);while(a[r]===s[r])r++;return r?pe(a[r],s[r]):a[r]==p?-1:s[r]==p?1:0}),C},se.matches=function(e,t){return se(e,null,null,t)},se.matchesSelector=function(e,t){if(T(e),d.matchesSelector&&E&&!N[t+" "]&&(!s||!s.test(t))&&(!v||!v.test(t)))try{var n=c.call(e,t);if(n||d.disconnectedMatch||e.document&&11!==e.document.nodeType)return n}catch(e){N(t,!0)}return 0<se(t,C,null,[e]).length},se.contains=function(e,t){return(e.ownerDocument||e)!=C&&T(e),y(e,t)},se.attr=function(e,t){(e.ownerDocument||e)!=C&&T(e);var n=b.attrHandle[t.toLowerCase()],r=n&&j.call(b.attrHandle,t.toLowerCase())?n(e,t,!E):void 0;return void 0!==r?r:d.attributes||!E?e.getAttribute(t):(r=e.getAttributeNode(t))&&r.specified?r.value:null},se.escape=function(e){return(e+"").replace(re,ie)},se.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},se.uniqueSort=function(e){var t,n=[],r=0,i=0;if(l=!d.detectDuplicates,u=!d.sortStable&&e.slice(0),e.sort(D),l){while(t=e[i++])t===e[i]&&(r=n.push(i));while(r--)e.splice(n[r],1)}return u=null,e},o=se.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(1===i||9===i||11===i){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=o(e)}else if(3===i||4===i)return e.nodeValue}else while(t=e[r++])n+=o(t);return n},(b=se.selectors={cacheLength:50,createPseudo:le,match:G,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(te,ne),e[3]=(e[3]||e[4]||e[5]||"").replace(te,ne),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||se.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&se.error(e[0]),e},PSEUDO:function(e){var t,n=!e[6]&&e[2];return G.CHILD.test(e[0])?null:(e[3]?e[2]=e[4]||e[5]||"":n&&X.test(n)&&(t=h(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(te,ne).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=m[e+" "];return t||(t=new RegExp("(^|"+M+")"+e+"("+M+"|$)"))&&m(e,function(e){return t.test("string"==typeof e.className&&e.className||"undefined"!=typeof e.getAttribute&&e.getAttribute("class")||"")})},ATTR:function(n,r,i){return function(e){var t=se.attr(e,n);return null==t?"!="===r:!r||(t+="","="===r?t===i:"!="===r?t!==i:"^="===r?i&&0===t.indexOf(i):"*="===r?i&&-1<t.indexOf(i):"$="===r?i&&t.slice(-i.length)===i:"~="===r?-1<(" "+t.replace(B," ")+" ").indexOf(i):"|="===r&&(t===i||t.slice(0,i.length+1)===i+"-"))}},CHILD:function(h,e,t,g,v){var y="nth"!==h.slice(0,3),m="last"!==h.slice(-4),x="of-type"===e;return 1===g&&0===v?function(e){return!!e.parentNode}:function(e,t,n){var r,i,o,a,s,u,l=y!==m?"nextSibling":"previousSibling",c=e.parentNode,f=x&&e.nodeName.toLowerCase(),p=!n&&!x,d=!1;if(c){if(y){while(l){a=e;while(a=a[l])if(x?a.nodeName.toLowerCase()===f:1===a.nodeType)return!1;u=l="only"===h&&!u&&"nextSibling"}return!0}if(u=[m?c.firstChild:c.lastChild],m&&p){d=(s=(r=(i=(o=(a=c)[S]||(a[S]={}))[a.uniqueID]||(o[a.uniqueID]={}))[h]||[])[0]===k&&r[1])&&r[2],a=s&&c.childNodes[s];while(a=++s&&a&&a[l]||(d=s=0)||u.pop())if(1===a.nodeType&&++d&&a===e){i[h]=[k,s,d];break}}else if(p&&(d=s=(r=(i=(o=(a=e)[S]||(a[S]={}))[a.uniqueID]||(o[a.uniqueID]={}))[h]||[])[0]===k&&r[1]),!1===d)while(a=++s&&a&&a[l]||(d=s=0)||u.pop())if((x?a.nodeName.toLowerCase()===f:1===a.nodeType)&&++d&&(p&&((i=(o=a[S]||(a[S]={}))[a.uniqueID]||(o[a.uniqueID]={}))[h]=[k,d]),a===e))break;return(d-=v)===g||d%g==0&&0<=d/g}}},PSEUDO:function(e,o){var t,a=b.pseudos[e]||b.setFilters[e.toLowerCase()]||se.error("unsupported pseudo: "+e);return a[S]?a(o):1<a.length?(t=[e,e,"",o],b.setFilters.hasOwnProperty(e.toLowerCase())?le(function(e,t){var n,r=a(e,o),i=r.length;while(i--)e[n=P(e,r[i])]=!(t[n]=r[i])}):function(e){return a(e,0,t)}):a}},pseudos:{not:le(function(e){var r=[],i=[],s=f(e.replace($,"$1"));return s[S]?le(function(e,t,n,r){var i,o=s(e,null,r,[]),a=e.length;while(a--)(i=o[a])&&(e[a]=!(t[a]=i))}):function(e,t,n){return r[0]=e,s(r,null,n,i),r[0]=null,!i.pop()}}),has:le(function(t){return function(e){return 0<se(t,e).length}}),contains:le(function(t){return t=t.replace(te,ne),function(e){return-1<(e.textContent||o(e)).indexOf(t)}}),lang:le(function(n){return V.test(n||"")||se.error("unsupported lang: "+n),n=n.replace(te,ne).toLowerCase(),function(e){var t;do{if(t=E?e.lang:e.getAttribute("xml:lang")||e.getAttribute("lang"))return(t=t.toLowerCase())===n||0===t.indexOf(n+"-")}while((e=e.parentNode)&&1===e.nodeType);return!1}}),target:function(e){var t=n.location&&n.location.hash;return t&&t.slice(1)===e.id},root:function(e){return e===a},focus:function(e){return e===C.activeElement&&(!C.hasFocus||C.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:ge(!1),disabled:ge(!0),checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,!0===e.selected},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeType<6)return!1;return!0},parent:function(e){return!b.pseudos.empty(e)},header:function(e){return J.test(e.nodeName)},input:function(e){return Q.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||"text"===t.toLowerCase())},first:ve(function(){return[0]}),last:ve(function(e,t){return[t-1]}),eq:ve(function(e,t,n){return[n<0?n+t:n]}),even:ve(function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e}),odd:ve(function(e,t){for(var n=1;n<t;n+=2)e.push(n);return e}),lt:ve(function(e,t,n){for(var r=n<0?n+t:t<n?t:n;0<=--r;)e.push(r);return e}),gt:ve(function(e,t,n){for(var r=n<0?n+t:n;++r<t;)e.push(r);return e})}}).pseudos.nth=b.pseudos.eq,{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})b.pseudos[e]=de(e);for(e in{submit:!0,reset:!0})b.pseudos[e]=he(e);function me(){}function xe(e){for(var t=0,n=e.length,r="";t<n;t++)r+=e[t].value;return r}function be(s,e,t){var u=e.dir,l=e.next,c=l||u,f=t&&"parentNode"===c,p=r++;return e.first?function(e,t,n){while(e=e[u])if(1===e.nodeType||f)return s(e,t,n);return!1}:function(e,t,n){var r,i,o,a=[k,p];if(n){while(e=e[u])if((1===e.nodeType||f)&&s(e,t,n))return!0}else while(e=e[u])if(1===e.nodeType||f)if(i=(o=e[S]||(e[S]={}))[e.uniqueID]||(o[e.uniqueID]={}),l&&l===e.nodeName.toLowerCase())e=e[u]||e;else{if((r=i[c])&&r[0]===k&&r[1]===p)return a[2]=r[2];if((i[c]=a)[2]=s(e,t,n))return!0}return!1}}function we(i){return 1<i.length?function(e,t,n){var r=i.length;while(r--)if(!i[r](e,t,n))return!1;return!0}:i[0]}function Te(e,t,n,r,i){for(var o,a=[],s=0,u=e.length,l=null!=t;s<u;s++)(o=e[s])&&(n&&!n(o,r,i)||(a.push(o),l&&t.push(s)));return a}function Ce(d,h,g,v,y,e){return v&&!v[S]&&(v=Ce(v)),y&&!y[S]&&(y=Ce(y,e)),le(function(e,t,n,r){var i,o,a,s=[],u=[],l=t.length,c=e||function(e,t,n){for(var r=0,i=t.length;r<i;r++)se(e,t[r],n);return n}(h||"*",n.nodeType?[n]:n,[]),f=!d||!e&&h?c:Te(c,s,d,n,r),p=g?y||(e?d:l||v)?[]:t:f;if(g&&g(f,p,n,r),v){i=Te(p,u),v(i,[],n,r),o=i.length;while(o--)(a=i[o])&&(p[u[o]]=!(f[u[o]]=a))}if(e){if(y||d){if(y){i=[],o=p.length;while(o--)(a=p[o])&&i.push(f[o]=a);y(null,p=[],i,r)}o=p.length;while(o--)(a=p[o])&&-1<(i=y?P(e,a):s[o])&&(e[i]=!(t[i]=a))}}else p=Te(p===t?p.splice(l,p.length):p),y?y(null,t,p,r):H.apply(t,p)})}function Ee(e){for(var i,t,n,r=e.length,o=b.relative[e[0].type],a=o||b.relative[" "],s=o?1:0,u=be(function(e){return e===i},a,!0),l=be(function(e){return-1<P(i,e)},a,!0),c=[function(e,t,n){var r=!o&&(n||t!==w)||((i=t).nodeType?u(e,t,n):l(e,t,n));return i=null,r}];s<r;s++)if(t=b.relative[e[s].type])c=[be(we(c),t)];else{if((t=b.filter[e[s].type].apply(null,e[s].matches))[S]){for(n=++s;n<r;n++)if(b.relative[e[n].type])break;return Ce(1<s&&we(c),1<s&&xe(e.slice(0,s-1).concat({value:" "===e[s-2].type?"*":""})).replace($,"$1"),t,s<n&&Ee(e.slice(s,n)),n<r&&Ee(e=e.slice(n)),n<r&&xe(e))}c.push(t)}return we(c)}return me.prototype=b.filters=b.pseudos,b.setFilters=new me,h=se.tokenize=function(e,t){var n,r,i,o,a,s,u,l=x[e+" "];if(l)return t?0:l.slice(0);a=e,s=[],u=b.preFilter;while(a){for(o in n&&!(r=_.exec(a))||(r&&(a=a.slice(r[0].length)||a),s.push(i=[])),n=!1,(r=z.exec(a))&&(n=r.shift(),i.push({value:n,type:r[0].replace($," ")}),a=a.slice(n.length)),b.filter)!(r=G[o].exec(a))||u[o]&&!(r=u[o](r))||(n=r.shift(),i.push({value:n,type:o,matches:r}),a=a.slice(n.length));if(!n)break}return t?a.length:a?se.error(e):x(e,s).slice(0)},f=se.compile=function(e,t){var n,v,y,m,x,r,i=[],o=[],a=A[e+" "];if(!a){t||(t=h(e)),n=t.length;while(n--)(a=Ee(t[n]))[S]?i.push(a):o.push(a);(a=A(e,(v=o,m=0<(y=i).length,x=0<v.length,r=function(e,t,n,r,i){var o,a,s,u=0,l="0",c=e&&[],f=[],p=w,d=e||x&&b.find.TAG("*",i),h=k+=null==p?1:Math.random()||.1,g=d.length;for(i&&(w=t==C||t||i);l!==g&&null!=(o=d[l]);l++){if(x&&o){a=0,t||o.ownerDocument==C||(T(o),n=!E);while(s=v[a++])if(s(o,t||C,n)){r.push(o);break}i&&(k=h)}m&&((o=!s&&o)&&u--,e&&c.push(o))}if(u+=l,m&&l!==u){a=0;while(s=y[a++])s(c,f,t,n);if(e){if(0<u)while(l--)c[l]||f[l]||(f[l]=q.call(r));f=Te(f)}H.apply(r,f),i&&!e&&0<f.length&&1<u+y.length&&se.uniqueSort(r)}return i&&(k=h,w=p),c},m?le(r):r))).selector=e}return a},g=se.select=function(e,t,n,r){var i,o,a,s,u,l="function"==typeof e&&e,c=!r&&h(e=l.selector||e);if(n=n||[],1===c.length){if(2<(o=c[0]=c[0].slice(0)).length&&"ID"===(a=o[0]).type&&9===t.nodeType&&E&&b.relative[o[1].type]){if(!(t=(b.find.ID(a.matches[0].replace(te,ne),t)||[])[0]))return n;l&&(t=t.parentNode),e=e.slice(o.shift().value.length)}i=G.needsContext.test(e)?0:o.length;while(i--){if(a=o[i],b.relative[s=a.type])break;if((u=b.find[s])&&(r=u(a.matches[0].replace(te,ne),ee.test(o[0].type)&&ye(t.parentNode)||t))){if(o.splice(i,1),!(e=r.length&&xe(o)))return H.apply(n,r),n;break}}}return(l||f(e,c))(r,t,!E,n,!t||ee.test(e)&&ye(t.parentNode)||t),n},d.sortStable=S.split("").sort(D).join("")===S,d.detectDuplicates=!!l,T(),d.sortDetached=ce(function(e){return 1&e.compareDocumentPosition(C.createElement("fieldset"))}),ce(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||fe("type|href|height|width",function(e,t,n){if(!n)return e.getAttribute(t,"type"===t.toLowerCase()?1:2)}),d.attributes&&ce(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||fe("value",function(e,t,n){if(!n&&"input"===e.nodeName.toLowerCase())return e.defaultValue}),ce(function(e){return null==e.getAttribute("disabled")})||fe(R,function(e,t,n){var r;if(!n)return!0===e[t]?t.toLowerCase():(r=e.getAttributeNode(t))&&r.specified?r.value:null}),se}(C);S.find=d,S.expr=d.selectors,S.expr[":"]=S.expr.pseudos,S.uniqueSort=S.unique=d.uniqueSort,S.text=d.getText,S.isXMLDoc=d.isXML,S.contains=d.contains,S.escapeSelector=d.escape;var h=function(e,t,n){var r=[],i=void 0!==n;while((e=e[t])&&9!==e.nodeType)if(1===e.nodeType){if(i&&S(e).is(n))break;r.push(e)}return r},T=function(e,t){for(var n=[];e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n},k=S.expr.match.needsContext;function A(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()}var N=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;function D(e,n,r){return m(n)?S.grep(e,function(e,t){return!!n.call(e,t,e)!==r}):n.nodeType?S.grep(e,function(e){return e===n!==r}):"string"!=typeof n?S.grep(e,function(e){return-1<i.call(n,e)!==r}):S.filter(n,e,r)}S.filter=function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?S.find.matchesSelector(r,e)?[r]:[]:S.find.matches(e,S.grep(t,function(e){return 1===e.nodeType}))},S.fn.extend({find:function(e){var t,n,r=this.length,i=this;if("string"!=typeof e)return this.pushStack(S(e).filter(function(){for(t=0;t<r;t++)if(S.contains(i[t],this))return!0}));for(n=this.pushStack([]),t=0;t<r;t++)S.find(e,i[t],n);return 1<r?S.uniqueSort(n):n},filter:function(e){return this.pushStack(D(this,e||[],!1))},not:function(e){return this.pushStack(D(this,e||[],!0))},is:function(e){return!!D(this,"string"==typeof e&&k.test(e)?S(e):e||[],!1).length}});var j,q=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;(S.fn.init=function(e,t,n){var r,i;if(!e)return this;if(n=n||j,"string"==typeof e){if(!(r="<"===e[0]&&">"===e[e.length-1]&&3<=e.length?[null,e,null]:q.exec(e))||!r[1]&&t)return!t||t.jquery?(t||n).find(e):this.constructor(t).find(e);if(r[1]){if(t=t instanceof S?t[0]:t,S.merge(this,S.parseHTML(r[1],t&&t.nodeType?t.ownerDocument||t:E,!0)),N.test(r[1])&&S.isPlainObject(t))for(r in t)m(this[r])?this[r](t[r]):this.attr(r,t[r]);return this}return(i=E.getElementById(r[2]))&&(this[0]=i,this.length=1),this}return e.nodeType?(this[0]=e,this.length=1,this):m(e)?void 0!==n.ready?n.ready(e):e(S):S.makeArray(e,this)}).prototype=S.fn,j=S(E);var L=/^(?:parents|prev(?:Until|All))/,H={children:!0,contents:!0,next:!0,prev:!0};function O(e,t){while((e=e[t])&&1!==e.nodeType);return e}S.fn.extend({has:function(e){var t=S(e,this),n=t.length;return this.filter(function(){for(var e=0;e<n;e++)if(S.contains(this,t[e]))return!0})},closest:function(e,t){var n,r=0,i=this.length,o=[],a="string"!=typeof e&&S(e);if(!k.test(e))for(;r<i;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(n.nodeType<11&&(a?-1<a.index(n):1===n.nodeType&&S.find.matchesSelector(n,e))){o.push(n);break}return this.pushStack(1<o.length?S.uniqueSort(o):o)},index:function(e){return e?"string"==typeof e?i.call(S(e),this[0]):i.call(this,e.jquery?e[0]:e):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){return this.pushStack(S.uniqueSort(S.merge(this.get(),S(e,t))))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}}),S.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return h(e,"parentNode")},parentsUntil:function(e,t,n){return h(e,"parentNode",n)},next:function(e){return O(e,"nextSibling")},prev:function(e){return O(e,"previousSibling")},nextAll:function(e){return h(e,"nextSibling")},prevAll:function(e){return h(e,"previousSibling")},nextUntil:function(e,t,n){return h(e,"nextSibling",n)},prevUntil:function(e,t,n){return h(e,"previousSibling",n)},siblings:function(e){return T((e.parentNode||{}).firstChild,e)},children:function(e){return T(e.firstChild)},contents:function(e){return null!=e.contentDocument&&r(e.contentDocument)?e.contentDocument:(A(e,"template")&&(e=e.content||e),S.merge([],e.childNodes))}},function(r,i){S.fn[r]=function(e,t){var n=S.map(this,i,e);return"Until"!==r.slice(-5)&&(t=e),t&&"string"==typeof t&&(n=S.filter(t,n)),1<this.length&&(H[r]||S.uniqueSort(n),L.test(r)&&n.reverse()),this.pushStack(n)}});var P=/[^\x20\t\r\n\f]+/g;function R(e){return e}function M(e){throw e}function I(e,t,n,r){var i;try{e&&m(i=e.promise)?i.call(e).done(t).fail(n):e&&m(i=e.then)?i.call(e,t,n):t.apply(void 0,[e].slice(r))}catch(e){n.apply(void 0,[e])}}S.Callbacks=function(r){var e,n;r="string"==typeof r?(e=r,n={},S.each(e.match(P)||[],function(e,t){n[t]=!0}),n):S.extend({},r);var i,t,o,a,s=[],u=[],l=-1,c=function(){for(a=a||r.once,o=i=!0;u.length;l=-1){t=u.shift();while(++l<s.length)!1===s[l].apply(t[0],t[1])&&r.stopOnFalse&&(l=s.length,t=!1)}r.memory||(t=!1),i=!1,a&&(s=t?[]:"")},f={add:function(){return s&&(t&&!i&&(l=s.length-1,u.push(t)),function n(e){S.each(e,function(e,t){m(t)?r.unique&&f.has(t)||s.push(t):t&&t.length&&"string"!==w(t)&&n(t)})}(arguments),t&&!i&&c()),this},remove:function(){return S.each(arguments,function(e,t){var n;while(-1<(n=S.inArray(t,s,n)))s.splice(n,1),n<=l&&l--}),this},has:function(e){return e?-1<S.inArray(e,s):0<s.length},empty:function(){return s&&(s=[]),this},disable:function(){return a=u=[],s=t="",this},disabled:function(){return!s},lock:function(){return a=u=[],t||i||(s=t=""),this},locked:function(){return!!a},fireWith:function(e,t){return a||(t=[e,(t=t||[]).slice?t.slice():t],u.push(t),i||c()),this},fire:function(){return f.fireWith(this,arguments),this},fired:function(){return!!o}};return f},S.extend({Deferred:function(e){var o=[["notify","progress",S.Callbacks("memory"),S.Callbacks("memory"),2],["resolve","done",S.Callbacks("once memory"),S.Callbacks("once memory"),0,"resolved"],["reject","fail",S.Callbacks("once memory"),S.Callbacks("once memory"),1,"rejected"]],i="pending",a={state:function(){return i},always:function(){return s.done(arguments).fail(arguments),this},"catch":function(e){return a.then(null,e)},pipe:function(){var i=arguments;return S.Deferred(function(r){S.each(o,function(e,t){var n=m(i[t[4]])&&i[t[4]];s[t[1]](function(){var e=n&&n.apply(this,arguments);e&&m(e.promise)?e.promise().progress(r.notify).done(r.resolve).fail(r.reject):r[t[0]+"With"](this,n?[e]:arguments)})}),i=null}).promise()},then:function(t,n,r){var u=0;function l(i,o,a,s){return function(){var n=this,r=arguments,e=function(){var e,t;if(!(i<u)){if((e=a.apply(n,r))===o.promise())throw new TypeError("Thenable self-resolution");t=e&&("object"==typeof e||"function"==typeof e)&&e.then,m(t)?s?t.call(e,l(u,o,R,s),l(u,o,M,s)):(u++,t.call(e,l(u,o,R,s),l(u,o,M,s),l(u,o,R,o.notifyWith))):(a!==R&&(n=void 0,r=[e]),(s||o.resolveWith)(n,r))}},t=s?e:function(){try{e()}catch(e){S.Deferred.exceptionHook&&S.Deferred.exceptionHook(e,t.stackTrace),u<=i+1&&(a!==M&&(n=void 0,r=[e]),o.rejectWith(n,r))}};i?t():(S.Deferred.getStackHook&&(t.stackTrace=S.Deferred.getStackHook()),C.setTimeout(t))}}return S.Deferred(function(e){o[0][3].add(l(0,e,m(r)?r:R,e.notifyWith)),o[1][3].add(l(0,e,m(t)?t:R)),o[2][3].add(l(0,e,m(n)?n:M))}).promise()},promise:function(e){return null!=e?S.extend(e,a):a}},s={};return S.each(o,function(e,t){var n=t[2],r=t[5];a[t[1]]=n.add,r&&n.add(function(){i=r},o[3-e][2].disable,o[3-e][3].disable,o[0][2].lock,o[0][3].lock),n.add(t[3].fire),s[t[0]]=function(){return s[t[0]+"With"](this===s?void 0:this,arguments),this},s[t[0]+"With"]=n.fireWith}),a.promise(s),e&&e.call(s,s),s},when:function(e){var n=arguments.length,t=n,r=Array(t),i=s.call(arguments),o=S.Deferred(),a=function(t){return function(e){r[t]=this,i[t]=1<arguments.length?s.call(arguments):e,--n||o.resolveWith(r,i)}};if(n<=1&&(I(e,o.done(a(t)).resolve,o.reject,!n),"pending"===o.state()||m(i[t]&&i[t].then)))return o.then();while(t--)I(i[t],a(t),o.reject);return o.promise()}});var W=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;S.Deferred.exceptionHook=function(e,t){C.console&&C.console.warn&&e&&W.test(e.name)&&C.console.warn("jQuery.Deferred exception: "+e.message,e.stack,t)},S.readyException=function(e){C.setTimeout(function(){throw e})};var F=S.Deferred();function B(){E.removeEventListener("DOMContentLoaded",B),C.removeEventListener("load",B),S.ready()}S.fn.ready=function(e){return F.then(e)["catch"](function(e){S.readyException(e)}),this},S.extend({isReady:!1,readyWait:1,ready:function(e){(!0===e?--S.readyWait:S.isReady)||(S.isReady=!0)!==e&&0<--S.readyWait||F.resolveWith(E,[S])}}),S.ready.then=F.then,"complete"===E.readyState||"loading"!==E.readyState&&!E.documentElement.doScroll?C.setTimeout(S.ready):(E.addEventListener("DOMContentLoaded",B),C.addEventListener("load",B));var $=function(e,t,n,r,i,o,a){var s=0,u=e.length,l=null==n;if("object"===w(n))for(s in i=!0,n)$(e,t,s,n[s],!0,o,a);else if(void 0!==r&&(i=!0,m(r)||(a=!0),l&&(a?(t.call(e,r),t=null):(l=t,t=function(e,t,n){return l.call(S(e),n)})),t))for(;s<u;s++)t(e[s],n,a?r:r.call(e[s],s,t(e[s],n)));return i?e:l?t.call(e):u?t(e[0],n):o},_=/^-ms-/,z=/-([a-z])/g;function U(e,t){return t.toUpperCase()}function X(e){return e.replace(_,"ms-").replace(z,U)}var V=function(e){return 1===e.nodeType||9===e.nodeType||!+e.nodeType};function G(){this.expando=S.expando+G.uid++}G.uid=1,G.prototype={cache:function(e){var t=e[this.expando];return t||(t={},V(e)&&(e.nodeType?e[this.expando]=t:Object.defineProperty(e,this.expando,{value:t,configurable:!0}))),t},set:function(e,t,n){var r,i=this.cache(e);if("string"==typeof t)i[X(t)]=n;else for(r in t)i[X(r)]=t[r];return i},get:function(e,t){return void 0===t?this.cache(e):e[this.expando]&&e[this.expando][X(t)]},access:function(e,t,n){return void 0===t||t&&"string"==typeof t&&void 0===n?this.get(e,t):(this.set(e,t,n),void 0!==n?n:t)},remove:function(e,t){var n,r=e[this.expando];if(void 0!==r){if(void 0!==t){n=(t=Array.isArray(t)?t.map(X):(t=X(t))in r?[t]:t.match(P)||[]).length;while(n--)delete r[t[n]]}(void 0===t||S.isEmptyObject(r))&&(e.nodeType?e[this.expando]=void 0:delete e[this.expando])}},hasData:function(e){var t=e[this.expando];return void 0!==t&&!S.isEmptyObject(t)}};var Y=new G,Q=new G,J=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,K=/[A-Z]/g;function Z(e,t,n){var r,i;if(void 0===n&&1===e.nodeType)if(r="data-"+t.replace(K,"-$&").toLowerCase(),"string"==typeof(n=e.getAttribute(r))){try{n="true"===(i=n)||"false"!==i&&("null"===i?null:i===+i+""?+i:J.test(i)?JSON.parse(i):i)}catch(e){}Q.set(e,t,n)}else n=void 0;return n}S.extend({hasData:function(e){return Q.hasData(e)||Y.hasData(e)},data:function(e,t,n){return Q.access(e,t,n)},removeData:function(e,t){Q.remove(e,t)},_data:function(e,t,n){return Y.access(e,t,n)},_removeData:function(e,t){Y.remove(e,t)}}),S.fn.extend({data:function(n,e){var t,r,i,o=this[0],a=o&&o.attributes;if(void 0===n){if(this.length&&(i=Q.get(o),1===o.nodeType&&!Y.get(o,"hasDataAttrs"))){t=a.length;while(t--)a[t]&&0===(r=a[t].name).indexOf("data-")&&(r=X(r.slice(5)),Z(o,r,i[r]));Y.set(o,"hasDataAttrs",!0)}return i}return"object"==typeof n?this.each(function(){Q.set(this,n)}):$(this,function(e){var t;if(o&&void 0===e)return void 0!==(t=Q.get(o,n))?t:void 0!==(t=Z(o,n))?t:void 0;this.each(function(){Q.set(this,n,e)})},null,e,1<arguments.length,null,!0)},removeData:function(e){return this.each(function(){Q.remove(this,e)})}}),S.extend({queue:function(e,t,n){var r;if(e)return t=(t||"fx")+"queue",r=Y.get(e,t),n&&(!r||Array.isArray(n)?r=Y.access(e,t,S.makeArray(n)):r.push(n)),r||[]},dequeue:function(e,t){t=t||"fx";var n=S.queue(e,t),r=n.length,i=n.shift(),o=S._queueHooks(e,t);"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,function(){S.dequeue(e,t)},o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return Y.get(e,n)||Y.access(e,n,{empty:S.Callbacks("once memory").add(function(){Y.remove(e,[t+"queue",n])})})}}),S.fn.extend({queue:function(t,n){var e=2;return"string"!=typeof t&&(n=t,t="fx",e--),arguments.length<e?S.queue(this[0],t):void 0===n?this:this.each(function(){var e=S.queue(this,t,n);S._queueHooks(this,t),"fx"===t&&"inprogress"!==e[0]&&S.dequeue(this,t)})},dequeue:function(e){return this.each(function(){S.dequeue(this,e)})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,t){var n,r=1,i=S.Deferred(),o=this,a=this.length,s=function(){--r||i.resolveWith(o,[o])};"string"!=typeof e&&(t=e,e=void 0),e=e||"fx";while(a--)(n=Y.get(o[a],e+"queueHooks"))&&n.empty&&(r++,n.empty.add(s));return s(),i.promise(t)}});var ee=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,te=new RegExp("^(?:([+-])=|)("+ee+")([a-z%]*)$","i"),ne=["Top","Right","Bottom","Left"],re=E.documentElement,ie=function(e){return S.contains(e.ownerDocument,e)},oe={composed:!0};re.getRootNode&&(ie=function(e){return S.contains(e.ownerDocument,e)||e.getRootNode(oe)===e.ownerDocument});var ae=function(e,t){return"none"===(e=t||e).style.display||""===e.style.display&&ie(e)&&"none"===S.css(e,"display")};function se(e,t,n,r){var i,o,a=20,s=r?function(){return r.cur()}:function(){return S.css(e,t,"")},u=s(),l=n&&n[3]||(S.cssNumber[t]?"":"px"),c=e.nodeType&&(S.cssNumber[t]||"px"!==l&&+u)&&te.exec(S.css(e,t));if(c&&c[3]!==l){u/=2,l=l||c[3],c=+u||1;while(a--)S.style(e,t,c+l),(1-o)*(1-(o=s()/u||.5))<=0&&(a=0),c/=o;c*=2,S.style(e,t,c+l),n=n||[]}return n&&(c=+c||+u||0,i=n[1]?c+(n[1]+1)*n[2]:+n[2],r&&(r.unit=l,r.start=c,r.end=i)),i}var ue={};function le(e,t){for(var n,r,i,o,a,s,u,l=[],c=0,f=e.length;c<f;c++)(r=e[c]).style&&(n=r.style.display,t?("none"===n&&(l[c]=Y.get(r,"display")||null,l[c]||(r.style.display="")),""===r.style.display&&ae(r)&&(l[c]=(u=a=o=void 0,a=(i=r).ownerDocument,s=i.nodeName,(u=ue[s])||(o=a.body.appendChild(a.createElement(s)),u=S.css(o,"display"),o.parentNode.removeChild(o),"none"===u&&(u="block"),ue[s]=u)))):"none"!==n&&(l[c]="none",Y.set(r,"display",n)));for(c=0;c<f;c++)null!=l[c]&&(e[c].style.display=l[c]);return e}S.fn.extend({show:function(){return le(this,!0)},hide:function(){return le(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){ae(this)?S(this).show():S(this).hide()})}});var ce,fe,pe=/^(?:checkbox|radio)$/i,de=/<([a-z][^\/\0>\x20\t\r\n\f]*)/i,he=/^$|^module$|\/(?:java|ecma)script/i;ce=E.createDocumentFragment().appendChild(E.createElement("div")),(fe=E.createElement("input")).setAttribute("type","radio"),fe.setAttribute("checked","checked"),fe.setAttribute("name","t"),ce.appendChild(fe),y.checkClone=ce.cloneNode(!0).cloneNode(!0).lastChild.checked,ce.innerHTML="<textarea>x</textarea>",y.noCloneChecked=!!ce.cloneNode(!0).lastChild.defaultValue,ce.innerHTML="<option></option>",y.option=!!ce.lastChild;var ge={thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};function ve(e,t){var n;return n="undefined"!=typeof e.getElementsByTagName?e.getElementsByTagName(t||"*"):"undefined"!=typeof e.querySelectorAll?e.querySelectorAll(t||"*"):[],void 0===t||t&&A(e,t)?S.merge([e],n):n}function ye(e,t){for(var n=0,r=e.length;n<r;n++)Y.set(e[n],"globalEval",!t||Y.get(t[n],"globalEval"))}ge.tbody=ge.tfoot=ge.colgroup=ge.caption=ge.thead,ge.th=ge.td,y.option||(ge.optgroup=ge.option=[1,"<select multiple='multiple'>","</select>"]);var me=/<|&#?\w+;/;function xe(e,t,n,r,i){for(var o,a,s,u,l,c,f=t.createDocumentFragment(),p=[],d=0,h=e.length;d<h;d++)if((o=e[d])||0===o)if("object"===w(o))S.merge(p,o.nodeType?[o]:o);else if(me.test(o)){a=a||f.appendChild(t.createElement("div")),s=(de.exec(o)||["",""])[1].toLowerCase(),u=ge[s]||ge._default,a.innerHTML=u[1]+S.htmlPrefilter(o)+u[2],c=u[0];while(c--)a=a.lastChild;S.merge(p,a.childNodes),(a=f.firstChild).textContent=""}else p.push(t.createTextNode(o));f.textContent="",d=0;while(o=p[d++])if(r&&-1<S.inArray(o,r))i&&i.push(o);else if(l=ie(o),a=ve(f.appendChild(o),"script"),l&&ye(a),n){c=0;while(o=a[c++])he.test(o.type||"")&&n.push(o)}return f}var be=/^key/,we=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,Te=/^([^.]*)(?:\.(.+)|)/;function Ce(){return!0}function Ee(){return!1}function Se(e,t){return e===function(){try{return E.activeElement}catch(e){}}()==("focus"===t)}function ke(e,t,n,r,i,o){var a,s;if("object"==typeof t){for(s in"string"!=typeof n&&(r=r||n,n=void 0),t)ke(e,s,n,r,t[s],o);return e}if(null==r&&null==i?(i=n,r=n=void 0):null==i&&("string"==typeof n?(i=r,r=void 0):(i=r,r=n,n=void 0)),!1===i)i=Ee;else if(!i)return e;return 1===o&&(a=i,(i=function(e){return S().off(e),a.apply(this,arguments)}).guid=a.guid||(a.guid=S.guid++)),e.each(function(){S.event.add(this,t,i,r,n)})}function Ae(e,i,o){o?(Y.set(e,i,!1),S.event.add(e,i,{namespace:!1,handler:function(e){var t,n,r=Y.get(this,i);if(1&e.isTrigger&&this[i]){if(r.length)(S.event.special[i]||{}).delegateType&&e.stopPropagation();else if(r=s.call(arguments),Y.set(this,i,r),t=o(this,i),this[i](),r!==(n=Y.get(this,i))||t?Y.set(this,i,!1):n={},r!==n)return e.stopImmediatePropagation(),e.preventDefault(),n.value}else r.length&&(Y.set(this,i,{value:S.event.trigger(S.extend(r[0],S.Event.prototype),r.slice(1),this)}),e.stopImmediatePropagation())}})):void 0===Y.get(e,i)&&S.event.add(e,i,Ce)}S.event={global:{},add:function(t,e,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,v=Y.get(t);if(V(t)){n.handler&&(n=(o=n).handler,i=o.selector),i&&S.find.matchesSelector(re,i),n.guid||(n.guid=S.guid++),(u=v.events)||(u=v.events=Object.create(null)),(a=v.handle)||(a=v.handle=function(e){return"undefined"!=typeof S&&S.event.triggered!==e.type?S.event.dispatch.apply(t,arguments):void 0}),l=(e=(e||"").match(P)||[""]).length;while(l--)d=g=(s=Te.exec(e[l])||[])[1],h=(s[2]||"").split(".").sort(),d&&(f=S.event.special[d]||{},d=(i?f.delegateType:f.bindType)||d,f=S.event.special[d]||{},c=S.extend({type:d,origType:g,data:r,handler:n,guid:n.guid,selector:i,needsContext:i&&S.expr.match.needsContext.test(i),namespace:h.join(".")},o),(p=u[d])||((p=u[d]=[]).delegateCount=0,f.setup&&!1!==f.setup.call(t,r,h,a)||t.addEventListener&&t.addEventListener(d,a)),f.add&&(f.add.call(t,c),c.handler.guid||(c.handler.guid=n.guid)),i?p.splice(p.delegateCount++,0,c):p.push(c),S.event.global[d]=!0)}},remove:function(e,t,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,v=Y.hasData(e)&&Y.get(e);if(v&&(u=v.events)){l=(t=(t||"").match(P)||[""]).length;while(l--)if(d=g=(s=Te.exec(t[l])||[])[1],h=(s[2]||"").split(".").sort(),d){f=S.event.special[d]||{},p=u[d=(r?f.delegateType:f.bindType)||d]||[],s=s[2]&&new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),a=o=p.length;while(o--)c=p[o],!i&&g!==c.origType||n&&n.guid!==c.guid||s&&!s.test(c.namespace)||r&&r!==c.selector&&("**"!==r||!c.selector)||(p.splice(o,1),c.selector&&p.delegateCount--,f.remove&&f.remove.call(e,c));a&&!p.length&&(f.teardown&&!1!==f.teardown.call(e,h,v.handle)||S.removeEvent(e,d,v.handle),delete u[d])}else for(d in u)S.event.remove(e,d+t[l],n,r,!0);S.isEmptyObject(u)&&Y.remove(e,"handle events")}},dispatch:function(e){var t,n,r,i,o,a,s=new Array(arguments.length),u=S.event.fix(e),l=(Y.get(this,"events")||Object.create(null))[u.type]||[],c=S.event.special[u.type]||{};for(s[0]=u,t=1;t<arguments.length;t++)s[t]=arguments[t];if(u.delegateTarget=this,!c.preDispatch||!1!==c.preDispatch.call(this,u)){a=S.event.handlers.call(this,u,l),t=0;while((i=a[t++])&&!u.isPropagationStopped()){u.currentTarget=i.elem,n=0;while((o=i.handlers[n++])&&!u.isImmediatePropagationStopped())u.rnamespace&&!1!==o.namespace&&!u.rnamespace.test(o.namespace)||(u.handleObj=o,u.data=o.data,void 0!==(r=((S.event.special[o.origType]||{}).handle||o.handler).apply(i.elem,s))&&!1===(u.result=r)&&(u.preventDefault(),u.stopPropagation()))}return c.postDispatch&&c.postDispatch.call(this,u),u.result}},handlers:function(e,t){var n,r,i,o,a,s=[],u=t.delegateCount,l=e.target;if(u&&l.nodeType&&!("click"===e.type&&1<=e.button))for(;l!==this;l=l.parentNode||this)if(1===l.nodeType&&("click"!==e.type||!0!==l.disabled)){for(o=[],a={},n=0;n<u;n++)void 0===a[i=(r=t[n]).selector+" "]&&(a[i]=r.needsContext?-1<S(i,this).index(l):S.find(i,this,null,[l]).length),a[i]&&o.push(r);o.length&&s.push({elem:l,handlers:o})}return l=this,u<t.length&&s.push({elem:l,handlers:t.slice(u)}),s},addProp:function(t,e){Object.defineProperty(S.Event.prototype,t,{enumerable:!0,configurable:!0,get:m(e)?function(){if(this.originalEvent)return e(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[t]},set:function(e){Object.defineProperty(this,t,{enumerable:!0,configurable:!0,writable:!0,value:e})}})},fix:function(e){return e[S.expando]?e:new S.Event(e)},special:{load:{noBubble:!0},click:{setup:function(e){var t=this||e;return pe.test(t.type)&&t.click&&A(t,"input")&&Ae(t,"click",Ce),!1},trigger:function(e){var t=this||e;return pe.test(t.type)&&t.click&&A(t,"input")&&Ae(t,"click"),!0},_default:function(e){var t=e.target;return pe.test(t.type)&&t.click&&A(t,"input")&&Y.get(t,"click")||A(t,"a")}},beforeunload:{postDispatch:function(e){void 0!==e.result&&e.originalEvent&&(e.originalEvent.returnValue=e.result)}}}},S.removeEvent=function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n)},S.Event=function(e,t){if(!(this instanceof S.Event))return new S.Event(e,t);e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||void 0===e.defaultPrevented&&!1===e.returnValue?Ce:Ee,this.target=e.target&&3===e.target.nodeType?e.target.parentNode:e.target,this.currentTarget=e.currentTarget,this.relatedTarget=e.relatedTarget):this.type=e,t&&S.extend(this,t),this.timeStamp=e&&e.timeStamp||Date.now(),this[S.expando]=!0},S.Event.prototype={constructor:S.Event,isDefaultPrevented:Ee,isPropagationStopped:Ee,isImmediatePropagationStopped:Ee,isSimulated:!1,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=Ce,e&&!this.isSimulated&&e.preventDefault()},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=Ce,e&&!this.isSimulated&&e.stopPropagation()},stopImmediatePropagation:function(){var e=this.originalEvent;this.isImmediatePropagationStopped=Ce,e&&!this.isSimulated&&e.stopImmediatePropagation(),this.stopPropagation()}},S.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,"char":!0,code:!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:function(e){var t=e.button;return null==e.which&&be.test(e.type)?null!=e.charCode?e.charCode:e.keyCode:!e.which&&void 0!==t&&we.test(e.type)?1&t?1:2&t?3:4&t?2:0:e.which}},S.event.addProp),S.each({focus:"focusin",blur:"focusout"},function(e,t){S.event.special[e]={setup:function(){return Ae(this,e,Se),!1},trigger:function(){return Ae(this,e),!0},delegateType:t}}),S.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(e,i){S.event.special[e]={delegateType:i,bindType:i,handle:function(e){var t,n=e.relatedTarget,r=e.handleObj;return n&&(n===this||S.contains(this,n))||(e.type=r.origType,t=r.handler.apply(this,arguments),e.type=i),t}}}),S.fn.extend({on:function(e,t,n,r){return ke(this,e,t,n,r)},one:function(e,t,n,r){return ke(this,e,t,n,r,1)},off:function(e,t,n){var r,i;if(e&&e.preventDefault&&e.handleObj)return r=e.handleObj,S(e.delegateTarget).off(r.namespace?r.origType+"."+r.namespace:r.origType,r.selector,r.handler),this;if("object"==typeof e){for(i in e)this.off(i,t,e[i]);return this}return!1!==t&&"function"!=typeof t||(n=t,t=void 0),!1===n&&(n=Ee),this.each(function(){S.event.remove(this,e,n,t)})}});var Ne=/<script|<style|<link/i,De=/checked\s*(?:[^=]|=\s*.checked.)/i,je=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function qe(e,t){return A(e,"table")&&A(11!==t.nodeType?t:t.firstChild,"tr")&&S(e).children("tbody")[0]||e}function Le(e){return e.type=(null!==e.getAttribute("type"))+"/"+e.type,e}function He(e){return"true/"===(e.type||"").slice(0,5)?e.type=e.type.slice(5):e.removeAttribute("type"),e}function Oe(e,t){var n,r,i,o,a,s;if(1===t.nodeType){if(Y.hasData(e)&&(s=Y.get(e).events))for(i in Y.remove(t,"handle events"),s)for(n=0,r=s[i].length;n<r;n++)S.event.add(t,i,s[i][n]);Q.hasData(e)&&(o=Q.access(e),a=S.extend({},o),Q.set(t,a))}}function Pe(n,r,i,o){r=g(r);var e,t,a,s,u,l,c=0,f=n.length,p=f-1,d=r[0],h=m(d);if(h||1<f&&"string"==typeof d&&!y.checkClone&&De.test(d))return n.each(function(e){var t=n.eq(e);h&&(r[0]=d.call(this,e,t.html())),Pe(t,r,i,o)});if(f&&(t=(e=xe(r,n[0].ownerDocument,!1,n,o)).firstChild,1===e.childNodes.length&&(e=t),t||o)){for(s=(a=S.map(ve(e,"script"),Le)).length;c<f;c++)u=e,c!==p&&(u=S.clone(u,!0,!0),s&&S.merge(a,ve(u,"script"))),i.call(n[c],u,c);if(s)for(l=a[a.length-1].ownerDocument,S.map(a,He),c=0;c<s;c++)u=a[c],he.test(u.type||"")&&!Y.access(u,"globalEval")&&S.contains(l,u)&&(u.src&&"module"!==(u.type||"").toLowerCase()?S._evalUrl&&!u.noModule&&S._evalUrl(u.src,{nonce:u.nonce||u.getAttribute("nonce")},l):b(u.textContent.replace(je,""),u,l))}return n}function Re(e,t,n){for(var r,i=t?S.filter(t,e):e,o=0;null!=(r=i[o]);o++)n||1!==r.nodeType||S.cleanData(ve(r)),r.parentNode&&(n&&ie(r)&&ye(ve(r,"script")),r.parentNode.removeChild(r));return e}S.extend({htmlPrefilter:function(e){return e},clone:function(e,t,n){var r,i,o,a,s,u,l,c=e.cloneNode(!0),f=ie(e);if(!(y.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||S.isXMLDoc(e)))for(a=ve(c),r=0,i=(o=ve(e)).length;r<i;r++)s=o[r],u=a[r],void 0,"input"===(l=u.nodeName.toLowerCase())&&pe.test(s.type)?u.checked=s.checked:"input"!==l&&"textarea"!==l||(u.defaultValue=s.defaultValue);if(t)if(n)for(o=o||ve(e),a=a||ve(c),r=0,i=o.length;r<i;r++)Oe(o[r],a[r]);else Oe(e,c);return 0<(a=ve(c,"script")).length&&ye(a,!f&&ve(e,"script")),c},cleanData:function(e){for(var t,n,r,i=S.event.special,o=0;void 0!==(n=e[o]);o++)if(V(n)){if(t=n[Y.expando]){if(t.events)for(r in t.events)i[r]?S.event.remove(n,r):S.removeEvent(n,r,t.handle);n[Y.expando]=void 0}n[Q.expando]&&(n[Q.expando]=void 0)}}}),S.fn.extend({detach:function(e){return Re(this,e,!0)},remove:function(e){return Re(this,e)},text:function(e){return $(this,function(e){return void 0===e?S.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=e)})},null,e,arguments.length)},append:function(){return Pe(this,arguments,function(e){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||qe(this,e).appendChild(e)})},prepend:function(){return Pe(this,arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=qe(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return Pe(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return Pe(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},empty:function(){for(var e,t=0;null!=(e=this[t]);t++)1===e.nodeType&&(S.cleanData(ve(e,!1)),e.textContent="");return this},clone:function(e,t){return e=null!=e&&e,t=null==t?e:t,this.map(function(){return S.clone(this,e,t)})},html:function(e){return $(this,function(e){var t=this[0]||{},n=0,r=this.length;if(void 0===e&&1===t.nodeType)return t.innerHTML;if("string"==typeof e&&!Ne.test(e)&&!ge[(de.exec(e)||["",""])[1].toLowerCase()]){e=S.htmlPrefilter(e);try{for(;n<r;n++)1===(t=this[n]||{}).nodeType&&(S.cleanData(ve(t,!1)),t.innerHTML=e);t=0}catch(e){}}t&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var n=[];return Pe(this,arguments,function(e){var t=this.parentNode;S.inArray(this,n)<0&&(S.cleanData(ve(this)),t&&t.replaceChild(e,this))},n)}}),S.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,a){S.fn[e]=function(e){for(var t,n=[],r=S(e),i=r.length-1,o=0;o<=i;o++)t=o===i?this:this.clone(!0),S(r[o])[a](t),u.apply(n,t.get());return this.pushStack(n)}});var Me=new RegExp("^("+ee+")(?!px)[a-z%]+$","i"),Ie=function(e){var t=e.ownerDocument.defaultView;return t&&t.opener||(t=C),t.getComputedStyle(e)},We=function(e,t,n){var r,i,o={};for(i in t)o[i]=e.style[i],e.style[i]=t[i];for(i in r=n.call(e),t)e.style[i]=o[i];return r},Fe=new RegExp(ne.join("|"),"i");function Be(e,t,n){var r,i,o,a,s=e.style;return(n=n||Ie(e))&&(""!==(a=n.getPropertyValue(t)||n[t])||ie(e)||(a=S.style(e,t)),!y.pixelBoxStyles()&&Me.test(a)&&Fe.test(t)&&(r=s.width,i=s.minWidth,o=s.maxWidth,s.minWidth=s.maxWidth=s.width=a,a=n.width,s.width=r,s.minWidth=i,s.maxWidth=o)),void 0!==a?a+"":a}function $e(e,t){return{get:function(){if(!e())return(this.get=t).apply(this,arguments);delete this.get}}}!function(){function e(){if(l){u.style.cssText="position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0",l.style.cssText="position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%",re.appendChild(u).appendChild(l);var e=C.getComputedStyle(l);n="1%"!==e.top,s=12===t(e.marginLeft),l.style.right="60%",o=36===t(e.right),r=36===t(e.width),l.style.position="absolute",i=12===t(l.offsetWidth/3),re.removeChild(u),l=null}}function t(e){return Math.round(parseFloat(e))}var n,r,i,o,a,s,u=E.createElement("div"),l=E.createElement("div");l.style&&(l.style.backgroundClip="content-box",l.cloneNode(!0).style.backgroundClip="",y.clearCloneStyle="content-box"===l.style.backgroundClip,S.extend(y,{boxSizingReliable:function(){return e(),r},pixelBoxStyles:function(){return e(),o},pixelPosition:function(){return e(),n},reliableMarginLeft:function(){return e(),s},scrollboxSize:function(){return e(),i},reliableTrDimensions:function(){var e,t,n,r;return null==a&&(e=E.createElement("table"),t=E.createElement("tr"),n=E.createElement("div"),e.style.cssText="position:absolute;left:-11111px",t.style.height="1px",n.style.height="9px",re.appendChild(e).appendChild(t).appendChild(n),r=C.getComputedStyle(t),a=3<parseInt(r.height),re.removeChild(e)),a}}))}();var _e=["Webkit","Moz","ms"],ze=E.createElement("div").style,Ue={};function Xe(e){var t=S.cssProps[e]||Ue[e];return t||(e in ze?e:Ue[e]=function(e){var t=e[0].toUpperCase()+e.slice(1),n=_e.length;while(n--)if((e=_e[n]+t)in ze)return e}(e)||e)}var Ve=/^(none|table(?!-c[ea]).+)/,Ge=/^--/,Ye={position:"absolute",visibility:"hidden",display:"block"},Qe={letterSpacing:"0",fontWeight:"400"};function Je(e,t,n){var r=te.exec(t);return r?Math.max(0,r[2]-(n||0))+(r[3]||"px"):t}function Ke(e,t,n,r,i,o){var a="width"===t?1:0,s=0,u=0;if(n===(r?"border":"content"))return 0;for(;a<4;a+=2)"margin"===n&&(u+=S.css(e,n+ne[a],!0,i)),r?("content"===n&&(u-=S.css(e,"padding"+ne[a],!0,i)),"margin"!==n&&(u-=S.css(e,"border"+ne[a]+"Width",!0,i))):(u+=S.css(e,"padding"+ne[a],!0,i),"padding"!==n?u+=S.css(e,"border"+ne[a]+"Width",!0,i):s+=S.css(e,"border"+ne[a]+"Width",!0,i));return!r&&0<=o&&(u+=Math.max(0,Math.ceil(e["offset"+t[0].toUpperCase()+t.slice(1)]-o-u-s-.5))||0),u}function Ze(e,t,n){var r=Ie(e),i=(!y.boxSizingReliable()||n)&&"border-box"===S.css(e,"boxSizing",!1,r),o=i,a=Be(e,t,r),s="offset"+t[0].toUpperCase()+t.slice(1);if(Me.test(a)){if(!n)return a;a="auto"}return(!y.boxSizingReliable()&&i||!y.reliableTrDimensions()&&A(e,"tr")||"auto"===a||!parseFloat(a)&&"inline"===S.css(e,"display",!1,r))&&e.getClientRects().length&&(i="border-box"===S.css(e,"boxSizing",!1,r),(o=s in e)&&(a=e[s])),(a=parseFloat(a)||0)+Ke(e,t,n||(i?"border":"content"),o,r,a)+"px"}function et(e,t,n,r,i){return new et.prototype.init(e,t,n,r,i)}S.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Be(e,"opacity");return""===n?"1":n}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,gridArea:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnStart:!0,gridRow:!0,gridRowEnd:!0,gridRowStart:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{},style:function(e,t,n,r){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var i,o,a,s=X(t),u=Ge.test(t),l=e.style;if(u||(t=Xe(s)),a=S.cssHooks[t]||S.cssHooks[s],void 0===n)return a&&"get"in a&&void 0!==(i=a.get(e,!1,r))?i:l[t];"string"===(o=typeof n)&&(i=te.exec(n))&&i[1]&&(n=se(e,t,i),o="number"),null!=n&&n==n&&("number"!==o||u||(n+=i&&i[3]||(S.cssNumber[s]?"":"px")),y.clearCloneStyle||""!==n||0!==t.indexOf("background")||(l[t]="inherit"),a&&"set"in a&&void 0===(n=a.set(e,n,r))||(u?l.setProperty(t,n):l[t]=n))}},css:function(e,t,n,r){var i,o,a,s=X(t);return Ge.test(t)||(t=Xe(s)),(a=S.cssHooks[t]||S.cssHooks[s])&&"get"in a&&(i=a.get(e,!0,n)),void 0===i&&(i=Be(e,t,r)),"normal"===i&&t in Qe&&(i=Qe[t]),""===n||n?(o=parseFloat(i),!0===n||isFinite(o)?o||0:i):i}}),S.each(["height","width"],function(e,u){S.cssHooks[u]={get:function(e,t,n){if(t)return!Ve.test(S.css(e,"display"))||e.getClientRects().length&&e.getBoundingClientRect().width?Ze(e,u,n):We(e,Ye,function(){return Ze(e,u,n)})},set:function(e,t,n){var r,i=Ie(e),o=!y.scrollboxSize()&&"absolute"===i.position,a=(o||n)&&"border-box"===S.css(e,"boxSizing",!1,i),s=n?Ke(e,u,n,a,i):0;return a&&o&&(s-=Math.ceil(e["offset"+u[0].toUpperCase()+u.slice(1)]-parseFloat(i[u])-Ke(e,u,"border",!1,i)-.5)),s&&(r=te.exec(t))&&"px"!==(r[3]||"px")&&(e.style[u]=t,t=S.css(e,u)),Je(0,t,s)}}}),S.cssHooks.marginLeft=$e(y.reliableMarginLeft,function(e,t){if(t)return(parseFloat(Be(e,"marginLeft"))||e.getBoundingClientRect().left-We(e,{marginLeft:0},function(){return e.getBoundingClientRect().left}))+"px"}),S.each({margin:"",padding:"",border:"Width"},function(i,o){S.cssHooks[i+o]={expand:function(e){for(var t=0,n={},r="string"==typeof e?e.split(" "):[e];t<4;t++)n[i+ne[t]+o]=r[t]||r[t-2]||r[0];return n}},"margin"!==i&&(S.cssHooks[i+o].set=Je)}),S.fn.extend({css:function(e,t){return $(this,function(e,t,n){var r,i,o={},a=0;if(Array.isArray(t)){for(r=Ie(e),i=t.length;a<i;a++)o[t[a]]=S.css(e,t[a],!1,r);return o}return void 0!==n?S.style(e,t,n):S.css(e,t)},e,t,1<arguments.length)}}),((S.Tween=et).prototype={constructor:et,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||S.easing._default,this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(S.cssNumber[n]?"":"px")},cur:function(){var e=et.propHooks[this.prop];return e&&e.get?e.get(this):et.propHooks._default.get(this)},run:function(e){var t,n=et.propHooks[this.prop];return this.options.duration?this.pos=t=S.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):this.pos=t=e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):et.propHooks._default.set(this),this}}).init.prototype=et.prototype,(et.propHooks={_default:{get:function(e){var t;return 1!==e.elem.nodeType||null!=e.elem[e.prop]&&null==e.elem.style[e.prop]?e.elem[e.prop]:(t=S.css(e.elem,e.prop,""))&&"auto"!==t?t:0},set:function(e){S.fx.step[e.prop]?S.fx.step[e.prop](e):1!==e.elem.nodeType||!S.cssHooks[e.prop]&&null==e.elem.style[Xe(e.prop)]?e.elem[e.prop]=e.now:S.style(e.elem,e.prop,e.now+e.unit)}}}).scrollTop=et.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},S.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2},_default:"swing"},S.fx=et.prototype.init,S.fx.step={};var tt,nt,rt,it,ot=/^(?:toggle|show|hide)$/,at=/queueHooks$/;function st(){nt&&(!1===E.hidden&&C.requestAnimationFrame?C.requestAnimationFrame(st):C.setTimeout(st,S.fx.interval),S.fx.tick())}function ut(){return C.setTimeout(function(){tt=void 0}),tt=Date.now()}function lt(e,t){var n,r=0,i={height:e};for(t=t?1:0;r<4;r+=2-t)i["margin"+(n=ne[r])]=i["padding"+n]=e;return t&&(i.opacity=i.width=e),i}function ct(e,t,n){for(var r,i=(ft.tweeners[t]||[]).concat(ft.tweeners["*"]),o=0,a=i.length;o<a;o++)if(r=i[o].call(n,t,e))return r}function ft(o,e,t){var n,a,r=0,i=ft.prefilters.length,s=S.Deferred().always(function(){delete u.elem}),u=function(){if(a)return!1;for(var e=tt||ut(),t=Math.max(0,l.startTime+l.duration-e),n=1-(t/l.duration||0),r=0,i=l.tweens.length;r<i;r++)l.tweens[r].run(n);return s.notifyWith(o,[l,n,t]),n<1&&i?t:(i||s.notifyWith(o,[l,1,0]),s.resolveWith(o,[l]),!1)},l=s.promise({elem:o,props:S.extend({},e),opts:S.extend(!0,{specialEasing:{},easing:S.easing._default},t),originalProperties:e,originalOptions:t,startTime:tt||ut(),duration:t.duration,tweens:[],createTween:function(e,t){var n=S.Tween(o,l.opts,e,t,l.opts.specialEasing[e]||l.opts.easing);return l.tweens.push(n),n},stop:function(e){var t=0,n=e?l.tweens.length:0;if(a)return this;for(a=!0;t<n;t++)l.tweens[t].run(1);return e?(s.notifyWith(o,[l,1,0]),s.resolveWith(o,[l,e])):s.rejectWith(o,[l,e]),this}}),c=l.props;for(!function(e,t){var n,r,i,o,a;for(n in e)if(i=t[r=X(n)],o=e[n],Array.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),(a=S.cssHooks[r])&&"expand"in a)for(n in o=a.expand(o),delete e[r],o)n in e||(e[n]=o[n],t[n]=i);else t[r]=i}(c,l.opts.specialEasing);r<i;r++)if(n=ft.prefilters[r].call(l,o,c,l.opts))return m(n.stop)&&(S._queueHooks(l.elem,l.opts.queue).stop=n.stop.bind(n)),n;return S.map(c,ct,l),m(l.opts.start)&&l.opts.start.call(o,l),l.progress(l.opts.progress).done(l.opts.done,l.opts.complete).fail(l.opts.fail).always(l.opts.always),S.fx.timer(S.extend(u,{elem:o,anim:l,queue:l.opts.queue})),l}S.Animation=S.extend(ft,{tweeners:{"*":[function(e,t){var n=this.createTween(e,t);return se(n.elem,e,te.exec(t),n),n}]},tweener:function(e,t){m(e)?(t=e,e=["*"]):e=e.match(P);for(var n,r=0,i=e.length;r<i;r++)n=e[r],ft.tweeners[n]=ft.tweeners[n]||[],ft.tweeners[n].unshift(t)},prefilters:[function(e,t,n){var r,i,o,a,s,u,l,c,f="width"in t||"height"in t,p=this,d={},h=e.style,g=e.nodeType&&ae(e),v=Y.get(e,"fxshow");for(r in n.queue||(null==(a=S._queueHooks(e,"fx")).unqueued&&(a.unqueued=0,s=a.empty.fire,a.empty.fire=function(){a.unqueued||s()}),a.unqueued++,p.always(function(){p.always(function(){a.unqueued--,S.queue(e,"fx").length||a.empty.fire()})})),t)if(i=t[r],ot.test(i)){if(delete t[r],o=o||"toggle"===i,i===(g?"hide":"show")){if("show"!==i||!v||void 0===v[r])continue;g=!0}d[r]=v&&v[r]||S.style(e,r)}if((u=!S.isEmptyObject(t))||!S.isEmptyObject(d))for(r in f&&1===e.nodeType&&(n.overflow=[h.overflow,h.overflowX,h.overflowY],null==(l=v&&v.display)&&(l=Y.get(e,"display")),"none"===(c=S.css(e,"display"))&&(l?c=l:(le([e],!0),l=e.style.display||l,c=S.css(e,"display"),le([e]))),("inline"===c||"inline-block"===c&&null!=l)&&"none"===S.css(e,"float")&&(u||(p.done(function(){h.display=l}),null==l&&(c=h.display,l="none"===c?"":c)),h.display="inline-block")),n.overflow&&(h.overflow="hidden",p.always(function(){h.overflow=n.overflow[0],h.overflowX=n.overflow[1],h.overflowY=n.overflow[2]})),u=!1,d)u||(v?"hidden"in v&&(g=v.hidden):v=Y.access(e,"fxshow",{display:l}),o&&(v.hidden=!g),g&&le([e],!0),p.done(function(){for(r in g||le([e]),Y.remove(e,"fxshow"),d)S.style(e,r,d[r])})),u=ct(g?v[r]:0,r,p),r in v||(v[r]=u.start,g&&(u.end=u.start,u.start=0))}],prefilter:function(e,t){t?ft.prefilters.unshift(e):ft.prefilters.push(e)}}),S.speed=function(e,t,n){var r=e&&"object"==typeof e?S.extend({},e):{complete:n||!n&&t||m(e)&&e,duration:e,easing:n&&t||t&&!m(t)&&t};return S.fx.off?r.duration=0:"number"!=typeof r.duration&&(r.duration in S.fx.speeds?r.duration=S.fx.speeds[r.duration]:r.duration=S.fx.speeds._default),null!=r.queue&&!0!==r.queue||(r.queue="fx"),r.old=r.complete,r.complete=function(){m(r.old)&&r.old.call(this),r.queue&&S.dequeue(this,r.queue)},r},S.fn.extend({fadeTo:function(e,t,n,r){return this.filter(ae).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(t,e,n,r){var i=S.isEmptyObject(t),o=S.speed(e,n,r),a=function(){var e=ft(this,S.extend({},t),o);(i||Y.get(this,"finish"))&&e.stop(!0)};return a.finish=a,i||!1===o.queue?this.each(a):this.queue(o.queue,a)},stop:function(i,e,o){var a=function(e){var t=e.stop;delete e.stop,t(o)};return"string"!=typeof i&&(o=e,e=i,i=void 0),e&&this.queue(i||"fx",[]),this.each(function(){var e=!0,t=null!=i&&i+"queueHooks",n=S.timers,r=Y.get(this);if(t)r[t]&&r[t].stop&&a(r[t]);else for(t in r)r[t]&&r[t].stop&&at.test(t)&&a(r[t]);for(t=n.length;t--;)n[t].elem!==this||null!=i&&n[t].queue!==i||(n[t].anim.stop(o),e=!1,n.splice(t,1));!e&&o||S.dequeue(this,i)})},finish:function(a){return!1!==a&&(a=a||"fx"),this.each(function(){var e,t=Y.get(this),n=t[a+"queue"],r=t[a+"queueHooks"],i=S.timers,o=n?n.length:0;for(t.finish=!0,S.queue(this,a,[]),r&&r.stop&&r.stop.call(this,!0),e=i.length;e--;)i[e].elem===this&&i[e].queue===a&&(i[e].anim.stop(!0),i.splice(e,1));for(e=0;e<o;e++)n[e]&&n[e].finish&&n[e].finish.call(this);delete t.finish})}}),S.each(["toggle","show","hide"],function(e,r){var i=S.fn[r];S.fn[r]=function(e,t,n){return null==e||"boolean"==typeof e?i.apply(this,arguments):this.animate(lt(r,!0),e,t,n)}}),S.each({slideDown:lt("show"),slideUp:lt("hide"),slideToggle:lt("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,r){S.fn[e]=function(e,t,n){return this.animate(r,e,t,n)}}),S.timers=[],S.fx.tick=function(){var e,t=0,n=S.timers;for(tt=Date.now();t<n.length;t++)(e=n[t])()||n[t]!==e||n.splice(t--,1);n.length||S.fx.stop(),tt=void 0},S.fx.timer=function(e){S.timers.push(e),S.fx.start()},S.fx.interval=13,S.fx.start=function(){nt||(nt=!0,st())},S.fx.stop=function(){nt=null},S.fx.speeds={slow:600,fast:200,_default:400},S.fn.delay=function(r,e){return r=S.fx&&S.fx.speeds[r]||r,e=e||"fx",this.queue(e,function(e,t){var n=C.setTimeout(e,r);t.stop=function(){C.clearTimeout(n)}})},rt=E.createElement("input"),it=E.createElement("select").appendChild(E.createElement("option")),rt.type="checkbox",y.checkOn=""!==rt.value,y.optSelected=it.selected,(rt=E.createElement("input")).value="t",rt.type="radio",y.radioValue="t"===rt.value;var pt,dt=S.expr.attrHandle;S.fn.extend({attr:function(e,t){return $(this,S.attr,e,t,1<arguments.length)},removeAttr:function(e){return this.each(function(){S.removeAttr(this,e)})}}),S.extend({attr:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return"undefined"==typeof e.getAttribute?S.prop(e,t,n):(1===o&&S.isXMLDoc(e)||(i=S.attrHooks[t.toLowerCase()]||(S.expr.match.bool.test(t)?pt:void 0)),void 0!==n?null===n?void S.removeAttr(e,t):i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:(e.setAttribute(t,n+""),n):i&&"get"in i&&null!==(r=i.get(e,t))?r:null==(r=S.find.attr(e,t))?void 0:r)},attrHooks:{type:{set:function(e,t){if(!y.radioValue&&"radio"===t&&A(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},removeAttr:function(e,t){var n,r=0,i=t&&t.match(P);if(i&&1===e.nodeType)while(n=i[r++])e.removeAttribute(n)}}),pt={set:function(e,t,n){return!1===t?S.removeAttr(e,n):e.setAttribute(n,n),n}},S.each(S.expr.match.bool.source.match(/\w+/g),function(e,t){var a=dt[t]||S.find.attr;dt[t]=function(e,t,n){var r,i,o=t.toLowerCase();return n||(i=dt[o],dt[o]=r,r=null!=a(e,t,n)?o:null,dt[o]=i),r}});var ht=/^(?:input|select|textarea|button)$/i,gt=/^(?:a|area)$/i;function vt(e){return(e.match(P)||[]).join(" ")}function yt(e){return e.getAttribute&&e.getAttribute("class")||""}function mt(e){return Array.isArray(e)?e:"string"==typeof e&&e.match(P)||[]}S.fn.extend({prop:function(e,t){return $(this,S.prop,e,t,1<arguments.length)},removeProp:function(e){return this.each(function(){delete this[S.propFix[e]||e]})}}),S.extend({prop:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return 1===o&&S.isXMLDoc(e)||(t=S.propFix[t]||t,i=S.propHooks[t]),void 0!==n?i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:e[t]=n:i&&"get"in i&&null!==(r=i.get(e,t))?r:e[t]},propHooks:{tabIndex:{get:function(e){var t=S.find.attr(e,"tabindex");return t?parseInt(t,10):ht.test(e.nodeName)||gt.test(e.nodeName)&&e.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),y.optSelected||(S.propHooks.selected={get:function(e){var t=e.parentNode;return t&&t.parentNode&&t.parentNode.selectedIndex,null},set:function(e){var t=e.parentNode;t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex)}}),S.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){S.propFix[this.toLowerCase()]=this}),S.fn.extend({addClass:function(t){var e,n,r,i,o,a,s,u=0;if(m(t))return this.each(function(e){S(this).addClass(t.call(this,e,yt(this)))});if((e=mt(t)).length)while(n=this[u++])if(i=yt(n),r=1===n.nodeType&&" "+vt(i)+" "){a=0;while(o=e[a++])r.indexOf(" "+o+" ")<0&&(r+=o+" ");i!==(s=vt(r))&&n.setAttribute("class",s)}return this},removeClass:function(t){var e,n,r,i,o,a,s,u=0;if(m(t))return this.each(function(e){S(this).removeClass(t.call(this,e,yt(this)))});if(!arguments.length)return this.attr("class","");if((e=mt(t)).length)while(n=this[u++])if(i=yt(n),r=1===n.nodeType&&" "+vt(i)+" "){a=0;while(o=e[a++])while(-1<r.indexOf(" "+o+" "))r=r.replace(" "+o+" "," ");i!==(s=vt(r))&&n.setAttribute("class",s)}return this},toggleClass:function(i,t){var o=typeof i,a="string"===o||Array.isArray(i);return"boolean"==typeof t&&a?t?this.addClass(i):this.removeClass(i):m(i)?this.each(function(e){S(this).toggleClass(i.call(this,e,yt(this),t),t)}):this.each(function(){var e,t,n,r;if(a){t=0,n=S(this),r=mt(i);while(e=r[t++])n.hasClass(e)?n.removeClass(e):n.addClass(e)}else void 0!==i&&"boolean"!==o||((e=yt(this))&&Y.set(this,"__className__",e),this.setAttribute&&this.setAttribute("class",e||!1===i?"":Y.get(this,"__className__")||""))})},hasClass:function(e){var t,n,r=0;t=" "+e+" ";while(n=this[r++])if(1===n.nodeType&&-1<(" "+vt(yt(n))+" ").indexOf(t))return!0;return!1}});var xt=/\r/g;S.fn.extend({val:function(n){var r,e,i,t=this[0];return arguments.length?(i=m(n),this.each(function(e){var t;1===this.nodeType&&(null==(t=i?n.call(this,e,S(this).val()):n)?t="":"number"==typeof t?t+="":Array.isArray(t)&&(t=S.map(t,function(e){return null==e?"":e+""})),(r=S.valHooks[this.type]||S.valHooks[this.nodeName.toLowerCase()])&&"set"in r&&void 0!==r.set(this,t,"value")||(this.value=t))})):t?(r=S.valHooks[t.type]||S.valHooks[t.nodeName.toLowerCase()])&&"get"in r&&void 0!==(e=r.get(t,"value"))?e:"string"==typeof(e=t.value)?e.replace(xt,""):null==e?"":e:void 0}}),S.extend({valHooks:{option:{get:function(e){var t=S.find.attr(e,"value");return null!=t?t:vt(S.text(e))}},select:{get:function(e){var t,n,r,i=e.options,o=e.selectedIndex,a="select-one"===e.type,s=a?null:[],u=a?o+1:i.length;for(r=o<0?u:a?o:0;r<u;r++)if(((n=i[r]).selected||r===o)&&!n.disabled&&(!n.parentNode.disabled||!A(n.parentNode,"optgroup"))){if(t=S(n).val(),a)return t;s.push(t)}return s},set:function(e,t){var n,r,i=e.options,o=S.makeArray(t),a=i.length;while(a--)((r=i[a]).selected=-1<S.inArray(S.valHooks.option.get(r),o))&&(n=!0);return n||(e.selectedIndex=-1),o}}}}),S.each(["radio","checkbox"],function(){S.valHooks[this]={set:function(e,t){if(Array.isArray(t))return e.checked=-1<S.inArray(S(e).val(),t)}},y.checkOn||(S.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})}),y.focusin="onfocusin"in C;var bt=/^(?:focusinfocus|focusoutblur)$/,wt=function(e){e.stopPropagation()};S.extend(S.event,{trigger:function(e,t,n,r){var i,o,a,s,u,l,c,f,p=[n||E],d=v.call(e,"type")?e.type:e,h=v.call(e,"namespace")?e.namespace.split("."):[];if(o=f=a=n=n||E,3!==n.nodeType&&8!==n.nodeType&&!bt.test(d+S.event.triggered)&&(-1<d.indexOf(".")&&(d=(h=d.split(".")).shift(),h.sort()),u=d.indexOf(":")<0&&"on"+d,(e=e[S.expando]?e:new S.Event(d,"object"==typeof e&&e)).isTrigger=r?2:3,e.namespace=h.join("."),e.rnamespace=e.namespace?new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,e.result=void 0,e.target||(e.target=n),t=null==t?[e]:S.makeArray(t,[e]),c=S.event.special[d]||{},r||!c.trigger||!1!==c.trigger.apply(n,t))){if(!r&&!c.noBubble&&!x(n)){for(s=c.delegateType||d,bt.test(s+d)||(o=o.parentNode);o;o=o.parentNode)p.push(o),a=o;a===(n.ownerDocument||E)&&p.push(a.defaultView||a.parentWindow||C)}i=0;while((o=p[i++])&&!e.isPropagationStopped())f=o,e.type=1<i?s:c.bindType||d,(l=(Y.get(o,"events")||Object.create(null))[e.type]&&Y.get(o,"handle"))&&l.apply(o,t),(l=u&&o[u])&&l.apply&&V(o)&&(e.result=l.apply(o,t),!1===e.result&&e.preventDefault());return e.type=d,r||e.isDefaultPrevented()||c._default&&!1!==c._default.apply(p.pop(),t)||!V(n)||u&&m(n[d])&&!x(n)&&((a=n[u])&&(n[u]=null),S.event.triggered=d,e.isPropagationStopped()&&f.addEventListener(d,wt),n[d](),e.isPropagationStopped()&&f.removeEventListener(d,wt),S.event.triggered=void 0,a&&(n[u]=a)),e.result}},simulate:function(e,t,n){var r=S.extend(new S.Event,n,{type:e,isSimulated:!0});S.event.trigger(r,null,t)}}),S.fn.extend({trigger:function(e,t){return this.each(function(){S.event.trigger(e,t,this)})},triggerHandler:function(e,t){var n=this[0];if(n)return S.event.trigger(e,t,n,!0)}}),y.focusin||S.each({focus:"focusin",blur:"focusout"},function(n,r){var i=function(e){S.event.simulate(r,e.target,S.event.fix(e))};S.event.special[r]={setup:function(){var e=this.ownerDocument||this.document||this,t=Y.access(e,r);t||e.addEventListener(n,i,!0),Y.access(e,r,(t||0)+1)},teardown:function(){var e=this.ownerDocument||this.document||this,t=Y.access(e,r)-1;t?Y.access(e,r,t):(e.removeEventListener(n,i,!0),Y.remove(e,r))}}});var Tt=C.location,Ct={guid:Date.now()},Et=/\?/;S.parseXML=function(e){var t;if(!e||"string"!=typeof e)return null;try{t=(new C.DOMParser).parseFromString(e,"text/xml")}catch(e){t=void 0}return t&&!t.getElementsByTagName("parsererror").length||S.error("Invalid XML: "+e),t};var St=/\[\]$/,kt=/\r?\n/g,At=/^(?:submit|button|image|reset|file)$/i,Nt=/^(?:input|select|textarea|keygen)/i;function Dt(n,e,r,i){var t;if(Array.isArray(e))S.each(e,function(e,t){r||St.test(n)?i(n,t):Dt(n+"["+("object"==typeof t&&null!=t?e:"")+"]",t,r,i)});else if(r||"object"!==w(e))i(n,e);else for(t in e)Dt(n+"["+t+"]",e[t],r,i)}S.param=function(e,t){var n,r=[],i=function(e,t){var n=m(t)?t():t;r[r.length]=encodeURIComponent(e)+"="+encodeURIComponent(null==n?"":n)};if(null==e)return"";if(Array.isArray(e)||e.jquery&&!S.isPlainObject(e))S.each(e,function(){i(this.name,this.value)});else for(n in e)Dt(n,e[n],t,i);return r.join("&")},S.fn.extend({serialize:function(){return S.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=S.prop(this,"elements");return e?S.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!S(this).is(":disabled")&&Nt.test(this.nodeName)&&!At.test(e)&&(this.checked||!pe.test(e))}).map(function(e,t){var n=S(this).val();return null==n?null:Array.isArray(n)?S.map(n,function(e){return{name:t.name,value:e.replace(kt,"\r\n")}}):{name:t.name,value:n.replace(kt,"\r\n")}}).get()}});var jt=/%20/g,qt=/#.*$/,Lt=/([?&])_=[^&]*/,Ht=/^(.*?):[ \t]*([^\r\n]*)$/gm,Ot=/^(?:GET|HEAD)$/,Pt=/^\/\//,Rt={},Mt={},It="*/".concat("*"),Wt=E.createElement("a");function Ft(o){return function(e,t){"string"!=typeof e&&(t=e,e="*");var n,r=0,i=e.toLowerCase().match(P)||[];if(m(t))while(n=i[r++])"+"===n[0]?(n=n.slice(1)||"*",(o[n]=o[n]||[]).unshift(t)):(o[n]=o[n]||[]).push(t)}}function Bt(t,i,o,a){var s={},u=t===Mt;function l(e){var r;return s[e]=!0,S.each(t[e]||[],function(e,t){var n=t(i,o,a);return"string"!=typeof n||u||s[n]?u?!(r=n):void 0:(i.dataTypes.unshift(n),l(n),!1)}),r}return l(i.dataTypes[0])||!s["*"]&&l("*")}function $t(e,t){var n,r,i=S.ajaxSettings.flatOptions||{};for(n in t)void 0!==t[n]&&((i[n]?e:r||(r={}))[n]=t[n]);return r&&S.extend(!0,e,r),e}Wt.href=Tt.href,S.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:Tt.href,type:"GET",isLocal:/^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(Tt.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":It,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":S.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?$t($t(e,S.ajaxSettings),t):$t(S.ajaxSettings,e)},ajaxPrefilter:Ft(Rt),ajaxTransport:Ft(Mt),ajax:function(e,t){"object"==typeof e&&(t=e,e=void 0),t=t||{};var c,f,p,n,d,r,h,g,i,o,v=S.ajaxSetup({},t),y=v.context||v,m=v.context&&(y.nodeType||y.jquery)?S(y):S.event,x=S.Deferred(),b=S.Callbacks("once memory"),w=v.statusCode||{},a={},s={},u="canceled",T={readyState:0,getResponseHeader:function(e){var t;if(h){if(!n){n={};while(t=Ht.exec(p))n[t[1].toLowerCase()+" "]=(n[t[1].toLowerCase()+" "]||[]).concat(t[2])}t=n[e.toLowerCase()+" "]}return null==t?null:t.join(", ")},getAllResponseHeaders:function(){return h?p:null},setRequestHeader:function(e,t){return null==h&&(e=s[e.toLowerCase()]=s[e.toLowerCase()]||e,a[e]=t),this},overrideMimeType:function(e){return null==h&&(v.mimeType=e),this},statusCode:function(e){var t;if(e)if(h)T.always(e[T.status]);else for(t in e)w[t]=[w[t],e[t]];return this},abort:function(e){var t=e||u;return c&&c.abort(t),l(0,t),this}};if(x.promise(T),v.url=((e||v.url||Tt.href)+"").replace(Pt,Tt.protocol+"//"),v.type=t.method||t.type||v.method||v.type,v.dataTypes=(v.dataType||"*").toLowerCase().match(P)||[""],null==v.crossDomain){r=E.createElement("a");try{r.href=v.url,r.href=r.href,v.crossDomain=Wt.protocol+"//"+Wt.host!=r.protocol+"//"+r.host}catch(e){v.crossDomain=!0}}if(v.data&&v.processData&&"string"!=typeof v.data&&(v.data=S.param(v.data,v.traditional)),Bt(Rt,v,t,T),h)return T;for(i in(g=S.event&&v.global)&&0==S.active++&&S.event.trigger("ajaxStart"),v.type=v.type.toUpperCase(),v.hasContent=!Ot.test(v.type),f=v.url.replace(qt,""),v.hasContent?v.data&&v.processData&&0===(v.contentType||"").indexOf("application/x-www-form-urlencoded")&&(v.data=v.data.replace(jt,"+")):(o=v.url.slice(f.length),v.data&&(v.processData||"string"==typeof v.data)&&(f+=(Et.test(f)?"&":"?")+v.data,delete v.data),!1===v.cache&&(f=f.replace(Lt,"$1"),o=(Et.test(f)?"&":"?")+"_="+Ct.guid+++o),v.url=f+o),v.ifModified&&(S.lastModified[f]&&T.setRequestHeader("If-Modified-Since",S.lastModified[f]),S.etag[f]&&T.setRequestHeader("If-None-Match",S.etag[f])),(v.data&&v.hasContent&&!1!==v.contentType||t.contentType)&&T.setRequestHeader("Content-Type",v.contentType),T.setRequestHeader("Accept",v.dataTypes[0]&&v.accepts[v.dataTypes[0]]?v.accepts[v.dataTypes[0]]+("*"!==v.dataTypes[0]?", "+It+"; q=0.01":""):v.accepts["*"]),v.headers)T.setRequestHeader(i,v.headers[i]);if(v.beforeSend&&(!1===v.beforeSend.call(y,T,v)||h))return T.abort();if(u="abort",b.add(v.complete),T.done(v.success),T.fail(v.error),c=Bt(Mt,v,t,T)){if(T.readyState=1,g&&m.trigger("ajaxSend",[T,v]),h)return T;v.async&&0<v.timeout&&(d=C.setTimeout(function(){T.abort("timeout")},v.timeout));try{h=!1,c.send(a,l)}catch(e){if(h)throw e;l(-1,e)}}else l(-1,"No Transport");function l(e,t,n,r){var i,o,a,s,u,l=t;h||(h=!0,d&&C.clearTimeout(d),c=void 0,p=r||"",T.readyState=0<e?4:0,i=200<=e&&e<300||304===e,n&&(s=function(e,t,n){var r,i,o,a,s=e.contents,u=e.dataTypes;while("*"===u[0])u.shift(),void 0===r&&(r=e.mimeType||t.getResponseHeader("Content-Type"));if(r)for(i in s)if(s[i]&&s[i].test(r)){u.unshift(i);break}if(u[0]in n)o=u[0];else{for(i in n){if(!u[0]||e.converters[i+" "+u[0]]){o=i;break}a||(a=i)}o=o||a}if(o)return o!==u[0]&&u.unshift(o),n[o]}(v,T,n)),!i&&-1<S.inArray("script",v.dataTypes)&&(v.converters["text script"]=function(){}),s=function(e,t,n,r){var i,o,a,s,u,l={},c=e.dataTypes.slice();if(c[1])for(a in e.converters)l[a.toLowerCase()]=e.converters[a];o=c.shift();while(o)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!u&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),u=o,o=c.shift())if("*"===o)o=u;else if("*"!==u&&u!==o){if(!(a=l[u+" "+o]||l["* "+o]))for(i in l)if((s=i.split(" "))[1]===o&&(a=l[u+" "+s[0]]||l["* "+s[0]])){!0===a?a=l[i]:!0!==l[i]&&(o=s[0],c.unshift(s[1]));break}if(!0!==a)if(a&&e["throws"])t=a(t);else try{t=a(t)}catch(e){return{state:"parsererror",error:a?e:"No conversion from "+u+" to "+o}}}return{state:"success",data:t}}(v,s,T,i),i?(v.ifModified&&((u=T.getResponseHeader("Last-Modified"))&&(S.lastModified[f]=u),(u=T.getResponseHeader("etag"))&&(S.etag[f]=u)),204===e||"HEAD"===v.type?l="nocontent":304===e?l="notmodified":(l=s.state,o=s.data,i=!(a=s.error))):(a=l,!e&&l||(l="error",e<0&&(e=0))),T.status=e,T.statusText=(t||l)+"",i?x.resolveWith(y,[o,l,T]):x.rejectWith(y,[T,l,a]),T.statusCode(w),w=void 0,g&&m.trigger(i?"ajaxSuccess":"ajaxError",[T,v,i?o:a]),b.fireWith(y,[T,l]),g&&(m.trigger("ajaxComplete",[T,v]),--S.active||S.event.trigger("ajaxStop")))}return T},getJSON:function(e,t,n){return S.get(e,t,n,"json")},getScript:function(e,t){return S.get(e,void 0,t,"script")}}),S.each(["get","post"],function(e,i){S[i]=function(e,t,n,r){return m(t)&&(r=r||n,n=t,t=void 0),S.ajax(S.extend({url:e,type:i,dataType:r,data:t,success:n},S.isPlainObject(e)&&e))}}),S.ajaxPrefilter(function(e){var t;for(t in e.headers)"content-type"===t.toLowerCase()&&(e.contentType=e.headers[t]||"")}),S._evalUrl=function(e,t,n){return S.ajax({url:e,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,converters:{"text script":function(){}},dataFilter:function(e){S.globalEval(e,t,n)}})},S.fn.extend({wrapAll:function(e){var t;return this[0]&&(m(e)&&(e=e.call(this[0])),t=S(e,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstElementChild)e=e.firstElementChild;return e}).append(this)),this},wrapInner:function(n){return m(n)?this.each(function(e){S(this).wrapInner(n.call(this,e))}):this.each(function(){var e=S(this),t=e.contents();t.length?t.wrapAll(n):e.append(n)})},wrap:function(t){var n=m(t);return this.each(function(e){S(this).wrapAll(n?t.call(this,e):t)})},unwrap:function(e){return this.parent(e).not("body").each(function(){S(this).replaceWith(this.childNodes)}),this}}),S.expr.pseudos.hidden=function(e){return!S.expr.pseudos.visible(e)},S.expr.pseudos.visible=function(e){return!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length)},S.ajaxSettings.xhr=function(){try{return new C.XMLHttpRequest}catch(e){}};var _t={0:200,1223:204},zt=S.ajaxSettings.xhr();y.cors=!!zt&&"withCredentials"in zt,y.ajax=zt=!!zt,S.ajaxTransport(function(i){var o,a;if(y.cors||zt&&!i.crossDomain)return{send:function(e,t){var n,r=i.xhr();if(r.open(i.type,i.url,i.async,i.username,i.password),i.xhrFields)for(n in i.xhrFields)r[n]=i.xhrFields[n];for(n in i.mimeType&&r.overrideMimeType&&r.overrideMimeType(i.mimeType),i.crossDomain||e["X-Requested-With"]||(e["X-Requested-With"]="XMLHttpRequest"),e)r.setRequestHeader(n,e[n]);o=function(e){return function(){o&&(o=a=r.onload=r.onerror=r.onabort=r.ontimeout=r.onreadystatechange=null,"abort"===e?r.abort():"error"===e?"number"!=typeof r.status?t(0,"error"):t(r.status,r.statusText):t(_t[r.status]||r.status,r.statusText,"text"!==(r.responseType||"text")||"string"!=typeof r.responseText?{binary:r.response}:{text:r.responseText},r.getAllResponseHeaders()))}},r.onload=o(),a=r.onerror=r.ontimeout=o("error"),void 0!==r.onabort?r.onabort=a:r.onreadystatechange=function(){4===r.readyState&&C.setTimeout(function(){o&&a()})},o=o("abort");try{r.send(i.hasContent&&i.data||null)}catch(e){if(o)throw e}},abort:function(){o&&o()}}}),S.ajaxPrefilter(function(e){e.crossDomain&&(e.contents.script=!1)}),S.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(e){return S.globalEval(e),e}}}),S.ajaxPrefilter("script",function(e){void 0===e.cache&&(e.cache=!1),e.crossDomain&&(e.type="GET")}),S.ajaxTransport("script",function(n){var r,i;if(n.crossDomain||n.scriptAttrs)return{send:function(e,t){r=S("<script>").attr(n.scriptAttrs||{}).prop({charset:n.scriptCharset,src:n.url}).on("load error",i=function(e){r.remove(),i=null,e&&t("error"===e.type?404:200,e.type)}),E.head.appendChild(r[0])},abort:function(){i&&i()}}});var Ut,Xt=[],Vt=/(=)\?(?=&|$)|\?\?/;S.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Xt.pop()||S.expando+"_"+Ct.guid++;return this[e]=!0,e}}),S.ajaxPrefilter("json jsonp",function(e,t,n){var r,i,o,a=!1!==e.jsonp&&(Vt.test(e.url)?"url":"string"==typeof e.data&&0===(e.contentType||"").indexOf("application/x-www-form-urlencoded")&&Vt.test(e.data)&&"data");if(a||"jsonp"===e.dataTypes[0])return r=e.jsonpCallback=m(e.jsonpCallback)?e.jsonpCallback():e.jsonpCallback,a?e[a]=e[a].replace(Vt,"$1"+r):!1!==e.jsonp&&(e.url+=(Et.test(e.url)?"&":"?")+e.jsonp+"="+r),e.converters["script json"]=function(){return o||S.error(r+" was not called"),o[0]},e.dataTypes[0]="json",i=C[r],C[r]=function(){o=arguments},n.always(function(){void 0===i?S(C).removeProp(r):C[r]=i,e[r]&&(e.jsonpCallback=t.jsonpCallback,Xt.push(r)),o&&m(i)&&i(o[0]),o=i=void 0}),"script"}),y.createHTMLDocument=((Ut=E.implementation.createHTMLDocument("").body).innerHTML="<form></form><form></form>",2===Ut.childNodes.length),S.parseHTML=function(e,t,n){return"string"!=typeof e?[]:("boolean"==typeof t&&(n=t,t=!1),t||(y.createHTMLDocument?((r=(t=E.implementation.createHTMLDocument("")).createElement("base")).href=E.location.href,t.head.appendChild(r)):t=E),o=!n&&[],(i=N.exec(e))?[t.createElement(i[1])]:(i=xe([e],t,o),o&&o.length&&S(o).remove(),S.merge([],i.childNodes)));var r,i,o},S.fn.load=function(e,t,n){var r,i,o,a=this,s=e.indexOf(" ");return-1<s&&(r=vt(e.slice(s)),e=e.slice(0,s)),m(t)?(n=t,t=void 0):t&&"object"==typeof t&&(i="POST"),0<a.length&&S.ajax({url:e,type:i||"GET",dataType:"html",data:t}).done(function(e){o=arguments,a.html(r?S("<div>").append(S.parseHTML(e)).find(r):e)}).always(n&&function(e,t){a.each(function(){n.apply(this,o||[e.responseText,t,e])})}),this},S.expr.pseudos.animated=function(t){return S.grep(S.timers,function(e){return t===e.elem}).length},S.offset={setOffset:function(e,t,n){var r,i,o,a,s,u,l=S.css(e,"position"),c=S(e),f={};"static"===l&&(e.style.position="relative"),s=c.offset(),o=S.css(e,"top"),u=S.css(e,"left"),("absolute"===l||"fixed"===l)&&-1<(o+u).indexOf("auto")?(a=(r=c.position()).top,i=r.left):(a=parseFloat(o)||0,i=parseFloat(u)||0),m(t)&&(t=t.call(e,n,S.extend({},s))),null!=t.top&&(f.top=t.top-s.top+a),null!=t.left&&(f.left=t.left-s.left+i),"using"in t?t.using.call(e,f):("number"==typeof f.top&&(f.top+="px"),"number"==typeof f.left&&(f.left+="px"),c.css(f))}},S.fn.extend({offset:function(t){if(arguments.length)return void 0===t?this:this.each(function(e){S.offset.setOffset(this,t,e)});var e,n,r=this[0];return r?r.getClientRects().length?(e=r.getBoundingClientRect(),n=r.ownerDocument.defaultView,{top:e.top+n.pageYOffset,left:e.left+n.pageXOffset}):{top:0,left:0}:void 0},position:function(){if(this[0]){var e,t,n,r=this[0],i={top:0,left:0};if("fixed"===S.css(r,"position"))t=r.getBoundingClientRect();else{t=this.offset(),n=r.ownerDocument,e=r.offsetParent||n.documentElement;while(e&&(e===n.body||e===n.documentElement)&&"static"===S.css(e,"position"))e=e.parentNode;e&&e!==r&&1===e.nodeType&&((i=S(e).offset()).top+=S.css(e,"borderTopWidth",!0),i.left+=S.css(e,"borderLeftWidth",!0))}return{top:t.top-i.top-S.css(r,"marginTop",!0),left:t.left-i.left-S.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent;while(e&&"static"===S.css(e,"position"))e=e.offsetParent;return e||re})}}),S.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(t,i){var o="pageYOffset"===i;S.fn[t]=function(e){return $(this,function(e,t,n){var r;if(x(e)?r=e:9===e.nodeType&&(r=e.defaultView),void 0===n)return r?r[i]:e[t];r?r.scrollTo(o?r.pageXOffset:n,o?n:r.pageYOffset):e[t]=n},t,e,arguments.length)}}),S.each(["top","left"],function(e,n){S.cssHooks[n]=$e(y.pixelPosition,function(e,t){if(t)return t=Be(e,n),Me.test(t)?S(e).position()[n]+"px":t})}),S.each({Height:"height",Width:"width"},function(a,s){S.each({padding:"inner"+a,content:s,"":"outer"+a},function(r,o){S.fn[o]=function(e,t){var n=arguments.length&&(r||"boolean"!=typeof e),i=r||(!0===e||!0===t?"margin":"border");return $(this,function(e,t,n){var r;return x(e)?0===o.indexOf("outer")?e["inner"+a]:e.document.documentElement["client"+a]:9===e.nodeType?(r=e.documentElement,Math.max(e.body["scroll"+a],r["scroll"+a],e.body["offset"+a],r["offset"+a],r["client"+a])):void 0===n?S.css(e,t,i):S.style(e,t,n,i)},s,n?e:void 0,n)}})}),S.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){S.fn[t]=function(e){return this.on(t,e)}}),S.fn.extend({bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)},hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)}}),S.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(e,n){S.fn[n]=function(e,t){return 0<arguments.length?this.on(n,null,e,t):this.trigger(n)}});var Gt=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;S.proxy=function(e,t){var n,r,i;if("string"==typeof t&&(n=e[t],t=e,e=n),m(e))return r=s.call(arguments,2),(i=function(){return e.apply(t||this,r.concat(s.call(arguments)))}).guid=e.guid=e.guid||S.guid++,i},S.holdReady=function(e){e?S.readyWait++:S.ready(!0)},S.isArray=Array.isArray,S.parseJSON=JSON.parse,S.nodeName=A,S.isFunction=m,S.isWindow=x,S.camelCase=X,S.type=w,S.now=Date.now,S.isNumeric=function(e){var t=S.type(e);return("number"===t||"string"===t)&&!isNaN(e-parseFloat(e))},S.trim=function(e){return null==e?"":(e+"").replace(Gt,"")},"function"==typeof define&&define.amd&&define("jquery",[],function(){return S});var Yt=C.jQuery,Qt=C.$;return S.noConflict=function(e){return C.$===S&&(C.$=Qt),e&&C.jQuery===S&&(C.jQuery=Yt),S},"undefined"==typeof e&&(C.jQuery=C.$=S),S});

/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright Â© 2001 Robert Penner
 * All rights reserved.
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright Â© 2008 George McGinley Smith
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/
jQuery.easing.jswing=jQuery.easing.swing;jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(e,f,a,h,g){return jQuery.easing[jQuery.easing.def](e,f,a,h,g)},easeInQuad:function(e,f,a,h,g){return h*(f/=g)*f+a},easeOutQuad:function(e,f,a,h,g){return -h*(f/=g)*(f-2)+a},easeInOutQuad:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f+a}return -h/2*((--f)*(f-2)-1)+a},easeInCubic:function(e,f,a,h,g){return h*(f/=g)*f*f+a},easeOutCubic:function(e,f,a,h,g){return h*((f=f/g-1)*f*f+1)+a},easeInOutCubic:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f+a}return h/2*((f-=2)*f*f+2)+a},easeInQuart:function(e,f,a,h,g){return h*(f/=g)*f*f*f+a},easeOutQuart:function(e,f,a,h,g){return -h*((f=f/g-1)*f*f*f-1)+a},easeInOutQuart:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f+a}return -h/2*((f-=2)*f*f*f-2)+a},easeInQuint:function(e,f,a,h,g){return h*(f/=g)*f*f*f*f+a},easeOutQuint:function(e,f,a,h,g){return h*((f=f/g-1)*f*f*f*f+1)+a},easeInOutQuint:function(e,f,a,h,g){if((f/=g/2)<1){return h/2*f*f*f*f*f+a}return h/2*((f-=2)*f*f*f*f+2)+a},easeInSine:function(e,f,a,h,g){return -h*Math.cos(f/g*(Math.PI/2))+h+a},easeOutSine:function(e,f,a,h,g){return h*Math.sin(f/g*(Math.PI/2))+a},easeInOutSine:function(e,f,a,h,g){return -h/2*(Math.cos(Math.PI*f/g)-1)+a},easeInExpo:function(e,f,a,h,g){return(f==0)?a:h*Math.pow(2,10*(f/g-1))+a},easeOutExpo:function(e,f,a,h,g){return(f==g)?a+h:h*(-Math.pow(2,-10*f/g)+1)+a},easeInOutExpo:function(e,f,a,h,g){if(f==0){return a}if(f==g){return a+h}if((f/=g/2)<1){return h/2*Math.pow(2,10*(f-1))+a}return h/2*(-Math.pow(2,-10*--f)+2)+a},easeInCirc:function(e,f,a,h,g){return -h*(Math.sqrt(1-(f/=g)*f)-1)+a},easeOutCirc:function(e,f,a,h,g){return h*Math.sqrt(1-(f=f/g-1)*f)+a},easeInOutCirc:function(e,f,a,h,g){if((f/=g/2)<1){return -h/2*(Math.sqrt(1-f*f)-1)+a}return h/2*(Math.sqrt(1-(f-=2)*f)+1)+a},easeInElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k)==1){return e+l}if(!j){j=k*0.3}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}return -(g*Math.pow(2,10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j))+e},easeOutElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k)==1){return e+l}if(!j){j=k*0.3}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}return g*Math.pow(2,-10*h)*Math.sin((h*k-i)*(2*Math.PI)/j)+l+e},easeInOutElastic:function(f,h,e,l,k){var i=1.70158;var j=0;var g=l;if(h==0){return e}if((h/=k/2)==2){return e+l}if(!j){j=k*(0.3*1.5)}if(g<Math.abs(l)){g=l;var i=j/4}else{var i=j/(2*Math.PI)*Math.asin(l/g)}if(h<1){return -0.5*(g*Math.pow(2,10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j))+e}return g*Math.pow(2,-10*(h-=1))*Math.sin((h*k-i)*(2*Math.PI)/j)*0.5+l+e},easeInBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*(f/=h)*f*((g+1)*f-g)+a},easeOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}return i*((f=f/h-1)*f*((g+1)*f+g)+1)+a},easeInOutBack:function(e,f,a,i,h,g){if(g==undefined){g=1.70158}if((f/=h/2)<1){return i/2*(f*f*(((g*=(1.525))+1)*f-g))+a}return i/2*((f-=2)*f*(((g*=(1.525))+1)*f+g)+2)+a},easeInBounce:function(e,f,a,h,g){return h-jQuery.easing.easeOutBounce(e,g-f,0,h,g)+a},easeOutBounce:function(e,f,a,h,g){if((f/=g)<(1/2.75)){return h*(7.5625*f*f)+a}else{if(f<(2/2.75)){return h*(7.5625*(f-=(1.5/2.75))*f+0.75)+a}else{if(f<(2.5/2.75)){return h*(7.5625*(f-=(2.25/2.75))*f+0.9375)+a}else{return h*(7.5625*(f-=(2.625/2.75))*f+0.984375)+a}}}},easeInOutBounce:function(e,f,a,h,g){if(f<g/2){return jQuery.easing.easeInBounce(e,f*2,0,h,g)*0.5+a}return jQuery.easing.easeOutBounce(e,f*2-g,0,h,g)*0.5+h*0.5+a}});

"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperty(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function _slicedToArray(e,t){return _arrayWithHoles(e)||_iterableToArrayLimit(e,t)||_unsupportedIterableToArray(e,t)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(e,t){if(e){if("string"==typeof e)return _arrayLikeToArray(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?_arrayLikeToArray(e,t):void 0}}function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function _iterableToArrayLimit(e,t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e)){var n=[],r=!0,i=!1,o=void 0;try{for(var a,l=e[Symbol.iterator]();!(r=(a=l.next()).done)&&(n.push(a.value),!t||n.length!==t);r=!0);}catch(e){i=!0,o=e}finally{try{r||null==l.return||l.return()}finally{if(i)throw o}}return n}}function _arrayWithHoles(e){if(Array.isArray(e))return e}!function(){function n(e){return["elInY+elHeight","elCenterY-".concat(e=0<arguments.length&&void 0!==e?e:30),"elCenterY","elCenterY+".concat(e),"elOutY-elHeight"]}var l,u,s,_,P,I,t={fadeInOut:function(e,t){t=1<arguments.length&&void 0!==t?t:0;return{opacity:[n(0<arguments.length&&void 0!==e?e:30),[t,1,1,1,t]]}},fadeIn:function(e,t){return{opacity:[["elInY+elHeight",0<arguments.length&&void 0!==e?e:"elCenterY"],[1<arguments.length&&void 0!==t?t:0,1]]}},fadeOut:function(e,t){return{opacity:[[0<arguments.length&&void 0!==e?e:"elCenterY","elOutY-elHeight"],[1,1<arguments.length&&void 0!==t?t:0]]}},blurInOut:function(e,t){t=1<arguments.length&&void 0!==t?t:20;return{blur:[n(0<arguments.length&&void 0!==e?e:100),[t,0,0,0,t]]}},blurIn:function(e,t){return{blur:[["elInY+elHeight",0<arguments.length&&void 0!==e?e:"elCenterY"],[1<arguments.length&&void 0!==t?t:20,0]]}},blurOut:function(e,t){return{opacity:[[0<arguments.length&&void 0!==e?e:"elCenterY","elOutY-elHeight"],[0,1<arguments.length&&void 0!==t?t:20]]}},scaleInOut:function(e,t){t=1<arguments.length&&void 0!==t?t:.6;return{scale:[n(0<arguments.length&&void 0!==e?e:100),[t,1,1,1,t]]}},scaleIn:function(e,t){return{scale:[["elInY+elHeight",0<arguments.length&&void 0!==e?e:"elCenterY"],[1<arguments.length&&void 0!==t?t:.6,1]]}},scaleOut:function(e,t){return{scale:[[0<arguments.length&&void 0!==e?e:"elCenterY","elOutY-elHeight"],[1,1<arguments.length&&void 0!==t?t:.6]]}},slideX:function(e,t){return{translateX:[["elInY",0<arguments.length&&void 0!==e?e:0],[0,1<arguments.length&&void 0!==t?t:500]]}},slideY:function(e,t){return{translateY:[["elInY",0<arguments.length&&void 0!==e?e:0],[0,1<arguments.length&&void 0!==t?t:500]]}},spin:function(e,t){e=0<arguments.length&&void 0!==e?e:1e3;return{rotate:[[0,e],[0,1<arguments.length&&void 0!==t?t:360],{modValue:e}]}},flipX:function(e,t){e=0<arguments.length&&void 0!==e?e:1e3;return{rotateX:[[0,e],[0,1<arguments.length&&void 0!==t?t:360],{modValue:e}]}},flipY:function(e,t){e=0<arguments.length&&void 0!==e?e:1e3;return{rotateY:[[0,e],[0,1<arguments.length&&void 0!==t?t:360],{modValue:e}]}},jiggle:function(e,t){e=0<arguments.length&&void 0!==e?e:50,t=1<arguments.length&&void 0!==t?t:40;return{skewX:[[0,+e,2*e,3*e,4*e],[0,t,0,-t,0],{modValue:4*e}]}},seesaw:function(e,t){e=0<arguments.length&&void 0!==e?e:50,t=1<arguments.length&&void 0!==t?t:40;return{skewY:[[0,+e,2*e,3*e,4*e],[0,t,0,-t,0],{modValue:4*e}]}},zigzag:function(e,t){e=0<arguments.length&&void 0!==e?e:100,t=1<arguments.length&&void 0!==t?t:100;return{translateX:[[0,+e,2*e,3*e,4*e],[0,t,0,-t,0],{modValue:4*e}]}},hueRotate:function(e,t){e=0<arguments.length&&void 0!==e?e:600;return{"hue-rotate":[[0,e],[0,1<arguments.length&&void 0!==t?t:360],{modValue:e}]}}},e=(l=["perspective","scaleX","scaleY","scale","skewX","skewY","skew","rotateX","rotateY","rotate"],u=["blur","hue-rotate","brightness"],s=["translateX","translateY","translateZ"],_=["perspective","border-radius","blur","translateX","translateY","translateZ"],P=["hue-rotate","rotate","rotateX","rotateY","skew","skewX","skewY"],I={easeInQuad:function(e){return e*e},easeOutQuad:function(e){return e*(2-e)},easeInOutQuad:function(e){return e<.5?2*e*e:(4-2*e)*e-1},easeInCubic:function(e){return e*e*e},easeOutCubic:function(e){return--e*e*e+1},easeInOutCubic:function(e){return e<.5?4*e*e*e:(e-1)*(2*e-2)*(2*e-2)+1},easeInQuart:function(e){return e*e*e*e},easeOutQuart:function(e){return 1- --e*e*e*e},easeInOutQuart:function(e){return e<.5?8*e*e*e*e:1-8*--e*e*e*e},easeInQuint:function(e){return e*e*e*e*e},easeOutQuint:function(e){return 1+--e*e*e*e*e},easeInOutQuint:function(e){return e<.5?16*e*e*e*e*e:1+16*--e*e*e*e*e},easeOutBounce:function(e){var t=7.5625,n=2.75;return e<1/n?t*e*e:e<2/n?t*(e-=1.5/n)*e+.75:e<2.5/n?t*(e-=2.25/n)*e+.9375:t*(e-=2.625/n)*e+.984375},easeInBounce:function(e){return 1-I.easeOutBounce(1-e)},easeOutBack:function(e){return 1+2.70158*Math.pow(e-1,3)+1.70158*Math.pow(e-1,2)},easeInBack:function(e){return 2.70158*e*e*e-1.70158*e*e}},new function e(){var o=this;_classCallCheck(this,e),_defineProperty(this,"drivers",[]),_defineProperty(this,"elements",[]),_defineProperty(this,"frame",0),_defineProperty(this,"debug",!1),_defineProperty(this,"windowWidth",0),_defineProperty(this,"windowHeight",0),_defineProperty(this,"presets",t),_defineProperty(this,"debugData",{frameLengths:[]}),_defineProperty(this,"init",function(){o.findAndAddElements(),window.requestAnimationFrame(o.onAnimationFrame),o.windowWidth=document.body.clientWidth,o.windowHeight=document.body.clientHeight,window.onresize=o.onWindowResize}),_defineProperty(this,"onWindowResize",function(){document.body.clientWidth===o.windowWidth&&document.body.clientHeight===o.windowHeight||(o.windowWidth=document.body.clientWidth,o.windowHeight=document.body.clientHeight,o.elements.forEach(function(e){return e.calculateTransforms()}))}),_defineProperty(this,"onAnimationFrame",function(e){o.debug&&(o.debugData.frameStart=Date.now());var t,n={};o.drivers.forEach(function(e){n[e.name]=e.getValue(o.frame)}),o.elements.forEach(function(e){e.update(n,o.frame)}),o.debug&&o.debugData.frameLengths.push(Date.now()-o.debugData.frameStart),o.frame%60==0&&o.debug&&(t=Math.ceil(o.debugData.frameLengths.reduce(function(e,t){return e+t},0)/60),console.log("Average frame calculation time: ".concat(t,"ms")),o.debugData.frameLengths=[]),o.frame++,window.requestAnimationFrame(o.onAnimationFrame)}),_defineProperty(this,"addDriver",function(e,t){var n=2<arguments.length&&void 0!==arguments[2]?arguments[2]:{};o.drivers.push(new i(e,t,n))}),_defineProperty(this,"removeDriver",function(t){o.drivers=o.drivers.filter(function(e){return e.name!==t})}),_defineProperty(this,"findAndAddElements",function(){o.elements=[],document.querySelectorAll(".lax").forEach(function(e){var t=[];e.classList.forEach(function(e){e.includes("lax_preset")&&(e=e.replace("lax_preset_",""),t.push(e))});var n=_defineProperty({},"scrollY",{presets:t});o.elements.push(new f(".lax",o,e,n,0,{}))})}),_defineProperty(this,"addElements",function(n,r,i){document.querySelectorAll(n).forEach(function(e,t){o.elements.push(new f(n,o,e,r,t,i))})}),_defineProperty(this,"removeElements",function(t){o.elements=o.elements.filter(function(e){return e.selector!==t})}),_defineProperty(this,"addElement",function(e,t,n){o.elements.push(new f("",o,e,t,0,n))}),_defineProperty(this,"removeElement",function(t){o.elements=o.elements.filter(function(e){return e.domElement!==t})})});function c(e,t){if(Array.isArray(e))return e;for(var n=Object.keys(e).map(function(e){return parseInt(e)}).sort(function(e,t){return t<e?1:-1}),r=n[n.length-1],i=0;i<n.length;i++){var o=n[i];if(t<o){r=o;break}}return e[r]}function d(e,t,n){var r=t.width,i=t.height,o=t.x,a=t.y;if("number"==typeof e)return e;var l,u=document.body.scrollHeight,s=document.body.scrollWidth,c=window.innerWidth,d=window.innerHeight,f=_slicedToArray((l=void 0!==window.pageXOffset,f="CSS1Compat"===(document.compatMode||""),t=l?window.pageXOffset:(f?document.documentElement:document.body).scrollLeft,[l?window.pageYOffset:(f?document.documentElement:document.body).scrollTop,t]),2),t=f[0],o=o+f[1],f=o+r,a=a+t,t=a+i;return Function("return ".concat(e.replace(/screenWidth/g,c).replace(/screenHeight/g,d).replace(/pageHeight/g,u).replace(/pageWidth/g,s).replace(/elWidth/g,r).replace(/elHeight/g,i).replace(/elInY/g,a-d).replace(/elOutY/g,t).replace(/elCenterY/g,a+i/2-d/2).replace(/elInX/g,o-c).replace(/elOutX/g,f).replace(/elCenterX/g,o+r/2-c/2).replace(/index/g,n)))()}function i(e,t){var n=this,r=2<arguments.length&&void 0!==arguments[2]?arguments[2]:{};_classCallCheck(this,i),_defineProperty(this,"getValueFn",void 0),_defineProperty(this,"name",""),_defineProperty(this,"lastValue",0),_defineProperty(this,"frameStep",1),_defineProperty(this,"m1",0),_defineProperty(this,"m2",0),_defineProperty(this,"inertia",0),_defineProperty(this,"inertiaEnabled",!1),_defineProperty(this,"getValue",function(e){var t=n.lastValue;return e%n.frameStep==0&&(t=n.getValueFn(e)),n.inertiaEnabled&&(e=t-n.lastValue,n.m1=.8*n.m1+e*(1-.8),n.m2=.8*n.m2+n.m1*(1-.8),n.inertia=Math.round(5e3*n.m2)/15e3),n.lastValue=t,[n.lastValue,n.inertia]}),this.name=e,this.getValueFn=t,Object.keys(r).forEach(function(e){n[e]=r[e]}),this.lastValue=this.getValueFn(0)}function f(e,t,n,r){var b=this,i=4<arguments.length&&void 0!==arguments[4]?arguments[4]:0,o=5<arguments.length&&void 0!==arguments[5]?arguments[5]:{};_classCallCheck(this,f),_defineProperty(this,"domElement",void 0),_defineProperty(this,"transformsData",void 0),_defineProperty(this,"styles",{}),_defineProperty(this,"selector",""),_defineProperty(this,"groupIndex",0),_defineProperty(this,"laxInstance",void 0),_defineProperty(this,"onUpdate",void 0),_defineProperty(this,"update",function(e,t){var n,r=b.transforms,i={};for(n in r){var o=r[n];e[n]||console.error("No lax driver with name: ",n);var a,l=_slicedToArray(e[n],2),u=l[0],s=l[1];for(a in o){var c,d=_slicedToArray(o[a],3),f=d[0],h=d[1],m=d[2],p=void 0===m?{}:m,g=p.modValue,y=p.frameStep,v=void 0===y?1:y,w=p.easing,d=p.inertia,m=p.inertiaMode,y=p.cssFn,p=p.cssUnit,p=void 0===p?"":p,w=I[w];t%v==0&&(w=function(e,t,n,r){var i=0;if(e.forEach(function(e){e<n&&i++}),i<=0)return t[0];if(i>=e.length)return t[e.length-1];var o,a=(a=e[o=i-1],e=e[i],(n-a)/(e-a));return r&&(a=r(a)),o=t[o],t=t[i],o*(1-(a=a))+t*a}(f,h,g?u%g:u,w),d&&(c=s*d,"absolute"===m&&(c=Math.abs(c)),w+=c),c="px"==(p||_.includes(a)?"px":P.includes(a)?"deg":"")?0:3,c=w.toFixed(c),i[a]=y?y(c,b.domElement):c+p)}}b.applyStyles(i),b.onUpdate&&b.onUpdate(e,b.domElement)}),_defineProperty(this,"calculateTransforms",function(){b.transforms={};var e,l=b.laxInstance.windowWidth;for(e in b.transformsData)!function(e){var o=b.transformsData[e],a={},t=o.presets;(void 0===t?[]:t).forEach(function(e){var t,n=_slicedToArray(e.split(":"),3),r=n[0],i=n[1],e=n[2],n=window.lax.presets[r];n?(t=n(i,e),Object.keys(t).forEach(function(e){o[e]=t[e]})):console.error("Lax preset cannot be found with name: ",r)}),delete o.presets;for(var n in o)!function(e){var t=_slicedToArray(o[e],3),n=t[0],r=void 0===n?[-1e9,1e9]:n,n=t[1],n=void 0===n?[-1e9,1e9]:n,t=t[2],t=void 0===t?{}:t,i=b.domElement.getBoundingClientRect(),r=c(r,l).map(function(e){return d(e,i,b.groupIndex)}),n=c(n,l).map(function(e){return d(e,i,b.groupIndex)});a[e]=[r,n,t]}(n);b.transforms[e]=a}(e)}),_defineProperty(this,"applyStyles",function(e){var r,i,o,t=(r=e,i={transform:"",filter:""},o={translateX:1e-5,translateY:1e-5,translateZ:1e-5},Object.keys(r).forEach(function(e){var t=r[e],n=_.includes(e)?"px":P.includes(e)?"deg":"";s.includes(e)?o[e]=t:l.includes(e)?i.transform+="".concat(e,"(").concat(t).concat(n,") "):u.includes(e)?i.filter+="".concat(e,"(").concat(t).concat(n,") "):i[e]="".concat(t).concat(n," ")}),i.transform="translate3d(".concat(o.translateX,"px, ").concat(o.translateY,"px, ").concat(o.translateZ,"px) ").concat(i.transform),i);Object.keys(t).forEach(function(e){b.domElement.style.setProperty(e,t[e])})}),this.selector=e,this.laxInstance=t,this.domElement=n,this.transformsData=r,this.groupIndex=i;var a=void 0===(i=o.style)?{}:i,o=o.onUpdate;Object.keys(a).forEach(function(e){n.style.setProperty(e,a[e])}),o&&(this.onUpdate=o),this.calculateTransforms()}"undefined"!=typeof module&&void 0!==module.exports?module.exports=e:window.lax=e}();
/*! jQuery UI - v1.12.1 - 2021-01-12
* http://jqueryui.com
* Includes: widget.js, position.js, data.js, disable-selection.js, focusable.js, form-reset-mixin.js, jquery-1-7.js, keycode.js, labels.js, scroll-parent.js, tabbable.js, unique-id.js, effect.js, effects/effect-blind.js, effects/effect-bounce.js, effects/effect-clip.js, effects/effect-drop.js, effects/effect-explode.js, effects/effect-fade.js, effects/effect-fold.js, effects/effect-highlight.js, effects/effect-puff.js, effects/effect-pulsate.js, effects/effect-scale.js, effects/effect-shake.js, effects/effect-size.js, effects/effect-slide.js, effects/effect-transfer.js
* Copyright jQuery Foundation and other contributors; Licensed MIT */

(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define([ "jquery" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {

$.ui = $.ui || {};

var version = $.ui.version = "1.12.1";


/*!
 * jQuery UI Widget 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Widget
//>>group: Core
//>>description: Provides a factory for creating stateful widgets with a common API.
//>>docs: http://api.jqueryui.com/jQuery.widget/
//>>demos: http://jqueryui.com/widget/



var widgetUuid = 0;
var widgetSlice = Array.prototype.slice;

$.cleanData = ( function( orig ) {
	return function( elems ) {
		var events, elem, i;
		for ( i = 0; ( elem = elems[ i ] ) != null; i++ ) {
			try {

				// Only trigger remove when necessary to save time
				events = $._data( elem, "events" );
				if ( events && events.remove ) {
					$( elem ).triggerHandler( "remove" );
				}

			// Http://bugs.jquery.com/ticket/8235
			} catch ( e ) {}
		}
		orig( elems );
	};
} )( $.cleanData );

$.widget = function( name, base, prototype ) {
	var existingConstructor, constructor, basePrototype;

	// ProxiedPrototype allows the provided prototype to remain unmodified
	// so that it can be used as a mixin for multiple widgets (#8876)
	var proxiedPrototype = {};

	var namespace = name.split( "." )[ 0 ];
	name = name.split( "." )[ 1 ];
	var fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	if ( $.isArray( prototype ) ) {
		prototype = $.extend.apply( null, [ {} ].concat( prototype ) );
	}

	// Create selector for plugin
	$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
		return !!$.data( elem, fullName );
	};

	$[ namespace ] = $[ namespace ] || {};
	existingConstructor = $[ namespace ][ name ];
	constructor = $[ namespace ][ name ] = function( options, element ) {

		// Allow instantiation without "new" keyword
		if ( !this._createWidget ) {
			return new constructor( options, element );
		}

		// Allow instantiation without initializing for simple inheritance
		// must use "new" keyword (the code above always passes args)
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};

	// Extend with the existing constructor to carry over any static properties
	$.extend( constructor, existingConstructor, {
		version: prototype.version,

		// Copy the object used to create the prototype in case we need to
		// redefine the widget later
		_proto: $.extend( {}, prototype ),

		// Track widgets that inherit from this widget in case this widget is
		// redefined after a widget inherits from it
		_childConstructors: []
	} );

	basePrototype = new base();

	// We need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
	basePrototype.options = $.widget.extend( {}, basePrototype.options );
	$.each( prototype, function( prop, value ) {
		if ( !$.isFunction( value ) ) {
			proxiedPrototype[ prop ] = value;
			return;
		}
		proxiedPrototype[ prop ] = ( function() {
			function _super() {
				return base.prototype[ prop ].apply( this, arguments );
			}

			function _superApply( args ) {
				return base.prototype[ prop ].apply( this, args );
			}

			return function() {
				var __super = this._super;
				var __superApply = this._superApply;
				var returnValue;

				this._super = _super;
				this._superApply = _superApply;

				returnValue = value.apply( this, arguments );

				this._super = __super;
				this._superApply = __superApply;

				return returnValue;
			};
		} )();
	} );
	constructor.prototype = $.widget.extend( basePrototype, {

		// TODO: remove support for widgetEventPrefix
		// always use the name + a colon as the prefix, e.g., draggable:start
		// don't prefix for widgets that aren't DOM-based
		widgetEventPrefix: existingConstructor ? ( basePrototype.widgetEventPrefix || name ) : name
	}, proxiedPrototype, {
		constructor: constructor,
		namespace: namespace,
		widgetName: name,
		widgetFullName: fullName
	} );

	// If this widget is being redefined then we need to find all widgets that
	// are inheriting from it and redefine all of them so that they inherit from
	// the new version of this widget. We're essentially trying to replace one
	// level in the prototype chain.
	if ( existingConstructor ) {
		$.each( existingConstructor._childConstructors, function( i, child ) {
			var childPrototype = child.prototype;

			// Redefine the child widget using the same prototype that was
			// originally used, but inherit from the new version of the base
			$.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor,
				child._proto );
		} );

		// Remove the list of existing child constructors from the old constructor
		// so the old child constructors can be garbage collected
		delete existingConstructor._childConstructors;
	} else {
		base._childConstructors.push( constructor );
	}

	$.widget.bridge( name, constructor );

	return constructor;
};

$.widget.extend = function( target ) {
	var input = widgetSlice.call( arguments, 1 );
	var inputIndex = 0;
	var inputLength = input.length;
	var key;
	var value;

	for ( ; inputIndex < inputLength; inputIndex++ ) {
		for ( key in input[ inputIndex ] ) {
			value = input[ inputIndex ][ key ];
			if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {

				// Clone objects
				if ( $.isPlainObject( value ) ) {
					target[ key ] = $.isPlainObject( target[ key ] ) ?
						$.widget.extend( {}, target[ key ], value ) :

						// Don't extend strings, arrays, etc. with objects
						$.widget.extend( {}, value );

				// Copy everything else by reference
				} else {
					target[ key ] = value;
				}
			}
		}
	}
	return target;
};

$.widget.bridge = function( name, object ) {
	var fullName = object.prototype.widgetFullName || name;
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string";
		var args = widgetSlice.call( arguments, 1 );
		var returnValue = this;

		if ( isMethodCall ) {

			// If this is an empty collection, we need to have the instance method
			// return undefined instead of the jQuery instance
			if ( !this.length && options === "instance" ) {
				returnValue = undefined;
			} else {
				this.each( function() {
					var methodValue;
					var instance = $.data( this, fullName );

					if ( options === "instance" ) {
						returnValue = instance;
						return false;
					}

					if ( !instance ) {
						return $.error( "cannot call methods on " + name +
							" prior to initialization; " +
							"attempted to call method '" + options + "'" );
					}

					if ( !$.isFunction( instance[ options ] ) || options.charAt( 0 ) === "_" ) {
						return $.error( "no such method '" + options + "' for " + name +
							" widget instance" );
					}

					methodValue = instance[ options ].apply( instance, args );

					if ( methodValue !== instance && methodValue !== undefined ) {
						returnValue = methodValue && methodValue.jquery ?
							returnValue.pushStack( methodValue.get() ) :
							methodValue;
						return false;
					}
				} );
			}
		} else {

			// Allow multiple hashes to be passed on init
			if ( args.length ) {
				options = $.widget.extend.apply( null, [ options ].concat( args ) );
			}

			this.each( function() {
				var instance = $.data( this, fullName );
				if ( instance ) {
					instance.option( options || {} );
					if ( instance._init ) {
						instance._init();
					}
				} else {
					$.data( this, fullName, new object( options, this ) );
				}
			} );
		}

		return returnValue;
	};
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	defaultElement: "<div>",

	options: {
		classes: {},
		disabled: false,

		// Callbacks
		create: null
	},

	_createWidget: function( options, element ) {
		element = $( element || this.defaultElement || this )[ 0 ];
		this.element = $( element );
		this.uuid = widgetUuid++;
		this.eventNamespace = "." + this.widgetName + this.uuid;

		this.bindings = $();
		this.hoverable = $();
		this.focusable = $();
		this.classesElementLookup = {};

		if ( element !== this ) {
			$.data( element, this.widgetFullName, this );
			this._on( true, this.element, {
				remove: function( event ) {
					if ( event.target === element ) {
						this.destroy();
					}
				}
			} );
			this.document = $( element.style ?

				// Element within the document
				element.ownerDocument :

				// Element is window or document
				element.document || element );
			this.window = $( this.document[ 0 ].defaultView || this.document[ 0 ].parentWindow );
		}

		this.options = $.widget.extend( {},
			this.options,
			this._getCreateOptions(),
			options );

		this._create();

		if ( this.options.disabled ) {
			this._setOptionDisabled( this.options.disabled );
		}

		this._trigger( "create", null, this._getCreateEventData() );
		this._init();
	},

	_getCreateOptions: function() {
		return {};
	},

	_getCreateEventData: $.noop,

	_create: $.noop,

	_init: $.noop,

	destroy: function() {
		var that = this;

		this._destroy();
		$.each( this.classesElementLookup, function( key, value ) {
			that._removeClass( value, key );
		} );

		// We can probably remove the unbind calls in 2.0
		// all event bindings should go through this._on()
		this.element
			.off( this.eventNamespace )
			.removeData( this.widgetFullName );
		this.widget()
			.off( this.eventNamespace )
			.removeAttr( "aria-disabled" );

		// Clean up events and states
		this.bindings.off( this.eventNamespace );
	},

	_destroy: $.noop,

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key;
		var parts;
		var curOption;
		var i;

		if ( arguments.length === 0 ) {

			// Don't return a reference to the internal hash
			return $.widget.extend( {}, this.options );
		}

		if ( typeof key === "string" ) {

			// Handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
			options = {};
			parts = key.split( "." );
			key = parts.shift();
			if ( parts.length ) {
				curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
				for ( i = 0; i < parts.length - 1; i++ ) {
					curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
					curOption = curOption[ parts[ i ] ];
				}
				key = parts.pop();
				if ( arguments.length === 1 ) {
					return curOption[ key ] === undefined ? null : curOption[ key ];
				}
				curOption[ key ] = value;
			} else {
				if ( arguments.length === 1 ) {
					return this.options[ key ] === undefined ? null : this.options[ key ];
				}
				options[ key ] = value;
			}
		}

		this._setOptions( options );

		return this;
	},

	_setOptions: function( options ) {
		var key;

		for ( key in options ) {
			this._setOption( key, options[ key ] );
		}

		return this;
	},

	_setOption: function( key, value ) {
		if ( key === "classes" ) {
			this._setOptionClasses( value );
		}

		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this._setOptionDisabled( value );
		}

		return this;
	},

	_setOptionClasses: function( value ) {
		var classKey, elements, currentElements;

		for ( classKey in value ) {
			currentElements = this.classesElementLookup[ classKey ];
			if ( value[ classKey ] === this.options.classes[ classKey ] ||
					!currentElements ||
					!currentElements.length ) {
				continue;
			}

			// We are doing this to create a new jQuery object because the _removeClass() call
			// on the next line is going to destroy the reference to the current elements being
			// tracked. We need to save a copy of this collection so that we can add the new classes
			// below.
			elements = $( currentElements.get() );
			this._removeClass( currentElements, classKey );

			// We don't use _addClass() here, because that uses this.options.classes
			// for generating the string of classes. We want to use the value passed in from
			// _setOption(), this is the new value of the classes option which was passed to
			// _setOption(). We pass this value directly to _classes().
			elements.addClass( this._classes( {
				element: elements,
				keys: classKey,
				classes: value,
				add: true
			} ) );
		}
	},

	_setOptionDisabled: function( value ) {
		this._toggleClass( this.widget(), this.widgetFullName + "-disabled", null, !!value );

		// If the widget is becoming disabled, then nothing is interactive
		if ( value ) {
			this._removeClass( this.hoverable, null, "ui-state-hover" );
			this._removeClass( this.focusable, null, "ui-state-focus" );
		}
	},

	enable: function() {
		return this._setOptions( { disabled: false } );
	},

	disable: function() {
		return this._setOptions( { disabled: true } );
	},

	_classes: function( options ) {
		var full = [];
		var that = this;

		options = $.extend( {
			element: this.element,
			classes: this.options.classes || {}
		}, options );

		function processClassString( classes, checkOption ) {
			var current, i;
			for ( i = 0; i < classes.length; i++ ) {
				current = that.classesElementLookup[ classes[ i ] ] || $();
				if ( options.add ) {
					current = $( $.unique( current.get().concat( options.element.get() ) ) );
				} else {
					current = $( current.not( options.element ).get() );
				}
				that.classesElementLookup[ classes[ i ] ] = current;
				full.push( classes[ i ] );
				if ( checkOption && options.classes[ classes[ i ] ] ) {
					full.push( options.classes[ classes[ i ] ] );
				}
			}
		}

		this._on( options.element, {
			"remove": "_untrackClassesElement"
		} );

		if ( options.keys ) {
			processClassString( options.keys.match( /\S+/g ) || [], true );
		}
		if ( options.extra ) {
			processClassString( options.extra.match( /\S+/g ) || [] );
		}

		return full.join( " " );
	},

	_untrackClassesElement: function( event ) {
		var that = this;
		$.each( that.classesElementLookup, function( key, value ) {
			if ( $.inArray( event.target, value ) !== -1 ) {
				that.classesElementLookup[ key ] = $( value.not( event.target ).get() );
			}
		} );
	},

	_removeClass: function( element, keys, extra ) {
		return this._toggleClass( element, keys, extra, false );
	},

	_addClass: function( element, keys, extra ) {
		return this._toggleClass( element, keys, extra, true );
	},

	_toggleClass: function( element, keys, extra, add ) {
		add = ( typeof add === "boolean" ) ? add : extra;
		var shift = ( typeof element === "string" || element === null ),
			options = {
				extra: shift ? keys : extra,
				keys: shift ? element : keys,
				element: shift ? this.element : element,
				add: add
			};
		options.element.toggleClass( this._classes( options ), add );
		return this;
	},

	_on: function( suppressDisabledCheck, element, handlers ) {
		var delegateElement;
		var instance = this;

		// No suppressDisabledCheck flag, shuffle arguments
		if ( typeof suppressDisabledCheck !== "boolean" ) {
			handlers = element;
			element = suppressDisabledCheck;
			suppressDisabledCheck = false;
		}

		// No element argument, shuffle and use this.element
		if ( !handlers ) {
			handlers = element;
			element = this.element;
			delegateElement = this.widget();
		} else {
			element = delegateElement = $( element );
			this.bindings = this.bindings.add( element );
		}

		$.each( handlers, function( event, handler ) {
			function handlerProxy() {

				// Allow widgets to customize the disabled handling
				// - disabled as an array instead of boolean
				// - disabled class as method for disabling individual parts
				if ( !suppressDisabledCheck &&
						( instance.options.disabled === true ||
						$( this ).hasClass( "ui-state-disabled" ) ) ) {
					return;
				}
				return ( typeof handler === "string" ? instance[ handler ] : handler )
					.apply( instance, arguments );
			}

			// Copy the guid so direct unbinding works
			if ( typeof handler !== "string" ) {
				handlerProxy.guid = handler.guid =
					handler.guid || handlerProxy.guid || $.guid++;
			}

			var match = event.match( /^([\w:-]*)\s*(.*)$/ );
			var eventName = match[ 1 ] + instance.eventNamespace;
			var selector = match[ 2 ];

			if ( selector ) {
				delegateElement.on( eventName, selector, handlerProxy );
			} else {
				element.on( eventName, handlerProxy );
			}
		} );
	},

	_off: function( element, eventName ) {
		eventName = ( eventName || "" ).split( " " ).join( this.eventNamespace + " " ) +
			this.eventNamespace;
		element.off( eventName ).off( eventName );

		// Clear the stack to avoid memory leaks (#10056)
		this.bindings = $( this.bindings.not( element ).get() );
		this.focusable = $( this.focusable.not( element ).get() );
		this.hoverable = $( this.hoverable.not( element ).get() );
	},

	_delay: function( handler, delay ) {
		function handlerProxy() {
			return ( typeof handler === "string" ? instance[ handler ] : handler )
				.apply( instance, arguments );
		}
		var instance = this;
		return setTimeout( handlerProxy, delay || 0 );
	},

	_hoverable: function( element ) {
		this.hoverable = this.hoverable.add( element );
		this._on( element, {
			mouseenter: function( event ) {
				this._addClass( $( event.currentTarget ), null, "ui-state-hover" );
			},
			mouseleave: function( event ) {
				this._removeClass( $( event.currentTarget ), null, "ui-state-hover" );
			}
		} );
	},

	_focusable: function( element ) {
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				this._addClass( $( event.currentTarget ), null, "ui-state-focus" );
			},
			focusout: function( event ) {
				this._removeClass( $( event.currentTarget ), null, "ui-state-focus" );
			}
		} );
	},

	_trigger: function( type, event, data ) {
		var prop, orig;
		var callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();

		// The original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// Copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );
		return !( $.isFunction( callback ) &&
			callback.apply( this.element[ 0 ], [ event ].concat( data ) ) === false ||
			event.isDefaultPrevented() );
	}
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
	$.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
		if ( typeof options === "string" ) {
			options = { effect: options };
		}

		var hasOptions;
		var effectName = !options ?
			method :
			options === true || typeof options === "number" ?
				defaultEffect :
				options.effect || defaultEffect;

		options = options || {};
		if ( typeof options === "number" ) {
			options = { duration: options };
		}

		hasOptions = !$.isEmptyObject( options );
		options.complete = callback;

		if ( options.delay ) {
			element.delay( options.delay );
		}

		if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
			element[ method ]( options );
		} else if ( effectName !== method && element[ effectName ] ) {
			element[ effectName ]( options.duration, options.easing, callback );
		} else {
			element.queue( function( next ) {
				$( this )[ method ]();
				if ( callback ) {
					callback.call( element[ 0 ] );
				}
				next();
			} );
		}
	};
} );

var widget = $.widget;


/*!
 * jQuery UI Position 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/position/
 */

//>>label: Position
//>>group: Core
//>>description: Positions elements relative to other elements.
//>>docs: http://api.jqueryui.com/position/
//>>demos: http://jqueryui.com/position/


( function() {
var cachedScrollbarWidth,
	max = Math.max,
	abs = Math.abs,
	rhorizontal = /left|center|right/,
	rvertical = /top|center|bottom/,
	roffset = /[\+\-]\d+(\.[\d]+)?%?/,
	rposition = /^\w+/,
	rpercent = /%$/,
	_position = $.fn.position;

function getOffsets( offsets, width, height ) {
	return [
		parseFloat( offsets[ 0 ] ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
		parseFloat( offsets[ 1 ] ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
	];
}

function parseCss( element, property ) {
	return parseInt( $.css( element, property ), 10 ) || 0;
}

function getDimensions( elem ) {
	var raw = elem[ 0 ];
	if ( raw.nodeType === 9 ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: 0, left: 0 }
		};
	}
	if ( $.isWindow( raw ) ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: elem.scrollTop(), left: elem.scrollLeft() }
		};
	}
	if ( raw.preventDefault ) {
		return {
			width: 0,
			height: 0,
			offset: { top: raw.pageY, left: raw.pageX }
		};
	}
	return {
		width: elem.outerWidth(),
		height: elem.outerHeight(),
		offset: elem.offset()
	};
}

$.position = {
	scrollbarWidth: function() {
		if ( cachedScrollbarWidth !== undefined ) {
			return cachedScrollbarWidth;
		}
		var w1, w2,
			div = $( "<div " +
				"style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'>" +
				"<div style='height:100px;width:auto;'></div></div>" ),
			innerDiv = div.children()[ 0 ];

		$( "body" ).append( div );
		w1 = innerDiv.offsetWidth;
		div.css( "overflow", "scroll" );

		w2 = innerDiv.offsetWidth;

		if ( w1 === w2 ) {
			w2 = div[ 0 ].clientWidth;
		}

		div.remove();

		return ( cachedScrollbarWidth = w1 - w2 );
	},
	getScrollInfo: function( within ) {
		var overflowX = within.isWindow || within.isDocument ? "" :
				within.element.css( "overflow-x" ),
			overflowY = within.isWindow || within.isDocument ? "" :
				within.element.css( "overflow-y" ),
			hasOverflowX = overflowX === "scroll" ||
				( overflowX === "auto" && within.width < within.element[ 0 ].scrollWidth ),
			hasOverflowY = overflowY === "scroll" ||
				( overflowY === "auto" && within.height < within.element[ 0 ].scrollHeight );
		return {
			width: hasOverflowY ? $.position.scrollbarWidth() : 0,
			height: hasOverflowX ? $.position.scrollbarWidth() : 0
		};
	},
	getWithinInfo: function( element ) {
		var withinElement = $( element || window ),
			isWindow = $.isWindow( withinElement[ 0 ] ),
			isDocument = !!withinElement[ 0 ] && withinElement[ 0 ].nodeType === 9,
			hasOffset = !isWindow && !isDocument;
		return {
			element: withinElement,
			isWindow: isWindow,
			isDocument: isDocument,
			offset: hasOffset ? $( element ).offset() : { left: 0, top: 0 },
			scrollLeft: withinElement.scrollLeft(),
			scrollTop: withinElement.scrollTop(),
			width: withinElement.outerWidth(),
			height: withinElement.outerHeight()
		};
	}
};

$.fn.position = function( options ) {
	if ( !options || !options.of ) {
		return _position.apply( this, arguments );
	}

	// Make a copy, we don't want to modify arguments
	options = $.extend( {}, options );

	var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensions,
		target = $( options.of ),
		within = $.position.getWithinInfo( options.within ),
		scrollInfo = $.position.getScrollInfo( within ),
		collision = ( options.collision || "flip" ).split( " " ),
		offsets = {};

	dimensions = getDimensions( target );
	if ( target[ 0 ].preventDefault ) {

		// Force left top to allow flipping
		options.at = "left top";
	}
	targetWidth = dimensions.width;
	targetHeight = dimensions.height;
	targetOffset = dimensions.offset;

	// Clone to reuse original targetOffset later
	basePosition = $.extend( {}, targetOffset );

	// Force my and at to have valid horizontal and vertical positions
	// if a value is missing or invalid, it will be converted to center
	$.each( [ "my", "at" ], function() {
		var pos = ( options[ this ] || "" ).split( " " ),
			horizontalOffset,
			verticalOffset;

		if ( pos.length === 1 ) {
			pos = rhorizontal.test( pos[ 0 ] ) ?
				pos.concat( [ "center" ] ) :
				rvertical.test( pos[ 0 ] ) ?
					[ "center" ].concat( pos ) :
					[ "center", "center" ];
		}
		pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
		pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";

		// Calculate offsets
		horizontalOffset = roffset.exec( pos[ 0 ] );
		verticalOffset = roffset.exec( pos[ 1 ] );
		offsets[ this ] = [
			horizontalOffset ? horizontalOffset[ 0 ] : 0,
			verticalOffset ? verticalOffset[ 0 ] : 0
		];

		// Reduce to just the positions without the offsets
		options[ this ] = [
			rposition.exec( pos[ 0 ] )[ 0 ],
			rposition.exec( pos[ 1 ] )[ 0 ]
		];
	} );

	// Normalize collision option
	if ( collision.length === 1 ) {
		collision[ 1 ] = collision[ 0 ];
	}

	if ( options.at[ 0 ] === "right" ) {
		basePosition.left += targetWidth;
	} else if ( options.at[ 0 ] === "center" ) {
		basePosition.left += targetWidth / 2;
	}

	if ( options.at[ 1 ] === "bottom" ) {
		basePosition.top += targetHeight;
	} else if ( options.at[ 1 ] === "center" ) {
		basePosition.top += targetHeight / 2;
	}

	atOffset = getOffsets( offsets.at, targetWidth, targetHeight );
	basePosition.left += atOffset[ 0 ];
	basePosition.top += atOffset[ 1 ];

	return this.each( function() {
		var collisionPosition, using,
			elem = $( this ),
			elemWidth = elem.outerWidth(),
			elemHeight = elem.outerHeight(),
			marginLeft = parseCss( this, "marginLeft" ),
			marginTop = parseCss( this, "marginTop" ),
			collisionWidth = elemWidth + marginLeft + parseCss( this, "marginRight" ) +
				scrollInfo.width,
			collisionHeight = elemHeight + marginTop + parseCss( this, "marginBottom" ) +
				scrollInfo.height,
			position = $.extend( {}, basePosition ),
			myOffset = getOffsets( offsets.my, elem.outerWidth(), elem.outerHeight() );

		if ( options.my[ 0 ] === "right" ) {
			position.left -= elemWidth;
		} else if ( options.my[ 0 ] === "center" ) {
			position.left -= elemWidth / 2;
		}

		if ( options.my[ 1 ] === "bottom" ) {
			position.top -= elemHeight;
		} else if ( options.my[ 1 ] === "center" ) {
			position.top -= elemHeight / 2;
		}

		position.left += myOffset[ 0 ];
		position.top += myOffset[ 1 ];

		collisionPosition = {
			marginLeft: marginLeft,
			marginTop: marginTop
		};

		$.each( [ "left", "top" ], function( i, dir ) {
			if ( $.ui.position[ collision[ i ] ] ) {
				$.ui.position[ collision[ i ] ][ dir ]( position, {
					targetWidth: targetWidth,
					targetHeight: targetHeight,
					elemWidth: elemWidth,
					elemHeight: elemHeight,
					collisionPosition: collisionPosition,
					collisionWidth: collisionWidth,
					collisionHeight: collisionHeight,
					offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
					my: options.my,
					at: options.at,
					within: within,
					elem: elem
				} );
			}
		} );

		if ( options.using ) {

			// Adds feedback as second argument to using callback, if present
			using = function( props ) {
				var left = targetOffset.left - position.left,
					right = left + targetWidth - elemWidth,
					top = targetOffset.top - position.top,
					bottom = top + targetHeight - elemHeight,
					feedback = {
						target: {
							element: target,
							left: targetOffset.left,
							top: targetOffset.top,
							width: targetWidth,
							height: targetHeight
						},
						element: {
							element: elem,
							left: position.left,
							top: position.top,
							width: elemWidth,
							height: elemHeight
						},
						horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
						vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
					};
				if ( targetWidth < elemWidth && abs( left + right ) < targetWidth ) {
					feedback.horizontal = "center";
				}
				if ( targetHeight < elemHeight && abs( top + bottom ) < targetHeight ) {
					feedback.vertical = "middle";
				}
				if ( max( abs( left ), abs( right ) ) > max( abs( top ), abs( bottom ) ) ) {
					feedback.important = "horizontal";
				} else {
					feedback.important = "vertical";
				}
				options.using.call( this, props, feedback );
			};
		}

		elem.offset( $.extend( position, { using: using } ) );
	} );
};

$.ui.position = {
	fit: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
				outerWidth = within.width,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = withinOffset - collisionPosLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
				newOverRight;

			// Element is wider than within
			if ( data.collisionWidth > outerWidth ) {

				// Element is initially over the left side of within
				if ( overLeft > 0 && overRight <= 0 ) {
					newOverRight = position.left + overLeft + data.collisionWidth - outerWidth -
						withinOffset;
					position.left += overLeft - newOverRight;

				// Element is initially over right side of within
				} else if ( overRight > 0 && overLeft <= 0 ) {
					position.left = withinOffset;

				// Element is initially over both left and right sides of within
				} else {
					if ( overLeft > overRight ) {
						position.left = withinOffset + outerWidth - data.collisionWidth;
					} else {
						position.left = withinOffset;
					}
				}

			// Too far left -> align with left edge
			} else if ( overLeft > 0 ) {
				position.left += overLeft;

			// Too far right -> align with right edge
			} else if ( overRight > 0 ) {
				position.left -= overRight;

			// Adjust based on position and margin
			} else {
				position.left = max( position.left - collisionPosLeft, position.left );
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
				outerHeight = data.within.height,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = withinOffset - collisionPosTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
				newOverBottom;

			// Element is taller than within
			if ( data.collisionHeight > outerHeight ) {

				// Element is initially over the top of within
				if ( overTop > 0 && overBottom <= 0 ) {
					newOverBottom = position.top + overTop + data.collisionHeight - outerHeight -
						withinOffset;
					position.top += overTop - newOverBottom;

				// Element is initially over bottom of within
				} else if ( overBottom > 0 && overTop <= 0 ) {
					position.top = withinOffset;

				// Element is initially over both top and bottom of within
				} else {
					if ( overTop > overBottom ) {
						position.top = withinOffset + outerHeight - data.collisionHeight;
					} else {
						position.top = withinOffset;
					}
				}

			// Too far up -> align with top
			} else if ( overTop > 0 ) {
				position.top += overTop;

			// Too far down -> align with bottom edge
			} else if ( overBottom > 0 ) {
				position.top -= overBottom;

			// Adjust based on position and margin
			} else {
				position.top = max( position.top - collisionPosTop, position.top );
			}
		}
	},
	flip: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.left + within.scrollLeft,
				outerWidth = within.width,
				offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = collisionPosLeft - offsetLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
				myOffset = data.my[ 0 ] === "left" ?
					-data.elemWidth :
					data.my[ 0 ] === "right" ?
						data.elemWidth :
						0,
				atOffset = data.at[ 0 ] === "left" ?
					data.targetWidth :
					data.at[ 0 ] === "right" ?
						-data.targetWidth :
						0,
				offset = -2 * data.offset[ 0 ],
				newOverRight,
				newOverLeft;

			if ( overLeft < 0 ) {
				newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth -
					outerWidth - withinOffset;
				if ( newOverRight < 0 || newOverRight < abs( overLeft ) ) {
					position.left += myOffset + atOffset + offset;
				}
			} else if ( overRight > 0 ) {
				newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset +
					atOffset + offset - offsetLeft;
				if ( newOverLeft > 0 || abs( newOverLeft ) < overRight ) {
					position.left += myOffset + atOffset + offset;
				}
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.top + within.scrollTop,
				outerHeight = within.height,
				offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = collisionPosTop - offsetTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
				top = data.my[ 1 ] === "top",
				myOffset = top ?
					-data.elemHeight :
					data.my[ 1 ] === "bottom" ?
						data.elemHeight :
						0,
				atOffset = data.at[ 1 ] === "top" ?
					data.targetHeight :
					data.at[ 1 ] === "bottom" ?
						-data.targetHeight :
						0,
				offset = -2 * data.offset[ 1 ],
				newOverTop,
				newOverBottom;
			if ( overTop < 0 ) {
				newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight -
					outerHeight - withinOffset;
				if ( newOverBottom < 0 || newOverBottom < abs( overTop ) ) {
					position.top += myOffset + atOffset + offset;
				}
			} else if ( overBottom > 0 ) {
				newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset +
					offset - offsetTop;
				if ( newOverTop > 0 || abs( newOverTop ) < overBottom ) {
					position.top += myOffset + atOffset + offset;
				}
			}
		}
	},
	flipfit: {
		left: function() {
			$.ui.position.flip.left.apply( this, arguments );
			$.ui.position.fit.left.apply( this, arguments );
		},
		top: function() {
			$.ui.position.flip.top.apply( this, arguments );
			$.ui.position.fit.top.apply( this, arguments );
		}
	}
};

} )();

var position = $.ui.position;


/*!
 * jQuery UI :data 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: :data Selector
//>>group: Core
//>>description: Selects elements which have data stored under the specified key.
//>>docs: http://api.jqueryui.com/data-selector/


var data = $.extend( $.expr[ ":" ], {
	data: $.expr.createPseudo ?
		$.expr.createPseudo( function( dataName ) {
			return function( elem ) {
				return !!$.data( elem, dataName );
			};
		} ) :

		// Support: jQuery <1.8
		function( elem, i, match ) {
			return !!$.data( elem, match[ 3 ] );
		}
} );

/*!
 * jQuery UI Disable Selection 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: disableSelection
//>>group: Core
//>>description: Disable selection of text content within the set of matched elements.
//>>docs: http://api.jqueryui.com/disableSelection/

// This file is deprecated


var disableSelection = $.fn.extend( {
	disableSelection: ( function() {
		var eventType = "onselectstart" in document.createElement( "div" ) ?
			"selectstart" :
			"mousedown";

		return function() {
			return this.on( eventType + ".ui-disableSelection", function( event ) {
				event.preventDefault();
			} );
		};
	} )(),

	enableSelection: function() {
		return this.off( ".ui-disableSelection" );
	}
} );


/*!
 * jQuery UI Focusable 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: :focusable Selector
//>>group: Core
//>>description: Selects elements which can be focused.
//>>docs: http://api.jqueryui.com/focusable-selector/



// Selectors
$.ui.focusable = function( element, hasTabindex ) {
	var map, mapName, img, focusableIfVisible, fieldset,
		nodeName = element.nodeName.toLowerCase();

	if ( "area" === nodeName ) {
		map = element.parentNode;
		mapName = map.name;
		if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
			return false;
		}
		img = $( "img[usemap='#" + mapName + "']" );
		return img.length > 0 && img.is( ":visible" );
	}

	if ( /^(input|select|textarea|button|object)$/.test( nodeName ) ) {
		focusableIfVisible = !element.disabled;

		if ( focusableIfVisible ) {

			// Form controls within a disabled fieldset are disabled.
			// However, controls within the fieldset's legend do not get disabled.
			// Since controls generally aren't placed inside legends, we skip
			// this portion of the check.
			fieldset = $( element ).closest( "fieldset" )[ 0 ];
			if ( fieldset ) {
				focusableIfVisible = !fieldset.disabled;
			}
		}
	} else if ( "a" === nodeName ) {
		focusableIfVisible = element.href || hasTabindex;
	} else {
		focusableIfVisible = hasTabindex;
	}

	return focusableIfVisible && $( element ).is( ":visible" ) && visible( $( element ) );
};

// Support: IE 8 only
// IE 8 doesn't resolve inherit to visible/hidden for computed values
function visible( element ) {
	var visibility = element.css( "visibility" );
	while ( visibility === "inherit" ) {
		element = element.parent();
		visibility = element.css( "visibility" );
	}
	return visibility !== "hidden";
}

$.extend( $.expr[ ":" ], {
	focusable: function( element ) {
		return $.ui.focusable( element, $.attr( element, "tabindex" ) != null );
	}
} );

var focusable = $.ui.focusable;




// Support: IE8 Only
// IE8 does not support the form attribute and when it is supplied. It overwrites the form prop
// with a string, so we need to find the proper form.
var form = $.fn.form = function() {
	return typeof this[ 0 ].form === "string" ? this.closest( "form" ) : $( this[ 0 ].form );
};


/*!
 * jQuery UI Form Reset Mixin 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Form Reset Mixin
//>>group: Core
//>>description: Refresh input widgets when their form is reset
//>>docs: http://api.jqueryui.com/form-reset-mixin/



var formResetMixin = $.ui.formResetMixin = {
	_formResetHandler: function() {
		var form = $( this );

		// Wait for the form reset to actually happen before refreshing
		setTimeout( function() {
			var instances = form.data( "ui-form-reset-instances" );
			$.each( instances, function() {
				this.refresh();
			} );
		} );
	},

	_bindFormResetHandler: function() {
		this.form = this.element.form();
		if ( !this.form.length ) {
			return;
		}

		var instances = this.form.data( "ui-form-reset-instances" ) || [];
		if ( !instances.length ) {

			// We don't use _on() here because we use a single event handler per form
			this.form.on( "reset.ui-form-reset", this._formResetHandler );
		}
		instances.push( this );
		this.form.data( "ui-form-reset-instances", instances );
	},

	_unbindFormResetHandler: function() {
		if ( !this.form.length ) {
			return;
		}

		var instances = this.form.data( "ui-form-reset-instances" );
		instances.splice( $.inArray( this, instances ), 1 );
		if ( instances.length ) {
			this.form.data( "ui-form-reset-instances", instances );
		} else {
			this.form
				.removeData( "ui-form-reset-instances" )
				.off( "reset.ui-form-reset" );
		}
	}
};


/*!
 * jQuery UI Support for jQuery core 1.7.x 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 */

//>>label: jQuery 1.7 Support
//>>group: Core
//>>description: Support version 1.7.x of jQuery core



// Support: jQuery 1.7 only
// Not a great way to check versions, but since we only support 1.7+ and only
// need to detect <1.8, this is a simple check that should suffice. Checking
// for "1.7." would be a bit safer, but the version string is 1.7, not 1.7.0
// and we'll never reach 1.70.0 (if we do, we certainly won't be supporting
// 1.7 anymore). See #11197 for why we're not using feature detection.
if ( $.fn.jquery.substring( 0, 3 ) === "1.7" ) {

	// Setters for .innerWidth(), .innerHeight(), .outerWidth(), .outerHeight()
	// Unlike jQuery Core 1.8+, these only support numeric values to set the
	// dimensions in pixels
	$.each( [ "Width", "Height" ], function( i, name ) {
		var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
			type = name.toLowerCase(),
			orig = {
				innerWidth: $.fn.innerWidth,
				innerHeight: $.fn.innerHeight,
				outerWidth: $.fn.outerWidth,
				outerHeight: $.fn.outerHeight
			};

		function reduce( elem, size, border, margin ) {
			$.each( side, function() {
				size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
				if ( border ) {
					size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
				}
				if ( margin ) {
					size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
				}
			} );
			return size;
		}

		$.fn[ "inner" + name ] = function( size ) {
			if ( size === undefined ) {
				return orig[ "inner" + name ].call( this );
			}

			return this.each( function() {
				$( this ).css( type, reduce( this, size ) + "px" );
			} );
		};

		$.fn[ "outer" + name ] = function( size, margin ) {
			if ( typeof size !== "number" ) {
				return orig[ "outer" + name ].call( this, size );
			}

			return this.each( function() {
				$( this ).css( type, reduce( this, size, true, margin ) + "px" );
			} );
		};
	} );

	$.fn.addBack = function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	};
}

;
/*!
 * jQuery UI Keycode 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Keycode
//>>group: Core
//>>description: Provide keycodes as keynames
//>>docs: http://api.jqueryui.com/jQuery.ui.keyCode/


var keycode = $.ui.keyCode = {
	BACKSPACE: 8,
	COMMA: 188,
	DELETE: 46,
	DOWN: 40,
	END: 35,
	ENTER: 13,
	ESCAPE: 27,
	HOME: 36,
	LEFT: 37,
	PAGE_DOWN: 34,
	PAGE_UP: 33,
	PERIOD: 190,
	RIGHT: 39,
	SPACE: 32,
	TAB: 9,
	UP: 38
};




// Internal use only
var escapeSelector = $.ui.escapeSelector = ( function() {
	var selectorEscape = /([!"#$%&'()*+,./:;<=>?@[\]^`{|}~])/g;
	return function( selector ) {
		return selector.replace( selectorEscape, "\\$1" );
	};
} )();


/*!
 * jQuery UI Labels 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: labels
//>>group: Core
//>>description: Find all the labels associated with a given input
//>>docs: http://api.jqueryui.com/labels/



var labels = $.fn.labels = function() {
	var ancestor, selector, id, labels, ancestors;

	// Check control.labels first
	if ( this[ 0 ].labels && this[ 0 ].labels.length ) {
		return this.pushStack( this[ 0 ].labels );
	}

	// Support: IE <= 11, FF <= 37, Android <= 2.3 only
	// Above browsers do not support control.labels. Everything below is to support them
	// as well as document fragments. control.labels does not work on document fragments
	labels = this.eq( 0 ).parents( "label" );

	// Look for the label based on the id
	id = this.attr( "id" );
	if ( id ) {

		// We don't search against the document in case the element
		// is disconnected from the DOM
		ancestor = this.eq( 0 ).parents().last();

		// Get a full set of top level ancestors
		ancestors = ancestor.add( ancestor.length ? ancestor.siblings() : this.siblings() );

		// Create a selector for the label based on the id
		selector = "label[for='" + $.ui.escapeSelector( id ) + "']";

		labels = labels.add( ancestors.find( selector ).addBack( selector ) );

	}

	// Return whatever we have found for labels
	return this.pushStack( labels );
};


/*!
 * jQuery UI Scroll Parent 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: scrollParent
//>>group: Core
//>>description: Get the closest ancestor element that is scrollable.
//>>docs: http://api.jqueryui.com/scrollParent/



var scrollParent = $.fn.scrollParent = function( includeHidden ) {
	var position = this.css( "position" ),
		excludeStaticParent = position === "absolute",
		overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
		scrollParent = this.parents().filter( function() {
			var parent = $( this );
			if ( excludeStaticParent && parent.css( "position" ) === "static" ) {
				return false;
			}
			return overflowRegex.test( parent.css( "overflow" ) + parent.css( "overflow-y" ) +
				parent.css( "overflow-x" ) );
		} ).eq( 0 );

	return position === "fixed" || !scrollParent.length ?
		$( this[ 0 ].ownerDocument || document ) :
		scrollParent;
};


/*!
 * jQuery UI Tabbable 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: :tabbable Selector
//>>group: Core
//>>description: Selects elements which can be tabbed to.
//>>docs: http://api.jqueryui.com/tabbable-selector/



var tabbable = $.extend( $.expr[ ":" ], {
	tabbable: function( element ) {
		var tabIndex = $.attr( element, "tabindex" ),
			hasTabindex = tabIndex != null;
		return ( !hasTabindex || tabIndex >= 0 ) && $.ui.focusable( element, hasTabindex );
	}
} );


/*!
 * jQuery UI Unique ID 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: uniqueId
//>>group: Core
//>>description: Functions to generate and remove uniqueId's
//>>docs: http://api.jqueryui.com/uniqueId/



var uniqueId = $.fn.extend( {
	uniqueId: ( function() {
		var uuid = 0;

		return function() {
			return this.each( function() {
				if ( !this.id ) {
					this.id = "ui-id-" + ( ++uuid );
				}
			} );
		};
	} )(),

	removeUniqueId: function() {
		return this.each( function() {
			if ( /^ui-id-\d+$/.test( this.id ) ) {
				$( this ).removeAttr( "id" );
			}
		} );
	}
} );


/*!
 * jQuery UI Effects 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Effects Core
//>>group: Effects
// jscs:disable maximumLineLength
//>>description: Extends the internal jQuery effects. Includes morphing and easing. Required by all other effects.
// jscs:enable maximumLineLength
//>>docs: http://api.jqueryui.com/category/effects-core/
//>>demos: http://jqueryui.com/effect/



var dataSpace = "ui-effects-",
	dataSpaceStyle = "ui-effects-style",
	dataSpaceAnimated = "ui-effects-animated",

	// Create a local jQuery because jQuery Color relies on it and the
	// global may not exist with AMD and a custom build (#10199)
	jQuery = $;

$.effects = {
	effect: {}
};

/*!
 * jQuery Color Animations v2.1.2
 * https://github.com/jquery/jquery-color
 *
 * Copyright 2014 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * Date: Wed Jan 16 08:47:09 2013 -0600
 */
( function( jQuery, undefined ) {

	var stepHooks = "backgroundColor borderBottomColor borderLeftColor borderRightColor " +
		"borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",

	// Plusequals test for += 100 -= 100
	rplusequals = /^([\-+])=\s*(\d+\.?\d*)/,

	// A set of RE's that can match strings and generate color tuples.
	stringParsers = [ {
			re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
			parse: function( execResult ) {
				return [
					execResult[ 1 ],
					execResult[ 2 ],
					execResult[ 3 ],
					execResult[ 4 ]
				];
			}
		}, {
			re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
			parse: function( execResult ) {
				return [
					execResult[ 1 ] * 2.55,
					execResult[ 2 ] * 2.55,
					execResult[ 3 ] * 2.55,
					execResult[ 4 ]
				];
			}
		}, {

			// This regex ignores A-F because it's compared against an already lowercased string
			re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,
			parse: function( execResult ) {
				return [
					parseInt( execResult[ 1 ], 16 ),
					parseInt( execResult[ 2 ], 16 ),
					parseInt( execResult[ 3 ], 16 )
				];
			}
		}, {

			// This regex ignores A-F because it's compared against an already lowercased string
			re: /#([a-f0-9])([a-f0-9])([a-f0-9])/,
			parse: function( execResult ) {
				return [
					parseInt( execResult[ 1 ] + execResult[ 1 ], 16 ),
					parseInt( execResult[ 2 ] + execResult[ 2 ], 16 ),
					parseInt( execResult[ 3 ] + execResult[ 3 ], 16 )
				];
			}
		}, {
			re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
			space: "hsla",
			parse: function( execResult ) {
				return [
					execResult[ 1 ],
					execResult[ 2 ] / 100,
					execResult[ 3 ] / 100,
					execResult[ 4 ]
				];
			}
		} ],

	// JQuery.Color( )
	color = jQuery.Color = function( color, green, blue, alpha ) {
		return new jQuery.Color.fn.parse( color, green, blue, alpha );
	},
	spaces = {
		rgba: {
			props: {
				red: {
					idx: 0,
					type: "byte"
				},
				green: {
					idx: 1,
					type: "byte"
				},
				blue: {
					idx: 2,
					type: "byte"
				}
			}
		},

		hsla: {
			props: {
				hue: {
					idx: 0,
					type: "degrees"
				},
				saturation: {
					idx: 1,
					type: "percent"
				},
				lightness: {
					idx: 2,
					type: "percent"
				}
			}
		}
	},
	propTypes = {
		"byte": {
			floor: true,
			max: 255
		},
		"percent": {
			max: 1
		},
		"degrees": {
			mod: 360,
			floor: true
		}
	},
	support = color.support = {},

	// Element for support tests
	supportElem = jQuery( "<p>" )[ 0 ],

	// Colors = jQuery.Color.names
	colors,

	// Local aliases of functions called often
	each = jQuery.each;

// Determine rgba support immediately
supportElem.style.cssText = "background-color:rgba(1,1,1,.5)";
support.rgba = supportElem.style.backgroundColor.indexOf( "rgba" ) > -1;

// Define cache name and alpha properties
// for rgba and hsla spaces
each( spaces, function( spaceName, space ) {
	space.cache = "_" + spaceName;
	space.props.alpha = {
		idx: 3,
		type: "percent",
		def: 1
	};
} );

function clamp( value, prop, allowEmpty ) {
	var type = propTypes[ prop.type ] || {};

	if ( value == null ) {
		return ( allowEmpty || !prop.def ) ? null : prop.def;
	}

	// ~~ is an short way of doing floor for positive numbers
	value = type.floor ? ~~value : parseFloat( value );

	// IE will pass in empty strings as value for alpha,
	// which will hit this case
	if ( isNaN( value ) ) {
		return prop.def;
	}

	if ( type.mod ) {

		// We add mod before modding to make sure that negatives values
		// get converted properly: -10 -> 350
		return ( value + type.mod ) % type.mod;
	}

	// For now all property types without mod have min and max
	return 0 > value ? 0 : type.max < value ? type.max : value;
}

function stringParse( string ) {
	var inst = color(),
		rgba = inst._rgba = [];

	string = string.toLowerCase();

	each( stringParsers, function( i, parser ) {
		var parsed,
			match = parser.re.exec( string ),
			values = match && parser.parse( match ),
			spaceName = parser.space || "rgba";

		if ( values ) {
			parsed = inst[ spaceName ]( values );

			// If this was an rgba parse the assignment might happen twice
			// oh well....
			inst[ spaces[ spaceName ].cache ] = parsed[ spaces[ spaceName ].cache ];
			rgba = inst._rgba = parsed._rgba;

			// Exit each( stringParsers ) here because we matched
			return false;
		}
	} );

	// Found a stringParser that handled it
	if ( rgba.length ) {

		// If this came from a parsed string, force "transparent" when alpha is 0
		// chrome, (and maybe others) return "transparent" as rgba(0,0,0,0)
		if ( rgba.join() === "0,0,0,0" ) {
			jQuery.extend( rgba, colors.transparent );
		}
		return inst;
	}

	// Named colors
	return colors[ string ];
}

color.fn = jQuery.extend( color.prototype, {
	parse: function( red, green, blue, alpha ) {
		if ( red === undefined ) {
			this._rgba = [ null, null, null, null ];
			return this;
		}
		if ( red.jquery || red.nodeType ) {
			red = jQuery( red ).css( green );
			green = undefined;
		}

		var inst = this,
			type = jQuery.type( red ),
			rgba = this._rgba = [];

		// More than 1 argument specified - assume ( red, green, blue, alpha )
		if ( green !== undefined ) {
			red = [ red, green, blue, alpha ];
			type = "array";
		}

		if ( type === "string" ) {
			return this.parse( stringParse( red ) || colors._default );
		}

		if ( type === "array" ) {
			each( spaces.rgba.props, function( key, prop ) {
				rgba[ prop.idx ] = clamp( red[ prop.idx ], prop );
			} );
			return this;
		}

		if ( type === "object" ) {
			if ( red instanceof color ) {
				each( spaces, function( spaceName, space ) {
					if ( red[ space.cache ] ) {
						inst[ space.cache ] = red[ space.cache ].slice();
					}
				} );
			} else {
				each( spaces, function( spaceName, space ) {
					var cache = space.cache;
					each( space.props, function( key, prop ) {

						// If the cache doesn't exist, and we know how to convert
						if ( !inst[ cache ] && space.to ) {

							// If the value was null, we don't need to copy it
							// if the key was alpha, we don't need to copy it either
							if ( key === "alpha" || red[ key ] == null ) {
								return;
							}
							inst[ cache ] = space.to( inst._rgba );
						}

						// This is the only case where we allow nulls for ALL properties.
						// call clamp with alwaysAllowEmpty
						inst[ cache ][ prop.idx ] = clamp( red[ key ], prop, true );
					} );

					// Everything defined but alpha?
					if ( inst[ cache ] &&
							jQuery.inArray( null, inst[ cache ].slice( 0, 3 ) ) < 0 ) {

						// Use the default of 1
						inst[ cache ][ 3 ] = 1;
						if ( space.from ) {
							inst._rgba = space.from( inst[ cache ] );
						}
					}
				} );
			}
			return this;
		}
	},
	is: function( compare ) {
		var is = color( compare ),
			same = true,
			inst = this;

		each( spaces, function( _, space ) {
			var localCache,
				isCache = is[ space.cache ];
			if ( isCache ) {
				localCache = inst[ space.cache ] || space.to && space.to( inst._rgba ) || [];
				each( space.props, function( _, prop ) {
					if ( isCache[ prop.idx ] != null ) {
						same = ( isCache[ prop.idx ] === localCache[ prop.idx ] );
						return same;
					}
				} );
			}
			return same;
		} );
		return same;
	},
	_space: function() {
		var used = [],
			inst = this;
		each( spaces, function( spaceName, space ) {
			if ( inst[ space.cache ] ) {
				used.push( spaceName );
			}
		} );
		return used.pop();
	},
	transition: function( other, distance ) {
		var end = color( other ),
			spaceName = end._space(),
			space = spaces[ spaceName ],
			startColor = this.alpha() === 0 ? color( "transparent" ) : this,
			start = startColor[ space.cache ] || space.to( startColor._rgba ),
			result = start.slice();

		end = end[ space.cache ];
		each( space.props, function( key, prop ) {
			var index = prop.idx,
				startValue = start[ index ],
				endValue = end[ index ],
				type = propTypes[ prop.type ] || {};

			// If null, don't override start value
			if ( endValue === null ) {
				return;
			}

			// If null - use end
			if ( startValue === null ) {
				result[ index ] = endValue;
			} else {
				if ( type.mod ) {
					if ( endValue - startValue > type.mod / 2 ) {
						startValue += type.mod;
					} else if ( startValue - endValue > type.mod / 2 ) {
						startValue -= type.mod;
					}
				}
				result[ index ] = clamp( ( endValue - startValue ) * distance + startValue, prop );
			}
		} );
		return this[ spaceName ]( result );
	},
	blend: function( opaque ) {

		// If we are already opaque - return ourself
		if ( this._rgba[ 3 ] === 1 ) {
			return this;
		}

		var rgb = this._rgba.slice(),
			a = rgb.pop(),
			blend = color( opaque )._rgba;

		return color( jQuery.map( rgb, function( v, i ) {
			return ( 1 - a ) * blend[ i ] + a * v;
		} ) );
	},
	toRgbaString: function() {
		var prefix = "rgba(",
			rgba = jQuery.map( this._rgba, function( v, i ) {
				return v == null ? ( i > 2 ? 1 : 0 ) : v;
			} );

		if ( rgba[ 3 ] === 1 ) {
			rgba.pop();
			prefix = "rgb(";
		}

		return prefix + rgba.join() + ")";
	},
	toHslaString: function() {
		var prefix = "hsla(",
			hsla = jQuery.map( this.hsla(), function( v, i ) {
				if ( v == null ) {
					v = i > 2 ? 1 : 0;
				}

				// Catch 1 and 2
				if ( i && i < 3 ) {
					v = Math.round( v * 100 ) + "%";
				}
				return v;
			} );

		if ( hsla[ 3 ] === 1 ) {
			hsla.pop();
			prefix = "hsl(";
		}
		return prefix + hsla.join() + ")";
	},
	toHexString: function( includeAlpha ) {
		var rgba = this._rgba.slice(),
			alpha = rgba.pop();

		if ( includeAlpha ) {
			rgba.push( ~~( alpha * 255 ) );
		}

		return "#" + jQuery.map( rgba, function( v ) {

			// Default to 0 when nulls exist
			v = ( v || 0 ).toString( 16 );
			return v.length === 1 ? "0" + v : v;
		} ).join( "" );
	},
	toString: function() {
		return this._rgba[ 3 ] === 0 ? "transparent" : this.toRgbaString();
	}
} );
color.fn.parse.prototype = color.fn;

// Hsla conversions adapted from:
// https://code.google.com/p/maashaack/source/browse/packages/graphics/trunk/src/graphics/colors/HUE2RGB.as?r=5021

function hue2rgb( p, q, h ) {
	h = ( h + 1 ) % 1;
	if ( h * 6 < 1 ) {
		return p + ( q - p ) * h * 6;
	}
	if ( h * 2 < 1 ) {
		return q;
	}
	if ( h * 3 < 2 ) {
		return p + ( q - p ) * ( ( 2 / 3 ) - h ) * 6;
	}
	return p;
}

spaces.hsla.to = function( rgba ) {
	if ( rgba[ 0 ] == null || rgba[ 1 ] == null || rgba[ 2 ] == null ) {
		return [ null, null, null, rgba[ 3 ] ];
	}
	var r = rgba[ 0 ] / 255,
		g = rgba[ 1 ] / 255,
		b = rgba[ 2 ] / 255,
		a = rgba[ 3 ],
		max = Math.max( r, g, b ),
		min = Math.min( r, g, b ),
		diff = max - min,
		add = max + min,
		l = add * 0.5,
		h, s;

	if ( min === max ) {
		h = 0;
	} else if ( r === max ) {
		h = ( 60 * ( g - b ) / diff ) + 360;
	} else if ( g === max ) {
		h = ( 60 * ( b - r ) / diff ) + 120;
	} else {
		h = ( 60 * ( r - g ) / diff ) + 240;
	}

	// Chroma (diff) == 0 means greyscale which, by definition, saturation = 0%
	// otherwise, saturation is based on the ratio of chroma (diff) to lightness (add)
	if ( diff === 0 ) {
		s = 0;
	} else if ( l <= 0.5 ) {
		s = diff / add;
	} else {
		s = diff / ( 2 - add );
	}
	return [ Math.round( h ) % 360, s, l, a == null ? 1 : a ];
};

spaces.hsla.from = function( hsla ) {
	if ( hsla[ 0 ] == null || hsla[ 1 ] == null || hsla[ 2 ] == null ) {
		return [ null, null, null, hsla[ 3 ] ];
	}
	var h = hsla[ 0 ] / 360,
		s = hsla[ 1 ],
		l = hsla[ 2 ],
		a = hsla[ 3 ],
		q = l <= 0.5 ? l * ( 1 + s ) : l + s - l * s,
		p = 2 * l - q;

	return [
		Math.round( hue2rgb( p, q, h + ( 1 / 3 ) ) * 255 ),
		Math.round( hue2rgb( p, q, h ) * 255 ),
		Math.round( hue2rgb( p, q, h - ( 1 / 3 ) ) * 255 ),
		a
	];
};

each( spaces, function( spaceName, space ) {
	var props = space.props,
		cache = space.cache,
		to = space.to,
		from = space.from;

	// Makes rgba() and hsla()
	color.fn[ spaceName ] = function( value ) {

		// Generate a cache for this space if it doesn't exist
		if ( to && !this[ cache ] ) {
			this[ cache ] = to( this._rgba );
		}
		if ( value === undefined ) {
			return this[ cache ].slice();
		}

		var ret,
			type = jQuery.type( value ),
			arr = ( type === "array" || type === "object" ) ? value : arguments,
			local = this[ cache ].slice();

		each( props, function( key, prop ) {
			var val = arr[ type === "object" ? key : prop.idx ];
			if ( val == null ) {
				val = local[ prop.idx ];
			}
			local[ prop.idx ] = clamp( val, prop );
		} );

		if ( from ) {
			ret = color( from( local ) );
			ret[ cache ] = local;
			return ret;
		} else {
			return color( local );
		}
	};

	// Makes red() green() blue() alpha() hue() saturation() lightness()
	each( props, function( key, prop ) {

		// Alpha is included in more than one space
		if ( color.fn[ key ] ) {
			return;
		}
		color.fn[ key ] = function( value ) {
			var vtype = jQuery.type( value ),
				fn = ( key === "alpha" ? ( this._hsla ? "hsla" : "rgba" ) : spaceName ),
				local = this[ fn ](),
				cur = local[ prop.idx ],
				match;

			if ( vtype === "undefined" ) {
				return cur;
			}

			if ( vtype === "function" ) {
				value = value.call( this, cur );
				vtype = jQuery.type( value );
			}
			if ( value == null && prop.empty ) {
				return this;
			}
			if ( vtype === "string" ) {
				match = rplusequals.exec( value );
				if ( match ) {
					value = cur + parseFloat( match[ 2 ] ) * ( match[ 1 ] === "+" ? 1 : -1 );
				}
			}
			local[ prop.idx ] = value;
			return this[ fn ]( local );
		};
	} );
} );

// Add cssHook and .fx.step function for each named hook.
// accept a space separated string of properties
color.hook = function( hook ) {
	var hooks = hook.split( " " );
	each( hooks, function( i, hook ) {
		jQuery.cssHooks[ hook ] = {
			set: function( elem, value ) {
				var parsed, curElem,
					backgroundColor = "";

				if ( value !== "transparent" && ( jQuery.type( value ) !== "string" ||
						( parsed = stringParse( value ) ) ) ) {
					value = color( parsed || value );
					if ( !support.rgba && value._rgba[ 3 ] !== 1 ) {
						curElem = hook === "backgroundColor" ? elem.parentNode : elem;
						while (
							( backgroundColor === "" || backgroundColor === "transparent" ) &&
							curElem && curElem.style
						) {
							try {
								backgroundColor = jQuery.css( curElem, "backgroundColor" );
								curElem = curElem.parentNode;
							} catch ( e ) {
							}
						}

						value = value.blend( backgroundColor && backgroundColor !== "transparent" ?
							backgroundColor :
							"_default" );
					}

					value = value.toRgbaString();
				}
				try {
					elem.style[ hook ] = value;
				} catch ( e ) {

					// Wrapped to prevent IE from throwing errors on "invalid" values like
					// 'auto' or 'inherit'
				}
			}
		};
		jQuery.fx.step[ hook ] = function( fx ) {
			if ( !fx.colorInit ) {
				fx.start = color( fx.elem, hook );
				fx.end = color( fx.end );
				fx.colorInit = true;
			}
			jQuery.cssHooks[ hook ].set( fx.elem, fx.start.transition( fx.end, fx.pos ) );
		};
	} );

};

color.hook( stepHooks );

jQuery.cssHooks.borderColor = {
	expand: function( value ) {
		var expanded = {};

		each( [ "Top", "Right", "Bottom", "Left" ], function( i, part ) {
			expanded[ "border" + part + "Color" ] = value;
		} );
		return expanded;
	}
};

// Basic color names only.
// Usage of any of the other color names requires adding yourself or including
// jquery.color.svg-names.js.
colors = jQuery.Color.names = {

	// 4.1. Basic color keywords
	aqua: "#00ffff",
	black: "#000000",
	blue: "#0000ff",
	fuchsia: "#ff00ff",
	gray: "#808080",
	green: "#008000",
	lime: "#00ff00",
	maroon: "#800000",
	navy: "#000080",
	olive: "#808000",
	purple: "#800080",
	red: "#ff0000",
	silver: "#c0c0c0",
	teal: "#008080",
	white: "#ffffff",
	yellow: "#ffff00",

	// 4.2.3. "transparent" color keyword
	transparent: [ null, null, null, 0 ],

	_default: "#ffffff"
};

} )( jQuery );

/******************************************************************************/
/****************************** CLASS ANIMATIONS ******************************/
/******************************************************************************/
( function() {

var classAnimationActions = [ "add", "remove", "toggle" ],
	shorthandStyles = {
		border: 1,
		borderBottom: 1,
		borderColor: 1,
		borderLeft: 1,
		borderRight: 1,
		borderTop: 1,
		borderWidth: 1,
		margin: 1,
		padding: 1
	};

$.each(
	[ "borderLeftStyle", "borderRightStyle", "borderBottomStyle", "borderTopStyle" ],
	function( _, prop ) {
		$.fx.step[ prop ] = function( fx ) {
			if ( fx.end !== "none" && !fx.setAttr || fx.pos === 1 && !fx.setAttr ) {
				jQuery.style( fx.elem, prop, fx.end );
				fx.setAttr = true;
			}
		};
	}
);

function getElementStyles( elem ) {
	var key, len,
		style = elem.ownerDocument.defaultView ?
			elem.ownerDocument.defaultView.getComputedStyle( elem, null ) :
			elem.currentStyle,
		styles = {};

	if ( style && style.length && style[ 0 ] && style[ style[ 0 ] ] ) {
		len = style.length;
		while ( len-- ) {
			key = style[ len ];
			if ( typeof style[ key ] === "string" ) {
				styles[ $.camelCase( key ) ] = style[ key ];
			}
		}

	// Support: Opera, IE <9
	} else {
		for ( key in style ) {
			if ( typeof style[ key ] === "string" ) {
				styles[ key ] = style[ key ];
			}
		}
	}

	return styles;
}

function styleDifference( oldStyle, newStyle ) {
	var diff = {},
		name, value;

	for ( name in newStyle ) {
		value = newStyle[ name ];
		if ( oldStyle[ name ] !== value ) {
			if ( !shorthandStyles[ name ] ) {
				if ( $.fx.step[ name ] || !isNaN( parseFloat( value ) ) ) {
					diff[ name ] = value;
				}
			}
		}
	}

	return diff;
}

// Support: jQuery <1.8
if ( !$.fn.addBack ) {
	$.fn.addBack = function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	};
}

$.effects.animateClass = function( value, duration, easing, callback ) {
	var o = $.speed( duration, easing, callback );

	return this.queue( function() {
		var animated = $( this ),
			baseClass = animated.attr( "class" ) || "",
			applyClassChange,
			allAnimations = o.children ? animated.find( "*" ).addBack() : animated;

		// Map the animated objects to store the original styles.
		allAnimations = allAnimations.map( function() {
			var el = $( this );
			return {
				el: el,
				start: getElementStyles( this )
			};
		} );

		// Apply class change
		applyClassChange = function() {
			$.each( classAnimationActions, function( i, action ) {
				if ( value[ action ] ) {
					animated[ action + "Class" ]( value[ action ] );
				}
			} );
		};
		applyClassChange();

		// Map all animated objects again - calculate new styles and diff
		allAnimations = allAnimations.map( function() {
			this.end = getElementStyles( this.el[ 0 ] );
			this.diff = styleDifference( this.start, this.end );
			return this;
		} );

		// Apply original class
		animated.attr( "class", baseClass );

		// Map all animated objects again - this time collecting a promise
		allAnimations = allAnimations.map( function() {
			var styleInfo = this,
				dfd = $.Deferred(),
				opts = $.extend( {}, o, {
					queue: false,
					complete: function() {
						dfd.resolve( styleInfo );
					}
				} );

			this.el.animate( this.diff, opts );
			return dfd.promise();
		} );

		// Once all animations have completed:
		$.when.apply( $, allAnimations.get() ).done( function() {

			// Set the final class
			applyClassChange();

			// For each animated element,
			// clear all css properties that were animated
			$.each( arguments, function() {
				var el = this.el;
				$.each( this.diff, function( key ) {
					el.css( key, "" );
				} );
			} );

			// This is guarnteed to be there if you use jQuery.speed()
			// it also handles dequeuing the next anim...
			o.complete.call( animated[ 0 ] );
		} );
	} );
};

$.fn.extend( {
	addClass: ( function( orig ) {
		return function( classNames, speed, easing, callback ) {
			return speed ?
				$.effects.animateClass.call( this,
					{ add: classNames }, speed, easing, callback ) :
				orig.apply( this, arguments );
		};
	} )( $.fn.addClass ),

	removeClass: ( function( orig ) {
		return function( classNames, speed, easing, callback ) {
			return arguments.length > 1 ?
				$.effects.animateClass.call( this,
					{ remove: classNames }, speed, easing, callback ) :
				orig.apply( this, arguments );
		};
	} )( $.fn.removeClass ),

	toggleClass: ( function( orig ) {
		return function( classNames, force, speed, easing, callback ) {
			if ( typeof force === "boolean" || force === undefined ) {
				if ( !speed ) {

					// Without speed parameter
					return orig.apply( this, arguments );
				} else {
					return $.effects.animateClass.call( this,
						( force ? { add: classNames } : { remove: classNames } ),
						speed, easing, callback );
				}
			} else {

				// Without force parameter
				return $.effects.animateClass.call( this,
					{ toggle: classNames }, force, speed, easing );
			}
		};
	} )( $.fn.toggleClass ),

	switchClass: function( remove, add, speed, easing, callback ) {
		return $.effects.animateClass.call( this, {
			add: add,
			remove: remove
		}, speed, easing, callback );
	}
} );

} )();

/******************************************************************************/
/*********************************** EFFECTS **********************************/
/******************************************************************************/

( function() {

if ( $.expr && $.expr.filters && $.expr.filters.animated ) {
	$.expr.filters.animated = ( function( orig ) {
		return function( elem ) {
			return !!$( elem ).data( dataSpaceAnimated ) || orig( elem );
		};
	} )( $.expr.filters.animated );
}

if ( $.uiBackCompat !== false ) {
	$.extend( $.effects, {

		// Saves a set of properties in a data storage
		save: function( element, set ) {
			var i = 0, length = set.length;
			for ( ; i < length; i++ ) {
				if ( set[ i ] !== null ) {
					element.data( dataSpace + set[ i ], element[ 0 ].style[ set[ i ] ] );
				}
			}
		},

		// Restores a set of previously saved properties from a data storage
		restore: function( element, set ) {
			var val, i = 0, length = set.length;
			for ( ; i < length; i++ ) {
				if ( set[ i ] !== null ) {
					val = element.data( dataSpace + set[ i ] );
					element.css( set[ i ], val );
				}
			}
		},

		setMode: function( el, mode ) {
			if ( mode === "toggle" ) {
				mode = el.is( ":hidden" ) ? "show" : "hide";
			}
			return mode;
		},

		// Wraps the element around a wrapper that copies position properties
		createWrapper: function( element ) {

			// If the element is already wrapped, return it
			if ( element.parent().is( ".ui-effects-wrapper" ) ) {
				return element.parent();
			}

			// Wrap the element
			var props = {
					width: element.outerWidth( true ),
					height: element.outerHeight( true ),
					"float": element.css( "float" )
				},
				wrapper = $( "<div></div>" )
					.addClass( "ui-effects-wrapper" )
					.css( {
						fontSize: "100%",
						background: "transparent",
						border: "none",
						margin: 0,
						padding: 0
					} ),

				// Store the size in case width/height are defined in % - Fixes #5245
				size = {
					width: element.width(),
					height: element.height()
				},
				active = document.activeElement;

			// Support: Firefox
			// Firefox incorrectly exposes anonymous content
			// https://bugzilla.mozilla.org/show_bug.cgi?id=561664
			try {
				active.id;
			} catch ( e ) {
				active = document.body;
			}

			element.wrap( wrapper );

			// Fixes #7595 - Elements lose focus when wrapped.
			if ( element[ 0 ] === active || $.contains( element[ 0 ], active ) ) {
				$( active ).trigger( "focus" );
			}

			// Hotfix for jQuery 1.4 since some change in wrap() seems to actually
			// lose the reference to the wrapped element
			wrapper = element.parent();

			// Transfer positioning properties to the wrapper
			if ( element.css( "position" ) === "static" ) {
				wrapper.css( { position: "relative" } );
				element.css( { position: "relative" } );
			} else {
				$.extend( props, {
					position: element.css( "position" ),
					zIndex: element.css( "z-index" )
				} );
				$.each( [ "top", "left", "bottom", "right" ], function( i, pos ) {
					props[ pos ] = element.css( pos );
					if ( isNaN( parseInt( props[ pos ], 10 ) ) ) {
						props[ pos ] = "auto";
					}
				} );
				element.css( {
					position: "relative",
					top: 0,
					left: 0,
					right: "auto",
					bottom: "auto"
				} );
			}
			element.css( size );

			return wrapper.css( props ).show();
		},

		removeWrapper: function( element ) {
			var active = document.activeElement;

			if ( element.parent().is( ".ui-effects-wrapper" ) ) {
				element.parent().replaceWith( element );

				// Fixes #7595 - Elements lose focus when wrapped.
				if ( element[ 0 ] === active || $.contains( element[ 0 ], active ) ) {
					$( active ).trigger( "focus" );
				}
			}

			return element;
		}
	} );
}

$.extend( $.effects, {
	version: "1.12.1",

	define: function( name, mode, effect ) {
		if ( !effect ) {
			effect = mode;
			mode = "effect";
		}

		$.effects.effect[ name ] = effect;
		$.effects.effect[ name ].mode = mode;

		return effect;
	},

	scaledDimensions: function( element, percent, direction ) {
		if ( percent === 0 ) {
			return {
				height: 0,
				width: 0,
				outerHeight: 0,
				outerWidth: 0
			};
		}

		var x = direction !== "horizontal" ? ( ( percent || 100 ) / 100 ) : 1,
			y = direction !== "vertical" ? ( ( percent || 100 ) / 100 ) : 1;

		return {
			height: element.height() * y,
			width: element.width() * x,
			outerHeight: element.outerHeight() * y,
			outerWidth: element.outerWidth() * x
		};

	},

	clipToBox: function( animation ) {
		return {
			width: animation.clip.right - animation.clip.left,
			height: animation.clip.bottom - animation.clip.top,
			left: animation.clip.left,
			top: animation.clip.top
		};
	},

	// Injects recently queued functions to be first in line (after "inprogress")
	unshift: function( element, queueLength, count ) {
		var queue = element.queue();

		if ( queueLength > 1 ) {
			queue.splice.apply( queue,
				[ 1, 0 ].concat( queue.splice( queueLength, count ) ) );
		}
		element.dequeue();
	},

	saveStyle: function( element ) {
		element.data( dataSpaceStyle, element[ 0 ].style.cssText );
	},

	restoreStyle: function( element ) {
		element[ 0 ].style.cssText = element.data( dataSpaceStyle ) || "";
		element.removeData( dataSpaceStyle );
	},

	mode: function( element, mode ) {
		var hidden = element.is( ":hidden" );

		if ( mode === "toggle" ) {
			mode = hidden ? "show" : "hide";
		}
		if ( hidden ? mode === "hide" : mode === "show" ) {
			mode = "none";
		}
		return mode;
	},

	// Translates a [top,left] array into a baseline value
	getBaseline: function( origin, original ) {
		var y, x;

		switch ( origin[ 0 ] ) {
		case "top":
			y = 0;
			break;
		case "middle":
			y = 0.5;
			break;
		case "bottom":
			y = 1;
			break;
		default:
			y = origin[ 0 ] / original.height;
		}

		switch ( origin[ 1 ] ) {
		case "left":
			x = 0;
			break;
		case "center":
			x = 0.5;
			break;
		case "right":
			x = 1;
			break;
		default:
			x = origin[ 1 ] / original.width;
		}

		return {
			x: x,
			y: y
		};
	},

	// Creates a placeholder element so that the original element can be made absolute
	createPlaceholder: function( element ) {
		var placeholder,
			cssPosition = element.css( "position" ),
			position = element.position();

		// Lock in margins first to account for form elements, which
		// will change margin if you explicitly set height
		// see: http://jsfiddle.net/JZSMt/3/ https://bugs.webkit.org/show_bug.cgi?id=107380
		// Support: Safari
		element.css( {
			marginTop: element.css( "marginTop" ),
			marginBottom: element.css( "marginBottom" ),
			marginLeft: element.css( "marginLeft" ),
			marginRight: element.css( "marginRight" )
		} )
		.outerWidth( element.outerWidth() )
		.outerHeight( element.outerHeight() );

		if ( /^(static|relative)/.test( cssPosition ) ) {
			cssPosition = "absolute";

			placeholder = $( "<" + element[ 0 ].nodeName + ">" ).insertAfter( element ).css( {

				// Convert inline to inline block to account for inline elements
				// that turn to inline block based on content (like img)
				display: /^(inline|ruby)/.test( element.css( "display" ) ) ?
					"inline-block" :
					"block",
				visibility: "hidden",

				// Margins need to be set to account for margin collapse
				marginTop: element.css( "marginTop" ),
				marginBottom: element.css( "marginBottom" ),
				marginLeft: element.css( "marginLeft" ),
				marginRight: element.css( "marginRight" ),
				"float": element.css( "float" )
			} )
			.outerWidth( element.outerWidth() )
			.outerHeight( element.outerHeight() )
			.addClass( "ui-effects-placeholder" );

			element.data( dataSpace + "placeholder", placeholder );
		}

		element.css( {
			position: cssPosition,
			left: position.left,
			top: position.top
		} );

		return placeholder;
	},

	removePlaceholder: function( element ) {
		var dataKey = dataSpace + "placeholder",
				placeholder = element.data( dataKey );

		if ( placeholder ) {
			placeholder.remove();
			element.removeData( dataKey );
		}
	},

	// Removes a placeholder if it exists and restores
	// properties that were modified during placeholder creation
	cleanUp: function( element ) {
		$.effects.restoreStyle( element );
		$.effects.removePlaceholder( element );
	},

	setTransition: function( element, list, factor, value ) {
		value = value || {};
		$.each( list, function( i, x ) {
			var unit = element.cssUnit( x );
			if ( unit[ 0 ] > 0 ) {
				value[ x ] = unit[ 0 ] * factor + unit[ 1 ];
			}
		} );
		return value;
	}
} );

// Return an effect options object for the given parameters:
function _normalizeArguments( effect, options, speed, callback ) {

	// Allow passing all options as the first parameter
	if ( $.isPlainObject( effect ) ) {
		options = effect;
		effect = effect.effect;
	}

	// Convert to an object
	effect = { effect: effect };

	// Catch (effect, null, ...)
	if ( options == null ) {
		options = {};
	}

	// Catch (effect, callback)
	if ( $.isFunction( options ) ) {
		callback = options;
		speed = null;
		options = {};
	}

	// Catch (effect, speed, ?)
	if ( typeof options === "number" || $.fx.speeds[ options ] ) {
		callback = speed;
		speed = options;
		options = {};
	}

	// Catch (effect, options, callback)
	if ( $.isFunction( speed ) ) {
		callback = speed;
		speed = null;
	}

	// Add options to effect
	if ( options ) {
		$.extend( effect, options );
	}

	speed = speed || options.duration;
	effect.duration = $.fx.off ? 0 :
		typeof speed === "number" ? speed :
		speed in $.fx.speeds ? $.fx.speeds[ speed ] :
		$.fx.speeds._default;

	effect.complete = callback || options.complete;

	return effect;
}

function standardAnimationOption( option ) {

	// Valid standard speeds (nothing, number, named speed)
	if ( !option || typeof option === "number" || $.fx.speeds[ option ] ) {
		return true;
	}

	// Invalid strings - treat as "normal" speed
	if ( typeof option === "string" && !$.effects.effect[ option ] ) {
		return true;
	}

	// Complete callback
	if ( $.isFunction( option ) ) {
		return true;
	}

	// Options hash (but not naming an effect)
	if ( typeof option === "object" && !option.effect ) {
		return true;
	}

	// Didn't match any standard API
	return false;
}

$.fn.extend( {
	effect: function( /* effect, options, speed, callback */ ) {
		var args = _normalizeArguments.apply( this, arguments ),
			effectMethod = $.effects.effect[ args.effect ],
			defaultMode = effectMethod.mode,
			queue = args.queue,
			queueName = queue || "fx",
			complete = args.complete,
			mode = args.mode,
			modes = [],
			prefilter = function( next ) {
				var el = $( this ),
					normalizedMode = $.effects.mode( el, mode ) || defaultMode;

				// Sentinel for duck-punching the :animated psuedo-selector
				el.data( dataSpaceAnimated, true );

				// Save effect mode for later use,
				// we can't just call $.effects.mode again later,
				// as the .show() below destroys the initial state
				modes.push( normalizedMode );

				// See $.uiBackCompat inside of run() for removal of defaultMode in 1.13
				if ( defaultMode && ( normalizedMode === "show" ||
						( normalizedMode === defaultMode && normalizedMode === "hide" ) ) ) {
					el.show();
				}

				if ( !defaultMode || normalizedMode !== "none" ) {
					$.effects.saveStyle( el );
				}

				if ( $.isFunction( next ) ) {
					next();
				}
			};

		if ( $.fx.off || !effectMethod ) {

			// Delegate to the original method (e.g., .show()) if possible
			if ( mode ) {
				return this[ mode ]( args.duration, complete );
			} else {
				return this.each( function() {
					if ( complete ) {
						complete.call( this );
					}
				} );
			}
		}

		function run( next ) {
			var elem = $( this );

			function cleanup() {
				elem.removeData( dataSpaceAnimated );

				$.effects.cleanUp( elem );

				if ( args.mode === "hide" ) {
					elem.hide();
				}

				done();
			}

			function done() {
				if ( $.isFunction( complete ) ) {
					complete.call( elem[ 0 ] );
				}

				if ( $.isFunction( next ) ) {
					next();
				}
			}

			// Override mode option on a per element basis,
			// as toggle can be either show or hide depending on element state
			args.mode = modes.shift();

			if ( $.uiBackCompat !== false && !defaultMode ) {
				if ( elem.is( ":hidden" ) ? mode === "hide" : mode === "show" ) {

					// Call the core method to track "olddisplay" properly
					elem[ mode ]();
					done();
				} else {
					effectMethod.call( elem[ 0 ], args, done );
				}
			} else {
				if ( args.mode === "none" ) {

					// Call the core method to track "olddisplay" properly
					elem[ mode ]();
					done();
				} else {
					effectMethod.call( elem[ 0 ], args, cleanup );
				}
			}
		}

		// Run prefilter on all elements first to ensure that
		// any showing or hiding happens before placeholder creation,
		// which ensures that any layout changes are correctly captured.
		return queue === false ?
			this.each( prefilter ).each( run ) :
			this.queue( queueName, prefilter ).queue( queueName, run );
	},

	show: ( function( orig ) {
		return function( option ) {
			if ( standardAnimationOption( option ) ) {
				return orig.apply( this, arguments );
			} else {
				var args = _normalizeArguments.apply( this, arguments );
				args.mode = "show";
				return this.effect.call( this, args );
			}
		};
	} )( $.fn.show ),

	hide: ( function( orig ) {
		return function( option ) {
			if ( standardAnimationOption( option ) ) {
				return orig.apply( this, arguments );
			} else {
				var args = _normalizeArguments.apply( this, arguments );
				args.mode = "hide";
				return this.effect.call( this, args );
			}
		};
	} )( $.fn.hide ),

	toggle: ( function( orig ) {
		return function( option ) {
			if ( standardAnimationOption( option ) || typeof option === "boolean" ) {
				return orig.apply( this, arguments );
			} else {
				var args = _normalizeArguments.apply( this, arguments );
				args.mode = "toggle";
				return this.effect.call( this, args );
			}
		};
	} )( $.fn.toggle ),

	cssUnit: function( key ) {
		var style = this.css( key ),
			val = [];

		$.each( [ "em", "px", "%", "pt" ], function( i, unit ) {
			if ( style.indexOf( unit ) > 0 ) {
				val = [ parseFloat( style ), unit ];
			}
		} );
		return val;
	},

	cssClip: function( clipObj ) {
		if ( clipObj ) {
			return this.css( "clip", "rect(" + clipObj.top + "px " + clipObj.right + "px " +
				clipObj.bottom + "px " + clipObj.left + "px)" );
		}
		return parseClip( this.css( "clip" ), this );
	},

	transfer: function( options, done ) {
		var element = $( this ),
			target = $( options.to ),
			targetFixed = target.css( "position" ) === "fixed",
			body = $( "body" ),
			fixTop = targetFixed ? body.scrollTop() : 0,
			fixLeft = targetFixed ? body.scrollLeft() : 0,
			endPosition = target.offset(),
			animation = {
				top: endPosition.top - fixTop,
				left: endPosition.left - fixLeft,
				height: target.innerHeight(),
				width: target.innerWidth()
			},
			startPosition = element.offset(),
			transfer = $( "<div class='ui-effects-transfer'></div>" )
				.appendTo( "body" )
				.addClass( options.className )
				.css( {
					top: startPosition.top - fixTop,
					left: startPosition.left - fixLeft,
					height: element.innerHeight(),
					width: element.innerWidth(),
					position: targetFixed ? "fixed" : "absolute"
				} )
				.animate( animation, options.duration, options.easing, function() {
					transfer.remove();
					if ( $.isFunction( done ) ) {
						done();
					}
				} );
	}
} );

function parseClip( str, element ) {
		var outerWidth = element.outerWidth(),
			outerHeight = element.outerHeight(),
			clipRegex = /^rect\((-?\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-?\d+%|auto),?\s*(-?\d*\.?\d*px|-?\d+%|auto)\)$/,
			values = clipRegex.exec( str ) || [ "", 0, outerWidth, outerHeight, 0 ];

		return {
			top: parseFloat( values[ 1 ] ) || 0,
			right: values[ 2 ] === "auto" ? outerWidth : parseFloat( values[ 2 ] ),
			bottom: values[ 3 ] === "auto" ? outerHeight : parseFloat( values[ 3 ] ),
			left: parseFloat( values[ 4 ] ) || 0
		};
}

$.fx.step.clip = function( fx ) {
	if ( !fx.clipInit ) {
		fx.start = $( fx.elem ).cssClip();
		if ( typeof fx.end === "string" ) {
			fx.end = parseClip( fx.end, fx.elem );
		}
		fx.clipInit = true;
	}

	$( fx.elem ).cssClip( {
		top: fx.pos * ( fx.end.top - fx.start.top ) + fx.start.top,
		right: fx.pos * ( fx.end.right - fx.start.right ) + fx.start.right,
		bottom: fx.pos * ( fx.end.bottom - fx.start.bottom ) + fx.start.bottom,
		left: fx.pos * ( fx.end.left - fx.start.left ) + fx.start.left
	} );
};

} )();

/******************************************************************************/
/*********************************** EASING ***********************************/
/******************************************************************************/

( function() {

// Based on easing equations from Robert Penner (http://www.robertpenner.com/easing)

var baseEasings = {};

$.each( [ "Quad", "Cubic", "Quart", "Quint", "Expo" ], function( i, name ) {
	baseEasings[ name ] = function( p ) {
		return Math.pow( p, i + 2 );
	};
} );

$.extend( baseEasings, {
	Sine: function( p ) {
		return 1 - Math.cos( p * Math.PI / 2 );
	},
	Circ: function( p ) {
		return 1 - Math.sqrt( 1 - p * p );
	},
	Elastic: function( p ) {
		return p === 0 || p === 1 ? p :
			-Math.pow( 2, 8 * ( p - 1 ) ) * Math.sin( ( ( p - 1 ) * 80 - 7.5 ) * Math.PI / 15 );
	},
	Back: function( p ) {
		return p * p * ( 3 * p - 2 );
	},
	Bounce: function( p ) {
		var pow2,
			bounce = 4;

		while ( p < ( ( pow2 = Math.pow( 2, --bounce ) ) - 1 ) / 11 ) {}
		return 1 / Math.pow( 4, 3 - bounce ) - 7.5625 * Math.pow( ( pow2 * 3 - 2 ) / 22 - p, 2 );
	}
} );

$.each( baseEasings, function( name, easeIn ) {
	$.easing[ "easeIn" + name ] = easeIn;
	$.easing[ "easeOut" + name ] = function( p ) {
		return 1 - easeIn( 1 - p );
	};
	$.easing[ "easeInOut" + name ] = function( p ) {
		return p < 0.5 ?
			easeIn( p * 2 ) / 2 :
			1 - easeIn( p * -2 + 2 ) / 2;
	};
} );

} )();

var effect = $.effects;


/*!
 * jQuery UI Effects Blind 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Blind Effect
//>>group: Effects
//>>description: Blinds the element.
//>>docs: http://api.jqueryui.com/blind-effect/
//>>demos: http://jqueryui.com/effect/



var effectsEffectBlind = $.effects.define( "blind", "hide", function( options, done ) {
	var map = {
			up: [ "bottom", "top" ],
			vertical: [ "bottom", "top" ],
			down: [ "top", "bottom" ],
			left: [ "right", "left" ],
			horizontal: [ "right", "left" ],
			right: [ "left", "right" ]
		},
		element = $( this ),
		direction = options.direction || "up",
		start = element.cssClip(),
		animate = { clip: $.extend( {}, start ) },
		placeholder = $.effects.createPlaceholder( element );

	animate.clip[ map[ direction ][ 0 ] ] = animate.clip[ map[ direction ][ 1 ] ];

	if ( options.mode === "show" ) {
		element.cssClip( animate.clip );
		if ( placeholder ) {
			placeholder.css( $.effects.clipToBox( animate ) );
		}

		animate.clip = start;
	}

	if ( placeholder ) {
		placeholder.animate( $.effects.clipToBox( animate ), options.duration, options.easing );
	}

	element.animate( animate, {
		queue: false,
		duration: options.duration,
		easing: options.easing,
		complete: done
	} );
} );


/*!
 * jQuery UI Effects Bounce 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Bounce Effect
//>>group: Effects
//>>description: Bounces an element horizontally or vertically n times.
//>>docs: http://api.jqueryui.com/bounce-effect/
//>>demos: http://jqueryui.com/effect/



var effectsEffectBounce = $.effects.define( "bounce", function( options, done ) {
	var upAnim, downAnim, refValue,
		element = $( this ),

		// Defaults:
		mode = options.mode,
		hide = mode === "hide",
		show = mode === "show",
		direction = options.direction || "up",
		distance = options.distance,
		times = options.times || 5,

		// Number of internal animations
		anims = times * 2 + ( show || hide ? 1 : 0 ),
		speed = options.duration / anims,
		easing = options.easing,

		// Utility:
		ref = ( direction === "up" || direction === "down" ) ? "top" : "left",
		motion = ( direction === "up" || direction === "left" ),
		i = 0,

		queuelen = element.queue().length;

	$.effects.createPlaceholder( element );

	refValue = element.css( ref );

	// Default distance for the BIGGEST bounce is the outer Distance / 3
	if ( !distance ) {
		distance = element[ ref === "top" ? "outerHeight" : "outerWidth" ]() / 3;
	}

	if ( show ) {
		downAnim = { opacity: 1 };
		downAnim[ ref ] = refValue;

		// If we are showing, force opacity 0 and set the initial position
		// then do the "first" animation
		element
			.css( "opacity", 0 )
			.css( ref, motion ? -distance * 2 : distance * 2 )
			.animate( downAnim, speed, easing );
	}

	// Start at the smallest distance if we are hiding
	if ( hide ) {
		distance = distance / Math.pow( 2, times - 1 );
	}

	downAnim = {};
	downAnim[ ref ] = refValue;

	// Bounces up/down/left/right then back to 0 -- times * 2 animations happen here
	for ( ; i < times; i++ ) {
		upAnim = {};
		upAnim[ ref ] = ( motion ? "-=" : "+=" ) + distance;

		element
			.animate( upAnim, speed, easing )
			.animate( downAnim, speed, easing );

		distance = hide ? distance * 2 : distance / 2;
	}

	// Last Bounce when Hiding
	if ( hide ) {
		upAnim = { opacity: 0 };
		upAnim[ ref ] = ( motion ? "-=" : "+=" ) + distance;

		element.animate( upAnim, speed, easing );
	}

	element.queue( done );

	$.effects.unshift( element, queuelen, anims + 1 );
} );


/*!
 * jQuery UI Effects Clip 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Clip Effect
//>>group: Effects
//>>description: Clips the element on and off like an old TV.
//>>docs: http://api.jqueryui.com/clip-effect/
//>>demos: http://jqueryui.com/effect/



var effectsEffectClip = $.effects.define( "clip", "hide", function( options, done ) {
	var start,
		animate = {},
		element = $( this ),
		direction = options.direction || "vertical",
		both = direction === "both",
		horizontal = both || direction === "horizontal",
		vertical = both || direction === "vertical";

	start = element.cssClip();
	animate.clip = {
		top: vertical ? ( start.bottom - start.top ) / 2 : start.top,
		right: horizontal ? ( start.right - start.left ) / 2 : start.right,
		bottom: vertical ? ( start.bottom - start.top ) / 2 : start.bottom,
		left: horizontal ? ( start.right - start.left ) / 2 : start.left
	};

	$.effects.createPlaceholder( element );

	if ( options.mode === "show" ) {
		element.cssClip( animate.clip );
		animate.clip = start;
	}

	element.animate( animate, {
		queue: false,
		duration: options.duration,
		easing: options.easing,
		complete: done
	} );

} );


/*!
 * jQuery UI Effects Drop 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Drop Effect
//>>group: Effects
//>>description: Moves an element in one direction and hides it at the same time.
//>>docs: http://api.jqueryui.com/drop-effect/
//>>demos: http://jqueryui.com/effect/



var effectsEffectDrop = $.effects.define( "drop", "hide", function( options, done ) {

	var distance,
		element = $( this ),
		mode = options.mode,
		show = mode === "show",
		direction = options.direction || "left",
		ref = ( direction === "up" || direction === "down" ) ? "top" : "left",
		motion = ( direction === "up" || direction === "left" ) ? "-=" : "+=",
		oppositeMotion = ( motion === "+=" ) ? "-=" : "+=",
		animation = {
			opacity: 0
		};

	$.effects.createPlaceholder( element );

	distance = options.distance ||
		element[ ref === "top" ? "outerHeight" : "outerWidth" ]( true ) / 2;

	animation[ ref ] = motion + distance;

	if ( show ) {
		element.css( animation );

		animation[ ref ] = oppositeMotion + distance;
		animation.opacity = 1;
	}

	// Animate
	element.animate( animation, {
		queue: false,
		duration: options.duration,
		easing: options.easing,
		complete: done
	} );
} );


/*!
 * jQuery UI Effects Explode 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Explode Effect
//>>group: Effects
// jscs:disable maximumLineLength
//>>description: Explodes an element in all directions into n pieces. Implodes an element to its original wholeness.
// jscs:enable maximumLineLength
//>>docs: http://api.jqueryui.com/explode-effect/
//>>demos: http://jqueryui.com/effect/



var effectsEffectExplode = $.effects.define( "explode", "hide", function( options, done ) {

	var i, j, left, top, mx, my,
		rows = options.pieces ? Math.round( Math.sqrt( options.pieces ) ) : 3,
		cells = rows,
		element = $( this ),
		mode = options.mode,
		show = mode === "show",

		// Show and then visibility:hidden the element before calculating offset
		offset = element.show().css( "visibility", "hidden" ).offset(),

		// Width and height of a piece
		width = Math.ceil( element.outerWidth() / cells ),
		height = Math.ceil( element.outerHeight() / rows ),
		pieces = [];

	// Children animate complete:
	function childComplete() {
		pieces.push( this );
		if ( pieces.length === rows * cells ) {
			animComplete();
		}
	}

	// Clone the element for each row and cell.
	for ( i = 0; i < rows; i++ ) { // ===>
		top = offset.top + i * height;
		my = i - ( rows - 1 ) / 2;

		for ( j = 0; j < cells; j++ ) { // |||
			left = offset.left + j * width;
			mx = j - ( cells - 1 ) / 2;

			// Create a clone of the now hidden main element that will be absolute positioned
			// within a wrapper div off the -left and -top equal to size of our pieces
			element
				.clone()
				.appendTo( "body" )
				.wrap( "<div></div>" )
				.css( {
					position: "absolute",
					visibility: "visible",
					left: -j * width,
					top: -i * height
				} )

				// Select the wrapper - make it overflow: hidden and absolute positioned based on
				// where the original was located +left and +top equal to the size of pieces
				.parent()
					.addClass( "ui-effects-explode" )
					.css( {
						position: "absolute",
						overflow: "hidden",
						width: width,
						height: height,
						left: left + ( show ? mx * width : 0 ),
						top: top + ( show ? my * height : 0 ),
						opacity: show ? 0 : 1
					} )
					.animate( {
						left: left + ( show ? 0 : mx * width ),
						top: top + ( show ? 0 : my * height ),
						opacity: show ? 1 : 0
					}, options.duration || 500, options.easing, childComplete );
		}
	}

	function animComplete() {
		element.css( {
			visibility: "visible"
		} );
		$( pieces ).remove();
		done();
	}
} );


/*!
 * jQuery UI Effects Fade 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Fade Effect
//>>group: Effects
//>>description: Fades the element.
//>>docs: http://api.jqueryui.com/fade-effect/
//>>demos: http://jqueryui.com/effect/



var effectsEffectFade = $.effects.define( "fade", "toggle", function( options, done ) {
	var show = options.mode === "show";

	$( this )
		.css( "opacity", show ? 0 : 1 )
		.animate( {
			opacity: show ? 1 : 0
		}, {
			queue: false,
			duration: options.duration,
			easing: options.easing,
			complete: done
		} );
} );


/*!
 * jQuery UI Effects Fold 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Fold Effect
//>>group: Effects
//>>description: Folds an element first horizontally and then vertically.
//>>docs: http://api.jqueryui.com/fold-effect/
//>>demos: http://jqueryui.com/effect/



var effectsEffectFold = $.effects.define( "fold", "hide", function( options, done ) {

	// Create element
	var element = $( this ),
		mode = options.mode,
		show = mode === "show",
		hide = mode === "hide",
		size = options.size || 15,
		percent = /([0-9]+)%/.exec( size ),
		horizFirst = !!options.horizFirst,
		ref = horizFirst ? [ "right", "bottom" ] : [ "bottom", "right" ],
		duration = options.duration / 2,

		placeholder = $.effects.createPlaceholder( element ),

		start = element.cssClip(),
		animation1 = { clip: $.extend( {}, start ) },
		animation2 = { clip: $.extend( {}, start ) },

		distance = [ start[ ref[ 0 ] ], start[ ref[ 1 ] ] ],

		queuelen = element.queue().length;

	if ( percent ) {
		size = parseInt( percent[ 1 ], 10 ) / 100 * distance[ hide ? 0 : 1 ];
	}
	animation1.clip[ ref[ 0 ] ] = size;
	animation2.clip[ ref[ 0 ] ] = size;
	animation2.clip[ ref[ 1 ] ] = 0;

	if ( show ) {
		element.cssClip( animation2.clip );
		if ( placeholder ) {
			placeholder.css( $.effects.clipToBox( animation2 ) );
		}

		animation2.clip = start;
	}

	// Animate
	element
		.queue( function( next ) {
			if ( placeholder ) {
				placeholder
					.animate( $.effects.clipToBox( animation1 ), duration, options.easing )
					.animate( $.effects.clipToBox( animation2 ), duration, options.easing );
			}

			next();
		} )
		.animate( animation1, duration, options.easing )
		.animate( animation2, duration, options.easing )
		.queue( done );

	$.effects.unshift( element, queuelen, 4 );
} );


/*!
 * jQuery UI Effects Highlight 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Highlight Effect
//>>group: Effects
//>>description: Highlights the background of an element in a defined color for a custom duration.
//>>docs: http://api.jqueryui.com/highlight-effect/
//>>demos: http://jqueryui.com/effect/



var effectsEffectHighlight = $.effects.define( "highlight", "show", function( options, done ) {
	var element = $( this ),
		animation = {
			backgroundColor: element.css( "backgroundColor" )
		};

	if ( options.mode === "hide" ) {
		animation.opacity = 0;
	}

	$.effects.saveStyle( element );

	element
		.css( {
			backgroundImage: "none",
			backgroundColor: options.color || "#ffff99"
		} )
		.animate( animation, {
			queue: false,
			duration: options.duration,
			easing: options.easing,
			complete: done
		} );
} );


/*!
 * jQuery UI Effects Size 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Size Effect
//>>group: Effects
//>>description: Resize an element to a specified width and height.
//>>docs: http://api.jqueryui.com/size-effect/
//>>demos: http://jqueryui.com/effect/



var effectsEffectSize = $.effects.define( "size", function( options, done ) {

	// Create element
	var baseline, factor, temp,
		element = $( this ),

		// Copy for children
		cProps = [ "fontSize" ],
		vProps = [ "borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom" ],
		hProps = [ "borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight" ],

		// Set options
		mode = options.mode,
		restore = mode !== "effect",
		scale = options.scale || "both",
		origin = options.origin || [ "middle", "center" ],
		position = element.css( "position" ),
		pos = element.position(),
		original = $.effects.scaledDimensions( element ),
		from = options.from || original,
		to = options.to || $.effects.scaledDimensions( element, 0 );

	$.effects.createPlaceholder( element );

	if ( mode === "show" ) {
		temp = from;
		from = to;
		to = temp;
	}

	// Set scaling factor
	factor = {
		from: {
			y: from.height / original.height,
			x: from.width / original.width
		},
		to: {
			y: to.height / original.height,
			x: to.width / original.width
		}
	};

	// Scale the css box
	if ( scale === "box" || scale === "both" ) {

		// Vertical props scaling
		if ( factor.from.y !== factor.to.y ) {
			from = $.effects.setTransition( element, vProps, factor.from.y, from );
			to = $.effects.setTransition( element, vProps, factor.to.y, to );
		}

		// Horizontal props scaling
		if ( factor.from.x !== factor.to.x ) {
			from = $.effects.setTransition( element, hProps, factor.from.x, from );
			to = $.effects.setTransition( element, hProps, factor.to.x, to );
		}
	}

	// Scale the content
	if ( scale === "content" || scale === "both" ) {

		// Vertical props scaling
		if ( factor.from.y !== factor.to.y ) {
			from = $.effects.setTransition( element, cProps, factor.from.y, from );
			to = $.effects.setTransition( element, cProps, factor.to.y, to );
		}
	}

	// Adjust the position properties based on the provided origin points
	if ( origin ) {
		baseline = $.effects.getBaseline( origin, original );
		from.top = ( original.outerHeight - from.outerHeight ) * baseline.y + pos.top;
		from.left = ( original.outerWidth - from.outerWidth ) * baseline.x + pos.left;
		to.top = ( original.outerHeight - to.outerHeight ) * baseline.y + pos.top;
		to.left = ( original.outerWidth - to.outerWidth ) * baseline.x + pos.left;
	}
	element.css( from );

	// Animate the children if desired
	if ( scale === "content" || scale === "both" ) {

		vProps = vProps.concat( [ "marginTop", "marginBottom" ] ).concat( cProps );
		hProps = hProps.concat( [ "marginLeft", "marginRight" ] );

		// Only animate children with width attributes specified
		// TODO: is this right? should we include anything with css width specified as well
		element.find( "*[width]" ).each( function() {
			var child = $( this ),
				childOriginal = $.effects.scaledDimensions( child ),
				childFrom = {
					height: childOriginal.height * factor.from.y,
					width: childOriginal.width * factor.from.x,
					outerHeight: childOriginal.outerHeight * factor.from.y,
					outerWidth: childOriginal.outerWidth * factor.from.x
				},
				childTo = {
					height: childOriginal.height * factor.to.y,
					width: childOriginal.width * factor.to.x,
					outerHeight: childOriginal.height * factor.to.y,
					outerWidth: childOriginal.width * factor.to.x
				};

			// Vertical props scaling
			if ( factor.from.y !== factor.to.y ) {
				childFrom = $.effects.setTransition( child, vProps, factor.from.y, childFrom );
				childTo = $.effects.setTransition( child, vProps, factor.to.y, childTo );
			}

			// Horizontal props scaling
			if ( factor.from.x !== factor.to.x ) {
				childFrom = $.effects.setTransition( child, hProps, factor.from.x, childFrom );
				childTo = $.effects.setTransition( child, hProps, factor.to.x, childTo );
			}

			if ( restore ) {
				$.effects.saveStyle( child );
			}

			// Animate children
			child.css( childFrom );
			child.animate( childTo, options.duration, options.easing, function() {

				// Restore children
				if ( restore ) {
					$.effects.restoreStyle( child );
				}
			} );
		} );
	}

	// Animate
	element.animate( to, {
		queue: false,
		duration: options.duration,
		easing: options.easing,
		complete: function() {

			var offset = element.offset();

			if ( to.opacity === 0 ) {
				element.css( "opacity", from.opacity );
			}

			if ( !restore ) {
				element
					.css( "position", position === "static" ? "relative" : position )
					.offset( offset );

				// Need to save style here so that automatic style restoration
				// doesn't restore to the original styles from before the animation.
				$.effects.saveStyle( element );
			}

			done();
		}
	} );

} );


/*!
 * jQuery UI Effects Scale 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Scale Effect
//>>group: Effects
//>>description: Grows or shrinks an element and its content.
//>>docs: http://api.jqueryui.com/scale-effect/
//>>demos: http://jqueryui.com/effect/



var effectsEffectScale = $.effects.define( "scale", function( options, done ) {

	// Create element
	var el = $( this ),
		mode = options.mode,
		percent = parseInt( options.percent, 10 ) ||
			( parseInt( options.percent, 10 ) === 0 ? 0 : ( mode !== "effect" ? 0 : 100 ) ),

		newOptions = $.extend( true, {
			from: $.effects.scaledDimensions( el ),
			to: $.effects.scaledDimensions( el, percent, options.direction || "both" ),
			origin: options.origin || [ "middle", "center" ]
		}, options );

	// Fade option to support puff
	if ( options.fade ) {
		newOptions.from.opacity = 1;
		newOptions.to.opacity = 0;
	}

	$.effects.effect.size.call( this, newOptions, done );
} );


/*!
 * jQuery UI Effects Puff 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Puff Effect
//>>group: Effects
//>>description: Creates a puff effect by scaling the element up and hiding it at the same time.
//>>docs: http://api.jqueryui.com/puff-effect/
//>>demos: http://jqueryui.com/effect/



var effectsEffectPuff = $.effects.define( "puff", "hide", function( options, done ) {
	var newOptions = $.extend( true, {}, options, {
		fade: true,
		percent: parseInt( options.percent, 10 ) || 150
	} );

	$.effects.effect.scale.call( this, newOptions, done );
} );


/*!
 * jQuery UI Effects Pulsate 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Pulsate Effect
//>>group: Effects
//>>description: Pulsates an element n times by changing the opacity to zero and back.
//>>docs: http://api.jqueryui.com/pulsate-effect/
//>>demos: http://jqueryui.com/effect/



var effectsEffectPulsate = $.effects.define( "pulsate", "show", function( options, done ) {
	var element = $( this ),
		mode = options.mode,
		show = mode === "show",
		hide = mode === "hide",
		showhide = show || hide,

		// Showing or hiding leaves off the "last" animation
		anims = ( ( options.times || 5 ) * 2 ) + ( showhide ? 1 : 0 ),
		duration = options.duration / anims,
		animateTo = 0,
		i = 1,
		queuelen = element.queue().length;

	if ( show || !element.is( ":visible" ) ) {
		element.css( "opacity", 0 ).show();
		animateTo = 1;
	}

	// Anims - 1 opacity "toggles"
	for ( ; i < anims; i++ ) {
		element.animate( { opacity: animateTo }, duration, options.easing );
		animateTo = 1 - animateTo;
	}

	element.animate( { opacity: animateTo }, duration, options.easing );

	element.queue( done );

	$.effects.unshift( element, queuelen, anims + 1 );
} );


/*!
 * jQuery UI Effects Shake 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Shake Effect
//>>group: Effects
//>>description: Shakes an element horizontally or vertically n times.
//>>docs: http://api.jqueryui.com/shake-effect/
//>>demos: http://jqueryui.com/effect/



var effectsEffectShake = $.effects.define( "shake", function( options, done ) {

	var i = 1,
		element = $( this ),
		direction = options.direction || "left",
		distance = options.distance || 20,
		times = options.times || 3,
		anims = times * 2 + 1,
		speed = Math.round( options.duration / anims ),
		ref = ( direction === "up" || direction === "down" ) ? "top" : "left",
		positiveMotion = ( direction === "up" || direction === "left" ),
		animation = {},
		animation1 = {},
		animation2 = {},

		queuelen = element.queue().length;

	$.effects.createPlaceholder( element );

	// Animation
	animation[ ref ] = ( positiveMotion ? "-=" : "+=" ) + distance;
	animation1[ ref ] = ( positiveMotion ? "+=" : "-=" ) + distance * 2;
	animation2[ ref ] = ( positiveMotion ? "-=" : "+=" ) + distance * 2;

	// Animate
	element.animate( animation, speed, options.easing );

	// Shakes
	for ( ; i < times; i++ ) {
		element
			.animate( animation1, speed, options.easing )
			.animate( animation2, speed, options.easing );
	}

	element
		.animate( animation1, speed, options.easing )
		.animate( animation, speed / 2, options.easing )
		.queue( done );

	$.effects.unshift( element, queuelen, anims + 1 );
} );


/*!
 * jQuery UI Effects Slide 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Slide Effect
//>>group: Effects
//>>description: Slides an element in and out of the viewport.
//>>docs: http://api.jqueryui.com/slide-effect/
//>>demos: http://jqueryui.com/effect/



var effectsEffectSlide = $.effects.define( "slide", "show", function( options, done ) {
	var startClip, startRef,
		element = $( this ),
		map = {
			up: [ "bottom", "top" ],
			down: [ "top", "bottom" ],
			left: [ "right", "left" ],
			right: [ "left", "right" ]
		},
		mode = options.mode,
		direction = options.direction || "left",
		ref = ( direction === "up" || direction === "down" ) ? "top" : "left",
		positiveMotion = ( direction === "up" || direction === "left" ),
		distance = options.distance ||
			element[ ref === "top" ? "outerHeight" : "outerWidth" ]( true ),
		animation = {};

	$.effects.createPlaceholder( element );

	startClip = element.cssClip();
	startRef = element.position()[ ref ];

	// Define hide animation
	animation[ ref ] = ( positiveMotion ? -1 : 1 ) * distance + startRef;
	animation.clip = element.cssClip();
	animation.clip[ map[ direction ][ 1 ] ] = animation.clip[ map[ direction ][ 0 ] ];

	// Reverse the animation if we're showing
	if ( mode === "show" ) {
		element.cssClip( animation.clip );
		element.css( ref, animation[ ref ] );
		animation.clip = startClip;
		animation[ ref ] = startRef;
	}

	// Actually animate
	element.animate( animation, {
		queue: false,
		duration: options.duration,
		easing: options.easing,
		complete: done
	} );
} );


/*!
 * jQuery UI Effects Transfer 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Transfer Effect
//>>group: Effects
//>>description: Displays a transfer effect from one element to another.
//>>docs: http://api.jqueryui.com/transfer-effect/
//>>demos: http://jqueryui.com/effect/



var effect;
if ( $.uiBackCompat !== false ) {
	effect = $.effects.define( "transfer", function( options, done ) {
		$( this ).transfer( options, done );
	} );
}
var effectsEffectTransfer = effect;




}));
/*! lozad.js - v1.16.0 - 2020-09-10
* https://github.com/ApoorvSaxena/lozad.js
* Copyright (c) 2020 Apoorv Saxena; Licensed MIT */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.lozad=e()}(this,function(){"use strict";
/**
   * Detect IE browser
   * @const {boolean}
   * @private
   */var g="undefined"!=typeof document&&document.documentMode,v=function(t){return window&&window[t]},h=["data-iesrc","data-alt","data-src","data-srcset","data-background-image","data-toggle-class"],p={rootMargin:"0px",threshold:0,enableAutoReload:!1,load:function(t){if("picture"===t.nodeName.toLowerCase()){var e=t.querySelector("img"),r=!1;null===e&&(e=document.createElement("img"),r=!0),g&&t.getAttribute("data-iesrc")&&(e.src=t.getAttribute("data-iesrc")),t.getAttribute("data-alt")&&(e.alt=t.getAttribute("data-alt")),r&&t.append(e)}if("video"===t.nodeName.toLowerCase()&&!t.getAttribute("data-src")&&t.children){for(var a=t.children,o=void 0,i=0;i<=a.length-1;i++)(o=a[i].getAttribute("data-src"))&&(a[i].src=o);t.load()}t.getAttribute("data-poster")&&(t.poster=t.getAttribute("data-poster")),t.getAttribute("data-src")&&(t.src=t.getAttribute("data-src")),t.getAttribute("data-srcset")&&t.setAttribute("srcset",t.getAttribute("data-srcset"));var n=",";if(t.getAttribute("data-background-delimiter")&&(n=t.getAttribute("data-background-delimiter")),t.getAttribute("data-background-image"))t.style.backgroundImage="url('"+t.getAttribute("data-background-image").split(n).join("'),url('")+"')";else if(t.getAttribute("data-background-image-set")){var d=t.getAttribute("data-background-image-set").split(n),u=d[0].substr(0,d[0].indexOf(" "))||d[0];// Substring before ... 1x
u=-1===u.indexOf("url(")?"url("+u+")":u,1===d.length?t.style.backgroundImage=u:t.setAttribute("style",(t.getAttribute("style")||"")+"background-image: "+u+"; background-image: -webkit-image-set("+d+"); background-image: image-set("+d+")")}t.getAttribute("data-toggle-class")&&t.classList.toggle(t.getAttribute("data-toggle-class"))},loaded:function(){}};
/**
   *
   * @param {string} type
   *
   */function k(t){t.setAttribute("data-loaded",!0)}var y=function(t){return"true"===t.getAttribute("data-loaded")},w=function(t){var e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:document;return t instanceof Element?[t]:t instanceof NodeList?t:e.querySelectorAll(t)};return function(){var r,a,e,o=0<arguments.length&&void 0!==arguments[0]?arguments[0]:".lozad",t=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{},i=Object.assign({},p,t),n=i.root,d=i.rootMargin,u=i.threshold,g=i.enableAutoReload,s=i.load,c=i.loaded,l=void 0,b=void 0;v("IntersectionObserver")&&(l=new IntersectionObserver((r=s,a=c,function(t,e){t.forEach(function(t){(0<t.intersectionRatio||t.isIntersecting)&&(e.unobserve(t.target),y(t.target)||(r(t.target),k(t.target),a(t.target)))})}),{root:n,rootMargin:d,threshold:u})),v("MutationObserver")&&g&&(b=new MutationObserver((e=s,function(t){t.forEach(function(t){y(t.target)&&"attributes"===t.type&&-1<h.indexOf(t.attributeName)&&e(t.target)})})));for(var f,m=w(o,n),A=0;A<m.length;A++)(f=m[A]).getAttribute("data-placeholder-background")&&(f.style.background=f.getAttribute("data-placeholder-background"));return{observe:function(){for(var t=w(o,n),e=0;e<t.length;e++)y(t[e])||(l?(b&&g&&b.observe(t[e],{subtree:!0,attributes:!0,attributeFilter:h}),l.observe(t[e])):(s(t[e]),k(t[e]),c(t[e])))},triggerLoad:function(t){y(t)||(s(t),k(t),c(t))},observer:l,mutationObserver:b}}});

(function(factory){"use strict";if(typeof define==="function"&&define.amd){define(["jquery"],factory)}else if(typeof exports!=="undefined"){module.exports=factory(require("jquery"))}else{factory(jQuery)}})(function($){"use strict";var Slick=window.Slick||{};Slick=function(){var instanceUid=0;function Slick(element,settings){var _=this,dataSettings;_.defaults={accessibility:true,adaptiveHeight:false,appendArrows:$(element),appendDots:$(element),arrows:true,asNavFor:null,prevArrow:'<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',nextArrow:'<button class="slick-next" aria-label="Next" type="button">Next</button>',autoplay:false,autoplaySpeed:3e3,centerMode:false,centerPadding:"50px",cssEase:"ease",customPaging:function(slider,i){return $('<button type="button" />').text(i+1)},dots:false,dotsClass:"slick-dots",draggable:true,easing:"linear",edgeFriction:.35,fade:false,focusOnSelect:false,focusOnChange:false,infinite:true,initialSlide:0,lazyLoad:"ondemand",mobileFirst:false,pauseOnHover:true,pauseOnFocus:true,pauseOnDotsHover:false,respondTo:"window",responsive:null,rows:1,rtl:false,slide:"",slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:true,swipeToSlide:false,touchMove:true,touchThreshold:5,useCSS:true,useTransform:true,variableWidth:false,vertical:false,verticalSwiping:false,waitForAnimate:true,zIndex:1e3};_.initials={animating:false,dragging:false,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,scrolling:false,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:false,slideOffset:0,swipeLeft:null,swiping:false,$list:null,touchObject:{},transformsEnabled:false,unslicked:false};$.extend(_,_.initials);_.activeBreakpoint=null;_.animType=null;_.animProp=null;_.breakpoints=[];_.breakpointSettings=[];_.cssTransitions=false;_.focussed=false;_.interrupted=false;_.hidden="hidden";_.paused=true;_.positionProp=null;_.respondTo=null;_.rowCount=1;_.shouldClick=true;_.$slider=$(element);_.$slidesCache=null;_.transformType=null;_.transitionType=null;_.visibilityChange="visibilitychange";_.windowWidth=0;_.windowTimer=null;dataSettings=$(element).data("slick")||{};_.options=$.extend({},_.defaults,settings,dataSettings);_.currentSlide=_.options.initialSlide;_.originalSettings=_.options;if(typeof document.mozHidden!=="undefined"){_.hidden="mozHidden";_.visibilityChange="mozvisibilitychange"}else if(typeof document.webkitHidden!=="undefined"){_.hidden="webkitHidden";_.visibilityChange="webkitvisibilitychange"}_.autoPlay=$.proxy(_.autoPlay,_);_.autoPlayClear=$.proxy(_.autoPlayClear,_);_.autoPlayIterator=$.proxy(_.autoPlayIterator,_);_.changeSlide=$.proxy(_.changeSlide,_);_.clickHandler=$.proxy(_.clickHandler,_);_.selectHandler=$.proxy(_.selectHandler,_);_.setPosition=$.proxy(_.setPosition,_);_.swipeHandler=$.proxy(_.swipeHandler,_);_.dragHandler=$.proxy(_.dragHandler,_);_.keyHandler=$.proxy(_.keyHandler,_);_.instanceUid=instanceUid++;_.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/;_.registerBreakpoints();_.init(true)}return Slick}();Slick.prototype.activateADA=function(){var _=this;_.$slideTrack.find(".slick-active").attr({"aria-hidden":"false"}).find("a, input, button, select").attr({tabindex:"0"})};Slick.prototype.addSlide=Slick.prototype.slickAdd=function(markup,index,addBefore){var _=this;if(typeof index==="boolean"){addBefore=index;index=null}else if(index<0||index>=_.slideCount){return false}_.unload();if(typeof index==="number"){if(index===0&&_.$slides.length===0){$(markup).appendTo(_.$slideTrack)}else if(addBefore){$(markup).insertBefore(_.$slides.eq(index))}else{$(markup).insertAfter(_.$slides.eq(index))}}else{if(addBefore===true){$(markup).prependTo(_.$slideTrack)}else{$(markup).appendTo(_.$slideTrack)}}_.$slides=_.$slideTrack.children(this.options.slide);_.$slideTrack.children(this.options.slide).detach();_.$slideTrack.append(_.$slides);_.$slides.each(function(index,element){$(element).attr("data-slick-index",index)});_.$slidesCache=_.$slides;_.reinit()};Slick.prototype.animateHeight=function(){var _=this;if(_.options.slidesToShow===1&&_.options.adaptiveHeight===true&&_.options.vertical===false){var targetHeight=_.$slides.eq(_.currentSlide).outerHeight(true);_.$list.animate({height:targetHeight},_.options.speed)}};Slick.prototype.animateSlide=function(targetLeft,callback){var animProps={},_=this;_.animateHeight();if(_.options.rtl===true&&_.options.vertical===false){targetLeft=-targetLeft}if(_.transformsEnabled===false){if(_.options.vertical===false){_.$slideTrack.animate({left:targetLeft},_.options.speed,_.options.easing,callback)}else{_.$slideTrack.animate({top:targetLeft},_.options.speed,_.options.easing,callback)}}else{if(_.cssTransitions===false){if(_.options.rtl===true){_.currentLeft=-_.currentLeft}$({animStart:_.currentLeft}).animate({animStart:targetLeft},{duration:_.options.speed,easing:_.options.easing,step:function(now){now=Math.ceil(now);if(_.options.vertical===false){animProps[_.animType]="translate("+now+"px, 0px)";_.$slideTrack.css(animProps)}else{animProps[_.animType]="translate(0px,"+now+"px)";_.$slideTrack.css(animProps)}},complete:function(){if(callback){callback.call()}}})}else{_.applyTransition();targetLeft=Math.ceil(targetLeft);if(_.options.vertical===false){animProps[_.animType]="translate3d("+targetLeft+"px, 0px, 0px)"}else{animProps[_.animType]="translate3d(0px,"+targetLeft+"px, 0px)"}_.$slideTrack.css(animProps);if(callback){setTimeout(function(){_.disableTransition();callback.call()},_.options.speed)}}}};Slick.prototype.getNavTarget=function(){var _=this,asNavFor=_.options.asNavFor;if(asNavFor&&asNavFor!==null){asNavFor=$(asNavFor).not(_.$slider)}return asNavFor};Slick.prototype.asNavFor=function(index){var _=this,asNavFor=_.getNavTarget();if(asNavFor!==null&&typeof asNavFor==="object"){asNavFor.each(function(){var target=$(this).slick("getSlick");if(!target.unslicked){target.slideHandler(index,true)}})}};Slick.prototype.applyTransition=function(slide){var _=this,transition={};if(_.options.fade===false){transition[_.transitionType]=_.transformType+" "+_.options.speed+"ms "+_.options.cssEase}else{transition[_.transitionType]="opacity "+_.options.speed+"ms "+_.options.cssEase}if(_.options.fade===false){_.$slideTrack.css(transition)}else{_.$slides.eq(slide).css(transition)}};Slick.prototype.autoPlay=function(){var _=this;_.autoPlayClear();if(_.slideCount>_.options.slidesToShow){_.autoPlayTimer=setInterval(_.autoPlayIterator,_.options.autoplaySpeed)}};Slick.prototype.autoPlayClear=function(){var _=this;if(_.autoPlayTimer){clearInterval(_.autoPlayTimer)}};Slick.prototype.autoPlayIterator=function(){var _=this,slideTo=_.currentSlide+_.options.slidesToScroll;if(!_.paused&&!_.interrupted&&!_.focussed){if(_.options.infinite===false){if(_.direction===1&&_.currentSlide+1===_.slideCount-1){_.direction=0}else if(_.direction===0){slideTo=_.currentSlide-_.options.slidesToScroll;if(_.currentSlide-1===0){_.direction=1}}}_.slideHandler(slideTo)}};Slick.prototype.buildArrows=function(){var _=this;if(_.options.arrows===true){_.$prevArrow=$(_.options.prevArrow).addClass("slick-arrow");_.$nextArrow=$(_.options.nextArrow).addClass("slick-arrow");if(_.slideCount>_.options.slidesToShow){_.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex");_.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex");if(_.htmlExpr.test(_.options.prevArrow)){_.$prevArrow.prependTo(_.options.appendArrows)}if(_.htmlExpr.test(_.options.nextArrow)){_.$nextArrow.appendTo(_.options.appendArrows)}if(_.options.infinite!==true){_.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true")}}else{_.$prevArrow.add(_.$nextArrow).addClass("slick-hidden").attr({"aria-disabled":"true",tabindex:"-1"})}}};Slick.prototype.buildDots=function(){var _=this,i,dot;if(_.options.dots===true&&_.slideCount>_.options.slidesToShow){_.$slider.addClass("slick-dotted");dot=$("<ul />").addClass(_.options.dotsClass);for(i=0;i<=_.getDotCount();i+=1){dot.append($("<li />").append(_.options.customPaging.call(this,_,i)))}_.$dots=dot.appendTo(_.options.appendDots);_.$dots.find("li").first().addClass("slick-active")}};Slick.prototype.buildOut=function(){var _=this;_.$slides=_.$slider.children(_.options.slide+":not(.slick-cloned)").addClass("slick-slide");_.slideCount=_.$slides.length;_.$slides.each(function(index,element){$(element).attr("data-slick-index",index).data("originalStyling",$(element).attr("style")||"")});_.$slider.addClass("slick-slider");_.$slideTrack=_.slideCount===0?$('<div class="slick-track"/>').appendTo(_.$slider):_.$slides.wrapAll('<div class="slick-track"/>').parent();_.$list=_.$slideTrack.wrap('<div class="slick-list"/>').parent();_.$slideTrack.css("opacity",0);if(_.options.centerMode===true||_.options.swipeToSlide===true){_.options.slidesToScroll=1}$("img[data-lazy]",_.$slider).not("[src]").addClass("slick-loading");_.setupInfinite();_.buildArrows();_.buildDots();_.updateDots();_.setSlideClasses(typeof _.currentSlide==="number"?_.currentSlide:0);if(_.options.draggable===true){_.$list.addClass("draggable")}};Slick.prototype.buildRows=function(){var _=this,a,b,c,newSlides,numOfSlides,originalSlides,slidesPerSection;newSlides=document.createDocumentFragment();originalSlides=_.$slider.children();if(_.options.rows>0){slidesPerSection=_.options.slidesPerRow*_.options.rows;numOfSlides=Math.ceil(originalSlides.length/slidesPerSection);for(a=0;a<numOfSlides;a++){var slide=document.createElement("div");for(b=0;b<_.options.rows;b++){var row=document.createElement("div");for(c=0;c<_.options.slidesPerRow;c++){var target=a*slidesPerSection+(b*_.options.slidesPerRow+c);if(originalSlides.get(target)){row.appendChild(originalSlides.get(target))}}slide.appendChild(row)}newSlides.appendChild(slide)}_.$slider.empty().append(newSlides);_.$slider.children().children().children().css({width:100/_.options.slidesPerRow+"%",display:"inline-block"})}};Slick.prototype.checkResponsive=function(initial,forceUpdate){var _=this,breakpoint,targetBreakpoint,respondToWidth,triggerBreakpoint=false;var sliderWidth=_.$slider.width();var windowWidth=window.innerWidth||$(window).width();if(_.respondTo==="window"){respondToWidth=windowWidth}else if(_.respondTo==="slider"){respondToWidth=sliderWidth}else if(_.respondTo==="min"){respondToWidth=Math.min(windowWidth,sliderWidth)}if(_.options.responsive&&_.options.responsive.length&&_.options.responsive!==null){targetBreakpoint=null;for(breakpoint in _.breakpoints){if(_.breakpoints.hasOwnProperty(breakpoint)){if(_.originalSettings.mobileFirst===false){if(respondToWidth<_.breakpoints[breakpoint]){targetBreakpoint=_.breakpoints[breakpoint]}}else{if(respondToWidth>_.breakpoints[breakpoint]){targetBreakpoint=_.breakpoints[breakpoint]}}}}if(targetBreakpoint!==null){if(_.activeBreakpoint!==null){if(targetBreakpoint!==_.activeBreakpoint||forceUpdate){_.activeBreakpoint=targetBreakpoint;if(_.breakpointSettings[targetBreakpoint]==="unslick"){_.unslick(targetBreakpoint)}else{_.options=$.extend({},_.originalSettings,_.breakpointSettings[targetBreakpoint]);if(initial===true){_.currentSlide=_.options.initialSlide}_.refresh(initial)}triggerBreakpoint=targetBreakpoint}}else{_.activeBreakpoint=targetBreakpoint;if(_.breakpointSettings[targetBreakpoint]==="unslick"){_.unslick(targetBreakpoint)}else{_.options=$.extend({},_.originalSettings,_.breakpointSettings[targetBreakpoint]);if(initial===true){_.currentSlide=_.options.initialSlide}_.refresh(initial)}triggerBreakpoint=targetBreakpoint}}else{if(_.activeBreakpoint!==null){_.activeBreakpoint=null;_.options=_.originalSettings;if(initial===true){_.currentSlide=_.options.initialSlide}_.refresh(initial);triggerBreakpoint=targetBreakpoint}}if(!initial&&triggerBreakpoint!==false){_.$slider.trigger("breakpoint",[_,triggerBreakpoint])}}};Slick.prototype.changeSlide=function(event,dontAnimate){var _=this,$target=$(event.currentTarget),indexOffset,slideOffset,unevenOffset;if($target.is("a")){event.preventDefault()}if(!$target.is("li")){$target=$target.closest("li")}unevenOffset=_.slideCount%_.options.slidesToScroll!==0;indexOffset=unevenOffset?0:(_.slideCount-_.currentSlide)%_.options.slidesToScroll;switch(event.data.message){case"previous":slideOffset=indexOffset===0?_.options.slidesToScroll:_.options.slidesToShow-indexOffset;if(_.slideCount>_.options.slidesToShow){_.slideHandler(_.currentSlide-slideOffset,false,dontAnimate)}break;case"next":slideOffset=indexOffset===0?_.options.slidesToScroll:indexOffset;if(_.slideCount>_.options.slidesToShow){_.slideHandler(_.currentSlide+slideOffset,false,dontAnimate)}break;case"index":var index=event.data.index===0?0:event.data.index||$target.index()*_.options.slidesToScroll;_.slideHandler(_.checkNavigable(index),false,dontAnimate);$target.children().trigger("focus");break;default:return}};Slick.prototype.checkNavigable=function(index){var _=this,navigables,prevNavigable;navigables=_.getNavigableIndexes();prevNavigable=0;if(index>navigables[navigables.length-1]){index=navigables[navigables.length-1]}else{for(var n in navigables){if(index<navigables[n]){index=prevNavigable;break}prevNavigable=navigables[n]}}return index};Slick.prototype.cleanUpEvents=function(){var _=this;if(_.options.dots&&_.$dots!==null){$("li",_.$dots).off("click.slick",_.changeSlide).off("mouseenter.slick",$.proxy(_.interrupt,_,true)).off("mouseleave.slick",$.proxy(_.interrupt,_,false));if(_.options.accessibility===true){_.$dots.off("keydown.slick",_.keyHandler)}}_.$slider.off("focus.slick blur.slick");if(_.options.arrows===true&&_.slideCount>_.options.slidesToShow){_.$prevArrow&&_.$prevArrow.off("click.slick",_.changeSlide);_.$nextArrow&&_.$nextArrow.off("click.slick",_.changeSlide);if(_.options.accessibility===true){_.$prevArrow&&_.$prevArrow.off("keydown.slick",_.keyHandler);_.$nextArrow&&_.$nextArrow.off("keydown.slick",_.keyHandler)}}_.$list.off("touchstart.slick mousedown.slick",_.swipeHandler);_.$list.off("touchmove.slick mousemove.slick",_.swipeHandler);_.$list.off("touchend.slick mouseup.slick",_.swipeHandler);_.$list.off("touchcancel.slick mouseleave.slick",_.swipeHandler);_.$list.off("click.slick",_.clickHandler);$(document).off(_.visibilityChange,_.visibility);_.cleanUpSlideEvents();if(_.options.accessibility===true){_.$list.off("keydown.slick",_.keyHandler)}if(_.options.focusOnSelect===true){$(_.$slideTrack).children().off("click.slick",_.selectHandler)}$(window).off("orientationchange.slick.slick-"+_.instanceUid,_.orientationChange);$(window).off("resize.slick.slick-"+_.instanceUid,_.resize);$("[draggable!=true]",_.$slideTrack).off("dragstart",_.preventDefault);$(window).off("load.slick.slick-"+_.instanceUid,_.setPosition)};Slick.prototype.cleanUpSlideEvents=function(){var _=this;_.$list.off("mouseenter.slick",$.proxy(_.interrupt,_,true));_.$list.off("mouseleave.slick",$.proxy(_.interrupt,_,false))};Slick.prototype.cleanUpRows=function(){var _=this,originalSlides;if(_.options.rows>0){originalSlides=_.$slides.children().children();originalSlides.removeAttr("style");_.$slider.empty().append(originalSlides)}};Slick.prototype.clickHandler=function(event){var _=this;if(_.shouldClick===false){event.stopImmediatePropagation();event.stopPropagation();event.preventDefault()}};Slick.prototype.destroy=function(refresh){var _=this;_.autoPlayClear();_.touchObject={};_.cleanUpEvents();$(".slick-cloned",_.$slider).detach();if(_.$dots){_.$dots.remove()}if(_.$prevArrow&&_.$prevArrow.length){_.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display","");if(_.htmlExpr.test(_.options.prevArrow)){_.$prevArrow.remove()}}if(_.$nextArrow&&_.$nextArrow.length){_.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display","");if(_.htmlExpr.test(_.options.nextArrow)){_.$nextArrow.remove()}}if(_.$slides){_.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function(){$(this).attr("style",$(this).data("originalStyling"))});_.$slideTrack.children(this.options.slide).detach();_.$slideTrack.detach();_.$list.detach();_.$slider.append(_.$slides)}_.cleanUpRows();_.$slider.removeClass("slick-slider");_.$slider.removeClass("slick-initialized");_.$slider.removeClass("slick-dotted");_.unslicked=true;if(!refresh){_.$slider.trigger("destroy",[_])}};Slick.prototype.disableTransition=function(slide){var _=this,transition={};transition[_.transitionType]="";if(_.options.fade===false){_.$slideTrack.css(transition)}else{_.$slides.eq(slide).css(transition)}};Slick.prototype.fadeSlide=function(slideIndex,callback){var _=this;if(_.cssTransitions===false){_.$slides.eq(slideIndex).css({zIndex:_.options.zIndex});_.$slides.eq(slideIndex).animate({opacity:1},_.options.speed,_.options.easing,callback)}else{_.applyTransition(slideIndex);_.$slides.eq(slideIndex).css({opacity:1,zIndex:_.options.zIndex});if(callback){setTimeout(function(){_.disableTransition(slideIndex);callback.call()},_.options.speed)}}};Slick.prototype.fadeSlideOut=function(slideIndex){var _=this;if(_.cssTransitions===false){_.$slides.eq(slideIndex).animate({opacity:0,zIndex:_.options.zIndex-2},_.options.speed,_.options.easing)}else{_.applyTransition(slideIndex);_.$slides.eq(slideIndex).css({opacity:0,zIndex:_.options.zIndex-2})}};Slick.prototype.filterSlides=Slick.prototype.slickFilter=function(filter){var _=this;if(filter!==null){_.$slidesCache=_.$slides;_.unload();_.$slideTrack.children(this.options.slide).detach();_.$slidesCache.filter(filter).appendTo(_.$slideTrack);_.reinit()}};Slick.prototype.focusHandler=function(){var _=this;_.$slider.off("focus.slick blur.slick").on("focus.slick","*",function(event){var $sf=$(this);setTimeout(function(){if(_.options.pauseOnFocus){if($sf.is(":focus")){_.focussed=true;_.autoPlay()}}},0)}).on("blur.slick","*",function(event){var $sf=$(this);if(_.options.pauseOnFocus){_.focussed=false;_.autoPlay()}})};Slick.prototype.getCurrent=Slick.prototype.slickCurrentSlide=function(){var _=this;return _.currentSlide};Slick.prototype.getDotCount=function(){var _=this;var breakPoint=0;var counter=0;var pagerQty=0;if(_.options.infinite===true){if(_.slideCount<=_.options.slidesToShow){++pagerQty}else{while(breakPoint<_.slideCount){++pagerQty;breakPoint=counter+_.options.slidesToScroll;counter+=_.options.slidesToScroll<=_.options.slidesToShow?_.options.slidesToScroll:_.options.slidesToShow}}}else if(_.options.centerMode===true){pagerQty=_.slideCount}else if(!_.options.asNavFor){pagerQty=1+Math.ceil((_.slideCount-_.options.slidesToShow)/_.options.slidesToScroll)}else{while(breakPoint<_.slideCount){++pagerQty;breakPoint=counter+_.options.slidesToScroll;counter+=_.options.slidesToScroll<=_.options.slidesToShow?_.options.slidesToScroll:_.options.slidesToShow}}return pagerQty-1};Slick.prototype.getLeft=function(slideIndex){var _=this,targetLeft,verticalHeight,verticalOffset=0,targetSlide,coef;_.slideOffset=0;verticalHeight=_.$slides.first().outerHeight(true);if(_.options.infinite===true){if(_.slideCount>_.options.slidesToShow){_.slideOffset=_.slideWidth*_.options.slidesToShow*-1;coef=-1;if(_.options.vertical===true&&_.options.centerMode===true){if(_.options.slidesToShow===2){coef=-1.5}else if(_.options.slidesToShow===1){coef=-2}}verticalOffset=verticalHeight*_.options.slidesToShow*coef}if(_.slideCount%_.options.slidesToScroll!==0){if(slideIndex+_.options.slidesToScroll>_.slideCount&&_.slideCount>_.options.slidesToShow){if(slideIndex>_.slideCount){_.slideOffset=(_.options.slidesToShow-(slideIndex-_.slideCount))*_.slideWidth*-1;verticalOffset=(_.options.slidesToShow-(slideIndex-_.slideCount))*verticalHeight*-1}else{_.slideOffset=_.slideCount%_.options.slidesToScroll*_.slideWidth*-1;verticalOffset=_.slideCount%_.options.slidesToScroll*verticalHeight*-1}}}}else{if(slideIndex+_.options.slidesToShow>_.slideCount){_.slideOffset=(slideIndex+_.options.slidesToShow-_.slideCount)*_.slideWidth;verticalOffset=(slideIndex+_.options.slidesToShow-_.slideCount)*verticalHeight}}if(_.slideCount<=_.options.slidesToShow){_.slideOffset=0;verticalOffset=0}if(_.options.centerMode===true&&_.slideCount<=_.options.slidesToShow){_.slideOffset=_.slideWidth*Math.floor(_.options.slidesToShow)/2-_.slideWidth*_.slideCount/2}else if(_.options.centerMode===true&&_.options.infinite===true){_.slideOffset+=_.slideWidth*Math.floor(_.options.slidesToShow/2)-_.slideWidth}else if(_.options.centerMode===true){_.slideOffset=0;_.slideOffset+=_.slideWidth*Math.floor(_.options.slidesToShow/2)}if(_.options.vertical===false){targetLeft=slideIndex*_.slideWidth*-1+_.slideOffset}else{targetLeft=slideIndex*verticalHeight*-1+verticalOffset}if(_.options.variableWidth===true){if(_.slideCount<=_.options.slidesToShow||_.options.infinite===false){targetSlide=_.$slideTrack.children(".slick-slide").eq(slideIndex)}else{targetSlide=_.$slideTrack.children(".slick-slide").eq(slideIndex+_.options.slidesToShow)}if(_.options.rtl===true){if(targetSlide[0]){targetLeft=(_.$slideTrack.width()-targetSlide[0].offsetLeft-targetSlide.width())*-1}else{targetLeft=0}}else{targetLeft=targetSlide[0]?targetSlide[0].offsetLeft*-1:0}if(_.options.centerMode===true){if(_.slideCount<=_.options.slidesToShow||_.options.infinite===false){targetSlide=_.$slideTrack.children(".slick-slide").eq(slideIndex)}else{targetSlide=_.$slideTrack.children(".slick-slide").eq(slideIndex+_.options.slidesToShow+1)}if(_.options.rtl===true){if(targetSlide[0]){targetLeft=(_.$slideTrack.width()-targetSlide[0].offsetLeft-targetSlide.width())*-1}else{targetLeft=0}}else{targetLeft=targetSlide[0]?targetSlide[0].offsetLeft*-1:0}targetLeft+=(_.$list.width()-targetSlide.outerWidth())/2}}return targetLeft};Slick.prototype.getOption=Slick.prototype.slickGetOption=function(option){var _=this;return _.options[option]};Slick.prototype.getNavigableIndexes=function(){var _=this,breakPoint=0,counter=0,indexes=[],max;if(_.options.infinite===false){max=_.slideCount}else{breakPoint=_.options.slidesToScroll*-1;counter=_.options.slidesToScroll*-1;max=_.slideCount*2}while(breakPoint<max){indexes.push(breakPoint);breakPoint=counter+_.options.slidesToScroll;counter+=_.options.slidesToScroll<=_.options.slidesToShow?_.options.slidesToScroll:_.options.slidesToShow}return indexes};Slick.prototype.getSlick=function(){return this};Slick.prototype.getSlideCount=function(){var _=this,slidesTraversed,swipedSlide,swipeTarget,centerOffset;centerOffset=_.options.centerMode===true?Math.floor(_.$list.width()/2):0;swipeTarget=_.swipeLeft*-1+centerOffset;if(_.options.swipeToSlide===true){_.$slideTrack.find(".slick-slide").each(function(index,slide){var slideOuterWidth,slideOffset,slideRightBoundary;slideOuterWidth=$(slide).outerWidth();slideOffset=slide.offsetLeft;if(_.options.centerMode!==true){slideOffset+=slideOuterWidth/2}slideRightBoundary=slideOffset+slideOuterWidth;if(swipeTarget<slideRightBoundary){swipedSlide=slide;return false}});slidesTraversed=Math.abs($(swipedSlide).attr("data-slick-index")-_.currentSlide)||1;return slidesTraversed}else{return _.options.slidesToScroll}};Slick.prototype.goTo=Slick.prototype.slickGoTo=function(slide,dontAnimate){var _=this;_.changeSlide({data:{message:"index",index:parseInt(slide)}},dontAnimate)};Slick.prototype.init=function(creation){var _=this;if(!$(_.$slider).hasClass("slick-initialized")){$(_.$slider).addClass("slick-initialized");_.buildRows();_.buildOut();_.setProps();_.startLoad();_.loadSlider();_.initializeEvents();_.updateArrows();_.updateDots();_.checkResponsive(true);_.focusHandler()}if(creation){_.$slider.trigger("init",[_])}if(_.options.accessibility===true){_.initADA()}if(_.options.autoplay){_.paused=false;_.autoPlay()}};Slick.prototype.initADA=function(){var _=this,numDotGroups=Math.ceil(_.slideCount/_.options.slidesToShow),tabControlIndexes=_.getNavigableIndexes().filter(function(val){return val>=0&&val<_.slideCount});_.$slides.add(_.$slideTrack.find(".slick-cloned")).attr({"aria-hidden":"true",tabindex:"-1"}).find("a, input, button, select").attr({tabindex:"-1"});if(_.$dots!==null){_.$slides.not(_.$slideTrack.find(".slick-cloned")).each(function(i){var slideControlIndex=tabControlIndexes.indexOf(i);$(this).attr({role:"tabpanel",id:"slick-slide"+_.instanceUid+i,tabindex:-1});if(slideControlIndex!==-1){var ariaButtonControl="slick-slide-control"+_.instanceUid+slideControlIndex;if($("#"+ariaButtonControl).length){$(this).attr({"aria-describedby":ariaButtonControl})}}});_.$dots.attr("role","tablist").find("li").each(function(i){var mappedSlideIndex=tabControlIndexes[i];$(this).attr({role:"presentation"});$(this).find("button").first().attr({role:"tab",id:"slick-slide-control"+_.instanceUid+i,"aria-controls":"slick-slide"+_.instanceUid+mappedSlideIndex,"aria-label":i+1+" of "+numDotGroups,"aria-selected":null,tabindex:"-1"})}).eq(_.currentSlide).find("button").attr({"aria-selected":"true",tabindex:"0"}).end()}for(var i=_.currentSlide,max=i+_.options.slidesToShow;i<max;i++){if(_.options.focusOnChange){_.$slides.eq(i).attr({tabindex:"0"})}else{_.$slides.eq(i).removeAttr("tabindex")}}_.activateADA()};Slick.prototype.initArrowEvents=function(){var _=this;if(_.options.arrows===true&&_.slideCount>_.options.slidesToShow){_.$prevArrow.off("click.slick").on("click.slick",{message:"previous"},_.changeSlide);_.$nextArrow.off("click.slick").on("click.slick",{message:"next"},_.changeSlide);if(_.options.accessibility===true){_.$prevArrow.on("keydown.slick",_.keyHandler);_.$nextArrow.on("keydown.slick",_.keyHandler)}}};Slick.prototype.initDotEvents=function(){var _=this;if(_.options.dots===true&&_.slideCount>_.options.slidesToShow){$("li",_.$dots).on("click.slick",{message:"index"},_.changeSlide);if(_.options.accessibility===true){_.$dots.on("keydown.slick",_.keyHandler)}}if(_.options.dots===true&&_.options.pauseOnDotsHover===true&&_.slideCount>_.options.slidesToShow){$("li",_.$dots).on("mouseenter.slick",$.proxy(_.interrupt,_,true)).on("mouseleave.slick",$.proxy(_.interrupt,_,false))}};Slick.prototype.initSlideEvents=function(){var _=this;if(_.options.pauseOnHover){_.$list.on("mouseenter.slick",$.proxy(_.interrupt,_,true));_.$list.on("mouseleave.slick",$.proxy(_.interrupt,_,false))}};Slick.prototype.initializeEvents=function(){var _=this;_.initArrowEvents();_.initDotEvents();_.initSlideEvents();_.$list.on("touchstart.slick mousedown.slick",{action:"start"},_.swipeHandler);_.$list.on("touchmove.slick mousemove.slick",{action:"move"},_.swipeHandler);_.$list.on("touchend.slick mouseup.slick",{action:"end"},_.swipeHandler);_.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},_.swipeHandler);_.$list.on("click.slick",_.clickHandler);$(document).on(_.visibilityChange,$.proxy(_.visibility,_));if(_.options.accessibility===true){_.$list.on("keydown.slick",_.keyHandler)}if(_.options.focusOnSelect===true){$(_.$slideTrack).children().on("click.slick",_.selectHandler)}$(window).on("orientationchange.slick.slick-"+_.instanceUid,$.proxy(_.orientationChange,_));$(window).on("resize.slick.slick-"+_.instanceUid,$.proxy(_.resize,_));$("[draggable!=true]",_.$slideTrack).on("dragstart",_.preventDefault);$(window).on("load.slick.slick-"+_.instanceUid,_.setPosition);$(_.setPosition)};Slick.prototype.initUI=function(){var _=this;if(_.options.arrows===true&&_.slideCount>_.options.slidesToShow){_.$prevArrow.show();_.$nextArrow.show()}if(_.options.dots===true&&_.slideCount>_.options.slidesToShow){_.$dots.show()}};Slick.prototype.keyHandler=function(event){var _=this;if(!event.target.tagName.match("TEXTAREA|INPUT|SELECT")){if(event.keyCode===37&&_.options.accessibility===true){_.changeSlide({data:{message:_.options.rtl===true?"next":"previous"}})}else if(event.keyCode===39&&_.options.accessibility===true){_.changeSlide({data:{message:_.options.rtl===true?"previous":"next"}})}}};Slick.prototype.lazyLoad=function(){var _=this,loadRange,cloneRange,rangeStart,rangeEnd;function loadImages(imagesScope){$("img[data-lazy]",imagesScope).each(function(){var image=$(this),imageSource=$(this).attr("data-lazy"),imageSrcSet=$(this).attr("data-srcset"),imageSizes=$(this).attr("data-sizes")||_.$slider.attr("data-sizes"),imageToLoad=document.createElement("img");imageToLoad.onload=function(){image.animate({opacity:0},100,function(){if(imageSrcSet){image.attr("srcset",imageSrcSet);if(imageSizes){image.attr("sizes",imageSizes)}}image.attr("src",imageSource).animate({opacity:1},200,function(){image.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")});_.$slider.trigger("lazyLoaded",[_,image,imageSource])})};imageToLoad.onerror=function(){image.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error");_.$slider.trigger("lazyLoadError",[_,image,imageSource])};imageToLoad.src=imageSource})}if(_.options.centerMode===true){if(_.options.infinite===true){rangeStart=_.currentSlide+(_.options.slidesToShow/2+1);rangeEnd=rangeStart+_.options.slidesToShow+2}else{rangeStart=Math.max(0,_.currentSlide-(_.options.slidesToShow/2+1));rangeEnd=2+(_.options.slidesToShow/2+1)+_.currentSlide}}else{rangeStart=_.options.infinite?_.options.slidesToShow+_.currentSlide:_.currentSlide;rangeEnd=Math.ceil(rangeStart+_.options.slidesToShow);if(_.options.fade===true){if(rangeStart>0)rangeStart--;if(rangeEnd<=_.slideCount)rangeEnd++}}loadRange=_.$slider.find(".slick-slide").slice(rangeStart,rangeEnd);if(_.options.lazyLoad==="anticipated"){var prevSlide=rangeStart-1,nextSlide=rangeEnd,$slides=_.$slider.find(".slick-slide");for(var i=0;i<_.options.slidesToScroll;i++){if(prevSlide<0)prevSlide=_.slideCount-1;loadRange=loadRange.add($slides.eq(prevSlide));loadRange=loadRange.add($slides.eq(nextSlide));prevSlide--;nextSlide++}}loadImages(loadRange);if(_.slideCount<=_.options.slidesToShow){cloneRange=_.$slider.find(".slick-slide");loadImages(cloneRange)}else if(_.currentSlide>=_.slideCount-_.options.slidesToShow){cloneRange=_.$slider.find(".slick-cloned").slice(0,_.options.slidesToShow);loadImages(cloneRange)}else if(_.currentSlide===0){cloneRange=_.$slider.find(".slick-cloned").slice(_.options.slidesToShow*-1);loadImages(cloneRange)}};Slick.prototype.loadSlider=function(){var _=this;_.setPosition();_.$slideTrack.css({opacity:1});_.$slider.removeClass("slick-loading");_.initUI();if(_.options.lazyLoad==="progressive"){_.progressiveLazyLoad()}};Slick.prototype.next=Slick.prototype.slickNext=function(){var _=this;_.changeSlide({data:{message:"next"}})};Slick.prototype.orientationChange=function(){var _=this;_.checkResponsive();_.setPosition()};Slick.prototype.pause=Slick.prototype.slickPause=function(){var _=this;_.autoPlayClear();_.paused=true};Slick.prototype.play=Slick.prototype.slickPlay=function(){var _=this;_.autoPlay();_.options.autoplay=true;_.paused=false;_.focussed=false;_.interrupted=false};Slick.prototype.postSlide=function(index){var _=this;if(!_.unslicked){_.$slider.trigger("afterChange",[_,index]);_.animating=false;if(_.slideCount>_.options.slidesToShow){_.setPosition()}_.swipeLeft=null;if(_.options.autoplay){_.autoPlay()}if(_.options.accessibility===true){_.initADA();if(_.options.focusOnChange){var $currentSlide=$(_.$slides.get(_.currentSlide));$currentSlide.attr("tabindex",0).focus()}}}};Slick.prototype.prev=Slick.prototype.slickPrev=function(){var _=this;_.changeSlide({data:{message:"previous"}})};Slick.prototype.preventDefault=function(event){event.preventDefault()};Slick.prototype.progressiveLazyLoad=function(tryCount){tryCount=tryCount||1;var _=this,$imgsToLoad=$("img[data-lazy]",_.$slider),image,imageSource,imageSrcSet,imageSizes,imageToLoad;if($imgsToLoad.length){image=$imgsToLoad.first();imageSource=image.attr("data-lazy");imageSrcSet=image.attr("data-srcset");imageSizes=image.attr("data-sizes")||_.$slider.attr("data-sizes");imageToLoad=document.createElement("img");imageToLoad.onload=function(){if(imageSrcSet){image.attr("srcset",imageSrcSet);if(imageSizes){image.attr("sizes",imageSizes)}}image.attr("src",imageSource).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading");if(_.options.adaptiveHeight===true){_.setPosition()}_.$slider.trigger("lazyLoaded",[_,image,imageSource]);_.progressiveLazyLoad()};imageToLoad.onerror=function(){if(tryCount<3){setTimeout(function(){_.progressiveLazyLoad(tryCount+1)},500)}else{image.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error");_.$slider.trigger("lazyLoadError",[_,image,imageSource]);_.progressiveLazyLoad()}};imageToLoad.src=imageSource}else{_.$slider.trigger("allImagesLoaded",[_])}};Slick.prototype.refresh=function(initializing){var _=this,currentSlide,lastVisibleIndex;lastVisibleIndex=_.slideCount-_.options.slidesToShow;if(!_.options.infinite&&_.currentSlide>lastVisibleIndex){_.currentSlide=lastVisibleIndex}if(_.slideCount<=_.options.slidesToShow){_.currentSlide=0}currentSlide=_.currentSlide;_.destroy(true);$.extend(_,_.initials,{currentSlide:currentSlide});_.init();if(!initializing){_.changeSlide({data:{message:"index",index:currentSlide}},false)}};Slick.prototype.registerBreakpoints=function(){var _=this,breakpoint,currentBreakpoint,l,responsiveSettings=_.options.responsive||null;if($.type(responsiveSettings)==="array"&&responsiveSettings.length){_.respondTo=_.options.respondTo||"window";for(breakpoint in responsiveSettings){l=_.breakpoints.length-1;if(responsiveSettings.hasOwnProperty(breakpoint)){currentBreakpoint=responsiveSettings[breakpoint].breakpoint;while(l>=0){if(_.breakpoints[l]&&_.breakpoints[l]===currentBreakpoint){_.breakpoints.splice(l,1)}l--}_.breakpoints.push(currentBreakpoint);_.breakpointSettings[currentBreakpoint]=responsiveSettings[breakpoint].settings}}_.breakpoints.sort(function(a,b){return _.options.mobileFirst?a-b:b-a})}};Slick.prototype.reinit=function(){var _=this;_.$slides=_.$slideTrack.children(_.options.slide).addClass("slick-slide");_.slideCount=_.$slides.length;if(_.currentSlide>=_.slideCount&&_.currentSlide!==0){_.currentSlide=_.currentSlide-_.options.slidesToScroll}if(_.slideCount<=_.options.slidesToShow){_.currentSlide=0}_.registerBreakpoints();_.setProps();_.setupInfinite();_.buildArrows();_.updateArrows();_.initArrowEvents();_.buildDots();_.updateDots();_.initDotEvents();_.cleanUpSlideEvents();_.initSlideEvents();_.checkResponsive(false,true);if(_.options.focusOnSelect===true){$(_.$slideTrack).children().on("click.slick",_.selectHandler)}_.setSlideClasses(typeof _.currentSlide==="number"?_.currentSlide:0);_.setPosition();_.focusHandler();_.paused=!_.options.autoplay;_.autoPlay();_.$slider.trigger("reInit",[_])};Slick.prototype.resize=function(){var _=this;if($(window).width()!==_.windowWidth){clearTimeout(_.windowDelay);_.windowDelay=window.setTimeout(function(){_.windowWidth=$(window).width();_.checkResponsive();if(!_.unslicked){_.setPosition()}},50)}};Slick.prototype.removeSlide=Slick.prototype.slickRemove=function(index,removeBefore,removeAll){var _=this;if(typeof index==="boolean"){removeBefore=index;index=removeBefore===true?0:_.slideCount-1}else{index=removeBefore===true?--index:index}if(_.slideCount<1||index<0||index>_.slideCount-1){return false}_.unload();if(removeAll===true){_.$slideTrack.children().remove()}else{_.$slideTrack.children(this.options.slide).eq(index).remove()}_.$slides=_.$slideTrack.children(this.options.slide);_.$slideTrack.children(this.options.slide).detach();_.$slideTrack.append(_.$slides);_.$slidesCache=_.$slides;_.reinit()};Slick.prototype.setCSS=function(position){var _=this,positionProps={},x,y;if(_.options.rtl===true){position=-position}x=_.positionProp=="left"?Math.ceil(position)+"px":"0px";y=_.positionProp=="top"?Math.ceil(position)+"px":"0px";positionProps[_.positionProp]=position;if(_.transformsEnabled===false){_.$slideTrack.css(positionProps)}else{positionProps={};if(_.cssTransitions===false){positionProps[_.animType]="translate("+x+", "+y+")";_.$slideTrack.css(positionProps)}else{positionProps[_.animType]="translate3d("+x+", "+y+", 0px)";_.$slideTrack.css(positionProps)}}};Slick.prototype.setDimensions=function(){var _=this;if(_.options.vertical===false){if(_.options.centerMode===true){_.$list.css({padding:"0px "+_.options.centerPadding})}}else{_.$list.height(_.$slides.first().outerHeight(true)*_.options.slidesToShow);if(_.options.centerMode===true){_.$list.css({padding:_.options.centerPadding+" 0px"})}}_.listWidth=_.$list.width();_.listHeight=_.$list.height();if(_.options.vertical===false&&_.options.variableWidth===false){_.slideWidth=Math.ceil(_.listWidth/_.options.slidesToShow);_.$slideTrack.width(Math.ceil(_.slideWidth*_.$slideTrack.children(".slick-slide").length))}else if(_.options.variableWidth===true){_.$slideTrack.width(5e3*_.slideCount)}else{_.slideWidth=Math.ceil(_.listWidth);_.$slideTrack.height(Math.ceil(_.$slides.first().outerHeight(true)*_.$slideTrack.children(".slick-slide").length))}var offset=_.$slides.first().outerWidth(true)-_.$slides.first().width();if(_.options.variableWidth===false)_.$slideTrack.children(".slick-slide").width(_.slideWidth-offset)};Slick.prototype.setFade=function(){var _=this,targetLeft;_.$slides.each(function(index,element){targetLeft=_.slideWidth*index*-1;if(_.options.rtl===true){$(element).css({position:"relative",right:targetLeft,top:0,zIndex:_.options.zIndex-2,opacity:0})}else{$(element).css({position:"relative",left:targetLeft,top:0,zIndex:_.options.zIndex-2,opacity:0})}});_.$slides.eq(_.currentSlide).css({zIndex:_.options.zIndex-1,opacity:1})};Slick.prototype.setHeight=function(){var _=this;if(_.options.slidesToShow===1&&_.options.adaptiveHeight===true&&_.options.vertical===false){var targetHeight=_.$slides.eq(_.currentSlide).outerHeight(true);_.$list.css("height",targetHeight)}};Slick.prototype.setOption=Slick.prototype.slickSetOption=function(){var _=this,l,item,option,value,refresh=false,type;if($.type(arguments[0])==="object"){option=arguments[0];refresh=arguments[1];type="multiple"}else if($.type(arguments[0])==="string"){option=arguments[0];value=arguments[1];refresh=arguments[2];if(arguments[0]==="responsive"&&$.type(arguments[1])==="array"){type="responsive"}else if(typeof arguments[1]!=="undefined"){type="single"}}if(type==="single"){_.options[option]=value}else if(type==="multiple"){$.each(option,function(opt,val){_.options[opt]=val})}else if(type==="responsive"){for(item in value){if($.type(_.options.responsive)!=="array"){_.options.responsive=[value[item]]}else{l=_.options.responsive.length-1;while(l>=0){if(_.options.responsive[l].breakpoint===value[item].breakpoint){_.options.responsive.splice(l,1)}l--}_.options.responsive.push(value[item])}}}if(refresh){_.unload();_.reinit()}};Slick.prototype.setPosition=function(){var _=this;_.setDimensions();_.setHeight();if(_.options.fade===false){_.setCSS(_.getLeft(_.currentSlide))}else{_.setFade()}_.$slider.trigger("setPosition",[_])};Slick.prototype.setProps=function(){var _=this,bodyStyle=document.body.style;_.positionProp=_.options.vertical===true?"top":"left";if(_.positionProp==="top"){_.$slider.addClass("slick-vertical")}else{_.$slider.removeClass("slick-vertical")}if(bodyStyle.WebkitTransition!==undefined||bodyStyle.MozTransition!==undefined||bodyStyle.msTransition!==undefined){if(_.options.useCSS===true){_.cssTransitions=true}}if(_.options.fade){if(typeof _.options.zIndex==="number"){if(_.options.zIndex<3){_.options.zIndex=3}}else{_.options.zIndex=_.defaults.zIndex}}if(bodyStyle.OTransform!==undefined){_.animType="OTransform";_.transformType="-o-transform";_.transitionType="OTransition";if(bodyStyle.perspectiveProperty===undefined&&bodyStyle.webkitPerspective===undefined)_.animType=false}if(bodyStyle.MozTransform!==undefined){_.animType="MozTransform";_.transformType="-moz-transform";_.transitionType="MozTransition";if(bodyStyle.perspectiveProperty===undefined&&bodyStyle.MozPerspective===undefined)_.animType=false}if(bodyStyle.webkitTransform!==undefined){_.animType="webkitTransform";_.transformType="-webkit-transform";_.transitionType="webkitTransition";if(bodyStyle.perspectiveProperty===undefined&&bodyStyle.webkitPerspective===undefined)_.animType=false}if(bodyStyle.msTransform!==undefined){_.animType="msTransform";_.transformType="-ms-transform";_.transitionType="msTransition";if(bodyStyle.msTransform===undefined)_.animType=false}if(bodyStyle.transform!==undefined&&_.animType!==false){_.animType="transform";_.transformType="transform";_.transitionType="transition"}_.transformsEnabled=_.options.useTransform&&(_.animType!==null&&_.animType!==false)};Slick.prototype.setSlideClasses=function(index){var _=this,centerOffset,allSlides,indexOffset,remainder;allSlides=_.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden","true");_.$slides.eq(index).addClass("slick-current");if(_.options.centerMode===true){var evenCoef=_.options.slidesToShow%2===0?1:0;centerOffset=Math.floor(_.options.slidesToShow/2);if(_.options.infinite===true){if(index>=centerOffset&&index<=_.slideCount-1-centerOffset){_.$slides.slice(index-centerOffset+evenCoef,index+centerOffset+1).addClass("slick-active").attr("aria-hidden","false")}else{indexOffset=_.options.slidesToShow+index;allSlides.slice(indexOffset-centerOffset+1+evenCoef,indexOffset+centerOffset+2).addClass("slick-active").attr("aria-hidden","false")}if(index===0){allSlides.eq(allSlides.length-1-_.options.slidesToShow).addClass("slick-center")}else if(index===_.slideCount-1){allSlides.eq(_.options.slidesToShow).addClass("slick-center")}}_.$slides.eq(index).addClass("slick-center")}else{if(index>=0&&index<=_.slideCount-_.options.slidesToShow){_.$slides.slice(index,index+_.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false")}else if(allSlides.length<=_.options.slidesToShow){allSlides.addClass("slick-active").attr("aria-hidden","false")}else{remainder=_.slideCount%_.options.slidesToShow;indexOffset=_.options.infinite===true?_.options.slidesToShow+index:index;if(_.options.slidesToShow==_.options.slidesToScroll&&_.slideCount-index<_.options.slidesToShow){allSlides.slice(indexOffset-(_.options.slidesToShow-remainder),indexOffset+remainder).addClass("slick-active").attr("aria-hidden","false")}else{allSlides.slice(indexOffset,indexOffset+_.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false")}}}if(_.options.lazyLoad==="ondemand"||_.options.lazyLoad==="anticipated"){_.lazyLoad()}};Slick.prototype.setupInfinite=function(){var _=this,i,slideIndex,infiniteCount;if(_.options.fade===true){_.options.centerMode=false}if(_.options.infinite===true&&_.options.fade===false){slideIndex=null;if(_.slideCount>_.options.slidesToShow){if(_.options.centerMode===true){infiniteCount=_.options.slidesToShow+1}else{infiniteCount=_.options.slidesToShow}for(i=_.slideCount;i>_.slideCount-infiniteCount;i-=1){slideIndex=i-1;$(_.$slides[slideIndex]).clone(true).attr("id","").attr("data-slick-index",slideIndex-_.slideCount).prependTo(_.$slideTrack).addClass("slick-cloned")}for(i=0;i<infiniteCount+_.slideCount;i+=1){slideIndex=i;$(_.$slides[slideIndex]).clone(true).attr("id","").attr("data-slick-index",slideIndex+_.slideCount).appendTo(_.$slideTrack).addClass("slick-cloned")}_.$slideTrack.find(".slick-cloned").find("[id]").each(function(){$(this).attr("id","")})}}};Slick.prototype.interrupt=function(toggle){var _=this;if(!toggle){_.autoPlay()}_.interrupted=toggle};Slick.prototype.selectHandler=function(event){var _=this;var targetElement=$(event.target).is(".slick-slide")?$(event.target):$(event.target).parents(".slick-slide");var index=parseInt(targetElement.attr("data-slick-index"));if(!index)index=0;if(_.slideCount<=_.options.slidesToShow){_.slideHandler(index,false,true);return}_.slideHandler(index)};Slick.prototype.slideHandler=function(index,sync,dontAnimate){var targetSlide,animSlide,oldSlide,slideLeft,targetLeft=null,_=this,navTarget;sync=sync||false;if(_.animating===true&&_.options.waitForAnimate===true){return}if(_.options.fade===true&&_.currentSlide===index){return}if(sync===false){_.asNavFor(index)}targetSlide=index;targetLeft=_.getLeft(targetSlide);slideLeft=_.getLeft(_.currentSlide);_.currentLeft=_.swipeLeft===null?slideLeft:_.swipeLeft;if(_.options.infinite===false&&_.options.centerMode===false&&(index<0||index>_.getDotCount()*_.options.slidesToScroll)){if(_.options.fade===false){targetSlide=_.currentSlide;if(dontAnimate!==true&&_.slideCount>_.options.slidesToShow){_.animateSlide(slideLeft,function(){_.postSlide(targetSlide)})}else{_.postSlide(targetSlide)}}return}else if(_.options.infinite===false&&_.options.centerMode===true&&(index<0||index>_.slideCount-_.options.slidesToScroll)){if(_.options.fade===false){targetSlide=_.currentSlide;if(dontAnimate!==true&&_.slideCount>_.options.slidesToShow){_.animateSlide(slideLeft,function(){_.postSlide(targetSlide)})}else{_.postSlide(targetSlide)}}return}if(_.options.autoplay){clearInterval(_.autoPlayTimer)}if(targetSlide<0){if(_.slideCount%_.options.slidesToScroll!==0){animSlide=_.slideCount-_.slideCount%_.options.slidesToScroll}else{animSlide=_.slideCount+targetSlide}}else if(targetSlide>=_.slideCount){if(_.slideCount%_.options.slidesToScroll!==0){animSlide=0}else{animSlide=targetSlide-_.slideCount}}else{animSlide=targetSlide}_.animating=true;_.$slider.trigger("beforeChange",[_,_.currentSlide,animSlide]);oldSlide=_.currentSlide;_.currentSlide=animSlide;_.setSlideClasses(_.currentSlide);if(_.options.asNavFor){navTarget=_.getNavTarget();navTarget=navTarget.slick("getSlick");if(navTarget.slideCount<=navTarget.options.slidesToShow){navTarget.setSlideClasses(_.currentSlide)}}_.updateDots();_.updateArrows();if(_.options.fade===true){if(dontAnimate!==true){_.fadeSlideOut(oldSlide);_.fadeSlide(animSlide,function(){_.postSlide(animSlide)})}else{_.postSlide(animSlide)}_.animateHeight();return}if(dontAnimate!==true&&_.slideCount>_.options.slidesToShow){_.animateSlide(targetLeft,function(){_.postSlide(animSlide)})}else{_.postSlide(animSlide)}};Slick.prototype.startLoad=function(){var _=this;if(_.options.arrows===true&&_.slideCount>_.options.slidesToShow){_.$prevArrow.hide();_.$nextArrow.hide()}if(_.options.dots===true&&_.slideCount>_.options.slidesToShow){_.$dots.hide()}_.$slider.addClass("slick-loading")};Slick.prototype.swipeDirection=function(){var xDist,yDist,r,swipeAngle,_=this;xDist=_.touchObject.startX-_.touchObject.curX;yDist=_.touchObject.startY-_.touchObject.curY;r=Math.atan2(yDist,xDist);swipeAngle=Math.round(r*180/Math.PI);if(swipeAngle<0){swipeAngle=360-Math.abs(swipeAngle)}if(swipeAngle<=45&&swipeAngle>=0){return _.options.rtl===false?"left":"right"}if(swipeAngle<=360&&swipeAngle>=315){return _.options.rtl===false?"left":"right"}if(swipeAngle>=135&&swipeAngle<=225){return _.options.rtl===false?"right":"left"}if(_.options.verticalSwiping===true){if(swipeAngle>=35&&swipeAngle<=135){return"down"}else{return"up"}}return"vertical"};Slick.prototype.swipeEnd=function(event){var _=this,slideCount,direction;_.dragging=false;_.swiping=false;if(_.scrolling){_.scrolling=false;return false}_.interrupted=false;_.shouldClick=_.touchObject.swipeLength>10?false:true;if(_.touchObject.curX===undefined){return false}if(_.touchObject.edgeHit===true){_.$slider.trigger("edge",[_,_.swipeDirection()])}if(_.touchObject.swipeLength>=_.touchObject.minSwipe){direction=_.swipeDirection();switch(direction){case"left":case"down":slideCount=_.options.swipeToSlide?_.checkNavigable(_.currentSlide+_.getSlideCount()):_.currentSlide+_.getSlideCount();_.currentDirection=0;break;case"right":case"up":slideCount=_.options.swipeToSlide?_.checkNavigable(_.currentSlide-_.getSlideCount()):_.currentSlide-_.getSlideCount();_.currentDirection=1;break;default:}if(direction!="vertical"){_.slideHandler(slideCount);_.touchObject={};_.$slider.trigger("swipe",[_,direction])}}else{if(_.touchObject.startX!==_.touchObject.curX){_.slideHandler(_.currentSlide);_.touchObject={}}}};Slick.prototype.swipeHandler=function(event){var _=this;if(_.options.swipe===false||"ontouchend"in document&&_.options.swipe===false){return}else if(_.options.draggable===false&&event.type.indexOf("mouse")!==-1){return}_.touchObject.fingerCount=event.originalEvent&&event.originalEvent.touches!==undefined?event.originalEvent.touches.length:1;_.touchObject.minSwipe=_.listWidth/_.options.touchThreshold;if(_.options.verticalSwiping===true){_.touchObject.minSwipe=_.listHeight/_.options.touchThreshold}switch(event.data.action){case"start":_.swipeStart(event);break;case"move":_.swipeMove(event);break;case"end":_.swipeEnd(event);break}};Slick.prototype.swipeMove=function(event){var _=this,edgeWasHit=false,curLeft,swipeDirection,swipeLength,positionOffset,touches,verticalSwipeLength;touches=event.originalEvent!==undefined?event.originalEvent.touches:null;if(!_.dragging||_.scrolling||touches&&touches.length!==1){return false}curLeft=_.getLeft(_.currentSlide);_.touchObject.curX=touches!==undefined?touches[0].pageX:event.clientX;_.touchObject.curY=touches!==undefined?touches[0].pageY:event.clientY;_.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(_.touchObject.curX-_.touchObject.startX,2)));verticalSwipeLength=Math.round(Math.sqrt(Math.pow(_.touchObject.curY-_.touchObject.startY,2)));if(!_.options.verticalSwiping&&!_.swiping&&verticalSwipeLength>4){_.scrolling=true;return false}if(_.options.verticalSwiping===true){_.touchObject.swipeLength=verticalSwipeLength}swipeDirection=_.swipeDirection();if(event.originalEvent!==undefined&&_.touchObject.swipeLength>4){_.swiping=true;event.preventDefault()}positionOffset=(_.options.rtl===false?1:-1)*(_.touchObject.curX>_.touchObject.startX?1:-1);if(_.options.verticalSwiping===true){positionOffset=_.touchObject.curY>_.touchObject.startY?1:-1}swipeLength=_.touchObject.swipeLength;_.touchObject.edgeHit=false;if(_.options.infinite===false){if(_.currentSlide===0&&swipeDirection==="right"||_.currentSlide>=_.getDotCount()&&swipeDirection==="left"){swipeLength=_.touchObject.swipeLength*_.options.edgeFriction;_.touchObject.edgeHit=true}}if(_.options.vertical===false){_.swipeLeft=curLeft+swipeLength*positionOffset}else{_.swipeLeft=curLeft+swipeLength*(_.$list.height()/_.listWidth)*positionOffset}if(_.options.verticalSwiping===true){_.swipeLeft=curLeft+swipeLength*positionOffset}if(_.options.fade===true||_.options.touchMove===false){return false}if(_.animating===true){_.swipeLeft=null;return false}_.setCSS(_.swipeLeft)};Slick.prototype.swipeStart=function(event){var _=this,touches;_.interrupted=true;if(_.touchObject.fingerCount!==1||_.slideCount<=_.options.slidesToShow){_.touchObject={};return false}if(event.originalEvent!==undefined&&event.originalEvent.touches!==undefined){touches=event.originalEvent.touches[0]}_.touchObject.startX=_.touchObject.curX=touches!==undefined?touches.pageX:event.clientX;_.touchObject.startY=_.touchObject.curY=touches!==undefined?touches.pageY:event.clientY;_.dragging=true};Slick.prototype.unfilterSlides=Slick.prototype.slickUnfilter=function(){var _=this;if(_.$slidesCache!==null){_.unload();_.$slideTrack.children(this.options.slide).detach();_.$slidesCache.appendTo(_.$slideTrack);_.reinit()}};Slick.prototype.unload=function(){var _=this;$(".slick-cloned",_.$slider).remove();if(_.$dots){_.$dots.remove()}if(_.$prevArrow&&_.htmlExpr.test(_.options.prevArrow)){_.$prevArrow.remove()}if(_.$nextArrow&&_.htmlExpr.test(_.options.nextArrow)){_.$nextArrow.remove()}_.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden","true").css("width","")};Slick.prototype.unslick=function(fromBreakpoint){var _=this;_.$slider.trigger("unslick",[_,fromBreakpoint]);_.destroy()};Slick.prototype.updateArrows=function(){var _=this,centerOffset;centerOffset=Math.floor(_.options.slidesToShow/2);if(_.options.arrows===true&&_.slideCount>_.options.slidesToShow&&!_.options.infinite){_.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false");_.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false");if(_.currentSlide===0){_.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true");_.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false")}else if(_.currentSlide>=_.slideCount-_.options.slidesToShow&&_.options.centerMode===false){_.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true");_.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")}else if(_.currentSlide>=_.slideCount-1&&_.options.centerMode===true){_.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true");_.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")}}};Slick.prototype.updateDots=function(){var _=this;if(_.$dots!==null){_.$dots.find("li").removeClass("slick-active").end();_.$dots.find("li").eq(Math.floor(_.currentSlide/_.options.slidesToScroll)).addClass("slick-active")}};Slick.prototype.visibility=function(){var _=this;if(_.options.autoplay){if(document[_.hidden]){_.interrupted=true}else{_.interrupted=false}}};$.fn.slick=function(){var _=this,opt=arguments[0],args=Array.prototype.slice.call(arguments,1),l=_.length,i,ret;for(i=0;i<l;i++){if(typeof opt=="object"||typeof opt=="undefined")_[i].slick=new Slick(_[i],opt);else ret=_[i].slick[opt].apply(_[i].slick,args);if(typeof ret!="undefined")return ret}return _}});
/**
 * @audi/audi-ui - Audi UI components in HTML, CSS and JS.
 * @version v1.0.0-alpha.1
 * @license Apache-2.0
 * @copyright 2020 Audi
 * @link https://github.com/audi/audi-ui
 */

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("audi-ui", [], factory);
	else if(typeof exports === 'object')
		exports["audi-ui"] = factory();
	else
		root["audi-ui"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Tooltip = exports.Textfield = exports.Spinner = exports.Indicator = exports.Slider = exports.Select = exports.Response = exports.Radio = exports.Progress = exports.Popover = exports.Player = exports.Pagination = exports.Notification = exports.Nav = exports.Modal = exports.Header = exports.Flyout = exports.Dropdown = exports.Checkbox = exports.Breadcrumb = exports.Audioplayer = exports.Alert = undefined;
	
	var _alert = __webpack_require__(1);
	
	var _alert2 = _interopRequireDefault(_alert);
	
	var _audioplayer = __webpack_require__(5);
	
	var _audioplayer2 = _interopRequireDefault(_audioplayer);
	
	var _breadcrumb = __webpack_require__(11);
	
	var _breadcrumb2 = _interopRequireDefault(_breadcrumb);
	
	var _checkbox = __webpack_require__(12);
	
	var _checkbox2 = _interopRequireDefault(_checkbox);
	
	var _dropdown = __webpack_require__(13);
	
	var _dropdown2 = _interopRequireDefault(_dropdown);
	
	var _flyout = __webpack_require__(14);
	
	var _flyout2 = _interopRequireDefault(_flyout);
	
	var _header = __webpack_require__(15);
	
	var _header2 = _interopRequireDefault(_header);
	
	var _modal = __webpack_require__(17);
	
	var _modal2 = _interopRequireDefault(_modal);
	
	var _nav = __webpack_require__(21);
	
	var _nav2 = _interopRequireDefault(_nav);
	
	var _notification = __webpack_require__(29);
	
	var _notification2 = _interopRequireDefault(_notification);
	
	var _pagination = __webpack_require__(30);
	
	var _pagination2 = _interopRequireDefault(_pagination);
	
	var _player = __webpack_require__(31);
	
	var _player2 = _interopRequireDefault(_player);
	
	var _popover = __webpack_require__(6);
	
	var _popover2 = _interopRequireDefault(_popover);
	
	var _progress = __webpack_require__(32);
	
	var _progress2 = _interopRequireDefault(_progress);
	
	var _radio = __webpack_require__(33);
	
	var _radio2 = _interopRequireDefault(_radio);
	
	var _response = __webpack_require__(34);
	
	var _response2 = _interopRequireDefault(_response);
	
	var _select = __webpack_require__(36);
	
	var _select2 = _interopRequireDefault(_select);
	
	var _slider = __webpack_require__(37);
	
	var _slider2 = _interopRequireDefault(_slider);
	
	var _indicator = __webpack_require__(40);
	
	var _indicator2 = _interopRequireDefault(_indicator);
	
	var _spinner = __webpack_require__(42);
	
	var _spinner2 = _interopRequireDefault(_spinner);
	
	var _textfield = __webpack_require__(45);
	
	var _textfield2 = _interopRequireDefault(_textfield);
	
	var _tooltip = __webpack_require__(46);
	
	var _tooltip2 = _interopRequireDefault(_tooltip);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } // TODO Add ComponentHandler.upgradeAllRegistered components e.g. to update them when all fonts are loaded.
	// TODO Perform a `Cutting the mustard` test once. audiui-head.js
	// TODO Outsource dependencies Tether, nouislider, bezier-easing
	
	/**
	 * Import all AUI components.
	 */
	
	
	/**
	 * Export all AUI components to make them accessible through npm.
	 * @example
	 * import {Alert} from 'audi-ui';
	 * Alert.upgradeElements();
	 */
	exports.Alert = _alert2.default;
	exports.Audioplayer = _audioplayer2.default;
	exports.Breadcrumb = _breadcrumb2.default;
	exports.Checkbox = _checkbox2.default;
	exports.Dropdown = _dropdown2.default;
	exports.Flyout = _flyout2.default;
	exports.Header = _header2.default;
	exports.Modal = _modal2.default;
	exports.Nav = _nav2.default;
	exports.Notification = _notification2.default;
	exports.Pagination = _pagination2.default;
	exports.Player = _player2.default;
	exports.Popover = _popover2.default;
	exports.Progress = _progress2.default;
	exports.Radio = _radio2.default;
	exports.Response = _response2.default;
	exports.Select = _select2.default;
	exports.Slider = _slider2.default;
	exports.Indicator = _indicator2.default;
	exports.Spinner = _spinner2.default;
	exports.Textfield = _textfield2.default;
	exports.Tooltip = _tooltip2.default;
	
	/**
	 * Export Component Handler as default to have access to all components.
	 * @example
	 * import auiHandler from 'audi-ui';
	 * auiHandler.upgradeAllElements();
	 */
	
	var ComponentHandler = function () {
	  function ComponentHandler() {
	    _classCallCheck(this, ComponentHandler);
	
	    /**
	     * Performs a "Cutting the mustard" test. If the browser supports the features
	     * tested, adds a aui-js class to the <html> element.
	     */
	    if ('classList' in document.createElement('div') && 'querySelector' in document && 'addEventListener' in window && Array.prototype.forEach) {
	      document.documentElement.classList.add('aui-js');
	    }
	
	    this.upgradeAllElements();
	  }
	
	  ComponentHandler.prototype.upgradeAllElements = function upgradeAllElements() {
	    _alert2.default.upgradeElements();
	    _audioplayer2.default.upgradeElements();
	    _breadcrumb2.default.upgradeElements();
	    _checkbox2.default.upgradeElements();
	    _dropdown2.default.upgradeElements();
	    _flyout2.default.upgradeElements();
	    _header2.default.upgradeElements();
	    // Modal.upgradeElements();
	    _nav2.default.upgradeElements();
	    _notification2.default.upgradeElements();
	    _pagination2.default.upgradeElements();
	    _player2.default.upgradeElements();
	    _popover2.default.upgradeElements();
	    // Progress.upgradeElements();
	    _radio2.default.upgradeElements();
	    _response2.default.upgradeElements();
	    _select2.default.upgradeElements();
	    _slider2.default.upgradeElements();
	    _indicator2.default.upgradeElements();
	    // Spinner.upgradeElements();
	    _textfield2.default.upgradeElements();
	    _tooltip2.default.upgradeElements();
	  };
	
	  return ComponentHandler;
	}();
	
	var componentHandler = new ComponentHandler();
	
	exports.default = componentHandler;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _component = __webpack_require__(2);
	
	var _component2 = _interopRequireDefault(_component);
	
	var _resizeObserver = __webpack_require__(3);
	
	var _resizeObserver2 = _interopRequireDefault(_resizeObserver);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var SELECTOR_COMPONENT = '.aui-js-alert';
	var CLASS_CONTENT = 'aui-alert__content';
	var CLASS_CLOSE_BUTTON = 'aui-alert__close';
	var CLASS_IS_CLOSED = 'is-closed';
	var CLASS_IS_OPEN = 'is-open';
	var ATTR_CLOSE = 'data-close';
	var ATTR_OPENDELAY = 'data-opendelay';
	
	/**
	 * Class constructor for Alert AUI component.
	 * Implements AUI component design pattern defined at:
	 * https://github.com/...
	 *
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	
	var Alert = function (_Component) {
	  _inherits(Alert, _Component);
	
	  /**
	   * Upgrades all Alert AUI components.
	   * @returns {Array} Returns an array of all newly upgraded components.
	   */
	  Alert.upgradeElements = function upgradeElements() {
	    var components = [];
	    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(function (element) {
	      if (!_component2.default.isElementUpgraded(element)) {
	        components.push(new Alert(element));
	      }
	    });
	    return components;
	  };
	
	  /**
	   * Constructor
	   * @constructor
	   * @param {HTMLElement} element The element of the AUI component.
	   */
	  function Alert(element) {
	    _classCallCheck(this, Alert);
	
	    return _possibleConstructorReturn(this, _Component.call(this, element));
	  }
	
	  /**
	   * Initialize component
	   */
	
	
	  Alert.prototype.init = function init() {
	    var _this2 = this;
	
	    _Component.prototype.init.call(this);
	
	    this._content = this._element.querySelector('.' + CLASS_CONTENT);
	
	    // Add close button
	    this._closeButton = document.createElement('button');
	    this._closeButton.setAttribute('type', 'button');
	    this._closeButton.classList.add(CLASS_CLOSE_BUTTON);
	    if (this._content) {
	      this._content.appendChild(this._closeButton);
	    }
	
	    if (this._element.hasAttribute(ATTR_OPENDELAY)) {
	      var delay = parseInt(this._element.getAttribute(ATTR_OPENDELAY));
	      this._element.classList.add(CLASS_IS_CLOSED);
	      this.openingTimeout = setTimeout(function () {
	        return _this2.open(true);
	      }, delay);
	    } else {
	      this.open();
	    }
	
	    this._resizeObserver = new _resizeObserver2.default();
	    this._resizeObserver.resized.add(this._resizedHandler = function () {
	      return _this2.update();
	    });
	
	    this.update();
	  };
	
	  /**
	   * Open an Alert
	   * @param {boolean} animate True, if the opening should be animated. Default: false
	   */
	
	
	  Alert.prototype.open = function open(animate) {
	    var _this3 = this;
	
	    animate = animate || false;
	    this._element.addEventListener('click', this._clickHandler = function (event) {
	      return _this3._onClick(event);
	    });
	    if (animate) {
	      this._animateOpen();
	    } else {
	      this._element.classList.add(CLASS_IS_OPEN);
	      this._element.classList.remove(CLASS_IS_CLOSED);
	    }
	  };
	
	  /**
	   * Animate opening of Alert
	   */
	
	
	  Alert.prototype._animateOpen = function _animateOpen() {
	    var _this4 = this;
	
	    clearTimeout(this.openingTimeout);
	    // Loop until start height is set and correctly rendered
	    if (window.getComputedStyle(this._element).height && this._element.style.height) {
	      this._element.classList.add(CLASS_IS_OPEN);
	      this._element.classList.remove(CLASS_IS_CLOSED);
	    } else {
	      window.requestAnimationFrame(function () {
	        return _this4._animateOpen();
	      });
	    }
	  };
	
	  /**
	   * Close this Alert
	   */
	
	
	  Alert.prototype.close = function close() {
	    this._element.removeEventListener('click', this._clickHandler);
	    this._element.style.height = this._content.offsetHeight + 'px';
	    this._animateClose();
	  };
	
	  /**
	   * Animate closing of Alert
	   */
	
	
	  Alert.prototype._animateClose = function _animateClose() {
	    var _this5 = this;
	
	    clearTimeout(this.openingTimeout);
	    // Loop until start height is set and correctly rendered
	    if (window.getComputedStyle(this._element).height && this._element.style.height) {
	      this._element.classList.remove(CLASS_IS_OPEN);
	      this._element.classList.add(CLASS_IS_CLOSED);
	    } else {
	      window.requestAnimationFrame(function () {
	        return _this5._animateClose();
	      });
	    }
	  };
	
	  /**
	   * Update Alert.
	   * Equalize element height with containing content.
	   */
	
	
	  Alert.prototype.update = function update() {
	    this._element.style.height = this._content.offsetHeight + 'px';
	  };
	
	  /**
	   * Handle click of element.
	   * @param {Event} event The event that fired.
	   * @private
	   */
	
	
	  Alert.prototype._onClick = function _onClick(event) {
	    if (event.target.classList.contains(CLASS_CLOSE_BUTTON) || event.target.hasAttribute(ATTR_CLOSE)) {
	      this.close();
	    }
	  };
	
	  /**
	   * Dispose component
	   */
	
	
	  Alert.prototype.dispose = function dispose() {
	    _Component.prototype.dispose.call(this);
	    clearTimeout(this.openingTimeout);
	    this._element.classList.remove(CLASS_IS_CLOSED);
	    this._element.classList.remove(CLASS_IS_OPEN);
	    this._element.removeEventListener('click', this._clickHandler);
	    this._element.style.height = '';
	    this.removeChild(this._closeButton);
	    this.resizeObserver.resized.remove(this._resizedHandler);
	  };
	
	  return Alert;
	}(_component2.default);
	
	exports.default = Alert;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var CLASS_IS_UPGRADED = 'is-upgraded';
	
	var SVG_NS = 'http://www.w3.org/2000/svg';
	
	/**
	 * Class constructor for abstract AUI Component.
	 * Implements AUI component design pattern defined at:
	 * https://github.com/...
	 *
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	
	var Component = function () {
	
	  /**
	   * Check if an element is upgraded.
	   * @param {HTMLElement} element The element to test if its already be upgraded.
	   * @returns {boolean} Returns true if element is already upgraded
	   */
	  Component.isElementUpgraded = function isElementUpgraded(element) {
	    return element.classList.contains(CLASS_IS_UPGRADED);
	  };
	
	  /**
	   * Constructor
	   * @constructor
	   * @param {HTMLElement} element The element of the AUI component.
	   * @param {String} namespace The namespace of the AUI component, like `auiComponent`.
	   */
	
	
	  function Component(element, namespace) {
	    _classCallCheck(this, Component);
	
	    this._element = element;
	
	    if (this._element) {
	      if (namespace) {
	        this._element[namespace] = this;
	      }
	      this.init();
	    }
	  }
	
	  /**
	   * Initialize component
	   */
	
	
	  Component.prototype.init = function init() {
	    this._element.classList.add(CLASS_IS_UPGRADED);
	  };
	
	  /**
	   * Dispose component
	   */
	
	
	  Component.prototype.dispose = function dispose() {
	    this._element.classList.remove(CLASS_IS_UPGRADED);
	  };
	
	  /**
	   * Remove a child element from its parent.
	   * @param {HTMLElement} childNode The element to remove.
	   */
	
	
	  Component.prototype.removeChild = function removeChild(childNode) {
	    if (childNode && childNode.parentNode) {
	      if (this.isIE()) {
	        childNode.removeNode(true);
	      } else {
	        childNode.remove();
	      }
	    }
	  };
	
	  /**
	   * Creates an HTML element and sets the given CSS classes and attributes.
	   * @param {string} tagName is a string that specifies the type of element to be created.
	   * @param {Array} classes is an array of class names to set, e.g. ['aui-class-1', 'aui-class-2'].
	   * @param {Object} attributes is an object with attributes to set, e.g. {width: 100}.
	   * @returns {HTMLElement} The created element.
	   */
	
	
	  Component.prototype.createElement = function createElement(tagName, classes, attributes) {
	    var element = document.createElement(tagName);
	    if (classes && classes.length) {
	      element.classList.add.apply(element.classList, classes);
	    }
	    for (var attr in attributes) {
	      element.setAttribute(attr, attributes[attr]);
	    }
	    return element;
	  };
	
	  /**
	   * Creates an SVG element and sets the given attributes.
	   * @param {string} qualifiedName is a string that specifies the type of element to be created.
	   * @param {Object} attributes is an object with attributes to set, e.g. {width: 100}.
	   * @returns {SVGElement} The created element.
	   */
	
	
	  Component.prototype.createSvgNode = function createSvgNode(qualifiedName, attributes) {
	    var element = document.createElementNS(SVG_NS, qualifiedName);
	    for (var attr in attributes) {
	      element.setAttributeNS(null,
	      // Replaces viewBox with view-box
	      // attr.replace(/[A-Z]/g, function(match) {
	      //   return '-' + match.toLowerCase();
	      // }),
	      attr, attributes[attr]);
	    }
	    return element;
	  };
	
	  /**
	   * Returns the HTMLElement of component.
	   */
	
	
	  /**
	   * Returns boolean if browser is Internet Explorer. Other browser (also Edge) return false.
	   */
	  Component.prototype.isIE = function isIE() {
	    var ua = window.navigator.userAgent;
	    var msie = ua.indexOf('MSIE ');
	    if (msie > 0) {
	      // IE 10 or older
	      return true;
	    }
	
	    var trident = ua.indexOf('Trident/');
	    if (trident > 0) {
	      // IE 11
	      var rv = ua.indexOf('rv:');
	      return true;
	    }
	
	    var edge = ua.indexOf('Edge/');
	    if (edge > 0) {
	      // Edge (IE 12+)
	      return false;
	    }
	
	    // other browser
	    return false;
	  };
	
	  _createClass(Component, [{
	    key: 'element',
	    get: function get() {
	      return this._element;
	    }
	  }]);
	
	  return Component;
	}();
	
	exports.default = Component;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _signal = __webpack_require__(4);
	
	var _signal2 = _interopRequireDefault(_signal);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var instance = null;
	
	var ResizeObserver = function () {
	  function ResizeObserver() {
	    _classCallCheck(this, ResizeObserver);
	
	    if (!instance) {
	      instance = this;
	      this.init();
	    }
	
	    return instance;
	  }
	
	  ResizeObserver.prototype.init = function init() {
	    var _this = this;
	
	    this._ticking = false;
	
	    this.resized = new _signal2.default();
	
	    window.addEventListener('resize', this._resizeHandler = function (event) {
	      return _this._onResize(event);
	    });
	  };
	
	  ResizeObserver.prototype._onResize = function _onResize(event) {
	    var _this2 = this;
	
	    if (!this._ticking) {
	      window.requestAnimationFrame(function () {
	        _this2._ticking = false;
	        _this2.resized.dispatch();
	      });
	    }
	    this._ticking = true;
	  };
	
	  return ResizeObserver;
	}();
	
	exports.default = ResizeObserver;
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	// TODO Fork https://github.com/thomaseckhardt/js-signals translate to ES6
	
	var SignalBinding = function () {
	  function SignalBinding(signal, listener, isOnce, priority) {
	    _classCallCheck(this, SignalBinding);
	
	    // Handler function bound to the signal.
	    this._listener = listener;
	
	    // If binding should be executed just once.
	    this._isOnce = isOnce;
	
	    // Reference to Signal object that listener is currently bound to.
	    this._signal = signal;
	
	    // Listener priority
	    this._priority = priority || 0;
	
	    // If binding is active and should be executed.
	    this._active = true;
	  }
	
	  SignalBinding.prototype._isBound = function _isBound() {
	    return !!this._signal && !!this._listener;
	  };
	
	  /**
	   * Call listener passing arbitrary parameters.
	   * If binding was added using `Signal.addOnce()` it will be automatically
	   * removed from signal dispatch queue, this method is used internally for
	   * the signal dispatch.
	   * @param {Array} Array of parameters that should be passed to the listener
	   * @return {*} Value returned by the listener.
	   */
	
	
	  SignalBinding.prototype.execute = function execute(params) {
	    var handlerReturn = void 0;
	    if (this._active && !!this._listener) {
	      handlerReturn = this._listener.apply(this._context, params);
	      if (this._isOnce) {
	        this.detach();
	      }
	    }
	    return handlerReturn;
	  };
	
	  /**
	   * Detach binding from signal.
	   * - alias to: mySignal.remove(myBinding.getListener());
	   * @return {Function|null} Handler function bound to the signal or `null` if binding was previously detached.
	   */
	
	
	  SignalBinding.prototype.detach = function detach() {
	    return this._isBound() ? this._signal.remove(this._listener) : null;
	  };
	
	  SignalBinding.prototype.dispose = function dispose() {
	    delete this._signal;
	    delete this._listener;
	  };
	
	  SignalBinding.prototype.toString = function toString() {
	    return '[SignalBinding isOnce:' + this._isOnce + ', isBound:' + this.isBound() + ', active:' + this._active + ']';
	  };
	
	  _createClass(SignalBinding, [{
	    key: 'isOnce',
	    get: function get() {
	      return this._isOnce;
	    }
	  }, {
	    key: 'listener',
	    get: function get() {
	      return this._listener;
	    }
	  }, {
	    key: 'signal',
	    get: function get() {
	      return this._signal;
	    }
	  }, {
	    key: 'priority',
	    get: function get() {
	      return this._priority;
	    }
	  }]);
	
	  return SignalBinding;
	}();
	
	var Signal = function () {
	  function Signal() {
	    _classCallCheck(this, Signal);
	
	    this._bindings = [];
	    this._prevParams = null;
	    this._active = true;
	  }
	
	  /**
	   * Add a listener to the signal.
	   * @param {Function} listener Signal handler function.
	   * @param {Object} [listenerContext] Context on which listener will be executed (object that should represent the `this` variable inside listener function).
	   * @param {Number} [priority] The priority level of the event listener. Listeners with higher priority will be executed before listeners with lower priority. Listeners with same priority level will be executed at the same order as they were added. (default = 0)
	   * @return {SignalBinding} An Object representing the binding between the Signal and listener.
	   */
	
	
	  Signal.prototype.add = function add(listener, priority) {
	    this._validateListener(listener, 'add');
	    return this._registerListener(listener, false, priority);
	  };
	
	  Signal.prototype.addOnce = function addOnce(listener, priority) {
	    this._validateListener(listener, 'addOnce');
	    return this._registerListener(listener, true, priority);
	  };
	
	  Signal.prototype.remove = function remove(listener) {
	    this._validateListener(listener, 'remove');
	
	    var i = this._indexOfListener(listener);
	    if (i !== -1) {
	      this._bindings[i].dispose(); //no reason to a SignalBinding exist if it isn't attached to a signal
	      this._bindings.splice(i, 1);
	    }
	    return listener;
	  };
	
	  Signal.prototype.removeAll = function removeAll() {
	    var n = this._bindings.length;
	    while (n--) {
	      this._bindings[n].dispose();
	    }
	    this._bindings.length = 0;
	  };
	
	  Signal.prototype.has = function has(listener) {
	    return this._indexOfListener(listener) !== -1;
	  };
	
	  Signal.prototype.dispatch = function dispatch() {
	    if (!this._active) {
	      return;
	    }
	
	    var n = this._bindings.length;
	    if (!n) {
	      return;
	    }
	
	    var params = Array.prototype.slice.call(arguments);
	    var bindings = void 0;
	
	    bindings = this._bindings.slice(); //clone array in case add/remove items during dispatch
	
	    //execute all callbacks until end of the list or until a callback returns `false` or stops propagation
	    //reverse loop since listeners with higher priority will be added at the end of the list
	    do {
	      n--;
	    } while (bindings[n] && bindings[n].execute(params) !== false);
	  };
	
	  Signal.prototype.dispose = function dispose() {
	    this.removeAll();
	    delete this._bindings;
	    delete this._prevParams;
	  };
	
	  Signal.prototype._registerListener = function _registerListener(listener, isOnce, priority) {
	    var prevIndex = this._indexOfListener(listener);
	    var binding = void 0;
	
	    if (prevIndex !== -1) {
	      binding = this._bindings[prevIndex];
	      if (binding.isOnce() !== isOnce) {
	        throw new Error('You cannot add' + (isOnce ? '' : 'Once') + '() then add' + (!isOnce ? '' : 'Once') + '() the same listener without removing the relationship first.');
	      }
	    } else {
	      binding = new SignalBinding(this, listener, isOnce, priority);
	      this._addBinding(binding);
	    }
	
	    if (this.memorize && this._prevParams) {
	      binding.execute(this._prevParams);
	    }
	
	    return binding;
	  };
	
	  Signal.prototype._validateListener = function _validateListener(listener, fnName) {
	    if (typeof listener !== 'function') {
	      throw new Error('listener is a required param of ' + fnName + '() and should be a Function.');
	    }
	  };
	
	  Signal.prototype._indexOfListener = function _indexOfListener(listener) {
	    var n = this._bindings.length;
	    var current = void 0;
	    while (n--) {
	      current = this._bindings[n];
	      if (current.listener === listener) {
	        return n;
	      }
	    }
	    return -1;
	  };
	
	  Signal.prototype._addBinding = function _addBinding(binding) {
	    var n = this._bindings.length;
	    do {
	      --n;
	    } while (this._bindings[n] && binding.priority <= this._bindings[n].priority);
	    this._bindings.splice(n + 1, 0, binding);
	  };
	
	  return Signal;
	}();
	
	exports.default = Signal;
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _component = __webpack_require__(2);
	
	var _component2 = _interopRequireDefault(_component);
	
	var _popover = __webpack_require__(6);
	
	var _popover2 = _interopRequireDefault(_popover);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var SELECTOR_COMPONENT = '.aui-audioplayer';
	
	var Audioplayer = function (_Component) {
	  _inherits(Audioplayer, _Component);
	
	  function Audioplayer() {
	    _classCallCheck(this, Audioplayer);
	
	    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
	  }
	
	  /**
	   * Upgrades all Audioplayer components.
	   * @returns {Array} Returns an array of all newly upgraded components.
	   */
	  Audioplayer.upgradeElements = function upgradeElements() {
	    var components = [];
	    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(function (element) {
	      if (!_component2.default.isElementUpgraded(element)) {
	        components.push(new Audioplayer(element));
	      }
	    });
	    return components;
	  };
	
	  Audioplayer.prototype.formatCurrentTime = function formatCurrentTime(currentTime) {
	    return ('0' + Math.floor(currentTime % 3600 / 60)).slice(-2) + ':' + ('0' + Math.floor(currentTime % 3600 % 60)).slice(-2);
	  };
	
	  Audioplayer.prototype.init = function init() {
	    var _this2 = this;
	
	    _Component.prototype.init.call(this);
	    this.currentTrack = 0;
	    this.scrobble = false;
	    this.embed = this.element.querySelector('.aui-audioplayer__embed');
	    this.embed.preload = true;
	    this.tracks = JSON.parse(this.element.querySelector('.aui-audioplayer__tracks').value);
	    this.embed.addEventListener('ended', function (event) {
	      _this2.cancelProgress();
	      if (_this2.tracks.length > 1) {
	        _this2.next();
	      } else {
	        _this2.pause();
	        _this2.element.classList.add('has-ended');
	      }
	      _this2.updateProgress();
	    });
	    this.embed.addEventListener('canplay', function (event) {
	      _this2.element.querySelector('.aui-audioplayer__time').innerHTML = _this2.formatCurrentTime(_this2.embed.duration);
	    });
	    this.embed.addEventListener('timeupdate', function (event) {
	      _this2.element.querySelector('.aui-audioplayer__time').innerHTML = _this2.formatCurrentTime(_this2.embed.currentTime);
	    });
	    var play = this.element.querySelector('.aui-audioplayer__play');
	    if (play) {
	      play.addEventListener('click', function (event) {
	        if (_this2.isPlaying()) {
	          _this2.pause();
	        } else {
	          _this2.play();
	        }
	      });
	    }
	    var mute = this.element.querySelector('.aui-audioplayer__mute');
	    if (mute) {
	      mute.addEventListener('click', function (event) {
	        if (_this2.isMuted()) {
	          _this2.unmute();
	        } else {
	          _this2.mute();
	        }
	      });
	    }
	    var next = this.element.querySelector('.aui-audioplayer__next');
	    if (next) {
	      next.addEventListener('click', function (event) {
	        _this2.next();
	      });
	    }
	    var previous = this.element.querySelector('.aui-audioplayer__previous');
	    if (previous) {
	      previous.addEventListener('click', function (event) {
	        _this2.previous();
	      });
	    }
	    window.setTimeout(function () {
	      _this2.slider = _this2.element.querySelector('.aui-slider__target').noUiSlider;
	      _this2.slider.on('start', function () {
	        _this2.scrobble = true;
	      });
	      _this2.slider.on('end', function () {
	        _this2.scrobble = false;
	      });
	      _this2.slider.on('change', function (value) {
	        _this2.embed.currentTime = Math.abs(value) * _this2.embed.duration / 100;
	      });
	    }, 400);
	  };
	
	  Audioplayer.prototype.isMuted = function isMuted() {
	    return this.embed.muted;
	  };
	
	  Audioplayer.prototype.isPlaying = function isPlaying() {
	    return !this.embed.paused;
	  };
	
	  Audioplayer.prototype.mute = function mute() {
	    this.element.classList.add('is-mute');
	    this.embed.muted = true;
	  };
	
	  Audioplayer.prototype.next = function next() {
	    if (this.tracks.length > 1) {
	      var restartPlayback = this.isPlaying();
	      this.pause();
	
	      if (this.currentTrack >= this.tracks.length - 1) {
	        this.currentTrack = 0;
	      } else {
	        this.currentTrack = this.currentTrack + 1;
	      }
	      this.embed.src = this.tracks[this.currentTrack].src;
	      this.embed.load();
	      this.slider.set(0);
	      this.element.querySelector('.aui-audioplayer__time').innerHTML = this.formatCurrentTime(this.embed.duration);
	      if (restartPlayback) this.play();
	
	      this.element.querySelector('.aui-audioplayer__time').innerHTML = '00:00';
	      this.element.querySelector('.aui-audioplayer__title').innerHTML = this.tracks[this.currentTrack].title;
	      var cover = this.element.querySelector('.aui-audioplayer__cover');
	      if (cover) {
	        cover.querySelector('.aui-audioplayer__cover-image').setAttribute('src', this.tracks[this.currentTrack].cover);
	      }
	    }
	  };
	
	  Audioplayer.prototype.pause = function pause() {
	    this.cancelProgress();
	    this.element.classList.remove('is-playing');
	    this.embed.pause();
	  };
	
	  Audioplayer.prototype.play = function play() {
	    this.updateProgress();
	    this.element.classList.add('is-playing');
	    this.element.classList.remove('has-ended');
	    this.embed.play();
	  };
	
	  Audioplayer.prototype.previous = function previous() {
	    if (this.tracks.length > 1) {
	      var restartPlayback = this.isPlaying();
	      this.pause();
	
	      if (this.currentTrack === 0) {
	        this.currentTrack = this.tracks.length - 1;
	      } else {
	        this.currentTrack = this.currentTrack - 1;
	      }
	      this.embed.src = this.tracks[this.currentTrack].src;
	      this.embed.load();
	      this.slider.set(0);
	      this.element.querySelector('.aui-audioplayer__time').innerHTML = this.formatCurrentTime(this.embed.duration);
	      if (restartPlayback) this.play();
	
	      this.element.querySelector('.aui-audioplayer__time').innerHTML = '00:00';
	      this.element.querySelector('.aui-audioplayer__title').innerHTML = this.tracks[this.currentTrack].title;
	      var cover = this.element.querySelector('.aui-audioplayer__cover');
	      if (cover) {
	        cover.querySelector('.aui-audioplayer__cover-image').setAttribute('src', this.tracks[this.currentTrack].cover);
	      }
	    }
	  };
	
	  Audioplayer.prototype.unmute = function unmute() {
	    this.element.classList.remove('is-mute');
	    this.embed.muted = false;
	  };
	
	  Audioplayer.prototype.cancelProgress = function cancelProgress() {
	    if (this.tick) {
	      window.cancelAnimationFrame(this.tick);
	      this.tick = undefined;
	    }
	  };
	
	  Audioplayer.prototype.updateProgress = function updateProgress() {
	    var _this3 = this;
	
	    this.tick = window.requestAnimationFrame(function () {
	      if (!_this3.scrobble) _this3.slider.set(Math.abs(_this3.embed.currentTime * 100 / _this3.embed.duration));
	      _this3.updateProgress();
	    });
	  };
	
	  return Audioplayer;
	}(_component2.default);
	
	exports.default = Audioplayer;
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _component = __webpack_require__(2);
	
	var _component2 = _interopRequireDefault(_component);
	
	var _reflow = __webpack_require__(7);
	
	var _reflow2 = _interopRequireDefault(_reflow);
	
	var _closest = __webpack_require__(8);
	
	var _closest2 = _interopRequireDefault(_closest);
	
	var _transitionEndEvent = __webpack_require__(9);
	
	var _transitionEndEvent2 = _interopRequireDefault(_transitionEndEvent);
	
	var _tether = __webpack_require__(10);
	
	var _tether2 = _interopRequireDefault(_tether);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var SELECTOR_COMPONENT = '.aui-js-popover';
	var SELECTOR_DISMISS = '[data-dismiss="popover"]';
	var CLASS_ARROW = 'aui-popover__arrow';
	var CLASS_ARROW_SHAPE = 'aui-popover__arrow-shape';
	var CLASS_ACTIVE = 'is-active';
	var CLASS_SHOWN = 'is-shown';
	var CLASS_POPOVER_IS_OPEN = 'aui-popover-is-open';
	var ARROW_SIZE = 20;
	
	var AttachmentMap = {
	  top: 'bottom center',
	  right: 'middle left',
	  bottom: 'top center',
	  left: 'middle right'
	
	  /**
	   * Class constructor for Popover AUI component.
	   * Implements AUI component design pattern defined at:
	   * https://github.com/...
	   *
	   * @param {HTMLElement} element The element that will be upgraded.
	   */
	};
	var Popover = function (_Component) {
	  _inherits(Popover, _Component);
	
	  function Popover() {
	    _classCallCheck(this, Popover);
	
	    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
	  }
	
	  /**
	   * Upgrades all Popover AUI components.
	   * @returns {Array} Returns an array of all newly upgraded components.
	   */
	  Popover.upgradeElements = function upgradeElements() {
	    var components = [];
	    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(function (element) {
	      if (!_component2.default.isElementUpgraded(element)) {
	        components.push(new Popover(element));
	      }
	    });
	    return components;
	  };
	
	  /**
	   * Initialize component
	   */
	  Popover.prototype.init = function init() {
	    var _this2 = this;
	
	    _Component.prototype.init.call(this);
	
	    this._body = document.querySelector('body');
	
	    this._id = this._element.getAttribute('id');
	    this._trigger = document.getElementById(this._element.getAttribute('for'));
	    this._tether = null;
	    var placement = this._element.hasAttribute('data-placement') ? this._element.getAttribute('data-placement') : 'top';
	    this._attachement = AttachmentMap[placement.toLowerCase()];
	
	    var content = this._element.querySelector('.aui-popover__content');
	    var arrowColor = this._element.hasAttribute('data-arrow-color') ? this._element.getAttribute('data-arrow-color') : window.getComputedStyle(content).backgroundColor;
	    this._arrow = this._addArrow(content, arrowColor);
	
	    if (this._trigger) {
	      this._trigger.addEventListener('click', this._boundClickHandler = function (event) {
	        return _this2.toggle(event);
	      });
	    }
	  };
	
	  /**
	   * Dispose component
	   */
	
	
	  Popover.prototype.dispose = function dispose() {
	    _Component.prototype.dispose.call(this);
	
	    this.hide();
	    this.removeChild(this._arrow);
	
	    if (this._trigger) {
	      this._trigger.removeEventListener('click', this._boundClickHandler);
	    }
	  };
	
	  /**
	   * Toggle show/hide Popover
	   * @param {Event} event Click event of trigger element (optional)
	   */
	
	
	  Popover.prototype.toggle = function toggle(event) {
	    var _this3 = this;
	
	    var performToggle = function performToggle() {
	      if (!_this3._element.classList.contains(CLASS_ACTIVE) && _this3._tether) {
	        _this3.show();
	      } else {
	        _this3.hide();
	      }
	    };
	
	    if (event) {
	      event.preventDefault();
	
	      if (this._tether === null) {
	        this._tether = new _tether2.default({
	          element: this._element,
	          target: event.currentTarget,
	          attachment: this._attachement,
	          classPrefix: 'aui-tether',
	          // NOTE We set an offset in CSS, because this offset wouln't be
	          // flipped as it should:
	          // https://github.com/HubSpot/tether/issues/106
	          offset: '0 0',
	          constraints: [{
	            to: 'window',
	            pin: ['left', 'right'],
	            attachment: 'together'
	          }],
	          optimizations: {
	            gpu: false
	          }
	        });
	        (0, _reflow2.default)(this._element); // REVIEW Do we need this anymore?
	        this._tether.position();
	      }
	      performToggle();
	    } else {
	      performToggle();
	    }
	  };
	
	  /**
	   * Show Popover
	   */
	
	
	  Popover.prototype.show = function show() {
	    var _this4 = this;
	
	    this._body.classList.add(CLASS_POPOVER_IS_OPEN);
	    this._element.classList.add(CLASS_ACTIVE);
	    this._element.classList.add(CLASS_SHOWN);
	    setTimeout(function () {
	      window.addEventListener('click', _this4._boundWindowClickHandler = function (event) {
	        return _this4._onClickOutside(event);
	      });
	    });
	  };
	
	  /**
	   * Hide Popover
	   */
	
	
	  Popover.prototype.hide = function hide() {
	    var _this5 = this;
	
	    this._element.classList.remove(CLASS_SHOWN);
	    this._element.addEventListener(_transitionEndEvent2.default, this._boundAnimationendHandler = function (event) {
	      return _this5._onHideComplete(event);
	    });
	    window.removeEventListener('click', this._boundWindowClickHandler);
	  };
	
	  /**
	   * Clean up Tether instance
	   * @private
	   */
	
	
	  Popover.prototype._cleanupTether = function _cleanupTether() {
	    if (this._tether) {
	      this._tether.destroy();
	      this._tether = null;
	    }
	    this._element.removeAttribute('style');
	  };
	
	  /**
	   * Handle click of window.
	   * @param {Event} event The event that fired.
	   * @private
	   */
	
	
	  Popover.prototype._onClickOutside = function _onClickOutside(event) {
	    // Hide if target dismisses Popover
	    if ((0, _closest2.default)(event.target, SELECTOR_DISMISS, this._element)) {
	      this.hide();
	
	      // Hide if target is not inside Popover and is not a trigger element
	    } else if (!this._element.contains(event.target) && event.target !== this._trigger) {
	      this.hide();
	    }
	  };
	
	  /**
	   * Handle hide transition complete.
	   * @param {Event} event The event that fired.
	   * @private
	   */
	
	
	  Popover.prototype._onHideComplete = function _onHideComplete(event) {
	    this._body.classList.remove(CLASS_POPOVER_IS_OPEN);
	    this._element.classList.remove(CLASS_ACTIVE);
	    this._element.removeEventListener(_transitionEndEvent2.default, this._boundAnimationendHandler);
	    this._cleanupTether();
	  };
	
	  /**
	   * Adds an arrow SVG element
	   * <span class="…"><svg … ><path … /></svg></span>
	   *
	   * @param {HTMLElement} parent element to append arrow to.
	   * @param {string} color used as value of fill property.
	   * @returns {HTMLElement} the added arrow element.
	   */
	
	
	  Popover.prototype._addArrow = function _addArrow(parent, color) {
	    var element = document.createElement('span');
	    element.classList.add(CLASS_ARROW);
	    var svg = this.createSvgNode('svg', {
	      class: CLASS_ARROW_SHAPE,
	      width: ARROW_SIZE,
	      height: ARROW_SIZE,
	      viewBox: '0 0 ' + ARROW_SIZE + ' ' + ARROW_SIZE
	    });
	    // Draw a diamond square ◆
	    var path = this.createSvgNode('path', {
	      d: 'M' + ARROW_SIZE / 2 + ' 0 L ' + ARROW_SIZE + ' ' + ARROW_SIZE / 2 + ' L ' + ARROW_SIZE / 2 + ' ' + ARROW_SIZE + ' L 0 ' + ARROW_SIZE / 2 + ' Z',
	      fill: color
	    });
	    svg.appendChild(path);
	    element.appendChild(svg);
	    parent.appendChild(element);
	    return element;
	  };
	
	  return Popover;
	}(_component2.default);
	
	exports.default = Popover;
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = reflow;
	/**
	 * Trigger a reflow
	 * @param {HTMLElement} element to trigger a reflow.
	 */
	function reflow(element) {
	  new Function('bs', 'return bs')(element.offsetHeight);
	}
	module.exports = exports['default'];

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = closest;
	/**
	 * Get the first element that matches the selector by testing the element itself
	 * and traversing up through its ancestors in the DOM tree.
	 * @param {HTMLElement} element to search wherefrom
	 * @param {string} selector A string containing a selector expression to match elements against.
	 * @param {HTMLElement} context A DOM element within which a matching element may be found.
	 * @returns {HTMLElement} found element or null
	 */
	function closest(element, selector, context) {
	  var matchesFn = void 0;
	
	  ['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'].some(function (fn) {
	    if (typeof document.body[fn] === 'function') {
	      matchesFn = fn;
	      return true;
	    }
	    return false;
	  });
	
	  var parent = void 0;
	
	  // traverse parents
	  parent = element;
	  while (parent) {
	    if (parent && parent[matchesFn](selector)) {
	      return parent;
	    }
	    if (parent === context) {
	      return null;
	    }
	    parent = parent.parentElement;
	  }
	
	  return null;
	}
	module.exports = exports['default'];

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	// From Modernizr
	function whichTransitionEvent() {
	  var t;
	  var el = document.createElement('fakeelement');
	  var transitions = {
	    'transition': 'transitionend',
	    'OTransition': 'oTransitionEnd',
	    'MozTransition': 'transitionend',
	    'WebkitTransition': 'webkitTransitionEnd'
	  };
	
	  for (t in transitions) {
	    if (el.style[t] !== undefined) {
	      return transitions[t];
	    }
	  }
	}
	
	var TRANSITION_EVENT = whichTransitionEvent();
	
	exports.default = TRANSITION_EVENT;
	module.exports = exports['default'];

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*! tether 1.4.7 */
	
	(function(root, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports === 'object') {
	    module.exports = factory();
	  } else {
	    root.Tether = factory();
	  }
	}(this, function() {
	
	'use strict';
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var TetherBase = undefined;
	if (typeof TetherBase === 'undefined') {
	  TetherBase = { modules: [] };
	}
	
	var zeroElement = null;
	
	// Same as native getBoundingClientRect, except it takes into account parent <frame> offsets
	// if the element lies within a nested document (<frame> or <iframe>-like).
	function getActualBoundingClientRect(node) {
	  var boundingRect = node.getBoundingClientRect();
	
	  // The original object returned by getBoundingClientRect is immutable, so we clone it
	  // We can't use extend because the properties are not considered part of the object by hasOwnProperty in IE9
	  var rect = {};
	  for (var k in boundingRect) {
	    rect[k] = boundingRect[k];
	  }
	
	  try {
	    if (node.ownerDocument !== document) {
	      var _frameElement = node.ownerDocument.defaultView.frameElement;
	      if (_frameElement) {
	        var frameRect = getActualBoundingClientRect(_frameElement);
	        rect.top += frameRect.top;
	        rect.bottom += frameRect.top;
	        rect.left += frameRect.left;
	        rect.right += frameRect.left;
	      }
	    }
	  } catch (err) {
	    // Ignore "Access is denied" in IE11/Edge
	  }
	
	  return rect;
	}
	
	function getScrollParents(el) {
	  // In firefox if the el is inside an iframe with display: none; window.getComputedStyle() will return null;
	  // https://bugzilla.mozilla.org/show_bug.cgi?id=548397
	  var computedStyle = getComputedStyle(el) || {};
	  var position = computedStyle.position;
	  var parents = [];
	
	  if (position === 'fixed') {
	    return [el];
	  }
	
	  var parent = el;
	  while ((parent = parent.parentNode) && parent && parent.nodeType === 1) {
	    var style = undefined;
	    try {
	      style = getComputedStyle(parent);
	    } catch (err) {}
	
	    if (typeof style === 'undefined' || style === null) {
	      parents.push(parent);
	      return parents;
	    }
	
	    var _style = style;
	    var overflow = _style.overflow;
	    var overflowX = _style.overflowX;
	    var overflowY = _style.overflowY;
	
	    if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
	      if (position !== 'absolute' || ['relative', 'absolute', 'fixed'].indexOf(style.position) >= 0) {
	        parents.push(parent);
	      }
	    }
	  }
	
	  parents.push(el.ownerDocument.body);
	
	  // If the node is within a frame, account for the parent window scroll
	  if (el.ownerDocument !== document) {
	    parents.push(el.ownerDocument.defaultView);
	  }
	
	  return parents;
	}
	
	var uniqueId = (function () {
	  var id = 0;
	  return function () {
	    return ++id;
	  };
	})();
	
	var zeroPosCache = {};
	var getOrigin = function getOrigin() {
	  // getBoundingClientRect is unfortunately too accurate.  It introduces a pixel or two of
	  // jitter as the user scrolls that messes with our ability to detect if two positions
	  // are equivilant or not.  We place an element at the top left of the page that will
	  // get the same jitter, so we can cancel the two out.
	  var node = zeroElement;
	  if (!node || !document.body.contains(node)) {
	    node = document.createElement('div');
	    node.setAttribute('data-tether-id', uniqueId());
	    extend(node.style, {
	      top: 0,
	      left: 0,
	      position: 'absolute'
	    });
	
	    document.body.appendChild(node);
	
	    zeroElement = node;
	  }
	
	  var id = node.getAttribute('data-tether-id');
	  if (typeof zeroPosCache[id] === 'undefined') {
	    zeroPosCache[id] = getActualBoundingClientRect(node);
	
	    // Clear the cache when this position call is done
	    defer(function () {
	      delete zeroPosCache[id];
	    });
	  }
	
	  return zeroPosCache[id];
	};
	
	function removeUtilElements() {
	  if (zeroElement) {
	    document.body.removeChild(zeroElement);
	  }
	  zeroElement = null;
	};
	
	function getBounds(el) {
	  var doc = undefined;
	  if (el === document) {
	    doc = document;
	    el = document.documentElement;
	  } else {
	    doc = el.ownerDocument;
	  }
	
	  var docEl = doc.documentElement;
	
	  var box = getActualBoundingClientRect(el);
	
	  var origin = getOrigin();
	
	  box.top -= origin.top;
	  box.left -= origin.left;
	
	  if (typeof box.width === 'undefined') {
	    box.width = document.body.scrollWidth - box.left - box.right;
	  }
	  if (typeof box.height === 'undefined') {
	    box.height = document.body.scrollHeight - box.top - box.bottom;
	  }
	
	  box.top = box.top - docEl.clientTop;
	  box.left = box.left - docEl.clientLeft;
	  box.right = doc.body.clientWidth - box.width - box.left;
	  box.bottom = doc.body.clientHeight - box.height - box.top;
	
	  return box;
	}
	
	function getOffsetParent(el) {
	  return el.offsetParent || document.documentElement;
	}
	
	var _scrollBarSize = null;
	function getScrollBarSize() {
	  if (_scrollBarSize) {
	    return _scrollBarSize;
	  }
	  var inner = document.createElement('div');
	  inner.style.width = '100%';
	  inner.style.height = '200px';
	
	  var outer = document.createElement('div');
	  extend(outer.style, {
	    position: 'absolute',
	    top: 0,
	    left: 0,
	    pointerEvents: 'none',
	    visibility: 'hidden',
	    width: '200px',
	    height: '150px',
	    overflow: 'hidden'
	  });
	
	  outer.appendChild(inner);
	
	  document.body.appendChild(outer);
	
	  var widthContained = inner.offsetWidth;
	  outer.style.overflow = 'scroll';
	  var widthScroll = inner.offsetWidth;
	
	  if (widthContained === widthScroll) {
	    widthScroll = outer.clientWidth;
	  }
	
	  document.body.removeChild(outer);
	
	  var width = widthContained - widthScroll;
	
	  _scrollBarSize = { width: width, height: width };
	  return _scrollBarSize;
	}
	
	function extend() {
	  var out = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	  var args = [];
	
	  Array.prototype.push.apply(args, arguments);
	
	  args.slice(1).forEach(function (obj) {
	    if (obj) {
	      for (var key in obj) {
	        if (({}).hasOwnProperty.call(obj, key)) {
	          out[key] = obj[key];
	        }
	      }
	    }
	  });
	
	  return out;
	}
	
	function removeClass(el, name) {
	  if (typeof el.classList !== 'undefined') {
	    name.split(' ').forEach(function (cls) {
	      if (cls.trim()) {
	        el.classList.remove(cls);
	      }
	    });
	  } else {
	    var regex = new RegExp('(^| )' + name.split(' ').join('|') + '( |$)', 'gi');
	    var className = getClassName(el).replace(regex, ' ');
	    setClassName(el, className);
	  }
	}
	
	function addClass(el, name) {
	  if (typeof el.classList !== 'undefined') {
	    name.split(' ').forEach(function (cls) {
	      if (cls.trim()) {
	        el.classList.add(cls);
	      }
	    });
	  } else {
	    removeClass(el, name);
	    var cls = getClassName(el) + (' ' + name);
	    setClassName(el, cls);
	  }
	}
	
	function hasClass(el, name) {
	  if (typeof el.classList !== 'undefined') {
	    return el.classList.contains(name);
	  }
	  var className = getClassName(el);
	  return new RegExp('(^| )' + name + '( |$)', 'gi').test(className);
	}
	
	function getClassName(el) {
	  // Can't use just SVGAnimatedString here since nodes within a Frame in IE have
	  // completely separately SVGAnimatedString base classes
	  if (el.className instanceof el.ownerDocument.defaultView.SVGAnimatedString) {
	    return el.className.baseVal;
	  }
	  return el.className;
	}
	
	function setClassName(el, className) {
	  el.setAttribute('class', className);
	}
	
	function updateClasses(el, add, all) {
	  // Of the set of 'all' classes, we need the 'add' classes, and only the
	  // 'add' classes to be set.
	  all.forEach(function (cls) {
	    if (add.indexOf(cls) === -1 && hasClass(el, cls)) {
	      removeClass(el, cls);
	    }
	  });
	
	  add.forEach(function (cls) {
	    if (!hasClass(el, cls)) {
	      addClass(el, cls);
	    }
	  });
	}
	
	var deferred = [];
	
	var defer = function defer(fn) {
	  deferred.push(fn);
	};
	
	var flush = function flush() {
	  var fn = undefined;
	  while (fn = deferred.pop()) {
	    fn();
	  }
	};
	
	var Evented = (function () {
	  function Evented() {
	    _classCallCheck(this, Evented);
	  }
	
	  _createClass(Evented, [{
	    key: 'on',
	    value: function on(event, handler, ctx) {
	      var once = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];
	
	      if (typeof this.bindings === 'undefined') {
	        this.bindings = {};
	      }
	      if (typeof this.bindings[event] === 'undefined') {
	        this.bindings[event] = [];
	      }
	      this.bindings[event].push({ handler: handler, ctx: ctx, once: once });
	    }
	  }, {
	    key: 'once',
	    value: function once(event, handler, ctx) {
	      this.on(event, handler, ctx, true);
	    }
	  }, {
	    key: 'off',
	    value: function off(event, handler) {
	      if (typeof this.bindings === 'undefined' || typeof this.bindings[event] === 'undefined') {
	        return;
	      }
	
	      if (typeof handler === 'undefined') {
	        delete this.bindings[event];
	      } else {
	        var i = 0;
	        while (i < this.bindings[event].length) {
	          if (this.bindings[event][i].handler === handler) {
	            this.bindings[event].splice(i, 1);
	          } else {
	            ++i;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'trigger',
	    value: function trigger(event) {
	      if (typeof this.bindings !== 'undefined' && this.bindings[event]) {
	        var i = 0;
	
	        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	          args[_key - 1] = arguments[_key];
	        }
	
	        while (i < this.bindings[event].length) {
	          var _bindings$event$i = this.bindings[event][i];
	          var handler = _bindings$event$i.handler;
	          var ctx = _bindings$event$i.ctx;
	          var once = _bindings$event$i.once;
	
	          var context = ctx;
	          if (typeof context === 'undefined') {
	            context = this;
	          }
	
	          handler.apply(context, args);
	
	          if (once) {
	            this.bindings[event].splice(i, 1);
	          } else {
	            ++i;
	          }
	        }
	      }
	    }
	  }]);
	
	  return Evented;
	})();
	
	TetherBase.Utils = {
	  getActualBoundingClientRect: getActualBoundingClientRect,
	  getScrollParents: getScrollParents,
	  getBounds: getBounds,
	  getOffsetParent: getOffsetParent,
	  extend: extend,
	  addClass: addClass,
	  removeClass: removeClass,
	  hasClass: hasClass,
	  updateClasses: updateClasses,
	  defer: defer,
	  flush: flush,
	  uniqueId: uniqueId,
	  Evented: Evented,
	  getScrollBarSize: getScrollBarSize,
	  removeUtilElements: removeUtilElements
	};
	/* globals TetherBase, performance */
	
	'use strict';
	
	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	var _get = function get(_x6, _x7, _x8) { var _again = true; _function: while (_again) { var object = _x6, property = _x7, receiver = _x8; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x6 = parent; _x7 = property; _x8 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	if (typeof TetherBase === 'undefined') {
	  throw new Error('You must include the utils.js file before tether.js');
	}
	
	var _TetherBase$Utils = TetherBase.Utils;
	var getScrollParents = _TetherBase$Utils.getScrollParents;
	var getBounds = _TetherBase$Utils.getBounds;
	var getOffsetParent = _TetherBase$Utils.getOffsetParent;
	var extend = _TetherBase$Utils.extend;
	var addClass = _TetherBase$Utils.addClass;
	var removeClass = _TetherBase$Utils.removeClass;
	var updateClasses = _TetherBase$Utils.updateClasses;
	var defer = _TetherBase$Utils.defer;
	var flush = _TetherBase$Utils.flush;
	var getScrollBarSize = _TetherBase$Utils.getScrollBarSize;
	var removeUtilElements = _TetherBase$Utils.removeUtilElements;
	
	function within(a, b) {
	  var diff = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];
	
	  return a + diff >= b && b >= a - diff;
	}
	
	var transformKey = (function () {
	  if (typeof document === 'undefined') {
	    return '';
	  }
	  var el = document.createElement('div');
	
	  var transforms = ['transform', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform'];
	  for (var i = 0; i < transforms.length; ++i) {
	    var key = transforms[i];
	    if (el.style[key] !== undefined) {
	      return key;
	    }
	  }
	})();
	
	var tethers = [];
	
	var position = function position() {
	  tethers.forEach(function (tether) {
	    tether.position(false);
	  });
	  flush();
	};
	
	function now() {
	  if (typeof performance === 'object' && typeof performance.now === 'function') {
	    return performance.now();
	  }
	  return +new Date();
	}
	
	(function () {
	  var lastCall = null;
	  var lastDuration = null;
	  var pendingTimeout = null;
	
	  var tick = function tick() {
	    if (typeof lastDuration !== 'undefined' && lastDuration > 16) {
	      // We voluntarily throttle ourselves if we can't manage 60fps
	      lastDuration = Math.min(lastDuration - 16, 250);
	
	      // Just in case this is the last event, remember to position just once more
	      pendingTimeout = setTimeout(tick, 250);
	      return;
	    }
	
	    if (typeof lastCall !== 'undefined' && now() - lastCall < 10) {
	      // Some browsers call events a little too frequently, refuse to run more than is reasonable
	      return;
	    }
	
	    if (pendingTimeout != null) {
	      clearTimeout(pendingTimeout);
	      pendingTimeout = null;
	    }
	
	    lastCall = now();
	    position();
	    lastDuration = now() - lastCall;
	  };
	
	  if (typeof window !== 'undefined' && typeof window.addEventListener !== 'undefined') {
	    ['resize', 'scroll', 'touchmove'].forEach(function (event) {
	      window.addEventListener(event, tick);
	    });
	  }
	})();
	
	var MIRROR_LR = {
	  center: 'center',
	  left: 'right',
	  right: 'left'
	};
	
	var MIRROR_TB = {
	  middle: 'middle',
	  top: 'bottom',
	  bottom: 'top'
	};
	
	var OFFSET_MAP = {
	  top: 0,
	  left: 0,
	  middle: '50%',
	  center: '50%',
	  bottom: '100%',
	  right: '100%'
	};
	
	var autoToFixedAttachment = function autoToFixedAttachment(attachment, relativeToAttachment) {
	  var left = attachment.left;
	  var top = attachment.top;
	
	  if (left === 'auto') {
	    left = MIRROR_LR[relativeToAttachment.left];
	  }
	
	  if (top === 'auto') {
	    top = MIRROR_TB[relativeToAttachment.top];
	  }
	
	  return { left: left, top: top };
	};
	
	var attachmentToOffset = function attachmentToOffset(attachment) {
	  var left = attachment.left;
	  var top = attachment.top;
	
	  if (typeof OFFSET_MAP[attachment.left] !== 'undefined') {
	    left = OFFSET_MAP[attachment.left];
	  }
	
	  if (typeof OFFSET_MAP[attachment.top] !== 'undefined') {
	    top = OFFSET_MAP[attachment.top];
	  }
	
	  return { left: left, top: top };
	};
	
	function addOffset() {
	  var out = { top: 0, left: 0 };
	
	  for (var _len = arguments.length, offsets = Array(_len), _key = 0; _key < _len; _key++) {
	    offsets[_key] = arguments[_key];
	  }
	
	  offsets.forEach(function (_ref) {
	    var top = _ref.top;
	    var left = _ref.left;
	
	    if (typeof top === 'string') {
	      top = parseFloat(top, 10);
	    }
	    if (typeof left === 'string') {
	      left = parseFloat(left, 10);
	    }
	
	    out.top += top;
	    out.left += left;
	  });
	
	  return out;
	}
	
	function offsetToPx(offset, size) {
	  if (typeof offset.left === 'string' && offset.left.indexOf('%') !== -1) {
	    offset.left = parseFloat(offset.left, 10) / 100 * size.width;
	  }
	  if (typeof offset.top === 'string' && offset.top.indexOf('%') !== -1) {
	    offset.top = parseFloat(offset.top, 10) / 100 * size.height;
	  }
	
	  return offset;
	}
	
	var parseOffset = function parseOffset(value) {
	  var _value$split = value.split(' ');
	
	  var _value$split2 = _slicedToArray(_value$split, 2);
	
	  var top = _value$split2[0];
	  var left = _value$split2[1];
	
	  return { top: top, left: left };
	};
	var parseAttachment = parseOffset;
	
	var TetherClass = (function (_Evented) {
	  _inherits(TetherClass, _Evented);
	
	  function TetherClass(options) {
	    var _this = this;
	
	    _classCallCheck(this, TetherClass);
	
	    _get(Object.getPrototypeOf(TetherClass.prototype), 'constructor', this).call(this);
	    this.position = this.position.bind(this);
	
	    tethers.push(this);
	
	    this.history = [];
	
	    this.setOptions(options, false);
	
	    TetherBase.modules.forEach(function (module) {
	      if (typeof module.initialize !== 'undefined') {
	        module.initialize.call(_this);
	      }
	    });
	
	    this.position();
	  }
	
	  _createClass(TetherClass, [{
	    key: 'getClass',
	    value: function getClass() {
	      var key = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	      var classes = this.options.classes;
	
	      if (typeof classes !== 'undefined' && classes[key]) {
	        return this.options.classes[key];
	      } else if (this.options.classPrefix) {
	        return this.options.classPrefix + '-' + key;
	      } else {
	        return key;
	      }
	    }
	  }, {
	    key: 'setOptions',
	    value: function setOptions(options) {
	      var _this2 = this;
	
	      var pos = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
	
	      var defaults = {
	        offset: '0 0',
	        targetOffset: '0 0',
	        targetAttachment: 'auto auto',
	        classPrefix: 'tether'
	      };
	
	      this.options = extend(defaults, options);
	
	      var _options = this.options;
	      var element = _options.element;
	      var target = _options.target;
	      var targetModifier = _options.targetModifier;
	
	      this.element = element;
	      this.target = target;
	      this.targetModifier = targetModifier;
	
	      if (this.target === 'viewport') {
	        this.target = document.body;
	        this.targetModifier = 'visible';
	      } else if (this.target === 'scroll-handle') {
	        this.target = document.body;
	        this.targetModifier = 'scroll-handle';
	      }
	
	      ['element', 'target'].forEach(function (key) {
	        if (typeof _this2[key] === 'undefined') {
	          throw new Error('Tether Error: Both element and target must be defined');
	        }
	
	        if (typeof _this2[key].jquery !== 'undefined') {
	          _this2[key] = _this2[key][0];
	        } else if (typeof _this2[key] === 'string') {
	          _this2[key] = document.querySelector(_this2[key]);
	        }
	      });
	
	      addClass(this.element, this.getClass('element'));
	      if (!(this.options.addTargetClasses === false)) {
	        addClass(this.target, this.getClass('target'));
	      }
	
	      if (!this.options.attachment) {
	        throw new Error('Tether Error: You must provide an attachment');
	      }
	
	      this.targetAttachment = parseAttachment(this.options.targetAttachment);
	      this.attachment = parseAttachment(this.options.attachment);
	      this.offset = parseOffset(this.options.offset);
	      this.targetOffset = parseOffset(this.options.targetOffset);
	
	      if (typeof this.scrollParents !== 'undefined') {
	        this.disable();
	      }
	
	      if (this.targetModifier === 'scroll-handle') {
	        this.scrollParents = [this.target];
	      } else {
	        this.scrollParents = getScrollParents(this.target);
	      }
	
	      if (!(this.options.enabled === false)) {
	        this.enable(pos);
	      }
	    }
	  }, {
	    key: 'getTargetBounds',
	    value: function getTargetBounds() {
	      if (typeof this.targetModifier !== 'undefined') {
	        if (this.targetModifier === 'visible') {
	          if (this.target === document.body) {
	            return { top: pageYOffset, left: pageXOffset, height: innerHeight, width: innerWidth };
	          } else {
	            var bounds = getBounds(this.target);
	
	            var out = {
	              height: bounds.height,
	              width: bounds.width,
	              top: bounds.top,
	              left: bounds.left
	            };
	
	            out.height = Math.min(out.height, bounds.height - (pageYOffset - bounds.top));
	            out.height = Math.min(out.height, bounds.height - (bounds.top + bounds.height - (pageYOffset + innerHeight)));
	            out.height = Math.min(innerHeight, out.height);
	            out.height -= 2;
	
	            out.width = Math.min(out.width, bounds.width - (pageXOffset - bounds.left));
	            out.width = Math.min(out.width, bounds.width - (bounds.left + bounds.width - (pageXOffset + innerWidth)));
	            out.width = Math.min(innerWidth, out.width);
	            out.width -= 2;
	
	            if (out.top < pageYOffset) {
	              out.top = pageYOffset;
	            }
	            if (out.left < pageXOffset) {
	              out.left = pageXOffset;
	            }
	
	            return out;
	          }
	        } else if (this.targetModifier === 'scroll-handle') {
	          var bounds = undefined;
	          var target = this.target;
	          if (target === document.body) {
	            target = document.documentElement;
	
	            bounds = {
	              left: pageXOffset,
	              top: pageYOffset,
	              height: innerHeight,
	              width: innerWidth
	            };
	          } else {
	            bounds = getBounds(target);
	          }
	
	          var style = getComputedStyle(target);
	
	          var hasBottomScroll = target.scrollWidth > target.clientWidth || [style.overflow, style.overflowX].indexOf('scroll') >= 0 || this.target !== document.body;
	
	          var scrollBottom = 0;
	          if (hasBottomScroll) {
	            scrollBottom = 15;
	          }
	
	          var height = bounds.height - parseFloat(style.borderTopWidth) - parseFloat(style.borderBottomWidth) - scrollBottom;
	
	          var out = {
	            width: 15,
	            height: height * 0.975 * (height / target.scrollHeight),
	            left: bounds.left + bounds.width - parseFloat(style.borderLeftWidth) - 15
	          };
	
	          var fitAdj = 0;
	          if (height < 408 && this.target === document.body) {
	            fitAdj = -0.00011 * Math.pow(height, 2) - 0.00727 * height + 22.58;
	          }
	
	          if (this.target !== document.body) {
	            out.height = Math.max(out.height, 24);
	          }
	
	          var scrollPercentage = this.target.scrollTop / (target.scrollHeight - height);
	          out.top = scrollPercentage * (height - out.height - fitAdj) + bounds.top + parseFloat(style.borderTopWidth);
	
	          if (this.target === document.body) {
	            out.height = Math.max(out.height, 24);
	          }
	
	          return out;
	        }
	      } else {
	        return getBounds(this.target);
	      }
	    }
	  }, {
	    key: 'clearCache',
	    value: function clearCache() {
	      this._cache = {};
	    }
	  }, {
	    key: 'cache',
	    value: function cache(k, getter) {
	      // More than one module will often need the same DOM info, so
	      // we keep a cache which is cleared on each position call
	      if (typeof this._cache === 'undefined') {
	        this._cache = {};
	      }
	
	      if (typeof this._cache[k] === 'undefined') {
	        this._cache[k] = getter.call(this);
	      }
	
	      return this._cache[k];
	    }
	  }, {
	    key: 'enable',
	    value: function enable() {
	      var _this3 = this;
	
	      var pos = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
	
	      if (!(this.options.addTargetClasses === false)) {
	        addClass(this.target, this.getClass('enabled'));
	      }
	      addClass(this.element, this.getClass('enabled'));
	      this.enabled = true;
	
	      this.scrollParents.forEach(function (parent) {
	        if (parent !== _this3.target.ownerDocument) {
	          parent.addEventListener('scroll', _this3.position);
	        }
	      });
	
	      if (pos) {
	        this.position();
	      }
	    }
	  }, {
	    key: 'disable',
	    value: function disable() {
	      var _this4 = this;
	
	      removeClass(this.target, this.getClass('enabled'));
	      removeClass(this.element, this.getClass('enabled'));
	      this.enabled = false;
	
	      if (typeof this.scrollParents !== 'undefined') {
	        this.scrollParents.forEach(function (parent) {
	          parent.removeEventListener('scroll', _this4.position);
	        });
	      }
	    }
	  }, {
	    key: 'destroy',
	    value: function destroy() {
	      var _this5 = this;
	
	      this.disable();
	
	      tethers.forEach(function (tether, i) {
	        if (tether === _this5) {
	          tethers.splice(i, 1);
	        }
	      });
	
	      // Remove any elements we were using for convenience from the DOM
	      if (tethers.length === 0) {
	        removeUtilElements();
	      }
	    }
	  }, {
	    key: 'updateAttachClasses',
	    value: function updateAttachClasses(elementAttach, targetAttach) {
	      var _this6 = this;
	
	      elementAttach = elementAttach || this.attachment;
	      targetAttach = targetAttach || this.targetAttachment;
	      var sides = ['left', 'top', 'bottom', 'right', 'middle', 'center'];
	
	      if (typeof this._addAttachClasses !== 'undefined' && this._addAttachClasses.length) {
	        // updateAttachClasses can be called more than once in a position call, so
	        // we need to clean up after ourselves such that when the last defer gets
	        // ran it doesn't add any extra classes from previous calls.
	        this._addAttachClasses.splice(0, this._addAttachClasses.length);
	      }
	
	      if (typeof this._addAttachClasses === 'undefined') {
	        this._addAttachClasses = [];
	      }
	      var add = this._addAttachClasses;
	
	      if (elementAttach.top) {
	        add.push(this.getClass('element-attached') + '-' + elementAttach.top);
	      }
	      if (elementAttach.left) {
	        add.push(this.getClass('element-attached') + '-' + elementAttach.left);
	      }
	      if (targetAttach.top) {
	        add.push(this.getClass('target-attached') + '-' + targetAttach.top);
	      }
	      if (targetAttach.left) {
	        add.push(this.getClass('target-attached') + '-' + targetAttach.left);
	      }
	
	      var all = [];
	      sides.forEach(function (side) {
	        all.push(_this6.getClass('element-attached') + '-' + side);
	        all.push(_this6.getClass('target-attached') + '-' + side);
	      });
	
	      defer(function () {
	        if (!(typeof _this6._addAttachClasses !== 'undefined')) {
	          return;
	        }
	
	        updateClasses(_this6.element, _this6._addAttachClasses, all);
	        if (!(_this6.options.addTargetClasses === false)) {
	          updateClasses(_this6.target, _this6._addAttachClasses, all);
	        }
	
	        delete _this6._addAttachClasses;
	      });
	    }
	  }, {
	    key: 'position',
	    value: function position() {
	      var _this7 = this;
	
	      var flushChanges = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
	
	      // flushChanges commits the changes immediately, leave true unless you are positioning multiple
	      // tethers (in which case call Tether.Utils.flush yourself when you're done)
	
	      if (!this.enabled) {
	        return;
	      }
	
	      this.clearCache();
	
	      // Turn 'auto' attachments into the appropriate corner or edge
	      var targetAttachment = autoToFixedAttachment(this.targetAttachment, this.attachment);
	
	      this.updateAttachClasses(this.attachment, targetAttachment);
	
	      var elementPos = this.cache('element-bounds', function () {
	        return getBounds(_this7.element);
	      });
	
	      var width = elementPos.width;
	      var height = elementPos.height;
	
	      if (width === 0 && height === 0 && typeof this.lastSize !== 'undefined') {
	        var _lastSize = this.lastSize;
	
	        // We cache the height and width to make it possible to position elements that are
	        // getting hidden.
	        width = _lastSize.width;
	        height = _lastSize.height;
	      } else {
	        this.lastSize = { width: width, height: height };
	      }
	
	      var targetPos = this.cache('target-bounds', function () {
	        return _this7.getTargetBounds();
	      });
	      var targetSize = targetPos;
	
	      // Get an actual px offset from the attachment
	      var offset = offsetToPx(attachmentToOffset(this.attachment), { width: width, height: height });
	      var targetOffset = offsetToPx(attachmentToOffset(targetAttachment), targetSize);
	
	      var manualOffset = offsetToPx(this.offset, { width: width, height: height });
	      var manualTargetOffset = offsetToPx(this.targetOffset, targetSize);
	
	      // Add the manually provided offset
	      offset = addOffset(offset, manualOffset);
	      targetOffset = addOffset(targetOffset, manualTargetOffset);
	
	      // It's now our goal to make (element position + offset) == (target position + target offset)
	      var left = targetPos.left + targetOffset.left - offset.left;
	      var top = targetPos.top + targetOffset.top - offset.top;
	
	      for (var i = 0; i < TetherBase.modules.length; ++i) {
	        var _module2 = TetherBase.modules[i];
	        var ret = _module2.position.call(this, {
	          left: left,
	          top: top,
	          targetAttachment: targetAttachment,
	          targetPos: targetPos,
	          elementPos: elementPos,
	          offset: offset,
	          targetOffset: targetOffset,
	          manualOffset: manualOffset,
	          manualTargetOffset: manualTargetOffset,
	          scrollbarSize: scrollbarSize,
	          attachment: this.attachment
	        });
	
	        if (ret === false) {
	          return false;
	        } else if (typeof ret === 'undefined' || typeof ret !== 'object') {
	          continue;
	        } else {
	          top = ret.top;
	          left = ret.left;
	        }
	      }
	
	      // We describe the position three different ways to give the optimizer
	      // a chance to decide the best possible way to position the element
	      // with the fewest repaints.
	      var next = {
	        // It's position relative to the page (absolute positioning when
	        // the element is a child of the body)
	        page: {
	          top: top,
	          left: left
	        },
	
	        // It's position relative to the viewport (fixed positioning)
	        viewport: {
	          top: top - pageYOffset,
	          bottom: pageYOffset - top - height + innerHeight,
	          left: left - pageXOffset,
	          right: pageXOffset - left - width + innerWidth
	        }
	      };
	
	      var doc = this.target.ownerDocument;
	      var win = doc.defaultView;
	
	      var scrollbarSize = undefined;
	      if (win.innerHeight > doc.documentElement.clientHeight) {
	        scrollbarSize = this.cache('scrollbar-size', getScrollBarSize);
	        next.viewport.bottom -= scrollbarSize.height;
	      }
	
	      if (win.innerWidth > doc.documentElement.clientWidth) {
	        scrollbarSize = this.cache('scrollbar-size', getScrollBarSize);
	        next.viewport.right -= scrollbarSize.width;
	      }
	
	      if (['', 'static'].indexOf(doc.body.style.position) === -1 || ['', 'static'].indexOf(doc.body.parentElement.style.position) === -1) {
	        // Absolute positioning in the body will be relative to the page, not the 'initial containing block'
	        next.page.bottom = doc.body.scrollHeight - top - height;
	        next.page.right = doc.body.scrollWidth - left - width;
	      }
	
	      if (typeof this.options.optimizations !== 'undefined' && this.options.optimizations.moveElement !== false && !(typeof this.targetModifier !== 'undefined')) {
	        (function () {
	          var offsetParent = _this7.cache('target-offsetparent', function () {
	            return getOffsetParent(_this7.target);
	          });
	          var offsetPosition = _this7.cache('target-offsetparent-bounds', function () {
	            return getBounds(offsetParent);
	          });
	          var offsetParentStyle = getComputedStyle(offsetParent);
	          var offsetParentSize = offsetPosition;
	
	          var offsetBorder = {};
	          ['Top', 'Left', 'Bottom', 'Right'].forEach(function (side) {
	            offsetBorder[side.toLowerCase()] = parseFloat(offsetParentStyle['border' + side + 'Width']);
	          });
	
	          offsetPosition.right = doc.body.scrollWidth - offsetPosition.left - offsetParentSize.width + offsetBorder.right;
	          offsetPosition.bottom = doc.body.scrollHeight - offsetPosition.top - offsetParentSize.height + offsetBorder.bottom;
	
	          if (next.page.top >= offsetPosition.top + offsetBorder.top && next.page.bottom >= offsetPosition.bottom) {
	            if (next.page.left >= offsetPosition.left + offsetBorder.left && next.page.right >= offsetPosition.right) {
	              // We're within the visible part of the target's scroll parent
	              var scrollTop = offsetParent.scrollTop;
	              var scrollLeft = offsetParent.scrollLeft;
	
	              // It's position relative to the target's offset parent (absolute positioning when
	              // the element is moved to be a child of the target's offset parent).
	              next.offset = {
	                top: next.page.top - offsetPosition.top + scrollTop - offsetBorder.top,
	                left: next.page.left - offsetPosition.left + scrollLeft - offsetBorder.left
	              };
	            }
	          }
	        })();
	      }
	
	      // We could also travel up the DOM and try each containing context, rather than only
	      // looking at the body, but we're gonna get diminishing returns.
	
	      this.move(next);
	
	      this.history.unshift(next);
	
	      if (this.history.length > 3) {
	        this.history.pop();
	      }
	
	      if (flushChanges) {
	        flush();
	      }
	
	      return true;
	    }
	
	    // THE ISSUE
	  }, {
	    key: 'move',
	    value: function move(pos) {
	      var _this8 = this;
	
	      if (!(typeof this.element.parentNode !== 'undefined')) {
	        return;
	      }
	
	      var same = {};
	
	      for (var type in pos) {
	        same[type] = {};
	
	        for (var key in pos[type]) {
	          var found = false;
	
	          for (var i = 0; i < this.history.length; ++i) {
	            var point = this.history[i];
	            if (typeof point[type] !== 'undefined' && !within(point[type][key], pos[type][key])) {
	              found = true;
	              break;
	            }
	          }
	
	          if (!found) {
	            same[type][key] = true;
	          }
	        }
	      }
	
	      var css = { top: '', left: '', right: '', bottom: '' };
	
	      var transcribe = function transcribe(_same, _pos) {
	        var hasOptimizations = typeof _this8.options.optimizations !== 'undefined';
	        var gpu = hasOptimizations ? _this8.options.optimizations.gpu : null;
	        if (gpu !== false) {
	          var yPos = undefined,
	              xPos = undefined;
	          if (_same.top) {
	            css.top = 0;
	            yPos = _pos.top;
	          } else {
	            css.bottom = 0;
	            yPos = -_pos.bottom;
	          }
	
	          if (_same.left) {
	            css.left = 0;
	            xPos = _pos.left;
	          } else {
	            css.right = 0;
	            xPos = -_pos.right;
	          }
	
	          if (typeof window.devicePixelRatio === 'number' && devicePixelRatio % 1 === 0) {
	            xPos = Math.round(xPos * devicePixelRatio) / devicePixelRatio;
	            yPos = Math.round(yPos * devicePixelRatio) / devicePixelRatio;
	          }
	
	          css[transformKey] = 'translateX(' + xPos + 'px) translateY(' + yPos + 'px)';
	
	          if (transformKey !== 'msTransform') {
	            // The Z transform will keep this in the GPU (faster, and prevents artifacts),
	            // but IE9 doesn't support 3d transforms and will choke.
	            css[transformKey] += " translateZ(0)";
	          }
	        } else {
	          if (_same.top) {
	            css.top = _pos.top + 'px';
	          } else {
	            css.bottom = _pos.bottom + 'px';
	          }
	
	          if (_same.left) {
	            css.left = _pos.left + 'px';
	          } else {
	            css.right = _pos.right + 'px';
	          }
	        }
	      };
	
	      var moved = false;
	      if ((same.page.top || same.page.bottom) && (same.page.left || same.page.right)) {
	        css.position = 'absolute';
	        transcribe(same.page, pos.page);
	      } else if ((same.viewport.top || same.viewport.bottom) && (same.viewport.left || same.viewport.right)) {
	        css.position = 'fixed';
	        transcribe(same.viewport, pos.viewport);
	      } else if (typeof same.offset !== 'undefined' && same.offset.top && same.offset.left) {
	        (function () {
	          css.position = 'absolute';
	          var offsetParent = _this8.cache('target-offsetparent', function () {
	            return getOffsetParent(_this8.target);
	          });
	
	          if (getOffsetParent(_this8.element) !== offsetParent) {
	            defer(function () {
	              _this8.element.parentNode.removeChild(_this8.element);
	              offsetParent.appendChild(_this8.element);
	            });
	          }
	
	          transcribe(same.offset, pos.offset);
	          moved = true;
	        })();
	      } else {
	        css.position = 'absolute';
	        transcribe({ top: true, left: true }, pos.page);
	      }
	
	      if (!moved) {
	        if (this.options.bodyElement) {
	          if (this.element.parentNode !== this.options.bodyElement) {
	            this.options.bodyElement.appendChild(this.element);
	          }
	        } else {
	          var isFullscreenElement = function isFullscreenElement(e) {
	            var d = e.ownerDocument;
	            var fe = d.fullscreenElement || d.webkitFullscreenElement || d.mozFullScreenElement || d.msFullscreenElement;
	            return fe === e;
	          };
	
	          var offsetParentIsBody = true;
	
	          var currentNode = this.element.parentNode;
	          while (currentNode && currentNode.nodeType === 1 && currentNode.tagName !== 'BODY' && !isFullscreenElement(currentNode)) {
	            if (getComputedStyle(currentNode).position !== 'static') {
	              offsetParentIsBody = false;
	              break;
	            }
	
	            currentNode = currentNode.parentNode;
	          }
	
	          if (!offsetParentIsBody) {
	            this.element.parentNode.removeChild(this.element);
	            this.element.ownerDocument.body.appendChild(this.element);
	          }
	        }
	      }
	
	      // Any css change will trigger a repaint, so let's avoid one if nothing changed
	      var writeCSS = {};
	      var write = false;
	      for (var key in css) {
	        var val = css[key];
	        var elVal = this.element.style[key];
	
	        if (elVal !== val) {
	          write = true;
	          writeCSS[key] = val;
	        }
	      }
	
	      if (write) {
	        defer(function () {
	          extend(_this8.element.style, writeCSS);
	          _this8.trigger('repositioned');
	        });
	      }
	    }
	  }]);
	
	  return TetherClass;
	})(Evented);
	
	TetherClass.modules = [];
	
	TetherBase.position = position;
	
	var Tether = extend(TetherClass, TetherBase);
	/* globals TetherBase */
	
	'use strict';
	
	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();
	
	var _TetherBase$Utils = TetherBase.Utils;
	var getBounds = _TetherBase$Utils.getBounds;
	var extend = _TetherBase$Utils.extend;
	var updateClasses = _TetherBase$Utils.updateClasses;
	var defer = _TetherBase$Utils.defer;
	
	var BOUNDS_FORMAT = ['left', 'top', 'right', 'bottom'];
	
	function getBoundingRect(tether, to) {
	  if (to === 'scrollParent') {
	    to = tether.scrollParents[0];
	  } else if (to === 'window') {
	    to = [pageXOffset, pageYOffset, innerWidth + pageXOffset, innerHeight + pageYOffset];
	  }
	
	  if (to === document) {
	    to = to.documentElement;
	  }
	
	  if (typeof to.nodeType !== 'undefined') {
	    (function () {
	      var node = to;
	      var size = getBounds(to);
	      var pos = size;
	      var style = getComputedStyle(to);
	
	      to = [pos.left, pos.top, size.width + pos.left, size.height + pos.top];
	
	      // Account any parent Frames scroll offset
	      if (node.ownerDocument !== document) {
	        var win = node.ownerDocument.defaultView;
	        to[0] += win.pageXOffset;
	        to[1] += win.pageYOffset;
	        to[2] += win.pageXOffset;
	        to[3] += win.pageYOffset;
	      }
	
	      BOUNDS_FORMAT.forEach(function (side, i) {
	        side = side[0].toUpperCase() + side.substr(1);
	        if (side === 'Top' || side === 'Left') {
	          to[i] += parseFloat(style['border' + side + 'Width']);
	        } else {
	          to[i] -= parseFloat(style['border' + side + 'Width']);
	        }
	      });
	    })();
	  }
	
	  return to;
	}
	
	TetherBase.modules.push({
	  position: function position(_ref) {
	    var _this = this;
	
	    var top = _ref.top;
	    var left = _ref.left;
	    var targetAttachment = _ref.targetAttachment;
	
	    if (!this.options.constraints) {
	      return true;
	    }
	
	    var _cache = this.cache('element-bounds', function () {
	      return getBounds(_this.element);
	    });
	
	    var height = _cache.height;
	    var width = _cache.width;
	
	    if (width === 0 && height === 0 && typeof this.lastSize !== 'undefined') {
	      var _lastSize = this.lastSize;
	
	      // Handle the item getting hidden as a result of our positioning without glitching
	      // the classes in and out
	      width = _lastSize.width;
	      height = _lastSize.height;
	    }
	
	    var targetSize = this.cache('target-bounds', function () {
	      return _this.getTargetBounds();
	    });
	
	    var targetHeight = targetSize.height;
	    var targetWidth = targetSize.width;
	
	    var allClasses = [this.getClass('pinned'), this.getClass('out-of-bounds')];
	
	    this.options.constraints.forEach(function (constraint) {
	      var outOfBoundsClass = constraint.outOfBoundsClass;
	      var pinnedClass = constraint.pinnedClass;
	
	      if (outOfBoundsClass) {
	        allClasses.push(outOfBoundsClass);
	      }
	      if (pinnedClass) {
	        allClasses.push(pinnedClass);
	      }
	    });
	
	    allClasses.forEach(function (cls) {
	      ['left', 'top', 'right', 'bottom'].forEach(function (side) {
	        allClasses.push(cls + '-' + side);
	      });
	    });
	
	    var addClasses = [];
	
	    var tAttachment = extend({}, targetAttachment);
	    var eAttachment = extend({}, this.attachment);
	
	    this.options.constraints.forEach(function (constraint) {
	      var to = constraint.to;
	      var attachment = constraint.attachment;
	      var pin = constraint.pin;
	
	      if (typeof attachment === 'undefined') {
	        attachment = '';
	      }
	
	      var changeAttachX = undefined,
	          changeAttachY = undefined;
	      if (attachment.indexOf(' ') >= 0) {
	        var _attachment$split = attachment.split(' ');
	
	        var _attachment$split2 = _slicedToArray(_attachment$split, 2);
	
	        changeAttachY = _attachment$split2[0];
	        changeAttachX = _attachment$split2[1];
	      } else {
	        changeAttachX = changeAttachY = attachment;
	      }
	
	      var bounds = getBoundingRect(_this, to);
	
	      if (changeAttachY === 'target' || changeAttachY === 'both') {
	        if (top < bounds[1] && tAttachment.top === 'top') {
	          top += targetHeight;
	          tAttachment.top = 'bottom';
	        }
	
	        if (top + height > bounds[3] && tAttachment.top === 'bottom') {
	          top -= targetHeight;
	          tAttachment.top = 'top';
	        }
	      }
	
	      if (changeAttachY === 'together') {
	        if (tAttachment.top === 'top') {
	          if (eAttachment.top === 'bottom' && top < bounds[1]) {
	            top += targetHeight;
	            tAttachment.top = 'bottom';
	
	            top += height;
	            eAttachment.top = 'top';
	          } else if (eAttachment.top === 'top' && top + height > bounds[3] && top - (height - targetHeight) >= bounds[1]) {
	            top -= height - targetHeight;
	            tAttachment.top = 'bottom';
	
	            eAttachment.top = 'bottom';
	          }
	        }
	
	        if (tAttachment.top === 'bottom') {
	          if (eAttachment.top === 'top' && top + height > bounds[3]) {
	            top -= targetHeight;
	            tAttachment.top = 'top';
	
	            top -= height;
	            eAttachment.top = 'bottom';
	          } else if (eAttachment.top === 'bottom' && top < bounds[1] && top + (height * 2 - targetHeight) <= bounds[3]) {
	            top += height - targetHeight;
	            tAttachment.top = 'top';
	
	            eAttachment.top = 'top';
	          }
	        }
	
	        if (tAttachment.top === 'middle') {
	          if (top + height > bounds[3] && eAttachment.top === 'top') {
	            top -= height;
	            eAttachment.top = 'bottom';
	          } else if (top < bounds[1] && eAttachment.top === 'bottom') {
	            top += height;
	            eAttachment.top = 'top';
	          }
	        }
	      }
	
	      if (changeAttachX === 'target' || changeAttachX === 'both') {
	        if (left < bounds[0] && tAttachment.left === 'left') {
	          left += targetWidth;
	          tAttachment.left = 'right';
	        }
	
	        if (left + width > bounds[2] && tAttachment.left === 'right') {
	          left -= targetWidth;
	          tAttachment.left = 'left';
	        }
	      }
	
	      if (changeAttachX === 'together') {
	        if (left < bounds[0] && tAttachment.left === 'left') {
	          if (eAttachment.left === 'right') {
	            left += targetWidth;
	            tAttachment.left = 'right';
	
	            left += width;
	            eAttachment.left = 'left';
	          } else if (eAttachment.left === 'left') {
	            left += targetWidth;
	            tAttachment.left = 'right';
	
	            left -= width;
	            eAttachment.left = 'right';
	          }
	        } else if (left + width > bounds[2] && tAttachment.left === 'right') {
	          if (eAttachment.left === 'left') {
	            left -= targetWidth;
	            tAttachment.left = 'left';
	
	            left -= width;
	            eAttachment.left = 'right';
	          } else if (eAttachment.left === 'right') {
	            left -= targetWidth;
	            tAttachment.left = 'left';
	
	            left += width;
	            eAttachment.left = 'left';
	          }
	        } else if (tAttachment.left === 'center') {
	          if (left + width > bounds[2] && eAttachment.left === 'left') {
	            left -= width;
	            eAttachment.left = 'right';
	          } else if (left < bounds[0] && eAttachment.left === 'right') {
	            left += width;
	            eAttachment.left = 'left';
	          }
	        }
	      }
	
	      if (changeAttachY === 'element' || changeAttachY === 'both') {
	        if (top < bounds[1] && eAttachment.top === 'bottom') {
	          top += height;
	          eAttachment.top = 'top';
	        }
	
	        if (top + height > bounds[3] && eAttachment.top === 'top') {
	          top -= height;
	          eAttachment.top = 'bottom';
	        }
	      }
	
	      if (changeAttachX === 'element' || changeAttachX === 'both') {
	        if (left < bounds[0]) {
	          if (eAttachment.left === 'right') {
	            left += width;
	            eAttachment.left = 'left';
	          } else if (eAttachment.left === 'center') {
	            left += width / 2;
	            eAttachment.left = 'left';
	          }
	        }
	
	        if (left + width > bounds[2]) {
	          if (eAttachment.left === 'left') {
	            left -= width;
	            eAttachment.left = 'right';
	          } else if (eAttachment.left === 'center') {
	            left -= width / 2;
	            eAttachment.left = 'right';
	          }
	        }
	      }
	
	      if (typeof pin === 'string') {
	        pin = pin.split(',').map(function (p) {
	          return p.trim();
	        });
	      } else if (pin === true) {
	        pin = ['top', 'left', 'right', 'bottom'];
	      }
	
	      pin = pin || [];
	
	      var pinned = [];
	      var oob = [];
	
	      if (top < bounds[1]) {
	        if (pin.indexOf('top') >= 0) {
	          top = bounds[1];
	          pinned.push('top');
	        } else {
	          oob.push('top');
	        }
	      }
	
	      if (top + height > bounds[3]) {
	        if (pin.indexOf('bottom') >= 0) {
	          top = bounds[3] - height;
	          pinned.push('bottom');
	        } else {
	          oob.push('bottom');
	        }
	      }
	
	      if (left < bounds[0]) {
	        if (pin.indexOf('left') >= 0) {
	          left = bounds[0];
	          pinned.push('left');
	        } else {
	          oob.push('left');
	        }
	      }
	
	      if (left + width > bounds[2]) {
	        if (pin.indexOf('right') >= 0) {
	          left = bounds[2] - width;
	          pinned.push('right');
	        } else {
	          oob.push('right');
	        }
	      }
	
	      if (pinned.length) {
	        (function () {
	          var pinnedClass = undefined;
	          if (typeof _this.options.pinnedClass !== 'undefined') {
	            pinnedClass = _this.options.pinnedClass;
	          } else {
	            pinnedClass = _this.getClass('pinned');
	          }
	
	          addClasses.push(pinnedClass);
	          pinned.forEach(function (side) {
	            addClasses.push(pinnedClass + '-' + side);
	          });
	        })();
	      }
	
	      if (oob.length) {
	        (function () {
	          var oobClass = undefined;
	          if (typeof _this.options.outOfBoundsClass !== 'undefined') {
	            oobClass = _this.options.outOfBoundsClass;
	          } else {
	            oobClass = _this.getClass('out-of-bounds');
	          }
	
	          addClasses.push(oobClass);
	          oob.forEach(function (side) {
	            addClasses.push(oobClass + '-' + side);
	          });
	        })();
	      }
	
	      if (pinned.indexOf('left') >= 0 || pinned.indexOf('right') >= 0) {
	        eAttachment.left = tAttachment.left = false;
	      }
	      if (pinned.indexOf('top') >= 0 || pinned.indexOf('bottom') >= 0) {
	        eAttachment.top = tAttachment.top = false;
	      }
	
	      if (tAttachment.top !== targetAttachment.top || tAttachment.left !== targetAttachment.left || eAttachment.top !== _this.attachment.top || eAttachment.left !== _this.attachment.left) {
	        _this.updateAttachClasses(eAttachment, tAttachment);
	        _this.trigger('update', {
	          attachment: eAttachment,
	          targetAttachment: tAttachment
	        });
	      }
	    });
	
	    defer(function () {
	      if (!(_this.options.addTargetClasses === false)) {
	        updateClasses(_this.target, addClasses, allClasses);
	      }
	      updateClasses(_this.element, addClasses, allClasses);
	    });
	
	    return { top: top, left: left };
	  }
	});
	/* globals TetherBase */
	
	'use strict';
	
	var _TetherBase$Utils = TetherBase.Utils;
	var getBounds = _TetherBase$Utils.getBounds;
	var updateClasses = _TetherBase$Utils.updateClasses;
	var defer = _TetherBase$Utils.defer;
	
	TetherBase.modules.push({
	  position: function position(_ref) {
	    var _this = this;
	
	    var top = _ref.top;
	    var left = _ref.left;
	
	    var _cache = this.cache('element-bounds', function () {
	      return getBounds(_this.element);
	    });
	
	    var height = _cache.height;
	    var width = _cache.width;
	
	    var targetPos = this.getTargetBounds();
	
	    var bottom = top + height;
	    var right = left + width;
	
	    var abutted = [];
	    if (top <= targetPos.bottom && bottom >= targetPos.top) {
	      ['left', 'right'].forEach(function (side) {
	        var targetPosSide = targetPos[side];
	        if (targetPosSide === left || targetPosSide === right) {
	          abutted.push(side);
	        }
	      });
	    }
	
	    if (left <= targetPos.right && right >= targetPos.left) {
	      ['top', 'bottom'].forEach(function (side) {
	        var targetPosSide = targetPos[side];
	        if (targetPosSide === top || targetPosSide === bottom) {
	          abutted.push(side);
	        }
	      });
	    }
	
	    var allClasses = [];
	    var addClasses = [];
	
	    var sides = ['left', 'top', 'right', 'bottom'];
	    allClasses.push(this.getClass('abutted'));
	    sides.forEach(function (side) {
	      allClasses.push(_this.getClass('abutted') + '-' + side);
	    });
	
	    if (abutted.length) {
	      addClasses.push(this.getClass('abutted'));
	    }
	
	    abutted.forEach(function (side) {
	      addClasses.push(_this.getClass('abutted') + '-' + side);
	    });
	
	    defer(function () {
	      if (!(_this.options.addTargetClasses === false)) {
	        updateClasses(_this.target, addClasses, allClasses);
	      }
	      updateClasses(_this.element, addClasses, allClasses);
	    });
	
	    return true;
	  }
	});
	/* globals TetherBase */
	
	'use strict';
	
	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();
	
	TetherBase.modules.push({
	  position: function position(_ref) {
	    var top = _ref.top;
	    var left = _ref.left;
	
	    if (!this.options.shift) {
	      return;
	    }
	
	    var shift = this.options.shift;
	    if (typeof this.options.shift === 'function') {
	      shift = this.options.shift.call(this, { top: top, left: left });
	    }
	
	    var shiftTop = undefined,
	        shiftLeft = undefined;
	    if (typeof shift === 'string') {
	      shift = shift.split(' ');
	      shift[1] = shift[1] || shift[0];
	
	      var _shift = shift;
	
	      var _shift2 = _slicedToArray(_shift, 2);
	
	      shiftTop = _shift2[0];
	      shiftLeft = _shift2[1];
	
	      shiftTop = parseFloat(shiftTop, 10);
	      shiftLeft = parseFloat(shiftLeft, 10);
	    } else {
	      shiftTop = shift.top;
	      shiftLeft = shift.left;
	    }
	
	    top += shiftTop;
	    left += shiftLeft;
	
	    return { top: top, left: left };
	  }
	});
	return Tether;
	
	}));


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _component = __webpack_require__(2);
	
	var _component2 = _interopRequireDefault(_component);
	
	var _resizeObserver = __webpack_require__(3);
	
	var _resizeObserver2 = _interopRequireDefault(_resizeObserver);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var SELECTOR_COMPONENT = '.aui-js-breadcrumb';
	var CLASS_ITEMS = 'aui-breadcrumb__items';
	var CLASS_IS_OVERSIZED = 'is-oversized';
	
	/**
	 * Class constructor for Breadcrumb AUI component.
	 * Implements AUI component design pattern defined at:
	 * https://github.com/...
	 *
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	
	var Breadcrumb = function (_Component) {
	  _inherits(Breadcrumb, _Component);
	
	  /**
	   * Upgrades all Breadcrumb AUI components.
	   * @returns {Array} Returns an array of all newly upgraded components.
	   */
	  Breadcrumb.upgradeElements = function upgradeElements() {
	    var components = [];
	    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(function (element) {
	      if (!_component2.default.isElementUpgraded(element)) {
	        components.push(new Breadcrumb(element));
	      }
	    });
	    return components;
	  };
	
	  function Breadcrumb(element) {
	    _classCallCheck(this, Breadcrumb);
	
	    return _possibleConstructorReturn(this, _Component.call(this, element));
	  }
	
	  Breadcrumb.prototype.init = function init() {
	    var _this2 = this;
	
	    _Component.prototype.init.call(this);
	
	    this._items = this._element.querySelector('.' + CLASS_ITEMS);
	
	    this._resizeObserver = new _resizeObserver2.default();
	    this._resizeObserver.resized.add(this._resizedHandler = function () {
	      return _this2.update();
	    });
	
	    this.update();
	  };
	
	  Breadcrumb.prototype.update = function update() {
	    this._checkSize();
	  };
	
	  Breadcrumb.prototype.dispose = function dispose() {
	    _Component.prototype.dispose.call(this);
	
	    this._resizeObserver.resized.remove(this._resizedHandler);
	  };
	
	  Breadcrumb.prototype._checkSize = function _checkSize() {
	    if (this._items.scrollWidth > this._items.offsetWidth) {
	      this._items.scrollLeft = 9999;
	      this._element.classList.add(CLASS_IS_OVERSIZED);
	    } else {
	      this._element.classList.remove(CLASS_IS_OVERSIZED);
	    }
	  };
	
	  return Breadcrumb;
	}(_component2.default);
	
	exports.default = Breadcrumb;
	module.exports = exports['default'];

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _component = __webpack_require__(2);
	
	var _component2 = _interopRequireDefault(_component);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var NAMESPACE = 'auiCheckbox';
	var SELECTOR_COMPONENT = '.aui-js-checkbox';
	var CLASS_INPUT = 'aui-checkbox__input';
	var CLASS_LABEL = 'aui-checkbox__label';
	var CLASS_BOX = 'aui-checkbox__box';
	var CLASS_TICK = 'aui-checkbox__tick';
	var CLASS_IS_FOCUS = 'is-focused';
	var CLASS_IS_CHECKED = 'is-checked';
	var CLASS_IS_DISABLED = 'is-disabled';
	
	/**
	 * Class constructor for Checkbox AUI component.
	 * Implements AUI component design pattern defined at:
	 * https://github.com/...
	 *
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	
	var Checkbox = function (_Component) {
	  _inherits(Checkbox, _Component);
	
	  /**
	   * Upgrades all Checkbox AUI components.
	   * @returns {Array} Returns an array of all newly upgraded components.
	   */
	  Checkbox.upgradeElements = function upgradeElements() {
	    var components = [];
	    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(function (element) {
	      if (!_component2.default.isElementUpgraded(element)) {
	        components.push(new Checkbox(element));
	      }
	    });
	    return components;
	  };
	
	  /**
	   * Returns all AUI component instances within the given container
	   * @param {HTMLElement} container The container element to search for components
	   * @returns {Array} Returns an array of all newly upgraded components.
	   */
	  Checkbox.get = function get() {
	    var container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
	
	    var components = [];
	    if (container) {
	      Array.from(container.querySelectorAll(SELECTOR_COMPONENT)).forEach(function (element) {
	        components.push(element.auiCheckbox);
	      });
	    }
	    return components;
	  };
	
	  function Checkbox(element) {
	    _classCallCheck(this, Checkbox);
	
	    return _possibleConstructorReturn(this, _Component.call(this, element, NAMESPACE));
	  }
	
	  Checkbox.prototype.init = function init() {
	    var _this2 = this;
	
	    _Component.prototype.init.call(this);
	
	    this._input = this._element.querySelector('.' + CLASS_INPUT);
	    this._input.addEventListener('change', this._changeHandler = function (event) {
	      return _this2._onChange(event);
	    });
	    this._input.addEventListener('focus', this._focusHandler = function (event) {
	      return _this2._onFocus(event);
	    });
	    this._input.addEventListener('blur', this._blurHandler = function (event) {
	      return _this2._onBlur(event);
	    });
	
	    // Insert box with tick after label element:
	    this._label = this._element.querySelector('.' + CLASS_LABEL);
	    var box = document.createElement('span');
	    box.classList.add(CLASS_BOX);
	    this._label.parentNode.insertBefore(box, this._label.nextSibling);
	    var tick = document.createElement('span');
	    tick.classList.add(CLASS_TICK);
	    box.appendChild(tick);
	
	    this.updateClasses();
	  };
	
	  Checkbox.prototype.updateClasses = function updateClasses() {
	    this.checkDisabled();
	    this.checkToggleState();
	    this.checkFocus();
	  };
	
	  /**
	   * Check the disabled state and update field accordingly.
	   */
	
	
	  Checkbox.prototype.checkDisabled = function checkDisabled() {
	    if (this._input.disabled) {
	      this._element.classList.add(CLASS_IS_DISABLED);
	    } else {
	      this._element.classList.remove(CLASS_IS_DISABLED);
	    }
	  };
	
	  /**
	   * Check the toggle state and update field accordingly.
	   */
	
	
	  Checkbox.prototype.checkToggleState = function checkToggleState() {
	    if (this._input.checked) {
	      this._element.classList.add(CLASS_IS_CHECKED);
	    } else {
	      this._element.classList.remove(CLASS_IS_CHECKED);
	    }
	  };
	
	  /**
	   * Check the focus state and update field accordingly.
	   */
	
	
	  Checkbox.prototype.checkFocus = function checkFocus() {
	    if (Boolean(this._element.querySelector(':focus'))) {
	      this._element.classList.add(CLASS_IS_FOCUS);
	    } else {
	      this._element.classList.remove(CLASS_IS_FOCUS);
	    }
	  };
	
	  /**
	   * Enable checkbox
	   */
	
	
	  Checkbox.prototype.enable = function enable() {
	    this._input.disabled = false;
	    this.updateClasses();
	  };
	
	  /**
	   * Disable checkbox
	   */
	
	
	  Checkbox.prototype.disable = function disable() {
	    this._input.disabled = true;
	    this.updateClasses();
	  };
	
	  /**
	   * Check checkbox
	   */
	
	
	  Checkbox.prototype.check = function check() {
	    this._input.checked = true;
	    this.updateClasses();
	  };
	
	  /**
	   * Uncheck checkbox
	   */
	
	
	  Checkbox.prototype.uncheck = function uncheck() {
	    this._input.checked = false;
	    this.updateClasses();
	  };
	
	  /**
	   * Uncheck checkbox
	   */
	
	
	  Checkbox.prototype.toggle = function toggle() {
	    if (this._input.checked) {
	      this.uncheck();
	    } else {
	      this.check();
	    }
	  };
	
	  /**
	   * Dispose component
	   */
	
	
	  Checkbox.prototype.dispose = function dispose() {
	    _Component.prototype.dispose.call(this);
	
	    this._input.removeEventListener('change', this._changeHandler);
	    this._input.removeEventListener('focus', this._focusHandler);
	    this._input.removeEventListener('blur', this._blurHandler);
	
	    this._element.removeChild(this._element.querySelector('.' + CLASS_BOX));
	  };
	
	  /**
	   * Event Handler
	   */
	
	  Checkbox.prototype._onChange = function _onChange(event) {
	    this.updateClasses();
	  };
	
	  // TODO Find out why unfocus is triggered on mousedown
	
	
	  Checkbox.prototype._onFocus = function _onFocus(event) {
	    this._element.classList.add(CLASS_IS_FOCUS);
	  };
	
	  Checkbox.prototype._onBlur = function _onBlur(event) {
	    this._element.classList.remove(CLASS_IS_FOCUS);
	  };
	
	  /**
	   * Getter and Setter
	   */
	
	  _createClass(Checkbox, [{
	    key: 'input',
	    get: function get() {
	      return this._input;
	    }
	  }, {
	    key: 'checked',
	    get: function get() {
	      return this._input.checked = true;
	    },
	    set: function set(value) {
	      if (value) {
	        this.check();
	      } else {
	        this.uncheck();
	      }
	    }
	  }, {
	    key: 'disabled',
	    get: function get() {
	      return this._input.disabled = true;
	    },
	    set: function set(value) {
	      if (value) {
	        this.disable();
	      } else {
	        this.enable();
	      }
	    }
	  }]);
	
	  return Checkbox;
	}(_component2.default);
	
	exports.default = Checkbox;
	module.exports = exports['default'];

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _component = __webpack_require__(2);
	
	var _component2 = _interopRequireDefault(_component);
	
	var _checkbox = __webpack_require__(12);
	
	var _checkbox2 = _interopRequireDefault(_checkbox);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var SELECTOR_COMPONENT = '.aui-js-dropdown';
	var SELECTOR_OPTION_INPUT = 'input';
	var CLASS_ANIMATED_LIST_ITEMS = 'aui-dropdown__list-item--animate';
	var CLASS_LABEL = 'aui-dropdown__label';
	var CLASS_INPUT = 'aui-dropdown__input';
	var CLASS_VALUE = 'aui-dropdown__value';
	var CLASS_FOCUS_LINE = 'aui-dropdown__focus-line';
	var CLASS_OPTION = 'aui-dropdown__option';
	var CLASS_MULTIPLE = 'aui-dropdown--multiple';
	var CLASS_IS_FOCUS = 'is-focused';
	var CLASS_IS_DIRTY = 'is-dirty';
	var CLASS_IS_DISABLED = 'is-disabled';
	var CLASS_IS_ACTIVE = 'is-active';
	
	/**
	 * Class constructor for Dropdown AUI component.
	 * Implements AUI component design pattern defined at:
	 * https://github.com/...
	 *
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	
	var Dropdown = function (_Component) {
	  _inherits(Dropdown, _Component);
	
	  /**
	   * Upgrades all Dropdown AUI components.
	   * @returns {Array} Returns an array of all newly upgraded components.
	   */
	  Dropdown.upgradeElements = function upgradeElements() {
	    var components = [];
	    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(function (element) {
	      if (!_component2.default.isElementUpgraded(element)) {
	        components.push(new Dropdown(element));
	      }
	    });
	    return components;
	  };
	
	  /**
	   * Constructor
	   * @constructor
	   * @param {HTMLElement} element The element of the AUI component.
	   */
	  function Dropdown(element) {
	    _classCallCheck(this, Dropdown);
	
	    var _this = _possibleConstructorReturn(this, _Component.call(this, element));
	
	    _this._element.addEventListener('click', _this._clickHandler = function (event) {
	      return _this._onClick(event);
	    });
	
	    _this.multiple = _this._element.classList.contains(CLASS_MULTIPLE);
	    _this._isActive = false;
	
	    _this._valueField = _this._element.querySelector('.' + CLASS_VALUE);
	
	    _this._input = _this._element.querySelector('.' + CLASS_INPUT);
	    _this._input.addEventListener('input', _this._inputHandler = function (event) {
	      return _this._onInput(event);
	    });
	    _this._input.addEventListener('focus', _this._focusHandler = function (event) {
	      return _this._onFocus(event);
	    });
	    _this._input.addEventListener('blur', _this._blurHandler = function (event) {
	      return _this._onBlur(event);
	    });
	    _this._input.addEventListener('reset', _this._resetHandler = function (event) {
	      return _this._onReset(event);
	    });
	
	    var itemsAnimated = _this._element.querySelectorAll('.' + CLASS_ANIMATED_LIST_ITEMS);
	    for (var i = 0; i < itemsAnimated.length; i++) {
	      itemsAnimated[i].style.transitionDelay = itemsAnimated[i].style.webkitTransitionDelay = .05 * i + 's';
	    }
	
	    // Insert thick focus line after label element:
	    _this._label = _this._element.querySelector('.' + CLASS_LABEL);
	    var focusLine = document.createElement('span');
	    focusLine.classList.add(CLASS_FOCUS_LINE);
	    _this._label.parentNode.insertBefore(focusLine, _this._label.nextSibling);
	
	    _this.updateClasses();
	    return _this;
	  }
	
	  Dropdown.prototype.optionClicked = function optionClicked(option) {
	    if (this._valueField) {
	      this._valueField.value = this._getOptionValue(option);
	    }
	
	    this.updateInput(option);
	
	    if (!this.multiple) {
	      this.close();
	    }
	  };
	
	  Dropdown.prototype.updateInput = function updateInput(option) {
	    var _this2 = this;
	
	    var value = '';
	    if (this.multiple) {
	      var values = [];
	      Array.from(this._element.querySelectorAll('.' + CLASS_OPTION)).forEach(function (element) {
	        var input = element.querySelector(SELECTOR_OPTION_INPUT);
	        if (input && input.checked) {
	          values.push(_this2._getOptionTitle(element));
	        }
	      });
	      value = values.length > 0 ? '(' + values.length + ') ' + values.join(', ') : '';
	    } else {
	      value = this._getOptionTitle(option);
	    }
	    this._input.value = value;
	    this.updateClasses();
	  };
	
	  Dropdown.prototype._getOptionTitle = function _getOptionTitle(option) {
	    var title = '';
	    if (option) {
	      title = option.hasAttribute('data-title') ? option.getAttribute('data-title') : '';
	    }
	    return title;
	  };
	
	  Dropdown.prototype._getOptionValue = function _getOptionValue(option) {
	    var value = '';
	    if (option) {
	      value = option.hasAttribute('data-value') ? option.getAttribute('data-value') : '';
	    }
	    return value;
	  };
	
	  Dropdown.prototype.open = function open() {
	    var _this3 = this;
	
	    if (!this._element.classList.contains(CLASS_IS_DISABLED)) {
	      this._isActive = true;
	      this._element.classList.add(CLASS_IS_ACTIVE);
	      window.addEventListener('click', this._clickHandlerWindow = function (event) {
	        return _this3._onClickOutside(event);
	      });
	    }
	  };
	
	  Dropdown.prototype.close = function close() {
	    this._isActive = false;
	    this._element.classList.remove(CLASS_IS_ACTIVE);
	    window.removeEventListener('click', this.close);
	  };
	
	  Dropdown.prototype.toggleOpen = function toggleOpen() {
	    if (this._isActive) {
	      this.close();
	    } else {
	      this.open();
	    }
	  };
	
	  Dropdown.prototype.updateClasses = function updateClasses() {
	    this.checkDisabled();
	    this.checkDirty();
	    this.checkFocus();
	  };
	
	  /**
	   * Check the disabled state and update field accordingly.
	   */
	
	
	  Dropdown.prototype.checkDisabled = function checkDisabled() {
	    if (this._input.disabled) {
	      this._element.classList.add(CLASS_IS_DISABLED);
	    } else {
	      this._element.classList.remove(CLASS_IS_DISABLED);
	    }
	  };
	
	  /**
	   * Check the dirty state and update field accordingly.
	   */
	
	
	  Dropdown.prototype.checkDirty = function checkDirty() {
	    if (this._input.value && this._input.value.length > 0) {
	      this._element.classList.add(CLASS_IS_DIRTY);
	    } else {
	      this._element.classList.remove(CLASS_IS_DIRTY);
	    }
	  };
	
	  /**
	   * Check the focus state and update field accordingly.
	   */
	
	
	  Dropdown.prototype.checkFocus = function checkFocus() {
	    if (Boolean(this._element.querySelector(':focus'))) {
	      this._element.classList.add(CLASS_IS_FOCUS);
	    } else {
	      this._element.classList.remove(CLASS_IS_FOCUS);
	    }
	  };
	
	  /**
	   * Disable text field.
	   */
	
	
	  Dropdown.prototype.disable = function disable() {
	    this._input.disabled = true;
	    this.updateClasses();
	  };
	
	  /**
	   * Dispose component
	   */
	
	
	  Dropdown.prototype.dispose = function dispose() {
	    _Component.prototype.dispose.call(this);
	
	    this._input.removeEventListener('input', this._inputHandler);
	    this._input.removeEventListener('focus', this._focusHandler);
	    this._input.removeEventListener('blur', this._blurHandler);
	    this._input.removeEventListener('reset', this._resetHandler);
	
	    window.removeEventListener('click', this.close);
	  };
	
	  /**
	   * Event Handler
	   */
	
	  Dropdown.prototype._onClick = function _onClick(event) {
	    var _this4 = this;
	
	    var isOption = false;
	
	    // Find closest action element
	    var currentElement = event.target;
	    while (currentElement !== event.currentTarget) {
	      if (currentElement.classList.contains(CLASS_OPTION)) {
	        isOption = true;
	        break;
	      }
	      currentElement = currentElement.parentNode;
	    }
	
	    if (!isOption) {
	      this.toggleOpen();
	    } else {
	      // Toggle the Checkbox contained
	      _checkbox2.default.get(currentElement).forEach(function (checkbox) {
	        checkbox.toggle();
	        _this4.optionClicked(currentElement);
	      });
	    }
	  };
	
	  Dropdown.prototype._onClickOutside = function _onClickOutside(event) {
	    if (!this._element.contains(event.target)) {
	      this.close();
	      this.updateClasses();
	    }
	  };
	
	  Dropdown.prototype._onInput = function _onInput(event) {
	    this.updateClasses();
	  };
	
	  Dropdown.prototype._onFocus = function _onFocus(event) {
	    this._element.classList.add(CLASS_IS_FOCUS);
	  };
	
	  Dropdown.prototype._onBlur = function _onBlur(event) {
	    this._element.classList.remove(CLASS_IS_FOCUS);
	  };
	
	  Dropdown.prototype._onReset = function _onReset(event) {
	    this.updateClasses();
	  };
	
	  return Dropdown;
	}(_component2.default);
	
	exports.default = Dropdown;
	module.exports = exports['default'];

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _component = __webpack_require__(2);
	
	var _component2 = _interopRequireDefault(_component);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var SELECTOR_COMPONENT = '.aui-js-flyout';
	var CLASS_TOGGLE = 'aui-flyout__toggle';
	var CLASS_TRIANGLE = 'aui-flyout__triangle';
	var CLASS_HEADER = 'aui-flyout__header';
	var CLASS_CLOSE_BUTTON = 'aui-flyout__close';
	var CLASS_PANEL = 'aui-flyout__panel';
	var CLASS_IS_UPGRADED = 'is-upgraded';
	var CLASS_IS_ACTIVE = 'is-active';
	var CLASS_FLYOUT_IS_OPEN = 'aui-flyout-is-open';
	var TOGGLE_THRESHOLD = 250; // in ms
	
	/**
	 * Class constructor for Flyout AUI component.
	 * Implements AUI component design pattern defined at:
	 * https://github.com/...
	 *
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	
	var Flyout = function (_Component) {
	  _inherits(Flyout, _Component);
	
	  function Flyout() {
	    _classCallCheck(this, Flyout);
	
	    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
	  }
	
	  /**
	   * Upgrades all Flyout AUI components.
	   * @returns {Array} Returns an array of all newly upgraded components.
	   */
	  Flyout.upgradeElements = function upgradeElements() {
	    var components = [];
	    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(function (element) {
	      if (!_component2.default.isElementUpgraded(element)) {
	        components.push(new Flyout(element));
	      }
	    });
	    return components;
	  };
	
	  /**
	   * Initialize component
	   */
	  Flyout.prototype.init = function init() {
	    var _this2 = this;
	
	    _Component.prototype.init.call(this);
	
	    this._activationTime = 0;
	
	    this._body = document.querySelector('body');
	    this._toggle = this._element.querySelector('.' + CLASS_TOGGLE);
	    this._panel = this._element.querySelector('.' + CLASS_PANEL);
	
	    // Add triangle shape
	    this._triangle = document.createElement('span');
	    this._triangle.classList.add(CLASS_TRIANGLE);
	    this._panel.appendChild(this._triangle);
	
	    // Add panel header with close button
	    this._header = document.createElement('div');
	    this._header.classList.add(CLASS_HEADER);
	    this._header.innerHTML = '<button class="' + CLASS_CLOSE_BUTTON + '" type="button"></button>';
	    this._panel.appendChild(this._header);
	
	    this._closeBtn = this._header.querySelector('.' + CLASS_CLOSE_BUTTON);
	    this._closeBtn.addEventListener('click', this._boundClickClose = function (event) {
	      return _this2._onClickClose(event);
	    });
	    this._toggle.addEventListener('click', this._boundClickToggle = function (event) {
	      return _this2._onClickToggle(event);
	    });
	
	    if (this._element.classList.contains(CLASS_IS_ACTIVE)) {
	      this.open();
	    }
	  };
	
	  /**
	   * Dispose component
	   */
	
	
	  Flyout.prototype.dispose = function dispose() {
	    this._toggle.removeEventListener('click', this._boundClickToggle);
	    this._closeBtn.removeEventListener('click', this._boundClickClose);
	    window.removeEventListener('click', this._boundClickWindow);
	    window.removeEventListener('touchend', this._boundTouchendWindow);
	
	    this._panel.removeChild(this._triangle);
	
	    this._element.classList.remove(CLASS_IS_ACTIVE, CLASS_IS_UPGRADED);
	    this._element.removeAttribute('style');
	  };
	
	  /**
	   * Open Flyout
	   */
	
	
	  Flyout.prototype.open = function open() {
	    var _this3 = this;
	
	    this._body.classList.add(CLASS_FLYOUT_IS_OPEN);
	    this._activationTime = Date.now();
	    this._isActive = true;
	    this._element.classList.add(CLASS_IS_ACTIVE);
	    window.addEventListener('click', this._boundClickWindow = function (event) {
	      return _this3._onTouchOutside(event);
	    }, true);
	    window.addEventListener('touchend', this._boundTouchendWindow = function (event) {
	      return _this3._onTouchOutside(event);
	    }, true);
	  };
	
	  /**
	   * Close Flyout
	   */
	
	
	  Flyout.prototype.close = function close() {
	    this._body.classList.remove(CLASS_FLYOUT_IS_OPEN);
	    this._isActive = false;
	    this._element.classList.remove(CLASS_IS_ACTIVE);
	    window.removeEventListener('click', this._boundClickWindow, true);
	    window.removeEventListener('touchend', this._boundTouchendWindow, true);
	  };
	
	  /**
	   * Toggle open/close Flyout
	   */
	
	
	  Flyout.prototype.toggle = function toggle() {
	    var elapsed = Date.now() - this._activationTime;
	    if (elapsed < TOGGLE_THRESHOLD) {
	      return;
	    }
	
	    if (this._isActive) {
	      this.close();
	    } else {
	      this.open();
	    }
	  };
	
	  /**
	   * Handle click of close button.
	   * @param {Event} event that fired.
	   */
	
	
	  Flyout.prototype._onClickClose = function _onClickClose(event) {
	    this.close();
	  };
	
	  /**
	   * Handle click of toggle.
	   * @param {Event} event that fired.
	   */
	
	
	  Flyout.prototype._onClickToggle = function _onClickToggle(event) {
	    this.toggle();
	  };
	
	  /**
	   * Handle mouseneter.
	   * @param {Event} event that fired.
	   */
	
	
	  Flyout.prototype._onMouseEnter = function _onMouseEnter(event) {
	    this.open(event.target, event.clientX);
	  };
	
	  /**
	   * Handle mouseleave.
	   * @param {Event} event that fired.
	   */
	
	
	  Flyout.prototype._onMouseLeave = function _onMouseLeave(event) {
	    this.close();
	  };
	
	  /**
	   * Handle touch.
	   * @param {Event} event that fired.
	   */
	
	
	  Flyout.prototype._onTouch = function _onTouch(event) {
	    event.stopPropagation();
	    this.open();
	  };
	
	  /**
	   * Handle touch outside.
	   * @param {Event} event that fired.
	   */
	
	
	  Flyout.prototype._onTouchOutside = function _onTouchOutside(event) {
	    if (!this._element.contains(event.target)) {
	      this.close();
	    }
	  };
	
	  return Flyout;
	}(_component2.default);
	
	exports.default = Flyout;
	module.exports = exports['default'];

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _component = __webpack_require__(2);
	
	var _component2 = _interopRequireDefault(_component);
	
	var _scrollObserver = __webpack_require__(16);
	
	var _scrollObserver2 = _interopRequireDefault(_scrollObserver);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var SELECTOR_COMPONENT = '.aui-js-header';
	var CLASS_STICKYABLE = 'aui-header--sticky';
	var CLASS_IS_STICKY = 'is-sticky';
	
	/**
	 * Class constructor for Header AUI component.
	 * Implements AUI component design pattern defined at:
	 * https://github.com/...
	 *
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	
	var Header = function (_Component) {
	  _inherits(Header, _Component);
	
	  /**
	   * Upgrades all Header AUI components.
	   * @returns {Array} Returns an array of all newly upgraded components.
	   */
	  Header.upgradeElements = function upgradeElements() {
	    var components = [];
	    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(function (element) {
	      if (!_component2.default.isElementUpgraded(element)) {
	        components.push(new Header(element));
	      }
	    });
	    return components;
	  };
	
	  /**
	   * Constructor
	   * @constructor
	   * @param {HTMLElement} element The element of the AUI component.
	   */
	  function Header(element) {
	    _classCallCheck(this, Header);
	
	    return _possibleConstructorReturn(this, _Component.call(this, element));
	  }
	
	  /**
	   * Initialize component.
	   */
	
	
	  Header.prototype.init = function init() {
	    var _this2 = this;
	
	    _Component.prototype.init.call(this);
	
	    // If Header ist not sticky, there is nothing todo.
	    if (!this._element.classList.contains(CLASS_STICKYABLE)) {
	      return;
	    }
	
	    // REVIEW position:sticky currently not working. See also SCSS.
	    // If browser supports position:sticky, it will handle positioning and
	    // we can skip here.
	    // if (window.getComputedStyle(this._element).position.indexOf('sticky') !== -1) {
	    //   return;
	    // }
	
	    this._scrollObserver = new _scrollObserver2.default();
	    this._scrollObserver.scrolled.add(this._scrollHandler = function () {
	      return _this2.checkStickiness();
	    });
	
	    this._sticky = false;
	    this.checkStickiness();
	  };
	
	  /**
	  * Dispose component.
	  */
	
	
	  Header.prototype.dispose = function dispose() {
	    _Component.prototype.dispose.call(this);
	
	    this._scrollObserver.resized.remove(this._scrollHandler);
	    this._resizeObserver.resized.remove(this._resizedHandler);
	  };
	
	  /**
	   * Check if position.top is negative. If so stick otherwise release component.
	   */
	
	
	  Header.prototype.checkStickiness = function checkStickiness() {
	    if (this._element.getBoundingClientRect().top <= 0) {
	      if (!this._sticky) {
	        this.stick();
	      }
	    } else {
	      if (this._sticky) {
	        this.release();
	      }
	    }
	  };
	
	  /**
	   * Stick component to top of viewport in adding sticky class.
	   */
	
	
	  Header.prototype.stick = function stick() {
	    if (!this._sticky) {
	      this._element.classList.add(CLASS_IS_STICKY);
	    }
	    this._sticky = true;
	  };
	
	  /**
	   * Release component and position not fixed in removing sticky class.
	   */
	
	
	  Header.prototype.release = function release() {
	    if (this._sticky) {
	      this._element.classList.remove(CLASS_IS_STICKY);
	    }
	    this._sticky = false;
	  };
	
	  return Header;
	}(_component2.default);
	
	exports.default = Header;
	module.exports = exports['default'];

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _signal = __webpack_require__(4);
	
	var _signal2 = _interopRequireDefault(_signal);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var instance = null;
	
	var SCROLL_END_THRESHOLD = 100; // in ms
	
	var ScrollObserver = function () {
	  function ScrollObserver() {
	    _classCallCheck(this, ScrollObserver);
	
	    if (!instance) {
	      instance = this;
	      this.init();
	    }
	
	    return instance;
	  }
	
	  ScrollObserver.prototype.init = function init() {
	    var _this = this;
	
	    this._scrollX = 0;
	    this._scrollY = 0;
	    this._ticking = false;
	
	    this.scrolled = new _signal2.default();
	    this.scrollEnded = new _signal2.default();
	
	    window.addEventListener('scroll', this.scrollHandler = function (event) {
	      return _this.onScroll(event);
	    });
	  };
	
	  ScrollObserver.prototype.onScroll = function onScroll(event) {
	    var _this2 = this;
	
	    this._scrollX = window.scrollX;
	    this._scrollY = window.scrollY;
	
	    if (!this._ticking) {
	      window.requestAnimationFrame(function () {
	        _this2._ticking = false;
	        _this2.scrolled.dispatch(_this2._scrollX, _this2._scrollY);
	        clearTimeout(_this2._scrollEndTimeout);
	        _this2._scrollEndTimeout = setTimeout(function () {
	          _this2.scrollEnded.dispatch(_this2._scrollX, _this2._scrollY);
	        }, SCROLL_END_THRESHOLD);
	      });
	    }
	    this._ticking = true;
	  };
	
	  _createClass(ScrollObserver, [{
	    key: 'scrollX',
	    get: function get() {
	      return this._scrollX;
	    }
	  }, {
	    key: 'scrollY',
	    get: function get() {
	      return this._scrollY;
	    }
	  }]);
	
	  return ScrollObserver;
	}();
	
	exports.default = ScrollObserver;
	module.exports = exports['default'];

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _component = __webpack_require__(2);
	
	var _component2 = _interopRequireDefault(_component);
	
	var _modalDefault = __webpack_require__(18);
	
	var _modalDefault2 = _interopRequireDefault(_modalDefault);
	
	var _modalMorph = __webpack_require__(20);
	
	var _modalMorph2 = _interopRequireDefault(_modalMorph);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var SELECTOR_COMPONENT = '.aui-js-modal';
	var CLASS_MORPH = 'aui-modal--morph';
	
	var modalComponents = void 0;
	var currentModal = void 0;
	
	/**
	 * Class constructor for Modal AUI component.
	 * Implements AUI component design pattern defined at:
	 * https://github.com/...
	 *
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	
	var Modal = function (_Component) {
	  _inherits(Modal, _Component);
	
	  function Modal() {
	    _classCallCheck(this, Modal);
	
	    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
	  }
	
	  /**
	   * Upgrades all Modal AUI components.
	   * @returns {Array} Returns an array of all newly upgraded components.
	   */
	  Modal.upgradeElements = function upgradeElements() {
		  if(!modalComponents) modalComponents = [];
		  Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(function (element) {
	      if (!_component2.default.isElementUpgraded(element)) {
			  modalComponents.push(new Modal(element));
	      }
	    });
	    return modalComponents;
	  };
	
	  /**
	   * Get a modal component by element ID.
	   * @param {string} id The id attribute of the components HTML element.
	   * @returns {Modal} Returns a modal with the given ID.
	   */
	  Modal.getModalById = function getModalById(id) {
	    for (var i = 0; i < modalComponents.length; i++) {
	      if (modalComponents[i].id === id) {
	        return modalComponents[i];
	      }
	    }
	  };
	
	  /**
	   * Close current modal.
	   */
	
	
	  Modal.closeCurrentModal = function closeCurrentModal() {
	    if (currentModal) {
	      currentModal.close();
	      currentModal = null;
	    }
	  };
	
	  /**
	   * Returns modifier `morph`
	   */
	
	
	  /**
	   * Initialize component
	   */
	  Modal.prototype.init = function init() {
	    _Component.prototype.init.call(this);
	
	    this._id = this._element.getAttribute('id');
	
	    // Initialize with appropriate decorator depending on modifier,
	    // represented by according CSS class:
	    if (this._element.classList.contains(CLASS_MORPH)) {
	      this._decorator = new _modalMorph2.default(this._element);
	    } else {
	      this._decorator = new _modalDefault2.default(this._element);
	    }
	  };
	
	  /**
	   * Opens this modal.
	   * @param {HTMLElement} trigger The element which opens the modal.
	   */
	
	
	  Modal.prototype.open = function open(trigger) {
	    currentModal = this;
	    this._decorator.open(trigger);
	  };
	
	  /**
	   * Closes this modal.
	   */
	
	
	  Modal.prototype.close = function close() {
	    currentModal = null;
	    this._decorator.close();
	  };
	
	  /**
	   * @returns {string} Returns the ID of the modal
	   */
	
	
	  _createClass(Modal, [{
	    key: 'id',
	    get: function get() {
	      return this._id;
	    }
	  }], [{
	    key: 'MODIFIER_MORPH',
	    get: function get() {
	      return CLASS_MORPH;
	    }
	
	    /**
	     * Returns modifier `default`
	     */
	
	  }, {
	    key: 'MODIFIER_DEFAULT',
	    get: function get() {
	      return '';
	    }
	  }]);
	
	  return Modal;
	}(_component2.default);
	
	exports.default = Modal;
	module.exports = exports['default'];

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _modalDialog = __webpack_require__(19);
	
	var _modalDialog2 = _interopRequireDefault(_modalDialog);
	
	var _resizeObserver = __webpack_require__(3);
	
	var _resizeObserver2 = _interopRequireDefault(_resizeObserver);
	
	var _transitionEndEvent = __webpack_require__(9);
	
	var _transitionEndEvent2 = _interopRequireDefault(_transitionEndEvent);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var CLASS_MODAL_IS_OPEN = 'aui-modal-open';
	var CLASS_WINDOW = 'aui-modal-dialog--window';
	var CLASS_DIALOG_BODY = 'aui-modal-dialog__body';
	var CLASS_IS_ACTIVE = 'is-active';
	
	/**
	 * Class constructor for ModalDefault AUI component.
	 * Implements AUI component design pattern defined at:
	 * https://github.com/...
	 *
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	
	var ModalDefault = function (_ModalDialog) {
	  _inherits(ModalDefault, _ModalDialog);
	
	  function ModalDefault() {
	    _classCallCheck(this, ModalDefault);
	
	    return _possibleConstructorReturn(this, _ModalDialog.apply(this, arguments));
	  }
	
	  /**
	   * Opens this modal.
	   * @param {HTMLElement} trigger The element which opens the modal.
	   */
	  ModalDefault.prototype.open = function open(trigger) {
	    var _this2 = this;
	
	    _ModalDialog.prototype.open.call(this);
	    this._trigger = trigger;
	
	    // Make modal element visible
	    this._element.classList.add(CLASS_IS_ACTIVE);
	    this._element.scrollTop = 0;
	    this._addBackdrop();
	
	    // If dialog acts as window, we have to reposition the close button to
	    // stick with the dialog.
	    if (this._element.querySelector('.' + CLASS_WINDOW) && this._closeButton) {
	      if (this._resizeObserver === undefined) {
	        this._resizeObserver = new _resizeObserver2.default();
	        this._dialogBody = this._element.querySelector('.' + CLASS_DIALOG_BODY);
	      }
	      this._resizeObserver.resized.add(this._resizedHandler = function () {
	        return _this2._repositionCloseButton();
	      });
	      this._repositionCloseButton();
	    }
	
	    window.requestAnimationFrame(function () {
	      return _this2._prepareOpenTransition();
	    });
	  };
	
	  /**
	   * Prepare the open transition.
	   */
	
	
	  ModalDefault.prototype._prepareOpenTransition = function _prepareOpenTransition() {
	    var _this3 = this;
	
	    // Loops until modal is really visible.
	    // That's required to make transitions work as aspected.
	    if (this._element.offsetWidth > 0) {
	
	      // Start opening animation
	      this._body.classList.add(CLASS_MODAL_IS_OPEN);
	    } else {
	      window.requestAnimationFrame(function () {
	        return _this3._prepareOpenTransition();
	      });
	    }
	  };
	
	  /**
	   * Closes this modal.
	   */
	
	
	  ModalDefault.prototype.close = function close() {
	    var _this4 = this;
	
	    if (this._backdrop) {
	      this._backdrop.removeEventListener(_transitionEndEvent2.default, this._backdropCloseTransitionendHandler);
	      _transitionEndEvent2.default && this._backdrop.addEventListener(_transitionEndEvent2.default, this._backdropCloseTransitionendHandler = function (event) {
	        return _this4._onBackdropCloseTransitionend(event);
	      });
	    }
	
	    if (this._resizeObserver) {
	      this._resizeObserver.resized.remove(this._resizedHandler);
	    }
	
	    this._body.classList.remove(CLASS_MODAL_IS_OPEN);
	  };
	
	  /**
	   * Reposition close button with dialog
	   */
	
	
	  ModalDefault.prototype._repositionCloseButton = function _repositionCloseButton() {
	    var rect = this._dialogBody.getBoundingClientRect();
	    var right = rect.right - rect.width;
	    // Only reposition if the window is positioned center, otherwise respect
	    // CSS styling:
	    if (right > 0) {
	      this._closeButton.style.right = right + 'px';
	    } else {
	      this._closeButton.style.right = '';
	    }
	  };
	
	  return ModalDefault;
	}(_modalDialog2.default);
	
	exports.default = ModalDefault;
	module.exports = exports['default'];

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _component = __webpack_require__(2);
	
	var _component2 = _interopRequireDefault(_component);
	
	var _transitionEndEvent = __webpack_require__(9);
	
	var _transitionEndEvent2 = _interopRequireDefault(_transitionEndEvent);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var CLOSE_BUTTON_SIZE_SMALL = 45;
	var CLOSE_BUTTON_SIZE_LARGE = 81;
	var CLOSE_ICON_SIZE_SMALL = 17;
	var CLOSE_ICON_SIZE_LARGE = 31;
	var CLASS_BACKDROP = 'aui-modal-backdrop';
	var CLASS_CLOSE = 'aui-modal-dialog__close';
	var CLASS_IS_ACTIVE = 'is-active';
	
	/**
	 * Class constructor for ModalDialog AUI component.
	 * Implements AUI component design pattern defined at:
	 * https://github.com/...
	 *
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	
	var ModalDialog = function (_Component) {
	  _inherits(ModalDialog, _Component);
	
	  function ModalDialog() {
	    _classCallCheck(this, ModalDialog);
	
	    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
	  }
	
	  /**
	   * Initialize component
	   */
	  ModalDialog.prototype.init = function init() {
	    _Component.prototype.init.call(this);
	
	    this._body = document.querySelector('body');
	
	    this._closeButton = this._element.querySelector('.' + CLASS_CLOSE);
	    if (this._closeButton) {
	      this._addCloseButton(this._closeButton);
	    }
	  };
	
	  /**
	   * Opens this modal.
	   */
	
	
	  ModalDialog.prototype.open = function open() {
	    if (this._element.parentNode !== this._body) {
	      this._body.appendChild(this._element);
	    }
	  };
	
	  /**
	   * Handle transition end event
	   * @param {Event} event which was fired.
	   */
	
	
	  ModalDialog.prototype._onBackdropCloseTransitionend = function _onBackdropCloseTransitionend(event) {
	    if (event.target === event.currentTarget) {
	      this._backdrop.removeEventListener(_transitionEndEvent2.default, this._backdropCloseTransitionendHandler);
	      this._element.classList.remove(CLASS_IS_ACTIVE);
	      this._removeBackdrop();
	    }
	  };
	
	  /**
	   * Adds a semi-transparent backdrop element behind the modal.
	   */
	
	
	  ModalDialog.prototype._addBackdrop = function _addBackdrop() {
	    if (!this._backdrop) {
	      this._backdrop = document.createElement('div');
	      this._backdrop.classList.add(CLASS_BACKDROP);
	      this._body.appendChild(this._backdrop);
	    }
	  };
	
	  /**
	   * Removes the backdrop element behind modal.
	   */
	
	
	  ModalDialog.prototype._removeBackdrop = function _removeBackdrop() {
	    if (this._backdrop) {
	      this._body.removeChild(this._backdrop);
	      this._backdrop = null;
	    }
	  };
	
	  /**
	   * Adds close button
	   * @param {HTMLElement} container to append close icon to.
	   */
	
	
	  ModalDialog.prototype._addCloseButton = function _addCloseButton(container) {
	    var diagonalHalf = Math.sqrt(2) * CLOSE_ICON_SIZE_SMALL / 2;
	    var btnSize = CLOSE_BUTTON_SIZE_SMALL;
	
	    var small = this.createSvgNode('svg', {
	      class: 'aui-modal-close-icon-small',
	      viewBox: '0 0 ' + btnSize + ' ' + btnSize
	    });
	    var group = this.createSvgNode('g', {
	      transform: 'translate(' + btnSize / 2 + ', ' + btnSize / 2 + ')'
	    });
	    group.appendChild(this.createSvgNode('line', {
	      x1: '0',
	      y1: -diagonalHalf,
	      x2: '0',
	      y2: diagonalHalf,
	      stroke: 'currentColor',
	      transform: 'rotate(-45, 0, 0)'
	    }));
	    group.appendChild(this.createSvgNode('line', {
	      x1: '0',
	      y1: -diagonalHalf,
	      x2: '0',
	      y2: diagonalHalf,
	      stroke: 'currentColor',
	      transform: 'rotate(45, 0, 0)'
	    }));
	    small.appendChild(group);
	    container.appendChild(small);
	
	    diagonalHalf = Math.sqrt(2) * CLOSE_ICON_SIZE_LARGE / 2;
	    btnSize = CLOSE_BUTTON_SIZE_LARGE;
	    var large = this.createSvgNode('svg', {
	      'class': 'aui-modal-close-icon-large',
	      'viewBox': '0 0 ' + btnSize + ' ' + btnSize
	    });
	    group = this.createSvgNode('g', {
	      transform: 'translate(' + btnSize / 2 + ', ' + btnSize / 2 + ')'
	    });
	    group.appendChild(this.createSvgNode('line', {
	      x1: '0',
	      y1: -diagonalHalf,
	      x2: '0',
	      y2: diagonalHalf,
	      stroke: 'currentColor',
	      transform: 'rotate(-45, 0, 0)'
	    }));
	    group.appendChild(this.createSvgNode('line', {
	      x1: '0',
	      y1: -diagonalHalf,
	      x2: '0',
	      y2: diagonalHalf,
	      stroke: 'currentColor',
	      transform: 'rotate(45, 0, 0)'
	    }));
	    large.appendChild(group);
	    container.appendChild(large);
	  };
	
	  return ModalDialog;
	}(_component2.default);
	
	exports.default = ModalDialog;
	module.exports = exports['default'];

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _modalDialog = __webpack_require__(19);
	
	var _modalDialog2 = _interopRequireDefault(_modalDialog);
	
	var _transitionEndEvent = __webpack_require__(9);
	
	var _transitionEndEvent2 = _interopRequireDefault(_transitionEndEvent);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var CLASS_MODAL_IS_OPEN = 'aui-modal-open';
	var CLASS_CONTENT = 'aui-modal-dialog__content';
	var CLASS_MORPH_DIALOG = 'aui-modal-morph';
	var CLASS_IS_ACTIVE = 'is-active';
	var CLASS_IS_MORPHING = 'is-morphing';
	
	/**
	 * Class constructor for ModalMorph AUI component.
	 * Implements AUI component design pattern defined at:
	 * https://github.com/...
	 *
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	
	var ModalMorph = function (_ModalDialog) {
	  _inherits(ModalMorph, _ModalDialog);
	
	  function ModalMorph() {
	    _classCallCheck(this, ModalMorph);
	
	    return _possibleConstructorReturn(this, _ModalDialog.apply(this, arguments));
	  }
	
	  /**
	   * Initialize component
	   */
	  ModalMorph.prototype.init = function init() {
	    _ModalDialog.prototype.init.call(this);
	
	    this._content = this._element.querySelector('.' + CLASS_CONTENT);
	  };
	
	  /**
	   * Open modal
	   * @param {HTMLElement} trigger The element which opens the modal.
	   */
	
	
	  ModalMorph.prototype.open = function open(trigger) {
	    var _this2 = this;
	
	    console.log('Open morphing modal');
	    _ModalDialog.prototype.open.call(this);
	    this._trigger = trigger;
	
	    // Make modal element visible
	    this._element.classList.add(CLASS_IS_ACTIVE);
	    this._element.scrollTop = 0;
	    this._addBackdrop();
	
	    window.requestAnimationFrame(function () {
	      return _this2._prepareOpenTransition();
	    });
	  };
	
	  ModalMorph.prototype._prepareOpenTransition = function _prepareOpenTransition() {
	    var _this3 = this;
	
	    var rect = this._trigger.getBoundingClientRect();
	
	    // Apply bounding rect to start with to morphing element
	    this._morph = this._getMorphElement(rect);
	
	    // Start opening animation
	    window.requestAnimationFrame(function () {
	      return _this3._startOpenTransition();
	    });
	  };
	
	  ModalMorph.prototype._startOpenTransition = function _startOpenTransition() {
	    var _this4 = this;
	
	    var rect = this._content.getBoundingClientRect();
	
	    // Apply bounding rect to end on to morphing element
	    this._applyBoundingRectToElement(this._morph, rect);
	    _transitionEndEvent2.default && this._element.addEventListener(_transitionEndEvent2.default, this._boundTransitionendElementIn = function (event) {
	      return _this4._onTransitionendElementIn(event);
	    });
	    this._morph.classList.add(CLASS_IS_MORPHING);
	    this._body.classList.add(CLASS_MODAL_IS_OPEN);
	  };
	
	  ModalMorph.prototype._onTransitionendElementIn = function _onTransitionendElementIn(event) {
	    this._element.removeEventListener(_transitionEndEvent2.default, this._boundTransitionendElementIn);
	    this._morph.classList.remove(CLASS_IS_MORPHING);
	  };
	
	  /**
	   * Close modal
	   */
	
	
	  ModalMorph.prototype.close = function close() {
	    var _this5 = this;
	
	    console.log('close');
	    if (this._backdrop) {
	      this._backdrop.removeEventListener(_transitionEndEvent2.default, this._backdropCloseTransitionendHandler);
	      _transitionEndEvent2.default && this._backdrop.addEventListener(_transitionEndEvent2.default, this._backdropCloseTransitionendHandler = function (event) {
	        return _this5._onBackdropCloseTransitionend(event);
	      });
	    }
	
	    this._element.removeEventListener(_transitionEndEvent2.default, this._boundTransitionendElementIn);
	
	    var rect = this._content.getBoundingClientRect();
	    this._applyBoundingRectToElement(this._morph, rect);
	    this._morph.classList.add(CLASS_IS_MORPHING);
	
	    _transitionEndEvent2.default && this._morph.addEventListener(_transitionEndEvent2.default, this._boundTransitionendMorphOut = function (event) {
	      return _this5._onTransitionendMorphOut(event);
	    });
	
	    window.requestAnimationFrame(function () {
	      return _this5._startCloseTransition();
	    });
	  };
	
	  ModalMorph.prototype._startCloseTransition = function _startCloseTransition() {
	    var rect = this._trigger.getBoundingClientRect();
	    this._applyBoundingRectToElement(this._morph, rect);
	
	    this._body.classList.remove(CLASS_MODAL_IS_OPEN);
	  };
	
	  ModalMorph.prototype._onTransitionendMorphOut = function _onTransitionendMorphOut(event) {
	    this._morph.removeEventListener(_transitionEndEvent2.default, this._boundTransitionendMorphOut);
	    this.removeChild(this._morph);
	    this._morph = null;
	  };
	
	  ModalMorph.prototype._onMorpBodyCloseTransitionend = function _onMorpBodyCloseTransitionend(event) {
	    if (event.target === event.currentTarget) {
	      this._morphBody.removeEventListener(_transitionEndEvent2.default, this._morpBodyCloseTransitionendHandler);
	      this._morphBody.removeAttribute('style');
	      this._content.classList.remove(CLASS_IS_MORPHING);
	    }
	  };
	
	  ModalMorph.prototype._applyBoundingRectToElement = function _applyBoundingRectToElement(element, rect) {
	    element.style.top = Math.round(rect.top + window.pageYOffset) + 'px';
	    element.style.left = Math.round(rect.left) + 'px';
	    element.style.width = Math.round(rect.width) + 'px';
	    element.style.height = Math.round(rect.height) + 'px';
	  };
	
	  ModalMorph.prototype._getMorphElement = function _getMorphElement(rect) {
	    if (!this._morph) {
	      this._morph = this.createElement('div', [CLASS_MORPH_DIALOG]);
	      this._applyBoundingRectToElement(this._morph, rect);
	      this._body.append(this._morph);
	    }
	    return this._morph;
	  };
	
	  return ModalMorph;
	}(_modalDialog2.default);
	
	exports.default = ModalMorph;
	module.exports = exports['default'];

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _component = __webpack_require__(2);
	
	var _component2 = _interopRequireDefault(_component);
	
	var _navBar = __webpack_require__(22);
	
	var _navBar2 = _interopRequireDefault(_navBar);
	
	var _navDropdown = __webpack_require__(25);
	
	var _navDropdown2 = _interopRequireDefault(_navDropdown);
	
	var _navList = __webpack_require__(28);
	
	var _navList2 = _interopRequireDefault(_navList);
	
	var _resizeObserver = __webpack_require__(3);
	
	var _resizeObserver2 = _interopRequireDefault(_resizeObserver);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var SELECTOR_COMPONENT = '.aui-js-nav';
	var CLASS_LIST = 'aui-nav--list';
	var CLASS_BAR = 'aui-nav--bar';
	var CLASS_TAB = 'aui-nav--tab';
	var CLASS_DROPDOWN = 'aui-nav--dropdown';
	
	/**
	 * Class constructor for Nav AUI component.
	 * Implements AUI component design pattern defined at:
	 * https://github.com/...
	 *
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	
	var Nav = function (_Component) {
	  _inherits(Nav, _Component);
	
	  /**
	   * Upgrades all Nav AUI components.
	   * @returns {Array} Returns an array of all newly upgraded components.
	   */
	  Nav.upgradeElements = function upgradeElements() {
	    var components = [];
	    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(function (element) {
	      if (!_component2.default.isElementUpgraded(element)) {
	        components.push(new Nav(element));
	      }
	    });
	    return components;
	  };
	
	  _createClass(Nav, null, [{
	    key: 'MODIFIER_LIST',
	
	
	    /**
	     * Returns modifier `list`
	     */
	    get: function get() {
	      return CLASS_LIST;
	    }
	
	    /**
	     * Returns modifier `bar`
	     */
	
	  }, {
	    key: 'MODIFIER_BAR',
	    get: function get() {
	      return CLASS_BAR;
	    }
	
	    /**
	     * Returns modifier `tab`
	     */
	
	  }, {
	    key: 'MODIFIER_TAB',
	    get: function get() {
	      return CLASS_TAB;
	    }
	
	    /**
	     * Returns modifier `dropdown`
	     */
	
	  }, {
	    key: 'MODIFIER_DROPDOWN',
	    get: function get() {
	      return CLASS_DROPDOWN;
	    }
	
	    /**
	     * Constructor
	     * @constructor
	     * @param {HTMLElement} element The element of the AUI component.
	     */
	
	  }]);
	
	  function Nav(element) {
	    _classCallCheck(this, Nav);
	
	    return _possibleConstructorReturn(this, _Component.call(this, element));
	  }
	
	  /**
	   * Initialize component.
	   */
	
	
	  Nav.prototype.init = function init() {
	    var _this2 = this;
	
	    _Component.prototype.init.call(this);
	
	    // Initialize with appropriate decorator depending on modifier,
	    // represented by according CSS class:
	    if (this._element.classList.contains(CLASS_BAR)) {
	      this._originModifier = Nav.MODIFIER_BAR;
	    } else if (this._element.classList.contains(CLASS_TAB)) {
	      this._originModifier = Nav.MODIFIER_TAB;
	    } else if (this._element.classList.contains(CLASS_DROPDOWN)) {
	      this._originModifier = Nav.MODIFIER_DROPDOWN;
	    } else if (this._element.classList.contains(CLASS_LIST)) {
	      this._originModifier = Nav.MODIFIER_LIST;
	    }
	
	    this._layoutBreakpoint = parseInt(window.getComputedStyle(this._element, ':after').getPropertyValue('content').replace(/['"]+/g, ''));
	
	    if (this._layoutBreakpoint > 0 && (this._originModifier === Nav.MODIFIER_BAR || this._originModifier === Nav.MODIFIER_TAB)) {
	      this._resizeObserver = new _resizeObserver2.default();
	      this._resizeObserver.resized.add(this._boundResize = function () {
	        return _this2._resized();
	      });
	      this._resized();
	    } else {
	      this.setModifier(this._originModifier);
	    }
	  };
	
	  /**
	   * Dispose component.
	   */
	
	
	  Nav.prototype.dispose = function dispose() {
	    _Component.prototype.dispose.call(this);
	
	    if (this._decorator) {
	      this._decorator.dispose();
	    }
	  };
	
	  /**
	   * Updates inidcator position and visibility of paddles.
	   */
	
	
	  Nav.prototype.update = function update() {
	    if (this._decorator) {
	      this._decorator.update();
	    }
	  };
	
	  /**
	   * Set modifier to switch style of Nav Component.
	   * @param {string} modifier name.
	   * @throws Will throw an error, if the given modifier is not supported.
	   */
	
	
	  Nav.prototype.setModifier = function setModifier(modifier) {
	    if (this._modifier === modifier) {
	      return;
	    }
	
	    if (this._decorator) {
	      this._decorator.dispose();
	    }
	
	    this._element.classList.remove(CLASS_LIST, CLASS_BAR, CLASS_TAB, CLASS_DROPDOWN);
	
	    switch (modifier) {
	      case Nav.MODIFIER_BAR:
	        this._element.classList.add(CLASS_BAR);
	        this._decorator = new _navBar2.default(this._element);
	        break;
	
	      case Nav.MODIFIER_TAB:
	        this._element.classList.add(CLASS_TAB);
	        this._decorator = new _navBar2.default(this._element);
	        break;
	
	      case Nav.MODIFIER_DROPDOWN:
	        this._element.classList.add(CLASS_DROPDOWN);
	        this._decorator = new _navDropdown2.default(this._element);
	        break;
	
	      case Nav.MODIFIER_LIST:
	        this._element.classList.add(CLASS_LIST);
	        this._decorator = new _navList2.default(this._element);
	        break;
	
	      default:
	        throw new Error('Modifier \'' + modifier + '\' for Nav component not supported.');
	    }
	
	    this._modifier = modifier;
	  };
	
	  /**
	   * Handle resize signal.
	   */
	
	
	  Nav.prototype._resized = function _resized() {
	    var viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	    if (this._originModifier === Nav.MODIFIER_BAR || this._originModifier === Nav.MODIFIER_TAB) {
	      if (viewportWidth >= this._layoutBreakpoint) {
	        this.setModifier(this._originModifier);
	      } else {
	        this.setModifier(Nav.MODIFIER_DROPDOWN);
	      }
	    }
	  };
	
	  /**
	   * Returns index.
	   * @returns {number} the index of current active action element.
	   */
	
	
	  _createClass(Nav, [{
	    key: 'index',
	    get: function get() {
	      return this._decorator ? this._decorator.index : undefined;
	    }
	
	    /**
	     * Returns length.
	     * @returns {number} the number of action elements.
	     */
	
	  }, {
	    key: 'length',
	    get: function get() {
	      return this._decorator ? this._decorator.length : undefined;
	    }
	  }]);
	
	  return Nav;
	}(_component2.default);
	
	exports.default = Nav;
	module.exports = exports['default'];

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _component = __webpack_require__(2);
	
	var _component2 = _interopRequireDefault(_component);
	
	var _resizeObserver = __webpack_require__(3);
	
	var _resizeObserver2 = _interopRequireDefault(_resizeObserver);
	
	var _scrollObserverElement = __webpack_require__(23);
	
	var _scrollObserverElement2 = _interopRequireDefault(_scrollObserverElement);
	
	var _limit = __webpack_require__(24);
	
	var _limit2 = _interopRequireDefault(_limit);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var SELECTOR_COMPONENT = '.aui-js-nav';
	var CLASS_PANEL = 'aui-nav__panel';
	var CLASS_ACTION = 'aui-nav__action';
	var CLASS_INDICATOR = 'aui-nav__indicator';
	var CLASS_PADDLES = 'aui-nav__paddles';
	var CLASS_PADDLE_LEFT = 'aui-nav__paddle-left';
	var CLASS_PADDLE_RIGHT = 'aui-nav__paddle-right';
	var CLASS_IS_ACTIVE = 'is-active';
	var CLASS_IS_ANIMATED = 'is-animated';
	var SHOW_INDICATOR_DELAY = 0.25; // in seconds; Delay after which, the indicator fades in.
	var INDICATOR_HIDDEN_X = -20; // Position of indicator when it's hidden, e.g. on page load.
	var INDICATOR_HIDDEN_WIDTH = 10; // Width of indicator when it's hidden, e.g. on page load.
	var SCROLL_THRESHOLD = 20; // in px; How far to scroll, before paddles are visible.
	var SCROLL_PADDING = 10; // in px;
	var SCROLL_EASING = 0.2;
	
	/**
	 * Class constructor for NavBar AUI component.
	 * Implements AUI component design pattern defined at:
	 * https://github.com/...
	 *
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	
	var NavBar = function (_Component) {
	  _inherits(NavBar, _Component);
	
	  /**
	   * Upgrades all NavBar AUI components.
	   * @returns {Array} Returns an array of all newly upgraded components.
	   */
	  NavBar.upgradeElements = function upgradeElements() {
	    var components = [];
	    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(function (element) {
	      if (!_component2.default.isElementUpgraded(element)) {
	        components.push(new NavBar(element));
	      }
	    });
	    return components;
	  };
	
	  /**
	   * Constructor
	   * @constructor
	   * @param {HTMLElement} element The element of the AUI component.
	   */
	  function NavBar(element) {
	    _classCallCheck(this, NavBar);
	
	    return _possibleConstructorReturn(this, _Component.call(this, element));
	  }
	
	  /**
	   * Initialize component.
	   */
	
	
	  NavBar.prototype.init = function init() {
	    var _this2 = this;
	
	    _Component.prototype.init.call(this);
	
	    // Refer elements
	    this._panel = this._element.querySelector('.' + CLASS_PANEL);
	    this._actionElements = Array.from(this._element.querySelectorAll('.' + CLASS_ACTION));
	
	    // Add indicator (line underneath action elements)
	    this._indicator = document.createElement('span');
	    this._indicator.classList.add(CLASS_INDICATOR);
	    this._panel.appendChild(this._indicator);
	
	    // Add paddles (gradient and buttons on the left/right, when scrolling is required)
	    this._paddles = document.createElement('div');
	    this._paddles.classList.add(CLASS_PADDLES);
	    this._element.appendChild(this._paddles);
	    this._paddleLeft = this._addPaddle(CLASS_PADDLE_LEFT);
	    this._paddleRight = this._addPaddle(CLASS_PADDLE_RIGHT);
	
	    // Watch window resizing
	    this._resizeObserver = new _resizeObserver2.default();
	    this._resizeObserver.resized.add(this._resizedHandler = function () {
	      return _this2.update();
	    });
	
	    // Watch scrolling of wrapper element
	    this._scrollObserver = new _scrollObserverElement2.default(this._panel);
	    this._scrollObserver.scrolled.add(this._scrollHandler = function () {
	      return _this2._onScrollElement();
	    });
	    this._onScrollElement();
	
	    // Add event handler
	    this._element.addEventListener('click', this._clickHandler = function (event) {
	      return _this2._onClick(event);
	    });
	
	    // Set initial action element active
	    this.setActive(this._element.querySelector('.' + CLASS_IS_ACTIVE));
	
	    // Delay fade in of indicator
	    setTimeout(function () {
	      _this2._element.classList.add(CLASS_IS_ANIMATED);
	    }, SHOW_INDICATOR_DELAY * 1000);
	  };
	
	  /**
	   * Dispose component.
	   */
	
	
	  NavBar.prototype.dispose = function dispose() {
	    _Component.prototype.dispose.call(this);
	    this._panel.scrollLeft = 0;
	    this._scrollActive = false;
	    this._resizeObserver.resized.remove(this._resizedHandler);
	    this._scrollObserver.scrolled.remove(this._scrollHandler);
	    this.removeChild(this._indicator);
	    this.removeChild(this._paddles);
	    this._element.removeEventListener('click', this._clickHandler);
	    this._element.classList.remove(CLASS_IS_ANIMATED);
	  };
	
	  /**
	   * Updates inidcator position and visibility of paddles.
	   */
	
	
	  NavBar.prototype.update = function update() {
	    this.setActive(this._element.querySelector('.' + CLASS_IS_ACTIVE));
	    this._updatePaddleVisibility();
	  };
	
	  /**
	   * Set an action element at given index active.
	   * @param {index} index The index of action element to set active.
	   */
	
	
	  NavBar.prototype.setActiveByIndex = function setActiveByIndex(index) {
	    var i = (0, _limit2.default)(index, 0, this._actionElements.length);
	    this.setActive(this._actionElements[i]);
	  };
	
	  /**
	   * Set an action element active.
	   * @param {HTMLElement} activeTarget The action element to set active.
	   */
	
	
	  NavBar.prototype.setActive = function setActive(activeTarget) {
	    // TODO: Optimize like in nav-list
	    this._actionElements.forEach(function (item) {
	      item.classList.remove(CLASS_IS_ACTIVE);
	    });
	
	    var indicatorLeft = INDICATOR_HIDDEN_X;
	    var indicatorWidth = INDICATOR_HIDDEN_WIDTH;
	
	    if (activeTarget) {
	      activeTarget.classList.add(CLASS_IS_ACTIVE);
	      var containerBounds = this._element.getBoundingClientRect();
	      var rectTarget = activeTarget.getBoundingClientRect();
	      indicatorLeft = rectTarget.left - containerBounds.left + this._panel.scrollLeft;
	      indicatorWidth = activeTarget.offsetWidth;
	    }
	
	    this._indicator.style.left = indicatorLeft + 'px';
	    this._indicator.style.width = indicatorWidth + 'px';
	
	    this._index = null;
	    for (var i = 0; i < this._actionElements.length; i++) {
	      if (this._actionElements[i] === activeTarget) {
	        this._index = i;
	        break;
	      }
	    }
	  };
	
	  /**
	   * Scroll to the next visible action element on the left.
	   */
	
	
	  NavBar.prototype.scrollLeft = function scrollLeft() {
	    this.scroll(-1);
	  };
	
	  /**
	   * Scroll to the next visible action element on the right.
	   */
	
	
	  NavBar.prototype.scrollRight = function scrollRight() {
	    this.scroll(1);
	  };
	
	  /**
	   * Scroll to the next visible action element on the left or right.
	   * @param {number} dir The direction to scroll to: -1=>left, 1=>right.
	   */
	
	
	  NavBar.prototype.scroll = function scroll(dir) {
	    var containerBounds = this._element.getBoundingClientRect();
	    var elementBounds = void 0;
	    var left = 0;
	    var right = this._panel.offsetWidth;
	    var scroll = 0;
	
	    if (dir < 0) {
	      // Scroll to previous element
	      for (var i = this._actionElements.length - 1; i > 0; i--) {
	        var element = this._actionElements[i];
	        elementBounds = element.getBoundingClientRect();
	        var elementLeft = elementBounds.left - containerBounds.left;
	        if (elementLeft < left) {
	          scroll = Math.ceil(elementLeft + this._panel.scrollLeft - SCROLL_PADDING);
	          break;
	        }
	      }
	    } else {
	      // Scroll to next element
	      for (var _i = 0; _i < this._actionElements.length; _i++) {
	        var _element = this._actionElements[_i];
	        elementBounds = _element.getBoundingClientRect();
	        var elementRight = elementBounds.left - containerBounds.left + _element.offsetWidth;
	        if (elementRight > right) {
	          scroll = Math.ceil(elementRight + this._panel.scrollLeft + SCROLL_PADDING - right);
	          break;
	        }
	      }
	    }
	
	    this._animateScroll(scroll);
	  };
	
	  /**
	   * Scroll to the next visible action element on the left or right.
	   * @param {number} scroll position to scroll to.
	   * @private
	   */
	
	
	  NavBar.prototype._animateScroll = function _animateScroll(scroll) {
	    var _this3 = this;
	
	    this._scrollStart = this._panel.scrollLeft;
	    this._scrollDelta = scroll - this._scrollStart;
	    this._scrollRatio = 0;
	    this._scrollActive = true;
	    window.requestAnimationFrame(function () {
	      return _this3._animateScrollTick();
	    });
	  };
	
	  /**
	   * Scroll animation tick.
	   * @private
	   */
	
	
	  NavBar.prototype._animateScrollTick = function _animateScrollTick() {
	    var _this4 = this;
	
	    var ratio = 1 - this._scrollRatio;
	    ratio *= SCROLL_EASING;
	    this._scrollRatio += ratio;
	
	    if (ratio < 0.001) {
	      this._scrollRatio = 1;
	    }
	    this._panel.scrollLeft = this._scrollStart + this._scrollDelta * this._scrollRatio;
	
	    if (this._scrollActive && this._scrollRatio !== 1) {
	      window.requestAnimationFrame(function () {
	        return _this4._animateScrollTick();
	      });
	    }
	  };
	
	  /**
	   * Adds a paddle element.
	   * @param {string} cssClass to add to element.
	   * @returns {HTMLElement} the created paddle element.
	   * @private
	   */
	
	
	  NavBar.prototype._addPaddle = function _addPaddle(cssClass) {
	    var paddle = document.createElement('button');
	    paddle.setAttribute('type', 'button');
	    paddle.classList.add(cssClass);
	    this._paddles.appendChild(paddle);
	    return paddle;
	  };
	
	  /**
	   * Update visibility of paddles depending on scroll position.
	   * @private
	   */
	
	
	  NavBar.prototype._updatePaddleVisibility = function _updatePaddleVisibility() {
	    if (this._scrollObserver.scrollLeft - SCROLL_THRESHOLD > 0) {
	      this._paddleLeft.disabled = false;
	    } else {
	      this._paddleLeft.disabled = true;
	    }
	
	    if (this._scrollObserver.scrollLeft + this._element.offsetWidth + SCROLL_THRESHOLD < this._panel.scrollWidth) {
	      this._paddleRight.disabled = false;
	    } else {
	      this._paddleRight.disabled = true;
	    }
	  };
	
	  /**
	   * Handle scroll of element.
	   * @private
	   */
	
	
	  NavBar.prototype._onScrollElement = function _onScrollElement() {
	    this._updatePaddleVisibility();
	  };
	
	  /**
	   * Handle click of element.
	   * @param {Event} event The event that fired.
	   * @private
	   */
	
	
	  NavBar.prototype._onClick = function _onClick(event) {
	    if (event.target === this._paddleLeft) {
	      event.preventDefault();
	      this.scrollLeft();
	    } else if (event.target === this._paddleRight) {
	      event.preventDefault();
	      this.scrollRight();
	    } else {
	      // Find closest action element
	      var currentElement = event.target;
	      while (currentElement !== event.currentTarget) {
	        if (currentElement.classList.contains(CLASS_ACTION)) {
	          if (!currentElement.disabled) {
	            this.setActive(currentElement);
	          }
	          break;
	        }
	        currentElement = currentElement.parentNode;
	      }
	    }
	  };
	
	  /**
	   * Returns index.
	   * @returns {number} the index of current active action element.
	   */
	
	
	  _createClass(NavBar, [{
	    key: 'index',
	    get: function get() {
	      return this._index;
	    }
	
	    /**
	     * Returns length.
	     * @returns {number} the number of action elements.
	     */
	
	  }, {
	    key: 'length',
	    get: function get() {
	      return this._actionElements.length;
	    }
	  }]);
	
	  return NavBar;
	}(_component2.default);
	
	exports.default = NavBar;
	module.exports = exports['default'];

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _signal = __webpack_require__(4);
	
	var _signal2 = _interopRequireDefault(_signal);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var SCROLL_END_THRESHOLD = 100; // in ms
	
	var ScrollObserverElement = function () {
	  function ScrollObserverElement(element) {
	    var _this = this;
	
	    _classCallCheck(this, ScrollObserverElement);
	
	    this._element = element;
	    this._scrollX = this._element.scrollLeft;
	    this._scrollY = this._element.scrollTop;
	    this._ticking = false;
	
	    this.scrolled = new _signal2.default();
	    this.scrollEnded = new _signal2.default();
	
	    this._element.addEventListener('scroll', this._scrollHandler = function (event) {
	      return _this._onScroll(event);
	    });
	  }
	
	  ScrollObserverElement.prototype._onScroll = function _onScroll(event) {
	    var _this2 = this;
	
	    this._scrollX = event.target.scrollLeft;
	    this._scrollY = event.target.scrollTop;
	
	    if (!this._ticking) {
	      window.requestAnimationFrame(function () {
	        _this2._ticking = false;
	        _this2.scrolled.dispatch(_this2._scrollX, _this2._scrollY);
	        clearTimeout(_this2._scrollEndTimeout);
	        _this2._scrollEndTimeout = setTimeout(function () {
	          _this2.scrollEnded.dispatch(_this2._scrollX, _this2._scrollY);
	        }, SCROLL_END_THRESHOLD);
	      });
	    }
	    this._ticking = true;
	  };
	
	  _createClass(ScrollObserverElement, [{
	    key: 'scrollLeft',
	    get: function get() {
	      return this._scrollX;
	    }
	  }, {
	    key: 'scrollTop',
	    get: function get() {
	      return this._scrollY;
	    }
	  }]);
	
	  return ScrollObserverElement;
	}();
	
	exports.default = ScrollObserverElement;
	module.exports = exports['default'];

/***/ },
/* 24 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = limit;
	/**
	 * Limits a value to x >= min and x <= max.
	 * @param {number} x The value to limit.
	 * @param {number} min The value to limit.
	 * @param {number} max The value to limit.
	 * @returns {number} The limited value.
	 */
	function limit(x, min, max) {
	  if (x > max) x = max;
	  if (x < min) x = min;
	  return x;
	}
	module.exports = exports['default'];

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _component = __webpack_require__(2);
	
	var _component2 = _interopRequireDefault(_component);
	
	var _sticky = __webpack_require__(26);
	
	var _sticky2 = _interopRequireDefault(_sticky);
	
	var _limit = __webpack_require__(24);
	
	var _limit2 = _interopRequireDefault(_limit);
	
	var _isNone = __webpack_require__(27);
	
	var _isNone2 = _interopRequireDefault(_isNone);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var SELECTOR_COMPONENT = '.aui-js-nav';
	var CLASS_PANEL = 'aui-nav__panel';
	var CLASS_UNDERLINE = 'aui-nav__underline';
	var CLASS_ITEM = 'aui-nav__item';
	var CLASS_ACTION = 'aui-nav__action';
	var CLASS_TOGGLE = 'aui-nav__toggle';
	var CLASS_TOGGLE_LABEL = 'aui-nav__toggle-label';
	var CLASS_STICKY = 'aui-nav--sticky';
	var CLASS_IS_ACTIVE = 'is-active';
	
	/**
	 * Class constructor for NavDropdown AUI component.
	 * Implements AUI component design pattern defined at:
	 * https://github.com/...
	 *
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	
	var NavDropdown = function (_Component) {
	  _inherits(NavDropdown, _Component);
	
	  /**
	   * Upgrades all NavDropdown AUI components.
	   * @returns {Array} Returns an array of all newly upgraded components.
	   */
	  NavDropdown.upgradeElements = function upgradeElements() {
	    var components = [];
	    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(function (element) {
	      if (!_component2.default.isElementUpgraded(element)) {
	        components.push(new NavDropdown(element));
	      }
	    });
	    return components;
	  };
	
	  /**
	   * Constructor
	   * @constructor
	   * @param {HTMLElement} element The element of the AUI component.
	   */
	  function NavDropdown(element) {
	    _classCallCheck(this, NavDropdown);
	
	    return _possibleConstructorReturn(this, _Component.call(this, element));
	  }
	
	  /**
	   * Initialize component.
	   */
	
	
	  NavDropdown.prototype.init = function init() {
	    var _this2 = this;
	
	    _Component.prototype.init.call(this);
	
	    this._index = 0;
	
	    // Refer elements
	    this._panel = this._element.querySelector('.' + CLASS_PANEL);
	    this._actions = Array.from(this._element.querySelectorAll('.' + CLASS_ACTION));
	
	    // Set transition delays for item elements
	    Array.from(this._element.querySelectorAll('.' + CLASS_ITEM)).forEach(function (element, index) {
	      element.style.transitionDelay = element.style.webkitTransitionDelay = 0.1 + 0.05 * index + 's';
	    });
	
	    // Add toggle element
	    this._toggle = this.createElement('button', [CLASS_TOGGLE], {
	      type: 'button'
	    });
	    this._element.appendChild(this._toggle);
	    this._toggleLabel = this.createElement('span', [CLASS_TOGGLE_LABEL]);
	    this._toggle.appendChild(this._toggleLabel);
	
	    // Add underline element
	    this._underline = this.createElement('div', [CLASS_UNDERLINE]);
	    this._element.appendChild(this._underline);
	
	    // Check if component is sticky
	    if (this._element.classList.contains(CLASS_STICKY)) {
	      this._stickyHandler = new _sticky2.default(this._element);
	    }
	
	    // Add event handler
	    this._element.addEventListener('click', this._clickHandler = function (event) {
	      return _this2._onClick(event);
	    });
	
	    // Set initial action element active
	    this.setActive(this._element.querySelector('.' + CLASS_IS_ACTIVE));
	  };
	
	  /**
	   * Dispose component.
	   */
	
	
	  NavDropdown.prototype.dispose = function dispose() {
	    _Component.prototype.dispose.call(this);
	    this._actions.forEach(function (element, index) {
	      element.style.transitionDelay = '';
	    });
	    this.removeChild(this._toggle);
	    this.removeChild(this._underline);
	    this._element.removeEventListener('click', this._clickHandler);
	  };
	
	  /**
	   * Updates inidcator position and visibility of paddles.
	   */
	
	
	  NavDropdown.prototype.update = function update() {
	    this.setActive(this._element.querySelector('.' + CLASS_IS_ACTIVE));
	  };
	
	  /**
	   * Toggle active state.
	   * @param {boolean} force If is true, open panel, and if it is false, close it.
	   */
	
	
	  NavDropdown.prototype.toggle = function toggle(force) {
	    this._element.classList.toggle(CLASS_IS_ACTIVE, force);
	  };
	
	  /**
	   * Set an action element at given index active.
	   * @param {index} index The index of action element to set active.
	   */
	
	
	  NavDropdown.prototype.setActiveByIndex = function setActiveByIndex(index) {
	    var i = (0, _limit2.default)(index, 0, this._actions.length);
	    this.setActive(this._actions[i]);
	  };
	
	  /**
	   * Set an action element active.
	   * @param {HTMLElement} activeTarget The action element to set active.
	   */
	
	
	  NavDropdown.prototype.setActive = function setActive(activeTarget) {
	    // TODO: Optimize like in nav-list
	
	    // Remove active class from all action elements
	    this._actions.forEach(function (item) {
	      item.classList.remove(CLASS_IS_ACTIVE);
	    });
	
	    // If no action element is active, pick the first one
	    if ((0, _isNone2.default)(activeTarget)) {
	      activeTarget = this._actions[0];
	    }
	
	    // Apply active class to action element and mirror innerHTML to toggle
	    activeTarget.classList.add(CLASS_IS_ACTIVE);
	    this._toggleLabel.innerHTML = activeTarget.innerHTML;
	
	    // Update active index
	    this._index = null;
	    for (var i = 0; i < this._actions.length; i++) {
	      if (this._actions[i] === activeTarget) {
	        this._index = i;
	        break;
	      }
	    }
	  };
	
	  /**
	   * Handle click of element.
	   * @param {Event} event The event that fired.
	   * @private
	   */
	
	
	  NavDropdown.prototype._onClick = function _onClick(event) {
	    if (event.target === this._toggle) {
	      this.toggle();
	    } else {
	      // Find closest action element
	      var currentElement = event.target;
	      while (currentElement !== event.currentTarget) {
	        if (currentElement.classList.contains(CLASS_ACTION)) {
	          this.setActive(currentElement);
	          this.toggle();
	          break;
	        }
	        currentElement = currentElement.parentNode;
	      }
	    }
	  };
	
	  /**
	   * Returns index.
	   * @returns {number} the index of current active action element.
	   */
	
	
	  _createClass(NavDropdown, [{
	    key: 'index',
	    get: function get() {
	      return this._index;
	    }
	
	    /**
	     * Returns length.
	     * @returns {number} the number of action elements.
	     */
	
	  }, {
	    key: 'length',
	    get: function get() {
	      return this._actions.length;
	    }
	  }]);
	
	  return NavDropdown;
	}(_component2.default);
	
	exports.default = NavDropdown;
	module.exports = exports['default'];

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _component = __webpack_require__(2);
	
	var _component2 = _interopRequireDefault(_component);
	
	var _scrollObserver = __webpack_require__(16);
	
	var _scrollObserver2 = _interopRequireDefault(_scrollObserver);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var CLASS_IS_STICKY = 'is-sticky';
	
	/**
	 * Class constructor for Sticky AUI component.
	 * Implements AUI component design pattern defined at:
	 * https://github.com/...
	 *
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	
	var Sticky = function (_Component) {
	  _inherits(Sticky, _Component);
	
	  /**
	   * Constructor
	   * @constructor
	   * @param {HTMLElement} element The element of the AUI component.
	   */
	  function Sticky(element) {
	    _classCallCheck(this, Sticky);
	
	    return _possibleConstructorReturn(this, _Component.call(this, element));
	  }
	
	  /**
	   * Initialize component.
	   */
	
	
	  Sticky.prototype.init = function init() {
	    var _this2 = this;
	
	    _Component.prototype.init.call(this);
	
	    // If browser supports position:sticky, it will handle positioning and
	    // we can skip here.
	    if (window.getComputedStyle(this._element).position.indexOf('sticky') !== -1) {
	      return;
	    }
	
	    this._scrollObserver = new _scrollObserver2.default();
	    this._scrollObserver.scrolled.add(this._scrollHandler = function () {
	      return _this2.checkStickiness();
	    });
	
	    this._sticky = false;
	    this.checkStickiness();
	  };
	
	  /**
	  * Dispose component.
	  */
	
	
	  Sticky.prototype.dispose = function dispose() {
	    _Component.prototype.dispose.call(this);
	
	    this.release();
	    this._scrollObserver.resized.remove(this._scrollHandler);
	    this._resizeObserver.resized.remove(this._resizedHandler);
	  };
	
	  /**
	   * Check if position.top is negative. If so stick otherwise release component.
	   */
	
	
	  Sticky.prototype.checkStickiness = function checkStickiness() {
	    if (this._element.getBoundingClientRect().top <= 0) {
	      if (!this._sticky) {
	        this.stick();
	      }
	    } else {
	      if (this._sticky) {
	        this.release();
	      }
	    }
	  };
	
	  /**
	   * Stick component to top of viewport in adding sticky class.
	   */
	
	
	  Sticky.prototype.stick = function stick() {
	    if (!this._sticky) {
	      this._element.classList.add(CLASS_IS_STICKY);
	    }
	    this._sticky = true;
	  };
	
	  /**
	   * Release component and position not fixed in removing sticky class.
	   */
	
	
	  Sticky.prototype.release = function release() {
	    if (this._sticky) {
	      this._element.classList.remove(CLASS_IS_STICKY);
	    }
	    this._sticky = false;
	  };
	
	  return Sticky;
	}(_component2.default);
	
	exports.default = Sticky;
	module.exports = exports['default'];

/***/ },
/* 27 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = isNone;
	/**
	 * Check if value is either `undefined` or `null`.
	 * @param {*} value to check.
	 * @returns {boolean} true if value is `undefined` or `null`.
	 */
	function isNone(value) {
	  return value === undefined || value === null;
	}
	module.exports = exports['default'];

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _component = __webpack_require__(2);
	
	var _component2 = _interopRequireDefault(_component);
	
	var _limit = __webpack_require__(24);
	
	var _limit2 = _interopRequireDefault(_limit);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var SELECTOR_COMPONENT = '.aui-js-nav';
	var CLASS_ACTION = 'aui-nav__action';
	var CLASS_IS_ACTIVE = 'is-active';
	
	/**
	 * Class constructor for NavList AUI component.
	 * Implements AUI component design pattern defined at:
	 * https://github.com/...
	 *
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	
	var NavList = function (_Component) {
	  _inherits(NavList, _Component);
	
	  /**
	   * Upgrades all NavList AUI components.
	   * @returns {Array} Returns an array of all newly upgraded components.
	   */
	  NavList.upgradeElements = function upgradeElements() {
	    var components = [];
	    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(function (element) {
	      if (!_component2.default.isElementUpgraded(element)) {
	        components.push(new NavList(element));
	      }
	    });
	    return components;
	  };
	
	  /**
	   * Constructor
	   * @constructor
	   * @param {HTMLElement} element The element of the AUI component.
	   */
	  function NavList(element) {
	    _classCallCheck(this, NavList);
	
	    return _possibleConstructorReturn(this, _Component.call(this, element));
	  }
	
	  /**
	   * Initialize component.
	   */
	
	
	  NavList.prototype.init = function init() {
	    var _this2 = this;
	
	    _Component.prototype.init.call(this);
	
	    // Refer elements
	    this._actionElements = Array.from(this._element.querySelectorAll('.' + CLASS_ACTION));
	
	    // Add event handler
	    this._element.addEventListener('click', this._clickHandler = function (event) {
	      return _this2._onClick(event);
	    });
	
	    // Set initial action element active
	    this.setActive(this._element.querySelector('.' + CLASS_IS_ACTIVE));
	  };
	
	  /**
	   * Dispose component.
	   */
	
	
	  NavList.prototype.dispose = function dispose() {
	    _Component.prototype.dispose.call(this);
	    this._element.removeEventListener('click', this._clickHandler);
	  };
	
	  /**
	   * Updates inidcator position and visibility of paddles.
	   */
	
	
	  NavList.prototype.update = function update() {
	    this.setActive(this._element.querySelector('.' + CLASS_IS_ACTIVE));
	  };
	
	  /**
	   * Set an action element at given index active.
	   * @param {index} index The index of action element to set active.
	   */
	
	
	  NavList.prototype.setActiveByIndex = function setActiveByIndex(index) {
	    var i = (0, _limit2.default)(index, 0, this._actionElements.length);
	    this.setActive(this._actionElements[i]);
	  };
	
	  /**
	   * Set an action element active.
	   * @param {HTMLElement} activeTarget The action element to set active.
	   */
	
	
	  NavList.prototype.setActive = function setActive(activeTarget) {
	    var _this3 = this;
	
	    this._actionElements.forEach(function (item, index) {
	      var active = item === activeTarget;
	      item.classList.toggle(CLASS_IS_ACTIVE, active);
	      if (active) {
	        _this3._index = index;
	      }
	    });
	  };
	
	  /**
	   * Handle click of element.
	   * @param {Event} event The event that fired.
	   * @private
	   */
	
	
	  NavList.prototype._onClick = function _onClick(event) {
	    // Find closest action element
	    var currentElement = event.target;
	    while (currentElement !== event.currentTarget) {
	      if (currentElement.classList.contains(CLASS_ACTION)) {
	        if (!currentElement.disabled) {
	          this.setActive(currentElement);
	        }
	        break;
	      }
	      currentElement = currentElement.parentNode;
	    }
	  };
	
	  /**
	   * Returns index.
	   * @returns {number} the index of current active action element.
	   */
	
	
	  _createClass(NavList, [{
	    key: 'index',
	    get: function get() {
	      return this._index;
	    }
	
	    /**
	     * Returns length.
	     * @returns {number} the number of action elements.
	     */
	
	  }, {
	    key: 'length',
	    get: function get() {
	      return this._actionElements.length;
	    }
	  }]);
	
	  return NavList;
	}(_component2.default);
	
	exports.default = NavList;
	module.exports = exports['default'];

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _component = __webpack_require__(2);
	
	var _component2 = _interopRequireDefault(_component);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var SELECTOR_COMPONENT = '.aui-js-notification';
	var CLASS_CONTENT = 'aui-notification__content';
	var CLASS_CLOSE_BUTTON = 'aui-notification__close';
	var CLASS_IS_CLOSED = 'is-closed';
	var CLASS_IS_OPEN = 'is-open';
	var ATTR_CLOSE = 'data-close';
	
	/**
	 * Class constructor for Notification AUI component.
	 * Implements AUI component design pattern defined at:
	 * https://github.com/...
	 *
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	
	var Notification = function (_Component) {
	  _inherits(Notification, _Component);
	
	  /**
	   * Upgrades all Notification AUI components.
	   * @returns {Array} Returns an array of all newly upgraded components.
	   */
	  Notification.upgradeElements = function upgradeElements() {
	    var components = [];
	    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(function (element) {
	      if (!_component2.default.isElementUpgraded(element)) {
	        components.push(new Notification(element));
	      }
	    });
	    return components;
	  };
	
	  function Notification(element) {
	    _classCallCheck(this, Notification);
	
	    return _possibleConstructorReturn(this, _Component.call(this, element));
	  }
	
	  Notification.prototype.init = function init() {
	    _Component.prototype.init.call(this);
	
	    this._content = this._element.querySelector('.' + CLASS_CONTENT);
	    if (!this._content) {
	      this._content = document.createElement('div');
	      this._content.classList.add(CLASS_CONTENT);
	      this._element.appendChild(this._content);
	    }
	
	    // Add close button
	    this._closeButton = document.createElement('button');
	    this._closeButton.setAttribute('type', 'button');
	    this._closeButton.classList.add(CLASS_CLOSE_BUTTON);
	    this._element.appendChild(this._closeButton);
	
	    this.open();
	  };
	
	  Notification.prototype.open = function open() {
	    var _this2 = this;
	
	    this._element.addEventListener('click', this._clickHandler = function (event) {
	      return _this2._onClick(event);
	    });
	    this.checkOpeningPreparation();
	  };
	
	  Notification.prototype.checkOpeningPreparation = function checkOpeningPreparation() {
	    clearTimeout(this.openingTimeout);
	    this._element.classList.add(CLASS_IS_OPEN);
	    this._element.classList.remove(CLASS_IS_CLOSED);
	  };
	
	  Notification.prototype.close = function close() {
	    this._element.removeEventListener('click', this._clickHandler);
	    this._element.style.height = this._element.offsetHeight + 'px';
	    this._element.style.marginTop = '0px';
	    this._element.style.marginBottom = '0px';
	    this.checkClosingPreparation();
	  };
	
	  Notification.prototype.checkClosingPreparation = function checkClosingPreparation() {
	    var _this3 = this;
	
	    clearTimeout(this.openingTimeout);
	    if (window.getComputedStyle(this._element).height && this._element.style.height) {
	      this._element.classList.remove(CLASS_IS_OPEN);
	      this._element.classList.add(CLASS_IS_CLOSED);
	    } else {
	      window.requestAnimationFrame(function () {
	        return _this3.checkClosingPreparation();
	      });
	    }
	  };
	
	  Notification.prototype._onClick = function _onClick(event) {
	    if (event.target.classList.contains(CLASS_CLOSE_BUTTON) || event.target.hasAttribute(ATTR_CLOSE)) {
	      this.close();
	    }
	  };
	
	  return Notification;
	}(_component2.default);
	
	exports.default = Notification;
	module.exports = exports['default'];

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _component = __webpack_require__(2);
	
	var _component2 = _interopRequireDefault(_component);
	
	var _resizeObserver = __webpack_require__(3);
	
	var _resizeObserver2 = _interopRequireDefault(_resizeObserver);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var SELECTOR_COMPONENT = '.aui-js-pagination';
	var CLASS_ITEM = 'aui-pagination__link';
	var CLASS_INDICATOR = 'aui-pagination__indicator';
	var CLASS_IS_ACTIVE = 'is-active';
	var CLASS_IS_ANIMATED = 'is-animated';
	var CLASS_IS_DISABLED = 'is-disabled';
	
	/**
	 * Class constructor for Pagination AUI component.
	 * Implements AUI component design pattern defined at:
	 * https://github.com/...
	 *
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	
	var Pagination = function (_Component) {
	  _inherits(Pagination, _Component);
	
	  function Pagination() {
	    _classCallCheck(this, Pagination);
	
	    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
	  }
	
	  /**
	   * Upgrades all Pagination AUI components.
	   * @returns {Array} Returns an array of all newly upgraded components.
	   */
	  Pagination.upgradeElements = function upgradeElements() {
	    var components = [];
	    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(function (element) {
	      if (!_component2.default.isElementUpgraded(element)) {
	        components.push(new Pagination(element));
	      }
	    });
	    return components;
	  };
	
	  /**
	   * Initialize component
	   */
	  Pagination.prototype.init = function init() {
	    var _this2 = this;
	
	    _Component.prototype.init.call(this);
	
	    this._resizeObserver = new _resizeObserver2.default();
	    this._resizeObserver.resized.add(this._boundResized = function () {
	      return _this2.update();
	    });
	
	    this._items = Array.from(this._element.querySelectorAll('.' + CLASS_ITEM));
	
	    this._indicator = document.createElement('span');
	    this._indicator.classList.add(CLASS_INDICATOR);
	    this._element.appendChild(this._indicator);
	
	    this._element.addEventListener('click', this._boundClick = function (event) {
	      return _this2._onClick(event);
	    });
	
	    this._repositionIndicator(this._element.querySelector('.' + CLASS_IS_ACTIVE));
	    setTimeout(function () {
	      _this2._element.classList.add(CLASS_IS_ANIMATED);
	    }, 250);
	  };
	
	  /**
	   * Dispose component
	   */
	
	
	  Pagination.prototype.dispose = function dispose() {
	    _Component.prototype.dispose.call(this);
	
	    this._element.classList.remove(CLASS_IS_ANIMATED);
	
	    this._element.removeEventListener('click', this._boundClick);
	    this._resizeObserver.resized.remove(this._boundResized);
	
	    if (this._indicator) {
	      this.removeChild(this._indicator);
	    }
	  };
	
	  /**
	   * Update component.
	   */
	
	
	  Pagination.prototype.update = function update() {
	    this._repositionIndicator(this._element.querySelector('.' + CLASS_IS_ACTIVE));
	  };
	
	  /**
	   * Reposition indicator of `active` page.
	   * @param {HTMLElement} linkElement that is going to be `active`.
	   * @private
	   */
	
	
	  Pagination.prototype._repositionIndicator = function _repositionIndicator(linkElement) {
	    if (!linkElement) return;
	
	    this._items.forEach(function (item) {
	      item.classList.remove(CLASS_IS_ACTIVE);
	    });
	    linkElement.classList.add(CLASS_IS_ACTIVE);
	
	    // Indicator position
	    var rectContainer = this._element.getBoundingClientRect();
	    var rectTarget = linkElement.getBoundingClientRect();
	    var indicatorLeft = rectTarget.left - rectContainer.left + this._element.scrollLeft;
	    this._indicator.style.left = indicatorLeft + 'px';
	    this._indicator.style.width = linkElement.offsetWidth + 'px';
	  };
	
	  /**
	   * Handle click.
	   * @param {Event} event The event that fired.
	   * @private
	   */
	
	
	  Pagination.prototype._onClick = function _onClick(event) {
	    if (event.target.classList.contains(CLASS_ITEM) && !event.target.classList.contains(CLASS_IS_DISABLED)) {
	      this._repositionIndicator(event.target);
	    }
	  };
	
	  return Pagination;
	}(_component2.default);
	
	exports.default = Pagination;
	module.exports = exports['default'];

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _component = __webpack_require__(2);
	
	var _component2 = _interopRequireDefault(_component);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var SELECTOR_COMPONENT = '.aui-js-player';
	var SELECTOR_PROGRESS_CONTROL = '.aui-player__progress-control';
	var SELECTOR_SEEK_HOLDER = '.aui-player__seek-holder';
	var SELECTOR_PREVIEW = '.aui-player__preview';
	var CLASS_SEEKING = 'is-seeking';
	
	/**
	 * Class constructor for Player AUI component.
	 * Implements AUI component design pattern defined at:
	 * https://github.com/...
	 *
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	
	var Player = function (_Component) {
	  _inherits(Player, _Component);
	
	  /**
	   * Upgrades all Player AUI components.
	   * @returns {Array} Returns an array of all newly upgraded components.
	   */
	  Player.upgradeElements = function upgradeElements() {
	    var components = [];
	    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(function (element) {
	      if (!_component2.default.isElementUpgraded(element)) {
	        components.push(new Player(element));
	      }
	    });
	    return components;
	  };
	
	  function Player(element) {
	    _classCallCheck(this, Player);
	
	    var _this = _possibleConstructorReturn(this, _Component.call(this, element));
	
	    _this._progressControl = _this._element.querySelector(SELECTOR_PROGRESS_CONTROL);
	    if (_this._progressControl) {
	      _this._progressControl.addEventListener('mouseover', _this.progressControlOverListener = function (event) {
	        return _this.progressControlOverHandler(event);
	      });
	      _this._progressControl.addEventListener('mouseout', _this.progressControlOutListener = function (event) {
	        return _this.progressControlOutHandler(event);
	      });
	
	      _this._seekHolder = _this._progressControl.querySelector(SELECTOR_SEEK_HOLDER);
	    }
	
	    _this._preview = _this._element.querySelector(SELECTOR_PREVIEW);
	    return _this;
	  }
	
	  Player.prototype.progressControlOverHandler = function progressControlOverHandler(event) {
	    var _this2 = this;
	
	    this._progressControl.removeEventListener('mousemove', this.moveListener);
	    this._progressControl.addEventListener('mousemove', this.progressControlMoveListener = function (event) {
	      return _this2.progressControlMoveHandler(event);
	    });
	    this._element.classList.add(CLASS_SEEKING);
	    this.updateSeek(event.clientX);
	  };
	
	  Player.prototype.progressControlMoveHandler = function progressControlMoveHandler(event) {
	    this.updateSeek(event.clientX);
	  };
	
	  Player.prototype.progressControlOutHandler = function progressControlOutHandler(event) {
	    this._element.classList.remove(CLASS_SEEKING);
	  };
	
	  Player.prototype.updateSeek = function updateSeek() {
	    // Translate trigger position x to ratio of progress control width
	    var boundings = this._progressControl.getBoundingClientRect(),
	        offsetX = event.clientX - boundings.left,
	        ratio = offsetX / this._progressControl.offsetWidth,
	        ratioPercentStr = void 0;
	    ratio = Math.max(0, Math.min(ratio, 1));
	    ratioPercentStr = ratio * 100 + '%';
	    this._seekHolder.style.width = ratioPercentStr;
	  };
	
	  return Player;
	}(_component2.default);
	
	exports.default = Player;
	module.exports = exports['default'];

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _component = __webpack_require__(2);
	
	var _component2 = _interopRequireDefault(_component);
	
	var _limit = __webpack_require__(24);
	
	var _limit2 = _interopRequireDefault(_limit);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var SELECTOR_COMPONENT = '.aui-js-progress';
	var CLASS_CONTINUOUS = 'aui-progress--continuous';
	var CLASS_BAR = 'aui-progress__bar';
	var CLASS_IS_PENDING = 'is-pending';
	var CLASS_IS_LOADING = 'is-loading';
	var CLASS_IS_COMPLETE = 'is-complete';
	
	/**
	 * Class constructor for Progress AUI component.
	 * Implements AUI component design pattern defined at:
	 * https://github.com/...
	 *
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	
	var Progress = function (_Component) {
	  _inherits(Progress, _Component);
	
	  /**
	   * Upgrades all Progress AUI components.
	   * @returns {Array} Returns an array of all newly upgraded components.
	   */
	  Progress.upgradeElements = function upgradeElements() {
	    var components = [];
	    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(function (element) {
	      if (!_component2.default.isElementUpgraded(element)) {
	        components.push(new Progress(element));
	      }
	    });
	    return components;
	  };
	
	  function Progress(element) {
	    _classCallCheck(this, Progress);
	
	    return _possibleConstructorReturn(this, _Component.call(this, element));
	  }
	
	  Progress.prototype.init = function init() {
	    _Component.prototype.init.call(this);
	
	    this._continuous = this._element.classList.contains(CLASS_CONTINUOUS);
	
	    // Add bar elements:
	    this._bar = document.createElement('span');
	    this._bar.classList.add(CLASS_BAR);
	    this._element.appendChild(this._bar);
	
	    this.progress(0);
	  };
	
	  Progress.prototype.progress = function progress(ratio) {
	    ratio = (0, _limit2.default)(ratio, 0, 1);
	    this._progress = ratio;
	
	    if (!this._continuous) {
	      this._bar.style.width = this._progress * 100 + '%';
	    }
	
	    this.updateClasses();
	  };
	
	  Progress.prototype.updateClasses = function updateClasses() {
	    if (this._progress === 0) {
	      this._element.classList.add(CLASS_IS_PENDING);
	    } else {
	      this._element.classList.remove(CLASS_IS_PENDING);
	    }
	
	    if (this._progress > 0 && this._progress < 1) {
	      this._element.classList.add(CLASS_IS_LOADING);
	    } else {
	      this._element.classList.remove(CLASS_IS_LOADING);
	    }
	
	    if (this._progress === 1) {
	      this._element.classList.add(CLASS_IS_COMPLETE);
	    } else {
	      this._element.classList.remove(CLASS_IS_COMPLETE);
	    }
	  };
	
	  return Progress;
	}(_component2.default);
	
	exports.default = Progress;
	module.exports = exports['default'];

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _component = __webpack_require__(2);
	
	var _component2 = _interopRequireDefault(_component);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var SELECTOR_COMPONENT = '.aui-js-radio';
	var CLASS_INPUT = 'aui-radio__input';
	var CLASS_LABEL = 'aui-radio__label';
	var CLASS_BOX = 'aui-radio__box';
	var CLASS_TICK = 'aui-radio__tick';
	var CLASS_IS_FOCUS = 'is-focused';
	var CLASS_IS_CHECKED = 'is-checked';
	var CLASS_IS_DISABLED = 'is-disabled';
	
	var _radios = void 0;
	
	/**
	 * Class constructor for Radio AUI component.
	 * Implements AUI component design pattern defined at:
	 * https://github.com/...
	 *
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	
	var Radio = function (_Component) {
	  _inherits(Radio, _Component);
	
	  function Radio() {
	    _classCallCheck(this, Radio);
	
	    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
	  }
	
	  /**
	   * Upgrades all Radio AUI components.
	   * @returns {Array} Returns an array of all newly upgraded components.
	   */
	  Radio.upgradeElements = function upgradeElements() {
	    var components = [];
	    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(function (element) {
	      if (!_component2.default.isElementUpgraded(element)) {
	        components.push(new Radio(element));
	      }
	    });
	    _radios = components;
	    return components;
	  };
	
	  Radio.prototype.init = function init() {
	    var _this2 = this;
	
	    _Component.prototype.init.call(this);
	
	    this._input = this._element.querySelector('.' + CLASS_INPUT);
	    this._input.addEventListener('change', this._changeHandler = function (event) {
	      return _this2._onChange(event);
	    });
	    this._input.addEventListener('focus', this._focusHandler = function (event) {
	      return _this2._onFocus(event);
	    });
	    this._input.addEventListener('blur', this._blurHandler = function (event) {
	      return _this2._onBlur(event);
	    });
	
	    // Insert box with tick after label element:
	    this._label = this._element.querySelector('.' + CLASS_LABEL);
	    var box = document.createElement('span');
	    box.classList.add(CLASS_BOX);
	    this._label.parentNode.insertBefore(box, this._label.nextSibling);
	    var tick = document.createElement('span');
	    tick.classList.add(CLASS_TICK);
	    box.appendChild(tick);
	
	    this.groupName = this._input.getAttribute('name');
	
	    this.updateClasses();
	  };
	
	  Radio.prototype.updateClasses = function updateClasses() {
	    this.checkDisabled();
	    this.checkToggleState();
	    this.checkFocus();
	  };
	
	  /**
	   * Check the disabled state and update field accordingly.
	   */
	
	
	  Radio.prototype.checkDisabled = function checkDisabled() {
	    if (this._input.disabled) {
	      this._element.classList.add(CLASS_IS_DISABLED);
	    } else {
	      this._element.classList.remove(CLASS_IS_DISABLED);
	    }
	  };
	
	  /**
	   * Check the toggle state and update field accordingly.
	   */
	
	
	  Radio.prototype.checkToggleState = function checkToggleState() {
	    if (this._input.checked) {
	      this._element.classList.add(CLASS_IS_CHECKED);
	    } else {
	      this._element.classList.remove(CLASS_IS_CHECKED);
	    }
	  };
	
	  /**
	   * Check the focus state and update field accordingly.
	   */
	
	
	  Radio.prototype.checkFocus = function checkFocus() {
	    if (Boolean(this._element.querySelector(':focus'))) {
	      this._element.classList.add(CLASS_IS_FOCUS);
	    } else {
	      this._element.classList.remove(CLASS_IS_FOCUS);
	    }
	  };
	
	  /**
	   * Enable radio.
	   */
	
	
	  Radio.prototype.enable = function enable() {
	    this._input.disabled = false;
	    this.updateClasses();
	  };
	
	  /**
	   * Disable radio.
	   */
	
	
	  Radio.prototype.disable = function disable() {
	    this._input.disabled = true;
	    this.updateClasses();
	  };
	
	  /**
	   * Check radio.
	   */
	
	
	  Radio.prototype.check = function check() {
	    this._input.checked = true;
	    this.updateClasses();
	  };
	
	  /**
	   * Uncheck radio.
	   */
	
	
	  Radio.prototype.uncheck = function uncheck() {
	    this._input.checked = false;
	    this.updateClasses();
	  };
	
	  /**
	   * Dispose component
	   */
	
	
	  Radio.prototype.dispose = function dispose() {
	    _Component.prototype.dispose.call(this);
	
	    this._input.removeEventListener('change', this._changeHandler);
	    this._input.removeEventListener('focus', this._focusHandler);
	    this._input.removeEventListener('blur', this._blurHandler);
	
	    this._element.removeChild(this._element.querySelector('.' + CLASS_BOX));
	  };
	
	  /**
	   * Handle change event.
	   * @param {Event} event that fired.
	   */
	
	
	  Radio.prototype._onChange = function _onChange(event) {
	    this.updateClasses();
	    // Since other radio buttons don't get change events, we need to look for
	    // them to update their classes.
	    for (var i = 0; i < _radios.length; i++) {
	      var button = _radios[i];
	      // Different name == different group, so no point updating those.
	      if (button._input.getAttribute('name') === this.groupName) {
	        button.updateClasses();
	      }
	    }
	  };
	
	  // TODO Find out why unfocus is triggered on mousedown
	
	
	  Radio.prototype._onFocus = function _onFocus(event) {
	    this._element.classList.add(CLASS_IS_FOCUS);
	  };
	
	  Radio.prototype._onBlur = function _onBlur(event) {
	    this._element.classList.remove(CLASS_IS_FOCUS);
	  };
	
	  /**
	   * Getter and Setter
	   */
	
	  _createClass(Radio, [{
	    key: 'input',
	    get: function get() {
	      return this._input;
	    }
	  }, {
	    key: 'checked',
	    get: function get() {
	      return this._input.checked = true;
	    },
	    set: function set(value) {
	      if (value) {
	        this.check();
	      } else {
	        this.uncheck();
	      }
	    }
	  }, {
	    key: 'disabled',
	    get: function get() {
	      return this._input.disabled = true;
	    },
	    set: function set(value) {
	      if (value) {
	        this.disable();
	      } else {
	        this.enable();
	      }
	    }
	  }]);
	
	  return Radio;
	}(_component2.default);
	
	exports.default = Radio;
	module.exports = exports['default'];

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _component = __webpack_require__(2);
	
	var _component2 = _interopRequireDefault(_component);
	
	var _animationEndEvent = __webpack_require__(35);
	
	var _animationEndEvent2 = _interopRequireDefault(_animationEndEvent);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var SELECTOR_COMPONENT = '.aui-js-response';
	var CLASS_BUTTON_PRIMARY = 'aui-button--primary';
	var CLASS_BUTTON_SECONDARY = 'aui-button--secondary';
	var CLASS_BUTTON_ICON = 'aui-button--icon';
	var CLASS_BUTTON_FLOATING = 'aui-button--floating';
	var CLASS_RESPONSE = 'aui-response';
	var CLASS_RESPONSE_MASKED = 'aui-response--masked';
	var CLASS_EFFECT = 'aui-response__effect';
	var CLASS_EFFECT_LARGE = 'aui-response__effect--large';
	var CLASS_IS_ANIMATING = 'is-animating';
	var CLASS_IS_DISABLED = 'is-disabled';
	
	/**
	 * Class constructor for Response AUI component.
	 * Implements AUI component design pattern defined at:
	 * https://github.com/...
	 *
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	
	var Response = function (_Component) {
	  _inherits(Response, _Component);
	
	  /**
	   * Upgrades all Response AUI components.
	   * @returns {Array} Returns an array of all newly upgraded components.
	   */
	  Response.upgradeElements = function upgradeElements() {
	    var components = [];
	    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(function (element) {
	      if (!_component2.default.isElementUpgraded(element)) {
	        components.push(new Response(element));
	      }
	    });
	    return components;
	  };
	
	  /**
	   * Constructor
	   * @constructor
	   * @param {HTMLElement} element The element of the AUI component.
	   */
	  function Response(element) {
	    _classCallCheck(this, Response);
	
	    return _possibleConstructorReturn(this, _Component.call(this, element));
	  }
	
	  /**
	   * Initialize component
	   */
	
	
	  Response.prototype.init = function init() {
	    var _this2 = this;
	
	    _Component.prototype.init.call(this);
	
	    var boxedButton = this._element.classList.contains(CLASS_BUTTON_PRIMARY) || this._element.classList.contains(CLASS_BUTTON_SECONDARY) || this._element.classList.contains(CLASS_BUTTON_FLOATING);
	
	    this._useTriggerX = boxedButton || !this._element.classList.contains(CLASS_BUTTON_ICON);
	    this._useTriggerY = boxedButton;
	    this._masked = boxedButton;
	    this._large = boxedButton;
	
	    this._responseContainer = document.createElement('span');
	    this._responseContainer.classList.add(CLASS_RESPONSE);
	    if (this._masked) {
	      this._responseContainer.classList.add(CLASS_RESPONSE_MASKED);
	    }
	    this._element.appendChild(this._responseContainer);
	
	    this._responseEffect = document.createElement('span');
	    this._responseEffect.classList.add(CLASS_EFFECT);
	    if (this._large) {
	      this._responseEffect.classList.add(CLASS_EFFECT_LARGE);
	    }
	    this._responseContainer.appendChild(this._responseEffect);
	
	    this._element.addEventListener('mousedown', this._mousedownHandler = function (event) {
	      return _this2._onMousedown(event);
	    });
	    _animationEndEvent2.default && this._responseEffect.addEventListener(_animationEndEvent2.default, this._animationendHandler = function (event) {
	      return _this2._onAnimationend(event);
	    });
	  };
	
	  /**
	   * Dispose component
	   */
	
	
	  Response.prototype.dispose = function dispose() {
	    _Component.prototype.dispose.call(this);
	
	    this._element.removeEventListener('mousedown', this._mousedownHandler);
	    if (_animationEndEvent2.default && this._responseEffect) {
	      this._responseEffect.removeEventListener(_animationEndEvent2.default, this._animationendHandler);
	    }
	    this._element.removeChild(this._responseContainer);
	  };
	
	  /**
	   * Handle mousedown of element.
	   * @param {Event} event The event that fired.
	   * @private
	   */
	
	
	  Response.prototype._onMousedown = function _onMousedown(event) {
	    // Get cross-browser offsetX, offsetY
	    var target = event.currentTarget || event.srcElement,
	        rect = target.getBoundingClientRect(),
	        offsetX = event.clientX - rect.left,
	        offsetY = event.clientY - rect.top;
	
	    if (!target.classList.contains(CLASS_IS_DISABLED)) {
	      this._responseEffect.style.left = this._useTriggerX ? offsetX + 'px' : '50%';
	      this._responseEffect.style.top = this._useTriggerY ? offsetY + 'px' : '50%';
	      this._responseContainer.classList.add(CLASS_IS_ANIMATING);
	    }
	  };
	
	  /**
	   * Handle animationend of element.
	   * @param {Event} event The event that fired.
	   * @private
	   */
	
	
	  Response.prototype._onAnimationend = function _onAnimationend(event) {
	    this._responseContainer.classList.remove(CLASS_IS_ANIMATING);
	  };
	
	  return Response;
	}(_component2.default);
	
	exports.default = Response;
	module.exports = exports['default'];

/***/ },
/* 35 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	// From Modernizr
	function whichAnimationEvent() {
	  var type = void 0;
	  var element = document.createElement('fakeelement');
	  var animations = {
	    'animation': 'animationend',
	    'OAnimation': 'oAnimationEnd',
	    'MozAnimation': 'animationend',
	    'WebkitAnimation': 'webkitAnimationEnd'
	  };
	
	  for (type in animations) {
	    if (element.style[type] !== undefined) {
	      return animations[type];
	    }
	  }
	}
	
	var ANIMATION_EVENT = whichAnimationEvent();
	
	exports.default = ANIMATION_EVENT;
	module.exports = exports['default'];

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _component = __webpack_require__(2);
	
	var _component2 = _interopRequireDefault(_component);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var SELECTOR_COMPONENT = '.aui-js-select';
	var CLASS_INPUT = 'aui-select__input';
	var CLASS_LABEL = 'aui-select__label';
	var CLASS_FOCUS_LINE = 'aui-select__focus-line';
	var CLASS_IS_FOCUS = 'is-focused';
	var CLASS_IS_DIRTY = 'is-dirty';
	var CLASS_IS_DISABLED = 'is-disabled';
	
	/**
	 * Class constructor for Select AUI component.
	 * Implements AUI component design pattern defined at:
	 * https://github.com/...
	 *
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	
	var Select = function (_Component) {
	  _inherits(Select, _Component);
	
	  /**
	   * Upgrades all Select AUI components.
	   * @returns {Array} Returns an array of all newly upgraded components.
	   */
	  Select.upgradeElements = function upgradeElements() {
	    var components = [];
	    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(function (element) {
	      if (!_component2.default.isElementUpgraded(element)) {
	        components.push(new Select(element));
	      }
	    });
	    return components;
	  };
	
	  function Select(element) {
	    _classCallCheck(this, Select);
	
	    return _possibleConstructorReturn(this, _Component.call(this, element));
	  }
	
	  Select.prototype.init = function init() {
	    var _this2 = this;
	
	    _Component.prototype.init.call(this);
	
	    this._label = this._element.querySelector('.' + CLASS_LABEL);
	
	    this._input = this._element.querySelector('.' + CLASS_INPUT);
	    this._input.addEventListener('change', this._changeHandler = function (event) {
	      return _this2._onChange(event);
	    });
	    this._input.addEventListener('focus', this._focusHandler = function (event) {
	      return _this2._onFocus(event);
	    });
	    this._input.addEventListener('blur', this._blurHandler = function (event) {
	      return _this2._onBlur(event);
	    });
	    this._input.addEventListener('reset', this._resetHandler = function (event) {
	      return _this2._onReset(event);
	    });
	
	    // Insert thick focus line after select element:
	    var focusLine = document.createElement('span');
	    focusLine.classList.add(CLASS_FOCUS_LINE);
	    this._label.parentNode.insertBefore(focusLine, this._label.nextSibling);
	
	    this.updateClasses();
	  };
	
	  Select.prototype.updateClasses = function updateClasses() {
	    this.checkDisabled();
	    this.checkDirty();
	    this.checkFocus();
	  };
	
	  /**
	   * Check the disabled state and update field accordingly.
	   */
	
	
	  Select.prototype.checkDisabled = function checkDisabled() {
	    if (this._input.disabled) {
	      this._element.classList.add(CLASS_IS_DISABLED);
	    } else {
	      this._element.classList.remove(CLASS_IS_DISABLED);
	    }
	  };
	
	  /**
	   * Check the dirty state and update field accordingly.
	   */
	
	
	  Select.prototype.checkDirty = function checkDirty() {
	    // console.log('value', this._input.value, typeof this._input.value);
	    // console.log('options', this._input.options[this._input.selectedIndex].disabled);
	    if (!this._input.options[this._input.selectedIndex].disabled) {
	      this._element.classList.add(CLASS_IS_DIRTY);
	    } else {
	      this._element.classList.remove(CLASS_IS_DIRTY);
	    }
	  };
	
	  /**
	   * Check the focus state and update field accordingly.
	   */
	
	
	  Select.prototype.checkFocus = function checkFocus() {
	    if (Boolean(this._element.querySelector(':focus'))) {
	      this._element.classList.add(CLASS_IS_FOCUS);
	    } else {
	      this._element.classList.remove(CLASS_IS_FOCUS);
	    }
	  };
	
	  /**
	   * Disable text field.
	   */
	
	
	  Select.prototype.disable = function disable() {
	    this._input.disabled = true;
	    this.updateClasses();
	  };
	
	  /**
	   * Event Handler
	   */
	
	  Select.prototype._onChange = function _onChange(event) {
	    this.updateClasses();
	  };
	
	  Select.prototype._onFocus = function _onFocus(event) {
	    this._element.classList.add(CLASS_IS_FOCUS);
	  };
	
	  Select.prototype._onBlur = function _onBlur(event) {
	    this._element.classList.remove(CLASS_IS_FOCUS);
	  };
	
	  Select.prototype._onReset = function _onReset(event) {
	    this.updateClasses();
	  };
	
	  return Select;
	}(_component2.default);
	
	exports.default = Select;
	module.exports = exports['default'];

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _component = __webpack_require__(2);
	
	var _component2 = _interopRequireDefault(_component);
	
	var _limit = __webpack_require__(24);
	
	var _limit2 = _interopRequireDefault(_limit);
	
	var _mapLinear = __webpack_require__(38);
	
	var _mapLinear2 = _interopRequireDefault(_mapLinear);
	
	var _resizeObserver = __webpack_require__(3);
	
	var _resizeObserver2 = _interopRequireDefault(_resizeObserver);
	
	var _nouislider = __webpack_require__(39);
	
	var _nouislider2 = _interopRequireDefault(_nouislider);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * NOTE Slider AUI components rely on the 3rd party library noUiSlider.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @see https://github.com/leongersen/noUiSlider
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */
	
	var SELECTOR_COMPONENT = '.aui-js-slider';
	var SELECTOR_HIDDEN_FIELD = '.aui-slider__hidden-field';
	var SELECTOR_OUTPUT = '.aui-slider__output';
	var CLASS_COMPONENT = 'aui-slider';
	var CLASS_IS_DISABLED = 'is-disabled';
	var EVENT_NAMESPACE = CLASS_COMPONENT;
	
	/**
	 * Class constructor for Slider AUI component.
	 * Implements AUI component design pattern defined at:
	 * https://github.com/...
	 *
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	
	var Slider = function (_Component) {
	  _inherits(Slider, _Component);
	
	  function Slider() {
	    _classCallCheck(this, Slider);
	
	    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
	  }
	
	  /**
	   * Upgrades all Slider AUI components.
	   * @returns {Array} Returns an array of all newly upgraded components.
	   */
	  Slider.upgradeElements = function upgradeElements() {
	    var components = [];
	    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(function (element) {
	      if (!_component2.default.isElementUpgraded(element)) {
	        components.push(new Slider(element));
	      }
	    });
	    return components;
	  };
	
	  /**
	   * Initialize component
	   */
	  Slider.prototype.init = function init() {
	    var _this2 = this;
	
	    _Component.prototype.init.call(this);
	
	    // Save reference to component elements
	    this._hiddenField = this._element.querySelector(SELECTOR_HIDDEN_FIELD);
	    this._output = this._element.querySelector(SELECTOR_OUTPUT);
	
	    // Create slider container element
	    this._slider = document.createElement('div');
	    this._element.insertBefore(this._slider, this._element.firstChild);
	
	    // Parse and save start and range values:
	    this._value = this._parseData(this._hiddenField.value);
	    this._rangeMin = this._parseData(this._element.getAttribute('data-min'));
	    this._rangeMax = this._parseData(this._element.getAttribute('data-max'));
	
	    // Create noUiSlider instance
	    _nouislider2.default.create(this._slider, {
	      // Set the start value defined in the hidden field.
	      // https://refreshless.com/nouislider/slider-options/#section-start
	      start: this._value,
	
	      // Set the range as defined in the data attributes
	      // https://refreshless.com/nouislider/slider-values/#section-range
	      range: {
	        min: this._rangeMin,
	        max: this._rangeMax
	      },
	
	      // If there are two handles, set the bar between the handles, but not
	      // between the handles and the sliders edges. If there is only one handle,
	      // set the bar from the slider edge to the handle.
	      // https://refreshless.com/nouislider/slider-options/#section-Connect
	      connect: this._value.length > 1 ? true : [true, false],
	
	      // Define behaviour depending on number of handles
	      // https://refreshless.com/nouislider/behaviour-option/
	      behaviour: this._value.length > 1 ? 'tap-drag' : 'tap',
	
	      // Use AUI namespace for css classes
	      // https://refreshless.com/nouislider/more/#section-styling
	      cssPrefix: CLASS_COMPONENT + '__'
	    });
	    this._slider.noUiSlider.on('update.' + EVENT_NAMESPACE, function (values, handle, unencoded, tap, positions) {
	      return _this2._onUpdate(values, handle, unencoded, tap, positions);
	    });
	
	    if (this._output) {
	      this._resizeObserver = new _resizeObserver2.default();
	      this._resizeObserver.resized.add(this._resizedHandler = function () {
	        return _this2._centerOutput();
	      });
	    }
	
	    if (this._element.classList.contains(CLASS_IS_DISABLED)) {
	      this.disable();
	    }
	  };
	
	  /**
	   * Dispose component
	   */
	
	
	  Slider.prototype.dispose = function dispose() {
	    if (this._slider) {
	      this._slider.noUiSlider.off('.' + EVENT_NAMESPACE);
	    }
	    if (this._resizeObserver) {
	      this._resizeObserver.resized.remove(this._resizedHandler);
	      this._resizeObserver = null;
	    }
	  };
	
	  /**
	   * Enable component
	   */
	
	
	  Slider.prototype.enable = function enable() {
	    this._element.classList.remove(CLASS_IS_DISABLED);
	    this._slider.removeAttribute('disabled');
	  };
	
	  /**
	   * Disable component
	   */
	
	
	  Slider.prototype.disable = function disable() {
	    this._element.classList.add(CLASS_IS_DISABLED);
	    this._slider.setAttribute('disabled', true);
	  };
	
	  /**
	   * Handle on update
	   * @param {Array} values Current slider values
	   * @param {Integer} handle Handle that caused the event 0 or 1
	   * @param {Array} unencoded Slider values without formatting
	   * @param {boolean} tap Event was caused by the user tapping the slider
	   * @param {Array} positions Left offset of the handles in relation to the slider
	   */
	
	
	  Slider.prototype._onUpdate = function _onUpdate(values, handle, unencoded, tap, positions) {
	    if (this._hiddenField) {
	      this._hiddenField.value = unencoded;
	    }
	
	    // Position output to center of slider handles
	    if (this._output) {
	      this._output.innerHTML = values.length > 1 ? values[0] + ' to ' + values[1] : '' + values[0];
	      this._centerOutput();
	    }
	  };
	
	  /**
	   * Center output bewteen handles.
	   */
	
	
	  Slider.prototype._centerOutput = function _centerOutput() {
	    var unencoded = this._slider.noUiSlider.get();
	    var sliderAverage = (typeof unencoded === 'undefined' ? 'undefined' : _typeof(unencoded)) === 'object' ? unencoded.reduce(function (previousValue, currentValue) {
	      return previousValue + parseFloat(currentValue);
	    }, 0) / unencoded.length : parseFloat(unencoded);
	    var maxRight = this._element.offsetWidth - this._output.offsetWidth;
	    var handleSize = this._slider.offsetHeight;
	    var position = (0, _mapLinear2.default)(sliderAverage, this._rangeMin, this._rangeMax, 0, 1) * this._slider.offsetWidth - this._output.offsetWidth / 2 + handleSize / 2;
	    this._output.style.left = (0, _limit2.default)(position, 0, maxRight) + 'px';
	  };
	
	  /**
	   * Parse data to use with noUiSlider
	   * Returns given value as array of floats
	   * "0,100" => [0,100]
	   * @param {string} value Current slider values
	   * @returns {Array} values as floats
	   */
	
	
	  Slider.prototype._parseData = function _parseData(value) {
	    return value && value.split(',').map(function (element) {
	      return parseFloat(element);
	    });
	  };
	
	  return Slider;
	}(_component2.default);
	
	exports.default = Slider;
	module.exports = exports['default'];

/***/ },
/* 38 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = mapLinear;
	/**
	 * Linear mapping from range <a1, a2> to range <b1, b2>
	 * @param {number} x The value to map
	 * @param {number} a1 First endpoint of the range <a1, a2>
	 * @param {number} a2 Final endpoint of the range <a1, a2>
	 * @param {number} b1 First endpoint of the range <b1, b2>
	 * @param {number} b2 Final endpoint of the range  <b1, b2>
	 * @returns {number} The mapped value.
	 */
	function mapLinear(x, a1, a2, b1, b2) {
	  return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
	}
	module.exports = exports['default'];

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*! nouislider - 9.2.0 - 2017-01-11 10:35:34 */
	
	(function (factory) {
	
	    if ( true ) {
	
	        // AMD. Register as an anonymous module.
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	
	    } else if ( typeof exports === 'object' ) {
	
	        // Node/CommonJS
	        module.exports = factory();
	
	    } else {
	
	        // Browser globals
	        window.noUiSlider = factory();
	    }
	
	}(function( ){
	
		'use strict';
	
		var VERSION = '9.2.0';
	
	
		// Creates a node, adds it to target, returns the new node.
		function addNodeTo ( target, className ) {
			var div = document.createElement('div');
			addClass(div, className);
			target.appendChild(div);
			return div;
		}
	
		// Removes duplicates from an array.
		function unique ( array ) {
			return array.filter(function(a){
				return !this[a] ? this[a] = true : false;
			}, {});
		}
	
		// Round a value to the closest 'to'.
		function closest ( value, to ) {
			return Math.round(value / to) * to;
		}
	
		// Current position of an element relative to the document.
		function offset ( elem, orientation ) {
	
		var rect = elem.getBoundingClientRect(),
			doc = elem.ownerDocument,
			docElem = doc.documentElement,
			pageOffset = getPageOffset();
	
			// getBoundingClientRect contains left scroll in Chrome on Android.
			// I haven't found a feature detection that proves this. Worst case
			// scenario on mis-match: the 'tap' feature on horizontal sliders breaks.
			if ( /webkit.*Chrome.*Mobile/i.test(navigator.userAgent) ) {
				pageOffset.x = 0;
			}
	
			return orientation ? (rect.top + pageOffset.y - docElem.clientTop) : (rect.left + pageOffset.x - docElem.clientLeft);
		}
	
		// Checks whether a value is numerical.
		function isNumeric ( a ) {
			return typeof a === 'number' && !isNaN( a ) && isFinite( a );
		}
	
		// Sets a class and removes it after [duration] ms.
		function addClassFor ( element, className, duration ) {
			if (duration > 0) {
			addClass(element, className);
				setTimeout(function(){
					removeClass(element, className);
				}, duration);
			}
		}
	
		// Limits a value to 0 - 100
		function limit ( a ) {
			return Math.max(Math.min(a, 100), 0);
		}
	
		// Wraps a variable as an array, if it isn't one yet.
		// Note that an input array is returned by reference!
		function asArray ( a ) {
			return Array.isArray(a) ? a : [a];
		}
	
		// Counts decimals
		function countDecimals ( numStr ) {
			numStr = String(numStr);
			var pieces = numStr.split(".");
			return pieces.length > 1 ? pieces[1].length : 0;
		}
	
		// http://youmightnotneedjquery.com/#add_class
		function addClass ( el, className ) {
			if ( el.classList ) {
				el.classList.add(className);
			} else {
				el.className += ' ' + className;
			}
		}
	
		// http://youmightnotneedjquery.com/#remove_class
		function removeClass ( el, className ) {
			if ( el.classList ) {
				el.classList.remove(className);
			} else {
				el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
			}
		}
	
		// https://plainjs.com/javascript/attributes/adding-removing-and-testing-for-classes-9/
		function hasClass ( el, className ) {
			return el.classList ? el.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(el.className);
		}
	
		// https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY#Notes
		function getPageOffset ( ) {
	
			var supportPageOffset = window.pageXOffset !== undefined,
				isCSS1Compat = ((document.compatMode || "") === "CSS1Compat"),
				x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft,
				y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
	
			return {
				x: x,
				y: y
			};
		}
	
		// we provide a function to compute constants instead
		// of accessing window.* as soon as the module needs it
		// so that we do not compute anything if not needed
		function getActions ( ) {
	
			// Determine the events to bind. IE11 implements pointerEvents without
			// a prefix, which breaks compatibility with the IE10 implementation.
			return window.navigator.pointerEnabled ? {
				start: 'pointerdown',
				move: 'pointermove',
				end: 'pointerup'
			} : window.navigator.msPointerEnabled ? {
				start: 'MSPointerDown',
				move: 'MSPointerMove',
				end: 'MSPointerUp'
			} : {
				start: 'mousedown touchstart',
				move: 'mousemove touchmove',
				end: 'mouseup touchend'
			};
		}
	
	
	// Value calculation
	
		// Determine the size of a sub-range in relation to a full range.
		function subRangeRatio ( pa, pb ) {
			return (100 / (pb - pa));
		}
	
		// (percentage) How many percent is this value of this range?
		function fromPercentage ( range, value ) {
			return (value * 100) / ( range[1] - range[0] );
		}
	
		// (percentage) Where is this value on this range?
		function toPercentage ( range, value ) {
			return fromPercentage( range, range[0] < 0 ?
				value + Math.abs(range[0]) :
					value - range[0] );
		}
	
		// (value) How much is this percentage on this range?
		function isPercentage ( range, value ) {
			return ((value * ( range[1] - range[0] )) / 100) + range[0];
		}
	
	
	// Range conversion
	
		function getJ ( value, arr ) {
	
			var j = 1;
	
			while ( value >= arr[j] ){
				j += 1;
			}
	
			return j;
		}
	
		// (percentage) Input a value, find where, on a scale of 0-100, it applies.
		function toStepping ( xVal, xPct, value ) {
	
			if ( value >= xVal.slice(-1)[0] ){
				return 100;
			}
	
			var j = getJ( value, xVal ), va, vb, pa, pb;
	
			va = xVal[j-1];
			vb = xVal[j];
			pa = xPct[j-1];
			pb = xPct[j];
	
			return pa + (toPercentage([va, vb], value) / subRangeRatio (pa, pb));
		}
	
		// (value) Input a percentage, find where it is on the specified range.
		function fromStepping ( xVal, xPct, value ) {
	
			// There is no range group that fits 100
			if ( value >= 100 ){
				return xVal.slice(-1)[0];
			}
	
			var j = getJ( value, xPct ), va, vb, pa, pb;
	
			va = xVal[j-1];
			vb = xVal[j];
			pa = xPct[j-1];
			pb = xPct[j];
	
			return isPercentage([va, vb], (value - pa) * subRangeRatio (pa, pb));
		}
	
		// (percentage) Get the step that applies at a certain value.
		function getStep ( xPct, xSteps, snap, value ) {
	
			if ( value === 100 ) {
				return value;
			}
	
			var j = getJ( value, xPct ), a, b;
	
			// If 'snap' is set, steps are used as fixed points on the slider.
			if ( snap ) {
	
				a = xPct[j-1];
				b = xPct[j];
	
				// Find the closest position, a or b.
				if ((value - a) > ((b-a)/2)){
					return b;
				}
	
				return a;
			}
	
			if ( !xSteps[j-1] ){
				return value;
			}
	
			return xPct[j-1] + closest(
				value - xPct[j-1],
				xSteps[j-1]
			);
		}
	
	
	// Entry parsing
	
		function handleEntryPoint ( index, value, that ) {
	
			var percentage;
	
			// Wrap numerical input in an array.
			if ( typeof value === "number" ) {
				value = [value];
			}
	
			// Reject any invalid input, by testing whether value is an array.
			if ( Object.prototype.toString.call( value ) !== '[object Array]' ){
				throw new Error("noUiSlider (" + VERSION + "): 'range' contains invalid value.");
			}
	
			// Covert min/max syntax to 0 and 100.
			if ( index === 'min' ) {
				percentage = 0;
			} else if ( index === 'max' ) {
				percentage = 100;
			} else {
				percentage = parseFloat( index );
			}
	
			// Check for correct input.
			if ( !isNumeric( percentage ) || !isNumeric( value[0] ) ) {
				throw new Error("noUiSlider (" + VERSION + "): 'range' value isn't numeric.");
			}
	
			// Store values.
			that.xPct.push( percentage );
			that.xVal.push( value[0] );
	
			// NaN will evaluate to false too, but to keep
			// logging clear, set step explicitly. Make sure
			// not to override the 'step' setting with false.
			if ( !percentage ) {
				if ( !isNaN( value[1] ) ) {
					that.xSteps[0] = value[1];
				}
			} else {
				that.xSteps.push( isNaN(value[1]) ? false : value[1] );
			}
	
			that.xHighestCompleteStep.push(0);
		}
	
		function handleStepPoint ( i, n, that ) {
	
			// Ignore 'false' stepping.
			if ( !n ) {
				return true;
			}
	
			// Factor to range ratio
			that.xSteps[i] = fromPercentage([
				 that.xVal[i]
				,that.xVal[i+1]
			], n) / subRangeRatio (
				that.xPct[i],
				that.xPct[i+1] );
	
			var totalSteps = (that.xVal[i+1] - that.xVal[i]) / that.xNumSteps[i];
			var highestStep = Math.ceil(Number(totalSteps.toFixed(3)) - 1);
			var step = that.xVal[i] + (that.xNumSteps[i] * highestStep);
	
			that.xHighestCompleteStep[i] = step;
		}
	
	
	// Interface
	
		// The interface to Spectrum handles all direction-based
		// conversions, so the above values are unaware.
	
		function Spectrum ( entry, snap, direction, singleStep ) {
	
			this.xPct = [];
			this.xVal = [];
			this.xSteps = [ singleStep || false ];
			this.xNumSteps = [ false ];
			this.xHighestCompleteStep = [];
	
			this.snap = snap;
			this.direction = direction;
	
			var index, ordered = [ /* [0, 'min'], [1, '50%'], [2, 'max'] */ ];
	
			// Map the object keys to an array.
			for ( index in entry ) {
				if ( entry.hasOwnProperty(index) ) {
					ordered.push([entry[index], index]);
				}
			}
	
			// Sort all entries by value (numeric sort).
			if ( ordered.length && typeof ordered[0][0] === "object" ) {
				ordered.sort(function(a, b) { return a[0][0] - b[0][0]; });
			} else {
				ordered.sort(function(a, b) { return a[0] - b[0]; });
			}
	
	
			// Convert all entries to subranges.
			for ( index = 0; index < ordered.length; index++ ) {
				handleEntryPoint(ordered[index][1], ordered[index][0], this);
			}
	
			// Store the actual step values.
			// xSteps is sorted in the same order as xPct and xVal.
			this.xNumSteps = this.xSteps.slice(0);
	
			// Convert all numeric steps to the percentage of the subrange they represent.
			for ( index = 0; index < this.xNumSteps.length; index++ ) {
				handleStepPoint(index, this.xNumSteps[index], this);
			}
		}
	
		Spectrum.prototype.getMargin = function ( value ) {
	
			var step = this.xNumSteps[0];
	
			if ( step && ((value / step) % 1) !== 0 ) {
				throw new Error("noUiSlider (" + VERSION + "): 'limit', 'margin' and 'padding' must be divisible by step.");
			}
	
			return this.xPct.length === 2 ? fromPercentage(this.xVal, value) : false;
		};
	
		Spectrum.prototype.toStepping = function ( value ) {
	
			value = toStepping( this.xVal, this.xPct, value );
	
			return value;
		};
	
		Spectrum.prototype.fromStepping = function ( value ) {
	
			return fromStepping( this.xVal, this.xPct, value );
		};
	
		Spectrum.prototype.getStep = function ( value ) {
	
			value = getStep(this.xPct, this.xSteps, this.snap, value );
	
			return value;
		};
	
		Spectrum.prototype.getNearbySteps = function ( value ) {
	
			var j = getJ(value, this.xPct);
	
			return {
				stepBefore: { startValue: this.xVal[j-2], step: this.xNumSteps[j-2], highestStep: this.xHighestCompleteStep[j-2] },
				thisStep: { startValue: this.xVal[j-1], step: this.xNumSteps[j-1], highestStep: this.xHighestCompleteStep[j-1] },
				stepAfter: { startValue: this.xVal[j-0], step: this.xNumSteps[j-0], highestStep: this.xHighestCompleteStep[j-0] }
			};
		};
	
		Spectrum.prototype.countStepDecimals = function () {
			var stepDecimals = this.xNumSteps.map(countDecimals);
			return Math.max.apply(null, stepDecimals);
	 	};
	
		// Outside testing
		Spectrum.prototype.convert = function ( value ) {
			return this.getStep(this.toStepping(value));
		};
	
	/*	Every input option is tested and parsed. This'll prevent
		endless validation in internal methods. These tests are
		structured with an item for every option available. An
		option can be marked as required by setting the 'r' flag.
		The testing function is provided with three arguments:
			- The provided value for the option;
			- A reference to the options object;
			- The name for the option;
	
		The testing function returns false when an error is detected,
		or true when everything is OK. It can also modify the option
		object, to make sure all values can be correctly looped elsewhere. */
	
		var defaultFormatter = { 'to': function( value ){
			return value !== undefined && value.toFixed(2);
		}, 'from': Number };
	
		function testStep ( parsed, entry ) {
	
			if ( !isNumeric( entry ) ) {
				throw new Error("noUiSlider (" + VERSION + "): 'step' is not numeric.");
			}
	
			// The step option can still be used to set stepping
			// for linear sliders. Overwritten if set in 'range'.
			parsed.singleStep = entry;
		}
	
		function testRange ( parsed, entry ) {
	
			// Filter incorrect input.
			if ( typeof entry !== 'object' || Array.isArray(entry) ) {
				throw new Error("noUiSlider (" + VERSION + "): 'range' is not an object.");
			}
	
			// Catch missing start or end.
			if ( entry.min === undefined || entry.max === undefined ) {
				throw new Error("noUiSlider (" + VERSION + "): Missing 'min' or 'max' in 'range'.");
			}
	
			// Catch equal start or end.
			if ( entry.min === entry.max ) {
				throw new Error("noUiSlider (" + VERSION + "): 'range' 'min' and 'max' cannot be equal.");
			}
	
			parsed.spectrum = new Spectrum(entry, parsed.snap, parsed.dir, parsed.singleStep);
		}
	
		function testStart ( parsed, entry ) {
	
			entry = asArray(entry);
	
			// Validate input. Values aren't tested, as the public .val method
			// will always provide a valid location.
			if ( !Array.isArray( entry ) || !entry.length ) {
				throw new Error("noUiSlider (" + VERSION + "): 'start' option is incorrect.");
			}
	
			// Store the number of handles.
			parsed.handles = entry.length;
	
			// When the slider is initialized, the .val method will
			// be called with the start options.
			parsed.start = entry;
		}
	
		function testSnap ( parsed, entry ) {
	
			// Enforce 100% stepping within subranges.
			parsed.snap = entry;
	
			if ( typeof entry !== 'boolean' ){
				throw new Error("noUiSlider (" + VERSION + "): 'snap' option must be a boolean.");
			}
		}
	
		function testAnimate ( parsed, entry ) {
	
			// Enforce 100% stepping within subranges.
			parsed.animate = entry;
	
			if ( typeof entry !== 'boolean' ){
				throw new Error("noUiSlider (" + VERSION + "): 'animate' option must be a boolean.");
			}
		}
	
		function testAnimationDuration ( parsed, entry ) {
	
			parsed.animationDuration = entry;
	
			if ( typeof entry !== 'number' ){
				throw new Error("noUiSlider (" + VERSION + "): 'animationDuration' option must be a number.");
			}
		}
	
		function testConnect ( parsed, entry ) {
	
			var connect = [false];
			var i;
	
			// Map legacy options
			if ( entry === 'lower' ) {
				entry = [true, false];
			}
	
			else if ( entry === 'upper' ) {
				entry = [false, true];
			}
	
			// Handle boolean options
			if ( entry === true || entry === false ) {
	
				for ( i = 1; i < parsed.handles; i++ ) {
					connect.push(entry);
				}
	
				connect.push(false);
			}
	
			// Reject invalid input
			else if ( !Array.isArray( entry ) || !entry.length || entry.length !== parsed.handles + 1 ) {
				throw new Error("noUiSlider (" + VERSION + "): 'connect' option doesn't match handle count.");
			}
	
			else {
				connect = entry;
			}
	
			parsed.connect = connect;
		}
	
		function testOrientation ( parsed, entry ) {
	
			// Set orientation to an a numerical value for easy
			// array selection.
			switch ( entry ){
			  case 'horizontal':
				parsed.ort = 0;
				break;
			  case 'vertical':
				parsed.ort = 1;
				break;
			  default:
				throw new Error("noUiSlider (" + VERSION + "): 'orientation' option is invalid.");
			}
		}
	
		function testMargin ( parsed, entry ) {
	
			if ( !isNumeric(entry) ){
				throw new Error("noUiSlider (" + VERSION + "): 'margin' option must be numeric.");
			}
	
			// Issue #582
			if ( entry === 0 ) {
				return;
			}
	
			parsed.margin = parsed.spectrum.getMargin(entry);
	
			if ( !parsed.margin ) {
				throw new Error("noUiSlider (" + VERSION + "): 'margin' option is only supported on linear sliders.");
			}
		}
	
		function testLimit ( parsed, entry ) {
	
			if ( !isNumeric(entry) ){
				throw new Error("noUiSlider (" + VERSION + "): 'limit' option must be numeric.");
			}
	
			parsed.limit = parsed.spectrum.getMargin(entry);
	
			if ( !parsed.limit || parsed.handles < 2 ) {
				throw new Error("noUiSlider (" + VERSION + "): 'limit' option is only supported on linear sliders with 2 or more handles.");
			}
		}
	
		function testPadding ( parsed, entry ) {
	
			if ( !isNumeric(entry) ){
				throw new Error("noUiSlider (" + VERSION + "): 'padding' option must be numeric.");
			}
	
			if ( entry === 0 ) {
				return;
			}
	
			parsed.padding = parsed.spectrum.getMargin(entry);
	
			if ( !parsed.padding ) {
				throw new Error("noUiSlider (" + VERSION + "): 'padding' option is only supported on linear sliders.");
			}
	
			if ( parsed.padding < 0 ) {
				throw new Error("noUiSlider (" + VERSION + "): 'padding' option must be a positive number.");
			}
	
			if ( parsed.padding >= 50 ) {
				throw new Error("noUiSlider (" + VERSION + "): 'padding' option must be less than half the range.");
			}
		}
	
		function testDirection ( parsed, entry ) {
	
			// Set direction as a numerical value for easy parsing.
			// Invert connection for RTL sliders, so that the proper
			// handles get the connect/background classes.
			switch ( entry ) {
			  case 'ltr':
				parsed.dir = 0;
				break;
			  case 'rtl':
				parsed.dir = 1;
				break;
			  default:
				throw new Error("noUiSlider (" + VERSION + "): 'direction' option was not recognized.");
			}
		}
	
		function testBehaviour ( parsed, entry ) {
	
			// Make sure the input is a string.
			if ( typeof entry !== 'string' ) {
				throw new Error("noUiSlider (" + VERSION + "): 'behaviour' must be a string containing options.");
			}
	
			// Check if the string contains any keywords.
			// None are required.
			var tap = entry.indexOf('tap') >= 0;
			var drag = entry.indexOf('drag') >= 0;
			var fixed = entry.indexOf('fixed') >= 0;
			var snap = entry.indexOf('snap') >= 0;
			var hover = entry.indexOf('hover') >= 0;
	
			if ( fixed ) {
	
				if ( parsed.handles !== 2 ) {
					throw new Error("noUiSlider (" + VERSION + "): 'fixed' behaviour must be used with 2 handles");
				}
	
				// Use margin to enforce fixed state
				testMargin(parsed, parsed.start[1] - parsed.start[0]);
			}
	
			parsed.events = {
				tap: tap || snap,
				drag: drag,
				fixed: fixed,
				snap: snap,
				hover: hover
			};
		}
	
		function testTooltips ( parsed, entry ) {
	
			if ( entry === false ) {
				return;
			}
	
			else if ( entry === true ) {
	
				parsed.tooltips = [];
	
				for ( var i = 0; i < parsed.handles; i++ ) {
					parsed.tooltips.push(true);
				}
			}
	
			else {
	
				parsed.tooltips = asArray(entry);
	
				if ( parsed.tooltips.length !== parsed.handles ) {
					throw new Error("noUiSlider (" + VERSION + "): must pass a formatter for all handles.");
				}
	
				parsed.tooltips.forEach(function(formatter){
					if ( typeof formatter !== 'boolean' && (typeof formatter !== 'object' || typeof formatter.to !== 'function') ) {
						throw new Error("noUiSlider (" + VERSION + "): 'tooltips' must be passed a formatter or 'false'.");
					}
				});
			}
		}
	
		function testFormat ( parsed, entry ) {
	
			parsed.format = entry;
	
			// Any object with a to and from method is supported.
			if ( typeof entry.to === 'function' && typeof entry.from === 'function' ) {
				return true;
			}
	
			throw new Error("noUiSlider (" + VERSION + "): 'format' requires 'to' and 'from' methods.");
		}
	
		function testCssPrefix ( parsed, entry ) {
	
			if ( entry !== undefined && typeof entry !== 'string' && entry !== false ) {
				throw new Error("noUiSlider (" + VERSION + "): 'cssPrefix' must be a string or `false`.");
			}
	
			parsed.cssPrefix = entry;
		}
	
		function testCssClasses ( parsed, entry ) {
	
			if ( entry !== undefined && typeof entry !== 'object' ) {
				throw new Error("noUiSlider (" + VERSION + "): 'cssClasses' must be an object.");
			}
	
			if ( typeof parsed.cssPrefix === 'string' ) {
				parsed.cssClasses = {};
	
				for ( var key in entry ) {
					if ( !entry.hasOwnProperty(key) ) { continue; }
	
					parsed.cssClasses[key] = parsed.cssPrefix + entry[key];
				}
			} else {
				parsed.cssClasses = entry;
			}
		}
	
		function testUseRaf ( parsed, entry ) {
			if ( entry === true || entry === false ) {
				parsed.useRequestAnimationFrame = entry;
			} else {
				throw new Error("noUiSlider (" + VERSION + "): 'useRequestAnimationFrame' option should be true (default) or false.");
			}
		}
	
		// Test all developer settings and parse to assumption-safe values.
		function testOptions ( options ) {
	
			// To prove a fix for #537, freeze options here.
			// If the object is modified, an error will be thrown.
			// Object.freeze(options);
	
			var parsed = {
				margin: 0,
				limit: 0,
				padding: 0,
				animate: true,
				animationDuration: 300,
				format: defaultFormatter
			};
	
			// Tests are executed in the order they are presented here.
			var tests = {
				'step': { r: false, t: testStep },
				'start': { r: true, t: testStart },
				'connect': { r: true, t: testConnect },
				'direction': { r: true, t: testDirection },
				'snap': { r: false, t: testSnap },
				'animate': { r: false, t: testAnimate },
				'animationDuration': { r: false, t: testAnimationDuration },
				'range': { r: true, t: testRange },
				'orientation': { r: false, t: testOrientation },
				'margin': { r: false, t: testMargin },
				'limit': { r: false, t: testLimit },
				'padding': { r: false, t: testPadding },
				'behaviour': { r: true, t: testBehaviour },
				'format': { r: false, t: testFormat },
				'tooltips': { r: false, t: testTooltips },
				'cssPrefix': { r: false, t: testCssPrefix },
				'cssClasses': { r: false, t: testCssClasses },
				'useRequestAnimationFrame': { r: false, t: testUseRaf }
			};
	
			var defaults = {
				'connect': false,
				'direction': 'ltr',
				'behaviour': 'tap',
				'orientation': 'horizontal',
				'cssPrefix' : 'noUi-',
				'cssClasses': {
					target: 'target',
					base: 'base',
					origin: 'origin',
					handle: 'handle',
					handleLower: 'handle-lower',
					handleUpper: 'handle-upper',
					horizontal: 'horizontal',
					vertical: 'vertical',
					background: 'background',
					connect: 'connect',
					ltr: 'ltr',
					rtl: 'rtl',
					draggable: 'draggable',
					drag: 'state-drag',
					tap: 'state-tap',
					active: 'active',
					tooltip: 'tooltip',
					pips: 'pips',
					pipsHorizontal: 'pips-horizontal',
					pipsVertical: 'pips-vertical',
					marker: 'marker',
					markerHorizontal: 'marker-horizontal',
					markerVertical: 'marker-vertical',
					markerNormal: 'marker-normal',
					markerLarge: 'marker-large',
					markerSub: 'marker-sub',
					value: 'value',
					valueHorizontal: 'value-horizontal',
					valueVertical: 'value-vertical',
					valueNormal: 'value-normal',
					valueLarge: 'value-large',
					valueSub: 'value-sub'
				},
				'useRequestAnimationFrame': true
			};
	
			// Run all options through a testing mechanism to ensure correct
			// input. It should be noted that options might get modified to
			// be handled properly. E.g. wrapping integers in arrays.
			Object.keys(tests).forEach(function( name ){
	
				// If the option isn't set, but it is required, throw an error.
				if ( options[name] === undefined && defaults[name] === undefined ) {
	
					if ( tests[name].r ) {
						throw new Error("noUiSlider (" + VERSION + "): '" + name + "' is required.");
					}
	
					return true;
				}
	
				tests[name].t( parsed, options[name] === undefined ? defaults[name] : options[name] );
			});
	
			// Forward pips options
			parsed.pips = options.pips;
	
			var styles = [['left', 'top'], ['right', 'bottom']];
	
			// Pre-define the styles.
			parsed.style = styles[parsed.dir][parsed.ort];
			parsed.styleOposite = styles[parsed.dir?0:1][parsed.ort];
	
			return parsed;
		}
	
	
	function closure ( target, options, originalOptions ){
	
		var actions = getActions( );
	
		// All variables local to 'closure' are prefixed with 'scope_'
		var scope_Target = target;
		var scope_Locations = [];
		var scope_Base;
		var scope_Handles;
		var scope_HandleNumbers = [];
		var scope_ActiveHandle = false;
		var scope_Connects;
		var scope_Spectrum = options.spectrum;
		var scope_Values = [];
		var scope_Events = {};
		var scope_Self;
	
	
		// Append a origin to the base
		function addOrigin ( base, handleNumber ) {
	
			var origin = addNodeTo(base, options.cssClasses.origin);
			var handle = addNodeTo(origin, options.cssClasses.handle);
	
			handle.setAttribute('data-handle', handleNumber);
	
			if ( handleNumber === 0 ) {
				addClass(handle, options.cssClasses.handleLower);
			}
	
			else if ( handleNumber === options.handles - 1 ) {
				addClass(handle, options.cssClasses.handleUpper);
			}
	
			return origin;
		}
	
		// Insert nodes for connect elements
		function addConnect ( base, add ) {
	
			if ( !add ) {
				return false;
			}
	
			return addNodeTo(base, options.cssClasses.connect);
		}
	
		// Add handles to the slider base.
		function addElements ( connectOptions, base ) {
	
			scope_Handles = [];
			scope_Connects = [];
	
			scope_Connects.push(addConnect(base, connectOptions[0]));
	
			// [::::O====O====O====]
			// connectOptions = [0, 1, 1, 1]
	
			for ( var i = 0; i < options.handles; i++ ) {
				// Keep a list of all added handles.
				scope_Handles.push(addOrigin(base, i));
				scope_HandleNumbers[i] = i;
				scope_Connects.push(addConnect(base, connectOptions[i + 1]));
			}
		}
	
		// Initialize a single slider.
		function addSlider ( target ) {
	
			// Apply classes and data to the target.
			addClass(target, options.cssClasses.target);
	
			if ( options.dir === 0 ) {
				addClass(target, options.cssClasses.ltr);
			} else {
				addClass(target, options.cssClasses.rtl);
			}
	
			if ( options.ort === 0 ) {
				addClass(target, options.cssClasses.horizontal);
			} else {
				addClass(target, options.cssClasses.vertical);
			}
	
			scope_Base = addNodeTo(target, options.cssClasses.base);
		}
	
	
		function addTooltip ( handle, handleNumber ) {
	
			if ( !options.tooltips[handleNumber] ) {
				return false;
			}
	
			return addNodeTo(handle.firstChild, options.cssClasses.tooltip);
		}
	
		// The tooltips option is a shorthand for using the 'update' event.
		function tooltips ( ) {
	
			// Tooltips are added with options.tooltips in original order.
			var tips = scope_Handles.map(addTooltip);
	
			bindEvent('update', function(values, handleNumber, unencoded) {
	
				if ( !tips[handleNumber] ) {
					return;
				}
	
				var formattedValue = values[handleNumber];
	
				if ( options.tooltips[handleNumber] !== true ) {
					formattedValue = options.tooltips[handleNumber].to(unencoded[handleNumber]);
				}
	
				tips[handleNumber].innerHTML = formattedValue;
			});
		}
	
	
		function getGroup ( mode, values, stepped ) {
	
			// Use the range.
			if ( mode === 'range' || mode === 'steps' ) {
				return scope_Spectrum.xVal;
			}
	
			if ( mode === 'count' ) {
	
				if ( !values ) {
					throw new Error("noUiSlider (" + VERSION + "): 'values' required for mode 'count'.");
				}
	
				// Divide 0 - 100 in 'count' parts.
				var spread = ( 100 / (values - 1) );
				var v;
				var i = 0;
	
				values = [];
	
				// List these parts and have them handled as 'positions'.
				while ( (v = i++ * spread) <= 100 ) {
					values.push(v);
				}
	
				mode = 'positions';
			}
	
			if ( mode === 'positions' ) {
	
				// Map all percentages to on-range values.
				return values.map(function( value ){
					return scope_Spectrum.fromStepping( stepped ? scope_Spectrum.getStep( value ) : value );
				});
			}
	
			if ( mode === 'values' ) {
	
				// If the value must be stepped, it needs to be converted to a percentage first.
				if ( stepped ) {
	
					return values.map(function( value ){
	
						// Convert to percentage, apply step, return to value.
						return scope_Spectrum.fromStepping( scope_Spectrum.getStep( scope_Spectrum.toStepping( value ) ) );
					});
	
				}
	
				// Otherwise, we can simply use the values.
				return values;
			}
		}
	
		function generateSpread ( density, mode, group ) {
	
			function safeIncrement(value, increment) {
				// Avoid floating point variance by dropping the smallest decimal places.
				return (value + increment).toFixed(7) / 1;
			}
	
			var indexes = {};
			var firstInRange = scope_Spectrum.xVal[0];
			var lastInRange = scope_Spectrum.xVal[scope_Spectrum.xVal.length-1];
			var ignoreFirst = false;
			var ignoreLast = false;
			var prevPct = 0;
	
			// Create a copy of the group, sort it and filter away all duplicates.
			group = unique(group.slice().sort(function(a, b){ return a - b; }));
	
			// Make sure the range starts with the first element.
			if ( group[0] !== firstInRange ) {
				group.unshift(firstInRange);
				ignoreFirst = true;
			}
	
			// Likewise for the last one.
			if ( group[group.length - 1] !== lastInRange ) {
				group.push(lastInRange);
				ignoreLast = true;
			}
	
			group.forEach(function ( current, index ) {
	
				// Get the current step and the lower + upper positions.
				var step;
				var i;
				var q;
				var low = current;
				var high = group[index+1];
				var newPct;
				var pctDifference;
				var pctPos;
				var type;
				var steps;
				var realSteps;
				var stepsize;
	
				// When using 'steps' mode, use the provided steps.
				// Otherwise, we'll step on to the next subrange.
				if ( mode === 'steps' ) {
					step = scope_Spectrum.xNumSteps[ index ];
				}
	
				// Default to a 'full' step.
				if ( !step ) {
					step = high-low;
				}
	
				// Low can be 0, so test for false. If high is undefined,
				// we are at the last subrange. Index 0 is already handled.
				if ( low === false || high === undefined ) {
					return;
				}
	
				// Make sure step isn't 0, which would cause an infinite loop (#654)
				step = Math.max(step, 0.0000001);
	
				// Find all steps in the subrange.
				for ( i = low; i <= high; i = safeIncrement(i, step) ) {
	
					// Get the percentage value for the current step,
					// calculate the size for the subrange.
					newPct = scope_Spectrum.toStepping( i );
					pctDifference = newPct - prevPct;
	
					steps = pctDifference / density;
					realSteps = Math.round(steps);
	
					// This ratio represents the ammount of percentage-space a point indicates.
					// For a density 1 the points/percentage = 1. For density 2, that percentage needs to be re-devided.
					// Round the percentage offset to an even number, then divide by two
					// to spread the offset on both sides of the range.
					stepsize = pctDifference/realSteps;
	
					// Divide all points evenly, adding the correct number to this subrange.
					// Run up to <= so that 100% gets a point, event if ignoreLast is set.
					for ( q = 1; q <= realSteps; q += 1 ) {
	
						// The ratio between the rounded value and the actual size might be ~1% off.
						// Correct the percentage offset by the number of points
						// per subrange. density = 1 will result in 100 points on the
						// full range, 2 for 50, 4 for 25, etc.
						pctPos = prevPct + ( q * stepsize );
						indexes[pctPos.toFixed(5)] = ['x', 0];
					}
	
					// Determine the point type.
					type = (group.indexOf(i) > -1) ? 1 : ( mode === 'steps' ? 2 : 0 );
	
					// Enforce the 'ignoreFirst' option by overwriting the type for 0.
					if ( !index && ignoreFirst ) {
						type = 0;
					}
	
					if ( !(i === high && ignoreLast)) {
						// Mark the 'type' of this point. 0 = plain, 1 = real value, 2 = step value.
						indexes[newPct.toFixed(5)] = [i, type];
					}
	
					// Update the percentage count.
					prevPct = newPct;
				}
			});
	
			return indexes;
		}
	
		function addMarking ( spread, filterFunc, formatter ) {
	
			var element = document.createElement('div');
			var out = '';
			var valueSizeClasses = [
				options.cssClasses.valueNormal,
				options.cssClasses.valueLarge,
				options.cssClasses.valueSub
			];
			var markerSizeClasses = [
				options.cssClasses.markerNormal,
				options.cssClasses.markerLarge,
				options.cssClasses.markerSub
			];
			var valueOrientationClasses = [
				options.cssClasses.valueHorizontal,
				options.cssClasses.valueVertical
			];
			var markerOrientationClasses = [
				options.cssClasses.markerHorizontal,
				options.cssClasses.markerVertical
			];
	
			addClass(element, options.cssClasses.pips);
			addClass(element, options.ort === 0 ? options.cssClasses.pipsHorizontal : options.cssClasses.pipsVertical);
	
			function getClasses( type, source ){
				var a = source === options.cssClasses.value;
				var orientationClasses = a ? valueOrientationClasses : markerOrientationClasses;
				var sizeClasses = a ? valueSizeClasses : markerSizeClasses;
	
				return source + ' ' + orientationClasses[options.ort] + ' ' + sizeClasses[type];
			}
	
			function getTags( offset, source, values ) {
				return 'class="' + getClasses(values[1], source) + '" style="' + options.style + ': ' + offset + '%"';
			}
	
			function addSpread ( offset, values ){
	
				// Apply the filter function, if it is set.
				values[1] = (values[1] && filterFunc) ? filterFunc(values[0], values[1]) : values[1];
	
				// Add a marker for every point
				out += '<div ' + getTags(offset, options.cssClasses.marker, values) + '></div>';
	
				// Values are only appended for points marked '1' or '2'.
				if ( values[1] ) {
					out += '<div ' + getTags(offset, options.cssClasses.value, values) + '>' + formatter.to(values[0]) + '</div>';
				}
			}
	
			// Append all points.
			Object.keys(spread).forEach(function(a){
				addSpread(a, spread[a]);
			});
	
			element.innerHTML = out;
	
			return element;
		}
	
		function pips ( grid ) {
	
			var mode = grid.mode;
			var density = grid.density || 1;
			var filter = grid.filter || false;
			var values = grid.values || false;
			var stepped = grid.stepped || false;
			var group = getGroup( mode, values, stepped );
			var spread = generateSpread( density, mode, group );
			var format = grid.format || {
				to: Math.round
			};
	
			return scope_Target.appendChild(addMarking(
				spread,
				filter,
				format
			));
		}
	
	
		// Shorthand for base dimensions.
		function baseSize ( ) {
			var rect = scope_Base.getBoundingClientRect(), alt = 'offset' + ['Width', 'Height'][options.ort];
			return options.ort === 0 ? (rect.width||scope_Base[alt]) : (rect.height||scope_Base[alt]);
		}
	
		// Handler for attaching events trough a proxy.
		function attachEvent ( events, element, callback, data ) {
	
			// This function can be used to 'filter' events to the slider.
			// element is a node, not a nodeList
	
			var method = function ( e ){
	
				if ( scope_Target.hasAttribute('disabled') ) {
					return false;
				}
	
				// Stop if an active 'tap' transition is taking place.
				if ( hasClass(scope_Target, options.cssClasses.tap) ) {
					return false;
				}
	
				e = fixEvent(e, data.pageOffset);
	
				// Handle reject of multitouch
				if ( !e ) {
					return false;
				}
	
				// Ignore right or middle clicks on start #454
				if ( events === actions.start && e.buttons !== undefined && e.buttons > 1 ) {
					return false;
				}
	
				// Ignore right or middle clicks on start #454
				if ( data.hover && e.buttons ) {
					return false;
				}
	
				e.calcPoint = e.points[ options.ort ];
	
				// Call the event handler with the event [ and additional data ].
				callback ( e, data );
			};
	
			var methods = [];
	
			// Bind a closure on the target for every event type.
			events.split(' ').forEach(function( eventName ){
				element.addEventListener(eventName, method, false);
				methods.push([eventName, method]);
			});
	
			return methods;
		}
	
		// Provide a clean event with standardized offset values.
		function fixEvent ( e, pageOffset ) {
	
			// Prevent scrolling and panning on touch events, while
			// attempting to slide. The tap event also depends on this.
			e.preventDefault();
	
			// Filter the event to register the type, which can be
			// touch, mouse or pointer. Offset changes need to be
			// made on an event specific basis.
			var touch = e.type.indexOf('touch') === 0;
			var mouse = e.type.indexOf('mouse') === 0;
			var pointer = e.type.indexOf('pointer') === 0;
			var x;
			var y;
	
			// IE10 implemented pointer events with a prefix;
			if ( e.type.indexOf('MSPointer') === 0 ) {
				pointer = true;
			}
	
			if ( touch ) {
	
				// Fix bug when user touches with two or more fingers on mobile devices.
				// It's useful when you have two or more sliders on one page,
				// that can be touched simultaneously.
				// #649, #663, #668
				if ( e.touches.length > 1 ) {
					return false;
				}
	
				// noUiSlider supports one movement at a time,
				// so we can select the first 'changedTouch'.
				x = e.changedTouches[0].pageX;
				y = e.changedTouches[0].pageY;
			}
	
			pageOffset = pageOffset || getPageOffset();
	
			if ( mouse || pointer ) {
				x = e.clientX + pageOffset.x;
				y = e.clientY + pageOffset.y;
			}
	
			e.pageOffset = pageOffset;
			e.points = [x, y];
			e.cursor = mouse || pointer; // Fix #435
	
			return e;
		}
	
		// Translate a coordinate in the document to a percentage on the slider
		function calcPointToPercentage ( calcPoint ) {
			var location = calcPoint - offset(scope_Base, options.ort);
			var proposal = ( location * 100 ) / baseSize();
			return options.dir ? 100 - proposal : proposal;
		}
	
		// Find handle closest to a certain percentage on the slider
		function getClosestHandle ( proposal ) {
	
			var closest = 100;
			var handleNumber = false;
	
			scope_Handles.forEach(function(handle, index){
	
				// Disabled handles are ignored
				if ( handle.hasAttribute('disabled') ) {
					return;
				}
	
				var pos = Math.abs(scope_Locations[index] - proposal);
	
				if ( pos < closest ) {
					handleNumber = index;
					closest = pos;
				}
			});
	
			return handleNumber;
		}
	
		// Moves handle(s) by a percentage
		// (bool, % to move, [% where handle started, ...], [index in scope_Handles, ...])
		function moveHandles ( upward, proposal, locations, handleNumbers ) {
	
			var proposals = locations.slice();
	
			var b = [!upward, upward];
			var f = [upward, !upward];
	
			// Copy handleNumbers so we don't change the dataset
			handleNumbers = handleNumbers.slice();
	
			// Check to see which handle is 'leading'.
			// If that one can't move the second can't either.
			if ( upward ) {
				handleNumbers.reverse();
			}
	
			// Step 1: get the maximum percentage that any of the handles can move
			if ( handleNumbers.length > 1 ) {
	
				handleNumbers.forEach(function(handleNumber, o) {
	
					var to = checkHandlePosition(proposals, handleNumber, proposals[handleNumber] + proposal, b[o], f[o]);
	
					// Stop if one of the handles can't move.
					if ( to === false ) {
						proposal = 0;
					} else {
						proposal = to - proposals[handleNumber];
						proposals[handleNumber] = to;
					}
				});
			}
	
			// If using one handle, check backward AND forward
			else {
				b = f = [true];
			}
	
			var state = false;
	
			// Step 2: Try to set the handles with the found percentage
			handleNumbers.forEach(function(handleNumber, o) {
				state = setHandle(handleNumber, locations[handleNumber] + proposal, b[o], f[o]) || state;
			});
	
			// Step 3: If a handle moved, fire events
			if ( state ) {
				handleNumbers.forEach(function(handleNumber){
					fireEvent('update', handleNumber);
					fireEvent('slide', handleNumber);
				});
			}
		}
	
		// External event handling
		function fireEvent ( eventName, handleNumber, tap ) {
	
			Object.keys(scope_Events).forEach(function( targetEvent ) {
	
				var eventType = targetEvent.split('.')[0];
	
				if ( eventName === eventType ) {
					scope_Events[targetEvent].forEach(function( callback ) {
	
						callback.call(
							// Use the slider public API as the scope ('this')
							scope_Self,
							// Return values as array, so arg_1[arg_2] is always valid.
							scope_Values.map(options.format.to),
							// Handle index, 0 or 1
							handleNumber,
							// Unformatted slider values
							scope_Values.slice(),
							// Event is fired by tap, true or false
							tap || false,
							// Left offset of the handle, in relation to the slider
							scope_Locations.slice()
						);
					});
				}
			});
		}
	
	
		// Fire 'end' when a mouse or pen leaves the document.
		function documentLeave ( event, data ) {
			if ( event.type === "mouseout" && event.target.nodeName === "HTML" && event.relatedTarget === null ){
				eventEnd (event, data);
			}
		}
	
		// Handle movement on document for handle and range drag.
		function eventMove ( event, data ) {
	
			// Fix #498
			// Check value of .buttons in 'start' to work around a bug in IE10 mobile (data.buttonsProperty).
			// https://connect.microsoft.com/IE/feedback/details/927005/mobile-ie10-windows-phone-buttons-property-of-pointermove-event-always-zero
			// IE9 has .buttons and .which zero on mousemove.
			// Firefox breaks the spec MDN defines.
			if ( navigator.appVersion.indexOf("MSIE 9") === -1 && event.buttons === 0 && data.buttonsProperty !== 0 ) {
				return eventEnd(event, data);
			}
	
			// Check if we are moving up or down
			var movement = (options.dir ? -1 : 1) * (event.calcPoint - data.startCalcPoint);
	
			// Convert the movement into a percentage of the slider width/height
			var proposal = (movement * 100) / data.baseSize;
	
			moveHandles(movement > 0, proposal, data.locations, data.handleNumbers);
		}
	
		// Unbind move events on document, call callbacks.
		function eventEnd ( event, data ) {
	
			// The handle is no longer active, so remove the class.
			if ( scope_ActiveHandle ) {
				removeClass(scope_ActiveHandle, options.cssClasses.active);
				scope_ActiveHandle = false;
			}
	
			// Remove cursor styles and text-selection events bound to the body.
			if ( event.cursor ) {
				document.body.style.cursor = '';
				document.body.removeEventListener('selectstart', document.body.noUiListener);
			}
	
			// Unbind the move and end events, which are added on 'start'.
			document.documentElement.noUiListeners.forEach(function( c ) {
				document.documentElement.removeEventListener(c[0], c[1]);
			});
	
			// Remove dragging class.
			removeClass(scope_Target, options.cssClasses.drag);
	
			setZindex();
	
			data.handleNumbers.forEach(function(handleNumber){
				fireEvent('set', handleNumber);
				fireEvent('change', handleNumber);
				fireEvent('end', handleNumber);
			});
		}
	
		// Bind move events on document.
		function eventStart ( event, data ) {
	
			if ( data.handleNumbers.length === 1 ) {
	
				var handle = scope_Handles[data.handleNumbers[0]];
	
				// Ignore 'disabled' handles
				if ( handle.hasAttribute('disabled') ) {
					return false;
				}
	
				// Mark the handle as 'active' so it can be styled.
				scope_ActiveHandle = handle.children[0];
				addClass(scope_ActiveHandle, options.cssClasses.active);
			}
	
			// Fix #551, where a handle gets selected instead of dragged.
			event.preventDefault();
	
			// A drag should never propagate up to the 'tap' event.
			event.stopPropagation();
	
			// Attach the move and end events.
			var moveEvent = attachEvent(actions.move, document.documentElement, eventMove, {
				startCalcPoint: event.calcPoint,
				baseSize: baseSize(),
				pageOffset: event.pageOffset,
				handleNumbers: data.handleNumbers,
				buttonsProperty: event.buttons,
				locations: scope_Locations.slice()
			});
	
			var endEvent = attachEvent(actions.end, document.documentElement, eventEnd, {
				handleNumbers: data.handleNumbers
			});
	
			var outEvent = attachEvent("mouseout", document.documentElement, documentLeave, {
				handleNumbers: data.handleNumbers
			});
	
			document.documentElement.noUiListeners = moveEvent.concat(endEvent, outEvent);
	
			// Text selection isn't an issue on touch devices,
			// so adding cursor styles can be skipped.
			if ( event.cursor ) {
	
				// Prevent the 'I' cursor and extend the range-drag cursor.
				document.body.style.cursor = getComputedStyle(event.target).cursor;
	
				// Mark the target with a dragging state.
				if ( scope_Handles.length > 1 ) {
					addClass(scope_Target, options.cssClasses.drag);
				}
	
				var f = function(){
					return false;
				};
	
				document.body.noUiListener = f;
	
				// Prevent text selection when dragging the handles.
				document.body.addEventListener('selectstart', f, false);
			}
	
			data.handleNumbers.forEach(function(handleNumber){
				fireEvent('start', handleNumber);
			});
		}
	
		// Move closest handle to tapped location.
		function eventTap ( event ) {
	
			// The tap event shouldn't propagate up
			event.stopPropagation();
	
			var proposal = calcPointToPercentage(event.calcPoint);
			var handleNumber = getClosestHandle(proposal);
	
			// Tackle the case that all handles are 'disabled'.
			if ( handleNumber === false ) {
				return false;
			}
	
			// Flag the slider as it is now in a transitional state.
			// Transition takes a configurable amount of ms (default 300). Re-enable the slider after that.
			if ( !options.events.snap ) {
				addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration);
			}
	
			setHandle(handleNumber, proposal, true, true);
	
			setZindex();
	
			fireEvent('slide', handleNumber, true);
			fireEvent('set', handleNumber, true);
			fireEvent('change', handleNumber, true);
			fireEvent('update', handleNumber, true);
	
			if ( options.events.snap ) {
				eventStart(event, { handleNumbers: [handleNumber] });
			}
		}
	
		// Fires a 'hover' event for a hovered mouse/pen position.
		function eventHover ( event ) {
	
			var proposal = calcPointToPercentage(event.calcPoint);
	
			var to = scope_Spectrum.getStep(proposal);
			var value = scope_Spectrum.fromStepping(to);
	
			Object.keys(scope_Events).forEach(function( targetEvent ) {
				if ( 'hover' === targetEvent.split('.')[0] ) {
					scope_Events[targetEvent].forEach(function( callback ) {
						callback.call( scope_Self, value );
					});
				}
			});
		}
	
		// Attach events to several slider parts.
		function bindSliderEvents ( behaviour ) {
	
			// Attach the standard drag event to the handles.
			if ( !behaviour.fixed ) {
	
				scope_Handles.forEach(function( handle, index ){
	
					// These events are only bound to the visual handle
					// element, not the 'real' origin element.
					attachEvent ( actions.start, handle.children[0], eventStart, {
						handleNumbers: [index]
					});
				});
			}
	
			// Attach the tap event to the slider base.
			if ( behaviour.tap ) {
				attachEvent (actions.start, scope_Base, eventTap, {});
			}
	
			// Fire hover events
			if ( behaviour.hover ) {
				attachEvent (actions.move, scope_Base, eventHover, { hover: true });
			}
	
			// Make the range draggable.
			if ( behaviour.drag ){
	
				scope_Connects.forEach(function( connect, index ){
	
					if ( connect === false || index === 0 || index === scope_Connects.length - 1 ) {
						return;
					}
	
					var handleBefore = scope_Handles[index - 1];
					var handleAfter = scope_Handles[index];
					var eventHolders = [connect];
	
					addClass(connect, options.cssClasses.draggable);
	
					// When the range is fixed, the entire range can
					// be dragged by the handles. The handle in the first
					// origin will propagate the start event upward,
					// but it needs to be bound manually on the other.
					if ( behaviour.fixed ) {
						eventHolders.push(handleBefore.children[0]);
						eventHolders.push(handleAfter.children[0]);
					}
	
					eventHolders.forEach(function( eventHolder ) {
						attachEvent ( actions.start, eventHolder, eventStart, {
							handles: [handleBefore, handleAfter],
							handleNumbers: [index - 1, index]
						});
					});
				});
			}
		}
	
	
		// Split out the handle positioning logic so the Move event can use it, too
		function checkHandlePosition ( reference, handleNumber, to, lookBackward, lookForward ) {
	
			// For sliders with multiple handles, limit movement to the other handle.
			// Apply the margin option by adding it to the handle positions.
			if ( scope_Handles.length > 1 ) {
	
				if ( lookBackward && handleNumber > 0 ) {
					to = Math.max(to, reference[handleNumber - 1] + options.margin);
				}
	
				if ( lookForward && handleNumber < scope_Handles.length - 1 ) {
					to = Math.min(to, reference[handleNumber + 1] - options.margin);
				}
			}
	
			// The limit option has the opposite effect, limiting handles to a
			// maximum distance from another. Limit must be > 0, as otherwise
			// handles would be unmoveable.
			if ( scope_Handles.length > 1 && options.limit ) {
	
				if ( lookBackward && handleNumber > 0 ) {
					to = Math.min(to, reference[handleNumber - 1] + options.limit);
				}
	
				if ( lookForward && handleNumber < scope_Handles.length - 1 ) {
					to = Math.max(to, reference[handleNumber + 1] - options.limit);
				}
			}
	
			// The padding option keeps the handles a certain distance from the
			// edges of the slider. Padding must be > 0.
			if ( options.padding ) {
	
				if ( handleNumber === 0 ) {
					to = Math.max(to, options.padding);
				}
	
				if ( handleNumber === scope_Handles.length - 1 ) {
					to = Math.min(to, 100 - options.padding);
				}
			}
	
			to = scope_Spectrum.getStep(to);
	
			// Limit percentage to the 0 - 100 range
			to = limit(to);
	
			// Return false if handle can't move
			if ( to === reference[handleNumber] ) {
				return false;
			}
	
			return to;
		}
	
		function toPct ( pct ) {
			return pct + '%';
		}
	
		// Updates scope_Locations and scope_Values, updates visual state
		function updateHandlePosition ( handleNumber, to ) {
	
			// Update locations.
			scope_Locations[handleNumber] = to;
	
			// Convert the value to the slider stepping/range.
			scope_Values[handleNumber] = scope_Spectrum.fromStepping(to);
	
			// Called synchronously or on the next animationFrame
			var stateUpdate = function() {
				scope_Handles[handleNumber].style[options.style] = toPct(to);
				updateConnect(handleNumber);
				updateConnect(handleNumber + 1);
			};
	
			// Set the handle to the new position.
			// Use requestAnimationFrame for efficient painting.
			// No significant effect in Chrome, Edge sees dramatic performace improvements.
			// Option to disable is useful for unit tests, and single-step debugging.
			if ( window.requestAnimationFrame && options.useRequestAnimationFrame ) {
				window.requestAnimationFrame(stateUpdate);
			} else {
				stateUpdate();
			}
		}
	
		function setZindex ( ) {
	
			scope_HandleNumbers.forEach(function(handleNumber){
				// Handles before the slider middle are stacked later = higher,
				// Handles after the middle later is lower
				// [[7] [8] .......... | .......... [5] [4]
				var dir = (scope_Locations[handleNumber] > 50 ? -1 : 1);
				var zIndex = 3 + (scope_Handles.length + (dir * handleNumber));
				scope_Handles[handleNumber].childNodes[0].style.zIndex = zIndex;
			});
		}
	
		// Test suggested values and apply margin, step.
		function setHandle ( handleNumber, to, lookBackward, lookForward ) {
	
			to = checkHandlePosition(scope_Locations, handleNumber, to, lookBackward, lookForward);
	
			if ( to === false ) {
				return false;
			}
	
			updateHandlePosition(handleNumber, to);
	
			return true;
		}
	
		// Updates style attribute for connect nodes
		function updateConnect ( index ) {
	
			// Skip connects set to false
			if ( !scope_Connects[index] ) {
				return;
			}
	
			var l = 0;
			var h = 100;
	
			if ( index !== 0 ) {
				l = scope_Locations[index - 1];
			}
	
			if ( index !== scope_Connects.length - 1 ) {
				h = scope_Locations[index];
			}
	
			scope_Connects[index].style[options.style] = toPct(l);
			scope_Connects[index].style[options.styleOposite] = toPct(100 - h);
		}
	
		// ...
		function setValue ( to, handleNumber ) {
	
			// Setting with null indicates an 'ignore'.
			// Inputting 'false' is invalid.
			if ( to === null || to === false ) {
				return;
			}
	
			// If a formatted number was passed, attemt to decode it.
			if ( typeof to === 'number' ) {
				to = String(to);
			}
	
			to = options.format.from(to);
	
			// Request an update for all links if the value was invalid.
			// Do so too if setting the handle fails.
			if ( to !== false && !isNaN(to) ) {
				setHandle(handleNumber, scope_Spectrum.toStepping(to), false, false);
			}
		}
	
		// Set the slider value.
		function valueSet ( input, fireSetEvent ) {
	
			var values = asArray(input);
			var isInit = scope_Locations[0] === undefined;
	
			// Event fires by default
			fireSetEvent = (fireSetEvent === undefined ? true : !!fireSetEvent);
	
			values.forEach(setValue);
	
			// Animation is optional.
			// Make sure the initial values were set before using animated placement.
			if ( options.animate && !isInit ) {
				addClassFor(scope_Target, options.cssClasses.tap, options.animationDuration);
			}
	
			// Now that all base values are set, apply constraints
			scope_HandleNumbers.forEach(function(handleNumber){
				setHandle(handleNumber, scope_Locations[handleNumber], true, false);
			});
	
			setZindex();
	
			scope_HandleNumbers.forEach(function(handleNumber){
	
				fireEvent('update', handleNumber);
	
				// Fire the event only for handles that received a new value, as per #579
				if ( values[handleNumber] !== null && fireSetEvent ) {
					fireEvent('set', handleNumber);
				}
			});
		}
	
		// Reset slider to initial values
		function valueReset ( fireSetEvent ) {
			valueSet(options.start, fireSetEvent);
		}
	
		// Get the slider value.
		function valueGet ( ) {
	
			var values = scope_Values.map(options.format.to);
	
			// If only one handle is used, return a single value.
			if ( values.length === 1 ){
				return values[0];
			}
	
			return values;
		}
	
		// Removes classes from the root and empties it.
		function destroy ( ) {
	
			for ( var key in options.cssClasses ) {
				if ( !options.cssClasses.hasOwnProperty(key) ) { continue; }
				removeClass(scope_Target, options.cssClasses[key]);
			}
	
			while (scope_Target.firstChild) {
				scope_Target.removeChild(scope_Target.firstChild);
			}
	
			delete scope_Target.noUiSlider;
		}
	
		// Get the current step size for the slider.
		function getCurrentStep ( ) {
	
			// Check all locations, map them to their stepping point.
			// Get the step point, then find it in the input list.
			return scope_Locations.map(function( location, index ){
	
				var nearbySteps = scope_Spectrum.getNearbySteps( location );
				var value = scope_Values[index];
				var increment = nearbySteps.thisStep.step;
				var decrement = null;
	
				// If the next value in this step moves into the next step,
				// the increment is the start of the next step - the current value
				if ( increment !== false ) {
					if ( value + increment > nearbySteps.stepAfter.startValue ) {
						increment = nearbySteps.stepAfter.startValue - value;
					}
				}
	
	
				// If the value is beyond the starting point
				if ( value > nearbySteps.thisStep.startValue ) {
					decrement = nearbySteps.thisStep.step;
				}
	
				else if ( nearbySteps.stepBefore.step === false ) {
					decrement = false;
				}
	
				// If a handle is at the start of a step, it always steps back into the previous step first
				else {
					decrement = value - nearbySteps.stepBefore.highestStep;
				}
	
	
				// Now, if at the slider edges, there is not in/decrement
				if ( location === 100 ) {
					increment = null;
				}
	
				else if ( location === 0 ) {
					decrement = null;
				}
	
				// As per #391, the comparison for the decrement step can have some rounding issues.
				var stepDecimals = scope_Spectrum.countStepDecimals();
	
				// Round per #391
				if ( increment !== null && increment !== false ) {
					increment = Number(increment.toFixed(stepDecimals));
				}
	
				if ( decrement !== null && decrement !== false ) {
					decrement = Number(decrement.toFixed(stepDecimals));
				}
	
				return [decrement, increment];
			});
		}
	
		// Attach an event to this slider, possibly including a namespace
		function bindEvent ( namespacedEvent, callback ) {
			scope_Events[namespacedEvent] = scope_Events[namespacedEvent] || [];
			scope_Events[namespacedEvent].push(callback);
	
			// If the event bound is 'update,' fire it immediately for all handles.
			if ( namespacedEvent.split('.')[0] === 'update' ) {
				scope_Handles.forEach(function(a, index){
					fireEvent('update', index);
				});
			}
		}
	
		// Undo attachment of event
		function removeEvent ( namespacedEvent ) {
	
			var event = namespacedEvent && namespacedEvent.split('.')[0];
			var namespace = event && namespacedEvent.substring(event.length);
	
			Object.keys(scope_Events).forEach(function( bind ){
	
				var tEvent = bind.split('.')[0],
					tNamespace = bind.substring(tEvent.length);
	
				if ( (!event || event === tEvent) && (!namespace || namespace === tNamespace) ) {
					delete scope_Events[bind];
				}
			});
		}
	
		// Updateable: margin, limit, padding, step, range, animate, snap
		function updateOptions ( optionsToUpdate, fireSetEvent ) {
	
			// Spectrum is created using the range, snap, direction and step options.
			// 'snap' and 'step' can be updated, 'direction' cannot, due to event binding.
			// If 'snap' and 'step' are not passed, they should remain unchanged.
			var v = valueGet();
	
			var updateAble = ['margin', 'limit', 'padding', 'range', 'animate', 'snap', 'step', 'format'];
	
			// Only change options that we're actually passed to update.
			updateAble.forEach(function(name){
				if ( optionsToUpdate[name] !== undefined ) {
					originalOptions[name] = optionsToUpdate[name];
				}
			});
	
			var newOptions = testOptions(originalOptions);
	
			// Load new options into the slider state
			updateAble.forEach(function(name){
				if ( optionsToUpdate[name] !== undefined ) {
					options[name] = newOptions[name];
				}
			});
	
			// Save current spectrum direction as testOptions in testRange call
			// doesn't rely on current direction
			newOptions.spectrum.direction = scope_Spectrum.direction;
			scope_Spectrum = newOptions.spectrum;
	
			// Limit, margin and padding depend on the spectrum but are stored outside of it. (#677)
			options.margin = newOptions.margin;
			options.limit = newOptions.limit;
			options.padding = newOptions.padding;
	
			// Invalidate the current positioning so valueSet forces an update.
			scope_Locations = [];
			valueSet(optionsToUpdate.start || v, fireSetEvent);
		}
	
		// Throw an error if the slider was already initialized.
		if ( scope_Target.noUiSlider ) {
			throw new Error("noUiSlider (" + VERSION + "): Slider was already initialized.");
		}
	
		// Create the base element, initialise HTML and set classes.
		// Add handles and connect elements.
		addSlider(scope_Target);
		addElements(options.connect, scope_Base);
	
		scope_Self = {
			destroy: destroy,
			steps: getCurrentStep,
			on: bindEvent,
			off: removeEvent,
			get: valueGet,
			set: valueSet,
			reset: valueReset,
			// Exposed for unit testing, don't use this in your application.
			__moveHandles: function(a, b, c) { moveHandles(a, b, scope_Locations, c); },
			options: originalOptions, // Issue #600, #678
			updateOptions: updateOptions,
			target: scope_Target, // Issue #597
			pips: pips // Issue #594
		};
	
		// Attach user events.
		bindSliderEvents(options.events);
	
		// Use the public value method to set the start values.
		valueSet(options.start);
	
		if ( options.pips ) {
			pips(options.pips);
		}
	
		if ( options.tooltips ) {
			tooltips();
		}
	
		return scope_Self;
	
	}
	
	
		// Run the standard initializer
		function initialize ( target, originalOptions ) {
	
			if ( !target.nodeName ) {
				throw new Error("noUiSlider (" + VERSION + "): create requires a single element.");
			}
	
			// Test the options and create the slider environment;
			var options = testOptions( originalOptions, target );
			var api = closure( target, options, originalOptions );
	
			target.noUiSlider = api;
	
			return api;
		}
	
		// Use an object instead of a function for future expansibility;
		return {
			version: VERSION,
			create: initialize
		};
	
	}));

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _component = __webpack_require__(2);
	
	var _component2 = _interopRequireDefault(_component);
	
	var _clamp = __webpack_require__(41);
	
	var _clamp2 = _interopRequireDefault(_clamp);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var SELECTOR_COMPONENT = '.aui-js-indicator';
	var CLASS_ITEM = 'aui-indicator__item';
	var CLASS_ACTION = 'aui-indicator__action';
	var CLASS_INDICATOR = 'aui-indicator__indicator';
	var CLASS_IS_ACTIVE = 'is-active';
	
	/**
	 * Class constructor for Indicator AUI component.
	 * Implements AUI component design pattern defined at:
	 * https://github.com/...
	 *
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	
	var Indicator = function (_Component) {
	  _inherits(Indicator, _Component);
	
	  /**
	   * Upgrades all Indicator AUI components.
	   * @returns {Array} Returns an array of all newly upgraded components.
	   */
	  Indicator.upgradeElements = function upgradeElements() {
	    var components = [];
	    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(function (element) {
	      if (!_component2.default.isElementUpgraded(element)) {
	        components.push(new Indicator(element));
	      }
	    });
	    return components;
	  };
	
	  function Indicator(element) {
	    _classCallCheck(this, Indicator);
	
	    return _possibleConstructorReturn(this, _Component.call(this, element));
	  }
	
	  Indicator.prototype.init = function init() {
	    var _this2 = this;
	
	    _Component.prototype.init.call(this);
	
	    this._actions = Array.from(this._element.querySelectorAll('.' + CLASS_ACTION));
	    this._listItems = Array.from(this._element.querySelectorAll('.' + CLASS_ITEM));
	
	    this._indicator = document.createElement('span');
	    this._indicator.classList.add(CLASS_INDICATOR);
	    this._element.appendChild(this._indicator);
	
	    this._element.addEventListener('click', this.clickHandler = function (event) {
	      return _this2._onClick(event);
	    });
	  };
	
	  /**
	   * Handle click.
	   * @param {Event} event The event that fired.
	   * @private
	   */
	
	
	  Indicator.prototype._onClick = function _onClick(event) {
	    if (!event.target.classList.contains(CLASS_ACTION)) {
	      return;
	    }
	    event.preventDefault();
	
	    this.selectAction(event.target);
	  };
	
	  /**
	   * Select item with given action element.
	   * @param {HTMLElement} actionElement Action child element of the list item to select.
	   * @private
	   */
	
	
	  Indicator.prototype.selectAction = function selectAction(actionElement) {
	    if (actionElement) {
	      // Find index
	      var listItem = actionElement.parentNode;
	      var index = this._listItems.indexOf(listItem);
	      this.select(index);
	    }
	  };
	
	  /**
	   * Select item.
	   * @param {Integer} index Zero-based index of the list item to select.
	   * @private
	   */
	
	
	  Indicator.prototype.select = function select() {
	    var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
	
	    index = (0, _clamp2.default)(index, 0, this._actions.length - 1);
	    var activeItem = this._actions[index];
	
	    // Update actions
	    this._actions.forEach(function (item) {
	      item.classList.remove(CLASS_IS_ACTIVE);
	    });
	    activeItem.classList.add(CLASS_IS_ACTIVE);
	
	    // Update indicator position
	    var rectContainer = this._element.getBoundingClientRect();
	    var rectTarget = activeItem.getBoundingClientRect();
	    var indicatorLeft = rectTarget.left - rectContainer.left;
	    this._indicator.style.left = indicatorLeft + 'px';
	  };
	
	  return Indicator;
	}(_component2.default);
	
	exports.default = Indicator;
	module.exports = exports['default'];

/***/ },
/* 41 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = clamp;
	/**
	 * Clamps `number` within the inclusive `lower` and `upper` bounds.
	 *
	 * @since 4.0.0
	 * @category Number
	 * @param {number} number The number to clamp.
	 * @param {number} lower The lower bound.
	 * @param {number} upper The upper bound.
	 * @returns {number} Returns the clamped number.
	 * @example
	 *
	 * clamp(-10, -5, 5)
	 * // => -5
	 *
	 * clamp(10, -5, 5)
	 * // => 5
	 */
	function clamp(number, lower, upper) {
	  number = +number;
	  lower = +lower;
	  upper = +upper;
	  lower = lower === lower ? lower : 0;
	  upper = upper === upper ? upper : 0;
	  if (number === number) {
	    number = number <= upper ? number : upper;
	    number = number >= lower ? number : lower;
	  }
	  return number;
	}
	module.exports = exports['default'];

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _component = __webpack_require__(2);
	
	var _component2 = _interopRequireDefault(_component);
	
	var _objectResize = __webpack_require__(43);
	
	var _objectResize2 = _interopRequireDefault(_objectResize);
	
	var _limit = __webpack_require__(24);
	
	var _limit2 = _interopRequireDefault(_limit);
	
	var _bezierEasing = __webpack_require__(44);
	
	var _bezierEasing2 = _interopRequireDefault(_bezierEasing);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var SELECTOR_COMPONENT = '.aui-js-spinner';
	var CLASS_CONTINUOUS = 'aui-spinner--continuous';
	var CLASS_SHAPE = 'aui-spinner__svg';
	var CLASS_PATH = 'aui-spinner__path';
	var CLASS_PATH_PROGRESS = 'aui-spinner__path--progress';
	var CLASS_GROUP = 'aui-spinner__group';
	var CLASS_GROUP_BASE_PATH = 'aui-spinner__group-base';
	var CLASS_GROUP_PROGRESS_PATH = 'aui-spinner__group-progress';
	var CLASS_VALUE = 'aui-spinner__value';
	var CLASS_IS_PENDING = 'is-pending';
	var CLASS_IS_LOADING = 'is-loading';
	var CLASS_IS_COMPLETE = 'is-complete';
	var SIZE = 48;
	var RADIUS = 22;
	var STROKE_WIDTH = 3;
	var LOOP_ANIMATION_DURATION = 1.5;
	var LOOP_ANIMATION = [{
	  dashLength: 0,
	  dashOffset: 0,
	  rotate: 0
	}, {
	  dashLength: 0.65,
	  dashOffset: -1,
	  rotate: 360
	}];
	
	/**
	 * Class constructor for Spinner AUI component.
	 * Implements AUI component design pattern defined at:
	 * https://github.com/...
	 *
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	
	var Spinner = function (_Component) {
	  _inherits(Spinner, _Component);
	
	  /**
	   * Upgrades all Spinner AUI components.
	   * @returns {Array} Returns an array of all newly upgraded components.
	   */
	  Spinner.upgradeElements = function upgradeElements() {
	    var components = [];
	    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(function (element) {
	      if (!_component2.default.isElementUpgraded(element)) {
	        components.push(new Spinner(element));
	      }
	    });
	    return components;
	  };
	
	  function Spinner(element) {
	    _classCallCheck(this, Spinner);
	
	    return _possibleConstructorReturn(this, _Component.call(this, element));
	  }
	
	  Spinner.prototype.init = function init() {
	    _Component.prototype.init.call(this);
	
	    this._objectResize = new _objectResize2.default(this._element, this.resize, this);
	
	    this._continuous = this._element.classList.contains(CLASS_CONTINUOUS);
	
	    // Add value element, if required:
	    if (!this._continuous) {
	      this._value = document.createElement('span');
	      this._value.classList.add(CLASS_VALUE);
	      this._element.appendChild(this._value);
	    }
	
	    // Add SVG graphic:
	    // <svg class="aui-spinner__shape" viewBox="0 0 200 200">
	    //   <g class="aui-spinner__group">
	    //     <circle class="aui-spinner__path" cx="0" cy="0" r="100" />
	    //     <circle class="aui-spinner__path aui-spinner__path--progress" cx="0" cy="0" r="100" />
	    //   </g>
	    // </svg>
	    var shape = this.createSvgNode('svg', {
	      class: CLASS_SHAPE,
	      viewBox: '0 0 ' + SIZE + ' ' + SIZE
	    });
	    var group = this.createSvgNode('g', { class: CLASS_GROUP });
	    var groupCircle1 = this.createSvgNode('g', { class: CLASS_GROUP_BASE_PATH });
	    var groupCircle2 = this.createSvgNode('g', { class: CLASS_GROUP_PROGRESS_PATH });
	    var circle1 = this.createSvgNode('circle', {
	      class: CLASS_PATH,
	      cx: 0,
	      cy: 0,
	      r: RADIUS
	    });
	    var circle2 = this.createSvgNode('circle', {
	      class: CLASS_PATH + ' ' + CLASS_PATH_PROGRESS,
	      cx: 0,
	      cy: 0,
	      r: RADIUS,
	      transform: 'rotate(-90)'
	    });
	    groupCircle1.appendChild(circle1);
	    groupCircle2.appendChild(circle2);
	    group.appendChild(groupCircle1);
	    group.appendChild(groupCircle2);
	    shape.appendChild(group);
	    this._element.appendChild(shape);
	    this._shape = shape;
	    this._group = group;
	    this._progressPath = circle2;
	    this._basePath = circle1;
	    this._groupProgress = groupCircle2;
	
	    this._easing = (0, _bezierEasing2.default)(0.75, 0.02, 0.5, 1);
	    this._easingDasharray = (0, _bezierEasing2.default)(0.4, 0, 0, 1);
	    this._progressPath.style.strokeOpacity = 0;
	
	    this.resize();
	    this.progress(0);
	  };
	
	  Spinner.prototype.progress = function progress(ratio) {
	    ratio = (0, _limit2.default)(ratio, 0, 1);
	    this._progress = ratio;
	    var pathLength = this._getCircleLength(this._progressPath);
	
	    if (!this._continuous) {
	      this._progressPath.style.strokeDasharray = this._progress === 1 ? 'none' : this._progress * pathLength + ', ' + pathLength;
	      this._progressPath.style.strokeOpacity = this._progress === 0 ? 0 : 1;
	    }
	
	    if (this._value) {
	      this._value.innerHTML = '' + Math.round(this._progress * 100);
	    }
	
	    this._updateClasses();
	  };
	
	  Spinner.prototype.loop = function loop() {
	    var _this2 = this;
	
	    if (this._continuous) {
	      this._progressPath.style.strokeOpacity = 1;
	      window.requestAnimationFrame(function (timestamp) {
	        return _this2._animateLoop(timestamp);
	      });
	    }
	  };
	
	  Spinner.prototype.stop = function stop() {};
	
	  Spinner.prototype.resize = function resize() {
	    var size = this._element.offsetWidth;
	    var radius = (size - STROKE_WIDTH) / 2;
	    this._shape.setAttributeNS(null, 'viewBox', size / -2 + ' ' + size / -2 + ' ' + size + ' ' + size);
	    this._basePath.setAttributeNS(null, 'r', '' + radius);
	    this._progressPath.setAttributeNS(null, 'r', '' + radius);
	  };
	
	  // TODO Optimize calculations; wording.
	
	
	  Spinner.prototype._animateLoop = function _animateLoop(timestamp) {
	    var _this3 = this;
	
	    if (!this._loopStart) {
	      this._loopStart = timestamp;
	    }
	
	    // The progress in seconds 0 <= progress <= LOOP_ANIMATION_DURATION
	    var progress = (timestamp - this._loopStart) / 1000;
	    // The progress ratio between 0 <= progressRatio <= 1
	    var progressRatio = progress / LOOP_ANIMATION_DURATION;
	    if (progressRatio > 1 || progressRatio === 0) {
	      this._animationEndSet = false;
	      progress = 0;
	      progressRatio = 0;
	      this._loopStart = timestamp;
	      this._dashLengthStart = LOOP_ANIMATION[0].dashLength;
	      this._dashOffsetStart = LOOP_ANIMATION[0].dashOffset;
	      this._dashLengthEnd = LOOP_ANIMATION[1].dashLength;
	      this._dashOffsetEnd = LOOP_ANIMATION[1].dashOffset;
	    }
	    var ease = this._easing(progressRatio);
	    var pathLength = this._getCircleLength(this._progressPath);
	    this._dashLengthRatio = this._dashLengthStart + (this._dashLengthEnd - this._dashLengthStart) * this._easingDasharray(progressRatio);
	    this._dashOffsetRatio = this._dashOffsetStart + (this._dashOffsetEnd - this._dashOffsetStart) * ease;
	    this._rotate = LOOP_ANIMATION[1].rotate * ease;
	
	    var dashLength = pathLength * this._dashLengthRatio;
	    var dashOffset = pathLength * this._dashOffsetRatio;
	
	    this._progressPath.style.strokeDasharray = dashLength + ', ' + pathLength;
	    this._progressPath.style.strokeDashoffset = '' + dashOffset;
	    // this._group.setAttributeNS(null, 'transform', `rotate(${this._rotate})`);
	    this._groupProgress.setAttributeNS(null, 'transform', 'rotate(' + this._rotate + ')');
	
	    window.requestAnimationFrame(function (timestamp) {
	      return _this3._animateLoop(timestamp);
	    });
	  };
	
	  Spinner.prototype._updateClasses = function _updateClasses() {
	    if (this._progress === 0) {
	      this._element.classList.add(CLASS_IS_PENDING);
	    } else {
	      this._element.classList.remove(CLASS_IS_PENDING);
	    }
	
	    if (this._progress > 0 && this._progress < 1) {
	      this._element.classList.add(CLASS_IS_LOADING);
	    } else {
	      this._element.classList.remove(CLASS_IS_LOADING);
	    }
	
	    if (this._progress === 1) {
	      this._element.classList.add(CLASS_IS_COMPLETE);
	    } else {
	      this._element.classList.remove(CLASS_IS_COMPLETE);
	    }
	  };
	
	  Spinner.prototype._getCircleLength = function _getCircleLength(circle) {
	    var r = circle.getAttribute('r');
	    return 2 * Math.PI * r;
	  };
	
	  return Spinner;
	}(_component2.default);
	
	exports.default = Spinner;
	module.exports = exports['default'];

/***/ },
/* 43 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ObjectResize = function () {
	  function ObjectResize(parent, callback, callbackScope) {
	    var _this = this;
	
	    _classCallCheck(this, ObjectResize);
	
	    var isIE = navigator.userAgent.match(/Trident/);
	
	    // NOTE
	    // this._parent.style.position != 'static'
	    // this._parent.style.display = 'block'
	
	    this._parent = parent;
	    this._helperElement = document.createElement('object');
	    this._helperElement.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1; border: 0px; opacity: 0;');
	    this._helperElement.setAttribute('border', '0');
	    this._helperElement.onload = function () {
	      return _this._onLoad();
	    };
	    this._helperElement.type = 'text/html';
	    if (isIE) {
	      this._parent.appendChild(this._helperElement);
	    }
	    this._helperElement.data = 'about:blank';
	    if (!isIE) {
	      this._parent.appendChild(this._helperElement);
	    }
	
	    this._callback = callback;
	    this._callbackScope = callbackScope;
	
	    this._ticking = false;
	  }
	
	  ObjectResize.prototype._onLoad = function _onLoad(event) {
	    var _this2 = this;
	
	    this._helperElement.contentDocument.defaultView.addEventListener('resize', this._resizeHandler = function (event) {
	      return _this2._onResize(event);
	    });
	  };
	
	  ObjectResize.prototype._onResize = function _onResize(event) {
	    var _this3 = this;
	
	    if (!this._ticking) {
	      window.requestAnimationFrame(function () {
	        _this3._ticking = false;
	        _this3._callback.call(_this3._callbackScope);
	      });
	    }
	    this._ticking = true;
	  };
	
	  ObjectResize.prototype.dispose = function dispose() {
	    this._helperElement.contentDocument.defaultView.removeEventListener('resize', this._resizeHandler);
	    this._parent.removeChild(this._helperElement);
	  };
	
	  return ObjectResize;
	}();
	
	// (function() {
	//   var attachEvent = document.attachEvent;
	//   var isIE = navigator.userAgent.match(/Trident/);
	//   var requestFrame = (function() {
	//     var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
	//       function(fn) {
	//         return window.setTimeout(fn, 20);
	//       };
	//     return function(fn) {
	//       return raf(fn);
	//     };
	//   })();
	//
	//   var cancelFrame = (function() {
	//     var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame ||
	//       window.clearTimeout;
	//     return function(id) {
	//       return cancel(id);
	//     };
	//   })();
	//
	//   function resizeListener(e) {
	//     var win = e.target || e.srcElement;
	//     if (win.__resizeRAF__) cancelFrame(win.__resizeRAF__);
	//     win.__resizeRAF__ = requestFrame(function() {
	//       var trigger = win.__resizeTrigger__;
	//       trigger.__resizeListeners__.forEach(function(fn) {
	//         fn.call(trigger, e);
	//       });
	//     });
	//   }
	//
	//   function objectLoad(e) {
	//     this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__;
	//     this.contentDocument.defaultView.addEventListener('resize', resizeListener);
	//   }
	//
	//   window.addResizeListener = function(element, fn) {
	//     if (!element.__resizeListeners__) {
	//       element.__resizeListeners__ = [];
	//       if (attachEvent) {
	//         element.__resizeTrigger__ = element;
	//         element.attachEvent('onresize', resizeListener);
	//       } else {
	//         if (getComputedStyle(element).position === 'static') element.style.position = 'relative';
	//         var obj = element.__resizeTrigger__ = document.createElement('object');
	//         obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
	//         obj.__resizeElement__ = element;
	//         obj.onload = objectLoad;
	//         obj.type = 'text/html';
	//         if (isIE) element.appendChild(obj);
	//         obj.data = 'about:blank';
	//         if (!isIE) element.appendChild(obj);
	//       }
	//     }
	//     element.__resizeListeners__.push(fn);
	//   };
	//
	//   window.removeResizeListener = function(element, fn) {
	//     element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
	//     if (!element.__resizeListeners__.length) {
	//       if (attachEvent) element.detachEvent('onresize', resizeListener);
	//       else {
	//         element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', resizeListener);
	//         element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__);
	//       }
	//     }
	//   }
	// })();
	
	
	exports.default = ObjectResize;
	module.exports = exports['default'];

/***/ },
/* 44 */
/***/ function(module, exports) {

	/**
	 * https://github.com/gre/bezier-easing
	 * BezierEasing - use bezier curve for transition easing function
	 * by Gaëtan Renaudeau 2014 - 2015 – MIT License
	 */
	
	// These values are established by empiricism with tests (tradeoff: performance VS precision)
	var NEWTON_ITERATIONS = 4;
	var NEWTON_MIN_SLOPE = 0.001;
	var SUBDIVISION_PRECISION = 0.0000001;
	var SUBDIVISION_MAX_ITERATIONS = 10;
	
	var kSplineTableSize = 11;
	var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);
	
	var float32ArraySupported = typeof Float32Array === 'function';
	
	function A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
	function B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
	function C (aA1)      { return 3.0 * aA1; }
	
	// Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
	function calcBezier (aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }
	
	// Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
	function getSlope (aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }
	
	function binarySubdivide (aX, aA, aB, mX1, mX2) {
	  var currentX, currentT, i = 0;
	  do {
	    currentT = aA + (aB - aA) / 2.0;
	    currentX = calcBezier(currentT, mX1, mX2) - aX;
	    if (currentX > 0.0) {
	      aB = currentT;
	    } else {
	      aA = currentT;
	    }
	  } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
	  return currentT;
	}
	
	function newtonRaphsonIterate (aX, aGuessT, mX1, mX2) {
	 for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
	   var currentSlope = getSlope(aGuessT, mX1, mX2);
	   if (currentSlope === 0.0) {
	     return aGuessT;
	   }
	   var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
	   aGuessT -= currentX / currentSlope;
	 }
	 return aGuessT;
	}
	
	function LinearEasing (x) {
	  return x;
	}
	
	module.exports = function bezier (mX1, mY1, mX2, mY2) {
	  if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
	    throw new Error('bezier x values must be in [0, 1] range');
	  }
	
	  if (mX1 === mY1 && mX2 === mY2) {
	    return LinearEasing;
	  }
	
	  // Precompute samples table
	  var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
	  for (var i = 0; i < kSplineTableSize; ++i) {
	    sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
	  }
	
	  function getTForX (aX) {
	    var intervalStart = 0.0;
	    var currentSample = 1;
	    var lastSample = kSplineTableSize - 1;
	
	    for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
	      intervalStart += kSampleStepSize;
	    }
	    --currentSample;
	
	    // Interpolate to provide an initial guess for t
	    var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
	    var guessForT = intervalStart + dist * kSampleStepSize;
	
	    var initialSlope = getSlope(guessForT, mX1, mX2);
	    if (initialSlope >= NEWTON_MIN_SLOPE) {
	      return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
	    } else if (initialSlope === 0.0) {
	      return guessForT;
	    } else {
	      return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
	    }
	  }
	
	  return function BezierEasing (x) {
	    // Because JavaScript number are imprecise, we should guarantee the extremes are right.
	    if (x === 0) {
	      return 0;
	    }
	    if (x === 1) {
	      return 1;
	    }
	    return calcBezier(getTForX(x), mY1, mY2);
	  };
	};


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _component = __webpack_require__(2);
	
	var _component2 = _interopRequireDefault(_component);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var SELECTOR_COMPONENT = '.aui-js-textfield';
	var CLASS_FIELD = 'aui-textfield__field';
	var CLASS_INPUT = 'aui-textfield__input';
	var CLASS_LABEL = 'aui-textfield__label';
	var CLASS_FOCUS_LINE = 'aui-textfield__focus-line';
	var CLASS_COUNTER = 'aui-textfield__counter';
	var CLASS_COUNTER_VALUE = 'aui-textfield__counter-value';
	var CLASS_IS_FOCUS = 'is-focused';
	var CLASS_IS_DIRTY = 'is-dirty';
	var CLASS_IS_INVALID = 'is-invalid';
	var CLASS_IS_DISABLED = 'is-disabled';
	var CLASS_IS_EQUAL_MAX_CHARS = 'is-equal-max-length';
	var CLASS_IS_GREATER_MAX_CHARS = 'is-greater-max-length';
	var ATTR_AUTOSIZE = 'data-autosize';
	
	/**
	 * Class constructor for Textfield AUI component.
	 * Implements AUI component design pattern defined at:
	 * https://github.com/...
	 *
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	
	var Textfield = function (_Component) {
	  _inherits(Textfield, _Component);
	
	  /**
	   * Upgrades all Textfield AUI components.
	   * @returns {Array} Returns an array of all newly upgraded components.
	   */
	  Textfield.upgradeElements = function upgradeElements() {
	    var components = [];
	    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(function (element) {
	      if (!_component2.default.isElementUpgraded(element)) {
	        components.push(new Textfield(element));
	      }
	    });
	    return components;
	  };
	
	  function Textfield(element) {
	    _classCallCheck(this, Textfield);
	
	    return _possibleConstructorReturn(this, _Component.call(this, element));
	  }
	
	  Textfield.prototype.init = function init() {
	    var _this2 = this;
	
	    _Component.prototype.init.call(this);
	
	    this._input = this._element.querySelector('.' + CLASS_INPUT);
	    this._input.addEventListener('input', this._inputHandler = function (event) {
	      return _this2._onInput(event);
	    });
	    this._input.addEventListener('focus', this._focusHandler = function (event) {
	      return _this2._onFocus(event);
	    });
	    this._input.addEventListener('blur', this._blurHandler = function (event) {
	      return _this2._onBlur(event);
	    });
	    this._input.addEventListener('change', this._changeHandler = function (event) {
	      return _this2._onChange(event);
	    });
	    this._input.addEventListener('reset', this._resetHandler = function (event) {
	      return _this2._onReset(event);
	    });
	
	    // Insert counter if data attribute 'count' is present:
	    if (this._element.getAttribute('data-count')) {
	      this._maxChars = parseInt(this._element.getAttribute('data-count')) || 0;
	      this._label = this._element.querySelector('.' + CLASS_FIELD);
	      this._counter = document.createElement('span');
	      this._counter.classList.add(CLASS_COUNTER);
	      this._label.parentNode.insertBefore(this._counter, this._label.nextSibling);
	      this._counterValue = document.createElement('span');
	      this._counterValue.classList.add(CLASS_COUNTER_VALUE);
	      this._counterValue.innerHTML = this._maxChars;
	      this._counter.appendChild(this._counterValue);
	      this._hasCounter = true;
	    }
	
	    // Insert thick focus line after label element:
	    this._label = this._element.querySelector('.' + CLASS_LABEL);
	    var focusLine = document.createElement('span');
	    focusLine.classList.add(CLASS_FOCUS_LINE);
	    this._label.parentNode.insertBefore(focusLine, this._label.nextSibling);
	
	    // If textarea should adjust height to content
	    if (this._element.hasAttribute(ATTR_AUTOSIZE) && this._element.getAttribute(ATTR_AUTOSIZE) !== 'false') {
	      var style = window.getComputedStyle(this._input);
	      this._inputPadding = parseInt(style.paddingTop) + parseInt(style.paddingBottom) || 0;
	      this._inputBorder = parseInt(style.borderTop) + parseInt(style.borderBottom) || 0;
	      this._input.addEventListener('keyup', this._keyupHandler = function (event) {
	        return _this2._onKeyup(event);
	      });
	      this._autosize = true;
	    }
	
	    this.updateClasses();
	  };
	
	  Textfield.prototype.update = function update() {
	    this.updateClasses();
	    this.updateCounter();
	    if (this._autosize) {
	      this.adjustHeightToContent();
	    }
	  };
	
	  Textfield.prototype.updateClasses = function updateClasses() {
	    this.checkDisabled();
	    this.checkDirty();
	    this.checkFocus();
	  };
	
	  Textfield.prototype.updateCounter = function updateCounter() {
	    if (this._counterValue) {
	      var numChars = this._input.value.length;
	      var remainingChars = this._maxChars - numChars;
	      this._counterValue.innerHTML = remainingChars;
	
	      if (remainingChars === 0) {
	        this._element.classList.add(CLASS_IS_EQUAL_MAX_CHARS);
	      } else {
	        this._element.classList.remove(CLASS_IS_EQUAL_MAX_CHARS);
	      }
	
	      if (remainingChars < 0) {
	        this._element.classList.add(CLASS_IS_GREATER_MAX_CHARS);
	        this._element.classList.add(CLASS_IS_INVALID);
	      } else {
	        this._element.classList.remove(CLASS_IS_GREATER_MAX_CHARS);
	        this._element.classList.remove(CLASS_IS_INVALID);
	      }
	    }
	  };
	
	  /**
	   * Check the disabled state and update field accordingly.
	   */
	
	
	  Textfield.prototype.checkDisabled = function checkDisabled() {
	    if (this._input.disabled) {
	      this._element.classList.add(CLASS_IS_DISABLED);
	    } else {
	      this._element.classList.remove(CLASS_IS_DISABLED);
	    }
	  };
	
	  /**
	   * Check the dirty state and update field accordingly.
	   */
	
	
	  Textfield.prototype.checkDirty = function checkDirty() {
	    if (this._input.value && this._input.value.length > 0) {
	      this._element.classList.add(CLASS_IS_DIRTY);
	    } else {
	      this._element.classList.remove(CLASS_IS_DIRTY);
	    }
	  };
	
	  /**
	   * Check the focus state and update field accordingly.
	   */
	
	
	  Textfield.prototype.checkFocus = function checkFocus() {
	    if (Boolean(this._element.querySelector(':focus'))) {
	      this._element.classList.add(CLASS_IS_FOCUS);
	    } else {
	      this._element.classList.remove(CLASS_IS_FOCUS);
	    }
	  };
	
	  /**
	   * Resize textarea
	   */
	
	
	  Textfield.prototype.adjustHeightToContent = function adjustHeightToContent() {
	    var htmlTop = window.pageYOffset;
	    var bodyTop = document.body.scrollTop;
	    var originalHeight = this._input.style.height;
	
	    this._input.style.height = 'auto';
	    if (this._input.scrollHeight === 0) {
	      // If the scrollHeight is 0, then the element probably has display:none or is detached from the DOM.
	      this._input.style.height = originalHeight;
	      return;
	    }
	    this._input.style.height = this._input.scrollHeight + this._inputBorder + 'px';
	
	    // prevents scroll position jump
	    document.documentElement.scrollTop = htmlTop;
	    document.body.scrollTop = bodyTop;
	  };
	
	  /**
	   * Disable text field.
	   */
	
	
	  Textfield.prototype.disable = function disable() {
	    this._input.disabled = true;
	    this.updateClasses();
	  };
	
	  /**
	   * Dispose component
	   */
	
	
	  Textfield.prototype.dispose = function dispose() {
	    _Component.prototype.dispose.call(this);
	
	    this._input.removeEventListener('input', this._inputHandler);
	    this._input.removeEventListener('focus', this._focusHandler);
	    this._input.removeEventListener('blur', this._blurHandler);
	    this._input.removeEventListener('change', this._changeHandler);
	    this._input.removeEventListener('reset', this._resetHandler);
	
	    _Component.prototype.removeChild.call(this, this._element.querySelector('.' + CLASS_FOCUS_LINE));
	    _Component.prototype.removeChild.call(this, this._element.querySelector('.' + CLASS_COUNTER));
	  };
	
	  /**
	   * Event Handler
	   */
	
	  Textfield.prototype._onInput = function _onInput(event) {
	    this.update();
	  };
	
	  Textfield.prototype._onFocus = function _onFocus(event) {
	    this.update();
	  };
	
	  Textfield.prototype._onBlur = function _onBlur(event) {
	    this.update();
	  };
	
	  Textfield.prototype._onChange = function _onChange(event) {
	    this.update();
	  };
	
	  Textfield.prototype._onReset = function _onReset(event) {
	    this.update();
	  };
	
	  Textfield.prototype._onKeyup = function _onKeyup(event) {
	    this.updateCounter();
	    if (this._autosize) {
	      this.adjustHeightToContent();
	    }
	  };
	
	  /**
	   * Getter and Setter
	   */
	
	  _createClass(Textfield, [{
	    key: 'input',
	    get: function get() {
	      return this._input;
	    }
	  }, {
	    key: 'autoSize',
	    get: function get() {
	      return this._autosize;
	    },
	    set: function set(value) {
	      return this._autosize = Boolean(value);
	    }
	  }]);
	
	  return Textfield;
	}(_component2.default);
	
	exports.default = Textfield;
	module.exports = exports['default'];

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _component = __webpack_require__(2);
	
	var _component2 = _interopRequireDefault(_component);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var SELECTOR_COMPONENT = '.aui-js-tooltip';
	var CLASS_TRIANGLE = 'aui-tooltip__triangle';
	var CLASS_IS_UPGRADED = 'is-upgraded';
	var CLASS_IS_ACTIVE = 'is-active';
	var CLASS_IS_TOP = 'is-top';
	var OFFSET_VIEWPORT_X = 10;
	var OFFSET_TARGET_TOP = 12;
	var OFFSET_TARGET_BOTTOM = 12;
	var OPEN_DELAY = 400;
	
	/**
	 * Class constructor for Tooltip AUI component.
	 * Implements AUI component design pattern defined at:
	 * https://github.com/...
	 *
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	
	var Tooltip = function (_Component) {
	  _inherits(Tooltip, _Component);
	
	  function Tooltip() {
	    _classCallCheck(this, Tooltip);
	
	    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
	  }
	
	  /**
	   * Upgrades all Tooltip AUI components.
	   * @returns {Array} Returns an array of all newly upgraded components.
	   */
	  Tooltip.upgradeElements = function upgradeElements() {
	    var components = [];
	    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(function (element) {
	      if (!_component2.default.isElementUpgraded(element)) {
	        components.push(new Tooltip(element));
	      }
	    });
	    return components;
	  };
	
	  /**
	   * Initialize component
	   */
	  Tooltip.prototype.init = function init() {
	    var _this2 = this;
	
	    _Component.prototype.init.call(this);
	
	    var forId = this._element.getAttribute('for');
	
	    if (forId) {
	      this._trigger = document.getElementById(forId);
	    }
	
	    if (this._trigger) {
	      // Add triangle shape
	      this._triangle = document.createElement('span');
	      this._triangle.classList.add(CLASS_TRIANGLE);
	      this._element.appendChild(this._triangle);
	
	      // Prevent accidental text selection on Android
	      if (!this._trigger.hasAttribute('tabindex')) {
	        this._trigger.setAttribute('tabindex', '0');
	      }
	
	      this._trigger.addEventListener('mouseenter', this._boundMouseenter = function (event) {
	        return _this2._onTriggerEnter(event);
	      });
	      this._trigger.addEventListener('mouseleave', this._boundMouseleave = function (event) {
	        return _this2._onTriggerLeave(event);
	      });
	      this._trigger.addEventListener('focusin', this._boundfocusin = function (event) {
	        return _this2._onTriggerEnter(event);
	      });
	      this._trigger.addEventListener('focusout', this._boundfocusout = function (event) {
	        return _this2._onTriggerLeave(event);
	      });
	      this._trigger.addEventListener('touchstart', this._boundTouchstart = function (event) {
	        return _this2._onTriggerEnter(event);
	      });
	      window.addEventListener('touchend', this._boundTouchendWindow = function (event) {
	        return _this2._onTriggerLeaveOutside(event);
	      });
	    }
	  };
	
	  /**
	   * Dispose component
	   */
	
	
	  Tooltip.prototype.dispose = function dispose() {
	    this._trigger.removeEventListener('mouseenter', this._boundMouseenter);
	    this._trigger.removeEventListener('mouseleave', this._boundMouseleave);
	    this._trigger.removeEventListener('mousemove', this._boundMouseMove);
	    this._trigger.removeEventListener('focusin', this._boundfocusin);
	    this._trigger.removeEventListener('focusout', this._boundfocusout);
	    this._trigger.removeEventListener('touchstart', this._boundTouchstart);
	    window.removeEventListener('touchend', this._boundTouchendWindow);
	    window.removeEventListener('scroll', this._boundScrollWindow);
	
	    this._element.classList.remove(CLASS_IS_TOP, CLASS_IS_ACTIVE, CLASS_IS_UPGRADED);
	    this._element.removeAttribute('style');
	    this._element.removeChild(this._triangle);
	  };
	
	  /**
	   * Open tooltip
	   * @param {HTMLElement} trigger element that opens the tooltip.
	   * @param {number} clientX the x-coordinate of trigger (mouse/touch).
	   */
	
	
	  Tooltip.prototype.open = function open(trigger, clientX) {
	    var _this3 = this;
	
	    if (!trigger) {
	      return;
	    }
	
	    var rect = trigger.getBoundingClientRect();
	    this._element.style.left = '0px';
	    this._element.style.top = '0px';
	    clientX = clientX || rect.left + rect.width / 2;
	    var triggerX = clientX - rect.left;
	    var yTop = rect.top - this._element.offsetHeight - OFFSET_TARGET_TOP;
	    var yBottom = rect.bottom + OFFSET_TARGET_BOTTOM + 2;
	    var x = rect.left + rect.width / 2 - this._element.offsetWidth / 2;
	    var y = yBottom;
	    var triangleX = 0;
	
	    this._element.classList.remove(CLASS_IS_TOP);
	
	    x = rect.left + triggerX - this._element.offsetWidth / 2;
	
	    if (x < OFFSET_VIEWPORT_X) {
	      x = OFFSET_VIEWPORT_X;
	    }
	
	    // If tooltip would be out of viewport on the right
	    if (x + this._element.offsetWidth > window.innerWidth - OFFSET_VIEWPORT_X) {
	      x = window.innerWidth - OFFSET_VIEWPORT_X - this._element.offsetWidth;
	    }
	
	    // If viewport height isn't large enough, place tooltip on top if possible
	    if (yBottom + this._element.offsetHeight > window.innerHeight - OFFSET_VIEWPORT_X) {
	      y = yTop;
	      this._element.classList.add(CLASS_IS_TOP);
	    }
	
	    triangleX = triggerX + rect.left - x;
	
	    this._element.classList.add(CLASS_IS_ACTIVE);
	    this._element.style.left = x + 'px';
	    this._element.style.top = y + 'px';
	
	    this._triangle.style.left = triangleX + 'px';
	
	    this._scrolled = false;
	    window.addEventListener('scroll', this._boundScrollWindow = function (event) {
	      return _this3._onScrollWindow(event);
	    });
	  };
	
	  /**
	   * Close tooltip.
	   */
	
	
	  Tooltip.prototype.close = function close() {
	    clearTimeout(this.openTimeout);
	    window.removeEventListener('scroll', this._boundScrollWindow);
	    this._element.classList.remove(CLASS_IS_ACTIVE);
	  };
	
	  /**
	   * Handle enter event.
	   * @param {Event} event that fired.
	   */
	
	
	  Tooltip.prototype._onTriggerEnter = function _onTriggerEnter(event) {
	    var _this4 = this;
	
	    // this.open(event.target, event.clientX);
	    this.openPositionX = event.clientX;
	    this._trigger.addEventListener('mousemove', this._boundMouseMove = function (event) {
	      return _this4._onTriggerMove(event);
	    });
	
	    clearTimeout(this.openTimeout);
	    this.openTimeout = setTimeout(function () {
	      _this4._trigger.removeEventListener('mousemove', _this4._boundMouseMove);
	      _this4.open(event.target, _this4.openPositionX);
	    }, OPEN_DELAY);
	  };
	
	  /**
	   * Handle mousemove event.
	   * @param {Event} event that fired.
	   */
	
	
	  Tooltip.prototype._onTriggerMove = function _onTriggerMove(event) {
	    this.openPositionX = event.clientX;
	  };
	
	  /**
	   * Handle leave event.
	   * @param {Event} event that fired.
	   */
	
	
	  Tooltip.prototype._onTriggerLeave = function _onTriggerLeave(event) {
	    this.close();
	  };
	
	  /**
	   * Handle leave outside event.
	   * @param {Event} event that fired.
	   */
	
	
	  Tooltip.prototype._onTriggerLeaveOutside = function _onTriggerLeaveOutside(event) {
	    console.log('leaveoutside', event);
	    if (!this._element.contains(event.target) && !this._trigger.contains(event.target)) {
	      console.log('-> close');
	      this.close();
	    };
	  };
	
	  /**
	   * Handle scroll event.
	   * @param {Event} event that fired.
	   */
	
	
	  Tooltip.prototype._onScrollWindow = function _onScrollWindow(event) {
	    window.removeEventListener('scroll', this._boundScrollWindow);
	    if (!this._scrolled) {
	      this.close();
	      this._scrolled = true;
	    }
	  };
	
	  return Tooltip;
	}(_component2.default);
	
	exports.default = Tooltip;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=audi-ui.min.js.map
/*!
 * JavaScript Cookie v2.2.1
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	var registeredInModuleLoader;
	if (typeof define === 'function' && define.amd) {
		define(factory);
		registeredInModuleLoader = true;
	}
	if (typeof exports === 'object') {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function decode (s) {
		return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
	}

	function init (converter) {
		function api() {}

		function set (key, value, attributes) {
			if (typeof document === 'undefined') {
				return;
			}

			attributes = extend({
				path: '/'
			}, api.defaults, attributes);

			if (typeof attributes.expires === 'number') {
				attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
			}

			// We're using "expires" because "max-age" is not supported by IE
			attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

			try {
				var result = JSON.stringify(value);
				if (/^[\{\[]/.test(result)) {
					value = result;
				}
			} catch (e) {}

			value = converter.write ?
				converter.write(value, key) :
				encodeURIComponent(String(value))
					.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

			key = encodeURIComponent(String(key))
				.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
				.replace(/[\(\)]/g, escape);

			var stringifiedAttributes = '';
			for (var attributeName in attributes) {
				if (!attributes[attributeName]) {
					continue;
				}
				stringifiedAttributes += '; ' + attributeName;
				if (attributes[attributeName] === true) {
					continue;
				}

				// Considers RFC 6265 section 5.2:
				// ...
				// 3.  If the remaining unparsed-attributes contains a %x3B (";")
				//     character:
				// Consume the characters of the unparsed-attributes up to,
				// not including, the first %x3B (";") character.
				// ...
				stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
			}

			return (document.cookie = key + '=' + value + stringifiedAttributes);
		}

		function get (key, json) {
			if (typeof document === 'undefined') {
				return;
			}

			var jar = {};
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all.
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (!json && cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = decode(parts[0]);
					cookie = (converter.read || converter)(cookie, name) ||
						decode(cookie);

					if (json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					jar[name] = cookie;

					if (key === name) {
						break;
					}
				} catch (e) {}
			}

			return key ? jar[key] : jar;
		}

		api.set = set;
		api.get = function (key) {
			return get(key, false /* read as raw */);
		};
		api.getJSON = function (key) {
			return get(key, true /* read as json */);
		};
		api.remove = function (key, attributes) {
			set(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.defaults = {};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));

(function(r){r.fn.qrcode=function(h){var s;function u(a){this.mode=s;this.data=a}function o(a,c){this.typeNumber=a;this.errorCorrectLevel=c;this.modules=null;this.moduleCount=0;this.dataCache=null;this.dataList=[]}function q(a,c){if(void 0==a.length)throw Error(a.length+"/"+c);for(var d=0;d<a.length&&0==a[d];)d++;this.num=Array(a.length-d+c);for(var b=0;b<a.length-d;b++)this.num[b]=a[b+d]}function p(a,c){this.totalCount=a;this.dataCount=c}function t(){this.buffer=[];this.length=0}u.prototype={getLength:function(){return this.data.length},
write:function(a){for(var c=0;c<this.data.length;c++)a.put(this.data.charCodeAt(c),8)}};o.prototype={addData:function(a){this.dataList.push(new u(a));this.dataCache=null},isDark:function(a,c){if(0>a||this.moduleCount<=a||0>c||this.moduleCount<=c)throw Error(a+","+c);return this.modules[a][c]},getModuleCount:function(){return this.moduleCount},make:function(){if(1>this.typeNumber){for(var a=1,a=1;40>a;a++){for(var c=p.getRSBlocks(a,this.errorCorrectLevel),d=new t,b=0,e=0;e<c.length;e++)b+=c[e].dataCount;
for(e=0;e<this.dataList.length;e++)c=this.dataList[e],d.put(c.mode,4),d.put(c.getLength(),j.getLengthInBits(c.mode,a)),c.write(d);if(d.getLengthInBits()<=8*b)break}this.typeNumber=a}this.makeImpl(!1,this.getBestMaskPattern())},makeImpl:function(a,c){this.moduleCount=4*this.typeNumber+17;this.modules=Array(this.moduleCount);for(var d=0;d<this.moduleCount;d++){this.modules[d]=Array(this.moduleCount);for(var b=0;b<this.moduleCount;b++)this.modules[d][b]=null}this.setupPositionProbePattern(0,0);this.setupPositionProbePattern(this.moduleCount-
7,0);this.setupPositionProbePattern(0,this.moduleCount-7);this.setupPositionAdjustPattern();this.setupTimingPattern();this.setupTypeInfo(a,c);7<=this.typeNumber&&this.setupTypeNumber(a);null==this.dataCache&&(this.dataCache=o.createData(this.typeNumber,this.errorCorrectLevel,this.dataList));this.mapData(this.dataCache,c)},setupPositionProbePattern:function(a,c){for(var d=-1;7>=d;d++)if(!(-1>=a+d||this.moduleCount<=a+d))for(var b=-1;7>=b;b++)-1>=c+b||this.moduleCount<=c+b||(this.modules[a+d][c+b]=
0<=d&&6>=d&&(0==b||6==b)||0<=b&&6>=b&&(0==d||6==d)||2<=d&&4>=d&&2<=b&&4>=b?!0:!1)},getBestMaskPattern:function(){for(var a=0,c=0,d=0;8>d;d++){this.makeImpl(!0,d);var b=j.getLostPoint(this);if(0==d||a>b)a=b,c=d}return c},createMovieClip:function(a,c,d){a=a.createEmptyMovieClip(c,d);this.make();for(c=0;c<this.modules.length;c++)for(var d=1*c,b=0;b<this.modules[c].length;b++){var e=1*b;this.modules[c][b]&&(a.beginFill(0,100),a.moveTo(e,d),a.lineTo(e+1,d),a.lineTo(e+1,d+1),a.lineTo(e,d+1),a.endFill())}return a},
setupTimingPattern:function(){for(var a=8;a<this.moduleCount-8;a++)null==this.modules[a][6]&&(this.modules[a][6]=0==a%2);for(a=8;a<this.moduleCount-8;a++)null==this.modules[6][a]&&(this.modules[6][a]=0==a%2)},setupPositionAdjustPattern:function(){for(var a=j.getPatternPosition(this.typeNumber),c=0;c<a.length;c++)for(var d=0;d<a.length;d++){var b=a[c],e=a[d];if(null==this.modules[b][e])for(var f=-2;2>=f;f++)for(var i=-2;2>=i;i++)this.modules[b+f][e+i]=-2==f||2==f||-2==i||2==i||0==f&&0==i?!0:!1}},setupTypeNumber:function(a){for(var c=
j.getBCHTypeNumber(this.typeNumber),d=0;18>d;d++){var b=!a&&1==(c>>d&1);this.modules[Math.floor(d/3)][d%3+this.moduleCount-8-3]=b}for(d=0;18>d;d++)b=!a&&1==(c>>d&1),this.modules[d%3+this.moduleCount-8-3][Math.floor(d/3)]=b},setupTypeInfo:function(a,c){for(var d=j.getBCHTypeInfo(this.errorCorrectLevel<<3|c),b=0;15>b;b++){var e=!a&&1==(d>>b&1);6>b?this.modules[b][8]=e:8>b?this.modules[b+1][8]=e:this.modules[this.moduleCount-15+b][8]=e}for(b=0;15>b;b++)e=!a&&1==(d>>b&1),8>b?this.modules[8][this.moduleCount-
b-1]=e:9>b?this.modules[8][15-b-1+1]=e:this.modules[8][15-b-1]=e;this.modules[this.moduleCount-8][8]=!a},mapData:function(a,c){for(var d=-1,b=this.moduleCount-1,e=7,f=0,i=this.moduleCount-1;0<i;i-=2)for(6==i&&i--;;){for(var g=0;2>g;g++)if(null==this.modules[b][i-g]){var n=!1;f<a.length&&(n=1==(a[f]>>>e&1));j.getMask(c,b,i-g)&&(n=!n);this.modules[b][i-g]=n;e--; -1==e&&(f++,e=7)}b+=d;if(0>b||this.moduleCount<=b){b-=d;d=-d;break}}}};o.PAD0=236;o.PAD1=17;o.createData=function(a,c,d){for(var c=p.getRSBlocks(a,
c),b=new t,e=0;e<d.length;e++){var f=d[e];b.put(f.mode,4);b.put(f.getLength(),j.getLengthInBits(f.mode,a));f.write(b)}for(e=a=0;e<c.length;e++)a+=c[e].dataCount;if(b.getLengthInBits()>8*a)throw Error("code length overflow. ("+b.getLengthInBits()+">"+8*a+")");for(b.getLengthInBits()+4<=8*a&&b.put(0,4);0!=b.getLengthInBits()%8;)b.putBit(!1);for(;!(b.getLengthInBits()>=8*a);){b.put(o.PAD0,8);if(b.getLengthInBits()>=8*a)break;b.put(o.PAD1,8)}return o.createBytes(b,c)};o.createBytes=function(a,c){for(var d=
0,b=0,e=0,f=Array(c.length),i=Array(c.length),g=0;g<c.length;g++){var n=c[g].dataCount,h=c[g].totalCount-n,b=Math.max(b,n),e=Math.max(e,h);f[g]=Array(n);for(var k=0;k<f[g].length;k++)f[g][k]=255&a.buffer[k+d];d+=n;k=j.getErrorCorrectPolynomial(h);n=(new q(f[g],k.getLength()-1)).mod(k);i[g]=Array(k.getLength()-1);for(k=0;k<i[g].length;k++)h=k+n.getLength()-i[g].length,i[g][k]=0<=h?n.get(h):0}for(k=g=0;k<c.length;k++)g+=c[k].totalCount;d=Array(g);for(k=n=0;k<b;k++)for(g=0;g<c.length;g++)k<f[g].length&&
(d[n++]=f[g][k]);for(k=0;k<e;k++)for(g=0;g<c.length;g++)k<i[g].length&&(d[n++]=i[g][k]);return d};s=4;for(var j={PATTERN_POSITION_TABLE:[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,
78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],G15:1335,G18:7973,G15_MASK:21522,getBCHTypeInfo:function(a){for(var c=a<<10;0<=j.getBCHDigit(c)-j.getBCHDigit(j.G15);)c^=j.G15<<j.getBCHDigit(c)-j.getBCHDigit(j.G15);return(a<<10|c)^j.G15_MASK},getBCHTypeNumber:function(a){for(var c=a<<12;0<=j.getBCHDigit(c)-
j.getBCHDigit(j.G18);)c^=j.G18<<j.getBCHDigit(c)-j.getBCHDigit(j.G18);return a<<12|c},getBCHDigit:function(a){for(var c=0;0!=a;)c++,a>>>=1;return c},getPatternPosition:function(a){return j.PATTERN_POSITION_TABLE[a-1]},getMask:function(a,c,d){switch(a){case 0:return 0==(c+d)%2;case 1:return 0==c%2;case 2:return 0==d%3;case 3:return 0==(c+d)%3;case 4:return 0==(Math.floor(c/2)+Math.floor(d/3))%2;case 5:return 0==c*d%2+c*d%3;case 6:return 0==(c*d%2+c*d%3)%2;case 7:return 0==(c*d%3+(c+d)%2)%2;default:throw Error("bad maskPattern:"+
a);}},getErrorCorrectPolynomial:function(a){for(var c=new q([1],0),d=0;d<a;d++)c=c.multiply(new q([1,l.gexp(d)],0));return c},getLengthInBits:function(a,c){if(1<=c&&10>c)switch(a){case 1:return 10;case 2:return 9;case s:return 8;case 8:return 8;default:throw Error("mode:"+a);}else if(27>c)switch(a){case 1:return 12;case 2:return 11;case s:return 16;case 8:return 10;default:throw Error("mode:"+a);}else if(41>c)switch(a){case 1:return 14;case 2:return 13;case s:return 16;case 8:return 12;default:throw Error("mode:"+
a);}else throw Error("type:"+c);},getLostPoint:function(a){for(var c=a.getModuleCount(),d=0,b=0;b<c;b++)for(var e=0;e<c;e++){for(var f=0,i=a.isDark(b,e),g=-1;1>=g;g++)if(!(0>b+g||c<=b+g))for(var h=-1;1>=h;h++)0>e+h||c<=e+h||0==g&&0==h||i==a.isDark(b+g,e+h)&&f++;5<f&&(d+=3+f-5)}for(b=0;b<c-1;b++)for(e=0;e<c-1;e++)if(f=0,a.isDark(b,e)&&f++,a.isDark(b+1,e)&&f++,a.isDark(b,e+1)&&f++,a.isDark(b+1,e+1)&&f++,0==f||4==f)d+=3;for(b=0;b<c;b++)for(e=0;e<c-6;e++)a.isDark(b,e)&&!a.isDark(b,e+1)&&a.isDark(b,e+
2)&&a.isDark(b,e+3)&&a.isDark(b,e+4)&&!a.isDark(b,e+5)&&a.isDark(b,e+6)&&(d+=40);for(e=0;e<c;e++)for(b=0;b<c-6;b++)a.isDark(b,e)&&!a.isDark(b+1,e)&&a.isDark(b+2,e)&&a.isDark(b+3,e)&&a.isDark(b+4,e)&&!a.isDark(b+5,e)&&a.isDark(b+6,e)&&(d+=40);for(e=f=0;e<c;e++)for(b=0;b<c;b++)a.isDark(b,e)&&f++;a=Math.abs(100*f/c/c-50)/5;return d+10*a}},l={glog:function(a){if(1>a)throw Error("glog("+a+")");return l.LOG_TABLE[a]},gexp:function(a){for(;0>a;)a+=255;for(;256<=a;)a-=255;return l.EXP_TABLE[a]},EXP_TABLE:Array(256),
LOG_TABLE:Array(256)},m=0;8>m;m++)l.EXP_TABLE[m]=1<<m;for(m=8;256>m;m++)l.EXP_TABLE[m]=l.EXP_TABLE[m-4]^l.EXP_TABLE[m-5]^l.EXP_TABLE[m-6]^l.EXP_TABLE[m-8];for(m=0;255>m;m++)l.LOG_TABLE[l.EXP_TABLE[m]]=m;q.prototype={get:function(a){return this.num[a]},getLength:function(){return this.num.length},multiply:function(a){for(var c=Array(this.getLength()+a.getLength()-1),d=0;d<this.getLength();d++)for(var b=0;b<a.getLength();b++)c[d+b]^=l.gexp(l.glog(this.get(d))+l.glog(a.get(b)));return new q(c,0)},mod:function(a){if(0>
this.getLength()-a.getLength())return this;for(var c=l.glog(this.get(0))-l.glog(a.get(0)),d=Array(this.getLength()),b=0;b<this.getLength();b++)d[b]=this.get(b);for(b=0;b<a.getLength();b++)d[b]^=l.gexp(l.glog(a.get(b))+c);return(new q(d,0)).mod(a)}};p.RS_BLOCK_TABLE=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],
[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,
116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,
43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,
3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,
55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,
45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]];p.getRSBlocks=function(a,c){var d=p.getRsBlockTable(a,c);if(void 0==d)throw Error("bad rs block @ typeNumber:"+a+"/errorCorrectLevel:"+c);for(var b=d.length/3,e=[],f=0;f<b;f++)for(var h=d[3*f+0],g=d[3*f+1],j=d[3*f+2],l=0;l<h;l++)e.push(new p(g,j));return e};p.getRsBlockTable=function(a,c){switch(c){case 1:return p.RS_BLOCK_TABLE[4*(a-1)+0];case 0:return p.RS_BLOCK_TABLE[4*(a-1)+1];case 3:return p.RS_BLOCK_TABLE[4*
(a-1)+2];case 2:return p.RS_BLOCK_TABLE[4*(a-1)+3]}};t.prototype={get:function(a){return 1==(this.buffer[Math.floor(a/8)]>>>7-a%8&1)},put:function(a,c){for(var d=0;d<c;d++)this.putBit(1==(a>>>c-d-1&1))},getLengthInBits:function(){return this.length},putBit:function(a){var c=Math.floor(this.length/8);this.buffer.length<=c&&this.buffer.push(0);a&&(this.buffer[c]|=128>>>this.length%8);this.length++}};"string"===typeof h&&(h={text:h});h=r.extend({},{render:"canvas",width:256,height:256,typeNumber:-1,
correctLevel:2,background:"#ffffff",foreground:"#000000"},h);return this.each(function(){var a;if("canvas"==h.render){a=new o(h.typeNumber,h.correctLevel);a.addData(h.text);a.make();var c=document.createElement("canvas");c.width=h.width;c.height=h.height;for(var d=c.getContext("2d"),b=h.width/a.getModuleCount(),e=h.height/a.getModuleCount(),f=0;f<a.getModuleCount();f++)for(var i=0;i<a.getModuleCount();i++){d.fillStyle=a.isDark(f,i)?h.foreground:h.background;var g=Math.ceil((i+1)*b)-Math.floor(i*b),
j=Math.ceil((f+1)*b)-Math.floor(f*b);d.fillRect(Math.round(i*b),Math.round(f*e),g,j)}}else{a=new o(h.typeNumber,h.correctLevel);a.addData(h.text);a.make();c=r("<table></table>").css("width",h.width+"px").css("height",h.height+"px").css("border","0px").css("border-collapse","collapse").css("background-color",h.background);d=h.width/a.getModuleCount();b=h.height/a.getModuleCount();for(e=0;e<a.getModuleCount();e++){f=r("<tr></tr>").css("height",b+"px").appendTo(c);for(i=0;i<a.getModuleCount();i++)r("<td></td>").css("width",
d+"px").css("background-color",a.isDark(e,i)?h.foreground:h.background).appendTo(f)}}a=c;jQuery(a).appendTo(this)})}})(jQuery);
/* Font Face Observer v2.1.0 - © Bram Stein. License: BSD-3-Clause */(function(){'use strict';var f,g=[];function l(a){g.push(a);1==g.length&&f()}function m(){for(;g.length;)g[0](),g.shift()}f=function(){setTimeout(m)};function n(a){this.a=p;this.b=void 0;this.f=[];var b=this;try{a(function(a){q(b,a)},function(a){r(b,a)})}catch(c){r(b,c)}}var p=2;function t(a){return new n(function(b,c){c(a)})}function u(a){return new n(function(b){b(a)})}function q(a,b){if(a.a==p){if(b==a)throw new TypeError;var c=!1;try{var d=b&&b.then;if(null!=b&&"object"==typeof b&&"function"==typeof d){d.call(b,function(b){c||q(a,b);c=!0},function(b){c||r(a,b);c=!0});return}}catch(e){c||r(a,e);return}a.a=0;a.b=b;v(a)}}
function r(a,b){if(a.a==p){if(b==a)throw new TypeError;a.a=1;a.b=b;v(a)}}function v(a){l(function(){if(a.a!=p)for(;a.f.length;){var b=a.f.shift(),c=b[0],d=b[1],e=b[2],b=b[3];try{0==a.a?"function"==typeof c?e(c.call(void 0,a.b)):e(a.b):1==a.a&&("function"==typeof d?e(d.call(void 0,a.b)):b(a.b))}catch(h){b(h)}}})}n.prototype.g=function(a){return this.c(void 0,a)};n.prototype.c=function(a,b){var c=this;return new n(function(d,e){c.f.push([a,b,d,e]);v(c)})};
function w(a){return new n(function(b,c){function d(c){return function(d){h[c]=d;e+=1;e==a.length&&b(h)}}var e=0,h=[];0==a.length&&b(h);for(var k=0;k<a.length;k+=1)u(a[k]).c(d(k),c)})}function x(a){return new n(function(b,c){for(var d=0;d<a.length;d+=1)u(a[d]).c(b,c)})};window.Promise||(window.Promise=n,window.Promise.resolve=u,window.Promise.reject=t,window.Promise.race=x,window.Promise.all=w,window.Promise.prototype.then=n.prototype.c,window.Promise.prototype["catch"]=n.prototype.g);}());

(function(){function l(a,b){document.addEventListener?a.addEventListener("scroll",b,!1):a.attachEvent("scroll",b)}function m(a){document.body?a():document.addEventListener?document.addEventListener("DOMContentLoaded",function c(){document.removeEventListener("DOMContentLoaded",c);a()}):document.attachEvent("onreadystatechange",function k(){if("interactive"==document.readyState||"complete"==document.readyState)document.detachEvent("onreadystatechange",k),a()})};function t(a){this.a=document.createElement("div");this.a.setAttribute("aria-hidden","true");this.a.appendChild(document.createTextNode(a));this.b=document.createElement("span");this.c=document.createElement("span");this.h=document.createElement("span");this.f=document.createElement("span");this.g=-1;this.b.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";this.c.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";
this.f.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";this.h.style.cssText="display:inline-block;width:200%;height:200%;font-size:16px;max-width:none;";this.b.appendChild(this.h);this.c.appendChild(this.f);this.a.appendChild(this.b);this.a.appendChild(this.c)}
function u(a,b){a.a.style.cssText="max-width:none;min-width:20px;min-height:20px;display:inline-block;overflow:hidden;position:absolute;width:auto;margin:0;padding:0;top:-999px;white-space:nowrap;font-synthesis:none;font:"+b+";"}function z(a){var b=a.a.offsetWidth,c=b+100;a.f.style.width=c+"px";a.c.scrollLeft=c;a.b.scrollLeft=a.b.scrollWidth+100;return a.g!==b?(a.g=b,!0):!1}function A(a,b){function c(){var a=k;z(a)&&a.a.parentNode&&b(a.g)}var k=a;l(a.b,c);l(a.c,c);z(a)};function B(a,b){var c=b||{};this.family=a;this.style=c.style||"normal";this.weight=c.weight||"normal";this.stretch=c.stretch||"normal"}var C=null,D=null,E=null,F=null;function G(){if(null===D)if(J()&&/Apple/.test(window.navigator.vendor)){var a=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/.exec(window.navigator.userAgent);D=!!a&&603>parseInt(a[1],10)}else D=!1;return D}function J(){null===F&&(F=!!document.fonts);return F}
function K(){if(null===E){var a=document.createElement("div");try{a.style.font="condensed 100px sans-serif"}catch(b){}E=""!==a.style.font}return E}function L(a,b){return[a.style,a.weight,K()?a.stretch:"","100px",b].join(" ")}
B.prototype.load=function(a,b){var c=this,k=a||"BESbswy",r=0,n=b||3E3,H=(new Date).getTime();return new Promise(function(a,b){if(J()&&!G()){var M=new Promise(function(a,b){function e(){(new Date).getTime()-H>=n?b(Error(""+n+"ms timeout exceeded")):document.fonts.load(L(c,'"'+c.family+'"'),k).then(function(c){1<=c.length?a():setTimeout(e,25)},b)}e()}),N=new Promise(function(a,c){r=setTimeout(function(){c(Error(""+n+"ms timeout exceeded"))},n)});Promise.race([N,M]).then(function(){clearTimeout(r);a(c)},
b)}else m(function(){function v(){var b;if(b=-1!=f&&-1!=g||-1!=f&&-1!=h||-1!=g&&-1!=h)(b=f!=g&&f!=h&&g!=h)||(null===C&&(b=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent),C=!!b&&(536>parseInt(b[1],10)||536===parseInt(b[1],10)&&11>=parseInt(b[2],10))),b=C&&(f==w&&g==w&&h==w||f==x&&g==x&&h==x||f==y&&g==y&&h==y)),b=!b;b&&(d.parentNode&&d.parentNode.removeChild(d),clearTimeout(r),a(c))}function I(){if((new Date).getTime()-H>=n)d.parentNode&&d.parentNode.removeChild(d),b(Error(""+
n+"ms timeout exceeded"));else{var a=document.hidden;if(!0===a||void 0===a)f=e.a.offsetWidth,g=p.a.offsetWidth,h=q.a.offsetWidth,v();r=setTimeout(I,50)}}var e=new t(k),p=new t(k),q=new t(k),f=-1,g=-1,h=-1,w=-1,x=-1,y=-1,d=document.createElement("div");d.dir="ltr";u(e,L(c,"sans-serif"));u(p,L(c,"serif"));u(q,L(c,"monospace"));d.appendChild(e.a);d.appendChild(p.a);d.appendChild(q.a);document.body.appendChild(d);w=e.a.offsetWidth;x=p.a.offsetWidth;y=q.a.offsetWidth;I();A(e,function(a){f=a;v()});u(e,
L(c,'"'+c.family+'",sans-serif'));A(p,function(a){g=a;v()});u(p,L(c,'"'+c.family+'",serif'));A(q,function(a){h=a;v()});u(q,L(c,'"'+c.family+'",monospace'))})})};"object"===typeof module?module.exports=B:(window.FontFaceObserver=B,window.FontFaceObserver.prototype.load=B.prototype.load);}());

/*!
 * URI.js - Mutating URLs
 *
 * Version: 1.18.1
 *
 * Author: Rodney Rehm
 * Web: http://medialize.github.io/URI.js/
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *
 */
(function (root, factory) {
  'use strict';
  // https://github.com/umdjs/umd/blob/master/returnExports.js
  if (typeof exports === 'object') {
    // Node
    module.exports = factory(require('./punycode'), require('./IPv6'), require('./SecondLevelDomains'));
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['./punycode', './IPv6', './SecondLevelDomains'], factory);
  } else {
    // Browser globals (root is window)
    root.URI = factory(root.punycode, root.IPv6, root.SecondLevelDomains, root);
  }
}(this, function (punycode, IPv6, SLD, root) {
  'use strict';
  /*global location, escape, unescape */
  // FIXME: v2.0.0 renamce non-camelCase properties to uppercase
  /*jshint camelcase: false */

  // save current URI variable, if any
  var _URI = root && root.URI;

  function URI(url, base) {
    var _urlSupplied = arguments.length >= 1;
    var _baseSupplied = arguments.length >= 2;

    // Allow instantiation without the 'new' keyword
    if (!(this instanceof URI)) {
      if (_urlSupplied) {
        if (_baseSupplied) {
          return new URI(url, base);
        }

        return new URI(url);
      }

      return new URI();
    }

    if (url === undefined) {
      if (_urlSupplied) {
        throw new TypeError('undefined is not a valid argument for URI');
      }

      if (typeof location !== 'undefined') {
        url = location.href + '';
      } else {
        url = '';
      }
    }

    this.href(url);

    // resolve to base according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#constructor
    if (base !== undefined) {
      return this.absoluteTo(base);
    }

    return this;
  }

  URI.version = '1.18.1';

  var p = URI.prototype;
  var hasOwn = Object.prototype.hasOwnProperty;

  function escapeRegEx(string) {
    // https://github.com/medialize/URI.js/commit/85ac21783c11f8ccab06106dba9735a31a86924d#commitcomment-821963
    return string.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
  }

  function getType(value) {
    // IE8 doesn't return [Object Undefined] but [Object Object] for undefined value
    if (value === undefined) {
      return 'Undefined';
    }

    return String(Object.prototype.toString.call(value)).slice(8, -1);
  }

  function isArray(obj) {
    return getType(obj) === 'Array';
  }

  function filterArrayValues(data, value) {
    var lookup = {};
    var i, length;

    if (getType(value) === 'RegExp') {
      lookup = null;
    } else if (isArray(value)) {
      for (i = 0, length = value.length; i < length; i++) {
        lookup[value[i]] = true;
      }
    } else {
      lookup[value] = true;
    }

    for (i = 0, length = data.length; i < length; i++) {
      /*jshint laxbreak: true */
      var _match = lookup && lookup[data[i]] !== undefined
        || !lookup && value.test(data[i]);
      /*jshint laxbreak: false */
      if (_match) {
        data.splice(i, 1);
        length--;
        i--;
      }
    }

    return data;
  }

  function arrayContains(list, value) {
    var i, length;

    // value may be string, number, array, regexp
    if (isArray(value)) {
      // Note: this can be optimized to O(n) (instead of current O(m * n))
      for (i = 0, length = value.length; i < length; i++) {
        if (!arrayContains(list, value[i])) {
          return false;
        }
      }

      return true;
    }

    var _type = getType(value);
    for (i = 0, length = list.length; i < length; i++) {
      if (_type === 'RegExp') {
        if (typeof list[i] === 'string' && list[i].match(value)) {
          return true;
        }
      } else if (list[i] === value) {
        return true;
      }
    }

    return false;
  }

  function arraysEqual(one, two) {
    if (!isArray(one) || !isArray(two)) {
      return false;
    }

    // arrays can't be equal if they have different amount of content
    if (one.length !== two.length) {
      return false;
    }

    one.sort();
    two.sort();

    for (var i = 0, l = one.length; i < l; i++) {
      if (one[i] !== two[i]) {
        return false;
      }
    }

    return true;
  }

  function trimSlashes(text) {
    var trim_expression = /^\/+|\/+$/g;
    return text.replace(trim_expression, '');
  }

  URI._parts = function() {
    return {
      protocol: null,
      username: null,
      password: null,
      hostname: null,
      urn: null,
      port: null,
      path: null,
      query: null,
      fragment: null,
      // state
      duplicateQueryParameters: URI.duplicateQueryParameters,
      escapeQuerySpace: URI.escapeQuerySpace
    };
  };
  // state: allow duplicate query parameters (a=1&a=1)
  URI.duplicateQueryParameters = false;
  // state: replaces + with %20 (space in query strings)
  URI.escapeQuerySpace = true;
  // static properties
  URI.protocol_expression = /^[a-z][a-z0-9.+-]*$/i;
  URI.idn_expression = /[^a-z0-9\.-]/i;
  URI.punycode_expression = /(xn--)/i;
  // well, 333.444.555.666 matches, but it sure ain't no IPv4 - do we care?
  URI.ip4_expression = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
  // credits to Rich Brown
  // source: http://forums.intermapper.com/viewtopic.php?p=1096#1096
  // specification: http://www.ietf.org/rfc/rfc4291.txt
  URI.ip6_expression = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
  // expression used is "gruber revised" (@gruber v2) determined to be the
  // best solution in a regex-golf we did a couple of ages ago at
  // * http://mathiasbynens.be/demo/url-regex
  // * http://rodneyrehm.de/t/url-regex.html
  URI.find_uri_expression = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig;
  URI.findUri = {
    // valid "scheme://" or "www."
    start: /\b(?:([a-z][a-z0-9.+-]*:\/\/)|www\.)/gi,
    // everything up to the next whitespace
    end: /[\s\r\n]|$/,
    // trim trailing punctuation captured by end RegExp
    trim: /[`!()\[\]{};:'".,<>?«»“”„‘’]+$/
  };
  // http://www.iana.org/assignments/uri-schemes.html
  // http://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers#Well-known_ports
  URI.defaultPorts = {
    http: '80',
    https: '443',
    ftp: '21',
    gopher: '70',
    ws: '80',
    wss: '443'
  };
  // allowed hostname characters according to RFC 3986
  // ALPHA DIGIT "-" "." "_" "~" "!" "$" "&" "'" "(" ")" "*" "+" "," ";" "=" %encoded
  // I've never seen a (non-IDN) hostname other than: ALPHA DIGIT . -
  URI.invalid_hostname_characters = /[^a-zA-Z0-9\.-]/;
  // map DOM Elements to their URI attribute
  URI.domAttributes = {
    'a': 'href',
    'blockquote': 'cite',
    'link': 'href',
    'base': 'href',
    'script': 'src',
    'form': 'action',
    'img': 'src',
    'area': 'href',
    'iframe': 'src',
    'embed': 'src',
    'source': 'src',
    'track': 'src',
    'input': 'src', // but only if type="image"
    'audio': 'src',
    'video': 'src'
  };
  URI.getDomAttribute = function(node) {
    if (!node || !node.nodeName) {
      return undefined;
    }

    var nodeName = node.nodeName.toLowerCase();
    // <input> should only expose src for type="image"
    if (nodeName === 'input' && node.type !== 'image') {
      return undefined;
    }

    return URI.domAttributes[nodeName];
  };

  function escapeForDumbFirefox36(value) {
    // https://github.com/medialize/URI.js/issues/91
    return escape(value);
  }

  // encoding / decoding according to RFC3986
  function strictEncodeURIComponent(string) {
    // see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/encodeURIComponent
    return encodeURIComponent(string)
      .replace(/[!'()*]/g, escapeForDumbFirefox36)
      .replace(/\*/g, '%2A');
  }
  URI.encode = strictEncodeURIComponent;
  URI.decode = decodeURIComponent;
  URI.iso8859 = function() {
    URI.encode = escape;
    URI.decode = unescape;
  };
  URI.unicode = function() {
    URI.encode = strictEncodeURIComponent;
    URI.decode = decodeURIComponent;
  };
  URI.characters = {
    pathname: {
      encode: {
        // RFC3986 2.1: For consistency, URI producers and normalizers should
        // use uppercase hexadecimal digits for all percent-encodings.
        expression: /%(24|26|2B|2C|3B|3D|3A|40)/ig,
        map: {
          // -._~!'()*
          '%24': '$',
          '%26': '&',
          '%2B': '+',
          '%2C': ',',
          '%3B': ';',
          '%3D': '=',
          '%3A': ':',
          '%40': '@'
        }
      },
      decode: {
        expression: /[\/\?#]/g,
        map: {
          '/': '%2F',
          '?': '%3F',
          '#': '%23'
        }
      }
    },
    reserved: {
      encode: {
        // RFC3986 2.1: For consistency, URI producers and normalizers should
        // use uppercase hexadecimal digits for all percent-encodings.
        expression: /%(21|23|24|26|27|28|29|2A|2B|2C|2F|3A|3B|3D|3F|40|5B|5D)/ig,
        map: {
          // gen-delims
          '%3A': ':',
          '%2F': '/',
          '%3F': '?',
          '%23': '#',
          '%5B': '[',
          '%5D': ']',
          '%40': '@',
          // sub-delims
          '%21': '!',
          '%24': '$',
          '%26': '&',
          '%27': '\'',
          '%28': '(',
          '%29': ')',
          '%2A': '*',
          '%2B': '+',
          '%2C': ',',
          '%3B': ';',
          '%3D': '='
        }
      }
    },
    urnpath: {
      // The characters under `encode` are the characters called out by RFC 2141 as being acceptable
      // for usage in a URN. RFC2141 also calls out "-", ".", and "_" as acceptable characters, but
      // these aren't encoded by encodeURIComponent, so we don't have to call them out here. Also
      // note that the colon character is not featured in the encoding map; this is because URI.js
      // gives the colons in URNs semantic meaning as the delimiters of path segements, and so it
      // should not appear unencoded in a segment itself.
      // See also the note above about RFC3986 and capitalalized hex digits.
      encode: {
        expression: /%(21|24|27|28|29|2A|2B|2C|3B|3D|40)/ig,
        map: {
          '%21': '!',
          '%24': '$',
          '%27': '\'',
          '%28': '(',
          '%29': ')',
          '%2A': '*',
          '%2B': '+',
          '%2C': ',',
          '%3B': ';',
          '%3D': '=',
          '%40': '@'
        }
      },
      // These characters are the characters called out by RFC2141 as "reserved" characters that
      // should never appear in a URN, plus the colon character (see note above).
      decode: {
        expression: /[\/\?#:]/g,
        map: {
          '/': '%2F',
          '?': '%3F',
          '#': '%23',
          ':': '%3A'
        }
      }
    }
  };
  URI.encodeQuery = function(string, escapeQuerySpace) {
    var escaped = URI.encode(string + '');
    if (escapeQuerySpace === undefined) {
      escapeQuerySpace = URI.escapeQuerySpace;
    }

    return escapeQuerySpace ? escaped.replace(/%20/g, '+') : escaped;
  };
  URI.decodeQuery = function(string, escapeQuerySpace) {
    string += '';
    if (escapeQuerySpace === undefined) {
      escapeQuerySpace = URI.escapeQuerySpace;
    }

    try {
      return URI.decode(escapeQuerySpace ? string.replace(/\+/g, '%20') : string);
    } catch(e) {
      // we're not going to mess with weird encodings,
      // give up and return the undecoded original string
      // see https://github.com/medialize/URI.js/issues/87
      // see https://github.com/medialize/URI.js/issues/92
      return string;
    }
  };
  // generate encode/decode path functions
  var _parts = {'encode':'encode', 'decode':'decode'};
  var _part;
  var generateAccessor = function(_group, _part) {
    return function(string) {
      try {
        return URI[_part](string + '').replace(URI.characters[_group][_part].expression, function(c) {
          return URI.characters[_group][_part].map[c];
        });
      } catch (e) {
        // we're not going to mess with weird encodings,
        // give up and return the undecoded original string
        // see https://github.com/medialize/URI.js/issues/87
        // see https://github.com/medialize/URI.js/issues/92
        return string;
      }
    };
  };

  for (_part in _parts) {
    URI[_part + 'PathSegment'] = generateAccessor('pathname', _parts[_part]);
    URI[_part + 'UrnPathSegment'] = generateAccessor('urnpath', _parts[_part]);
  }

  var generateSegmentedPathFunction = function(_sep, _codingFuncName, _innerCodingFuncName) {
    return function(string) {
      // Why pass in names of functions, rather than the function objects themselves? The
      // definitions of some functions (but in particular, URI.decode) will occasionally change due
      // to URI.js having ISO8859 and Unicode modes. Passing in the name and getting it will ensure
      // that the functions we use here are "fresh".
      var actualCodingFunc;
      if (!_innerCodingFuncName) {
        actualCodingFunc = URI[_codingFuncName];
      } else {
        actualCodingFunc = function(string) {
          return URI[_codingFuncName](URI[_innerCodingFuncName](string));
        };
      }

      var segments = (string + '').split(_sep);

      for (var i = 0, length = segments.length; i < length; i++) {
        segments[i] = actualCodingFunc(segments[i]);
      }

      return segments.join(_sep);
    };
  };

  // This takes place outside the above loop because we don't want, e.g., encodeUrnPath functions.
  URI.decodePath = generateSegmentedPathFunction('/', 'decodePathSegment');
  URI.decodeUrnPath = generateSegmentedPathFunction(':', 'decodeUrnPathSegment');
  URI.recodePath = generateSegmentedPathFunction('/', 'encodePathSegment', 'decode');
  URI.recodeUrnPath = generateSegmentedPathFunction(':', 'encodeUrnPathSegment', 'decode');

  URI.encodeReserved = generateAccessor('reserved', 'encode');

  URI.parse = function(string, parts) {
    var pos;
    if (!parts) {
      parts = {};
    }
    // [protocol"://"[username[":"password]"@"]hostname[":"port]"/"?][path]["?"querystring]["#"fragment]

    // extract fragment
    pos = string.indexOf('#');
    if (pos > -1) {
      // escaping?
      parts.fragment = string.substring(pos + 1) || null;
      string = string.substring(0, pos);
    }

    // extract query
    pos = string.indexOf('?');
    if (pos > -1) {
      // escaping?
      parts.query = string.substring(pos + 1) || null;
      string = string.substring(0, pos);
    }

    // extract protocol
    if (string.substring(0, 2) === '//') {
      // relative-scheme
      parts.protocol = null;
      string = string.substring(2);
      // extract "user:pass@host:port"
      string = URI.parseAuthority(string, parts);
    } else {
      pos = string.indexOf(':');
      if (pos > -1) {
        parts.protocol = string.substring(0, pos) || null;
        if (parts.protocol && !parts.protocol.match(URI.protocol_expression)) {
          // : may be within the path
          parts.protocol = undefined;
        } else if (string.substring(pos + 1, pos + 3) === '//') {
          string = string.substring(pos + 3);

          // extract "user:pass@host:port"
          string = URI.parseAuthority(string, parts);
        } else {
          string = string.substring(pos + 1);
          parts.urn = true;
        }
      }
    }

    // what's left must be the path
    parts.path = string;

    // and we're done
    return parts;
  };
  URI.parseHost = function(string, parts) {
    // Copy chrome, IE, opera backslash-handling behavior.
    // Back slashes before the query string get converted to forward slashes
    // See: https://github.com/joyent/node/blob/386fd24f49b0e9d1a8a076592a404168faeecc34/lib/url.js#L115-L124
    // See: https://code.google.com/p/chromium/issues/detail?id=25916
    // https://github.com/medialize/URI.js/pull/233
    string = string.replace(/\\/g, '/');

    // extract host:port
    var pos = string.indexOf('/');
    var bracketPos;
    var t;

    if (pos === -1) {
      pos = string.length;
    }

    if (string.charAt(0) === '[') {
      // IPv6 host - http://tools.ietf.org/html/draft-ietf-6man-text-addr-representation-04#section-6
      // I claim most client software breaks on IPv6 anyways. To simplify things, URI only accepts
      // IPv6+port in the format [2001:db8::1]:80 (for the time being)
      bracketPos = string.indexOf(']');
      parts.hostname = string.substring(1, bracketPos) || null;
      parts.port = string.substring(bracketPos + 2, pos) || null;
      if (parts.port === '/') {
        parts.port = null;
      }
    } else {
      var firstColon = string.indexOf(':');
      var firstSlash = string.indexOf('/');
      var nextColon = string.indexOf(':', firstColon + 1);
      if (nextColon !== -1 && (firstSlash === -1 || nextColon < firstSlash)) {
        // IPv6 host contains multiple colons - but no port
        // this notation is actually not allowed by RFC 3986, but we're a liberal parser
        parts.hostname = string.substring(0, pos) || null;
        parts.port = null;
      } else {
        t = string.substring(0, pos).split(':');
        parts.hostname = t[0] || null;
        parts.port = t[1] || null;
      }
    }

    if (parts.hostname && string.substring(pos).charAt(0) !== '/') {
      pos++;
      string = '/' + string;
    }

    return string.substring(pos) || '/';
  };
  URI.parseAuthority = function(string, parts) {
    string = URI.parseUserinfo(string, parts);
    return URI.parseHost(string, parts);
  };
  URI.parseUserinfo = function(string, parts) {
    // extract username:password
    var firstSlash = string.indexOf('/');
    var pos = string.lastIndexOf('@', firstSlash > -1 ? firstSlash : string.length - 1);
    var t;

    // authority@ must come before /path
    if (pos > -1 && (firstSlash === -1 || pos < firstSlash)) {
      t = string.substring(0, pos).split(':');
      parts.username = t[0] ? URI.decode(t[0]) : null;
      t.shift();
      parts.password = t[0] ? URI.decode(t.join(':')) : null;
      string = string.substring(pos + 1);
    } else {
      parts.username = null;
      parts.password = null;
    }

    return string;
  };
  URI.parseQuery = function(string, escapeQuerySpace) {
    if (!string) {
      return {};
    }

    // throw out the funky business - "?"[name"="value"&"]+
    string = string.replace(/&+/g, '&').replace(/^\?*&*|&+$/g, '');

    if (!string) {
      return {};
    }

    var items = {};
    var splits = string.split('&');
    var length = splits.length;
    var v, name, value;

    for (var i = 0; i < length; i++) {
      v = splits[i].split('=');
      name = URI.decodeQuery(v.shift(), escapeQuerySpace);
      // no "=" is null according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#collect-url-parameters
      value = v.length ? URI.decodeQuery(v.join('='), escapeQuerySpace) : null;

      if (hasOwn.call(items, name)) {
        if (typeof items[name] === 'string' || items[name] === null) {
          items[name] = [items[name]];
        }

        items[name].push(value);
      } else {
        items[name] = value;
      }
    }

    return items;
  };

  URI.build = function(parts) {
    var t = '';

    if (parts.protocol) {
      t += parts.protocol + ':';
    }

    if (!parts.urn && (t || parts.hostname)) {
      t += '//';
    }

    t += (URI.buildAuthority(parts) || '');

    if (typeof parts.path === 'string') {
      if (parts.path.charAt(0) !== '/' && typeof parts.hostname === 'string') {
        t += '/';
      }

      t += parts.path;
    }

    if (typeof parts.query === 'string' && parts.query) {
      t += '?' + parts.query;
    }

    if (typeof parts.fragment === 'string' && parts.fragment) {
      t += '#' + parts.fragment;
    }
    return t;
  };
  URI.buildHost = function(parts) {
    var t = '';

    if (!parts.hostname) {
      return '';
    } else if (URI.ip6_expression.test(parts.hostname)) {
      t += '[' + parts.hostname + ']';
    } else {
      t += parts.hostname;
    }

    if (parts.port) {
      t += ':' + parts.port;
    }

    return t;
  };
  URI.buildAuthority = function(parts) {
    return URI.buildUserinfo(parts) + URI.buildHost(parts);
  };
  URI.buildUserinfo = function(parts) {
    var t = '';

    if (parts.username) {
      t += URI.encode(parts.username);
    }

    if (parts.password) {
      t += ':' + URI.encode(parts.password);
    }

    if (t) {
      t += '@';
    }

    return t;
  };
  URI.buildQuery = function(data, duplicateQueryParameters, escapeQuerySpace) {
    // according to http://tools.ietf.org/html/rfc3986 or http://labs.apache.org/webarch/uri/rfc/rfc3986.html
    // being »-._~!$&'()*+,;=:@/?« %HEX and alnum are allowed
    // the RFC explicitly states ?/foo being a valid use case, no mention of parameter syntax!
    // URI.js treats the query string as being application/x-www-form-urlencoded
    // see http://www.w3.org/TR/REC-html40/interact/forms.html#form-content-type

    var t = '';
    var unique, key, i, length;
    for (key in data) {
      if (hasOwn.call(data, key) && key) {
        if (isArray(data[key])) {
          unique = {};
          for (i = 0, length = data[key].length; i < length; i++) {
            if (data[key][i] !== undefined && unique[data[key][i] + ''] === undefined) {
              t += '&' + URI.buildQueryParameter(key, data[key][i], escapeQuerySpace);
              if (duplicateQueryParameters !== true) {
                unique[data[key][i] + ''] = true;
              }
            }
          }
        } else if (data[key] !== undefined) {
          t += '&' + URI.buildQueryParameter(key, data[key], escapeQuerySpace);
        }
      }
    }

    return t.substring(1);
  };
  URI.buildQueryParameter = function(name, value, escapeQuerySpace) {
    // http://www.w3.org/TR/REC-html40/interact/forms.html#form-content-type -- application/x-www-form-urlencoded
    // don't append "=" for null values, according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#url-parameter-serialization
    return URI.encodeQuery(name, escapeQuerySpace) + (value !== null ? '=' + URI.encodeQuery(value, escapeQuerySpace) : '');
  };

  URI.addQuery = function(data, name, value) {
    if (typeof name === 'object') {
      for (var key in name) {
        if (hasOwn.call(name, key)) {
          URI.addQuery(data, key, name[key]);
        }
      }
    } else if (typeof name === 'string') {
      if (data[name] === undefined) {
        data[name] = value;
        return;
      } else if (typeof data[name] === 'string') {
        data[name] = [data[name]];
      }

      if (!isArray(value)) {
        value = [value];
      }

      data[name] = (data[name] || []).concat(value);
    } else {
      throw new TypeError('URI.addQuery() accepts an object, string as the name parameter');
    }
  };
  URI.removeQuery = function(data, name, value) {
    var i, length, key;

    if (isArray(name)) {
      for (i = 0, length = name.length; i < length; i++) {
        data[name[i]] = undefined;
      }
    } else if (getType(name) === 'RegExp') {
      for (key in data) {
        if (name.test(key)) {
          data[key] = undefined;
        }
      }
    } else if (typeof name === 'object') {
      for (key in name) {
        if (hasOwn.call(name, key)) {
          URI.removeQuery(data, key, name[key]);
        }
      }
    } else if (typeof name === 'string') {
      if (value !== undefined) {
        if (getType(value) === 'RegExp') {
          if (!isArray(data[name]) && value.test(data[name])) {
            data[name] = undefined;
          } else {
            data[name] = filterArrayValues(data[name], value);
          }
        } else if (data[name] === String(value) && (!isArray(value) || value.length === 1)) {
          data[name] = undefined;
        } else if (isArray(data[name])) {
          data[name] = filterArrayValues(data[name], value);
        }
      } else {
        data[name] = undefined;
      }
    } else {
      throw new TypeError('URI.removeQuery() accepts an object, string, RegExp as the first parameter');
    }
  };
  URI.hasQuery = function(data, name, value, withinArray) {
    switch (getType(name)) {
      case 'String':
        // Nothing to do here
        break;

      case 'RegExp':
        for (var key in data) {
          if (hasOwn.call(data, key)) {
            if (name.test(key) && (value === undefined || URI.hasQuery(data, key, value))) {
              return true;
            }
          }
        }

        return false;

      case 'Object':
        for (var _key in name) {
          if (hasOwn.call(name, _key)) {
            if (!URI.hasQuery(data, _key, name[_key])) {
              return false;
            }
          }
        }

        return true;

      default:
        throw new TypeError('URI.hasQuery() accepts a string, regular expression or object as the name parameter');
    }

    switch (getType(value)) {
      case 'Undefined':
        // true if exists (but may be empty)
        return name in data; // data[name] !== undefined;

      case 'Boolean':
        // true if exists and non-empty
        var _booly = Boolean(isArray(data[name]) ? data[name].length : data[name]);
        return value === _booly;

      case 'Function':
        // allow complex comparison
        return !!value(data[name], name, data);

      case 'Array':
        if (!isArray(data[name])) {
          return false;
        }

        var op = withinArray ? arrayContains : arraysEqual;
        return op(data[name], value);

      case 'RegExp':
        if (!isArray(data[name])) {
          return Boolean(data[name] && data[name].match(value));
        }

        if (!withinArray) {
          return false;
        }

        return arrayContains(data[name], value);

      case 'Number':
        value = String(value);
        /* falls through */
      case 'String':
        if (!isArray(data[name])) {
          return data[name] === value;
        }

        if (!withinArray) {
          return false;
        }

        return arrayContains(data[name], value);

      default:
        throw new TypeError('URI.hasQuery() accepts undefined, boolean, string, number, RegExp, Function as the value parameter');
    }
  };


  URI.joinPaths = function() {
    var input = [];
    var segments = [];
    var nonEmptySegments = 0;

    for (var i = 0; i < arguments.length; i++) {
      var url = new URI(arguments[i]);
      input.push(url);
      var _segments = url.segment();
      for (var s = 0; s < _segments.length; s++) {
        if (typeof _segments[s] === 'string') {
          segments.push(_segments[s]);
        }

        if (_segments[s]) {
          nonEmptySegments++;
        }
      }
    }

    if (!segments.length || !nonEmptySegments) {
      return new URI('');
    }

    var uri = new URI('').segment(segments);

    if (input[0].path() === '' || input[0].path().slice(0, 1) === '/') {
      uri.path('/' + uri.path());
    }

    return uri.normalize();
  };

  URI.commonPath = function(one, two) {
    var length = Math.min(one.length, two.length);
    var pos;

    // find first non-matching character
    for (pos = 0; pos < length; pos++) {
      if (one.charAt(pos) !== two.charAt(pos)) {
        pos--;
        break;
      }
    }

    if (pos < 1) {
      return one.charAt(0) === two.charAt(0) && one.charAt(0) === '/' ? '/' : '';
    }

    // revert to last /
    if (one.charAt(pos) !== '/' || two.charAt(pos) !== '/') {
      pos = one.substring(0, pos).lastIndexOf('/');
    }

    return one.substring(0, pos + 1);
  };

  URI.withinString = function(string, callback, options) {
    options || (options = {});
    var _start = options.start || URI.findUri.start;
    var _end = options.end || URI.findUri.end;
    var _trim = options.trim || URI.findUri.trim;
    var _attributeOpen = /[a-z0-9-]=["']?$/i;

    _start.lastIndex = 0;
    while (true) {
      var match = _start.exec(string);
      if (!match) {
        break;
      }

      var start = match.index;
      if (options.ignoreHtml) {
        // attribut(e=["']?$)
        var attributeOpen = string.slice(Math.max(start - 3, 0), start);
        if (attributeOpen && _attributeOpen.test(attributeOpen)) {
          continue;
        }
      }

      var end = start + string.slice(start).search(_end);
      var slice = string.slice(start, end).replace(_trim, '');
      if (options.ignore && options.ignore.test(slice)) {
        continue;
      }

      end = start + slice.length;
      var result = callback(slice, start, end, string);
      string = string.slice(0, start) + result + string.slice(end);
      _start.lastIndex = start + result.length;
    }

    _start.lastIndex = 0;
    return string;
  };

  URI.ensureValidHostname = function(v) {
    // Theoretically URIs allow percent-encoding in Hostnames (according to RFC 3986)
    // they are not part of DNS and therefore ignored by URI.js

    if (v.match(URI.invalid_hostname_characters)) {
      // test punycode
      if (!punycode) {
        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-] and Punycode.js is not available');
      }

      if (punycode.toASCII(v).match(URI.invalid_hostname_characters)) {
        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
      }
    }
  };

  // noConflict
  URI.noConflict = function(removeAll) {
    if (removeAll) {
      var unconflicted = {
        URI: this.noConflict()
      };

      if (root.URITemplate && typeof root.URITemplate.noConflict === 'function') {
        unconflicted.URITemplate = root.URITemplate.noConflict();
      }

      if (root.IPv6 && typeof root.IPv6.noConflict === 'function') {
        unconflicted.IPv6 = root.IPv6.noConflict();
      }

      if (root.SecondLevelDomains && typeof root.SecondLevelDomains.noConflict === 'function') {
        unconflicted.SecondLevelDomains = root.SecondLevelDomains.noConflict();
      }

      return unconflicted;
    } else if (root.URI === this) {
      root.URI = _URI;
    }

    return this;
  };

  p.build = function(deferBuild) {
    if (deferBuild === true) {
      this._deferred_build = true;
    } else if (deferBuild === undefined || this._deferred_build) {
      this._string = URI.build(this._parts);
      this._deferred_build = false;
    }

    return this;
  };

  p.clone = function() {
    return new URI(this);
  };

  p.valueOf = p.toString = function() {
    return this.build(false)._string;
  };


  function generateSimpleAccessor(_part){
    return function(v, build) {
      if (v === undefined) {
        return this._parts[_part] || '';
      } else {
        this._parts[_part] = v || null;
        this.build(!build);
        return this;
      }
    };
  }

  function generatePrefixAccessor(_part, _key){
    return function(v, build) {
      if (v === undefined) {
        return this._parts[_part] || '';
      } else {
        if (v !== null) {
          v = v + '';
          if (v.charAt(0) === _key) {
            v = v.substring(1);
          }
        }

        this._parts[_part] = v;
        this.build(!build);
        return this;
      }
    };
  }

  p.protocol = generateSimpleAccessor('protocol');
  p.username = generateSimpleAccessor('username');
  p.password = generateSimpleAccessor('password');
  p.hostname = generateSimpleAccessor('hostname');
  p.port = generateSimpleAccessor('port');
  p.query = generatePrefixAccessor('query', '?');
  p.fragment = generatePrefixAccessor('fragment', '#');

  p.search = function(v, build) {
    var t = this.query(v, build);
    return typeof t === 'string' && t.length ? ('?' + t) : t;
  };
  p.hash = function(v, build) {
    var t = this.fragment(v, build);
    return typeof t === 'string' && t.length ? ('#' + t) : t;
  };

  p.pathname = function(v, build) {
    if (v === undefined || v === true) {
      var res = this._parts.path || (this._parts.hostname ? '/' : '');
      return v ? (this._parts.urn ? URI.decodeUrnPath : URI.decodePath)(res) : res;
    } else {
      if (this._parts.urn) {
        this._parts.path = v ? URI.recodeUrnPath(v) : '';
      } else {
        this._parts.path = v ? URI.recodePath(v) : '/';
      }
      this.build(!build);
      return this;
    }
  };
  p.path = p.pathname;
  p.href = function(href, build) {
    var key;

    if (href === undefined) {
      return this.toString();
    }

    this._string = '';
    this._parts = URI._parts();

    var _URI = href instanceof URI;
    var _object = typeof href === 'object' && (href.hostname || href.path || href.pathname);
    if (href.nodeName) {
      var attribute = URI.getDomAttribute(href);
      href = href[attribute] || '';
      _object = false;
    }

    // window.location is reported to be an object, but it's not the sort
    // of object we're looking for:
    // * location.protocol ends with a colon
    // * location.query != object.search
    // * location.hash != object.fragment
    // simply serializing the unknown object should do the trick
    // (for location, not for everything...)
    if (!_URI && _object && href.pathname !== undefined) {
      href = href.toString();
    }

    if (typeof href === 'string' || href instanceof String) {
      this._parts = URI.parse(String(href), this._parts);
    } else if (_URI || _object) {
      var src = _URI ? href._parts : href;
      for (key in src) {
        if (hasOwn.call(this._parts, key)) {
          this._parts[key] = src[key];
        }
      }
    } else {
      throw new TypeError('invalid input');
    }

    this.build(!build);
    return this;
  };

  // identification accessors
  p.is = function(what) {
    var ip = false;
    var ip4 = false;
    var ip6 = false;
    var name = false;
    var sld = false;
    var idn = false;
    var punycode = false;
    var relative = !this._parts.urn;

    if (this._parts.hostname) {
      relative = false;
      ip4 = URI.ip4_expression.test(this._parts.hostname);
      ip6 = URI.ip6_expression.test(this._parts.hostname);
      ip = ip4 || ip6;
      name = !ip;
      sld = name && SLD && SLD.has(this._parts.hostname);
      idn = name && URI.idn_expression.test(this._parts.hostname);
      punycode = name && URI.punycode_expression.test(this._parts.hostname);
    }

    switch (what.toLowerCase()) {
      case 'relative':
        return relative;

      case 'absolute':
        return !relative;

      // hostname identification
      case 'domain':
      case 'name':
        return name;

      case 'sld':
        return sld;

      case 'ip':
        return ip;

      case 'ip4':
      case 'ipv4':
      case 'inet4':
        return ip4;

      case 'ip6':
      case 'ipv6':
      case 'inet6':
        return ip6;

      case 'idn':
        return idn;

      case 'url':
        return !this._parts.urn;

      case 'urn':
        return !!this._parts.urn;

      case 'punycode':
        return punycode;
    }

    return null;
  };

  // component specific input validation
  var _protocol = p.protocol;
  var _port = p.port;
  var _hostname = p.hostname;

  p.protocol = function(v, build) {
    if (v !== undefined) {
      if (v) {
        // accept trailing ://
        v = v.replace(/:(\/\/)?$/, '');

        if (!v.match(URI.protocol_expression)) {
          throw new TypeError('Protocol "' + v + '" contains characters other than [A-Z0-9.+-] or doesn\'t start with [A-Z]');
        }
      }
    }
    return _protocol.call(this, v, build);
  };
  p.scheme = p.protocol;
  p.port = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v !== undefined) {
      if (v === 0) {
        v = null;
      }

      if (v) {
        v += '';
        if (v.charAt(0) === ':') {
          v = v.substring(1);
        }

        if (v.match(/[^0-9]/)) {
          throw new TypeError('Port "' + v + '" contains characters other than [0-9]');
        }
      }
    }
    return _port.call(this, v, build);
  };
  p.hostname = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v !== undefined) {
      var x = {};
      var res = URI.parseHost(v, x);
      if (res !== '/') {
        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
      }

      v = x.hostname;
    }
    return _hostname.call(this, v, build);
  };

  // compound accessors
  p.origin = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined) {
      var protocol = this.protocol();
      var authority = this.authority();
      if (!authority) {
        return '';
      }

      return (protocol ? protocol + '://' : '') + this.authority();
    } else {
      var origin = URI(v);
      this
        .protocol(origin.protocol())
        .authority(origin.authority())
        .build(!build);
      return this;
    }
  };
  p.host = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined) {
      return this._parts.hostname ? URI.buildHost(this._parts) : '';
    } else {
      var res = URI.parseHost(v, this._parts);
      if (res !== '/') {
        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
      }

      this.build(!build);
      return this;
    }
  };
  p.authority = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined) {
      return this._parts.hostname ? URI.buildAuthority(this._parts) : '';
    } else {
      var res = URI.parseAuthority(v, this._parts);
      if (res !== '/') {
        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
      }

      this.build(!build);
      return this;
    }
  };
  p.userinfo = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined) {
      var t = URI.buildUserinfo(this._parts);
      return t ? t.substring(0, t.length -1) : t;
    } else {
      if (v[v.length-1] !== '@') {
        v += '@';
      }

      URI.parseUserinfo(v, this._parts);
      this.build(!build);
      return this;
    }
  };
  p.resource = function(v, build) {
    var parts;

    if (v === undefined) {
      return this.path() + this.search() + this.hash();
    }

    parts = URI.parse(v);
    this._parts.path = parts.path;
    this._parts.query = parts.query;
    this._parts.fragment = parts.fragment;
    this.build(!build);
    return this;
  };

  // fraction accessors
  p.subdomain = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    // convenience, return "www" from "www.example.org"
    if (v === undefined) {
      if (!this._parts.hostname || this.is('IP')) {
        return '';
      }

      // grab domain and add another segment
      var end = this._parts.hostname.length - this.domain().length - 1;
      return this._parts.hostname.substring(0, end) || '';
    } else {
      var e = this._parts.hostname.length - this.domain().length;
      var sub = this._parts.hostname.substring(0, e);
      var replace = new RegExp('^' + escapeRegEx(sub));

      if (v && v.charAt(v.length - 1) !== '.') {
        v += '.';
      }

      if (v) {
        URI.ensureValidHostname(v);
      }

      this._parts.hostname = this._parts.hostname.replace(replace, v);
      this.build(!build);
      return this;
    }
  };
  p.domain = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (typeof v === 'boolean') {
      build = v;
      v = undefined;
    }

    // convenience, return "example.org" from "www.example.org"
    if (v === undefined) {
      if (!this._parts.hostname || this.is('IP')) {
        return '';
      }

      // if hostname consists of 1 or 2 segments, it must be the domain
      var t = this._parts.hostname.match(/\./g);
      if (t && t.length < 2) {
        return this._parts.hostname;
      }

      // grab tld and add another segment
      var end = this._parts.hostname.length - this.tld(build).length - 1;
      end = this._parts.hostname.lastIndexOf('.', end -1) + 1;
      return this._parts.hostname.substring(end) || '';
    } else {
      if (!v) {
        throw new TypeError('cannot set domain empty');
      }

      URI.ensureValidHostname(v);

      if (!this._parts.hostname || this.is('IP')) {
        this._parts.hostname = v;
      } else {
        var replace = new RegExp(escapeRegEx(this.domain()) + '$');
        this._parts.hostname = this._parts.hostname.replace(replace, v);
      }

      this.build(!build);
      return this;
    }
  };
  p.tld = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (typeof v === 'boolean') {
      build = v;
      v = undefined;
    }

    // return "org" from "www.example.org"
    if (v === undefined) {
      if (!this._parts.hostname || this.is('IP')) {
        return '';
      }

      var pos = this._parts.hostname.lastIndexOf('.');
      var tld = this._parts.hostname.substring(pos + 1);

      if (build !== true && SLD && SLD.list[tld.toLowerCase()]) {
        return SLD.get(this._parts.hostname) || tld;
      }

      return tld;
    } else {
      var replace;

      if (!v) {
        throw new TypeError('cannot set TLD empty');
      } else if (v.match(/[^a-zA-Z0-9-]/)) {
        if (SLD && SLD.is(v)) {
          replace = new RegExp(escapeRegEx(this.tld()) + '$');
          this._parts.hostname = this._parts.hostname.replace(replace, v);
        } else {
          throw new TypeError('TLD "' + v + '" contains characters other than [A-Z0-9]');
        }
      } else if (!this._parts.hostname || this.is('IP')) {
        throw new ReferenceError('cannot set TLD on non-domain host');
      } else {
        replace = new RegExp(escapeRegEx(this.tld()) + '$');
        this._parts.hostname = this._parts.hostname.replace(replace, v);
      }

      this.build(!build);
      return this;
    }
  };
  p.directory = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined || v === true) {
      if (!this._parts.path && !this._parts.hostname) {
        return '';
      }

      if (this._parts.path === '/') {
        return '/';
      }

      var end = this._parts.path.length - this.filename().length - 1;
      var res = this._parts.path.substring(0, end) || (this._parts.hostname ? '/' : '');

      return v ? URI.decodePath(res) : res;

    } else {
      var e = this._parts.path.length - this.filename().length;
      var directory = this._parts.path.substring(0, e);
      var replace = new RegExp('^' + escapeRegEx(directory));

      // fully qualifier directories begin with a slash
      if (!this.is('relative')) {
        if (!v) {
          v = '/';
        }

        if (v.charAt(0) !== '/') {
          v = '/' + v;
        }
      }

      // directories always end with a slash
      if (v && v.charAt(v.length - 1) !== '/') {
        v += '/';
      }

      v = URI.recodePath(v);
      this._parts.path = this._parts.path.replace(replace, v);
      this.build(!build);
      return this;
    }
  };
  p.filename = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined || v === true) {
      if (!this._parts.path || this._parts.path === '/') {
        return '';
      }

      var pos = this._parts.path.lastIndexOf('/');
      var res = this._parts.path.substring(pos+1);

      return v ? URI.decodePathSegment(res) : res;
    } else {
      var mutatedDirectory = false;

      if (v.charAt(0) === '/') {
        v = v.substring(1);
      }

      if (v.match(/\.?\//)) {
        mutatedDirectory = true;
      }

      var replace = new RegExp(escapeRegEx(this.filename()) + '$');
      v = URI.recodePath(v);
      this._parts.path = this._parts.path.replace(replace, v);

      if (mutatedDirectory) {
        this.normalizePath(build);
      } else {
        this.build(!build);
      }

      return this;
    }
  };
  p.suffix = function(v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined || v === true) {
      if (!this._parts.path || this._parts.path === '/') {
        return '';
      }

      var filename = this.filename();
      var pos = filename.lastIndexOf('.');
      var s, res;

      if (pos === -1) {
        return '';
      }

      // suffix may only contain alnum characters (yup, I made this up.)
      s = filename.substring(pos+1);
      res = (/^[a-z0-9%]+$/i).test(s) ? s : '';
      return v ? URI.decodePathSegment(res) : res;
    } else {
      if (v.charAt(0) === '.') {
        v = v.substring(1);
      }

      var suffix = this.suffix();
      var replace;

      if (!suffix) {
        if (!v) {
          return this;
        }

        this._parts.path += '.' + URI.recodePath(v);
      } else if (!v) {
        replace = new RegExp(escapeRegEx('.' + suffix) + '$');
      } else {
        replace = new RegExp(escapeRegEx(suffix) + '$');
      }

      if (replace) {
        v = URI.recodePath(v);
        this._parts.path = this._parts.path.replace(replace, v);
      }

      this.build(!build);
      return this;
    }
  };
  p.segment = function(segment, v, build) {
    var separator = this._parts.urn ? ':' : '/';
    var path = this.path();
    var absolute = path.substring(0, 1) === '/';
    var segments = path.split(separator);

    if (segment !== undefined && typeof segment !== 'number') {
      build = v;
      v = segment;
      segment = undefined;
    }

    if (segment !== undefined && typeof segment !== 'number') {
      throw new Error('Bad segment "' + segment + '", must be 0-based integer');
    }

    if (absolute) {
      segments.shift();
    }

    if (segment < 0) {
      // allow negative indexes to address from the end
      segment = Math.max(segments.length + segment, 0);
    }

    if (v === undefined) {
      /*jshint laxbreak: true */
      return segment === undefined
        ? segments
        : segments[segment];
      /*jshint laxbreak: false */
    } else if (segment === null || segments[segment] === undefined) {
      if (isArray(v)) {
        segments = [];
        // collapse empty elements within array
        for (var i=0, l=v.length; i < l; i++) {
          if (!v[i].length && (!segments.length || !segments[segments.length -1].length)) {
            continue;
          }

          if (segments.length && !segments[segments.length -1].length) {
            segments.pop();
          }

          segments.push(trimSlashes(v[i]));
        }
      } else if (v || typeof v === 'string') {
        v = trimSlashes(v);
        if (segments[segments.length -1] === '') {
          // empty trailing elements have to be overwritten
          // to prevent results such as /foo//bar
          segments[segments.length -1] = v;
        } else {
          segments.push(v);
        }
      }
    } else {
      if (v) {
        segments[segment] = trimSlashes(v);
      } else {
        segments.splice(segment, 1);
      }
    }

    if (absolute) {
      segments.unshift('');
    }

    return this.path(segments.join(separator), build);
  };
  p.segmentCoded = function(segment, v, build) {
    var segments, i, l;

    if (typeof segment !== 'number') {
      build = v;
      v = segment;
      segment = undefined;
    }

    if (v === undefined) {
      segments = this.segment(segment, v, build);
      if (!isArray(segments)) {
        segments = segments !== undefined ? URI.decode(segments) : undefined;
      } else {
        for (i = 0, l = segments.length; i < l; i++) {
          segments[i] = URI.decode(segments[i]);
        }
      }

      return segments;
    }

    if (!isArray(v)) {
      v = (typeof v === 'string' || v instanceof String) ? URI.encode(v) : v;
    } else {
      for (i = 0, l = v.length; i < l; i++) {
        v[i] = URI.encode(v[i]);
      }
    }

    return this.segment(segment, v, build);
  };

  // mutating query string
  var q = p.query;
  p.query = function(v, build) {
    if (v === true) {
      return URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
    } else if (typeof v === 'function') {
      var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
      var result = v.call(this, data);
      this._parts.query = URI.buildQuery(result || data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
      this.build(!build);
      return this;
    } else if (v !== undefined && typeof v !== 'string') {
      this._parts.query = URI.buildQuery(v, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
      this.build(!build);
      return this;
    } else {
      return q.call(this, v, build);
    }
  };
  p.setQuery = function(name, value, build) {
    var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);

    if (typeof name === 'string' || name instanceof String) {
      data[name] = value !== undefined ? value : null;
    } else if (typeof name === 'object') {
      for (var key in name) {
        if (hasOwn.call(name, key)) {
          data[key] = name[key];
        }
      }
    } else {
      throw new TypeError('URI.addQuery() accepts an object, string as the name parameter');
    }

    this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
    if (typeof name !== 'string') {
      build = value;
    }

    this.build(!build);
    return this;
  };
  p.addQuery = function(name, value, build) {
    var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
    URI.addQuery(data, name, value === undefined ? null : value);
    this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
    if (typeof name !== 'string') {
      build = value;
    }

    this.build(!build);
    return this;
  };
  p.removeQuery = function(name, value, build) {
    var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
    URI.removeQuery(data, name, value);
    this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
    if (typeof name !== 'string') {
      build = value;
    }

    this.build(!build);
    return this;
  };
  p.hasQuery = function(name, value, withinArray) {
    var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
    return URI.hasQuery(data, name, value, withinArray);
  };
  p.setSearch = p.setQuery;
  p.addSearch = p.addQuery;
  p.removeSearch = p.removeQuery;
  p.hasSearch = p.hasQuery;

  // sanitizing URLs
  p.normalize = function() {
    if (this._parts.urn) {
      return this
        .normalizeProtocol(false)
        .normalizePath(false)
        .normalizeQuery(false)
        .normalizeFragment(false)
        .build();
    }

    return this
      .normalizeProtocol(false)
      .normalizeHostname(false)
      .normalizePort(false)
      .normalizePath(false)
      .normalizeQuery(false)
      .normalizeFragment(false)
      .build();
  };
  p.normalizeProtocol = function(build) {
    if (typeof this._parts.protocol === 'string') {
      this._parts.protocol = this._parts.protocol.toLowerCase();
      this.build(!build);
    }

    return this;
  };
  p.normalizeHostname = function(build) {
    if (this._parts.hostname) {
      if (this.is('IDN') && punycode) {
        this._parts.hostname = punycode.toASCII(this._parts.hostname);
      } else if (this.is('IPv6') && IPv6) {
        this._parts.hostname = IPv6.best(this._parts.hostname);
      }

      this._parts.hostname = this._parts.hostname.toLowerCase();
      this.build(!build);
    }

    return this;
  };
  p.normalizePort = function(build) {
    // remove port of it's the protocol's default
    if (typeof this._parts.protocol === 'string' && this._parts.port === URI.defaultPorts[this._parts.protocol]) {
      this._parts.port = null;
      this.build(!build);
    }

    return this;
  };
  p.normalizePath = function(build) {
    var _path = this._parts.path;
    if (!_path) {
      return this;
    }

    if (this._parts.urn) {
      this._parts.path = URI.recodeUrnPath(this._parts.path);
      this.build(!build);
      return this;
    }

    if (this._parts.path === '/') {
      return this;
    }

    _path = URI.recodePath(_path);

    var _was_relative;
    var _leadingParents = '';
    var _parent, _pos;

    // handle relative paths
    if (_path.charAt(0) !== '/') {
      _was_relative = true;
      _path = '/' + _path;
    }

    // handle relative files (as opposed to directories)
    if (_path.slice(-3) === '/..' || _path.slice(-2) === '/.') {
      _path += '/';
    }

    // resolve simples
    _path = _path
      .replace(/(\/(\.\/)+)|(\/\.$)/g, '/')
      .replace(/\/{2,}/g, '/');

    // remember leading parents
    if (_was_relative) {
      _leadingParents = _path.substring(1).match(/^(\.\.\/)+/) || '';
      if (_leadingParents) {
        _leadingParents = _leadingParents[0];
      }
    }

    // resolve parents
    while (true) {
      _parent = _path.search(/\/\.\.(\/|$)/);
      if (_parent === -1) {
        // no more ../ to resolve
        break;
      } else if (_parent === 0) {
        // top level cannot be relative, skip it
        _path = _path.substring(3);
        continue;
      }

      _pos = _path.substring(0, _parent).lastIndexOf('/');
      if (_pos === -1) {
        _pos = _parent;
      }
      _path = _path.substring(0, _pos) + _path.substring(_parent + 3);
    }

    // revert to relative
    if (_was_relative && this.is('relative')) {
      _path = _leadingParents + _path.substring(1);
    }

    this._parts.path = _path;
    this.build(!build);
    return this;
  };
  p.normalizePathname = p.normalizePath;
  p.normalizeQuery = function(build) {
    if (typeof this._parts.query === 'string') {
      if (!this._parts.query.length) {
        this._parts.query = null;
      } else {
        this.query(URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace));
      }

      this.build(!build);
    }

    return this;
  };
  p.normalizeFragment = function(build) {
    if (!this._parts.fragment) {
      this._parts.fragment = null;
      this.build(!build);
    }

    return this;
  };
  p.normalizeSearch = p.normalizeQuery;
  p.normalizeHash = p.normalizeFragment;

  p.iso8859 = function() {
    // expect unicode input, iso8859 output
    var e = URI.encode;
    var d = URI.decode;

    URI.encode = escape;
    URI.decode = decodeURIComponent;
    try {
      this.normalize();
    } finally {
      URI.encode = e;
      URI.decode = d;
    }
    return this;
  };

  p.unicode = function() {
    // expect iso8859 input, unicode output
    var e = URI.encode;
    var d = URI.decode;

    URI.encode = strictEncodeURIComponent;
    URI.decode = unescape;
    try {
      this.normalize();
    } finally {
      URI.encode = e;
      URI.decode = d;
    }
    return this;
  };

  p.readable = function() {
    var uri = this.clone();
    // removing username, password, because they shouldn't be displayed according to RFC 3986
    uri.username('').password('').normalize();
    var t = '';
    if (uri._parts.protocol) {
      t += uri._parts.protocol + '://';
    }

    if (uri._parts.hostname) {
      if (uri.is('punycode') && punycode) {
        t += punycode.toUnicode(uri._parts.hostname);
        if (uri._parts.port) {
          t += ':' + uri._parts.port;
        }
      } else {
        t += uri.host();
      }
    }

    if (uri._parts.hostname && uri._parts.path && uri._parts.path.charAt(0) !== '/') {
      t += '/';
    }

    t += uri.path(true);
    if (uri._parts.query) {
      var q = '';
      for (var i = 0, qp = uri._parts.query.split('&'), l = qp.length; i < l; i++) {
        var kv = (qp[i] || '').split('=');
        q += '&' + URI.decodeQuery(kv[0], this._parts.escapeQuerySpace)
          .replace(/&/g, '%26');

        if (kv[1] !== undefined) {
          q += '=' + URI.decodeQuery(kv[1], this._parts.escapeQuerySpace)
            .replace(/&/g, '%26');
        }
      }
      t += '?' + q.substring(1);
    }

    t += URI.decodeQuery(uri.hash(), true);
    return t;
  };

  // resolving relative and absolute URLs
  p.absoluteTo = function(base) {
    var resolved = this.clone();
    var properties = ['protocol', 'username', 'password', 'hostname', 'port'];
    var basedir, i, p;

    if (this._parts.urn) {
      throw new Error('URNs do not have any generally defined hierarchical components');
    }

    if (!(base instanceof URI)) {
      base = new URI(base);
    }

    if (!resolved._parts.protocol) {
      resolved._parts.protocol = base._parts.protocol;
    }

    if (this._parts.hostname) {
      return resolved;
    }

    for (i = 0; (p = properties[i]); i++) {
      resolved._parts[p] = base._parts[p];
    }

    if (!resolved._parts.path) {
      resolved._parts.path = base._parts.path;
      if (!resolved._parts.query) {
        resolved._parts.query = base._parts.query;
      }
    } else if (resolved._parts.path.substring(-2) === '..') {
      resolved._parts.path += '/';
    }

    if (resolved.path().charAt(0) !== '/') {
      basedir = base.directory();
      basedir = basedir ? basedir : base.path().indexOf('/') === 0 ? '/' : '';
      resolved._parts.path = (basedir ? (basedir + '/') : '') + resolved._parts.path;
      resolved.normalizePath();
    }

    resolved.build();
    return resolved;
  };
  p.relativeTo = function(base) {
    var relative = this.clone().normalize();
    var relativeParts, baseParts, common, relativePath, basePath;

    if (relative._parts.urn) {
      throw new Error('URNs do not have any generally defined hierarchical components');
    }

    base = new URI(base).normalize();
    relativeParts = relative._parts;
    baseParts = base._parts;
    relativePath = relative.path();
    basePath = base.path();

    if (relativePath.charAt(0) !== '/') {
      throw new Error('URI is already relative');
    }

    if (basePath.charAt(0) !== '/') {
      throw new Error('Cannot calculate a URI relative to another relative URI');
    }

    if (relativeParts.protocol === baseParts.protocol) {
      relativeParts.protocol = null;
    }

    if (relativeParts.username !== baseParts.username || relativeParts.password !== baseParts.password) {
      return relative.build();
    }

    if (relativeParts.protocol !== null || relativeParts.username !== null || relativeParts.password !== null) {
      return relative.build();
    }

    if (relativeParts.hostname === baseParts.hostname && relativeParts.port === baseParts.port) {
      relativeParts.hostname = null;
      relativeParts.port = null;
    } else {
      return relative.build();
    }

    if (relativePath === basePath) {
      relativeParts.path = '';
      return relative.build();
    }

    // determine common sub path
    common = URI.commonPath(relativePath, basePath);

    // If the paths have nothing in common, return a relative URL with the absolute path.
    if (!common) {
      return relative.build();
    }

    var parents = baseParts.path
      .substring(common.length)
      .replace(/[^\/]*$/, '')
      .replace(/.*?\//g, '../');

    relativeParts.path = (parents + relativeParts.path.substring(common.length)) || './';

    return relative.build();
  };

  // comparing URIs
  p.equals = function(uri) {
    var one = this.clone();
    var two = new URI(uri);
    var one_map = {};
    var two_map = {};
    var checked = {};
    var one_query, two_query, key;

    one.normalize();
    two.normalize();

    // exact match
    if (one.toString() === two.toString()) {
      return true;
    }

    // extract query string
    one_query = one.query();
    two_query = two.query();
    one.query('');
    two.query('');

    // definitely not equal if not even non-query parts match
    if (one.toString() !== two.toString()) {
      return false;
    }

    // query parameters have the same length, even if they're permuted
    if (one_query.length !== two_query.length) {
      return false;
    }

    one_map = URI.parseQuery(one_query, this._parts.escapeQuerySpace);
    two_map = URI.parseQuery(two_query, this._parts.escapeQuerySpace);

    for (key in one_map) {
      if (hasOwn.call(one_map, key)) {
        if (!isArray(one_map[key])) {
          if (one_map[key] !== two_map[key]) {
            return false;
          }
        } else if (!arraysEqual(one_map[key], two_map[key])) {
          return false;
        }

        checked[key] = true;
      }
    }

    for (key in two_map) {
      if (hasOwn.call(two_map, key)) {
        if (!checked[key]) {
          // two contains a parameter not present in one
          return false;
        }
      }
    }

    return true;
  };

  // state
  p.duplicateQueryParameters = function(v) {
    this._parts.duplicateQueryParameters = !!v;
    return this;
  };

  p.escapeQuerySpace = function(v) {
    this._parts.escapeQuerySpace = !!v;
    return this;
  };

  return URI;
}));

"use strict";

// ----------------------------------------------------------------------------
// init
// ----------------------------------------------------------------------------
console.log('Audi OneWeb');
console.log('--------------');

var aui = window['audi-ui'];
window["oneweb"] = {}; // webapp container
window["oneweb"]['aui'] = aui;

if (aui !== undefined) {
  var demoLoaderProgress = function demoLoaderProgress() {
    progress += 0.01;

    for (var i = 0; i < spinnerComponents.length; i++) {
      spinnerComponents[i].progress(progress);
    }

    for (var i = 0; i < progressComponents.length; i++) {
      progressComponents[i].progress(progress);
    }

    if (progress < 1) {
      window.requestAnimationFrame(function () {
        return demoLoaderProgress();
      });
    } else {
      progress = 0;
      setTimeout(function () {
        return demoLoaderProgress();
      }, 4000);
    }
  };

  aui["default"].upgradeAllElements();
  var alertComponents = aui.Alert.upgradeElements();
  var progressComponents = aui.Progress.upgradeElements();
  var spinnerComponents = aui.Spinner.upgradeElements();
  var breadcrumbComponents = aui.Breadcrumb.upgradeElements();
  var navComponents = aui.Nav.upgradeElements();
  var paginationComponents = aui.Pagination.upgradeElements();
  var progressComponents = aui.Progress.upgradeElements();


  var modalComponents;
  var setupModal = function (){

    // update modal list in audi ui
    modalComponents = aui.Modal.upgradeElements();

    Array.from(document.querySelectorAll('[data-toggle="modal"]')).forEach(function (element) {
      element.addEventListener('click', function (event) {
        var modal = aui.Modal.getModalById(element.getAttribute('data-target'));

        if (modal) {
          modal.open(event.currentTarget);
          
          $("#" + element.getAttribute('data-target')).on("click", (e) => {
                var $target = $(e.target);
                var isClosable = ($target.hasClass("aui-modal-dialog__body") || $target.hasClass("aui-modal--morph") || $target.hasClass("aui-modal-dialog") || $target.hasClass("aui-modal-backdrop") || ($target.hasClass("aui-color-text-dark") && $target.hasClass("aui-modal-dialog__content")) || $target.hasClass("header-hamburger-menu")  );
                if (isClosable) {
                    aui.Modal.closeCurrentModal();
                    $(".root").removeClass("no-scroll");
                }
            });
        }
      });
    });
    Array.from(document.querySelectorAll('[data-dismiss="modal"]')).forEach(function (element) {
      element.addEventListener('click', function (event) {
        aui.Modal.closeCurrentModal();
      });
    });
    
    // workaround to allowed initializing modal of audi-ui twice,
    // this is required in order to run feature app inside oneweb infrastructure
    window["oneweb"]["aui"]["modal"] = aui.Modal;
    window["oneweb"]["aui"]["modalUpgradeElements"] = aui.Modal.upgradeElements;
    window["oneweb"]["aui"]["modalGetModalById"] = aui.Modal.getModalById;
    window["oneweb"]["aui"]["modalComponents"] = modalComponents;
    window["oneweb"]["aui"]["modalCloseCurrentModal"] = aui.Modal.closeCurrentModal;
              
  }
  setupModal();

  var dropdownComponents = aui.Dropdown.upgradeElements(); // ----------------------------------------------------------------------------
  // Load SVG sprite with Audi Icons
  // ----------------------------------------------------------------------------
  // TODO: load only when required

  Array.from(document.querySelectorAll('[data-svg-sprite]')).forEach(function (element) {
    var src = element.getAttribute('data-svg-sprite');

    if (typeof src === 'string' && src.length > 0) {
      var ajax = new XMLHttpRequest();
      ajax.open('GET', src, true);
      ajax.responseType = 'document';

      ajax.onload = function (event) {
        element.removeAttribute('data-src');

        try {
          element.appendChild(ajax.responseXML.documentElement);
        } catch (e) {
          console.log(e);
        }
      };

      ajax.send();
    }
  }); // ----------------------------------------------------------------------------
  // Spinner and Progress components:
  // ----------------------------------------------------------------------------
  // TODO: load only when required

  var progress = 0;
  setTimeout(function () {
    for (var i = 0; i < spinnerComponents.length; i++) {
      spinnerComponents[i].loop();
    }
  }, 2000);
  setTimeout(function () {
    return demoLoaderProgress();
  }, 2000);


  // ----------------------------------------------------------------------------
  // Update components after font 'Audi Type' was loaded:
  // ----------------------------------------------------------------------------

  var fontFaceObserverScreen = new window.FontFaceObserver('AudiTypeScreen');
  fontFaceObserverScreen.load().then(function () {
    paginationComponents.forEach(function (component) {
      component.update();
    });
    breadcrumbComponents.forEach(function (component) {
      component.update();
    });
    alertComponents.forEach(function (component) {
      component.update();
    });
  }, function () {
    // Error handling: Font is not available or timeout.
    console.warn('Warning: AudiTypeScreen not available.');
  });
  var fontFaceObserverExtended = new window.FontFaceObserver('AudiTypeExtended');
  fontFaceObserverExtended.load().then(function () {
    navComponents.forEach(function (component) {
      component.update();
    });
  }, function () {
    // Error handling: Font is not available or timeout.
    console.warn('Warning: AudiTypeExtended not available.');
  }); // ----------------------------------------------------------------------------
  // Color switch:
  // ----------------------------------------------------------------------------
  // TODO: re-structure for component exxplorer

  if (document.getElementById('change-color')) {
    var colorChange = function colorChange(val) {
      var invert = textColors[val] !== 'dark';
      $('body').removeClass(function (index, css) {
        return (css.match(/\baui-color-\S+/g) || []).join(' ');
      }).addClass('aui-color-' + val).removeClass(function (index, css) {
        return (css.match(/\baui-color-text-\S+/g) || []).join(' ');
      }).addClass('aui-color-text-' + textColors[val]);
      $('.test-section .aui-spinner').toggleClass('is-inverted', invert);
      $('.test-section .aui-progress').toggleClass('is-inverted', invert);
      var component;
      var componentsWithTheme = ['breadcrumb', 'slider', 'dropdown', 'nav'];

      for (var i = 0; i < componentsWithTheme.length; i++) {
        component = componentsWithTheme[i];
        $('.test-section .aui-' + component).toggleClass('aui-theme-black', val === 'black');
        $('.test-section .aui-' + component).toggleClass('aui-theme-silver', val === 'silver');
        $('.test-section .aui-' + component).toggleClass('aui-theme-warmsilver', val === 'warmsilver');
        $('.test-section .aui-' + component).toggleClass('aui-theme-red', val === 'red');
      }

      var componentsTextWithTheme = ['button', 'draggable-list', 'dropzone', 'pager', 'pagination', 'slidernav', 'textfield', 'flyout', 'spinner', 'progress', 'switch', 'radio', 'checkbox', 'fieldset', 'select', 'table'];

      for (var i = 0; i < componentsTextWithTheme.length; i++) {
        component = componentsTextWithTheme[i];
        $('.test-section .aui-' + component).each(function (element, index) {
          if (!$(this).hasClass('aui-theme-image')) {
            $(this).toggleClass('aui-theme-light', invert);
          }
        });
      }
    };

    var textColors = {
      'white': 'dark',
      'black': 'light',
      'silver': 'light',
      'warmsilver': 'light',
      'red': 'light',
      'image': 'dark',
      'imagedark': 'light'
    };
    $('#change-color').on('change', function (event) {
      colorChange($(this).val());
    });
    var uri = window.URI(window.location.href);
    var color = uri.query(true).color;

    if (color !== undefined) {
      if (['black', 'silver', 'warmsilver', 'red'].indexOf(color) >= 0) {
        $('#change-color').val(color);
      }
    }

    colorChange($('#change-color').val());
  } // ----------------------------------------------------------------------------
  // Custom Polyfills
  // ----------------------------------------------------------------------------


  if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
      value: function value(searchElement, fromIndex) {
        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        } // 1. Let O be ? ToObject(this value).


        var o = Object(this); // 2. Let len be ? ToLength(? Get(O, "length")).

        var len = o.length >>> 0; // 3. If len is 0, return false.

        if (len === 0) {
          return false;
        } // 4. Let n be ? ToInteger(fromIndex).
        //    (If fromIndex is undefined, this step produces the value 0.)


        var n = fromIndex | 0; // 5. If n â‰¥ 0, then
        //  a. Let k be n.
        // 6. Else n < 0,
        //  a. Let k be len + n.
        //  b. If k < 0, let k be 0.

        var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        function sameValueZero(x, y) {
          return x === y || typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y);
        } // 7. Repeat, while k < len


        while (k < len) {
          // a. Let elementK be the result of ? Get(O, ! ToString(k)).
          // b. If SameValueZero(searchElement, elementK) is true, return true.
          if (sameValueZero(o[k], searchElement)) {
            return true;
          } // c. Increase k by 1.


          k++;
        } // 8. Return false


        return false;
      }
    });
  }

  if (typeof NodeList.prototype.forEach !== 'function') {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }

  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }
}

/* platform detection */
var isIOS = function() {
  if (/iPad|iPhone|iPod/.test(navigator.platform)) {
    return true;
  } else {
    return navigator.maxTouchPoints &&
        navigator.maxTouchPoints > 2 &&
        /MacIntel/.test(navigator.platform);
  }
}

var isIE11 = function () {
  return (document.documentMode) ? (document.documentMode === 11) : false;
}

var isWechat = function (){
  if( navigator.userAgent.toLowerCase().indexOf('micromessenger') > -1 || typeof navigator.wxuserAgent !== "undefined" ) {
    return true;
  }
  return false;
}

var isSafari = function (){
  if( navigator.userAgent.toLowerCase().indexOf('safari') > -1) {
    return true;
  }
  return false;
}

// detect mobile device
var isMobile = function () {
  return ($(window).innerWidth() < THREHOLD_RWD_MOBILE_LAYOUT) || isIOS() || /(android|bbd+|meego).+mobile|avantgo|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|plucker|pocket|psp|series(4|6)0|symbian|treo|up.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(navigator.userAgent.toLowerCase());
}
var isMobileDevice  = isMobile();
window.isMobileDevice = isMobileDevice;

var isVisibleOnScreen = function(element, callback) {
  var options = {
    root: document.documentElement
  }
  var observer = new IntersectionObserver(function(entries, observer){
    entries.forEach(function(entry){
      callback(entry.intersectionRatio > 0);
    });
  }, options);

  observer.observe(element);
}

function onDeferLoaded(el){
    if(isIE11()){
        if(el.hasAttribute("data-object-fit")){
            objectFitPolyfill($(el));
        }
    }
    
    else if(isWechat()){
        if(el.nodeName === 'VIDEO'){
            // video embed inside component
            if($(el).hasClass("embeded-video")){
                // special case, on wechat, fallback to default video controls while autoplay is not supported
                if(isIOS()){
                    var isMediaGallery = $(el).closest(".cmp-media-gallery");
                    if(isMediaGallery.length){
                        $(el).attr("controls", "");
                        $(el).removeAttr("autoplay");
                        $("body").on("touchstart touchend", function(e){
                            if(el.paused || el.paused === "undefined"){
                                el.play();
                                $(el).removeAttr("controls");
                                $(el).attr("autoplay", "autoplay");
                            };
                        });
                    }
                    
                    else{
                        $(el).attr("controls", "");
                        $(el).removeAttr("autoplay");
                        $("body").on("touchstart touchend", function(e){
                            if(el.paused || el.paused === "undefined"){
                                el.play();
                                $(el).removeAttr("controls");
                                $(el).attr("autoplay", "autoplay");
                            };
                        });
                    }
                }
                
                else{
                    if($(el).hasClass("autoplay")){
                        $(el).attr("controls", "");
                        $(el).removeAttr("autoplay");
                        $("body").on("touchstart touchend", function(e){
                            if(el.paused || el.paused === "undefined"){
                                el.play();
                                $(el).removeAttr("controls");
                                $(el).attr("autoplay", "autoplay");
                            };
                        });
                    }    
                }
            }
            
            // standalone video component 
            else{
                var auiplayer = $(el).closest(".aui-player");
                if($(el).hasClass("autoplay") && auiplayer.length){
                    // special case, on wechat, video autoplay is not supported
                    var auiPlayer = $(el).closest(".aui-player");
                    auiPlayer.trigger("oneweb-event--video-autoplay-unsupported");
                    // workaround to force to enable autoplay for normal video comp 
//                    $("body").on("touchstart touchmove ", function(e){
//                        if(el.paused && auiplayer.hasClass("is-playing") && $(el).attr("embed-video-initialized")){
//                            auiplayer.removeClass("is-playing");
//                            $(el).attr("embed-video-initialized", true);
//                        }
//                    });
                }
            }
        }
    }
    
    else{
        if(el.nodeName === 'VIDEO'){
            // video embed inside component
            if($(el).hasClass("embeded-video")){
                if($(el).hasClass("autoplay")){
                    // add all autoplay attr dynamically 
                    $(el).attr("autoplay", "autoplay");
                    el.play();
                }
            }
            
            // standalone video component 
            else{
                if($(el).hasClass("autoplay")){
                      // add all autoplay attr dynamically 
                      $(el).attr("autoplay", "autoplay");
                      el.play();
                  }
            }
        }
    }
    
}

/*! lozad.js - v1.16.0 - 2020-09-10 */
var observer = lozad(".defer", {
    loaded: onDeferLoaded
});
window.deferInstance = observer;
observer.observe();
// ----------------------------------------------------------------------------
// radio-btn
// ----------------------------------------------------------------------------


(function (window, document) {
    let $cmp = $(".custom-radio-btn");
    if ($cmp.length === 0) return;
    $cmp.each(function (i, radio) {
        $(radio).find(".aui-radio").on("click", function (e, param) {
            $cmp.each(function (j, radio1) {
                $(radio1).find(".aui-radio_tick").removeClass("checked");
            });
            $(radio).find(".aui-radio_tick").addClass("checked");
            this.click(function () {
                return false;
            });
        })
    });



})(window, document);

// ----------------------------------------------------------------------------
// Screen sections
// ----------------------------------------------------------------------------

const headerHeight = 60;
const $document = $(document);
$document.ready(function () {
    //auto adjust section height in AEM
    let $sections = $(".root .section");
    let screenHeight = $(window.top).height();
    let headerHeight = $(".cmp-header").height();
    headerHeight = headerHeight + 2;

    const isIphonex = () => {
        if (typeof window !== 'undefined' && window) {
            return /iphone/gi.test(window.navigator.userAgent) && window.screen.height >= 812;
        }
        return false;
    }

    $sections.each(function (i, item) {
        var $item=$(item);
        //remove auto height for animations components
        if(!$item.hasClass("no-auto-height")){
            $(item).height(screenHeight);
        }
        if($item.hasClass("screen-height")){
            if(window.innerWidth < 768 && !$(".cmp-header.mobile").hasClass("non-fixed") ){
                $(item).attr("style","margin-top:"+headerHeight+"px;");
            }
            // var a = isIphonex();
            // console.log("test ",a)
            /* - if(isIphonex()){
                // the height of url bar is 75px
                $(item).height(screenHeight - headerHeight+75);
            }else{
                $(item).height(screenHeight - headerHeight);
            }*/
            $(item).height(screenHeight - headerHeight);


        }
    });

    $(window).trigger("screenified", {
        screenHeight: screenHeight,
    });
});
//****************************************************
//copied from index.js for supporting animate
//****************************************************
"use strict";

(function (window, document) {
  var animations = $(".animations");
  var windowHeight = $(window).height();
  var windowWidth = $(window).width();
  var functions = {
    onInit: function onInit() {
      this.bindScrollEvent();
    },
    bindScrollEvent: function bindScrollEvent() {
      console.log("height");

      function delay() {
        $(window).on("scroll", function (e) {
          for (var index = 0; index < animations.length; index++) {
            var animationsItem = $(animations[index]);
            var height = windowHeight - (animationsItem.offset().top - $(document).scrollTop()) - animationsItem.height() / 3;

            if (height > 0 && height < windowHeight) {
              animationsItem.addClass("parallax-effect");

              if (animationsItem.data("text") === "one-time-animation") {
                animationsItem.addClass("one-time-animation");
              }
            } else {
              animationsItem.removeClass("parallax-effect");
            }

            animationsItem.attr("preHeight", height);
          }
        }).trigger("scroll");
      }

      window.setInterval(delay, 1000);
    }
  };
  functions.onInit();
})(window, document);
/* Analytics */

// tracking for concept car
var trackingConceptCar = function(){
    var CONCEPT_CAR_PATH = "/saic-audi/concept-car.html";
    var metaKey = "analysis";
    var metaContent = "concept-car";
    if(location.href.includes(CONCEPT_CAR_PATH)){
        // workaround to append meta data
        $("head").append("<meta name='"+metaKey+"' content='"+metaContent+"'>");
        var $container = $(".container.responsivegrid.main .cmp-text-image, .container.responsivegrid.main .cmp-recommend-card");
        var buttons = $container.find("button");
        // find target buttons
        buttons.each(function(i, item){
            var $item = $(item);
            var $parent = $item.parent();
            var id;
            
            // prepare tracking ids
            if( $parent.prop("tagName") === "A"){
                var link = $parent.attr("href");
//                $parent.attr("href", "#");
                if(link.includes(CONCEPT_CAR_PATH)){
                    id = link.split(CONCEPT_CAR_PATH)[1];
                    id = id.replace(".html", "").replace("/", "");
                    $item.attr("data-aa", id);
                    // send tracking
                    $item.on("click", function(e){
                        // AA tracking
                        if(window._satellite){
                          console.log('AA tracking >>>', 'saic-concept-car-know-more', {"car-type": id});
                          window._satellite.track('saic-concept-car-know-more', {"car-type": id});
                        }
                    });
                }
            }
        });
    }    
} 

// tracking for message platform
var trackingWeChat = function(){
    var $cmp = $(".icon.aui-icon-system-wechat-large, .icon.aui-icon-system-wechat-small");
    $cmp.each(function(i, item){
        $(item).on("click", function(e){
            // AA tracking
            if(window._satellite){
              console.log('AA tracking >>>', 'saic-circle-wechat-share-click');
              window._satellite.track('saic-circle-wechat-share-click');
            }
        });
    });
}


var trackingWeibo = function(){
    var $cmp = $(".icon.aui-icon-system-weibo-small, .icon.aui-icon-system-weibo-large");
    $cmp.each(function(i, item){
        $(item).on("click", function(e){
            // AA tracking
            if(window._satellite){
              console.log('AA tracking >>>', 'saic-circle-weibo-share-click');
              window._satellite.track('saic-circle-weibo-share-click');
            }
        });
    });
}

trackingWeChat();
trackingConceptCar();
trackingWeibo();
/**!

 @license
 handlebars v4.7.7

Copyright (C) 2011-2019 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
!function(a,b){"object"==typeof exports&&"object"==typeof module?module.exports=b():"function"==typeof define&&define.amd?define([],b):"object"==typeof exports?exports.Handlebars=b():a.Handlebars=b()}(this,function(){return function(a){function b(d){if(c[d])return c[d].exports;var e=c[d]={exports:{},id:d,loaded:!1};return a[d].call(e.exports,e,e.exports,b),e.loaded=!0,e.exports}var c={};return b.m=a,b.c=c,b.p="",b(0)}([function(a,b,c){"use strict";function d(){var a=r();return a.compile=function(b,c){return k.compile(b,c,a)},a.precompile=function(b,c){return k.precompile(b,c,a)},a.AST=i["default"],a.Compiler=k.Compiler,a.JavaScriptCompiler=m["default"],a.Parser=j.parser,a.parse=j.parse,a.parseWithoutProcessing=j.parseWithoutProcessing,a}var e=c(1)["default"];b.__esModule=!0;var f=c(2),g=e(f),h=c(45),i=e(h),j=c(46),k=c(51),l=c(52),m=e(l),n=c(49),o=e(n),p=c(44),q=e(p),r=g["default"].create,s=d();s.create=d,q["default"](s),s.Visitor=o["default"],s["default"]=s,b["default"]=s,a.exports=b["default"]},function(a,b){"use strict";b["default"]=function(a){return a&&a.__esModule?a:{"default":a}},b.__esModule=!0},function(a,b,c){"use strict";function d(){var a=new h.HandlebarsEnvironment;return n.extend(a,h),a.SafeString=j["default"],a.Exception=l["default"],a.Utils=n,a.escapeExpression=n.escapeExpression,a.VM=p,a.template=function(b){return p.template(b,a)},a}var e=c(3)["default"],f=c(1)["default"];b.__esModule=!0;var g=c(4),h=e(g),i=c(37),j=f(i),k=c(6),l=f(k),m=c(5),n=e(m),o=c(38),p=e(o),q=c(44),r=f(q),s=d();s.create=d,r["default"](s),s["default"]=s,b["default"]=s,a.exports=b["default"]},function(a,b){"use strict";b["default"]=function(a){if(a&&a.__esModule)return a;var b={};if(null!=a)for(var c in a)Object.prototype.hasOwnProperty.call(a,c)&&(b[c]=a[c]);return b["default"]=a,b},b.__esModule=!0},function(a,b,c){"use strict";function d(a,b,c){this.helpers=a||{},this.partials=b||{},this.decorators=c||{},i.registerDefaultHelpers(this),j.registerDefaultDecorators(this)}var e=c(1)["default"];b.__esModule=!0,b.HandlebarsEnvironment=d;var f=c(5),g=c(6),h=e(g),i=c(10),j=c(30),k=c(32),l=e(k),m=c(33),n="4.7.7";b.VERSION=n;var o=8;b.COMPILER_REVISION=o;var p=7;b.LAST_COMPATIBLE_COMPILER_REVISION=p;var q={1:"<= 1.0.rc.2",2:"== 1.0.0-rc.3",3:"== 1.0.0-rc.4",4:"== 1.x.x",5:"== 2.0.0-alpha.x",6:">= 2.0.0-beta.1",7:">= 4.0.0 <4.3.0",8:">= 4.3.0"};b.REVISION_CHANGES=q;var r="[object Object]";d.prototype={constructor:d,logger:l["default"],log:l["default"].log,registerHelper:function(a,b){if(f.toString.call(a)===r){if(b)throw new h["default"]("Arg not supported with multiple helpers");f.extend(this.helpers,a)}else this.helpers[a]=b},unregisterHelper:function(a){delete this.helpers[a]},registerPartial:function(a,b){if(f.toString.call(a)===r)f.extend(this.partials,a);else{if("undefined"==typeof b)throw new h["default"]('Attempting to register a partial called "'+a+'" as undefined');this.partials[a]=b}},unregisterPartial:function(a){delete this.partials[a]},registerDecorator:function(a,b){if(f.toString.call(a)===r){if(b)throw new h["default"]("Arg not supported with multiple decorators");f.extend(this.decorators,a)}else this.decorators[a]=b},unregisterDecorator:function(a){delete this.decorators[a]},resetLoggedPropertyAccesses:function(){m.resetLoggedProperties()}};var s=l["default"].log;b.log=s,b.createFrame=f.createFrame,b.logger=l["default"]},function(a,b){"use strict";function c(a){return k[a]}function d(a){for(var b=1;b<arguments.length;b++)for(var c in arguments[b])Object.prototype.hasOwnProperty.call(arguments[b],c)&&(a[c]=arguments[b][c]);return a}function e(a,b){for(var c=0,d=a.length;c<d;c++)if(a[c]===b)return c;return-1}function f(a){if("string"!=typeof a){if(a&&a.toHTML)return a.toHTML();if(null==a)return"";if(!a)return a+"";a=""+a}return m.test(a)?a.replace(l,c):a}function g(a){return!a&&0!==a||!(!p(a)||0!==a.length)}function h(a){var b=d({},a);return b._parent=a,b}function i(a,b){return a.path=b,a}function j(a,b){return(a?a+".":"")+b}b.__esModule=!0,b.extend=d,b.indexOf=e,b.escapeExpression=f,b.isEmpty=g,b.createFrame=h,b.blockParams=i,b.appendContextPath=j;var k={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;","=":"&#x3D;"},l=/[&<>"'`=]/g,m=/[&<>"'`=]/,n=Object.prototype.toString;b.toString=n;var o=function(a){return"function"==typeof a};o(/x/)&&(b.isFunction=o=function(a){return"function"==typeof a&&"[object Function]"===n.call(a)}),b.isFunction=o;var p=Array.isArray||function(a){return!(!a||"object"!=typeof a)&&"[object Array]"===n.call(a)};b.isArray=p},function(a,b,c){"use strict";function d(a,b){var c=b&&b.loc,g=void 0,h=void 0,i=void 0,j=void 0;c&&(g=c.start.line,h=c.end.line,i=c.start.column,j=c.end.column,a+=" - "+g+":"+i);for(var k=Error.prototype.constructor.call(this,a),l=0;l<f.length;l++)this[f[l]]=k[f[l]];Error.captureStackTrace&&Error.captureStackTrace(this,d);try{c&&(this.lineNumber=g,this.endLineNumber=h,e?(Object.defineProperty(this,"column",{value:i,enumerable:!0}),Object.defineProperty(this,"endColumn",{value:j,enumerable:!0})):(this.column=i,this.endColumn=j))}catch(m){}}var e=c(7)["default"];b.__esModule=!0;var f=["description","fileName","lineNumber","endLineNumber","message","name","number","stack"];d.prototype=new Error,b["default"]=d,a.exports=b["default"]},function(a,b,c){a.exports={"default":c(8),__esModule:!0}},function(a,b,c){var d=c(9);a.exports=function(a,b,c){return d.setDesc(a,b,c)}},function(a,b){var c=Object;a.exports={create:c.create,getProto:c.getPrototypeOf,isEnum:{}.propertyIsEnumerable,getDesc:c.getOwnPropertyDescriptor,setDesc:c.defineProperty,setDescs:c.defineProperties,getKeys:c.keys,getNames:c.getOwnPropertyNames,getSymbols:c.getOwnPropertySymbols,each:[].forEach}},function(a,b,c){"use strict";function d(a){h["default"](a),j["default"](a),l["default"](a),n["default"](a),p["default"](a),r["default"](a),t["default"](a)}function e(a,b,c){a.helpers[b]&&(a.hooks[b]=a.helpers[b],c||delete a.helpers[b])}var f=c(1)["default"];b.__esModule=!0,b.registerDefaultHelpers=d,b.moveHelperToHooks=e;var g=c(11),h=f(g),i=c(12),j=f(i),k=c(25),l=f(k),m=c(26),n=f(m),o=c(27),p=f(o),q=c(28),r=f(q),s=c(29),t=f(s)},function(a,b,c){"use strict";b.__esModule=!0;var d=c(5);b["default"]=function(a){a.registerHelper("blockHelperMissing",function(b,c){var e=c.inverse,f=c.fn;if(b===!0)return f(this);if(b===!1||null==b)return e(this);if(d.isArray(b))return b.length>0?(c.ids&&(c.ids=[c.name]),a.helpers.each(b,c)):e(this);if(c.data&&c.ids){var g=d.createFrame(c.data);g.contextPath=d.appendContextPath(c.data.contextPath,c.name),c={data:g}}return f(b,c)})},a.exports=b["default"]},function(a,b,c){(function(d){"use strict";var e=c(13)["default"],f=c(1)["default"];b.__esModule=!0;var g=c(5),h=c(6),i=f(h);b["default"]=function(a){a.registerHelper("each",function(a,b){function c(b,c,d){l&&(l.key=b,l.index=c,l.first=0===c,l.last=!!d,m&&(l.contextPath=m+b)),k+=f(a[b],{data:l,blockParams:g.blockParams([a[b],b],[m+b,null])})}if(!b)throw new i["default"]("Must pass iterator to #each");var f=b.fn,h=b.inverse,j=0,k="",l=void 0,m=void 0;if(b.data&&b.ids&&(m=g.appendContextPath(b.data.contextPath,b.ids[0])+"."),g.isFunction(a)&&(a=a.call(this)),b.data&&(l=g.createFrame(b.data)),a&&"object"==typeof a)if(g.isArray(a))for(var n=a.length;j<n;j++)j in a&&c(j,j,j===a.length-1);else if(d.Symbol&&a[d.Symbol.iterator]){for(var o=[],p=a[d.Symbol.iterator](),q=p.next();!q.done;q=p.next())o.push(q.value);a=o;for(var n=a.length;j<n;j++)c(j,j,j===a.length-1)}else!function(){var b=void 0;e(a).forEach(function(a){void 0!==b&&c(b,j-1),b=a,j++}),void 0!==b&&c(b,j-1,!0)}();return 0===j&&(k=h(this)),k})},a.exports=b["default"]}).call(b,function(){return this}())},function(a,b,c){a.exports={"default":c(14),__esModule:!0}},function(a,b,c){c(15),a.exports=c(21).Object.keys},function(a,b,c){var d=c(16);c(18)("keys",function(a){return function(b){return a(d(b))}})},function(a,b,c){var d=c(17);a.exports=function(a){return Object(d(a))}},function(a,b){a.exports=function(a){if(void 0==a)throw TypeError("Can't call method on  "+a);return a}},function(a,b,c){var d=c(19),e=c(21),f=c(24);a.exports=function(a,b){var c=(e.Object||{})[a]||Object[a],g={};g[a]=b(c),d(d.S+d.F*f(function(){c(1)}),"Object",g)}},function(a,b,c){var d=c(20),e=c(21),f=c(22),g="prototype",h=function(a,b,c){var i,j,k,l=a&h.F,m=a&h.G,n=a&h.S,o=a&h.P,p=a&h.B,q=a&h.W,r=m?e:e[b]||(e[b]={}),s=m?d:n?d[b]:(d[b]||{})[g];m&&(c=b);for(i in c)j=!l&&s&&i in s,j&&i in r||(k=j?s[i]:c[i],r[i]=m&&"function"!=typeof s[i]?c[i]:p&&j?f(k,d):q&&s[i]==k?function(a){var b=function(b){return this instanceof a?new a(b):a(b)};return b[g]=a[g],b}(k):o&&"function"==typeof k?f(Function.call,k):k,o&&((r[g]||(r[g]={}))[i]=k))};h.F=1,h.G=2,h.S=4,h.P=8,h.B=16,h.W=32,a.exports=h},function(a,b){var c=a.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=c)},function(a,b){var c=a.exports={version:"1.2.6"};"number"==typeof __e&&(__e=c)},function(a,b,c){var d=c(23);a.exports=function(a,b,c){if(d(a),void 0===b)return a;switch(c){case 1:return function(c){return a.call(b,c)};case 2:return function(c,d){return a.call(b,c,d)};case 3:return function(c,d,e){return a.call(b,c,d,e)}}return function(){return a.apply(b,arguments)}}},function(a,b){a.exports=function(a){if("function"!=typeof a)throw TypeError(a+" is not a function!");return a}},function(a,b){a.exports=function(a){try{return!!a()}catch(b){return!0}}},function(a,b,c){"use strict";var d=c(1)["default"];b.__esModule=!0;var e=c(6),f=d(e);b["default"]=function(a){a.registerHelper("helperMissing",function(){if(1!==arguments.length)throw new f["default"]('Missing helper: "'+arguments[arguments.length-1].name+'"')})},a.exports=b["default"]},function(a,b,c){"use strict";var d=c(1)["default"];b.__esModule=!0;var e=c(5),f=c(6),g=d(f);b["default"]=function(a){a.registerHelper("if",function(a,b){if(2!=arguments.length)throw new g["default"]("#if requires exactly one argument");return e.isFunction(a)&&(a=a.call(this)),!b.hash.includeZero&&!a||e.isEmpty(a)?b.inverse(this):b.fn(this)}),a.registerHelper("unless",function(b,c){if(2!=arguments.length)throw new g["default"]("#unless requires exactly one argument");return a.helpers["if"].call(this,b,{fn:c.inverse,inverse:c.fn,hash:c.hash})})},a.exports=b["default"]},function(a,b){"use strict";b.__esModule=!0,b["default"]=function(a){a.registerHelper("log",function(){for(var b=[void 0],c=arguments[arguments.length-1],d=0;d<arguments.length-1;d++)b.push(arguments[d]);var e=1;null!=c.hash.level?e=c.hash.level:c.data&&null!=c.data.level&&(e=c.data.level),b[0]=e,a.log.apply(a,b)})},a.exports=b["default"]},function(a,b){"use strict";b.__esModule=!0,b["default"]=function(a){a.registerHelper("lookup",function(a,b,c){return a?c.lookupProperty(a,b):a})},a.exports=b["default"]},function(a,b,c){"use strict";var d=c(1)["default"];b.__esModule=!0;var e=c(5),f=c(6),g=d(f);b["default"]=function(a){a.registerHelper("with",function(a,b){if(2!=arguments.length)throw new g["default"]("#with requires exactly one argument");e.isFunction(a)&&(a=a.call(this));var c=b.fn;if(e.isEmpty(a))return b.inverse(this);var d=b.data;return b.data&&b.ids&&(d=e.createFrame(b.data),d.contextPath=e.appendContextPath(b.data.contextPath,b.ids[0])),c(a,{data:d,blockParams:e.blockParams([a],[d&&d.contextPath])})})},a.exports=b["default"]},function(a,b,c){"use strict";function d(a){g["default"](a)}var e=c(1)["default"];b.__esModule=!0,b.registerDefaultDecorators=d;var f=c(31),g=e(f)},function(a,b,c){"use strict";b.__esModule=!0;var d=c(5);b["default"]=function(a){a.registerDecorator("inline",function(a,b,c,e){var f=a;return b.partials||(b.partials={},f=function(e,f){var g=c.partials;c.partials=d.extend({},g,b.partials);var h=a(e,f);return c.partials=g,h}),b.partials[e.args[0]]=e.fn,f})},a.exports=b["default"]},function(a,b,c){"use strict";b.__esModule=!0;var d=c(5),e={methodMap:["debug","info","warn","error"],level:"info",lookupLevel:function(a){if("string"==typeof a){var b=d.indexOf(e.methodMap,a.toLowerCase());a=b>=0?b:parseInt(a,10)}return a},log:function(a){if(a=e.lookupLevel(a),"undefined"!=typeof console&&e.lookupLevel(e.level)<=a){var b=e.methodMap[a];console[b]||(b="log");for(var c=arguments.length,d=Array(c>1?c-1:0),f=1;f<c;f++)d[f-1]=arguments[f];console[b].apply(console,d)}}};b["default"]=e,a.exports=b["default"]},function(a,b,c){"use strict";function d(a){var b=i(null);b.constructor=!1,b.__defineGetter__=!1,b.__defineSetter__=!1,b.__lookupGetter__=!1;var c=i(null);return c.__proto__=!1,{properties:{whitelist:l.createNewLookupObject(c,a.allowedProtoProperties),defaultValue:a.allowProtoPropertiesByDefault},methods:{whitelist:l.createNewLookupObject(b,a.allowedProtoMethods),defaultValue:a.allowProtoMethodsByDefault}}}function e(a,b,c){return"function"==typeof a?f(b.methods,c):f(b.properties,c)}function f(a,b){return void 0!==a.whitelist[b]?a.whitelist[b]===!0:void 0!==a.defaultValue?a.defaultValue:(g(b),!1)}function g(a){o[a]!==!0&&(o[a]=!0,n.log("error",'Handlebars: Access has been denied to resolve the property "'+a+'" because it is not an "own property" of its parent.\nYou can add a runtime option to disable the check or this warning:\nSee https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access for details'))}function h(){j(o).forEach(function(a){delete o[a]})}var i=c(34)["default"],j=c(13)["default"],k=c(3)["default"];b.__esModule=!0,b.createProtoAccessControl=d,b.resultIsAllowed=e,b.resetLoggedProperties=h;var l=c(36),m=c(32),n=k(m),o=i(null)},function(a,b,c){a.exports={"default":c(35),__esModule:!0}},function(a,b,c){var d=c(9);a.exports=function(a,b){return d.create(a,b)}},function(a,b,c){"use strict";function d(){for(var a=arguments.length,b=Array(a),c=0;c<a;c++)b[c]=arguments[c];return f.extend.apply(void 0,[e(null)].concat(b))}var e=c(34)["default"];b.__esModule=!0,b.createNewLookupObject=d;var f=c(5)},function(a,b){"use strict";function c(a){this.string=a}b.__esModule=!0,c.prototype.toString=c.prototype.toHTML=function(){return""+this.string},b["default"]=c,a.exports=b["default"]},function(a,b,c){"use strict";function d(a){var b=a&&a[0]||1,c=v.COMPILER_REVISION;if(!(b>=v.LAST_COMPATIBLE_COMPILER_REVISION&&b<=v.COMPILER_REVISION)){if(b<v.LAST_COMPATIBLE_COMPILER_REVISION){var d=v.REVISION_CHANGES[c],e=v.REVISION_CHANGES[b];throw new u["default"]("Template was precompiled with an older version of Handlebars than the current runtime. Please update your precompiler to a newer version ("+d+") or downgrade your runtime to an older version ("+e+").")}throw new u["default"]("Template was precompiled with a newer version of Handlebars than the current runtime. Please update your runtime to a newer version ("+a[1]+").")}}function e(a,b){function c(c,d,e){e.hash&&(d=s.extend({},d,e.hash),e.ids&&(e.ids[0]=!0)),c=b.VM.resolvePartial.call(this,c,d,e);var f=s.extend({},e,{hooks:this.hooks,protoAccessControl:this.protoAccessControl}),g=b.VM.invokePartial.call(this,c,d,f);if(null==g&&b.compile&&(e.partials[e.name]=b.compile(c,a.compilerOptions,b),g=e.partials[e.name](d,f)),null!=g){if(e.indent){for(var h=g.split("\n"),i=0,j=h.length;i<j&&(h[i]||i+1!==j);i++)h[i]=e.indent+h[i];g=h.join("\n")}return g}throw new u["default"]("The partial "+e.name+" could not be compiled when running in runtime-only mode")}function d(b){function c(b){return""+a.main(g,b,g.helpers,g.partials,f,i,h)}var e=arguments.length<=1||void 0===arguments[1]?{}:arguments[1],f=e.data;d._setup(e),!e.partial&&a.useData&&(f=j(b,f));var h=void 0,i=a.useBlockParams?[]:void 0;return a.useDepths&&(h=e.depths?b!=e.depths[0]?[b].concat(e.depths):e.depths:[b]),(c=k(a.main,c,g,e.depths||[],f,i))(b,e)}if(!b)throw new u["default"]("No environment passed to template");if(!a||!a.main)throw new u["default"]("Unknown template object: "+typeof a);a.main.decorator=a.main_d,b.VM.checkRevision(a.compiler);var e=a.compiler&&7===a.compiler[0],g={strict:function(a,b,c){if(!(a&&b in a))throw new u["default"]('"'+b+'" not defined in '+a,{loc:c});return g.lookupProperty(a,b)},lookupProperty:function(a,b){var c=a[b];return null==c?c:Object.prototype.hasOwnProperty.call(a,b)?c:y.resultIsAllowed(c,g.protoAccessControl,b)?c:void 0},lookup:function(a,b){for(var c=a.length,d=0;d<c;d++){var e=a[d]&&g.lookupProperty(a[d],b);if(null!=e)return a[d][b]}},lambda:function(a,b){return"function"==typeof a?a.call(b):a},escapeExpression:s.escapeExpression,invokePartial:c,fn:function(b){var c=a[b];return c.decorator=a[b+"_d"],c},programs:[],program:function(a,b,c,d,e){var g=this.programs[a],h=this.fn(a);return b||e||d||c?g=f(this,a,h,b,c,d,e):g||(g=this.programs[a]=f(this,a,h)),g},data:function(a,b){for(;a&&b--;)a=a._parent;return a},mergeIfNeeded:function(a,b){var c=a||b;return a&&b&&a!==b&&(c=s.extend({},b,a)),c},nullContext:n({}),noop:b.VM.noop,compilerInfo:a.compiler};return d.isTop=!0,d._setup=function(c){if(c.partial)g.protoAccessControl=c.protoAccessControl,g.helpers=c.helpers,g.partials=c.partials,g.decorators=c.decorators,g.hooks=c.hooks;else{var d=s.extend({},b.helpers,c.helpers);l(d,g),g.helpers=d,a.usePartial&&(g.partials=g.mergeIfNeeded(c.partials,b.partials)),(a.usePartial||a.useDecorators)&&(g.decorators=s.extend({},b.decorators,c.decorators)),g.hooks={},g.protoAccessControl=y.createProtoAccessControl(c);var f=c.allowCallsToHelperMissing||e;w.moveHelperToHooks(g,"helperMissing",f),w.moveHelperToHooks(g,"blockHelperMissing",f)}},d._child=function(b,c,d,e){if(a.useBlockParams&&!d)throw new u["default"]("must pass block params");if(a.useDepths&&!e)throw new u["default"]("must pass parent depths");return f(g,b,a[b],c,0,d,e)},d}function f(a,b,c,d,e,f,g){function h(b){var e=arguments.length<=1||void 0===arguments[1]?{}:arguments[1],h=g;return!g||b==g[0]||b===a.nullContext&&null===g[0]||(h=[b].concat(g)),c(a,b,a.helpers,a.partials,e.data||d,f&&[e.blockParams].concat(f),h)}return h=k(c,h,a,g,d,f),h.program=b,h.depth=g?g.length:0,h.blockParams=e||0,h}function g(a,b,c){return a?a.call||c.name||(c.name=a,a=c.partials[a]):a="@partial-block"===c.name?c.data["partial-block"]:c.partials[c.name],a}function h(a,b,c){var d=c.data&&c.data["partial-block"];c.partial=!0,c.ids&&(c.data.contextPath=c.ids[0]||c.data.contextPath);var e=void 0;if(c.fn&&c.fn!==i&&!function(){c.data=v.createFrame(c.data);var a=c.fn;e=c.data["partial-block"]=function(b){var c=arguments.length<=1||void 0===arguments[1]?{}:arguments[1];return c.data=v.createFrame(c.data),c.data["partial-block"]=d,a(b,c)},a.partials&&(c.partials=s.extend({},c.partials,a.partials))}(),void 0===a&&e&&(a=e),void 0===a)throw new u["default"]("The partial "+c.name+" could not be found");if(a instanceof Function)return a(b,c)}function i(){return""}function j(a,b){return b&&"root"in b||(b=b?v.createFrame(b):{},b.root=a),b}function k(a,b,c,d,e,f){if(a.decorator){var g={};b=a.decorator(b,g,c,d&&d[0],e,f,d),s.extend(b,g)}return b}function l(a,b){o(a).forEach(function(c){var d=a[c];a[c]=m(d,b)})}function m(a,b){var c=b.lookupProperty;return x.wrapHelper(a,function(a){return s.extend({lookupProperty:c},a)})}var n=c(39)["default"],o=c(13)["default"],p=c(3)["default"],q=c(1)["default"];b.__esModule=!0,b.checkRevision=d,b.template=e,b.wrapProgram=f,b.resolvePartial=g,b.invokePartial=h,b.noop=i;var r=c(5),s=p(r),t=c(6),u=q(t),v=c(4),w=c(10),x=c(43),y=c(33)},function(a,b,c){a.exports={"default":c(40),__esModule:!0}},function(a,b,c){c(41),a.exports=c(21).Object.seal},function(a,b,c){var d=c(42);c(18)("seal",function(a){return function(b){return a&&d(b)?a(b):b}})},function(a,b){a.exports=function(a){return"object"==typeof a?null!==a:"function"==typeof a}},function(a,b){"use strict";function c(a,b){if("function"!=typeof a)return a;var c=function(){var c=arguments[arguments.length-1];return arguments[arguments.length-1]=b(c),a.apply(this,arguments)};return c}b.__esModule=!0,b.wrapHelper=c},function(a,b){(function(c){"use strict";b.__esModule=!0,b["default"]=function(a){var b="undefined"!=typeof c?c:window,d=b.Handlebars;a.noConflict=function(){return b.Handlebars===a&&(b.Handlebars=d),a}},a.exports=b["default"]}).call(b,function(){return this}())},function(a,b){"use strict";b.__esModule=!0;var c={helpers:{helperExpression:function(a){return"SubExpression"===a.type||("MustacheStatement"===a.type||"BlockStatement"===a.type)&&!!(a.params&&a.params.length||a.hash)},scopedId:function(a){return/^\.|this\b/.test(a.original)},simpleId:function(a){return 1===a.parts.length&&!c.helpers.scopedId(a)&&!a.depth}}};b["default"]=c,a.exports=b["default"]},function(a,b,c){"use strict";function d(a,b){if("Program"===a.type)return a;i["default"].yy=o,o.locInfo=function(a){return new o.SourceLocation(b&&b.srcName,a)};var c=i["default"].parse(a);return c}function e(a,b){var c=d(a,b),e=new k["default"](b);return e.accept(c)}var f=c(1)["default"],g=c(3)["default"];b.__esModule=!0,b.parseWithoutProcessing=d,b.parse=e;var h=c(47),i=f(h),j=c(48),k=f(j),l=c(50),m=g(l),n=c(5);b.parser=i["default"];var o={};n.extend(o,m)},function(a,b){"use strict";b.__esModule=!0;var c=function(){function a(){this.yy={}}var b={trace:function(){},yy:{},symbols_:{error:2,root:3,program:4,EOF:5,program_repetition0:6,statement:7,mustache:8,block:9,rawBlock:10,partial:11,partialBlock:12,content:13,COMMENT:14,CONTENT:15,openRawBlock:16,rawBlock_repetition0:17,END_RAW_BLOCK:18,OPEN_RAW_BLOCK:19,helperName:20,openRawBlock_repetition0:21,openRawBlock_option0:22,CLOSE_RAW_BLOCK:23,openBlock:24,block_option0:25,closeBlock:26,openInverse:27,block_option1:28,OPEN_BLOCK:29,openBlock_repetition0:30,openBlock_option0:31,openBlock_option1:32,CLOSE:33,OPEN_INVERSE:34,openInverse_repetition0:35,openInverse_option0:36,openInverse_option1:37,openInverseChain:38,OPEN_INVERSE_CHAIN:39,openInverseChain_repetition0:40,openInverseChain_option0:41,openInverseChain_option1:42,inverseAndProgram:43,INVERSE:44,inverseChain:45,inverseChain_option0:46,OPEN_ENDBLOCK:47,OPEN:48,mustache_repetition0:49,mustache_option0:50,OPEN_UNESCAPED:51,mustache_repetition1:52,mustache_option1:53,CLOSE_UNESCAPED:54,OPEN_PARTIAL:55,partialName:56,partial_repetition0:57,partial_option0:58,openPartialBlock:59,OPEN_PARTIAL_BLOCK:60,openPartialBlock_repetition0:61,openPartialBlock_option0:62,param:63,sexpr:64,OPEN_SEXPR:65,sexpr_repetition0:66,sexpr_option0:67,CLOSE_SEXPR:68,hash:69,hash_repetition_plus0:70,hashSegment:71,ID:72,EQUALS:73,blockParams:74,OPEN_BLOCK_PARAMS:75,blockParams_repetition_plus0:76,CLOSE_BLOCK_PARAMS:77,path:78,dataName:79,STRING:80,NUMBER:81,BOOLEAN:82,UNDEFINED:83,NULL:84,DATA:85,pathSegments:86,SEP:87,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",14:"COMMENT",15:"CONTENT",18:"END_RAW_BLOCK",19:"OPEN_RAW_BLOCK",23:"CLOSE_RAW_BLOCK",29:"OPEN_BLOCK",33:"CLOSE",34:"OPEN_INVERSE",39:"OPEN_INVERSE_CHAIN",44:"INVERSE",47:"OPEN_ENDBLOCK",48:"OPEN",51:"OPEN_UNESCAPED",54:"CLOSE_UNESCAPED",55:"OPEN_PARTIAL",60:"OPEN_PARTIAL_BLOCK",65:"OPEN_SEXPR",68:"CLOSE_SEXPR",72:"ID",73:"EQUALS",75:"OPEN_BLOCK_PARAMS",77:"CLOSE_BLOCK_PARAMS",80:"STRING",81:"NUMBER",82:"BOOLEAN",83:"UNDEFINED",84:"NULL",85:"DATA",87:"SEP"},productions_:[0,[3,2],[4,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[13,1],[10,3],[16,5],[9,4],[9,4],[24,6],[27,6],[38,6],[43,2],[45,3],[45,1],[26,3],[8,5],[8,5],[11,5],[12,3],[59,5],[63,1],[63,1],[64,5],[69,1],[71,3],[74,3],[20,1],[20,1],[20,1],[20,1],[20,1],[20,1],[20,1],[56,1],[56,1],[79,2],[78,1],[86,3],[86,1],[6,0],[6,2],[17,0],[17,2],[21,0],[21,2],[22,0],[22,1],[25,0],[25,1],[28,0],[28,1],[30,0],[30,2],[31,0],[31,1],[32,0],[32,1],[35,0],[35,2],[36,0],[36,1],[37,0],[37,1],[40,0],[40,2],[41,0],[41,1],[42,0],[42,1],[46,0],[46,1],[49,0],[49,2],[50,0],[50,1],[52,0],[52,2],[53,0],[53,1],[57,0],[57,2],[58,0],[58,1],[61,0],[61,2],[62,0],[62,1],[66,0],[66,2],[67,0],[67,1],[70,1],[70,2],[76,1],[76,2]],performAction:function(a,b,c,d,e,f,g){var h=f.length-1;switch(e){case 1:return f[h-1];case 2:this.$=d.prepareProgram(f[h]);break;case 3:this.$=f[h];break;case 4:this.$=f[h];break;case 5:this.$=f[h];break;case 6:this.$=f[h];break;case 7:this.$=f[h];break;case 8:this.$=f[h];break;case 9:this.$={type:"CommentStatement",value:d.stripComment(f[h]),strip:d.stripFlags(f[h],f[h]),loc:d.locInfo(this._$)};break;case 10:this.$={type:"ContentStatement",original:f[h],value:f[h],loc:d.locInfo(this._$)};break;case 11:this.$=d.prepareRawBlock(f[h-2],f[h-1],f[h],this._$);break;case 12:this.$={path:f[h-3],params:f[h-2],hash:f[h-1]};break;case 13:this.$=d.prepareBlock(f[h-3],f[h-2],f[h-1],f[h],!1,this._$);break;case 14:this.$=d.prepareBlock(f[h-3],f[h-2],f[h-1],f[h],!0,this._$);break;case 15:this.$={open:f[h-5],path:f[h-4],params:f[h-3],hash:f[h-2],blockParams:f[h-1],strip:d.stripFlags(f[h-5],f[h])};break;case 16:this.$={path:f[h-4],params:f[h-3],hash:f[h-2],blockParams:f[h-1],strip:d.stripFlags(f[h-5],f[h])};break;case 17:this.$={path:f[h-4],params:f[h-3],hash:f[h-2],blockParams:f[h-1],strip:d.stripFlags(f[h-5],f[h])};break;case 18:this.$={strip:d.stripFlags(f[h-1],f[h-1]),program:f[h]};break;case 19:var i=d.prepareBlock(f[h-2],f[h-1],f[h],f[h],!1,this._$),j=d.prepareProgram([i],f[h-1].loc);j.chained=!0,this.$={strip:f[h-2].strip,program:j,chain:!0};break;case 20:this.$=f[h];break;case 21:this.$={path:f[h-1],strip:d.stripFlags(f[h-2],f[h])};break;case 22:this.$=d.prepareMustache(f[h-3],f[h-2],f[h-1],f[h-4],d.stripFlags(f[h-4],f[h]),this._$);break;case 23:this.$=d.prepareMustache(f[h-3],f[h-2],f[h-1],f[h-4],d.stripFlags(f[h-4],f[h]),this._$);break;case 24:this.$={type:"PartialStatement",name:f[h-3],params:f[h-2],hash:f[h-1],indent:"",strip:d.stripFlags(f[h-4],f[h]),loc:d.locInfo(this._$)};break;case 25:this.$=d.preparePartialBlock(f[h-2],f[h-1],f[h],this._$);break;case 26:this.$={path:f[h-3],params:f[h-2],hash:f[h-1],strip:d.stripFlags(f[h-4],f[h])};break;case 27:this.$=f[h];break;case 28:this.$=f[h];break;case 29:this.$={type:"SubExpression",path:f[h-3],params:f[h-2],hash:f[h-1],loc:d.locInfo(this._$)};break;case 30:this.$={type:"Hash",pairs:f[h],loc:d.locInfo(this._$)};break;case 31:this.$={type:"HashPair",key:d.id(f[h-2]),value:f[h],loc:d.locInfo(this._$)};break;case 32:this.$=d.id(f[h-1]);break;case 33:this.$=f[h];break;case 34:this.$=f[h];break;case 35:this.$={type:"StringLiteral",value:f[h],original:f[h],loc:d.locInfo(this._$)};break;case 36:this.$={type:"NumberLiteral",value:Number(f[h]),original:Number(f[h]),loc:d.locInfo(this._$)};break;case 37:this.$={type:"BooleanLiteral",value:"true"===f[h],original:"true"===f[h],loc:d.locInfo(this._$)};break;case 38:this.$={type:"UndefinedLiteral",original:void 0,value:void 0,loc:d.locInfo(this._$)};break;case 39:this.$={type:"NullLiteral",original:null,value:null,loc:d.locInfo(this._$)};break;case 40:this.$=f[h];break;case 41:this.$=f[h];break;case 42:this.$=d.preparePath(!0,f[h],this._$);break;case 43:this.$=d.preparePath(!1,f[h],this._$);break;case 44:f[h-2].push({part:d.id(f[h]),original:f[h],separator:f[h-1]}),this.$=f[h-2];break;case 45:this.$=[{part:d.id(f[h]),original:f[h]}];break;case 46:this.$=[];break;case 47:f[h-1].push(f[h]);break;case 48:this.$=[];break;case 49:f[h-1].push(f[h]);break;case 50:this.$=[];break;case 51:f[h-1].push(f[h]);break;case 58:this.$=[];break;case 59:f[h-1].push(f[h]);break;case 64:this.$=[];break;case 65:f[h-1].push(f[h]);break;case 70:this.$=[];break;case 71:f[h-1].push(f[h]);break;case 78:this.$=[];break;case 79:f[h-1].push(f[h]);break;case 82:this.$=[];break;case 83:f[h-1].push(f[h]);break;case 86:this.$=[];break;case 87:f[h-1].push(f[h]);break;case 90:this.$=[];break;case 91:f[h-1].push(f[h]);break;case 94:this.$=[];break;case 95:f[h-1].push(f[h]);break;case 98:this.$=[f[h]];break;case 99:f[h-1].push(f[h]);break;case 100:this.$=[f[h]];break;case 101:f[h-1].push(f[h])}},table:[{3:1,4:2,5:[2,46],6:3,14:[2,46],15:[2,46],19:[2,46],29:[2,46],34:[2,46],48:[2,46],51:[2,46],55:[2,46],60:[2,46]},{1:[3]},{5:[1,4]},{5:[2,2],7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:[1,12],15:[1,20],16:17,19:[1,23],24:15,27:16,29:[1,21],34:[1,22],39:[2,2],44:[2,2],47:[2,2],48:[1,13],51:[1,14],55:[1,18],59:19,60:[1,24]},{1:[2,1]},{5:[2,47],14:[2,47],15:[2,47],19:[2,47],29:[2,47],34:[2,47],39:[2,47],44:[2,47],47:[2,47],48:[2,47],51:[2,47],55:[2,47],60:[2,47]},{5:[2,3],14:[2,3],15:[2,3],19:[2,3],29:[2,3],34:[2,3],39:[2,3],44:[2,3],47:[2,3],48:[2,3],51:[2,3],55:[2,3],60:[2,3]},{5:[2,4],14:[2,4],15:[2,4],19:[2,4],29:[2,4],34:[2,4],39:[2,4],44:[2,4],47:[2,4],48:[2,4],51:[2,4],55:[2,4],60:[2,4]},{5:[2,5],14:[2,5],15:[2,5],19:[2,5],29:[2,5],34:[2,5],39:[2,5],44:[2,5],47:[2,5],48:[2,5],51:[2,5],55:[2,5],60:[2,5]},{5:[2,6],14:[2,6],15:[2,6],19:[2,6],29:[2,6],34:[2,6],39:[2,6],44:[2,6],47:[2,6],48:[2,6],51:[2,6],55:[2,6],60:[2,6]},{5:[2,7],14:[2,7],15:[2,7],19:[2,7],29:[2,7],34:[2,7],39:[2,7],44:[2,7],47:[2,7],48:[2,7],51:[2,7],55:[2,7],60:[2,7]},{5:[2,8],14:[2,8],15:[2,8],19:[2,8],29:[2,8],34:[2,8],39:[2,8],44:[2,8],47:[2,8],48:[2,8],51:[2,8],55:[2,8],60:[2,8]},{5:[2,9],14:[2,9],15:[2,9],19:[2,9],29:[2,9],34:[2,9],39:[2,9],44:[2,9],47:[2,9],48:[2,9],51:[2,9],55:[2,9],60:[2,9]},{20:25,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:36,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{4:37,6:3,14:[2,46],15:[2,46],19:[2,46],29:[2,46],34:[2,46],39:[2,46],44:[2,46],47:[2,46],48:[2,46],51:[2,46],55:[2,46],60:[2,46]},{4:38,6:3,14:[2,46],15:[2,46],19:[2,46],29:[2,46],34:[2,46],44:[2,46],47:[2,46],48:[2,46],51:[2,46],55:[2,46],60:[2,46]},{15:[2,48],17:39,18:[2,48]},{20:41,56:40,64:42,65:[1,43],72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{4:44,6:3,14:[2,46],15:[2,46],19:[2,46],29:[2,46],34:[2,46],47:[2,46],48:[2,46],51:[2,46],55:[2,46],60:[2,46]},{5:[2,10],14:[2,10],15:[2,10],18:[2,10],19:[2,10],29:[2,10],34:[2,10],39:[2,10],44:[2,10],47:[2,10],48:[2,10],51:[2,10],55:[2,10],60:[2,10]},{20:45,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:46,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:47,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:41,56:48,64:42,65:[1,43],72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{33:[2,78],49:49,65:[2,78],72:[2,78],80:[2,78],81:[2,78],82:[2,78],83:[2,78],84:[2,78],85:[2,78]},{23:[2,33],33:[2,33],54:[2,33],65:[2,33],68:[2,33],72:[2,33],75:[2,33],80:[2,33],81:[2,33],82:[2,33],83:[2,33],84:[2,33],85:[2,33]},{23:[2,34],33:[2,34],54:[2,34],65:[2,34],68:[2,34],72:[2,34],75:[2,34],80:[2,34],81:[2,34],82:[2,34],83:[2,34],84:[2,34],85:[2,34]},{23:[2,35],33:[2,35],54:[2,35],65:[2,35],68:[2,35],72:[2,35],75:[2,35],80:[2,35],81:[2,35],82:[2,35],83:[2,35],84:[2,35],85:[2,35]},{23:[2,36],33:[2,36],54:[2,36],65:[2,36],68:[2,36],72:[2,36],75:[2,36],80:[2,36],81:[2,36],82:[2,36],83:[2,36],84:[2,36],85:[2,36]},{23:[2,37],33:[2,37],54:[2,37],65:[2,37],68:[2,37],72:[2,37],75:[2,37],80:[2,37],81:[2,37],82:[2,37],83:[2,37],84:[2,37],85:[2,37]},{23:[2,38],33:[2,38],54:[2,38],65:[2,38],68:[2,38],72:[2,38],75:[2,38],80:[2,38],81:[2,38],82:[2,38],83:[2,38],84:[2,38],85:[2,38]},{23:[2,39],33:[2,39],54:[2,39],65:[2,39],68:[2,39],72:[2,39],75:[2,39],80:[2,39],81:[2,39],82:[2,39],83:[2,39],84:[2,39],85:[2,39]},{23:[2,43],33:[2,43],54:[2,43],65:[2,43],68:[2,43],72:[2,43],75:[2,43],80:[2,43],81:[2,43],82:[2,43],83:[2,43],84:[2,43],85:[2,43],87:[1,50]},{72:[1,35],86:51},{23:[2,45],33:[2,45],54:[2,45],65:[2,45],68:[2,45],72:[2,45],75:[2,45],80:[2,45],81:[2,45],82:[2,45],83:[2,45],84:[2,45],85:[2,45],87:[2,45]},{52:52,54:[2,82],65:[2,82],72:[2,82],80:[2,82],81:[2,82],82:[2,82],83:[2,82],84:[2,82],85:[2,82]},{25:53,38:55,39:[1,57],43:56,44:[1,58],45:54,47:[2,54]},{28:59,43:60,44:[1,58],47:[2,56]},{13:62,15:[1,20],18:[1,61]},{33:[2,86],57:63,65:[2,86],72:[2,86],80:[2,86],81:[2,86],82:[2,86],83:[2,86],84:[2,86],85:[2,86]},{33:[2,40],65:[2,40],72:[2,40],80:[2,40],81:[2,40],82:[2,40],83:[2,40],84:[2,40],85:[2,40]},{
33:[2,41],65:[2,41],72:[2,41],80:[2,41],81:[2,41],82:[2,41],83:[2,41],84:[2,41],85:[2,41]},{20:64,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{26:65,47:[1,66]},{30:67,33:[2,58],65:[2,58],72:[2,58],75:[2,58],80:[2,58],81:[2,58],82:[2,58],83:[2,58],84:[2,58],85:[2,58]},{33:[2,64],35:68,65:[2,64],72:[2,64],75:[2,64],80:[2,64],81:[2,64],82:[2,64],83:[2,64],84:[2,64],85:[2,64]},{21:69,23:[2,50],65:[2,50],72:[2,50],80:[2,50],81:[2,50],82:[2,50],83:[2,50],84:[2,50],85:[2,50]},{33:[2,90],61:70,65:[2,90],72:[2,90],80:[2,90],81:[2,90],82:[2,90],83:[2,90],84:[2,90],85:[2,90]},{20:74,33:[2,80],50:71,63:72,64:75,65:[1,43],69:73,70:76,71:77,72:[1,78],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{72:[1,79]},{23:[2,42],33:[2,42],54:[2,42],65:[2,42],68:[2,42],72:[2,42],75:[2,42],80:[2,42],81:[2,42],82:[2,42],83:[2,42],84:[2,42],85:[2,42],87:[1,50]},{20:74,53:80,54:[2,84],63:81,64:75,65:[1,43],69:82,70:76,71:77,72:[1,78],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{26:83,47:[1,66]},{47:[2,55]},{4:84,6:3,14:[2,46],15:[2,46],19:[2,46],29:[2,46],34:[2,46],39:[2,46],44:[2,46],47:[2,46],48:[2,46],51:[2,46],55:[2,46],60:[2,46]},{47:[2,20]},{20:85,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{4:86,6:3,14:[2,46],15:[2,46],19:[2,46],29:[2,46],34:[2,46],47:[2,46],48:[2,46],51:[2,46],55:[2,46],60:[2,46]},{26:87,47:[1,66]},{47:[2,57]},{5:[2,11],14:[2,11],15:[2,11],19:[2,11],29:[2,11],34:[2,11],39:[2,11],44:[2,11],47:[2,11],48:[2,11],51:[2,11],55:[2,11],60:[2,11]},{15:[2,49],18:[2,49]},{20:74,33:[2,88],58:88,63:89,64:75,65:[1,43],69:90,70:76,71:77,72:[1,78],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{65:[2,94],66:91,68:[2,94],72:[2,94],80:[2,94],81:[2,94],82:[2,94],83:[2,94],84:[2,94],85:[2,94]},{5:[2,25],14:[2,25],15:[2,25],19:[2,25],29:[2,25],34:[2,25],39:[2,25],44:[2,25],47:[2,25],48:[2,25],51:[2,25],55:[2,25],60:[2,25]},{20:92,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:74,31:93,33:[2,60],63:94,64:75,65:[1,43],69:95,70:76,71:77,72:[1,78],75:[2,60],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:74,33:[2,66],36:96,63:97,64:75,65:[1,43],69:98,70:76,71:77,72:[1,78],75:[2,66],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:74,22:99,23:[2,52],63:100,64:75,65:[1,43],69:101,70:76,71:77,72:[1,78],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:74,33:[2,92],62:102,63:103,64:75,65:[1,43],69:104,70:76,71:77,72:[1,78],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{33:[1,105]},{33:[2,79],65:[2,79],72:[2,79],80:[2,79],81:[2,79],82:[2,79],83:[2,79],84:[2,79],85:[2,79]},{33:[2,81]},{23:[2,27],33:[2,27],54:[2,27],65:[2,27],68:[2,27],72:[2,27],75:[2,27],80:[2,27],81:[2,27],82:[2,27],83:[2,27],84:[2,27],85:[2,27]},{23:[2,28],33:[2,28],54:[2,28],65:[2,28],68:[2,28],72:[2,28],75:[2,28],80:[2,28],81:[2,28],82:[2,28],83:[2,28],84:[2,28],85:[2,28]},{23:[2,30],33:[2,30],54:[2,30],68:[2,30],71:106,72:[1,107],75:[2,30]},{23:[2,98],33:[2,98],54:[2,98],68:[2,98],72:[2,98],75:[2,98]},{23:[2,45],33:[2,45],54:[2,45],65:[2,45],68:[2,45],72:[2,45],73:[1,108],75:[2,45],80:[2,45],81:[2,45],82:[2,45],83:[2,45],84:[2,45],85:[2,45],87:[2,45]},{23:[2,44],33:[2,44],54:[2,44],65:[2,44],68:[2,44],72:[2,44],75:[2,44],80:[2,44],81:[2,44],82:[2,44],83:[2,44],84:[2,44],85:[2,44],87:[2,44]},{54:[1,109]},{54:[2,83],65:[2,83],72:[2,83],80:[2,83],81:[2,83],82:[2,83],83:[2,83],84:[2,83],85:[2,83]},{54:[2,85]},{5:[2,13],14:[2,13],15:[2,13],19:[2,13],29:[2,13],34:[2,13],39:[2,13],44:[2,13],47:[2,13],48:[2,13],51:[2,13],55:[2,13],60:[2,13]},{38:55,39:[1,57],43:56,44:[1,58],45:111,46:110,47:[2,76]},{33:[2,70],40:112,65:[2,70],72:[2,70],75:[2,70],80:[2,70],81:[2,70],82:[2,70],83:[2,70],84:[2,70],85:[2,70]},{47:[2,18]},{5:[2,14],14:[2,14],15:[2,14],19:[2,14],29:[2,14],34:[2,14],39:[2,14],44:[2,14],47:[2,14],48:[2,14],51:[2,14],55:[2,14],60:[2,14]},{33:[1,113]},{33:[2,87],65:[2,87],72:[2,87],80:[2,87],81:[2,87],82:[2,87],83:[2,87],84:[2,87],85:[2,87]},{33:[2,89]},{20:74,63:115,64:75,65:[1,43],67:114,68:[2,96],69:116,70:76,71:77,72:[1,78],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{33:[1,117]},{32:118,33:[2,62],74:119,75:[1,120]},{33:[2,59],65:[2,59],72:[2,59],75:[2,59],80:[2,59],81:[2,59],82:[2,59],83:[2,59],84:[2,59],85:[2,59]},{33:[2,61],75:[2,61]},{33:[2,68],37:121,74:122,75:[1,120]},{33:[2,65],65:[2,65],72:[2,65],75:[2,65],80:[2,65],81:[2,65],82:[2,65],83:[2,65],84:[2,65],85:[2,65]},{33:[2,67],75:[2,67]},{23:[1,123]},{23:[2,51],65:[2,51],72:[2,51],80:[2,51],81:[2,51],82:[2,51],83:[2,51],84:[2,51],85:[2,51]},{23:[2,53]},{33:[1,124]},{33:[2,91],65:[2,91],72:[2,91],80:[2,91],81:[2,91],82:[2,91],83:[2,91],84:[2,91],85:[2,91]},{33:[2,93]},{5:[2,22],14:[2,22],15:[2,22],19:[2,22],29:[2,22],34:[2,22],39:[2,22],44:[2,22],47:[2,22],48:[2,22],51:[2,22],55:[2,22],60:[2,22]},{23:[2,99],33:[2,99],54:[2,99],68:[2,99],72:[2,99],75:[2,99]},{73:[1,108]},{20:74,63:125,64:75,65:[1,43],72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{5:[2,23],14:[2,23],15:[2,23],19:[2,23],29:[2,23],34:[2,23],39:[2,23],44:[2,23],47:[2,23],48:[2,23],51:[2,23],55:[2,23],60:[2,23]},{47:[2,19]},{47:[2,77]},{20:74,33:[2,72],41:126,63:127,64:75,65:[1,43],69:128,70:76,71:77,72:[1,78],75:[2,72],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{5:[2,24],14:[2,24],15:[2,24],19:[2,24],29:[2,24],34:[2,24],39:[2,24],44:[2,24],47:[2,24],48:[2,24],51:[2,24],55:[2,24],60:[2,24]},{68:[1,129]},{65:[2,95],68:[2,95],72:[2,95],80:[2,95],81:[2,95],82:[2,95],83:[2,95],84:[2,95],85:[2,95]},{68:[2,97]},{5:[2,21],14:[2,21],15:[2,21],19:[2,21],29:[2,21],34:[2,21],39:[2,21],44:[2,21],47:[2,21],48:[2,21],51:[2,21],55:[2,21],60:[2,21]},{33:[1,130]},{33:[2,63]},{72:[1,132],76:131},{33:[1,133]},{33:[2,69]},{15:[2,12],18:[2,12]},{14:[2,26],15:[2,26],19:[2,26],29:[2,26],34:[2,26],47:[2,26],48:[2,26],51:[2,26],55:[2,26],60:[2,26]},{23:[2,31],33:[2,31],54:[2,31],68:[2,31],72:[2,31],75:[2,31]},{33:[2,74],42:134,74:135,75:[1,120]},{33:[2,71],65:[2,71],72:[2,71],75:[2,71],80:[2,71],81:[2,71],82:[2,71],83:[2,71],84:[2,71],85:[2,71]},{33:[2,73],75:[2,73]},{23:[2,29],33:[2,29],54:[2,29],65:[2,29],68:[2,29],72:[2,29],75:[2,29],80:[2,29],81:[2,29],82:[2,29],83:[2,29],84:[2,29],85:[2,29]},{14:[2,15],15:[2,15],19:[2,15],29:[2,15],34:[2,15],39:[2,15],44:[2,15],47:[2,15],48:[2,15],51:[2,15],55:[2,15],60:[2,15]},{72:[1,137],77:[1,136]},{72:[2,100],77:[2,100]},{14:[2,16],15:[2,16],19:[2,16],29:[2,16],34:[2,16],44:[2,16],47:[2,16],48:[2,16],51:[2,16],55:[2,16],60:[2,16]},{33:[1,138]},{33:[2,75]},{33:[2,32]},{72:[2,101],77:[2,101]},{14:[2,17],15:[2,17],19:[2,17],29:[2,17],34:[2,17],39:[2,17],44:[2,17],47:[2,17],48:[2,17],51:[2,17],55:[2,17],60:[2,17]}],defaultActions:{4:[2,1],54:[2,55],56:[2,20],60:[2,57],73:[2,81],82:[2,85],86:[2,18],90:[2,89],101:[2,53],104:[2,93],110:[2,19],111:[2,77],116:[2,97],119:[2,63],122:[2,69],135:[2,75],136:[2,32]},parseError:function(a,b){throw new Error(a)},parse:function(a){function b(){var a;return a=c.lexer.lex()||1,"number"!=typeof a&&(a=c.symbols_[a]||a),a}var c=this,d=[0],e=[null],f=[],g=this.table,h="",i=0,j=0,k=0;this.lexer.setInput(a),this.lexer.yy=this.yy,this.yy.lexer=this.lexer,this.yy.parser=this,"undefined"==typeof this.lexer.yylloc&&(this.lexer.yylloc={});var l=this.lexer.yylloc;f.push(l);var m=this.lexer.options&&this.lexer.options.ranges;"function"==typeof this.yy.parseError&&(this.parseError=this.yy.parseError);for(var n,o,p,q,r,s,t,u,v,w={};;){if(p=d[d.length-1],this.defaultActions[p]?q=this.defaultActions[p]:(null!==n&&"undefined"!=typeof n||(n=b()),q=g[p]&&g[p][n]),"undefined"==typeof q||!q.length||!q[0]){var x="";if(!k){v=[];for(s in g[p])this.terminals_[s]&&s>2&&v.push("'"+this.terminals_[s]+"'");x=this.lexer.showPosition?"Parse error on line "+(i+1)+":\n"+this.lexer.showPosition()+"\nExpecting "+v.join(", ")+", got '"+(this.terminals_[n]||n)+"'":"Parse error on line "+(i+1)+": Unexpected "+(1==n?"end of input":"'"+(this.terminals_[n]||n)+"'"),this.parseError(x,{text:this.lexer.match,token:this.terminals_[n]||n,line:this.lexer.yylineno,loc:l,expected:v})}}if(q[0]instanceof Array&&q.length>1)throw new Error("Parse Error: multiple actions possible at state: "+p+", token: "+n);switch(q[0]){case 1:d.push(n),e.push(this.lexer.yytext),f.push(this.lexer.yylloc),d.push(q[1]),n=null,o?(n=o,o=null):(j=this.lexer.yyleng,h=this.lexer.yytext,i=this.lexer.yylineno,l=this.lexer.yylloc,k>0&&k--);break;case 2:if(t=this.productions_[q[1]][1],w.$=e[e.length-t],w._$={first_line:f[f.length-(t||1)].first_line,last_line:f[f.length-1].last_line,first_column:f[f.length-(t||1)].first_column,last_column:f[f.length-1].last_column},m&&(w._$.range=[f[f.length-(t||1)].range[0],f[f.length-1].range[1]]),r=this.performAction.call(w,h,j,i,this.yy,q[1],e,f),"undefined"!=typeof r)return r;t&&(d=d.slice(0,-1*t*2),e=e.slice(0,-1*t),f=f.slice(0,-1*t)),d.push(this.productions_[q[1]][0]),e.push(w.$),f.push(w._$),u=g[d[d.length-2]][d[d.length-1]],d.push(u);break;case 3:return!0}}return!0}},c=function(){var a={EOF:1,parseError:function(a,b){if(!this.yy.parser)throw new Error(a);this.yy.parser.parseError(a,b)},setInput:function(a){return this._input=a,this._more=this._less=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var a=this._input[0];this.yytext+=a,this.yyleng++,this.offset++,this.match+=a,this.matched+=a;var b=a.match(/(?:\r\n?|\n).*/g);return b?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),a},unput:function(a){var b=a.length,c=a.split(/(?:\r\n?|\n)/g);this._input=a+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-b-1),this.offset-=b;var d=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),c.length-1&&(this.yylineno-=c.length-1);var e=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:c?(c.length===d.length?this.yylloc.first_column:0)+d[d.length-c.length].length-c[0].length:this.yylloc.first_column-b},this.options.ranges&&(this.yylloc.range=[e[0],e[0]+this.yyleng-b]),this},more:function(){return this._more=!0,this},less:function(a){this.unput(this.match.slice(a))},pastInput:function(){var a=this.matched.substr(0,this.matched.length-this.match.length);return(a.length>20?"...":"")+a.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var a=this.match;return a.length<20&&(a+=this._input.substr(0,20-a.length)),(a.substr(0,20)+(a.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var a=this.pastInput(),b=new Array(a.length+1).join("-");return a+this.upcomingInput()+"\n"+b+"^"},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var a,b,c,d,e;this._more||(this.yytext="",this.match="");for(var f=this._currentRules(),g=0;g<f.length&&(c=this._input.match(this.rules[f[g]]),!c||b&&!(c[0].length>b[0].length)||(b=c,d=g,this.options.flex));g++);return b?(e=b[0].match(/(?:\r\n?|\n).*/g),e&&(this.yylineno+=e.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:e?e[e.length-1].length-e[e.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+b[0].length},this.yytext+=b[0],this.match+=b[0],this.matches=b,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._input=this._input.slice(b[0].length),this.matched+=b[0],a=this.performAction.call(this,this.yy,this,f[d],this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),a?a:void 0):""===this._input?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+". Unrecognized text.\n"+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var a=this.next();return"undefined"!=typeof a?a:this.lex()},begin:function(a){this.conditionStack.push(a)},popState:function(){return this.conditionStack.pop()},_currentRules:function(){return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules},topState:function(){return this.conditionStack[this.conditionStack.length-2]},pushState:function(a){this.begin(a)}};return a.options={},a.performAction=function(a,b,c,d){function e(a,c){return b.yytext=b.yytext.substring(a,b.yyleng-c+a)}switch(c){case 0:if("\\\\"===b.yytext.slice(-2)?(e(0,1),this.begin("mu")):"\\"===b.yytext.slice(-1)?(e(0,1),this.begin("emu")):this.begin("mu"),b.yytext)return 15;break;case 1:return 15;case 2:return this.popState(),15;case 3:return this.begin("raw"),15;case 4:return this.popState(),"raw"===this.conditionStack[this.conditionStack.length-1]?15:(e(5,9),"END_RAW_BLOCK");case 5:return 15;case 6:return this.popState(),14;case 7:return 65;case 8:return 68;case 9:return 19;case 10:return this.popState(),this.begin("raw"),23;case 11:return 55;case 12:return 60;case 13:return 29;case 14:return 47;case 15:return this.popState(),44;case 16:return this.popState(),44;case 17:return 34;case 18:return 39;case 19:return 51;case 20:return 48;case 21:this.unput(b.yytext),this.popState(),this.begin("com");break;case 22:return this.popState(),14;case 23:return 48;case 24:return 73;case 25:return 72;case 26:return 72;case 27:return 87;case 28:break;case 29:return this.popState(),54;case 30:return this.popState(),33;case 31:return b.yytext=e(1,2).replace(/\\"/g,'"'),80;case 32:return b.yytext=e(1,2).replace(/\\'/g,"'"),80;case 33:return 85;case 34:return 82;case 35:return 82;case 36:return 83;case 37:return 84;case 38:return 81;case 39:return 75;case 40:return 77;case 41:return 72;case 42:return b.yytext=b.yytext.replace(/\\([\\\]])/g,"$1"),72;case 43:return"INVALID";case 44:return 5}},a.rules=[/^(?:[^\x00]*?(?=(\{\{)))/,/^(?:[^\x00]+)/,/^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/,/^(?:\{\{\{\{(?=[^\/]))/,/^(?:\{\{\{\{\/[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.])\}\}\}\})/,/^(?:[^\x00]+?(?=(\{\{\{\{)))/,/^(?:[\s\S]*?--(~)?\}\})/,/^(?:\()/,/^(?:\))/,/^(?:\{\{\{\{)/,/^(?:\}\}\}\})/,/^(?:\{\{(~)?>)/,/^(?:\{\{(~)?#>)/,/^(?:\{\{(~)?#\*?)/,/^(?:\{\{(~)?\/)/,/^(?:\{\{(~)?\^\s*(~)?\}\})/,/^(?:\{\{(~)?\s*else\s*(~)?\}\})/,/^(?:\{\{(~)?\^)/,/^(?:\{\{(~)?\s*else\b)/,/^(?:\{\{(~)?\{)/,/^(?:\{\{(~)?&)/,/^(?:\{\{(~)?!--)/,/^(?:\{\{(~)?![\s\S]*?\}\})/,/^(?:\{\{(~)?\*?)/,/^(?:=)/,/^(?:\.\.)/,/^(?:\.(?=([=~}\s\/.)|])))/,/^(?:[\/.])/,/^(?:\s+)/,/^(?:\}(~)?\}\})/,/^(?:(~)?\}\})/,/^(?:"(\\["]|[^"])*")/,/^(?:'(\\[']|[^'])*')/,/^(?:@)/,/^(?:true(?=([~}\s)])))/,/^(?:false(?=([~}\s)])))/,/^(?:undefined(?=([~}\s)])))/,/^(?:null(?=([~}\s)])))/,/^(?:-?[0-9]+(?:\.[0-9]+)?(?=([~}\s)])))/,/^(?:as\s+\|)/,/^(?:\|)/,/^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)|]))))/,/^(?:\[(\\\]|[^\]])*\])/,/^(?:.)/,/^(?:$)/],a.conditions={mu:{rules:[7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44],inclusive:!1},emu:{rules:[2],inclusive:!1},com:{rules:[6],inclusive:!1},raw:{rules:[3,4,5],inclusive:!1},INITIAL:{rules:[0,1,44],inclusive:!0}},a}();return b.lexer=c,a.prototype=b,b.Parser=a,new a}();b["default"]=c,a.exports=b["default"]},function(a,b,c){"use strict";function d(){var a=arguments.length<=0||void 0===arguments[0]?{}:arguments[0];this.options=a}function e(a,b,c){void 0===b&&(b=a.length);var d=a[b-1],e=a[b-2];return d?"ContentStatement"===d.type?(e||!c?/\r?\n\s*?$/:/(^|\r?\n)\s*?$/).test(d.original):void 0:c}function f(a,b,c){void 0===b&&(b=-1);var d=a[b+1],e=a[b+2];return d?"ContentStatement"===d.type?(e||!c?/^\s*?\r?\n/:/^\s*?(\r?\n|$)/).test(d.original):void 0:c}function g(a,b,c){var d=a[null==b?0:b+1];if(d&&"ContentStatement"===d.type&&(c||!d.rightStripped)){var e=d.value;d.value=d.value.replace(c?/^\s+/:/^[ \t]*\r?\n?/,""),d.rightStripped=d.value!==e}}function h(a,b,c){var d=a[null==b?a.length-1:b-1];if(d&&"ContentStatement"===d.type&&(c||!d.leftStripped)){var e=d.value;return d.value=d.value.replace(c?/\s+$/:/[ \t]+$/,""),d.leftStripped=d.value!==e,d.leftStripped}}var i=c(1)["default"];b.__esModule=!0;var j=c(49),k=i(j);d.prototype=new k["default"],d.prototype.Program=function(a){var b=!this.options.ignoreStandalone,c=!this.isRootSeen;this.isRootSeen=!0;for(var d=a.body,i=0,j=d.length;i<j;i++){var k=d[i],l=this.accept(k);if(l){var m=e(d,i,c),n=f(d,i,c),o=l.openStandalone&&m,p=l.closeStandalone&&n,q=l.inlineStandalone&&m&&n;l.close&&g(d,i,!0),l.open&&h(d,i,!0),b&&q&&(g(d,i),h(d,i)&&"PartialStatement"===k.type&&(k.indent=/([ \t]+$)/.exec(d[i-1].original)[1])),b&&o&&(g((k.program||k.inverse).body),h(d,i)),b&&p&&(g(d,i),h((k.inverse||k.program).body))}}return a},d.prototype.BlockStatement=d.prototype.DecoratorBlock=d.prototype.PartialBlockStatement=function(a){this.accept(a.program),this.accept(a.inverse);var b=a.program||a.inverse,c=a.program&&a.inverse,d=c,i=c;if(c&&c.chained)for(d=c.body[0].program;i.chained;)i=i.body[i.body.length-1].program;var j={open:a.openStrip.open,close:a.closeStrip.close,openStandalone:f(b.body),closeStandalone:e((d||b).body)};if(a.openStrip.close&&g(b.body,null,!0),c){var k=a.inverseStrip;k.open&&h(b.body,null,!0),k.close&&g(d.body,null,!0),a.closeStrip.open&&h(i.body,null,!0),!this.options.ignoreStandalone&&e(b.body)&&f(d.body)&&(h(b.body),g(d.body))}else a.closeStrip.open&&h(b.body,null,!0);return j},d.prototype.Decorator=d.prototype.MustacheStatement=function(a){return a.strip},d.prototype.PartialStatement=d.prototype.CommentStatement=function(a){var b=a.strip||{};return{inlineStandalone:!0,open:b.open,close:b.close}},b["default"]=d,a.exports=b["default"]},function(a,b,c){"use strict";function d(){this.parents=[]}function e(a){this.acceptRequired(a,"path"),this.acceptArray(a.params),this.acceptKey(a,"hash")}function f(a){e.call(this,a),this.acceptKey(a,"program"),this.acceptKey(a,"inverse")}function g(a){this.acceptRequired(a,"name"),this.acceptArray(a.params),this.acceptKey(a,"hash")}var h=c(1)["default"];b.__esModule=!0;var i=c(6),j=h(i);d.prototype={constructor:d,mutating:!1,acceptKey:function(a,b){var c=this.accept(a[b]);if(this.mutating){if(c&&!d.prototype[c.type])throw new j["default"]('Unexpected node type "'+c.type+'" found when accepting '+b+" on "+a.type);a[b]=c}},acceptRequired:function(a,b){if(this.acceptKey(a,b),!a[b])throw new j["default"](a.type+" requires "+b)},acceptArray:function(a){for(var b=0,c=a.length;b<c;b++)this.acceptKey(a,b),a[b]||(a.splice(b,1),b--,c--)},accept:function(a){if(a){if(!this[a.type])throw new j["default"]("Unknown type: "+a.type,a);this.current&&this.parents.unshift(this.current),this.current=a;var b=this[a.type](a);return this.current=this.parents.shift(),!this.mutating||b?b:b!==!1?a:void 0}},Program:function(a){this.acceptArray(a.body)},MustacheStatement:e,Decorator:e,BlockStatement:f,DecoratorBlock:f,PartialStatement:g,PartialBlockStatement:function(a){g.call(this,a),this.acceptKey(a,"program")},ContentStatement:function(){},CommentStatement:function(){},SubExpression:e,PathExpression:function(){},StringLiteral:function(){},NumberLiteral:function(){},BooleanLiteral:function(){},UndefinedLiteral:function(){},NullLiteral:function(){},Hash:function(a){this.acceptArray(a.pairs)},HashPair:function(a){this.acceptRequired(a,"value")}},b["default"]=d,a.exports=b["default"]},function(a,b,c){"use strict";function d(a,b){if(b=b.path?b.path.original:b,a.path.original!==b){var c={loc:a.path.loc};throw new q["default"](a.path.original+" doesn't match "+b,c)}}function e(a,b){this.source=a,this.start={line:b.first_line,column:b.first_column},this.end={line:b.last_line,column:b.last_column}}function f(a){return/^\[.*\]$/.test(a)?a.substring(1,a.length-1):a}function g(a,b){return{open:"~"===a.charAt(2),close:"~"===b.charAt(b.length-3)}}function h(a){return a.replace(/^\{\{~?!-?-?/,"").replace(/-?-?~?\}\}$/,"")}function i(a,b,c){c=this.locInfo(c);for(var d=a?"@":"",e=[],f=0,g=0,h=b.length;g<h;g++){var i=b[g].part,j=b[g].original!==i;if(d+=(b[g].separator||"")+i,j||".."!==i&&"."!==i&&"this"!==i)e.push(i);else{if(e.length>0)throw new q["default"]("Invalid path: "+d,{loc:c});".."===i&&f++}}return{type:"PathExpression",data:a,depth:f,parts:e,original:d,loc:c}}function j(a,b,c,d,e,f){var g=d.charAt(3)||d.charAt(2),h="{"!==g&&"&"!==g,i=/\*/.test(d);return{type:i?"Decorator":"MustacheStatement",path:a,params:b,hash:c,escaped:h,strip:e,loc:this.locInfo(f)}}function k(a,b,c,e){d(a,c),e=this.locInfo(e);var f={type:"Program",body:b,strip:{},loc:e};return{type:"BlockStatement",path:a.path,params:a.params,hash:a.hash,program:f,openStrip:{},inverseStrip:{},closeStrip:{},loc:e}}function l(a,b,c,e,f,g){e&&e.path&&d(a,e);var h=/\*/.test(a.open);b.blockParams=a.blockParams;var i=void 0,j=void 0;if(c){if(h)throw new q["default"]("Unexpected inverse block on decorator",c);c.chain&&(c.program.body[0].closeStrip=e.strip),j=c.strip,i=c.program}return f&&(f=i,i=b,b=f),{type:h?"DecoratorBlock":"BlockStatement",path:a.path,params:a.params,hash:a.hash,program:b,inverse:i,openStrip:a.strip,inverseStrip:j,closeStrip:e&&e.strip,loc:this.locInfo(g)}}function m(a,b){if(!b&&a.length){var c=a[0].loc,d=a[a.length-1].loc;c&&d&&(b={source:c.source,start:{line:c.start.line,column:c.start.column},end:{line:d.end.line,column:d.end.column}})}return{type:"Program",body:a,strip:{},loc:b}}function n(a,b,c,e){return d(a,c),{type:"PartialBlockStatement",name:a.path,params:a.params,hash:a.hash,program:b,openStrip:a.strip,closeStrip:c&&c.strip,loc:this.locInfo(e)}}var o=c(1)["default"];b.__esModule=!0,b.SourceLocation=e,b.id=f,b.stripFlags=g,b.stripComment=h,b.preparePath=i,b.prepareMustache=j,b.prepareRawBlock=k,b.prepareBlock=l,b.prepareProgram=m,b.preparePartialBlock=n;var p=c(6),q=o(p)},function(a,b,c){"use strict";function d(){}function e(a,b,c){if(null==a||"string"!=typeof a&&"Program"!==a.type)throw new l["default"]("You must pass a string or Handlebars AST to Handlebars.precompile. You passed "+a);b=b||{},"data"in b||(b.data=!0),b.compat&&(b.useDepths=!0);var d=c.parse(a,b),e=(new c.Compiler).compile(d,b);return(new c.JavaScriptCompiler).compile(e,b)}function f(a,b,c){function d(){var d=c.parse(a,b),e=(new c.Compiler).compile(d,b),f=(new c.JavaScriptCompiler).compile(e,b,void 0,!0);return c.template(f)}function e(a,b){return f||(f=d()),f.call(this,a,b)}if(void 0===b&&(b={}),null==a||"string"!=typeof a&&"Program"!==a.type)throw new l["default"]("You must pass a string or Handlebars AST to Handlebars.compile. You passed "+a);b=m.extend({},b),"data"in b||(b.data=!0),b.compat&&(b.useDepths=!0);var f=void 0;return e._setup=function(a){return f||(f=d()),f._setup(a)},e._child=function(a,b,c,e){return f||(f=d()),f._child(a,b,c,e)},e}function g(a,b){if(a===b)return!0;if(m.isArray(a)&&m.isArray(b)&&a.length===b.length){for(var c=0;c<a.length;c++)if(!g(a[c],b[c]))return!1;return!0}}function h(a){if(!a.path.parts){var b=a.path;a.path={type:"PathExpression",data:!1,depth:0,parts:[b.original+""],original:b.original+"",loc:b.loc}}}var i=c(34)["default"],j=c(1)["default"];b.__esModule=!0,b.Compiler=d,b.precompile=e,b.compile=f;var k=c(6),l=j(k),m=c(5),n=c(45),o=j(n),p=[].slice;d.prototype={compiler:d,equals:function(a){var b=this.opcodes.length;if(a.opcodes.length!==b)return!1;for(var c=0;c<b;c++){var d=this.opcodes[c],e=a.opcodes[c];if(d.opcode!==e.opcode||!g(d.args,e.args))return!1}b=this.children.length;for(var c=0;c<b;c++)if(!this.children[c].equals(a.children[c]))return!1;return!0},guid:0,compile:function(a,b){return this.sourceNode=[],this.opcodes=[],this.children=[],this.options=b,this.stringParams=b.stringParams,this.trackIds=b.trackIds,b.blockParams=b.blockParams||[],b.knownHelpers=m.extend(i(null),{helperMissing:!0,blockHelperMissing:!0,each:!0,"if":!0,unless:!0,"with":!0,log:!0,lookup:!0},b.knownHelpers),this.accept(a)},compileProgram:function(a){var b=new this.compiler,c=b.compile(a,this.options),d=this.guid++;return this.usePartial=this.usePartial||c.usePartial,this.children[d]=c,this.useDepths=this.useDepths||c.useDepths,d},accept:function(a){if(!this[a.type])throw new l["default"]("Unknown type: "+a.type,a);this.sourceNode.unshift(a);var b=this[a.type](a);return this.sourceNode.shift(),b},Program:function(a){this.options.blockParams.unshift(a.blockParams);for(var b=a.body,c=b.length,d=0;d<c;d++)this.accept(b[d]);return this.options.blockParams.shift(),this.isSimple=1===c,this.blockParams=a.blockParams?a.blockParams.length:0,this},BlockStatement:function(a){h(a);var b=a.program,c=a.inverse;b=b&&this.compileProgram(b),c=c&&this.compileProgram(c);var d=this.classifySexpr(a);"helper"===d?this.helperSexpr(a,b,c):"simple"===d?(this.simpleSexpr(a),this.opcode("pushProgram",b),this.opcode("pushProgram",c),this.opcode("emptyHash"),this.opcode("blockValue",a.path.original)):(this.ambiguousSexpr(a,b,c),this.opcode("pushProgram",b),this.opcode("pushProgram",c),this.opcode("emptyHash"),this.opcode("ambiguousBlockValue")),this.opcode("append")},DecoratorBlock:function(a){var b=a.program&&this.compileProgram(a.program),c=this.setupFullMustacheParams(a,b,void 0),d=a.path;this.useDecorators=!0,this.opcode("registerDecorator",c.length,d.original)},PartialStatement:function(a){this.usePartial=!0;var b=a.program;b&&(b=this.compileProgram(a.program));var c=a.params;if(c.length>1)throw new l["default"]("Unsupported number of partial arguments: "+c.length,a);c.length||(this.options.explicitPartialContext?this.opcode("pushLiteral","undefined"):c.push({type:"PathExpression",parts:[],depth:0}));var d=a.name.original,e="SubExpression"===a.name.type;e&&this.accept(a.name),this.setupFullMustacheParams(a,b,void 0,!0);var f=a.indent||"";this.options.preventIndent&&f&&(this.opcode("appendContent",f),f=""),this.opcode("invokePartial",e,d,f),this.opcode("append")},PartialBlockStatement:function(a){this.PartialStatement(a)},MustacheStatement:function(a){this.SubExpression(a),a.escaped&&!this.options.noEscape?this.opcode("appendEscaped"):this.opcode("append")},Decorator:function(a){this.DecoratorBlock(a)},ContentStatement:function(a){a.value&&this.opcode("appendContent",a.value)},CommentStatement:function(){},SubExpression:function(a){h(a);var b=this.classifySexpr(a);"simple"===b?this.simpleSexpr(a):"helper"===b?this.helperSexpr(a):this.ambiguousSexpr(a)},ambiguousSexpr:function(a,b,c){var d=a.path,e=d.parts[0],f=null!=b||null!=c;this.opcode("getContext",d.depth),this.opcode("pushProgram",b),this.opcode("pushProgram",c),d.strict=!0,this.accept(d),this.opcode("invokeAmbiguous",e,f)},simpleSexpr:function(a){var b=a.path;b.strict=!0,this.accept(b),this.opcode("resolvePossibleLambda")},helperSexpr:function(a,b,c){var d=this.setupFullMustacheParams(a,b,c),e=a.path,f=e.parts[0];if(this.options.knownHelpers[f])this.opcode("invokeKnownHelper",d.length,f);else{if(this.options.knownHelpersOnly)throw new l["default"]("You specified knownHelpersOnly, but used the unknown helper "+f,a);e.strict=!0,e.falsy=!0,this.accept(e),this.opcode("invokeHelper",d.length,e.original,o["default"].helpers.simpleId(e))}},PathExpression:function(a){this.addDepth(a.depth),this.opcode("getContext",a.depth);var b=a.parts[0],c=o["default"].helpers.scopedId(a),d=!a.depth&&!c&&this.blockParamIndex(b);d?this.opcode("lookupBlockParam",d,a.parts):b?a.data?(this.options.data=!0,this.opcode("lookupData",a.depth,a.parts,a.strict)):this.opcode("lookupOnContext",a.parts,a.falsy,a.strict,c):this.opcode("pushContext")},StringLiteral:function(a){this.opcode("pushString",a.value)},NumberLiteral:function(a){this.opcode("pushLiteral",a.value)},BooleanLiteral:function(a){this.opcode("pushLiteral",a.value)},UndefinedLiteral:function(){this.opcode("pushLiteral","undefined")},NullLiteral:function(){this.opcode("pushLiteral","null")},Hash:function(a){var b=a.pairs,c=0,d=b.length;for(this.opcode("pushHash");c<d;c++)this.pushParam(b[c].value);for(;c--;)this.opcode("assignToHash",b[c].key);this.opcode("popHash")},opcode:function(a){this.opcodes.push({opcode:a,args:p.call(arguments,1),loc:this.sourceNode[0].loc})},addDepth:function(a){a&&(this.useDepths=!0)},classifySexpr:function(a){var b=o["default"].helpers.simpleId(a.path),c=b&&!!this.blockParamIndex(a.path.parts[0]),d=!c&&o["default"].helpers.helperExpression(a),e=!c&&(d||b);if(e&&!d){var f=a.path.parts[0],g=this.options;g.knownHelpers[f]?d=!0:g.knownHelpersOnly&&(e=!1)}return d?"helper":e?"ambiguous":"simple"},pushParams:function(a){for(var b=0,c=a.length;b<c;b++)this.pushParam(a[b])},pushParam:function(a){var b=null!=a.value?a.value:a.original||"";if(this.stringParams)b.replace&&(b=b.replace(/^(\.?\.\/)*/g,"").replace(/\//g,".")),a.depth&&this.addDepth(a.depth),this.opcode("getContext",a.depth||0),this.opcode("pushStringParam",b,a.type),"SubExpression"===a.type&&this.accept(a);else{if(this.trackIds){var c=void 0;if(!a.parts||o["default"].helpers.scopedId(a)||a.depth||(c=this.blockParamIndex(a.parts[0])),c){var d=a.parts.slice(1).join(".");this.opcode("pushId","BlockParam",c,d)}else b=a.original||b,b.replace&&(b=b.replace(/^this(?:\.|$)/,"").replace(/^\.\//,"").replace(/^\.$/,"")),this.opcode("pushId",a.type,b)}this.accept(a)}},setupFullMustacheParams:function(a,b,c,d){var e=a.params;return this.pushParams(e),this.opcode("pushProgram",b),this.opcode("pushProgram",c),a.hash?this.accept(a.hash):this.opcode("emptyHash",d),e},blockParamIndex:function(a){for(var b=0,c=this.options.blockParams.length;b<c;b++){var d=this.options.blockParams[b],e=d&&m.indexOf(d,a);if(d&&e>=0)return[b,e]}}}},function(a,b,c){"use strict";function d(a){this.value=a}function e(){}function f(a,b,c,d){var e=b.popStack(),f=0,g=c.length;for(a&&g--;f<g;f++)e=b.nameLookup(e,c[f],d);return a?[b.aliasable("container.strict"),"(",e,", ",b.quotedString(c[f]),", ",JSON.stringify(b.source.currentLocation)," )"]:e}var g=c(13)["default"],h=c(1)["default"];b.__esModule=!0;var i=c(4),j=c(6),k=h(j),l=c(5),m=c(53),n=h(m);e.prototype={nameLookup:function(a,b){return this.internalNameLookup(a,b)},depthedLookup:function(a){return[this.aliasable("container.lookup"),"(depths, ",JSON.stringify(a),")"]},compilerInfo:function(){var a=i.COMPILER_REVISION,b=i.REVISION_CHANGES[a];return[a,b]},appendToBuffer:function(a,b,c){return l.isArray(a)||(a=[a]),a=this.source.wrap(a,b),this.environment.isSimple?["return ",a,";"]:c?["buffer += ",a,";"]:(a.appendToBuffer=!0,a)},initializeBuffer:function(){return this.quotedString("")},internalNameLookup:function(a,b){return this.lookupPropertyFunctionIsUsed=!0,["lookupProperty(",a,",",JSON.stringify(b),")"]},lookupPropertyFunctionIsUsed:!1,compile:function(a,b,c,d){this.environment=a,this.options=b,this.stringParams=this.options.stringParams,this.trackIds=this.options.trackIds,this.precompile=!d,this.name=this.environment.name,this.isChild=!!c,this.context=c||{decorators:[],programs:[],environments:[]},this.preamble(),this.stackSlot=0,this.stackVars=[],this.aliases={},this.registers={list:[]},this.hashes=[],this.compileStack=[],this.inlineStack=[],this.blockParams=[],this.compileChildren(a,b),this.useDepths=this.useDepths||a.useDepths||a.useDecorators||this.options.compat,this.useBlockParams=this.useBlockParams||a.useBlockParams;var e=a.opcodes,f=void 0,g=void 0,h=void 0,i=void 0;for(h=0,i=e.length;h<i;h++)f=e[h],this.source.currentLocation=f.loc,g=g||f.loc,this[f.opcode].apply(this,f.args);if(this.source.currentLocation=g,this.pushSource(""),this.stackSlot||this.inlineStack.length||this.compileStack.length)throw new k["default"]("Compile completed with content left on stack");this.decorators.isEmpty()?this.decorators=void 0:(this.useDecorators=!0,this.decorators.prepend(["var decorators = container.decorators, ",this.lookupPropertyFunctionVarDeclaration(),";\n"]),
this.decorators.push("return fn;"),d?this.decorators=Function.apply(this,["fn","props","container","depth0","data","blockParams","depths",this.decorators.merge()]):(this.decorators.prepend("function(fn, props, container, depth0, data, blockParams, depths) {\n"),this.decorators.push("}\n"),this.decorators=this.decorators.merge()));var j=this.createFunctionContext(d);if(this.isChild)return j;var l={compiler:this.compilerInfo(),main:j};this.decorators&&(l.main_d=this.decorators,l.useDecorators=!0);var m=this.context,n=m.programs,o=m.decorators;for(h=0,i=n.length;h<i;h++)n[h]&&(l[h]=n[h],o[h]&&(l[h+"_d"]=o[h],l.useDecorators=!0));return this.environment.usePartial&&(l.usePartial=!0),this.options.data&&(l.useData=!0),this.useDepths&&(l.useDepths=!0),this.useBlockParams&&(l.useBlockParams=!0),this.options.compat&&(l.compat=!0),d?l.compilerOptions=this.options:(l.compiler=JSON.stringify(l.compiler),this.source.currentLocation={start:{line:1,column:0}},l=this.objectLiteral(l),b.srcName?(l=l.toStringWithSourceMap({file:b.destName}),l.map=l.map&&l.map.toString()):l=l.toString()),l},preamble:function(){this.lastContext=0,this.source=new n["default"](this.options.srcName),this.decorators=new n["default"](this.options.srcName)},createFunctionContext:function(a){var b=this,c="",d=this.stackVars.concat(this.registers.list);d.length>0&&(c+=", "+d.join(", "));var e=0;g(this.aliases).forEach(function(a){var d=b.aliases[a];d.children&&d.referenceCount>1&&(c+=", alias"+ ++e+"="+a,d.children[0]="alias"+e)}),this.lookupPropertyFunctionIsUsed&&(c+=", "+this.lookupPropertyFunctionVarDeclaration());var f=["container","depth0","helpers","partials","data"];(this.useBlockParams||this.useDepths)&&f.push("blockParams"),this.useDepths&&f.push("depths");var h=this.mergeSource(c);return a?(f.push(h),Function.apply(this,f)):this.source.wrap(["function(",f.join(","),") {\n  ",h,"}"])},mergeSource:function(a){var b=this.environment.isSimple,c=!this.forceBuffer,d=void 0,e=void 0,f=void 0,g=void 0;return this.source.each(function(a){a.appendToBuffer?(f?a.prepend("  + "):f=a,g=a):(f&&(e?f.prepend("buffer += "):d=!0,g.add(";"),f=g=void 0),e=!0,b||(c=!1))}),c?f?(f.prepend("return "),g.add(";")):e||this.source.push('return "";'):(a+=", buffer = "+(d?"":this.initializeBuffer()),f?(f.prepend("return buffer + "),g.add(";")):this.source.push("return buffer;")),a&&this.source.prepend("var "+a.substring(2)+(d?"":";\n")),this.source.merge()},lookupPropertyFunctionVarDeclaration:function(){return"\n      lookupProperty = container.lookupProperty || function(parent, propertyName) {\n        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {\n          return parent[propertyName];\n        }\n        return undefined\n    }\n    ".trim()},blockValue:function(a){var b=this.aliasable("container.hooks.blockHelperMissing"),c=[this.contextName(0)];this.setupHelperArgs(a,0,c);var d=this.popStack();c.splice(1,0,d),this.push(this.source.functionCall(b,"call",c))},ambiguousBlockValue:function(){var a=this.aliasable("container.hooks.blockHelperMissing"),b=[this.contextName(0)];this.setupHelperArgs("",0,b,!0),this.flushInline();var c=this.topStack();b.splice(1,0,c),this.pushSource(["if (!",this.lastHelper,") { ",c," = ",this.source.functionCall(a,"call",b),"}"])},appendContent:function(a){this.pendingContent?a=this.pendingContent+a:this.pendingLocation=this.source.currentLocation,this.pendingContent=a},append:function(){if(this.isInline())this.replaceStack(function(a){return[" != null ? ",a,' : ""']}),this.pushSource(this.appendToBuffer(this.popStack()));else{var a=this.popStack();this.pushSource(["if (",a," != null) { ",this.appendToBuffer(a,void 0,!0)," }"]),this.environment.isSimple&&this.pushSource(["else { ",this.appendToBuffer("''",void 0,!0)," }"])}},appendEscaped:function(){this.pushSource(this.appendToBuffer([this.aliasable("container.escapeExpression"),"(",this.popStack(),")"]))},getContext:function(a){this.lastContext=a},pushContext:function(){this.pushStackLiteral(this.contextName(this.lastContext))},lookupOnContext:function(a,b,c,d){var e=0;d||!this.options.compat||this.lastContext?this.pushContext():this.push(this.depthedLookup(a[e++])),this.resolvePath("context",a,e,b,c)},lookupBlockParam:function(a,b){this.useBlockParams=!0,this.push(["blockParams[",a[0],"][",a[1],"]"]),this.resolvePath("context",b,1)},lookupData:function(a,b,c){a?this.pushStackLiteral("container.data(data, "+a+")"):this.pushStackLiteral("data"),this.resolvePath("data",b,0,!0,c)},resolvePath:function(a,b,c,d,e){var g=this;if(this.options.strict||this.options.assumeObjects)return void this.push(f(this.options.strict&&e,this,b,a));for(var h=b.length;c<h;c++)this.replaceStack(function(e){var f=g.nameLookup(e,b[c],a);return d?[" && ",f]:[" != null ? ",f," : ",e]})},resolvePossibleLambda:function(){this.push([this.aliasable("container.lambda"),"(",this.popStack(),", ",this.contextName(0),")"])},pushStringParam:function(a,b){this.pushContext(),this.pushString(b),"SubExpression"!==b&&("string"==typeof a?this.pushString(a):this.pushStackLiteral(a))},emptyHash:function(a){this.trackIds&&this.push("{}"),this.stringParams&&(this.push("{}"),this.push("{}")),this.pushStackLiteral(a?"undefined":"{}")},pushHash:function(){this.hash&&this.hashes.push(this.hash),this.hash={values:{},types:[],contexts:[],ids:[]}},popHash:function(){var a=this.hash;this.hash=this.hashes.pop(),this.trackIds&&this.push(this.objectLiteral(a.ids)),this.stringParams&&(this.push(this.objectLiteral(a.contexts)),this.push(this.objectLiteral(a.types))),this.push(this.objectLiteral(a.values))},pushString:function(a){this.pushStackLiteral(this.quotedString(a))},pushLiteral:function(a){this.pushStackLiteral(a)},pushProgram:function(a){null!=a?this.pushStackLiteral(this.programExpression(a)):this.pushStackLiteral(null)},registerDecorator:function(a,b){var c=this.nameLookup("decorators",b,"decorator"),d=this.setupHelperArgs(b,a);this.decorators.push(["fn = ",this.decorators.functionCall(c,"",["fn","props","container",d])," || fn;"])},invokeHelper:function(a,b,c){var d=this.popStack(),e=this.setupHelper(a,b),f=[];c&&f.push(e.name),f.push(d),this.options.strict||f.push(this.aliasable("container.hooks.helperMissing"));var g=["(",this.itemsSeparatedBy(f,"||"),")"],h=this.source.functionCall(g,"call",e.callParams);this.push(h)},itemsSeparatedBy:function(a,b){var c=[];c.push(a[0]);for(var d=1;d<a.length;d++)c.push(b,a[d]);return c},invokeKnownHelper:function(a,b){var c=this.setupHelper(a,b);this.push(this.source.functionCall(c.name,"call",c.callParams))},invokeAmbiguous:function(a,b){this.useRegister("helper");var c=this.popStack();this.emptyHash();var d=this.setupHelper(0,a,b),e=this.lastHelper=this.nameLookup("helpers",a,"helper"),f=["(","(helper = ",e," || ",c,")"];this.options.strict||(f[0]="(helper = ",f.push(" != null ? helper : ",this.aliasable("container.hooks.helperMissing"))),this.push(["(",f,d.paramsInit?["),(",d.paramsInit]:[],"),","(typeof helper === ",this.aliasable('"function"')," ? ",this.source.functionCall("helper","call",d.callParams)," : helper))"])},invokePartial:function(a,b,c){var d=[],e=this.setupParams(b,1,d);a&&(b=this.popStack(),delete e.name),c&&(e.indent=JSON.stringify(c)),e.helpers="helpers",e.partials="partials",e.decorators="container.decorators",a?d.unshift(b):d.unshift(this.nameLookup("partials",b,"partial")),this.options.compat&&(e.depths="depths"),e=this.objectLiteral(e),d.push(e),this.push(this.source.functionCall("container.invokePartial","",d))},assignToHash:function(a){var b=this.popStack(),c=void 0,d=void 0,e=void 0;this.trackIds&&(e=this.popStack()),this.stringParams&&(d=this.popStack(),c=this.popStack());var f=this.hash;c&&(f.contexts[a]=c),d&&(f.types[a]=d),e&&(f.ids[a]=e),f.values[a]=b},pushId:function(a,b,c){"BlockParam"===a?this.pushStackLiteral("blockParams["+b[0]+"].path["+b[1]+"]"+(c?" + "+JSON.stringify("."+c):"")):"PathExpression"===a?this.pushString(b):"SubExpression"===a?this.pushStackLiteral("true"):this.pushStackLiteral("null")},compiler:e,compileChildren:function(a,b){for(var c=a.children,d=void 0,e=void 0,f=0,g=c.length;f<g;f++){d=c[f],e=new this.compiler;var h=this.matchExistingProgram(d);if(null==h){this.context.programs.push("");var i=this.context.programs.length;d.index=i,d.name="program"+i,this.context.programs[i]=e.compile(d,b,this.context,!this.precompile),this.context.decorators[i]=e.decorators,this.context.environments[i]=d,this.useDepths=this.useDepths||e.useDepths,this.useBlockParams=this.useBlockParams||e.useBlockParams,d.useDepths=this.useDepths,d.useBlockParams=this.useBlockParams}else d.index=h.index,d.name="program"+h.index,this.useDepths=this.useDepths||h.useDepths,this.useBlockParams=this.useBlockParams||h.useBlockParams}},matchExistingProgram:function(a){for(var b=0,c=this.context.environments.length;b<c;b++){var d=this.context.environments[b];if(d&&d.equals(a))return d}},programExpression:function(a){var b=this.environment.children[a],c=[b.index,"data",b.blockParams];return(this.useBlockParams||this.useDepths)&&c.push("blockParams"),this.useDepths&&c.push("depths"),"container.program("+c.join(", ")+")"},useRegister:function(a){this.registers[a]||(this.registers[a]=!0,this.registers.list.push(a))},push:function(a){return a instanceof d||(a=this.source.wrap(a)),this.inlineStack.push(a),a},pushStackLiteral:function(a){this.push(new d(a))},pushSource:function(a){this.pendingContent&&(this.source.push(this.appendToBuffer(this.source.quotedString(this.pendingContent),this.pendingLocation)),this.pendingContent=void 0),a&&this.source.push(a)},replaceStack:function(a){var b=["("],c=void 0,e=void 0,f=void 0;if(!this.isInline())throw new k["default"]("replaceStack on non-inline");var g=this.popStack(!0);if(g instanceof d)c=[g.value],b=["(",c],f=!0;else{e=!0;var h=this.incrStack();b=["((",this.push(h)," = ",g,")"],c=this.topStack()}var i=a.call(this,c);f||this.popStack(),e&&this.stackSlot--,this.push(b.concat(i,")"))},incrStack:function(){return this.stackSlot++,this.stackSlot>this.stackVars.length&&this.stackVars.push("stack"+this.stackSlot),this.topStackName()},topStackName:function(){return"stack"+this.stackSlot},flushInline:function(){var a=this.inlineStack;this.inlineStack=[];for(var b=0,c=a.length;b<c;b++){var e=a[b];if(e instanceof d)this.compileStack.push(e);else{var f=this.incrStack();this.pushSource([f," = ",e,";"]),this.compileStack.push(f)}}},isInline:function(){return this.inlineStack.length},popStack:function(a){var b=this.isInline(),c=(b?this.inlineStack:this.compileStack).pop();if(!a&&c instanceof d)return c.value;if(!b){if(!this.stackSlot)throw new k["default"]("Invalid stack pop");this.stackSlot--}return c},topStack:function(){var a=this.isInline()?this.inlineStack:this.compileStack,b=a[a.length-1];return b instanceof d?b.value:b},contextName:function(a){return this.useDepths&&a?"depths["+a+"]":"depth"+a},quotedString:function(a){return this.source.quotedString(a)},objectLiteral:function(a){return this.source.objectLiteral(a)},aliasable:function(a){var b=this.aliases[a];return b?(b.referenceCount++,b):(b=this.aliases[a]=this.source.wrap(a),b.aliasable=!0,b.referenceCount=1,b)},setupHelper:function(a,b,c){var d=[],e=this.setupHelperArgs(b,a,d,c),f=this.nameLookup("helpers",b,"helper"),g=this.aliasable(this.contextName(0)+" != null ? "+this.contextName(0)+" : (container.nullContext || {})");return{params:d,paramsInit:e,name:f,callParams:[g].concat(d)}},setupParams:function(a,b,c){var d={},e=[],f=[],g=[],h=!c,i=void 0;h&&(c=[]),d.name=this.quotedString(a),d.hash=this.popStack(),this.trackIds&&(d.hashIds=this.popStack()),this.stringParams&&(d.hashTypes=this.popStack(),d.hashContexts=this.popStack());var j=this.popStack(),k=this.popStack();(k||j)&&(d.fn=k||"container.noop",d.inverse=j||"container.noop");for(var l=b;l--;)i=this.popStack(),c[l]=i,this.trackIds&&(g[l]=this.popStack()),this.stringParams&&(f[l]=this.popStack(),e[l]=this.popStack());return h&&(d.args=this.source.generateArray(c)),this.trackIds&&(d.ids=this.source.generateArray(g)),this.stringParams&&(d.types=this.source.generateArray(f),d.contexts=this.source.generateArray(e)),this.options.data&&(d.data="data"),this.useBlockParams&&(d.blockParams="blockParams"),d},setupHelperArgs:function(a,b,c,d){var e=this.setupParams(a,b,c);return e.loc=JSON.stringify(this.source.currentLocation),e=this.objectLiteral(e),d?(this.useRegister("options"),c.push("options"),["options=",e]):c?(c.push(e),""):e}},function(){for(var a="break else new var case finally return void catch for switch while continue function this with default if throw delete in try do instanceof typeof abstract enum int short boolean export interface static byte extends long super char final native synchronized class float package throws const goto private transient debugger implements protected volatile double import public let yield await null true false".split(" "),b=e.RESERVED_WORDS={},c=0,d=a.length;c<d;c++)b[a[c]]=!0}(),e.isValidJavaScriptVariableName=function(a){return!e.RESERVED_WORDS[a]&&/^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(a)},b["default"]=e,a.exports=b["default"]},function(a,b,c){"use strict";function d(a,b,c){if(g.isArray(a)){for(var d=[],e=0,f=a.length;e<f;e++)d.push(b.wrap(a[e],c));return d}return"boolean"==typeof a||"number"==typeof a?a+"":a}function e(a){this.srcFile=a,this.source=[]}var f=c(13)["default"];b.__esModule=!0;var g=c(5),h=void 0;try{}catch(i){}h||(h=function(a,b,c,d){this.src="",d&&this.add(d)},h.prototype={add:function(a){g.isArray(a)&&(a=a.join("")),this.src+=a},prepend:function(a){g.isArray(a)&&(a=a.join("")),this.src=a+this.src},toStringWithSourceMap:function(){return{code:this.toString()}},toString:function(){return this.src}}),e.prototype={isEmpty:function(){return!this.source.length},prepend:function(a,b){this.source.unshift(this.wrap(a,b))},push:function(a,b){this.source.push(this.wrap(a,b))},merge:function(){var a=this.empty();return this.each(function(b){a.add(["  ",b,"\n"])}),a},each:function(a){for(var b=0,c=this.source.length;b<c;b++)a(this.source[b])},empty:function(){var a=this.currentLocation||{start:{}};return new h(a.start.line,a.start.column,this.srcFile)},wrap:function(a){var b=arguments.length<=1||void 0===arguments[1]?this.currentLocation||{start:{}}:arguments[1];return a instanceof h?a:(a=d(a,this,b),new h(b.start.line,b.start.column,this.srcFile,a))},functionCall:function(a,b,c){return c=this.generateList(c),this.wrap([a,b?"."+b+"(":"(",c,")"])},quotedString:function(a){return'"'+(a+"").replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029")+'"'},objectLiteral:function(a){var b=this,c=[];f(a).forEach(function(e){var f=d(a[e],b);"undefined"!==f&&c.push([b.quotedString(e),":",f])});var e=this.generateList(c);return e.prepend("{"),e.add("}"),e},generateList:function(a){for(var b=this.empty(),c=0,e=a.length;c<e;c++)c&&b.add(","),b.add(d(a[c],this));return b},generateArray:function(a){var b=this.generateList(a);return b.prepend("["),b.add("]"),b}},b["default"]=e,a.exports=b["default"]}])});
var THREHOLD_WIDTH_FULLPAGE_ENABLE = 1280;
var THREHOLD_MOBILE__ENABLE_HEIGHT_FULLPAGE = 660; // smaller then iphone6s/8 & iPad portrait
var THREHOLD_MOBILE__ENABLE_HEIGHT_IP5 = 569; // smaller then iphone5
var THREHOLD_DESKTOP__ENABLE_HEIGHT_FULLPAGE = 720; // smaller then 1080/1.5
var THREHOLD_RWD_MINWIDTH_LAYOUT = 1024;
var THREHOLD_RWD_MOBILE_LAYOUT = 541;

var EVENT_FULLPAGE_ENABLED = "oneweb__event__fullpage_enabled";
var CLASS_FULLPAGE_AUTO_DISABLED = "auto-disabled-fullpage";
var CLASS_FULLPAGE_DISABLED = "fp-disabled";
var CLASS_FULLPAGE_ENABLED = "fp-enabled";
var CLASS_FLAG_MOBILE = "mobile";
var CLASS_FLAG_IE11 = "ie-browser";
var CLASS_FLAG_SMALLER_MOBILE = "small-device";
var CLASS_FLAG_SUPPORT_ANIM = "support-animation";
var PATH_RES = "/etc.clientlibs/OneWeb/components/header/clientlibs/resources/images/";
// const PATH_RES = "../../../../../public/oneweb/assets/content/rings/";
