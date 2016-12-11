window.Compat = {};
Compat = {
	tryCode: function() {
		var codes = [].slice.call( arguments, 0 );
		for( var i = 0; i < codes.length; i++ ) {
			try {
				codes[ i ]();
			} catch( e ) {}
		}
	},
	quit: function(){
		Compat.tryCode( function() {
			plus.runtime.quit();
		}, function() {
			window.close();
		} );
	},
	toast: function( param1, param2 ){
		Compat.tryCode( function() {
			plus.runtime.quit( param1, param2 );
		} );
	},
}
