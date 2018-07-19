/**
 * updateCheck
 * - exports a function to use to check for app / database updates
 *
 * Alloy.Globals:
 * - {@link Alloy.Globals.databaseData Alloy.Globals.databaseData}
 * - {@link Alloy.Globals.androidAPK Alloy.Globals.androidAPK}
 * 
 * @requires   checkDownloadURL
 * @requires   customAlert
 * @requires   updateApp
 * @requires   updateDatabases
 * 
 * @module updateCheck 
 * 
 * @example    <caption>Require and run function to check for update</caption> 
 * 
 * // require module updateCheck in app/assets/lib/
	var updateCheck = require('updateApp/updateCheck');
	
	// START RUN - updateCheck
	updateCheck(autoManualCheck);	
 * 
 */

/**
 * checks servers for app_info.xml file and compares that to app + database data and does updates as needed
 *
 * @param      {string}  autoManual  auto / manual - spesify if the update check was run automatically or manually
 * 
 * @fires app:closeMenu
 * @fires app:setUpdateMenu
 * @fires app:showAlertMessage
 * 
 * @return     {function}  - function checks servers for app_info.xml file and compares that to app + database data and does updates as needed 
 */
function checkUpdate(autoManual){	
	
	Ti.API.info("checkUpdate Module Function");
    
    // set autoManualCheck
    var autoManualCheck = autoManual || "manual";
  
	// set updateInfoURLArrayString
	var updateInfoURLArrayString = databaseConnect({	
										database: Alloy.Globals.databaseData.urlData.databaseName,
										table: "urlData",
										method:"getFieldValue",
										field: "urlList", 
										lookupField: "urlName",
										value: "app_info_xml",
	});
	
	// Require checkDownloadURL module
	var checkDownloadURL = require('checkDownloadURL/checkDownloadURL');
	
	// START - run checkDownloadURL	and check for working URL
	checkDownloadURL.checkDownloadURL({
		urlArrayString: updateInfoURLArrayString,					// set updateInfoURLArrayString
		success: function (success) {								// on Success
	    	Ti.API.info("Success - UPDATE URL Found");
	    	
	    	 // set foundURL
		     var foundURL = success.foundURL;
		        
			// set httpClient
			var httpClient = Titanium.Network.createHTTPClient();
			
			httpClient.onload = function() {
				//Ti.API.info("Module - checkUpdate Success");
				
				// set data from XML
				var xmlData = this.responseXML.documentElement;
						
				// START IF - iOS else Android - set versionData
				if(OS_IOS){
					
					// set versionData object
					var versionData = { version: xmlData.getElementsByTagName("ios_version").item(0).textContent,
										description: xmlData.getElementsByTagName("ios_description").item(0).textContent,
										url: xmlData.getElementsByTagName("ios_url").item(0).textContent,
									};
				
				}else{
					
					// set versionData object
					var versionData = { version: xmlData.getElementsByTagName("android_version").item(0).textContent,
										description: xmlData.getElementsByTagName("android_description").item(0).textContent,
										url: xmlData.getElementsByTagName("android_url").item(0).textContent,
									};
				
				};
				// END IF - iOS else Android - set versionData
								
				// set currentVersion as current installed app version
				var currentVersion = Ti.App.version;
				
				// set versionNumber
				var updateVersion = versionData.version;
				
				//Ti.API.info("currentVersion: " + currentVersion);
				//Ti.API.info("updateVersion: " + updateVersion);
				
				// START IF - use appVersionCompare and check if update available
				if (appVersionCompare(updateVersion,currentVersion) == true){		
					
					//Ti.API.info("Module - updateCheck - App Update Available");
					
					if (Ti.Platform.osname=='android') {
						// close Menu
						Ti.App.fireEvent('app:closeMenu');
					};
			
					// START RUN - showUpdateForm
					showUpdateForm({	updateAppDatabase: 'updateApp',
										updateData: versionData,
										updateLater: function(e){
						
											// set updateAvailable true
											Ti.App.Properties.setString('updateAvailable',"true");
									        
									        // fireEvent to setUpdateMenu
											Ti.App.fireEvent("app:setUpdateMenu");
										
										},
					});
					// END RUN - showUpdateForm
					
				}else{		
					
					//Ti.API.info("Module - updateCheck - No App Update Available - check Database Update Data");
					
					// set appDatabaseUpdate default var
					var appDatabaseUpdate = false;
					
					// get databaseData
					var appDatabaseData = xmlData.getElementsByTagName("app_database_data");
					
					// START IF - appDatabaseData
					if(appDatabaseData.length > 0){
						
						//Ti.API.info("app_database_data - has data - check if update needed");
						
						// set databaseUpdateDataArray
						var databaseUpdateDataArray = [];
						
						// get databaseVerionsObject
						var databaseVerionsObject = JSON.parse(Ti.App.Properties.getString('databaseVerions','{}'));		// object of databaseVerions
	
						// START LOOP - loop through appDatabaseData and check
						for (var i=0;i<appDatabaseData.length;i++) {
							
							// set vars
						    var updateDatabase = appDatabaseData.item(i).getElementsByTagName("database_name").item(0).textContent;
						    var updateDatabaseVersion = appDatabaseData.item(i).getElementsByTagName("database_version").item(0).textContent;
						    var updateDatabaseURL = appDatabaseData.item(i).getElementsByTagName("database_patch_url").item(0).textContent;   
						    
						    //Ti.API.info(updateDatabase);
						    //Ti.API.info(updateDatabaseVersion);  
						    //Ti.API.info(updateDatabaseURL);   
						       					    
						    // get runningVersion
							var runningVersion = databaseVerionsObject[updateDatabase]; 
							
							//Ti.API.info("Running DB Version Compare for: " + updateDatabase + " runningVerion: " + runningVersion + " updateDatabaseVersion: " + updateDatabaseVersion); 
							 
							// START IF -  updateDatabaseVersion larger than runningVersion - update 
							if(versionCompare(runningVersion,updateDatabaseVersion) != true){							
								//Ti.API.info(updateDatabase + " - database update needed");
								
								// set appDatabaseUpdate true
								var appDatabaseUpdate = true; 
								
								// set databaseUpdateData
								var databaseUpdateData = {	updateDatabase:updateDatabase,
															updateDatabaseVersion: updateDatabaseVersion,
															updateDatabaseURL: updateDatabaseURL,};
									
								// push databaseUpdateData to databaseUpdateDataArray			
								databaseUpdateDataArray.push(databaseUpdateData);
								
								
							}else{
								//Ti.API.info(updateDatabase + " - database update  not needed");							
							};
							// END IF -  updateDatabaseVersion larger than runningVersion - update
							
						};
					   	// END LOOP - loop through appDatabaseData and check
				   		
				   		// START IF - appDatabaseUpdate true - run update functions
				   		if(appDatabaseUpdate){
				   			
				   			if (Ti.Platform.osname=='android') {
								// close Menu
								Ti.App.fireEvent('app:closeMenu');
							};
					
				   			// START RUN - showUpdateForm
							showUpdateForm({	updateAppDatabase: 'updateDatabase',
												updateData: databaseUpdateDataArray,
												updateLater: function(e){
						
													// set updateAvailable true
													Ti.App.Properties.setString('updateAvailable',"true");
									        
									        		// fireEvent to setUpdateMenu
													Ti.App.fireEvent("app:setUpdateMenu");
												},
								
							});
							// END RUN - showUpdateForm
				   			
				   		};
				   		// END IF - appDatabaseUpdate true - run update functions
				   		
					};
					// END IF - appDatabaseData
					
					// START IF - appDatabaseUpdate still false set updateAvailable false
					if(!appDatabaseUpdate){				
						//Ti.API.info("app_database_data - no data - no update");
								
						// set updateAvailable false
						Ti.App.Properties.setString('updateAvailable',"false");
									
						// fireEvent to setUpdateMenu
						Ti.App.fireEvent("app:setUpdateMenu");
								
						// START IF - if autoManualCheck manual showAlertMessage
						if (autoManualCheck == "manual"){
									
							// fire app:showAlertMessage with message
						    Ti.App.fireEvent("app:showAlertMessage",{
						    	message: L("noUpdateAvailable"),          	
						    });    
							    
						};
						/// END IF - if autoManualCheck manual showAlertMessage
					};
					// END IF - appDatabaseUpdate still false set updateAvailable false
					
				};
				// END IF - use appVersionCompare and check if update available
				
			};
			
			httpClient.onerror = function(e) {
				
				// Error - return error
				//Ti.API.info("Module - checkUpdate Error:" + e.error);
		        
			};   
			                
			httpClient.open('GET',foundURL);
			httpClient.send();
			
		},	    
		error: function (error) {									// on Error
			
			Ti.API.info("Error - All UPDATE URLS Failed");		
			             
		},
		
	});
	// END - run checkDownloadURL	and check for working URL

};

