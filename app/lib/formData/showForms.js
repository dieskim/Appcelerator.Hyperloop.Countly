/**
 * showForms
 * Defines and exports form generation functions that can be run to show and send forms
 * - showContact - shows the contact form
 * - showAppHighUsageForm - shows the high app usage form
 * - booksReadBasic - shows the book read basic form (5 chapters)
 * - booksReadComplete - shows the book read complete form (all chapters)
 * - booksReadHalf - shows the book read half form (half of chapters)
 * - showShare - shows the share form
 * - selectedReadingReadComplete - shows the selected reading complete form (all articels/chapters)
 * 
 * Alloy.Globals:
 * - {@Alloy.Globals.convertLanguageStrings Alloy.Globals.convertLanguageStrings}
 * - {@Alloy.Globals.textConverter Alloy.Globals.textConverter}
 * - {@Alloy.Globals.bibleDBTextGenerate Alloy.Globals.bibleDBTextGenerate}
 * - {@Alloy.Globals.crmVars Alloy.Globals.crmVars}
 * - {@Alloy.Globals.ShareImageFullPath Alloy.Globals.ShareImageFullPath}
 * - {@Alloy.Globals.dailyScrollerInFocus Alloy.Globals.dailyScrollerInFocus}
 * - {@Alloy.Globals.AnalyticsEvent Alloy.Globals.AnalyticsEvent}
 * 
 * @requires   showFeedbackForm
 * @requires   customAlert
 *  
 * @module showForms 
 * 
* @example    <caption>Require and run an exported function to show the form</caption> 
 * 
 * // require module customForm in app/assets/lib/
		var showForms = require('formData/showForms');
		
		// run showAppHighUsageForm function
		showForms.showAppHighUsageForm();
 * 
 */

/**
 * Shows the contact form
 */
exports.showContact = function (){
	
	// START POSSIBLE FIELDS	
	var wechatField = {		type: "textInput",							// type 
 							name: "userWechat",							// salesforce field type		
							title: L("weChatField"), 	// title in form
							image: "/images/menu_weixin.png",			// set to add image 
							required: true,
					};	

	var qqField = {			type: "numberInput",						// type 
							name: "userQQ",								// salesforce field type			
							title: L("qqField"),	// title in form
							image: "/images/menu_qq.png",				// set to add image
							required: true,
					};	
						
	var emailField = {		type: "textInput",							// type
							name: "userEmail",							// salesforce field type			
							title: L("emailField"),	// title in form
							image: "/images/menu_email.png",			// set to add image
					};
							
	var commentField = {	type: "textArea",
							name: "customComment",
							title: L("customQuestion"),
					};
	// END POSSIBLE FIELDS
	
	// set showFormData			
	var showFormData = {	title: L("contact_us"),
							message: L("contactMessage"),
							confirm: L("contactConfirm"),
							cancel:  L("cancel"),
							fields: [wechatField,qqField,emailField,commentField],
							formName: "contactForm",
						};
	
	// require module showFeedbackForm in app/assets/lib/
	var showFeedbackForm = require('formData/showFeedbackForm');
	
	// run showFeedbackForm
	showFeedbackForm(showFormData);
	
};

/**
 * Shows the app high usage form.
 */
exports.showAppHighUsageForm = function (){
	
	// START IF Alloy.Globals.convertLanguageStrings - ANDROID and ANDROID < 4.2 - set titleString
    var versionRequired = "4.0";
		
	if (Alloy.Globals.convertLanguageStrings && OS_ANDROID && versionCompare(Ti.Platform.version,versionRequired) == false){
		
		var titleStringOriginal = L("highUsageTitleFix");
		var titleString = Alloy.Globals.textConverter(titleStringOriginal);
		
    }else{
    	var titleString = L("highUsageTitle");
    };
    // END IF Alloy.Globals.convertLanguageStrings - ANDROID and ANDROID < 4.2 - set titleString
    
	// START POSSIBLE FIELDS
	var wechatField = {		type: "textInput",							// type 
 							name: "userWechat",							// salesforce field type		
							title: L("weChatField"), 	// title in form
							image: "/images/menu_weixin.png",			// set to add image 
							required: true,
					};	
							
	var qqField = {			type: "numberInput",						// type 
							name: "userQQ",								// salesforce field type			
							title: L("qqField"),	// itle in form
							image: "/images/menu_qq.png",				// set to add image
							required: true,
						};
		
	var emailField = {		type: "textInput",							// type
							name: "userEmail",							// salesforce field type			
							title: L("emailField"),	// title in form
							image: "/images/menu_email.png",			// set to add image
					};
											
	var commentField = {	type: "textArea",
							name: "customComment",
							title: L("highUsageComment"),};
	// END POSSIBLE FIELDS
	
	// set showFormData			
	var showFormData = {	title: titleString,
							message: L("highUsageMessage"),
							confirm: L("bookCompleteConfirm"),
							cancel:  L("cancel"),
							fields: [wechatField,qqField,emailField,commentField],
							formName: "appHighUsageForm",
						};
	
	// require module showFeedbackForm in app/assets/lib/
	var showFeedbackForm = require('formData/showFeedbackForm');

	// run showCustomForm
	showFeedbackForm(showFormData);
	
	// set JPush Group in Ti.App.Properties
	Ti.App.Properties.setString('jpushHighUsageGroup',JSON.stringify(true));	
	// add to JPush group					
	addJPushGroup();
	
};

