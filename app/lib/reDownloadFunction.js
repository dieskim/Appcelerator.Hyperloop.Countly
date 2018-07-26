// TO CHECK BEFORE WE SET AUDIOVERSION FOR AUDIO FILES - JW - do we think we will need this for when you add psalms audio? This enables the app to check if there is a newer(fixed?) version of the audio and then it downloads that - if we think we will need this we will need to make sure all of the below works

// Require checkDownloadURL module
var checkDownloadURL = require('checkDownloadURL/checkDownloadURL');
		
// START Function - downloadFunction
function reDownloadMenuFunction(data){
		Ti.API.info("RE Download Started");
		
		// set chapterID as data.chapterID
		var chapterID = data.chapterID;
		
		// set createAlert Dialog params
		var confirm = L("reDownloadNotificationConfirm");
		var cancel =  L("reDownloadNotificationCancel");
		var message = L("reDownloadNotificationMessage");
		var title = L("reDownloadNotificationTitle");
		
		// require module customAlert in app/assets/lib/
		var customAlert = require('customAlert/customAlert');
		
		//createAlert AlertDialog with params		
		var notificationData = {
			cancelIndex: 0,
			buttonNames: [cancel,confirm],
			message: message,
			title: title,
			click: function(e){
				//START IF - Cancel Clicked close ELSE
		    	if (e.index == 1){    			      		
		      		Ti.API.info('The Confirm Button was clicked');
		   		 	
		   		 	// START RUN FUNCTION - reDownloadChapter
		   		 	reDownloadChapter({	chapterID:chapterID,
		   		 						success: function(){
		   		 							
		   		 							// START IF - has data.error 
											if (data.success){	                	
												// set data.cancel callback
											    data.success();
											};
											// END IF - has data.error
		   		 							
		   		 						},
		   		 	});   		 	
					// START RUN FUNCTION - reDownloadChapter
					
				    
				}else{
					Ti.API.info('The cancel button was clicked');
					
					// START IF - has data.error 
					if (data.cancel){	                	
						// set data.cancel callback
					    data.cancel();
					};
					// END IF - has data.error
							
				    
				};
				//END IF - Cancel Clicked close ELSE	
			},
		};
		
		// show AlertDialog notification
		customAlert.show(notificationData);
				
};
// END Function - downloadFunction

