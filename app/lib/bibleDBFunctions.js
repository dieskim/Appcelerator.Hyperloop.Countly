// set footnote arrays
var footnoteVerses = [];
	
// set Arrays
var chapterVerseSegmentsArray = [];
var chapterFootnoteArray = [];


// START FUNCTION - displayChapterFromDB
function displayChapterFromDB(bookID,chapterNum,highlightStart, highlightEnd){	
	//Ti.API.info("bookID: " + bookID + " chapterNum: " + chapterNum + " highlightStart: " + highlightStart + " highlightEnd: " + highlightEnd);
	
	// clear data
	footnoteVerses = [];
	chapterVerseSegmentsArray = [];
	chapterFootnoteArray = [];

	
	// set defaults
	var chapterText = '';
	
	// START - ADD BOOK TITLE AND CHAPTER NUMBER
	// get bookRecord and set vars as needed
	var getSetData = {	getSet: "getBookRecord",
						bookID:bookID,
					};
	var bookRecordArray = getSetBookData(getSetData);
	
	// set bookLongNameString and chapterNumString
	var bookLongNameString = bookRecordArray.longName;					// set longName
	var chapterNumString = chapterNum.replace(/^0+(?!\.|$)/, '');		// remove leading zeros
	
	// add chapter title to chapterText
	chapterText += "<p class=\"heading-big\">« " + bookLongNameString + " »</p>";
	chapterText += "<p class=\"heading\">" + chapterNumString + "";
	
	// END - ADD BOOK TITLE AND CHAPTER NUMBER
	
	// START - GET ALL chapterVerseSegments
	// get all chapterVerseSegmentRecordsArray
	var getSetData = {	getSet: "getChapterVerseSegmentRecords",
						bookID:bookID,
						chapterNum: chapterNum,
					};
	
	//Ti.API.info("Data passed to get segments");
	//Ti.API.info(getSetData);
					
	var chapterVerseSegmentRecordsArray = getSetBookData(getSetData);		
	
	//Ti.API.info(chapterVerseSegmentRecordsArray.length + " verse segments acquired.");
	
	// set chapterVerseSegmentsArray
	chapterVerseSegmentsArray = chapterVerseSegmentRecordsArray;	
		
	// END - GET ALL chapterVerseSegments
	
	// START - GET ALL chapterFootnoteRecords
	// get all chapterFootnoteRecordsArray
	var getSetData = {	getSet: "getChapterFootnoteRecords",
						bookID:bookID,
						chapterNum: chapterNum,
					};
	var chapterFootnoteRecordsArray = getSetBookData(getSetData);		
	
	// set chapterVerseSegmentsArray
	chapterFootnoteArray = chapterFootnoteRecordsArray;	
	
	// END - GET ALL chapterFootnoteRecords
	
	// START - ADD BOOK VERSES	
	// START - if PSALMS ELSE
	if (bookID == '19') {
		
		// get verseInfoRecords
		var getSetData = {	getSet: "getVerseInfoRecords",
							bookID:bookID,
							chapterNum: chapterNumString,
						};
		var verseInfoRecordsArray = getSetBookData(getSetData);
		
		// START LOOP - add chapterText
		for (var t=0; t<verseInfoRecordsArray.length; t++ ) {
			
			// prepare and add verse text
			//Ti.API.info("Get verse: " + verseInfoRecordsArray[t].verseID);	
			var verseText = displayVerseFromDB(verseInfoRecordsArray[t], highlightStart, highlightEnd);
			chapterText += verseText;
			
		};
		// END LOOP - add chapterText
			
	}else{
		
		//get all sections that are at least partially in the specified chapter	
		// get verseInfoRecords
		var getSetData = {	getSet: "getSectionRecords",
							bookID:bookID,
							chapterNum: chapterNumString,
						};
		var sectionRecordsArray = getSetBookData(getSetData);
		
		// START - if no sections ELSE
		if (sectionRecordsArray.length == 0) {
			// get verseInfoRecords
			var getSetData = {	getSet: "getVerseInfoRecords",
								bookID:bookID,
								chapterNum: chapterNumString,
							};
			var verseInfoRecordsArray = getSetBookData(getSetData);
			
			// START LOOP - add chapterText
			for (var t=0; t<verseInfoRecordsArray.length; t++ ) {
				// prepare and add verse text
				var verseText = displayVerseFromDB(verseInfoRecordsArray[t], highlightStart, highlightEnd);
				chapterText += verseText;
			};
			// END LOOP - add chapterText			
		} else {
			// START LOOP - sections
			for (var s=0; s<sectionRecordsArray.length; s++ ) {
			
				// set sectionData
				var section = sectionRecordsArray[s];
				var startChapter = section.startChapter;
				var endChapter = section.endChapter;
				
				// START IF - type of section
		    	if (startChapter == endChapter) {		//display complete section that is wholly contained in current chapter
					chapterText += displaySectionFromDB(section, highlightStart, highlightEnd);
				
				}else if (endChapter == chapterNum){ 	//display verses from 1 to endVerse of the current section
					
					// set endVerse
					var endVerse = section.endVerse;
					
					// get verseInfoRecordsEndVerseArray
					var getSetData = {	getSet: "getVerseInfoRecordsEndVerse",
										bookID:bookID,
										chapterNum: chapterNumString,
										endVerse: endVerse,
									};
					var verseInfoRecordsEndVerseArray = getSetBookData(getSetData);
					
					// START LOOP - add chapterText
					for (var t=0; t<verseInfoRecordsEndVerseArray.length; t++ ) {
						
						// prepare and add verse text
						var verseText = displayVerseFromDB(verseInfoRecordsEndVerseArray[t], highlightStart, highlightEnd);
						chapterText += verseText;
						
					};
					// END LOOP - add chapterText
					
				}else if (startChapter == chapterNum){ 	//display beginning of section that extends into next chapter
					
					// set startVerse
					var startVerse = section.startVerse;
					
					// get verseInfoRecordsStartVerseArray
					var getSetData = {	getSet: "getVerseInfoRecordsStartVerse",
										bookID:bookID,
										chapterNum: chapterNumString,
										startVerse: startVerse,
									};
					var verseInfoRecordsStartVerseArray = getSetBookData(getSetData);
					
					// START LOOP - add chapterText
					for (var t=0; t<verseInfoRecordsStartVerseArray.length; t++ ) {
						
						// prepare and add verse text
						var verseText = displayVerseFromDB(verseInfoRecordsStartVerseArray[t], highlightStart, highlightEnd);
						chapterText += verseText;
						
					};
					// END LOOP - add chapterText
				};
				// END IF - type of section						
				
			};
			// END LOOP - sections
		};
		// END if no sections ELSE	
	};		
	// END - if PSALMS ELSE
	
	// add closing p
	chapterText += "</p>";
	
	// END - ADD BOOK VERSES
	
	// START ADD - Footnotes
	if (chapterFootnoteArray.length > 0) {
		chapterText += "<div><br clear=\"all\" /><hr align=\"left\" size=\"1\" width=\"33%\" /><div>";
		for (var f=0; f<chapterFootnoteArray.length; f++){
			chapterText += "<p class=\"footnote\"><a href=\"#_" + chapterFootnoteArray[f].footnoteID + "\" name=\"" + chapterFootnoteArray[f].footnoteID + "\"><sup>*</sup></a><span class=\"footnote-number\">" + footnoteVerses[f] + "</span>" + chapterFootnoteArray[f].footnoteText + "</p>";
		}
		
		chapterText += "</div></div>";
	};	
	// END ADD - Footnotes
	
	return chapterText;
	
};
// END FUNCTION - displayChapterFromDB


