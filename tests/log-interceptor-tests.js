var should = require('should');
var LogInterceptor = require("../lib/log-interceptor.js");

function interceptorContext(){
	var self = this;
	self.logMessage = undefined;
	self.error = undefined;
	self.methodHasBeenCalled = false;
	self.debugHasBeenCalled = false;
	self.errorHasBeenCalled = false;

	self.logInterceptor = new LogInterceptor();
	var invocation = {method:function(){self.methodHasBeenCalled = true;},
						parameters:[],
						proceed:function(){}
					};

	self.invoke = function(methodToCall,parameters){
		if(!parameters)
			parameters = [];

		invocation.proceed = function(){return methodToCall.apply(self,parameters);};
		invocation.parameters = parameters;
		return self.logInterceptor.intercept(invocation);
	};

	self.logInterceptor.debug = function(message){self.debugHasBeenCalled = true; self.logMessage = message;};
	self.logInterceptor.error = function(error){self.errorHasBeenCalled = true; self.error = error;};

	return self;
}

describe('Given using a log interceptor',function(){
	describe('When has a method to log',function(){
		var context = new interceptorContext();
		function function1(){}

		function1.prototype.add1 = function(value){
			if(!value)
				value = 1;
			return value+1;
		};

		it("should call debug log",function(onComplete){
			var objectToLog = new function1();	

			context.invoke(objectToLog.add1);
			context.debugHasBeenCalled.should.be.eql(true);
			onComplete();
		});
	});

	describe('When has a method to log with parameters',function(){
		var context = new interceptorContext();
		function function1(){}
		function1.prototype.add1 = function(value){
			if(!value)
				value = 1;

			return value+1;
		};

		it("should call debug log",function(onComplete){
			var objectToLog = new function1();	
			var result = context.invoke(objectToLog.add1,[2]);
			result.should.be.eql(3);
			onComplete();
		});
	});
	describe('When method to log throws an exception',function(){
		var context = new interceptorContext();
		var errorFunction = function(){throw new Error("Something bad happened."); };
		var didThrowError = false;
		var thrownException;
		try{
			context.invoke(errorFunction);
		}catch(exception){
			didThrowError = true;
			thrownException = exception;
		}	
		it("should throw error",function(onComplete){
			didThrowError.should.be.eql(true);
			onComplete();
		});

		it("should call error log",function(onComplete){
			context.errorHasBeenCalled.should.be.eql(true);
			onComplete();
		});

		it("error should be in error message",function(onComplete){
			context.error.toString().indexOf(thrownException).should.be.greaterThan(-1);
			onComplete();
		});
	});
});