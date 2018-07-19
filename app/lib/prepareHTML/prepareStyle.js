//////////////////////////////////////////////////////////////////////////////////////////////////
// 					START FUNCTION to Set user font Size setting								//

function prepareStyle(fontSizePar){
			
	//set fontSize as fonSizrPar
	var fontSize = fontSizePar;
	
	// set lineHeight as fontSize + 2
	var lineHeight = (+fontSize + 4);
		
	// START IF - Alloy.Globals.languageDirection
	if(Alloy.Globals.languageDirection == 'ltr'){
		
		// set floatVar
		var floatVar = 'right';
		
	}else{
		
		// set floatVar
		var floatVar = 'left';
		
	};
	// END IF - Alloy.Globals.languageDirection
	
	// START IF - Alloy.Globals.useCustomFont true then set Alloy.Globals.customFont else false
	if (Alloy.Globals.useCustomFont){
		
		// set fontName
		var fontName = "CustomFont";
		
		// set fontStyle
		var fontStyle = "@font-face{font-family: '" + fontName + "'; font-weight:normal; font-style:normal; src: url('fonts/" + Alloy.Globals.customFontFile + "') format('opentype');}";
		
	}else{
		
		// set fontName
		var fontName = "initial";
		
		// set fontStyle
		var fontStyle = '';
		
	};
	// END IF - Alloy.Globals.useCustomFont true then set Alloy.Globals.customFont else false
	
	// set Styles
	var bodyStyle = "body {margin: 5px; padding: 0px;background:" + Alloy.Globals.backgroundColor + "; direction: " + Alloy.Globals.languageDirection + "; font-weight: normal; font-family: '" + fontName + "'; -webkit-font-feature-settings: 'kern';}*:focus{outline: none;}";
	var h1Style = "h1 {font-size: " + fontSize + "px;line-height: " + lineHeight +"px;margin: 5px;text-align: center;font-weight: normal;font-family: '" + fontName + "';}";
	var h2Style = "h2 {font-size: " + fontSize + "px;line-height: " + lineHeight +"px;margin: 5px;font-weight: normal;font-family: '" + fontName + "';}";
	var headingBigStyle = ".heading-big{text-indent: 0px; margin: 15px 0; font-size: " + (+fontSize+2) + "px; line-height: " + lineHeight +"px; color: " + Alloy.Globals.textSectionColor + "; text-align: center; font-family: '" + fontName + "';}";
	var headingStyle = ".heading{text-indent: 0px; margin: 15px 0; font-size: " + (+fontSize+2) + "px; line-height: " + lineHeight +"px; color: " + Alloy.Globals.textSectionColor + "; text-align: center; font-family: '" + fontName + "'; }";
	var headingSmallStyle = ".heading-small{text-indent: 0px; margin: 20px 0; font-size: " + (+fontSize - 2) + "px; line-height: " + lineHeight +"px; color: black; text-align: center; font-family: '" + fontName + "'; }";
	var headingSubStyle = ".heading-sub{text-indent: 0px; margin: 15px 0; font-size: " + fontSize + "px; line-height: " + lineHeight +"px; color: " + Alloy.Globals.textSectionColor + "; text-align: center; font-family: '" + fontName + "'; }";
	var pStyle = "p {text-indent: " + (+fontSize-8) + "px;font-size: " + fontSize + "px;line-height: " + lineHeight +"px;margin: 0;font-family: '" + fontName + "';font-feature-settings: 'kern'; -webkit-font-feature-settings: 'kern';}";	
	var supStyle = "sup {vertical-align: middle;color: " + Alloy.Globals.textVerseNumberColor + ";margin-left:5px;margin-right:5px;font-size: " + (+fontSize-10) + "px;font-family: '" + fontName + "';}";
	var aStyle = "a {color: " + Alloy.Globals.textLinkColor + ";text-decoration: none;font-family: '" + fontName + "';} a sup {font-size: " + (+fontSize+5) + "px;color: " + Alloy.Globals.textLinkColor + ";text-decoration: none;font-family: '" + fontName + "';} ";
	var hrStyle = "hr {width: 100%;clear: both;border: none;height: 2px;background: black;margin: 0;padding: 0;}";	
	var blankStyle = ".blank-line{margin: 15px;font-family: '" + fontName + "';}";
	var quoteStyle = ".quote{margin: 5px 15px 5px 0;font-family: '" + fontName + "';}";
	var footnoteStyle = ".footnote{font-size: " + (+fontSize-6) + "px; color: black;font-family: '" + fontName + "';}.footnote-number{font-size: " + (+fontSize-6) + "px; margin-left: 5px;color: black;font-family: '" + fontName + "';}";
	var selahStyle = ".selah{margin: 0 10px 0 0;font-family: '" + fontName + "';float: " + floatVar + ";}"; 
	var verseblockStyle = ".verse-block{padding: 0 0 15px 0;font-family: '" + fontName + "';}";	
	var highLightStyle = ".highlight{background: rgba(144,184,26,0.4);}";
	var readmoreStyle = ".read-more {text-align: " + floatVar + ";}";
	var questionBoxWrapStyle = ".question-box-wrap {margin: 0 0 15px; border: 2px solid silver; box-shadow: 2px 2px 2px #888888; border-radius: 10px; background-color: " + Alloy.Globals.boxBackgroundColor + "; padding: 5px;}";		
	var questionBoxStyle = ".question-box {font-size: " + Alloy.Globals.fontSizeSmall + "px;line-height: " + Alloy.Globals.fontSizeMedium +"px; display: inline-block;}"; 	
	var questionImageStyle = ".question-image {float:right; margin: 5px 5px 10px 10px; height:75px; width:75px;}";
	
	// combine styles to create styleCode
	var styleCode = "<style>" + fontStyle + bodyStyle + h1Style + h2Style + headingBigStyle + headingStyle + headingSmallStyle + headingSubStyle + pStyle + supStyle + aStyle + hrStyle + blankStyle + quoteStyle + footnoteStyle + selahStyle + verseblockStyle + highLightStyle + readmoreStyle + questionBoxWrapStyle + questionBoxStyle + questionImageStyle + "</style>";
	
	// return styleCode
	return styleCode;
};

// 						End FUNCTION to Set user font Size setting								//
//////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = prepareStyle;