// START FUNCTION - displaySectionFromDB
function displaySectionFromDB(section, highlightStart, highlightEnd){
	
	// set defaults
	var sectionText = '';
	
	// set sectionTitle;
	var sectionTitle = section.sectionTitle;
	var isSubtitle = section.isSubtitle;
	var bookID = section.bookID;
	var startChapter = section.startChapter;
	var endChapter = section.endChapter;
	var startVerse = section.startVerse;
	var endVerse = section.endVerse;
	
	// START IF - sectionTitle
	if (sectionTitle != "") {
		// START IF - isSubtitle
		if (isSubtitle){
			sectionText += "<p class=\"heading-sub\">" + sectionTitle + "</p>";	
		}else{
			sectionText += "<p class=\"heading\">" + sectionTitle + "</p>";
		};
		// END IF - isSubtitle	
	};
	// START IF - sectionTitle
	
	//Ti.API.info("bookID: " + bookID + " startChapter: " + startChapter + " endChapter: " + endChapter + " startVerse: " + startVerse + " endVerse: " + endVerse);
	
	// get verseInfoRecordsStartEndVerseArray
	var getSetData = {	getSet: "getVerseInfoRecordsStartEndVerse",
						bookID:bookID,
						startChapter: startChapter,
						endChapter: endChapter,
						startVerse: startVerse,
						endVerse: endVerse,
					};
	var verseInfoRecordsStartEndVerseArray = getSetBookData(getSetData);
	
	// START LOOP - add chapterText
	for (var t=0; t<verseInfoRecordsStartEndVerseArray.length; t++ ) {
					
		// prepare and add verse text
		var verseText = displayVerseFromDB(verseInfoRecordsStartEndVerseArray[t], highlightStart, highlightEnd);
		sectionText += verseText;
					
	};
	// END LOOP - add chapterText
	
	return sectionText;
};
// END FUNCTION - displaySectionFromDB

