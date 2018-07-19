// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place for any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`

//////////////////////////////////////////////////////////////////////////////
//					Start Setting Global Variables							//

// START - set enableFeaturesDateIOS and use to set enableDateDelayedFunctions
/**
 * date string after which certain features will be enabled / allowed to run 
 * @alias "Alloy.Globals.enableFeaturesDateIOS" 
 * @type       {string}
 * @global
 */
Alloy.Globals.enableFeaturesDateIOS = Date.parse("January 31, 2017"); 		// TO DO - set before release
	
/**
 * flag to enable certain function after a certain date 
 * @alias "Alloy.Globals.enableDateDelayedFunctions" 
 * @type       {boolean}
 * @global
 */
Alloy.Globals.enableDateDelayedFunctions = false;

// require checkEnableFeatures
var checkEnableFeatures = require('checkEnableFeatures/checkEnableFeatures');

// run checkEnableFeatures.enableDisable
checkEnableFeatures.enableDisable();

// END - set enableFeaturesDateIOS and use to set enableDateDelayedFunctions

/**
 * flag to enable bible text generation from database else just pulls out
 * @alias "Alloy.Globals.bibleDBTextGenerate" 
 * @type       {boolean}
 * @global
 */
Alloy.Globals.bibleDBTextGenerate = true;
			
/**
 * object of all databases and version
 * @alias "Alloy.Globals.databaseData" 
 * @type       {object}
 * @global
 */
Alloy.Globals.databaseData = {	'textData': 	{	databaseName:'tjapp',				// database name
													shippedVersion: '1.3',				// version shipped with app
								},
								'usageData':	{	databaseName:'tjapp_textData',
													shippedVersion: '1.0',				// ONLY UPDATE VIA SQL STATEMENTS
								},
								'urlData':		{	databaseName:'app_urlData',
													shippedVersion: '1.0',				
								},
								'bibleText':	{	databaseName:'bible_text',
													shippedVersion: '1.2',
								},
								'topicData':	{	databaseName:'topic_data',
													shippedVersion: '1.1',
								},
								'vodData':		{	databaseName:'vod_data',
													shippedVersion: '1.1',
								},
								'questionData':	{	databaseName:'question_data',
													shippedVersion: '1.0',
								},
};							
// END SET - databaseData with database name and latest version 

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 																START SET - CRM Setting																			//

// START IF - OS_IOS
if (OS_IOS){
	Alloy.Globals.crmFromName = 'HayatApp-iOS';
}else{
	Alloy.Globals.crmFromName = 'HayatApp-Android';
};
// END IF - OS_IOS

// set Alloy.Globals.crmVars
Alloy.Globals.crmVars = {
	'crmLeadSource': 'lead_source',
	'crmGPSLatitude': 'gps_latitude',
	'crmGPSLongitude': 'gps_longitude',
	'crmJPUSHID': 'JPUSHID',
	'crmJPUSHReadGroup': 'jpush_read_group',
	'crmOUDID': 'OUDID',
	'crmBooksReadBasic': 'books_read_basic',
	'crmBooksReadHalf': 'books_read_half',
	'crmBooksReadComplete': 'books_read_complete',
	'crmBookName': 'book_name',
	'crmBooksBasicWantCalligraphy': 'books_basic_want_calligraphy',
	'crmBooksCompletedFeedback': 'books_completed_feedback',
	'crmBooksCompleteFeedbackLike': 'books_complete_feedback_like',
	'crmBooksCompleteFeedbackMisunderstood': 'books_complete_feedback_misunderstood',
	'crmBooksCompleteFeedbackWantSermon': 'books_complete_feedback_want_sermon',
	'crmXuanjiName': 'selected_read_name',
	'crmXuanjiReadComplete': 'selected_read_complete',
	'crmXuanjiCompletedFeedback': 'selected_completed_feedback',
	'crmXuanjiCompleteFeedbackLike': 'selected_complete_feedback_like',
	'crmXuanjiCompleteFeedbackMisunderstood': 'selected_complete_feedback_misunderstood',
	'crmXuanjiCompleteFeedbackWantSermon': 'selected_complete_feedback_want_sermon',
	'crmAppHighUsage': 'app_high_usage',
	'crmWechat': 'wechat_phone',
	'crmQQ': 'qq',
	'crmEmail': 'email',
	'crmAppComment': 'app_comment',	
};

// 															END SET - CRM Setting																			//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * array of default notifications to schedule
 * @alias "Alloy.Globals.defaultNotificationSubscriptions" 
 * @type       {array}
 * @global
 */
Alloy.Globals.defaultNotificationSubscriptions = ['comeBack','vod','qod',];

/**
 * number days to schedule come back notifcation after
 * @alias "Alloy.Globals.defaultComeBackNotificationDays" 
 * @type       {number}
 * @global
 */
Alloy.Globals.defaultComeBackNotificationDays = 10;		// as days - 10 days to show comeBackNotification after 10 days of last app open

/**
 * number of days to schedule vod / qod notications for
 * @alias "Alloy.Globals.defaultNotificationDays" 
 * @type       {number}
 * @global
 */
Alloy.Globals.defaultNotificationDays = 7;				// as days - 7 days to show VOD/QOD Notification for the next 7 days

/**
 * time of day (hour) to schedule vod notfication at daily
 * @alias "Alloy.Globals.vodNotificationTime" 
 * @type       {number}
 * @global
 */
Alloy.Globals.vodNotificationTime = 8;					// as hours - 8 = 8AM

/**
 * time of day (hour) to schedule qod notfication at daily
 * @alias "Alloy.Globals.qodNotificationTime" 
 * @type       {number}
 * @global
 */
Alloy.Globals.qodNotificationTime = 20;					// as hours - 20 = 8PM

// set QR and Share Image
Alloy.Globals.QRImage = 'hayatnuri_yanfon_qr.jpg';
Alloy.Globals.QRImageFullPath = '/images/hayatnuri_yanfon_qr.jpg';
Alloy.Globals.ShareImage = 'hayatnuri_yanfon.jpg';
Alloy.Globals.ShareImageFullPath = '/images/hayatnuri_yanfon.jpg';

// set androidAPK
Alloy.Globals.androidAPK = 'HayatnuriAndroid.apk';

// set Android class name
Alloy.Globals.androidClassName = 'com.hayatnuri.app.HayatappActivity';

// set rtl options
Alloy.Globals.languageDirection = 'rtl';									// set langauge direction as ltr / rtl - this will set fonts, style, menus etc to right rather than left
Alloy.Globals.useRTLMarker = true;											// set true to use rtlMarker else it will not

// set convertLanguage options
Alloy.Globals.convertLanguageStrings = true; 								// set true to convert langauge strings- if true also set Alloy.Globals.textConverterModule to be used in conversion
Alloy.Globals.textConverterModule = 'convertUText/convertUText';			// location of textConverterModule else false if not to convert text

// set font options
Alloy.Globals.useCustomFont = true;											// set true to use customFont and then spesify iOS and Android name
Alloy.Globals.customFontFile = 'Alpida.otf';								// set the fontFile - place under app/assets/fonts/FontFile.otf - must be otf font
Alloy.Globals.customFontNameiOS = 'Alpida Unicode System'; 					// use the friendly-name on iOS
Alloy.Globals.customFontNameAndroid = 'Alpida';								// use the font file name for Android 
Alloy.Globals.boldAllowed = false;											// set true to allow bold else false to not allow bold on any text
Alloy.Globals.disableCustomFontSpesificInstances = true;					// set true to disable custom font in spesific instances 

// set highUsageAmount
Alloy.Globals.highUsageFormAmount = 10;
Alloy.Globals.highUsageReviewAmount = 15;

// set timer times
Alloy.Globals.chapterReadTimerTime = 60000;					// 60 seconds
Alloy.Globals.chapterListenTimerTime = 60000;			// 60 seconds
Alloy.Globals.topicTimerTime = 30000;
Alloy.Globals.questionTimerTime = 30000;

// Disable Screen idle turn off
Titanium.App.idleTimerDisabled = true;

// set Alloy.Globals.isiPhoneX
Alloy.Globals.isiPhoneX = (Ti.Platform.displayCaps.platformWidth === 375 && Ti.Platform.displayCaps.platformHeight === 812 && Ti.Platform.displayCaps.logicalDensityFactor === 3);

// START - Set Alloy.Globals.windowTop - 20 on iOS7 - 0 on everything  else
if(OS_IOS && parseInt(Ti.Platform.version,10) >= 7){

	// START IF - iPhoneX
	if(Alloy.Globals.isiPhoneX){
		Alloy.Globals.windowTop = 44;
		Alloy.Globals.windowBottom = 34;
	}else{
		Alloy.Globals.windowTop = 20;
		Alloy.Globals.windowBottom = 0;
	};
	// END IF - iPhoneX

}else{
	Alloy.Globals.windowTop = 0;
	Alloy.Globals.windowBottom = 0;
};
// END - Set Alloy.Globals.windowTop - 20 on iOS7 - 0 on everything  else

