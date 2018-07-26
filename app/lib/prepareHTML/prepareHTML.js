//////////////////////////////////////////////////////////////////////////////////////////////////
// 					START FUNCTION to Set user font Size setting								//

function prepareHTML(prepareHTMLData){
	
	// get vars
	var fontSize = prepareHTMLData.fontSize;
	var contentHTML = prepareHTMLData.contentHTML;
	var scrollData = prepareHTMLData.scrollData || false;
	
	// START IF - scrollData
	if (scrollData){
		
		// set scrollVar and scrollLocation
		var scrollVar = scrollData.scrollVar || false;
		var scrollLocation = scrollData.scrollLocation || false;
		
	}else{
		
		// set scrollVar and scrollLocation
		var scrollVar = false;
		var scrollLocation = false;
		
	};
	// END IF - scrollData
			
	// Include the module in app/lib/
	var prepareStyle = require('prepareHTML/prepareStyle');
	
	// use prepareStyle model to create styleCode
	var styleCode = prepareStyle(fontSize);

	// create all the HTML parts
	var metaCode = '<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes" "target-densitydpi=device-dpi" /><meta http-equiv="content-type" content="text/html; charset=utf-8" /><meta property="scrollVar" content="' + scrollVar + '" /><meta property="scrollLocation" content="' + scrollLocation + '" />';		
		
	// set scriptCode
	var scriptCode = '';
	
	// START IF - Alloy.Globals.useWebviewScripts then build and add scripts to scriptCode
	if(Alloy.Globals.useWebviewScripts){
		
		// set scriptArray
		var scriptArray = Alloy.Globals.webviewScriptArray;
		
		// START LOOP - through Alloy.Globals.webviewScriptArray and add 
		for (var i=0; i<scriptArray.length; i++){
			
			// add script string to scriptCode
			scriptCode += '<script src="' + scriptArray[i] + '" type="text/javascript"></script>';
			
		};
		// END LOOP - through Alloy.Globals.webviewScriptArray and add
		
	};
	// END IF - Alloy.Globals.useWebviewScripts then build and add scripts to scriptCode
	
	// build headCode
	var headCode = "<head>" + metaCode + styleCode + scriptCode + "</head>";
	
	//create final htmlCode
	var htmlCode = "<html>" + headCode + "<body>" + contentHTML + "</body>" + "</html>";
	
	//Ti.API.info(htmlCode);
	//return htmlCode
	return htmlCode;

};

// 						End FUNCTION to Set user font Size setting								//
//////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = prepareHTML;