// START FUNCTION - displayPassageFromDB
function displayPassageFromDB(passage, highlightStart, highlightEnd){
	
	// clear data
	footnoteVerses = [];
	chapterVerseSegmentsArray = [];
	chapterFootnoteArray = [];
	
	// set defaults
	var passageText = '';
	
	// set passage variables;
	var bookID = padZero(passage.bookID,2);
	var startChapter = passage.startChapter;
	var endChapter = passage.endChapter;
	var startVerse = passage.startVerse;
	var endVerse = passage.endVerse;
	
	//Ti.API.info("bookID: " + bookID + " startChapter: " + startChapter + " endChapter: " + endChapter + " startVerse: " + startVerse + " endVerse: " + endVerse);
	
	// get verseInfo records from database
	var getSetData = {	getSet: "getVerseInfoRecordsStartEndVerse",
						bookID:bookID,
						startChapter: startChapter,
						endChapter: endChapter,
						startVerse: startVerse,
						endVerse: endVerse,
					};
	var verseInfoRecordsArray = getSetBookData(getSetData);
	
	// get verseInfo records from database
	getSetData = 	{	getSet: "getVerseSegmentRecordsStartEndVerse",
						bookID:bookID,
						startChapter: startChapter,
						endChapter: endChapter,
						startVerse: startVerse,
						endVerse: endVerse,
					};
	chapterVerseSegmentsArray = getSetBookData(getSetData);	
	
	var firstTime = true;
	
	// START LOOP - add chapterText
	for (var t=0; t<verseInfoRecordsArray.length; t++ ) {
					
		// prepare and add verse text
		var verseText = displayVerseFromDB(verseInfoRecordsArray[t], highlightStart, highlightEnd, false, true, firstTime);
		passageText += verseText;
		if (firstTime) {
			firstTime = false;
		}
					
	};
	// END LOOP - add chapterText
	
	return passageText;
};
// END FUNCTION - displayPassageFromDB


