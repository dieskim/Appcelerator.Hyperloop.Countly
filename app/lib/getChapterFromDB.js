//////////////////////////////////////////////////////////////////////////////////////////////////
// 							START FUNCTION toprepareChapter										//

// Include the model in app/lib/
var bibleDBFunctions = require('bibleDBFunctions');

// START FUNCTION - prepareChapter
function getChapterFromDB(chapterID, highlightStart, highlightEnd){
	//Ti.API.info("getChapterFromDB - START - chapterID: " + chapterID);
		
	// prepare chapterRecord
	var chapterRecord = getSetBookData({	getSet: 'getChapterRecordByRow',
											rowNum: (+chapterID + 1),
	});	
	
	//Ti.API.info(chapterRecord);
	
	// set vars
	var bookID = chapterRecord.bookID;
	var chapterNumber = chapterRecord.chapterNumber;
	var chapterIDNumber = padZero(chapterNumber,3);		// should be adapted to 001	via padzero
	
	//account for only one verse number provided for highlighting
	var highlightStart = highlightStart || '';
	var highlightEnd = highlightEnd || '';
	
	// get chapterText
	var preparedChapterText = bibleDBFunctions.displayChapterFromDB(bookID, chapterIDNumber, highlightStart, highlightEnd); 

	//return preparedChapterText
	return preparedChapterText;

};
// END FUNCTION - prepareChapter

module.exports = getChapterFromDB;