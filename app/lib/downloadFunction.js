// Require checkDownloadURL module
var checkDownloadURL = require('checkDownloadURL/checkDownloadURL');
		
// START Function - downloadFunction
function downloadMenuFunction(data){
		Ti.API.info("Download Clicked");
		
		// set chapterID
		var chapterID = data.chapterID;
		
		// set createAlert Dialog params
		var single = L("downloadNotificationSingle");
		var complete = L("downloadNotificationWholeBook");
		var cancel =  L("downloadNotificationLater");
		var message = L("downloadNotificationMessage");
			
			// START IF IPHONE ELSE IF ANDROID and ANDROID < 4.2
			var versionRequired = "4.0";
			
			if (OS_IOS || OS_ANDROID && versionCompare(Ti.Platform.version,versionRequired) == true) {
	                var title = L("downloadNotificationTitle");
            }else{
            		var title = L("downloadNotificationTitleFix");
            };    
			// END IF IPHONE ELSE IF ANDROID and ANDROID < 4.2
		
		// require module customAlert in app/assets/lib/
		var customAlert = require('customAlert/customAlert');
		
		//createAlert AlertDialog with params		
		var notificationData = {
			cancelIndex: 2,
			buttonNames: [complete,single,cancel],
			message: message,
			title: title,
			click: function(e){
				
				//START IF - Cancel Clicked close ELSE
		    	if (e.index == 1){    			      		
		      		Ti.API.info('The Single Button was clicked');
		   		 	
		   		 	// run downloadChapter function
		   		 	downloadChapter(chapterID);
		   		 	
		   		}else if (e.index == 0){					
					Ti.API.info('The Complete Button was clicked');				
					
					// run downloadWholeBook function
					downloadWholeBook("start",chapterID);
	
				}else{
					Ti.API.info('The cancel button was clicked');
					
				};	
				//END IF - Cancel Clicked close ELSE
			},
		};
		
	// show AlertDialog notification
	customAlert.show(notificationData);
				
};
// END Function - downloadFunction

// START FUNCTION - downloadChapter

