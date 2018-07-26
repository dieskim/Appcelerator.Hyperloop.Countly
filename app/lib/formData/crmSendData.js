/**
 * crmSendData
 * - crmSendData logs in to salesforce, find user, saves id, sends data and sends tasks as needed
 * 
 * REQUIRED INSTALL OF: crm-proxy on your server with login and server data
 * -https://bitbucket.org/boxwork/crm-proxy
 * 
 * MAKE SURE SERVER CAN RECEIVE HEADERS:
 * - http://kiteplans.info/2017/06/13/solved-apache-2-php-7-fcgid-not-allowing-removing-stripping-custom-http-headers/
 * 
 * TEST SALESFORCE API STUFF HERE:
 * - https://workbench.developerforce.com/restExplorer.php
 * 
 * Alloy.Globals: 
 * - {@link Alloy.Globals.databaseData Alloy.Globals.databaseData}
 * - {@link Alloy.Globals.AnalyticsEvent Alloy.Globals.AnalyticsEvent}
 * 
 * Ti.App.Properties: // TO DO - MOVE ALL Ti.App.Properties to be functions contained if possible
 * - crmUserInfo
 * 
 * @requires   checkDownloadURL
 * @module crmSendData 
 * @example    <caption>Require and run returned function to send data log in to salesforce, find user, saves id, sends data and sends tasks as needed</caption> 
 * 
 * // require module crmSendData in app/assets/lib/
	var crmSendDataFunction = require('formData/crmSendData');
	
	// START RUN - crmSendDataFunction with currentForm
	crmSendDataFunction({	success: function(){
								//Ti.API.info('CRM Form Submission Success');
	 							
	 							// remove first form in array just submitted from formArray
           						removeFirstFormFromArray();
            					
            					// get old sendForms
								var sendFormsArray = JSON.parse(Ti.App.Properties.getString('sendForms','[]'));
						
					            // START IF - nextArrayVar is smaller than urlArray.length 	 
					            if (sendFormsArray.length > 0){             	           
					                //Ti.API.info("Submitting Next - Salesforce Form");     
					                 
					               	// rerun submitAllForms
					               	submitAllForms();
					
					            }else{
					                
					                //Ti.API.info('All Salesforce Forms Submitted - Done');    
					                 
					                // Set Ti.App.Properties sendFormHas as false and clear sendForms array
									Ti.App.Properties.setString('sendFormHas','noUnsentForms');    
									Ti.App.Properties.setString('sendForms','[]');        
									       	
					        	};
					        	// END IF - nextArrayVar is smaller than urlArray.length
					        	
					        	// START - Send analytics data
								var eventData = {eventType: "sentForm",
												eventName: "Sent Form", 
												eventVars: {"formName": currentForm.formName},
										};
					
								Alloy.Globals.AnalyticsEvent(eventData);
								// END - Send analytics data
			
							},
							error: function(){
								 //Ti.API.info('CRM Form Submission Error - Retry remaining forms on Next App Start');   
							},
							sendData: currentForm,	// sendData as currentForm
							sendTask: currentForm,	// sendTask as currentForm
	});
	// END RUN - crmSendDataFunction with currentForm
 * 
 */

/**
 * SET AND DEFINE GLOBAL VARS 
 */
var crmProxyURL = '';
var crmProxyHeader = "CRMPROXY_ENDPOINT";
var crmProxyHeaderLogin = "LOGIN";
var crmProxyHeaderSearch = "SEARCH";
var crmProxyHeaderCreate = "CREATE";
var crmProxyHeaderUpdate = "UPDATE";
var crmProxyHeaderTask = "TASK";

/**
 * crmSendData Function
 *
 * @param      {object}  crmFunctionData  The crm function data
 * @param      {callback} crmFunctionData.success success callback - to send other forms also
 * @param      {callback} crmFunctionData.error error callback 
 * @param      {<type>} crmFunctionData.sendData the data (form data) to send
 * @param      {<type>} crmFunctionData.sendTask the data (form data) to create an task with
 * 
 * @return     {function} - function that logs in to salesforce, find user, saves id, sends data and sends tasks as needed
 */
