// Add App eventlistener to listen for app:navigationCloseView
Ti.App.addEventListener("app:navigationCloseView", closeView);

function closeView(){
	//Ti.API.info("app:navigationCloseView in TextView");
	
	Ti.App.removeEventListener("app:webViewClick", webViewClick);
	Ti.App.removeEventListener("app:webViewScrollStart", webViewScrollStart);
	Ti.App.removeEventListener("app:webViewScrollStop", webViewScrollStop);	
	Ti.App.removeEventListener("app:goToPageFontSizeReload", goToPageReload);	
	Ti.App.removeEventListener("app:navigationCloseView", closeView);	
	
	// FireEvent to Remove old App.eventListeners set in audioPrepare.js		
	audioPlayerData.hideAudioPlayer();
	
	// clear chapterTimer via chapterTimerData.clear()
	chapterTimerData.clear();
	
	// clearTimeout Alloy.Globals.audioTimer
	if (Alloy.Globals.audioTimer){
		Alloy.Globals.audioTimer.clear();
	};
	
};

// START FUNCTION - changeButton
function changeButton(actionValue,chapterData){
	
	// Get values from function
	var action = actionValue;
		
	// START IF - action and set title and data
	if (action == 'new'){
		
		// get bookData
		var bookData = getSetBookData({	getSet: "getBookRecord",
										bookID: chapterData.book,
						});
						
		// START IF - Book Psalms different chapter name
		if (bookData.bookID == 19){
			var convertedChapterName = L("psalms_title");
		}else{
			var convertedChapterName = L("chapter_title");	
		}		
		// END IF - Book Psalms different chapter name
		
		// set bookNameString
		var bookNameString = bookData.shortName;
		var convertedBookName = Alloy.Globals.textConverter(bookNameString);
		
		$.menu_button.bookData = bookData;
		$.menu_button.chapter = chapterData.chapter;
		
		// setLastOpenView
		setLastOpenView("TextView",chapterData);
		
	}
	// if scrolled to next change to next chapter name
	else if (action == "next"){
		
		// Get current Button values
		var current_menu_bookData = $.menu_button.bookData;
		var current_menu_chapter = $.menu_button.chapter;
		
		// START IF - next chapter in current book else next book first chapter		
		if (Number(current_menu_chapter) < Number(current_menu_bookData.chapterCount)){
		
			// set next chapter vars
			var nextBookData =  current_menu_bookData;
			var bookName = current_menu_bookData.shortName;
			var chapterNumber = +current_menu_chapter + 1;
			
			// START IF - Book Psalms different chapter name
			if (current_menu_bookData.bookID == 19){
				var convertedChapterName = L("psalms_title");
			}else{
				var convertedChapterName = L("chapter_title");	
			}		
			// END IF - Book Psalms different chapter name
			
		}else{

			// set while vars
			var b = 1;
			var nextBookActive = false;
						
			// START WHILE - 
			while (!nextBookActive) {
   				
   				// set nextBook
				var nextBook = parseInt(current_menu_bookData.bookID,10) + b;
				
				// get nextBookData
				var nextBookData = getSetBookData({	getSet: "getBookRecord",
													bookID: padZero(nextBook, 2),
							});
				
				// set nextBookActive
				nextBookActive = nextBookData.isActive;
				
				// advance b
   				b++;
   				
			};
			// END WHILE - 
					
			// set next chapter vars
			var nextBookData =  nextBookData;
			var bookName = nextBookData.shortName;
			var chapterNumber = '1';
			
			// START IF - Book Psalms different chapter name
			if (nextBookData.bookID == 19){
				var convertedChapterName = L("psalms_title");
			}else{
				var convertedChapterName = L("chapter_title");	
			}		
			// END IF - Book Psalms different chapter name
		
		};
		// END IF - next chapter in current book else next book first chapter
		
		// Convert and set TopicTitle
		var bookNameString = bookName;
		var convertedBookName = Alloy.Globals.textConverter(bookNameString);
		
		// Update Menu Title
		$.menu_button.bookData = nextBookData;
		$.menu_button.chapter = chapterNumber;
		
		// set chapterData
		var chapterData = {
			book: nextBookData.bookID,
			chapter: chapterNumber,
		};
		
		// setLastOpenView
		setLastOpenView("TextView",chapterData);

	}
	// if prev change to prev chapter name
	else if (action == "prev"){
		
		// Get current Button values
		var current_menu_bookData = $.menu_button.bookData;
		var current_menu_chapter = $.menu_button.chapter;
		
		if (Number(current_menu_chapter) == "1"){
		
			// set while vars
			var b = 1;
			var prevBookActive = false;
			
			// START WHILE - 
			while (!prevBookActive) {
   				
   				// set prevBook
				var prevBook = parseInt(current_menu_bookData.bookID,10) - b;
				
				// get prevBookData
				var prevBookData = getSetBookData({	getSet: "getBookRecord",
													bookID: padZero(prevBook, 2),
							});
				
				// set prevBookActive
				prevBookActive = prevBookData.isActive;
				
				// advance b
   				b++;
   				
			};
			// END WHILE - 
			
			// set prev chapter vars
			var prevBookData =  prevBookData;
			var bookName = prevBookData.shortName;
			var chapterNumber = prevBookData.chapterCount;
			
			// START IF - Book Psalms different chapter name
			if (prevBookData.bookID == 19){
				var convertedChapterName = L("psalms_title");
			}else{
				var convertedChapterName = L("chapter_title");	
			}		
			// END IF - Book Psalms different chapter name
					
		}else{
			
			// set prev chapter vars
			var prevBookData =  current_menu_bookData;
			var bookName = current_menu_bookData.shortName;
			var chapterNumber = +current_menu_chapter - 1;
			
			// START IF - Book Psalms different chapter name
			if (current_menu_bookData.bookID == 19){
				var convertedChapterName = L("psalms_title");
			}else{
				var convertedChapterName = L("chapter_title");	
			}		
			// END IF - Book Psalms different chapter name
			
		};
		
		// Convert and set TopicTitle
		var bookNameString = bookName;
		var convertedBookName = Alloy.Globals.textConverter(bookNameString);	
		
		// Update Menu Title
		$.menu_button.bookData = prevBookData;
		$.menu_button.chapter = chapterNumber;
		
		// set chapterData
		var chapterData = {
			book: prevBookData.bookID,
			chapter: chapterNumber,
		};
		
		// setLastOpenView
		setLastOpenView("TextView",chapterData);
		
	};	
	// END IF - action and set title and data
	
};
// END FUNCTION - changeButton

