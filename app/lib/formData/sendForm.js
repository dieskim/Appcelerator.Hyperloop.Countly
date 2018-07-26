/**
 * sendForm
 * - adds the form to a sendFormsArray before sending, in case of failure so that we can try to resend on next startup
 * 
 * Alloy.Globals: 
 * - {Alloy.Globals.AnalyticsEvent Alloy.Globals.AnalyticsEvent}
 * 
 * @requires   crmSendData
 * @module sendForm 
 * @example    <caption>Require and run the returned function with/without formParams to send schedule and send forms</caption>
 * //require sendForm lib
	var sendFormsFunction = require('formData/sendForm'); 
	
	// send formParams to sendFormsFunction
	sendFormsFunction(formParams); // with formParamsfor current form / without to resend old forms if any not sent
 * 
 * 
 */

/**
 * Stores and tries to send forms if hasInternet
 *
 * @param      {object}  formParams  The form parameters
 * @return     {function}  - function that stores and tries to send forms
 */
function sendFormsFunction(formParams){
	
	//Ti.API.info("SendForm Function in sendForm module");
	
	// START IF - formParams is set
	if (formParams){
		
		// push form to sendFormsArray in Ti.App.Properties
		storeFormsToSend(formParams);
		
	};
	// END IF - formParams is set

	// set hasInternet
	var hasInternet = Titanium.Network.online;
	
	// START IF - hasInternet is true
	if (hasInternet){
		
		//Ti.API.info("SendForm - Has Internet will Submit Forms");
		
		// Set Ti.App.Properties sendFormHas as true
		var sendFormHas = Ti.App.Properties.getString('sendFormHas',"noUnsentForm");

		// START IF - sendFormHas is true
		if (sendFormHas == "hasUnsentForms"){
			//Ti.API.info("Has Unsent Salesforce Forms - will try to send");
			
			// run submitAllForms
			submitAllForms();

		}else{		
			//Ti.API.info("No Unsent Salesforce Forms");		
		};
		// END IF - sendFormHas is true	
		
	}else{		
		//Ti.API.info("SendForm - NO Internet- send forms on next Start");		
	};
	// END IF - hasInternet is true
	
};

/**
 * Stores a forms to send.
 *
 * @param      {object}  formParams  The form data
 */
function storeFormsToSend (formParams){
	
	//Ti.API.info("storeFormsToSend Function in sendForm module");
			
	// get old sendForms
	var sendFormsArray = JSON.parse(Ti.App.Properties.getString('sendForms','[]'));
	
	// add current form to sendFormsArray
	sendFormsArray.push(formParams);
	
	// set sendForms to sendFormsArray	
	Ti.App.Properties.setString('sendForms',JSON.stringify(sendFormsArray));	 
	
	// Set Ti.App.Properties sendFormHas as true
	Ti.App.Properties.setString('sendFormHas','hasUnsentForms');
	
};

/**
 * submitAllForms function 
 * - sends all forms in Ti.App.Properties sendForms array
 */
function submitAllForms(){
	
	// get old sendForms
	var sendFormsArray = JSON.parse(Ti.App.Properties.getString('sendForms','[]'));
	
	// set currentForm
	var currentForm = sendFormsArray[0];
	
	//Ti.API.info("currentForm");
	//Ti.API.info(currentForm);
		
	// require module crmSendData in app/assets/lib/
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
					                Ti.API.info("Submitting Next - Salesforce Form");     
					                 
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
	
	
};

/**
 * Removes a first form from the Ti.App.Properties sendForms array
 */
function removeFirstFormFromArray(){

	// get sendFormsArray
	var sendFormsArray = JSON.parse(Ti.App.Properties.getString('sendForms','[]'));
	
	// remove first elemetn in sendFormsArray
	sendFormsArray.shift();
	
	// set sendForms to sendFormsArray	
	Ti.App.Properties.setString('sendForms',JSON.stringify(sendFormsArray));
	
}; 

module.exports = sendFormsFunction;