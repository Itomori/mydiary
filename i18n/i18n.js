/* events: i18nready, loaderror */
/* MyDiary/i18n.js
 * Version 0.0.2.1218
 */

window.i18nManager = {};

i18nManager.data = {};

i18nManager.default_language = "ja-jp",
i18nManager.user_language = navigator.language.toLowerCase();

i18nManager.load = function( data_url ) {
	var xhr = new XMLHttpRequest;
	xhr.open( "GET", data_url || "i18n/i18ntest.txt", true );
	xhr.send();
	xhr.onreadystatechange = function( ) {
		if( xhr.readyState === 4 && xhr.status === 200 ){
			i18n.data = JSON.parse(xhr.responseText);
			_fire("i18nready");
		}
	}
};
window.i18n = function( name, lang ) {
	if( !lang ) lang = i18nManager.user_language;
	//var ret = "[Error:i18n()] Trying to get '" + name + "'; but nothing.";
	var ret = name;
	if ( i18nManager.data[lang] ) 
		ret = i18nManager.data[lang][name] || i18nManager.data[i18nManager.default_language][name];
	return ret;
};