// Set Alloy.Globals.loading
Alloy.Globals.loading = false;

// Set Alloy.Globals.sessionFirstEventSent
Alloy.Globals.sessionFirstEventSent = false;

// Set Alloy.Globals.fontSizeRow
Alloy.Globals.fontSizeRow = '';

// Set Alloy.Globals.fontOpen
Alloy.Globals.fontRowOpen = false;

// Set Alloy.Globals.fontSizeDefault
Alloy.Globals.fontSizeDefault = 16;	

// Set Alloy.Globals.fontSizeSmall
Alloy.Globals.fontSizeSmall = 16;	

// Set Alloy.Globals.fontSizeMedium
Alloy.Globals.fontSizeMedium = 20;

// Set Alloy.Globals.fontSizeLarge
Alloy.Globals.fontSizeLarge = 24;

/**
 * current Ti.UI.Window that is open
 * @alias "Alloy.Globals.openWindow" 
 * @type       {Ti.UI.Window}
 * @default emptyString
 * @global
 */
Alloy.Globals.openWindow = '';

// set Alloy.Globals.openViewArray
Alloy.Globals.openViewArray = [];

// set appOpenFromPush
Alloy.Globals.appOpenFromPush = false;

// set Android exitApp value
Alloy.Globals.androidExitApp = false;

/**
 * alert / form open flag
 * @alias "Alloy.Globals.openAlertForm" 
 * @type       {boolean}
 * @default false
 * @global
 */
Alloy.Globals.openAlertForm = false;

/**
 * array of open alerts and forms
 * @alias "Alloy.Globals.openAlertFormArray" 
 * @type       {array}
 * @default emptyArray
 * @global
 */
Alloy.Globals.openAlertFormArray = [];

// Setting to let background Audio work
Titanium.Media.audioSessionCategory = Ti.Media.AUDIO_SESSION_CATEGORY_PLAYBACK;

/**
 * storage device to use (SD / Internal)
 * @name "Alloy.Globals.storageDevice" 
 * @type       {Ti.Filesystem.externalStorageDirectory}
 * @global
 */
// START IF - check if android and has space SD card else iOS
if (OS_ANDROID){	
    	
	// START IF - has SD CARD and mounted
    if (Titanium.Filesystem.isExternalStoragePresent()){
    	
		//Ti.API.info("Android - Has SD Card");
		
		Alloy.Globals.storageDevice = Ti.Filesystem.externalStorageDirectory;
		
	}else{
		
		//Ti.API.info("Android - No SD Card");
		
		Alloy.Globals.storageDevice = Ti.Filesystem.applicationDataDirectory;
		
	};
	
}else{
	
	Alloy.Globals.storageDevice = Ti.Filesystem.applicationDataDirectory;
	
	// setRemoteBackup false for iCloud
	Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory).setRemoteBackup(false);
	
	//Ti.API.info("RemoteBackup: " + Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory).getRemoteBackup());
	
};	
// END IF - check if android and has space SD card else iOS		

/**
 * location default string
 * @alias "Alloy.Globals.locationDefault" 
 * @type       {string}
 * @default noLocation
 * @global
 */
Alloy.Globals.locationDefault = 'noLocation';

// set url defaults						
Alloy.Globals.audioFilePrefix = 'hn_';
Alloy.Globals.shouldBePlaying = false;
Alloy.Globals.currentPlaying = '';

// set colors
Alloy.Globals.mainColor = '#90B81A';
Alloy.Globals.mainColorLight = '#b4cf51';
Alloy.Globals.darkColor = '#464646';
//Alloy.Globals.darkMenuColor = '#2A2A2A';
//Alloy.Globals.secondaryColor = '#41DA15';
Alloy.Globals.backgroundColor = '#F1EECD';
Alloy.Globals.boxBackgroundColor = '#FDFAE8';
Alloy.Globals.selectedBackgroundColor = '#C8C8C8';
Alloy.Globals.hintColor = '#A2A2A2';
Alloy.Globals.customHintColor = '#CDCDCF';
Alloy.Globals.textSectionColor = '#436a0f';
Alloy.Globals.textVerseNumberColor = '#436a0f';
Alloy.Globals.textHighlightColor = 'rgba(144,184,26,0.4)';
Alloy.Globals.textLinkColor = '#C44B16';

// TO DO - TITANIUM 7.0 ADD NOTIFCATION COLOR
// SET Alloy.Globals.androidNotificationIcon
if(OS_ANDROID){
	var noticationVersion = "5.0";
	
	if (versionCompare(Ti.Platform.version, noticationVersion) == true) {
		Alloy.Globals.androidNotificationIcon = Ti.App.Android.R.drawable.notification_icon;      
	}else{
        Alloy.Globals.androidNotificationIcon = Ti.App.Android.R.drawable.appicon;    	
	};    

};

// set useWebviewScripts and webviewScriptArray
Alloy.Globals.useWebviewScripts = true;													// set true to include scripts in webviews - also add all scripts to Alloy.Globals.webviewScriptArray
Alloy.Globals.webviewScriptArray = [	"webview_scripts/jquery.jslocal",				// set locations of scripts to include in webviews
										"webview_scripts/jquerymobile.jslocal",
										"webview_scripts/functions.jslocal", ];
								

// START ARRAY BUILD - alertFormImportanceList 
// - highest in list will always have priority and close others or prevent others from opening
// - form/alert not in list will always close all in list
var alertFormImportanceList = [	"updateAlert",
								"closeMainAndroidAlert",
								"pushAlert",
								"subscribeForm",
								"appHighUsageForm", 
								"booksReadCompleteForm",
								"shareRequestAlert",						
								"booksReadBasicForm",
								"contactForm",
								"openLastOpenViewAlert",																
];
// END ARRAY BUILD - alertFormImportanceList

//					End Setting Global Variables							//
//////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////
//							Start Custon Font Section								//

// START IF - Alloy.Globals.useCustomFont true then set Alloy.Globals.customFont else false
if (Alloy.Globals.useCustomFont){
	
	// START IF - iOS / Android
	if(OS_IOS){
		Alloy.Globals.customFont = Alloy.Globals.customFontNameiOS;
	}else{
		Alloy.Globals.customFont = Alloy.Globals.customFontNameAndroid;
	};
	// END IF - iOS / Android
	
}else{
	
	Alloy.Globals.customFont = false;
	
};
// END IF - Alloy.Globals.useCustomFont true then set Alloy.Globals.customFont else false

//							End Custon Font Section								//
///////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////
//					START Text and Language conversion Functions Font Section		//

// to not convert any string set - Alloy.Globals.convertText = false
// to not convert single string use - L("string_name", "false")

// START FUNCTION - L - redeclare L to convert language strings
function L(lookupString, convert){
	
	// set convertFlag to true if argument not passed
	var convertFlag = typeof convert !== 'undefined' ?  convert : true;
			
	// get languageString from strings.xml
	var languageString = Ti.Locale.getString(lookupString);
			
	// START IF - Alloy.Globals.convertLanguageStrings and convertFlag not set to false then convert else output normal language string
	if(Alloy.Globals.convertLanguageStrings && convertFlag === true){
			
		var convertedLanguageString = Alloy.Globals.textConverter(languageString);  
		var finalConvertedLanguageString = convertedLanguageString;
		return finalConvertedLanguageString;
			
	}else{
			
		return languageString;
	}
	// END IF - Alloy.Globals.convertText and convertFlag not set to false then convert else output normal language string
	
};
// END FUNCTION - L - redeclare L to convert language strings

// START IF - Alloy.Globals.textConverterModule
// to not convert text do not set Alloy.Globals.textConverterModule
if (Alloy.Globals.textConverterModule){
	
	Alloy.Globals.textConverter = require(Alloy.Globals.textConverterModule);
		
}else{
	
	Alloy.Globals.textConverter = function(inputString, rtlMarker, convertProblems){return inputString;};
	
};
// END IF - Alloy.Globals.textConverterModule


// START IF - Alloy.Globals.useRTLMarker set rtlMarker else set blank
if(Alloy.Globals.useRTLMarker){
	
	Alloy.Globals.rtlMarker = '\u200F';
	
}else{
	
	Alloy.Globals.rtlMarker = '';
	
};
// END IF - Alloy.Globals.useRTLMarker set rtlMarker else set blank

