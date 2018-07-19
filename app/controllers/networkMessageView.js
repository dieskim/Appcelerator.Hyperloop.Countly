/**
 * App Wide Event Listener for app:showAlertMessage
 * - used to display a message in a small grey popup on the bottom of all windows
 * @event app:showAlertMessage
 * @param   {object} data - payload object
 * @param      {string} data.message - message to show
 * @example    <caption>Fire Event with Message</caption>
 * 	// fire app:showAlertMessage with message
	Ti.App.fireEvent("app:showAlertMessage",{
		message: 'String Message you want to show",         	
	});
 *
 */
Ti.App.addEventListener("app:showAlertMessage", showAlertMessage);

// START - FUNCTION showAlertMessage
function showAlertMessage(data){
	
	// set message
	var message = data.message;
	
	// set disableCustomFont
	var disableCustomFont = data.disableCustomFont || false;
	
	// set networkMessageLabel.text as message
	$.networkMessageLabel.text = message;
	
	// START IF - Alloy.Globals.customFont true then set
	if(!disableCustomFont && Alloy.Globals.customFont){
		
		// set $.networkMessageLabel.font
		$.networkMessageLabel.font = {
			fontSize:"15dp",
		   	fontFamily: Alloy.Globals.customFont
		};
		
	}else{
		
		// set $.networkMessageLabel.font
		$.networkMessageLabel.font = {
			fontSize:"15dp",
		};
		
	};
	// END IF - Alloy.Globals.customFont true then set
	
	// set networkMessageView.visible as true
	$.networkMessageView.visible = true;
	
	// get Alloy Built In Animation
	var animation = require('alloy/animation');
	animation.fadeIn($.networkMessageView, 500);
	
	// setTimeout to show menu message after one second
	setTimeout(function(){
		// use animation.fadeOut to hide $.networkMessageView
    	animation.fadeOut($.networkMessageView, 500);
	}, 3000);
	
};
// END - FUNCTION showAlertMessage