// Set Args passed from other windows as args
var args = arguments[0] || {};
var questionCategoryData = args.questionCategoryData;

// START SETTING $.topLabel
var convertedQuestionCategory = Alloy.Globals.textConverter(questionCategoryData.longTitle);

$.topLabel.text = convertedQuestionCategory;
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

// set topicsArray as topics in questionCategory
var topicsArray = databaseConnect({
	database: Alloy.Globals.databaseData.questionData.databaseName,
	table: "questionTopics",
	method:"getAllTableValuesByFieldValue",
	field: "categoryID",
	value: questionCategoryData.id, 
});
	
//Ti.API.info(topicsArray);

// Start Loop
for (var t=0; t<topicsArray.length; t++){

	// Convert and set TopicTitle
	var topicTextString = topicsArray[t].longTitle;
	var convertedTopicText = Alloy.Globals.textConverter(topicTextString);
	
	var topicView = Ti.UI.createView({
		top:0,
		height: Ti.UI.SIZE,
		width: topicWidth,
		topicData: topicsArray[t],	
		layout: "vertical",	
	});
	
	var topicImage = Ti.UI.createImageView({
		image: "/images/question_topics/questionTopic_"+topicsArray[t].id+".jpg",				
	    width: Ti.UI.FILL,
	    height: imageHeight,
	    }); 	
	
	var fontSizeVar = '18dp';
	
	var topicLabel = Ti.UI.createLabel({
		text: convertedTopicText,
		color: 'black',
		textAlign: 'center',
		font: {
	        fontSize: fontSizeVar,
	        fontFamily: Alloy.Globals.customFont
	    },
		
	});
	
	topicView.addEventListener('click', function(e){
		
		// set topicData and load QuestionList
		var topicData = this.topicData;
		loadQuestionList(topicData);
		
	});	
	
	// add topicImage and topicLabel to topicView
	topicView.add(topicImage);
	topicView.add(topicLabel);
	
	// add topicView to $.topicCategoryView
	$.questionCategoryView.add(topicView);

};