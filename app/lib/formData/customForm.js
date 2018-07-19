/**
 * customForm
 * - shows a form based on data
 *
 * Alloy.Globals:
 * - {@link Alloy.Globals.boldAllowed Alloy.Globals.boldAllowed}
 * - {@link Alloy.Globals.customFont Alloy.Globals.customFont}
 * - {@link Alloy.Globals.languageDirection Alloy.Globals.languageDirection}
 * - {@link Alloy.Globals.openWindow Alloy.Globals.openWindow}
 * - {@link Alloy.Globals.openAlertForm Alloy.Globals.openAlertForm}
 *
 * Ti.App.Properties: // TO DO - MOVE ALL Ti.App.Properties to be functions contained if possible
 * - user_wechat
 * - user_qq
 * - userEmail
 * 
 * @requires   alertFormOpenClose 
 * @module customForm
 * 
 * @example    <caption>Require and run show with data to build and show the form</caption>
 * 
 * 	// customForm Dialog with params	
	var notificationData = {
		cancelIndex: 0,
		buttonNames: [formCancel,formConfirm],
		fields: formFields,
		bookName: bookName,
		formAppHighUsage: formAppHighUsage,
		formName: formName,
		message: formMessage,
		title: formTitle,
		click: function(e){
	
			//START IF - Cancel Clicked close ELSE
		    if (e.index == 0){
		      	Ti.API.info('The Cancel button was clicked');

		    }else{
		    	Ti.API.info('The OK button was clicked');	
		    	
		    };
		    //END IF - Cancel Clicked close ELSE 	
		},
	};
	
	// require module customForm in app/assets/lib/
	var customForm = require('formData/customForm');
	
	// show customForm notification
	customForm.show(notificationData)
 * 
 * 
 */

/**
 * show function - builds and shows the form
 *
 * @param      {object}  data    The form data
 * @param      {number}  data.cancelIndex The form cancel button index
 * @param      {array}  data.buttonNames The form button names array
 * @param      {array}  data.fields The form fields array
 * @param      {string}  data.bookName The book name
 * @param      {string}  data.selectedReadingName The selectedReadingName name
 * @param      {string}  data.formName The form name
 * @param      {string}  data.title   The form title
 * @param      {string}  data.message The form messag
 * @param      {callback}  data.click The click callback
 * 
 */
