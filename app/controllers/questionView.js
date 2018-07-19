// Add App eventlistener to listen for app:navigationCloseView
Ti.App.addEventListener("app:navigationCloseView", closeView);

function closeView(){	
	//Ti.API.info("app:navigationCloseView in questionView");
		
	Ti.App.removeEventListener("app:goToPageFontSizeReload", goToPageReload);	
	Ti.App.removeEventListener("app:navigationCloseView", closeView);	
	
	// clear questionTimer via questionTimerData.clear()
	questionTimerData.clear();
	
};

// Change Menu Button Text Function
function changeTitle(actionValue,questionData){
	
	// Get values from function
	var action = actionValue;
	
	//Set new_title accordingly	
	// if new chapter from Menyu set title
	if (action == 'new'){
			
		$.topLabel.questionData = questionData;	
		
		// setLastOpenView
		setLastOpenView("questionView",questionData);

	}
	// if scrolled to next change to next question
	else if (action == "next"){
		
		// get currentQuestionData
		var currentQuestionData = $.topLabel.questionData;
		
		// set nextquestionID
		var nextQuestionID = (+currentQuestionData.rowid + 1);
		
		// set newQuestionDataArray as question data in database
		var newQuestionDataArray = databaseConnect({
			database: Alloy.Globals.databaseData.questionData.databaseName,
			table: "questionQuestions",
			method:"getAllTableValuesByFieldValue",
			field: "rowid",
			value: nextQuestionID, 
		});
		
		// set newQuestionData as first in array - as array only has one value as only one question
		var newQuestionData = newQuestionDataArray[0];
		
		//Ti.API.info("newQuestionData:");
		//Ti.API.info(newQuestionData);
		
		// Update questionData
		$.topLabel.questionData = newQuestionData;
		
		// setLastOpenView
		setLastOpenView("questionView",newQuestionData);		

	}
	// if prev change to prev chapter name
	else if (action == "prev"){
		
		// get currentQuestionData
		var currentQuestionData = $.topLabel.questionData;
		
		// set nextQuestionID
		var nextQuestionID = (+currentQuestionData.rowid - 1);
		
		// set newQuestionDataArray as question data in database
		var newQuestionDataArray = databaseConnect({
			database: Alloy.Globals.databaseData.questionData.databaseName,
			table: "questionQuestions",
			method:"getAllTableValuesByFieldValue",
			field: "rowid",
			value: nextQuestionID, 
		});
		
		// set newQuestionData as first in array - as array only has one value as only one question
		var newQuestionData = newQuestionDataArray[0];
		
		// Update questionData
		$.topLabel.questionData = newQuestionData;
		
		// setLastOpenView
		setLastOpenView("questionView",newQuestionData);	
		
	};	

	
};

///////////////////////////////////////////////////////////
// 			START - Function to goToPage				//
function goToPage(e){
	
	// set direction 
	var direction = e.direction;
	
	// get Ti.App.Properties - lastOpenView
	var lastOpenView = JSON.parse(Ti.App.Properties.getString('lastOpenView','{}'));
		
	// set questionID 
	var questionID = lastOpenView.lastOpenViewData.id;
	
	// START IF - direction next 
	if (direction == "next"){
      	
	}else if (direction == "prev"){ 
		
	}else if (direction == "index"){
			
			// set questionDataArray as question data in database
			var questionDataArray = databaseConnect({
				database: Alloy.Globals.databaseData.questionData.databaseName,
				table: "questionQuestions",
				method:"getAllTableValuesByFieldValue",
				field: "id",
				value: questionID, 
			});
				
			// set questionData as first in array - as array only has one value as only one question
			var questionData = questionDataArray[0];
			
			// createScroller
			createQuestionScroller(questionData);	
				
	};
	// END IF - direction previouse
			
};
// 				END - Function to goToPage				 //
///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
// START - Function to run after questionOpenedFunction	//
function questionOpenedFunction(e){ 	
	//Ti.API.info("questionOpenedFunction");
	
	// START - questionTimer Functions - clear old timer then start new timer
	
	// clear questionTimer via questionTimerData.clear()
	questionTimerData.clear();
	
	// set questionID
	var questionID = (+e.pageIndex + 1);
	
	// create questionTimer via questionTimerData.create();
	questionTimerData.create(questionID); 
	
	// END - questionTimer Functions - clear old timer then start new timer
	
};
// END - Function to run after questionOpenedFunction	//
/////////////////////////////////////////////////////////
	
///////////////////////////////////////////////////////
// START FUNCTION Create Scrollable view of Chapters //

