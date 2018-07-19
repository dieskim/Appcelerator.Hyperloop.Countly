/**
 * checkDownloadURL Module
 * - checkDownloadURL - checks for a working url in the array or urls provided, returns / downloads the working url
 * - requestStoragePermissions - requests storage permission and returns success or failed callback
 * 
 * Alloy.Globals: 
 * - {@link Alloy.Globals.storageDevice Alloy.Globals.storageDevice}
 * - {@link Alloy.Globals.AnalyticsEvent Alloy.Globals.AnalyticsEvent}
 * 
 * @requires   customAlert
 * 
 * @module checkDownloadURL
 * 
 * @example    <caption>Require and use checkDownloadURL for Download</caption>
 * 	// START - use checkDownloadURL and check for working URL                            
	checkDownloadURL.checkDownloadURL({
	    method: 'GET',
	    audioFileName: audioFileName,
	    urlArrayString: urlArrayString,
	    success: function (success) {                                                               
	        
	        // on Success
	        Ti.API.info("Download Complete");
	                                              
	    },
	    datastream: function(datastream) {                                                          
	        
	        // on Datastream
	        Ti.API.info('Download - Progress: ' + datastream.progress);
	                    
	    },      
	    error: function (error) {                                                                   

	        // on Error
	        Ti.API.info('Download Error' + error);
	                            
	    },
	});
	// END - use checkDownloadURL and check for working URL

 *
 * @example    <caption>Require and use checkDownloadURL to check url</caption>	
 * 	// START - use checkDownloadURL and check for working URL                            
	checkDownloadURL.checkDownloadURL({
	    urlArrayString: URLArrayString,                      // set urlArrayString
	    success: function (success) {                                                               
	        
	        // on Success
	        Ti.API.info("Success - URL Found: " + success.foundURL);                
	                                              
	    },  
	    error: function (error) {                                                                   

	        // on Error
	        Ti.API.info("Error - All URLS Failed"); 
	                            
	    },
	});
	// END - use checkDownloadURL and check for working URL

*
*
* @example    <caption>Require and use requestStoragePermissions to get storage permissions</caption>	
* // START - use checkDownloadURL.requestStoragePermissions to ask for storage permissions and run functions on success or failed                         
		var checkDownloadURL = require('checkDownloadURL/checkDownloadURL');
		checkDownloadURL.requestStoragePermissions({ success: function(){	
														
														Ti.API.info("Has Storage Permissions - do what you need to do")
																
													},
													failed: function(){		
														
														Ti.API.info("NO Storage Permissions - show alert / message")

													},
		});
		// END - use checkDownloadURL.requestStoragePermissions to ask for storage permissions and run functions on success or failed	

*
*
*/

/**
 * checks for a working url in the url provided and download or return
 *
 * @param      {object}  data   - url data object
 * @param      {string} data.urlArrayString - url array string to loop throught to check / download
 * @param      {integer} [data.arrayVar] - current arrayVar when looping
 * @param      {httpmethod} [data.method] - HEAD (to check url) / GET (download url)
 * @param      {string} [data.audioFileName] - audio file name to add at end url to check / get
 * @param      {string} [data.apkFileName] - apk file name to add at end url to check / get
 * @param      {string} [data.urlPostfix] - url postfix to add at end of url to check / get
 * @param      {callback} [data.success] - success callback - contains foundURL on check
 * @param      {callback} [data.datastrean] - datastream callback
 * @param      {callback} [data.error] - error callback
 * 
 * @fires app:showAlertMessage
 * 
 * @return {function} - function to use to check url and download file if needed
 * 
 */

exports.checkDownloadURL = checkDownloadURL;

