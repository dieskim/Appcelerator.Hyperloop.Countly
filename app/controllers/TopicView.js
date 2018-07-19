// Add App eventlistener to listen for app:navigationCloseView
Ti.App.addEventListener("app:navigationCloseView", closeView);

function closeView(){	
	//Ti.API.info("app:navigationCloseView in TopicView");
		
	Ti.App.removeEventListener("app:goToPageFontSizeReload", goToPageReload);	
	Ti.App.removeEventListener("app:navigationCloseView", closeView);	
	
	// clear topicTimer via topicTimerData.clear()
	topicTimerData.clear();
	
};

// Change Menu Button Text Function
function changeTitle(actionValue,topicData){
	
	// Get values from function
	var action = actionValue;
	
	//Set new_title accordingly	
	// if new chapter from Menyu set title
	if (action == 'new'){
			
		// convert ~ in title to -
		topicData.longTitle = topicData.longTitle.replace('~','-');
	
		// Convert and set TopicTitle
		var topicNameString = topicData.longTitle;
		var convertedTopicName = Alloy.Globals.textConverter(topicNameString);
		
		// Update Menu Button info
		$.topLabel.text = convertedTopicName;
		$.topLabel.topicData = topicData;	
		
		// setLastOpenView
		setLastOpenView("TopicView",topicData);

	}
	// if scrolled to next change to next chapter name
	else if (action == "next"){
		
		// get currentTopicData
		var currentTopicData = $.topLabel.topicData;
		
		// set nextTopicID
		var nextTopicID = (+currentTopicData.rowid + 1);
		
		// set newTopicDataArray as topic data in database
		var newTopicDataArray = databaseConnect({
			database: Alloy.Globals.databaseData.topicData.databaseName,
			table: "topicTopics",
			method:"getAllTableValuesByFieldValue",
			field: "rowid",
			value: nextTopicID, 
		});
		
		// set newTopicData as first in array - as array only has one value as only one topic
		var newTopicData = newTopicDataArray[0];
		
		// Convert and set TopicTitle
		var topicNameString = newTopicData.longTitle.replace('~','-');  // convert ~ in title to -
		var convertedTopicName = Alloy.Globals.textConverter(topicNameString);
		
		// Update Menu Title
		$.topLabel.text = convertedTopicName;
		$.topLabel.topicData = newTopicData;
		
		// setLastOpenView
		setLastOpenView("TopicView",newTopicData);		

	}
	// if prev change to prev chapter name
	else if (action == "prev"){
		
		// get currentTopicData
		var currentTopicData = $.topLabel.topicData;
		
		// set nextTopicID
		var nextTopicID = (+currentTopicData.rowid - 1);
		
		// set newTopicDataArray as topic data in database
		var newTopicDataArray = databaseConnect({
			database: Alloy.Globals.databaseData.topicData.databaseName,
			table: "topicTopics",
			method:"getAllTableValuesByFieldValue",
			field: "rowid",
			value: nextTopicID, 
		});
		
		// set newTopicData as first in array - as array only has one value as only one topic
		var newTopicData = newTopicDataArray[0];
		
		// Convert and set TopicTitle
		var topicNameString = newTopicData.longTitle.replace('~','-');  // convert ~ in title to -
		var convertedTopicName = Alloy.Globals.textConverter(topicNameString);
		
		// Update Menu Title
		$.topLabel.text = convertedTopicName;
		$.topLabel.topicData = newTopicData;
		
		// setLastOpenView
		setLastOpenView("TopicView",newTopicData);	
		
	};	

	
};