function createQuestionScroller(questionData){
	
	// Include the virtualTextScroller module in app/lib/virtualTextScroller/virtualTextScroller.js
	var virtualTextScrollerModule = require('virtualTextScroller/virtualTextScroller');
	
	// set totalQuestionAmount as count of table in database
	var totalQuestionAmount = databaseConnect({
			database: Alloy.Globals.databaseData.questionData.databaseName,
			table: "questionQuestions",
			method:"count", 
	});
		
	//Ti.API.info("totalQuestionAmount: " + totalQuestionAmount);
	
	// set actionValue as new
	var actionValue = 'new';
	
	// START IF - Check if has scroller and remove
	if ($.QuestionScrollBox.children[0]){	
		//Ti.API.info("Remove old Scroller");
		
		// fire app:createScrollerRemove
		Ti.App.fireEvent("app:createScrollerRemove");
		
		// Remove all children
		$.QuestionScrollBox.removeAllChildren();
		
		// set virtualTextScroller null
		virtualTextScrollerScrollText = null;	
		
	};
	// END IF - Check if has scroller and remove
	
	// Set pageNum var as questionData.id or else 0
	var pageNum = (+questionData.rowid-1) || '0';
		
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
			
			// get questionText via getTopicFromDB module
			var getQuestionFromDB = require('getQuestionFromDB');		
			var questionText = getQuestionFromDB(rowID, 'rowID');
							
			// convert questionText to U Text to fix problems
			var convertedQuestionText = Alloy.Globals.textConverter(questionText, false);
			
			// get html from prepareHTML using fontSize and pageText
			// set prepareHTMLData
			var prepareHTMLData = {	fontSize:fontSize,
									contentHTML: convertedQuestionText,
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
				questionOpenedFunction(directionData);
			}
			// Set Prev Chapter Actions
			else if (directionChange == "prev") {			
				changeTitle("prev");
				questionOpenedFunction(directionData);
			}	
	    },	
		start: pageNum,
	    itemCount: totalQuestionAmount, 
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
	
	
	// Add virtualTextScrollerScrollText to QuestionScrollBox View
	$.QuestionScrollBox.add(virtualTextScrollerScrollText);
	
	// Change the value of the currentQuestionData
	changeTitle(actionValue,questionData);
	
	// Run questionOpenedFunction with startpage, auto 
	questionOpenedFunction({   
		pageIndex: pageNum,    	
	});
		
};

// END FUNCTION Create Scrollable view of Chapters //
////////////////////////////////////////////////////

//////////////////////////////////////////////
//  START FUNCTION Create questionView		//
	
function createQuestionView (questionData) {
	
	// Convert and set question text
	var questionTextString = "«" +  questionData.questionText + "»";
	var convertedQuestionText = Alloy.Globals.textConverter(questionTextString);
		
	var questionView = Ti.UI.createView({
		top:5,
		height: "150dp",
		//width: Ti.UI.SIZE,
		questionData: questionData,	
		layout: "vertical",		
		borderColor: "#436a0f",
		borderRadius: 5,
		borderWidth: 2,
		left: "5px",
	    right: "5px",
	});
	
	var questionImage = Ti.UI.createImageView({
		image: "/images/question_images/question_"+questionData.id+".jpg",				
	    width: "75dp",
	    height: "75dp",
	    }); 	
	
	var questionLabel = Ti.UI.createLabel({
		text: convertedQuestionText,
		color: 'black',
		textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
		font: {
	        fontSize: Alloy.Globals.fontSizeSmall,
	        fontFamily: Alloy.Globals.customFont
	    },
	    left: "15px",
	    right: "15px",
		
	});
	
	questionView.add(questionImage);
	questionView.add(questionLabel);
		
	return questionView;
};
// END FUNCTION Create Question View //
///////////////////////////////////////


////////////////////////////////////////////////////////////////////////////
//  Start Open Window with Appropriate question loaded  //

// Set Args passed from other windows as args
var args = arguments[0] || {};

// set questionData as args.questionData
var questionData = args.questionData;

// START SET - questionTimer
// set questionTimer var
var questionTimer;
			
// set questionTimerData to create and clear questionTimer
var questionTimerData = {	create: function(questionID){									
									questionTimer = setTimeout(function(){ logQuestionRead(questionID); }, Alloy.Globals.questionTimerTime); // set timeout to logQuestionRead after 30 seconds					
						},
							clear: function(){
										clearTimeout(questionTimer);
							},
};
// END SET - questionTimer

// Create Scroller with Initial Id as set from loadView function on previouse pages
createQuestionScroller(questionData);

// Add App eventlistener to listen for chapter Change from anywhere in app
Ti.App.addEventListener("app:goToPageFontSizeReload", goToPageReload);

function goToPageReload(goToPageData) {
	goToPage(goToPageData);
};

//  End Open Window with Appropriate question loaded  //
//////////////////////////////////////////////////////////////////////////