//					END Text and Language conversion Functions Font Section			//
///////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
//	  			START Check Database Version and update if needed		   //

// Include the model in app/lib/
var databaseConnect = require('databaseConnect');

// set databaseData 
var databaseData = Alloy.Globals.databaseData;

// START LOOP - through databaseData and checkVersion
for (var key in databaseData){
	if (databaseData.hasOwnProperty(key)) {
  		
  		// checkVersion on database
		databaseConnect({
			databaseNameReadable: key,
			database: databaseData[key].databaseName,
			checkUpdateVersion: databaseData[key].shippedVersion,
			method: "checkVersion",
		});
  		
	};
};
// END LOOP - through databaseData and checkVersion

//	  			END Check Database Version and update if needed		  		 //
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
//					Start Analytics and Crash Module						//

// require checkCountlyURL
var checkCountlyURL = require('checkCountlyURL/checkCountlyURL');
		
// get checkCountlyURL.getURL()
var countlyURL = checkCountlyURL.getURL();

// require Countly
var Countly = require('countlyModule/countlyModule');

// enable debug
Countly.enableDebug();

// countly start
Countly.start({ appKey: "ac012563545a192cd509067284b254e467f110af",
                host: countlyURL,
                iosDeviceID: "CLYOpenUDID",                             // Optional - Defaults to: CLYIDFV - https://resources.count.ly/v1.0/docs/countly-sdk-for-ios-and-os-x#section-using-a-custom-device-id
                //androidDeviceID: "DeviceId.Type.OPEN_UDID",           // Optional - Defaults to: DeviceId.Type.OPEN_UDID else DeviceId.Type.ADVERTISING_ID / YOUR-OWN-CUSTOM-ID - https://resources.count.ly/v1.0/docs/countly-sdk-for-android#section-setting-up-countly-sdk
                features: ['CLYCrashReporting'],						// Optional - Array of Features to Enable. Possible Values: CLYCrashReporting / CLYAutoViewTracking (CLYPushNotifications NOT Supported yet) @see {@link https://resources.count.ly/docs/countly-sdk-for-ios-and-os-x#section-additional-features | iOS Additional Features}
 
});

/**
 * Analytics Device ID Event
 * @alias "Alloy.Globals.AnalyticsDeviceID" 
 * @type		{function}
 * @return     	{string}  current countly id for app as used on server
 * @global
 */
Alloy.Globals.AnalyticsDeviceID = function(){
	
	// get deviceID from Countly Module
	var deviceID = Countly.getDeviceID();
		
	//Ti.API.info("Countly deviceID: " + OUDID);
	return deviceID;
		
};
// END FUNCTION - Alloy.Globals.AnalyticsDeviceID

/**
 * Analytics Event
 * @alias "Alloy.Globals.AnalyticsEvent" 
 * @type	{function}
 * @param 	{object}	data - data object with details of event
 * @param 	{string}	data.eventType 	- event type
 * @param 	{string}	data.eventName	- event name
 * @param	{object}	data.eventVars  - object with event vars
 * @global
 */
Alloy.Globals.AnalyticsEvent = function(data){
		
	var eventType = data.eventType;			// screenView or screenActivity
	var eventName = data.eventName;			// HomeScreen or HomeScreenActivity
	var eventVars = data.eventVars;
	
	// set segmentation data	
	var segmentation = {};
					
	// get online/offline and add to segmentation
	var hasInternet = Titanium.Network.online;	
	
	// START IF - hasInternet is true
	if (hasInternet){
		var onlineOffline = "Online";
	}else{
		var onlineOffline = "Offline";
	};
	// START IF - hasInternet is true
	segmentation['Online/Offline'] = onlineOffline;
			
	// START IF - get time and add to segmentation	
	if (eventType == "sessionStarted"){
		
		// get dateTime
		var dateTime = getDateTime();
		
		// add dateTime to segmentation
		segmentation['Session Timestamp'] = dateTime;
		
	};	
	// END IF - get time and add to segmentation
	
	// START IF - get eventVars add to segmentation	
	if (eventVars){
		
		// START LOOP - eventArray	
		for (var key in eventVars) {
			
			// add all eventVars to segmentation
			if (eventVars.hasOwnProperty(key)) {
				segmentation[key.toString()] = eventVars[key].toString();
			};
			
		};
		// END LOOP - eventArray
		
	};
	// END IF - get eventVars add to segmentation	

			
	//Ti.API.info("Countly - Send Event: " + eventName);
	var eventData = {key: eventName, segmentation:segmentation, count: 1};
    Countly.recordEvent(eventData);
						
	// START IF - Alloy.Globals.sessionFirstEventSent false 
	if (Alloy.Globals.sessionFirstEventSent != true){
		
		// START IF - eventType not sessionStarted / location / error
		if (eventType != "sessionStarted" && eventType != "location" && eventType != "error" ){
								
			Ti.API.info("Session First Event - Send to Countly");		
						
			// set Alloy.Globals.sessionFirstEventSent true
			Alloy.Globals.sessionFirstEventSent = true;
				
			// add eventName to firstEvent
			segmentation['firstEventName'] = eventName;
				
			// Analytics Track FirstEvent
			var eventData = {key: "sessionFirstEvent", segmentation:segmentation, count: 1};
			Countly.recordEvent(eventData);	
		};
		// END IF - eventType not sessionStarted / location / error
							
	};
	// END IF - Alloy.Globals.sessionFirstEventSent false
					
};
// END FUNCTION - Alloy.Globals.AnalyticsEvent		

// START FUNCTION - Alloy.Globals.AnalyticsUserData
Alloy.Globals.AnalyticsUserData = function(data){
	
	//Ti.API.info("Countly Set UserData");
	//////////////////////////////////////////////////////////////////////////////////////////////////
	// 								START SETTING userData											//
	
	// set userData object
	var userData = {};
	
	// get JPushID of user
	var jpushDeviceID = Ti.App.Properties.getString('JPushID',false);
	if (jpushDeviceID){
		userData['name'] = jpushDeviceID;
	}else{
		// get OUDID of user
		var OUDID = Alloy.Globals.AnalyticsDeviceID();
		if (OUDID){
			userData['name'] = OUDID;
		};
	};
	
	// 								END SETTING userData											//
	//////////////////////////////////////////////////////////////////////////////////////////////////
	
	//////////////////////////////////////////////////////////////////////////////////////////////////
	// 								START SETTING customUserData									//
									
	// Set customUserData{} as information about user with custom properties
	// In customUserData you can provide any string key values to be stored with user
	
	// set customUserData object
	var customUserData = {};
	
	// get OUDID for user
	var OUDID = Alloy.Globals.AnalyticsDeviceID();
	if(OUDID){
		customUserData['OUDID'] = OUDID;	
	};	
	
	// get jpushDeviceID for user
	var jpushDeviceID = Ti.App.Properties.getString('JPushID',false);
	if(jpushDeviceID){
		customUserData['JPushID'] = jpushDeviceID;	
	};		
	
	// get jpushReadGroup for user
	var jpushReadGroup = JSON.parse(Ti.App.Properties.getString('jpushReadGroup',false));
	if(jpushReadGroup){
		customUserData['jpushReadGroup'] = jpushReadGroup;	
	};		
	
	// set databaseData
	// get databaseVerionsObject
	var databaseVerionsObject = JSON.parse(Ti.App.Properties.getString('databaseVerions','{}'));		// object of databaseVerions	
	if(databaseVerionsObject){
		
		customUserData['DatabaseVersions'] = JSON.stringify(databaseVerionsObject);

	};
	
	// set crmUserID
	var crmUserInfo = JSON.parse(Ti.App.Properties.getString('crmUserInfo',false));
	if(crmUserInfo){
		var crmUserID = crmUserInfo.userID;		
		customUserData['SalesforceID'] = crmUserID;			
	};
	
	// set countlyURL
	var countlyURL = checkCountlyURL.getURL();
	if(countlyURL){	
		customUserData['CountlyURL'] = countlyURL;			
	};
	
	// get jpushHighUsageGroup
	var highAppUsage = JSON.parse(Ti.App.Properties.getString('jpushHighUsageGroup',false));
	if(highAppUsage){
		customUserData['highAppUsage'] = "Yes";	
	};
	
	// set ccontactInfoArray
	var contactInfoArray = [];
	
	// get userWechat of user
	var userWechat = Ti.App.Properties.getString('user_wechat',false);	
	if (userWechat){
		contactInfoArray.push(userWechat);
	};
	
	// get userQQ of user
	var userQQ = Ti.App.Properties.getString('user_qq',false);	
	if (userQQ){
		contactInfoArray.push(userQQ);
	};
	
	// get userEmail of user
	var userEmail = Ti.App.Properties.getString('user_email',false);	
	if (userEmail){
		contactInfoArray.push(userEmail);
	};
	
	// START IF - contactInfo array not empty then set
	if(contactInfoArray.length > 0){
		customUserData['App Contact Info Latest'] = contactInfoArray.join(";");	
	};
	// END IF - contactInfo array not empty then set
		
	// require locationData module
	var locationData = require('locationData/locationData');	

	// set gpsLocation
	var locationString = locationData.getLocationData("string");	
	customUserData['GPSLocation'] = locationString;	
		
	// get booksReadBasic
	var booksReadBasicArray = JSON.parse(Ti.App.Properties.getString('booksReadBasic',false));
	if(booksReadBasicArray){
		var booksReadBasic = booksReadBasicArray.join(";");
		customUserData['Books Read Basic'] = booksReadBasic;	
	};
	
	// get booksReadBasic
	var booksReadHalfArray = JSON.parse(Ti.App.Properties.getString('booksReadHalf',false));
	if(booksReadHalfArray){
		var booksReadHalf = booksReadHalfArray.join(";");
		customUserData['Books Read Half'] = booksReadHalf;	
	};
	
	// get booksReadComplete
	var booksReadCompleteArray = JSON.parse(Ti.App.Properties.getString('booksReadComplete',false));	// array of books basic read
	if(booksReadCompleteArray){
		var booksReadComplete = booksReadCompleteArray.join(";");
		customUserData['Books Read Complete'] = booksReadComplete;	
	};	
	
	// get booksBasicWantCalligraphyArray
    var booksBasicWantCalligraphyArray = JSON.parse(Ti.App.Properties.getString('booksBasicWantCaligraphy','[]'));	// leave Ti.App.Properties booksBasicWantCaligraphy spelling mistake for old apps
    if(booksBasicWantCalligraphyArray){
		var booksBasicWantCalligraphy = booksBasicWantCalligraphyArray.join(";");
		customUserData['Books Want Calligraphy'] = booksBasicWantCalligraphy;	
	};
 	
 	// get booksCompletedFeedbackArray
    var booksCompletedFeedbackArray = JSON.parse(Ti.App.Properties.getString('booksCompletedFeedback','[]'));	// array of booksCompletedFeedback
    if(booksCompletedFeedbackArray){
		var booksCompletedFeedback = booksCompletedFeedbackArray.join(";");
		customUserData['Books Complete (Gave Feedback)'] = booksCompletedFeedback;	
	};
		
	// 								END SETTING customUserData									//		
	//////////////////////////////////////////////////////////////////////////////////////////////////
	
	// set args as userData and customUserData
	var args = {	userData:userData,
					customUserData:customUserData,
				};
							
	// run Countly.userData
	Countly.userData(args);		

};
// END FUNCTION - Alloy.Globals.AnalyticsUserData
	