/**
 * checks if should show the book read basic form and then shows
 *
 * @param      {object/string}  bookRecord - book record (object) / book name (string)
 * 
 */
exports.booksReadBasic = function (bookRecord){
	
	// START IF - Alloy.Globals.bibleDBTextGenerate - set bookName
	if(Alloy.Globals.bibleDBTextGenerate){
		var bookName = bookRecord.latinShortName;

	}else{
		var bookName = bookRecord;
	};
	// END IF - Alloy.Globals.bibleDBTextGenerate - set bookName
	
	
	// set all book basic strings
	var booksReadBasicArray = JSON.parse(Ti.App.Properties.getString('booksReadBasic','[]'));	// array of books basic read
	
	var bookInArray = valueInArray(booksReadBasicArray,bookName);
	
	if (bookInArray){
		
		//Ti.API.info("Book already in booksReadBasic Group:" + bookName);
		
	}else{
		
		// add current formGroup to booksReadBasicArray
		booksReadBasicArray.push(bookName);
	
		// set booksReadBasic to booksReadBasicArray	
		Ti.App.Properties.setString('booksReadBasic',JSON.stringify(booksReadBasicArray));	 
				
		// run showAppHighUsageForm function
		showBooksReadBasicForm(bookRecord);
		
	};	
	
};

/**
 * Shows the books read basic form.
 *
 * @param      {object/string}  bookRecord - book record (object) / book name (string)
 */
function showBooksReadBasicForm(bookRecord){
	
	// START POSSIBLE FIELDS	
	var wechatField = {		type: "textInput",							// type 
 							name: "userWechat",							// salesforce field type		
							title: L("weChatField"), 	// title in form
							image: "/images/menu_weixin.png",			// set to add image 
							required: true,
					};	

	var qqField = {			type: "numberInput",						// type 
							name: "userQQ",									// salesforce field type			
							title: L("qqField"),	// title in form
							image: "/images/menu_qq.png",				// set to add image
							required: true,
					};	
						
	var emailField = {		type: "textInput",							// type
							name: "userEmail",								// salesforce field type			
							title: L("emailField"),	// title in form
							image: "/images/menu_email.png",			// set to add image
					};
										
	// END POSSIBLE FIELDS
	
	// START IF - Alloy.Globals.bibleDBTextGenerate and Alloy.Globals.convertLanguageStrings set strings
	if (Alloy.Globals.bibleDBTextGenerate && Alloy.Globals.convertLanguageStrings){ 
		
		// set vars
		var bookID = bookRecord.bookID;
		var bookArabicName = bookRecord.shortName;
		var bookName = bookRecord.latinShortName;
		
		// START IF IPHONE ELSE IF ANDROID and ANDROID < 4.2
	    var versionRequired = "4.0";
			
		if (OS_ANDROID && versionCompare(Ti.Platform.version,versionRequired) == false){
			
			// START IF - PSALMS STRING
			if (bookID == 19){
				var titleStringOriginal = "« " + bookArabicName + " » " + L("psalmsBasicTitleFix");
			}else{
				var titleStringOriginal = "« " + bookArabicName + " » " + L("bookBasicTitleFix");
			};
			// END IF - PSALMS STRING
			
			var titleString = Alloy.Globals.textConverter(titleStringOriginal);
			var confirmString = L("bookBasicConfirmFix");
			
	    }else{
	    	
	    	// START IF - PSALMS STRING
			if (bookID == 19){
				var titleString = "« " + bookArabicName + " » " + L("psalmsBasicTitle");
				var messageVar = L("psalmsBasicMessage");
			}else{
	    		var titleString = "« " + bookArabicName + " » " + L("bookBasicTitle");
	    		var messageVar = L("bookBasicMessage");
	    	};
			// END IF - PSALMS STRING
			
	    	var confirmString = L("bookBasicConfirm");
	    };
		
		
		// START IF - PSALMS STRING
		if (bookID == 19){
			var messageVar = L("psalmsBasicMessage");
		}else{
	    	var messageVar = L("bookBasicMessage");
	    };
		// END IF - PSALMS STRING
	
	}else{
		
		// set bookName
		var bookName = bookRecord;
		
		// set vars
		var titleString = L("bookBasicTitle");
		var messageVar = L("bookBasicMessage");
		var confirmString = L("bookBasicConfirm");

	};
	// END IF - Alloy.Globals.bibleDBTextGenerate and Alloy.Globals.convertLanguageStrings set strings
 	
	// set showFormData			
	var showFormData = {	title: titleString,
							message: messageVar,
							confirm: confirmString,
							cancel:  L("cancel"),
							fields: [wechatField,qqField,emailField],
							bookName: bookName,
							formName: "booksReadBasicForm",
						};
	
	// require module showFeedbackForm in app/assets/lib/
	var showFeedbackForm = require('formData/showFeedbackForm');
	
	// run showFeedbackForm
	showFeedbackForm(showFormData);
	
};

