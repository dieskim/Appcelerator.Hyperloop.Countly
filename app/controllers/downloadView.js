// set Alloy.Globals.openWindow
Alloy.Globals.openWindow = $.downloadWindow;

////////////////////////////////////////////////////////////////////////////////////////////////////////
// 			Listen for android back button and close all Views on top that might be displayed		  //

$.downloadWindow.addEventListener('androidback', function (e){
	
	// START IF - Alloy.Globals.openAlertForm not open
	if (!Alloy.Globals.openAlertForm){
		
		// run closeWindow
		closeWindow();	
		
	};	
	// END IF - Alloy.Globals.openAlertForm not open
	
});

// Close Window function
function closeWindow(e) {	 
     
     // run closeDownloads function
     closeDownloads();    
     
     // fireEvent to setOpenWindow
     Ti.App.fireEvent("app:setOpenWindow");
     
};

// close Downloads Function
function closeDownloads(e){
	$.downloadWindow.close();

	Ti.App.removeEventListener("app:updateSingleProgressBar", updateSingleProgressBar);
	Ti.App.removeEventListener("app:updateCompleteProgressBar", updateCompleteProgressBar);
};

//////////////////////////////////////////////////////////////////////////////
// 				START EDIT MENU SHOW HIDE FUNCTIONS							//

// set editShow false
var editShow = false;