/**
 * Analytics Record Location
 * @alias "Alloy.Globals.AnalyticsRecordLocation" 
 * @type		{function}
 * @param 	{object}	locationData 					- the locationData key value object
 * @param 	{object}	data.gpsLocation 				- gpsLocation key value object
 * @param 	{string}	data.gpsLocation.latitude 		- gps location latitude
 * @param 	{object}	data.gpsLocation.longitude		- gps location longitude
 * @global
 */
Alloy.Globals.AnalyticsRecordLocation = function(locationData){

	// run Countly.recordLocation with gpsLocation as locationData.gpsLocation
    Countly.recordLocation({gpsLocation: locationData.gpsLocation}); 
		
};
// END FUNCTION - Alloy.Globals.AnalyticsRecordLocation

// addEventListener uncaughtException to catch Non-Fatal Exception in Javascript side
Ti.App.addEventListener('uncaughtException', function(exception) {
			
	//Ti.API.info("Countly - recordUncaughtException - Javascript Side");
			
	// TO DO - ADD AND TEST WHEN COUNTLY ADDS TO SDK
	// recordUnhandledException
	Countly.recordUnhandledException(exception);	
		
});

// START FUNCTION - Alloy.Globals.addCrashLog
// - add strings entries inside object to the crash log as needed - Eg: var crashLogData = {message: "Error Message",key1: "value1",};
Alloy.Globals.addCrashLog = function(crashLogData){
	
	//Ti.API.info("Alloy.Globals.addCrashLog");
	
	// addCrashLog
	Countly.recordCrashLog(crashLogData);
		
};
// END FUNCTION - Alloy.Globals.addCrashLog

// START FUNCTION - Alloy.Globals.logNonFatalCrash
// Manually Log Crash - add strings entries inside object - Eg: var exceptionData = {message: "Custom Error",key1: "value1",};
Alloy.Globals.logNonFatalCrash = function runNonFatalCrashTest(exceptionData){	
	
	//Ti.API.info("Alloy.Globals.addCrashLog");
	
	// recordHandledException
	Countly.recordHandledException(exceptionData);	
	
};
// END FUNCTION - Alloy.Globals.logNonFatalCrash

// START - Extra Functions to run crash test
function crashTest(){	
	
	Countly.crashTest();	
	
};
// END - Extra Functions to run crash test

// 				END CRASH FUNCTIONS 				//
///////////////////////////////////////////////////////			
 		
//					End Analytics and Crash Module							//
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
//							Start Push Section								//

// START IF - iOS ELSE Android
if (OS_IOS){
	
	// REQUIRE JPUSH MODULE
	var JPush = require('cn.jpush.ti');
	
	// enable debug
	//JPush.enableDebug();
			
	// START JPUSH - with callback getRegistrationID
	JPush.start({	appKey: 'b6551f92bb471181cf4c6276',
					channel: "Push channel",
					apsForProduction: true,
					advertisingIdentifier: false,
					success: JPushLoginSuccess,
				});
		
	// START IF - Check if the device is running iOS 8 or later
	if (parseInt(Ti.Platform.version,10) >= 8) {
			
		// START FUNCTION - registerForPush
		function registerForPush() {
			Ti.Network.registerForPushNotifications({
				success: deviceTokenSuccess,
				error: deviceTokenError,
				callback: receivePush
			});
		             
		    // Remove event listener once registered for push notifications
		    Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush); 
		};
		 // END FUNCTION - registerForPush
		 
		// ADD Eventlistener to Wait for user settings to be registered before registering for push notifications
		Ti.App.iOS.addEventListener('usernotificationsettings', registerForPush);
		
		// Register notification types to use
	   	Ti.App.iOS.registerUserNotificationSettings({
		    types: [
	            Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
	            Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND,
	            Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE
	        ]
	    });
    
	}else{	// ELSE - Check if the device is running iOS 8 or later

	    Ti.Network.registerForPushNotifications({
	        // Specifies which notifications to receive
	        types: [
	            Ti.Network.NOTIFICATION_TYPE_BADGE,
	            Ti.Network.NOTIFICATION_TYPE_ALERT,
	            Ti.Network.NOTIFICATION_TYPE_SOUND
	        ],
	        success: deviceTokenSuccess,
	        error: deviceTokenError,
	        callback: receivePush
	    });
	    
	};
	// END IF - Check if the device is running iOS 8 or later
	
	// START FUNCTION - callback to store JPushID
	function JPushLoginSuccess(JPushID){
		//Ti.API.info("JPushLoginSuccess - JPushID: " + JPushID);
		
		// run JPushID set data after 2 second delay
		setTimeout(function(){	

			// set JPushID to Ti.App.Properties	
			Ti.App.Properties.setString('JPushID',JPushID);
			
			// run addJPushGroup() after JPushLoginSuccess		
			addJPushGroup();
			
			// run Countly set UserData as JPushID has been set
			Alloy.Globals.AnalyticsUserData();
			
		}, 2000);
			
	};	
	// END FUNCTION - callback to store JPushID
	
	// Start Function - deviceTokenSuccess
	function deviceTokenSuccess(e) {
		
		//Ti.API.info("Register with deviceToken: " + e.deviceToken);
		JPush.registerDeviceToken(e.deviceToken);
		    
	};
	// End Function - deviceTokenSuccess
	
	// Start Function - deviceTokenError
	function deviceTokenError(e) {
		//Ti.API.info("Failed to Find Token" + e.error);
	};
	// End Function - deviceTokenError
	
	// START FUNCTION - receivePush for iOS
	function receivePush(e) {		
		
		// Ti.API.info Raw Payload
		Ti.API.info("Received Push:" + JSON.stringify(e));  
			
		// JSON.parse payload
		var pushNotification = e;
		
		// Set Values
		var pushData =  pushNotification.data;
		
		// send pushData to JPush to log Push received	
		JPush.pushReceived(pushData);
		
		// require module pushAlert in app/assets/lib/
		var pushAlertModule = require('pushNotifications/pushAlert');
		
		// process pushAlertModule.pushAlert
		pushAlertModule.pushAlert(pushNotification);
		 
	};
	// END FUNCTION - receivePush for iOS
	
