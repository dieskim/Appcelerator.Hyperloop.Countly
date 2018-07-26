function setFontSize(){
	var rowID = this.id;
	setFontSizeFunction(rowID);
};

// START FUNCTION - setFontSize and set row hasCheck
function setFontSizeFunction(rowID){
	
	// include module and set currentFontSize
	var getSetFontSize = require('getSetFontSize/getSetFontSize');
		
	// START IF - rowID is not start
	if (rowID != "start"){
		
		// set rows
		var rowsArray = [];
		rowsArray.push($.small);
		rowsArray.push($.medium);
		rowsArray.push($.large);
		
		// START LOOP - set rowClicked as checked and then set fontSize as fontSizeVar - else uncheck row
		for (var f=0; f<3; f++){
			
			// get row and rowID
			var fontRow = rowsArray[f]; 
			var fontRowID = rowsArray[f].id;
			
			// START IF - row is rowClicked
			if (fontRowID == rowID){
				
				// set row hasCheck
				fontRow.backgroundColor = "#639a13";	
				fontRow.touchEnabled = false;	
					
			}else{
				// set other rows hasCheck off
				fontRow.backgroundColor = "#2A2A2A";
				fontRow.touchEnabled = true;		
			};
			// END IF - row is rowClicked
		
		};
		// END LOOP - set rowClicked as checked and then set fontSize as fontSizeVar - else uncheck row
		
		// set fontSize
		Ti.API.info("SET FontSize: " + fontSizeVar);
		
		// set fontSizeVar
		var fontSizeVar = rowID;
		getSetFontSize("setValue",fontSizeVar);
			
		// FireEvent goToPage to reload page with new fontSize		
		Ti.App.fireEvent('app:goToPageFontSizeReload',{
			direction: "index",  
			auto: "notAuto",      	
		});
			               
	}else{
		
		// set fontSizeVar
		var fontSizeVar = getSetFontSize("startValue");
		
		// log startup fontSize
		Ti.API.info("fontSizeVar: " + fontSizeVar);
		
		// START IF = check fontSize
		if (fontSizeVar == "small"){
				
			$.small.backgroundColor = "#639a13";
			$.small.touchEnabled = false;
			
		}else if (fontSizeVar == "medium"){
			
			$.medium.backgroundColor = "#639a13";
			$.medium.touchEnabled = false;
			
		}else{
			
			$.large.backgroundColor = "#639a13";
			$.large.touchEnabled = false;
			
		};
		// END IF = check fontSize
		
	};
	// END IF - rowClicked is not undefine else
	
};
// END FUNCTION - setFontSize and set row hasCheck

// Run setFontSize function on first Start
setFontSizeFunction("start");