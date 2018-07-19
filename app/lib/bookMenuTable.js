////////////////////////////////////////////////////////////////////////////////////////////////
//							Start Function bookMenuTable									  // 

function bookMenuTable(data){

//////////////////////////////////////////////////////////////////////////////////////////////
//								START Create Book Menu 									    //

// Create tableData array with all views for Menu tableView
var tableData = [];

// set totalBookAmount as count of table in database
var totalBookAmount = databaseConnect({
		database: Alloy.Globals.databaseData.bibleText.databaseName,
		table: "books",
		method:"count", 
});
	
// START Loop - Create bookRow of books in loop with - bookview and booklabel
for (var i=0; i<totalBookAmount; i++){
		
	// set bookID
	var bookID = padZero((+i + 1),2);
	
	// get bookData
	var bookData = getSetBookData({	getSet: "getBookRecord",
									bookID: bookID,
	});
						
	//////////////////////////////////////////////////////////
	// 	Start Creation of TableViewRows as rows of Books	//
	
	// DISABLED OR ENABLED
	var enabled = bookData.isActive;
	
	if (enabled){
		var touchEnabledValue = true;
		var menuImage = "/images/menu_closed.png";
		var backgroundColorValue = "#639A13";
	}else{
		var touchEnabledValue = false;
		var menuImage = "none";
		var backgroundColorValue = "#9abe60";
	}
	// DISABLED OR ENABLED
	
	// Start Create TableViewRow	  
	var bookRow = Ti.UI.createTableViewRow({
	    className:'bookRow', 					// used to improve table performance
	    height: "50dp",
	    width:	Ti.UI.FILL,
	    top: 0,    
	    layout: "vertical",
	    backgroundSelectedColor: '#90B81A',
	    rowId: i, 								// rowId for events
	    expanded:false,							// if row is expanded for events
	    mainRow: true,							// if row is main Row for events
	    selectionStyle:'none',
	});
	
	//Create bookView
	var bookView = Ti.UI.createView({
	    top: 0,
	    height: "50dp",
	    width:	Ti.UI.FILL,
	    backgroundColor: backgroundColorValue,
	    bookID: bookID,								// bookId for Click Event
	    touchEnabled: touchEnabledValue,
	});
	
	// Convert and set bookText
	var bookTextString = bookData.shortName;
	var convertedBookText = Alloy.Globals.textConverter(bookTextString);
		
	// Set bookText as convertedBookText
	var bookText =  convertedBookText;	
	
	//Create bookLabel
	var bookLabel = Ti.UI.createLabel({
	    color:'white',
	    text: bookText,				// bookText as Category+BookName
	    font: {
	        fontSize: '20dp',
	        fontFamily: Alloy.Globals.customFont,
	    },
	    touchEnabled: touchEnabledValue,	
	 });
	
	// Create Book Row Image
	var bookRowImage = Ti.UI.createView({
		left:0,
		width:"50dp",
		height:"50dp",
		backgroundImage: menuImage,				
	}); 
	
	// addEventListener to the bookView in the Row 	
	bookView.addEventListener('click', function(e){	
	
		//Ti.API.info("bookView click: " + this.bookID);
		
		// run callback function updateRow with this.bookid as id of row clicked		
		var bookID = this.bookID;		
		
		data.updateRowsFunction(bookID);
			
	});
	
	// Add bookLabel to bookView
	bookView.add(bookLabel);
	// Add bookRowImage to bookView
	bookView.add(bookRowImage);
	
	// set tableRowSeperator
	var tableRowSeperator = Ti.UI.createView({
	    bottom:0,
	    left:5,
	    right:5,
	    height: 0.5,
	    width:	Ti.UI.FILL,
	    backgroundColor: '#FAF9F3',
	});
	
	bookView.add(tableRowSeperator);
	
	// Add bookView to row
	bookRow.add(bookView);
	
	//Push bookRow to tableData Array
	tableData.push(bookRow);
	
	// 	  End Creation of TableViewRows as rows of Books	 //
	//////////////////////////////////////////////////////////
	
}; 
// END Loop - Create bookRow of books in loop with - bookview and booklabel

return tableData;

};
//							END Function bookMenuTable		 							  // 
////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = bookMenuTable;