// ELSE IF - Android only
}else if (OS_ANDROID){
	
	// REQUIRE JPUSH MOFULE
	var JPush = require('cn.jpush.ti');	
	
	// enable debug
	//JPush.enableDebug();
	
	// ADD EVENTLISTENTER AND FUNCTION TO MODULE
	JPush.addEventListener('JPushLoginSuccess',function(evt){
		
		//Ti.API.info("JPushLoginSuccess - JPushID: " + evt.registrationID);
		
		// run JPushID set data after 2 second delay
		setTimeout(function(){
			
			// set JPushID to Ti.App.Properties	
			Ti.App.Properties.setString('JPushID',evt.registrationID);
			
			// run addJPushGroup() after JPushLoginSuccess		
			addJPushGroup();
			
			// run Countly set UserData as JPushID has been set
			Alloy.Globals.AnalyticsUserData();
		
		}, 2000);
			
	});	
	
	// ADD EVENTLISTENTER AND FUNCTION TO MODULE
	JPush.addEventListener('pushCallBack',function(evt){
         
		// Set pushNotification as evt
		var pushNotification = evt; 
		
		// require module pushAlert in app/assets/lib/
		var pushAlertModule = require('pushNotifications/pushAlert');
		
		// process pushAlertModule.pushAlert
		pushAlertModule.pushAlert(pushNotification);	
		
    });


};
// END IF - Android Only

///////////////////////////////////////////////////////////////////////////////////////////
// 					START FUNCTION TO ADD TO JPUSH GROUP   							 	//

// START FUNCTION - addJPushGroup
function addJPushGroup(){
	
	// set new groups
	var tagsToSet = [];
	
	// get jpushReadGroup
	var jpushReadGroup = JSON.parse(Ti.App.Properties.getString('jpushReadGroup',false));
	
	// START IF - if jpushReadGroup then add to array
	if (jpushReadGroup){
		tagsToSet.push(jpushReadGroup);	
	};
	// END IF - if jpushReadGroup then add to array
	
	// get jpushHighUsageGroup
	var highAppUsage = JSON.parse(Ti.App.Properties.getString('jpushHighUsageGroup',false));	
	
	// START IF - if highAppUsage then add to array
	if (highAppUsage){
		tagsToSet.push("highUsage");	
	};
	// END IF - if highAppUsage then add to array
	
	// get appVersion
	var appVersionString = Ti.App.version;
	var appVersion = appVersionString.replace(/\./g, "_");
	
	tagsToSet.push(appVersion);
	
	//Ti.API.info("JPush.setTags: " + tagsToSet);
	
	// SET JPush tags
	JPush.setTags(tagsToSet);
	
};
// END FUNCTION - addJPushGroup

// 					END FUNCTION TO ADD TO JPUSH GROUP   	    						 //
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
// 					START IOS FUNCTION TO PROCESS LOCAL NOTIFICATION    				//

// START IF - iOS only
if (OS_IOS){
	
	// Fired when the application receives an incoming local notification when it's in the foreground
	Ti.App.iOS.addEventListener('notification', function (e){
			
			// Ti.API.info Raw Payload
			Ti.API.info("Received Local Push:" + JSON.stringify(e));  
			
			// set currentTime
			var currentTime = new Date();
			currentTime = currentTime.getTime();
			
			// set pushReceivedTime
			var pushReceivedTime = e.date.getTime();
				
			// calculate timeDiff
			var timeDiff = (currentTime - pushReceivedTime);
								
			// START IF - timeDiff betwee currentTime and pushReceivedTime is more than 1 second
			if(timeDiff > 1000){
				
				//Ti.API.info("Local Push Opened Manually - Handel");
				
				// JSON.parse payload
				var pushNotification = {data: e.userInfo,};
						
				// require module pushAlert in app/assets/lib/
				var pushAlertModule = require('pushNotifications/pushAlert');
				
				// process pushAlertModule.pushAlert
				pushAlertModule.pushAlert(pushNotification);
			
			}else{
				
				//Ti.API.info("Local Push Received In APP - Ignore");
								
			};
			// START IF - timeDiff betwee currentTime and pushReceivedTime is more than 1 second
						
	});

};
// END IF - iOS only

// 					START IOS FUNCTION TO PROCESS LOCAL NOTIFICATION    				//
///////////////////////////////////////////////////////////////////////////////////////////

//							End Push Section								//	
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////
//  							START downloadMenuFunction									//

// Add App eventlistener to listen for app:downloadMenuFunction
Ti.App.addEventListener("app:downloadFunction", downloadFunction);

// require downloadMenu Module
var downloadFunctionModule = require('downloadFunction');

// START FUNCTION - downloadMenuFunction
function downloadFunction(e){
	
	// START - set data for downloadMenuFunctionModule function
	var data = {chapterID: e.chapterID,										// set chapterID
				};
	// END - set data for downloadMenuFunctionModule function
	
	// run downloadMenuFuncion with data as above
	downloadFunctionModule(data);
	
};
// END FUNCTION - downloadMenuFunction

//  							END downloadMenuFunction									//
//////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
//						Start getSetBookData								//

// require getSetBookData
var getSetBookData = require('getSetBookData'); 
		
//						End getSetBookData									//
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
//	  				Start Other Small Functions needed					   //
// START Function versionCompare
function versionCompare (installed, required) {

        var a = installed.split('.');
        var b = required.split('.');

        for (var i = 0; i < a.length; ++i) {
            a[i] = Number(a[i]);
        }
        for (var i = 0; i < b.length; ++i) {
            b[i] = Number(b[i]);
        }
        if (a.length == 2) {
            a[2] = 0;
        }
        if (b.length == 2) {
            b[2] = 0;
        }

        if (a[0] > b[0]) return true;
        if (a[0] < b[0]) return false;

        if (a[1] > b[1]) return true;
        if (a[1] < b[1]) return false;

        if (a[2] > b[2]) return true;
        if (a[2] < b[2]) return false;

        return true;
    }
// END Function versionCompare

// START Function -  valueInArray
function valueInArray(arr,val) {
	for (var i=0; i<arr.length; i++){
		if (arr[i] === val) {                    
			return true;
		};
	};
	return false;
};
// END Function -  valueInArray

// START Function -  returnValueInArray
function returnValueInArray(arr,val) {
	for (var i=0; i<arr.length; i++){
		if (arr[i] === val) {                    
			return i;
		};
	};
	return false;
};
// END Function -  returnValueInArray

// START Function -  getDateTime
function getDateTime() {
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length == 1) {
        var month = '0'+month;
    }
    if(day.toString().length == 1) {
        var day = '0'+day;
    }   
    if(hour.toString().length == 1) {
        var hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
        var minute = '0'+minute;
    }
    if(second.toString().length == 1) {
        var second = '0'+second;
    }   
    var dateTime = year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;   
     return dateTime;
}
// END Function -  getDateTime

// START Function - Timer
function Timer(callback, delay) {
    var timerId, start, remaining = delay;
	
	this.clear = function() {
		clearTimeout(timerId);
		return;
	};
	
    this.pause = function() {
        clearTimeout(timerId);
        remaining -= new Date() - start;
    };

    this.resume = function() {
        start = new Date();
        clearTimeout(timerId);
        timerId = setTimeout(callback, remaining);
    };

    this.resume();
};
// END Function - Timer

// START Function padZero
function padZero(number,digits){	
	return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;	
};
// END Function padZero

// START Function - randomFrom 
function randomFrom(from,to)
{
    return Math.floor(Math.random()*(to-from+1)+from);
};
// End Function - randomFrom

// Extend the Date function to be able to get day of year
Date.prototype.getDOY = function() {
var onejan = new Date(this.getFullYear(),0,1);
return Math.ceil((this - onejan) / 86400000);
};
		
//	  				Start Other Functions needed						   //
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////
//							START Functions for navigationOpenClose							//

// START - Function to openCloseMenu
function openCloseMenu(){
	Ti.App.fireEvent('app:openCloseMenu');    
}
// END - Function to openCloseMenu 

// require lib navigationOpenClose/navigationOpenClose
var navigationOpenClose = require('navigationOpenClose/navigationOpenClose'); 

//						END Functions from navigationOpenClose								//
//////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
///								Start setLastOpenView Functions									///