function crmSendData(crmFunctionData){	
	//Ti.API.info('crmSendData - Begin Function');
	
	// set sendData and sendTask
	var sendData = crmFunctionData.sendData;
	var sendTask = crmFunctionData.sendTask || false;
	
	// set crmURLString 
	var crmURLString = databaseConnect({	
							database: Alloy.Globals.databaseData.urlData.databaseName,
							table: "urlData",
							method:"getFieldValue",
							field: "urlList", 
							lookupField: "urlName",
							value: "crm_proxy",
	});
	
	// Require checkDownloadURL module
	var checkDownloadURL = require('checkDownloadURL/checkDownloadURL');
	
	// START - run checkDownloadURL	and check for working URL
	checkDownloadURL.checkDownloadURL({
		urlArrayString: crmURLString,								// set appInfoURLArrayString
	    success: function (success) {								// on Success
	        	
	        	//Ti.API.info("Success - checkCrmURL URL Found");
	        	
	        	// set foundURL
	       		crmProxyURL = success.foundURL;
	        
				// START RUN - crmLogin Function
				crmLogin({	success: function(loginResponseData){					
								//Ti.API.info("CRM Login Success - Running crmCreateUpdate");				
								
								// START RUN - crmCreateUpdate with responseData from crmLogin
								crmCreateUpdate({ success: function (createUpdateResponsdeData){
														//Ti.API.info("crmCreateUpdate Success!");
														
														// get crmUserInfo
														var crmUserInfo = getSetCRMUserData("get");	
											            
											            // START IF - crmUserInfo false then set first time
														if (crmUserInfo == false){
																									
															//Ti.API.info("Set crmUserInfo for FIRST TIME: " + createUpdateResponsdeData.id);
					
															// set crmUserID
															var crmUserID = createUpdateResponsdeData.id;
															
															// set crmUserInfo
															getSetCRMUserData("set",crmUserID);
															
														};
														// END IF - crmUserInfo false then set first time
														
														// START IF - CHECK IF NEEDS TO ALSO SEND TASK
														if (sendTask){
															
															//Ti.API.info("crmCreateUpdate Success - SEND TASK");
															
															// START RUN - crmSendTask with sendTask and responseData from crmLogin
															crmSendTask({ success: function (){
																				//Ti.API.info("crmSendTask Success!");	
																				
																				// START IF - crmFunctionData.success - run success
																			    if(crmFunctionData.success){
																					crmFunctionData.success();
																				};
																				// END IF - crmFunctionData.success - run success	
																																							
																			},
																			error: function (){
																				//Ti.API.info("crmSendTask Error!");				
																				
																				// START IF - crmFunctionData.error - run error
																			    if(crmFunctionData.error){
																					crmFunctionData.error();
																				};
																				// END IF - crmFunctionData.error - run error
																			
																			},
																			loginResponseData: loginResponseData,
																			sendTask: sendTask,					
																														
															});
															// END RUN - crmSendTask with responseData from crmLogin
			
														}else{
															
															//Ti.API.info("crmCreateUpdate Succes - NO TASK, DONE");
															
															// START IF - crmFunctionData.success - run success
														    if(crmFunctionData.success){
																crmFunctionData.success();
															};
															// END IF - crmFunctionData.success - run success	 
														
														};
														// END IF - check if has task to send and send else return with success
														
													},
													error: function (){
														//Ti.API.info("crmCreateUpdate Error!");
														
														// START IF - crmFunctionData.error - run error
													    if(crmFunctionData.error){
															crmFunctionData.error();
														};
														// END IF - crmFunctionData.error - run error
														
													},
													loginResponseData: loginResponseData,
													sendData: sendData,
													
																		
								});
								// END RUN - crmCreateUpdate with responseData from crmLogin
								
							},
							error: function(){
								//Ti.API.info("CRM Login Failed");
								
								// START IF - crmFunctionData.error - run error
								if(crmFunctionData.error){
									crmFunctionData.error();
								};
								// END IF - crmFunctionData.error - run error	
																
							},		
				});
				// END RUN - crmLogin Function
				
		},			
		error: function (error) {									// on Error
					
			//Ti.API.info("Error - All checkCrmURL URLS Failed");		
			
			// START IF - crmFunctionData.error - run error
			if(crmFunctionData.error){
				crmFunctionData.error();
			};
			// END IF - crmFunctionData.error - run error	
			
			// Send analytics error Event
			var eventData = {	eventType: "error",
								eventName: "CRM URL Error", 
								eventVars: {"error": "Error - All CRM URLS Failed",},
							};
									
			// send Countly Event
			Alloy.Globals.AnalyticsEvent(eventData);
																             
		},
				
	});
	// END - run checkDownloadURL	and check for working URL
	
};

