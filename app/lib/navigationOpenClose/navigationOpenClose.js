/**
 * navigationOpenClose
 * - openNavigationView opens a new view
 * - closeNavigationView closes a view
 * - navigationGoHome closes all views and returns home
 * - navigationUpdateData updates the view data (textView, topicView etc)
 * 
 * Alloy.Globals:
 * - {@Alloy.Globals.convertLanguageStrings Alloy.Globals.convertLanguageStrings}
 * - {@link Alloy.Globals.bibleDBTextGenerate Alloy.Globals.bibleDBTextGenerate}
 * - {@link Alloy.Globals.openWindow Alloy.Globals.openWindow}
 * - {@link Alloy.Globals.openViewArray Alloy.Globals.openViewArray}
 * - {@link Alloy.Globals.androidExitApp Alloy.Globals.androidExitApp}
 * 
 * @requires   closeMainAndroid 
 * @requires   activityLoader
 * 
 * @module navigationOpenClose
 *
 * @example    <caption>Require and run openNavigationView to open a view</caption>
 * 
 * 	// require lib navigationOpenClose/navigationOpenClose
	var navigationOpenClose = require('navigationOpenClose/navigationOpenClose');
	
	var chapterData = {	book:book,
						chapter:chapter,
						highlightStart:highlightStart,
						highlightEnd:highlightEnd,
						scroll:scroll,
	};
	
	// set openTextArgs to be passed to TextView window when it is opened
	var openTextViewArgs = {
		chapterData:chapterData,
	};

	// open topicView Window with Args
    var openData = {openCloseView: "TextView",
					openCloseViewData: openTextViewArgs,					
					};
					
	// run openNavigationView
	navigationOpenClose.openNavigationView(openData);

 *
 * @example    <caption>Require and run closeNavigationView to close a view</caption>
 *
 * 	// require lib navigationOpenClose/navigationOpenClose
	var navigationOpenClose = require('navigationOpenClose/navigationOpenClose');

	// run closeNavigationView
	navigationOpenClose.closeNavigationView();	
 *
 * @example    <caption>Require and run navigationGoHome to go home</caption>
 *
 * 	// require lib navigationOpenClose/navigationOpenClose
	var navigationOpenClose = require('navigationOpenClose/navigationOpenClose');

	// run closeNavigationView
	navigationOpenClose.navigationGoHome();	
 *
 * @example    <caption>Require and run navigationUpdateData to update view data</caption>
 *
 * 	// require lib navigationOpenClose/navigationOpenClose
	var navigationOpenClose = require('navigationOpenClose/navigationOpenClose');
	
	// create lastOpenViewParams string	
	var lastOpenViewParams = 	{	lastView: lastView, 
									lastOpenViewData: lastOpenViewData,
								};
	
	// Set Ti.App.Properties - lastOpenView
	Ti.App.Properties.setString('lastOpenView',JSON.stringify(lastOpenViewParams));
	
	// run navigationUpdateData
	navigationOpenClose.navigationUpdateData(lastOpenViewParams); 

 *
 *
 */


/**
 * Opens a navigation view.
 *
 * @param      {object}  openDataVars  The open data variables
 * @param      {string}  openDataVars.openCloseView  The name of the view to open (string)
 * @param      {object}  openDataVars.openCloseViewData  The data of the view to open  
 * @return     {function}  - function that opens a new view with data
 */