///////////////////////////////////////////////////////////
// 			START - Function to goToPage				//
function goToPage(e){ 
	
	// set direction 
	var direction = e.direction;
	
	// set auto
	var auto = e.auto;
	
	// get Ti.App.Properties - lastOpenView
	var lastOpenView = JSON.parse(Ti.App.Properties.getString('lastOpenView','{}'));
	
	// set chapterData
	var chapterData = lastOpenView.lastOpenViewData;
	
	// START IF - direction next 
	if (direction == "next"){
		
		// get chapterDatabaseData
		var chapterDatabaseData = getSetBookData({	getSet: "getChapterRecord",
													bookID: chapterData.book,
													chapterNum: chapterData.chapter,
						});
		
		// set currentPage
		var currentPage = chapterDatabaseData.rowid;
		
		// set nextPage
		var nextPage = (+currentPage+1);
		
		// set totalChapterAmount as count of table in database
		var totalChapterAmount = databaseConnect({
				database: Alloy.Globals.databaseData.bibleText.databaseName,
				table: "chapters",
				method:"count", 
		});
		
		// START IF - currentPage is smaller than totalChapterAmount
		if (currentPage < totalChapterAmount){
			
			// get nextChapterRecord
			var nextChapterRecord = getSetBookData({	getSet: 'getChapterRecordByRow',
														rowNum: nextPage,
			});	
						
			// Set chapterData to be passed to createScroller	
			var chapterData = {
				book: nextChapterRecord.bookID,
				chapter: nextChapterRecord.chapterNumber, 
			};
			
			// createScroller	
			createScroller(chapterData,auto,direction);
			
		};
      	// START IF - currentPage is smaller than totalChapterAmount
      	
	}else if (direction == "prev"){ 
		
		// get chapterDatabaseData
		var chapterDatabaseData = getSetBookData({	getSet: "getChapterRecord",
													bookID: chapterData.book,
													chapterNum: chapterData.chapter,
						});
		
		// set currentPage
		var currentPage = chapterDatabaseData.rowid;
		
		// set prevPage
		var prevPage = (+currentPage-1);
		
		// START IF - currentPage is bigger than 0 
		if (currentPage > 0){
			
			// get prevChapterRecord
			var prevChapterRecord = getSetBookData({	getSet: 'getChapterRecordByRow',
														rowNum: prevPage,
			});	
						
			// Set chapterData to be passed to createScroller	
			var chapterData = {
				book: prevChapterRecord.bookID,
				chapter: prevChapterRecord.chapterNumber, 
			};
			
			// createScroller	
			createScroller(chapterData,auto,direction);
			
		};
		// END IF - currentPage is bigger than 0 
		
	}else if (direction == "index"){
				
			// change chapterData.scroll to true to scroll to last location and not to hightlightStart
			chapterData.scroll = true;
			
			// createScroller
			createScroller(chapterData,auto,direction);	
				
	}
	// END IF - direction previouse
			
};
// 				END - Function to goToPage				 //
///////////////////////////////////////////////////////////