// START Function - setLastOpenView to set Ti.App.Properties - lastOpenView
function setLastOpenView(lastView,lastOpenViewData){

	// create lastOpenViewParams string	
	var lastOpenViewParams = 	{	lastView: lastView, 
									lastOpenViewData: lastOpenViewData,
								};
	
	// Set Ti.App.Properties - lastOpenView
	Ti.App.Properties.setString('lastOpenView',JSON.stringify(lastOpenViewParams));
	
	// run navigationUpdateData
	navigationOpenClose.navigationUpdateData(lastOpenViewParams); 
	
};
// END Function - setLastOpenView to set Ti.App.Properties - lastOpenView

///								End setLastOpenView Functions							       	///
///////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////	
///								START CREATING  activeChapterRowIDArray					       	///

// set activeChapterRowIDArray
var activeChapterRowIDArray = [];

// get booksDataArray
var booksDataArray = databaseConnect({
		database: Alloy.Globals.databaseData.bibleText.databaseName,
		table: "books",
		method:"getAllTableValues",
});

// set currentChapterID
var currentChapterID = 1;
	
// START LOOP - populate activeChapterArray
for (var i=0; i<booksDataArray.length; i++ ) {
	
	//set bookEnabled
	var bookEnabled = booksDataArray[i].isActive;
	
	// START IF - if book enabled add chapterIDs to activeChapterRowIDArray
	if (bookEnabled){	
		
		// START LOOP - throught active chapters in book and add to activeChapterRowIDArray
		for (var c=0; c<booksDataArray[i].chapterCount; c++ ) {
					
			// push chapterID to activeChapterRowIDArray
			activeChapterRowIDArray.push(currentChapterID);
			
			// advance currentChapterID
			currentChapterID ++;
			
		};
		// END LOOP - throught active chapters in book and add to activeChapterRowIDArray
		
	}else{
		
		// advance currentChapterID
		currentChapterID = (+currentChapterID+booksDataArray[i].chapterCount);
		
	};
	// END IF - if book enabled add chapterIDs to activeChapterRowIDArray
	
};
// END LOOP - populate activeChapterRowIDArray
 
///								END CREATING  activeChapterRowIDArray					       	/// 
///////////////////////////////////////////////////////////////////////////////////////////////////	

////////////////////////////////////////////////////////////////////////////////////////////////
//							Start Function to load any chapter 								 //

// Add App Wide listener for openBook to be able to run loadtext from WebViews
Ti.App.addEventListener('app:openBook',function(textData){
	
	// run loadText		
	loadText(textData);
	
});

// START Function - loadtext 
function loadText(textData) {
	
	// set vars sent defaults
	var book = padZero(textData.book,2) || "01";	// padZero so that we can accept 1 or 01 as Genesis
	var chapter = textData.chapter || "1";
	var highlightStart = textData.highlightStart || false;
	var highlightEnd = textData.highlightEnd || false;
	var scroll = textData.scroll || false;
		
	var chapterData = {	book:book,
						chapter:chapter,
						highlightStart:highlightStart,
						highlightEnd:highlightEnd,
						scroll:scroll,
	};
	
	// set openTextArgs to be passed to TextView window when it is opened
	var openTextViewArgs = {
		chapterData:chapterData,
	};
	
	// open topicView Window with Args
    var openData = {openCloseView: "TextView",
					openCloseViewData: openTextViewArgs,					
					};
					
	// run openNavigationView
	navigationOpenClose.openNavigationView(openData);

};
// END Function - loadtext 

//							Start Function to load any chapter 								 //
//////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////
// 							Start loadCategory Function to load any topicCategory				//

// START Function - loadCategory
function loadCategory(topicCategoryData) {	
	
	// set openCategoryArgs to be passed to topicCategory window
	var openCategoryArgs = {
		topicCategoryData:topicCategoryData,	
	};
	
	// set openData and run openNavigationView
	var openData = {	openCloseView: "topicCategory",
						openCloseViewData: openCategoryArgs,
				};
				
	// run openNavigationView
	navigationOpenClose.openNavigationView(openData);
		
};
// End Function - loadCategory

// 							END loadCategory Function to load any topicCategory       		 //
///////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////
// 							Start loadQuestionCategory Function to load any topicCategory				//

// START Function - loadQuestionCategory
function loadQuestionCategory(questionCategoryData) {	
	
	// set openCategoryArgs to be passed to topicCategory window
	var openCategoryArgs = {
		questionCategoryData:questionCategoryData,	
	};
	
	// set openData and run openNavigationView
	var openData = {	openCloseView: "questionCategory",
						openCloseViewData: openCategoryArgs,
				};
				
	// run openNavigationView
	navigationOpenClose.openNavigationView(openData);
		
};
// End Function - loadQuestionCategory

// 							END loadQuestionCategory Function to load any topicCategory       		 //
///////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////
//						   Start Function to load any topic Article 							//

// START Function - loadTopic
function loadTopic(topicData) {
	
	// set openTopicViewArgs to pass to Window when Opened
	var openTopicViewArgs = {
		topicData: topicData,
	};
	
	// open topicView Window with Args
    var openData = {openCloseView: "TopicView",
					openCloseViewData: openTopicViewArgs,
				};
	
	// run openNavigationView
	navigationOpenClose.openNavigationView(openData);
	
};
// END Function -  - loadTopic
						
//						   End Function to load any topic Aricle 							//
//////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////
//						   Start Function to load questionList 							//

// START Function - loadQuestionList
function loadQuestionList(topicData) {
	
	// set openTopicViewArgs to pass to Window when Opened
	var openTopicViewArgs = {
		topicData: topicData,
	};
	
	// open topicView Window with Args
    var openData = {openCloseView: "questionList",
					openCloseViewData: openTopicViewArgs,
				};
	
	// run openNavigationView
	navigationOpenClose.openNavigationView(openData);
	
};
// END Function - loadQuestionList
						
//						   End Function to load questionList							//
//////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////
//						   Start Function to load question article 							//

// START Function - loadQuestion
function loadQuestion(questionData) {
	
	// set openQuestionViewArgs to pass to Window when Opened
	var openQuestionViewArgs = {
		questionData: questionData,
	};
	
	// open questionView Window with Args
    var openData = {openCloseView: "questionView",
					openCloseViewData: openQuestionViewArgs,
				};
	
	// run openNavigationView
	navigationOpenClose.openNavigationView(openData);
	
};
// END Function - loadQuestion
						
//						   End Function to load question article							//
//////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////
// 					START FUNCTION TO GET ORIENTATION				//

function isOrientationPortrait(){
	
	// START IF - Ti.Gesture.portrait true else use screen size to check
	if (Ti.Gesture.portrait){
		return true;
	}else if (Ti.Gesture.landscape){
		return false;
	}else{	
		
		var pWidth = Ti.Platform.displayCaps.platformWidth;
		var pHeight = Ti.Platform.displayCaps.platformHeight;
			
		if (pHeight > pWidth){
			return true;
		}else{
			return false;
		};		
		
	};
	// END IF - Ti.Gesture.portrait true else use screen size to check
	
};


// 					END FUNCTION TO GET ORIENTATION					//
//////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////
// 	START ADD orientationchange TO GET fire event on ORIENTATIONCHANGE	//

Ti.Gesture.addEventListener('orientationchange',function(e) {

	// set isPortrait
	var isPortrait;
	
	if (e.orientation == Titanium.UI.PORTRAIT || e.orientation == Titanium.UI.UPSIDE_PORTRAIT) {
   		
   		if(Alloy.isHandheld && e.orientation == Titanium.UI.UPSIDE_PORTRAIT){
   			// return out of function on Alloy.isHandheld and Titanium.UI.UPSIDE_PORTRAIT
   			return;
   		}else{
   			isPortrait = true;
   		};

    	Ti.App.fireEvent('orient', {portrait:isPortrait});

  	} else if (e.orientation == Titanium.UI.LANDSCAPE_LEFT || e.orientation == Titanium.UI.LANDSCAPE_RIGHT) {
    	
    	isPortrait = false;
 	 	Ti.App.fireEvent('orient', {portrait:isPortrait});

 	};
       
});

// 	END ADD orientationchange TO GET fire event on ORIENTATIONCHANGE	//
//////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
// 						START SETTING SCREEN WIDTHS 									//

var pWidth = Ti.Platform.displayCaps.platformWidth;
var pHeight = Ti.Platform.displayCaps.platformHeight;
	
Alloy.Globals.portraitWidth = (pWidth > pHeight) ? pHeight : pWidth;
Alloy.Globals.landscapeWidth = (pWidth > pHeight) ? pWidth : pHeight;

// 							END SETTING SCREEN WIDTHS 									//
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
// 					START APP SESSION START FUNCTIONS			 						//

// require appPauseResumeModule
var appPauseResume = require('appPauseResume/appPauseResume');

