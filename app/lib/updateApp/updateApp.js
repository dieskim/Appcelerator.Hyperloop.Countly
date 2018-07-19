/**
 * updateApp 
 * - returns a function to run to update the app on Android
 * 
 * Alloy.Globals: 
 * - {@link Alloy.Globals.customFont Alloy.Globals.customFont}
 * - {@link Alloy.Globals.mainColor Alloy.Globals.mainColor}
 * - {@link Alloy.Globals.selectedBackgroundColor Alloy.Globals.selectedBackgroundColor}
 * - {@link Alloy.Globals.darkColor Alloy.Globals.darkColor}
 * - {@link Alloy.Globals.openWindow Alloy.Globals.openWindow}
 * - {@link Alloy.Globals.androidClassName Alloy.Globals.androidClassName}
 * - {@link Alloy.Globals.convertLanguageStrings Alloy.Globals.convertLanguageStrings}
 * 
 * @requires   checkDownloadURL
 * @module updateApp
 *
 * @example    <caption>Require and run the function to update the app</caption>
 * // require updateAppModuleFunction Module
						var updateAppModuleFunction = require('updateApp/updateApp');
									
						// run updateAppModuleFunction
						updateAppModuleFunction({	url: updateData.url, 
													apk: Alloy.Globals.androidAPK,
													updateLater: function(e){
														// START IF - has data.updateLater function 
														if (data.updateLater){
															// set data.updateLater callback function
															data.updateLater();
														 };      
														// END IF - has data.updateLater function
													},
												});
 * 
 *  
 */


/**
 * updateApp function
 *
 * @param      {object}  updateAppData  The update app data
 * @param      {callback}  updateAppData.updateLater  the update later callback
 * @return     {function}  - function that can be run to update the app
 * 
 */
function updateApp(updateAppData){
	
	// set updateAppData
	var updateAppData = updateAppData;
	
	// create downloadAlert
	downloadAlert(	{	failed: function(e){
							///Ti.API.info('Update Failed!');
							
							// START IF - has data.updateLater function 
							if (updateAppData.updateLater){
								// set data.updateLater callback function
								updateAppData.updateLater();
							};      
							// END IF - has data.updateLater function	
					},
					updateData: updateAppData,
				});
	
	
};

/**
 * downloadAlert - the alert show when the app update downloads
 *
 * @param      {object}  downloadAlertData  The download alert data
 * @param      {array}  downloadAlertData.updateData  the update data array
 * @param      {callback}  downloadAlertData.failed update download failed callback
 * 
 */
