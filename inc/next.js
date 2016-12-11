var Next = function(){
	if ( this === window ) {return new arguments.callee};
	this._signal = new Signal;
	return this;
};

var Signal = function() {
	return ( this === window ) ? ( new arguments.callee ) : this;
};

var _bind = function( func, thisObj ){
	return function() {
		var args = [].slice.call( arguments, 0 );
		func.apply( thisObj, args );
	};
};

Signal.prototype = {
	_storage: {},
	_callbacks: {},
	is: function( sig ) {
		return this._storage.hasOwnProperty( sig );
	},
	touch: function( sig ) {
		if ( this.is( sig ) ) {
			delete this._storage[ sig ];
			return true;
		} else return false;
	},
	send: function( sig ) {
		this._storage[ sig ] = 1;
		if ( this._callbacks[ sig ] ) {
			this.callback( sig );
		}
		return this;
	},
	watch: function( sig, callback ) {
		if( !this._callbacks[ sig ] ) this._callbacks[ sig ] = [];
		this._callbacks[ sig ].push( callback );
		
		if( this.is ( sig ) ) {
			this.callback( sig );
		}
		return this;
	},
	callback: function( sig ) {
		var self = this;
		for (var i = 0; i < this._callbacks[ sig ].length; i++) {
			this._callbacks[ sig ][ i ].call( self, sig );
		}
		delete this._callbacks[ sig ];
		return this;
	}
				
};

Next.prototype = {
	_queue: [],
	_queueIndex: 0,
	_lastreturned: null,
	_signal: null,
	next: function( func ) {
		this._queue.push( func );
		return this;
	},
	wait: function() {
		var signalid = Math.random().toString();
		var arglist = [].slice.call( arguments, 0 );
		var addEvDefault = _bind( document.addEventListener, document );
		var removeEvDefault = _bind( document.removeEventListener, document );
		var events = {
			count: {
				successed: 0,
				pending:0
			},
			successed: {},
			pending: {}
		};
		var self = this;
		var _getEventListener = function( ev, removeEvL ) {
			var func = function () {
				if ( events.pending[ ev ] ) {
					events.count.successed++;
					events.count.pending--;
					delete events.pending[ ev ];
					events.successed[ ev ] = arguments;
				}
				removeEvL( ev, func );
				if ( events.count.pending === 0 ) {
					//finally, ...
					//GC
					events = null;
					self._signal.send( signalid );
				}
			};
			return func;
		};
		
		var ev;
		for ( var i = 0; i < arglist.length; i++ ) {
			if ( typeof arglist[ i ] === "string" ) {
				ev = arglist[ i ];
				
				addEvDefault( ev, _getEventListener( ev, removeEvDefault ) );
				
				events.count.pending++;
				events.pending[ ev ] = 1;
			} else if ( arglist[ i ] instanceof Array ) {
				if( arglist[ i ][3] ) {
					if( arglist[ i ][1] ) addEvDefault    = _bind( arglist[ i ][1], arglist[ i ][3] );
					if( arglist[ i ][2] ) removeEvDefault = _bind( arglist[ i ][2], arglist[ i ][3] );
				}
				ev = arglist[ i ][0];
				
				addEvDefault( ev, _getEventListener( ev, _bind( arglist[ i ][2], arglist[ i ][3] ) ) );
				
				events.count.pending++;
				events.pending[ ev ] = 1;
			} else {
				
			}
		}
		
		self.next( function( eventParam, setterParam, nextstep ) {
			self._signal.watch( signalid, function() { this.touch( signalid ); nextstep(); } );
		});
		
		return this;
	},
	getListener: function( setterParam ) {
		var self = this;
		var nextstep = function() {
			if ( self._queueIndex < self._queue.length ) {
				var eventParam = arguments;
				self._queueIndex++;
				self._lastreturned = self._queue[ self._queueIndex - 1 ]( 
					eventParam, setterParam, nextstep, self._lastreturned );
			}
		};
		
		return nextstep;
	},
	go: function(){
		this.getListener()();
		return this;
	}
};

/* Usage:
	var next = new Next;
	next.next( function( eventParam, setterParam, listener ) {
		//...your codes here.
		setterParam[0] === 1; //true
		listener();
	}).next( function( eventParam, setterParam, listener ) {
		//...your codes here.
		//listener();
	});
	$( sth ).on( 'someev', next.getListener( 1 ) );
	
	//or watching 
 */
