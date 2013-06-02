var Appender = require("./appender.js");

var ConsoleAppender = module.exports = exports =  function(){};

ConsoleAppender.prototype = Object.create(Appender.prototype);

ConsoleAppender.prototype.append = function(message){
	console.log(message);
};