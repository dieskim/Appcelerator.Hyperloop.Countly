//////////////////////////////////////////////////////////////////////////////////////////////////
// 							START JS MODULE getTopicFromDB										//

// Include the model in app/lib/
var bibleDBFunctions = require('bibleDBFunctions');
	
// START FUNCTION - getTopicFromDB
function getTopicFromDB(topicOrRowID, idType){
	//Ti.API.info("getTopicFromDB - START");
	
	// set lookupField to "topicID" if argument not passed
	var lookupField = typeof idType !== 'undefined' ?  idType : 'topicID';
	
	// START IF value passed is topicID assign it to topicID, otherwise get topicID from db based on rowID
	if (lookupField == 'topicID') {
		var topicID = topicOrRowID;
	} else {
		var topicID = databaseConnect({
				database: Alloy.Globals.databaseData.topicData.databaseName,
				table: "topicTopics",
				method:"getFieldValue",
				field: "id", 
				lookupField: "rowid",
				value: topicOrRowID,
		});
	}
	// END IF value passed is topicID assign it to topicID, otherwise get topicID from db based on rowID
	
	// set default
	var preparedTopicPassages = "";
	
	// get topic Title from DB
	var passageTitle = databaseConnect({
				database: Alloy.Globals.databaseData.topicData.databaseName,
				table: "topicTopics",
				method:"getFieldValue",
				field: "longTitle", 
				lookupField: "id",
				value: topicID,
		});
	
	// convert ~ in title to two lines in display
	passageTitle = passageTitle.replace('~','</p><p class="heading-big">');
	
	// END IF check for ~ in title and replace with -
		
	// generate display code for title
	preparedTopicPassages += '<p class="heading-big">' + passageTitle + "</p>";
	
	// get list of passages from DB
	var passagesArray = databaseConnect({
				database: Alloy.Globals.databaseData.topicData.databaseName,
				table: "topicPassages",
				method:"getAllTableValuesByFieldValue",
				field: "topicID", 
				value: topicID,
				orderBy: "ordering",
		});
		
	// get text for each passage in list
	for (var p=0; p<passagesArray.length;p+=1)
	{
		preparedTopicPassages += buildPassage(passagesArray[p]);
	}
	
	return preparedTopicPassages;
	
	//Ti.API.info("getTopicFromDB - END");
};
// END FUNCTION - getTopicFromDB

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
						bookID:padZero(passage.bookID,2),
					};
	var bookRecord = getSetBookData(getSetData);
	
	//open passage <div>
	passageCode += passageDivOpen;

	//build reference display as link to chapter display page
	var categoryLabel = bookRecord.categoryLabel;
	referenceDisplay += categoryLabel + "، ";
	
	//if it not psalsm show both the category and the book name else for psalsm just longName
	if (bookRecord.bookID != 19) {
		referenceDisplay += "«" + bookRecord.longName + "» ";
	}  
		
	//if the passage spans chapters, make the label "from chapter # to chapter #"
	if (passage.startChapter < passage.endChapter) {
		var addToReferenceDisplay = passage.startChapter + "-" + bookRecord.chapterLabel + tinText + " " + passage.endChapter + "-" + bookRecord.chapterLabel + ghicheText;
		var convertedAddToReferenceDisplay = Alloy.Globals.textConverter(addToReferenceDisplay, false);
		referenceDisplay += convertedAddToReferenceDisplay;
	}else{
		referenceDisplay += passage.startChapter + "-" + bookRecord.chapterLabel;
	};

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

module.exports = getTopicFromDB;