/**
 * showFeedbackForm
 * - showFeedbackForm build and then sends the feedback from via customForm and sendForm
 *
 * Alloy.Globals: 
 * - {@link Alloy.Globals.AnalyticsUserData Alloy.Globals.AnalyticsUserData}
 * - {@link Alloy.Globals.crmVars Alloy.Globals.crmVars}
 * - {@link Alloy.Globals.crmFromName Alloy.Globals.crmFromName}
 * 
 * @requires   locationData
 * @requires   customForm
 * @requires   sendForm
 * 
 * @module showFeedbackForm 
 * 
 * @example    <caption>Require and run returned function to build and show form and send on confirm</caption> 
 * 
 * // require module showFeedbackForm in app/assets/lib/
	var showFeedbackForm = require('formData/showFeedbackForm');
    
	// set showFormData			
	var showFormData = {	title: titleString,
							message: L("bookCompleteMessage"),
							confirm: L("bookCompleteConfirm"),
							cancel:  L("cancel"),
							fields: [wechatField,qqField,emailField,optionsField],
							bookName: bookName,
							formName: "booksReadCompleteForm",
						};
	
	// run showFeedbackForm
	showFeedbackForm(showFormData);
 * 
 *
 */


/**
 * Shows the feedback form.
 *
 * @param      {object}  showFormData  The show form data
 * @param      {string}  showFormData.title  The form title
 * @param      {string}  showFormData.message  The form message
 * @param      {string}  showFormData.confirm  The form confirm title
 * @param      {string}  showFormData.cancel  The form cancel title
 * @param      {array}  showFormData.fields  The form fields array
 * @param      {string}  showFormData.bookName  The form book name
 * @param      {string}  showFormData.selectedReadingName  The form selected reading name
 * @param      {string}  showFormData.formName  The form name
 * 
 * @return     {function}  - function to build and show form and send on confirm
 */
function showFeedbackForm(showFormData){
	
	//Ti.API.info("showFeedbackForm");
	
	// set params
	var formTitle = showFormData.title;
	var formMessage = showFormData.message;
	var formConfirm = showFormData.confirm;
	var formCancel = showFormData.cancel;
	var formFields = showFormData.fields;
	var bookName =  showFormData.bookName;
	var selectedReadingName =  showFormData.selectedReadingName;
	var formName = showFormData.formName;
								
	// customForm Dialog with params	
	var notificationData = {
		cancelIndex: 0,
		buttonNames: [formCancel,formConfirm],
		fields: formFields,
		bookName: bookName,
		selectedReadingName: selectedReadingName,
		formName: formName,
		message: formMessage,
		title: formTitle,
		click: function(e){
	
			//START IF - Cancel Clicked close ELSE
		    if (e.index == 0){
		      	Ti.API.info('The Cancel button was clicked');
		      	
		      	// run Countly set UserData		
				Alloy.Globals.AnalyticsUserData();
	
		    }else{
		    	Ti.API.info('The OK button was clicked');
		    	
		    	// set formData
		    	var formData = {	formInput: e.inputData,
		    						bookName: e.bookName,
		    						selectedReadingName: e.selectedReadingName,
		    						formName: e.formName,
		    					};
		    					
		    	// sendForm with formData
		    	
		    	// require locationData module
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
	    		
		    	
		    };
		    //END IF - Cancel Clicked close ELSE 	
		},
	};
	
	// require module customForm in app/assets/lib/
	var customForm = require('formData/customForm');
	
	// show customForm notification
	customForm.show(notificationData);

};

/**
 * searches for a key in a array and returns the value if found
 *
 * @param      {array}    arr     The arr
 * @param      {string}   val     the key
 * @return     {string}   returns the value found for array value
 */
function inputArrayItemValue(arr,val) {
	for (var i=0; i<arr.length; i++){
		if (arr[i].name === val) {                    
			return arr[i].value;
		};
	};
	return false;
};

/**
 * Builds and sends the form
 *
 * @param      {object}  formData  The form data
 * @param      {array}  formData.formInput  The form input data array
 * @param      {string}  formData.bookName  The form sent bookName
 * @param      {string}  formData.selectedReadingName  The form sent selected reading name
 * @param      {string}  formData.formName  The form name
 * 
 */