function downloadAlert(downloadAlertData){
	
	// set updateData
	var updateData = downloadAlertData.updateData;
	
	// set alertHidden
	var alertHidden = false;
	
	// set vars
	var title = L("downloadCurrently");
	var updateBackground = L("update_started");
	
	// set downloade vars
	var downloadUrl = updateData.url;
	var downloadAPK = updateData.apk;
	
	// Set alertWindow
	var alertWindow = Ti.UI.createView({
		backgroundImage: '/images/transparent_black.png',
		width:	Ti.UI.FILL,
		height: Ti.UI.FILL,	
	});
	
	// create alertView container
	var alertView = Ti.UI.createView({
	  backgroundColor:'white',
	  opacity: 0.90,
	  borderRadius:5,
	  width: "85%",
	  height: Ti.UI.SIZE,
	  layout: 'vertical',
	});
	
	// create alertTitleView
	var alertTitleView = Ti.UI.createView({
		width: Ti.UI.FILL,
	 	height: Ti.UI.SIZE,
	 	top: "10dp",
	    bottom: "10dp",
	});
	
	// create alertTitleLabel
	var alertTitleLabel = Ti.UI.createLabel({
	  text: title,
	  color: 'black',
	  textAlign: 'center',
	  font: {
		fontSize: '20dp',
		fontFamily: Alloy.Globals.customFont
	  },
	  touchEnabled: false,
	  left: 5,
	  right: 5,
	});
	
	alertTitleView.add(alertTitleLabel);
	alertView.add(alertTitleView);
	
	// create alertRowSeperator
	var alertRowSeperator = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: "2dp",
		backgroundColor: Alloy.Globals.mainColor,
		top: 0,		  
	});
		
	alertView.add(alertRowSeperator);
		
	// create alertStatusView
	var alertStatusView = Titanium.UI.createView({  
	    height: "70dp",
	    width:	Ti.UI.FILL,
	    top: "10dp",
	    bottom: "10dp",
	    layout: "vertical",
	});
	
	// START FUNCTION - updateDownloadProgress
	function updateDownloadProgress(downloadProgress){
		
		// update downloadStatusBar value with downloadProgress
		downloadStatusBar.value = downloadProgress;
		
		// calculate downloadProgressValue
		downloadProgressValue = Math.round(downloadProgress * 100);
		
		// START IF - downloadProgressValue larger than downloadStatusLabel.percentageValue then update
		if (downloadProgressValue > downloadStatusLabel.percentageValue){
			
			// set downloadStatusLabel with downloadProgress
			downloadStatusLabel.percentageValue = downloadProgressValue;
			downloadStatusLabel.text = downloadProgressValue + "%";
			
		};
		// END IF - downloadProgressValue larger than downloadStatusLabel.percentageValue then update
		
	};
	// END FUNCTION - updateStatusBarProgress
	
	// create downloadStatusBarView
	var downloadStatusBarView = Titanium.UI.createView({  
	    height: "15dp",
	    width:	Ti.UI.FILL,
	    top: "10dp",	
		bottom: "5dp",
	});

	// create downloadStatusBar
	var downloadStatusBar = Titanium.UI.createSlider({
		min: 0,
		max: 1,
		thumbImage: "/images/transparent.png",
	   	width: '95%',
	  	value: 0,
	   	touchEnabled: false,  	
	   	leftTrackImage: "/images/slider_left.png",
		rightTrackImage: "/images/slider_right.png",
	});
	
	// add downloadStatusBar to downloadStatusBarView and downloadStatusBarView to alertStatusView
	downloadStatusBarView.add(downloadStatusBar);
	alertStatusView.add(downloadStatusBarView);
	
	// create downloadStatusLabel
	var downloadStatusLabel = Ti.UI.createLabel({
		height: "20dp",
		percentageValue: 0,
		text: "0" + "%",
		color: 'black',
		textAlign: 'right',
		font: {
			fontSize: '15dp',
			fontWeight: 'bold',
		 },
		touchEnabled: false,	
		top: "5dp",
		bottom: "5dp",
		right: "15dp",
	});
	
	// add downloadStatusLabel to alertStatusView and alertStatusView to alertView
	alertStatusView.add(downloadStatusLabel);	
	alertView.add(alertStatusView);
	
	// Start Create alertButtonRow	  
	var alertButtonRow = Ti.UI.createView({
		height: "45dp",
		width:	Ti.UI.FILL,
		top: 0,    
		layout: "vertical",
	});
		
	// create alertButtonView
	var alertButtonView = Ti.UI.createView({
		backgroundORInstall: "downloading",
		APK: '',
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
		backgroundSelectedColor: Alloy.Globals.selectedBackgroundColor, 
		touchEnabled: false, 
	});
		
	// create alertButtonView
	var alertButtonSeperator = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: "1dp",
		backgroundColor: Alloy.Globals.darkColor,
		top: 0,		  
	});
			
	// create alertButtonLabel
	var alertButtonLabel = Ti.UI.createLabel({
		text: updateBackground,
		color: 'black',
		textAlign: 'center',
		font: { fontSize: '14dp',
				fontFamily: Alloy.Globals.customFont
			  },
		touchEnabled: false,	
		left: 5,
		right: 5,
	});
		
	// add eventlistener to Button
	alertButtonView.addEventListener('click', function() {
		
		// START IF - alertButtonView.backgroundORInstall == "install"
		if (alertButtonView.backgroundORInstall == "install"){
			
			// set installAPK
			var installAPK = alertButtonView.APK;
			
			// run installAppUpdate
			installAppUpdate(downloadAPK);
			
		};
		// END IF - alertButtonView.backgroundORInstall == "install"
				
	});
			
	alertButtonView.add(alertButtonSeperator);
	alertButtonView.add(alertButtonLabel);
	alertButtonRow.add(alertButtonView);
	
	// Push cancelButton to end of buttonArray
	alertView.add(alertButtonRow);
	
	// add alertView to Window
	alertWindow.add(alertView);
	
	// set openAlertForm to disable android back button
	Alloy.Globals.openAlertForm = true;
	
	// OPEN WINDOW
	var currentWindow = Alloy.Globals.openWindow;
	currentWindow.add(alertWindow);
	
	// START FUNCTION - setInstallButton
	function setInstallButton(installAPK){
		
		// change backgroundUpdate button to install button
		alertButtonView.APK = installAPK;
		alertButtonView.backgroundORInstall = "install";
		alertButtonLabel.text = L("installUpdateNow");
		alertButtonLabel.color = Alloy.Globals.mainColor;	
		alertButtonLabel.touchEnabled = true;	
			  
	};
	// END FUNCTION - setInstallButton
	
	// START - downloadUpdate
	downloadUpdate({success: function(e){
							
							// run setInstallButton - in case we need to rerun after settings changes
							setInstallButton(downloadAPK);
							
							// run installAppUpdate
							installAppUpdate(downloadAPK);
							
					},		
					update: function(downloadProgress){				
							
							// run updateDownloadProgress with downloadProgress
							updateDownloadProgress(downloadProgress);						
					},					
					failed: function(e){
							
							// CLOSE WINDOW
							var currentWindow = Alloy.Globals.openWindow;
							currentWindow.remove(alertWindow);		
							
							// set openAlertForm to disable android back button
							Alloy.Globals.openAlertForm = false;
	
							// START IF - has downloadAlertData.failed function 
							if (downloadAlertData.failed){
								// set downloadUpdateData.failed callback function
								downloadAlertData.failed();
							};      
							// END IF - has downloadAlertData.failed function							
					},
					downloadUrl: downloadUrl,
					downloadAPK: downloadAPK,
				});
	// END - downloadUpdate 
	
};

