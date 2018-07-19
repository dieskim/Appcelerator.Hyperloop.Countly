///////////////////////////////////////////////////////////////////////////////////////////////////
// 									START FUNCTION TO qodDataPrepare							//

function qodDataPrepare(dayVar) {
	
	// Include the model in app/lib/
	var databaseConnect = require('databaseConnect');
		
	// set totalQuestionAmount as count of table in database
	var totalQuestionAmount = databaseConnect({
			database: Alloy.Globals.databaseData.questionData.databaseName,
			table: "questionQuestions",
			method:"count", 
	});
		
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
	
	// START IF - day more than totalQuestionAmount then set new number
	if(day>totalQuestionAmount){
			
		// set questionID
		var questionID = (+day - totalQuestionAmount);
			
	}else{
			
		// set questionID
		var questionID = day;
		
	};
	// END IF - day more than totalQuestionAmount then set new number
		
	// set questionDataArray as question data in database
	var questionDataArray = databaseConnect({
		database: Alloy.Globals.databaseData.questionData.databaseName,
		table: "questionQuestions",
		method:"getAllTableValuesByFieldValue",
		field: "displayOrder",
		value: questionID, 
	});
		
	// set questionData as first in array - as array only has one value as only one question
	var questionData = questionDataArray[0];
	
	return questionData;
		
};

// 							END FUNCTION  TO qodDataPrepare										//
//////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////
// 							START FUNCTION  TO qodDataTextPrepare									//

function qodDataTextPrepare(dayVar){
	
	// START IF - dayVar set then set day as dayVar - else generate as today
	if(dayVar){
		
		// prepare questionData
		var questionData = qodDataPrepare(dayVar);
	
	}else{
		
		// prepare verseData
		var questionData = qodDataPrepare(false);
		
	};
	// END IF - dayVar set then set day as dayVar - else generate as today
			
	// set qodDataObject
	var qodDataObject = {	qodData: questionData,
							qodText: "«" + questionData.scrollText + "»", //questionData.questionText,
				};
			
	return qodDataObject;
				
};

// 							END FUNCTION  TO qodDataTextPrepare										//
//////////////////////////////////////////////////////////////////////////////////////////////////


exports.qodDataPrepare = qodDataPrepare;
exports.qodDataTextPrepare = qodDataTextPrepare;