// START FUNCTION - editFunction to show or hide editMenu
function editFunction(showHide){
			
	// START IF - showHide is hide
	if (showHide == "hide"){
		
		// reset editButton title
		$.editButton.backgroundImage = "/images/menu_trash.png";
        $.editButton.backgroundSelectedImage = "/images/menu_trash_clicked.png";
		
		// set editShow false
		editShow = false;
			
	}else{ // ELSE - showHide is not hide
		
		// START IF - check if edit Menu is shown and hide - else show
		if (editShow == true){
			Ti.API.info("Hide Delete Buttons");
			
			// reset editButton title
			$.editButton.backgroundImage = "/images/menu_trash.png";
	        $.editButton.backgroundSelectedImage = "/images/menu_trash_clicked.png";
			
			// get rowCount for table
			var rowCount = downloadTableView.data[0].rowCount;
						
			// START Loop - throught menu rows
			for (z=0; z<rowCount; z++) { 
											
				// set rowCheck we will check
				var rowCheck = downloadTableView.data[0].rows[z];
				// get expanded value of newrowCheck
				var rowExpanded = rowCheck.expanded;
				
				// START IF -  rowExpanded is true set rowExpandedId as z	
				if (rowExpanded == true){
					var rowExpandedId = z;	
				};
				// END IF - rowExpanded is true set rowExpanded as z
		
			};
			// END Loop - throught menu rows
			
			// set bookID
			var bookID = padZero((+rowExpandedId + 1), 2);
				
			// get bookRecord
			var bookRecord = getSetBookData({	getSet: "getBookRecord",
												bookID: bookID,
								});
									
			// set firstBookChapterRecord
			var firstBookChapterRecord = getSetBookData({	getSet: "getChapterRecord",
															bookID: bookID,
															chapterNum: 1,
			});
				
			// set firstBookActiveChapterID
			var firstBookActiveChapterID = firstBookChapterRecord.rowid;
					
			// !!  FIX FOR WHEN NOT ALL BOOKS ARE ENABLED !! //
			// var firstBookChapterID = firstBookActiveChapterID;
			// set chapterID as ID of chapter in ALL Chapters (1189)
			var firstBookChapterID = activeChapterRowIDArray[firstBookActiveChapterID-1];
						
			// set chapterAmount
			var chapterAmount = bookRecord.chapterCount;
			
			// set chapterHeadingRow
			var chapterHeadingRow = downloadTableView.data[0].rows[rowExpandedId];
			
			// hide deleteWholeBook Button
			chapterHeadingRow.children[1].visible = false;
			
			// set chapterViewRow	
			var chapterViewsRow = downloadTableView.data[0].rows[+rowExpandedId+1].children[0];
						
				// START Loop - hide all delete buttons
				for (var i=0; i<chapterAmount; i++){
					
					// set chapterID and get audioInstalled
					var chapterID = (+firstBookChapterID + i );
					
					// set audioInstalled
					var audioInstalled = getSetBookData({	getSet: "getAudioInstalled",
															rowNum: chapterID,
					});
								
					// START IF - audioInstalled 
					if (audioInstalled == "true"){
					
						// hide deleteButton
						chapterViewsRow.children[i].children[1].visible = false;
					
					}else{
						
						// enable other views touch
						chapterViewsRow.children[i].children[0].touchEnabled = true;
						
					};
					// END IF - audioInstalled 		
							
				};
				// END Loop - hide all delete buttons
					
			// set editShow false to show editShow is hidden
			editShow = false;
			
		}else{ // ELSE editShow is false so show menu			
			Ti.API.info("Show Delete Buttons");
			
			// get rowCount
			var rowCount = downloadTableView.data[0].rowCount;
						
			// START Loop - throught menu rows
			for (z=0; z<rowCount; z++) { 
											
				// set rowCheck
				var rowCheck = downloadTableView.data[0].rows[z];
				// get expanded value of newrowCheck
				var rowExpanded = rowCheck.expanded;
				
				// START IF - rowExpanded is true set rowExpandedId as z	
				if (rowExpanded == true){
					var rowExpandedId = z;	
				};
				// END IF - rowExpanded is true set rowExpandedId as z	
		
			};
			// END Loop - throught menu rows
			
			// START IF - nothing downloaded show error message
			if (rowExpandedId == null) {				
				
				// fire app:showAlertMessage with message
				Ti.App.fireEvent("app:showAlertMessage",{
		        	message: L("selectBook"),         	
		        });		
		        			
			}else{ // ELSE rowExpanded
				
				// set bookID
				var bookID = padZero((+rowExpandedId + 1), 2);
				
				// get bookRecord
				var bookRecord = getSetBookData({	getSet: "getBookRecord",
													bookID: bookID,
									});
									
				 // set firstBookChapterRecord
				var firstBookChapterRecord = getSetBookData({	getSet: "getChapterRecord",
																bookID: bookID,
																chapterNum: 1,
				});
				
				// set firstBookActiveChapterID
				var firstBookActiveChapterID = firstBookChapterRecord.rowid;
					
				// !!  FIX FOR WHEN NOT ALL BOOKS ARE ENABLED !! //
				// var firstBookChapterID = firstBookActiveChapterID;
				// set chapterID as ID of chapter in ALL Chapters (1189)
				var firstBookChapterID = activeChapterRowIDArray[firstBookActiveChapterID-1];
						
				// set chapterAmount
				var chapterAmount = bookRecord.chapterCount;
							
				// set chapterViewRow	
				var chapterViewsRow = downloadTableView.data[0].rows[+rowExpandedId+1].children[0];
				
				// set hasDownloads as false before check
				var hasDownloads = false;
								
				// START Loop - showAll delete buttons
				for (var i=0; i<chapterAmount; i++){
									
					// set chapterID and get audioInstalled
					var chapterID = (+firstBookChapterID + i );
					
					// set audioInstalled
					var audioInstalled = getSetBookData({	getSet: "getAudioInstalled",
															rowNum: chapterID,
					});
					
						// START IF - audioInstalled is not true
						if (audioInstalled == "true"){
							
							// START IF - hasDownloads is still false
							if (hasDownloads == false){
								
								// set editButtonTitle
								$.editButton.backgroundImage = "/images/menu_trash_clicked.png";
						        $.editButton.backgroundSelectedImage = "/images/menu_trash.png";
				
								// set chapterHeadingRow
								var chapterHeadingRow = downloadTableView.data[0].rows[rowExpandedId];
				
								// show deleteWholeBook Button
								chapterHeadingRow.children[1].visible = true;		
								
								// set hasDownloads as true
								hasDownloads = true;
								
							};
							// END IF - hasDownloads is still false
							
							// show deleteButton
							chapterViewsRow.children[i].children[1].visible = true;
							
						}else{
							
							// disable other views touch
							chapterViewsRow.children[i].children[0].touchEnabled = false;
							
						};
						// END IF - audioInstalled is not true
						
				};
				// END Loop - showAll delete buttons
				
				// START IF - check if hasDownloads is still false
				if (hasDownloads == false){
					
					// fire app:showAlertMessage with message
					Ti.App.fireEvent("app:showAlertMessage",{
		        		message: L("noDownloadsInBook"),          	
		       		 });		
					
					// START Loop - reEnable all buttons
					for (var i=0; i<chapterAmount; i++){
						
						// enable other views touch
						chapterViewsRow.children[i].children[0].touchEnabled = true;
					};	
					// END Loop - reEnable all buttons
					
				}else{
					
					// set editShow true;
					editShow = true;
					
				};
				//END IF - check if hasDownloads is still false
				
			};
			// END IF - nothing downloaded show error message
				
		};
		// END IF - check if edit Menu is shown and hide - else show
	
	};
	// END IF - showHide
};
// END FUNCTION - editMenu to show or hide editMenu

// 				END EDIT MENU SHOW HIDE FUNCTIONS							//
//////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////
//							  	Start Function updateRows 									  // 
//			if Clicked insert new row under row clicked and scroll to row clicked			  //


