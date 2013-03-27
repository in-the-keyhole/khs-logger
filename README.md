khs-logger.js
=============

JavaScript logging library with support for remote logging. 

Visual Backbone.js View/Template inspector. Inspect and outline Backbone.js Views for developer support.


Getting Started
---------------

Download latest release here [https://github.com/in-the-keyhole/khs-logger/archive/0.0.5.zip] unzip in JavaScript folder

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
     
Before send call back function, so you can manipulate request headers

     $.Log.beforeSend = function(xhr,opts) { // to stuff, ie. add security token is necessary};     
     
Capture all errors and log to remote end point                   
  
     window.onerror = function(message, url, linenumber) {
		$.Log.error(message+"line:"+linenumber+"url:"+url);
	 }


View Inspector
--------------
Inspect divs - really helpful with Backbone.js Views and HTML templates, as it visually shows View/Template boundaries. Here's how to apply:

Mousing over divs outlines and displays information by hitting CRTL ENTER. Open Inspector View with DBL Click. See screen shot below.
View inspector has been enabled at this site [http://cgrok.com], give it a try...

![My image](https://raw.github.com/in-the-keyhole/khs-logger/master/screen.png)


Turn inspector on

     $.Log.inspect(); // active outliner with CTRL-ENTER, open inspector with DBL CLICK

Mark and display a DIV on mouseover... 

     $.Log.mark(<div>,<message>,<optional JSON object>);
     
Example applied to Backbone.js View with $.Log.mark(...) 
     
     ...
     render : function(eventName) {
			var compiled_template = _.template(Template);
			this.$el.html(compiled_template(this.model.toJSON()));
                        $.Log.mark(this.$el,"navBarCatRefView.js -> navbar-cateory-reference.html",this.model.toJSON());	
			return this;
	 }, ..

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




