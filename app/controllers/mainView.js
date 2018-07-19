// set Alloy.Globals.openWindow
Alloy.Globals.openWindow = $.mainWindow;

// Ti.App.addEventListner to listen for setOpenWindow
Ti.App.addEventListener("app:setOpenWindow", setOpenWindow);

function setOpenWindow(){	
	Alloy.Globals.openWindow = $.mainWindow;		
};

// Ti.App.addEventListner to listen for goHome
Ti.App.addEventListener("app:returnHome", returnHome);

function returnHome(){
	$.indexScrollView.scrollTo(0,0);
	$.scrollView_1.scrollTo(0,0);
	$.scrollView_2.scrollTo(0,0);
	$.scrollView_3.scrollTo(0,0);
	$.scrollView_4.scrollTo(0,0);
};

// START FUNCTION - openBookCategory
function openBookCategory(e)
{
	// set openView
	var openView = this.openView;
	
	// START IF - openView nt / ot / psalms
	if(openView == "nt"){
		
		// open nt index page
		var openData = {openCloseView: "ntCategory",
		};
		
		// run openNavigationView
		navigationOpenClose.openNavigationView(openData);
		
		// set openViewLatin
		var openViewLatin = L("ntLatin", "false");
		
	}else if (openView == "ot"){
		
		// open otCategory page
		var openData = {openCloseView: "otCategory",
		};
		
		// run openNavigationView
		navigationOpenClose.openNavigationView(openData);
		
		// set openViewLatin
		var openViewLatin = L("otLatin", "false");
		
	}else if(openView == "psalms"){
		
		// START RUN - loadText - open Psalms 1
		loadText({	book: 19,
					chapter: 1,
		});	
		
		// set openViewLatin
		var openViewLatin = L("psalmsLatin", "false");
		
	};
	// END IF - openView nt / ot / psalms
		
	// Send analytics data
	var eventData = {eventType: "homeScreenButtonPressed",
					eventName: "Home Screen Button Pressed", 
					eventVars: {"Category": "Books",
								"Button": openViewLatin},
				};
	Alloy.Globals.AnalyticsEvent(eventData);
	
};
// END FUNCTION - openBookCategory

// START adjust spacing based on orientation
Ti.App.addEventListener('orient', bookButtonOrientUpdate);

function bookButtonOrientUpdate(evt) {
	
	Ti.API.log("bookButtonOrientUpdate");
	
	// START IF - Portrait else
    if(evt.portrait===true) {
    	
    	if(Alloy.isHandheld){
    		var bookCategoryHeightVar = "65dp";
  		}else{
    		var bookCategoryHeightVar = "120dp";
    	};
    
    	$.leftPadding.applyProperties({
   			width: "0%",
    	});
		$.ntCategoryImage.applyProperties({
			   			width: "33%",
			   			height: bookCategoryHeightVar
			    	});
		$.psalmsCategoryImage.applyProperties({
			   			width: "33%",
			   			height: bookCategoryHeightVar
			    	});
		$.otCategoryImage.applyProperties({
			   			width: "33%",
			   			height: bookCategoryHeightVar
			    	});
			    	
	}else{
		
		if(Alloy.isHandheld){
    		var bookCategoryHeightVar = "85dp";
    	}else{
    		var bookCategoryHeightVar = "130dp";
    	};
    
		$.leftPadding.applyProperties({
   						width: "3.5%",
    	});
		$.ntCategoryImage.applyProperties({
			   			width: "31%",
						height: bookCategoryHeightVar,
			    	});
		$.psalmsCategoryImage.applyProperties({
			   			width: "31%",
						height: bookCategoryHeightVar,
			    	});
		$.otCategoryImage.applyProperties({
			   			width: "31%",
						height: bookCategoryHeightVar,
			    	});
		
	};
	// END IF - Portrait else
};

// get startup portrait and run buttonsOrientUpdate
var isPortrait = isOrientationPortrait();
var startupEvt = {portrait: isPortrait};

