//     khs.logger.js 0.0.6

//     (c) 2013 David Pitt, Keyhole Software LLC. www.keyholesoftware.com
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     https://github.com/in-the-keyhole/khs-logger


// Maintain AMD compatibility along with ability to be loaded without AMD, as described here: https://github.com/umdjs/umd/blob/master/jqueryPlugin.js
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    var inspector = false;
    var current = null;
    var savedTitle = null;
    var inspectorEnabled = false;
    var logLength = null;


    // IE 8,9 console work around
    if (!window.console) {
        window.console = {};
    }
    if (!window.console.log) {
        window.console.log = function () {
        };
    }
    if (!window.console.info) {
        window.console.info = function () {
        };
    }
    if (!window.console.debug) {
        window.console.debug = function () {
        };
    }
    if (!window.console.error) {
        window.console.error = function () {
        };
    }
    if (!window.console.warn) {
        window.console.warn = function () {
        };
    }

    $.LogLevel = {
        log:0,
        debug:1,
        info:2,
        warn:3,
        error:4
    };

    $.Log = {

        keyCodes:[10,13], // 13 is default Enter key, but in Chrome, when ctrl key + Enter is pressed, keyCode is 10

        logKeyCode: 17,  // default is L
        
        level:$.LogLevel.info, // default
        
        modelDumpKeyCode:  77, // default is m 
        
        divs : {},
        
        inspectors: [],
        
        logLocal: false,
        
        logLength: 100,  // default 100 lines...

        remoteLevel:$.LogLevel.error, // default error

        color:"#FF0000", // red

        remoteUrl:null, // remote url,

        beforeSend:null, // call back function allows request object modification

        // Logging methods

        log:function (message) {

            if (this.level <= $.LogLevel.log) {
                var msg = formatLog("LOG", message);
                if (this.remoteLevel <= $.LogLevel.log) {
                    sendRemote(this.remoteUrl, msg, this.beforeSend);
                }
                if (this.logLocal) {
                    local(msg);
                }
                console.log(msg);
            }
        },

        info:function (message) {

            if (this.level <= $.LogLevel.info) {
                var msg = formatLog("INFO", message);
                if (this.remoteLevel <= $.LogLevel.info) {
                    sendRemote(this.remoteUrl, msg, this.beforeSend);
                }
                if (this.logLocal) {
                    local(msg);
                }
                console.info(msg);
            }
        },

        debug:function (message) {
            if (this.level <= $.LogLevel.debug) {
                var msg = formatLog("DEBUG", message);
                if (this.remoteLevel <= $.LogLevel.debug) {
                    sendRemote(this.remoteUrl, msg, this.beforeSend);
                }
                if (this.logLocal) {
                    local(msg);
                }
                
                console.debug(msg);
            }
        },

        error:function (message) {
            if (this.level <= $.LogLevel.error) {
                var msg = formatLog("ERROR", message);
                if (this.remoteLevel <= $.LogLevel.error) {
                    sendRemote(this.remoteUrl, msg, this.beforeSend);
                }
                if (this.logLocal) {
                    local(msg);
                }
                console.error(msg);
            }
        },

        warn:function (message) {
            if (this.level <= $.LogLevel.warn) {
                var msg = formatLog("WARN", message);
                if (this.remoteLevel <= $.LogLevel.warn) {
                    sendRemote(this.remoteUrl, msg, this.beforeSend);
                }
                if (this.logLocal) {
                    local(msg);
                }
                console.warn(msg);
            }
        },

        // visual inspecting methods

        inspect:function () {
            inspectorEnabled = true;
            enableInspector();
        },

        inspectOn:function () {
            inspector = true;
        },

        inspectOff:function () {
            inspector = false;
        },

        isInspecting:function () {
            return inspector;
        },
        
        install:function (inspectModule) {      
            this.inspectors.push(inspectModule);
        },
             
        mark:function ($el, title, json) {
            
            // only mark el if inspector is enabled
            if (!inspectorEnabled) {return;}

            var model = "<b>Model:<b>&nbsp;</br>";
            var clipboard = "<a href=javascript:copyToClipboard('" + json + "');>clipboard</a>";
            var options = "<div><button style='height: 12px;width: 100px' >Copy Json</button></div>";
            var info = "<div><b>Id:&nbsp;</b>" + $el.attr("id") + "</br><b>View:&nbsp;</b>" + title + "</div>";
             var formattedJson;
            if (json !== null & json !== undefined) {
                formattedJson = formatJSON(json,"");
                model += "<div style='max-height : 512px; overflow : auto;'><pre>" + formattedJson + "</pre></div>";
                info += model;
            }
            var key = $el.attr("id")+title;
            this.divs[key] = $el;         
            tooltip($el, info);
            
            // add data-json attribute
            if (json ) {
              $el.attr("data-json",title+"<~>"+formattedJson);
            }
            
            $.Log.info("Marked "+title+" for inspection");
        },
 
        showOutline : function() {  
            for (var title in this.divs) {
                this.divs[title].css("outline","medium solid #FF0000");
            }           
        },
        
        hideOutline : function() {  
            for (var title in this.divs) {
                this.divs[title].css("outline","");
            }           
        },
        
        localStorageLogInspector : function() {
            // displays local storage log   
            return function(el) {       
             var logHTML = "<b>Log Entries ("+$.Log.logLength+")</b>";
             logHTML += "<div style='height : 150px; overflow : auto;'><pre>";
             var log = JSON.parse(localStorage["local.logs"]);
             for (var l in log.entries) {
                logHTML += log.entries[l] + "</br>";
              }         
              logHTML += "</pre></div>";
                     
              return logHTML;
            };
            
            
        },
        
      localLogEntries : function() {          
        return JSON.parse(localStorage["local.logs"]);                    
      },    
        
      resetLocalLog : function() {        
          localStorage["local.logs"] = "";        
      }       
  
    };

    // JSON formatting functions

    var realTypeOf = function (v) {
        if (typeof (v) === "object") {
            if (v === null) {
                return "null";
            }
            if (v.constructor === ([]).constructor) {
                return "array";
            }
            if (v.constructor === (new Date()).constructor) {
                return "date";
            }
            if (v.constructor === (new RegExp()).constructor) {
                return "regex";
            }
            return "object";
        }
        return typeof (v);
    };

    var formatJSON = function (oData, sIndent) {
        var sHTML;
        var iCount;
        if (arguments.length < 2) {
            sIndent = "";
        }
        var sIndentStyle = "    ";
        var sDataType = realTypeOf(oData);
        if (sDataType === "array") {
            if (oData.length === 0) {
                return "[]";
            }
            sHTML = "[";
        } else {
            iCount = 0;
            $.each(oData, function () {
                iCount++;
            });
            if (iCount === 0) {
                return "{}";
            }
            sHTML = "{";
        }
        iCount = 0;
        $.each(oData,
            function (sKey, vValue) {
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
                        sHTML += ("TYPEOF: " + typeof (vValue));
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

    var formatLog = function (prefix, msg) {
        if ($.Log.prefix) { 
           if (typeof($.Log.prefix) == 'function' ) {	
             prefix = prefix + ":"+ $.Log.prefix();
           } else {
             prefix = prefix + ":"+ $.Log.prefix;   
           }
           
         }
        var now = new Date();
        var dt = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + ":" + pad(now.getHours(),2) + ":" + pad(now.getMinutes(),2) + ":" + pad(now.getSeconds(),2) + ":" + pad(now.getMilliseconds(),3);
        return prefix + ":" + dt + "->" + msg;
    };   
    
    var sendRemote = function (url, msg, beforeSend) {
        if (url !== null) {
            var restful = url;
            $.ajax({
                url:restful,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ log: msg}),
                beforeSend:beforeSend,
                success:function (data) { },
                error:function (data) {
                    console.error("Error sending remote log message to - " + restful);
                }
            });
        }
    };

    function pad(number,padValue){
        return(1e15+number+"").slice(-padValue);}
    
    function tooltip(el, tip) {

        // create click function
        var click = function (e) {

            if (!inspector) {
                return;
            }

            e.stopPropagation();
            if (isShowing(current)) {
                if (current !== null) {
                    $("#khstooltip").remove();
                    //current.css("outline", "");
                }
                el.attr("title", savedTitle);
            }

            savedTitle = el.attr("title");
            el.attr("title", "showing");
                 
            // apply inspectors
            var inspectorHTML = "";
            for (var i in $.Log.inspectors) {
                inspectorHTML += $.Log.inspectors[i].call(null,el);
            }   
                       
            var info = tip + inspectorHTML;
            
            // append to the body
            $("body").append('<div id="khstooltip"><div class="khstipHeader"><span class="closeButton">X</span></div><div class="khstipBody"><h>' + info + '</div><div class="khstipFooter"></div></div>');
            
            // Set the X and Y axis of the tooltip
            $('#khstooltip').css('top', e.pageY)
                .css('left', e.pageX)
                .fadeIn('500')
                .fadeTo('10', 0.8);
            $("#khstooltip .closeButton").css({
                "float": "right",
                "font-size": "14px",
                "background-color": "#FFFFFF",
                "color": "#000000",
                "padding": "4px",
                "margin-top": "8px",
                "font-weight": "700"
            }).hover(function() {
                $(this).css({
                    "background-color": "#000000",
                    "color": "#ffffff",
                    "cursor": "pointer"
                });
            }, function() {
                $(this).css({
                    "background-color": "#FFFFFF",
                    "color": "#000000"
                });
            }).on("click", this, function() {
                $(this).parents("#khstooltip").remove();
            });
        };
        
        // add mouse events
        el.mouseenter(function (e) {

            // show outline
            // Grab the title attribute's value and assign it to a variable
            // var tip = el.attr('title');
            current = el;
            if (inspector) {
                // current = el;
                current.css("outline", "medium solid #FF0000");
                // showing = true;
                current.attr("title", "showing");
                // on click show diagnostic window
                current.dblclick(click);
            }

        }).mousemove(function (e) {

                // Keep changing the X and Y axis for the tooltip, thus, the tooltip
                // move along with the mouse
                // $('#tooltip').css('top', e.pageY + 10 );
                // $('#tooltip').css('left', e.pageX + 20 );

            }).mouseleave(function (e) {

                if (current !== null) {
                    current.attr("title", savedTitle);
                    current.css("outline", "");
                    current = null;
                }

                el.css("outline", "");

            });
    }
    
    function local(message) {   
        var str = localStorage["local.logs"];
        var log = null;
        if (str === null || str === undefined || str === "") {
             log = {entries:[]};
        } else {
            log = JSON.parse(str);  
        }
        
        log.entries.push(message);
        if (log.entries.length > $.Log.logLength) {
            log.entries.shift();
        }
        localStorage["local.logs"] = JSON.stringify(log);  
 
    }

    function isShowing(el) {
        var title = el.attr("title");
        return title == "showing";

    }

    function addStyle() {

        var tooltip = " #khstooltip { " + " position:absolute; " + " z-index:9999; " + " color:#fff; " + " font-size:10px; " + " width:580px; }";

        var tooltipHeader = " #khstooltip .khstipHeader { " + " height:8px; " + "} ";

        var iehack = "/* IE hack */" + "*html #khstooltip .khstipHeader {margin-bottom:-6px;}";

        var tooltipBody = "#khstooltip .khstipBody {" + " background-color:#000; " + " padding:5px; " + " }";

        var tooltipFooter = "#khstooltip .khstipFooter {" + " height:8px; " + " } ";

        var html = "<style>" + tooltip + tooltipHeader + iehack + tooltipBody + tooltipFooter + "</style>";
        $(html).appendTo("body");
    }

    $(function () {

  
    });


    function enableInspector() {
        // toggle inspector with keystroke event
        window.onkeydown = function (e) {
            if ($.Log.keyCodes.indexOf(e.keyCode) != -1) {
                if (e.ctrlKey) {
                    $.Log.showOutline();
                    if ($.Log.isInspecting()) {                   
                        $.Log.inspectOff();
                        $.Log.debug("inspecting off");
                    } else {
                        $.Log.inspectOn();
                        $.Log.debug("inspecting on");
                    }                    
                }
            }
            
            if (e.keyCode == $.Log.modelDumpKeyCode) {
                if (e.ctrlKey) {
                 var json = $("[data-json]").map(function(){return $(this).attr("data-json");}).get();
                 var title = "";
                 var info = "";
                 for (var i = 0; i < json.length; i++) {
                     var value = json[i].split("<~>");
                     title = value[0];
                     model = value[1];
                     info = info + "<b>"+title+"</b></br><textarea rows='20' cols='80'>" + model +"</textarea></br>";
                 }
            
             // open model window    
             var w = window.open();            
             w.document.write("<html><head><title>JSON MODELS</title></head><body><div class='khstipBody'>" + info + "</div><div class='khstipFooter'></div></body></html>");
        
           }
            
         }   
  
        };    
                    
        window.onkeyup = function(e) {
            if ($.Log.keyCodes.indexOf(e.keyCode) != -1) {          
                $.Log.hideOutline();                        
            }
        };
        
        // add style
        addStyle();

    }

    //return for AMD so that can be used like below, without shim configuration if desired
    // require( ["log"], function(logger) {
    //    logger.info("Here I am");
    //});
    return $.Log;
}));