/**
 * checks if should show the book read complete form and then shows
 *
 * @param      {object/string}  bookRecord - book record (object) / book name (string)
 */
exports.booksReadComplete = function (bookRecord){
	
	// START IF - Alloy.Globals.bibleDBTextGenerate - set bookName
	if(Alloy.Globals.bibleDBTextGenerate){
		var bookName = bookRecord.latinShortName;

	}else{
		var bookName = bookRecord;
	};
	// END IF - Alloy.Globals.bibleDBTextGenerate - set bookName
	
	// set all book basic strings
	var booksReadCompleteArray = JSON.parse(Ti.App.Properties.getString('booksReadComplete','[]'));	// array of books basic read
	
	var bookInArray = valueInArray(booksReadCompleteArray,bookName);
	
	if (bookInArray){
		
		//Ti.API.info("Book already in booksReadComplete Group: " + bookName);
		
	}else{
		
		// add current formGroup to booksReadCompleteArray
		booksReadCompleteArray.push(bookName);
	
		// set booksReadComplete to booksReadCompleteArray	
		Ti.App.Properties.setString('booksReadComplete',JSON.stringify(booksReadCompleteArray));	 
				
		// run showAppHighUsageForm function
		showBooksReadCompleteForm(bookRecord);

		// START IF - check booksReadCompleteArray length and add to JPUSH Group
		if (booksReadCompleteArray.length == 1){
			//Ti.API.info("Add to JPush Group - Bronze");
				
			// set JPush Group in Ti.App.Properties
			Ti.App.Properties.setString('jpushReadGroup',JSON.stringify("bronze"));	
			// add to JPush group					
			addJPushGroup();		
			
		}else if (booksReadCompleteArray.length == 5){
			//Ti.API.info("Add to JPush Group - Silver");
				
			// set JPush Group in Ti.App.Properties
			Ti.App.Properties.setString('jpushReadGroup',JSON.stringify("silver"));	
			// add to JPush group					
			addJPushGroup();
				
		}else if (booksReadCompleteArray.length == 10){
			//Ti.API.info("Add to JPush Group - Gold");
				
			// set JPush Group in Ti.App.Properties
			Ti.App.Properties.setString('jpushReadGroup',JSON.stringify("gold"));	
			// add to JPush group					
			addJPushGroup();
			
		};
		// END IF - check booksReadCompleteArray length and add to JPUSH Group
		
	};	
	
};

/**
 * Shows the books read complete form.
 *
 * @param      {object/string}  bookRecord - book record (object) / book name (string)
 */
