window.mydiary = {};
window.$$ = function(selector){
	return document.querySelector(selector);
}

mydiary.initSquire = function(toolbar){
	var areaId = "diary-editor";
	var node = document.getElementById(areaId);
	mydiary.editor = new Squire(node, {
		blockTag: 'p',
		blockAttributes: { 'class': 'paragraph' },
		tagAttributes: {
			a: { 'target': '_blank' },
		}
	});
	mui('#diary-editor-toolbar').on('click', function(e) {
		var editor = mydiary.editor;
		//var action = this.data('action');
		console.log(e, this);

		/*test = {
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
			editor[action]();
			editor.focus();
		}*/
	 });
	$$(toolbar).addEventListener('tap', function(e){
		var id = e.target['id'],
			value;
			console.log(id);
	});
};

(function(){
	mui.init();
	
	mydiary.initSquire('#diary-editor-toolbar');
	//for desktop, it doesnt run.
  	mui.plusReady(function(){
  		//plus.storage.setItem("lauchFlag", "true");plus.storage.getItem("lauchFlag")
  		
  		//section lock-orientation
  		plus.screen.lockOrientation("portrait-primary");
  		
  		
  		//section final-close-splash
  		plus.navigator.closeSplashscreen();
  		
  		
  		
  	});
})();