// START FUNCTION - displayVerseFromDB
function displayVerseFromDB(verseInfoArray, highlightStart, highlightEnd, displayFootnotes, fromPassage, beginPassage){
		
	// set displayFootnotes to true if arugment not passed
	var displayFootnotes = typeof displayFootnotes !== 'undefined' ?  displayFootnotes : true;
	// set fromPassage to false if arugment not passed
	var fromPassage = typeof fromPassage !== 'undefined' ?  fromPassage : false;
	// set fromPassage to false if arugment not passed
	var beginParagraph = typeof beginParagraph !== 'undefined' ?  beginParagraph : false;
	
	
	// set defaults
	var verseText = '';
	var verseSegmentRecordsArray = [];
	
	// set vars
	var verseNum = verseInfoArray.verseNum;
	
	// START IF - highlight
	if (verseNum != 0 && verseNum >= highlightStart && verseNum <= highlightEnd){
		var highlight = true;	
	}else{
		var highlight = false;	
	};
	// END IF - hightlight
	
	// set verseID
	var verseID = verseInfoArray.verseID;
	
	if (fromPassage) {
		for (var i=0; i<chapterVerseSegmentsArray.length; i++ ) {
			if (chapterVerseSegmentsArray[i].verseID == verseID) {
				verseSegmentRecordsArray.push(chapterVerseSegmentsArray[i]);
			}
		}
		
	} else {
		// START LOOP - get all chapterVerseSegmentsArray rows for this verse
		for (var i=0; i<chapterVerseSegmentsArray.length; i++ ) {
				
				// set verseIDString
				var verseIDString = verseID.substr(7);
				
				// set chapterVerseSegmentIDString
				var chapterVerseSegmentID = chapterVerseSegmentsArray[i].verseID;
				var chapterVerseSegmentIDString = chapterVerseSegmentID.substr(7);
				
				// START IF - current or smaller verseID else break
				if (chapterVerseSegmentIDString == verseIDString){
					
					verseSegmentRecordsArray.push(chapterVerseSegmentsArray[i]);
					
				}else if (chapterVerseSegmentIDString > verseIDString){
					break;
				};
				// END IF - current or smaller verseID else break
		};	
		// END LOOP - get all chapterVerseSegmentsArray rows for this verse
	}
	//Ti.API.info("verseSegmentRecordsArray:");
	//Ti.API.info(verseSegmentRecordsArray);
	
	// START LOOP - build verses
	for (var v=0; v<verseSegmentRecordsArray.length; v++ ) 
	{
		verseText += displayVerseSegmentFromDB(verseSegmentRecordsArray[v],verseInfoArray,highlight, displayFootnotes, beginPassage);
		if (beginPassage) {
			beginPassage = false;
		}
	};
	// END LOOP - build verses
	
	return verseText;
	
};
// END FUNCTION - displayVerseFromDB

