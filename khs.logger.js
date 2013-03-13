//     khs.logger.js 0.0.1

//     (c) 2013 David Pitt, Keyhole Software LLC.
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     https://github.com/in-the-keyhole/khs-logger

(function($) {

	var inspector = false;
	var current = null;
	var savedTitle = null;

	// IE 8,9 console work around
	if (!window.console)
		window.console = {};
	if (!window.console.log)
		window.console.log = function() {
		};
	if (!window.console.info)
		window.console.info = function() {
		};
	if (!window.console.debug)
		window.console.debug = function() {
		};
	if (!window.console.error)
		window.console.error = function() {
		};
	if (!window.console.warn)
		window.console.warn = function() {
		};

	$.LogLevel = {
		log : 0,
		debug : 1,
		info : 2,
		warn : 3,
		error : 4
	};

	$.Log = {

		keyCode : 13, // default enter

		level : $.LogLevel.info, // default

		remoteLevel : $.LogLevel.error, // default error

		color : "#FF0000", // red

		remoteUrl : null, // remote url

		// Logging methods

		log : function(message) {

			if (this.level <= $.LogLevel.log) {
				var msg = formatLog("LOG", message);
				if (this.remoteLevel <= $.LogLevel.log) {
					sendRemote(this.remoteUrl, msg);
				}
				console.log(msg);
			}
		},

		info : function(message) {

			if (this.level <= $.LogLevel.info) {
				var msg = formatLog("INFO", message);
				if (this.remoteLevel <= $.LogLevel.info) {
					sendRemote(this.remoteUrl, msg);
				}
				console.info(msg);
			}
		},

		debug : function(message) {
			if (this.level <= $.LogLevel.debug) {
				var msg = formatLog("DEBUG", message);
				if (this.remoteLevel <= $.LogLevel.debug) {
					sendRemote(this.remoteUrl, msg);
				}
				console.debug(msg);
			}
		},

		error : function(message) {
			if (this.level <= $.LogLevel.error) {
				var msg = formatLog("ERROR", message);
				if (this.remoteLevel <= $.LogLevel.error) {
					sendRemote(this.remoteUrl, msg);
				}
				console.error(msg);
			}
		},

		warn : function(message) {
			if (this.level <= $.LogLevel.warn) {
				var msg = formatLog("WARN", message);
				if (this.remoteLevel <= $.LogLevel.warn) {
					sendRemote(this.remoteUrl, msg);
				}
				console.warn(msg);
			}
		},

		// visual inspecting methods

	    inspect : function() {
	       enableInspector();	
	    },
	    
		inspectOn : function() {
			inspector = true;
		},

		inspectOff : function() {
			inspector = false;
		},

		isInspecting : function() {

			return inspector;

		},

		mark : function($el, title, json) {

			var model = "<b>Model:<b>&nbsp;</br>";
			var clipboard = "<a href=javascript:copyToClipboard('" + json
					+ "');>clipboard</a>";
			var options = "<div><button style='height: 12px;width: 100px' >Copy Json</button></div>";
			var info = "<div><b>Id:&nbsp;</b>" + $el.attr("id")
					+ "</br><b>View:&nbsp;</b>" + title + "</div>";
			if (json != null) {
				model += "<div style='height : 150px; overflow : auto;'><pre>"
						+ formatJSON(json, "") + "</pre></div>";
				info += model;
			}

			tooltip($el, info);

		},

		render : function(view, title, renderFunc) {
			this.pre(title);
			var $el = $(view.el);
			var model = view.model;
			var json = "\n\nModel:";
			if (model != null) {
				json += "<div style='height : 150px; overflow : auto;'>"
						+ formatJSON(model.toJSON(), "") + "</div>";
			}
			this.mark($el, title + json);
			renderFunc.apply(null, [ view ]);
			this.post(title);

		},

		pre : function(title) {
			console.info(formatLog("INFO", title));
		},

		post : function(title) {
			console.info(formatLog("INFO", title));
		},

	};

	// JSON formatting functions

	var realTypeOf = function(v) {
		if (typeof (v) == "object") {
			if (v === null)
				return "null";
			if (v.constructor == (new Array).constructor)
				return "array";
			if (v.constructor == (new Date).constructor)
				return "date";
			if (v.constructor == (new RegExp).constructor)
				return "regex";
			return "object";
		}
		return typeof (v);
	};

	var formatJSON = function(oData, sIndent) {
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
		$.each(oData,
				function(sKey, vValue) {
					if (iCount > 0) {
						sHTML += ",";
					}
					if (sDataType == "array") {
						sHTML += ("\n" + sIndent + sIndentStyle);
					} else {
						sHTML += ("\n" + sIndent + sIndentStyle + "\"" + sKey
								+ "\"" + ": ");
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

	var formatLog = function(prefix, msg) {

		var now = new Date();
		var dt = now.getFullYear() + "-" + (now.getMonth() + 1) + "-"
				+ now.getDate() + ":" + now.getHours() + ":" + now.getMinutes()
				+ ":" + now.getSeconds() + ":" + now.getMilliseconds();
		var result = prefix + ":" + dt + "->" + msg;
		return result;

	};

	var sendRemote = function(url, msg) {
		if (url != null) {
			var restful = url + "/" + encodeURI(msg.split('/').join(' '));
			$.ajax({
				url : restful,
				success : function(data) {

				},
				error : function(data) {
					console.error("Error sending remote log message to - "
							+ restful);

				}

			});
		}
	};

	function tooltip(el, tip) {

		// create click function
		var click = function(e) {

			if (!inspector) {
				return;
			}

			e.stopPropagation();
			if (isShowing(current)) {
				if (current != null) {
					current.children('div#tooltip').remove();
					current.css("outline", "");
				}
				el.attr("title", savedTitle);
			}

			savedTitle = el.attr("title");
			el.attr("title", "showing");

			// Append the tooltip template and its value
			el
					.append('<div id="tooltip"><div class="tipHeader"></div><div class="tipBody"><h>'
							+ tip + '</div><div class="tipFooter"></div></div>');

			// Set the X and Y axis of the tooltip
			$('#tooltip').css('top', e.pageY + 5);
			$('#tooltip').css('left', e.pageX + 10);

			// Show the tooltip with faceIn effect
			$('#tooltip').fadeIn('500');
			$('#tooltip').fadeTo('10', 0.8);

		};

		// add mouse events
		el.mouseenter(function(e) {

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

		}).mousemove(function(e) {

			// Keep changing the X and Y axis for the tooltip, thus, the tooltip
			// move along with the mouse
			// $('#tooltip').css('top', e.pageY + 10 );
			// $('#tooltip').css('left', e.pageX + 20 );

		}).mouseleave(function(e) {

			if (current != null) {
				current.children('div#tooltip').remove();
				showing = false;
				current.attr("title", savedTitle);
				current.css("outline", "");
				current = null;

			}

			el.css("outline", "");

		});

	}
	;

	function isShowing(el) {
		var title = el.attr("title");
		return title == "showing";

	}

	function addStyle() {

		var tooltip = " #tooltip { " + " position:absolute; "
				+ " z-index:9999; " + " color:#fff; " + " font-size:10px; "
				+ " width:580px; }";

		var tooltipHeader = " #tooltip .tipHeader { " + "    height:8px; "
				+ "} ";

		var iehack = "/* IE hack */"
				+ "*html #tooltip .tipHeader {margin-bottom:-6px;}";

		var tooltipBody = "#tooltip .tipBody {" + " background-color:#000; "
				+ " padding:5px; " + " }";

		var tooltipFooter = "#tooltip .tipFooter {" + " height:8px; " + " } ";

		$(
				"<style>" + tooltip + tooltipHeader + iehack + tooltipBody
						+ tooltipFooter + "</style>").appendTo("body");

	}
	;

	$(function() {
	
		// add style
		//addStyle();

	});


    function enableInspector() { 	
    	// toggle inspector with keystroke event
		window.onkeypress = function(e) {
			if (e.keyCode == $.Log.keyCode) {
				if (e.ctrlKey) {
					if ($.Log.isInspecting()) {
						$.Log.inspectOff();
					} else {
						$.Log.inspectOn();
					}
					;
				}
			}
			;
		}; 	
		
		// add style
		addStyle();		
    	
    }


})(window.jQuery);
