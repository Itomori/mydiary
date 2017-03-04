var Scroll = function(){
	return this;
}

Scroll.prototype = {
	scrollEventElem: null,
	scrollStatus: {
		initialized: false,
		scrolling: false,
		refreshing: false,
		animationRunning: false,
		touchStart: 0,
		y: 0
	},
	onscrolling: function( top ) {
		//nothing
	},
	onscrollend: function( top ) {
		//nothing
	},
	scrollLimit: {
		lowerToUpper: 0, //abs value
		upperToLower: 0
	},
	scrollAlgo: function( x, l2uLimit, u2lLimit ) {
		var y = 0, t1, t2;

		if( x > 0 ) {
			t1 = Math.sqrt( x ) * 3.27;
			t2 = x * 0.65;
			y = t1 > t2 ? t2 : t1;
			if ( u2lLimit > 1 && y > u2lLimit ) y = u2lLimit;
		} else if ( x < 0 ) {
			x = 0 - x;
			t1 = Math.sqrt( x )*3.27;
			t2 = x * 0.65;
			y = t1 > t2 ? t2 : t1;
			if ( l2uLimit > 1 && y > l2uLimit ) y = l2uLimit;
			y = 0 - y;
		}

		return y;
	},
	/* init Scroll.
	 * @author Akimoto Akari
	 * @param {HTMLElement} scrollableElem
	 * @param {HTMLElement} loadingElem
	 */
	init: function( scrollEventElem ) {
		if ( this.scrollStatus.initialized ) return this;

		this.scrollEventElem = scrollEventElem;

		this.scrollStatus.initialized = true;
		return this;
	},
	l2uLimit: function( limit ) {
		return ( 'number' === typeof limit ) ? (this.scrollLimit.lowerToUpper = limit, this) : this.scrollLimit.lowerToUpper;
	},
	u2lLimit: function( limit ) {
		return ( 'number' === typeof limit ) ? (this.scrollLimit.lowerToUpper = limit, this) : this.scrollLimit.lowerToUpper;
	},
	bindEvents: function( ) {
		var self = this;

		this.scrollEventElem.addEventListener( 'touchstart', function( event ) { 
			var touch = event.targetTouches[0]; 
			self.scrollStatus.touchStart = touch.pageY; 
		}, false );

		this.scrollEventElem.addEventListener( 'touchmove', function( event ) {
			var touch = event.targetTouches[0]; 

			var x = touch.pageY - self.scrollStatus.touchStart;

			var y = self.scrollAlgo(x);
			self.scrollStatus.y = y;
			if( typeof y === "number" ) 
				self.onscrolling( y );
		}, false );

		this.scrollEventElem.addEventListener( 'touchend', function( event ) {
			self.scrollStatus.touchStart = 0;
			self.onscrollend( self.scrollStatus.y );
			self.scrollStatus.y = 0;
		}, false );
	}
}
//test
$(function(){var sc = new Scroll();
sc.init( document.querySelector('#entries-wrapper') );
sc.bindEvents();
sc.u2lLimit(70);
sc.onscrolling = function( top ) {
	console.log( top );
};
sc.onscrollend = function( top ) {
	if(top>70)refresh();
	if(top>0){
		
	} else if ( top < -70 ) {
		console.log("next");
		
	}
	if ( top < 0 ) {
		
	}
}
function refresh(){
        console.log("refreshing");
   }
});