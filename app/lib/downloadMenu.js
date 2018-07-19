//////////////////////////////////////////////////////////////////////////////////////////////////
// 							START FUNCTION to create Download menu								//

function createDownloadMenu(data){
	
//////////////////////////////////////////////////////////////////////////////////////////////
//						START Create Download Book Menu 								    //

// Create tableData array with all views for Menu downloadTableView
var downloadTableData = [];

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
	// 	Start Creation of downloadTableViewRows as rows of Books	//
	
	// set enabled
	var enabled = bookData.isActive;
	
	// START IF - enabled
	if (enabled){
		var touchEnabledValue = true;
		var backgroundColorValue = "#0e74af";
	}else{
		var touchEnabledValue = false;
		var backgroundColorValue = "#5492b5";
	}
	// END IF - enabled
	
	// Start Create downloadTableViewRow	  
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
	    bookID: bookID,								// bookID for Click Event
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
	
	// Add bookLabel to bookView
	bookView.add(bookLabel);
		
	// set audioExist
	var audioExist = getSetBookData({	getSet: "getAudioExist",
										bookID: bookData.bookID,
									});
	
	if (audioExist){
		
		// Create Book Row Image
		var bookRowImage = Ti.UI.createView({
			left:0,
			width:"50dp",
			height:"50dp",
			backgroundImage: "/images/menu_closed_download.png",				
		}); 
		
		// addEventListener to the bookView in the Row 	
		bookView.addEventListener('click', function(e){	
			
			// run callback function updateRow with this.bookid as id of row clicked		
			var bookID = this.bookID;	
			data.updateRowsFunction(bookID);

		});  
		
		// Add bookRowImage to bookView
		bookView.add(bookRowImage);
		
		///////////////////////////////////////////////////////////////////////////////////////////////
		//  						START create completeProgressBar								//
		// START - create progressBar
		var versionRequired = "4.0";
			
		if (OS_IOS || (OS_ANDROID && versionCompare(Ti.Platform.version,versionRequired) == true)) {
				
			if (OS_IOS){
				var bottomVar = 4;
				var styleVar = Titanium.UI.iOS.ProgressBarStyle.PLAIN;
			}else{
				var bottomVar = "-5dp";
				var styleVar = '';
			};
				
			var progressBar = Titanium.UI.createProgressBar({
				bottom:bottomVar,
				left:0,
				width: Ti.UI.FILL,
				height: 'auto',
				min:0,
				max:1,
				value:0,
				font: {fontSize:20, fontWeight:'bold'}, 
				style: styleVar,
				visible: false,			
			});
		
		}else{
			
				var progressBar = Titanium.UI.createSlider({
					bottom: 0,
					width: Ti.UI.FILL,
					height: "5dp",
					min:0,
					max:1,
					value:0,
					font : {fontSize:5, fontWeight:'bold'}, 
					thumbImage: "/images/transparent.png",
					rightTrackImage: "/images/slider_right.png",
					leftTrackImage: "/images/slider_left.png",
					touchEnabled: false,
					visible: false,	
			
				});
				
		};
		// add progressBar to topLabelView
		bookView.add(progressBar);
		
		//  						END create completeProgressBar									//
		//////////////////////////////////////////////////////////////////////////////////////////////
	
	}else{
		
		// START IF - enabled
		if (enabled){
			
			// START IF IPHONE ELSE IF ANDROID and ANDROID < 4.2
	        var versionRequired = "4.0";
	
			if (OS_IOS || OS_ANDROID && versionCompare(Ti.Platform.version,versionRequired) == true) {
	                var comingSoon = L("audioComingSoon");
            }else{
            		var comingSoon = L("audioComingSoonFix");
            };    
                
			//Create bookLabel
			var audioLabel = Ti.UI.createLabel({
			    left: 5,
			    color:'white',
			    text: comingSoon,				
			    font: {
			        fontSize: '16dp',
			        fontFamily: Alloy.Globals.customFont,
			    },	
			 });
			
			// Add bookRowImage to bookView
			bookView.add(audioLabel);
			
		};
		// END IF - enabled
				
	};
	
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
	downloadTableData.push(bookRow);
	
	// 	  End Creation of TableViewRows as rows of Books	 //
	//////////////////////////////////////////////////////////
	
	
}; 
// END Loop - Create bookRow of books in loop with - bookview and booklabel

//								End Create Book Menu 									      //
////////////////////////////////////////////////////////////////////////////////////////////////

return downloadTableData;
	
};

// 						 END FUNCTION to create Download menu									//
//////////////////////////////////////////////////////////////////////////////////////////////////	

module.exports = createDownloadMenu;