//////////////////////////////////////////////
// 		Start showBookMenu Function 		//
	
function showBookMenu(){ 
	
	///////////////////////////////////////////////////////////////
	// 				START  - ADDING ACTIVITYLOADER VIEW			//
	
	// set currentWindow
	var mainWindow = Alloy.Globals.openWindow;
			
	// require module activityLoader and add to currentWindow
	var activityLoaderFunction = require('activityLoader/activityLoader');
	var activityLoader = activityLoaderFunction();
	mainWindow.add(activityLoader);
			
	// 				END - ADDING ACTIVITYLOADER VIEW			 //	
	///////////////////////////////////////////////////////////////
		
	var bookMenu = Alloy.createController('bookMenu').getView();
	bookMenu.open();
	
	// REMOVE ACTIVITYLOADER VIEW
	mainWindow.remove(activityLoader);
			
};	
//   		End showBookMenu Function 		    //
//////////////////////////////////////////////

///////////////////////////////////////////////////////////
// START - Function to run after chapterOpenedFunction	//
function chapterOpenedFunction(e){ 
	
	// set chapterOpenedID
	var chapterOpenedID = e.pageIndex;
	
	// prepare chapterRecord
	var chapterRecord = getSetBookData({	getSet: 'getChapterRecordByRow',
											rowNum: (+chapterOpenedID + 1),
	});	
	
	// START IF - check if auto is set and set autoPlay accordingly
	if (e.auto != undefined){
		var autoPlay = e.auto;
	}else{
		
		// START IF - if audio is playing and next click set autoplay auto
		if (Alloy.Globals.shouldBePlaying == true){
			var autoPlay = "auto";
		}else{
			var autoPlay = "notAuto";
		};
		// end IF - if audio is playing and next click set autoplay auto
		
	};
	// END IF - check if auto is set and set autoPlay accordingly
	
	// START - ChapterTimer Functions - clear old timer then start new timer
	
	// clear chapterTimer via chapterTimerData.clear()
	chapterTimerData.clear();
	
	// clearTimeout Alloy.Globals.audioTimer
	if (Alloy.Globals.audioTimer){
		Alloy.Globals.audioTimer.clear();
	};
	
	// create chapterTimer via chapterTimerData.create();
	chapterTimerData.create(chapterRecord);   
	
	// END - ChapterTimer Functions - clear old timer then start new timer
	
	//////////////////////////////////////////////////////////////////////////////
	//     START getAudioExist and add audioPlayer IF exist else nothing		//
					
	// set audioExist
	var audioExist = getSetBookData({	getSet: "getAudioExist",
										bookID: chapterRecord.bookID,
	});
	//Ti.API.info("bookID: " + chapterRecord.bookID + " audioExist: " + audioExist);
		// START IF AudioExist
		if (audioExist){
			
			// set audioPlayerData
			var createAudioPlayerData = {
		    	autoPlay: autoPlay,
		       	chapterRecord: chapterRecord,    	
		    };
		    
		    // run audioPlayerData.createAudioPlayer with createAudioPlayerData
		    audioPlayerData.createAudioPlayer(createAudioPlayerData);
		    
		}else{
			
			// run audioPlayerData.hideAudioPlayer
			audioPlayerData.hideAudioPlayer();
						
		};
		// END IF AudioExist
	
	//     END getAudioExist and add audioPlayer IF exist else nothing		//
	//////////////////////////////////////////////////////////////////////////////

};
// END - Function to run after chapterOpenedFunction //
///////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////
//					START FUNCTION create scroller with data		  	//

