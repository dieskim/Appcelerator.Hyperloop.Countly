/**
 * alertFormOpenClose Module 
 * - exports a function that opens alerts and forms
 *  
 * Alloy.Globals: 
 * - {@link Alloy.Globals.openWindow Alloy.Globals.openWindow}
 * - {@link Alloy.Globals.openAlertFormArray Alloy.Globals.openAlertFormArray}
 * - {@link Alloy.Globals.openAlertForm Alloy.Globals.openAlertForm}
 * 
 * 
 * @module     alertFormOpenClose
 * @example    <caption>Require and Provide alertWindow to open </caption>
 *
 * 	// require alertFormOpenClose
 * 	var alertFormOpenClose = require('alertFormOpenClose/alertFormOpenClose');
	
	var alertFormData = { 	alertFormName: alertName,
							alertWindow: alertWindow,
							close:  function(){
								
								// START IF - iOS or Android - CLOSE WINDOW
								if (OS_IOS){
									alertWindow.close();
								}else{
									
									var currentWindow = Alloy.Globals.openWindow;
									currentWindow.remove(alertWindow);	
								};
								// END IF - iOS or Android - CLOSE WINDOW
								
								// set Alloy.Globals.openAlertForm false
								Alloy.Globals.openAlertForm = false;
					
							},
	};
	
	// run alertFormOpenClose with alertWindow
	alertFormOpenClose(alertFormData);
 * 
 */

/**
 * opens and closes Alerts and Forms
 *
 * @return {function} - function to use to open alerts and forms - checks if the alert/form should be opened before it opens
 * @param 	   {Object}  alertFormData - alertForm data object
 * @param 	   {string}  alertFormData.alertFormName - alert form name
 * @param      {Ti.UI.Window|Ti.UI.View} alertFormData.alertWindow - window or view to open
 * @param      {callback} [alertFormData.close] - callback function to run when window or view closed
 */
function alertFormOpenClose (alertFormData){
	
	//Ti.API.info("alertFormOpenClose");
	
	//Ti.API.info(Alloy.Globals.openAlertForm);
	//Ti.API.info(Alloy.Globals.openAlertFormArray);
	
	// set alertWindow
	var alertWindow = alertFormData.alertWindow;
	
	// set alertFormName
	var alertFormName = alertFormData.alertFormName;
	
	// set isAlertOpen
	var isAlertOpen = Alloy.Globals.openAlertForm;
	
	// START IF - isAlertOpen then open first alert
	if (isAlertOpen != true){
		
		// clear openAlertForm
		Alloy.Globals.openAlertForm = true;
		
		// clear openAlertArray
		Alloy.Globals.openAlertFormArray = [];
		
		// push alertFormData to openAlertArray
		Alloy.Globals.openAlertFormArray.push(alertFormData);
		
		// START IF - iOS or Android OPEN WINDOW
		if (OS_IOS){
			alertWindow.open();
		}else{
			var currentWindow = Alloy.Globals.openWindow;
			currentWindow.add(alertWindow);
		};
		// END IF - iOS or Android OPEN WINDOW	
	
	}else{	// else check if should close old alert and open new one
		
		//Ti.API.info("isAlertOpen = "+ isAlertOpen);
		
		// set lastOpenAlert
		var lastOpenAlert = Alloy.Globals.openAlertFormArray[0];
		
		// set lastAlertFormName
		var lastAlertFormName = lastOpenAlert.alertFormName;
		
		// START IF - compare lastFormAlertName to alertFormName
		var shouldAlertFormBeOnTopValue = shouldAlertFormBeOnTop(alertFormName,lastAlertFormName);
		
		// START IF - shouldAlertFormBeOnTopValue true then close old popup and open new
		if (shouldAlertFormBeOnTopValue){
			
			// close lastOpenAlert
			lastOpenAlert.close();
			
			// pop last value off openAlertArray
			Alloy.Globals.openAlertFormArray = [];
			
			// set Alloy.Globals.openAlertForm as true
			Alloy.Globals.openAlertForm = true;
			
			// push alertFormData to openAlertArray
			Alloy.Globals.openAlertFormArray.push(alertFormData);
			
			// START IF - iOS or Android OPEN WINDOW
			if (OS_IOS){
				alertWindow.open();
			}else{
				var currentWindow = Alloy.Globals.openWindow;
				currentWindow.add(alertWindow);
			};
			// END IF - iOS or Android OPEN WINDOW	
			
		};
		// END IF - shouldAlertFormBeOnTopValue true then close old popup and open new	
		
	};
	// END IF - isAlertOpen then open first alert
	
};

/**
 * check if alert or form should be on top - open if should else dont
 *
 * @param      {string}   alertFormName      The alert form name
 * @param      {string}   lastAlertFormName  The last alert form name
 * @return     {boolean}  true to open / false to not open
 */
function shouldAlertFormBeOnTop(alertFormName,lastAlertFormName){
	
	//Ti.API.info("alertFormName: " + alertFormName + " lastAlertFormName: " + lastAlertFormName);

	// set alertFormNameIndex
	var alertFormNameIndex = alertFormImportanceList.indexOf(alertFormName);
	
	// set lastAlertFormNameIndex
	var lastAlertFormNameIndex = alertFormImportanceList.indexOf(lastAlertFormName);
	
	// START IF - alertFormNameIndex not in list or alertFormNameIndex < lastAlertFormNameIndex
	if (alertFormNameIndex == -1 || alertFormNameIndex < lastAlertFormNameIndex){		
		
		
		//Ti.API.info("alertFormNameIndex: " + alertFormNameIndex + " lastAlertFormNameIndex: " + lastAlertFormNameIndex);
		//Ti.API.info("Return true - CLOSE OLD POPUP");
		
		return true;
		
	}else{
		
		//Ti.API.info("alertFormNameIndex: " + alertFormNameIndex + " lastAlertFormNameIndex: " + lastAlertFormNameIndex);
		//Ti.API.info("Return false - DONT CLOSE OLD POPUP");
		
		return false;
			
	};	
	// END IF - alertFormNameIndex not in list or alertFormNameIndex < lastAlertFormNameIndex
	
};

module.exports = alertFormOpenClose;