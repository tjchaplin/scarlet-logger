var Scarlet = require("scarlet");
var LogInterceptor = require("./log-interceptor.js");

var ScarletLogger = module.exports = exports = function(){
	var self = this;

	self.logInterceptor = new LogInterceptor();
};

ScarletLogger.prototype.appender = function(appender){
	var self = this;

	if(appender)
		self.logInterceptor.appender = appender;

	return self;
};

ScarletLogger.prototype.bindTo = function(objectToLog){
	var self = this;
	if(!objectToLog)
		throw new Error("Object to bind must be defined");

	Scarlet.register(self.logInterceptor.log).forObject(objectToLog);
};

ScarletLogger.prototype.unBind = function(){
	Scarlet.resetAll();
};

ScarletLogger.prototype.info = function(message){this.logInterceptor.info(message);};
ScarletLogger.prototype.debug = function(message){this.logInterceptor.debug(message);};
ScarletLogger.prototype.error = function(message){this.logInterceptor.error(message);};