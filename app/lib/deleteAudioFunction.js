// START Function - deleteAudioFunction
function deleteAudioFunction(data){

	// set chapterID
	var chapterID = data.chapterID;
	
	// !!  FIX FOR WHEN NOT ALL BOOKS ARE ENABLED !! //
	// var chapterRowID = chapterID; // uncomment and remove two below if all book are enabled
	var currentActiveChapterID = returnValueInArray(activeChapterRowIDArray,chapterID);
	var chapterRowID = (+currentActiveChapterID+1);
					
	// prepare chapterRecord
	var chapterRecord = getSetBookData({	getSet: 'getChapterRecordByRow',
											rowNum: chapterRowID,
	});	
		
	// set audioFileName
	var audioFileName = Alloy.Globals.audioFilePrefix + chapterRecord.bookID + '_' + padZero(chapterRecord.chapterNumber, 2) + '.mp3';
			
	// START DELETE AUDIO FILE
	var audioFile = Ti.Filesystem.getFile(Alloy.Globals.storageDevice, audioFileName);
		
	// START IF - check that audioFile exists and is writable before delete
	if (audioFile.exists() && audioFile.writable) {
		//Ti.API.info("deleteAudioFunction" + audioFileName);
		var success = audioFile.deleteFile();
		
		if (success == true){
	
			// START IF - has data.datastream function
			if (data.deleteSuccess){
				// set data.datastream callback function
				data.deleteSuccess();
			};
			// END IF - has data.datastream function
			
		}else{			
			Ti.API.info('Audio DELETE failed');		
		};
		
	};
	// END IF - check that zipFile exists and is writable before delete							
	// END DELETE AUDIO FILE		
				        
};
// END Function - deleteAudioFunction

module.exports = deleteAudioFunction;