//TODO: 算法！！！！！！！
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