(function ($) {
	
	
   // IE 8,9 console work around
   if (!window.console) window.console = {};
   if (!window.console.log) window.console.log = function () { };
	
  $.LogLevel = { trace: 1, debug : 2, info: 3, warn: 4, error : 5, fatal: 6};

  $.Log = {
	
		  annotate: true, // outline and annotate view <div>
		  
		  level: $.LogLevel.info, // default
		  
		  remoteLevel: $.LogLevel.error, // default error
		  
		  color: "#FF0000",  // red
	
		  info: function(message) { 
			  
			  if (this.level <= $.LogLevel.info ) {          
				  var msg = formatLog("INFO",message); 
				  if (this.remoteLevel <= $.LogLevel.info) {           
				     sendRemote(this.remoteUrl,msg);
				  }
		          console.info(msg);
		  	   }
		  },
		  
		  debug: function(message) { 
			  if (this.level <= $.LogLevel.debug) { 
	            var msg = formatLog("DEBUG",message);
	            if (this.remoteLevel <= $.LogLevel.debug ) {
	               sendRemote(this.remoteUrl,msg);	  
			    }  
	            console.debug(msg);
			  }
		  },	  
		  
		  error: function(message) { 
			  if (this.level <= $.LogLevel.error) { 
	            var msg = formatLog("ERROR",message);
	            if (this.remoteLevel <= $.LogLevel.error) {
	               sendRemote(this.remoteUrl,msg);	         	
			    }
	            console.error(msg);
			  }
		  },	  
		  
		  warn: function(message) { 
			  if (this.level <= $.LogLevel.warn) { 
	            var msg = formatLog("WARN",message); 
	            if (this.remoteLevel <= $.LogLevel.warn) {
	              sendRemote(this.remoteUrl,msg);	         
	            }
	            console.warn(msg);
			  }
		  },	  
			  
		  remoteUrl : null,
			  
          mark : function($el,title,json) {
        	   var model = "\nModel:\n";
        	   if (json != null) {
        		   model += formatJSON(json,"");
        	       title += model;
        	   }  
        	   
        	   if (this.annotate) {  
        	   $el.mouseover(function() {
    		   
        		   $el.css("outline","medium solid #FF0000");
                   $el.attr("title",title);
        		   
        		 });
        	   
        	   	$el.mouseout(function() {
        		   
        		   $el.css("outline","");
                   $el.removeAttr("title");
        		   
        		 });
        	   
        	        	   
               }
        	     	   
      	   
          }, 
           
          render: function(view,title,renderFunc) {
       	       this.pre(title);
        	   var $el = $(view.el);
        	   var model = view.model;
        	   var json = "\n\nModel:";
        	   if (model != null) {
        		   json += formatJSON(model.toJSON(),"");
        	   }
        	   this.mark($el,title+json);
        	   renderFunc.apply(null,[view]);
        	   this.post(title);

          },
          
          pre : function(title) { console.info(formatLog("INFO",title));   },
          
          post : function(title) { console.info(formatLog("INFO",title));   },
 
      
   };
  
  // JSON formatting functions
  
  var realTypeOf = function(v) {
	  if (typeof(v) == "object") {
	    if (v === null) return "null";
	    if (v.constructor == (new Array).constructor) return "array";
	    if (v.constructor == (new Date).constructor) return "date";
	    if (v.constructor == (new RegExp).constructor) return "regex";
	    return "object";
	  }
	  return typeof(v);
	};

	
var	formatJSON =  function (oData, sIndent) {
   	    if (arguments.length < 2) {
   	        var sIndent = "";
   	    }
   	    var sIndentStyle = "    ";
   	    var sDataType = realTypeOf(oData);
   	    if (sDataType == "array") {
   	        if (oData.length == 0) {
   	            return "[]";
   	        }
   	        var sHTML = "[";
   	    } else {
   	        var iCount = 0;
   	        $.each(oData, function() {
   	            iCount++;
   	            return;
   	        });
   	        if (iCount == 0) {
   	            return "{}";
   	        }
   	        var sHTML = "{";
   	    }
   	    var iCount = 0;
   	    $.each(oData, function(sKey, vValue) {
   	        if (iCount > 0) {
   	            sHTML += ",";
   	        }
   	        if (sDataType == "array") {
   	            sHTML += ("\n" + sIndent + sIndentStyle);
   	        } else {
   	            sHTML += ("\n" + sIndent + sIndentStyle + "\"" + sKey + "\"" + ": ");
   	        }

   	        switch (realTypeOf(vValue)) {
   	            case "array":
   	            case "object":
   	                sHTML += formatJSON(vValue, (sIndent + sIndentStyle));
   	                break;
   	            case "boolean":
   	            case "number":
   	                sHTML += vValue.toString();
   	                break;
   	            case "null":
   	                sHTML += "null";
   	                break;
   	            case "string":
   	                sHTML += ("\"" + vValue + "\"");
   	                break;
   	            default:
   	                sHTML += ("TYPEOF: " + typeof(vValue));
   	        }
   	        iCount++;
   	    });
   	    if (sDataType == "array") {
   	        sHTML += ("\n" + sIndent + "]");
   	    } else {
   	        sHTML += ("\n" + sIndent + "}");
   	    }
   	    return sHTML;
   	};
   		

   var formatLog = function(prefix,msg) {
	 
	   var now = new Date();
	   var dt = now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate()+":"+now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + 
	   ":" + now.getMilliseconds();
	   var result = prefix+":"+dt+"->"+msg;	   
	   return result;
	     
   };	
   	
   var sendRemote = function(url,msg) {
       if (url != null) {
    	    var restful = url+"/"+encodeURI(msg.split('/').join(' '));
    	    $.ajax({
				  url: restful,	
				  success: function(data) {
					   				  
				  },
    	          error: function(data) {
    	        	  console.error("Error sending remote log message to - "+restful);
    	        	  
    	          }
    	    
			});  
       }
   }; 
    
   
})(window.jQuery);
