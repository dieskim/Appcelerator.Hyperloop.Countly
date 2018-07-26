///////////////////////////////////////////////////////////////////////////////////////////////////
// 					START FUNCTION TO BUILD PAGEARRAY FROM STRING								//

function databaseConnect(data) {
		
///////////////////////////////////////////////////////////////////////////////////////////////////
//  					Start Databse Connection and Content extraction					//
		
	// SET DATABASE ARRAYS
	var bookDataArray = [];
	
	// Set databaseName to use
	var databaseName = data.database || Alloy.Globals.databaseData.bibleText.databaseName;
	
	var method = data.method || "getBookRecord";
	
	// Set bookID to get or set
	var bookID = data.bookID || "01";
	
	// set chapterNum
	var chapterNum = data.chapterNum || "1";
	
	// set verseID
	var verseID = data.verseID || "01.001.001";
	
	// set segmentID
	var segmentID = data.segmentID || "01.001.001.01";
	
	// set startChapter
	var startChapter = data.startChapter || "1";
	
	// set endChapter
	var endChapter = data.endChapter || "1";
	
	// set endVerse
	var endVerse = data.endVerse || "1";
	
	// set startVerse
	var startVerse = data.startVerse == null ?  1 : data.startVerse;
	
	// Set rowNum to get or set
	var rowNum = data.rowNum || 1;
	
	// set topicPassagesArray
	var topicPassagesArray = data.topicPassagesArray || false;
	
	// Set db as database with databaseName
	var db = Ti.Database.install('/database/'+ databaseName, databaseName);
	
	// START IF - prevent iCloud Backup
	if (OS_IOS){
		db.file.setRemoteBackup(false);
	};
	// END IF - prevent iCloud Backup
	
		///////////////////////////////////////////////
		// 		start Methods				
		if (method == "getBookRecord"){
				//Ti.API.info("run database getBookRecord");
				
				// get all Data for books
				var bookRS = db.execute('SELECT * FROM books WHERE bookID="' + bookID +'"');
					
				// set bookRecordData
				var bookRecordData = {	bookID:bookRS.fieldByName('bookID'),
										longName:bookRS.fieldByName('longName'),
										shortName:bookRS.fieldByName('shortName'),
										latinLongName:bookRS.fieldByName('latinLongName'),
										latinShortName:bookRS.fieldByName('latinShortName'),
										category:bookRS.fieldByName('category'),
										chapterCount: bookRS.fieldByName('chapterCount'),
										chapterLabel:bookRS.fieldByName('chapterLabel'),
										isActive: bookRS.fieldByName('isActive'),
										categoryLabel: bookRS.fieldByName('categoryLabel'),
										};
							
				// Push bookData to bookDataArray
				bookDataArray.push(bookRecordData);
								
				// Close Database
				db.close();
				
				// return bookDataArray with Data
				return bookDataArray;
		
		}else if (method == "getChapterRecord"){
				//Ti.API.info("run database getChapterRecord");
				
				// get all Data for books
				var bookRS = db.execute('SELECT rowid, * FROM chapters WHERE bookID="' + bookID +'" AND chapterNumber=' + chapterNum);
					
				// set chapterRecordData
				var chapterRecordData = {	chapterID:bookRS.fieldByName('chapterID'),
											bookID:bookRS.fieldByName('bookID'),
											chapterNumber:bookRS.fieldByName('chapterNumber'),
											verseCount:bookRS.fieldByName('verseCount'),
											hasSubtitle:bookRS.fieldByName('hasSubtitle'),
											rowid: bookRS.fieldByName('rowid'),
										};
							
				// Close Database
				db.close();
				
				// return chapterRecordData
				return chapterRecordData;
		
		}else if (method == "getChapterRecordByRow"){
				//Ti.API.info("run database getChapterRecordByRow");
				
				// get all Data for books
				var bookRS = db.execute('SELECT rowid, * FROM chapters WHERE rowid=' + rowNum);
					
				// set chapterRecordData
				var chapterRecordData = {	chapterID:bookRS.fieldByName('chapterID'),
											bookID:bookRS.fieldByName('bookID'),
											chapterNumber:bookRS.fieldByName('chapterNumber'),
											verseCount:bookRS.fieldByName('verseCount'),
											hasSubtitle:bookRS.fieldByName('hasSubtitle'),
											rowid: bookRS.fieldByName('rowid'),
										};
												
				// Close Database
				db.close();
				
				// return bookDataArray with Data
				return chapterRecordData;
		
		}else if (method == "getSectionRecords"){
				//Ti.API.info("run database getSectionRecords");
				
				// get all Data for books
				var bookRS = db.execute('SELECT * FROM sections WHERE bookID="' + bookID +'" AND (startChapter="' + chapterNum + '" OR endChapter="' + chapterNum + '")');
					
				// START FOR - To populate bookDataArray from Database
				for (var i=0; i<bookRS.rowCount; i++) {
					// set bookRecordData
					var bookRecordData = {	sectionID:bookRS.fieldByName('sectionID'),
											bookID:bookRS.fieldByName('bookID'),
											startChapter:bookRS.fieldByName('startChapter'),
											endChapter:bookRS.fieldByName('endChapter'),
											startVerse:bookRS.fieldByName('startVerse'),
											endVerse:bookRS.fieldByName('endVerse'),
											hasSubsection:bookRS.fieldByName('hasSubsection'),
											isSubsection:bookRS.fieldByName('isSubsection'),
											sectionTitle:bookRS.fieldByName('sectionTitle'),
											};
							
					// Push bookData to bookDataArray
					bookDataArray.push(bookRecordData);
								
					// Advance to next row	
					bookRS.next();
				
				};	
				// END FOR - To populate bookDataArray from Database
				
				// Close Database
				db.close();
				
				// return bookDataArray with Data
				return bookDataArray;
		
		}else if (method == "getVerseInfoRecords"){			
				//Ti.API.info("run database getVerseInfoRecords");
				
				// get all Data for books
				var bookRS = db.execute('SELECT * FROM verseinfo WHERE bookID="' + bookID +'" AND chapterNum="' + chapterNum +'"');
					
				// START FOR - To populate bookDataArray from Database
				for (var i=0; i<bookRS.rowCount; i++) {
					var bookData = {	verseID:bookRS.fieldByName('verseID'),
										verseNum:bookRS.fieldByName('verseNum'),
										verseLabel:bookRS.fieldByName('verseLabel'),
										displayVerse:bookRS.fieldByName('displayVerse'),									
									};
										
					// Push bookData to bookDataArray
					bookDataArray.push(bookData);
								
					// Advance to next row	
					bookRS.next();
				
				};	
				// END FOR - To populate bookDataArray from Database
								
				// Close Database
				db.close();
				
				// return bookDataArray with Data
				return bookDataArray;
				
		}else if (method == "getVerseInfoRecordsEndVerse"){
				//Ti.API.info("run database getVerseInfoRecordsEndVerse");
				
				// get all Data for books
				var bookRS = db.execute('SELECT * FROM verseinfo WHERE bookID="' + bookID +'" AND chapterNum="' + chapterNum +'" AND verseNum<="' + endVerse + '"');
					
				// START FOR - To populate bookDataArray from Database
				for (var i=0; i<bookRS.rowCount; i++) {
					var bookData = {	verseID:bookRS.fieldByName('verseID'),
										verseNum:bookRS.fieldByName('verseNum'),
										verseLabel:bookRS.fieldByName('verseLabel'),
										displayVerse:bookRS.fieldByName('displayVerse'),									
									};
										
					// Push bookData to bookDataArray
					bookDataArray.push(bookData);
								
					// Advance to next row	
					bookRS.next();
				
				};	
				// END FOR - To populate bookDataArray from Database
								
				// Close Database
				db.close();
				
				// return bookDataArray with Data
				return bookDataArray;
				
		}else if (method == "getVerseInfoRecordsStartVerse"){			
				//Ti.API.info("run database getVerseInfoRecordsStartVerse");
				
				// get all Data for books
				var bookRS = db.execute('SELECT * FROM verseinfo WHERE bookID="' + bookID +'" AND chapterNum="' + chapterNum +'" AND verseNum>="' + startVerse + '"');
					
				// START FOR - To populate bookDataArray from Database
				for (var i=0; i<bookRS.rowCount; i++) {
					var bookData = {	verseID:bookRS.fieldByName('verseID'),
										verseNum:bookRS.fieldByName('verseNum'),
										verseLabel:bookRS.fieldByName('verseLabel'),
										displayVerse:bookRS.fieldByName('displayVerse'),									
									};
										
					// Push bookData to bookDataArray
					bookDataArray.push(bookData);
								
					// Advance to next row	
					bookRS.next();
				
				};	
				// END FOR - To populate bookDataArray from Database
								
				// Close Database
				db.close();
				
				// return bookDataArray with Data
				return bookDataArray;
				
		}else if (method == "getVerseInfoRecordsStartEndVerse"){			
				//Ti.API.info("run database getVerseInfoRecordsStartEndVerse");
				
				// get all Data for books
				var bookRS = db.execute('SELECT * FROM verseinfo WHERE bookID="' + bookID +'" AND (("' + startChapter + '"!="' + endChapter + '" AND ((chapterNum="' + startChapter + '" AND verseNum>="' + startVerse + '") OR (chapterNum="' + endChapter + '" AND verseNum<="' + endVerse + '"))) OR (("' + startChapter + '"="' + endChapter + '" AND (chapterNum="' + startChapter + '" AND verseNum>="' + startVerse + '" AND verseNum<="' + endVerse + '")))) AND (displayVerse="1")');
				//Ti.API.info('SELECT * FROM verseinfo WHERE bookID="' + bookID +'" AND (("' + startChapter + '"!="' + endChapter + '" AND ((chapterNum="' + startChapter + '" AND verseNum>="' + startVerse + '") OR (chapterNum="' + endChapter + '" AND verseNum<="' + endVerse + '"))) OR (("' + startChapter + '"="' + endChapter + '" AND (chapterNum="' + startChapter + '" AND verseNum>="' + startVerse + '" AND verseNum<="' + endVerse + '")))) AND (displayVerse="1")');
					
				// START FOR - To populate bookDataArray from Database
				for (var i=0; i<bookRS.rowCount; i++) {
					var bookData = {	verseID:bookRS.fieldByName('verseID'),
										verseNum:bookRS.fieldByName('verseNum'),
										verseLabel:bookRS.fieldByName('verseLabel'),
										displayVerse:bookRS.fieldByName('displayVerse'),									
									};
									
					// Push bookData to bookDataArray
					bookDataArray.push(bookData);
								
					// Advance to next row	
					bookRS.next();
				
				};	
				// END FOR - To populate bookDataArray from Database
								
				// Close Database
				db.close();
				
				// return bookDataArray with Data
				return bookDataArray;
				
		}else if (method == "getChapterVerseSegmentRecords"){
				//Ti.API.info("run database getChapterVerseSegmentRecords");
				
				// set bookChapterID
				var bookChapterID = bookID + '.' + chapterNum;
				
				// get all Data for books
				var bookRS = db.execute('SELECT * FROM versesegment WHERE verseID LIKE "' + bookChapterID +'%"');
					
				// START FOR - To populate bookDataArray from Database
				for (var i=0; i<bookRS.rowCount; i++) {
					var bookData = {	segmentID:bookRS.fieldByName('segmentID'),
										verseID:bookRS.fieldByName('verseID'),
										textType:bookRS.fieldByName('textType'),
										hasFootnote:bookRS.fieldByName('hasFootnote'),
										beginParagraph:bookRS.fieldByName('beginParagraph'),
										hasBlank:bookRS.fieldByName('hasBlank'),
										hasSelah:bookRS.fieldByName('hasSelah'),	
										segmentText:bookRS.fieldByName('segmentText'),
									};
										
					// Push bookData to bookDataArray
					bookDataArray.push(bookData);
								
					// Advance to next row	
					bookRS.next();
				
				};	
				// END FOR - To populate bookDataArray from Database
								
				// Close Database
				db.close();
				
				// return bookDataArray with Data
				return bookDataArray;
				
		}else if (method == "getVerseSegmentRecordsStartEndVerse"){			
				//Ti.API.info("run database getVerseSegmentRecordsStartEndVerse");
				
				// get all Data for books
				var bookRS = db.execute('SELECT * FROM verseinfo LEFT JOIN versesegment ON verseinfo.verseID=versesegment.verseID WHERE bookID="' + bookID +'" AND (("' + startChapter + '"!="' + endChapter + '" AND ((chapterNum="' + startChapter + '" AND verseNum>="' + startVerse + '") OR (chapterNum="' + endChapter + '" AND verseNum<="' + endVerse + '"))) OR (("' + startChapter + '"="' + endChapter + '" AND (chapterNum="' + startChapter + '" AND verseNum>="' + startVerse + '" AND verseNum<="' + endVerse + '")))) AND displayVerse="1"');
				//Ti.API.info('SELECT * FROM verseinfo WHERE bookID="' + bookID +'" AND (("' + startChapter + '"!="' + endChapter + '" AND ((chapterNum="' + startChapter + '" AND verseNum>="' + startVerse + '") OR (chapterNum="' + endChapter + '" AND verseNum<="' + endVerse + '"))) OR (("' + startChapter + '"="' + endChapter + '" AND (chapterNum="' + startChapter + '" AND verseNum>="' + startVerse + '" AND verseNum<="' + endVerse + '")))) AND (displayVerse="1")');

					
				// START FOR - To populate bookDataArray from Database
				for (var i=0; i<bookRS.rowCount; i++) {
					var verseData = {	verseID:bookRS.fieldByName('verseID'),
										verseNum:bookRS.fieldByName('verseNum'),
										verseLabel:bookRS.fieldByName('verseLabel'),
										displayVerse:bookRS.fieldByName('displayVerse'),
										segmentID:bookRS.fieldByName('segmentID'),
										textType:bookRS.fieldByName('textType'),
										hasFootnote:bookRS.fieldByName('hasFootnote'),
										beginParagraph:bookRS.fieldByName('beginParagraph'),
										hasBlank:bookRS.fieldByName('hasBlank'),
										hasSelah:bookRS.fieldByName('hasSelah'),	
										segmentText:bookRS.fieldByName('segmentText'),									
									};
									
					// Push verseData to bookDataArray
					bookDataArray.push(verseData);
								
					// Advance to next row	
					bookRS.next();
				
				};	
				// END FOR - To populate bookDataArray from Database
								
				// Close Database
				db.close();
				
				// return bookDataArray with Data
				return bookDataArray;
				
		}else if (method == "getVerseSegmentRecords"){
				//Ti.API.info("run database getVerseSegmentRecords");
				
				// get all Data for books
				var bookRS = db.execute('SELECT * FROM versesegment WHERE verseID="' + verseID +'"');
					
				// START FOR - To populate bookDataArray from Database
				for (var i=0; i<bookRS.rowCount; i++) {
					var bookData = {	segmentID:bookRS.fieldByName('segmentID'),
										textType:bookRS.fieldByName('textType'),
										hasFootnote:bookRS.fieldByName('hasFootnote'),
										beginParagraph:bookRS.fieldByName('beginParagraph'),
										hasBlank:bookRS.fieldByName('hasBlank'),
										hasSelah:bookRS.fieldByName('hasSelah'),	
										segmentText:bookRS.fieldByName('segmentText'),
									};
										
				// Push bookData to bookDataArray
				bookDataArray.push(bookData);
							
				// Advance to next row	
				bookRS.next();
				
				};	
				// END FOR - To populate bookDataArray from Database
								
				// Close Database
				db.close();
				
				// return bookDataArray with Data
				return bookDataArray;
		}else if (method == "getChapterFootnoteRecords"){
				//Ti.API.info("run database chapterFootnoteRecord");
				
				// set bookChapterID
				var bookChapterID = bookID + '.' + chapterNum;
				
				// get all Data for books
				var bookRS = db.execute('SELECT * FROM footnotes WHERE footnoteID LIKE "' + bookChapterID +'%"');
					
				// START FOR - To populate bookDataArray from Database
				for (var i=0; i<bookRS.rowCount; i++) {
					var bookData = {	footnoteID:bookRS.fieldByName('footnoteID'),
										segmentID:bookRS.fieldByName('segmentID'),
										footnoteText:bookRS.fieldByName('footnoteText'),									
									};
										
					// Push bookData to bookDataArray
					bookDataArray.push(bookData);
								
					// Advance to next row	
					bookRS.next();
				
				};	
				// END FOR - To populate bookDataArray from Database
								
				// Close Database
				db.close();
				
				// return bookDataArray with Data
				return bookDataArray;
				
		}else if (method == "getFootnoteRecord"){
				//Ti.API.info("run database getFootnoteRecord");
				
				// get all Data for books
				var bookRS = db.execute('SELECT * FROM footnotes WHERE segmentID="' + segmentID +'"');
					
				// START FOR - To populate bookDataArray from Database
				for (var i=0; i<bookRS.rowCount; i++) {
					var bookData = {	footnoteID:bookRS.fieldByName('footnoteID'),
										footnoteText:bookRS.fieldByName('footnoteText'),									
									};
										
					// Push bookData to bookDataArray
					bookDataArray.push(bookData);
								
					// Advance to next row	
					bookRS.next();
				
				};	
				// END FOR - To populate bookDataArray from Database
								
				// Close Database
				db.close();
				
				// return bookDataArray with Data
				return bookDataArray;
				
	}else if (method == "getAllTopicPassagesInfo"){ 
			
			// FYI - TO SAVE IN CASE WE NEED BETTER SPEEDS FOR TOPICS
			// BASICALLY WE CAN USE THIS FUNCTION TO GET ALL THE TOPICS VERSEINFO AND SEGMENTINFO IN ONE CALL TO DATABASE, NOT OPENING AND CLOSING IN LOOP
			
			// CAN USE LIKE THIS - THEN JUST NEED TO HANDEL
			
			// get list of passages from DB
//			var passagesArray = databaseConnect({
//						database: Alloy.Globals.databaseData.topicData.databaseName,
//						table: "topicPassages",
//						method:"getTopicPassages",
//						value: "*", 
//						rowNum: topicID,
//				});
		
			
//			var topicPassageArray = bibleDatabaseConnect({
//				method:"getAllTopicPassagesInfo",
//				topicPassagesArray: passagesArray,
//			});	
		
			//Ti.API.info(topicPassagesArray);
			
			// begin the transaction
			db.execute('BEGIN'); 
			
			var bookRSArray = [];
			
			for(var i=0; i<topicPassagesArray.length; i++) {
			   	
			   	// get all Data for books
			   	var bookID = topicPassagesArray[i].bookID;
			   	var startChapter = topicPassagesArray[i].startChapter;
			   	var startVerse = topicPassagesArray[i].startVerse;
			   	var endChapter = topicPassagesArray[i].endChapter;
			   	var endVerse = topicPassagesArray[i].endVerse;
			   	
			   	// set verseInfoRecordsArrayResults query
				var verseInfoRecordsArrayResults = db.execute('SELECT * FROM verseinfo WHERE bookID="' + bookID +'" AND (("' + startChapter + '"!="' + endChapter + '" AND ((chapterNum="' + startChapter + '" AND verseNum>="' + startVerse + '") OR (chapterNum="' + endChapter + '" AND verseNum<="' + endVerse + '"))) OR (("' + startChapter + '"="' + endChapter + '" AND (chapterNum="' + startChapter + '" AND verseNum>="' + startVerse + '" AND verseNum<="' + endVerse + '")) AND (displayVerse="1")))');
				
				// set chapterVerseSegmentsArrayResults query
				var chapterVerseSegmentsArrayResults = db.execute('SELECT * FROM verseinfo LEFT JOIN versesegment ON verseinfo.verseID=versesegment.verseID WHERE bookID="' + bookID +'" AND (("' + startChapter + '"!="' + endChapter + '" AND ((chapterNum="' + startChapter + '" AND verseNum>="' + startVerse + '") OR (chapterNum="' + endChapter + '" AND verseNum<="' + endVerse + '"))) OR (("' + startChapter + '"="' + endChapter + '" AND (chapterNum="' + startChapter + '" AND verseNum>="' + startVerse + '" AND verseNum<="' + endVerse + '")) AND (displayVerse="1")))');
					
				var databaseResults = {	verseInfoRecordsArrayResults: verseInfoRecordsArrayResults,
										chapterVerseSegmentsArrayResults: chapterVerseSegmentsArrayResults,						
				};
				
				bookRSArray.push(databaseResults);
				
			};
			
			db.execute('COMMIT');
			
			db.close();
			
			return bookRSArray;
		};
			
//  					End Databse Connection and Content Extraction							//
//////////////////////////////////////////////////////////////////////////////////////////////////	

};

// 						END FUNCTION TO BUILD PAGEARRAY FROM STRING								//
///////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = databaseConnect;