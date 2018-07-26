/**
 * getSetFontSize
 * - getSetFontSize gets or sets the app wide font size
 *
 * Alloy.Globals:
 * - {@Alloy.Globals.fontSizeDefault Alloy.Globals.fontSizeDefault}
 * - {Alloy.Globals.fontSizeSmall Alloy.Globals.fontSizeSmall}
 * - {Alloy.Globals.fontSizeMedium Alloy.Globals.fontSizeMedium}
 * - {Alloy.Globals.fontSizeLarge Alloy.Globals.fontSizeLarge}
 * 
 * @module getSetFontSize 
 */

/**
 * Gets the set font size.
 *
 * @param      {string}  getSet  startValue / getValue / setValue - The get or set string
 * @param      {number}  value   The font size number
 * @return     {function}  The set font size function
 */
function getSetFontSize(getSet,value){
	
	// START IF - getSet to get or set Value
	if (getSet == "startValue"){

		// get book Ti.App.Properties
		var fontSizeProp = JSON.parse(Ti.App.Properties.getString("fontSize",'{}'));
		
		// set fontSize
		var fontSize = fontSizeProp.fontSize || Alloy.Globals.fontSizeDefault;
		
		// START IF = check fontSize
		if (fontSize == Alloy.Globals.fontSizeSmall){
			
			// set fontSizeVar as small
			var fontSizeVar = "small";	
			
		}else if (fontSize == Alloy.Globals.fontSizeMedium){
			
			// set fontSizeVar as medium
			var fontSizeVar = "medium";
			
		}else {
			
			// set fontSizeVar as large
			var fontSizeVar = "large";

		};
		// END IF = check fontSize

		// return fontSize
		return fontSizeVar;

	}else if (getSet == "getValue"){
		
		// get book Ti.App.Properties
		var fontSizeProp = JSON.parse(Ti.App.Properties.getString("fontSize",'{}'));
		
		// set fontSize
		var fontSize = fontSizeProp.fontSize || Alloy.Globals.fontSizeDefault;
		
		// return fontSize
		return fontSize;
		
	}else{ // setValue
		
		// START IF - set fontSizeVar according to rowClicked
		if (value == "small"){
			var fontSizeVar = Alloy.Globals.fontSizeSmall; //"20";
		}else if (value == "medium"){
			var fontSizeVar = Alloy.Globals.fontSizeMedium; // "24";
		}else{
			var fontSizeVar = Alloy.Globals.fontSizeLarge; // "28";
		};
		// END IF - set fontSizeVar according to rowClicked

		// set fontParams as value passed
		var fontParams = {	fontSize: fontSizeVar, 
						};
						
		// Set Ti.App.Properties - fontSize
		Ti.App.Properties.setString("fontSize",JSON.stringify(fontParams));
		
	};
	// END IF - getSet to get or set Value
	
};

module.exports = getSetFontSize;