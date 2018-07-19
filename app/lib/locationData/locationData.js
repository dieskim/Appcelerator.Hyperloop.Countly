/**
 * locationData
 * - getLocationData gets the stored location.
 * - getCurrentLocation gets the current location.
 * 
 *  * Alloy.Globals: 
 * - {@link Alloy.Globals.locationDefault Alloy.Globals.locationDefault}
 * - {@link Alloy.Globals.AnalyticsEvent Alloy.Globals.AnalyticsEvent}
 * - {@link Alloy.Globals.AnalyticsUserData Alloy.Globals.AnalyticsUserData}
 * - {@link Alloy.Globals.disableCustomFontSpesificInstances Alloy.Globals.disableCustomFontSpesificInstances}
 * - {@link Countly Countly}
 * 
 * @requires   customAlert
 * @module locationData
 * @example    <caption>Require and run getLocationData to get stored location</caption>
 * 	// require locationData module
	var locationData = require('locationData/locationData');
		
	// set gpsLocation
	var locationString = locationData.getLocationData();
 *
 * @example    <caption>Require and run getCurrentLocation to get current location - set locationCaller for events</caption>
 * 	// require locationData module
	var locationData = require('locationData/locationData');
		
	// run locationData.getCurrentLocation
				locationData.getCurrentLocation({ 	locationCaller: formName,
															success: function(){
																
																// run sendForm
																sendForm(formData);
																
															},
															error: function(e){
																
																// run sendForm
																sendForm(formData);
															
															},
				});
 * 
 */


/**
 * Gets the stored locationData 
 * - if no location found returns Alloy.Globals.locationDefault
 * @param      {string} stringObject - string to return string else object
 * @return     {function}  - function that returns the stored location / Alloy.Globals.locationDefault
 */
exports.getLocationData =  function(stringObject){
	
	// set locationString
	var locationReturn = '';
	var locationData = JSON.parse(Ti.App.Properties.getString('lastLocation','{}'));
	
	//Ti.API.info("locationData");
	//Ti.API.info(locationData);
		
	//START IF - check for empty locationData
	if (locationData.longitude === undefined || locationData.latitude === undefined || locationData.longitude == '' || locationData.latitude == ''){
		
		//Ti.API.info("locationData is empty.");
		locationReturn = Alloy.Globals.locationDefault;
		
	}else{
		
		// START IF - stringObject string return string else object
		if(stringObject == "string"){

			// set locationReturn as string
			var locationLatitude = locationData.latitude || '';
			var locationLongitude = locationData.longitude || '';
			locationReturn = locationLatitude + ' ' + locationLongitude;

		}else{

			// set locationReturn as object
			locationReturn = locationData;
			
		};
		// END IF - stringObject string return string else object
	
	};
	//END IF - check for emtpy locationData
	
	//Ti.API.info("locationReturn:" + locationReturn);
		
	return locationReturn;
		
};

/**
 * Logs a location error to countly
 *
 * @param      {object}  locationErrorData  - The location error data
 * @param      {string} locationErrorData.error - The error string
 * @param      {string} locationErrorData.locationCaller - The location caller function name
 */
function logLocationError(locationErrorData){
	
	// set eventData
	var eventData = {	eventType: "error",
						eventName: "locationError", 
						eventVars: {"Error": locationErrorData.error,
									"GPSLocation Caller": locationErrorData.locationCaller,
						},									
	};
			
	// send AnalyticsEvent										
	Alloy.Globals.AnalyticsEvent(eventData);
	
};

/**
 * Gets the location now.
 * On Success:
 * - send location success event to countly via Alloy.Globals.AnalyticsEvent
 * - updates user profile via Alloy.Globals.AnalyticsUserData
 * - set users location via Alloy.Globals.AnalyticsRecordLocation
 * On Error: 
 * - runs logLocationError
 *
 * @param      {object} getLocationNowData  - The location data
 * @param      {string} [getLocationNowData.locationCaller] - location caller function name
 * @param      {callback} [getLocationNowData.success] - success callback
 * @param      {callback} [getLocationNowData.error] - error callback
 */