/**
 * crmLogin function
 *
 * @param      {object}  loginCallbackData  The login data object
 * @param      {callback}  loginCallbackData.success  success callback
 * @param      {callback}  loginCallbackData.error  error callback
 * 
 */
function crmLogin(loginCallbackData){
	     
	//Ti.API.info('crmLogin - Begin Function');
	        		
	// create HTTPClient
	var client = Ti.Network.createHTTPClient({
		onload : function(e) {
			
			//Ti.API.info('CRM Login - onload');
						
			//Ti.API.info(JSON.stringify(this.responseText));
				
			// set response vars
			var response =  JSON.parse(this.responseText);
			var responseStatus = response.status.http_code;
			var responseData = response.contents;
			
			// START IF - responseStatus.http_code = 200 
			if(responseStatus == "200"){
	            
	            //Ti.API.info("CRM Login Success");
	            
	            // get crmUserInfo
				var crmUserInfo = getSetCRMUserData("get");	
				
				// START IF - crmUserInfo - else search for contact
				if (crmUserInfo){
									
		          	// START IF - loginCallbackData.success - run success with responseData
		           	if(loginCallbackData.success){
		           		loginCallbackData.success(responseData);
		            };
		            //END IF - loginCallbackData.success - run success with responseData	
		            					
				}else{
					
					//Ti.API.info("getSetCRMUserData - false check salesforce");
			
					// START - run crmSearch with login responseData
					crmSearch({	success: function(){
									//Ti.API.info("crmSearch SUCCESS Callback");
									
									// START IF - loginCallbackData.success - run success with responseData
					           		if(loginCallbackData.success){
					           			loginCallbackData.success(responseData);
					            	};
					            	//END IF - loginCallbackData.success - run success with responseData
					            	
	            				},
								error: function(){
									//Ti.API.info("crmSearch ERROR Callback");
  									
  									// START IF - loginCallbackData.error - run error
									if(loginCallbackData.error){
										loginCallbackData.error();
									};
									// END IF - loginCallbackData.error - run error	
  														
	            				},
	            				loginResponseData: responseData,
	         		});
					// END - run crmSearch with login responseData
					
				};
	            // END IF - crmUserInfo - else search for contact
	                    	
			}else{
				
				//Ti.API.info("CRM Login Failed");
							
				// START IF - loginCallbackData.error - run error
		       	if(loginCallbackData.error){
		        	loginCallbackData.error();
		       	};
		        // END IF - loginCallbackData.error - run error	
				
			};
	 		// END IF - respondeData.status SUCCESS
		},
		onerror : function(e) {
			
			//Ti.API.info("CRM Login - Connection Error");
			
			// START IF - loginCallbackData.error - run error
	        if(loginCallbackData.error){
	        	loginCallbackData.error();
	        };
	        // END IF - loginCallbackData.error - run error
			
		},
		
	});
	
	// open client	
	client.open("POST", crmProxyURL);
	
	// set crm endpoing header
	client.setRequestHeader(crmProxyHeader , crmProxyHeaderLogin);
		
	// send login
	client.send(); 
	        		
};

/**
 * Gets the set crm user data.
 *
 * @param      {string}  getSet  The getSet string - set / get
 * @param      {string}  userID  The user id - needed to set userID
 * @return     {object}  The set crm user data with object.userID as userID string
 */