function checkDownloadURL (data){            
    
    // set arrayVar as data.arraVar else 0
    var arrayVar = data.arrayVar || 0;
	
	// set method as data.method else HEAD
	var method = data.method || 'HEAD';
	
	// set audioFilename as data.audioFileName else false
	var audioFileName = data.audioFileName || false;
	
	// set apkFileName as data.apkFileName else false
	var apkFileName = data.apkFileName || false;
	
	// set urlPostfix data.urlPostfix else false
	var urlPostfix = data.urlPostfix || false;
	
	// set urlArrayString as data.urlArraString
    var urlArrayString = data.urlArrayString;
    
    // create urlArray from urlArrayString using split
    var urlArray = urlArrayString.split(',');
	
	// START IF - set url with audioFileName / apkFileName / urlPostfix added if set
    if (audioFileName){
    	
    	// set url
    	var url = urlArray[arrayVar] + audioFileName;
    	
    	// set downloadFileName
    	var downloadFileName = audioFileName;
    	
    }else if (apkFileName){
    	
    	// set url
    	var url = urlArray[arrayVar] + apkFileName;
    	
    	// set downloadFileName
    	var downloadFileName = apkFileName;
    	
    }else if (urlPostfix){
    	
    	// set url
    	var url = urlArray[arrayVar] + urlPostfix;
    	
    }else{
    	
    	// set url
    	var url = urlArray[arrayVar];
    	
    };
    // END IF - set url with audioFileName / apkFileName / urlPostfix added if set
    
    Ti.API.info("checkURL - Checking URL: " + url);
    
    // createHTTPClient       
    var client = Ti.Network.createHTTPClient({
        onload : function(e) {												// if success do           
            Ti.API.info("checkURL Success - URL Found: " + url);
            
            // set foundURL = url                            
            var foundURL = url;         
    		
    		// START IF - method HEAD vs GET	
			if (method == 'HEAD'){
    			
    			// START IF - has data.success function 
	            if (data.success){
	                // set data.success callback function
	                data.success({
	                    foundURL: foundURL,
	                });
	            };      
    			// END IF - has data.success function
    			
    		}else{
    			
    			// START IF - if android check if has permissions to storage else ask
				if (OS_ANDROID){	
					
					// run requestPermissionsNow 
					requestPermissionsNow({ success: function(){	// run downloadURL
													    			downloadURL({ 	downloadData: data,
													    							downloadURL: foundURL,	
													    							downloadFileName: downloadFileName,								
													    			});

											},
											failed: function(){		// fire app:showAlertMessage with message            
												                    Ti.App.fireEvent("app:showAlertMessage",{
												                    	message: L("storagePermissionsFailed"),    
												                    });

											},

					});
			
				}else{
				
					// run downloadURL
    				downloadURL({ 	downloadData: data,
    								downloadURL: foundURL,	
    								downloadFileName: downloadFileName,								
    				});
    			
				};
				// END IF - if android check if has permissions to storage else ask
    			
    		};	
    		// END IF- method HEAD vs GET	           
         
        },
        onerror : function(e) {												// on error do            
            Ti.API.info("checkURL Error - File URL Not Found");
            
            // set nextArrayVar 
            var nextArrayVar = +arrayVar+1;
            
            // START IF - nextArrayVar is smaller than urlArray.length 	 
            if (nextArrayVar<urlArray.length){             	           
                Ti.API.info("checkURL Error - Checking next URL");     
                
                // set data.arrayVar as nextArrayVar
                data.arrayVar = nextArrayVar;             
               
               	// rerun checkDownloadURL with OLD data including NEW data.arrayVar
               	checkDownloadURL(data);

            }else{
                
                // START IF - has data.error 
                if (data.error){
                	
                	// set data.error callback
                	data.error(e);

            	};
            	// END IF - has data.error
            	
        	};
        	// END IF - nextArrayVar is smaller than urlArray.length
    	},
    });
            
    // open the connection with client.open with method and url
    client.open('HEAD', url);
    
    // Send the request.
    client.send();      
    
};

/**
 * requestPermissionsNow 
 * - requests storage permissions with popups and opens settings when needed
 *	
 * @param      {object}  	requestData  			The request data
 * @param      {callback}  	requestData.success  	The request success callback
 * @param      {object}  	requestData.failed  	The request failend callback
 * @param      {boolean}  	requestData.permissionAsked  			The request permissionAsked boolean
 * 
 * @return {function} - function to use to request storage permissions
 */
