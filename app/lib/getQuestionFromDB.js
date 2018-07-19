//////////////////////////////////////////////////////////////////////////////////////////////////
// 							START JS MODULE getQuestionFromDB										//

// Include the model in app/lib/
var bibleDBFunctions = require('bibleDBFunctions');
	
// START FUNCTION - getQuestionFromDB
function getQuestionFromDB(questionOrRowID, idType){
	//Ti.API.info("getQuestionFromDB - START");
	
	// set lookupField to "questionID" if argument not passed
	var lookupField = typeof idType !== 'undefined' ?  idType : 'questionID';
	
	// START IF value passed is questionID assign it to questionID, otherwise get questionID from db based on rowID
	if (lookupField == 'questionID') {
		var questionID = topicOrRowID;
	} else {
		var questionID = databaseConnect({
				database: Alloy.Globals.databaseData.questionData.databaseName,
				table: "questionQuestions",
				method:"getFieldValue",
				field: "id", 
				lookupField: "rowid",
				value: questionOrRowID,
		});
	}
	// END IF value passed is questionID assign it to questionID, otherwise get questionID from db based on rowID
	
	// set default
	var preparedQuestionPassages = "";
	
	// get question text from DB
	var questionText = databaseConnect({
				database: Alloy.Globals.databaseData.questionData.databaseName,
				table: "questionQuestions",
				method:"getFieldValue",
				field: "questionText", 
				lookupField: "id",
				value: questionID,
		});
	
	//create DIV for image and question text
	preparedQuestionPassages += '<div class="question-box-wrap">';
	
	// insert question image
	preparedQuestionPassages += '<p class="question-box"><img class="question-image" src="images/question_images/question_' + (+questionID) + '.jpg" />';
		
	// generate display code for question text
	preparedQuestionPassages += "«" +  questionText + "»</p></div>";
	
	// get list of passages from DB
	var passagesArray = databaseConnect({
				database: Alloy.Globals.databaseData.questionData.databaseName,
				table: "questionPassages",
				method:"getAllTableValuesByFieldValue",
				field: "questionID", 
				value: questionID,
				orderBy: "ordering",
		});
	
	var currentGroup = '';
		
	// get text for each passage in list
	for (var p=0; p<passagesArray.length;p+=1)
	{
		if (passagesArray[p].groupTitle != currentGroup) {
			currentGroup = passagesArray[p].groupTitle;
			preparedQuestionPassages += '<p class="heading">' + currentGroup + '</p>';
		}
		preparedQuestionPassages += buildPassage(passagesArray[p]);
	}
	
	return preparedQuestionPassages;
	
	//Ti.API.info("getQuestionFromDB - END");
};
// END FUNCTION - getQuestionFromDB

// START FUNCTION - buildPassage
function buildPassage(passage)
{
	//Ti.API.info("buildPassage - START");
	
	//var passageCode = passage.bookID + "--" + passage.startChapter + ":" + passage.startVerse + "-" + passage.endChapter + ":" + passage.endVerse + "<br>";
	var passageCode = "";
	var passageDivOpen = '<div class="verse-block">';
	var passageDivClose = "</div>";
	var referenceOpen = "<h2>";
	var referenceClose = "</h2>";
	var referenceDisplay = "";
	var aOpen = '<a href="#" onClick="openChapter(\'';
	var aNext = '">';
	var aClose = "</a>";
	var moreOpen = '<p class="read-more">[';
	var moreClose = "]</p>";
	var moreText = L("read_more");
	var tinText = L("tin");
	var ghicheText = L("ghiche");
	
   	// get bookRecord and set vars as needed
	var getSetData = {	getSet: "getBookRecord",
						bookID: padZero(passage.bookID,2),
					};
	var bookRecord = getSetBookData(getSetData);
	
	//open passage <div>
	passageCode += passageDivOpen;

	//build reference display as link to chapter display page
	var categoryLabel = '';
	if (bookRecord.bookID == 19) {
		categoryLabel = L("psalms");
	} else if (bookRecord.bookID < 40) {
		categoryLabel = L("ot");
	} else {
		categoryLabel = L("nt");
	}
	referenceDisplay += categoryLabel + "، ";
	
	//if it is ot or nt, show both the category and the book name
	if (bookRecord.bookID != 19) { 
		referenceDisplay += "«" + bookRecord.longName + "» ";
	}  
	referenceDisplay += passage.startChapter + "-" + bookRecord.chapterLabel;
	
	//if the passage spans chapters, make the label "from chapter # to chapter #"
	if (passage.startChapter < passage.endChapter) {
		referenceDisplay += tinText + " " + passage.endChapter + "-" + bookRecord.chapterLabel + ghicheText;
	}
	// START IF the passages spans chapters, highlight to the end of the startChapter, else highlight passage
	if (passage.startChapter != passage.endChapter) {
		// highlight the verses from startVerse to the end of the chapter
		// get chapterRecord
		getSetData = {	getSet: "getChapterRecord",
							bookID:passage.bookID,
							chapterNum: passage.startChapter,
						};
		var chapterRecord = getSetBookData(getSetData);
		startH = passage.startVerse;
		endH = chapterRecord.verseCount;
	} else {  //if the passage is completely in one chapter, just highlight the verses
		startH = passage.startVerse;
		endH = passage.endVerse;
	}
	// END IF the passages spans chapters, highlight to the end of the startChapter, else highlight passage
	
	passageCode += referenceOpen + aOpen + passage.bookID + "', '" + passage.startChapter + "', '" +  startH + "', '" + endH + '\')' + aNext + referenceDisplay + aClose + referenceClose;	
   	//Ti.API.info("Reference link: " + passageCode);
   	
   	// get display code for passage
	passageCode += bibleDBFunctions.displayPassageFromDB({
				bookID: passage.bookID,
				startChapter: passage.startChapter,
				startVerse: passage.startVerse,
				endChapter: passage.endChapter,
				endVerse: passage.endVerse,
		});
	
	passageCode += moreOpen + aOpen + passage.bookID + "', '" + passage.startChapter + "', '" +  startH + "', '" + endH + '\')' + aNext + moreText + aClose + moreClose;
	//Ti.API.info("More Reference link: " + moreOpen + aOpen + passage.bookID + "', '" + passage.startChapter + "', '" +  startH + "', '" + endH + '\')' + aNext + moreText + aClose + moreClose);
	
	passageCode += passageDivClose;
			
   	return passageCode;
}
// END FUNCTION - buildPassage

module.exports = getQuestionFromDB;