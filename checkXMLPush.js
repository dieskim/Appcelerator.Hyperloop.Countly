//////////////////////////////////////////////////////////////////////////////////////////////////
// 								START checkXMLPush FUNCTIONS									//

// START FUNCTION - checkHandlePersonalPush
function checkHandlePersonalPush(pushNotificationData){
	
	//Ti.API.info("Start - checkHandlePersonalPush");
	//Ti.API.info(pushNotificationData);
		
	// get XMLPersonalPushRecord
	var XMLPersonalPushRecord = JSON.parse(Ti.App.Properties.getString('XMLPersonalPushRecord',false));
	
	// START IF - set XMLPersonalPushRecord
	if (XMLPersonalPushRecord){
		var XMLPersonalPushRecordArray = XMLPersonalPushRecord;	
	}else{
		var XMLPersonalPushRecordArray = [];
	};
	// END IF - set XMLPersonalPushRecord
	 
	// set pushID and pushXML
	var pushID = pushNotificationData.id;
	var pushXML = pushNotificationData.xml;
		
	// START IF - if push not in XMLPersonalPushRecordArray handle else run checkAllXMLPush
	if(XMLPersonalPushRecordArray.indexOf(pushID) == -1){
			
		//Ti.API.info("XMLPush not in XMLPersonalPushRecordArray - handle");
					
		// push pushID to XMLPersonalPushRecordArray
		XMLPersonalPushRecordArray.push(pushID);
			
		// set XMLPersonalPushRecord to Ti.App.Properties	
		Ti.App.Properties.setString('XMLPersonalPushRecord',JSON.stringify(XMLPersonalPushRecordArray));
		
		// require module pushAlert in app/assets/lib/
		var pushAlert = require('pushNotifications/pushAlert');
	
		// process pushAlert.showPushXML with pushXML
		pushAlert.showPushXML(pushXML);
					
	}else{
			
		//Ti.API.info("XMLPush Already in XMLPersonalPushRecordArray - run checkAllXMLPush");
			
		// run checkAllXMLPush
		checkAllXMLPush();
			
	};
	// END IF - if push not in XMLPersonalPushRecordArray handle and exit, else check next
	
};
// END FUNCTION - checkHandlePush

// START FUNCTION - checkHandlePush
function checkHandlePush(pushNotificationData){
	
	// set pushNotificationArray
	var pushNotificationArray = pushNotificationData;
			
	// get XMLPushRecord
	var XMLPushRecord = JSON.parse(Ti.App.Properties.getString('XMLPushRecord',false));
	
	// START IF - set XMLPushRecordArray
	if (XMLPushRecord){
		var XMLPushRecordArray = XMLPushRecord;	
	}else{
		var XMLPushRecordArray = [];
	};
	// END IF - set XMLPushRecordArray
	
	//Ti.API.info(pushNotificationArray);
	//Ti.API.info(XMLPushRecordArray);
	 
	// START LOOP - loop through pushNotificationArray and check if in XMLPushRecordArray
	// - if push id not in XMLPushRecordArray then handle, add to array and exit
	for (var i=0;i<pushNotificationArray.length;i++) {
		
		var pushID = pushNotificationArray[i].id;
		var pushXML = pushNotificationArray[i].xml;
		
		// START IF - if push not in XMLPushRecordArray handle and exit, else check next
		if(XMLPushRecordArray.indexOf(pushID) == -1){
			
			//Ti.API.info("XMLPush not in XMLPushRecordArray - handle");
					
			// push pushID to XMLPushRecordArray
			XMLPushRecordArray.push(pushID);
			
			// set XMLPushRecord to Ti.App.Properties	
			Ti.App.Properties.setString('XMLPushRecord',JSON.stringify(XMLPushRecordArray));
		
			// require module pushAlert in app/assets/lib/
			var pushAlert = require('pushNotifications/pushAlert');
	
			// process pushAlert.showPushXML with pushXML
			pushAlert.showPushXML(pushXML);
			
			return;
				
		};
		// END IF - if push not in XMLPushRecordArray handle and exit, else check next
		
	};
    // END LOOP - loop through items and create items and push to fieldsArray
	
	//Ti.API.info("All XMLPush in XMLPushRecordArray - Exit");
	
};
// END FUNCTION - checkHandlePush

