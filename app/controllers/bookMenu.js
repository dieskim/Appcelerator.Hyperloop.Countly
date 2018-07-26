$.bookMenuWindow.addEventListener('androidback', function (e){
	
	// START IF - Alloy.Globals.openAlertForm not open
	if (!Alloy.Globals.openAlertForm){
		
		// run closeWindow
		closeMenu();	
		
	};	
	// END IF - Alloy.Globals.openAlertForm not open
	
});

// Close Window
function closeMenu(){
		
$.bookMenuWindow.close();
    
};

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
	$.bookMenuWindow.add(activityLoader);
			
	// 				END - ADDING ACTIVITYLOADER VIEW			 //	
	///////////////////////////////////////////////////////////////
		
	////////////////////////////////////////////////////////////////////////
	//				Start Delete all the non Main rows  				  //
	//  if Row is deleted change expanded of row above to rowRemoved	  //
	
	// Get rowCount from tableView
	var rowCount = tableView.data[0].rowCount;
	// Set rowDeleted to false to be able to stop check
	var rowDeleted = false;
	
	// START Loop - throught menu rows - if the row is not a main row then delete it
	for (x=0; x<rowCount; x++) { 	
		
		// Row we will check is row x
	   	var rowCheck = tableView.data[0].rows[x];
	   	
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
					var rowBefore = tableView.data[0].rows[rowBeforeIndex];								
			   		
			   		///////////////////////////////////////////////////////////////////////////////
					// 			Create Closed TableViewRow and update Table Row					///
					//			1. set expanded value to rowRemoved								///
					// 			2. change the bookView backgroundColor							///
					// 			3. change the bookRowView backgroundimage to a closed image		///
					
					// set closedbookRow
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
					
					// create closedbookView
					var closedbookView = Ti.UI.createView({
					    top: 0,
					    height: "50dp",
					    width:	Ti.UI.FILL,
					    backgroundColor: '#639A13',
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
						backgroundImage: "/images/menu_closed.png",				
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
					
					// set tableRowSeperator
					var tableRowSeperator = Ti.UI.createView({
					    bottom:0,
					    left:5,
					    right:5,
					    height: 0.5,
					    width:	Ti.UI.FILL,
					    backgroundColor: '#FAF9F3',
					});
					
					closedbookView.add(tableRowSeperator);
	
					// add closedbookView to closedbookRow
					closedbookRow.add(closedbookView),
					
					// update tableView row with closedbookRow	
					tableView.updateRow(rowBeforeIndex,closedbookRow);
										
					// 						TableViewRow update Done							//	   		
			   		//  		Done setting rowBeforeIndex to 'rowRemoved'  					//
			   		//////////////////////////////////////////////////////////////////////////////
					
					if (OS_IOS){
						var animationVar = Titanium.UI.iOS.RowAnimationStyle.NONE;
					}else{
						var animationVar = null;
					}; 
						
			   		// Remove the non mainRow found
			   		tableView.deleteRow(rowFoundIndex,{animationStyle:animationVar});
				
					// Set rowDeleted to true to stop row check
					var rowDeleted = true;		
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
	var rowClicked = tableView.data[0].rows[clickedIndex];
		
	// get rows expanded value
	var expanded = rowClicked.expanded;
		
		// START IF - row is Expanded or not
		// 1. set rowClicked expanded as true
		// 2. Check all rows - find row with expanded = rowBelow and change to false
		// 3. add row below row clicked
		if (expanded == false) {		
		
			///////////////////////////////////////////////////////////////////////////////
			// 			Create Closed TableViewRow and update Table Row					///
			//			1. set expanded value to true									///
			// 			2. change the bookView backgroundColor							///
			// 			3. change the bookRowView backgroundimage to a open image		///
			 
			// Creat openbookRow  
			var openbookRow = Ti.UI.createTableViewRow({
			    className:'bookRow', 						// used to improve table performance
			    height: "50dp",
			    width:	Ti.UI.FILL,
			    top: 0,    
			    layout: "vertical",
			    backgroundSelectedColor: '#90B81A',
			    rowId: rowClicked.rowId, 					// rowId for events
			    expanded: true,								// if row is expanded for events
			    mainRow: true,								// if row is main Row for events
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
			        fontFamily: Alloy.Globals.customFont,
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
			
			// set tableRowSeperator
			var tableRowSeperator = Ti.UI.createView({
			    bottom:0,
			    left:5,
			    right:5,
			    height: 0.5,
			    width:	Ti.UI.FILL,
			    backgroundColor: '#FAF9F3',
			});
			
			openbookView.add(tableRowSeperator);
			
			// add openbookView to openbookRow
			openbookRow.add(openbookView),
			
			// update tableView row clicked with openbookRow	
			tableView.updateRow(clickedIndex,openbookRow);
						
			// 						TableViewRow update Done							 //
			///////////////////////////////////////////////////////////////////////////////
		
			///////////////////////////////////////////////////////////////////////////////
		   	//  	Check all rows - find row expanded = rowRemoved and change to false	// 
		   		
		   	// Get rowCount from tableView
			var NewrowCount = tableView.data[0].rowCount;
			// set rowExpandedUpdate to false to be able to stop check
			var rowExpandedUpdated = false;
					
			// START Loop - throught menu rows
			for (z=0; z<NewrowCount; z++) { 
							
				// START IF -  row has not been found and changed yet
				if (rowExpandedUpdated == false){
					
					// set NewrowCheck
					var NewrowCheck = tableView.data[0].rows[z];
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
			// END Loop - through menu rows
			
			// require chapterTableRow module in app/lib
			var bookMenuChapterTableRowFunction = require('bookMenuChapterTableRow');
				
			// START - create new chapterTableRow with callback to delete
			var bookMenuChapterTableRow = bookMenuChapterTableRowFunction({
				bookID: functionBookID,
				chapterClicked: function(chapterClickData){
					
					///////////////////////////////////////////////////////////////
					// 				START  - ADDING ACTIVITYLOADER VIEW			//
							
					// require module activityLoader and add to currentWindow
					var activityLoaderFunction = require('activityLoader/activityLoader');
					var activityLoader = activityLoaderFunction();
					$.bookMenuWindow.add(activityLoader);
							
					// 				END - ADDING ACTIVITYLOADER VIEW			 //	
					///////////////////////////////////////////////////////////////
					
					// run loadText
					loadText({	book: chapterClickData.book,
								chapter: chapterClickData.chapter,
					});	
					
					// run closeMenu and run loadText					
					closeMenu();
					
					// REMOVE ACTIVITYLOADER VIEW
					$.bookMenuWindow.remove(activityLoader);
					
				},
			});
			// END - create new chapterTableRow with callback to delete	
			
			if (OS_IOS){
				var animationVar = Titanium.UI.iOS.RowAnimationStyle.DOWN;
			}else{
				var animationVar = null;
			}; 

			// Insert a new row under row clicked with clickedIndex
			tableView.insertRowAfter(clickedIndex,bookMenuChapterTableRow,{animationStyle: animationVar});

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

	// Scroll tableView to clickedIndex as set in Add row section
	tableView.scrollToIndex(clickedIndex, {
	            position : positionVar,
	            animated : true
	        });
	
	
	//					END Finally Scroll to row clicked      			   //
	////////////////////////////////////////////////////////////////////////
	
	// REMOVE ACTIVITYLOADER VIEW
	$.bookMenuWindow.remove(activityLoader);
	
};
// END Function - updateRows

//							  	End Function updateRows 									  //
////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////
//  						START create bookMenu section		 							//

// Include the model in app/lib/
var bookMenuTableFunction = require('bookMenuTable');

// create bookMenuTableData
var bookMenuTableData = bookMenuTableFunction({
	updateRowsFunction: function updateRowsFunction(bookID){
						
						//run updateRows with b
						updateRows(bookID);	
						
						},
});

// Create tableView with rows as tabelData
var tableView = Ti.UI.createTableView({
  	data:bookMenuTableData,
  	backgroundColor: '#FAF9F3', 
  	separatorColor: "transparent",
});

// add downloadTableView to contentArea
$.contentArea.add(tableView);

//////////////////////////////////////////////////////////////////////////////////////////
//					START OPEN CORRENT BOOK AND MARK CHAPTER							//

// get Ti.App.Properties - lastOpenView
var lastOpenView = JSON.parse(Ti.App.Properties.getString('lastOpenView','{}'));

// set chapterData
var chapterData = lastOpenView.lastOpenViewData;

// set currentBookID
var currentBookID = chapterData.book;

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

//					END OPEN CORRENT BOOK AND MARK CHAPTER								//
//////////////////////////////////////////////////////////////////////////////////////////

//  						START create bookMenu section		 							//
//////////////////////////////////////////////////////////////////////////////////////////////