// run buttonsOrientUpdate
bookButtonOrientUpdate(startupEvt);
	
// END adjust spacing based on orientation

	// START IF HANDHELD ELSE - to set Top and Right for Right to Left
	if (Alloy.isHandheld == true){		
		var topicWidthValue = "140dp";
		var topicHeightValue = "140dp";			
	}else{
		var topicWidthValue = "220dp";
		var topicHeightValue = "220dp";		
	};
	// END IF HANDHELD ELSE - to set Top and Right for Right to Left

	// POPULATE PROPHETS ARRAY
	var prophets = [{
		prophetID: 0,
	    bookID: "01",
	    chapter: 37,
	    prophetName:"Joseph"
	},
	{
		prophetID: 1,
	    bookID: "02",
	    chapter: 2,
	    prophetName:"Moses"
	},
	{
		prophetID: 2,
	    bookID: "01",
	    chapter: 22,
	    prophetName:"Abraham"
	},
	{
		prophetID: 3,
	    bookID: "01",
	    chapter: 2,
	    prophetName:"Adam"
	},
	{
		prophetID: 4,
	    bookID: "01",
	    chapter: 6,
	    prophetName:"Noah"
	},
	{
		prophetID: 5,
	    bookID: "02",
	    chapter: 4,
	    prophetName:"Aaron"
	},
	{
		prophetID: 6,
	    bookID: "42",
	    chapter: 1,
	    prophetName:"Mary"
	},
	{
		prophetID: 7,
	    bookID: "27",
	    chapter: 1,
	    prophetName:"Daniel"
	},
	{
		prophetID: 8,
	    bookID: "32",
	    chapter: 1,
	    prophetName:"Jonah"
	},
	{
		prophetID: 9,
	    bookID: "11",
	    chapter: 3,
	    prophetName:"Solomon"
	},
	{
		prophetID: 10,
	    bookID: "09",
	    chapter: 17,
	    prophetName:"David"
	},
	{
		prophetID: 11,
	    bookID: "40",
	    chapter: 1,
	    prophetName:"Jesus"
	}];
	// END POPULATE PROPHETS ARRAY
	
	// START LOOP TO POPULATE PROHPETS
	for (var b=0; b<prophets.length; b++){
		
	var topicButton = Ti.UI.createButton({
			backgroundImage: "/images/prophet_images/prophet_"+(b)+".jpg",
			backgroundSelectedImage: "/images/prophet_images/prophet_"+(b)+"_clicked.jpg",
			prophetID: b,
			width: topicWidthValue,
			height:  topicHeightValue,
		    }); 	
	
	// add eventListener to button
	topicButton.addEventListener('click', function(e){
		
		// set prophetID
		var prophetID = this.prophetID;
		
		var book = prophets[prophetID].bookID;
		var chapter = prophets[prophetID].chapter;
		var prophetName = prophets[prophetID].prophetName;
		
		// Send analytics data
		var eventData = {eventType: "homeScreenButtonPressed",
						eventName: "Home Screen Button Pressed", 
						eventVars: {"Category": "Prophets",
									"Button": prophetName},
					};
		Alloy.Globals.AnalyticsEvent(eventData);
		
		// run loadText
		loadText({	book: book,
					chapter: chapter,
		});
					
	});
	
	// add topicButton to correct scrollView
	if (b<6) {
		$.scrollView_1.add(topicButton);
	} else {
		$.scrollView_2.add(topicButton);	
	}	
	
		
	};
	// END LOOP TO POPULATE PROHPETS
	
	// START LOOP TO POPULATE TOPIC AREAS
	
	// get topic Title from DB
	var topicCategoriesArray = databaseConnect({
			database: Alloy.Globals.databaseData.topicData.databaseName,
			table: "topicCategories",
			method:"getAllTableValues",
			orderBy: "homeDisplayOrder",
	});
	
	for (var b=0; b<topicCategoriesArray.length-1; b++){
		
		// set topicCategoryData
		var topicCategoryData = topicCategoriesArray[b];	
	
		// set topicCategoryID
		var topicCategoryID = topicCategoryData.id;
		
		// set topicButton
		var topicButton = Ti.UI.createButton({
				backgroundImage: "/images/home_screen/topic_category_"+topicCategoryID+".jpg",
				backgroundSelectedImage: "/images/home_screen/topic_category_"+topicCategoryID+"_clicked.jpg",
				topicCategoryData: topicCategoryData,		
				width: topicWidthValue,
				height:  topicHeightValue,
			    }); 	
		
		topicButton.addEventListener('click', function(e){
			
			var topicCategoryData = this.topicCategoryData;	
			
			// Send analytics data
			var eventData = {eventType: "homeScreenButtonPressed",
							eventName: "Home Screen Button Pressed", 
							eventVars: {"Category": "Topics",
										"Button": topicCategoryData.shortTitleLatin},
						};
			Alloy.Globals.AnalyticsEvent(eventData);
			
			loadCategory(topicCategoryData);
			
		});
			
		// START IF - first 6 in first row 
		if (b<6){
		// Add button to correct row
			$.scrollView_3.add(topicButton);
		}else{
			$.scrollView_4.add(topicButton);
		};
		// END IF - first 6 in first row 
		
	
	};
	// END LOOP TO POPULATE TOPIC AREAS

	// START ADD QOD IMAGE BUTTON
	var questionButton = Ti.UI.createButton({
			backgroundImage: "/images/home_screen/qod_category.jpg",
			backgroundSelectedImage: "/images/home_screen/qod_category_clicked.jpg",
			width: topicWidthValue,
			height:  topicHeightValue,
		    }); 	
	
	questionButton.addEventListener('click', function(e){
		
		// Send analytics data
		var eventData = {eventType: "homeScreenButtonPressed",
						eventName: "Home Screen Button Pressed", 
						eventVars: {"Category": "Topics",
									"Button": "Questions"},
						};
			Alloy.Globals.AnalyticsEvent(eventData);
		
		// open questionCategories Window with Args
		var openData = {openCloseView: "questionCategories",
		};
		
		// run openNavigationView
		navigationOpenClose.openNavigationView(openData);
		
	});
	$.scrollView_4.add(questionButton);
	
	// END ADD QOD IMAGE BUTTON	
	
	// START ADD EMPTY BUTTON
	var buttonHalfWidth = (Math.round(parseInt(topicWidthValue,10)/3)).toString() + "dp";
	var buttonHalfHeight = (Math.round(parseInt(topicHeightValue,10)/3)).toString() + "dp";
	
	//Ti.API.info("buttonHalfWidth: " + buttonHalfWidth);
	//Ti.API.info("buttonHalfHeight: " + buttonHalfHeight);
	
	var emptyButton = Ti.UI.createButton({
		width: buttonHalfWidth,
		height: buttonHalfHeight,
		visible: false,
		touchEnabled: false,
	});
	var emptyButton2 = Ti.UI.createButton({
		width: buttonHalfWidth,
		height: buttonHalfHeight,
		visible: false,
		touchEnabled: false,
	});
	var emptyButton3 = Ti.UI.createButton({
		width: buttonHalfWidth,
		height: buttonHalfHeight,
		visible: false,
		touchEnabled: false,
	});
	var emptyButton4 = Ti.UI.createButton({
		width: buttonHalfWidth,
		height: buttonHalfHeight,
		visible: false,
		touchEnabled: false,
	});
		
	$.scrollView_1.add(emptyButton);
	$.scrollView_2.add(emptyButton2);
	$.scrollView_3.add(emptyButton3);
	$.scrollView_4.add(emptyButton4);
	// END ADD EMPTY	

// set dailyContentScroller
var dailyContentScroller = Alloy.createController('dailyContentScroller').getView();
$.dailyContentArea.add(dailyContentScroller);

// set initial openView and mainWindow
var openData = { openCloseView: "mainWindow",
				};
Alloy.Globals.openViewArray.push(openData);