// START FUNCTION - reDownloadChapter
function reDownloadChapter(data){
				
				//set chapterID
				var chapterID = data.chapterID;
				
				// require downloadMenu Module
				var deleteAudioModuleFunction = require('deleteAudioFunction');
				
				// set deleteData
				var deleteData = {	chapterID: chapterID,
									deleteSuccess: function deleteSuccess(){						// on delete success
										Ti.API.info('Audio DELETE success');
										
										// set chapterID
										var chapterID = deleteData.chapterID;
										
										// set chapter as NOT installed in Database
				                        getSetBookData({	getSet: "setAudioNotInstalled",
															rowNum: chapterID,
										});
						   				
						   				// fireEvent to reset singleProgressBar
										Ti.App.fireEvent("app:updateSingleProgressBar",{method: "reset",chapterID: chapterID,});
										
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
										
										// set bookID, bookName and chapterNumber
						                var bookID = chapterRecord.bookID;
						                var bookName = bookRecord.shortName;
						                var chapterNumber = chapterRecord.chapterNumber;
						                var chapterAmount = bookRecord.chapterCount;
										
										// set showNotification var
										var showNotification = false;
										
										// set urlArrayString 
										var urlArrayString = databaseConnect({	
															database: Alloy.Globals.databaseData.urlData.databaseName,
															table: "urlData",
															method:"getFieldValue",
															field: "urlList", 
															lookupField: "urlName",
															value: "audio",
										});
										
										//Ti.API.info("urlArrayString");
										//Ti.API.info(urlArrayString);
							   		 	
							   		 	// set audioFileName
										var audioFileName = Alloy.Globals.audioFilePrefix + chapterRecord.bookID + '_' + padZero(chapterRecord.chapterNumber, 2) + '.mp3';
							   
							   		 	// START - use checkDownloadURL and check for working URL		 		   		 	
							   		 	checkDownloadURL.checkDownloadURL({
											method: 'GET',
											audioFileName: audioFileName,
										    urlArrayString: urlArrayString,
										    success: function (success) {																// on Success
										        Ti.API.info("Download Complete");
												
												// fireEvent to update singleProgressBar
												Ti.App.fireEvent("app:updateSingleProgressBar",{method: "success", chapterID:chapterDownloadID, bookID:bookID, chapterNumber:chapterNumber, });
												
												// set chapter as installed in Database
						                        getSetBookData({	getSet: "setAudioInstalled",
																	rowNum: chapterID,
												});
						                        
						                        // set chapter as installed in Database
						                        getSetBookData({	getSet: "setAudioVersionInstalled",
																	rowNum: chapterID,
												});
											    
												// START IF - Book Psalms different chapter name
												if (bookID == 19){
													var convertedChapterName = L("psalms_title");
												}else{
													var convertedChapterName = L("chapter_title");	
												}		
												// END IF - Book Psalms different chapter name
												
												// START IF ANDROID > 4.0 ELSE
						                        var versionRequired = "4.0";
						                        if (OS_IOS || OS_ANDROID && versionCompare(Ti.Platform.version,versionRequired) == true) {
						                        	 var chapterNumberValue = chapterNumber;
						                        }else{
						                        	var chapterNumberValue = JSON.stringify(+chapterNumber).split("").reverse().join("");
						                        };	
						                        // END IF ANDROID > 4.0 ELSE
                        						
                        						// set converted chapterName
												var convertedBookName = Alloy.Globals.textConverter(bookName); 
						
												// set message String and convert
												var message = convertedBookName + " \u200F" + chapterNumberValue + convertedChapterName + " " + L("chapterReDownloadComplete");
												
												// fire app:showAlertMessage with message		
												Ti.App.fireEvent("app:showAlertMessage",{
								            		message: convertedMessage,          	
								            	});	                   	
														
								            	 if (OS_ANDROID){
                                
						                            // set converted bookName
						                            var convertedBookName = Alloy.Globals.textConverter(bookName); 
						                                
						                            // START IF - Add Catagory
						                            if (bookID == 19){
						                                    var categoryText = L("psalms");
						                                    var convertedChapterName = L("psalms_title");
						                                    var categoryTextLatin = L("psalmsLatin", "false");
						                                    var convertedChapterNameLatin = L("psalms_title_Latin", "false");
						                                    
						                            }else if (bookID < 40){
						                                    var categoryText = L("ot");
						                                    var convertedChapterName = L("chapter_title");
						                                    var categoryTextLatin = L("otLatin", "false");
						                                    var convertedChapterNameLatin = L("chapter_title_Latin", "false");
						                            }else{
						                                    var categoryText = L("nt");
						                                    var convertedChapterName = L("chapter_title");
						                                    var categoryTextLatin = L("ntLatin", "false");
						                                    var convertedChapterNameLatin = L("chapter_title_Latin", "false");
						                            };
						                            // END IF - Add Catagory
						                            
						                            // START IF ANDROID > 4.0 ELSE
						                            var versionRequired = "4.0";
						                                
						                            if (OS_ANDROID && versionCompare(Ti.Platform.version,versionRequired) == true) {
						                                var notificationMessage = categoryText + "، " + convertedBookName + "\u200F " + chapterNumber + convertedChapterName + " " + L("chapterReDownloadComplete");                          
						                             }else{
						                                // set bookLatin
						                                var bookLatin = bookRecord.latinShortName;
						                                var notificationMessage = categoryTextLatin + ", " + bookLatin + " " + chapterNumber + convertedChapterNameLatin + " " + L("chapterDownloadCompleteLatin", "false");
						                             };    
						                            // END IF ANDROID > 4.0 ELSE
						                                
						                            showAndroidNotification("update", notificationMessage);
						                                                         
						                        };
												
												// START IF - has data.error send callback 
												if (data.success){	                	
													// set data.cancel callback
													data.success();
												};
												// END IF - has data.error send callback 
																
								            					
										    },
										    datastream: function(datastream) {															// on Datastream
										    	Ti.API.info('Download - Progress: ' + datastream.progress);
										    	
										    	// fireEvent to update singleProgressBar
												Ti.App.fireEvent("app:updateSingleProgressBar",{method: "update", chapterID:chapterID, bookID:bookID, chapterNumber:chapterNumber, progress:datastream.progress});
										    	
										    	if (OS_ANDROID){
						                            if (showNotification == false){     
						                                    
						                                // set converted bookName
						                                var convertedBookName = Alloy.Globals.textConverter(bookName);
						                                    
						                                // START IF - Add Catagory
						                                if (bookID == 19){
						                                        var categoryText = L("psalms");
						                                        var convertedChapterName = L("psalms_title");
						                                        var categoryTextLatin = L("psalmsLatin", "false");
						                                        var convertedChapterNameLatin = L("psalms_title_Latin", "false");
						                                        
						                                }else if (bookID < 40){
						                                        var categoryText = L("ot");
						                                        var convertedChapterName = L("chapter_title");
						                                        var categoryTextLatin = L("otLatin", "false");
						                                        var convertedChapterNameLatin = L("chapter_title_Latin", "false");
						                                }else{
						                                        var categoryText = L("nt");
						                                        var convertedChapterName = L("chapter_title");
						                                        var categoryTextLatin = L("ntLatin", "false");
						                                        var convertedChapterNameLatin = L("chapter_title_Latin", "false");
						                                };
						                                // END IF - Add Catagory
						                                
						                                // START IF ANDROID > 4.0 ELSE
						                                var versionRequired = "4.0";
						                                    
						                                if (OS_ANDROID && versionCompare(Ti.Platform.version,versionRequired) == true) {
						                                    var notificationMessage = categoryText + "، " + convertedBookName + "\u200F " + chapterNumber + convertedChapterName + " " + L("downloadCurrently");                          
						                                 }else{
						                                    // set bookLatin
						                                var bookLatin = bookRecord.latinShortName;
						                                    var notificationMessage = categoryTextLatin + ", " + bookLatin + " " + chapterNumber + convertedChapterNameLatin + " " + L("downloadCurrentlyLatin", "false");
						                                 };    
						                                // END IF ANDROID > 4.0 ELSE
						                                    
						                                showAndroidNotification("create", notificationMessage);         
						                                showNotification = true;
						                            };
						                        };
										    		    	
										    },	    
										    error: function (error) {																	// on Error
										        Ti.API.info('Download Error' + error);
										        
										        // fireEvent to update singleProgressBar
												Ti.App.fireEvent("app:updateSingleProgressBar",{method: "reset",chapterID:chapterID, bookID:bookID, chapterNumber:chapterNumber,});
												
										        // START IF - check what error message to show
												if (error == "noSpace"){
													
													// fire app:showAlertMessage with message
													Ti.App.fireEvent("app:showAlertMessage",{
														message: L("storageMessageError"),          	
													});
													
									    	
												}else{
														
													// fire app:showAlertMessage with message
												    Ti.App.fireEvent("app:showAlertMessage",{
												        message: L("chapterDownloadError"),          	
												    });
												    
									    
												};						
										    	// END IF - check what error message to show
												
												if (OS_ANDROID){
													Ti.Android.NotificationManager.cancel(2);
												};
																    
										    },
										});
							   		 	// END - use checkDownloadURL and check for working URL
							   		 	
									},
					   				
					   			};
				
				// run deleteAudioFunction with data as above
				deleteAudioModuleFunction(deleteData);
				
				
	
};
// END FUNCTION - reDownloadChapter

