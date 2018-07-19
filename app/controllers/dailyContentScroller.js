// set global vars
Alloy.Globals.dailyContentDay = '';
Alloy.Globals.dailyScrollerInFocus = true;
Alloy.Globals.vodAnimating = false;
Alloy.Globals.qodAnimating = false;

/////////////////////////////////////////////////////////////////////////////
// 				START - prepare vodLabel and function					  //

// START FUNCTION - setDayNumberColor
function setDayNumberColor() {
		
	//Ti.API.info("Start setDayNumberColor");
	
	// START IF - white set black else white
	if ($.dayNumberLabel.color == 'black'){
			
		$.dayNumberLabel.color = "white";
				
	}else{
			
		$.dayNumberLabel.color = "black";
			
	};
	// END IF - white set black else white
		
};
// END FUNCTION - setDayNumberColor
	
// START Function - vodClickFunction
function vodClickFunction() {
	  
	//Ti.API.info("Start vodClickFunction");
	
	// set vodData
	var vodData = $.vodContentContainer.vodData;
	
	// load verse of day via loadText
	loadText({  book: vodData.bookID,
	 			chapter: vodData.startChapter,
	        	highlightStart: vodData.startVerse,
	        	highlightEnd: vodData.endVerse,
	});
	
	// send analytics event data
	logVODClicked(vodData);
	    
}; 
// END Function - vodClickFunction
	
