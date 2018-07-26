// Set Args passed from other windows as args
var args = arguments[0] || {};

// use args to set functions to run webViewClick and webViewScrollStart functions as passed from TextView
args.webViewClick = function(){webViewClick();};
args.webViewScrollStart = function(){webViewScrollStart();};

//////////////////////////////////////////////////////////////////////////////////////////////////////
// 					START IF - iPhone Remote Control Module and Functions							//

// START IF IOS ELSE ANDROID
if (OS_IOS) {
	
	// require Control to get functions from IOS REMOTE
	var Control = require('net.hoyohoyo.tiremotecontrol');

};	
// END IF IOS ELSE ANDROID	

// START Function - to setControlInfo with audioInfo
function setControlInfo(chapterRecord){
	
	// START - addEventListener to listen for events from Control - IOS Remote
	Control.addEventListener('remotecontrol', remoteControlFunctions);

	// get bookRecord
	var bookRecord = getSetBookData({	getSet: "getBookRecord",
										bookID: chapterRecord.book,
					});
					
	// set bookName and chapterNumber
	var bookName = bookRecord.shortName;
	var chapterNumber = chapterRecord.chapterNumber; 
	
	// START IF - Add Catagory
	if (chapterRecord.bookID == 19){
			var categoryText = L("psalms");
			var convertedChapterName = L("psalms_title");
	}else if (chapterRecord.bookID < 40){
			var categoryText = L("ot");
			var convertedChapterName = L("chapter_title");
	}else{
			var categoryText = L("nt");
			var convertedChapterName = L("chapter_title");
	};
	// END IF - Add Catagory
	
	//Ti.API.info(bookName + " " + chapterNumber);
	
	// setNowPlayingInfo	
	Control.setNowPlayingInfo({
		artist: categoryText,
		title: chapterNumber + convertedChapterName,
		albumTitle: bookName,
		albumArtworkLocal: true,
		albumArtwork: "iTunesArtwork",
	});
	
	// Log Now Playing info
 	//Ti.API.info("Now Playing" + bookName + " " + chapterNumber); 
	
};
// END Function - to setControlInfo with audioInfo
	
// START Function - remoteControlFunctions
function remoteControlFunctions(e) {
	  switch (e.subtype) {
	    case Control.REMOTE_CONTROL_PLAY:
	    		Ti.API.info('Remote control Play');
	    		Ti.App.fireEvent("app:remoteAudioStartPause");
	      break;
	    case Control.REMOTE_CONTROL_PAUSE:
	    		Ti.API.info('Remote control Pause');
	    		Ti.App.fireEvent("app:remoteAudioStartPause");
	      break;
	    case Control.REMOTE_CONTROL_STOP:
	    		Ti.API.info('Remote control Stop');
	      break;
	    case Control.REMOTE_CONTROL_PLAY_PAUSE:
	    		Ti.API.info('Remote control Play/Pause');
	    		Ti.App.fireEvent("app:remoteAudioStartPause");
	      break;
	    case Control.REMOTE_CONTROL_PREV:
	   			Ti.API.info('Remote control Prev');
	   			
	   			// run callback function goToPage
	   			args.goToPage({
            		direction: "prev",
           			auto: "auto",          	
           		});
    		
	      break;
	    case Control.REMOTE_CONTROL_NEXT:
	    		Ti.API.info('Remote control Next');
	    		
	    		// run callback function goToPage
	   			args.goToPage({
            		direction: "next",
           			auto: "auto",          	
           		});
           		
	      break;
	  }
};
// END Function - remoteControlFunctions

// 					START IF - iPhone Remote Control Module and Functions							//
//////////////////////////////////////////////////////////////////////////////////////////////////////

// START Function - webViewScrollerStart - to removeAudioView
function webViewScrollStart(){	
	//Ti.API.info("Scrolling Started");
	
	// removeAudiView
	removeAudioView();
};
// END Function - webViewScrollerStart - to removeAudioView

// START Function - webViewClick - to addAudioView
function webViewClick(){
	//Ti.API.info("WebviewClicked");
	
	// addAudioView
	addAudioView();
};
// END Function - webViewClick - to addAudioView