// START FUNCTION - show notification on Android
	function showAndroidNotification(createUpdate,chapterName){
		
		if (createUpdate == "create"){
			var contentTextVar = L("downloadCurrently") + L("appName") +  " - " + chapterName;
			var iconVar = Ti.App.Android.R.drawable.stat_sys_download;
			var flagsVar = Titanium.Android.FLAG_NO_CLEAR | Titanium.Android.FLAG_ONGOING_EVENT;
			
		}else{
			var contentTextVar = L("chapterDownloadComplete") + L("chapter_title") +  " - " + chapterName;	
			var iconVar = Ti.App.Android.R.drawable.stat_sys_download_anim0;
			var flagsVar = Titanium.Android.FLAG_AUTO_CANCEL;		
		};
		
		// Intent object to launch the application 
		var intent = Ti.Android.createIntent({
		    action : Ti.Android.ACTION_MAIN,
		    className: Alloy.Globals.androidClassName,
		    flags : Ti.Android.FLAG_ACTIVITY_SINGLE_TOP | Ti.Android.FLAG_ACTIVITY_NEW_TASK,
		});
		intent.addCategory(Ti.Android.CATEGORY_LAUNCHER);
			
		// Create a PendingIntent to tie together the Activity and Intent
		var pending = Titanium.Android.createPendingIntent({
		    intent: intent,
		    flags: Titanium.Android.FLAG_UPDATE_CURRENT
		});
		
		//var AppR = Ti.App.Android.R;
	    // var custom_notification = Ti.Android.createRemoteViews({
	    //    layoutId : AppR.layout.custom_notification,
	    //});
    
		var notification = Titanium.Android.createNotification({
          	//contentView: custom_notification,
          	contentTitle: L("appName"),
            contentText: contentTextVar,
            tickerText : contentTextVar,
            when: 0,
            icon : iconVar,
           	flags : flagsVar,
           	contentIntent: pending
        });
        
		Ti.Android.NotificationManager.notify(2, notification);
	};	
	// START FUNCTION - show notification on Android
	
module.exports = reDownloadMenuFunction;
