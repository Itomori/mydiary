/* events: i18nready, loaderror */
/* MyDiary/i18n.js
 * Version 0.0.2.1218
 */

window.i18n = {};

i18n.data = {};

i18n.default_language = "ja-jp",
i18n.user_language = navigator.language.toLowerCase();

i18n.load = function( data_url ) {
	var xhr = new XMLHttpRequest;
	xhr.open( "GET", "i18n/i18n.txt", true );
	xhr.send();
	xhr.onreadystatechange = function( ) {
		if( xhr.readyState === 4 && xhr.status === 200 ){
			i18n.data = JSON.parse(xhr.responseText);
			_fire("i18nready");
		}
	}
};
i18n.get = function( name, lang ) {
	if( !lang ) lang = i18n.user_language;
	return ( ( i18n.data[ lang ] ? ( i18n.data[ lang ][name] || void 0 ) : void 0 )  || i18n.data[ i18n.default_language ][name] )
	|| "[i18n.get] Error: " + name + ", in " + lang + ".";
};