function getSetCRMUserData(getSet,userID){
	
	//Ti.API.info("getSetCRMUserData Function: " + getSet);
	
	// START IF - getSet set else get
	if (getSet == "set"){
		
		// set crmUserInfo 
		var crmUserInfo = {	userID: userID,
						};
											
		var crmUserInfoString = JSON.stringify(crmUserInfo);
		Ti.App.Properties.setString('crmUserInfo',crmUserInfoString);
			
		// exit function
		return;
										
	}else{
		
		// get crmUserInfo
		var crmUserInfoString = Ti.App.Properties.getString('crmUserInfo',false);
		var crmUserInfo = JSON.parse(crmUserInfoString);	
	
		//Ti.API.info(JSON.stringify(crmUserInfo));

		// return crmUserInfo
		return crmUserInfo;
				
	};
	// END IF - getSet set else get
	
}; 

/**
 * crmSearch function
 * - searched salesforce with jpush + oudid - grabs id of oldest (if found) and assigns
 *
 * Notes:
 * - https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_search.htm	
 * - http://www.url-encode-decode.com/
 * - FIND {("3981jand123" OR "XXXXX")}
 * - /services/data/v39.0/search/?q=FIND+%7B%28%223981jand123%22+OR+%22XXXXX%22%29%7D
 * 
 * @param      {object}  searchData  The search data
 * @param      {callback}  searchData.success success callback
 * @param      {callback}  searchData.error error callback
 * @param      {object}  searchData.loginResponseData  The login data
 */
function crmSearch(searchData){
	
	//Ti.API.info("crmSearch Start");
	
	/// set sendData
	var sendData = {};
		
	// set loginResponseData
	var loginResponseData = searchData.loginResponseData;
	
	// add loginData to sendData
	sendData['login_data'] = loginResponseData;
		
	// get OUDID and add to sendData
	var OUDID = Alloy.Globals.AnalyticsDeviceID();
	if (OUDID){
		sendData['OUDID'] = OUDID;	
	};
	
	// get JPushID and add to sendData
	var JPUSHID = Ti.App.Properties.getString('JPushID',false); // TO DO FUTURE - move to jpush subtree
	if (JPUSHID){
		sendData['JPUSHID'] = JPUSHID;
	};	
	
	// START IF - OUDID and JPUSHID both false then dont even search	
	if (!OUDID && !JPUSHID){
		
		//Ti.API.info("crmSearch - OUDID and JPUSHID both false then dont even search");

		// START IF - searchData.success - run success callback
		if(searchData.success){
			searchData.success(); 
		};
		// END IF - searchData.success - run success callback
			 
		// return out of function
		return;
 	
	};
	// END IF - OUDID and JPUSHID both false then dont even search
	
	// set searchHeader
	var searchHeader = crmProxyHeaderSearch;
			
	// create HTTPClient
	var client = Ti.Network.createHTTPClient({
		onload : function(e) {
			
			// set response vars
			var response =  JSON.parse(this.responseText);
			
			// set responseStatus and responseData
			var responseStatus = response.status.http_code;
			var responseData = response.contents; 
			
			//Ti.API.info("Salesforce Response Status Data");
			//Ti.API.info(responseStatus);
			//Ti.API.info(responseData);
			
			// START IF - respondeData.status SUCCESS 
			if(responseStatus == "200"){
		    	
		    	//Ti.API.info("crmSearch - SUCCESS");
		    	
		    	// get searchRecords 
				var searchRecords = responseData.searchRecords;
				
				// START IF - hasEntry then update Ti.App.Properties crmUserInfo
				if (searchRecords.length > 0){
					
					//Ti.API.info("searchRecords - has data");
					//Ti.API.info(searchRecords);
					
					// set contactRecord as first record
					var contactRecord = searchRecords[0];
					
					//Ti.API.info("contactRecord");
					//Ti.API.info(contactRecord);
					
					// set contactID
					var contactID = contactRecord.Id;
					
					// set crmUserInfo contactID
					getSetCRMUserData("set",contactID);
																	
				}else{
					
					//Ti.API.info("searchRecords - no data");
					
				};
				// END IF - hasEntry then update Ti.App.Properties crmUserInfo
				
				// START IF - searchData.success - run success callback
			    if(searchData.success){
			    	searchData.success(); 
			  	};
			  	// END IF - searchData.success - run success callback
		  	
		    }else{
		    	
		    	//Ti.API.info("crmSearch - ERROR");
		    	
		    	//Ti.API.info(e);
			    //Ti.API.info(this.responseText);
			    
			    // START IF - searchData.error - run error callback
		    	if(searchData.error){
		    		searchData.error();
		  		};
		  		// END IF - searchData.error - run error callback	  	
			        
		    };
		 	// END IF - respondeData.status SUCCESS
			
		},
		onerror : function(e) {
				
			//Ti.API.info("crmSearch onerror");
				
			//Ti.API.info(e);	 
			
			// START IF - checkConvertedData.error - run error callback
		    if(searchData.error){
		    	searchData.error();
		  	};
		  	// END IF - checkConvertedData.error - run error callback
				      
		},
	});
		
	// open client	
	client.open("POST", crmProxyURL);
			
	// set crm endpoing header
	client.setRequestHeader(crmProxyHeader, searchHeader);
		
	// set sendDataString
	var sendDataString = JSON.stringify(sendData);
		
	//Ti.API.info(sendDataString);
	
	// send client
	client.send(sendDataString); 		
	
};

