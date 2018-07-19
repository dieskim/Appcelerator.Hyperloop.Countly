/**
 * activityLoader Module 
 * - exports a function that generates a full screen activityIndicator
 * @module     activityLoader
 * @example <caption>Require and Add activityLoader</caption>
 * 
 * 	var activityLoaderFunction = require('activityLoader/activityLoader');
	var activityLoader = activityLoaderFunction();
	$.window.add(activityLoader);
 * 
 * @example <caption>Remove activityLoader</caption>
 * 
 * 	$.window.remove(activityLoader);
 */

/**
 * Creates and Returns a Ti.UI.View containing a Ti.UI.ActivityIndicator
 * @return     {Ti.UI.View} - View (Full Screen Transparent) containing the ActivityIndicator inside a centered View (Semi Transparent Grey View - 100dp x 100dp)
 *
 */
function createActivityLoader(){
	
	// set alertWindow
	var activityWindow = Ti.UI.createView({
		width:	Ti.UI.FILL,		
		height: Ti.UI.FILL,	
	});
	
	// START IF - iOS else Android	
	if (OS_IOS){
		
		// set alertWindow
		var activityBox = Ti.UI.createImageView({
			width:	"100dp",
			height: "100dp",		
			image: '/images/transparent_black.png',
			borderRadius: 10,
		});		
		
	}else{
		
		// set alertWindow
		var activityBox = Ti.UI.createView({
			width:	"100dp",
			height: "100dp",		
			backgroundImage: '/images/transparent_black.png',
			borderRadius: 10,
		});	
		
	};
	// END IF - iOS else Android
	
	// START IF - IOS else android
	if (OS_IOS){	
		var activityStyle = Ti.UI.ActivityIndicatorStyle.BIG;
	}else{	  
		var activityStyle = Ti.UI.ActivityIndicatorStyle.BIG_DARK;
	};
	// END IF - IOS else android
	  
	// Create activityIndicator
	var activityIndicator = Ti.UI.createActivityIndicator({			
	  	style:activityStyle,
	}); 
		
	
	// add alertView to Window	
	activityBox.add(activityIndicator);
	activityIndicator.show();
	activityWindow.add(activityBox);
	
	// return activityWindow
	return activityWindow;
	
};

module.exports = createActivityLoader;