// START FUNCTION - prepareVOD
function prepareVOD(vodPrepareData){
	
	//Ti.API.info("Start prepareVOD");
	
	// START IF - Check if has old content and remove
	if ($.vodScrollingTextContainer.children[0]){	
		//Ti.API.info("Remove old VOD Text");
		
		// START - FIRST REMOVE OLD CONTENT IF ANY
		$.vodButton.removeEventListener('touchstart', setDayNumberColor);
		$.vodButton.removeEventListener('touchend', setDayNumberColor);
		$.vodButton.removeEventListener('touchcancel', setDayNumberColor);
		$.vodContentContainer.removeEventListener('click', vodClickFunction);
	
		// Remove all children
		$.vodScrollingTextContainer.removeAllChildren();
		vodLabel = null;
		
		// set nulls
		vodAnimationLoop = null;	
		
	};	
	// END IF - Check if has old content and remove
	
	// Start set date
	var date = new Date();
	
	// set dateString and set dailyContentDay
	var dateString = date.toDateString();
	Alloy.Globals.dailyContentDay = dateString;
	
	// get dayOfMonth and set dayNumberLabel
	var dayOfMonth = date.getDate();
	$.dayNumberLabel.text = dayOfMonth;
	
	// START - add  addEventListener touchstart to $.vodButton
	$.vodButton.addEventListener('touchstart', setDayNumberColor);
	
	// START - add  addEventListener touchend to $.vodButton
	$.vodButton.addEventListener('touchend', setDayNumberColor);
	
	// START - add  addEventListener touchcancel to $.vodButton
	$.vodButton.addEventListener('touchcancel', setDayNumberColor);
	
	// require vodPrepare module
	var vodPrepare = require('vodPrepare/vodPrepare');
	
	// set vodDataText
	var vodDataText = vodPrepare.vodDataTextPrepare();
	
	// set vodData + vodText
	var vodData = vodDataText.vodData;
	var vodText = vodDataText.vodText; 
	
	// Convert and set verse text
	var convertedVerseText = Alloy.Globals.textConverter(vodText, true, false);
	
	// set vodTextLength for calculation
	var vodTextLength = convertedVerseText.length;
	
	// calculate vodLabelWidth
	var vodLabelWidth = (+vodTextLength * 9);
	
	// calculate vodAnimationDuration
	var vodAnimationDuration = (+vodTextLength * 250);
	
	// create vodLabel
	var vodLabel = Titanium.UI.createLabel({
	  	right: '65dp',
	    height: '30dp', 
	    width: vodLabelWidth + 'dp',
	    textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
	  	color:'black',
	 	text: convertedVerseText,
	  	wordwrap:false,
	  	font: {
	   	 	fontSize: '25dp',
	    	fontFamily: Alloy.Globals.customFont
	  	},
	  	animationDuration: vodAnimationDuration,
	  	scrollerPage: 0,
	  	startVisible: false,
	  	endVisible: false,
	  	//backgroundColor: "red",
	});
	
	// Start Callback Function vodPrepareData.vodAnimationLoop as vodAnimationLoop
	vodPrepareData.vodAnimationLoop = function vodAnimationLoop(){
		
		//Ti.API.info("vodAnimationLoop Start");
		
		// START IF - CHECK - Alloy.Globals.vodAnimating - dont animate if animating
		if(Alloy.Globals.vodAnimating){
			
			//Ti.API.info("Alloy.Globals.vodAnimating = true - dont animate now");
			
			// return out to not animate while animating
			return;
			
		}else{
			
			//Ti.API.info("Alloy.Globals.vodAnimating = false - animate now");
		}
		// END IF - CHECK - Alloy.Globals.vodAnimating - dont animate if animating
		
		// set Alloy.Globals.vodAnimating
	  	Alloy.Globals.vodAnimating = true;
	  	
		// reset vars
	  	vodLabel.startVisible = false;
	  	vodLabel.endVisible = false;
	  	var vodAnimation = null;
	  	
	  	// set currentScrollerPage
	  	var currentScrollerPage = $.dailyContentScrollable.getCurrentPage();
	  
	  	// START IF - currentScrollerPage = vodLabel.scrollerPage
	  	if (currentScrollerPage == vodLabel.scrollerPage){
	    	vodLabel.startVisible = true;
	  	}else{
	   	 	vodLabel.startVisible = false;
	  	};
	  	// END IF - currentScrollerPage = vodLabel.scrollerPage
	  
	  	// create vodAnimation
	  	vodAnimation = Titanium.UI.createAnimation({
	    	right: (+vodLabelWidth * -1) + "dp",
	    	duration:vodLabel.animationDuration,
	    	delay: 500,
	    	curve: Titanium.UI.ANIMATION_CURVE_LINEAR
	  	}); 
	  	
	  	// animate vodLabel
	  	vodLabel.animate(vodAnimation);
	  	
	  	// START - addEventListener complete to vodAnimation
	  	vodAnimation.addEventListener('complete', function() {
	    
	    	//Ti.API.info("vodAnimation complete");
	    	
	    	// set Alloy.Globals.vodAnimating
	  		Alloy.Globals.vodAnimating = false;
	  		
	    	// set currentScrollerPage
	    	var currentScrollerPage = $.dailyContentScrollable.getCurrentPage();
	    
	    	// START IF - currentScrollerPage = vodLabel.scrollerPage
	    	if (currentScrollerPage == vodLabel.scrollerPage){
	      		vodLabel.endVisible = true;
	    	}else{
	      		vodLabel.endVisible = false;
			};
			// END IF - currentScrollerPage = vodLabel.scrollerPage
	    
	    	// set vodLabel.right
	    	vodLabel.right = Titanium.Platform.displayCaps.platformWidth;  
	    
	    	// START IF = currentScrollerPage and startVisible and endVisible true
	    	if(currentScrollerPage == vodLabel.scrollerPage && vodLabel.startVisible && vodLabel.endVisible){
	      
				// START - setTimeout to scroll
				setTimeout(function(){  
	        
	 				// scroll $.dailyContentScrollable to qod view
					$.dailyContentScrollable.scrollToView(1);
	        		
	        		// START - setTimeout to start vodAnimationLoop
					setTimeout(function(){  
					
			    		// restart qodLabel animation with qodAnimationLoop
					    if (Alloy.Globals.dailyScrollerInFocus){
							vodAnimationLoop();  
					    };
				    
				    }, 250); 
					// END - setTimeout to start vodAnimationLoop
					
	      		}, 250);  
	      		// END - setTimeout to scroll
	      		
	 		}else{
	 			
	 			// restart vodLabel animation with vodAnimationLoop
				if (Alloy.Globals.dailyScrollerInFocus){
	   				vodAnimationLoop();  
				};
			
	 		};
			// END IF = currentScrollerPage and startVisible and endVisible true
	    
		});
	  	// END - addEventListener complete to animation
	  
	};
	// END Callback Function vodPrepareData.vodAnimationLoop as vodAnimationLoop
	
	// add label to $.vodScrollingTextContainer
	$.vodScrollingTextContainer.add(vodLabel);
	
	// START - set vodData and addEventListener click function $.vodContentContainer
	$.vodContentContainer.vodData = vodData;
	$.vodContentContainer.addEventListener('click', vodClickFunction);
	
	// START - setTimeout to start vodAnimationLoop
	setTimeout(function(){  
					
		// run vodAnimationLoop
		vodPrepareData.vodAnimationLoop(); 
					  
	}, 250); 
	// END - setTimeout to start vodAnimationLoop					
	
};
// END FUNCTION - prepareVOD

