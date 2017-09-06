本人在很久之前已经很想细读**jQuery**的源码了，可是一直没这个勇气去看，现在有时间了，看了一些大神的博客还有看了一本**Nicholas C.Zakas**的**JavaScript高级程序设计（第3版）**的书，感觉自己信心增强了不少，站在巨人的肩膀上，自己将可以站得更高，看得更远。
我看的是Coco大神的博客文章[【深入浅出jQuery】源码浅析--整体架构](http://www.cnblogs.com/coco1s/p/5261646.html)

###源码架构

1.[兼容AMD规范]()

```
	// 兼容AMD规范
14		( function( global, factory ) {
			"use strict";
			....
40		})( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {
			....
			return jQuery;
10220	});
```

2.[jQuery初始化]()

```
	// jQuery初始化
		"use strict";
94		var jQuery = function( selector, context ) {
			return new jQuery.fn.init( selector, context );
99		};

114		jQuery.fn = jQuery.prototype = {
119			constructor: jQuery
			....
193		};

2959	init = jQuery.fn.init = function( selector, context, root ) {
			....
3056	};

3059	init.prototype = jQuery.fn;
```

3.[jQuery插件拓展]()

```
	// jQuery插件拓展
195		jQuery.extend = jQuery.fn.extend = function() {
			....
			return target;
262		}
```

4.[jQuery工具（静态方法）$.fn]()

```
	// jQuery工具（静态方法）$.fn
264		jQuery.extend( {
			error: xxx,
			noop: xxx,
			isFunction: xxx,
			each: xxx,
			makeArray: xxx,
			....
516		} );
```

5.[复杂选择器Sizzle]()

```
	// 复杂选择器Sizzle
544		var Sizzle = (function( window ) {
760			function Sizzle( selector, context, results, seed ) {
				....
				return select( selector.replace( rtrim, "$1" ), context, results, seed );
891			}
			....
			return Sizzle;
2797	})( window );
```

6.[$.ready() & \$().ready()]()

```
	// $.ready() & $().ready()
3863	var readyList = jQuery.Deferred();

3865	jQuery.fn.ready = function( fn ) {
			....
			return this;
3878	}

3899	jQuery.extend( {
			ready: function( wait ) {
				....
3916		}
3917	} );
```

7.[回调对象$.Callback()]()

```
	// 回调对象$.Callback()
3262	jQuery.Callbacks = function( options ) {
3337		self = {
				add: xxx,
				remove: xxx
				has: xxx,
				....
3450		}
			return self;
3454	}
```

8.[延迟对象$.Deferred()]()

```
	// 延迟对象$.Deferred()
		jQuery.extend( {
3498		Deferred: function( func ) {
3511			promise = {};
3776			promise.promise( deferred );
				....
				return deferred;
3785		}

3788		when: function( singleValue ) {
				return jQuery.Deferred().promise();
3833		}
		} );
```

9.[浏览器功能性检测$.support]()

```
	// 浏览器功能性检测$.support
3841	jQuery.Deferred.exceptionHook = function( error, stack ) {
			// Support: IE 8 - 9 only
			....
3848	}
3930	// Support: IE <=9 - 10 only
4185    // Support: Chrome <=35 - 45
4280	// Support: IE 11 only
4776	// Support: Android <=4.0 only, PhantomJS 1 only
		.... other supports
```

10.[数据存储$.data & \$().data]()

```
	// 数据存储$.data & $().data
4024	function Data() { this.expando = jQuery.expando + Data.uid++; }

4030	Data.prototype = {
			....
4173	};

4241	jQuery.extend( {
			hasData: xxx,
			data: xxx,
			removeData: xxx,
			_data: xxx,
			_removeData: xxx
		} );
		
		jQuery.fn.extend( {
4266		data: function( key, value ) {
				return access(this, function( value ) { .... }, null, value, arguments.length > 1, null, true );
4339		},

4341		removeData: function( key ) {
				return xxx;
4345		}
		} );
```

11.[队列方法queue() & dequeue()]()

```
	// 队列方法queue() & dequeue()
		jQuery.extend( {
4530		queue: function( elem, type, data ) {
				return dataPriv.get( elem, type ) || [];
4367		},

4369		dequeue: function( elem, type ) {
				....
4402		},

4405		_queueHooks: function( elem, type ) {
				....
4412		}
		} );

		jQuery.fn.extend( {
4416		queue: function( type, data ) {
				return xxx;
4441		},

4442		dequeue: function( type ) {
				return xxx;
4446		},

4447		clearQueue: function( type ) {
				return xxx;
4449		},

4453		promise: function( type, obj ) {
				return defer.promise( obj );
4480		}
		} );
```

11.[对元素属性的操作]()

```
	// 对元素属性的操作
7456	jQuery.fn.extend( {
			attr: xxx, removeAttr: xxx
7466	} );

7588	jQuery.fn.extend( {
			prop: xxx, removeProp: xxx
7598	} );

		jQuery.fn.extend....
```
12.[事件操作]()
```
	// 事件操作
4965	jQuery.event = {
			....
5366	};

5376	jQuery.Event = function( src, props ) {
			....
5423	};

5427	jQuery.Event.prototype = {
			constructor: jQuery.Event,
			....
5463	};

5562	jQuery.fn.extend( {
			on: xxx, one: xxx, off: xxx
5606	} );
```

13.[DOM操作]()

```
	// DOM操作
5896	jQuery.fn.extend( {
			detach: xxx, remove: xxx, text: xxx, append: xxx, prepend: xxx, before: xxx, after: xxx, empty: xxx
6034	} );

		jQuery.fn.extend....
```

14.[css操作]()

```
	// css操作
		jQuery.extend( {
6376		cssHooks: {},

6413		style: function( elem, name, value, extra ) {},

6479		css: function( elem, name, extra, styles ) {}		
		} );
```

15.[$.ajax()]()

```
	// $.ajax()
		jQuery.extend( {
8834		ajax: function( url, options ) {
				....
8971			deferred.promise( jqXHR );
				....
9270		}
		} );
```

16.[动画animate()]()

```
	// 动画animate()
		jQuery.fn.extend( {
7217		animate: function( prop, speed, easing, callback ) {}
		} );
```

17.[多库共存noConflict()]()

```
	// 多库共存noConflict()
10191	var _jQuery = window.jQuery,
			_$ = window.$;
		
10196	jQuery.noConflict = function( deep ) {
			return jQuery;
10206	}
```

18.[最后将jQuery暴露出去]()

```
	// 最后将jQuery暴露出去
10211	if ( !noGlobal ) {
			window.jQuery = window.$ = jQuery;
		}
```