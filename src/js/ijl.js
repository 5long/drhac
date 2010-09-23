(function(window, name) {
	var _toString = Object.prototype.toString,
    _slice = Array.prototype.slice,
    timestamp = +new Date(),
    setTimeout = window.setTimeout;

	function isFunc(obj) {
		return _toString.call(obj) === "[object Function]";
	}

	function isArray(obj) {
		return _toString.call(obj) === "[object Array]";
	}

	function merge(destination, source) {
    if (!source) {
      source = destination;
      return merge(this, source);
    }

		for (var i in source) {
			if (source.hasOwnProperty(i)) {
				destination[i] = source[i];
			}
		}
		return destination;
	}

	function later(lag, callback) {
		if (isFunc(lag)) {
			callback = lag,
			lag = 13;
		};
		setTimeout(callback, lag);
	}

  function makeArray (fakeArray, start) {
    return _slice.call(fakeArray, +start);
  }

  function bind (context, fn) {
    var args = makeArray(arguments, 2);
    return typeof fn.bind == "function" ?
      // Native method is better, at least I hope so.
      fn.bind.apply(fn, [context].concat(args)) :
      function() {
        return fn.apply(context, args.concat(makeArray(arguments)));
      };
  }

  function pub (type) {
    var handlers = this._eventCenter[type]
      , handler, id, args;
    if (!handlers) {return;}
    args = makeArray(arguments, 1);
    for (id in handlers) {
      if (handlers.hasOwnProperty(id)) {
        handler = handlers[id];
        later(function() {
          handler.fn.apply(handler.context, args);
        });
      }
    }
  }

  function sub (type, handler, context) {
    handler._ijl_id = ++timestamp;
    var handlers = this._eventCenter[type] = this._eventCenter[type] || {};
    handlers[handler._ijl_id] = {
      fn:handler, context:context || null};
    return this;
  }

  function unsub (type, handler) {
    var handlers = this._eventCenter[type];
    if (!handlers || !handler._ijl_id) {return this};
    delete this._eventCenter[type][handler._ijl_id];
    return this;
  }

  window[name] = window[name] || {};
  merge(window[name], {
		isFunc: isFunc,
		isArray: isArray,
		merge: merge,
		later: later,
    makeArray: makeArray,
    bind: bind,
    _eventCenter: {},
    sub: sub,
    pub: pub,
    unsub: unsub
	});

})(this, "ijl");

(function() {

	var escape = encodeURIComponent,

	queryStringify = function(hash) {
		var result = [],
		key;
		for (key in hash) {
			if (hash.hasOwnProperty(key)) {
				result[result.length] = escape(key) + '=' + escape(hash[key]);
			}
		}
		return result.join('&');
	},

	xhrSucceeded = function(xhr) {
		return (xhr.status >= 200 && xhr.status < 300) || xhr.status === 304;
  },
  
  emptyFunction = function() {};

	ijl.merge({
		ajax: function(method, url, data) {
			var xhr = new XMLHttpRequest(),
        queryString = queryStringify(data);
      method = method.toUpperCase();

			if (method === 'GET' && queryString) {
				url += url.indexOf('?') === - 1 ?
        '?' + queryString :
        '&' + queryString;
			}
			xhr.open(method, url, true);

			return function(callback, errback) {
				var x = xhr;
				x.onreadystatechange = function() {
					if (this.readyState !== 4) {
						return;
					}
					if (xhrSucceeded(this)) {
						(callback || emptyFunction).call(this);
					} else {
						(errback || emptyFunction).call(this);
					}
				};
        x.send(method === "POST" ? queryString : null);
			};
		},

    get: function(url, data) {
      return ijl.ajax('GET', url, data);
    }
  });

})();