// START Function - updateRows
function updateRows(functionBookID){ 
	
	//Ti.API.info("updateRows: " + functionBookID);
	
	///////////////////////////////////////////////////////////////
	// 				START  - ADDING ACTIVITYLOADER VIEW			//
			
	// require module activityLoader and add to currentWindow
	var activityLoaderFunction = require('activityLoader/activityLoader');
	var activityLoader = activityLoaderFunction();
	$.downloadWindow.add(activityLoader);
			
	// 				END - ADDING ACTIVITYLOADER VIEW			 //	
	///////////////////////////////////////////////////////////////
	
	////////////////////////////////////////////////////////////////////////
	//				Start Delete all the non Main rows  				  //
	//  if Row is deleted change expanded of row above to rowRemoved	  //
	
	// Get rowCount from downloadTableView
	var rowCount = downloadTableView.data[0].rowCount;
	// Set rowDeleted to false to be able to stop check
	var rowDeleted = false;
	
	// START Loop - throught menu rows - if the row is not a main row then delete it
	for (x=0; x<rowCount; x++) { 	
		
		// Row we will check is row x
	   	var rowCheck = downloadTableView.data[0].rows[x];
	   	
		// START IF - row has not been deleted yet
		if (rowDeleted == false){
		
			// get rows mainRow value
			var mainRow = rowCheck.mainRow;
		
			// START IF - Check ever row - if mainRow is false then we need to remove that Row   	
			if (mainRow == false){
			   		
					// Set rowFoundIndex to x
			   		var rowFoundIndex = x;
			   		
			   		///////////////////////////////////////////////////
			   		//  	set rowBeforeIndex to 'rowRemoved'	 	// 
			   		   	
			   		// set rowBeforeIndexed to rowFoundIndex - 1
			   		var rowBeforeIndex = rowFoundIndex-1;
			   		// rowBefore extra row to get expanded value of
					var rowBefore = downloadTableView.data[0].rows[rowBeforeIndex];								
			   		
			   		///////////////////////////////////////////////////////////////////////////////
					// 			Create Closed TableViewRow and update Table Row					///
					//			1. set expanded value to rowRemoved								///
					// 			2. change the bookView backgroundColor							///
					// 			3. change the bookRowView backgroundimage to a closed image		///
					
					var closedbookRow = Ti.UI.createTableViewRow({
					    className:'bookRow', 						// used to improve table performance
					    height: "50dp",
					    width:	Ti.UI.FILL,
					    top: 0,    
					    layout: "vertical",
					    backgroundSelectedColor: '#90B81A',
					    rowId: rowBefore.rowId, 					// rowId for events
					    expanded: "rowRemoved",						// if row is expanded for events
					    mainRow: true,								// if row is main Row for events
					});
					
					// START IF - IOS add selectionStyle
					if (OS_IOS){
						closedbookRow.selectionStyle = Ti.UI.iOS.TableViewCellSelectionStyle.GRAY;
					};
					// START IF - IOS add selectionStyle
					
					//Create bookView
					var closedbookView = Ti.UI.createView({
					    top: 0,
					    height: "50dp",
					    width:	Ti.UI.FILL,
					    backgroundColor: '#0e74af',
					    bookID: rowBefore.children[0].bookID,		// bookID for events
					});
					
					//Create bookLabel
					var closedbookLabel = Ti.UI.createLabel({
					    color:'white',
					    text: rowBefore.children[0].children[0].text,				// Book name
					    font: {
					        fontSize: '20dp',
					        fontFamily: Alloy.Globals.customFont
					    },	
					  	});
					
					// Create Book Row Image
					var closedbookRowImage = Ti.UI.createView({
						left:0,
						width:"50dp",
						height:"50dp",
						backgroundImage: "/images/menu_closed_download.png",				
					}); 
					
					// addEventListener to the Row 					
					closedbookView.addEventListener('click', function(e){
						// run function updateRow with this.bookID as id of row clicked
						updateRows(this.bookID);					
					});
					
					// add closedbookLabel to closedbookView	
					closedbookView.add(closedbookLabel);
					// add closedbookRowImage to closedbookView
					closedbookView.add(closedbookRowImage);
					
					///////////////////////////////////////////////////////////////////////////////////////////////
					//  						START create completeProgressBar								//
					// 							START - create progressBar
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
					closedbookView.add(progressBar);
					
					//  						END create completeProgressBar									//
					//////////////////////////////////////////////////////////////////////////////////////////////
					
					var closedTableRowSeperator = Ti.UI.createView({
					    bottom:0,
					    left:5,
					    right:5,
					    height: 0.5,
					    width:	Ti.UI.FILL,
					    backgroundColor: '#FAF9F3',
					});
					
					closedbookView.add(closedTableRowSeperator);
	
					// add closedbookView to closedbookRow
					closedbookRow.add(closedbookView);
					
					// update tableView row with closedbookRow	
					downloadTableView.updateRow(rowBeforeIndex,closedbookRow);
										
					// 						TableViewRow update Done							//	   		
			   		//  		Done setting rowBeforeIndex to 'rowRemoved'  					//
			   		//////////////////////////////////////////////////////////////////////////////
					
					if (OS_IOS){
						var animationVar = Titanium.UI.iOS.RowAnimationStyle.NONE;
					}else{
						var animationVar = null;
					}; 
					
			   		// Remove the non mainRow found
			   		downloadTableView.deleteRow(rowFoundIndex,{animationStyle:animationVar});
				
					// Set rowDeleted to true to stop row check
					var rowDeleted = true;	
					
					// hide editFunction Menu
					editFunction("hide");	
			};
			// END IF - Check ever row - if mainRow is false then we need to remove that Row 
	   	};	
		// END IF - row has not been deleted yet	
	};
	// END START Loop - throught menu rows - if the row is not a main row then delete it
	
	//				 End Delete all the non Main rows  	     			  //
	////////////////////////////////////////////////////////////////////////
	
	////////////////////////////////////////////////////////////////////////
	//   			  Start Add row under the row Clicked    			 //
	
	// index of menu clicked is clicked viwes bookID value
	var clickedIndex = (parseInt(functionBookID,10) - 1);
	
	// Row to get expanded value of
	var rowClicked = downloadTableView.data[0].rows[clickedIndex];
		
	// get rows expanded value
	var expanded = rowClicked.expanded;
		
		// START IF - row is Expanded or not
		// 1. set rowClicked expanded as true
		// 2. Check all rows - find row with expanded = rowBelow and change to false
		// 3. add row below row clicked
		if (expanded == false) {		
		
			///////////////////////////////////////////////////////////////////////////////
			// 			Create Closed downloadTableViewRow and update Table Row					///
			//			1. set expanded value to true									///
			// 			2. change the bookView backgroundColor							///
			// 			3. change the bookRowView backgroundimage to a open image		///
			 
			// Creat openbookRow  
			var openbookRow = Ti.UI.createTableViewRow({
			    className:'bookRow', 						// used to improve table performance
			    height: "50dp",
			    width:	Ti.UI.FILL,
			    top: 0,    
			    backgroundSelectedColor: '#90B81A',
			    rowId: rowClicked.rowId, 					// rowId for events
			    expanded: true,								// if row is expanded for events
			    mainRow: true,								// if row is main Row for events
			    layout: 'composite',
			});
			
			// START IF - IOS add selectionStyle
			if (OS_IOS){
				openbookRow.selectionStyle = Ti.UI.iOS.TableViewCellSelectionStyle.GRAY;
			};
			// START IF - IOS add selectionStyle
					
			//Create bookView
			var openbookView = Ti.UI.createView({
			    top: 0,
			    height: "50dp",
			    width:	Ti.UI.FILL,
			    backgroundColor: '#474a43',
			    bookID: rowClicked.children[0].bookID,		// bookID for events
			});
			
			//Create bookLabel
			var openbookLabel = Ti.UI.createLabel({
			    color:'white',
			    text: rowClicked.children[0].children[0].text,				// Book name
			    font: {
			        fontSize: '20dp',
			        fontFamily: Alloy.Globals.customFont
			    },	
			});
			
			// Create Book Row Image
			var openbookRowImage = Ti.UI.createView({
				left:0,
				width:"50dp",
				height:"50dp",
				backgroundImage: "/images/menu_open.png",				
			}); 
			
			// addEventListener to the Row 
			openbookView.addEventListener('click', function(e){
				// run function updateRow with this.bookID as id of row clicked
				updateRows(this.bookID);
			
			});	
			
			// add openbookLabel to openbookView
			openbookView.add(openbookLabel);
			// add openbookRowImage to openbookView
			openbookView.add(openbookRowImage);
			
					///////////////////////////////////////////////////////////////////////////////////////////////
					//  						START create completeProgressBar								//c
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
					openbookView.add(progressBar);
					
					//  						END create completeProgressBar									//
					//////////////////////////////////////////////////////////////////////////////////////////////
			
			// add openbookView to openbookRow
			openbookRow.add(openbookView);
			
			// create downloadButton
			var deleteButton = Titanium.UI.createButton({
				title: L("deleteCompleteButtonText"),
				backgroundImage: "/images/red_button.png",
				backgroundSelectedImage: "/images/red_button_clicked.png",
				height: "43dp",
				width:	"100dp",
				right:5,
				rowId: rowClicked.rowId, 								// chapterId for events
				visible:false,
				font: {
					fontSize: '16dp',
					fontFamily: Alloy.Globals.customFont
				},
				color: "white", 
			});
			
			// addEventListener to the deleteButton in the Row 	
			deleteButton.addEventListener('click', function(e){				
				//Ti.API.info("DeleteButton Clicked Complete" + this.rowId);
					
				// set bookID
				var bookID = (+this.rowId + 1);
				
				// FireEvent downloadAudioFunction
				deleteAllAudioFunction(bookID);
			    		
			});		
						
			// Add deleteButton to chapterView
			openbookRow.add(deleteButton);
			
			// update downloadTableView row clicked with openbookRow	
			downloadTableView.updateRow(clickedIndex,openbookRow);
						
			// 						downloadTableViewRow update Done							 //
			///////////////////////////////////////////////////////////////////////////////
		
			///////////////////////////////////////////////////////////////////////////////
		   	//  	Check all rows - find row expanded = rowRemoved and change to false	// 
		   		
		   	// Get rowCount from downloadTableView
			var NewrowCount = downloadTableView.data[0].rowCount;
			// set rowExpandedUpdate to false to be able to stop check
			var rowExpandedUpdated = false;
					
			// START Loop - throught menu rows
			for (z=0; z<NewrowCount; z++) { 
							
				// START IF -  row has not been found and changed yet
				if (rowExpandedUpdated == false){
					
					// set NewrowCheck
					var NewrowCheck = downloadTableView.data[0].rows[z];
					// get expanded value of newrowCheck
					var NewExpanded = NewrowCheck.expanded;
					
					// START IF-  NewExpanded = rowRemoved change to false	
					if (NewExpanded == 'rowRemoved'){				
						// set NewrowCheck.exanded to false
						NewrowCheck.expanded = false;
						// set rowExpandedUpdated to true to stop check
						rowExpandedUpdated = true;				
					};
					// END IF-  NewExpanded = rowRemoved change to false																	
				};
				// END IF -  row has not been found and changed yet				
			};
			// END Loop - throught menu rows
				
			// require chapterTableRow module in app/lib
			var downloadChapterTableRowFunction = require('downloadChapterTableRow');					
			
			// START - create new downloadNewTableRow with callback to delete
			var downloadNewTableRow = downloadChapterTableRowFunction({
				bookID: functionBookID,
				deleteFunction: function deleteFunction(deleteData){
					deleteSingleAudioFunction(deleteData);
				},
			});
			// END - create new downloadNewTableRow with callback to delete
			
			if (OS_IOS){
				var animationVar = Titanium.UI.iOS.RowAnimationStyle.DOWN;
			}else{
				var animationVar = null;
			}; 

			// Insert a new row under row clicked with clickedIndex
			downloadTableView.insertRowAfter(clickedIndex,downloadNewTableRow,{animationStyle:animationVar});
		
		// ELSE IF row expanded is rowRemoved set to false
		}else if (expanded == 'rowRemoved'){			
			rowClicked.expanded = false;	
		};
		// END IF - row is Expanded or not
		
	//   			  Start Add row under the row Clicked    			  //
	////////////////////////////////////////////////////////////////////////
	
	////////////////////////////////////////////////////////////////////////
	//					START Finally Scroll to row clicked      		  //
	
	if (OS_IOS){
		var positionVar = Titanium.UI.iOS.TableViewScrollPosition.TOP;
	}else{
		var positionVar = null;
	}; 

	// Scroll downloadTableView to clickedIndex as set in Add row section
	downloadTableView.scrollToIndex(clickedIndex, {
	            position : positionVar,
	            animated : true
	        });
	
	
	//					END Finally Scroll to row clicked      			   //
	////////////////////////////////////////////////////////////////////////
	
	// REMOVE ACTIVITYLOADER VIEW
	$.downloadWindow.remove(activityLoader);
};
// END Function - updateRows

