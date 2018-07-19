// Add App eventlistener to listen for navigationCloseView
Ti.App.addEventListener("app:navigationCloseView", closeView);

function closeView(){
	//Ti.API.info("app:navigationCloseView in otCategory");
	
	Ti.App.removeEventListener("app:navigationCloseView", closeView);
	Ti.App.fireEvent("app:otCategoryClosed");
};

// START IF Handheld
if (Alloy.isHandheld == true){
	
	// set leftRightVar
	var leftRightVar = 15;
	
	// Set screenWidth
	var portraitScreenWidth = (Alloy.Globals.portraitWidth - (leftRightVar*2));
	var landscapeScreenWidth = (Alloy.Globals.landscapeWidth - (leftRightVar*2));
	
	// Set bookWidth
	var portraitBookWidth = Math.floor(portraitScreenWidth/3);
	var landscapeBookWidth = Math.floor(landscapeScreenWidth/6);
	
	// Set bookHeight					
	var portraitBookHeight = Math.floor(portraitBookWidth * 1.50);
	var landscapeBookHeight = Math.floor(landscapeBookWidth * 1.65);
	
	// Set Books in Row
	var portraitBooksInRow = 3;
	var landscapeBooksInRow = 6;
			
}else{ // ELSE IF Tablet
	
	// set leftRightVar
	var leftRightVar = 35;
	
	// Set screenWidth
	var portraitScreenWidth = (Alloy.Globals.portraitWidth - (leftRightVar*2));
	var landscapeScreenWidth = (Alloy.Globals.landscapeWidth - (leftRightVar*2));
	
	// Set bookWidth
	var portraitBookWidth = Math.floor(portraitScreenWidth/6);
	var landscapeBookWidth = Math.floor(landscapeScreenWidth/6);
	
	// Set bookHeight					
	var portraitBookHeight = Math.floor(portraitBookWidth * 1.50);
	var landscapeBookHeight = Math.floor(landscapeBookWidth * 1.65);
	
	// Set Books in Row
	var portraitBooksInRow = 6;
	var landscapeBooksInRow = 6;
	
};
// END IF Handheld


function createCategoryBook (data) {
	
	// set vars
	var arrayValue = data.arrayValue;
	var bookID = data.bookID;
	var blankBook = data.blankBook;
	
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
	
	// get bookData
	var bookData = getSetBookData({	getSet: "getBookRecord",
									bookID: bookID,
	});
						
	//////////////////////////////////////////////////////////
	// 	Start Creation of TableViewRows as rows of Books	//
	
	// DISABLED OR ENABLED
	var enabled = bookData.isActive;
	
	// DISABLED OR ENABLED
	if (enabled){
		var enabledValue = true;
		var opacityValue = 1.0;
	}else{
		var enabledValue = false;
		var opacityValue = 0.7;
	};
	// DISABLED OR ENABLED
	
	// START IF - iOS else Android
	if (OS_IOS){
		
		// START IF - blankBook else			
		if (blankBook == "blank"){
			
			var bookButton = Ti.UI.createButton({
				image: "/images/transparent.png",	
				backgroundImage: "/images/book_back_trans.png",
				touchEnabled: false,
			});
			
		}else{
			
			var bookButton = Ti.UI.createButton({
				image: "/images/book_images/ot_"+(parseInt(bookID,10))+".png",
				bookID: bookID,	
				backgroundImage: "/images/book_back.png",
				// DISABLED OR ENABLED
				enabled: enabledValue,
				backgroundDisabledImage: "/images/book_back.png",
				// DISABLED OR ENABLED
			});
			
		};				
		// END IF - blankBook else
		
	}else{
		
		// START IF - blankBook else
		if (blankBook == "blank"){
			
			var bookButton = Ti.UI.createImageView({
				image: "/images/transparent.png",	
				backgroundImage: "/images/book_back_trans.png",
				touchEnabled: false,
			});
			
		}else{
			
			var bookButton = Ti.UI.createImageView({
				image: "/images/book_images/ot_"+(parseInt(bookID,10))+".png",
				bookID: bookID,	
				backgroundImage: "/images/book_back.png",
				backgroundSelectedImage: "/images/book_back_clicked.png",
				// DISABLED OR ENABLED
				touchEnabled: enabledValue,
				enabled: enabledValue,
				opacity: opacityValue,
				// DISABLED OR ENABLED
			});
			
		};			
		// END IF - blankBook else
		
	};
	// END IF - iOS else Android	
	
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
		var bookID = this.bookID;
		loadText({	book: bookID,
					chapter: 1,
		});			    		
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
    
    Ti.App.addEventListener('app:otCategoryClosed', removeEvents);   
    function removeEvents() {    	
    	Ti.App.removeEventListener('orient', bookButtonUpdate);
    	Ti.App.removeEventListener("app:otCategoryClosed", removeEvents);  	
    };
    				
  	// return bookButton
    return bookButton;
};

	
// START CREATE otCategory ScrollView
var otCategory = Ti.UI.createScrollView({
	width:	Ti.UI.FILL,
	height: Ti.UI.FILL,
	left: 0,
	top: 0,
	scrollType: "vertical",
	layout: "vertical",
				
});

