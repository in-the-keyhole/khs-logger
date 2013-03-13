khs-logger.js
=============

Java script logging framework with support for remote logging and view component logging.

Geting Started
--------------

Download latest release here [https://github.com/in-the-keyhole/khs-logger/archive/0.0.1.zip] unzip in java script folder

Load using srcript tags, jQuery is the only required dependency

     <script>lib/khs-logger.js</script>
     
Or as require.js AMD module

     paths : {
		'underscore' : 'libs/underscore/underscore-loader',
		'backbone' : 'libs/backbone/backbone-loader',
		'text' : 'libs/require/require-text-2.0.0',
		'jquery' : 'libs/jquery-1.7.2',
		'log' : 'libs/khs.logger'
     },
     

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


View Inspector
--------------
Inspect div's, really helpful with Backbone.js views and html templates, visually shows view/template boundaries, here's how to apply.

Turn inpsector on/off

     $.Log.annotate = true;

Mark and display a DIV on mouse over... 

     $.Log.mark(<div>,<message>,<optional JSON object>);
     
Example applied to backgone.js view
     
     ...
     render : function(eventName) {
			var compiled_template = _.template(Template);
			var $el = $(this.el);
			$el.html(compiled_template(this.model.toJSON()));
			$.Log.mark($el,"navBarCatRefView.js -> navbar-cateory-reference.html",this.model.toJSON());	
			return this;
	 }, ..

Mousing over div's outlines and displays information, see screen shot below.

![My image](https://raw.github.com/in-the-keyhole/khs-logger/master/screen.png)
