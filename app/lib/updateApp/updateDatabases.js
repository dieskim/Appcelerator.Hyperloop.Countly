/**
 * updateDatabases
 * - returns a function to run that updates the databases spesified
 * 
 * Alloy.Globals:
 * - {@link Alloy.Globals.customFont Alloy.Globals.customFont}
 * - {@link Alloy.Globals.mainColor Alloy.Globals.mainColor}
 * - {@link Alloy.Globals.openWindow Alloy.Globals.openWindow}
 * - {@link Alloy.Globals.AnalyticsEvent Alloy.Globals.AnalyticsEvent}
 * - {@link Alloy.Globals.databaseData Alloy.Globals.databaseData}
 * 
 * @example    <caption>Require and run updateDatabases to update database</caption>
 *
 * // require updateDatabasesModuleFunction Module
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
 * 
 */


/**
 * update database function
 *
 * @param      {object}  updateDatabasesData  The update databases data
 * @param      {array}  updateDatabasesData.updateData  The update data array
 * @param      {callback}  updateDatabasesData.updateLater  The update later callback
 * 
 * @return 	   {function} the updateDatabase function
 * 
 */
function updateDatabases(updateDatabasesData){
					    	
	// set updateDatabasesDataArray
	var updateDatabasesDataArray = updateDatabasesData.updateData;
				    	
	// run navigationGoHome
	navigationOpenClose.navigationGoHome();
	
	// create downloadAlert
	databaseUpdateAlert({	failed: function(e){
								Ti.API.info('Database Update Failed!');
								
								// START IF - has data.updateLater function 
								if (updateDatabasesData.updateLater){
									// set data.updateLater callback function
									updateDatabasesData.updateLater();
								};      
								// END IF - has data.updateLater function	

							},
							updateData: updateDatabasesDataArray,
				});	
	
	
};

/**
 * update database alert - builds and shows the alert when the database is updating
 *
 * @param      {object}  databaseUpdateAlertData  The database update alert data
 * @param      {callback}  databaseUpdateAlertData.failed  The database update failed callback
 * @param      {array}  databaseUpdateAlertData.updateData  The database update data array
 */
