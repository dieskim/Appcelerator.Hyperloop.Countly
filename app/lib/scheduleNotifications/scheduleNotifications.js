/**
 * scheduleNotifications
 * - scheduleLocalNotification schedules local notifcaitons spesified
 * 
 * Alloy.Globals: 
 * - {@link Alloy.Globals.defaultNotificationSubscriptions Alloy.Globals.defaultNotificationSubscriptions}
 * - {@link Alloy.Globals.defaultNotificationDays Alloy.Globals.defaultNotificationDays}
 * - {@link Alloy.Globals.vodNotificationTime Alloy.Globals.vodNotificationTime}
 * - {@link Alloy.Globals.qodNotificationTime Alloy.Globals.qodNotificationTime}
 * - {@link Alloy.Globals.defaultComeBackNotificationDays Alloy.Globals.defaultComeBackNotificationDays}
 * 
 * @requires vodPrepare
 * @requires qodPrepare
 * @module scheduleNotifications
 * @example    <caption>Require and run scheduleLocalNotification to schedule local nofications</caption>
 * 
 * // require scheduleNotification module
		var scheduleNotifications = require('scheduleNotifications');
		
		// run scheduleLocalNotificaiton with subscribeData	
		scheduleNotifications.scheduleLocalNotification(subscribeData);
 * 
 */

/**
 * comeBackID / VODStartID / QODStartID
 * - default vars to notifation ids
 */
 var comeBackID = 1;					// comeBack notification ID
 var VODStartID = 10;					// vod notification IDs will be 10 -> 16
 var QODStartID = 20;					// qod notification IDs will be 20 -> 26
			
/**
 * schedules local nofications
 *
 * @param      {object}  subscribeToNotifactionsData  The subscribe to notifactions data
 * @return     {function}  - function that can be run to schedule local notifcations
 */
exports.scheduleLocalNotification = function (subscribeToNotifactionsData){
	
	// START IF - iOS/Android cancel all old notifications
	if(OS_IOS){
		
		// cancel all localNotifcations and clear appBadge
		Ti.App.iOS.cancelAllLocalNotifications();
		Ti.UI.iOS.setAppBadge(0);
	
	}else{
		
		// cancel all localNotifcations - one for JPush and one for notification manager
		Titanium.Android.NotificationManager.cancelAll();
		JPush.clearLocalNotifications();			
		
	};
	// END IF - iOS/Android cancel all old notifications
	
	// first run subscribeToNotifactions
	subscribeToNotifactions(subscribeToNotifactionsData);

	// set defaultSubscriptionData
	var defaultSubscriptionData = Alloy.Globals.defaultNotificationSubscriptions;
	
	// Get Ti.App.Properties - subscriptionDataArray
	var subscriptionDataArray = JSON.parse(Ti.App.Properties.getString("subscriptionData",'false'));
				
	// START IF - subscriptionData true then schedule notifications that need scheduling
	if(subscriptionDataArray){
		
		// START Loop - through defaultSubscriptionData
		for (var t=0; t<defaultSubscriptionData.length; t++){
			
			// set notificationName
			var defaultNotificationName = defaultSubscriptionData[t];
			
			// START IF - defaultNotificationName in subscriptionDataArray schedule
			if (subscriptionDataArray.indexOf(defaultNotificationName) > -1){
				
				// schedule notifications for defaultNotificationName
				scheduleNotification(defaultNotificationName);
				
			};
			// END IF - defaultNotificationName in subscriptionDataArray schedule
			
		};
		// END Loop - through subscribeData
		
	};
	// END IF - subscriptionData true then schedule notifications that need scheduling

	// if not in cancel all to make sure they are gone - as in test.js desktop
	
	
};

/**
 * subscribeToNotifactions to subscribe to notifcations
 *
 * @param      {object}  subscribeData  The notifcations to subscribe to data
 * @param      {string} subscribeData.notificationName notifcation name
 * @param      {boolean} subscribeData.notificationSubscribeValue notfication subscribe true / false
 */
