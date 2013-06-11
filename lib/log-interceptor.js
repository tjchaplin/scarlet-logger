var Interceptor = require("scarlet").Interceptor;
var consoleAppender = require("./console-appender");

var LogInterceptor = module.exports = exports = function(appender){
	var self = this;
	if(!appender)
		appender = new consoleAppender();

	self.appender = appender;

	return self;
};

LogInterceptor.prototype.intercept = function(invocation){
	var self = this;
	
	try{
		self.debug(invocation.method.toString()+"\narguments:"+JSON.stringify(invocation.paramaters)+"");
		
		var startTime = new Date();
		var result = invocation.proceed();
		var endTime = new Date();

		self.debug("return:"+JSON.stringify(result));
		self.debug("execution time("+getFormatedTimeSpan(startTime,endTime)+")");
		
		return result;
	}
	catch(exception){
		self.error(exception);
		throw exception;
	}
};

LogInterceptor.prototype.error = function(exception){
	var self = this;
	var message = message+"\n"+exception.stack;
	self.appender.append(self.format(new Date(),message,"Error"));
};

LogInterceptor.prototype.debug = function(message){
	var self = this;
	self.appender.append(self.format(new Date(),message,"Debug"));
};

LogInterceptor.prototype.info = function(message){
	var self = this;
	self.appender.append(self.format(new Date(),message,"Info"));
};

LogInterceptor.prototype.format = function(time,message,logType){
	return "["+time+"] - "+logType+" - "+message;
};

var getFormatedTimeSpan = function(fromDateTime,toDateTime){
    var milliSecondDifference = Math.abs(fromDateTime-toDateTime);
    var secondsDifference = Math.round(milliSecondDifference/1000);
    var minutesDifference = Math.round(secondsDifference/60);
    var hourDifference = Math.round(minutesDifference/60);

    return hourDifference+":"+minutesDifference+":"+secondsDifference+"."+milliSecondDifference;
};