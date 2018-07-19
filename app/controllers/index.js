// add app EventListener to openCloseMenu
Ti.App.addEventListener('app:openCloseMenu', function(e) {
  	
   	$.drawer.toggleRightWindow();
	
});

// add app EventListener to closeMenu
Ti.App.addEventListener('app:closeMenu', function(e) {

	if($.drawer.isAnyWindowOpen()){				// change from $.drawer.isRightWindowOpen() since that seems to not work anymore on iOS
				
		$.drawer.toggleRightWindow();
		
	};
	
});

// add app EventListener to drawer windowDidClose
$.drawer.addEventListener("windowDidClose", function(e) {
		
		Ti.App.fireEvent('app:closeMenuFunction');	 
		
});

// Listen for android back button and close all Views on top that might be displayed	
$.drawer.addEventListener('androidback', function (e){
	
	// START IF - Alloy.Globals.openAlertForm not open
	if (!Alloy.Globals.openAlertForm){
		
		// run closeNavigationView
		navigationOpenClose.closeNavigationView();	
		
	};	
	// END IF - Alloy.Globals.openAlertForm not open
	
});
	
// open drawer
$.drawer.open();

////////////////////////////////////////////////////////////////////////////////////////////////////////
// 									START sessionStart section 					  					  //

// run sessionStart
sessionStart(); 
		
// 								END sessionStart section 					  					  //
////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////	
// 							START APP STARTUP FUNCTIONS	SECTION										 //
	
// START - setTimeout 1 second to run checkEnableXML and openLastOpenView
setTimeout(function(){
	
	//Ti.API.info("Alloy.Globals.appOpenFromPush: " + Alloy.Globals.appOpenFromPush);
	
	// START IF - Alloy.Globals.enableDateDelayedFunctions false - will only take effect on next startup or next time function called using Alloy.Globals.enableDateDelayedFunctions
	if(Alloy.Globals.enableDateDelayedFunctions != true){
	
		//Ti.API.info("Run checkEnableFeatures.checkEnableXML");
		
		// run checkEnableFeatures.checkEnableXML()
		checkEnableFeatures.checkEnableXML();
		
	};
	// END IF - Alloy.Globals.enableDateDelayedFunctions false
	
	// START IF - Alloy.Globals.appOpenFromPush = false then run this		
	if (!Alloy.Globals.appOpenFromPush){
		var openLastOpenView = require("openLastOpenView/openLastOpenView");
		openLastOpenView();	
	};
	// END IF - Alloy.Globals.appOpenFromPush = false then run this
	
}, 1000);
// END - setTimeout 1 second to run checkEnableXML and openLastOpenView

// START - setTimeout 2 seconds to run sendFormsFunction and logAppUsageAmount
setTimeout(function(){
	
	// require sendForm lib
	var sendFormsFunction = require('formData/sendForm');
		
	// run sendFormsFunction
	sendFormsFunction();
	
	// logAppUsageAmount
	logAppUsageAmount();
	
}, 2000);
// END - setTimeout 2 seconds to run sendFormsFunction and logAppUsageAmount

// START - setTimeout 4 seconds to run Alloy.Globals.AnalyticsUserData
setTimeout(function(){	
	Alloy.Globals.AnalyticsUserData();
}, 4000);
// END - setTimeout 4 seconds to run Alloy.Globals.AnalyticsUserData

// START FUNCTION - only run these function if enableDateDelayedFunctions true
if (Alloy.Globals.enableDateDelayedFunctions){
	
	// START - setTimeout 5 seconds to run checkUpdate
	setTimeout(function(){	
		runUpdateCheck("auto");
	}, 5000);
	// END - setTimeout 5 seconds to run checkUpdate
	
	// START - setTimeout 10 seconds to run checkXMLPush
	setTimeout(function(){	
		
		// require checkXMLPush
		var checkXMLPush = require('checkXMLPush/checkXMLPush');
		
		//run checkXMLPush
		checkXMLPush();
				
	}, 10000);
	// END - setTimeout 10 seconds to run checkXMLPush
	
	// START - setTimeout 12 seconds to run checkCountlyURL - just as a precaution - for next startup
	setTimeout(function(){	
		
		//run checkCountlyURL.checkURL()
		checkCountlyURL.checkURL();
				
	}, 12000);
	// END - setTimeout 12 seconds to run checkCountlyURL - just as a precaution - for next startup
	
};
// END FUNCTION - only run these function if enableDateDelayedFunctions true
		
// 							END APP STARTUP FUNCTIONS SECTION										  //
////////////////////////////////////////////////////////////////////////////////////////////////////////	