function subscribeToNotifactions(subscribeData){
	
	// Get Ti.App.Properties - subscriptionData
	var currentSubscriptionData = JSON.parse(Ti.App.Properties.getString("subscriptionData",'false'));
	
	// START IF - currentSubscriptionData not false update - else set for first time to defaults 
	if(currentSubscriptionData){
		
		// START IF - subscribeData set then update subscriptionData else do nothing
		if(subscribeData){
			
			// START Loop - through subscribeData
			for (var t=0; t<subscribeData.length; t++){
				
				// set vars
				var notificationName = subscribeData[t].notificationName;
				var notificationSubscribeValue = subscribeData[t].notificationSubscribeValue;
					
				// START IF - if notificationSubscribeValue true(1) and not if currentSubscriptionData then add or check to remove
				if (notificationSubscribeValue && currentSubscriptionData.indexOf(notificationName) == -1){
									
					// add to subscriptionData
					currentSubscriptionData.push(notificationName);
					
				}else if (!notificationSubscribeValue && currentSubscriptionData.indexOf(notificationName) > -1){ // check if should remove
									
					// get value in array
					var notificationIndex = currentSubscriptionData.indexOf(notificationName);
					
					// remove from array
					currentSubscriptionData.splice(notificationIndex, 1);
					
				};
				// END IF - if notificationSubscribeValue true(1) and not if currentSubscriptionData then add or check to remove
			};
			// END Loop - through subscribeData
			
			// Set Ti.App.Properties - subscriptionData
			Ti.App.Properties.setString("subscriptionData",JSON.stringify(currentSubscriptionData));
			
			
		};
		// END IF - subscribeData set then set according to that else set as currentSubscriptionData
		
	}else{ // set first time to defaults
		
		// set subscriptionData as Alloy.Globals.defaultNotificationSubscriptions
		var subscriptionData = Alloy.Globals.defaultNotificationSubscriptions;
		
		// Set Ti.App.Properties - subscriptionData
		Ti.App.Properties.setString("subscriptionData",JSON.stringify(subscriptionData));
		
	};
	// END IF - currentSubscriptionData not false update - else set first time
		
};

/**
 * scheduleNotification to schedule notifcations for spesific category
 *
 * @param      {string}  notificationName  - The notification name
 */
function scheduleNotification(notificationName){
	
	//Ti.API.info(notificationName + " - Schedule");
   		
   	// START IF - notificationName handle accordingly
   	if(notificationName == "vod"){
    	
    	// START Loop - Alloy.Globals.defaultNotificationDays
		for (var d=0; d<Alloy.Globals.defaultNotificationDays; d++){
				
			// set notificationID 
			var notificationID = d;
				 
			// schedule VOD notification
			scheduleVODNotification(notificationID);
			
		};
   		// END Loop - Alloy.Globals.defaultNotificationDays
	
   	}else if(notificationName == "qod"){
   					
   		// START Loop - Alloy.Globals.defaultNotificationDays
		for (var d=0; d<Alloy.Globals.defaultNotificationDays; d++){
				
			// set notificationID 
			var notificationID = d;
				 
			// schedule QOD notification
			scheduleQODNotification(notificationID);
		
		};
   		// END Loop - Alloy.Globals.defaultNotificationDays
	
   	}else if(notificationName == "comeBack"){
   			
   		// schedule comeBack notification
   		comeBackToAppNotification();
   			
   	};
   	// END IF - notificationName handle accordingly
   			
};

/**
 * scheduleVODNotification - build and schedule vod notifcations for days spesified
 *
 * @param      {number}  notificationID  - The notification id
 */