exports.requestStoragePermissions = requestPermissionsNow;

function requestPermissionsNow(requestData){
	
	// START IF - if hasStoragePermissions false then ask
	if (!Ti.Filesystem.hasStoragePermissions()) {

		Ti.API.info('NO StoragePermissions - Ask for Permissions');

		// set permissionAsked
		var permissionAsked = requestData.permissionAsked || false;

		Ti.Filesystem.requestStoragePermissions(function(result) {
			
			// START IF - success or else 
			if(result.success){
				
				Ti.API.info('requestStoragePermissions Success');		
				
				// START IF - has requestData.success 
	            if (requestData.success){
	                	
	                // run requestData.success callback
	                requestData.success();

	            };
	            // END IF - has requestData.success
		
			}else{
										
				Ti.API.info('Permission Not Success - run popup or openSettings');
				Ti.API.info('permissionsAsked: ' + permissionAsked);
									
				// START IF - permissionsAsked true openSettings
				if(permissionAsked){
					
					Ti.API.info('run openSettings');					
					
					// START IF - ANDROID < 6.0 then show message else open settings
					var versionRequired = "6.0";
					
					if (versionCompare(Ti.Platform.version,versionRequired) == true) {
			                
			                // run openSettings
							openSettings();	
							
							// START IF - has requestData.failed 
				            if (requestData.failed){
				                	
				                // run requestData.failed callback
				                requestData.failed();

				            };
				            // END IF - has requestData.failed
				            
							// set logErrorMessage
	           				var logErrorMessage = 'Storage Denied - Opening Settings';

							// send logStorageError  
							logStorageError({	error:logErrorMessage,
							});
								
		            }else{
		            		
		            		// START IF - has requestData.failed 
				            if (requestData.failed){
				                	
				                // run requestData.failed callback
				                requestData.failed();

				            };
				            // END IF - has requestData.failed

				            // set logErrorMessage
	           				var logErrorMessage = 'Storage Denied - Android < 6 - Cant Open Opening Settings';
	            
	            			// send logStorageError  
							logStorageError({	error:logErrorMessage,
							});
							
	                        
		            };    
					// END IF - ANDROID < 6.0 then show message else open settings
												
										
				}else{
										
					// set requestData.permissionAsked true
					requestData.permissionAsked = true;
										
					// require module customAlert in app/assets/lib/
					var customAlert = require('customAlert/customAlert');
										
					// set createAlert Dialog params
					var okButton =  L("storagePermissionsConfirm");
					var cancelButton = L("storagePermissionsCancel");
					var title = L("storagePermissionsTitle");
					var message = L("storagePermissionsMessage");

					//createAlert AlertDialog with params		
					var notificationData = {
						cancelIndex: 1,
						buttonNames: [okButton, cancelButton],
						message: message,
						title: title,
						click: function(e){
												
							//START IF - ok or settings clicked
							if (e.index == 0){					
								Ti.API.info('The Ok Button was clicked');				
													
								// run requestPermissionsNow
								requestPermissionsNow(requestData);					
									
							}else{
								Ti.API.info('The Cancel Button was clicked');
								
									// START IF - has requestData.failed 
					            if (requestData.failed){
					                	
					                // run requestData.failed callback
					                requestData.failed();

					            };
					            // END IF - has requestData.failed

								// set logErrorMessage
								var logErrorMessage = "Storage Denied - Popup 'Not Now' Clicked";
								
		                        // send logStorageError  
							    logStorageError({	error:logErrorMessage,
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

	}else{
		
		Ti.API.info('Has StoragePermissions - Return Success');

		// START IF - has requestData.success 
	    if (requestData.success){
	                	
			// run requestData.success callback
			requestData.success();

	    };
	    // END IF - has requestData.success

	};
		
};

/**
 * Logs a storage error.
 *
 * @param      {object}  storageErrorData  The storage error data
 */
function logStorageError(storageErrorData){
	
	// set eventData
	var eventData = {	eventType: "error",
						eventName: "storageError", 
						eventVars: {"Error": storageErrorData.error,
						},									
	};
			
	// send AnalyticsEvent										
	Alloy.Globals.AnalyticsEvent(eventData);
	
};

/**
 * Opens settings on Android > 6
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

/**
 * Downloads a File from the working url
 *
 * @param      {object}  downloadURLData  - download data
 * @param      {object} downloadURLData.downloadData - data passed to checkDownloadURL
 * @param      {string} downloadURLData.downloadURL - working url for download file from
 * @param      {string} downloadURLData.downloadFileName - file name for download
 */
function downloadURL(downloadURLData){
	
	// set vars
	var downloadData = downloadURLData.downloadData;
    var downloadURL = downloadURLData.downloadURL;
    var downloadFileName = downloadURLData.downloadFileName;
    
    // START IF - set storageDir
	var storageType = downloadData.storageType || "normal";
	if (storageType == "temp"){
		var storageDir = Ti.Filesystem.tempDirectory;
	}else{
		var storageDir = Alloy.Globals.storageDevice;
	};
	// END IF - set storageDir
	
	// START- check storageSpace
	var f = Titanium.Filesystem.getFile(storageDir);
	var storageSpace = f.spaceAvailable();
	Ti.API.info("Space Available: " + storageSpace);
				
	// START IF - storageSpace must be more than 32MB else stop download
	if (storageSpace < 33554432){
		
		// START IF - has downloadData.error 
		if (downloadData.error){	                	
			// set data.error callback
			downloadData.error("noSpace");
		};
		// END IF - has downloadData.error
	            	
		return;
		            	
	};
	// END IF - storageSpace must be more than 32MB else stop download
	
	// createHTTPClient       
    var client = Ti.Network.createHTTPClient({
        onload : function(e) {												// if success do           
            Ti.API.info("downloadURL Success");
            
    		// START IF - method is GET  
		    if (OS_ANDROID){	

		    	//set client.file to write file as downloaded
		    	var f = Titanium.Filesystem.getFile(storageDir, downloadFileName);
		    	f.write(this.responseData);

		    };
		    // END IF - method is GET
   			
    		// START - IF CHECK FILE
    		var fileName = Titanium.Filesystem.getFile(storageDir, downloadFileName); 		
    		if (fileName.exists()){
    			Ti.API.info("Downloaded File Exists - " + fileName);
    			
    			// START IF - has downloadData.success function 
	            if (downloadData.success){
	                // set data.success callback function
	                downloadData.success();
	            };      
    			// END IF - has downloadData.success function
    			
	    	}else{
	    		Ti.API.info("Downloaded File Does NOT Exists - " + fileName);   
	    		
	    		// START IF - has downloadData.error 
				if (downloadData.error){	                	
					// set data.error callback
					downloadData.error("noFile"); 
				};
				// END IF - has downloadData.error		
	    	};
	    	// END CHECK FILE	           
         
        },
        ondatastream:function(e){											// on datastream do
			
			// set progress as e.progress
			var progress = e.progress;
			
			// START IF - has downloadData.datastream function
			if (downloadData.datastream){
				// set data.datastream callback function
				downloadData.datastream({
					progress: progress,
				});
			};	
			// END IF - has downloadData.datastream function

		},        
        onerror : function(e) {												// on error do            
            Ti.API.info("downloadURL Error ");
                   
            // START IF - has downloadData.error 
            if (downloadData.error){
                	
                // set data.error callback
                downloadData.error(e);
            };
            // END IF - has downloadData.error
            	
    	},
    });
            
    // open the connection with client.open with method and url
    client.open('GET', downloadURL);
    
    // START IF - method is GET   	
    if (OS_IOS){	
    	//set client.file to write file as downloaded
    	client.file = Titanium.Filesystem.getFile(storageDir, downloadFileName);	
    };
    // END IF - method is GET
    
    // Send the request.
    client.send();      
       		
};    