// START FUNCTION - displayVerseSegmentFromDB
function displayVerseSegmentFromDB(verseSegmentRecord,verseInfo,highlight, displayFootnotes, overwriteBeginParagraph){
	
	// set displayFootnotes to true if arugment not passed
	var displayFootnotes = typeof displayFootnotes !== 'undefined' ?  displayFootnotes : true;
	// set overwriteBeginParagraph to true if arugment not passed
	var overwriteBeginParagraph = typeof overwriteBeginParagraph !== 'undefined' ?  overwriteBeginParagraph : false;
		
	// set defaults
	var verseSegmentText = '';
	
	// set beginParagraph
	if (overwriteBeginParagraph){
		var beginParagraph = true;
	} else {
		var beginParagraph = verseSegmentRecord.beginParagraph;
	}
	
	//Ti.API.info("TROUBLESHOOTING---segmentID: " + verseSegmentRecord.segmentID + " overwriteBeginParagraph: " + overwriteBeginParagraph + " beginParagraph: " + beginParagraph);
	
	// START IF - beginParagraph
	if (beginParagraph){
		
		// set vars
		var hasBlank = verseSegmentRecord.hasBlank;
		var textType = verseSegmentRecord.textType;
		
		// START IF - hasBlank
		if (hasBlank){
			verseSegmentText += "</p><p class=\"blank-line\"></p>";		
		}else{
			verseSegmentText += "</p>";
		}
		// END IF - hasBlank
		
		verseSegmentText += "<p";
		
		// START IF - textType
		if (textType == "default") {
			verseSegmentText += ">";
		}else if (textType == "quote" || textType == "indent" || textType == "list" ){
			verseSegmentText += " class=\"quote\">";
		};
		// END IF - textType
	};
	// END IF - beginParagraph
	
	// START IF - highlight
	if (highlight) {
		verseSegmentText += "<span class=\"highlight\">";
	};
	// END IF - highlight
	
	// set segmentIDNumber and verseNum and verseLabel
	var segmentID = verseSegmentRecord.segmentID;
	var verseID = verseInfo.verseID;
	var segmentIDNumber = segmentID.substr(11);
	var verseNum = verseInfo.verseNum;
	var verseLabel = verseInfo.verseLabel;
	var segmentText = verseSegmentRecord.segmentText;
	var hasSelah = verseSegmentRecord.hasSelah;
	var hasFootnote = verseSegmentRecord.hasFootnote;
	
	// START IF - add verse number
	if (segmentIDNumber == "01" && verseNum != 0){
		verseSegmentText += "<sup id=\""  + verseLabel + "\">" + verseLabel + "</sup>";	
	};
	// END IF - add verse number
	
	// START IF - add verse text
	if (segmentIDNumber == "01" && verseNum == 0){
		verseSegmentText += "</p><p class=\"heading-small\">" + segmentText;	
	}else{
		verseSegmentText += segmentText;
	};
	// END IF - add verse text
	
	// START IF - add selah
	if (hasSelah){
		if(verseID ==  "19.009.016"){
			verseSegmentText += "<span class=\"selah\">خىگگائون سېلاھ</span>";
		}else{
			verseSegmentText += "<span class=\"selah\">سېلاھ</span>";
		};		
	};	
	// END IF - add selah
	
	// START IF - hasFootnote
	if (displayFootnotes && hasFootnote){
		
		// START LOOP - get footnoteRecord for segment
		for (var f=0; f<chapterFootnoteArray.length; f++ ) {
				
			// set chapterVerseSegmentIDString
			var chapterFootnoteSegmentID = chapterFootnoteArray[f].segmentID;
			
			// START IF - chapterFootnoteSegmentID is segmentID
			if (chapterFootnoteSegmentID == segmentID){	
				
				var footnoteRecord = chapterFootnoteArray[f];
				break;
				
			};
			// END IF - chapterFootnoteSegmentID is segmentID
			
		};	
		// END LOOP - get footnoteRecord for segment
		
		// set footnoteID
		var footnoteID = footnoteRecord.footnoteID;
		
		// add text
		verseSegmentText += "<a href=\"#" + footnoteID + "\" name=\"_" + footnoteID + "\"><sup>*</sup></a>";
		
		// push footnote to arrays
		footnoteVerses.push(verseLabel);
		
	};
	// END IF - hasFootnote
	
	// START IF - highlight
	if (highlight) {
		verseSegmentText += "</span>";
	};
	// END IF - highlight

	return verseSegmentText;
	
};
// END FUNCTION - displayVerseSegmentFromDB

// START FUNCTION - getPassageText
function getPassageText(passage)
{
	var passageText = '';
	
	// set passage variables;
	var bookID = padZero(passage.bookID,2);
	var startChapter = passage.startChapter;
	var endChapter = passage.endChapter;
	var startVerse = passage.startVerse;
	var endVerse = passage.endVerse;
	
	// get verseSegment records from database
	getSetData = 	{	getSet: "getVerseSegmentRecordsStartEndVerse",
						bookID:bookID,
						startChapter: startChapter,
						endChapter: endChapter,
						startVerse: startVerse,
						endVerse: endVerse,
					};
	var passageVerseSegmentsArray = getSetBookData(getSetData);	
	
	// START LOOP - add passageText
	for (var t=0; t<passageVerseSegmentsArray.length; t++ ) {
					
		// prepare and add verse text
		var verseSegmentText = passageVerseSegmentsArray[t].segmentText;
		passageText += verseSegmentText;
		
		// START IF check for space at the end of the verseSegment and add if necessary
		if (verseSegmentText.substr(-1,1) != " ") {
			passageText += " ";
		}
		// END IF check for space at the end of the verseSegment and add if necessary
					
	};
	// END LOOP - add passageText
	
	//Ti.API.info("bookID: " + bookID + " startChapter: " + startChapter + " endChapter: " + endChapter + " startVerse: " + startVerse + " endVerse: " + endVerse);
	//Ti.API.info(passageText);
	
	return passageText;
}
// END FUNCTION - getPassageText


exports.displaySectionFromDB = displaySectionFromDB;
exports.displayVerseFromDB = displayVerseFromDB;
exports.displayPassageFromDB = displayPassageFromDB;
exports.displayChapterFromDB = displayChapterFromDB;
exports.getPassageText = getPassageText;