/**
 * Downloads the app update apk
 *
 * @param      {object}  downloadUpdateData  The download update data
 * @param      {string}  downloadUpdateData.downloadUrl  The download url
 * @param      {string}  downloadUpdateData.downloadAPK  The download apk file name
 * @param      {string}  downloadUpdateData.success  success callback
 * @param      {string}  downloadUpdateData.update  update callback
 * @param      {string}  downloadUpdateData.failed  failed callback
 * 
 */
function downloadUpdate(downloadUpdateData){
	
	// set vars
	var URL = downloadUpdateData.downloadUrl;
	var APK = downloadUpdateData.downloadAPK;
	
	///Ti.API.info("downloadUpdate Function: " + URL + APK);
	
	// set showNotification var
    var showNotification = false;
        
    // Require checkDownloadURL module
	var checkDownloadURL = require('checkDownloadURL/checkDownloadURL');
	
	// START - use checkDownloadURL and check for working URL                            
    checkDownloadURL.checkDownloadURL({
    	method: 'GET',
		apkFileName: APK,
		storageType: 'temp',
		urlArrayString: URL,
		success: function (success) {										// on Success
			///Ti.API.info("Download Complete");
            
            // START IF - has downloadUpdateData.success function 
			if (downloadUpdateData.success){
				// set downloadUpdateData.update callback function
				downloadUpdateData.success();
			};      
			// END IF - has downloadUpdateData.success function
            
        	// cancel download notification	
			Ti.Android.NotificationManager.cancel(3);			                                      
		},
 		datastream: function(datastream) {									// on Datastream
			///Ti.API.info('Download - Progress: ' + datastream.progress);
            
            // START IF - notification false - show notification
 			if (showNotification == false){                      	             
           		
         		// set notification message
				var notificationMessage = L("update_started");		
                                    
				showAndroidNotification("create", notificationMessage);         
				showNotification = true;    
			
			};
			// END IF - notification false - show notification 
			
			// START IF - has downloadUpdateData.update function 
			if (downloadUpdateData.update){
				// set downloadUpdateData.update callback function
				downloadUpdateData.update(datastream.progress);
			};      
			// END IF - has downloadUpdateData.update function
													                               
		},      
		error: function (error) {											// on Error
			///Ti.API.info('Download Error' + error);
            
            // set notification message 
			var notificationMessage =  L("update_failed");	
		  
            var downloadURL = URL + APK;                        
			showAndroidNotification("failed", notificationMessage, downloadURL);
			
			// START IF - has downloadUpdateData.failed function 
			if (downloadUpdateData.failed){
				// set downloadUpdateData.failed callback function
				downloadUpdateData.failed();
			};      
			// END IF - has downloadUpdateData.failed function
				                                  
		 },
	});
    // END - use checkDownloadURL and check for working URL				
};