// START Function to - removeAudioView
function removeAudioView(){
	
	// get Alloy Built In Animation
	var animation = require('alloy/animation');
	// get audioVoew visibleValue
	var audioViewVisible = $.audioView.visibleValue;
	
	// START IF - audioViewVisble true - hide $.audioView
	if (audioViewVisible){	
		//Ti.API.info("Remove Audio View");
		
		// use animation.fadeOut to hide view
		animation.fadeOut($.audioView, 500);
		// set $.audioView.visibleValue as false
		$.audioView.visibleValue = false;
		
	};
	// END IF - audioViewVisble true - hide $.audioView
		
};
// END Function to - removeAudioView

// START Function to - addAudioView
function addAudioView(){
	
	// set audioView.visible as true
	$.audioView.visible = true;
	
	// get Alloy Built In Animation
	var animation = require('alloy/animation');
	// get audioVoew visibleValue
	var audioViewVisible = $.audioView.visibleValue;
	
	// START IF - audioViewVisible false
	if (audioViewVisible == false){		
		//Ti.API.info("Add Audio View");
		
		// use animation.fadeIn to show view
		animation.fadeIn($.audioView, 500);
		
		// set $.audioView.visibleValue as true
		$.audioView.visibleValue = true;
		
	};
	// END IF - audioViewVisible false	
	
};
// END Function to - addAudioView

// set function to run when args.createAudioPlayer function is run from TextView
args.createAudioPlayer = function (createAudioPlayerData){
	
	// run createAudioPlayer
	createAudioPlayer(createAudioPlayerData);
	
};

var audioPlayerFunctions = { removeAudioPlayer: function(){},	
};

// START Function - to createAudioPlayer
function createAudioPlayer(e){
	 	
	// Include the model in app/lib/
	var audioPrepare = require('audioPrepare');
	
	// set autoPlay as e.autoPlay
	var autoPlay = e.autoPlay;
	
	// START IF - check if has audioPlayer then remove before adding new
	if ($.audioPlayer.children[0]){	
		//Ti.API.info("Remove old AudioPlayer - createAudioPlayer");
		
		// run hideAudioPlayer
		hideAudioPlayer();
	};
	// END IF - check if has audioPlayer then remove before adding new
	
	// show audioView container
 	$.audioView.bottom = 0;
 	
	// set chapterRecord as e.chapterRecord
	var chapterRecord = e.chapterRecord;
	
	// prepare audioPlayerView using audioPrepare model
	//Ti.API.info("creataAudioPlayer for Chapter Record:"); 
	//Ti.API.info(chapterRecord); 
	
	var audioPlayerData = {
		createClean:"create",
		chapterRecord:chapterRecord, 
		autoPlay:autoPlay,
		goToPage: function(goToPageData){
			// run callback function goToPage in TextView with data goToPageData from callback function in audiPrepare
			args.goToPage(goToPageData);
		},
		audioPlayerFunctions: audioPlayerFunctions,	
	};
	var audioPlayerView = audioPrepare(audioPlayerData);
	
	// add audioPlayerView to $.audioPlayer
	$.audioPlayer.add(audioPlayerView);	
	
	// START IF - IOS - set Audio info in iOS Remote
	if (OS_IOS) {
		setControlInfo(chapterRecord);
	};
	// END IF - IOS - set Audio info in iOS Remote
	
	// fireEvent app.webViewClick to make sure audioView is shown
	webViewClick();
	
};
// END Function - to createAudioPlayer

// set function to run when args.createAudioPlayer function is run from TextView
args.hideAudioPlayer = function (e){
	
	// run createAudioPlayer
	hideAudioPlayer();
	
};

// START Function - to hideAudioPlayer
function hideAudioPlayer(e){

	// START IF - check if has audioPlayer then remove
	if ($.audioPlayer.children[0]){	
		//Ti.API.info("hideAudioPlayer: Remove old AudioPlayer");
		
		// START IF - OS_IOS removeEventListener remotecontrol
		if(OS_IOS){
		// Remove Control EventListener
		Control.removeEventListener('remotecontrol', remoteControlFunctions);
		};
		// END IF - OS_IOS removeEventListener remotecontrol
		
		// FireEvent to Remove old App.eventListeners set in audioPrepare.js
		audioPlayerFunctions.removeAudioPlayer();
		
		// removeAllChildren from audioPlayer		
		$.audioPlayer.removeAllChildren();
		// set audioPlayerView as null
		audioPlayerView = null;		
	};
	// END IF - check if has audioPlayer then remove
	
	// Hide audioView container
 	$.audioView.bottom = "-60dp";
 	
};
// END Function - to hideAudioPlayer
