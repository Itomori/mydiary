class MyEvent {
	
}

class MultiTask {
	constructor() {
		this._tasks = [];
		this._running = 0;
		this._completed = false;
		return this;
	}
	/**
	 * 添加一个任务。
	 * @param {function():void} func 任务函数
	 */
	add( func ) {
		this._tasks.push[ func ];
	}
	/**
	 * 并行运行。所有任务完成后即返回。
	 * @param {function():void} cb 回调函数
	 */
	run( cb ) {
		let running = [];
		for ( let i = 0; i < this._tasks.length; i++ ) {
			running[i] = i;
			this._running++;
		}
		let makeAsync = ( ptr ) => {
			setTimeout( () => {
				if( running[ ptr ] === ptr ) {
					let func = this._tasks[ ptr ];
					running[ ptr ] = 'running';
					func( () => {
						if( 'running' === runnning[ptr] ) {
							delete running[ ptr ];
							if ( --this._running <= 0) {
								let realCb = cb;
								cb = null;
								this._completed = true;
								if ( realCb ) realCb();
							}
						}
					} );
				}
			}, 0 );
		}
		for ( let i = 0; i < this._tasks.length; i++ ) 
			makeAsync(i);
	}
	/**
	 * 获取正在运行的任务数。
	 * @returns {Number}
	 */
	count(){
		return this._running;
	}
	/**
	 * 返回任务是否已经全部完成。
	 * @returns {Boolean} 
	 */
	completed(){
		return this._completed;
	}
}

class Next {
	constructor () {
		this._queue = [];
		this._queueIndex = 0;
		this._lastreturned = null;
		this._signal = null;
	}
	/**
	 * 设定下一步的
	 */
	next( func ) {
		this._queue.push( func );
		return this;
	}
	wait( ...signals ) {
		var signalid = Math.random().toString();
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
		for ( var i = 0; i < signals.length; i++ ) {
			if ( typeof signals[ i ] === "string" ) {
				ev = signals[ i ];
				
				addEvDefault( ev, _getEventListener( ev, removeEvDefault ) );
				
				events.count.pending++;
				events.pending[ ev ] = 1;
			} else if ( signals[ i ] instanceof Array ) {
				if( signals[ i ][3] ) {
					if( signals[ i ][1] ) addEvDefault    = _bind( signals[ i ][1], signals[ i ][3] );
					if( signals[ i ][2] ) removeEvDefault = _bind( signals[ i ][2], signals[ i ][3] );
				}
				ev = signals[ i ][0];
				
				addEvDefault( ev, _getEventListener( ev, _bind( signals[ i ][2], signals[ i ][3] ) ) );
				
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
	getRunnable: function( setterParam ) {
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
		this.getRunnable()();
		return this;
	}
}