// START - RUN appPauseResume and add resume and pause callbacks
appPauseResume({pause: function(){

                    Ti.API.info("appPauseResume - pause");

                    // START - IF ANDROID - run countly stop
                    if(OS_ANDROID){

                        // stop countly on app pause
                        Countly.stop();
                    };
                    // END - IF ANDROID - run countly stop

                },
                resume: function(){

                    Ti.API.info("appPauseResume - resume");

                    // START - IF ANDROID - run countly stop
                    if(OS_ANDROID){

                        // resume countly on app pause
                        Countly.resume();
                    };
                    // END - IF ANDROID - run countly stop

                    // run sessionStart
					sessionStart();                 

                },
});
// END - RUN appPauseResume and add resume and pause callbacks

// START FUNCTION - sessionStart
function sessionStart(){
	
	Ti.API.info("Running sessionStart");
	
	// set Alloy.Globals.sessionFirstEventSent false
	Alloy.Globals.sessionFirstEventSent = false;

	// run AnalyticsEvent sessionStarted
	var eventData = {	eventType: "sessionStarted",
						eventName: "sessionStarted",
					};
						
	Alloy.Globals.AnalyticsEvent(eventData);
	
	// FIRE EVENT - restart dailyScroller animation
	Ti.App.fireEvent('app:dailyScrollerAnimate');
	
	// START - scheduleNotifications
	setTimeout(function(){	
		
		// require scheduleNotification module
		var scheduleNotifications = require('scheduleNotifications/scheduleNotifications');	
		// run scheduleLocalNotificaiton with subscribeData	
		scheduleNotifications.scheduleLocalNotification();	
		
	}, 8000);	
	// END - scheduleNotifications
																
	// START IF - Alloy.Globals.enableDateDelayedFunctions run GPS on startup
	if (Alloy.Globals.enableDateDelayedFunctions){
		
		// START - scheduleNotifications
		setTimeout(function(){	
			
			// require locationData module
			var locationData = require('locationData/locationData');
					
			// run locationData.getCurrentLocation
			locationData.getCurrentLocation({	locationCaller: "sessionStarted",});
		
		}, 2000);	
		// END - scheduleNotifications
		
	};
	// END IF - Alloy.Globals.enableDateDelayedFunctions run GPS on startup
					
};
// END FUNCTION - sessionStart

// 					END APP SESSION START FUNCTIONS			 							//
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
// 		START FUNCTION - CHECK IF APP HAS AN UPDATE AVAILABLE AND RUN FUNCTIONS   		 //

function runUpdateCheck(autoManual){
	
	//Ti.API.info("runUpdateCheck Function");
	
	// STAR IF - set autoManualCheck
	if(autoManual == "auto"){
		var autoManualCheck =  "auto";
	}else{
		var autoManualCheck =  "manual";
	};
	// END IF - set autoManualCheck
	
	// require module updateCheck in app/assets/lib/
	var updateCheck = require('updateApp/updateCheck');
	
	// START RUN - updateCheck
	updateCheck(autoManualCheck);	
	
};
// END Function -  runUpdateCheck


// 			END FUNCTION - CHECK IF APP HAS AN UPDATE AVAILABLE AND RUN FUNCTIONS   	 //
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
// 					START FUNCTION TO LOG APP USAGE AMOUNT    							 //

function logAppUsageAmount(){
	
	// get appUsageAmount from Ti.App.Properties
	var appUsageAmount = Ti.App.Properties.getString('appUsageAmount',0);	// string with amount of app usages
	
	// START IF - Check amount and increase or show alert
	if (appUsageAmount == Alloy.Globals.highUsageFormAmount){
		
		//Ti.API.info("showAppHighUsage - Run Functions");
		
		// require module customForm in app/assets/lib/
		var showForms = require('formData/showForms');
		
		// run showAppHighUsageForm function
		showForms.showAppHighUsageForm();
		
		// increase appUsageAmount
		var newAppUsageAmount = +appUsageAmount + 1;	
		Ti.App.Properties.setString('appUsageAmount',newAppUsageAmount);
		
	}else if (appUsageAmount == Alloy.Globals.highUsageReviewAmount){
		
		// START IF - OS_IOS show requestReview
		if(OS_IOS){
			
			// require reviewDialog module
			var Review = require('reviewDialog/reviewDialog');
		
			// START IF - if Review.isSupported then show Review.requestReview
			if (Review.isSupported()) {
		  		Review.requestReview();
			};
			// END IF - if Review.isSupported then show Review.requestReview
		
		};
		// END IF - OS_IOS show requestReview
		
		// increase appUsageAmount
		var newAppUsageAmount = +appUsageAmount + 1;	
		Ti.App.Properties.setString('appUsageAmount',newAppUsageAmount);
			
	}else{
		
		// increase appUsageAmount
		var newAppUsageAmount = +appUsageAmount + 1;	
		Ti.App.Properties.setString('appUsageAmount',newAppUsageAmount);
		
	}
	// END IF - Check amount and increase or show alert
	 
};

// 					END FUNCTION TO LOG APP USAGE AMOUNT    							 //
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
// 						START FUNCTION TO LOG CHAPTER READ    							 //

function logChapterRead(chapterRecord){ 
	
	//Ti.API.info("logChapterRead Function");
	
	// set currentActiveChapterID as ID of chapter in chapter record
	var currentActiveChapterID = chapterRecord.rowid;
	
	// !!  FIX FOR WHEN NOT ALL BOOKS ARE ENABLED !! //
	// var chapterID = currentActiveChapterID;
	// set chapterID as ID of chapter in ALL Chapters (1189)
	var chapterID = activeChapterRowIDArray[currentActiveChapterID-1];
	
	// set currentChapter read
	getSetBookData({	getSet:"setChapterRead",
						rowNum: chapterID,
			});
	
	// get bookRecord
	var bookRecord = getSetBookData({	getSet: "getBookRecord",
										bookID: chapterRecord.bookID,
						});

	// set vars
	var bookID = bookRecord.bookID;
	var bookChapterAmount = bookRecord.chapterCount;
	var bookChapterAmountHalf = Math.floor(bookChapterAmount/2);
	var bookNameLatin = bookRecord.latinShortName;
	var chapterNumber = chapterRecord.chapterNumber;
	
	
	// get bookDataRecord from database
	var bookDataRecord = getSetBookData({	getSet: "getBookData",
											bookID: chapterRecord.bookID,
						});
	
	// set form vars
	var basicFormEnabled = bookDataRecord.basicForm;
	var halfFormEnabled = bookDataRecord.halfForm;
	var completeFormEnabled = bookDataRecord.completeForm;
	
	// set firstBookChapterRecord
	var firstBookChapterRecord = getSetBookData({	getSet: "getChapterRecord",
													bookID: chapterRecord.bookID,
													chapterNum: 1,
	});
	
	// set firstBookActiveChapterID
	var firstBookActiveChapterID = firstBookChapterRecord.rowid;
	
	// !!  FIX FOR WHEN NOT ALL BOOKS ARE ENABLED !! //
	// var firstBookChapterID = firstBookActiveChapterID;
	// set chapterID as ID of chapter in ALL Chapters (1189)
	var firstBookChapterID = activeChapterRowIDArray[firstBookActiveChapterID-1];
	
	// set bookChaptersRead as null
	var bookChaptersRead = 0;
	
	// START LOOP - through chapters to count chapters read
	for (var b=0; b<bookChapterAmount; b++){
			
		// set checkChapterNumber
		var checkChapterNumber = (+firstBookChapterID+b);
		
		// chapterRead
		var chapterRead = getSetBookData({  getSet: "getChapterRead",
											rowNum: checkChapterNumber,
		});  
		
		// START IF - getChapterRead is true - add to bookChaptersRead
		if (chapterRead == 'true'){
			
			// advance bookChaptersRead
			bookChaptersRead++;
			
		};
		// END IF - getChapterRead is true - add to bookChaptersRead
		
	};
	// END LOOP - through chapters to count chapters read
	
	// START IF - bookChaptersRead == bookChapterAmount
	if (bookChaptersRead == bookChapterAmount && completeFormEnabled){
				
		// require module showForms in app/assets/lib/
		var showForms = require('formData/showForms');
		showForms.booksReadComplete(bookRecord);
				
	}else if (bookChaptersRead == bookChapterAmountHalf && halfFormEnabled){
				
		// require module showForms in app/assets/lib/
		var showForms = require('formData/showForms');
		showForms.booksReadHalf(bookRecord);
				
	}else if (bookChaptersRead == 5 && basicFormEnabled){
				
		// require module showForms in app/assets/lib/
		var showForms = require('formData/showForms');
		showForms.booksReadBasic(bookRecord);
				
	};
	// START IF - bookChaptersRead == bookChapterAmount
			
	//Ti.API.info("bookChaptersRead: " + bookChaptersRead);
	
	//Ti.API.info("Capitalized version: " + capitalizeBookName(bookNameLatin));
	
	var eventData = {	eventType: "chapterRead",
						eventName: "Chapter Read",
						eventVars: {"Chapter": capitalizeBookName(bookNameLatin) + ' ' + chapterNumber,
									"Book": capitalizeBookName(bookNameLatin)},
					};
	Alloy.Globals.AnalyticsEvent(eventData);
	
};

