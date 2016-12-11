var utils = {};

var _toStringEx = function( obj ) {
	if (typeof obj !== "string" ) return JSON.stringify( obj );
}
utils.fstr = function( str, params ) {
	var $regex = /\${([^\}]*)\}/mg;

	return str.replace($regex, function( oriStr, index, strIndex ) {
		return _toStringEx(params[ index ] || "");
	});
};

window.utils = utils;
