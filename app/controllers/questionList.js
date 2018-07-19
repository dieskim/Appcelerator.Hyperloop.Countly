// Set Args passed from other windows as args
var args = arguments[0] || {};
var questionTopicData = args.topicData;

// START SETTING $.topLabel
var convertedQuestionTopic = Alloy.Globals.textConverter(questionTopicData.longTitle);

$.topLabel.text = convertedQuestionTopic;
// END SETTING $.topLabel

// set fontSizeVar 			// TO DO - FUTURE FEATURE NOTE - add ability for these kind of things to use getSetFontSize("getValue"); 
var fontSizeVar = '16dp';

// set questionsArray as topics in questionCategory
var questionsArray = databaseConnect({
	database: Alloy.Globals.databaseData.questionData.databaseName,
	table: "questionQuestions",
	method:"getAllTableValuesByFieldValue",
	field: "topicID",
	value: questionTopicData.id, 
});
	
//Ti.API.info(questionsArray);

// Start Loop
for (var t=0; t<questionsArray.length; t++){

	// Convert and set question text
	var questionTextString = "«" +  questionsArray[t].questionText + "»";
	var convertedQuestionText = Alloy.Globals.textConverter(questionTextString);
	
	var questionView = Ti.UI.createView({
		height: Ti.UI.SIZE,
		width: Ti.UI.FILL,
		questionData: questionsArray[t],	
		layout: "vertical",		
		borderColor: "#888888",
		backgroundColor: "#FDFAE8",
		borderRadius: 5,
		borderWidth: 2,
		top:5,
		left: 5,
	    right: 5,
	    bottom:5,
	});
	
	var questionImage = Ti.UI.createImageView({
		image: "/images/question_images/question_"+questionsArray[t].id+".jpg",				
	    width: "75dp",
	    height: "75dp",
	    top: 5,
	    }); 	
	
	var questionLabel = Ti.UI.createLabel({
		text: convertedQuestionText,
		color: 'black',
		textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
		font: {
	        fontSize: fontSizeVar,
	        fontFamily: Alloy.Globals.customFont
	    },
	    bottom:5,
	   	left: 10,
	   	right: 10,		
	});
	
	questionView.addEventListener('click', function(e){
		
		// set questionData
		var questionData = this.questionData;
		loadQuestion(questionData);
		
	});	
	
	questionView.add(questionImage);
	questionView.add(questionLabel);
		
	// add questionView to $.questionListView
	$.questionListView.add(questionView);

};