/**
 * crmCreateUpdate - creates or updates contacts with data
 *
 * @param      {object}  createUpdateData  The create update data
 * @param      {callback}  createUpdateData.success  success callback
 * @param      {callback}  createUpdateData.error  error callback
 * @param      {object}  createUpdateData.loginResponseData the login data
 * @param      {object}  createUpdateData.sendData  the form data to send / set on contact 
 */
function crmCreateUpdate(createUpdateData){
		
		// set sendData
		var sendData = createUpdateData.sendData;
		
		// set loginResponseData
		var loginResponseData = createUpdateData.loginResponseData;
			
		// add loginResponseData to sendData
		sendData['login_data'] = loginResponseData;
		
		// get crmUserInfo
		var crmUserInfo = getSetCRMUserData("get");	
		
		// START IF - crmUserInfo not false then update else create contact
		if (crmUserInfo != false){
			
			// set crmUserID
			var crmUserID = crmUserInfo.userID;
			
			// set updateCreateHeader
			var updateCreateHeader = crmProxyHeaderUpdate;
			
			// add userID to sendData
			sendData['userID'] = crmUserID; 
						
		}else{	// ELSE - CREATE CONTACT		
					
			// set updateCreateHeader to crmProxyHeaderCreate
			var updateCreateHeader = crmProxyHeaderCreate;	
			
		};
		// END IF - crmUserID not false then update else create
			
		// create HTTPClient
		var client = Ti.Network.createHTTPClient({
			onload : function(e) {
				
				// set response vars
				var response =  JSON.parse(this.responseText);
			
				// set responseStatus and responseData
				var responseStatus = response.status.http_code;
				var responseData = response.contents;
				
				//Ti.API.info("Salesforce Response Status Data");
				//Ti.API.info(responseStatus);
				 
		       	// START IF - respondeData.status SUCCESS 
				if(responseStatus == "200" || responseStatus == '201' || responseStatus == '204'){
		            
		            //Ti.API.info("crmCreateUpdate - SUCCESS - Created or Updated");
		            
		            // START IF - createUpdateData.success - run success with responseData
		            if(createUpdateData.success){
		            	createUpdateData.success(responseData);
		            };
		            // END IF - createUpdateData.success - run success with responseData	            	
		            	
				}else{
					
					//Ti.API.info("crmCreateUpdate - ERROR");
					
					//Ti.API.info(e);
			        //Ti.API.info(this.responseText);
			        	
					// START IF - createUpdateData.error - run error
			        if(createUpdateData.error){			        	
			        	createUpdateData.error();
			        };
			        // END IF - createUpdateData.error - run error	
					
				};
		 		// END IF - respondeData.status SUCCESS	    
				
			                   
			},
			onerror : function(e) {
				
				//Ti.API.info("crmCreateUpdate Error");
				
				//Ti.API.info(e);	 
				
				// START IF - createUpdateData.error - run error
			    if(createUpdateData.error){
			    	createUpdateData.error();
			   	};
			   	// END IF - createUpdateData.error - run error	
			              
			},
		});
			
		// open client	
		client.open("POST", crmProxyURL); 
			
		// set crm endpoing header
		client.setRequestHeader(crmProxyHeader, updateCreateHeader);
			
		// set sendDataString
		var sendDataString = JSON.stringify(sendData);
		
		// send updateCreate client with sendData data
		client.send(sendDataString); 		
		
};

