#!/bin/env/Node

/* usage: ./compile_i18n.js <input_files> <output_file> <input_encoding> <output_encoding>
	<input_files>: uses separator ;

*/

var iconv = require("iconv-lite");

function error(msg) {
	console.error(msg);
	process.exit(1);
};
function merge( dst/*:Object*/, src ) {
	for( var o in src ) {
		dst[o] = src[o];
	}
};

var input_file = process.argv[2].split(";"),
	output_file = process.argv[3],
	input_encoding = (process.argv[4] || "utf-8").split(";"),
	output_encoding = process.argv[5] || "utf-8";

var parsed_data = {};

for( var ifile_ptr = 0; ifile_ptr < input_file.length; ifile_ptr++ ) {
	var file;
	try{
		file = require("fs").readFileSync( input_file[ifile_ptr] );
	}catch(e){
		error( "Error reading input file '" + input_file[ifile_ptr] + "': " + e.message );
	}
	var EOL = "\r\n";
	for( var i = 0; i < file.length; i++ ) {
		if ( file[i] === 0x0d ) {
			if( i < file.length-1 && (file[i+1] === 0x0a || ( file[i+1] === 0x00 && file[i+2] === 0x0a )) ) {
				EOL = "\r\n";
				break;
			} else {
				EOL = "\r";
			}
		}
		if ( file[i] === 0x0a ) {
			EOL = "\n";
		}
	}
	file  = iconv.decode(file, input_encoding[ifile_ptr] || "utf-8", {stripeBOM: true}).split(EOL);

	var result = {
		props: {},
		data: {}
	};

	for( var i = 0; i < file.length; i++ ) {
		var line = file[i], temp;
		if( temp = /^\$(.*?):(.*?)$/.exec(line) ) 
			result.props[ temp[1] ] = temp[2]; 
		else if ( temp = /^(.*?):(.*?)$/.exec(line) ) 
			result.data[ temp[1] ] = temp[2];
	}
	
	//check validity
	if ( !result.props.language ) error("Error: Property '$language' is not given in file " + input_file[ifile_ptr] + ".\r\nThis may caused by a wrongly specified encoding to the file.");

	if( !parsed_data[result.props.language] ) parsed_data[result.props.language] = {};
	merge(parsed_data[result.props.language], result.data);
}
require("fs").writeFileSync(output_file, JSON.stringify(parsed_data), output_encoding);