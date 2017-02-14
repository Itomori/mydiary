var Scroll = function(){
	return this;
}

Scroll.prototype = {
	scrollableElem: null,
	loadingElem: null,
	scrollEventElem: null,
	scrollStatus: {
		initialized: false,
		scrolling: false,
		refreshing: false,
		animationRunning: false,
		touchStart: 0,
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
	init: function( scrollEventElem, scrollableElem, loadingElem ) {
		if ( this.scrollStatus.initialized ) return this;

		this.scrollableElem = scrollableElem;
		this.loadingElem = loadingElem;

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

			var x = touch.pageY - touchStart;

			var y = self.scrollAlgo(x);
			typeof y === "number" ? ( self.scrollableElem.style.top = y, self.onscrolling( self.scrollEventElem, self.scrollableElem, self.loadingElem ) ) : void 0;
		}, false );

		this.scrollEventElem.addEventListener( 'touchend', function( event ) {
			self.scrollStatus.touchStart = 0;
			self.onscrollend( self.scrollableElem.offsetTop, self.scrollEventElem, self.scrollableElem, self.loadingElem );
		}, false );
	}
}
/*var scroll = document.querySelector('#entries-wrapper');
   var outerScroller = document.querySelector('#entries-wrapper');
   var touchStart = 0;
   var touchDis = 0;
   outerScroller.addEventListener('touchstart', function(event) { 
        var touch = event.targetTouches[0]; 
        // 把元素放在手指所在的位置 
           touchStart = touch.pageY; 
           console.log(touchStart);
        }, false);
   outerScroller.addEventListener('touchmove', function(event) { 
        var touch = event.targetTouches[0]; 
        console.log(touch.pageY + 'px');  

		var x = /*scroll.offsetTop + *touch.pageY-touchStart;
		if(x>0) {
			var y, t1, t2;
			t1 = Math.sqrt(x)*3.27;
			t2 = x*0.65;
			y = t1 > t2 ? t2 : t1;
			scroll.style.top = y + 'px';
		} else if ( x < 0 ) {
			x = 0-x;
			var y, t1, t2;
			t1 = Math.sqrt(x)*3.27;
			t2 = x*0.65;
			y = t1 > t2 ? t2 : t1;
			y = 0-y;
			scroll.style.top = y + 'px';
		}
		console.log('y', y);
        /*touchStart = touch.pageY;*
        touchDis = touch.pageY-touchStart;
        }, false);
   outerScroller.addEventListener('touchend', function(event) { 
        touchStart = 0;
        var top = scroll.offsetTop;
        if(top>70)refresh();
        if(top>0){
            var time = setInterval(function(){
              scroll.style.top = scroll.offsetTop -2+'px';
			  if(scroll.offsetTop<=0){clearInterval(time);scroll.style.top = "0px;"}
            },1)
        } else if ( top < -70 ) {
			console.log("next");
			
		}
        if ( top < 0 ) {
            var time = setInterval(function(){
              scroll.style.top = scroll.offsetTop +2+'px';
			  if(scroll.offsetTop>=0){clearInterval(time);scroll.style.top = "0px;"}
            },1)
        }
    }, false);
   function refresh(){
        console.log("refreshing");
   }*/
//test
var sc = new Scroll();
sc.init( document.querySelector('#entries-wrapper'), document.querySelector('#entries'), null );
sc.bindEvents();
sc.onscrolling = function( top ) {
	console.log( top );
};
sc.onscrollend = function( top, lis, scroll, lo ) {
	if(top>70)refresh();
	if(top>0){
		var time = setInterval(function(){
			scroll.style.top = scroll.offsetTop -2+'px';
			if(scroll.offsetTop<=0){clearInterval(time);scroll.style.top = "0px"}
		},1)
	} else if ( top < -70 ) {
		console.log("next");
		
	}
	if ( top < 0 ) {
		var time = setInterval(function(){
			scroll.style.top = scroll.offsetTop +2+'px';
			if(scroll.offsetTop>=0){clearInterval(time);scroll.style.top = "0px"}
		},1)
	}
}
function refresh(){
        console.log("refreshing");
   }