function sendForm(formData){
		
	//Ti.API.info("SendForm Function in feedbackForms Module");
	
	// set params to send to salesforce	      	
	var formParams = {
	    'formName': formData.formName,  
	};
	
	// set lead source
	formParams[Alloy.Globals.crmVars.crmLeadSource] = Alloy.Globals.crmFromName;
	
	// set OUDID and add to formParams
	var OUDID = Alloy.Globals.AnalyticsDeviceID();
	formParams[Alloy.Globals.crmVars.crmOUDID] = OUDID;
	
	// set jpushDeviceID and add to formParams
	var jpushDeviceID = Ti.App.Properties.getString('JPushID','');
	formParams[Alloy.Globals.crmVars.crmJPUSHID] = jpushDeviceID;
	
	// set jpush read group
	var jpushReadGroup = JSON.parse(Ti.App.Properties.getString('jpushReadGroup',false));
	if(jpushReadGroup){
		formParams[Alloy.Globals.crmVars.crmJPUSHReadGroup] = jpushReadGroup;
	};		
		
	// require locationData module
	var locationData = require('locationData/locationData');
	
	// set gpsLocation
	var locationData = locationData.getLocationData("object");		
	
	var locationLatitude = locationData.latitude || '';
	var locationLongitude = locationData.longitude || '';
	
	formParams[Alloy.Globals.crmVars.crmGPSLatitude] = locationLatitude;
	formParams[Alloy.Globals.crmVars.crmGPSLongitude] = locationLongitude;
    
    // set formAppHighUsage
	// get appUsageAmount from Ti.App.Properties
	var appUsageAmount = Ti.App.Properties.getString('appUsageAmount',0);	// string with amount of app usages
	// START IF - Check appUsageAmount and add true if >= Alloy.Globals.highUsageFormAmount
	if (appUsageAmount >= Alloy.Globals.highUsageFormAmount){
		formParams[Alloy.Globals.crmVars.crmAppHighUsage] = true;
	};
	// END IF - Check appUsageAmount and add true if >= Alloy.Globals.highUsageFormAmount

    // set booksReadBasic
    var booksReadBasicArray = JSON.parse(Ti.App.Properties.getString('booksReadBasic','[]'));
	var booksReadBasic = booksReadBasicArray.join(";");
    formParams[Alloy.Globals.crmVars.crmBooksReadBasic] = booksReadBasic;
    
    // set booksReadHalf
    var booksReadHalfArray = JSON.parse(Ti.App.Properties.getString('booksReadHalf','[]'));
	var booksReadHalf = booksReadHalfArray.join(";");
    formParams[Alloy.Globals.crmVars.crmBooksReadHalf] = booksReadHalf;
    
    // set booksReadComplete
    var booksReadCompleteArray = JSON.parse(Ti.App.Properties.getString('booksReadComplete','[]'));	
	var booksReadComplete = booksReadCompleteArray.join(";");
    formParams[Alloy.Globals.crmVars.crmBooksReadComplete] = booksReadComplete;
    
    // set selectedReadingReadComplete
    var selectedReadingReadCompleteArray = JSON.parse(Ti.App.Properties.getString('selectedReadingReadComplete','[]'));	
	var selectedReadingReadComplete = selectedReadingReadCompleteArray.join(";");
    formParams[Alloy.Globals.crmVars.crmSelectedReadingReadComplete] = selectedReadingReadComplete;

    // START IF - formName booksReadBasicForm else booksReadCompleteForm
    if(formData.formName == "booksReadBasicForm"){
    	
    	// get booksBasicWantCalligraphyArray
    	var booksBasicWantCalligraphyArray = JSON.parse(Ti.App.Properties.getString('booksBasicWantCaligraphy','[]'));	// leave Ti.App.Properties booksBasicWantCaligraphy spelling mistake for old apps
    	
    	// set bookInArray - check if bookName in booksBasicWantCalligraphyArray
    	var bookInArray = valueInArray(booksBasicWantCalligraphyArray,formData.bookName);
		
		// START IF - bookInArray
		if (bookInArray){
			//Ti.API.info("Book already in booksBasicWantCalligraphyArray");
		}else{
			
			// add current bookName to booksBasicWantCalligraphyArray
			booksBasicWantCalligraphyArray.push(formData.bookName);
			
			// set booksBasicWantCalligraphy to booksBasicWantCalligraphyArray	
			Ti.App.Properties.setString('booksBasicWantCaligraphy',JSON.stringify(booksBasicWantCalligraphyArray));		// leave Ti.App.Properties booksBasicWantCaligraphy spelling mistake for old apps
					
			// set booksBasicWantCalligraphy
			var booksBasicWantCalligraphy = booksBasicWantCalligraphyArray.join(";");;
			formParams[Alloy.Globals.crmVars.crmBookName] = formData.bookName;
			formParams[Alloy.Globals.crmVars.crmBooksBasicWantCalligraphy] = booksBasicWantCalligraphy;
		
		};
    	// END IF - bookInArray
	
    }else if (formData.formName == "booksReadCompleteForm"){
    	
    	// get booksCompletedFeedbackArray
    	var booksCompletedFeedbackArray = JSON.parse(Ti.App.Properties.getString('booksCompletedFeedback','[]'));	// array of booksCompletedFeedback
    	
    	// set bookInArray - check if bookName in booksBasicWantCalligraphyArray
    	var bookInArray = valueInArray(booksCompletedFeedbackArray,formData.bookName);
		
		// START IF - bookInArray
		if (bookInArray){
			//Ti.API.info("Book already in booksCompletedFeedbackArray");
		}else{
			
			// add current bookName to booksCompletedFeedbackArray
			booksCompletedFeedbackArray.push(formData.bookName);
			
			// set booksBasicWantCalligraphy to booksBasicWantCalligraphyArray	
			Ti.App.Properties.setString('booksCompletedFeedback',JSON.stringify(booksCompletedFeedbackArray));	
					
			// set booksCompletedFeedback
			var booksCompletedFeedback = booksCompletedFeedbackArray.join(";");
			formParams[Alloy.Globals.crmVars.crmBookName] = formData.bookName;
			formParams[Alloy.Globals.crmVars.crmBooksCompletedFeedback] = booksCompletedFeedback;
		
		};
    	// END IF - bookInArray
		
   	}else if (formData.formName == "selectedReadingReadCompleteForm"){
    	
    	// get selectedReadingCompletedFeedbackArray
    	var selectedReadingCompletedFeedbackArray = JSON.parse(Ti.App.Properties.getString('selectedReadingCompletedFeedback','[]'));	// array of selectedReadingCompletedFeedback
    	
    	// set selectedReadingInArray - check if selectedReadingName in selectedReadingCompletedFeedbackArray
    	var selectedReadingInArray = valueInArray(selectedReadingCompletedFeedbackArray,formData.selectedReadingName);
		
		// START IF - selectedReadingInArray
		if (selectedReadingInArray){
			//Ti.API.info("SelectedReading already in selectedReadingCompletedFeedbackArray");
		}else{
			
			// add current selectedReadingName to selectedReadingCompletedFeedbackArray
			selectedReadingCompletedFeedbackArray.push(formData.selectedReadingName);
			
			// set selectedReadingCompletedFeedbackArray to selectedReadingCompletedFeedback	
			Ti.App.Properties.setString('selectedReadingCompletedFeedback',JSON.stringify(selectedReadingCompletedFeedbackArray));	
					
			// set booksCompletedFeedback
			var selectedReadingCompletedFeedback = selectedReadingCompletedFeedbackArray.join(";");
			formParams[Alloy.Globals.crmVars.crmSelectedReadingName] = formData.selectedReadingName;
			formParams[Alloy.Globals.crmVars.crmSelectedReadingCompletedFeedback] = selectedReadingCompletedFeedback;
		
		};
    	// END IF - bookInArray
		
   	};
	// END IF - formName booksReadBasicForm else booksReadCompleteForm  
	
	// set formInput
	var formInput = formData.formInput;
	
	// set wechat	
	var formUserWechat = inputArrayItemValue(formInput,"userWechat") || '';
	formParams[Alloy.Globals.crmVars.crmWechat] = formUserWechat;
	
	// set qq
	var formUserQQ = inputArrayItemValue(formInput,"userQQ") || '';
	formParams[Alloy.Globals.crmVars.crmQQ] = formUserQQ;
	
	// set email
	var formUserEmail = inputArrayItemValue(formInput,"userEmail") || '';
	formParams[Alloy.Globals.crmVars.crmEmail] = formUserEmail;
	
	//set custom comment
	var formCustomComment = inputArrayItemValue(formInput,"customComment") || '';
	formParams[Alloy.Globals.crmVars.crmAppComment] = formCustomComment;
	
	// get bookFeeback
	var bookFeedback = inputArrayItemValue(formInput,"bookFeedback") || '';
	
	// START Loop - through options
	for (var t=0; t<bookFeedback.length; t++){
			
			// get bookFeedbackOptionName and bookFeedbackOptionValue
			var bookFeedbackOptionName = bookFeedback[t].optionName;
			var bookFeedbackOptionValue = bookFeedback[t].value;
			
			// START IF - bookFeedbackOptionValue true
			if (bookFeedbackOptionValue){
				
				// set booksReadCompleteOptionArray as Ti.App.Properties bookFeedbackOptionName
				var booksReadCompleteOptionArray = JSON.parse(Ti.App.Properties.getString(bookFeedbackOptionName,'[]'));	// array of bookFeedbackOptionName
				
				// add current bookName to booksReadCompleteOptionArray
				booksReadCompleteOptionArray.push(formData.bookName);
			
				// set Ti.App.Properties bookFeedbackOptionName to booksReadCompleteOptionArray	
				Ti.App.Properties.setString(bookFeedbackOptionName,JSON.stringify(booksReadCompleteOptionArray));
		
				// convert booksReadCompleteOptionArray to booksReadCompleteOptionString
				var booksReadCompleteOptionString = booksReadCompleteOptionArray.join(";");
				
				// add booksReadCompleteOptionString to formParams bookFeedbackOptionName 
				formParams[bookFeedbackOptionName] = booksReadCompleteOptionString;
				
			};
			// END IF - bookFeedbackOptionValue true
			
	};
	// END Loop - through options	
	
	// get selectedReadingFeedback
	var selectedReadingFeedback = inputArrayItemValue(formInput,"selectedReadingFeedback") || '';
	
	// START Loop - through options
	for (var t=0; t<selectedReadingFeedback.length; t++){
			
			// set selectedReadingFeedbackOptionName
			var selectedReadingFeedbackOptionName = selectedReadingFeedback[t].optionName;
			var selectedReadingFeedbackOptionValue = selectedReadingFeedback[t].value;
			
			if (selectedReadingFeedbackOptionValue){
				
				// set all selectedReading basic strings
				var selectedReadingReadCompleteOptionArray = JSON.parse(Ti.App.Properties.getString(selectedReadingFeedbackOptionName,'[]'));	// array of books basic read
				
				// add current formGroup to selectedReadingReadCompleteOptionArray
				selectedReadingReadCompleteOptionArray.push(formData.selectedReadingName);
			
				// set sendForms to sendFormsArray	
				Ti.App.Properties.setString(selectedReadingFeedbackOptionName,JSON.stringify(selectedReadingReadCompleteOptionArray));
		
				// convert selectedReadingReadCompleteOptionArray to selectedReadingReadCompleteOptionString
				var selectedReadingReadCompleteOptionString = selectedReadingReadCompleteOptionArray.join(";");
				// add to formParams Object 
				formParams[selectedReadingFeedbackOptionName] = selectedReadingReadCompleteOptionString;
				
			};

			
	};
	// END Loop - through options
	
	// get customFeedback
	var customFeedback = inputArrayItemValue(formInput,"customFeedback") || false;
	
	// START IF - customFeedback set the loop
	if(customFeedback){
		
		// START Loop - through options
		for (var t=0; t<customFeedback.length; t++){
			
			// get customFeedbackOptionName and customFeedbackOptionValue
			var customFeedbackOptionName = customFeedback[t].optionName;
			var customFeedbackOptionValue = customFeedback[t].value;
			
			// add customFeedbackOptionValue to formParams customFeedbackOptionName 
			formParams[customFeedbackOptionName] = customFeedbackOptionValue;
			
		};
		// END Loop - through options	
		
	};
	// END IF - customFeedback set the loop
	
	//Ti.API.info((JSON.stringify(formParams)));
	
	// run Countly set UserData		
	Alloy.Globals.AnalyticsUserData();
	
	//require sendForm lib
	var sendFormsFunction = require('formData/sendForm'); 
	
	// send formParams to sendFormsFunction
	sendFormsFunction(formParams);
	
};

module.exports = showFeedbackForm;