exports.show = function (data){
	
	// set params as from data
	var title = data.title;
	var message = data.message;
	var cancelIndex = data.cancelIndex;
	var buttonNames = data.buttonNames;
	var fieldData = data.fields;
	var bookName = data.bookName;
	var selectedReadingName = data.selectedReadingName;
	var formName = data.formName;
	
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// 								START CREATION OF ALERTVIEW AND WINDOW											//
	
	// START IF - iOS or Android 
	if (OS_IOS){
			
		// Set alertWindow
		var alertWindow = Ti.UI.createWindow({
			backgroundImage: '/images/transparent_black.png',
			statusBarStyle: Ti.UI.iOS.StatusBar.LIGHT_CONTENT,
		});
			
	}else{
		// Set alertWindow
		var alertWindow = Ti.UI.createView({
			backgroundImage: '/images/transparent_black.png',
			width:	Ti.UI.FILL,
			height: Ti.UI.FILL,	
		});
	};
	// END IF - iOS or Android 	

	
	// create alertView container
	var alertView = Ti.UI.createScrollView({
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
	});
	
	// START IF - Alloy.Globals.boldAllowed true then set
	if(Alloy.Globals.boldAllowed){
		var fontWeightVar = 'bold';
	}else{
		var fontWeightVar = 'normal';
	};
	// END IF - Alloy.Globals.boldAllowed true then set

	// create alertTitleLabel
	var alertTitleLabel = Ti.UI.createLabel({
	  text: title,
	  color: 'black',
	  textAlign: 'center',
	  font: {
		fontSize: '20dp',
		fontWeight: fontWeightVar,
		fontFamily: Alloy.Globals.customFont
	  },
	  touchEnabled: false,	
	  top: "15dp",
	  left: 5,
	  right: 5,
	});
	
	alertTitleView.add(alertTitleLabel);
	alertView.add(alertTitleView);
	
	// create alertMessageView
	var alertMessageView = Ti.UI.createView({
	  width: Ti.UI.FILL,
	  height: Ti.UI.SIZE,
	});
	
	// create alertMessageLabel
	var alertMessageLabel = Ti.UI.createLabel({
	  text: message,
	  color: 'black',
	  textAlign: 'center',
	  font: {
		fontSize: '16dp',
		fontFamily: Alloy.Globals.customFont
	  },
	  touchEnabled: false,	
	  bottom: "15dp",
	  left: 5,
	  right: 5,
	});
	
	alertMessageView.add(alertMessageLabel);
	alertView.add(alertMessageView);
	
	// 								END CREATION OF ALERTVIEW AND WINDOW											//
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// 										START CREATION OF FIELDS AS SENT										//				
	// set fieldsDataArray
	var fieldsDataArray = [];
						
	// START Loop - through fields
	for (var f=0; f<fieldData.length; f++){
		
		// set field info from fieldData
		var fieldType = fieldData[f].type;
		var fieldName = fieldData[f].name;
		var fieldTitle = fieldData[f].title;
		var fieldImage = fieldData[f].image || false;
		var fieldRequired = fieldData[f].required || false;
		
		// create alertInputFieldView Container
		var alertInputFieldView = Ti.UI.createView({
		  width: Ti.UI.FILL,
		  height: Ti.UI.SIZE,
		  bottom: 10,
		  top: 10,
		  left: 10,
		  right: 10,
		});
		
		// START IF - check fieldType and create appropriate field
		if (fieldType == "textInput"){

			// create alertInputField
			var textInput = Titanium.UI.createTextField({
		   		hintText: fieldTitle,
		   		hintTextColor: "#a2a2a2",  	   		
		    	width: Ti.UI.FILL,
				height: "40dp",
				color: "black",
				borderColor: '#bbb',
				borderRadius: 5,
				borderWidth: 1,
				textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
				ellipsize: true,
				keyboardType: Ti.UI.KEYBOARD_TYPE_EMAIL,
				fieldName: fieldName,
				fieldRequired: fieldRequired,
				font: {
					fontSize: '16dp',
					fontFamily: Alloy.Globals.customFont},
			});
			
			// START IF - Alloy.Globals.languageDirection
			if(Alloy.Globals.languageDirection == 'ltr'){				
				textInput.right = 0;				
			}else{					
				textInput.left = 0;					
			};
			// END IF - Alloy.Globals.languageDirection
							
			// START IF - fieldName - check if value set before and set in field
			if (fieldName == "userWechat" ){
				
				// get user_wechat
				var userWechat = Ti.App.Properties.getString('user_wechat',false);
				
				// START IF - if userWechat is set - then set value
				if(userWechat){
					textInput.value = userWechat;
				};	
				// END IF - if userWechat is set - then set value
			
			}else if (fieldName == "userQQ"){
									
				// get user_qq
				var userQQ = Ti.App.Properties.getString('user_qq',false);
				
				// START IF - if userQQ is set - then set value
				if(userQQ){
					textInput.value = userQQ;
				};	
				// END IF - if userQQ is set - then set value
								
			}else if (fieldName == "userEmail"){
									
				// get userEmail
				var userEmail = Ti.App.Properties.getString('user_email',false);
				
				// START IF - if userEmail is set - then set value
				if(userEmail){
					textInput.value = userEmail;
				};	
				// END IF - if userEmail is set - then set value
								
			};
			// END IF - fieldName - check if value set before and set in field
				
			// add textInput to alertInputFieldView
			alertInputFieldView.add(textInput);
			
			// push textInput to fieldsDataArray
			fieldsDataArray.push(textInput);
			
			// START IF - is field has image add image to right of field
			if (fieldImage){
				
				// change textInput width
				textInput.width = "85%";
				
				// creat fieldImageViewBox
				var fieldImageViewBox = Ti.UI.createView({
					width: "15%",
					height: "35dp",
				});
				
				// START IF - Alloy.Globals.languageDirection
				if(Alloy.Globals.languageDirection == 'ltr'){				
					fieldImageViewBox.left = 0;				
				}else{					
					fieldImageViewBox.right = 0;				
				};
				// END IF - Alloy.Globals.languageDirection
				
				// create fieldImageView
				var fieldImageView = Ti.UI.createImageView({	
					image: fieldImage,	
					touchEnabled: false,
				});
				
				// add fieldImageView to fieldImageViewBox
				fieldImageViewBox.add(fieldImageView);
				// add fieldImageView to alertInputFieldView
				alertInputFieldView.add(fieldImageViewBox);
					
			};
			// END IF - is field has image add image to right of field
			
		}else if (fieldType == "numberInput"){
			
			// create alertInputField
			var numberInput = Titanium.UI.createTextField({
		   		hintText: fieldTitle,
		   		hintTextColor: "#a2a2a2",  	   		
		    	width: Ti.UI.FILL,
				height: "40dp",
				color: "black",
				borderColor: '#bbb',
				borderRadius: 5,
				borderWidth: 1,
				textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
				ellipsize: true,
				keyboardType: Ti.UI.KEYBOARD_TYPE_PHONE_PAD,
				fieldName: fieldName,
				fieldRequired: fieldRequired,
				font: {
					fontSize: '16dp',
					fontFamily: Alloy.Globals.customFont},
			});
			
			// START IF - Alloy.Globals.languageDirection
			if(Alloy.Globals.languageDirection == 'ltr'){				
				numberInput.right = 0;				
			}else{					
				numberInput.left = 0;					
			};
			// END IF - Alloy.Globals.languageDirection
			
			// START IF - fieldName - check if value set before and set in field
			if (fieldName == "userWechat" ){
				
				// get user_wechat
				var userWechat = Ti.App.Properties.getString('user_wechat',false);
				
				// START IF - if userWechat is set - then set value
				if(userWechat){
					numberInput.value = userWechat;
				};	
				// END IF - if userWechat is set - then set value
			
			}else if (fieldName == "userQQ"){
									
				// get user_qq
				var userQQ = Ti.App.Properties.getString('user_qq',false);
				
				// START IF - if userQQ is set - then set value
				if(userQQ){
					numberInput.value = userQQ;
				};	
				// END IF - if userQQ is set - then set value
								
			}else if (fieldName == "userEmail"){
									
				// get userEmail
				var userEmail = Ti.App.Properties.getString('user_email',false);
				
				// START IF - if userEmail is set - then set value
				if(userEmail){
					numberInput.value = userEmail;
				};	
				// END IF - if userEmail is set - then set value
								
			};
			// END IF - fieldName - check if value set before and set in field
			
			// add numberInput to alertInputFieldView
			alertInputFieldView.add(numberInput);
			
			// push numberInput to fieldsDataArray
			fieldsDataArray.push(numberInput);
			
			// START IF - is field has image add image to right of field
			if (fieldImage){
				
				// change textInput width
				numberInput.width = "85%";
				
				// creat fieldImageViewBox
				var fieldImageViewBox = Ti.UI.createView({
					width: "15%",
					height: "35dp",
				});
				
				// START IF - Alloy.Globals.languageDirection
				if(Alloy.Globals.languageDirection == 'ltr'){				
					fieldImageViewBox.left = 0;				
				}else{					
					fieldImageViewBox.right = 0;				
				};
				// END IF - Alloy.Globals.languageDirection
				
				// create fieldImageView
				var fieldImageView = Ti.UI.createImageView({	
					image: fieldImage,	
					touchEnabled: false,
				});
				
				// add fieldImageView to fieldImageViewBox
				fieldImageViewBox.add(fieldImageView);
				
				// add fieldImageView to alertInputFieldView
				alertInputFieldView.add(fieldImageViewBox);
				
			};
			// END IF - is field has image add image to right of field

		}else if (fieldType == "selector"){
			
			// set selectorFieldsSelected array
			var selectorFieldsSelected = [];
			
			// create alertInputFieldView
			var selector = Ti.UI.createView({
				width: Ti.UI.FILL,
				height: Ti.UI.SIZE,
				borderColor: '#bbb',
				borderRadius: 5,
				borderWidth: 1,
			 	layout: "vertical",
			 	fieldName: fieldName,
			 	fieldRequired: fieldRequired,
			});
					
			// set fieldOptions
			var fieldOptions = fieldData[f].options;
					
			// START Loop - through options
			for (var t=0; t<fieldOptions.length; t++){
						
				// set optionTitle		
				var optionTitle = fieldOptions[t].title;
				var optionName = fieldOptions[t].name;
			
				// create alertInputOption
				var alertInputOption = Ti.UI.createView({
					width: Ti.UI.FILL,
					height: "35dp",
					layout: "composite",
					top:5,
					bottom: 5,
				});
				
				// create optionCheck		
				var optionCheck = Ti.UI.createImageView({
					id: t,
					title : optionTitle,
					name: optionName,
					value: false,
					backgroundImage: '/images/checkbox_unchecked.jpg',
					width: "30dp",
  					height: "30dp",	
				});
		   		
		   		// START IF - Alloy.Globals.languageDirection
				if(Alloy.Globals.languageDirection == 'ltr'){
					
					// set left
					alertInputOption.left = 5;
					optionCheck.left = 5;
					
				}else{
					
					// set right
					alertInputOption.right = 5;
					optionCheck.right = 5;
					
				};
				// END IF - Alloy.Globals.languageDirection

		   		// push current optionTitle and value to selectorFieldsSelected array
		   		selectorFieldsSelected.push({	optionName: optionName,
		   										optionTitle: optionTitle,
		   										value:false });
		   		
		   		// addEventListener to listen for change and run functions
		   		optionCheck.addEventListener('click',function(e){
					
					// set params
					var inputValue = this.value;
					var inputId = this.id;
					var inputName = this.name;
					var inputTitle = this.title;
					
					// START IF - value change
					if (inputValue == false){
						
						// set inputValue
						var inputValue = true;
						
						// update button data
						this.backgroundImage = '/images/checkbox_checked.jpg',
						this.value = true;
						
					}else{	
						
						// set inputValue
						var inputValue = false;
						
						this.backgroundImage = '/images/checkbox_unchecked.jpg',
						this.value = false;
						
					};
					// END IF - value change
							
	
					// update Array Value in selectorFieldsSelected
					selectorFieldsSelected[inputId] = {	optionName: inputName,
														optionTitle: inputTitle,
		   												value:inputValue }; 
					  	
				});


			   	// create optionLabel
				var optionLabel = Ti.UI.createLabel({
					text : optionTitle,
					font : {fontSize: '15dp',
							fontFamily: Alloy.Globals.customFont},	
					color: "black",
				});
				    
				// START IF - Alloy.Globals.languageDirection
				if(Alloy.Globals.languageDirection == 'ltr'){
					
					// set optionLabel textAlign
					optionLabel.textAlign = 'left';

					// START IF ANDROID ELSE IOS SET RIGHT VALUE
					if (Ti.Platform.osname=='android') {
						optionLabel.left = "50dp";
					}else{
						optionLabel.left = "50dp";		
					};
					// END IF ANDROID ELSE IOS SET RIGHT VALUE
					
				}else{
					
					// set optionLabel textAlign
					optionLabel.textAlign = 'right';

					// START IF ANDROID ELSE IOS SET RIGHT VALUE
					if (Ti.Platform.osname=='android') {
						optionLabel.right = "50dp";
					}else{
						optionLabel.right = "50dp";		
					};
					// END IF ANDROID ELSE IOS SET RIGHT VALUE
					
				};
				// END IF - Alloy.Globals.languageDirection

				alertInputOption.add(optionCheck);
				alertInputOption.add(optionLabel);
				
				// add alertInputOption to selector   	
				selector.add(alertInputOption);
				
			};
			// END Loop - through options

			// add selector to alertInputFieldView
			alertInputFieldView.add(selector);
			
			// push selector to fieldsDataArray
			fieldsDataArray.push(selector);
			
		}else if (fieldType == "textArea"){
			
			// create alertInputField
			var textArea = Titanium.UI.createTextArea({
				hintText: fieldTitle,
				hintTextColor: "#a2a2a2",
				borderColor: '#bbb',
				borderRadius: 5,
				borderWidth: 1,
		   		color: "black",
		    	width: Ti.UI.FILL,
				height: "100dp",
				clearOnEdit: true,
				font: {
			        fontSize: '20dp',
			        fontFamily: Alloy.Globals.customFont
			    },	
				fieldName: fieldName,
				fieldRequired: fieldRequired,
				_hintText: fieldTitle,
				_hintColor: "#cdcdcf",
			});
			
			// START IF - Alloy.Globals.languageDirection
			if(Alloy.Globals.languageDirection == 'ltr'){
				
				// set textArea textAlign
				textArea.textAlign = 'left';
				
			}else{
				
				// set textArea textAlign
				textArea.textAlign = 'right';
				
			};
			// END IF - Alloy.Globals.languageDirection
 
			// START IF IOS - custom hint and color
			if (OS_IOS){
				
				// set value and color for IOS
				textArea.value = fieldTitle;
				textArea.color = "#cdcdcf";
				
				// addEventListener to handel hintText not natively handeled 
				textArea.addEventListener('focus',function(e){
  
				    if(e.source.value == e.source._hintText){
				        e.source.value = "";
				        e.source.color = "black";
				    }
				});
				
				// addEventListener to handel hintText not natively handeled
				textArea.addEventListener('blur',function(e){
				    if(e.source.value==""){
				        e.source.value = e.source._hintText;
				        e.source.color = e.source._hintColor;
				    }
				});
			
			};
			// END IF IOS - custom hint and color
			
			// add textArea to alertInputFieldView
			alertInputFieldView.add(textArea);
			
			// push textArea to fieldsDataArray
			fieldsDataArray.push(textArea);
			
		};				
		// END IF - check fieldType and create appropriate field	
		
		//add alertInputFieldView to alertView
		alertView.add(alertInputFieldView);
		
	};
	// END Loop - through fields
	
	// 										END CREATION OF FIELDS AS SENT											//
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// 										START CREATION OF BUTTONS 												//
	
	// set buttonArray
	var buttonArray = [];
	// set cancelButton
	var cancelButton = '';
	
	// START Loop - through Menu Buttons and create
	for (var m=0; m<buttonNames.length; m++){
		
		// set buttonIndex
		var buttonIndex = m;
		
		// START IF - iOS else Android
		if (OS_IOS){
			
			// Start Create alertButtonRow	  
			var alertButtonRow = Ti.UI.createTableViewRow({
			    className:'buttonRow', 					// used to improve table performance
			    height: "45dp",
			    width:	Ti.UI.FILL,
			    top: 0,    
			    layout: "vertical",
			    selectedBackgroundColor: "#c8c8c8",
			});
			
		}else{
			
			// Start Create alertButtonRow	  
			var alertButtonRow = Ti.UI.createView({
			    height: "45dp",
			    width:	Ti.UI.FILL,
			    top: 0,    
			    layout: "vertical",
			});
			
		};
		// END IF - iOS else Android
		
		// create alertButtonView
		var alertButtonView = Ti.UI.createView({
		  width: Ti.UI.FILL,
		  height: Ti.UI.FILL,
		  backgroundSelectedColor: "#c8c8c8",
		  buttonIndex: buttonIndex,  
		});
		
		// create alertButtonView
		var alertButtonSeperator = Ti.UI.createView({
		  width: Ti.UI.FILL,
		  height: "1dp",
		  backgroundColor: "#c8c8c8",
		  top: 0,		  
		});
		
		// START IF - check buttonIndex and set vars
		if (buttonIndex == cancelIndex){
		
			var fontSizeVar = '14dp';
			var colorVar = 'black';
			
		}else{
			
			var fontSizeVar = '18dp';
			var colorVar = '#639a13';
			
		};
		// END IF - check buttonIndex and set vars
		
		// START IF - Alloy.Globals.boldAllowed true then set
		if(Alloy.Globals.boldAllowed){
			var fontWeightVar = 'bold';
		}else{
			var fontWeightVar = 'normal';
		};
		// END IF - Alloy.Globals.boldAllowed true then set
 	
		// create alertButtonLabel
		var alertButtonLabel = Ti.UI.createLabel({
		  text: buttonNames[m],
		  color: colorVar,
		  textAlign: 'center',
		  font: {
			fontSize: fontSizeVar,
			fontWeight: fontWeightVar,
			fontFamily: Alloy.Globals.customFont
		  },
		  touchEnabled: false,	
		  left: 5,
	 	  right: 5,
		});
		
		//////////////////////////////////////////////////////////////////////////////
		// 		START addEventlistener to buttons to fun functions as needed		//
		
		alertButtonView.addEventListener('click', function() {
			
			// START IF - check if data.click callback is set
			if (data.click){
				
				// set formVerified to true
				var formVerified = true;
				
				// set requireOneOfFields to false
				var requireOneOfFields = false;
				
				// START IF - check if cancel button or confirm button clicked
				if (this.buttonIndex == cancelIndex){
									
					// START IF - iOS or Android - CLOSE WINDOW
					if (OS_IOS){
						alertWindow.close();
					}else{
						// hide Keyboard
						Ti.UI.Android.hideSoftKeyboard();
						
						var currentWindow = Alloy.Globals.openWindow;
						currentWindow.remove(alertWindow);	
					};
					// END IF - iOS or Android - CLOSE WINDOW
					
					// set Alloy.Globals.openAlertForm false
					Alloy.Globals.openAlertForm = false;
					
					// send callback with cancel buttonIndex
					data.click({index: this.buttonIndex,});
							
				}else{ // ELSE confirm button clicked
								
						// set inputData to return via callback
						var inputData = [];
						
						//////////////////////////////////////////
						// 		START Loop - through fields		//
						
						for (var f=0; f<fieldData.length; f++){
							
							//Ti.API.info(alertView.children[0].children[0]);
							
							//Ti.API.info("fieldName: " + fieldsDataArray[f].fieldName);
							//Ti.API.info("fieldRequired: " + fieldsDataArray[f].fieldRequired);
							//Ti.API.info("fieldValue: " + fieldsDataArray[f].getValue());  //This log causes crash when field is of type selector
							
							// set field info from fieldData
							var fieldType = fieldData[f].type;
							var fieldName = fieldData[f].name;
							var fieldTitle = fieldData[f].title;
							var fieldRequired = fieldsDataArray[f].fieldRequired;
								
							// START IF - check fieldType and set fieldData and push to inputData array
							if (fieldType == "textInput" || fieldType == "numberInput"){
								
								// set Data and Name and push 
								var inputName = fieldsDataArray[f].fieldName;
								var inputValue = fieldsDataArray[f].getValue();
													
								inputData.push({name: inputName,
												value: inputValue,});
												
								//Ti.API.info("textInputData:" + textInputData);
								
								// START IF - fieldRequired
								if(fieldRequired && !inputValue){
									
									// START IF - userWechat or userQQ
									if (inputName == "userWechat" || inputName == "userQQ"){
										
										// START IF - requireOneOfFields false then set formVerified false
										if(!requireOneOfFields){
											
											// set borderColor and borderWidth
											fieldsDataArray[f].borderColor = "red";
											fieldsDataArray[f].borderWidth = 2;
											
											// set formVerified false
											formVerified = false;
										
										}else{
											
											// set borderColor and borderWidth
											fieldsDataArray[f].borderColor = "#bbb";
											fieldsDataArray[f].borderWidth = 1;
										
										};
										// END IF - requireOneOfFields false then set formVerified false

									}else{
										
										// set borderColor and borderWidth
										fieldsDataArray[f].borderColor = "red";
										fieldsDataArray[f].borderWidth = 2;
										
										// set formVerified false
										formVerified = false;
									
									};
									// END IF - userWechat or userQQ	
										
								}else{
									
									// set borderColor and borderWidth
									fieldsDataArray[f].borderColor = "#bbb";
									fieldsDataArray[f].borderWidth = 1;
									
									// START = set requireOneOfTwo true if userWechat or userQQ true
									if (inputName == "userWechat" || inputName == "userQQ"){
										
										// set requireOneOfFields true
										requireOneOfFields = true; 
											
										// set formVerified true
										formVerified = true;					
										
									};
									// END = set requireOneOfTwo true if userWechat or userQQ true									
									
								};
								// END IF - fieldRequired
								
							}else if (fieldType == "selector"){
								
								// set Data and Name and push
								var inputName = fieldsDataArray[f].fieldName;
								var selectorData = selectorFieldsSelected;
								
								inputData.push({name: inputName,
												value: selectorData,});
												
								//Ti.API.info("selectorData:" + selectorData);
									
								// START LOOP - though selectorData to see if true
								// set selectorDataSet
								var selectorDataSet = false;							
								for (var s=0; s<selectorData.length; s++){
									
									// set selectorDataValue
									var selectorDataValue = selectorData[s].value;
									
									// START IF - selectorDataValue true set selectorDataSet true
									if(selectorDataValue){
										selectorDataSet = true;
									};
									// END IF - selectorDataValue true set selectorDataSet true
									
								};
								// END LOOP - though selectorData to see if true
								
								// START IF - fieldRequired
								if(fieldRequired && !selectorDataSet){
									
									// set formVerified false
									formVerified = false;
									
									fieldsDataArray[f].borderColor = "red";
									fieldsDataArray[f].borderWidth = 2;
									
								}else{
									
									fieldsDataArray[f].borderColor = "#bbb";
									fieldsDataArray[f].borderWidth = 1;
									
								};
								// END IF - fieldRequired
								
							}else if (fieldType == "textArea"){
								
								// set textAreaDefault
								var textAreaDefault = textArea._hintText;
								
								// set Data and Name and push
								var inputName = fieldsDataArray[f].fieldName;
								var inputValue = fieldsDataArray[f].getValue();					
								
								if (inputValue == textAreaDefault){
									inputValue = '';
								}
								
								inputData.push({name: inputName,
												value: inputValue,});
												
								//Ti.API.info("textAreaData:" + textAreaData);
								
								// START IF - fieldRequired
								if(fieldRequired && !inputValue){
									
									// set formVerified false
									formVerified = false;
									
									fieldsDataArray[f].borderColor = "red";
									fieldsDataArray[f].borderWidth = 2;
									
								}else{
									
									fieldsDataArray[f].borderColor = "#bbb";
									fieldsDataArray[f].borderWidth = 1;
									
								};
								// END IF - fieldRequired
													
							};
							// END IF - check fieldType and set fieldData and push to inputData array
							
							// START IF - SET USER DATA in Ti.App.Properties
							if (inputName == "userWechat" && inputValue){
								
								// SET user_wechat of user					
								Ti.App.Properties.setString('user_wechat',inputValue);
							
							}else if (inputName == "userQQ" && inputValue){
								
								// SET user_qq of user						
								Ti.App.Properties.setString('user_qq',inputValue);
								
							}else if (inputName == "userEmail" && inputValue){
									
								// SET user_email of user						
								Ti.App.Properties.setString('user_email',inputValue);
							
							};
							// END IF - SET USER DATA in Ti.App.Properties
								
						};
						
						//		 END Loop - through fields		//
						//////////////////////////////////////////
						
						//////////////////////////////////////////
						// START CHECKING FIELDS NOT BLANK 		//
										
						// START IF - check if formVerified		
						if (formVerified){
									
							// CLOSE FORM AND THEN SEND BACK DATA TO CALLBACK
							
							// START IF - iOS or Android - CLOSE WINDOW
							if (OS_IOS){
								alertWindow.close();
							}else{
								
								// hide Keyboard
								Ti.UI.Android.hideSoftKeyboard();
							
								var currentWindow = Alloy.Globals.openWindow;
								currentWindow.remove(alertWindow);	
							};
							// END IF - iOS or Android - CLOSE WINDOW
									
							// set Alloy.Globals.openAlertForm false
							Alloy.Globals.openAlertForm = false;
					
							// send back Data to Callback
							data.click({	index: this.buttonIndex, 
											inputData: inputData,
											bookName: bookName,
											selectedReadingName: selectedReadingName,
											formName: formName,
										});		
										
						};		
						// END IF - check if formVerified	
													
					};
					// END IF - check if cancel button or confirm button clicked
					
				};
				// END IF - check if data.click callback is set
		});
		
		// 		END addEventlistener to buttons to fun functions as needed		//
		//////////////////////////////////////////////////////////////////////////////	
			
		alertButtonView.add(alertButtonSeperator);
		alertButtonView.add(alertButtonLabel);
		alertButtonRow.add(alertButtonView);
		
		// START IF - buttonIndex is cancelIndex set cancelButton else add to buttonArray
		if (buttonIndex == cancelIndex){
						
			var cancelButton = alertButtonRow;
			
		}else{
			
			buttonArray.push(alertButtonRow);
		};		
		// END IF - buttonIndex is cancelIndex set cancelButton else add to buttonArray
		
	};
	// END Loop - through Menu Buttons and create
	
	// Push cancelButton to end of buttonArray
	buttonArray.push(cancelButton);
	
	// START IF - iOS or Android 
	if (OS_IOS){
		
		// Create tableView with rows as buttons
		var buttonTableView = Ti.UI.createTableView({
		  	data:buttonArray,
		  	width:	Ti.UI.FILL,	
			height: Ti.UI.SIZE,	
		  	separatorColor: "transparent",
		  	scrollable: false, 
		});
	
		// add buttonTableView to alertView
		alertView.add(buttonTableView);
		
	}else{
		
		// START Loop - through createButtons and add
		for (var b=0; b<buttonArray.length; b++){
			
			alertView.add(buttonArray[b]);
			
		};
		// END Loop - through createButtons and add
		
	};
	// END IF - iOS or Android 
	
	// 										END CREATION OF BUTTONS 												//
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
	// add alertView to Window
	alertWindow.add(alertView);
	
	// require alertFormOpenClose
	var alertFormOpenClose = require('alertFormOpenClose/alertFormOpenClose');
	
	// set alertFormData
	var alertFormData = { 	alertFormName: formName,
							alertWindow: alertWindow,
							close:  function(){
								
								// START IF - iOS or Android - CLOSE WINDOW
								if (OS_IOS){
									alertWindow.close();
								}else{
									// hide Keyboard
									Ti.UI.Android.hideSoftKeyboard();
									
									var currentWindow = Alloy.Globals.openWindow;
									currentWindow.remove(alertWindow);	
								};
								// END IF - iOS or Android - CLOSE WINDOW
								
								// set Alloy.Globals.openAlertForm false
								Alloy.Globals.openAlertForm = false;
					
							},
	};
	
	// run alertFormOpenClose with alertWindow
	alertFormOpenClose(alertFormData);
	
};
