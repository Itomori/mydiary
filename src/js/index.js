window.mydiary = {};
window.$$ = function(selector){
	return document.querySelector(selector);
}

mydiary.vars = {
	topHeadBgAvgColor: "rgb(0,0,0,0)",
	topHeadBg: "url('')",
	diaryBg: {
		"hash-1": "url('')",
		"hash-2": "url('')",
	}
}

mydiary.initSquire = function(toolbar){
	var areaId = "diary-editor";
	var node = document.getElementById(areaId);
	
	//Squire编辑器初始化
	//Squire fix
	Squire.prototype.testPresenceinSelection = function(name, action, format,
		validation) {
		var path = this.getPath(),
		  test = (validation.test(path) | this.hasFormat(format));
		if (name == action && test) {
		  return true;
		} else {
		  return false;
		}
	 };
	mydiary.editor = new Squire(node, {
		blockTag: 'p',
		blockAttributes: { 'class': 'paragraph' },
		tagAttributes: {
			a: { 'target': '_blank' },
		}
	});
	$('#diary-editor-toolbar > i').on('tap', function(e) {
		var editor = mydiary.editor;
		var action = $(this).data('action');

		var test = {
		  value: $(this).data('action'),
		  testBold: editor.testPresenceinSelection('bold',
			action, 'B', (/>B\b/)),
		  testItalic: editor.testPresenceinSelection('italic',
			action, 'I', (/>I\b/)),
		  testUnderline: editor.testPresenceinSelection(
			'underline', action, 'U', (/>U\b/)),
		  testOrderedList: editor.testPresenceinSelection(
			'makeOrderedList', action, 'OL', (/>OL\b/)),
		  testLink: editor.testPresenceinSelection('makeLink',
			action, 'A', (/>A\b/)),
		  testQuote: editor.testPresenceinSelection(
			'increaseQuoteLevel', action, 'blockquote', (
			  />blockquote\b/)),
		  isNotValue: function (a) {return (a == action && this.value !== ''); }
		};

		editor.alignRight = function () { editor.setTextAlignment('right'); };
		editor.alignCenter = function () { editor.setTextAlignment('center'); };
		editor.alignLeft = function () { editor.setTextAlignment('left'); };
		editor.alignJustify = function () { editor.setTextAlignment('justify'); };
		editor.makeHeading = function () { editor.setFontSize('2em'); editor.bold(); };

		if (test.testBold | test.testItalic | test.testUnderline | test.testOrderedList | test.testLink | test.testQuote) {
		  if (test.testBold) editor.removeBold();
		  if (test.testItalic) editor.removeItalic();
		  if (test.testUnderline) editor.removeUnderline();
		  if (test.testLink) editor.removeLink();
		  if (test.testOrderedList) editor.removeList();
		  if (test.testQuote) editor.decreaseQuoteLevel();
		} else if (test.isNotValue('makeLink') | test.isNotValue('insertImage') | test.isNotValue('selectFont')) {
		  // do nothing these are dropdowns.
		} else {
			console.log(action);
			editor[action]();
			editor.focus();
		}
	 });
};

