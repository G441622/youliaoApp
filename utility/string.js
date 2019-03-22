/*! http://mths.be/fromcodepoint v0.2.1 by @mathias */
if (!String.fromCodePoint) {
	(function() {
		var defineProperty = (function() {
			// IE 8 only supports `Object.defineProperty` on DOM elements
			try {
				var object = {};
				var $defineProperty = Object.defineProperty;
				var result = $defineProperty(object, object, object) && $defineProperty;
			} catch(error) {}
			return result;
		}());
		var stringFromCharCode = String.fromCharCode;
		var floor = Math.floor;
		var fromCodePoint = function(_) {
			var MAX_SIZE = 0x4000;
			var codeUnits = [];
			var highSurrogate;
			var lowSurrogate;
			var index = -1;
			var length = arguments.length;
			if (!length) {
				return '';
			}
			var result = '';
			while (++index < length) {
				var codePoint = Number(arguments[index]);
				if (
					!isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
					codePoint < 0 || // not a valid Unicode code point
					codePoint > 0x10FFFF || // not a valid Unicode code point
					floor(codePoint) != codePoint // not an integer
				) {
					throw RangeError('Invalid code point: ' + codePoint);
				}
				if (codePoint <= 0xFFFF) { // BMP code point
					codeUnits.push(codePoint);
				} else { // Astral code point; split in surrogate halves
					// http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
					codePoint -= 0x10000;
					highSurrogate = (codePoint >> 10) + 0xD800;
					lowSurrogate = (codePoint % 0x400) + 0xDC00;
					codeUnits.push(highSurrogate, lowSurrogate);
				}
				if (index + 1 == length || codeUnits.length > MAX_SIZE) {
					result += stringFromCharCode.apply(null, codeUnits);
					codeUnits.length = 0;
				}
			}
			return result;
		};
		if (defineProperty) {
			defineProperty(String, 'fromCodePoint', {
				'value': fromCodePoint,
				'configurable': true,
				'writable': true
			});
		} else {
			String.fromCodePoint = fromCodePoint;
		}
	}());
}

if (!String.prototype.codePointAt) {
	(function() {
	  'use strict'; // 严格模式，needed to support `apply`/`call` with `undefined`/`null`
	  var codePointAt = function(position) {
		if (this == null) {
		  throw TypeError();
		}
		var string = String(this);
		var size = string.length;
		// 变成整数
		var index = position ? Number(position) : 0;
		if (index != index) { // better `isNaN`
		  index = 0;
		}
		// 边界
		if (index < 0 || index >= size) {
		  return undefined;
		}
		// 第一个编码单元
		var first = string.charCodeAt(index);
		var second;
		if ( // 检查是否开始 surrogate pair
		  first >= 0xD800 && first <= 0xDBFF && // high surrogate
		  size > index + 1 // 下一个编码单元
		) {
		  second = string.charCodeAt(index + 1);
		  if (second >= 0xDC00 && second <= 0xDFFF) { // low surrogate
			// http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
			return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
		  }
		}
		return first;
	  };
	  if (Object.defineProperty) {
		Object.defineProperty(String.prototype, 'codePointAt', {
		  'value': codePointAt,
		  'configurable': true,
		  'writable': true
		});
	  } else {
		String.prototype.codePointAt = codePointAt;
	  }
	}());
  }