/**
 * install the app update apk function
 *
 * @param      {string}  APK     the apk file name string
 * 
 */
function installAppUpdate(APK){
	
	///Ti.API.info("Start - installAppUpdate");
	
	//set apkFile
	var apkFile = Titanium.Filesystem.getFile(Ti.Filesystem.tempDirectory, APK);					            
	
	if(Ti.Platform.Android.API_LEVEL >= 24){
		
		////Ti.API.info("Start - installAppUpdate >= 24");
		
		//set install intent
		var intent = Ti.Android.createIntent({
			action: Ti.Android.ACTION_VIEW,
			data: apkFile.nativePath,
			type: "application/vnd.android.package-archive",
		});
		
		var flags = [Ti.Android.FLAG_GRANT_READ_URI_PERMISSION];		
		intent.flags = flags;
		
		// run install intent							
		Ti.Android.currentActivity.startActivity(intent);
						
	}else{
		
		////Ti.API.info("Start - installAppUpdate < 24");
		
		//set install intent
		var intent = Ti.Android.createIntent({
			action: Ti.Android.ACTION_VIEW,
			data: apkFile.nativePath,
			type: "application/vnd.android.package-archive",		
		});
		
		var flags = [Ti.Android.FLAG_ACTIVITY_NEW_TASK];		
		intent.flags = flags;
		
		// run install intent							
		Ti.Android.currentActivity.startActivity(intent);	
		
	};
							
};

/**
 * Shows the android notification.
 *
 * @param      {string}  createUpdate         update / failed - string to create the notification for download or run remove and open the browser with the url
 * @param      {string}  notificationMessage  The notification message
 * @param      {string}  downloadURL          The download url
 */
function showAndroidNotification(createUpdate,notificationMessage, downloadURL){
		
		if (createUpdate == "create"){
			
			var contentTextVar = notificationMessage;
			var iconVar = Ti.App.Android.R.drawable.stat_sys_download;
			var flagsVar = Titanium.Android.FLAG_NO_CLEAR | Titanium.Android.FLAG_ONGOING_EVENT;
			
			// Intent object to launch the application 
			var intent = Ti.Android.createIntent({
			    action : Ti.Android.ACTION_MAIN,
			    className: Alloy.Globals.androidClassName,
			    flags : Ti.Android.FLAG_ACTIVITY_SINGLE_TOP | Ti.Android.FLAG_ACTIVITY_NEW_TASK,
			});
			intent.addCategory(Ti.Android.CATEGORY_LAUNCHER);
		
		}else if (createUpdate == "failed"){
			
			var contentTextVar = notificationMessage;	
			var iconVar = Alloy.Globals.androidNotificationIcon;
			var flagsVar = Titanium.Android.FLAG_NO_CLEAR | Titanium.Android.FLAG_AUTO_CANCEL;	
			
			// Intent object to open link downloadURL
			var intent = Ti.Android.createIntent({
			    action : Ti.Android.ACTION_VIEW,
			    data: downloadURL,
			    className: 'com.android.browser.BrowserActivity',
   				packageName: 'com.android.browser'

			});
				
		};	
		
		// START IF - Alloy.Globals.convertLanguageStrings set strings
		if (Alloy.Globals.convertLanguageStrings){ 
		
			// set contentText
			var contentText = L("appNameLatin", "false");
		
		}else{
			
			// set contentText
			var contentText = L("appName");
			
		};
		// END IF - Alloy.Globals.convertLanguageStrings set strings
		
		// Create a PendingIntent to tie together the Activity and Intent
		var pending = Titanium.Android.createPendingIntent({
		    intent: intent,
		    flags: Titanium.Android.FLAG_UPDATE_CURRENT
		});
    	
    	///Ti.API.info("Flags" +  flagsVar);
    	
		var notification = Titanium.Android.createNotification({
          	contentTitle: contentTextVar,
            contentText: contentText,
            tickerText : contentTextVar,
            when: 0,
            icon : iconVar,
           	flags : flagsVar,
           	contentIntent: pending
        });
        
		Ti.Android.NotificationManager.notify(3, notification);
};	

module.exports = updateApp;
