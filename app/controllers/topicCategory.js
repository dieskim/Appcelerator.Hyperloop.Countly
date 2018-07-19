// Set Args passed from other windows as args
var args = arguments[0] || {};
var topicCategoryData = args.topicCategoryData;

// START SETTING $.topLabel
var convertedTopicCategory = Alloy.Globals.textConverter(topicCategoryData.longTitle);

$.topLabel.text = convertedTopicCategory;
// END SETTING $.topLabel

// START IF - set phone vs tablet vars
if (Alloy.isHandheld == true){
	var topicWidth = "100dp";
	var imageHeight = "100dp";
}else{
	var topicWidth = "120dp";
	var imageHeight = "120dp";
};
// END IF - set phone vs tablet vars

// set topicsArray as topics in topicCategory
var topicsArray = databaseConnect({
	database: Alloy.Globals.databaseData.topicData.databaseName,
	table: "topicTopics",
	method:"getAllTableValuesByFieldValue",
	field: "categoryID",
	value: topicCategoryData.id, 
});
	
//Ti.API.info(topicsArray);

// Start Loop
for (var t=0; t<topicsArray.length; t++){

	// Convert and set TopicTitle
	var topicTextString = topicsArray[t].longTitle;
	// convert ~ in title to -
	topicTextString = topicTextString.replace('~','-');
	
	var convertedTopicText = Alloy.Globals.textConverter(topicTextString);
	
	var topicView = Ti.UI.createView({
		top:0,
		height: Ti.UI.SIZE,
		width: topicWidth,
		topicData: topicsArray[t],	
		layout: "vertical",	
	});
	
	var topicImage = Ti.UI.createImageView({
		image: "/images/topic_images/topic_"+topicsArray[t].id+".jpg",				
	    width: Ti.UI.FILL,
	    height: imageHeight,
	    }); 	
	
	// START IF - set fontSizeVar according to TopicCategory
	if (topicsArray[t].categoryID == 7 || topicsArray[t].categoryID == 11){
		var fontSizeVar = '16dp';
	}else{
		var fontSizeVar = '18dp';
	};
	// END IF - set fontSizeVar according to TopicCategory
	
	var topicLabel = Ti.UI.createLabel({
		text: convertedTopicText,
		color: 'black',
		textAlign: 'center',
		font: {
	        fontSize: fontSizeVar,
	        fontFamily: Alloy.Globals.customFont
	    },
		
	});
	// START IF - check for special case of Jesus topic in Prophets Category and redirect to Jesus Category, else go to appropriate topic
	if (topicsArray[t].id == 115) {
		topicView.addEventListener('click', function(e){
		
			// set categoryData and load category
			var categoryData = databaseConnect({
				database: Alloy.Globals.databaseData.topicData.databaseName,
				table: "topicCategories",
				method:"getAllTableValuesByFieldValue",
				field: "id",
				value: "9", 
			});
			loadCategory(categoryData[0]);
		});	
	} else {
		topicView.addEventListener('click', function(e){
		
			// set topicData and loadTopic
			var topicData = this.topicData;
			loadTopic(topicData);
			
		});		
	}
	// END IF - check for special case of Jesus topic in Prophets Category and redirect to Jesus Category, else go to appropriate topic
	
	
	// add topicImage and topicLabel to topicView
	topicView.add(topicImage);
	topicView.add(topicLabel);
	
	// add topicView to $.topicCategoryView
	$.topicCategoryView.add(topicView);

};