function showBooksReadCompleteForm(bookRecord){
	
	// START IF - Alloy.Globals.bibleDBTextGenerate and Alloy.Globals.convertLanguageStrings set strings
	if (Alloy.Globals.bibleDBTextGenerate && Alloy.Globals.convertLanguageStrings){ 
		
		// set vars
		var bookID = bookRecord.bookID;
		var bookName = bookRecord.latinShortName;
		var bookLatinName = bookRecord.latinShortName;
		var bookArabicName = bookRecord.shortName;
		
		// START IF IPHONE ELSE IF ANDROID and ANDROID < 4.2
	    var versionRequired = "4.0";
			
		if (OS_ANDROID && versionCompare(Ti.Platform.version,versionRequired) == false){
			
			// START IF - PSALMS STRING
			if (bookID == 19){
				var titleStringOriginal = "« " + bookArabicName + " » " + L("psalmsCompleteTitleFix");
			}else{
				var titleStringOriginal = "« " + bookArabicName + " » " + L("bookCompleteTitleFix");
			};
			// END IF - PSALMS STRING
			
			var titleString = Alloy.Globals.textConverter(titleStringOriginal);
			var iLikeString = L("bookCompleteILikeFix");
			
	    }else{
	    	
	    	// START IF - PSALMS STRING
			if (bookID == 19){
				var titleString = "« " + bookArabicName + " » " + L("psalmsCompleteTitle");
			}else{
	    		var titleString = "« " + bookArabicName + " » " + L("bookCompleteTitle");
	    	};
			// END IF - PSALMS STRING
			
	    	var iLikeString = L("bookCompleteILike");
	    };
    
    }else{
		
		// set bookName
		var bookName = bookRecord;
		
    	// set vars
    	var titleString = L('bookCompleteTitle');
    	var iLikeString = L('bookCompleteILike');

    };
    // END IF - Alloy.Globals.bibleDBTextGenerate and Alloy.Globals.convertLanguageStrings set strings

	// START POSSIBLE FIELDS	
	var wechatField = {		type: "textInput",							// type 
 							name: "userWechat",							// salesforce field type		
							title: L("weChatField"), 	// title in form
							image: "/images/menu_weixin.png",			// set to add image 
							required: true,
					};	

	var qqField = {			type: "numberInput",						// type 
							name: "userQQ",								// salesforce field type			
							title: L("qqField"),	// title in form
							image: "/images/menu_qq.png",				// set to add image
							required: true,
					};	
						
	var emailField = {		type: "textInput",							// type
							name: "userEmail",							// salesforce field type			
							title: L("emailField"),	// title in form
							image: "/images/menu_email.png",			// set to add image
					};
	
													
	var optionsField = {	type: "selector",
							name: "bookFeedback",						
							title: "bookFeedback",
							options: [	{	name: Alloy.Globals.crmVars.crmBooksCompleteFeedbackLike,									
											title: iLikeString},
										{	name: Alloy.Globals.crmVars.crmBooksCompleteFeedbackMisunderstood,							
											title: L("bookCompleteIDontUnderstand")},
										{	name: Alloy.Globals.crmVars.crmBooksCompleteFeedbackWantSermon,								
											title: L("bookCompleteIWantSermon")},
									]};

	// END POSSIBLE FIELDS
    
	// set showFormData			
	var showFormData = {	title: titleString,
							message: L("bookCompleteMessage"),
							confirm: L("bookCompleteConfirm"),
							cancel:  L("cancel"),
							fields: [wechatField,qqField,emailField,optionsField],
							bookName: bookName,
							formName: "booksReadCompleteForm",
						};

	// require module showFeedbackForm in app/assets/lib/
	var showFeedbackForm = require('formData/showFeedbackForm');
	
	// run showFeedbackForm
	showFeedbackForm(showFormData);
	
};

/**
 * checks if should show the book read half form and then shows
 *
 * @param      {object/string}  bookRecord - book record (object) / book name (string)
 */