exports.openNavigationView = function (openDataVars){
	
	// set openFrom to closeMenu and log below
	var openFrom = this.openFrom;
	
	// START IF - openFrom drawer
	if (openFrom == "drawer"){
		
		// close Menu
		Ti.App.fireEvent('app:openCloseMenu');
			
	};
	// END IF - openFrom drawer
		
	// START IF - check if openDataVars.openCloseView
	if (openDataVars.openCloseView){
		
		// set openView
		var openView = openDataVars.openCloseView;
				
		// START IF - openDataVars.openCloseViewData
		if (openDataVars.openCloseViewData){
			
			// set openViewData
			var openViewData = openDataVars.openCloseViewData;
		
			// set openData and run navigationOpenClose
			var openData = {	openCloseView: openView,
								openCloseViewData: openViewData,
							};
		}else{
			
			// set openData and run navigationOpenClose
			var openData = {	openCloseView: openView};
			
		};
		// END IF - openDataVars.openCloseViewData
		
	}else{
		
		// set openView as this.id
		var openView = this.openView;
		
		//Ti.API.info("openView: " + openView);
		
		// set openData and run navigationOpenClose
		var openData = {openCloseView: openView,};	

	};
	// END IF - check if openData is set else
	
	// run navigationOpenClose
	navigationOpenCloseView(openData);
	
	// START IF - openFrom drawer
	if (openFrom == "drawer"){
		
		// START IF - Alloy.Globals.convertLanguageStrings set strings
		if (Alloy.Globals.convertLanguageStrings){ 
		
			// START log analytics data
			switch (openView) {
				case 'otCategory':
					logMenuButtonPressed(L("otLatin", "false"));
					break;
				case 'ntCategory':
					logMenuButtonPressed(L("ntLatin", "false"));
					break;
				case 'topicCategories':
					logMenuButtonPressed(L("topicsLatin", "false"));
					break;
				case 'bibleTopicCategories':
					logMenuButtonPressed(L("bibleTopicsLatin", "false"));
					break;
				case 'lifeTopicCategories':
					logMenuButtonPressed(L("lifeTopicsLatin", "false"));
					break;
				case 'questionCategories':
					logMenuButtonPressed(L("questionsLatin", "false"));
					break;
				case 'weixinView':
					logMenuButtonPressed(L("weixinLatin", "false"));
					break;
				case 'weiboView':
					logMenuButtonPressed(L("weiboLatin", "false"));
					break;
				default:
					break;
			};
			// END log analytics data
			
		}else{
			
			// START log analytics data
			switch (openView) {
				case 'otCategory':
					logMenuButtonPressed(L("ot"));
					break;
				case 'ntCategory':
					logMenuButtonPressed(L("nt"));
					break;
				case 'topicCategories':
					logMenuButtonPressed(L("topics"));
					break;
				case 'bibleTopicCategories':
					logMenuButtonPressed(L("bibleTopicCategories"));
					break;
				case 'lifeTopicCategories':
					logMenuButtonPressed(L("lifeTopicCategories"));
					break;
				case 'questionCategories':
					logMenuButtonPressed(L("questions"));
					break;
				case 'weixinView':
					logMenuButtonPressed(L("weixin"));
					break;
				case 'weiboView':
					logMenuButtonPressed(L("weibo"));
					break;
				default:
					break;
			};
			// END log analytics data
			
		};
		// END IF - Alloy.Globals.convertLanguageStrings set strings
		
	};
	// END IF - openFrom drawer
	
};

/**
 * Closes a navigation view.
 * @return     {function}  - function to close the current view
 */
exports.closeNavigationView = function(){
	
	// set openData and run navigationOpenClose
	var openData = {openCloseView: "closeView",};
	
	// run navigationOpenClose 
	navigationOpenCloseView(openData);
	
};

/**
 * Closes all views and returns home
 * @return     {function}  - function that can be run to close all views and return to home
 */
exports.navigationGoHome = function(){

	// set openData and run navigationOpenClose
	var openData = {openCloseView: "goHome",};
	
	// run navigationOpenClose 
	navigationOpenCloseView(openData);
	
	// openCloseMenu
	Ti.App.fireEvent('app:closeMenu'); 
	
	// FIRE EVENT - restart dailyScroller animation
	Ti.App.fireEvent('app:dailyScrollerAnimate');
	
	//  FIRE EVENT - to returnHome
    Ti.App.fireEvent("app:returnHome");
     		
};

/**
 * Updates the navigation view data 
 * - used by textView / topicView / questionView / selectedReadingView when a user scrolls to the next view
 *
 * @param      {object}  updateData  The update data
 * @param      {string}  updateData.lastView  The name of the view to open (string)
 * @param      {object}  updateData.lastOpenViewData The update data
 * @return     {function}  - function that updates the navigation view data
 */
exports.navigationUpdateData = function(updateData){
		
	// set updateData
	var updateData = {	openCloseView: "update",
						lastOpenViewData: updateData.lastOpenViewData,	
	};
								
	// run navigationOpenCloseView
	navigationOpenCloseView(updateData);
	
};

/**
 * navigationOpenCloseView Function
 * - opens or closes views based on the data storred in Alloy.Globals.openWindow and Alloy.Globals.openViewArray
 *
 * @param      {object}  openData  The open close view data
 * @param      {string}  openData.openCloseView  The name of the view to open (string)
 * @param      {object}  openData.openCloseViewData  The open close view data
 * 
 */
