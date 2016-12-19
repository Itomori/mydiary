/* events: i18nready, loaderror */

window.i18n = {};

i18n.data = {};

i18n.load = function( data_url ) {
	var xhr = new XMLHttpRequest;
	xhr.open( "GET", "i18n/i18n.txt", true );
	xhr.send();
	xhr.onreadystatechange = function( ) {
		if( xhr.readyState === 4 && xhr.status === 200 ){
			i18n.data = JSON.parse(xhr.responseText);
		}
	}
}
