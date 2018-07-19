/**
 * subscribeForm
 * - builds a subscribe form to allow the user to subscribe to notifications
 * 
 * Alloy.Globals: 
 * - {@link Alloy.Globals.customFont Alloy.Globals.customFont}
 * - {@link Alloy.Globals.openWindow Alloy.Globals.openWindow}
 * - {@link Alloy.Globals.openAlertForm Alloy.Globals.openAlertForm}
 * - {@link Alloy.Globals.languageDirection Alloy.Globals.languageDirection}
 * 
 * @requires   scheduleNotifications
 * @requires   alertFormOpenClose
 * @module subscribeForm
 * 
 * @example    <caption>Require and run returned function to show form</caption>
 * 
 * // require module subscribeForm in app/assets/lib/
	var subscribeForm = require('scheduleNotifications/subscribeForm');
	
	// show subscribeForm
	subscribeForm();
 * 
 */

/**
 * Builds and shows subscribe form 
 * - runs functions to set subscribed notifications
 * @return     {function}  - function that builds and shows subscribe form then sets subscribed notifications
 */
function subscribeForm(){
	
	Ti.API.info("subscribeForm Module Function");

	// set params as from data
	var title = L("subscriptionHeaderText");
	var message = L("subscriptionMessageText");
	var saveButton = L("confirm");
	var formName = "subscribeForm";
		
	// START BUILD - subscribeOptions
	var defaultSubscriptionData = Alloy.Globals.defaultNotificationSubscriptions;
	
	//remove comeBack
	var indexOfComeBack = defaultSubscriptionData.indexOf("comeBack");
	if (indexOfComeBack > -1) {
    	defaultSubscriptionData.splice(indexOfComeBack, 1);
	};

	// set blank subscribeOptions
	var subscribeOptions = [];

	// START Loop - defaultSubscriptionData and add to subscribeOptions
	for (var s=0; s<defaultSubscriptionData.length; s++){
				
		// set notificationData 
		var notificationData = {	name: defaultSubscriptionData[s],
									title: L(defaultSubscriptionData[s]),
								};
		
		// push to subscribeOptions
		subscribeOptions.push(notificationData);		 
		
			
	};
   	// END Loop - defaultSubscriptionData and add to subscribeOptions
									
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
	
	// create alertInputFieldView Container
	var alertInputFieldView = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: Ti.UI.SIZE,
		bottom: 10,
		top: 10,
		left: 10,
		right: 10,
	});
		
	// set selectorSubscribeSelected array
	var selectorSubscribeSelected = [];
			
	// create alertInputFieldView
	var selector = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: Ti.UI.SIZE,
		borderColor: '#bbb',
		borderRadius: 5,
		layout: "vertical",
	});
					
	// set subscribeOptionsArray
	var subscribeOptionsArray = subscribeOptions;
					
	// START Loop - through options
	for (var t=0; t<subscribeOptionsArray.length; t++){
						
		// set optionTitle		
		var optionTitle = subscribeOptionsArray[t].title;
		var optionName = subscribeOptionsArray[t].name;
		
		// Get Ti.App.Properties - subscriptionData
		var currentSubscriptionData = JSON.parse(Ti.App.Properties.getString("subscriptionData",'false'));
		
		// START IF - check if optionName in currentSubscriptionData set value true else false
		if(currentSubscriptionData && currentSubscriptionData.indexOf(optionName) > -1){
				
			// set sunscribeValue 
			var subscribeValue = true;
			var backgroundValue = '/images/checkbox_checked.jpg';
			
		}else{
			
			// set sunscribeValue
			var subscribeValue = false; 
			var backgroundValue = '/images/checkbox_unchecked.jpg';
			
		};
		// END IF - check if optionName in currentSubscriptionData set value true else false
		
		// create alertInputOption
		var alertInputOption = Ti.UI.createView({
			width: Ti.UI.FILL,
			height: "35dp",
			layout: "composite",
			top:5,
			bottom: 5,
			right: 5,
		});
				
		// create optionCheck 		
		var optionCheck = Ti.UI.createImageView({
			right: 5,
			id: t,
			title : optionTitle,
			name: optionName,
			value: subscribeValue,
			backgroundImage: backgroundValue,
			width: "30dp",
  			height: "30dp",	
		});
		   			
		// push current optionTitle and value to selectorSubscribeSelected array
		selectorSubscribeSelected.push({	notificationName: optionName,
		   									notificationSubscribeValue:subscribeValue });
		   		
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
							
	
			// update Array Value in selectorSubscribeSelected
			selectorSubscribeSelected[inputId] = {		notificationName: inputName,
		   												notificationSubscribeValue:inputValue }; 
					  	
		});

		// create optionLabel
		var optionLabel = Ti.UI.createLabel({
			text : optionTitle,
			font : {fontSize: '20dp',
					fontFamily: Alloy.Globals.customFont},	
			color: "black",
		});
		
		// START IF - Alloy.Globals.languageDirection
		if(Alloy.Globals.languageDirection == 'ltr'){				
			optionLabel.textAlign = 'center';				
		}else{					
			// START IF ANDROID ELSE IOS SET RIGHT VALUE
			if (OS_IOS) {
				optionLabel.right = "70dp";
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
	
	//add alertInputFieldView to alertView
	alertView.add(alertInputFieldView);
			
	// 										END CREATION OF FIELDS AS SENT											//
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// 										START CREATION OF BUTTONS 												//
	
	// set buttonArray
	var buttonArray = [];
	
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
	});
		
	// create alertButtonView
	var alertButtonSeperator = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: "1dp",
		backgroundColor: "#c8c8c8",
		top: 0,		  
	});
	
	// create alertButtonLabel
	var alertButtonLabel = Ti.UI.createLabel({
		text: saveButton,
		color: '#639a13',
		textAlign: 'center',
		font: {
			fontSize: '18dp',
			fontFamily: Alloy.Globals.customFont
		  },
		  touchEnabled: false,	
		  left: 5,
	 	  right: 5,
	});
	
	//////////////////////////////////////////////////////////////////////////////
	// 		START addEventlistener to buttons to fun functions as needed		//
		
	alertButtonView.addEventListener('click', function(e) {
		
		Ti.API.info('The Save button was clicked');		    		
		
		// set subscribeData
		var subscribeData = selectorSubscribeSelected;
						
		// require scheduleNotification module
		var scheduleNotifications = require('scheduleNotifications/scheduleNotifications');
		
		// run scheduleLocalNotificaiton with subscribeData	
		scheduleNotifications.scheduleLocalNotification(subscribeData);	
				
		// START IF - iOS or Android - CLOSE WINDOW
		if (OS_IOS){
			alertWindow.close();
		}else{			
			var currentWindow = Alloy.Globals.openWindow;
			currentWindow.remove(alertWindow);	
		};
		// END IF - iOS or Android - CLOSE WINDOW
					    	
		// set Alloy.Globals.openAlertForm false
		Alloy.Globals.openAlertForm = false;
					
	});		
	// 		END addEventlistener to buttons to fun functions as needed		//
	//////////////////////////////////////////////////////////////////////////////	
	
	alertButtonView.add(alertButtonSeperator);
	alertButtonView.add(alertButtonLabel);
	alertButtonRow.add(alertButtonView);
	
	// add to buttonArray
	buttonArray.push(alertButtonRow);
		
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

module.exports = subscribeForm;