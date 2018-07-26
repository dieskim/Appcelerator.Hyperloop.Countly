////////////////////////////////////////////////////////////////////////////////////////////////
//							Start Function createNewTableRow 								  // 

function createNewTableRow(data){
	
	// set i as data.bookId
	var functionBookID = data.bookID;
	
	// get bookData
	var bookData = getSetBookData({	getSet: "getBookRecord",
									bookID: functionBookID,
					});
					
	////////////////////////////////////////////////////////////
	// Start Creation of NewTableViewRow as rows of Chapters //
	
	// Get Chapter Amount
	var rowChapters = bookData.chapterCount;
	
	// Row Height Calculations
	var rowAmounts = Math.ceil(rowChapters/5);								
	var rowNewHeight = (rowAmounts*50);  
	
	// selection style for iOS
	if (OS_IOS){
		var selectionStyle = Titanium.UI.iOS.TableViewCellSelectionStyle.NONE;
	}else{
		var selectionStyle = '';
	};
		
	// Create newBookRow							
	var newBookRow = Ti.UI.createTableViewRow({
	    className:'bookRow', 					// used to improve table performance
	    height: rowNewHeight+'dp',
	    width:	Ti.UI.FILL,
	    top: 0,    
	    layout: "vertical",
	    selectionStyle: selectionStyle,
	    rowId: 'newRow', 						// rowId for events
	    expanded:false,							// if row is expanded for events
	    mainRow: false,							// if row is main Row for events
	});
	
	//Create bookView
	var chapterView = Ti.UI.createView({
	    top: 0,
	    width:	Ti.UI.FILL,
	    backgroundColor: '#474a43', 
	    // For Right to Left set Layout to Composite
	    layout: "composite",
	});
		
	
	// START Loop - throught chapters to create Chapter Boxes
	for (var q=0; q<rowChapters; q++){
	
		// set chapterNumberValue
		var chapterNumberValue = (+q+1);
		
		// START CHECK - audioInstalled
		// set chapterRecord
		var chapterRecord = getSetBookData({	getSet: "getChapterRecord",
												bookID: functionBookID,
												chapterNum: chapterNumberValue,
		});
			
		// set currentActiveChapterID as ID of chapter in chapter record
		var currentActiveChapterID = chapterRecord.rowid;
			
		// !!  FIX FOR WHEN NOT ALL BOOKS ARE ENABLED !! //
		// var chapterID = currentActiveChapterID;
		// set chapterID as ID of chapter in ALL Chapters (1189)
		var chapterID = activeChapterRowIDArray[currentActiveChapterID-1];
			
		// set chapter boxWidth to 19.9% to work on all platforms
		var boxWidth = "19.9%";
		
		// For Right to Left Calculate Heigh Value
		var topCalculation =  Math.floor(q/5);
		var topHeight = topCalculation*50;
		var topValue = topHeight + "dp";
		
		// For Right to Left Calculate Right Value
		var rightRemove = topCalculation*99.75;
		var rightCalculation = (q*19.95) - rightRemove;
		var rightValue = rightCalculation + '%';
		
		// Create chapterNumberBox as container
		var chapterNumberBox = Ti.UI.createView({
			// For Right to Left Set Top and Right
			top: topValue,
			right: rightValue,
			// For Right to Left Set Top and Right
			height: "50dp",
			width: boxWidth,
			backgroundColor: '#FAF9F3',
			borderColor: "#474a43",
		    borderWidth: 1,
		}); 
		
		var chapterNumberView = Ti.UI.createView({
			height: Ti.UI.FILL,
			width: Ti.UI.FILL,
			chapterID: chapterID,		// set chapterID
			id: "chapterNumber",
		}); 
		
		// DEFINE CHAPTER END FOR U TEXT
        // START IF IPHONE ELSE IF ANDROID and ANDROID < 4.2
        var versionRequired = "4.0";
		
		// Convert and set chapterTitle
		var chapterTitle = L("chapter_title", "false");
		var chapterChapterTitleString = chapterTitle;
		var convertedChapterTitleText = Alloy.Globals.textConverter(chapterChapterTitleString);
		
		var psalmsTitle = L("psalms_title", "false");
		var pslamsTitleString = psalmsTitle;
		var convertedPsalamsTitleText = Alloy.Globals.textConverter(pslamsTitleString);

        if (OS_ANDROID && versionCompare(Ti.Platform.version,versionRequired) == false){
                var chapterNumberValue = (q+1);

                //START IF FIRST 9 CHAPTER ADD SPACE BEFORE NUMBER TO MAKE IT ALL TWO LINES
                if (q<10){
                    var ltrChapterStart = ' ' + JSON.stringify(chapterNumberValue).split("").reverse().join("");
                 }else{
                    var ltrChapterStart = JSON.stringify(chapterNumberValue).split("").reverse().join("");
                }
                //END IF FIRST 9 CHAPTER ADD SPACE BEFORE NUMBER TO MAKE IT ALL TWO LINES 
                // START IF PSALMS ADD SPESIFIC CHAPTER END NAME
                if (functionBookID === 19){
                    var rtlChapterText = convertedPsalmsTitleString;
                }else{
                    var rtlChapterText = convertedChapterTitleString;
                } 
                // END IF PSALMS ADD SPESIFIC CHAPTER END NAME
 
                var chapterName =  '\u200F' + (ltrChapterStart + rtlChapterText);

        }else{
            
            //START IF FIRST 9 CHAPTER ADD SPACE BEFORE NUMBER TO MAKE IT ALL TWO LINES
            if (q<10){
                var chapterStart = ' ' + (q+1);
            }else{
                var chapterStart = (q+1);
            }
            //END IF FIRST 9 CHAPTER ADD SPACE BEFORE NUMBER TO MAKE IT ALL TWO LINES
            // START IF PSALMS ADD SPESIFIC CHAPTER END NAME
            if (functionBookID === 19){
                var chapterEnd = convertedPsalamsTitleText;
            }else{
                var chapterEnd = convertedChapterTitleText;
            } 
            // END IF PSALMS ADD SPESIFIC CHAPTER END NAME   
            var chapterName = chapterStart + chapterEnd;
            
        };   
        // END IF IPHONE ELSE IF ANDROID and ANDROID < 4.2
        
		// Create chapterNumber Label    
		var chapterNumber = Ti.UI.createLabel({	
			text: chapterName,
			color: 'black',
			font: {
		        fontSize: '16dp',
		        fontFamily: Alloy.Globals.customFont
		    },
		    touchEnabled: false,		    
		}); 
		
				
		// Add chapterNumber to chapterNumberBox
		chapterNumberView.add(chapterNumber); 
		
		// set chapterRecord
		var chapterRecord = getSetBookData({	getSet: "getChapterRecord",
												bookID: functionBookID,
												chapterNum: chapterNumberValue,
		});
		
		// set currentActiveChapterID as ID of chapter in chapter record
		var currentActiveChapterID = chapterRecord.rowid;
			
		// !!  FIX FOR WHEN NOT ALL BOOKS ARE ENABLED !! //
		// var chapterID = currentActiveChapterID;
		// set chapterID as ID of chapter in ALL Chapters (1189)
		var chapterID = activeChapterRowIDArray[currentActiveChapterID-1];
			
		//Ti.API.info("audioInstalled chapterDatabaseId: " + chapterID);
			
		// set audioInstalled
		var audioInstalled = getSetBookData({	getSet: "getAudioInstalled",
													rowNum: chapterID,
		});
			
		// START IF - audioInstalled
		if (audioInstalled == "true"){
			
			// disable chapterNumberBox touch
			chapterNumberView.touchEnabled = false;
			// set backgroundImageVar
			var backgroundImageVar = "/images/audio_download_complete.png";
			
		}else{

			// set backgroundImageVar as none
			var backgroundImageVar = "/images/audio_download.png";		
			
		};	
		// END IF - audioInstalled
		
		// START - create progressBar
		var versionRequired = "4.0";
		
		// START IF - not android lower than 4.0 else
		if (OS_IOS || (OS_ANDROID && versionCompare(Ti.Platform.version,versionRequired) == true)) {
				
			if (OS_IOS){
				var bottomVar = 10;
				var styleVar = Titanium.UI.iOS.ProgressBarStyle.PLAIN;
			}else{
				var bottomVar = "5dp";
				var styleVar = '';
			};
		
			// create progressBar
			var progressBar = Titanium.UI.createProgressBar({
			   	bottom:bottomVar,
			    width: Ti.UI.FILL,
			   	height: 'auto',
			   	right:10,
			   	left:10,
			    min:0,
			    max:1,
			    value:0,
			    font: {fontSize:20, fontWeight:'bold'}, 
			    style: styleVar,
			    touchEnabled: false,
			    visible: false,	
			     	
			});
			
				
		}else{
	
			var progressBar = Titanium.UI.createSlider({
				bottom: "5dp",
				width: Ti.UI.FILL,
				right: "10dp",
			   	left: "10dp",
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
		// END IF - not android lower than 4.0 else
			
		// Add progressBar to chapterNumberBox
		chapterNumberView.add(progressBar);
			
		// Create downloadedImage Image
		var downloadedImage = Ti.UI.createView({
			left:0,
			bottom:0,
			width:"25dp",
			height:"25dp",
			backgroundImage: backgroundImageVar,		
			touchEnabled: false,	
		}); 
			
		// Add downloadedImage to chapterNumberBox
		chapterNumberView.add(downloadedImage);
		
		// Add deleteButton to chapterView
		chapterNumberBox.add(chapterNumberView);
		
		// create downloadButton
		var deleteButton = Titanium.UI.createButton({
			title: L("deleteButtonText"),
			backgroundImage: "/images/red_button.png",
			backgroundSelectedImage: "/images/red_button_clicked.png",
			height: Ti.UI.FILL,
			width:	Ti.UI.FILL,
			right:"5dp",
			left:"5dp",
			top:"5dp", 
			bottom:"5dp",
			chapterID: chapterID, 								// chapterID for events
			visible:false,
			font: {
				fontSize: '16dp',
				fontFamily: Alloy.Globals.customFont
			},
			color: "white", 
		});
					
		// Add deleteButton to chapterView
		chapterNumberBox.add(deleteButton);
		
		// addEventListener to the deleteButton in the Row 	
		deleteButton.addEventListener('click', function(e){				
			//Ti.API.info("DeleteButton Clicked" + this.chapterID);
		
			// START IF - has data.deleteFunction
			if (data.deleteFunction){
				// run data.deleteFunction callback function
				var deleteData = {chapterID: this.chapterID,
		    					 };
		    	
		    	data.deleteFunction(deleteData);
		    	
			};
			// END IF - has data.datastream function
		     		
		});
			
		// addEventListener to chapterNumberBox		
		chapterNumberView.addEventListener('click', function(e){
			// run function chapterClicked with this.chapterID
			//Ti.API.info("Chapter Clicked - Download" + this.chapterID);
							
			// FireEvent downloadMenuFunction
			Ti.App.fireEvent('app:downloadFunction',{
		    	chapterID: this.chapterID,      	
		    });	
		    			    		
		});
				
		// Add chapterNumberBox to chapterView
		chapterView.add(chapterNumberBox);  	
	
	};	
	// END Loop - through chapters to create Chapter Boxes
	
	// Add chapterView to newBookRow	
	newBookRow.add(chapterView);
	
	//Push bookRow to tableData Array
	return newBookRow;
		
	//  End Creation of NewTableViewRow as rows of Chapters    //
	////////////////////////////////////////////////////////////    

};

//							END Function createNewTableRow 		 							  // 
////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = createNewTableRow;