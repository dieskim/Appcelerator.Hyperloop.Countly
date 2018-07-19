////////////////////////////////////////////////////////////////////////////////////////////////////
///								Start closeMain Functions										///
function closeMain(closeMainVars){
	
	// set androidExitApp true
	Alloy.Globals.androidExitApp = true;
	
	// set createAlert Dialog params
	var confirm = closeMainVars.confirm;
	var cancel = closeMainVars.cancel;
	var title = closeMainVars.title;
	var message = closeMainVars.message;
	
	// require module customAlert in app/assets/lib/
	var customAlert = require('customAlert/customAlert');
		
	//createAlert AlertDialog with params		
	var notificationData = {
		cancelIndex: 0,
		buttonNames: [cancel,confirm],
		message: message,
		title: title,
		alertName: "closeMainAndroidAlert",
		click: function(e){
						//START IF - Cancel Clicked close ELSE
					    if (e.index == 1){    			      		
					      	Ti.API.info('Leave App Clicked');
					      	
					      	// close app
						    var intent = Ti.Android.createIntent({
						        action: Ti.Android.ACTION_MAIN,
						        flags:Ti.Android.FLAG_ACTIVITY_NEW_TASK
						    });
						    intent.addCategory(Ti.Android.CATEGORY_HOME);
						    Ti.Android.currentActivity.startActivity(intent);

					      				 				    
						}else{
							
							Ti.API.info('Cancel Clicked');						
							
							// set androidExitApp false
							Alloy.Globals.androidExitApp = false;
							
						};	
						//END IF - Cancel Clicked close ELSE
			},
	};	
	
	// show AlertDialog notification
	customAlert.show(notificationData);
};
//         						 END Function - closeMain to 		 				     	    //
//////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = closeMain;