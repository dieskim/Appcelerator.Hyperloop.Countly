/**
 * openLastOpenView
 * - returns a function to run to open the lastOpenView if one of TextView / TopicView / questionView / selectedReadingView
 * 
 * 
 * Alloy.Globals:
 * - {@Alloy.Globals.bibleDBTextGenerate Alloy.Globals.bibleDBTextGenerate}
 * - {@Alloy.Globals.convertLanguageStrings Alloy.Globals.convertLanguageStrings}
 * - {@Alloy.Globals.textConverter Alloy.Globals.textConverter}
 * - {@Alloy.Globals.databaseData Alloy.Globals.databaseData}
 * 
 * @requires   customAlert  
 * 
 * @module openLastOpenView
 * 
 * @example    <caption>Require and run openLastOpenView to open the lastOpenView</caption> 
 * 
 * var openLastOpenView = require("openLastOpenView/openLastOpenView");
		openLastOpenView();	
 * 
 */


/**
 * Shows an alert on startup asking the user if they would like to continue reading where they were last reading
 * - if they click confirm the last view is opened at the last location they were reading
 * 
 * @return     {function}  - function that shows and alert ans then opens the last open view
 */
function openLastOpenView(){
	
	// set loadPage as false
	var loadPage = false;
	
	// get Ti.App.Properties - lastOpenView
	var lastOpenView = JSON.parse(Ti.App.Properties.getString('lastOpenView','{}'));
	
	// set params of lastOpenView Params
	var lastView = lastOpenView.lastView || "mainWindow";
	var lastOpenViewData = lastOpenView.lastOpenViewData || "";
	
	// START IF - check lastview and run appropriate event to open correct View
	if (lastView == "TextView"){
		
		// set loadPage
		loadPage = "loadText";
		
		// get chapterData
		var chapterData = lastOpenViewData;
		
		// START IF - Alloy.Globals.bibleDBTextGenerate - set updateData
		if(Alloy.Globals.bibleDBTextGenerate && Alloy.Globals.convertLanguageStrings){
			
			// set textData
			var textData = {	book: chapterData.book,
								chapter: chapterData.chapter,
								scroll: true,
			};
			
			// get bookData
			var bookData = getSetBookData({	getSet: "getBookRecord",
											bookID: chapterData.book,
						});
						
			// set categoryText bookText chapterName
			var categoryText = Alloy.Globals.textConverter(bookData.categoryLabel);
			var bookText = Alloy.Globals.textConverter(bookData.shortName);
			var chapterLabel = Alloy.Globals.textConverter(bookData.chapterLabel);
			var chapterNumber = chapterData.chapter;
			
			//set message
			var message = L("lastViewMessage") + categoryText + L("categoryBookSpacer","false") + bookText + L("bookChapterSpacer","false") + L("chapterNumberPrefix","false") + chapterNumber + L("chapterNumberPostfix","false") + chapterLabel;
			
		}else{
			
			// set lastBookName and lastChapter
			var lastBookName = chapterData.bookName;
			var lastChapter = chapterData.chapterNumber;
			
			// Use bookArraySearch and find the books chapterIdStart value
			var foundBookArrayValue = bookArraySearch(bookArray,lastBookName) || 0;
		
			// set textData
			var textData = {	book: lastBookName,
								chapter: lastChapter,
			};
			
			// START IF - Add Catagory before Book Label
			if (foundBookArrayValue<17){
				var bookText = categoryArray[0] + bookArray[foundBookArrayValue].book;
			}else if (foundBookArrayValue<22){
				var bookText = categoryArray[1] + bookArray[foundBookArrayValue].book;
			}else if (foundBookArrayValue<39){
				var bookText = categoryArray[2] + bookArray[foundBookArrayValue].book;	
			}else{
				var bookText = categoryArray[3] + bookArray[foundBookArrayValue].book;	
			};
			// END IF - Add Catagory before Book Label
			
			//set message
			var message = L("lastViewMessage") + bookText + " - " + L("chapterCounter") + lastChapter + L("chapterName");
			
		};		
		// END IF - Alloy.Globals.bibleDBTextGenerate - set updateData
		
	}else if (lastView == "TopicView"){
		
		// set loadPage
		loadPage = "loadTopic";
		
		// get topicData
		var topicData = lastOpenViewData;
		
		// START IF - Alloy.Globals.bibleDBTextGenerate - set updateData
		if(Alloy.Globals.bibleDBTextGenerate && Alloy.Globals.convertLanguageStrings){
			
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
		
			// set topicCategory
			var topicCategory = Alloy.Globals.textConverter(topicCategoryData.longTitle);
			
			// set topicTitle
			var topicTitle = Alloy.Globals.textConverter(topicData.longTitle);
			
			//set message
			var message = L("lastViewMessage") + topicCategory + L("categoryBookSpacer","false") + topicTitle;
		
		}else{
			
			// set lastTopicCategory and lastTopicNumber
			var lastTopicCategory = topicData.topicCategory;
			var lastTopicNumber = topicData.topicNumber;
			
			// get topicArrayValue
			var foundTopicArrayValue = topicArraySearch(topicArray,lastTopicCategory);
			
			// set topicData
			var topicData = {			
				topicCategory: lastTopicCategory,
				topicNumber: lastTopicNumber,
			};
			
			//set message
			var message = L("lastViewMessage") + " - " + topicArray[foundTopicArrayValue].topic + " - " + topicArray[foundTopicArrayValue].topicTitles[lastTopicNumber-1];
		
		};
		// END IF - Alloy.Globals.bibleDBTextGenerate - set updateData	
		
	}else if (lastView == "questionView"){
		
		// set loadPage
		loadPage = "loadQuestion";
		
		// get topicData
		var questionData = lastOpenViewData;
		
		//set message
		var message = L("lastViewMessage") + L("questions");
		
	}else if (lastView == "selectedReadingView"){
		
		// set loadPage
		loadPage = "loadSelectedReading";
		
		// get selectedReadingData
		var selectedReadingData = lastOpenViewData;
		
		// set selectedReadingCategory and selectedReadingNumber
		var selectedReadingCategory = selectedReadingData.selectedReadingCategory;
		var selectedReadingNumber = selectedReadingData.selectedReadingNumber;
		
		// set selectedReadingData
		var selectedReadingData = {	selectedReadingCategory:selectedReadingCategory,
									selectedReadingNumber:selectedReadingNumber ,};
		
		//get selectedReadingName and title from database				
		var selectedReadingName = getSetDatabaseData("getSelectedReadingName",selectedReadingData);
		var selectedReadingTitle = getSetDatabaseData("getSelectedReadingTitle",selectedReadingData);
							
		//set message
		var message = L("lastViewMessage") + "《" + selectedReadingName + "》" + selectedReadingTitle;
		
	};
	// END IF - check lastview and run appropriate event to open correct View
	
	Ti.API.info("LastPage to Load: " + loadPage);
	
	// START IF - loadPage not false show popup
	if (loadPage != false){
		
		// set createAlert Dialog params
		var confirm = L("lastViewConfirm");
		var cancel =  L("lastViewCancel");
		var title = L("lastViewTitle");
	
		// require module customAlert in app/assets/lib/
		var customAlert = require('customAlert/customAlert');
		
		//createAlert AlertDialog with params		
		var notificationData = {
			cancelIndex: 0,
			buttonNames: [cancel,confirm],
			message: message,
			title: title,
			alertName: "openLastOpenViewAlert",
			click: function(e){
						Titanium.API.log("ButtonIndex" + e.index);
						//START IF - Cancel Clicked close ELSE
					    if (e.index == 1){    			      		
					      	Ti.API.info('The Continue reading was Clicked');	   
					      	
					      	// START IF - loadText run correct Function
					      	if (loadPage == "loadText"){
					      		
					      		loadText(textData);
								
					      	}else if (loadPage == "loadTopic"){
					      		
					      		loadTopic(topicData);
					      		
					      	}else if (loadPage == "loadSelectedReading"){
					      		
					      		loadSelectedReading(selectedReadingData);
					      		
					      	}else if(loadPage == "loadQuestion"){
					      		
					      		loadQuestion(questionData);
					      		
					      	};
					      	// END IF - loadText run correct Function	
					      				 				    
						}else{
							
							Ti.API.info('The Return to Home was Clicked');
							
						};	
						//END IF - Cancel Clicked close ELSE
			},
	};	
	
	// show AlertDialog notification
	customAlert.show(notificationData);
	
	// Set Ti.App.Properties - lastOpenView as blank
	Ti.App.Properties.setString('lastOpenView',JSON.stringify('{}'));
		
	};
	// START IF - loadPage not false show popup
	
};

module.exports = openLastOpenView;