function scheduleVODNotification(notificationID){
	
	// set scheduleNotificationID
	var scheduleNotificationID = (+VODStartID + notificationID);
	
	// set notificationName
	var notificationName = "vodNotification";
	
	// set date to schedule notification for
	var scheduleDate = new Date();					// set Date as now
	
	// set currentHours
	var currentHours = scheduleDate.getHours();
	
	// START IF - currentHours < Alloy.Globals.vodNotificationTime set addExtraDay 0 else 1
	if (currentHours < Alloy.Globals.vodNotificationTime){
		var addExtraDay = 0;
	}else{
		var addExtraDay = 1;
	};
	// END IF - currentHours < Alloy.Globals.qodNotificationTime set addExtraDay 0 else 1
												
	scheduleDate.setDate(scheduleDate.getDate() + addExtraDay + notificationID);		// add addExtraDay + notificationID
	scheduleDate.setHours(Alloy.Globals.vodNotificationTime);							// set hour to Alloy.Globals.vodNotificationTime
	scheduleDate.setMinutes(0);															// zero out minutes
	scheduleDate.setSeconds(0);															// zero out seconds
	
	//Ti.API.info("Schedule for: " + scheduleDate);
	
	// Get Day of Year
	var dayOfYear = scheduleDate.getDOY();
	
	// require vodPrepare module
	var vodPrepare = require('vodPrepare/vodPrepare');
	
	// set vodDataText
	var vodDataText = vodPrepare.vodDataTextPrepare(dayOfYear);
		
	// get VOD according to day of year as when to schedule notification above  
	// build notification									
	// START IF - iOS ELSE Android
	if (OS_IOS){
		
		// set message
		var message = L("todaysVerse") + " : " + vodDataText.vodText;
		
	  	// set scheduled notification
	    var notification = Ti.App.iOS.scheduleLocalNotification({
	        
	        // Create an ID for the notification 
	        userInfo: {"id": scheduleNotificationID, "alertType": notificationName, "alertData": vodDataText},
	        alertBody: message,
	        badge: 1,
	        date: scheduleDate, 
	        	        
	    });
    		
   }else{ // ELSE ANDROID
   		
   		// set Language String
		var title = L("todaysVerse");
	
   		// set message
		var message = vodDataText.vodText;
		
   		// set notificationExtras
   		var notificationExtras = {	alertType: notificationName,
   									alertData: vodDataText,
   									};
   									
   		// set notificationData
   		var notificationData = {	content: message, 												// content string
   									title: title, 													// title string
   									id: scheduleNotificationID,										// id - numbers only
   									time: (scheduleDate.getTime() - new Date().getTime()),        	// time from now in miliseconds 
   									extras: notificationExtras,										// extras as object if needed		
   								};
   		
   		// use JPush to addLocalNotication							
		JPush.addLocalNotification(notificationData);
   	
   };
   // END IF - iOS ELSE Android
   
};

/**
 * scheduleQODNotification - build and schedule qod notifcations for days spesified
 *
 * @param      {number}  notificationID - The notification id
 */