//////////////////////////////////////////////////////////////////////////////////////////////
//  					START function to update singleProgressBar							//

// Add App eventlistener to listen for updateSingleProgessBar
Ti.App.addEventListener("app:updateSingleProgressBar", updateSingleProgressBar);

// START FUNCTION - updateSingleProgressBar
function updateSingleProgressBar(e){ 
		
		// set bookRowValue and chapterNumber
		var bookRowValue = (parseInt(e.bookID,10) - 1);
		var chapterNumber = (e.chapterNumber - 1);
			
		// set chapterView
		var chapterHeadingRow = downloadTableView.data[0].rows[bookRowValue];
		var chapterView = downloadTableView.data[0].rows[+bookRowValue+1].children[0].children[chapterNumber];
				
		// START IF - check method
		if (e.method == "update"){
			
			//START IF - chapterView is not undefined
			if (chapterHeadingRow.expanded != false){
				
				// disable touch of chapterView
				chapterView.children[0].touchEnabled = false;
				// change downloadImage
				chapterView.children[0].children[2].backgroundImage = "none";
				// set progressbar Value
				chapterView.children[0].children[1].show();
				chapterView.children[0].children[1].value = e.progress;
				
				
			};			
			//END IF - chapterView is not undefined
			
		}else if (e.method == "reset"){
			
			//START IF - chapterView is not undefined
			if (chapterHeadingRow.expanded != false){
				
				// enable downloadButton
				chapterView.children[0].touchEnabled = true;
				// set progressbar Value
				chapterView.children[0].children[1].value = 0;
				chapterView.children[0].children[1].hide();
				// change downloadImage
				chapterView.children[0].children[2].backgroundImage = "/images/audio_download.png";
			};			
			//END IF - chapterView is not undefined
			
		}else if (e.method == "success"){
			
			//START IF - chapterView is not undefined
			if (chapterHeadingRow.expanded != false){
				
				// disable downloadButton and hide progressBar
				chapterView.children[0].touchEnabled = false;
				chapterView.children[0].children[2].backgroundImage = "/images/audio_download_complete.png";
				chapterView.children[0].children[1].value = 0;
				chapterView.children[0].children[1].hide();
			
			};			
			//END IF - chapterView is not undefined
		};
		// END IF - check method
};
// END FUNCTION - updateSingleProgressBar

