/**
 * pushAlert Functions
 * - pushAlert handles a normal push showing a popup
 * - showPushXML handles the xml push showing a popup / form based on xml
 * 
 * Alloy.Globals:
 * - {@link Alloy.Globals.appOpenFromPush Alloy.Globals.appOpenFromPush}
 * - {@link Alloy.Globals.bibleDBTextGenerate Alloy.Globals.bibleDBTextGenerate}
 * - {@link Alloy.Globals.AnalyticsEvent Alloy.Globals.AnalyticsEvent}
 * - {@link Alloy.Globals.androidAPK Alloy.Globals.androidAPK}
 * - {@link Alloy.Globals.databaseData Alloy.Globals.databaseData}
 * 
 * @requires   checkDownloadURL
 * @requires   feedbackForms
 * @requires   customAlert
 * @requires   showForms
 * @requires   updateApp
 * @module pushAlert 
 * 
 * @example    <caption>Require and run pushAlert to handle push notification</caption>
 * 	// require module pushAlert in app/assets/lib/
		var pushAlertModule = require('pushNotifications/pushAlert');
		
		// process pushAlertModule.pushAlert
		pushAlertModule.pushAlert(pushNotification);
 * 
 * @example    <caption>Require and run showPushXML to handle xml notification</caption>
 * 
 * // require module pushAlert in app/assets/lib/
			var pushAlert = require('pushNotifications/pushAlert');
	
			// process pushAlert.showPushXML with pushXML
			pushAlert.showPushXML(pushXML);
 * 
 */


/**
 * handles the push alert - shows correct alert / form
 *
 * @param      {object}  pushData  The push notification data
 */
