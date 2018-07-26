////////////////////////////////////////////////////////////////////////////////////////////////////
//							Start Function bookMenuChapterTableRow								  // 

function bookMenuChapterTableRow(data){

	// set i as data.bookId
	var functionBookID = data.bookID;
	
	//Ti.API.info("functionBookID's datatype: " + typeof functionBookID);
	//Ti.API.info("functionBookID's value: " + functionBookID);
		
	// get bookData
	var bookData = getSetBookData({	getSet: "getBookRecord",
									bookID: functionBookID,
					});
						
	////////////////////////////////////////////////////////////////////////////////////////
	//		 START SET OF lastOpenChaperID to know what chapter is currently open  		//
		
	// get Ti.App.Properties - lastOpenView
	var lastOpenView = JSON.parse(Ti.App.Properties.getString('lastOpenView','{}'));	
	
	// set chapterData
	var chapterData = lastOpenView.lastOpenViewData;
	
	// set lastOpenBook and lastOpenChapter
	var lastOpenBook = chapterData.book;
	var lastOpenChapter = chapterData.chapter;
	
	//		END SET OF lastOpenChaperID to know what chapter is currently open  		//
	////////////////////////////////////////////////////////////////////////////////////////
			
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
		
	// set audioExist
	var audioExist = getSetBookData({	getSet: "getAudioExist",
										bookID: functionBookID,
									});
	
	// START Loop - throught chapters to create Chapter Boxes
	for (var q=0; q<rowChapters; q++){
		
		// set chapterNumberValue
		var chapterNumberValue = (+q+1);
			
		// START IF - check if q is currentChatper and set colors
		if (functionBookID == lastOpenBook && chapterNumberValue == lastOpenChapter){
			
			var backgroundColorVar = "#474a43";
			var fontColorVar = "white";
			
		}else{
			
			var backgroundColorVar = "#FAF9F3";
			var fontColorVar = "black";
		};
		// END IF - check if q is currentChatper and set colors
		
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
		
		// Create chapterNumberBox	
		var chapterNumberBox = Ti.UI.createView({
			// For Right to Left Set Top and Right
			top: topValue,
			right: rightValue,
			// For Right to Left Set Top and Right
			height: "50dp",
			width: boxWidth,
			backgroundColor: backgroundColorVar,
			borderColor: "#474a43",
		    borderWidth: 1,
		    book: functionBookID,
		    chapter: chapterNumberValue,
		    
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
                if (functionBookID == 19){
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
            if (functionBookID == 19){
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
			textAlign: 'center',
			color: fontColorVar,
			font: {
		        fontSize: '16dp',
		        fontFamily: Alloy.Globals.customFont
		    },
		}); 
		
		// addEventListener to chapterNumberBox		
		chapterNumberBox.addEventListener('click', function(e){
			
			// run function chapterClicked with this.chapterid as id of chapter clicked
			var chapterClickData = {
				book:this.book,
				chapter:this.chapter,
			};
			
			// run callback function back to bookMenue via data
			data.chapterClicked(chapterClickData);
							
		});
		
		// Add chapterNumber to chapterNumberBox
		chapterNumberBox.add(chapterNumber); 
		
		// START IF - audioExist else nothing
		if (audioExist){
			
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
			
			//Ti.API.info("audioInstalled chapterDatabaseId: " + chapterID);
			
			// set audioInstalled
			var audioInstalled = getSetBookData({	getSet: "getAudioInstalled",
													rowNum: chapterID,
			});
			
			// END CHECK - audioInstalled
			
			// START IF - audioInstalled
			if (audioInstalled == "true"){
				
				// set backgroundImageVar
				var backgroundImageVar = "/images/audio_download_complete.png";
				
			}else{
			
				// set backgroundImageVar
				var backgroundImageVar = "/images/audio_download.png";
			
			};	
			// END IF - audioInstalled
			
			// Create downloadedImage Image
			var downloadedImage = Ti.UI.createView({
				left:0,
				bottom:0,
				width:"25dp",
				height:"25dp",
				backgroundImage: backgroundImageVar,				
			}); 
				
			// Add downloadedImage to chapterNumberBox
			chapterNumberBox.add(downloadedImage);
			
		};		
		
		// Add chapterNumberBox to chapterView
		chapterView.add(chapterNumberBox);  	
	
	};	
	// END Loop - throught chapters to create Chapter Boxes
	
	// Add chapterView to newBookRow	
	newBookRow.add(chapterView);
	
	// return newBookRow
	return newBookRow;
		
	//  End Creation of NewTableViewRow as rows of Chapters    //
	////////////////////////////////////////////////////////////
	
};

//							END Function bookMenuChapterTableRow 		 							  // 
////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = bookMenuChapterTableRow;