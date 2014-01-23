khs-logger.js
=============

JavaScript logging library with support for remote logging. 

Visual Backbone.js View/Template inspector. Inspect and outline Backbone.js Views for developer support.


Getting Started
---------------

Download latest minified version here [https://github.com/in-the-keyhole/khs-logger/blob/master/lib/khs.logger.min.js]

Or, install using Bower with the package name khs-logger
	
Load using script tags, jQuery is the only required dependency

     <script>lib/khs-logger.js</script>
     
Or as require.js AMD module


	 paths : {
		...
		'jquery' : 'libs/jquery-1.7.2',
		'log' : 'libs/khs.logger'
	 },
	 shim: {
		//khs-logger depends on jQuery
		'log':['jquery']
	 }

#####Note: khs-logger is a true AMD module, and can be loaded this way if desired:
	 require( ["libs/khs-logger"], function(logger) {
		logger.info("loaded with AMD");
	 }

Logging
-------
Here's how to apply formatted log messages in your application... 

     // Log expressions 
     $.Log.info("Log an info message");
     
     $.Log.debug("Log a debug message");
            
     $.Log.warn("Log a warn message");
     
     $.Log.error("Log an error message");
          
Set log level (valid levels log,info,debug,warn,error)
 
     $.Log.level = $.LogLevel.debug;    
     
Here's an example output screen shot...

![My image](https://raw.github.com/in-the-keyhole/khs-logger/master/log.png)
 
Logging to remote API
---------------------
Define remote logging URL to POST logs to server side endpoint
 
     $.Log.remoteUrl = "sherpa/log;  //restful url POSTS log message string
      
Set remote logging level

     $.Log.remoteLevel = $.LogLevel.error; // errors will be posted to remoteUrl
     
Before send call back function, so you can manipulate request headers

     $.Log.beforeSend = function(xhr,opts) { // to stuff, ie. add security token is necessary};     
     
Capture all JavaScript errors and log to remote end point                   
  
     window.onerror = function(message, url, linenumber) {
		$.Log.error(message+"line:"+linenumber+"url:"+url);
	 }
	 
Pulling Log Settings from a server
----------------------------------
Client log settings can be changed remotely with a restful API that returns the following JSON payload.

	// JSON that sets log levels
	{ logLevel: 2, remoteLogLevel: 2, prefix: 'hello world', remoteUrl: }
	
Client application points to this API with the following settings in JavaScript 

	$.Log.pullSettingsUrl = 'api/log/pullsettings';
	
Server API is accessed and settings pulled from client with the following key strokes

	CTRL-P   Pulls server side log settings 
	
Pull key value can be changes with the following expression 

	$.Log.pullSettingsKeyCode = 79;   // change pull key to CTRL-O	
	
Prefix log output
-----------------
Prefix logging output with user and application name 

    $.Log.prefix = "DPITT:TIMESHEET"; 
    
Prefix logging output with browser GEO location data

	        var longitude;
	        var lattitude;
			var showPosition = function(position) { 
			    longitude = position.coords.latitude;
			    lattitude = position.coords.longitude;
			};
			navigator.geolocation.watchPosition(showPosition);

			$.Log.prefix = function() { 
                       return longitude + ":"+ lattitude; }; // prefix log statements with browser location


DIV Inspector
--------------
Inspect divs - really helpful with Backbone.js Views and HTML templates, as it visually shows View/Template boundaries. Here's how to apply:

Mousing over divs outlines and displays information by hitting CRTL ENTER. Open Inspector View with DBL Click. See screen shot below.
View inspector has been enabled at this site [http://cgrok.com], give it a try...

![My image](https://raw.github.com/in-the-keyhole/khs-logger/master/screen.png)


Turn inspector on, do this during startup

     $.Log.inspect(); // active outliner with CTRL-ENTER, open inspector with DBL CLICK

Mark and display a DIV on mouseover...apply to controllers or view regions of your UI. 

     $.Log.mark(<div>,<message>,<optional JSON object>);
     
Example applied to Backbone.js View with $.Log.mark(...) 
     
     ...
     render : function(eventName) {
			var compiled_template = _.template(Template);
			this.$el.html(compiled_template(this.model.toJSON()));
			// Mark this DIV
            $.Log.mark(this.$el,"navBarCatRefView.js -> navbar-cateory-reference.html",this.model.toJSON());	
			return this;
	 }, ..

Model Dumper
------------
Models for all marked DIVS can be displayed in a separate TAB or Window by toggling the inspector with CTRL-ENTER, then CTRL-M will open a
new tab and display JSON models for a view. They appear in an editable text area so you grab the JSON if you want. 


Custom Inspectors
-----------------
Custom inspectors can be defined to display information in the View inspection window. A custom inspector is defined as a function closure
that accepts a DOM DIV element for a View. Here's an example hello world inspector definition and installation:

     $.Log.install(function(el) { return "Hello World, there are "+el.children().length+" elements"; }  );

Custom inspector will appear in the inspector View when opened with a DBL-CLICK. Here's a screen shot:

![My image](https://raw.github.com/in-the-keyhole/khs-logger/master/inspector.png)


Local Storage Logging
---------------------
Log entries can be stored in a local storage bucket. This can be useful for troubleshooting user problems. 

Turn on local storage

     $.Log.logLocal = true; // default is false 
     
Set number of records stored in local storage

     $.Log.logLength = 200; // default is 100

     
Local Storage inspector is available and can be installed

      $.Log.install($.Log.localStorageLogInspector()); // install local storage inspector

Screen shot of localStorageLog inspector

![My image](https://raw.github.com/in-the-keyhole/khs-logger/master/local-inspector.png)