exports.pushAlert = function (pushData){
	
	// START IF - iOS ELSE Android
	if (OS_IOS){
		
		// set pushNotification
		var pushNotification = pushData;
		
		// Set Values
		var pushType =  pushNotification.data.alertType || 'custom';
		var pushTitle =  pushNotification.data.alertTitle || L("appName");
		var pushMessage = pushNotification.data.alert || '';
		var pushConfirm = pushNotification.data.alertConfirm || L("push_confirm");
		var pushCancel = pushNotification.data.alertCancel || L("push_cancel");
		var pushURL = pushNotification.data.alertURL || '';
		var pushData = pushNotification.data.alertData || '';
		var pushXML = pushNotification.data.pushXML || '';	
			
		// Ti.API.info all Values
		Ti.API.info("Type:" + pushType + "Title:" + pushTitle + "Message:" + pushMessage + "pushConfirm:" + pushConfirm + "pushCancel:" + pushCancel + "pushURL:" + pushURL);
		
		// START IF - if not comeBackNotification show popup
    	if (pushType != "comeBackNotification"){
    		
    		// set Alloy.Globals.appOpenFromPush = true
    		Alloy.Globals.appOpenFromPush = true;
    		
    		// START IF - pushType xmlForm else normal pushType
    		if (pushType == "xmlForm"){
    				
    			// run showPushXML
    			showPushXML(pushXML);
    			
    		}else if (pushType == "vodNotification"){
    			
    			//Ti.API.info("Processing: vodNotification");
    			
    			// START IF - Alloy.Globals.bibleDBTextGenerate true else false
				if(Alloy.Globals.bibleDBTextGenerate){

	    			// load verse of day via loadText
					loadText({	book: pushData.vodData.bookID,
								chapter: pushData.vodData.startChapter,
								highlightStart: pushData.vodData.startVerse,
								highlightEnd: pushData.vodData.endVerse,
					});
				
				}else{

					// load verse of day via loadText
					loadText({	book: pushData.vodData.dailyVerseBookName,
								chapter: pushData.vodData.dailyVerseChapter,
					});

				};
				// END IF - Alloy.Globals.bibleDBTextGenerate true else false
				 
				// run AnalyticsEvent returnToApp
				var eventData = {	eventType: "returnToApp",
									eventName: "Return To App",
									eventVars: {"Notification": "vodNotification"},
				};
								
				Alloy.Globals.AnalyticsEvent(eventData);
				
    		}else if (pushType == "qodNotification"){
    			
    			//Ti.API.info("Processing: qodNotification");
    			
    			// loadQuestion 			
				loadQuestion(pushData.qodData);
				
				// run AnalyticsEvent returnToApp
				var eventData = {	eventType: "returnToApp",
									eventName: "Return To App",
									eventVars: {"Notification": "qodNotification"},
				};
								
				Alloy.Globals.AnalyticsEvent(eventData);
				
    		}else{
    			
    			// setTimeout of 500miliseconds and then run pushPopUp function with params
				setTimeout(function(){
					pushPopUp(pushType,pushTitle,pushMessage,pushConfirm,pushCancel,pushURL);
				},500); 
				
    		};
    		// END IF - pushType xmlForm else normal pushType
		
		}else{
			
			// run AnalyticsEvent returnToApp
			var eventData = {	eventType: "returnToApp",
								eventName: "Return To App",
								eventVars: {"Notification": "comeBackNotification"},
			};
								
			Alloy.Globals.AnalyticsEvent(eventData);
				
		};
		// END IF - if not comeBackNotification show popup
		
	}else if (OS_ANDROID){	// ELSE IF - Android only
		
		// set pushNotification
		var pushNotification = pushData;
		
		// Set pushExtras and JSON.parse into Object
		var pushNotificationExtra = JSON.parse(pushNotification.extras);
		
		// set pushType as alertType 	
		var pushType = pushNotificationExtra.alertType || 'custom';		
		// Set Values	
		var pushTitle = pushNotification.title || L("appName");
		var pushMessage = pushNotification.alert || '';
		var pushConfirm = pushNotificationExtra.alertConfirm || L("push_confirm");
		var pushCancel = pushNotificationExtra.alertCancel || L("push_cancel");
		var pushURL = pushNotificationExtra.alertURL || '';
		var pushAPK = pushNotificationExtra.alertAPK || Alloy.Globals.androidAPK;
		var pushData = pushNotificationExtra.alertData || '';
		var pushXML = pushNotificationExtra.pushXML || '';
		
		// Ti.API.info all Values
		Ti.API.info("Type:" + pushType + "Title:" + pushTitle + "Message:" + pushMessage + "pushConfirm:" + pushConfirm + "pushCancel:" + pushCancel + "pushURL:" + pushURL); 
    
    	// START IF - if not comeBackNotification show popup
    	if (pushType != "comeBackNotification"){
    		
    		// set Alloy.Globals.appOpenFromPush = true
    		Alloy.Globals.appOpenFromPush = true;
    		
    		// START IF - pushType xmlForm else normal pushType
    		if (pushType == "xmlForm"){ // ADD allUsersXML + xmlForm
    				
    			// run showPushXML
    			showPushXML(pushXML);
    			
    		}else if (pushType == "vodNotification"){
    			
    			//Ti.API.info("Processing: vodNotification");
    			
    			// START IF - Alloy.Globals.bibleDBTextGenerate true else false
				if(Alloy.Globals.bibleDBTextGenerate){

	    			// load verse of day via loadText
					loadText({	book: pushData.vodData.bookID,
								chapter: pushData.vodData.startChapter,
								highlightStart: pushData.vodData.startVerse,
								highlightEnd: pushData.vodData.endVerse,
					});
				
				}else{

					// load verse of day via loadText
					loadText({	book: pushData.vodData.dailyVerseBookName,
								chapter: pushData.vodData.dailyVerseChapter,
					});

				};
				// END IF - Alloy.Globals.bibleDBTextGenerate true else false
				 
				// run AnalyticsEvent returnToApp
				var eventData = {	eventType: "returnToApp",
									eventName: "Return To App",
									eventVars: {"Notification": "vodNotification"},
				};
								
				Alloy.Globals.AnalyticsEvent(eventData);
				
    		}else if (pushType == "qodNotification"){
    			
    			//Ti.API.info("Processing: qodNotification");
    			
    			// loadQuestion 			
				loadQuestion(pushData.qodData);
				
				// run AnalyticsEvent returnToApp
				var eventData = {	eventType: "returnToApp",
									eventName: "Return To App",
									eventVars: {"Notification": "qodNotification"},
				};
								
				Alloy.Globals.AnalyticsEvent(eventData);
				
    		}else{
    			
	    		// setTimeout of 500miliseconds and then run pushPopUp function with params
				setTimeout(function(){
					pushPopUp(pushType,pushTitle,pushMessage,pushConfirm,pushCancel,pushURL,pushAPK);
				},500); 
			
			};
    		// END IF - pushType xmlForm else normal pushType
    	}else{
    		
    		// run AnalyticsEvent returnToApp
			var eventData = {	eventType: "returnToApp",
								eventName: "Return To App",
								eventVars: {"Notification": "comeBackNotification"},
			};
								
			Alloy.Globals.AnalyticsEvent(eventData);
    		
    	};
		// END IF - if not comeBackNotification show popup
				
	};
	// END IF - Android Only

};