function scheduleQODNotification(notificationID){
	
	// set scheduleNotificationID
  	var scheduleNotificationID = (+QODStartID + notificationID);
  
	// set notificationName
  	var notificationName = "qodNotification";
  	
  	// set date to schedule notification for
	var scheduleDate = new Date();                      // set Date as now
	
	// set currentHours
	var currentHours = scheduleDate.getHours();
	
	// START IF - currentHours < Alloy.Globals.qodNotificationTime set addExtraDay 0 else 1
	if (currentHours < Alloy.Globals.qodNotificationTime){
		var addExtraDay = 0;
	}else{
		var addExtraDay = 1;
	};
	// END IF - currentHours < Alloy.Globals.qodNotificationTime set addExtraDay 0 else 1
	
	scheduleDate.setDate(scheduleDate.getDate() + addExtraDay + notificationID);    // add addExtraDay + notificationID
	scheduleDate.setHours(Alloy.Globals.qodNotificationTime);       // set hour to Alloy.Globals.vodNotificationTime
	scheduleDate.setMinutes(0);                       // zero out minutes
	scheduleDate.setSeconds(0);                       // zero out seconds
  
  	// Get Day of Year
  	var dayOfYear = scheduleDate.getDOY();
  
	// require qodPrepare module
  	var qodPrepare = require('qodPrepare');
 	 
  	// set qodDataText
  	var qodDataText = qodPrepare.qodDataTextPrepare(dayOfYear);
  	
  	// get VOD according to day of year as when to schedule notification above  
  	// build notification                 
  	// START IF - iOS ELSE Android
  	if (OS_IOS){
    
   		// set message
  		var message = L("todaysQuestion") + " : «" + qodDataText.qodText + "»";
    
      	// set scheduled notification
      	var notification = Ti.App.iOS.scheduleLocalNotification({
          
          	// Create an ID for the notification 
         	userInfo: {"id": scheduleNotificationID, "alertType": notificationName, "alertData": qodDataText},	
          	alertBody: message,
          	badge: 2,
          	date: scheduleDate, 
                    
     	 });
        
   }else{ // ELSE ANDROID
      
      	// set Language String
    	var title = L("todaysQuestion");
  
      	// set message
      	var message = "«" + qodDataText.qodText + "»";
    
      	// set notificationExtras
      	var notificationExtras = {  alertType: notificationName,
                    				alertData: qodDataText,
                    };
                    
      	// set notificationData
      	var notificationData = {  	content: message,               								// content string
                    				title: title,                									// title string
                    				id: scheduleNotificationID,         							// id - numbers only             		
                   					time: (scheduleDate.getTime() - new Date().getTime()),        	// time from now in miliseconds     					
                    				extras: notificationExtras,        						 		// extras as object if needed
                  };
      
      	// use JPush to addLocalNotication              
    	JPush.addLocalNotification(notificationData);
    
   };
   // END IF - iOS ELSE Android
   
};

/**
 * comeBackToAppNotification - build and schedule to 'Come Back To App' notifcation
 */
function comeBackToAppNotification(){
	
	// START IF - check subscriptionData and set badgeNumber
	// Get Ti.App.Properties - subscriptionData
	var currentSubscriptionData = JSON.parse(Ti.App.Properties.getString("subscriptionData",'false'));
	if(currentSubscriptionData.length>2){
		var badgeNumber = 3;
	}else{
		var badgeNumber = 2;
	};
	// END IF - check subscriptionData and set badgeNumber
	
	// set scheduleNotificationID
	var scheduleNotificationID = comeBackID;
	
	// set notificationName
	var notificationName = "comeBackNotification";
	
	// set Language String
	var title = L("appName"); 
	var message = L("comeBackToAppMessage");
	
	// set days until notification needs to be shown
	var days = Alloy.Globals.defaultComeBackNotificationDays;
	var daysVar = 1000 * 60 * 60 * 24 * days;
								
	// START IF - iOS ELSE Android
	if (OS_IOS){
		
	  	// set scheduled notification
	    var notification = Ti.App.iOS.scheduleLocalNotification({
	        
	        // Create an ID for the notification 
	        userInfo: {"id": scheduleNotificationID, "alertType": notificationName,},
	        alertBody: message,
	        badge: badgeNumber, 
	        date: new Date(new Date().getTime() + daysVar),
	        
	    });
    		
   }else{ // ELSE ANDROID
   		
   		// set notificationExtras
   		var notificationExtras = {	alertType: notificationName,
   									};
   									
   		// set notificationData
   		var notificationData = {	content: message, 							// content string
   									title: title, 								// title string
   									id: scheduleNotificationID,					// id - numbers only
   									time: daysVar,								// time from now in miliseconds
   									extras: notificationExtras,					// extras as object if needed
   								};
   		
   		// use JPush to addLocalNotication							
		JPush.addLocalNotification(notificationData);
   	
   };
   // END IF - iOS ELSE Android
   
};