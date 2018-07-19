/**
 * checkEnableFeatures Module
 * - enableDisable checks for automatic (date) enable / previous manual enable
 * - checkEnableXML checks server app_info_xml for manual enable
 *  
 * Alloy.Globals: 
 * - {@link Alloy.Globals.databaseData Alloy.Globals.databaseData}
 * - {@link Alloy.Globals.enableFeaturesDateIOS Alloy.Globals.enableFeaturesDateIOS}
 * - {@link Alloy.Globals.enableDateDelayedFunctions Alloy.Globals.enableDateDelayedFunctions}
 * 
 * @requires   checkDownloadURL
 * @module checkEnableFeatures
 * @example    <caption>Require and enableDisable at Startup</caption>
 * 	// require checkEnableFeatures
	var checkEnableFeatures = require('checkEnableFeatures/checkEnableFeatures');

	// run checkEnableFeatures.enableDisable
	checkEnableFeatures.enableDisable();
 *  
 * @example    <caption>Require and checkEnableXML after startup (1 second) to check server</caption>
 * 	// run checkEnableFeatures.checkEnableXML()
	checkEnableFeatures.checkEnableXML();
 * 
 */

/**
 * Sets Alloy.Globals.enableDateDelayedFunctions
 * 
 */
exports.enableDisable = function(){

	// START IF - OS_IOS
	if (OS_IOS){
		
		// START IF - current Date > Alloy.Globals.enableFeaturesDateIOS
		if(new Date() > Alloy.Globals.enableFeaturesDateIOS){
				
			// set Alloy.Globals.enableDateDelayedFunctions true
			Alloy.Globals.enableDateDelayedFunctions = true;
				
		}else{
			
			// get enableFeaturesIOSData 
			var enableFeaturesIOSData = JSON.parse(Ti.App.Properties.getString('enableFeaturesIOS',false));			// Contains: {version: 3.0.1, enabled: true}
			
			Ti.API.info("enableFeaturesIOSData");
			Ti.API.info(enableFeaturesIOSData);
			
			// START IF - enableFeaturesIOS true then check values
			if(enableFeaturesIOSData){
				
				// set enabledVersion and enabledValue
				var enabledVersion = enableFeaturesIOSData.version;
				var enabledValue = enableFeaturesIOSData.enabled;
			
				// set currentVersion as current installed app version
				var currentVersion = Ti.App.version;
				
				// START IF - enabledVersion is currentVersion and enabledValue true
				if(enabledVersion == currentVersion && enabledValue){
					
					// set Alloy.Globals.enableDateDelayedFunctions true
					Alloy.Globals.enableDateDelayedFunctions = true;
					
				};
				// END IF - enabledVersion is  currentVersion and enabledValue true	

			};
			// END IF - enabledVersion is  currentVersion and enabledValue true		
						
		};
		// START END - current Date > Alloy.Globals.enableFeaturesDateIOS			
		
	}else{	// else Android always true
		Alloy.Globals.enableDateDelayedFunctions = true;
	};
	// END IF - OS_IOS
	
	Ti.API.info("Startup: Alloy.Globals.enableDateDelayedFunctions : " + Alloy.Globals.enableDateDelayedFunctions);

};

/**
 * checks server app_info_xml for manual enable
 *
 */
exports.checkEnableXML = function (){
	
	Ti.API.info("Start - checkXMLiOSDateInfo");
	
	// set appInfoURLArrayString
	var appInfoURLArrayString = databaseConnect({	
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
		urlArrayString: appInfoURLArrayString,						// set appInfoURLArrayString
	    success: function (success) {								// on Success
	        	Ti.API.info("Success - checkXMLAppInfo URL Found");
		        
		        // set foundURL
		        var foundURL = success.foundURL;
		        
				// set httpClient
				var httpClient = Titanium.Network.createHTTPClient();
				
				httpClient.onload = function() {
					
					//Ti.API.info("Module - checkXMLAppInfo Success");
					
					// set data from XML
					var xmlData = this.responseXML.documentElement;
					
					// get app_version_data
					var appVersionsData = xmlData.getElementsByTagName("app_version_data");
					
					// START LOOP - loop through appVersionsData and check
					for (var i=0;i<appVersionsData.length;i++) {
				         
				        // set currentVersion as current installed app version
						var currentVersion = Ti.App.version;
			
				        // set vars
				        var app_version = appVersionsData.item(i).getElementsByTagName("app_version").item(0).textContent;
				        var date_data_enable = appVersionsData.item(i).getElementsByTagName("date_data_enable").item(0).textContent;      
				        
				        Ti.API.info("currentVersion" + currentVersion);
				        Ti.API.info("app_version" + app_version);
				        Ti.API.info("date_data_enable" + date_data_enable);
				         
				        // START IF - app_version = currentVersion check date_data_enable 
				        if (app_version == currentVersion){
				        	
				        	// START IF - date_data_enable true then return true else false
				        	if(date_data_enable == 'true'){
				        		
				        		// run setiOSDateEnable
				        		setiOSDateEnable(true);
				        		
				        	}else{
				        		
								// run setiOSDateEnable
				        		setiOSDateEnable(false);
				        		
				        	};
				        	// END IF - date_data_enable true then return true else false
				        	
				        	// return from function
				        	return;
				        	
				        };		
				        // END IF - app_version = currentVersion check date_data_enable	       
				              
				   	};
			    	// END LOOP - loop through appVersionsData and check
						
					// run setiOSDateEnable
				    setiOSDateEnable(false);
						
				};
				
				httpClient.onerror = function(e) {
					
					// Error - return error
					//Ti.API.info("Module - checkXMLAppInfo Error:" + e.error);
			        
				};   
				                
				httpClient.open('GET', foundURL);
				httpClient.send();
				
			},	    
			error: function (error) {									// on Error
					
				Ti.API.info("Error - All checkXMLAppInfo URLS Failed");		
					             
			},
				
	});
	// END - run checkDownloadURL	and check for working URL
};

/**
 * sets Ti.App.Properties enableFeaturesIOS for future enable checks
 *
 * @param      {boolean}  trueFalse  true to enable / false to disable
 */
function setiOSDateEnable(trueFalse){
		
	//Ti.API.info("checkSetiOSDateEnable trueFalse: " + trueFalse);
	
	// set currentVersion as current installed app version
	var currentVersion = Ti.App.version;	

	// START IF - trueFalse true
	if (trueFalse){
					
		// set Alloy.Globals.enableDateDelayedFunctions true
		Alloy.Globals.enableDateDelayedFunctions = true;
				
		// set enableFeaturesIOSData
		var enableFeaturesIOSData = { 	version: currentVersion,
										enabled: true,	};
					
		// set Ti.App.Properties enableFeaturesIOS
		Ti.App.Properties.setString('enableFeaturesIOS',JSON.stringify(enableFeaturesIOSData));
					
	}else{
					
		// set Alloy.Globals.enableDateDelayedFunctions false
		Alloy.Globals.enableDateDelayedFunctions = false;
					
		// set enableFeaturesIOSData
		var enableFeaturesIOSData = { 	version: currentVersion,
										enabled: false,	};
				
		// set Ti.App.Properties enableFeaturesIOS
		Ti.App.Properties.setString('enableFeaturesIOS',JSON.stringify(enableFeaturesIOSData));
				
	};
	// END IF - trueFalse true
	
	Ti.API.info("setiOSDateEnable End: Alloy.Globals.enableDateDelayedFunctions: " + Alloy.Globals.enableDateDelayedFunctions);
	
};