exports.booksReadHalf = function (bookRecord){
	
	// START IF - Alloy.Globals.bibleDBTextGenerate - set bookName
	if(Alloy.Globals.bibleDBTextGenerate){
		var bookName = bookRecord.latinShortName;

	}else{
		var bookName = bookRecord;
	};
	// END IF - Alloy.Globals.bibleDBTextGenerate - set bookName
	
	// set all book basic strings
	var booksReadHalfArray = JSON.parse(Ti.App.Properties.getString('booksReadHalf','[]'));	// array of books basic read
	
	var bookInArray = valueInArray(booksReadHalfArray,bookName);
	
	if (bookInArray){
		
		//Ti.API.info("Book already in booksReadHalf Group: " + bookName);
		
	}else{
		
		// add current formGroup to booksReadCompleteArray
		booksReadHalfArray.push(bookName);
	
		// set booksReadHalf to booksReadHalfArray	
		Ti.App.Properties.setString('booksReadHalf',JSON.stringify(booksReadHalfArray));	
		
		// run shareRequestForm
		shareRequestForm(bookRecord);
		
	};
	
};

/**
 * shows the share request form
 *
 * @param      {object/string}  bookRecord - book record (object) / book name (string)
 */
function shareRequestForm(bookRecord){
		
	// set createAlert Dialog params
	var confirm = L("shareButton");
	var cancel = L("cancel");
    var message = L("shareRequestMessage");
	
	// START IF - Alloy.Globals.bibleDBTextGenerate and Alloy.Globals.convertLanguageStrings set strings
	if (Alloy.Globals.bibleDBTextGenerate && Alloy.Globals.convertLanguageStrings){ 
		
		// set vars
		var bookID = bookRecord.bookID;
		var bookArabicName = bookRecord.shortName;
		
		// START IF IPHONE ELSE IF ANDROID and ANDROID < 4.2
	    var versionRequired = "4.0";
			
		if (OS_ANDROID && versionCompare(Ti.Platform.version,versionRequired) == false){
			
			// START IF - PSALMS STRING
			if (bookID == 19){
				var titleStringOriginal = "« " + bookArabicName + " » " + L("psalmsShareRequestTitleFix");
			}else{
				var titleStringOriginal = "« " + bookArabicName + " » " + L("shareRequestTitleFix");
			};
			// END IF - PSALMS STRING
			
			var titleString = Alloy.Globals.textConverter(titleStringOriginal);
			
	    }else{
	    	// START IF - PSALMS STRING
			if (bookID == 19){
	    		var titleString = "« " + bookArabicName + " » " + L("psalmsShareRequestTitle");
	    	}else{
	    		var titleString = "« " + bookArabicName + " » " + L("shareRequestTitle");
	    	};
			// END IF - PSALMS STRING		
	    };
	    
		var title = titleString;
	
	}else{

		// set vars
		var title = L('shareRequestTitle');

	};
	// START IF - Alloy.Globals.bibleDBTextGenerate and Alloy.Globals.convertLanguageStrings set strings

	// require module customAlert in app/assets/lib/
	var customAlert = require('customAlert/customAlert');
		
	//createAlert AlertDialog with params		
	var notificationData = {
		cancelIndex: 0,
		buttonNames: [cancel,confirm],
		message: message,
		title: title,
		alertName: "shareRequestAlert",
		click: function(e){
			//START IF - Cancel Clicked close ELSE
		    if (e.index == 1){    			      		
		      	Ti.API.info('The Confirm Button was clicked');
				
				// run showShareFunction
				showShareFunction();
											 				    
			}else{
				Ti.API.info('The Cancel button was clicked');
				
			};	
			//END IF - Cancel Clicked close ELSE
		},	
	};
		
	// show AlertDialog notification
	customAlert.show(notificationData);
	
};

/**
 * Opens the shareView
 */
function showShareFunction(){
	
	// START IF - iOS ELSE Android	
	if(OS_IOS){
			
		// set docViewer to show QR Code to Share
		var docViewer = Ti.UI.iOS.createDocumentViewer({url: Alloy.Globals.ShareImageFullPath});
		
		// set Alloy.Globals.dailyScrollerInFocus = false
		Alloy.Globals.dailyScrollerInFocus = false;
		
		// show docViewer
		docViewer.show();	
		
		// addEventListener unload to the docViewer
		docViewer.addEventListener('unload', function(e){
			
			// FIRE EVENT - restart dailyScroller animation
			Ti.App.fireEvent('app:dailyScrollerAnimate');
	
		});
		
	}else{					
				
		// open topicView Window with Args
		var openData = {openCloseView: "shareView",
						openCloseViewData: true,					
					};
					
		// open shareView
		navigationOpenClose.openNavigationView(openData);	
		
		// Ti.App.fireEvent app:openCloseMenu
		Ti.App.fireEvent('app:closeMenu');	
						
	};
	// END IF - iOS ELSE Android		
	
	// START TRACK - SHARE OPEN
	var eventData = {	eventType: "shareEvent",
						eventName: "Share App Opened",
					};
	Alloy.Globals.AnalyticsEvent(eventData);
	// END TRACK - SHARE OPEN	
	
};

