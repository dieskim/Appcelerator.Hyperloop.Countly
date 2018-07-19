////////////////////////////////////////////////////////////////////////////////////////////////////
///								Start customAlert Functions										///

exports.show = function (data){
	
	var title = data.title;
	var message = data.message;
	var messageAlign = data.messageAlign || "center";
	var disableCustomFont = data.disableCustomFont || false;
	var cancelIndex = data.cancelIndex;
	var buttonNames = data.buttonNames;
	var alertName = data.alertName;
	
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
	});
	
	// create alertTitleLabel
	var alertTitleLabel = Ti.UI.createLabel({
	  text: title,
	  color: 'black',
	  textAlign: 'center',
	  touchEnabled: false,	
	  top: "15dp",
	  left: 5,
	  right: 5,
	});
	
	// START IF - Alloy.Globals.boldAllowed true then set
	if(Alloy.Globals.boldAllowed){
		var fontWeightVar = 'bold';
	}else{
		var fontWeightVar = 'normal';
	};
	// END IF - Alloy.Globals.boldAllowed true then set
	
	// START IF - Alloy.Globals.customFont true then set
	if(!disableCustomFont && Alloy.Globals.customFont){
		
		// set alertTitleLabel.font
		alertTitleLabel.font = {
			fontSize: '20dp',
			fontWeight: fontWeightVar,
			fontFamily: Alloy.Globals.customFont,
		};
		
	}else{
		
		// set alertTitleLabel.font
		alertTitleLabel.font = {
			fontSize: '20dp',
			fontWeight: fontWeightVar,
		};
		
	};
	// END IF - Alloy.Globals.customFont true then set

	
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
	  textAlign: messageAlign,
	  touchEnabled: false,	
	  bottom: "15dp",
	  left: 5,
	  right: 5,
	});
	
	// START IF - Alloy.Globals.customFont true then set
	if(!disableCustomFont && Alloy.Globals.customFont){
		
		// set alertMessageLabel.font
		alertMessageLabel.font = {
			fontSize: '16dp',
			fontFamily: Alloy.Globals.customFont,
		};
		
	}else{
		
		// set alertMessageLabel.font
		alertMessageLabel.font = {
			fontSize: '16dp',
		};
		
	};
	// END IF - Alloy.Globals.customFont true then set
	
	alertMessageView.add(alertMessageLabel);
	alertView.add(alertMessageView);
	
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
			var fontWeightVar = 'normal';
			
		}else{
			
			var fontSizeVar = '18dp';
			var colorVar = '#639a13';
			
			// START IF - Alloy.Globals.boldAllowed true then set
			if(Alloy.Globals.boldAllowed){
				var fontWeightVar = 'bold';
			}else{
				var fontWeightVar = 'normal';
			}
			// END IF - Alloy.Globals.boldAllowed true then set
	
		};
		// END IF - check buttonIndex and set vars
			
		// create alertButtonLabel
		var alertButtonLabel = Ti.UI.createLabel({
		  text: buttonNames[m],
		  color: colorVar,
		  textAlign: 'center',
		  touchEnabled: false,	
		  left: 5,
	 	  right: 5,
		});
		
		// START IF - Alloy.Globals.customFont true then set
		if(!disableCustomFont && Alloy.Globals.customFont){
			
			// set alertButtonLabel.font
			alertButtonLabel.font = {
				fontSize: fontSizeVar,
				fontWeight: fontWeightVar,
				fontFamily: Alloy.Globals.customFont,
			};
			
		}else{
			
			// set alertButtonLabel.font
			alertButtonLabel.font = {
				fontSize: fontSizeVar,
				fontWeight: fontWeightVar,
			};
			
		};
		// END IF - Alloy.Globals.customFont true then set
	
		// add eventlistener to Button
		alertButtonView.addEventListener('click', function() {
			if (data.click){
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
							
				data.click({index: this.buttonIndex});				
			};
				
		});
			
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
	
	// add alertView to Window
	alertWindow.add(alertView);
	
	// require alertFormOpenClose
	var alertFormOpenClose = require('alertFormOpenClose/alertFormOpenClose');
	
	// set alertFormData
	var alertFormData = { 	alertFormName: alertName,
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

//          		END Function - customAlert Functions	      	  						    //
//////////////////////////////////////////////////////////////////////////////////////////////////