// 						END FUNCTION TO LOG CHAPTER READ    							 //
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
// 						START FUNCTIONS TO CAPITALIZE BOOK NAME  						 //
function capitalizeBookName(bookNameString) {
	var capitalizedName = '';
	var loc = bookNameString.indexOf('-');
	  
	// START IF book name isn't hyphenated capitalize normally else capitalize both parts of name
	if (loc == -1) {
		capitalizedName = capitalizeFirstLetter(bookNameString);
	} else {
		stringParts = bookNameString.split("-");
		capitalizedName = capitalizeFirstLetter(stringParts[0]) + '-' + capitalizeFirstLetter(stringParts[1]);
	}
	// END IF book name isn't hyphenated capitalize normally else capitalize both parts of name
		
	return capitalizedName;
}

function capitalizeFirstLetter(stringToCapitalize) {
  	return stringToCapitalize.charAt(0).toUpperCase() + stringToCapitalize.substr(1);
}
// 						END FUNCTIONS TO CAPITALIZE BOOK NAME							 //
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
// 						START FUNCTION TO LOG CHAPTER LISTENED TO						 //

function logChapterListened(chapterID,audioDownloaded){
	//Ti.API.info("logChapterListened: " + chapterID + " audioDownloaded: " + audioDownloaded);
	
	// !!  FIX FOR WHEN NOT ALL BOOKS ARE ENABLED !! //
	// var chapterRowID = chapterID; // uncomment and remove two below if all book are enabled
	var currentActiveChapterID = returnValueInArray(activeChapterRowIDArray,chapterID);
	var chapterRowID = (+currentActiveChapterID+1);

	// prepare chapterRecord
	var chapterRecord = getSetBookData({	getSet: 'getChapterRecordByRow',
											rowNum: chapterRowID,
	});	
	
	// get bookRecord
	var bookRecord = getSetBookData({	getSet: "getBookRecord",
										bookID: chapterRecord.bookID,
						});
	
	// set vars				
	var bookNameLatin = bookRecord.latinShortName;
	var chapterNumber = chapterRecord.chapterNumber;
	
	// START IF - set streamingDownloaded
	if (audioDownloaded == true){
		var streamingDownloaded = "Downloaded";
	}else{
		var streamingDownloaded = "Streaming";
	};
	// END IF - set streamingDownloaded
	
	var eventData = {	eventType: "chapterListened",
						eventName: "Chapter Listened To",
						eventVars: {"Streaming/Downloaded": streamingDownloaded,
									"Chapter": capitalizeBookName(bookNameLatin) + ' ' + chapterNumber,
									"Book": capitalizeBookName(bookNameLatin)},
					};
	Alloy.Globals.AnalyticsEvent(eventData);
	
};

// 						END FUNCTION TO LOG CHAPTER LISTENED TO							 //
///////////////////////////////////////////////////////////////////////////////////////////
	
///////////////////////////////////////////////////////////////////////////////////////////
// 						START FUNCTION TO LOG TOPIC READ    							 //

function logTopicRead(topicID){
	
	//Ti.API.info("logTopicRead - rowID: " + topicID);
	
	// set topicDataArray as topic data in database
	var topicDataArray = databaseConnect({
		database: Alloy.Globals.databaseData.topicData.databaseName,
		table: "topicTopics",
		method:"getAllTableValuesByFieldValue",
		field: "rowid",
		value: topicID, 
	});
		
	// set newTopicData as first in array - as array only has one value as only one topic
	var topicData = topicDataArray[0];
	
	// set topicCategoryDataArray as topic data in database
	var topicCategoryDataArray = databaseConnect({
		database: Alloy.Globals.databaseData.topicData.databaseName,
		table: "topicCategories",
		method:"getAllTableValuesByFieldValue",
		field: "id",
		value: topicData.categoryID, 
	});
	
	// set newTopicData as first in array - as array only has one value as only one topic
	var topicCategoryData = topicCategoryDataArray[0];
	
	var eventData = {	eventType: "topicRead",
						eventName: "Read Topic", 
						eventVars: {"Category": topicCategoryData.shortTitleLatin,
									"Topic": topicData.shortTitleLatin},
					};
	Alloy.Globals.AnalyticsEvent(eventData);
	
};
// 						END FUNCTION TO LOG TOPIC READ    								 //
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
// 						START FUNCTION TO LOG QUESTION READ    							 //

function logQuestionRead(questionID){
	
	//Ti.API.info("logQuestionRead - question rowid: " + questionID);
	
	// set questionDataArray as question data in database
	var questionDataArray = databaseConnect({
			database: Alloy.Globals.databaseData.questionData.databaseName,
			table: "questionQuestions",
			method:"getAllTableValuesByFieldValue",
			field: "rowid",
			value: questionID, 
	});
				
	// set questionData as first in array - as array only has one value as only one question
	var questionData = questionDataArray[0];
	
	// set topicDataArray as topic data in database
	var topicDataArray = databaseConnect({
		database: Alloy.Globals.databaseData.questionData.databaseName,
		table: "questionTopics",
		method:"getAllTableValuesByFieldValue",
		field: "id",
		value: questionData.topicID, 
	});
		
	// set newTopicData as first in array - as array only has one value as only one topic
	var topicData = topicDataArray[0];
	
	// set topicCategoryDataArray as topic data in database
	var topicCategoryDataArray = databaseConnect({
		database: Alloy.Globals.databaseData.questionData.databaseName,
		table: "questionCategories",
		method:"getAllTableValuesByFieldValue",
		field: "id",
		value: topicData.categoryID, 
	});
	
	// set newTopicData as first in array - as array only has one value as only one topic
	var topicCategoryData = topicCategoryDataArray[0];
	
	var eventData = {	eventType: "questionRead",
						eventName: "Read Question",
						eventVars: {"Question": questionData.id.toString(),
									"Category": topicCategoryData.shortTitleLatin,
									"Topic": topicData.shortTitleLatin},
					};
	Alloy.Globals.AnalyticsEvent(eventData);
	
};
// 						END FUNCTION TO LOG QUESTION READ    							 //
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
// 						START FUNCTION TO LOG QOD CLICKED    							 //

function logQODClicked(qodData){
	
	//Ti.API.info("logQODClicked - question: " + qodData.id);
	
	var eventData = {	eventType: "dailyContentScrollerPressed",
						eventName: "Daily Content Scroller Pressed",
						eventVars: {"Type": "QoD",
									"Content": qodData.id.toString(),},
					};
	Alloy.Globals.AnalyticsEvent(eventData);
	
};
// 						END FUNCTION TO LOG QOD CLICKED    							 //
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
// 						START FUNCTION TO LOG VOD CLICKED    							 //

function logVODClicked(vodData){
	
	//Ti.API.info("logVODClicked");
	
	// get bookDataRecord from database
	var bookData = getSetBookData({	getSet: "getBookRecord",
											bookID: padZero(vodData.bookID,2),
										});
	
	// generate reference for VOD
	var vodRef = capitalizeBookName(bookData.latinShortName) + " " + vodData.startChapter + ":" + vodData.startVerse;
	if (vodData.startVerse != vodData.endVerse) {
		vodRef += "-" + vodData.endVerse;
	}
	
	// send analytics event data
	var eventData = {	eventType: "dailyContentScrollerPressed",
						eventName: "Daily Content Scroller Pressed",
						eventVars: {"Type": "VoD",
									"Content": vodRef},
					};
	Alloy.Globals.AnalyticsEvent(eventData);
	
};
// 						END FUNCTION TO LOG VOD CLICKED    							 //
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
// 						START FUNCTION TO LOG MENU BUTTON PRESSED  						 //

function logMenuButtonPressed(button){
	
	//Ti.API.info("logMenuButtonPressed - button: " + button);
	
	var eventData = {	eventType: "menuButtonPressed",
						eventName: "Menu Button Pressed",
						eventVars: {"Button": button,},
					};
	Alloy.Globals.AnalyticsEvent(eventData);
	
};
// 						END FUNCTION TO LOG MENU BUTTON PRESSED							 //
///////////////////////////////////////////////////////////////////////////////////////////