//  					END function to update singleProgressBar							//
//////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////
//  					START function to update completeProgressBar						//
	
// Add App eventlistener to listen for audioStartPause from IOS remote
Ti.App.addEventListener("app:updateCompleteProgressBar", updateCompleteProgressBar);

// START FUNCTION - updateComplateProgressBar
function updateCompleteProgressBar(e){
			
		// set bookRowValue and chapterAmount
		var bookRowValue = (parseInt(e.bookID,10) - 1);
	
		// set chapterHeadingRow and chapterViewsRow
		var chapterHeadingRow = downloadTableView.data[0].rows[bookRowValue];
		var chapterViewsRow = downloadTableView.data[0].rows[+bookRowValue+1].children[0];
		
		// set chapterAmount
		var chapterAmount = e.chapterAmount;
							
		// START IF - check method
		if (e.method == "update"){
			
			//START IF - chapterView is not undefined
			if (chapterHeadingRow.expanded != false){
				
				// START IF - disable downloadButtons
				if (chapterHeadingRow.allButtonsDisabled != true){
										
                    // set firstBookChapterRecord
					var firstBookChapterRecord = getSetBookData({	getSet: "getChapterRecord",
																	bookID: e.bookID,
																	chapterNum: 1,
					});
					
					// set firstBookActiveChapterID
					var firstBookActiveChapterID = firstBookChapterRecord.rowid;
					
					// !!  FIX FOR WHEN NOT ALL BOOKS ARE ENABLED !! //
					// var firstBookChapterID = firstBookActiveChapterID;
					// set chapterID as ID of chapter in ALL Chapters (1189)
					var firstBookChapterID = activeChapterRowIDArray[firstBookActiveChapterID-1];
					
					//Ti.API.info("DisableAllButtons");
					// START Loop - disable all downloadButtons 
					for (var i=0; i<chapterAmount; i++){
						
						// set chapterID and get audioInstalled
						var chapterID = (+firstBookChapterID + i );
						
						// set audioInstalled
						var audioInstalled = getSetBookData({	getSet: "getAudioInstalled",
																rowNum: chapterID,
						});
						
						// START IF - audioInstalled is not true show progress bar
						if (audioInstalled != "true"){
							
							// change downloadImage
							chapterViewsRow.children[i].children[0].children[2].backgroundImage = "none";
							// disable downloadButton and hide progressBar
							chapterViewsRow.children[i].children[0].touchEnabled = false;
							chapterViewsRow.children[i].children[0].children[1].show();	
											
						};
						// END IF - audioInstalled is not true show progress bar			
								
					};
					// END Loop -  disable all downloadButtons
					
					// set allButtonsDisable true
					chapterHeadingRow.allButtonsDisabled = true;
			
				};
				// END IF - disable downloadButtons
				
			};			
			//END IF - chapterView is not undefined
		
			// disable buttons touch and update all progress bar						
			chapterHeadingRow.children[0].children[2].show();
			chapterHeadingRow.children[0].children[2].max = e.max;
			chapterHeadingRow.children[0].children[2].value = e.progress;

		}else if (e.method == "reset"){
			
			// set chapterAmount
			var chapterAmount = e.chapterAmount;
		
			//START IF - chapterView is not undefined
			if (chapterHeadingRow.expanded != false){
					
					 // set firstBookChapterRecord
					var firstBookChapterRecord = getSetBookData({	getSet: "getChapterRecord",
																	bookID: e.bookID,
																	chapterNum: 1,
					});
					
					// set firstBookActiveChapterID
					var firstBookActiveChapterID = firstBookChapterRecord.rowid;
					
					// !!  FIX FOR WHEN NOT ALL BOOKS ARE ENABLED !! //
					// var firstBookChapterID = firstBookActiveChapterID;
					// set chapterID as ID of chapter in ALL Chapters (1189)
					var firstBookChapterID = activeChapterRowIDArray[firstBookActiveChapterID-1];
								
					//Ti.API.info("EnableAllButtons");
					// START Loop - disable all downloadButtons 
					for (var i=0; i<chapterAmount; i++){
						
						// set chapterID and get audioInstalled
						var chapterID = (+firstBookChapterID + i );
						
						// set audioInstalled
						var audioInstalled = getSetBookData({	getSet: "getAudioInstalled",
																rowNum: chapterID,
						});
						
						// START IF - audioInstalled is not true show progress bar
						if (audioInstalled != "true"){			
							// disable downloadButton and hide progressBar
							chapterViewsRow.children[i].children[0].touchEnabled = true;
							chapterViewsRow.children[i].children[0].children[1].hide();
							// change downloadImage
							chapterViewsRow.children[i].children[0].children[2].backgroundImage = "/images/audio_download.png";
						
						};
						// END IF - audioInstalled is not true show progress bar			
					};
					// END Loop -  disable all downloadButtons			
			
			};			
			//END IF - chapterView is not undefined	
			
			// hide and reset progress bar
			chapterHeadingRow.children[0].children[2].hide();
			chapterHeadingRow.children[0].children[2].value = 0;	
		
		}else if (e.method == "success"){

			// hide progressBar						
			chapterHeadingRow.children[0].children[2].hide();
			chapterHeadingRow.children[0].children[2].value = 0;

		};
		// END IF - check method
};
// END FUNCTION - updateComplateProgressBar