// START FUNCTION createScroller
function createScroller(chapterData,auto,direction){

	// Include the virtualTextScroller module in app/lib/virtualTextScroller/virtualTextScroller.js
	var virtualTextScrollerModule = require('virtualTextScroller/virtualTextScroller');
	
	// set totalChapterAmount as count of table in database
	var totalChapterAmount = databaseConnect({
			database: Alloy.Globals.databaseData.bibleText.databaseName,
			table: "chapters",
			method:"count", 
	});
	
	// START IF - actionValue = direction else new 
	if (direction != undefined){
		var actionValue = direction;
	}else{
		var actionValue = 'new';
	};
	// END IF - actionValue = direction else new
		
	// START IF - Check if has scroller and remove
	if ($.TextScrollBox.children[0]){	
		//Ti.API.info("Remove old Scroller");
		
		// fire app:createScrollerRemove
		Ti.App.fireEvent("app:createScrollerRemove");
			
		// Remove all children
		$.TextScrollBox.removeAllChildren();
		
		// set virtualTextScroller null
		virtualTextScrollerScrollText = null;	
		
	};
	// END IF - Check if has scroller and remove	
	
	// set chapterRecord
	var chapterRecord = getSetBookData({	getSet: "getChapterRecord",
											bookID: chapterData.book,
											chapterNum: chapterData.chapter,
	});
	
	// Set startChapterID
	var startChapterID = (+chapterRecord.rowid-1) || '0';
	
	//Ti.API.info(chapterData);
	//Ti.API.info(chapterRecord);	
	
	///////////////////////////////////////////////////////////////
	//			Get fontSize and prepareHTML					//
		
	// include module and set fontSize
	var getSetFontSize = require('getSetFontSize/getSetFontSize');
	var fontSize = getSetFontSize("getValue");
	
	// reguire prepareHTML
	var prepareHTML = require('prepareHTML/prepareHTML');
	
	// reguire getChapterFromDB
	var getChapterFromDB = require('getChapterFromDB');
			
	///////////////////////////////////////////////////////////////	
	// Set virtualTextScroller as virtualTextScrollerModule with Webview
	var virtualTextScroller = virtualTextScrollerModule({
		getView: function(i) {
			
			// set currentLoopChapterID as i for database generatrion of chapter
			var currentLoopChapterID = i;
	
			// START IF - currentLoopChapterID is startChapterID
			if(currentLoopChapterID == startChapterID){
				
				// set scrollVar
				if (chapterData.scroll){
						
					// set scrollLocation
					var lastReadLocationData = JSON.parse(Ti.App.Properties.getString("lastReadScrollLocation","{}"));			
					var scrollLocation = lastReadLocationData.scrollLocation;
					
					// set scrollData
					var scrollData = {	scrollVar: 'lastLocation',
										scrollLocation: scrollLocation,							
					};
		 	
				}else if(chapterData.highlightStart && chapterData.highlightEnd){
									
					// set scrollData
					var scrollData = {	scrollVar: 'highlightStart',
										scrollLocation: false,								
					};
								
				}else{
								
					// set scrollData
					var scrollData = {	scrollVar: false,
										scrollLocation: false,								
					};
								
				};
				// END IF - check if should scroll and set shouldScroll
	
				// START IF - chapterData.highlightStart && chapterData.highlightEnd
				if (chapterData.highlightStart && chapterData.highlightEnd){
					
					// set pageText
					var pageText = getChapterFromDB(currentLoopChapterID,chapterData.highlightStart,chapterData.highlightEnd);
								
				}else{
					
					// set pageText
					var pageText = getChapterFromDB(currentLoopChapterID);
				
				};
				// END IF - chapterData.highlightStart && chapterData.highlightEnd
				
				// convert pageText to U Text to fix problems
				var convertedPageText = Alloy.Globals.textConverter(pageText, false);
				
				// START IF - scrollData.scrollVar
				if (scrollData.scrollVar){
					
					// get html from prepareHTML using fontSize and pageText and scrollData
					// set prepareHTMLData
					var prepareHTMLData = {	fontSize:fontSize,
											contentHTML: convertedPageText,
											scrollData: scrollData,
					};
					
					// generate html
					var html = prepareHTML(prepareHTMLData);
						
				}else{
					
					// get html from prepareHTML using fontSize and pageText
					var prepareHTMLData = {	fontSize:fontSize,
											contentHTML: convertedPageText,
					};
					
					// generate html
					var html = prepareHTML(prepareHTMLData);
					
				};
				// END IF - scrollData.scrollVar	
					
			}else{
				
				// set pageText
				var pageText = getChapterFromDB(currentLoopChapterID);
				
				// convert pageText to U Text to fix problems
				var convertedPageText = Alloy.Globals.textConverter(pageText, false);
			 	
			 	// get html from prepareHTML using fontSize and pageText
			 	// set prepareHTMLData
				var prepareHTMLData = {	fontSize:fontSize,
										contentHTML: convertedPageText,
				};
					
				// generate html
				var html = prepareHTML(prepareHTMLData);
			
			};
			// END IF - currentLoopChapterID is startChapterID
			
			//Define webview creation
			var web_view = Ti.UI.createWebView({
					html: html,								
					scalesPageToFit : false, 
					enableZoomControls : false,
					pageIndex: currentLoopChapterID,
					borderRadius: 0.1,
					backgroundColor: "#F1EECD",
					hideLoadIndicator: true,
					loadValue: "start",
				});		
			
			// addEventListener to show activityIndicator
			web_view.addEventListener('beforeload', function(){
				
				// START IF - web_view.loadValue is start then show load activity			
				if (web_view.loadValue == "start"){
					//Ti.API.info("Webview Load Start");
					activityIndicator.show();
					web_view.loadValue	= true;
				};
				// END IF - web_view.loadValue is start then show load activity
				
			});
				
			// addEventListener to hide activityIndicator
			web_view.addEventListener('load', function() {		
				
				// START IF - web_view.loadValue is true then hide load activity
				if (web_view.loadValue == true){
					//Ti.API.info("Webview Load Complete");
					activityIndicator.hide();
					web_view.loadValue	= false;				
				};
				// END IF - web_view.loadValue is true then hide load activity
				
			});
			
	        return web_view;
	    },
	    scrollerDirectionChange: function(directionData) {
	    	var directionChange = directionData.direction;
	    	// Set Next Chapter Actions
			if (directionChange == "next"){
				changeButton("next");
				chapterOpenedFunction(directionData);	
			}
			// Set Prev Chapter Actions
			else if (directionChange == "prev") {			
				changeButton("prev");
				chapterOpenedFunction(directionData);
			}	
	    },	
		start: startChapterID,
	    itemCount: totalChapterAmount,
	});
	
	// set virtualTextScrollerText
	var virtualTextScrollerScrollText = virtualTextScroller.view;
	
	//  End Create Scrollable view of Chapters  //
	//////////////////////////////////////////////
			
	// Add virtualTextScrollerScrollText to TextScrollBox View
	$.TextScrollBox.add(virtualTextScrollerScrollText);
	
	///////////////////////////////////////////////////////////////
	// 				START  - ADDING ACTIVITYLOADER VIEW			//
			
	// require module activityLoader and add to currentWindow
	var activityLoaderFunction = require('activityLoader/activityLoader');
	var activityIndicator = activityLoaderFunction();
	activityIndicator.hide();
	
	// add activityIndicator to $.TextScrollBox
	$.TextScrollBox.add(activityIndicator);
			
	// 				END - ADDING ACTIVITYLOADER VIEW			 //	
	///////////////////////////////////////////////////////////////
	
	// START IF - auto is undefined set as notAuto else set as auto
	if (auto != undefined){	
		var auto = auto;	
	}else{
		
		// START IF - if audio is playing and next click set autoplay auto
		if (Alloy.Globals.shouldBePlaying == true){
			var auto = "auto";
		}else{
			var auto = "notAuto";
		};
		// end IF - if audio is playing and next click set autoplay auto
		
	};
	// END IF - auto is undefined set as notAuto else set as auto
	
	// Change the ChapterMenu Button value
	changeButton(actionValue,chapterData);
	
	// Run chapterOpenedFunction with startpage, auto 
	chapterOpenedFunction({   
	            pageIndex: startChapterID,  
	            auto: auto, 
	            });

};
// END FUNCTION createScroller