///////////////////////////////////////////////////////////
// 			START - Function to goToPage				//
function goToPage(e){
	
	// set direction 
	var direction = e.direction;
	
	// get Ti.App.Properties - lastOpenView
	var lastOpenView = JSON.parse(Ti.App.Properties.getString('lastOpenView','{}'));
		
	// set topicID 
	var topicID = lastOpenView.lastOpenViewData.id;
	
	// START IF - direction next 
	if (direction == "next"){
      	
	}else if (direction == "prev"){ 
		
	}else if (direction == "index"){
			
			// set topicDataArray as topic data in database
			var topicDataArray = databaseConnect({
				database: Alloy.Globals.databaseData.topicData.databaseName,
				table: "topicTopics",
				method:"getAllTableValuesByFieldValue",
				field: "id",
				value: topicID, 
			});
				
			// set topicData as first in array - as array only has one value as only one topic
			var topicData = topicDataArray[0];
			
			// createScroller
			createTopicScroller(topicData);	
				
	};
	// END IF - direction previouse
			
};
// 				END - Function to goToPage				 //
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
// START - Function to run after topicOpenedFunction	//
function topicOpenedFunction(e){ 	
	//Ti.API.info("topicOpenedFunction");
	
	// START - topicTimer Functions - clear old timer then start new timer
	
	// clear topicTimer via topicTimerData.clear()
	topicTimerData.clear();
	
	// set topicID
	var topicID = (+e.pageIndex + 1);
	
	// create topicTimer via topicTimerData.create();
	topicTimerData.create(topicID); 
	
	// END - topicTimer Functions - clear old timer then start new timer
	
};
// END - Function to run after topicOpenedFunction	//
/////////////////////////////////////////////////////////
	
///////////////////////////////////////////////////////
// START FUNCTION Create Scrollable view of Chapters //