//  					END function to update completeProgressBar							//	
//////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////
//  					START FUNCTION - deleteAllAudioFunction								//	

function deleteAllAudioFunction(bookID){ 
		
	// set createAlert Dialog params
	var confirm = L("deleteAllNotificationConfirm");
	var cancel =  L("cancel");
	
	// START IF IPHONE ELSE IF ANDROID and ANDROID < 4.2
	var versionRequired = "4.0";
			
	if (OS_IOS || OS_ANDROID && versionCompare(Ti.Platform.version,versionRequired) == true) {
		var message = L("deleteAllNotificationMessage");
    }else{
    	var message = L("deleteAllNotificationMessage");
    };    
	// END IF IPHONE ELSE IF ANDROID and ANDROID < 4.2
	
	var title = L("deleteAllNotificationTitle");
	
	// require module customAlert in app/assets/lib/
	var customAlert = require('customAlert/customAlert');
		
	//createAlert AlertDialog with params		
	var notificationData = {
		cancelIndex: 0,
		buttonNames: [cancel,confirm],
		message: message,
		title: title,
		click: function(e){
			//START IF - Cancel Clicked close ELSE
		    if (e.index == 1){    			      		
		      	Ti.API.info('The Delete Confirm Button was clicked');
		   		
				// get bookRecord
				var bookRecord = getSetBookData({	getSet: "getBookRecord",
													bookID: bookID,
									});
				
				// set firstBookChapterRecord
				var firstBookChapterRecord = getSetBookData({	getSet: "getChapterRecord",
																bookID: bookID,
																chapterNum: 1,
				});
										
		   		// set firstBookActiveChapterID
				var firstBookActiveChapterID = firstBookChapterRecord.rowid;
					
				// !!  FIX FOR WHEN NOT ALL BOOKS ARE ENABLED !! //
				// var firstBookChapterID = firstBookActiveChapterID;
				// set chapterID as ID of chapter in ALL Chapters (1189)
				var firstBookChapterID = activeChapterRowIDArray[firstBookActiveChapterID-1];
				
				// set chapterAmount
				var chapterAmount = bookRecord.chapterCount;
				
				// START Loop - check if audioInstalled and then delete
				for (var i=0; i<chapterAmount; i++){
						
					// set currentChapterID and get audioInstalled
					var chapterID = (+firstBookChapterID + i );
										
					// set audioInstalled
					var audioInstalled = getSetBookData({	getSet: "getAudioInstalled",
															rowNum: chapterID,
					});
						
					// START IF - audioInstalled 
					if (audioInstalled == "true"){
							
						//Ti.API.info("Delete Audio Loop: " + chapterID);
						
						var deleteData = {	chapterID: chapterID,      	
					    };
							
						deleteAudioFunction(deleteData);					
							
					};
					// END IF - audioInstalled 		
					
						
				};
				// END Loop - check if audioInstalled and then delete
		   			 				    
			}else{
				Ti.API.info('The Delete cancel button was clicked');
						
			};	
			//END IF - Cancel Clicked close ELSE
		},	
	};
		
	// show AlertDialog notification
	customAlert.show(notificationData);
	
};

