function shareIntent (){
	
	Ti.API.info('shareIntent start');
	
	// START - use checkDownloadURL.requestStoragePermissions to ask for storage permissions and run functions on success or failed                         
	var checkDownloadURL = require('checkDownloadURL/checkDownloadURL');
	checkDownloadURL.requestStoragePermissions({ success: function(){
																		
																		Ti.API.info('requestStoragePermissions success');
																		
																		// set intent
																		var intent = Ti.Android.createIntent({
																			action: Ti.Android.ACTION_SEND,
																			type: "*/*",
																		});	
																		
																		// add Title
																		var subjectString = L("shareAppSubject");
																		intent.putExtra(Ti.Android.EXTRA_SUBJECT, subjectString);	    
																		
																		// set appPromoURL
																		var appPromoURL = databaseConnect({	
																								database: Alloy.Globals.databaseData.urlData.databaseName,
																								table: "urlData",
																								method:"getFieldValue",
																								field: "urlList", 
																								lookupField: "urlName",
																								value: "app_promo",
																		});
																		
																		// add Link
																		intent.putExtra(Ti.Android.EXTRA_TEXT, appPromoURL);
																			    
																		// set image and move to local storage to be able to use in intent
																		var appFilePath = Ti.Filesystem.resourcesDirectory + Alloy.Globals.ShareImageFullPath;
																		var file = Ti.Filesystem.getFile(appFilePath);
																		
																		// check for folder and create
																		var imageFolder = Titanium.Filesystem.getFile(Alloy.Globals.storageDevice, 'Hayatnuri');
																		if( !imageFolder.exists() ){
																			imageFolder.createDirectory();
																		};
																		
																		// write file
																		var filePath = Titanium.Filesystem.getFile(Alloy.Globals.storageDevice + "/Hayatnuri", Alloy.Globals.ShareImage);  	
																		filePath.write(file);	
																		    	
																		// add Image to Intent    
																		intent.putExtraUri(Ti.Android.EXTRA_STREAM, filePath.nativePath);
																			    
																		// createIntentChooser
																		var shareChooser = Ti.Android.createIntentChooser(intent, L("share"));
																		
																		// startActivity
																		Ti.Android.currentActivity.startActivity(shareChooser);
																		
																	},
																	failed: function(){		
																		
																		Ti.API.info('requestStoragePermissions failed show message');
																		
																		// fire app:showAlertMessage with message            
																		Ti.App.fireEvent("app:showAlertMessage",{
																        	message: L("storagePermissionsFailed"),
																        });
				
																	},
	});
	// END - use checkDownloadURL.requestStoragePermissions to ask for storage permissions and run functions on success or failed
	
};		