function downloadChapter(chapterID){
                
                //Ti.API.info("Chapter - Download: " + chapterID);
                
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
                
                // get bookName and chapterNumber and bookChapterNumber
                var bookID = chapterRecord.bookID;
                var bookName = bookRecord.shortName;
                var chapterNumber = chapterRecord.chapterNumber;
            
                // START - use checkDownloadURL and check for working URL                            
                checkDownloadURL.checkDownloadURL({
                    method: 'GET',
                    audioFileName: audioFileName,
                    urlArrayString: urlArrayString,
                    success: function (success) {                                                               // on Success
                        Ti.API.info("Download Complete");
                        
                        // fireEvent to update singleProgressBar
                        Ti.App.fireEvent("app:updateSingleProgressBar",{method: "success", chapterID:chapterID, bookID:bookID, chapterNumber:chapterNumber, });
                        
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
                        var message = convertedBookName + " \u200F" + chapterNumberValue + convertedChapterName + " " + L("chapterDownloadComplete");
                        
                        // fire app:showAlertMessage with message
                        Ti.App.fireEvent("app:showAlertMessage",{
                            message: message,              
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
                                var notificationMessage = categoryText + "، " + convertedBookName + "\u200F " + chapterNumber + convertedChapterName + " " + L("chapterDownloadComplete");                          
                             }else{
                                // set bookLatin
                                var bookLatin = bookRecord.latinShortName;
                                var notificationMessage = categoryTextLatin + ", " + bookLatin + " " + chapterNumber + convertedChapterNameLatin + " " + L("chapterDownloadCompleteLatin", "false");
                             };    
                            // END IF ANDROID > 4.0 ELSE
                                
                            showAndroidNotification("update", notificationMessage);                             
                        };
                                                              
                    },
                    datastream: function(datastream) {                                                          // on Datastream
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
                    error: function (error) {                                                                   // on Error
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
    
};
// END FUNCTION - downloadChapter
// START FUNCTION - downloadWholeBook
function downloadWholeBook(startNext,chapterID){
          		
                // START IF - set chapterClicked
                if (startNext == "start"){
                            
	                // !!  FIX FOR WHEN NOT ALL BOOKS ARE ENABLED !! //
					// var chapterRowID = chapterID; // uncomment and remove two below if all book are enabled
					var currentActiveChapterID = returnValueInArray(activeChapterRowIDArray,chapterID);
					var chapterRowID = (+currentActiveChapterID+1);
				
                    // prepare chapterRecord
					var chapterRecord = getSetBookData({	getSet: 'getChapterRecordByRow',
															rowNum: chapterRowID,
					});	
				
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
	
                    // set chapterClicked for rest of function
                    var chapterDownloadID = firstBookChapterID;
                    
                    //Ti.API.info("Chapter - Download: " + chapterDownloadID);
                                    
                }else{
                                    
                    // set chapterClicked for rest of function
                    var chapterDownloadID = chapterID;
                    
                    //Ti.API.info("Chapter - Download: " + chapterDownloadID);
                    
                };
                // END IF - set chapterClicked
                
                // set showNotification var
                var showNotification = false;
        		
        		// !!  FIX FOR WHEN NOT ALL BOOKS ARE ENABLED !! //
				// var chapterRowID = chapterDownloadID; // uncomment and remove two below if all book are enabled
				var currentActiveChapterID = returnValueInArray(activeChapterRowIDArray,chapterDownloadID);
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
                
                // set audioInstalled
				var audioInstalled = getSetBookData({	getSet: "getAudioInstalled",
														rowNum: chapterDownloadID,
				});
                
                // START IF - audioInstalled dont download 
                if (audioInstalled == "true"){
                    
                    Ti.API.info("Chapter already Downloaded");
                    
                    // prepare nextChapterRecord
					var nextChapterRecord = getSetBookData({	getSet: 'getChapterRecordByRow',
																rowNum: (+chapterRowID + 1),
					});
				
                    // set currentChapterBookID
                    var currentChapterBookID = chapterRecord.bookID;
                    var nextChapterBookID = nextChapterRecord.bookID;
                            
                    // START IF - nextArrayVar is smaller than urlArray.length   
                    if (nextChapterBookID == currentChapterBookID){                         
                        Ti.API.info("Downloading Next Chapter"); 
                                
                        // set nextArrayVar 
                   		var nextChapterDownloadID = +chapterDownloadID+1;
                    
                        // run downloadWholeBook function
                        downloadWholeBook("next",nextChapterDownloadID);
                            
                    }else{
                        Ti.API.info("All Chapters Downloaded");
                                
                        // fireEvent to success updateCompleteProgressBar
                        Ti.App.fireEvent("app:updateCompleteProgressBar",{method: "success",chapterID: chapterDownloadID,});  
                                
                        // fire app:showAlertMessage with message            
                        Ti.App.fireEvent("app:showAlertMessage",{
                            message: L("bookDownloadComplete"),              
                        }); 
                                       
                        if (OS_ANDROID){
                            
                            // set converted bookName
                            var convertedBookName = Alloy.Globals.textConverter(bookName);
                                    
                            // START IF - Add Catagory
                            if (bookID == 19){
                                    var categoryText = L("psalms");
                                    var categoryTextLatin = L("psalmsLatin", "false");
                            }else if (bookID < 40){
                                    var categoryText = L("ot");
                                    var categoryTextLatin = L("otLatin", "false");
                            }else{
                                    var categoryText = L("nt");
                                    var categoryTextLatin = L("ntLatin", "false");
                            };
                            // END IF - Add Catagory
                            
                            // START IF ANDROID > 4.0 ELSE
                            var versionRequired = "4.0";
                                
                            if (OS_ANDROID && versionCompare(Ti.Platform.version,versionRequired) == true) {
                                var notificationMessage = categoryText + "، " + convertedBookName + " " + L("wholeBookNotification");
                            }else{
                                // set bookLatin
                                var bookLatin = bookRecord.latinShortName;
                                var notificationMessage = categoryTextLatin + ", " + bookLatin + " " + L("wholeBookNotificationLatin", "false");;
                            };    
                            // END IF ANDROID > 4.0 ELSE
                                    
                            showAndroidNotification("update",notificationMessage);
                        };
                                
                    };
                    // END IF - nextArrayVar is smaller than urlArray.length
                    
                }else{
                            
                    // START - use checkDownloadURL and check for working URL                            
                    checkDownloadURL.checkDownloadURL({
                        method: 'GET',
                        audioFileName: audioFileName,
                        urlArrayString: urlArrayString,
                        success: function (success) {                                                               // on Success
                            Ti.API.info("Chapter Download Complete");
                            
                            // fireEvent to update singleProgressBar
                            Ti.App.fireEvent("app:updateSingleProgressBar",{method: "success", chapterID:chapterDownloadID, bookID:bookID, chapterNumber:chapterNumber, });
                            
                            // set chapter as installed in Database
	                        getSetBookData({	getSet: "setAudioInstalled",
												rowNum: chapterDownloadID,
							});
	                        
	                        // set chapter as installed in Database
	                        getSetBookData({	getSet: "setAudioVersionInstalled",
												rowNum: chapterDownloadID,
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
	                        var message = convertedBookName + " \u200F" + chapterNumberValue + convertedChapterName + " " + L("chapterDownloadComplete");
	                        
	                        // fire app:showAlertMessage with message
	                        Ti.App.fireEvent("app:showAlertMessage",{
	                            message: message,              
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
                                var notificationMessage = categoryText + "، " + convertedBookName + "\u200F " + chapterNumber + convertedChapterName + " " + L("chapterDownloadComplete");                          
                             }else{
                                // set bookLatin
                                var bookLatin = bookRecord.latinShortName;
                                var notificationMessage = categoryTextLatin + ", " + bookLatin + " " + chapterNumber + convertedChapterNameLatin + " " + L("chapterDownloadCompleteLatin", "false");
                             };    
                            // END IF ANDROID > 4.0 ELSE
                                
                            showAndroidNotification("update", notificationMessage);                     
                            };
                            
                            // prepare nextChapterRecord
							var nextChapterRecord = getSetBookData({	getSet: 'getChapterRecordByRow',
																		rowNum: (+chapterRowID + 1),
							});

                            // set currentChapterBookID
		                    var currentChapterBookID = chapterRecord.bookID;
		                    var nextChapterBookID = nextChapterRecord.bookID;
		                            
		                    // START IF - nextArrayVar is smaller than urlArray.length   
		                    if (nextChapterBookID == currentChapterBookID){                                
                                Ti.API.info("Downloading Next Chapter"); 
                                
                                 // set nextArrayVar 
                   				var nextChapterDownloadID = +chapterDownloadID+1;
                            
                            
                                // run downloadWholeBook function
                                downloadWholeBook("next",nextChapterDownloadID);
                            
                            }else{
                                Ti.API.info("All Chapters Downloaded");
                                
                                // fireEvent to success compalteProgressbar
                                Ti.App.fireEvent("app:updateCompleteProgressBar",{method: "success",chapterID:chapterDownloadID, bookID:bookID,});    
                                
                                // fireEvent to showAlerMessage with Success Message            
                                Ti.App.fireEvent("app:showAlertMessage",{
                                    message: L("bookDownloadComplete"),              
                                }); 
                                              
                                if (OS_ANDROID){
                                    // set converted bookName
                                    var convertedBookName = Alloy.Globals.textConverter(bookName);
                                            
                                    // START IF - Add Catagory
                                   if (bookID == 19){
                                            var categoryText = L("psalms");
                                            var categoryTextLatin = L("psalmsLatin", "false");
                                    }else if (bookID < 40){
                                            var categoryText = L("ot");
                                            var categoryTextLatin = L("otLatin", "false");
                                    }else{
                                            var categoryText = L("nt");
                                            var categoryTextLatin = L("ntLatin", "false");
                                    };
                                    // END IF - Add Catagory
                                    
                                    // START IF ANDROID > 4.0 ELSE
                                    var versionRequired = "4.0";
                                        
                                    if (OS_ANDROID && versionCompare(Ti.Platform.version,versionRequired) == true) {
                                        var notificationMessage = categoryText + "، " + convertedBookName + " " + L("wholeBookNotification");
                                    }else{
                                        // set bookLatin
                                		var bookLatin = bookRecord.latinShortName;
                                        var notificationMessage = categoryTextLatin + ", " + bookLatin + " " + L("wholeBookNotificationLatin", "false");;
                                    };    
                                    // END IF ANDROID > 4.0 ELSE
                                            
                                    showAndroidNotification("update",notificationMessage);
                                };
                                
                            };
                                            
                        },
                        datastream: function(datastream) {                                                          // on Datastream
                            Ti.API.info('Download - Progress: ' + datastream.progress);
                            
                            // fireEvent to update singleProgressBar
                            Ti.App.fireEvent("app:updateSingleProgressBar",{method: "update", chapterID:chapterDownloadID, bookID:bookID, chapterNumber:chapterNumber, progress:datastream.progress});
                                     
                            // fireEvent to update compalteProgressbar                   
                            var completeProgress = (+chapterNumber - 1) + datastream.progress;
                            
                            Ti.API.info('Complate Download - Progress: ' + completeProgress);
                            Ti.App.fireEvent("app:updateCompleteProgressBar",{method: "update", max: (+chapterAmount), progress:completeProgress, chapterID:chapterDownloadID, bookID:bookID, chapterAmount:chapterAmount}); 
                                
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
                        error: function (error) {                                                                   // on Error
                            Ti.API.info('Download Error: ' + error);
                            
                            // fireEvent to update singleProgressBar
                            Ti.App.fireEvent("app:updateSingleProgressBar",{method: "reset", chapterID:chapterDownloadID, bookID:bookID,});
                            
                            // fireEvent to reset completeProgressBar
                            Ti.App.fireEvent("app:updateCompleteProgressBar",{method: "reset", chapterID:chapterDownloadID, bookID:bookID, chapterAmount:chapterAmount});
                            
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
                        
                };
                // END IF - audioInstalled dont download 
};

// END FUNCTION - downloadWholeBook

// START FUNCTION - show notification on Android
	function showAndroidNotification(createUpdate,notificationMessage){
		
		if (createUpdate == "create"){
			var contentTextVar = notificationMessage;
			var iconVar = Ti.App.Android.R.drawable.stat_sys_download;
			var flagsVar = Titanium.Android.FLAG_NO_CLEAR | Titanium.Android.FLAG_ONGOING_EVENT;
			
		}else{
			var contentTextVar = notificationMessage;	
			var iconVar = Ti.App.Android.R.drawable.stat_sys_download_anim0;
			var flagsVar = Titanium.Android.FLAG_AUTO_CANCEL;		
		};
		
		// START IF ANDROID > 4.0 ELSE
		var versionRequired = "4.0";
		
		if (OS_ANDROID && versionCompare(Ti.Platform.version,versionRequired) == true) {
			var contentText = L("appName");
		}else{
			var contentText = L("appNameLatin", "false");
		};    
		// END IF ANDROID > 4.0 ELS
			
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
    
		var notification = Titanium.Android.createNotification({
          	contentTitle: contentTextVar,
            contentText: contentText,
            tickerText : contentTextVar,
            when: 0,
            icon : iconVar,
           	flags : flagsVar,
           	contentIntent: pending
        });
        
		Ti.Android.NotificationManager.notify(2, notification);
	};	
	// START FUNCTION - show notification on Android
	
module.exports = downloadMenuFunction;