//        		END - prepare vodLabel and functions           				 //
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
//        		START - prepare qodLabel and functions           			 //

// START Function - qodClickFunction
function qodClickFunction() {
	  
	//Ti.API.info("Start qodClickFunction");
	
	// set qodData
	var qodData = $.qodContentContainer.qodData;
	
	// send analytics event data
	logQODClicked(qodData);
		
	// loadQuestion       
	loadQuestion(qodData);
	    
};
// END Function - qodClickFunction
	
// START FUNCTION - prepareQOD	
function prepareQOD(qodPrepareData){
	
	//Ti.API.info("Start prepareQOD");
	
	// START IF - Check if has old content and remove
	if ($.qodScrollingTextContainer.children[0]){	
		//Ti.API.info("Remove old QOD Text");
		
		// START - FIRST REMOVE OLD CONTENT IF ANY
		$.qodContentContainer.removeEventListener('click', qodClickFunction);
	
		// Remove all children
		$.qodScrollingTextContainer.removeAllChildren();
		qodLabel = null;	
		
		// set nulls
		qodAnimationLoop = null;	
		
	};	
	// END IF - Check if has old content and remove
	
	// require qodPrepare module
	var qodPrepare = require('qodPrepare');
	
	// set qodDataText
	var qodDataText = qodPrepare.qodDataTextPrepare();
	
	// set qodData + qodText
	var qodData = qodDataText.qodData;
	var qodText = qodDataText.qodText; 
	
	// Convert and set qod text
	var convertedQuestionText = Alloy.Globals.textConverter(qodText, true, false);
	
	// set vodTextLength for calculation
	var qodTextLength = convertedQuestionText.length;
	
	// calculate qodLabelWidth
	var qodLabelWidth = (+qodTextLength * 10);
	
	// calculate qodAnimationDuration
	var qodAnimationDuration = (+qodTextLength * 300);
	
	// create qod
	var qodLabel = Titanium.UI.createLabel({
	  	right: '65dp',
	    height: '30dp', 
	    width: qodLabelWidth + 'dp',
	    textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
  		color: "#90B81A", //'white',
	 	text: convertedQuestionText,
	 	wordwrap:false,
	  	font: {
	    	fontSize: '25dp',
	    	fontFamily: Alloy.Globals.customFont
	  	},
	  	animationDuration: qodAnimationDuration,
	  	scrollerPage: 1,
	  	startVisible: false,
	  	endVisible: false,
	  	//backgroundColor: "red",
	});
	
	// START Callback Function qodPrepareData.qodAnimationLoop as qodAnimationLoop
	qodPrepareData.qodAnimationLoop = function qodAnimationLoop(){
	  	
	  	//Ti.API.info("qodAnimationLoop Start");
	  	
	  	// START IF - CHECK - Alloy.Globals.qodAnimating - dont animate if animating
		if(Alloy.Globals.qodAnimating){
			
			//Ti.API.info("Alloy.Globals.qodAnimating = true - dont animate now");
			
			// return out to not animate while animating
			return;
			
		}else{
			
			//Ti.API.info("Alloy.Globals.qodAnimating = false - animate now");
		}
		// END IF - CHECK - Alloy.Globals.qodAnimating - dont animate if animating
		
		// set Alloy.Globals.qodAnimating
	  	Alloy.Globals.qodAnimating = true;
	  	
		// reset vars
		qodLabel.startVisible = false;
		qodLabel.endVisible = false;
		var qodAnimation = null;
		    
		// set currentScrollerPage
		var currentScrollerPage = $.dailyContentScrollable.getCurrentPage();
		  
		// START IF - currentScrollerPage = qodLabel.scrollerPage
		if (currentScrollerPage == qodLabel.scrollerPage){
			qodLabel.startVisible = true;
		}else{
			qodLabel.startVisible = false;
		};
		// END IF - currentScrollerPage = qodLabel.scrollerPage
		
		// create qodAnimation  
		qodAnimation = Titanium.UI.createAnimation({
			right: (+qodLabelWidth * -1) + "dp",
			duration:qodLabel.animationDuration,
			delay: 500,
		    curve: Titanium.UI.ANIMATION_CURVE_LINEAR
		}); 
		  
		// animate qodLabel
		qodLabel.animate(qodAnimation); 
		  
		// START - addEventListener complete to qodAnimation
		qodAnimation.addEventListener('complete', function() {
		    
			//Ti.API.info("qodAnimation complete");
		    
		    // set Alloy.Globals.qodAnimating
	  		Alloy.Globals.qodAnimating = false;
	  	
			// set currentScrollerPage
		    var currentScrollerPage = $.dailyContentScrollable.getCurrentPage();
		    
		    // START IF - currentScrollerPage = qodLabel.scrollerPage
		    if (currentScrollerPage == qodLabel.scrollerPage){
				qodLabel.endVisible = true;
		    }else{
				qodLabel.endVisible = false;
		    };
		    // END IF - currentScrollerPage = qodLabel.scrollerPage
		    
		    // set qodLabel.right
		    qodLabel.right = Titanium.Platform.displayCaps.platformWidth;    
		    
		    // START IF = currentScrollerPage and startVisible and endVisible true
		    if(currentScrollerPage == qodLabel.scrollerPage && qodLabel.startVisible && qodLabel.endVisible){
		      
				// START - setTimeout to scroll
				setTimeout(function(){  
		        
					// scroll $.dailyContentScrollable to vod view
					$.dailyContentScrollable.scrollToView(0);
		    		
		    		// START - setTimeout to start qodAnimationLoop
					setTimeout(function(){  
					
			    		// restart qodLabel animation with qodAnimationLoop
					    if (Alloy.Globals.dailyScrollerInFocus){
							qodAnimationLoop();  
					    };
				    
				    }, 250); 
				    // END - setTimeout to start vodAnimationLoop
				    
				}, 250);  		        
		        // END - setTimeout to scroll
		        
			}else{
				
				// restart qodLabel animation with qodAnimationLoop
			    if (Alloy.Globals.dailyScrollerInFocus){
					qodAnimationLoop();  
			    };
		    
			};
			// END IF = currentScrollerPage and startVisible and endVisible true
		    
		});
		// END - addEventListener complete to animation
	  
	};
	// END Callback Function qodPrepareData.qodAnimationLoop as qodAnimationLoop
	
	// add label to $.qodScrollingTextContainer
	$.qodScrollingTextContainer.add(qodLabel);
	
	// START - set qodData and addEventListener click function $.qodContentContainer
	$.qodContentContainer.qodData = qodData;
	$.qodContentContainer.addEventListener('click', qodClickFunction);
	
	// START - setTimeout to start qodAnimationLoop
	setTimeout(function(){  
					
		// run qodAnimationLoop
		qodPrepareData.qodAnimationLoop();
					  
	}, 250); 
	// END - setTimeout to start qodAnimationLoop		
	
};
// END FUNCTION - prepareQOD	