/**
 * Shows the Share View
 */
exports.showShare = showShareFunction;


/**
 * checks if should show the selected reading complete form
 *
 * @param      {string}  selectedReadingCategory  The selectedReading category string
 */
exports.selectedReadingReadComplete = function (selectedReadingCategory){
	
	//set selectedReadingData
	var selectedReadingData = {	selectedReadingCategory:selectedReadingCategory,
						selectedReadingNumber:1,};
						
	var selectedReadingName = getSetDatabaseData("getSelectedReadingName",selectedReadingData);
	
	// set all book basic strings
	var selectedReadingReadCompleteArray = JSON.parse(Ti.App.Properties.getString('selectedReadingReadComplete','[]'));	// array of selectedReading read
	
	var selectedReadingInArray = valueInArray(selectedReadingReadCompleteArray,selectedReadingName);
	
	if (selectedReadingInArray){
		
		Ti.API.info("SelectedReading already in selectedReadingReadCompleteArray Group: " + selectedReadingName);
		
	}else{
		
		// add current selectedReadingName to selectedReadingReadCompleteArray
		selectedReadingReadCompleteArray.push(selectedReadingName);
	
		// set sendForms to sendFormsArray	
		Ti.App.Properties.setString('selectedReadingReadComplete',JSON.stringify(selectedReadingReadCompleteArray));	 
				
		// run showAppHighUsageForm function
		showSelectedReadingReadCompleteForm(selectedReadingCategory);
		
	};	
	
};

/**
 * Shows the selectedReading read complete form.
 *
 * @param      {string}    selectedReadingCategory           The selectedReading category
 */
function showSelectedReadingReadCompleteForm(selectedReadingCategory){
		
	//set selectedReadingData
	var selectedReadingData = {	selectedReadingCategory:selectedReadingCategory,
						selectedReadingNumber:1,};
						
	var selectedReadingName = getSetDatabaseData("getSelectedReadingName",selectedReadingData);
	    
	// START POSSIBLE FIELDS	
	var wechatField = {		type: "textInput",							// type 
 							name: "userWechat",							// salesforce field type		
							title: L("weChatField"), 	// title in form
							image: "/images/menu_weixin.png",			// set to add image 
							required: true,
					};	

	var qqField = {			type: "numberInput",						// type 
							name: "userQQ",								// salesforce field type			
							title: L("qqField"),	// title in form
							image: "/images/menu_qq.png",				// set to add image
							required: true,
					};	
						
	var emailField = {		type: "textInput",							// type
							name: "userEmail",							// salesforce field type			
							title: L("emailField"),	// title in form
							image: "/images/menu_email.png",			// set to add image
					};
												
	var optionsField = {	type: "selector",
							name: "selectedReadingFeedback",						
							title: "selectedReadingFeedback",
							options: [	{	name: Alloy.Globals.crmVars.crmSelectedReadingCompleteFeedbackLike,									
											title: L('selectedReadingCompleteILike'),},
										{	name: Alloy.Globals.crmVars.crmSelectedReadingCompleteFeedbackMisunderstood,							
											title: L('selectedReadingCompleteIDontUnderstand'),},
										{	name: Alloy.Globals.crmVars.crmSelectedReadingCompleteFeedbackWantSermon,								
											title: L('selectedReadingCompleteIWantSermon'),},
									]};

	// END POSSIBLE FIELDS
    
	// set showFormData			
	var showFormData = {	title: L('selectedReadingCompleteTitle'),
							message: L('selectedReadingCompleteMessage'),
							confirm: L('selectedReadingCompleteConfirm'),
							cancel: L('selectedReadingCompleteCancel'),
							fields: [wechatField,qqField,emailField,optionsField],
							selectedReadingName: selectedReadingName,
							formName: "selectedReadingReadCompleteForm",
						};
	
	// require module showFeedbackForm in app/assets/lib/
	var showFeedbackForm = require('formData/showFeedbackForm');
	
	// run showFeedbackForm
	showFeedbackForm(showFormData);
	
};