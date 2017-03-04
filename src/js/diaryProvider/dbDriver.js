window.dbDriver = {};
var _dbDriverVersion = "0.0.0.2.1218";
var _dataStructVersion = "0.0.2.1218";

//MUST BE RUN AFTER `plusready`
dbDriver.checkAndInit = function() {
	var DBDRVINF = null;
	if ( !(DBDRVINF = plus.storage.getItem("__DBDRVINF")) ) {
		console.log("[dbDriver.checkAndInit] info: first run??? meow???");
	}
}
