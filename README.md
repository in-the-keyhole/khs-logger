khs-logger
==========

Java script logging framework with support for remote logging and visual debugging support

Logging
-------
Formatted log messages to your applications using log levels... 

     // Log expressions 
     $.Log.info("Log an info message");
         
     // debug 
     $.Log.debug("Log a debug message");
          
Set log level (valid levels log,info,debug,warn,error)
 
     $.Log.level = $.LogLevel.debug;    
 
Define remote logging URL
 
     $.Log.remoteUrl = "sherpa/log;  //restful url from origin <origin>/sherpa/log{message}
      
Set remote logging level

     $.Log.remoteLevel = $.LogLevel.error;
     
Capture all errors and log to remote end point                   
  
     window.onerror = function(message, url, linenumber) {
		$.Log.error(message+"line:"+linenumber+"url:"+url);
	 }

Dependencies
------------
Logging framework require JQuery.js 

Visual Logging
--------------
Visual Logging, really helpful trying to determine view component boundaries, here's how to apply.

Component <div> are outlined and information displayed as you mouse over them, see example screen shot below.

![My image](https://raw.github.com/in-the-keyhole/khs-logger/master/screen.png)
