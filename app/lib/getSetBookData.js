function getSetBookData(data){
	
	// set vars
	var getSet = data.getSet || '';
	var bookID = data.bookID || '';
	var chapterNum = data.chapterNum || '';
	var verseID = data.verseID || '';
	var segmentID = data.segmentID || '';
	var startChapter = data.startChapter || '';
	var endChapter = data.endChapter || '';
	var endVerse = data.endVerse || '';
	var startVerse = data.startVerse == null ?  '' : data.startVerse;
	var rowNum = data.rowNum || '';
	
	// Include the model in app/lib/
	var bibleDatabaseConnect = require('bibleDatabaseConnect');
	
	//START IF - getSet value to run function with correct vars
	if (getSet == "getBookRecord"){
		
		var bookDataArray = bibleDatabaseConnect({
				method:"getBookRecord",
				bookID: bookID,
		});
		
		var bookRecord = bookDataArray[0];
		
		return bookRecord;
		
	}else if (getSet == "getChapterRecord"){
		
		var chapterData = bibleDatabaseConnect({
				method:"getChapterRecord",
				bookID: bookID,
				chapterNum: chapterNum,
		});
		
		var chapterRecord = chapterData;
		
		return chapterRecord;
		
	}else if (getSet == "getChapterRecordByRow"){
		
		var chapterData = bibleDatabaseConnect({
				method:"getChapterRecordByRow",
				rowNum: rowNum,
		});
		
		var chapterRecord = chapterData;
		
		return chapterRecord;
		
	}else if (getSet == "getSectionRecords"){
		
		var bookDataArray = bibleDatabaseConnect({
				method:"getSectionRecords",
				bookID: bookID,
				chapterNum: chapterNum,
		});
		
		var sectionRecords = bookDataArray;
		
		return sectionRecords;
		
	}else if (getSet == "getVerseInfoRecords"){
		
		var bookDataArray = bibleDatabaseConnect({
				method:"getVerseInfoRecords",
				bookID: bookID,
				chapterNum: chapterNum,
		});
		
		var verseInfoRecords = bookDataArray;
		
		return verseInfoRecords;
		
	}else if (getSet == "getVerseInfoRecordsEndVerse"){
		
		var bookDataArray = bibleDatabaseConnect({
				method:"getVerseInfoRecordsEndVerse",
				bookID: bookID,
				chapterNum: chapterNum,
				endVerse: endVerse,
		});
		
		var verseInfoRecords = bookDataArray;
		
		return verseInfoRecords;
		
	}else if (getSet == "getVerseInfoRecordsStartVerse"){
		
		var bookDataArray = bibleDatabaseConnect({
				method:"getVerseInfoRecordsStartVerse",
				bookID: bookID,
				chapterNum: chapterNum,
				startVerse: startVerse,
		});
		
		var verseInfoRecords = bookDataArray;
		
		return verseInfoRecords;
		
	}else if (getSet == "getVerseInfoRecordsStartEndVerse"){
		
		var bookDataArray = bibleDatabaseConnect({
				method:"getVerseInfoRecordsStartEndVerse",
				bookID: bookID,
				startChapter: startChapter,
				endChapter: endChapter,
				startVerse: startVerse,
				endVerse: endVerse,
		});
		
		var verseInfoRecords = bookDataArray;
		
		return verseInfoRecords;
		
	}else if (getSet == "getVerseSegmentRecordsStartEndVerse"){
		
		var bookDataArray = bibleDatabaseConnect({
				method:"getVerseSegmentRecordsStartEndVerse",
				bookID: bookID,
				startChapter: startChapter,
				endChapter: endChapter,
				startVerse: startVerse,
				endVerse: endVerse,
		});
		
		var verseJoinRecords = bookDataArray;
		
		return verseJoinRecords;
		
	}else if (getSet == "getChapterVerseSegmentRecords"){
		
		var bookDataArray = bibleDatabaseConnect({
				method:"getChapterVerseSegmentRecords",
				bookID: bookID,
				chapterNum: chapterNum,
		});
		
		var chapterVerseSegmentRecords = bookDataArray;
		
		return chapterVerseSegmentRecords;
		
	}else if (getSet == "getVerseSegmentRecords"){
		
		var bookDataArray = bibleDatabaseConnect({
				method:"getVerseSegmentRecords",
				verseID: verseID,
		});
		
		var verseSegmentRecords = bookDataArray;
		
		return verseSegmentRecords;
		
	}else if (getSet == "getChapterFootnoteRecords"){
		
		var bookDataArray = bibleDatabaseConnect({
				method:"getChapterFootnoteRecords",
				bookID: bookID,
				chapterNum: chapterNum,
		});
		
		var chapterFootnoteRecord = bookDataArray;
		
		return chapterFootnoteRecord;
		
	}else if (getSet == "getFootnoteRecord"){
		
		var bookDataArray = bibleDatabaseConnect({
				method:"getFootnoteRecord",
				segmentID: segmentID,
		});
		
		var footnoteRecord = bookDataArray[0];
		
		return footnoteRecord;
		
	}else if (getSet == "getBookData"){
		
		var bookDataArrray = databaseConnect({
				database: Alloy.Globals.databaseData.textData.databaseName,
				table: "bookData",
				method:"getAllTableValuesByFieldValue",
				field: "bookId",
				value: parseInt(bookID,10), 
		});
		
		var bookDataArrray = bookDataArrray[0];
		
		return bookDataArrray;
		
	}else if (getSet == "getAudioExist"){
		
		var chapterDataArray = databaseConnect({
				database: Alloy.Globals.databaseData.textData.databaseName,
				table: "bookData",
				method:"getValue",
				value: "audioExist", 
				rowNum: parseInt(bookID,10),
		});
		
		var audioExist = chapterDataArray[0].value;
		
		//Ti.API.info("getAudioExist----bookID: " + bookID + " parseInt(bookID,10): " + parseInt(bookID,10) + " (+bookID): " + (+bookID) + " audioExist: " + audioExist);
				
		return audioExist;
		
	}else if (getSet == "getAudioInstalled"){
		
		var chapterDataArray = databaseConnect({
				database: Alloy.Globals.databaseData.usageData.databaseName,
				table: "textData",
				method:"getValue",
				value: "audioInstalled", 
				rowNum: rowNum,
		});
		
		var audioInstalled = chapterDataArray[0].value;
		
		return audioInstalled;
		
	}else if (getSet == "setAudioInstalled"){
		
		var chapterDataArray = databaseConnect({
				database: Alloy.Globals.databaseData.usageData.databaseName,
				table: "textData",
				method:"setValue",
				value: "audioInstalled", 
				rowNum: rowNum,
				newValue: "true",
		});
		
	}else if (getSet == "setAudioNotInstalled"){
		
		var chapterDataArray = databaseConnect({
				database: Alloy.Globals.databaseData.usageData.databaseName,
				table: "textData",
				method:"setValue",
				value: "audioInstalled", 
				rowNum: rowNum,
				newValue: "FALSE",
		});
		
	}else if (getSet == "getAudioVersion"){
		
		var chapterDataArray = databaseConnect({
				database: Alloy.Globals.databaseData.textData.databaseName,
				table: "chapterData",
				method:"getValue",
				value: "audioVersion", 
				rowNum: rowNum,
		});
		
		var audioVersion = chapterDataArray[0].value;
		
		return audioVersion;
		
	}else if (getSet == "getAudioVersionInstalled"){
		
		var chapterDataArray = databaseConnect({
				database: Alloy.Globals.databaseData.usageData.databaseName,
				table: "textData",
				method:"getValue",
				value: "audioVersionInstalled", 
				rowNum: rowNum,
		});
		
		var audioVersionInstalled = chapterDataArray[0].value;
		
		return audioVersionInstalled;
		
	}else if (getSet == "setAudioVersionInstalled"){
		
		//Ti.API.info("setAudioVersionInstalled");
		
		// check latest Audio Version
		var newAudioVersion = getSetBookData({	getSet: "getAudioVersion",
														rowNum: rowNum,
									});
						
		var chapterDataArray = databaseConnect({
				database: Alloy.Globals.databaseData.usageData.databaseName,
				table: "textData",
				method:"setValue",
				value: "audioVersionInstalled", 
				rowNum: rowNum,
				newValue: newAudioVersion,
		});
		
	}else if (getSet == "setChapterRead"){
		
		//Ti.API.info("setChapterRead");
						
		var chapterDataArray = databaseConnect({
				database: Alloy.Globals.databaseData.usageData.databaseName,
				table: "textData",
				method:"setValue",
				value: "chapterRead", 
				rowNum: rowNum,
				newValue: "true",
		});
		
	}else if (getSet == "getChapterRead"){
		
		var chapterDataArray = databaseConnect({
				database: Alloy.Globals.databaseData.usageData.databaseName,
				table: "textData",
				method:"getValue",
				value: "chapterRead", 
				rowNum: rowNum,
		});
		
		var chapterRead = chapterDataArray[0].value;
		
		return chapterRead;
		
	};
	//END IF - getSet value to run function with correct vars
	
};

module.exports = getSetBookData;