function databaseUpdateAlert(databaseUpdateAlertData){
	
	//Ti.API.info("databaseUpdateAlert Function");
	//Ti.API.info(databaseUpdateAlertData.updateData);
	
	// set vars
	var title = L("updateStartedDatabase");
	
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
	
	// START FUNCTION - updateProgress
	function updateProgress(updateProgress){
		
		// set newUpdateStatusBarValue as old plus new
		var newUpdateStatusBarValue = (+updateStatusBar.value + updateProgress);
		
		// update updateStatusBar value with updateProgress
		updateStatusBar.value = newUpdateStatusBarValue;
		
		// calculate updateProgressValue
		var updateProgressValue = Math.round(newUpdateStatusBarValue * 100);
		
		// START IF - updateProgressValue larger than updateStatusLabel.percentageValue then update
		if (updateProgressValue > updateStatusLabel.percentageValue){
			
			// set updateStatusLabel with updateProgressValue
			updateStatusLabel.percentageValue = updateProgressValue;
			updateStatusLabel.text = updateProgressValue + "%";
			
		};
		// END IF - updateProgressValue larger than updateStatusLabel.percentageValue then update
		
	};
	// END FUNCTION - updateStatusBarProgress
	
	// create updateStatusBarView
	var updateStatusBarView = Titanium.UI.createView({  
	    height: "15dp",
	    width:	Ti.UI.FILL,
	    top: "10dp",	
		bottom: "5dp",
	});
	
	// create updateStatusBar
	var updateStatusBar = Titanium.UI.createSlider({
		min: 0,
		max: 1,
		thumbImage: "/images/transparent.png",
		width: '95%',
		value: 0,
		touchEnabled: false,   	
		leftTrackImage: "/images/slider_left.png",
		rightTrackImage: "/images/slider_right.png",		
	});
	
	// add updateStatusBar to updateStatusBarView and updateStatusBarView to alertStatusView
	updateStatusBarView.add(updateStatusBar);
	alertStatusView.add(updateStatusBarView);
	
	// create updateStatusLabel
	var updateStatusLabel = Ti.UI.createLabel({
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
	
	// add updateStatusLabel to alertStatusView and alertStatusView to alertView
	alertStatusView.add(updateStatusLabel);	
	alertView.add(alertStatusView);
	
	// add alertView to Window
	alertWindow.add(alertView);
	
	// set openAlertForm to disable android back button
	Alloy.Globals.openAlertForm = true;
	
	// OPEN WINDOW
	var currentWindow = Alloy.Globals.openWindow;
	currentWindow.add(alertWindow);	
	  
	// START - downloadUpdate
	downloadUpdateDatabases({success: function(successData){
							
								//Ti.API.info("Database Update Success");
							
								// CLOSE WINDOW
								var currentWindow = Alloy.Globals.openWindow;
								currentWindow.remove(alertWindow);	
								
								// set openAlertForm to disable android back button
								Alloy.Globals.openAlertForm = false;
	
								// fire app:showAlertMessage with message
							    Ti.App.fireEvent("app:showAlertMessage",{
							    	message: L("updateSuccessDatabase"),         	
							    });
								
								// set updateAvailable false
								Ti.App.Properties.setString('updateAvailable',"false");
											
								// fireEvent to setUpdateMenu
								Ti.App.fireEvent("app:setUpdateMenu");
						
								// set databaseDataArrayRetured
								var successDatabaseDataArray = successData.updateDataArray;
								
								// START LOOP - loop through successDatabaseDataArray and send events
								for (var s=0;s<successDatabaseDataArray.length;s++) {
									
									// Send analytics error Event
									var eventData = {	eventType: "databaseUpdateEvent",
														eventName: "Database Update Success", 
														eventVars: {"Database": successDatabaseDataArray[s].updateDatabase,
																	"patchDatabaseVersion": successDatabaseDataArray[s].updateDatabaseVersion,},
									};
									
									// send Countly Event
									Alloy.Globals.AnalyticsEvent(eventData);
								
								};
								// END LOOP - loop through successDatabaseDataArray and send events
						    
							},		
							update: function(updateProgressValue){				
							
								// run updateProgress with updateProgressValue
								updateProgress(updateProgressValue);

							},					
							failed: function(failureData){
							
								// CLOSE WINDOW
								var currentWindow = Alloy.Globals.openWindow;
								currentWindow.remove(alertWindow);		
								
								// set openAlertForm to disable android back button
								Alloy.Globals.openAlertForm = false;
							
								// fire app:showAlertMessage with message
							    Ti.App.fireEvent("app:showAlertMessage",{
							    	message: L("updateFailedDatabase"),         	
							    });
							    
								// START IF - has databaseUpdateAlertData.failed function 
								if (databaseUpdateAlertData.failed){
									// set databaseUpdateAlertData.failed callback function
									databaseUpdateAlertData.failed();
								};      
								// END IF - has downloadAlertData.failed function	
								
								// START IF - databaseUpdateReturnData.database
								if(failureData.database){
									
									// Send analytics error Event
									var eventData = {	eventType: "databaseUpdateEvent",
														eventName: "Database Update Patch Failed", 
														eventVars: {"Error": failureData.error,
																	"Database": failureData.database,
																	"patchDatabaseVersion": failureData.databaseVersion,
																	"currentDatabaseVersion": Alloy.Globals.databaseData[failureData.database].shippedVersion,},								
									};
									
								}else{
									
									// Send analytics error Event
									var eventData = {	eventType: "databaseUpdateEvent",
														eventName: "Database Update Download Failed", 
														eventVars: {"Error": failureData.error,
																	"databaseURL": failureData.databaseURL,},									
									};
									
								}
								// END IF - databaseUpdateReturnData.database
								
								// send Countly Event
								Alloy.Globals.AnalyticsEvent(eventData);
														
							},
							updateDataArray: databaseUpdateAlertData.updateData,
					});
	// END - downloadUpdate 
	
};

/**
 * Downloads update databases.
 *
 * @param      {object}  downloadUpdateDatabasesData  The download update databases data
 * @param      {number}  downloadUpdateDatabasesData.arrayVar  the current array var
 * @param      {array}  downloadUpdateDatabasesData.updateDataArray  The update data array
 * @param      {callback}  downloadUpdateDatabasesData.update  update progress callback
 * @param      {callback}  downloadUpdateDatabasesData.success  update success callback
 * @param      {callback}  downloadUpdateDatabasesData.update  update failed callback 
 * 
 */
function downloadUpdateDatabases(downloadUpdateDatabasesData){
	
	// set arrayVar as data.arraVar else 0
    var arrayVar = downloadUpdateDatabasesData.arrayVar || 0;
    
	// set updateDataArray
	var updateDataArray = downloadUpdateDatabasesData.updateDataArray;
	
	//Ti.API.info("Start - downloadUpdateDatabases");
	//Ti.API.info(updateDataArray);
	
	// set numberOfUpdates
	var numberOfUpdates = updateDataArray.length;
	
	//Ti.API.info("numberOfUpdates" + numberOfUpdates);
	
	// set downloadPatchPercentage
	var downloadPatchPercentage = (50 / numberOfUpdates) / 100;
	
	//Ti.API.info("downloadPatchPercentage" + downloadPatchPercentage);
		
	// set updateData
	var updateDatabase = updateDataArray[arrayVar].updateDatabase;
	var updateDatabaseURL = updateDataArray[arrayVar].updateDatabaseURL;
	var updateDatabaseVersion = updateDataArray[arrayVar].updateDatabaseVersion;
		
	// set httpClient
	var httpClient = Titanium.Network.createHTTPClient();
				
	httpClient.onload = function() {
			
		//Ti.API.info("Download Database SQL - Success");
			
		// START IF - has downloadUpdateDatabasesData.update function 
		if (downloadUpdateDatabasesData.update){
			// set downloadUpdateDatabasesData.update callback function
			downloadUpdateDatabasesData.update(downloadPatchPercentage);
		};      
		// END IF - has downloadUpdateDatabasesData.update function
	
		// set data from XML
		var xmlData = this.responseXML.documentElement;
			
		// set sql statement
		var sqlStatement = xmlData.getElementsByTagName("database_sql").item(0).textContent;
			
		// get databaseName
		var databaseName = Alloy.Globals.databaseData[updateDatabase].databaseName;
											
		// run databaseConnect patch
		var databaseUpdateReturnData = databaseConnect({
								databaseNameReadable: updateDatabase,
								database: databaseName,
								checkUpdateVersion: updateDatabaseVersion,
								sql: sqlStatement,
								method: "patch",
							});
		
		//Ti.API.info("databaseUpdateReturnData: ");
		//Ti.API.info(databaseUpdateReturnData);
		
		// START IF - databaseUpdate true returned - database update successful - move along
		if(databaseUpdateReturnData.success){
			
			//Ti.API.info("Patch Database SQL Success");
									
			// START IF - has downloadUpdateDatabasesData.update function 
			if (downloadUpdateDatabasesData.update){
				// set downloadUpdateDatabasesData.update callback function
				downloadUpdateDatabasesData.update(downloadPatchPercentage);
			};      
			// END IF - has downloadUpdateDatabasesData.update function
			
			
			
			// set nextArrayVar 
            var nextArrayVar = +arrayVar+1;
            
            // START IF - nextArrayVar is smaller than updateDataArray.length 
            if (nextArrayVar<updateDataArray.length){             	           
                
                Ti.API.info("databaseUpdate Success - Update next Database");     
                
                // set downloadUpdateDatabasesData.arrayVar as nextArrayVar
                downloadUpdateDatabasesData.arrayVar = nextArrayVar;             
               
               	// rerun downloadUpdateDatabases with OLD dadownloadUpdateDatabasesDatata including NEW downloadUpdateDatabasesData.arrayVar
               	downloadUpdateDatabases(downloadUpdateDatabasesData);

            }else{
                
                Ti.API.info("databaseUpdate Success - Done");
                
                // START IF - has downloadUpdateDatabasesData.success 
                if (downloadUpdateDatabasesData.success){
                	
                	// set downloadUpdateDatabasesData.success callback
                	downloadUpdateDatabasesData.success(downloadUpdateDatabasesData);

            	};
            	// END IF - has downloadUpdateDatabasesData.success
            	
        	};
        	// END IF - nextArrayVar is smaller than updateDataArray.length

		}else{
			
			//Ti.API.info("Patch Database SQL Error");
			
			// START IF - has downloadUpdateDatabasesData.failed 
	        if (downloadUpdateDatabasesData.failed){
	                	
				// set downloadUpdateDatabasesData.failed callback
				downloadUpdateDatabasesData.failed(databaseUpdateReturnData);
	
	        };
	        // END IF - has downloadUpdateDatabasesData.failed
        
		}
		// END IF - databaseUpdate true returned - database update successful - move along
		
	};
			
	httpClient.onerror = function(e) {

		//Ti.API.info("Download Database SQL Error:" + e.error);
			
		// START IF - has downloadUpdateDatabasesData.failed 
        if (downloadUpdateDatabasesData.failed){
                	
             // set errorData
             var errorData = {  error: String(e.error),
             					databaseURL: updateDatabaseURL,};
             					
			// set downloadUpdateDatabasesData.failed callback
			downloadUpdateDatabasesData.failed(errorData);

        };
        // END IF - has downloadUpdateDatabasesData.failed
		 
	};   
				                
	httpClient.open('GET',updateDatabaseURL);
	httpClient.send();	
			
};

module.exports = updateDatabases;