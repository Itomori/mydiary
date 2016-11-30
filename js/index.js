window.mydiary = {};
window.$$ = function(selector){
	return document.querySelector(selector);
}

mydiary.initSquire = function(toolbar){
	var areaId = "diary-editor";
	var node = document.getElementById(areaId);
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

(function(){
	mui.init();
	
	mydiary.initSquire('#diary-editor-toolbar');
	
	//Calendar Page funcs
	(function(){
		var _date = new Date;
		var monthNlList = [ 'Zeroary', 'January', 'February', 'March', 'April', 'May', 'June', 
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
  		
  		//section lock-orientation
  		plus.screen.lockOrientation("portrait-primary");
  		
  		
  		//section final-close-splash
  		plus.navigator.closeSplashscreen();
  		
  		
  		
  	});
})();