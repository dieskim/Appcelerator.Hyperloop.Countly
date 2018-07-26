/**
 * checkCountlyURL Module
 * - checkURL exports a function to run that checks the Countly URL and sets Ti.App.Properties countlyURL
 * - getURL exports the current Countly URL
 * 
 * Alloy.Globals: 
 * - {@link Alloy.Globals.databaseData Alloy.Globals.databaseData}
 * 
 * 
 * @requires   databaseConnect
 * @requires   checkDownloadURL
 * @module checkCountlyURL
 * @example    <caption>Require and run checkURL to check for working Countly URL</caption>
 * 	// require checkCountlyURL
	var checkCountlyURL = require('checkCountlyURL/checkCountlyURL');
		
	//run checkCountlyURL
	checkCountlyURL.checkURL();
 *
 * @example    <caption>Require and run getURL to get current stored Countly URL</caption>
 * 	// require checkCountlyURL
	var checkCountlyURL = require('checkCountlyURL/checkCountlyURL');
		
	// get checkCountlyURL.getURL()
	var countlyURL = checkCountlyURL.getURL();
 *
 */

/**
 * checks to find and store a working countly url
 * 
 * @return {function} - function to use to checks the Countly URL and sets Ti.App.Properties countlyURL
 * 
 */
exports.checkURL = function(){
	
	Ti.API.info("Start - checkCountlyURL");
	
	// set countlyURLString
	var countlyURLString = databaseConnect({	
							database: Alloy.Globals.databaseData.urlData.databaseName,
							table: "urlData",
							method:"getFieldValue",
							field: "urlList", 
							lookupField: "urlName",
							value: "countly",
	});
	
	// Require checkDownloadURL module
	var checkDownloadURL = require('checkDownloadURL/checkDownloadURL');
	
	// START - run checkDownloadURL	and check for working URL
	checkDownloadURL.checkDownloadURL({
		urlArrayString: countlyURLString,							// set appInfoURLArrayString
	    success: function (success) {								// on Success
	    	Ti.API.info("Success - checkCountlyURL URL Found");
		        
	        // set foundURL
	        var foundURL = success.foundURL;
				
			// set Ti.App.Properties countlyURL
			Ti.App.Properties.setString('countlyURL',JSON.stringify(foundURL));
		
		},	    
		error: function (error) {									// on Error
					
			Ti.API.info("Error - All checkCountlyURL URLS Failed");		
					             
		},
				
	});
	// END - run checkDownloadURL	and check for working URL
};

/**
 * gets the stored Countly url.
 *	
 * @return     {string} current stored countly url
 */
exports.getURL = function(){
	
	// get countlyURLStored 
	var countlyURLStored = JSON.parse(Ti.App.Properties.getString('countlyURL',false));			// http://www.e3host.com / other domain detected
			
	// START IF - countlyURLStored true use that else get from database
	if(countlyURLStored){
			
		// set countlyURL
		var countlyURL = countlyURLStored;
		
	}else{
		
		// set countlyURLString
		var countlyURLString = databaseConnect({	
								database: Alloy.Globals.databaseData.urlData.databaseName,
								table: "urlData",
								method:"getFieldValue",
								field: "urlList", 
								lookupField: "urlName",
								value: "countly",
		});
		
		// set firstCountlyURL
		var firstCountlyURLArray = countlyURLString.split(",");
		var firstCountlyURL = firstCountlyURLArray[0];
			
		// set Ti.App.Properties countlyURL
		Ti.App.Properties.setString('countlyURL',JSON.stringify(firstCountlyURL));
					
		// set countlyURL
		var countlyURL = firstCountlyURL;
			
	};
	// END IF - countlyURLStored true use that else get from database
	
	Ti.API.info("countlyURL");
	Ti.API.info(countlyURL);
	
	// return countlyURL
	return countlyURL;
	
};	