/**
 * compare app versions
 *
 * @param      {string}   update     The update version
 * @param      {string}   installed  The installed version
 * @return     {boolean}  true / false - true for update, false for no update
 */
function appVersionCompare (update, installed) {
		
	//Ti.API.info(update);
	//Ti.API.info(installed);
	
	var a = update.split('.');
	var b = installed.split('.');

    for (var i = 0; i < a.length; ++i) {
        a[i] = Number(a[i]);
    }
    for (var i = 0; i < b.length; ++i) {
        b[i] = Number(b[i]);
    }
    if (a.length == 2) {
        a[2] = 0;
    }
    if (b.length == 2) {
        b[2] = 0;
    }

    if (a[0] > b[0]) return true;
    if (a[0] < b[0]) return false;

    if (a[1] > b[1]) return true;
    if (a[1] < b[1]) return false;

    if (a[2] > b[2]) return true;
    if (a[2] < b[2]) return false;

    return false;
        
};

/**
 * Shows the update form.
 *
 * @param      {object}  data    The update data
 * @param      {string}  data.updateAppDatabase    updateApp / updateDatabase to spesify what kind of update
 * @param      {array}  data.updateData    the update data array
 * @param      {callback}  data.updateLater   the updateLater callback - run when the users clicks later
 */
function showUpdateForm(data){
	
	// set updateAppDatabase
	var updateAppDatabase = data.updateAppDatabase;
	
	// set updateData
	var updateData = data.updateData;
		
	// set createAlert Dialog params
	var confirm =  L("updateNow");
	var cancel = L("updateLater");
    var title =  L("updateAvailable");
    
    // START IF - updateAppDatabase app else database
    if(updateAppDatabase == "updateApp"){   	
	   	// set message
    	var message = L("updateDescription") + "\n" + updateData.description; 	
    }else{  	
    	// set message
	   	var message = L("updateDatabaseDescription");    	
    };
    // START IF - updateAppDatabase app else database  
	
	// require module customAlert in app/assets/lib/
	var customAlert = require('customAlert/customAlert');
		
	//createAlert AlertDialog with params		
	var notificationData = {
		cancelIndex: 0,
		buttonNames: [cancel,confirm],
		message: message,
		messageAlign: "left",
		title: title,
		alertName: "updateAlert",
		click: function(e){
			//START IF - Cancel Clicked close ELSE
		    if (e.index == 1){    			      		
		      	Ti.API.info('The Confirm Button was clicked');
			 	
			 	// START IF - iOS and updateAppDatabase = updateApp else Android - update functions
				if(OS_IOS && updateAppDatabase == "updateApp"){
					
					// open update store URL
					Ti.Platform.openURL(updateData.url);
				
				}else{
				    	
				    // START IF - updateAppDatabase = updateApp else updateDatabase
				    if (updateAppDatabase == "updateApp"){
				    	
				    	// require updateAppModuleFunction Module
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
				    	
				    }else{
				    	
				    	// require updateDatabasesModuleFunction Module
						var updateDatabasesModuleFunction = require('updateApp/updateDatabases');
							
						// run updateDatabasesModuleFunction
						updateDatabasesModuleFunction({	updateData: updateData, 
														updateLater: function(e){
															// START IF - has data.updateLater function 
															if (data.updateLater){
																// set data.updateLater callback function
																data.updateLater();
															 };      
															// END IF - has data.updateLater function
														},
												});
												
				    };
				    // START IF - updateAppDatabase = updateApp else updateDatabase	
					
				
				};
				// END IF - iOS and updateAppDatabase = updateApp else Android - update functions
							    
			}else{
				Ti.API.info('The Cancel button was clicked');
				
				// START IF - has data.updateLater function 
				if (data.updateLater){
					// set data.updateLater callback function
					data.updateLater();
				 };      
				// END IF - has data.updateLater function
				
			};	
			//END IF - Cancel Clicked close ELSE
		},	
	};
		
	// show AlertDialog notification
	customAlert.show(notificationData);
	
};
// END Function - updateForm

// export checkUpdate
module.exports = checkUpdate;