$(function(){
	//监听返回按钮
	var backButtonActionStack = [ 'quit', 'confirmquit' ];
	var quitEventTimeoutH = function(){
		backButtonActionStack.push( 'confirmquit' );
	}
	var backbuttonEvListener = function() {
		var currentStat = backButtonActionStack.pop();
		switch ( currentStat ) {
			case 'quit':
				plus.runtime.quit();
				console.log('quit');
				break;
			case 'confirmquit':
				Compat.toast( "再按一次退出", {
					duration: 'short'
				} );
				setTimeout( quitEventTimeoutH, 2000 );
				break;
			default:
				Compat.toast( "并不知道要干什么，返回键状态：" + currentStat, {
					duration: 'short'
				} );
				break;
		}
	};
	
	mui.init({
		swipeBack: false,
		back: backbuttonEvListener,
		gestureConfig: {
			longtap: true
		}
	});
	
	mydiary.initSquire('#diary-editor-toolbar');
	
	var hidecategory_height = 45;
	var normal_height = 61;
	
	/*	Immersed Mode
		Modified from http://ask.dcloud.net.cn/article/422
		RUNS BEFORE `segmented control`
	*/
	(function(){
		var immersed = 0;
		var ms = (/Html5Plus\/.+\s\(.*(Immersed\/(\d+\.?\d*).*)\)/gi).exec(navigator.userAgent);
		if( ms && ms.length >= 3 ){ // 当前环境为沉浸式状态栏模式
		    immersed=parseFloat(ms[2]);// 获取状态栏的高度
		}
		hidecategory_height += immersed;
		normal_height += immersed;
		$("#immersed_padding").css({height: immersed, width: "100%"});
		$("#mainContent").css({
			"margin-top": hidecategory_height,
			"height": "calc(100% - " + hidecategory_height + "px)"
		});
		/*$("#entries").css({
			"margin-top": (normal_height - hidecategory_height)
		});*/
		$("#mycard").css({
			"padding-top": immersed
		});
	})();
	
	
	/*Segmented Control*/
	var listenerSegCtrl = function(e){
		var href = $(e.target).attr("href");
		if( href !== "#entries-card" ) {
			$("#mainScWrapper").css({
				height: hidecategory_height
			});
			$("#mainScWrapper .category").fadeOut( 200 );
		} else {
			$("#mainScWrapper").css({
				height: normal_height
			});
			setTimeout(function(){
				 if( $("#mainSegmentedControl > .mui-active").attr("href") === "#entries-card" ) $("#mainScWrapper .category").fadeIn( 200 ); 
				 //fix high-speed switching bug
			}, 300);
		}
	}
	$("#mainSegmentedControl > a").on("tap", listenerSegCtrl);
	//triggers it first
	listenerSegCtrl({ target: $("#mainSegmentedControl .mui-active")[0] });
	
	/*Entries Page funcs*/
	/*calc avg color*/
	(function() {
		//http://stackoverflow.com/questions/14013131/javascript-get-background-image-url-of-div
		var entries_bgurl = $(".entries-bg").css('background-image').slice(4, -1).replace(/"/g, "");
		console.log(entries_bgurl);
		
		var img = document.createElement('img');
		var overall_rgb;
		img.onload = function(){
			overall_rgb = utils.getAverageRGB( img );
			var F = 0.68;
			/*var R = 255 - ~~( (overall_rgb.r - 127) * F + 127 ),
				G = 255 - ~~( (overall_rgb.g - 127) * F + 127 ),
				B = 255 - ~~( (overall_rgb.b - 127) * F + 127 );
			$(".cstyle-bw-inv").css( { color: utils.fstr( 'rgb(${r}, ${g}, ${b})', { r: R, g: G, b: B } )} );*/
			//test
			
			//end
			//or
			var Y = ~~(0.2126 * overall_rgb.r + 0.7152 * overall_rgb.g + 0.0722 * overall_rgb.b);
			Y = 255 - ~~( (Y - 127) * F + 127 );
			$(".cstyle-bw-inv").css( { color: utils.fstr( 'rgb(${r}, ${g}, ${b})', { r: Y, g: Y, b: Y } )} );
		};
		img.src = entries_bgurl;
		$("#deep_dark")[0].appendChild( img );
	})();
	
	//Calendar Page funcs
	(function(){
		var _date = new Date;
		var monthNlList = [ 'zeroary', 'january', 'february', 'march', 'april', 'may', 'june', 
				'July', 'August', 'September', 'October', 'November', 'December' ];
		var dayOfWeekNlList = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
		var currDate = {
			month: _date.getMonth() + 1,
			monthNl: monthNlList[ _date.getMonth() + 1],
			date: _date.getDate(),
			dayOfWeek: _date.getDay(),
			dayOfWeekNl: dayOfWeekNlList[ _date.getDay() ],
		};
		$("#calendar-main > .month").html( currDate.monthNl );
		$("#calendar-main > .date").html( currDate.date );
		$("#calendar-main > .dayofweek").html( currDate.dayOfWeekNl );
	})();
	//for desktop, it doesnt run.
  	mui.plusReady(function(){
  		//plus.storage.setItem("lauchFlag", "true");plus.storage.getItem("lauchFlag")
  		
  		//Bind event listeners.
  		/*plus.key.addEventListener( 'backbutton', backbuttonEvListener, false );*/
  		//section lock-orientation
  		plus.screen.lockOrientation("portrait-primary");
  		
  		//设置窗口样式
  		plus.webview.currentWebview().setStyle( { softinputMode: "adjustResize" } );
  		
  		//滚动条修复
  		var scrollTimer = null;
		plus.webview.currentWebview().setStyle( {scrollIndicator: "none" } );
		document.addEventListener( "scroll", function(){
			plus.webview.currentWebview().setStyle( { scrollIndicator: "vertical" } );
			if( scrollTimer ) clearTimeout( scrollTimer );
			scrollTimer = setTimeout( function() {
				plus.webview.currentWebview().setStyle( {scrollIndicator: "none" } );
			}, 1000);
		});
  		
  		/*plus.geolocation.getCurrentPosition( function ( p ) {
			alert( "Geolocation\nLatitude:" + p.coords.latitude + "\nLongitude:" + p.coords.longitude + "\nAltitude:" + p.coords.altitude );
		}, function ( e ) {
			alert( "Geolocation error: " + e.message );
		} );*/
  		//section final-close-splash

  		
  		plus.navigator.closeSplashscreen();
  		
  		
  	});
});