function getLocationNow(getLocationNowData){
	
	Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
	Titanium.Geolocation.distanceFilter = 10;
	
	Titanium.Geolocation.getCurrentPosition(function(e){
		
		// START IF - success then update lastLocation
	    if (e.success){
		       	
	       	Ti.API.info('Current Location Success');
		       	
	        var longitude = '';
	       	var longitude = '';	
		       	
	       	// START IF - check if e.coords is set
	       	if (e.coords){
	       		var latitude = e.coords.latitude;
	       		var longitude = e.coords.longitude;
	       	};
	        // END IF - check if e.coords is set
		       
	       	// set locationData
	        var locationData = {latitude: latitude,
								longitude: longitude,};
								
			// Set Ti.App.Properties - lastLocation
			Ti.App.Properties.setString('lastLocation',JSON.stringify(locationData));	
			
			Ti.API.info('Current Location = ' + JSON.stringify(locationData));       
		       
		    // run getLocationNowData.success
	    	if(getLocationNowData.success){
	    		getLocationNowData.success();
	    	};
	    	 
			// START - send analytics location Event
			// get dateTime
			var dateTime = getDateTime();
			
			// set eventData
			var eventData = {	eventType: "location",
								eventName: "GPSLocation", 
								eventVars: {"GPSLocation": latitude + ' ' + longitude,
											"GPS Timestamp": dateTime,
											"GPSLocation Caller": getLocationNowData.locationCaller,
											},									
			};
			
			// send AnalyticsEvent										
			Alloy.Globals.AnalyticsEvent(eventData);
			// END - send analytics location Event
			
			// run 	AnalyticsUserData
			Alloy.Globals.AnalyticsUserData();
											
		    // run Alloy.Globals.AnalyticsRecordLocation with gpsLocation as locationData
		    Alloy.Globals.AnalyticsRecordLocation({gpsLocation: locationData})
			
	    }else{
		    				
			Ti.API.info('Location Error ' + JSON.stringify(e.error));
				
			// run getLocationNowData.error
	    	if(getLocationNowData.error){
	    		getLocationNowData.error(e);
	    	};
		    
		    // send logLocationError  
		    logLocationError({	error:JSON.stringify(e),
								locationCaller: getLocationNowData.locationCaller,
			});	
			
	    };
	    // END IF - success then update lastLocation
	   
	   
	});
		
};
// END FUNCTION - getLocationNow 

/**
 * Gets the current location.
 * - requests permissions 
 * On Success:
 * - gets location via getLocationNow
 * On Error:
 * - logs error via logLocationError
 *
 * @param      {object}  data    The data
 * @param      {callback} [data.success] - success callback
 * @param      {callback} [data.error] - error callback
 * 
 *
 * @return     {function}  - function that asks user for permissions and then gets location via getLocationNow
 */