function navigationOpenCloseView(openData){
	
	//Ti.API.info(openData);
	
	// set currentWindow
	var currentWindow = Alloy.Globals.openWindow;
		
	// set openViewArray
	var openViewArray = Alloy.Globals.openViewArray;
		
	// set openCloseView
	var openCloseView = openData.openCloseView;
	
	// set openCLoseViewData
	var openCloseViewData = openData.openCloseViewData;
	
	// set firstView, currentView and currentViewData
	var firstView = openViewArray[0].openCloseView;
	var currentView = openViewArray[openViewArray.length-1].openCloseView;
	var currentViewData = openViewArray[openViewArray.length-1].openCloseViewData;
	
	// START IF = check if currentView == openCloseView and == Category then return
	if (currentView == openCloseView){
		
		if (openCloseView == "otCategory" || openCloseView == "ntCategory" || openCloseView == "topicCategories" || openCloseView == "bibleTopicCategories" || openCloseView == "lifeTopicCategories" || openCloseView == "questionCategories"){
			//Ti.API.info("Already on Category");
			return;
		};

	};
	// END IF = check if currentView == openCloseView and == Category then return
	
	//Ti.API.info(openViewArray);
	//Ti.API.info(currentWindow.children);
		
	// START IF - Check to close or open Views
	if  (openCloseView == "update"){
		
		//Ti.API.info("navigation - updateData");	
		//Ti.API.info("currentView:" + currentView);
		//Ti.API.info(currentViewData);
		
		// START IF - update currentViewData
		if (currentView == "TextView"){
			
			// update currentViewData
			currentViewData.chapterData = openData.lastOpenViewData;

		}else if (currentView == "TopicView"){
			
			// update currentViewData
			currentViewData.topicData = openData.lastOpenViewData;
 
		}else if (currentView == "questionView"){
			
			// update currentViewData
			currentViewData.questionData = openData.lastOpenViewData;

		}else if (currentView == "selectedReadingView"){
			 		
			// update currentViewData
			currentViewData.selectedReadingData = openData.lastOpenViewData;

		};
		// END IF - update currentViewData
		
	}else if (openCloseView == "closeView"){
		
		// set openViewArrayLength
		var openViewArrayLength = openViewArray.length;
				
		// START IF - set prevView
		if (openViewArrayLength == 1){
			var prevView = "exitApp";			
		}else{
			var prevView = openViewArray[openViewArray.length-2].openCloseView;
		};
		// END IF - set prevView
			
		// START IF - if prevView is mainWindow only remove view else add prevView and then remove currentView
		if (prevView == "exitApp"){
			
				// START IF - check to make sure androidExitApp is false
				if (Alloy.Globals.androidExitApp == false){
					
					//Ti.API.info("Ask Before Closing App");	
					
					// openCloseMenu
					Ti.App.fireEvent('app:closeMenu'); 
									
					// run closeMain function to Ask to Close Main View
					var closeMain = require("closeMainAndroid/closeMainAndroid");
					
					// set closeMainVars language strings for buttons
					var closeMainVars = {	confirm: L("closeAppConfirm"),
											cancel: L("closeAppCancel"),
											title: L("closeAppTitle"),
											message: L("closeAppMessage"),
						
					};
					
					// run closeMain
					closeMain(closeMainVars);
				
				};										
				// END IF - check to make sure androidExitApp is false			
				
		}else if (prevView == firstView){
					
			//Ti.API.info("navigation - prevView == firstView");
			
			// pop last value off array
			openViewArray.pop();
			
			// remove currentView
			var currentViewObject = currentWindow.children[1];
			currentWindow.remove(currentViewObject);
			currentViewObject = null;					
			
			// Ti.App.fireEvent to remove any eventListeners in Views
			Ti.App.fireEvent("app:navigationCloseView");
			
			// FIRE EVENT - restart dailyScroller animation
			Ti.App.fireEvent('app:dailyScrollerAnimate');
			
			//  FIRE EVENT - to returnHome
    		Ti.App.fireEvent("app:returnHome");
    
		}else{
			
			//Ti.API.info("navigation - prevView != firstView");
			
			// set current View as oldViewObject
			var oldViewObject = currentWindow.children[1];
			
			///////////////////////////////////////////////////////////////
			// 				START  - ADDING ACTIVITYLOADER VIEW			//
			
			// require module activityLoader and add to currentWindow
			var activityLoaderFunction = require('activityLoader/activityLoader');
			var activityLoader = activityLoaderFunction();
			currentWindow.add(activityLoader);
			
			// 				END - ADDING ACTIVITYLOADER VIEW			 //	
			///////////////////////////////////////////////////////////////
		
			// set preView Data
			var prevOpenCloseView = openViewArray[openViewArray.length-2].openCloseView;
			var prevOpenCloseViewData = openViewArray[openViewArray.length-2].openCloseViewData;
			
			// Ti.App.fireEvent to remove any eventListeners in Views
			Ti.App.fireEvent("app:navigationCloseView");
			
			// pop last value off array
			openViewArray.pop();	
			
			// START IF - check if openCloseViewData is set and create view
			if (prevOpenCloseViewData){
				var prevViewToOpen = Alloy.createController(prevOpenCloseView, prevOpenCloseViewData).getView();
			}else{
				var prevViewToOpen = Alloy.createController(prevOpenCloseView).getView();
			};						
			// END IF - check if openCloseViewData is set and create view	

			// add prevView
			currentWindow.add(prevViewToOpen);
		
			// remove currentView
			currentWindow.remove(oldViewObject);
			oldViewObject = null;
			
			// REMOVE ACTIVITYLOADER VIEW
			currentWindow.remove(activityLoader);
				
		};
		// END IF - if prevView is mainWindow only remove view else add prevView and then remove currentView
		
	}else if (openCloseView == "goHome"){
		
		// START IF - currentView not firstView
		if (currentView != firstView){	
			
			//Ti.API.info("navigation - currentView != firstView");
			
			// set currentViewObject
			var currentViewObject = currentWindow.children[1];
			
			// remove currentView
			currentWindow.remove(currentViewObject);
			currentViewObject = null;
				
			// Ti.App.fireEvent to remove any eventListeners in Views
			Ti.App.fireEvent("app:navigationCloseView");
			
			// pop last value off array
			var firstEntryData = openViewArray[0];
			
			// clear array and add back firstEntryData
			openViewArray.length = 0;
			openViewArray.push(firstEntryData);
     
		}else{
			//Ti.API.info("navigation - Already on Home");
		};				
		// END IF - currentView not firstView
			
	}else{ // ELSE OPENVIEW
		
		//Ti.API.info("navigation - OPENVIEW");
		
		///////////////////////////////////////////////////////////////
		// 				START  - ADDING ACTIVITYLOADER VIEW			//
		
		// require module activityLoader and add to currentWindow
		var activityLoaderFunction = require('activityLoader/activityLoader');
		var activityLoader = activityLoaderFunction();
		currentWindow.add(activityLoader);
		
		// 				END - ADDING ACTIVITYLOADER VIEW			 //	
		///////////////////////////////////////////////////////////////
		
		// push openData to END OF openViewArray
		var openData = { 	openCloseView: openCloseView,
							openCloseViewData: openCloseViewData,
						};
		
		openViewArray.push(openData);
		
		// Ti.App.fireEvent to remove any eventListeners in Views
		Ti.App.fireEvent("app:navigationCloseView");
				
		// START IF - check if openCloseViewData is set and create view
		if (openCloseViewData){
			var viewToOpen = Alloy.createController(openCloseView, openCloseViewData).getView();
		}else{
			var viewToOpen = Alloy.createController(openCloseView).getView();
		};
		// END IF - check if openCloseViewData is set and create view			
			
		// START IF - if currentView == firstView only add new view else add new view and then remove currentView from view
		if (currentView == firstView){	
			
			//Ti.API.info("navigation - currentView == firstView");
			
			// open view in currentWindow		
			currentWindow.add(viewToOpen);		
			
		}else{ // else add new view and then remove currentView from view but not array
			
			//Ti.API.info("navigation - currentView != firstView");
			
			// open view in currentWindow		
			currentWindow.add(viewToOpen);
			
			// set currentViewObject
			var prevViewObject = currentWindow.children[1];
			
			// remove currentView
			currentWindow.remove(prevViewObject);
			
			// set prevViewObject null
			prevViewObject = null;
			
		};
		// START IF - if currentView == firstView only add new view else add new view and then remove currentView from view
		
		// REMOVE ACTIVITYLOADER VIEW
		currentWindow.remove(activityLoader);	
		
	};
	// END IF - Check to close or open Views

	//Ti.API.info(openViewArray);
	//Ti.API.info(currentWindow.children);
			
};