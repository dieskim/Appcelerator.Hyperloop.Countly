//////////////////////////////////////////////////////////////////////////////////////////////////
//             		 START Function to prepare Audio player          					        //

function audioPrepare(audioPlayerData){

	// IOS FIX - playbackstate never 1 after audioURLChanged
	var audioURLChanged = false;

	// set audioStreaming for analytics
	var audioDownloaded = false;

	// set vars passed from audioPlayerData
	var createClean = audioPlayerData.createClean;
	var chapterRecord = audioPlayerData.chapterRecord;
	var autoPlay = audioPlayerData.autoPlay;

	// set currentActiveChapterID as ID of chapter in chapter record
	var currentActiveChapterID = chapterRecord.rowid;
	
	// !!  FIX FOR WHEN NOT ALL BOOKS ARE ENABLED !! //
	// var chapterID = currentActiveChapterID; // uncomment and remove others if all book are enabled
	// set chapterID as ID of chapter in ALL Chapters (1189)
	var chapterID = activeChapterRowIDArray[currentActiveChapterID-1];
	
	//Create an audioPlayer containing win
	var win = Titanium.UI.createView();

	// set callback function from TextView via audioPlayer to run audioPlayerRemove	
	audioPlayerData.audioPlayerFunctions.removeAudioPlayer = function(){audioPlayerRemove();};
	
	// START FUNCTION - audioPlayerRemove
	function audioPlayerRemove(){		
		
		Ti.API.info("audioPlayerRemove Function in audioPrepare");
		
		Alloy.Globals.shouldBePlaying = false;
					
		// release audioPlayer
		if (audioPlayer){
			audioPlayer.release();
			
			// clearTimeout Alloy.Globals.audioTimer
			if (Alloy.Globals.audioTimer){
				Alloy.Globals.audioTimer.clear();
			};
					
		};
			
		// set audioPlayer null
		audioPlayer = null;	
		win.removeAllChildren();
		win = null;	
		
		if (OS_IOS){
			Ti.API.info("typeof progressInterval: " + typeof progressInterval);
			
			// START IF - Check if progressInterval is still running and kill
			if (typeof progressInterval != 'undefined'){
				clearInterval(progressInterval);
			};			
			// END IF - Check if progressInterval is still running and kill
			
		}else{
			
			Ti.Android.NotificationManager.cancel(1);
		};
		    	
		// removeEventListeners
		Ti.App.removeEventListener("app:remoteAudioStartPause", remoteAudioStartPause);	
		Ti.App.removeEventListener("app:updateSingleProgressBar", updateSingleProgressBar);
		Ti.App.removeEventListener("app:updateCompleteProgressBar", updateCompleteProgressBar);	
	};
	// END FUNCTION - audioPlayerRemove
			
	// Require checkDownloadURL module
	var checkDownloadURL = require('checkDownloadURL/checkDownloadURL');
	
	// Add App eventlistener to listen for audioStartPause from IOS remote
	Ti.App.addEventListener("app:remoteAudioStartPause", remoteAudioStartPause);
	
	// START function - to StartPause audio from IOS remote or to remove Ti.App.eventListener when removing audioplayer
	function remoteAudioStartPause (e) {
		Ti.API.info("remoteAudioStartPause EventFired");
		
		// start or pause audio
		audioStartPause();

	};
	// END function - to StartPause audio from IOS remote or to remove Ti.App.eventListener when removing audioplayer
	
	// START FUNCTION - show notification on Android
	function showAndroidNotification(){
		
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
		
		// set chapterName and chapterNumber
		
		// get bookData
		var bookData = getSetBookData({	getSet: "getBookRecord",
										bookID: chapterRecord.bookID,
						});
						
		var chapterName = bookData.shortName;
		var chapterNumber = chapterRecord.chapterNumber;
		
		// set converted chapterName
		var convertedBookName = Alloy.Globals.textConverter(chapterName);
		
		// START IF - Add Catagory
		if (chapterRecord.bookID == 19){ 
				var categoryText = L("psalms");
				var convertedChapterName = L("psalms_title");
				var categoryTextLatin = L("psalmsLatin", "false");
				var convertedChapterNameLatin = L("psalms_title_Latin", "false");
				
		}else if (chapterRecord.bookID < 40){
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
	            
	            // set contentTitle
				var contentTitle = categoryText + "، " + convertedBookName + "\u200F " + chapterNumber + convertedChapterName + " " + L("audioPlaying"); 
				var contentText = L("appName");
        }else{
            	// set bookLatin
               	var bookLatin = bookRecord.latinShortName;
            	// set contentTitle in Latin
            	var contentTitle = categoryTextLatin + ", " + bookLatin + " " + chapterNumber + convertedChapterNameLatin + " " + L("audioPlayingLatin", "false");
        		var contentText = L("appNameLatin", "false");
        };    
		// END IF ANDROID > 4.0 ELSE
		
		var notification = Titanium.Android.createNotification({
            contentTitle: contentTitle,
            contentText : contentText,
            tickerText :  contentTitle,
            when: 0,
            icon : Alloy.Globals.androidNotificationIcon,
           	flags : Titanium.Android.FLAG_NO_CLEAR | Titanium.Android.FLAG_ONGOING_EVENT,
           	contentIntent: pending
        });
        
		Ti.Android.NotificationManager.notify(1, notification);
	};	
	// START FUNCTION - show notification on Android
	
	var audioFileURL = '';
	
	// set audioFileName
	var audioFileName = Alloy.Globals.audioFilePrefix + chapterRecord.bookID + '_' + padZero(chapterRecord.chapterNumber, 2) + '.mp3';
	
	// check if chapter is downloaded and set isDownloaded
	var isDownloaded = getSetBookData({	getSet: "getAudioInstalled",
										rowNum: chapterID,
						}); 
	
	// START IF - isDownloaded is true - play local else play remote file
	Ti.API.info("isDownloaded" + isDownloaded);	
	if (isDownloaded == "true"){		
		Ti.API.info("chapter Audio is Downloaded");
		
		// set audioStreaming false
		audioDownloaded = true;
		
		// set audioFileURL of player
		var audioFileURL = Alloy.Globals.storageDevice + audioFileName;	
		
		// enable and change buttons , hide progressbar and activityIndicator
		var startPauseButtonEnable = true;
		var downloadButtonEnable = false;	
		var downloadButtonBackground = "/images/icon_download_downloaded.png";
		var downloadButtonDisabledBackground = "/images/icon_download_downloaded.png";
		var progressBarShow = false;
		var activityIndicatorHidden = true;
		
	}else{ // else - play remote file		
		Ti.API.info("chapter Audio NOT Downloaded");
		
		// disable buttons and show activityIndicator untin audioFile found
		var startPauseButtonEnable = false;		
		var activityIndicatorHidden = false;
		var downloadButtonBackground = "/images/icon_download_normal.png";
		var downloadButtonDisabledBackground = "/images/icon_download_disabled.png";
		var downloadButtonEnable = false;
		var progressBarShow = true;
		
		// set urlArrayString 
		var urlArrayString = databaseConnect({	
							database: Alloy.Globals.databaseData.urlData.databaseName,
							table: "urlData",
							method:"getFieldValue",
							field: "urlList", 
							lookupField: "urlName",
							value: "audio",
		});
		
		Ti.API.info("urlArrayString");
		Ti.API.info(urlArrayString);
	
		// run checkDownloadURL	and check for working URL
		checkDownloadURL.checkDownloadURL({
			audioFileName: audioFileName,
		    urlArrayString: urlArrayString,								// set urlArrayString
		    success: function (success) {								// on Success
		        Ti.API.info("Success - Audio File Found");
		        
		        // set foundURL
		        var foundURL = success.foundURL;
		        
		        // START IF - audioPlayer sill exists
		        if (audioPlayer){
		        	
		        	// set audioPlayer url
		        	audioPlayer.url = foundURL;
		        	
			        // enable Buttons and hide ActivityIndicator
			        startPauseButton.enabled = true;
				    showHideActivityIndicator();
				    downloadButton.enabled = true;
				     
				    // START IF - check if autoPlay and auto play audio   			
				    if (autoPlay == "auto"){
				       	Ti.API.info("AutoPlay - Remote File");
						
						// audioStartPause
						audioStartPause();
					}else{
						Ti.API.info("Not AutoPlay - Remote File");		
					};
					// END IF - check if autoPlay and auto play audio
				
		        }else{		        	
		        	Ti.API.info("AudioPlayer Removed - exit");		        	
		        };			
				// END IF - audioPlayer sill exists
				
		    },	    
		    error: function (error) {									// on Error
		        Ti.API.info("Error - All Audio File URLS Failed");
		        
		        // set audioPlayer.url
		        if (audioPlayer){
		        	
		       		// fire app:showAlertMessage with message
		       		Ti.App.fireEvent("app:showAlertMessage",{
		            	message: L("networkProblem"),          	
		            });
		            
		        }else{
		        	Ti.API.info("AudioPlayer Removed - Dont Show networkProblem Error");
		        };
				    
		        // hide ActivityIndicator   	
				showHideActivityIndicator();
				
		    },
		});
	
	};
	// END IF - isDownloaded is true - play local else play remote file
	
	///////////////////////////////////////////////////////////////////////////////////////////////
	//  						START create completeProgressBar								//
	// set android ICS version
	var versionRequired = "4.0";
	
	if (OS_IOS || (OS_ANDROID && versionCompare(Ti.Platform.version,versionRequired) == true)) {
		
		if (OS_IOS){
			var topVar = -3;
			var styleVar = Titanium.UI.iOS.ProgressBarStyle.PLAIN;
		}else{
			var topVar = '-25dp';
			var styleVar = '';

		};
		
		var completeProgressBar = Titanium.UI.createProgressBar({
			top: topVar,
			left:0,
			width: Ti.UI.FILL,
			height: 'auto',
			min:0,
			max:1,
			value:0,
			font : {fontSize:20, fontWeight:'bold'}, 
			style: styleVar,
			visible: false,	
		});
	
	}else{
	
		var completeProgressBar = Titanium.UI.createSlider({
			top: 0,
			left:0,
			width: Ti.UI.FILL,
			height: "5dp",
			min:0,
			max:1,
			value:0,
			font : {fontSize:5, fontWeight:'bold'}, 
			thumbImage: "/images/transparent.png",
			rightTrackImage: "/images/slider_right.png",
	   		leftTrackImage: "/images/slider_left.png",
			touchEnabled: false,
			visible: false,
		});
		
	};
	
	win.add(completeProgressBar);
	
	//  						END create completeProgressBar									//
	//////////////////////////////////////////////////////////////////////////////////////////////

	// create audioButtonsRow 
	var audioButtonsRow = Titanium.UI.createView({  
	    layout: 'horizontal',
	    height: "40dp",
	    width:	Ti.UI.FILL,
	    top:0,
	    //backgroundColor: "blue",
	});
	
	// create audioSliderView
	var audioSliderView = Titanium.UI.createView({  
	    height: "20dp",
	    width:	Ti.UI.FILL,
	    bottom:0,
	    //backgroundColor: "red",
	});
	
	// create audioDownloadView
	var audioStatusView = Titanium.UI.createView({  
	    height: Ti.UI.FILL,
	    width:	"20%",
	    left:0,
	    //backgroundColor: "pink",
	});
	
	// create audioButtonsContainer
	var audioButtonsContainer = Titanium.UI.createView({  
	    height: Ti.UI.FILL,
	    width:	"60%",
	   	//backgroundColor: "yellow",
	});
	
	// create audioButtonsView
	var audioButtonsView = Titanium.UI.createView({  
	    height: Ti.UI.FILL,
	    width: Ti.UI.SIZE,
	    layout: "horizontal",
	    //backgroundColor: "blue",
	});
	
	audioButtonsContainer.add(audioButtonsView);
	
	// create audioStatusView
	var audioDownloadView = Titanium.UI.createView({  
	    height: Ti.UI.FILL,
	    width:	"19.9%",
	   	//backgroundColor: "green",
	});
	
	// add audioButtons views to audioButtons row
	audioButtonsRow.add(audioStatusView);
	audioButtonsRow.add(audioButtonsContainer);
	audioButtonsRow.add(audioDownloadView);
	
	// add audioButtonsRow and audioButtonsSlider to win view
	win.add(audioButtonsRow);
	win.add(audioSliderView);
	
	// set totalChapterAmount as count of table in database
	var totalChapterAmount = databaseConnect({
			database: Alloy.Globals.databaseData.bibleText.databaseName,
			table: "chapters",
			method:"count", 
	});	 
	
	// START IF - check if chapterID is last chapter
	if (chapterID<totalChapterAmount){ 
		var enabled = true;
	}else{
		var enabled = false;
	};
	// END IF - check if chapterID is last chapter
	
	// Create nextButton and disable or enable
	var nextButton = Titanium.UI.createButton({
	    backgroundImage: "/images/icon_player_ff_normal.png",
		backgroundSelectedImage: "/images/icon_player_ff_selected.png",
		backgroundDisabledImage: "/images/icon_player_ff_disabled.png",
		top: "10dp",
		height: "25dp",
		width: "30dp",
		enabled: enabled,
	});
	
	// add click EventListener to nextButton
	nextButton.addEventListener('click', nextButtonFunction);
	
	// Create startButton
	var startPauseButton = Titanium.UI.createButton({
	    backgroundImage: "/images/icon_player_play_normal.png",
		backgroundSelectedImage: "/images/icon_player_play_selected.png",
		backgroundDisabledImage: "/images/icon_player_play_disabled.png",
		enabled: startPauseButtonEnable,
		top: "5dp", 
		left: "35dp",
		right: "35dp",
		height: "35dp",
		width: "30dp",
	});
	
	// add click EventListener to startPauseButton
	startPauseButton.addEventListener('click',audioStartPause);
	
	// START IF - check if chapterID is first and enable or disable prev button
	if (chapterID != 1){ 
		var enabled = true;
	}else{
		var enabled = false;
	};
	// END IF - check if chapterID is first and enable or disable prev button
	
	// create prevButton with enable var
	var prevButton = Titanium.UI.createButton({
	    backgroundImage: "/images/icon_player_rr_normal.png",
		backgroundSelectedImage: "/images/icon_player_rr_selected.png",
		backgroundDisabledImage: "/images/icon_player_rr_disabled.png",
		top: "10dp", 
		height: "25dp",
		width: "30dp",
		enabled: enabled,
	});
	
	// add click EventListener to prevButton
	prevButton.addEventListener('click',prevButtonFunction); 	
	
	// add buttons to audioButtonsView
	audioButtonsView.add(prevButton);
	audioButtonsView.add(startPauseButton);
	audioButtonsView.add(nextButton);  

	// Create activityIndicator
	var activityIndicator = Ti.UI.createActivityIndicator({			
  		style: Ti.UI.ActivityIndicatorStyle.BIG,
  		top:5,
  		left: 5,
 		height: "35dp",
 		width: "35dp",
 		hidden: activityIndicatorHidden,		
	}); 
	
	// add activityIndicator to audioStatusView
	audioStatusView.add(activityIndicator);
	
	// START IF - check if activityIndicator should be enabeled and show	
	if (activityIndicator.hidden == false){
		activityIndicator.show();
	};
	// END IF - check if activityIndicator should be enabeled and show
	
	// START Function - showHideActivityIndicator
	function showHideActivityIndicator(){
		
		// START IF - check if activityIndicator should be hidden or shown
		if (activityIndicator.hidden == true){
			activityIndicator.show();
		    activityIndicator.hidden = false;			
		}else{
			activityIndicator.hide();
		    activityIndicator.hidden = true;			
		};
		// END IF - check if activityIndicator should be hidden or shown 
		
	};
	// END Function - showHideActivityIndicator
	
	// create downloadButton
	var downloadButton = Titanium.UI.createButton({
	    backgroundImage: downloadButtonBackground,
		backgroundSelectedImage: "/images/icon_download_selected.png",
		backgroundDisabledImage: downloadButtonDisabledBackground,	
		right:5,
		top:5,
		height: "35dp",
		width: "35dp",
		enabled:downloadButtonEnable, 
	});
	
	// add click EventListener to the downloadButton
	downloadButton.addEventListener('click', function(e){				
				
				// FireEvent downloadMenuFunction
				Ti.App.fireEvent('app:downloadFunction',{
		            chapterID: chapterID, 
		           });
		        				
	});
	
	// START - create progressBar
	var versionRequired = "4.0";
	
	if (OS_IOS || (OS_ANDROID && versionCompare(Ti.Platform.version,versionRequired) == true)) {
		
		if (OS_IOS){
			var bottomVar = 5;
			var widthVar = 31;
			var rightVar = 7;
			var styleVar = Titanium.UI.iOS.ProgressBarStyle.PLAIN;
		}else{
			var bottomVar = -5;
			var widthVar =  "35dp";
			var rightVar = 5;
			var styleVar = '';
		};
	
		var progressBar = Titanium.UI.createProgressBar({
		   	bottom: bottomVar,
		    width: widthVar,
		   	height: 'auto',
		   	right: rightVar,
		    min:0,
		    max:1,
		    value:0,
		    font : {fontSize:20, fontWeight:'bold'}, 
		    style: styleVar,
		    visible: false,	
		});
	
	}else{
	
		var progressBar = Titanium.UI.createSlider({
			bottom: 0,
			right:7,
			width: "32dp",
			height: "5dp",
			min:0,
			max:1,
			value:0,
			font : {fontSize:5, fontWeight:'bold'}, 
			thumbImage: "/images/transparent.png",
			rightTrackImage: "/images/slider_right.png",
			leftTrackImage: "/images/slider_left.png",
			touchEnabled: false,
			visible: false,	
	
		});
		
	};
	
	// add progressBar and downloadButton to audioDownloadView
	audioDownloadView.add(progressBar);
	audioDownloadView.add(downloadButton);	
	
	// START IF - check if progressBarShow is true - and show 
	if (progressBarShow){
		progressBar.show();
	};
	// END IF - check if progressBarShow is true - and show 
	
	// START IF - IOS ELSE ANDROID - CREATE AUDIO PLAYER
	if (OS_IOS){
	
		// create audioPlayer
		var audioPlayer = Ti.Media.createVideoPlayer({ 
		    autoplay: false,
		    mediaControlStyle: Titanium.Media.VIDEO_CONTROL_NONE,
		    scalingMode: Titanium.Media.VIDEO_SCALING_NONE, 
		    sourceType: Titanium.Media.VIDEO_SOURCE_TYPE_FILE,
		    allowBackground: true,
		    allowsAirPlay: true,
		    visible: false,
		    height:0,
		    width:0,
		});           
	
	}else{
		
		// create audioPlayer
		var audioPlayer = Ti.Media.createAudioPlayer({ 
		    autoplay: false,		    
		    allowBackground: true,
		    visible: false,
		});     
		
	};
	// END IF - IOS ELSE ANDROID - CREATE AUDIO PLAYER
	
	// START IF - check if isDownloaded and set URL else not
	if (isDownloaded == "true"){	
											
		// set audioPlayer.url as audioFileURL
		audioPlayer.url = audioFileURL;
		
	};
	// END IF - check if isDownloaded and set URL else not
	
	// set Alloy.Globals.shouldBePlaying as false
	Alloy.Globals.shouldBePlaying = false;
	Alloy.Globals.currentPlaying = '';
	
	// START Function - audioStartPause
	function audioStartPause(){	
		Ti.API.info("Start audioStartPause");
	       				    
		// START IF - check if audioPlayer is playing
	    if (audioPlayer.playing){
	        // if audio is playing - pause
	        Alloy.Globals.shouldBePlaying = false;
	        audioPlayer.pause();
			changePlayButtonImage("play");
			
			Ti.API.info("pause audioTimer");
			// pause audioTimer
			Alloy.Globals.audioTimer.pause();
			
	    }else{	// else not playing
	        
	        // START FUNCTION - checkPaused
	        function checkPaused(){
	        	if (OS_IOS){
					
					// START IF - check if playbackState 2	        	
	        		if (audioPlayer.getPlaybackState() == "2"){
	        			return true;
	        		}else{
	        			return false;	
	        		}; 
	        		// END IF - check if playbackState 2
	        		      		
	        	}else{
	        		
	        		// START IF - check if audioPlayer.paused
	        		if (audioPlayer.paused)	{
	        			return true;
	        		}else{
	        			return false;
	        		};
	        		// END IF - check if audioPlayer.paused
	        		
	        	};        		
	        };
	        // END FUNCTION - checkPaused
	        
	        // START IF - check audioPlaybackState
	        if (checkPaused()){
	        	
	        	// if audio is paused the resume
	        	Alloy.Globals.shouldBePlaying = true;
	        	audioPlayer.play();	       	
				changePlayButtonImage("pause");
				
				Ti.API.info("resume audioTimer");
				// resume audioTimer
				Alloy.Globals.audioTimer.resume();
			
	        }else{ // else Start Audio for First Time
				
				Ti.API.info("Start Audio for First Time");

				// Show ActivityIndicator
		        showHideActivityIndicator();
		        
		        // IOS FIX - playbackstate never 1 after audioURLChanged
		        if(OS_IOS && audioURLChanged.changed){
		        	
		        	Ti.API.log(audioURLChanged);

		        	// manually fix 
		        	audioPlayer.currentPlaybackTime = Math.round(audioURLChanged.audioProgress*1000)

		        	// Start Audio
		       		audioPlayer.play(); 

		       		// fire manual playbackstate 1
		       		audioPlayer.fireEvent('playbackstate',{playbackState: "1"});

		        }else{

		        	// Start Audio
		        	audioPlayer.play(); 

		        }

		        changePlayButtonImage("pause");
		        Alloy.Globals.shouldBePlaying = true;
		        Alloy.Globals.currentPlaying = chapterID; 
		               
				// START IF - IOS else ANDROID
				if(OS_IOS){

					// calculate audioDuration
					var audioDurationMili = audioPlayer.duration;
					var audioDuration = Math.round(audioDurationMili);	

				}else{

					// calculate audioDuration
					var audioDurationMili = audioPlayer.duration;
					var audioDuration = Math.round(audioDurationMili / 100);

				};
				// END IF - IOS else ANDROID
				
				Ti.API.info("Audio Duration:" + audioDuration);

				// Set slider Max to audioDuration and enable slider
		        slider.touchEnabled = true;
		        slider.enabled = true;
		        slider.setMax(audioDuration);
		        
		        // set audioTimer and check if whole audio listened to
				// clearTimeout Alloy.Globals.audioTimer
				if (Alloy.Globals.audioTimer){
					Alloy.Globals.audioTimer.clear();
				};
	
		        Alloy.Globals.audioTimer = new Timer(function() {
					logChapterListened(chapterID,audioDownloaded);
				}, Alloy.Globals.chapterListenTimerTime);	// setTimer to 60 seconds then logChapterListened
				
	        };
	        // END IF - check audioPlaybackState
	        
	    };
	    // END IF - check if audioPlayer is playing
	    
	};
	// END Function - audioStartPause
	
	//////////////////////////////////////////////////////////////////////////////////////////
	// 					START Function - updateSingleProgressBar							//
	
	// Add App eventlistener to listen for audioStartPause from IOS remote
	Ti.App.addEventListener("app:updateSingleProgressBar", updateSingleProgressBar);
	
	// START Function - updateSingleProgressBar
	function updateSingleProgressBar(e){
		
		Ti.API.info(e);
		
		// START IF - check if chapterID open is chapterID - else dont update anything
		if (chapterID == e.chapterID){
			
			// START IF - check method
			if (e.method == "update"){
			
				// set progressBar.value as datastream.progress
				downloadButton.enabled = false;
				progressBar.value = e.progress;
						
			}else if (e.method == "reset"){
				
				// Disable download button and hide progressbar
				downloadButton.backgroundImage = "/images/icon_download_normal.png";
				downloadButton.backgroundDisabledImage = "/images/icon_download_disabled.png";						
				// re-enable downloadButton
				downloadButton.enabled = true;
				// set progressbar.value 0
				progressBar.value = 0;
				progressBar.show();	
			
			}else if (e.method == "delete"){
				
				// FireEvent goToPage to reload page with download
				audioPlayerData.goToPage({
					direction: "index",  
					auto: "notAuto",      	
				});				
						
			}else if (e.method == "success"){
				
				// Disable download button and hide progressbar
				downloadButton.enabled = false;
				downloadButton.backgroundImage = "/images/icon_download_downloaded.png";
				downloadButton.backgroundDisabledImage = "/images/icon_download_downloaded.png";
				progressBar.hide();
									
				// START IF - check if Alloy.Globals.shouldBePlaying	
		        if (Alloy.Globals.shouldBePlaying == false){
					
					// set audioStreaming false
					audioDownloaded = true;
					
					// set audioFileURL as local file
					var audioFileURL = Alloy.Globals.storageDevice + audioFileName;
					

					Ti.API.info("Update Audio URL: " + audioFileURL);

					if(OS_IOS){
						// IOS FIX - playbackstate never 1 after audioURLChanged
						audioURLChanged = {	changed: true,
											audioProgress: audioPlayer.getCurrentPlaybackTime()};
					};

					// set audioPlayer.url as audioFileURL
					audioPlayer.url = audioFileURL;

					
				};
				// END IF - check if Alloy.Globals.shouldBePlaying
	
			};
			// END IF - check method
			
		};
		// END IF - check if chapterID open is chapterClicked - else dont update anything

	};
	// END Function - updateSingleProgressBar
	
	
	// 					END Function - updateSingleProgressBar							//
	//////////////////////////////////////////////////////////////////////////////////////////
	
	//////////////////////////////////////////////////////////////////////////////////////////
	// 					START Function - updateCompleteProgressBar							//
	
	// Add App eventlistener to listen for audioStartPause from IOS remote
	Ti.App.addEventListener("app:updateCompleteProgressBar", updateCompleteProgressBar);
	
	// START FUNCTION - updateCompleteProgressBar
	function updateCompleteProgressBar(e){
		
		Ti.API.info(e);
		
		// START IF- check Method
		if (e.method == "update"){
			
			// disable downloadButton
			downloadButton.enabled = false;
			// set progressBar.value as e.progress				    	
			completeProgressBar.show();
			completeProgressBar.max = e.max;	
			completeProgressBar.value = e.progress;	
			
		}else if (e.method == "reset"){
			
			// enable downloadButton
			downloadButton.enabled = true;
			
			// reset progressBar.value and hide				    	
			completeProgressBar.hide();
			completeProgressBar.value = 0;	
		
		}else if (e.method == "success"){
			
			// Disable download button and hide progressbar
			downloadButton.enabled = false;
			downloadButton.backgroundImage = "/images/icon_download_downloaded.png";
			downloadButton.backgroundDisabledImage = "/images/icon_download_downloaded.png";
			progressBar.hide();
								
			// reset progressBar.value and hide				    	
			completeProgressBar.hide();
			completeProgressBar.value = 0;	

		};
		// END IF - check Method
		
	};
	// END FUNCTION - updateCompleteProgressBar
	
	// 					END Function - updateCompleteProgressBar							//
	//////////////////////////////////////////////////////////////////////////////////////////
		
	// START Function - changePlayButtonImage
	function changePlayButtonImage(pausePlay){
		
		// START IF - pausePlay is play
		if (pausePlay == "play"){			
			startPauseButton.backgroundImage = "/images/icon_player_play_normal.png";
			startPauseButton.backgroundSelectedImage = "/images/icon_player_play_selected.png";
		}else{
			startPauseButton.backgroundImage = "/images/icon_player_pause_normal.png";
			startPauseButton.backgroundSelectedImage = "/images/icon_player_pause_selected.png";			
		};
		// END IF - pausePlay is play
		
	};
	// END Function - changePlayButtonImage
	
	// START Function - preButtonFunction
	function prevButtonFunction(){		
		Ti.API.info("prevButton Clicked");
		
		// START IF - if audio is playing and next click set autoplay auto
		if (Alloy.Globals.shouldBePlaying == true){
			var autoPlayVar = "auto";
		}else{
			var autoPlayVar = "notAuto";
		};
		// end IF - if audio is playing and next click set autoplay auto
		
		// run callBack function to gotToPage
		audioPlayerData.goToPage({
					direction: "prev",  
           			auto: autoPlayVar,       	
				});
        
	};
	// END Function - preButtonFunction
	
	// START Function - nextButtonFunction
	function nextButtonFunction(){		
		Ti.API.info("nextButton Clicked");
		
		// START IF - if audio is playing and next click set autoplay auto
		if (Alloy.Globals.shouldBePlaying == true){
			var autoPlayVar = "auto";
		}else{
			var autoPlayVar = "notAuto";
		};
		// end IF - if audio is playing and next click set autoplay auto
		
		// run callBack function to gotToPage
		audioPlayerData.goToPage({
					direction: "next",
            		auto: autoPlayVar,        	
				});
		
	};
	// END Function - nextButtonFunction
	
	// START IF - IOS ELSE ANDROID
	if (OS_IOS){
		// START addEventListener to listen for event Fired when the state of the playback changes 
		audioPlayer.addEventListener('playbackstate',function(e){
		    Ti.API.info("PlaybackState" + e.playbackState);
			
			// set playbackState
			var playbackState = e.playbackState;
			
			// START IF - check playbackState and run according function
		    if (playbackState == "1"){ 																	// if Playing
		    	
		    	// START - progressInterval - run updateSliderProgress function every 1/2 second
		    	progressInterval = setInterval(updateSliderProgress, 500);	
		    
		    }else if (playbackState == "2"){															// if Paused
		    	
		    	// START IF - Check if progressInterval is still running and kill
				if (typeof progressInterval != 'undefined'){
					clearInterval(progressInterval);
				};			
				// END IF - Check if progressInterval is still running and kill
		    	
		    }else if (playbackState == "0"){															// if Stopped
		    	
		    	// START IF - check if Alloy.Globals.shouldBePlaying
		    	if (Alloy.Globals.shouldBePlaying){	
			    	Ti.API.info("Audio Interrupted Playbackstate 0");
			    	// set Alloy.Globals.shouldBePlaying as false
			    	Alloy.Globals.shouldBePlaying = false;
			    	// STOP - progressInterval
			    	clearInterval(progressInterval);   
			    	
			    	// release audioPlayer
			    	if (audioPlayer){
			    		audioPlayer.release();
			    		
			    		// clearTimeout Alloy.Globals.audioTimer
						if (Alloy.Globals.audioTimer){
							Alloy.Globals.audioTimer.clear();
						};
						
			    	};  	
			    	
			    };	
			    // END IF - check if Alloy.Globals.shouldBePlaying 
		   
		    }else if (playbackState == "4"){															// if Resuming	    	
		    	Ti.API.info("Audio Resuming");
		    	
		    	// show activityIndicator
		    	showHideActivityIndicator(); 	
		    };
		    // END IF - check playbackState and run according function
		    
		});
		// END addEventListener to listen for event Fired when the state of the playback changes
	
	}else{ // else android
		
		//Fired once per second with the current progress during playback 
		audioPlayer.addEventListener('progress',function(e) {
			
			//set progress
			var progress = e.progress;
			// updateSliderProgress	with progress		
		    updateSliderProgress(progress);
		    
		});

		// START addEventListener to listen for event Fired when the state of the playback changes
		audioPlayer.addEventListener('change',function(e){
			Ti.API.info('Playback State: ' + e.description + ' (' + e.state + ')');
			
			//Fired when the audio has finished playing.
	    	if (e.description=='stopped'){
	             // START IF - check if Alloy.Globals.shouldBePlaying
		    	if (Alloy.Globals.shouldBePlaying){	
			    	Ti.API.info("Audio Interrupted - description Stopped");
					
					// set Alloy.Globals.shouldBePlaying as false
			    	Alloy.Globals.shouldBePlaying = false;
			    	
			    	// release audioPlayer
			    	if (audioPlayer){
			    		audioPlayer.release();
			    		
			    		// clearTimeout Alloy.Globals.audioTimer
						if (Alloy.Globals.audioTimer){
							Alloy.Globals.audioTimer.clear();
						};

			    	};  	
			    	
			    };	
			    // END IF - check if Alloy.Globals.shouldBePlaying 
	       
	       	//Fired when the audio length received
	       	}else if (e.description=='playing' ){
				// show activityIndicator
		    	showHideActivityIndicator();
		    	
		    	showAndroidNotification();
	       	};
       	
		});
		
	};
	// END IF - IOS ELSE ANDROID
	
	// START addEventListener to listen for event Fired when audio Completes 
	audioPlayer.addEventListener('complete',function(e){
		
		// START IF - check if audio Alloy.Globals.shouldBePlaying
		if(Alloy.Globals.shouldBePlaying){
	    		Ti.API.info("Audio Complete Naturally");
	    		
	    		// set shoudlBePlaying as False
	    		Alloy.Globals.shouldBePlaying = false;
	    		
	    		// release audioPlayer
			    if (audioPlayer){
			    	audioPlayer.release();
			    	
			    	// clearTimeout Alloy.Globals.audioTimer
					if (Alloy.Globals.audioTimer){
						Alloy.Globals.audioTimer.clear();
					};

			    }; 
			    	
	    		// run callBack function to gotToPage
				audioPlayerData.goToPage({
							direction: "next", 
           					auto:"auto",           	
						});
    		
	    };
	    // END IF - check if audio Alloy.Globals.shouldBePlaying	
	    	
	});
	// END addEventListener to listen for event Fired when audio Completes 
	
	// START Function - updateSliderProgress
	function updateSliderProgress(progress){
		
		// START IF - audioPlayer
		if (audioPlayer){

			// START IF - IOS else ANDROID
			if(OS_IOS){

				// calculate audioProgress
				var audioProgressMil = audioPlayer.getCurrentPlaybackTime();	
				var audioProgress = Math.round(audioProgressMil);

				// calculate audioDuration
				var audioDurationMili = audioPlayer.duration;
				var audioDuration = Math.round(audioDurationMili);	

			}else{

				// calculate audioProgress
				var audioProgressMil = progress;
				var audioProgress = Math.round(audioProgressMil / 100);

				// calculate audioDuration
				var audioDurationMili = audioPlayer.duration;
				var audioDuration = Math.round(audioDurationMili / 100);

			};
			// END IF - IOS else ANDROID

		}else{

			// set 0
			var audioProgress = 0;
			var audioDuration = 0;

		};
		// END IF - audioPlayer	
				
		Ti.API.info("updateSliderProgress" + audioProgress + "updateSliderMax" + audioDuration);
		
		// START IF - check if activityIndicator is shown and audioProgress is larger than slider value
		if (activityIndicator.hidden == false && audioProgress > slider.value){			    	
	    	Ti.API.info("Hide Activity Indicator");
	    	// hide ActivityIndicator
	    	showHideActivityIndicator();	
	    };
	    // END IF - check if activityIndicator is shown and audioProgress is larger than slider value
	    
	    // set slider Max and Value
		slider.setMax(audioDuration);
		slider.value = audioProgress;
		
	};
	// END Function - updateSliderProgress 
	
	// create Slider
	var slider = Titanium.UI.createSlider({
		min: 0,
		max: 0,
	   	thumbImage: "/images/btn_slider_selected.png",
	   	disabledThumbImage: "/images/btn_slider_disabled.png",
	   	width: Ti.UI.FILL,
	  	value: 0,
	   	touchEnabled: false,
	   	enabled: false,	   	
	   	leftTrackImage: "/images/slider_left.png",
		rightTrackImage: "/images/slider_right.png",	
	});
	
	// addEventListener and check for slider change event
	slider.addEventListener('change', function(e) {	    
	    Ti.API.info("Current:" + slider.value + "Max:" +slider.max);
	});
	
	// addEventListener to listen for touchend
	slider.addEventListener('start', function(e) {
	    Ti.API.info("Slider Touch Start");
	   	if (audioPlayer.playing){
	   	audioStartPause(); 	
	   	};
	   
	});
	
	// addEventListerner to listen for touchend
	slider.addEventListener('stop', function(e) {	    
	    Ti.API.info("Slider Touch End");
	    
	    Ti.API.info("New Slider Value" + slider.value);
	  	
	  	// set audioPlayer.currentPlaybackTime to audioSliderProgress
	  	if (OS_IOS){
	  		
	  		// calculate audioSliderProgress
	    	var audioSliderProgressSec = slider.value;
	    	var audioSliderProgress = Math.round(audioSliderProgressSec*1000);

	    	Ti.API.info("audioSliderProgress" + audioSliderProgress);

	    	// set audioPlayer.currentPlaybackTime
	  		audioPlayer.currentPlaybackTime = audioSliderProgress;	

	  	}else{

	  		// calculate audioSliderProgress
	    	var audioSliderProgressSec = slider.value;
	    	var audioSliderProgress = Math.round(audioSliderProgressSec*100);

	    	// set audioPlayer.time
	  		audioPlayer.time = audioSliderProgress;
	  		
	  		// show activityIndicator
		    showHideActivityIndicator(); 

	  	};	  	
	  	
	  	Ti.API.info("Audio new PlaybackTime" + audioSliderProgress);
	    
	    // start audioPlayer from new currentPlaybackTime
	    audioStartPause();   
	    
	});
	
	// add slider to audioSliderView
	audioSliderView.add(slider);	
	
	// START IF IOS - ADD audioPlayer
	if (OS_IOS){
		// add audioPlayer to win
		win.add(audioPlayer);	
	};
	// END IF IOS - ADD audioPlayer
	
	// START IF check file isDownloaded - check if latest audio or ask then download latest
	if (isDownloaded == "true"){
		
		// check audioInstalled Version
		var audioVersionInstalled = getSetBookData({	getSet: "getAudioVersionInstalled",
														rowNum: chapterID,
									});
		
		// check latest Audio Version
		var audioVersion = getSetBookData({	getSet: "getAudioVersion",
														rowNum: chapterID,
									});
		
		// START IF - check if audioVersionInstalled = audioVersion
		if (audioVersionInstalled == audioVersion){
			Ti.API.info("AudioInstalled is latest Version - AutoPlay Start");
			
			// START IF - autoPlay is auto
			if (autoPlay == "auto"){
				Ti.API.info("AutoPlay - Local File");
				
				// Start audioPlayer
				audioStartPause();
				
			}else{
				Ti.API.info("Not AutoPlay - Local File");		
			};
			// END  IF - autoPlay is auto
	
		}else{			
			Ti.API.info("AudioInstalled is NOT latest Version - ASK TO REDOWNLOAD then do AutoPlay");
			
			// require reDownloadFunction Module
			var reDownloadFunctionModule = require('reDownloadFunction');
			
			// START FUNCTION - reDownloadFunctionModule
			reDownloadFunctionModule({	chapterID: chapterID,
										success: function() {
											Ti.API.info ("ReDownload Success");
											
											// START IF - autoPlay is auto
											if (autoPlay == "auto"){
												Ti.API.info("AutoPlay - Local File");
												
												// Start audioPlayer
												audioStartPause();
												
											}else{
												Ti.API.info("Not AutoPlay - Local File");		
											};
											// END  IF - autoPlay is auto
											
										},
										cancel: function(){
											Ti.API.info ("ReDownload Cancel");
											
											// START IF - autoPlay is auto
											if (autoPlay == "auto"){
												Ti.API.info("AutoPlay - Local File");
												
												// Start audioPlayer
												audioStartPause();
												
											}else{
												Ti.API.info("Not AutoPlay - Local File");		
											};
											// END  IF - autoPlay is auto
			
										},
									
			});
			// END FUNCTION - reDownloadFunctionModule
			
		};
		//END IF - check if audioVersionInstalled = audioVersion
	};
	// END IF check file isDownloaded 
		
	// return win	
	return win;
	
};

//             			 END Function to prepare Audio player          					        //
//////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = audioPrepare;
