/**
 * vodPrepare Module
 * - vodDataPrepare builds and returns vod data
 * - vodDataTextPrepare builds and returns vod data and text
 * 
 * Alloy.Globals: 
 * - {@link Alloy.Globals.bibleDBTextGenerate Alloy.Globals.bibleDBTextGenerate}
 * - {@link Alloy.Globals.databaseData Alloy.Globals.databaseData}
 * 
 * @requires   databaseConnect
 * @requires   bibleDBFunctions 
 * @module vodPrepare
 * @example    <caption>Require and run vodDataTextPrepare to build and return vod data and text</caption>
 * 
 * // require vodPrepare module
	var vodPrepare = require('vodPrepare/vodPrepare');
	
	// set vodDataText
	var vodDataText = vodPrepare.vodDataTextPrepare();
 * 
 * 
 */

/**
 * vodDataTextPrepare
 * - returns a function that builds and returns vod data and text
 *
 * @param      {number}  dayVar  The day of the year for the notifcation
 * @return     {function}  function that builds and returns vod data and text
 */
exports.vodDataTextPrepare = function (dayVar){
	
	// START IF - dayVar set then set day as dayVar - else generate as today
	if(dayVar){
		
		// prepare verseData
		var verseData = vodDataPrepare(dayVar);
	
	}else{
		
		// prepare verseData
		var verseData = vodDataPrepare(false);
		
	};
	// END IF - dayVar set then set day as dayVar - else generate as today
	
	// START IF - Alloy.Globals.bibleDBTextGenerate true else false
	if(Alloy.Globals.bibleDBTextGenerate){

		// Include the model in app/lib/
		var bibleDBFunctions = require('bibleDBFunctions');

		var verseText = bibleDBFunctions.getPassageText({
					bookID: verseData.bookID,
					startChapter: verseData.startChapter,
					startVerse: verseData.scrollVerse, //verseData.startVerse,
					endChapter: verseData.endChapter,
					endVerse: verseData.scrollVerse, //verseData.endVerse,
		});
		
		// set vodDataObject
		var vodDataObject = {	vodData: verseData,
								vodText: verseText,
					};
				
		return vodDataObject;

	}else{

		// set vodDataObject
		var vodDataObject = {	vodData: verseData,
								vodText: verseData.dailyVerse,
					};
				
		return vodDataObject;

	};
	// END IF - Alloy.Globals.bibleDBTextGenerate true else false
	 			
};

/**
 * vodDataPrepare
 * - builds and returns vod data
 *
 * @param      {number}   dayVar  The day of the year
 * @return     {object}   vod data object
 */
function vodDataPrepare(dayVar) {
	
	// START IF - dayVar set then set day as dayVar - else generate as today
	if(dayVar){
		
		// set Day of Year as passed
		var day = dayVar;
	
	}else{
				
		// Get the FullDate
		var fullDate = new Date();
		// Get Day of Year
		var day = fullDate.getDOY();
		
	};
	// END IF - dayVar set then set day as dayVar - else generate as today
	
	// Include the model in app/lib/
	var databaseConnect = require('databaseConnect');
	
	// START IF - Alloy.Globals.bibleDBTextGenerate true else false
	if(Alloy.Globals.bibleDBTextGenerate){

		// get bookDataArray from Database
		var verseData = databaseConnect({
			database: Alloy.Globals.databaseData.vodData.databaseName,
			table: "verses",
			method: "getVOD",
			rowNum: day,
			});
		
		return verseData;

	}else{

		// get bookDataArray from Database
		var verseDataArray = databaseConnect({
			database: Alloy.Globals.databaseData.textData.databaseName,
			table: "verse_day",
			method: "getVOD",
			rowNum: day,
			});
		
		var verseData = {	dailyVerseBookName:verseDataArray[0].dailyVerseBookName,
							dailyVerseChapter:verseDataArray[0].dailyVerseChapter,
							dailyVerseLocation:verseDataArray[0].dailyVerseLocation,
							dailyVerse:verseDataArray[0].dailyVerse,	
		};
		
		return verseData;

	};
	// END IF - Alloy.Globals.bibleDBTextGenerate true else false
	
};