//					END FUNCTION create scroller with data		  			//
/////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////
//  Start Open Window with Appropriate chapter loaded or Gen1 as default  //

// Set Args passed from other windows as args
var args = arguments[0] || {};

// Set chapterData to be passed to createScroller	
var chapterData = args.chapterData;

// START SET - audioPlayer
var audioPlayerData = { goToPage: function(goToPageData){
										// run gotToPage with data from audioPlayer callback
										goToPage(goToPageData);
									},	
						createAudioPlayer: function(){},
						hideAudioPlayer:  function(){},
						webViewClick: function(){},
						webViewScrollStart: function(){},					
						};
var audioPlayer = Alloy.createController('audioPlayer',audioPlayerData).getView(); 
$.textWindow.add(audioPlayer);
// END SET - audioPlayer

// START SET - chapterTimer
// set chapterTimer var
var chapterTimer;
			
// set chapterTimerData to create and clear chapterTimer
var chapterTimerData = {	create: function(chapterRecord){									
									chapterTimer = setTimeout(function(){ logChapterRead(chapterRecord); }, Alloy.Globals.chapterReadTimerTime); // set timeout to logChapterRead after 60 seconds					
							},
							clear: function(){
									clearTimeout(chapterTimer);
							},
};
// END SET - chapterTimer