exports.getCurrentLocation = function (data){

	// set permissionsAsked
	var permissionsAsked = false;
	
	// START FUNCTION - requestPermissionsNow
	function requestPermissionsNow(){
						
		Titanium.Geolocation.requestLocationPermissions(Ti.Geolocation.AUTHORIZATION_WHEN_IN_USE, function(result) {
			
			// START IF - success or else 
			if(result.success){
				
				Ti.API.info('requestLocationPermissions Success');				
				
				// run getLocationNow
				getLocationNow(data);
		
			}else{
										
				Ti.API.info('requestLocationPermissions Not Success - run popup or openSettings');
				Ti.API.info('permissionsAsked: ' + permissionsAsked);
									
				// START IF - permissionsAsked true openSettings
				if(permissionsAsked){
					
					Ti.API.info('run openSettings');					
					
					// START IF - iOS / ANDROID
					if (OS_IOS){
						
						// set settingsURL
						var settingsURL = Ti.App.iOS.applicationOpenSettingsURL;
							
						// START IF - canOpenURL settingsURL
						if(Ti.Platform.canOpenURL(settingsURL)){
							
							// set logErrorMessage
						    var logErrorMessage = 'Location Denied: Opening Settings';
						    
							// run data.error
							if(data.error){
								data.error(logErrorMessage);
							};
							
							// send logLocationError  
						    logLocationError({	error:logErrorMessage,
												locationCaller: data.locationCaller,
							});
							
							// openURL settingsURL
							Ti.Platform.openURL(settingsURL);
							
						}else{
						    	
						    // set logErrorMessage
						    var logErrorMessage = 'Location Denied: Cannot open applicationOpenSettingsURL';
						    
							// run data.error
							if(data.error){
								data.error(logErrorMessage);
							};
							
							// send logLocationError  
						    logLocationError({	error:logErrorMessage,
												locationCaller: data.locationCaller,
							});	
				
							// fire app:showAlertMessage with message            
		                    Ti.App.fireEvent("app:showAlertMessage",{
		                    	message: L("locationPermissionsSettings"),  
		                    	disableCustomFont: Alloy.Globals.disableCustomFontSpesificInstances,      
		                    });
		                        
						};
						// END IF - canOpenURL settingsURL
	
					}else{
						
						// START IF - ANDROID < 6.0 then show message else open settings
						var versionRequired = "6.0";
						
						if (versionCompare(Ti.Platform.version,versionRequired) == true) {
				                
				                // set logErrorMessage
				                var logErrorMessage = 'Location Denied - Opening Settings';
				                
				                // run data.error
								if(data.error){
									data.error(logErrorMessage);
								};
								
				                // run openSettings
								openSettings();	
								
								// send logLocationError  
							    logLocationError({	error:logErrorMessage,
													locationCaller: data.locationCaller,
								});	
							
			            }else{
			            		
			            		// set logErrorMessage
				                var logErrorMessage = 'Location Denied - Android < 6 - Cant Open Opening Settings';
				                
			            		// run data.error
								if(data.error){
									data.error(logErrorMessage);
								};
								
								// send logLocationError  
							    logLocationError({	error:logErrorMessage,
													locationCaller: data.locationCaller,
								});	
									
								// fire app:showAlertMessage with message            
		                        Ti.App.fireEvent("app:showAlertMessage",{
		                            message: L("locationPermissionsSettings"),
		                            disableCustomFont: Alloy.Globals.disableCustomFontSpesificInstances,
		                        });
		                        
		                        
			            };    
						// END IF - ANDROID < 6.0 then show message else open settings
					
					};				
					// END IF - iOS / ANDROID							
										
				}else{
										
					// set permissionsAsked true
					permissionsAsked = true;
										
					// require module customAlert in app/assets/lib/
					var customAlert = require('customAlert/customAlert');
										
					// set createAlert Dialog params
					var okButton = L("locationPermissionsConfirm");
					var cancelButton = L("locationPermissionsCancel");
					var title = L("locationPermissionsTitle");	
					var message = L("locationPermissionsMessage");
	
					//createAlert AlertDialog with params		
					var notificationData = {
						cancelIndex: 1,
						buttonNames: [okButton, cancelButton],
						message: message,
						title: title,
						disableCustomFont: Alloy.Globals.disableCustomFontSpesificInstances,
						click: function(e){
												
							//START IF - ok or settings clicked
							if (e.index == 0){					
								Ti.API.info('The Ok Button was clicked');				
													
								// run requestPermissionsNow
								requestPermissionsNow();					
									
							}else{
								Ti.API.info('The Cancel Button was clicked');
								
								// set logErrorMessage
								var logErrorMessage = "Location Denied - Popup 'Not Now' Clicked";
								
								// run data.error
								if(data.error){
									data.error(logErrorMessage);
								};
									
								// fire app:showAlertMessage with message            
		                        Ti.App.fireEvent("app:showAlertMessage",{
		                            message: L("locationPermissionsFailed"),
		                            disableCustomFont: Alloy.Globals.disableCustomFontSpesificInstances,      
		                        });
		                        
		                        // send logLocationError  
							    logLocationError({	error:logErrorMessage,
													locationCaller: data.locationCaller,
								});	
								
							};
							//END IF - ok or settings clicked
						},
					};
										
					// show AlertDialog notification
					customAlert.show(notificationData);
									
				};
				// END IF - permissionsAsked true openSettings
							
	  		};
	  		// END IF - success or else
	  		
			});
			
	};
	// END FUNCTION - requestPermissionsNow
	
	/**
	 * Opens device settings on Android
	 */
	function openSettings(){
						
		// set intentData
		var intentData = {action: 'android.settings.APPLICATION_DETAILS_SETTINGS', data: 'package:' + Ti.App.getId()};
		var flags = [Ti.Android.FLAG_ACTIVITY_NEW_TASK, Ti.Android.FLAG_ACTIVITY_NO_HISTORY, Ti.Android.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS];
		var intent = Ti.Android.createIntent(intentData);
		intent.flags = flags;
						
		// run openSettings intent							
		Ti.Android.currentActivity.startActivity(intent);

	};
					
	// START IF - if hasLocationPermissions false then ask
	if (!Ti.Geolocation.hasLocationPermissions(Ti.Geolocation.AUTHORIZATION_WHEN_IN_USE)) {
					
		Ti.API.info('No hasLocationPermissions - try to ask');
						
		// run requestPermissionsNow 
		requestPermissionsNow();			
	 				
	}else{
		
		Ti.API.info('hasLocationPermissions - getLocationNow');
		
		// run getLocationNow
		getLocationNow(data);
	
	};
	// END IF - if hasLocationPermissions false then ask
	
};