//        END - prepare qodLabel and functions            //
/////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////
//			 START set PrepareData and run prepare function for first time		//

// set vodPrepareData
var vodPrepareData = {	vodAnimationLoop: function(){},	
};

// run prepareVOD for first time
prepareVOD(vodPrepareData);

// set vodPrepareData
var qodPrepareData = {	qodAnimationLoop: function(){},
};

// run prepareQOD for first time
prepareQOD(qodPrepareData);

//			 END set PrepareData and run prepare function for first time		//
//////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////
// 	START addEventListener app:dailyScrollerAnimate and reanmiate or re-prepare as needed	//
Ti.App.addEventListener("app:dailyScrollerAnimate", function(e){
  
	//Ti.API.info("app:dailyScrollerAnimate - check if should animate before animating");
 
	// set Alloy.Globals.dailyScrollerInFocus true
	Alloy.Globals.dailyScrollerInFocus = true;
 	
 	// START CHECKING DATE VS DATE OF DAILY CONTENT AND UPDATE IF NEXT DATE
 	// Start set date
	var todayDate = new Date();
		
	// set todayDayString
	var todayDayString = todayDate.toDateString();
	var todayDateValue = new Date(todayDayString);
		
	// set currentContentDateValue
	var currentContentDateValue = new Date(Alloy.Globals.dailyContentDay);
		
	//Ti.API.info("todayDayString: " + todayDayString + " Alloy.Globals.dailyContentDay: " + Alloy.Globals.dailyContentDay);
	//Ti.API.info("todayDateValue: " + todayDateValue + " currentContentDateValue: " + currentContentDateValue);
		
	// START IF - check if current DOY is bigger than content, and re-prepare if needed 
	if (todayDateValue > currentContentDateValue){
	
		//Ti.API.info("Re-prepareVOD + QOD");
			
		// run prepareVOD and prepareQOD
		prepareVOD(vodPrepareData);
 		prepareQOD(qodPrepareData);
 		
	}else{
			
		//Ti.API.info("Same Date - DO NOT - Re-prepareVOD + QOD");
			
	};
 	// END IF - check if current DOY is bigger than content, and re-prepare if needed	
 	// END CHECKING DATE VS DATE OF DAILY CONTENT AND UPDATE IF NEXT DATE	
 	
 	// START IF - Alloy.Globals.vodAnimating and Alloy.Globals.qodAnimating false
 	if (!Alloy.Globals.vodAnimating && !Alloy.Globals.qodAnimating){
 			
 		//Ti.API.info("app:dailyScrollerAnimate - restart since both not animating");
 		
 		// animate vodLabel
		vodPrepareData.vodAnimationLoop();
	
		// animate qodLabel
		qodPrepareData.qodAnimationLoop();
	
 	}else{
 		
 		//Ti.API.info("app:dailyScrollerAnimate - dont restart since both are animating");
 		
 	};
	// END IF - Alloy.Globals.vodAnimating and Alloy.Globals.qodAnimating false
    
}); 

// 	END addEventListener app:dailyScrollerAnimate and reanmiate or re-prepare as needed		//
//////////////////////////////////////////////////////////////////////////////////////////////

// START addEventListener pause
Ti.App.addEventListener('pause', function(e){
	
	//Ti.API.info("app pause - set dailyScrollerInFocus false");
	
	// set Alloy.Globals.dailyScrollerInFocus false
	Alloy.Globals.dailyScrollerInFocus = false;
	
});	
// END addEventListener pause