// START CREATE otCategorySection	
var otCategorySection = Ti.UI.createView({
	height: "50dp",
	width:	Ti.UI.FILL,
	backgroundColor: '#639A13',
	opacity: "0.8",		
});
	
var otCategorySectionLabel = Ti.UI.createLabel({
	text: L("ot_section1"),
	textAlign: 'center',
	color: "white",
	font: {
	        fontSize: '18dp',
	        fontFamily: Alloy.Globals.customFont
	 	},			
});
	
otCategorySection.add(otCategorySectionLabel);
otCategory.add(otCategorySection);
		
var otCategoryRow = Ti.UI.createView({
	width:	Ti.UI.SIZE,
	height: Ti.UI.SIZE,
	// For Right to Left set Layout to Composite
	layout: "composite",	
});
	
// START LOOP - Create bookImages
for (var b=0; b<5; b++){
	
	var bookData = { arrayValue: b,
					 bookID: padZero((+b + 1),2),	
					};		
	var categoryBook = createCategoryBook(bookData);
	
	otCategoryRow.add(categoryBook);
	
	if (b==4){
		
		var bookData = { arrayValue: b+1,
						 bookID: padZero((+b + 2),2),
						 blankBook: "blank",	
						};	
		var categoryBook = createCategoryBook(bookData);
		otCategoryRow.add(categoryBook);
		
	};	
};
// END LOOP - Create bookImages			

otCategory.add(otCategoryRow);

// START CREATE otCategorySecondarySection	
var otCategorySecondarySection = Ti.UI.createView({
	height: "50dp",
	width:	Ti.UI.FILL,
	backgroundColor: '#639A13',
	opacity: "0.8",		
});
	
var otCategorySecondarySectionLabel = Ti.UI.createLabel({
	text: L("ot_section2"),
	textAlign: 'center',
	color: "white",
	font: {
	        fontSize: '18dp',
	        fontFamily: Alloy.Globals.customFont
	 	},			
});
	
otCategorySecondarySection.add(otCategorySecondarySectionLabel);
otCategory.add(otCategorySecondarySection);	

var otCategorySecondaryRow = Ti.UI.createView({
		width:	Ti.UI.SIZE,
		height: Ti.UI.SIZE,
		// For Right to Left set Layout to Composite
		layout: "composite",	
	});
	
// START LOOP - Create bookImages
for (var b=0; b<34; b++){
	// START IF - B < 13 ELSE
	if (b<13){
		
		// set bookValue
		var bookData = { arrayValue: b,
						 bookID: padZero((+b + 6),2),
						};	
		
		var categoryBook = createCategoryBook(bookData);
	
		otCategorySecondaryRow.add(categoryBook);
		
	}else if (b > 13){
		
		// set bookValue
		var bookData = { arrayValue: b-1,
						 bookID: padZero((+b + 6),2),
						};	
		
		var categoryBook = createCategoryBook(bookData);
	
		otCategorySecondaryRow.add(categoryBook);
		
	};	
	// END IF - B < 13 ELSE
	
};
// END LOOP - Create bookImages
otCategory.add(otCategorySecondaryRow);	
				
$.contentArea.add(otCategory);