/**
 * Shows the xml push
 *
 * @param      {array}  pushXMLURL  The push xml url array
 */
exports.showPushXML = function (pushXMLURL){
	
	Ti.API.info("showPushXML: " + pushXMLURL);
	
	// Require checkDownloadURL module
	var checkDownloadURL = require('checkDownloadURL/checkDownloadURL');
	
	// START - run checkDownloadURL	and check for working URL
	checkDownloadURL.checkDownloadURL({
		urlArrayString: pushXMLURL,								// set urlArrayString
	    success: function (success) {								// on Success
	        	Ti.API.info("Success - PUSHXML URL Found");
		        
		        // set foundURL
		        var foundURL = success.foundURL;
		   
				// set httpClient
				var httpClient = Titanium.Network.createHTTPClient();
				
				httpClient.onload = function() {
					//Ti.API.info("Module - getPushXML Success");
					
					// set data from XML
					var xmlData = this.responseXML.documentElement;
					
					// set fieldsArray
					var fieldsArray = [];
							
					// get items to display in form
					var items = xmlData.getElementsByTagName("item");
					
					// START LOOP - loop through items and create items and push to fieldsArray
					for (var i=0;i<items.length;i++) {
				         
				        // START - SET VARS
				        var type = items.item(i).getElementsByTagName("type").item(0).textContent;
				        var name = items.item(i).getElementsByTagName("name").item(0).textContent;
				        var title = items.item(i).getElementsByTagName("title").item(0).textContent;
				        
				        if(items.item(i).getElementsByTagName("image").item(0) === null){
				        	var image = false; 
				        }else{
				        	var image = items.item(i).getElementsByTagName("image").item(0).textContent;
				        };
				        
				        if(items.item(i).getElementsByTagName("required").item(0) === null){
				        	var required = false; 
				        }else{
				        	var required = items.item(i).getElementsByTagName("required").item(0).textContent;
				        };
				        
				        if(items.item(i).getElementsByTagName("option").item(0) === null){
				        	var options = false; 
				        }else{
				        	var options = items.item(i).getElementsByTagName("option");
				        };	
				        // END - SET VARS
				        
				        // START IF - type is selector add options to optionsArray and add options to field item
				        if (type == "selector"){
				        	
				        	// set optionsArray
				      		var optionsArray = [];
				        
				        	// START LOOP - loop through options and create items and push to optionsArray
				        	for (var k=0;k<options.length;k++) {
				        		
				        		optionsArray.push({
						            name: options.item(k).getElementsByTagName("name").item(0).textContent,
						            title: options.item(k).getElementsByTagName("title").item(0).textContent,  
						        });
						        
				        	};
			    			// END LOOP - loop through options and create items and push to optionsArray
			    			
			    			fieldsArray.push({
					            type: type,
					            name: name,
					            title: title,
					            image: image,
					            required: required,
					            options: optionsArray,
				        	});
				        	
				        }else{ // not selector so handle as normal field
				        	
				        	fieldsArray.push({
					            type: type,
					            name: name,
					            title: title,
					            image: image,
					            required: required,
				        	});
				        	
				        };
				        // END IF - type is selector add options to optionsArray and add options to field item
				            
				   	};
			    	// END LOOP - loop through items and create items and push to fieldsArray
					
					// set showFormData			
					var showFormData = {	title: xmlData.getElementsByTagName("title").item(0).textContent,
											message: xmlData.getElementsByTagName("message").item(0).textContent,
											confirm: xmlData.getElementsByTagName("confirm").item(0).textContent,
											cancel:  xmlData.getElementsByTagName("cancel").item(0).textContent,
											fields: fieldsArray,
											formName: "pushAlert",
										};
					
					// require module showFeedbackForm in app/assets/lib/
					var showFeedbackForm = require('formData/showFeedbackForm');
					
					// run showFeedbackForm
					showFeedbackForm(showFormData);
					
					// Send analytics error Event
					var eventData = {	eventType: "xmlPushEvent",
										eventName: "XML Push Load Success", 
										eventVars: {"xml_url": foundURL,},
									};
											
					// send Countly Event
					Alloy.Globals.AnalyticsEvent(eventData);
			
				};
				
				httpClient.onerror = function(e) {
					
					// Error - return error
					//Ti.API.info("Module - getPushXML Error:" + e.error);
			        
			        // Send analytics error Event
					var eventData = {	eventType: "xmlPushEvent",
										eventName: "XML Push Load Error", 
										eventVars: {"xml_url": foundURL,},
									};
											
					// send Countly Event
					Alloy.Globals.AnalyticsEvent(eventData);
					
				};   
				                
				httpClient.open('GET',foundURL);
				httpClient.send();
	
		},	    
		error: function (error) {									// on Error
		        Ti.API.info("Error - All PUSHXML URLS Failed");
		        
		     	// Send analytics error Event
				var eventData = {	eventType: "xmlPushEvent",
									eventName: "XML Push Error", 
									eventVars: {"error": "Error - All PUSHXML URLS Failed",},
								};
											
				// send Countly Event
				Alloy.Globals.AnalyticsEvent(eventData);
		},
	});
	// END - run checkDownloadURL	and check for working URL
			
};