/**
 * crmSendTask - send tasks on users
 *
 * Notes:
 * https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_task.htm
 * URL = /services/data/v37.0/sobjects/task/
 * JSON = 	{"Subject":"Send Calligraphy", "IsReminderSet": "true", "ReminderDateTime": "2016-10-21T13:28:06.419Z", "WhoId":"00Q3600000CQr2k"}
 *
 * @param      {object}  sendTaskFunctionData  The send task function data
 * @param      {callback}  sendTaskFunctionData.success  success callback
 * @param      {callback}  sendTaskFunctionData.error  error callback
 * @param      {objecy}  sendTaskFunctionData.loginResponseData  the login data
 * @param      {object}  sendTaskFunctionData.sendTask  task data to send
 * 
 */
function crmSendTask(sendTaskFunctionData){
		
		// set sendTaskData 
		var sendTaskData = sendTaskFunctionData.sendTask;
		
		// set loginResponseData
		var loginResponseData = sendTaskFunctionData.loginResponseData;
		
		// add loginResponseData to sendTaskData
		sendTaskData['login_data'] = loginResponseData;
		
		// get crmUserInfo
		var crmUserInfo = getSetCRMUserData("get");	
		
		// set crmUserID
		var crmUserID = crmUserInfo.userID;
		
		// add userID to sendTaskData
		sendTaskData['userID'] = crmUserID; 
		
		// set sendTaskDataString
		var sendTaskDataString = JSON.stringify(sendTaskData);
		
		//Ti.API.info("sendTaskDataString");	
		//Ti.API.info(sendTaskDataString);
			
		// set createTaskHeader 
		var createTaskHeader = crmProxyHeaderTask;	
			
		//Ti.API.info(createTaskHeader);
			
		// create HTTPClient
		var client = Ti.Network.createHTTPClient({
			onload : function(e) {
				
				// set response vars
				var response =  JSON.parse(this.responseText);
			
				// set responseStatus and responseData
				var responseStatus = response.status.http_code;
				var responseData = response.contents;
				
				//Ti.API.info("Salesforce Response Status Data");
				//Ti.API.info(responseStatus);
				 
		       	// START IF - respondeData.status SUCCESS 
				if(responseStatus == "200" || responseStatus == '201' || responseStatus == '204'){
		            
		            //Ti.API.info("crmSendTask - SUCCESS");
		            
		            // START IF - sendTaskFunctionData.success - run success with responseData
		            if(sendTaskFunctionData.success){
		            	sendTaskFunctionData.success(responseData);
		            };
		            // END IF - sendTaskFunctionData.success - run success with responseData	            	
		            	
				}else{
					
					//Ti.API.info("crmSendTask - ERROR");
					
					//Ti.API.info(e);
			        //Ti.API.info(this.responseText);
			        	
					// START IF - sendTaskFunctionData.error - run error
			        if(sendTaskFunctionData.error){	        	
			        	sendTaskFunctionData.error();
			        };
			        // END IF - sendTaskFunctionData.error - run error	
					
				};
		 		// END IF - respondeData.status SUCCESS	    
				
			                   
			},
			onerror : function(e) {
				
				//Ti.API.info("sendTaskData Error");
				
				//Ti.API.info(e);	 
				
				// START IF - sendTaskFunctionData.error - run error
			    if(sendTaskFunctionData.error){	        	
			    	sendTaskFunctionData.error();
			    };
			    // END IF - sendTaskFunctionData.error - run error	
			              
			},
		});
			
		// open client	
		client.open("POST", crmProxyURL); 
			
		// set crm endpoing header
		client.setRequestHeader(crmProxyHeader, createTaskHeader);
			
		// send updateCreate client with sendTaskDataString data
		client.send(sendTaskDataString); 		
		
};

module.exports = crmSendData;