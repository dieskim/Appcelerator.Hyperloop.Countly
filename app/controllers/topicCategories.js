// Add App eventlistener to listen for navigationCloseView
Ti.App.addEventListener("app:navigationCloseView", closeView);

function closeView(){
	//Ti.API.info("app:navigationCloseView in topicCategories");
	
	Ti.App.removeEventListener("app:navigationCloseView", closeView);
	Ti.App.fireEvent("app:topicCategoriesClosed");
};

// START IF HANDHELD ELSE - to set Top and Right for Right to Left
	if (Alloy.isHandheld == true){
			
		// Set screenWidth
		var portraitScreenWidth = Alloy.Globals.portraitWidth;
		var landscapeScreenWidth = Alloy.Globals.landscapeWidth;
		
		// Set bookWidth
		var portraitBookWidth = Math.floor(portraitScreenWidth/2);
		var landscapeBookWidth = Math.floor(landscapeScreenWidth/3);
		
		// Set bookHeight					
		var portraitBookHeight = portraitBookWidth;
		var landscapeBookHeight = landscapeBookWidth;
		
		// Set Books in Row
		var portraitBooksInRow = 2;
		var landscapeBooksInRow = 3;
		
	}else{
		
		// Set screenWidth
		var portraitScreenWidth = Alloy.Globals.portraitWidth;
		var landscapeScreenWidth = Alloy.Globals.landscapeWidth;
		
		// Set bookWidth
		var portraitBookWidth = Math.floor(portraitScreenWidth/3);
		var landscapeBookWidth = Math.floor(landscapeScreenWidth/4);
		
		// Set bookHeight					
		var portraitBookHeight = portraitBookWidth;
		var landscapeBookHeight = landscapeBookWidth;
		
		// Set Books in Row
		var portraitBooksInRow = 3;
		var landscapeBooksInRow = 4;
		
	}
	// END IF HANDHELD ELSE - to set Top and Right for Right to Left
	

function createCategoryTopic (topicCategoryData) {
	
	// set vars
	var arrayValue = (+topicCategoryData.displayOrder - 1);
	var topicCategoryID = topicCategoryData.id;
	
	// For Right to Left Calculate Heigh Value
	var portraitTopCalculation =  Math.floor(arrayValue/portraitBooksInRow);
	var portraitTopValue = portraitTopCalculation*portraitBookHeight;
	
	var landscapeTopCalculation =  Math.floor(arrayValue/landscapeBooksInRow);
	var landscapeTopValue = landscapeTopCalculation*landscapeBookHeight;
	
	// For Right to Left Calculate Right Value	
	var portraitBooksTotalWidth = (portraitBookWidth*portraitBooksInRow);
	var portraitRightRemove = portraitTopCalculation*portraitBooksTotalWidth;
	var portraitRightValue = (arrayValue*portraitBookWidth) - portraitRightRemove;
	
	var landscapeBooksTotalWidth = (landscapeBookWidth*landscapeBooksInRow);
	var landscapeRightRemove = landscapeTopCalculation*landscapeBooksTotalWidth;
	var landscapeRightValue = (arrayValue*landscapeBookWidth) - landscapeRightRemove;			
	
	var bookButton = Ti.UI.createButton({
		backgroundImage: "/images/topic_categories/topic_category_"+topicCategoryID+".jpg",
		backgroundSelectedImage: "/images/topic_categories/topic_category_"+topicCategoryID+"_clicked.jpg",
		topicCategoryData: topicCategoryData,	
	    }); 	

	// START - check orientation and set bookButton properties
	var isPortrait = isOrientationPortrait();				
	if (isPortrait){
	   	
	   	bookButton.applyProperties({
	   		height: portraitBookHeight,
	    	width: portraitBookWidth,
	    	top: portraitTopValue,
	    	right: portraitRightValue,
	    });
	    
	}else{
		
		bookButton.applyProperties({
	   		height: landscapeBookHeight,
	    	width: landscapeBookWidth,
	    	top: landscapeTopValue,
	    	right: landscapeRightValue,
	    });
	    
	};
	// END - check orientation and set bookButton properties
	
bookButton.addEventListener('click', function(e){
	
	var topicCategoryData = this.topicCategoryData;	
	loadCategory(topicCategoryData);
    		
});	

Ti.App.addEventListener('orient', bookButtonUpdate);
	function bookButtonUpdate(evt) {
		
		// START IF - Portrait else
	    if(evt.portrait===true) {
	    	
	    	bookButton.applyProperties({
	   			height: portraitBookHeight,
		    	width: portraitBookWidth,
		    	top: portraitTopValue,
		    	right: portraitRightValue,
	    	});
	    	
		}else{
			
			bookButton.applyProperties({
		   		height: landscapeBookHeight,
		    	width: landscapeBookWidth,
		    	top: landscapeTopValue,
		    	right: landscapeRightValue,
	    	});
	    	
		};
		// END IF - Portrait else
    };
    
    Ti.App.addEventListener('app:topicCategoriesClosed', removeEvents);   
    function removeEvents() {    	
    	Ti.App.removeEventListener('orient', bookButtonUpdate);
    	Ti.App.removeEventListener("app:topicCategoriesClosed", removeEvents);  	
    };
 
 // return bookButton
 return bookButton;
 
};
	
// get topic Title from DB
var topicCategoriesArray = databaseConnect({
		database: Alloy.Globals.databaseData.topicData.databaseName,
		table: "topicCategories",
		method:"getAllTableValues",
		orderBy: "displayOrder",
});
		
// Create categoryTopic and add to $.topicCategory
// Start Loop
for (var b=0; b<topicCategoriesArray.length; b++){
	
	// set topicCategoryData
	var topicCategoryData = topicCategoriesArray[b];	
		
	var categoryTopic = createCategoryTopic(topicCategoryData); 
	
	// Add categoryTopic to topicCategory
	$.topicCategory.add(categoryTopic);
	
};
// END LOOP - Create bookImages   