/**
 * Created and shows the Pop Up for a Push
 *
 * @param      {string}    pushTypeParam  The push type parameter
 * @param      {string}    titleParam     The title parameter
 * @param      {string}    messageParam   The message parameter
 * @param      {string}    confirmParam   The confirm parameter
 * @param      {string}    cancelParam    The cancel parameter
 * @param      {string}    URLParam       The url parameter
 * @param      {string}    APKParam       The apk parameter
 */
function pushPopUp(pushTypeParam,titleParam,messageParam,confirmParam,cancelParam,URLParam,APKParam){
	
	// START IF - pushTypeParam as set
	if (pushTypeParam == 'update'){		
		var title = L("update_title");
		var message = messageParam;
		var confirm = L("update_confirm");
		var cancel = L("update_cancel");
		var URL = URLParam;	
		var APK = APKParam;
				
	}else if (pushTypeParam == 'review'){		
		var title = L("review_title");
		var message = messageParam;
		var confirm = L("review_confirm");
		var cancel = L("review_cancel");
		var URL = URLParam;
					
	}else if (pushTypeParam == 'share'){		
		
		var title = titleParam;
		var message = messageParam;
		var confirm = L("shareButton");
		var cancel = L("cancel");
		
	}else if (pushTypeParam == 'custom'){		
		var title = titleParam;
		var message = messageParam;
		var confirm = confirmParam;
		var cancel = cancelParam;
		var URL = URLParam;	
					  					
	}else if (pushTypeParam == 'customVerse'){		
		var title = titleParam;
		var message = messageParam;
		var confirm = L("read_confirm");
		var cancel = L("cancel");
		var URL = URLParam;		
				
	}else if (pushTypeParam == 'customTopic'){		
		var title = titleParam;
		var message = messageParam;;
		var confirm = L("read_confirm");
		var cancel = L("cancel");
		var URL = URLParam;	
					
	}else if (pushTypeParam == 'customTopicCategory'){		
		var title = titleParam;
		var message = messageParam;;
		var confirm = L("read_confirm");
		var cancel = L("cancel");
		var URL = URLParam;	
							  		
	}else if (pushTypeParam == 'customQuestion'){		
		var title = titleParam;
		var message = messageParam;;
		var confirm = L("read_confirm");
		var cancel = L("cancel");
		var URL = URLParam;	
					
	}else if (pushTypeParam == 'customQuestionCategory'){		
		var title = titleParam;
		var message = messageParam;;
		var confirm = L("read_confirm");
		var cancel = L("cancel");
		var URL = URLParam;	
							  		
	}else if (pushType == 'selectedReading'){		
		var title = titleParam;
		var message = messageParam;
		var confirm = L("pushSelectedReadingConfirm");
		var cancel = L("pushSelectedReadingCancel");
		var URL = URLParam;	
					
	}else if (pushTypeParam == 'comeBackToSelectedReading'){		
		var title = L("comeBackToSelectedReadingTitle");
		var message = L("comeBackToSelectedReadingString");
		var confirm = L("comeBackToSelectedReadingConfrim");
		var cancel = L("comeBackToSelectedReadingCancel");
		var URL = URLParam;						
	};
	// END IF - pushTypeParam as set

	// require module customAlert in app/assets/lib/
	var customAlert = require('customAlert/customAlert');
	
	// createAlert Dialog with params	
	var notificationData = {
		cancelIndex: 0,
		buttonNames: [cancel,confirm],
		message: message,
		title: title,
		alertName: "pushAlert",
		click: function(e){
		
			//START IF - Cancel Clicked close ELSE
		 	if (e.index == 0){
				Ti.API.info('The cancel button was clicked');
				
				// START IF - add update set update later
				if (pushTypeParam == 'update'){
					
					// set updateAvailable true
					Ti.App.Properties.setString('updateAvailable',"true");
												        
					// fireEvent to setUpdateMenu
					Ti.App.fireEvent("app:setUpdateMenu");
														
				};
				// END IF - add update set update later
				
			}else{
				Ti.API.info('The OK button was clicked');
		    	
		    	// START IF - pushTypeParam is customVerse
		    	if (pushTypeParam == 'customVerse'){
		    		Ti.API.info('Loading Custom Text' + URL);
		    		var URLArray = URL.split (",");
		    		
		    		// START IF - Alloy.Globals.bibleDBTextGenerate true else false
					if(Alloy.Globals.bibleDBTextGenerate){

			    		loadText({	book: URLArray[0],
									chapter: URLArray[1],
									highlightStart: URLArray[2],
									highlightEnd: URLArray[3],
						});

					}else{

						loadText({	book: URLArray[0],
									chapter: URLArray[1],
						});

					};
					// END IF - Alloy.Globals.bibleDBTextGenerate true else false
 			
		    	}else if (pushTypeParam == 'customTopic'){
		    		Ti.API.info('Loading Custom Topic' + URL);
		    		
		    		// START IF - Alloy.Globals.bibleDBTextGenerate true else false
					if(Alloy.Globals.bibleDBTextGenerate){

			    		// set topidID as URL
						var topicID = URL;
			    		
			    		// get list of passages from DB
						var topicDataArray = databaseConnect({
									database: Alloy.Globals.databaseData.topicData.databaseName,
									table: "topicTopics",
									method:"getAllTableValuesByFieldValue",
									field: "id", 
									value: topicID,
						});
							
						// loadTopic
			    		loadTopic(topicDataArray[0]);

			    	}else{

			    		// set URLArray
	    				var URLArray = URL.split (",");
	    				
	    				// set topicData
						var topicData = {			
							topicCategory: URLArray[0],
							topicNumber: URLArray[1],
						};
						
	    				//run loadTopic
	    				loadTopic(topicData);

			    	};
		    		// END IF - Alloy.Globals.bibleDBTextGenerate true else false
		    		
		    	}else if (pushTypeParam == 'customTopicCategory'){
		    		Ti.API.info('Loading Custom Topic Cat' + URL);
		    		
		    		// START IF - Alloy.Globals.bibleDBTextGenerate true else false
					if(Alloy.Globals.bibleDBTextGenerate){

			    		// set category as URL
			    		var categoryID = URL;
			    		
			    		// set categoryData and load category
						var categoryData = databaseConnect({
							database: Alloy.Globals.databaseData.topicData.databaseName,
							table: "topicCategories",
							method:"getAllTableValuesByFieldValue",
							field: "id",
							value: categoryID, 
						});
						
						// loadCategory
						loadCategory(categoryData[0]);

					}else{

	    				//run loadCategory
	    				loadCategory(URL);

			    	};
		    		// END IF - Alloy.Globals.bibleDBTextGenerate true else false
		    		 	
		    	}else if (pushTypeParam == 'customQuestion'){
		    		Ti.API.info('Loading Custom Question' + URL);
		    		
		    		// set questionID as URL
					var questionID = URL;
		    		
		    		// set questionsArray as topics in questionCategory
					var questionsArray = databaseConnect({
						database: Alloy.Globals.databaseData.questionData.databaseName,
						table: "questionQuestions",
						method:"getAllTableValuesByFieldValue",
						field: "id",
						value: URL, 
					});
						
					// loadTopic
		    		loadQuestion(questionsArray[0]); 
		    		
		    		
		    	}else if (pushTypeParam == 'customQuestionCategory'){
			    		Ti.API.info('Loading Custom Question Cat' + URL);
			    		
			    		// set category as URL
			    		var categoryID = URL;
			    		
			    		// set questionCategoryArray 
						var questionCategoryArray = databaseConnect({
							database: Alloy.Globals.databaseData.questionData.databaseName,
							table: "questionCategories",
							method:"getAllTableValuesByFieldValue",
							field: "id",
							value: categoryID, 
						});
						
						// loadQuestionCategory
						loadQuestionCategory(questionCategoryArray[0]);	
			    	
		    	}else if (pushType == 'selectedReading'){

	    			Ti.API.info('Loading SelectedReading' + URL);
					
					// set selectedReadingData
					var selectedReadingData = {	selectedReadingCategory:URL,
												selectedReadingNumber:1};
								
	    			// run loadSelectedReading
	    			loadSelectedReading(selectedReadingData);

	    		}else if (pushType == 'comeBackToSelectedReading'){

		    		Ti.API.info('comeBackToSelectedReading' + URL);

		    		// set URLArray
		    		var URLArray = URL.split (",");   
		    		
					// set selectedReadingData
					var selectedReadingData = {	selectedReadingCategory:URLArray[0],
												selectedReadingNumber:URLArray[1]};
								
	    			// run loadSelectedReading
	    			loadSelectedReading(selectedReadingData);

	    		}else if (pushTypeParam == 'share'){
		    		
					Ti.API.info('Loading Share');
					
					// require module customForm in app/assets/lib/
					var showForms = require('formData/showForms');
					// run showShare
					showForms.showShare();
						 	
		    	}else if (pushTypeParam == 'review'){

					Ti.API.info('Loading Review' + URL);

					// open url
					Ti.Platform.openURL(URL);

				}else if (pushTypeParam == 'update'){
					
					Ti.API.info('Loading Update' + URL);
				    		
					// START IF - iOS else Android - update functions
					if(OS_IOS){
						
						// open update store URL
						Ti.Platform.openURL(URL);
					
					}else{
					    			
						// require updateAppModuleFunction Module
						var updateAppModuleFunction = require('updateApp/updateApp');
									
						// run updateAppModuleFunction
						updateAppModuleFunction({	url: URL, 
													apk: Alloy.Globals.androidAPK,
													updateLater: function(e){
														
														// set updateAvailable true
														Ti.App.Properties.setString('updateAvailable',"true");
												        
												        // fireEvent to setUpdateMenu
														Ti.App.fireEvent("app:setUpdateMenu");
									
													},
												});
					
					};
					// END IF - iOS else Android - update functions	    		
				    		
				}else{
					
					// START IF - URL is set
					if (URL){
						Ti.Platform.openURL(URL);
					};
					// END IF - URL is set
					
				};
				// END IF - pushTypeParam is customVerse
				    			
				};
				//END IF - Cancel Clicked close ELSE 	
		},
	};
		
	// show AlertDialog notification
	customAlert.show(notificationData);
	
	// Set iPhone App Badge to 0
	if (OS_IOS){
		Ti.UI.iOS.setAppBadge(0);
	};
  
};