//  					END FUNCTION - deleteAllAudioFunction								//	
//////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////
//  					START FUNCTION - deleteSingleAudioFunction							//	

function deleteSingleAudioFunction(deleteData){
		
	// set createAlert Dialog params
	var confirm = L("deleteButtonText");
	var cancel =  L("cancel");
	
	// START IF IPHONE ELSE IF ANDROID and ANDROID < 4.2
	var versionRequired = "4.0";
			
	if (OS_IOS || OS_ANDROID && versionCompare(Ti.Platform.version,versionRequired) == true) {
		var message = L("deleteSingleNotificationMessage");
    }else{
    	var message = L("deleteSingleNotificationMessage");
    };    
	// END IF IPHONE ELSE IF ANDROID and ANDROID < 4.2
	
	var title = L("deleteSingleNotificationTitle");
	
	// require module customAlert in app/assets/lib/
	var customAlert = require('customAlert/customAlert');
		
	//createAlert AlertDialog with params		
	var notificationData = {
		cancelIndex: 0,
		buttonNames: [cancel,confirm],
		message: message,
		title: title,
		click: function(e){
			//START IF - Cancel Clicked close ELSE
		    if (e.index == 1){    			      		
		      	Ti.API.info('The Delete Confirm Button was clicked');
		   		 	
		   		 // run deleteAudioFunction
		   		 deleteAudioFunction(deleteData);
		   		 	    
			}else{
				Ti.API.info('The Delete cancel button was clicked');
				
			};	
			//END IF - Cancel Clicked close ELSE
		},
	};
		
	// show AlertDialog notification
	customAlert.show(notificationData);
				
};

//  					END Function - deleteSingleAudioFunction							//
//////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////
//  							START FUNCTION - deleteAudio								//