function createTopicScroller(topicData){
	
	// Include the virtualTextScroller module in app/lib/virtualTextScroller/virtualTextScroller.js
	var virtualTextScrollerModule = require('virtualTextScroller/virtualTextScroller');
	
	// set totalTopicAmount as count of table in database
	var totalTopicAmount = databaseConnect({
			database: Alloy.Globals.databaseData.topicData.databaseName,
			table: "topicTopics",
			method:"count", 
	});
		
	//Ti.API.info(totalTopicAmount);
	
	// set actionValue as new
	var actionValue = 'new';
	
	// START IF - Check if has scroller and remove
	if ($.TopicTextScrollBox.children[0]){	
		//Ti.API.info("Remove old Scroller");
		
		// fire app:createScrollerRemove
		Ti.App.fireEvent("app:createScrollerRemove");
		
		// Remove all children
		$.TopicTextScrollBox.removeAllChildren();

		// set virtualTextScroller null
		virtualTextScrollerScrollText = null;
		
	};
	// END IF - Check if has scroller and remove
	
	// Set pageNum var as topicData.id or else 0
	var pageNum = (+topicData.rowid-1) || '0';
		
	///////////////////////////////////////////////////////////////
	//			Get fontSize and prepareHTML					//
		
	// include module and set fontSize
	var getSetFontSize = require('getSetFontSize/getSetFontSize');
	var fontSize = getSetFontSize("getValue");
	
	// reguire prepareHTML
	var prepareHTML = require('prepareHTML/prepareHTML');
		
	///////////////////////////////////////////////////////////////	
	// Set virtualTextScroller as virtualTextScrollerModule with Webview
	var virtualTextScroller = virtualTextScrollerModule({
		getView: function(i) {
			
			// set rowID
			var rowID = (+i+1);
			
			// get topicText via getTopicFromDB module
			var getTopicFromDB = require('getTopicFromDB');		
			var topicText = getTopicFromDB(rowID, 'rowID');
							
			// convert topicText to U Text to fix problems
			var convertedTopicText = Alloy.Globals.textConverter(topicText, false);
			
			// get html from prepareHTML using fontSize and pageText
			// set prepareHTMLData
			var prepareHTMLData = {	fontSize:fontSize,
									contentHTML: convertedTopicText,
			};
					
			// generate html
			var html = prepareHTML(prepareHTMLData);
			
			//Define webview creation
			var web_view = Ti.UI.createWebView({
					html: html,
					backgroundColor: "#F1EECD",
					scalesPageToFit : false, 
					enableZoomControls : false,
					pageIndex: i,
					borderRadius: 0.1,
					hideLoadIndicator: true,
					loadValue: "start",			
				});	
			
			// addEventListener to show activityIndicator
			web_view.addEventListener('beforeload', function(){
				
				// START IF - web_view.loadValue is start then show load activity			
				if (web_view.loadValue == "start"){
					//Ti.API.info("Webview Load Start");
					activityIndicator.show();
					web_view.loadValue	= true;
				};
				// END IF - web_view.loadValue is start then show load activity
				
			});
				
			// addEventListener to hide activityIndicator
			web_view.addEventListener('load', function() {		
				
				// START IF - web_view.loadValue is true then hide load activity
				if (web_view.loadValue == true){
					//Ti.API.info("Webview Load Complete");
					activityIndicator.hide();
					web_view.loadValue	= false;				
				};
				// END IF - web_view.loadValue is true then hide load activity
				
			});	
			
	        return web_view;
	    },
	    scrollerDirectionChange: function(directionData) {
	    	var directionChange = directionData.direction;
	    	// Set Next Chapter Actions
			if (directionChange == "next"){
				changeTitle("next");	
				topicOpenedFunction(directionData);
			}
			// Set Prev Chapter Actions
			else if (directionChange == "prev") {			
				changeTitle("prev");
				topicOpenedFunction(directionData);
			}	
	    },	
		start: pageNum,
	    itemCount: totalTopicAmount,
	});
	
	// set virtualTextScrollerText
	var virtualTextScrollerScrollText = virtualTextScroller.view;
	
	//  End Create Scrollable view of Chapters  //
	//////////////////////////////////////////////
	
	//////////////////////////////////////////////
	// 		START Create Activity Indicator		//
		
	// START IF - IOS else android
	if (OS_IOS){	
		var activityStyle = Ti.UI.ActivityIndicatorStyle.DARK; 
	}else{	  
		// START IF - is handheld else
		if (Alloy.isHandheld){  	  
			var activityStyle = Ti.UI.ActivityIndicatorStyle.DARK;  	
		}else{
			var activityStyle = Ti.UI.ActivityIndicatorStyle.BIG_DARK;
		 };
		// END IF - is handheld else	  
	};
	// END IF - IOS else android
	  
	// Create activityIndicator
	var activityIndicator = Ti.UI.createActivityIndicator({			
	  	style:activityStyle,
	}); 
		
	// 		END Create Activity Indicator		//
	//////////////////////////////////////////////
	
	// Add virtualTextScrollerScrollText to TopicTextScrollBox View
	$.TopicTextScrollBox.add(virtualTextScrollerScrollText);
	
	// Change the title of topic
	changeTitle(actionValue,topicData);
	
	// Run topicOpenedFunction with startpage, auto 
	topicOpenedFunction({   
		pageIndex: pageNum,    	
	});
		
};

// END FUNCTION Create Scrollable view of Chapters //
////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////
//  Start Open Window with Appropriate chapter loaded or Gen1 as default  //

// Set Args passed from other windows as args
var args = arguments[0] || {};

// set topicData as args.topicData
var topicData = args.topicData;
	
// START SET - topicTimer
// set topicTimer var
var topicTimer;
			
// set topicTimerData to create and clear topicTimer
var topicTimerData = {	create: function(topicID){									
									topicTimer = setTimeout(function(){ logTopicRead(topicID); }, Alloy.Globals.topicTimerTime); // set timeout to logTopicRead after 30 seconds					
						},
						clear: function(){
									clearTimeout(topicTimer);
						},
};
// END SET - topicTimer

// Create Scroller with Initial Id as set from loadView function on previouse pages
createTopicScroller(topicData);

// Add App eventlistener to listen for chapter Change from anywhere in app
Ti.App.addEventListener("app:goToPageFontSizeReload", goToPageReload);

function goToPageReload(goToPageData) {
	goToPage(goToPageData);
};

//  End Open Window with Appropriate chapter loaded or Gen1 as default  //
//////////////////////////////////////////////////////////////////////////