// Add App eventlistener to listen for navigationCloseView
Ti.App.addEventListener("app:navigationCloseView", closeView);

function closeView(){
	//Ti.API.info("app:navigationCloseView in questionCategories");
	
	Ti.App.removeEventListener("app:navigationCloseView", closeView);
	Ti.App.fireEvent("app:questionCategoriesClosed");
};


// START IF - set phone vs tablet vars
if (Alloy.isHandheld == true){
	var categoryWidth = "100dp";
	var imageHeight = "100dp";
}else{
	var categoryWidth = "120dp";
	var imageHeight = "120dp";
};
// END IF - set phone vs tablet vars

// get question categories from DB
var questionCategoriesArray = databaseConnect({
		database: Alloy.Globals.databaseData.questionData.databaseName,
		table: "questionCategories",
		method:"getAllTableValues",
		orderBy: "displayOrder",
});
	
//Ti.API.info(questionCategoriesArray);

// Start Loop
for (var t=0; t<questionCategoriesArray.length; t++){

	// Convert and set categoryTitle
	var categoryTextString = questionCategoriesArray[t].longTitle;
	var convertedCategoryText = Alloy.Globals.textConverter(categoryTextString);
	
	var categoryView = Ti.UI.createView({
		top:0,
		height: Ti.UI.SIZE,
		width: categoryWidth,
		questionCategoryData: questionCategoriesArray[t],	
		layout: "vertical",	
	});
	
	var categoryImage = Ti.UI.createImageView({
		image: "/images/question_categories/questionCategory_"+questionCategoriesArray[t].id+".jpg",				
	    width: Ti.UI.FILL,
	    height: imageHeight,
	    }); 	
	
	var fontSizeVar = '18dp';
	
	var categoryLabel = Ti.UI.createLabel({
		text: convertedCategoryText,
		color: 'black',
		textAlign: 'center',
		font: {
	        fontSize: fontSizeVar,
	        fontFamily: Alloy.Globals.customFont
	    },
		
	});
	
	categoryView.addEventListener('click', function(e){
		
		// set categoryData and loadCategory
		var questionCategoryData = this.questionCategoryData;
		loadQuestionCategory(questionCategoryData);
		
	});	
	
	// add categoryImage and categoryLabel to categoryView
	categoryView.add(categoryImage);
	categoryView.add(categoryLabel);
	
	// add categoryView to $.categoryCategoryView
	$.questionCategory.add(categoryView);

};