function deleteAudioFunction(deleteData){
									
	// require downloadMenu Module
	var deleteAudioModuleFunction = require('deleteAudioFunction');
	
	// START SET - data to use in deleteAudioFuntion with callback functions
	var data = {chapterID: deleteData.chapterID,			
				deleteSuccess: function deleteSuccess(){						// on delete success
									Ti.API.info('Audio DELETE success');
									
									// set chapterID
									var chapterID = deleteData.chapterID;
									
					   				// set chapter as NOT installed in Database
			                        getSetBookData({	getSet: "setAudioNotInstalled",
														rowNum: chapterID,
									});
						
					   				// !!  FIX FOR WHEN NOT ALL BOOKS ARE ENABLED !! //
									// var chapterRowID = chapterID; // uncomment and remove two below if all book are enabled
									var currentActiveChapterID = returnValueInArray(activeChapterRowIDArray,chapterID);
									var chapterRowID = (+currentActiveChapterID+1);
												
									// prepare chapterRecord
									var chapterRecord = getSetBookData({	getSet: 'getChapterRecordByRow',
																			rowNum: chapterRowID,
									});	
					   				
					   				// get bookRecord
									var bookRecord = getSetBookData({	getSet: "getBookRecord",
																		bookID: chapterRecord.bookID,
														});
									
									// set bookID and chapterAmount
									var bookID = bookRecord.bookID;
									var chapterNumber = chapterRecord.chapterNumber;
									var chapterAmount = bookRecord.chapterCount;
									
									// set firstBookChapterRecord
									var firstBookChapterRecord = getSetBookData({	getSet: "getChapterRecord",
																					bookID: chapterRecord.bookID,
																					chapterNum: 1,
									});
									
									// set firstBookActiveChapterID
									var firstBookActiveChapterID = firstBookChapterRecord.rowid;
									
									// !!  FIX FOR WHEN NOT ALL BOOKS ARE ENABLED !! //
									// var firstBookChapterID = firstBookActiveChapterID;
									// set chapterID as ID of chapter in ALL Chapters (1189)
									var firstBookChapterID = activeChapterRowIDArray[firstBookActiveChapterID-1];
															        
									// re-enable downloadbutton for row
									var chapterHeadingRow = downloadTableView.data[0].rows[(+bookID-1)];
									// set chapterViewRow	
									var chapterViewsRow = downloadTableView.data[0].rows[(+bookID)].children[0];
									
									// hide deleteButton
									chapterViewsRow.children[(+chapterNumber-1)].children[1].visible = false;
									
									// enable views touch
									chapterViewsRow.children[(+chapterNumber-1)].children[0].touchEnabled = true;
									
									// change downloadImage
									chapterViewsRow.children[(+chapterNumber-1)].children[0].children[2].backgroundImage = "/images/audio_download.png";
									
								  	// fire app:showAlertMessage with message
									Ti.App.fireEvent("app:showAlertMessage",{
					            		message: L("chapterDeleteSuccess"),          	
					            	});
					            	
					            	// Check if Book has Downloads else hide complete download button				            	
					            	var hasDownloads = false;
					            	
					            	// START Loop - check if has downloads
									for (var i=0; i<chapterAmount; i++){
										
										// set currentChapterID and get audioInstalled
										var currentChapterID = (+firstBookChapterID + i );
										
										// set audioInstalled
										var audioInstalled = getSetBookData({	getSet: "getAudioInstalled",
																				rowNum: currentChapterID,
										});
										
										// START IF - audioInstalled 
										if (audioInstalled == "true"){
											
											// set hasDownloads true
											hasDownloads = true;
											break;	
											
										};
										// END IF - audioInstalled 
										
									};
									// END Loop - check if has downloads
									
									// START IF = hasDownload != true
									if (hasDownloads != true){
																				
										// hide editFunction Menu
										editFunction();
									};
									// END IF = hasDownload != true	
									
									// fireEvent to update singleProgressBar
                            		Ti.App.fireEvent("app:updateSingleProgressBar",{method: "delete", chapterID: chapterID, bookID:bookID, });
                                     
								},
				};	
	// END SET - data to use in deleteAudioFuntion with callback functions
	
	// run deleteAudioFunction with data as above
	deleteAudioModuleFunction(data);
	
};
// END FUNCTION - deleteAudio

//  							END FUNCTION - deleteAudio									//
//////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////
//  						START create downloadMenu section								//

// Include the model in app/lib/
var downloadMenuFunction = require('downloadMenu');

// create downloadMenutTableData with callbackFunction to run updateRows
var downloadMenuTableData = downloadMenuFunction({
	updateRowsFunction: function updateRowsFunction(bookID){
						
						//run updateRows with bookID
						updateRows(bookID);	
						
						},	
});

// Create tableView with rows as tabelData
var downloadTableView = Ti.UI.createTableView({
  	data:downloadMenuTableData,
  	backgroundColor: '#FAF9F3', 
  	separatorColor: "transparent", 
});

// add downloadTableView to contentArea
$.contentArea.add(downloadTableView);

//////////////////////////////////////////////////////////////////////////////////////////
//					START OPEN CURRENT BOOK AND MARK CHAPTER							//

// set openViewArray
var openViewArray = Alloy.Globals.openViewArray;

// set currentView		
var currentView = openViewArray[openViewArray.length-1].openCloseView;

// START IF - currentView is TextView open menu at currentBook
if (currentView == "TextView"){
	
	// get Ti.App.Properties - lastOpenView
	var lastOpenView = JSON.parse(Ti.App.Properties.getString('lastOpenView','{}'));	
	// set chapterData
	var chapterData = lastOpenView.lastOpenViewData;		
	// set currentBookID
	var currentBookID = chapterData.book;

	// set audioExist
	var audioExist = getSetBookData({	getSet: "getAudioExist",
										bookID: currentBookID,
									});
	
	// START IF - audioExist
	if (audioExist){	

		// START - updateRows
		if(OS_IOS){

			// run updateRows
			updateRows(currentBookID);

		}else{

			// ANDROID NEEDS A SLIGHT TIMEOUT ELSE IT DOES NOT ALWAYS WORK
			setTimeout(function(){	
						
				// run updateRows
				updateRows(currentBookID);
						
			}, 100);	
			

		};
		// END - updateRows
	
	};
	// END IF - audioExist
	
};
// END IF - currentView is TextView open menu at currentBook

//					END OPEN CORRENT BOOK AND MARK CHAPTER								//
//////////////////////////////////////////////////////////////////////////////////////////

//  						END create downloadMenu section									//
//////////////////////////////////////////////////////////////////////////////////////////////