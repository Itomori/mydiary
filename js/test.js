$(function(){
	var xhr = new XMLHttpRequest();
	xhr.open( 'GET', 'font/diarysans/DiarySans-Light.ttf', true );
	xhr.responseType = 'arraybuffer';
	
	xhr.onload = function(e){
		if ( this.status === 200 ) {
			var uInt8Array = new Uint8Array(this.response);
			var base64 = window.btoa( )
		}
	}
})