// Create Scroller with Initial Id as set from loadView function on previouse pages
createScroller(chapterData);

// Add App eventlistener to listen for webViewClick from webview jquerymobile
Ti.App.addEventListener("app:webViewClick", webViewClick);

function webViewClick(){
	audioPlayerData.webViewClick();
};

// Add App eventlistener to listen for webViewScrollStart from webview jquerymobile
Ti.App.addEventListener("app:webViewScrollStart", webViewScrollStart);

function webViewScrollStart() {
	audioPlayerData.webViewScrollStart();
};

// Add App eventlistener to listen for webViewScrollStop from webview jquerymobile
Ti.App.addEventListener('app:webViewScrollStop',webViewScrollStop);

function webViewScrollStop(e) {

	// Set Ti.App.Properties - lastReadScrollLocation
	Ti.App.Properties.setString("lastReadScrollLocation",JSON.stringify({scrollLocation: e.scrollLocation})); // TO DO FUTURE FEATURE - set location as top of verse - scroll to verse after font size change
		
};

// Add App eventlistener to listen for chapter Change from anywhere in app
Ti.App.addEventListener("app:goToPageFontSizeReload", goToPageReload);

function goToPageReload(goToPageData) {
	goToPage(goToPageData);
};

//  End Open Window with Appropriate chapter loaded or Gen1 as default  //
//////////////////////////////////////////////////////////////////////////