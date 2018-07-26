// add app EventListener to closeMenuFunction
Ti.App.addEventListener('app:closeMenuFunction', function() {
    
    // START IF - Alloy.Globals.fontRowOpen close
   	if (Alloy.Globals.fontRowOpen != false){
		openFontSize();
   	};	
   	// END IF - Alloy.Globals.fontRowOpen close	
    
    $.menuTable.scrollToTop(0);  
    
});

// START Function -  openPsalms
function openPsalms(){
	
	// close Menu
	Ti.App.fireEvent('app:openCloseMenu');
	
	logMenuButtonPressed(L("psalmsLatin", "false"));
	
	// START RUN - loadText - open Psalm 1
	loadText({	book: 19,
				chapter: 1,
	});	
	
};
// END Function -  openPsalms

// START Function -  openDownloads
function openDownloads(){		
	
	// close Menu
	Ti.App.fireEvent('app:openCloseMenu');
	
	///////////////////////////////////////////////////////////////
	// 				START  - ADDING ACTIVITYLOADER VIEW			//
	
	// set currentWindow
	var mainWindow = Alloy.Globals.openWindow;
			
	// require module activityLoader and add to currentWindow
	var activityLoaderFunction = require('activityLoader/activityLoader');
	var activityLoader = activityLoaderFunction();
	mainWindow.add(activityLoader);
			
	// 				END - ADDING ACTIVITYLOADER VIEW			 //	
	///////////////////////////////////////////////////////////////
						
	var downloadView = Alloy.createController('downloadView').getView();
	downloadView.open();
	
	// REMOVE ACTIVITYLOADER VIEW
	mainWindow.remove(activityLoader);	
						
};
	
// END Function -  openDownloads

// START Function -  openSubscribe
function openSubscribe(){
	
	if (Ti.Platform.osname=='android') {
		// close Menu
		Ti.App.fireEvent('app:openCloseMenu');
	};
	
	//send analytics data
	logMenuButtonPressed("Subscribe");
	
	// require module subscribeForm in app/assets/lib/
	var subscribeForm = require('scheduleNotifications/subscribeForm');
	
	// show subscribeForm
	subscribeForm();
	
};
// END Function -  openSubscribe

// START Function -  openFontSize

function openFontSize(e) {
	
	// START IF - check if globalFontSizeRow set else use e.index
	if (Alloy.Globals.fontSizeRow){
		
		// set fontSizeRow as Alloy.Globals.fontSizeRow
		var fontSizeRow = Alloy.Globals.fontSizeRow;	
		
	}else{
		
		// set fontSizeRow as e.index
		var fontSizeRow = e.index;
		
		// set Alloy.Globals.fontSizeRow
		Alloy.Globals.fontSizeRow = e.index;
		
	};
	// END IF - check if globalFontSizeRow set else use e.index
		
	// START IF - Check if fontSizeOpen close else open
	if (Alloy.Globals.fontRowOpen != false){
		
		if (OS_IOS){
			var animationVar = Titanium.UI.iOS.RowAnimationStyle.NONE;
		}else{
			var animationVar = null;
		}; 
					
		// Insert a new row under fontSizeRow
		$.menuTable.deleteRow(fontSizeRow+1,{animationStyle:animationVar});
		
		// set fontSize open false
		Alloy.Globals.fontRowOpen = false;
		
	}else{
		
		if (OS_IOS){
			var animationVar = Titanium.UI.iOS.RowAnimationStyle.DOWN;
		}else{
			var animationVar = null;
		}; 

		// set fontSizeTableRow
		var fontSizeTableRow = Alloy.createController('fontSizeTableRow').getView();
		
		// Insert a new row under fontSizeRow
		$.menuTable.insertRowAfter(fontSizeRow,fontSizeTableRow,{animationStyle:animationVar});
		
		// set fontSize open true
		Alloy.Globals.fontRowOpen = true;
	};
	// START IF - Check if fontSizeOpen close else open
							
};
// END Function -  openFontSize

// START Function -  openFontSize
function openShareApp(e) {
	//Ti.API.info("shareApp Clicked");
		
	// require module showForms in app/assets/lib/
	var showForms = require('formData/showForms');
	showForms.showShare();
	
};
// END Function -  openFontSize	

// START Function -  openContact
function openContact(e) {
	
	if (Ti.Platform.osname=='android') {
		// close Menu
		Ti.App.fireEvent('app:openCloseMenu');
	};
		
	// require module showForms in app/assets/lib/
	var showForms = require('formData/showForms');
	showForms.showContact();
	
	// TO TEST DIFFERENT FORMS - ** REMEMBER EVERY FORM WILL ONLY SHOW ONCE PER BOOK - ETHER DELETE APP OR SET DIFFERENT BOOKID ** 
	// 1 - COMMENT showContact above
		
	// 2 - UNCOMMENT THE BOOKRECORD 
	//var bookRecord = getSetBookData({	getSet: "getBookRecord", bookID:42, });
	
	// 3 - UNCOMMENT THE FORM YOU NEED	
	//showForms.showShare();
	//showForms.showAppHighUsageForm();				
	//showForms.booksReadBasic(bookRecord);			
	//showForms.booksReadHalf(bookRecord);
	//showForms.booksReadComplete(bookRecord);
	// manually test push form
	
};
// END Function -  openContact

// START IF - check if android
if (OS_ANDROID){	
	$.menuTable.addEventListener('click', function(e){
	    
	   	var rowClickedIndex = e.index;
	   	$.menuTable.data[0].rows[rowClickedIndex].backgroundColor = "#bbbbbb";
	   	setTimeout(function(){
				$.menuTable.data[0].rows[rowClickedIndex].backgroundColor = "transparent";
		}, 300);
		
	});
};
// END IF - check if android

//////////////////////////////////////////////////////////////////////////////////////////////////
// 							START setUpdateMenu Functions section								//

// Add App eventlistener to listen for setUpdateMenu
Ti.App.addEventListener("app:setUpdateMenu", setUpdateMenu);

// START Function - setUpdateMenu
function setUpdateMenu(){
	
	// get updateAvailable from Ti.App.Properties
	var updateAvailable = Ti.App.Properties.getString('updateAvailable',"false");
	
	//Ti.API.info("Running setUpdateMenu - updateAvailable: " + updateAvailable);
	
	// START IF - hasUpdate
	if (updateAvailable == "false"){
		
		//Ti.API.info("Running setUpdateMenu - NO UPDATE");
		
		// hasUpdate so set menu to show update
		$.update_label.color = "white";
		$.update_label.text = L("checkForUpdate");
	
	}else{
		
		//Ti.API.info("Running setUpdateMenu - UPDATE");
		
		// hasUpdate so set menu to show update
		$.update_label.color = "red";
		$.update_label.text = L("updateAvailable");
		
	};
	// END IF - hasUpdate
	
};
// END Function - setUpdateMenu

// RUN setUpdateMenu
setUpdateMenu();

// 							END setUpdateMenu Functions section								//
//////////////////////////////////////////////////////////////////////////////////////////////////

// START IF - iOS and Alloy.Globals.enableDateDelayedFunctions not true then hide row
if (Alloy.Globals.enableDateDelayedFunctions != true){
	
		$.menuTable.deleteRow(10);
			
};
// END IF - iOS and Alloy.Globals.enableDateDelayedFunctions not true then hide row