// START FUNCTION - checkAllXMLPush
function checkAllXMLPush(){
	
	Ti.API.info("Start - checkXMLPush");
	
	// set xmlPushURLArrayString
	var xmlPushURLArrayString = databaseConnect({	
									database: Alloy.Globals.databaseData.urlData.databaseName,
									table: "urlData",
									method:"getFieldValue",
									field: "urlList", 
									lookupField: "urlName",
									value: "push_xml",
	});
	
	// Require checkDownloadURL module
	var checkDownloadURL = require('checkDownloadURL/checkDownloadURL');
	
	// START - run checkDownloadURL	and check for working URL
	checkDownloadURL.checkDownloadURL({
		urlArrayString: xmlPushURLArrayString,						// set urlArrayString
	    success: function (success) {								// on Success
	        	Ti.API.info("Success - XMLPUSH URL Found");
		        
		        // set foundURL
		        var foundURL = success.foundURL;
		        
				// set httpClient
				var httpClient = Titanium.Network.createHTTPClient();
				
				httpClient.onload = function() {
					//Ti.API.info("Module - checkXMLPush Success");
					
					// set data from XML
					var xmlData = this.responseXML.documentElement;
					
					// set pushNotificationDataArray
					var pushNotificationDataArray = [];
					
					// get pushNotifications we will check
					var pushNotifications = xmlData.getElementsByTagName("push_notification");
					
					// START LOOP - loop through pushNotifications and check
					for (var i=0;i<pushNotifications.length;i++) {
				         
				        // set vars
				        var pushID = pushNotifications.item(i).getElementsByTagName("push_id").item(0).textContent;
				        var pushXML = pushNotifications.item(i).getElementsByTagName("push_xml").item(0).textContent;	      
				        
				        // push data to pushNotificationDataArray
				        pushNotificationDataArray.push({	id:pushID,
				        									xml: pushXML,		        										
				        });
				              
				   	};
			    	// END LOOP - loop through pushNotifications and check
					
					// sort array
					pushNotificationDataArray.sort(function(obj1, obj2) {
						// Decending: largest id first
						return obj2.id - obj1.id;
					});
			
					// run checkHandlePush with pushNotificationDataArray
					checkHandlePush(pushNotificationDataArray);
					
				};
				
				httpClient.onerror = function(e) {
					
					// Error - return error
					//Ti.API.info("Module - checkXMLPush Error:" + e.error);
			        
				};   
				                
				httpClient.open('GET', foundURL);
				httpClient.send();
				
			},	    
			error: function (error) {									// on Error
					
				Ti.API.info("Error - All XMLPUSH URLS Failed");		
					             
			},
				
	});
	// END - run checkDownloadURL	and check for working URL
};
// END FUNCTION - checkAllXMLPush

// START FUNCTION - checkPersonalXMLPush
function checkPersonalXMLPush(){
	
	Ti.API.info("Start - checkPersonalXMLPush");
	
	// set xmlPushURLArrayString
	var xmlPushURLArrayString = databaseConnect({	
									database: Alloy.Globals.databaseData.urlData.databaseName,
									table: "urlData",
									method:"getFieldValue",
									field: "urlList", 
									lookupField: "urlName",
									value: "oudid_push_xml",
	});
	
	// get OUDID of user
	var OUDID = Alloy.Globals.AnalyticsDeviceID();
	
	// START IF - OUDID then build urlPostFix else run checkAllXMLPush and exit
	if (OUDID){
		// set urlPostFix
		var urlPostFix = OUDID + "/xml_push.xml";
	}else{
		
		Ti.API.info("checkPersonalXMLPush - no OUDI available so run checkAllXMLPush");
		
		// run checkAllXMLPush
		checkAllXMLPush();
		
		return;
	};		
	// END IF - OUDID then build urlPostFix else run checkAllXMLPush and exit
	 
	// Require checkDownloadURL module
	var checkDownloadURL = require('checkDownloadURL/checkDownloadURL');
	
	// START - run checkDownloadURL	and check for working URL
	checkDownloadURL.checkDownloadURL({
		urlPostfix: urlPostFix,
		urlArrayString: xmlPushURLArrayString,						// set urlArrayString
	    success: function (success) {								// on Success
	        	Ti.API.info("Success - PERSONAL XMLPUSH URL Found");
		        
		        // set foundURL
		        var foundURL = success.foundURL;

		       	// set httpClient
				var httpClient = Titanium.Network.createHTTPClient();
				
				httpClient.onload = function() {
					
					Ti.API.info("Success - PERSONAL XMLPUSH LOAD SUCCESS");
					
					// set data from XML
					var xmlData = this.responseXML.documentElement;
					
					// set pushNotificationDataArray
					var pushNotificationDataArray = [];
					
					// get pushNotifications we will check
					var pushID = xmlData.getElementsByTagName("push_id").item(0).textContent;
					var pushXML = xmlData.getElementsByTagName("push_xml").item(0).textContent;
					
					// set pushNotificationData
					var pushNotificationData = {	id:pushID,
													xml: pushXML,};
			
					// run checkHandlePersonalPush with pushNotificationDataArray
					checkHandlePersonalPush(pushNotificationData);
					
				};
				
				httpClient.onerror = function(e) {
					
					// Error - return error
					Ti.API.info("ERROR - PERSONAL XMLPUSH LOAD SUCCESS");
			        
			        // run checkAllXMLPush
					checkAllXMLPush();
				
				};   
				                
				httpClient.open('GET', foundURL);
				httpClient.send();
				
			},	    
			error: function (error) {									// on Error
					
				Ti.API.info("Error - All PERSONAL XMLPUSH URL Not Found - Run checkAllXMLPush");		
				
				// run checkAllXMLPush
				checkAllXMLPush();
				           
			},
				
	});
	// END - run checkDownloadURL	and check for working URL
};
// END FUNCTION - checkPersonalXMLPush

// START FUNCTION - checkXMLPush
function checkXMLPush(){
	
	Ti.API.info("Start - checkXMLPush");
	
	// run checkPersonalXMLPush
	checkPersonalXMLPush(); 
					
};
// END FUNCTION - checkXMLPush

// 								END  PUSH FUNCTIONS												//
//////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = checkXMLPush;