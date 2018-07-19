///////////////////////////////////////////////////////////////////////////////////////
//							Start U Font Shaper										//

function makeFormSet(isolatedParam, initialParam, medialParam, finalParam, isConnectableParam) {
        return {
            isolated: isolatedParam,
            initial: initialParam,
            medial: medialParam,
            finalForm: finalParam,
            isConnectable: isConnectableParam // denotes if this letter connects with the succeeding letter.
        };
    }

    // A map of Arabic to Arabic Presentation Forms A and B
    var a2apfMap = {
            0x0627: makeFormSet(0xFE8D, 0xFE8D, 0xFE8D, 0xFE8E, false), // a
            0x06D5: makeFormSet(0xFEE9, 0xFEE9, 0xFEE9, 0xFEEA, false), // e
            0x0628: makeFormSet(0xFE8F, 0xFE91, 0xFE92, 0xFE90, true),  // b
            0x067E: makeFormSet(0xFB56, 0xFB58, 0xFB59, 0xFB57, true),  // p
            0x062A: makeFormSet(0xFE95, 0xFE97, 0xFE98, 0xFE96, true),  // t
            0x062C: makeFormSet(0xFE9D, 0xFE9F, 0xFEA0, 0xFE9E, true),  // j
            0x0686: makeFormSet(0xFB7A, 0xFB7C, 0xFB7D, 0xFB7B, true),  // ch
            0x062E: makeFormSet(0xFEA5, 0xFEA7, 0xFEA8, 0xFEA6, true),  // x
            0x062F: makeFormSet(0xFEA9, 0xFEA9, 0xFEAA, 0xFEAA, false), // d
            0x0631: makeFormSet(0xFEAD, 0xFEAD, 0xFEAE, 0xFEAE, false), // r
            0x0632: makeFormSet(0xFEAF, 0xFEAF, 0xFEB0, 0xFEB0, false), // z
            0x0698: makeFormSet(0xFB8A, 0xFB8A, 0xFB8B, 0xFB8B, false), // zh
            0x0633: makeFormSet(0xFEB1, 0xFEB3, 0xFEB4, 0xFEB2, true),  // s
            0x0634: makeFormSet(0xFEB5, 0xFEB7, 0xFEB8, 0xFEB6, true),  // sh
            0x063A: makeFormSet(0xFECD, 0xFECF, 0xFED0, 0xFECE, true),  // gh
            0x0641: makeFormSet(0xFED1, 0xFED3, 0xFED4, 0xFED2, true),  // f
            0x0642: makeFormSet(0xFED5, 0xFED7, 0xFED8, 0xFED6, true),  // q
            0x0643: makeFormSet(0xFED9, 0xFEDB, 0xFEDC, 0xFEDA, true),  // k
            0x06AF: makeFormSet(0xFB92, 0xFB94, 0xFB95, 0xFB93, true),  // g
            0x06AD: makeFormSet(0xFBD3, 0xFBD5, 0xFBD6, 0xFBD4, true),  // ng
            0x0644: makeFormSet(0xFEDD, 0xFEDF, 0xFEE0, 0xFEDE, true),  // l
            0x0645: makeFormSet(0xFEE1, 0xFEE3, 0xFEE4, 0xFEE2, true),  // m
            0x0646: makeFormSet(0xFEE5, 0xFEE7, 0xFEE8, 0xFEE6, true),  // n
            0x06BE: makeFormSet(0xFBAA, 0xFBAC, 0xFBAD, 0xFBAB, true),  // h
            0x0648: makeFormSet(0xFEED, 0xFEED, 0xFEEE, 0xFEEE, false), // o
            0x06C7: makeFormSet(0xFBD7, 0xFBD7, 0xFBD8, 0xFBD8, false), // u
            0x06C6: makeFormSet(0xFBD9, 0xFBD9, 0xFBDA, 0xFBDA, false), // ö
            0x06C8: makeFormSet(0xFBDB, 0xFBDB, 0xFBDC, 0xFBDC, false), // ü
            0x06CB: makeFormSet(0xFBDE, 0xFBDE, 0xFBDF, 0xFBDF, false), // w
            0x06D0: makeFormSet(0xFBE4, 0xFBE6, 0xFBE7, 0xFBE5, true),  // ë
            0x0649: makeFormSet(0xFEEF, 0xFBE8, 0xFBE9, 0xFEF0, true),  // i
            0x064A: makeFormSet(0xFEF1, 0xFEF3, 0xFEF4, 0xFEF2, true),  // y
            0x0626: makeFormSet(0xFE8B, 0xFE8B, 0xFE8C, 0xFB8C, true)   // hemze
        };

    function isArabic(c) {
        return (c >= 0x0600 && c < 0x06FF);
    }

    function convertUText(inputString, rtlMarker, convertProblems) {
    	
    	// set rtlMarker and convertFlag to true if argument not passed
    	var rtlMarkerFlag = typeof rtlMarker !== 'undefined' ?  rtlMarker : true;
		var convertFlag = typeof convertProblems !== 'undefined' ?  convertProblems : true;
		
        var A = 0x0627,
            L = 0x0644,
            LA = 0xFEFB,
            _LA = 0xFEFC,
            // ADDED BY DIESKIM = BLANK
            BLANK = 0xFEFF,

            resultChars = [],
            currentChar, previousChar,
            currentFormSet, previousFormSet,
            currentPresentationForm, previousPresentationForm,
            isCurrentConnectable, isPreviousConnectable = false,
            i;

        if (typeof inputString !== 'string') {
            throw 'Expected input of type "string", instead got ' + (typeof inputString);
        }

        for (i = 0; i < inputString.length; i++) {
            currentChar = inputString.charCodeAt(i);
            currentFormSet = a2apfMap[currentChar];

            if (isArabic(currentChar) && currentFormSet) {
                if (isPreviousConnectable) {
                    // Presentation forms of ligatures LA and _LA need special handling.
                    if (currentChar === A && previousChar === L) { // L + A becomes either LA or _LA
                        if (previousPresentationForm === a2apfMap[L].isolated) {
                            previousPresentationForm = LA;
                        } else { // final form
                            previousPresentationForm = _LA;
                        }
						// ADDED BY DIESKIM = BLANK						
                        currentPresentationForm = BLANK;
                        //currentPresentationForm = '';
                        isCurrentConnectable = false;
                    } else { // general case
                        if (previousPresentationForm === previousFormSet.isolated) { // A changes to A_
                            previousPresentationForm = previousFormSet.initial;
                        } else { // final form
                            previousPresentationForm = previousFormSet.medial; // _A changes to _A_
                        }

                        currentPresentationForm = currentFormSet.finalForm; // Last character is always final.
                        isCurrentConnectable = currentFormSet.isConnectable;
                    }

                    // change previous presentation form so that it is presented as connected to current one.
                    resultChars[resultChars.length - 1] = String.fromCharCode(previousPresentationForm);
                } else { // previous letter was not a connectable Arabic letter.
                    currentPresentationForm = currentFormSet.isolated;
                    isCurrentConnectable = currentFormSet.isConnectable;
                }
             } else { // neither in Arabic region (0x0600-0x06FF) nor Uyghur characters
                             
                var COMMA = 0x060C;
                var SEMICOLON = 0x061B;
                var QUESTIONMARK = 0x061F;
                if (currentChar == COMMA && convertFlag) {
                currentPresentationForm = 0xFBD0;
                isCurrentConnectable = false;
                }else if (currentChar == SEMICOLON && convertFlag) {
                currentPresentationForm = 0xFBD1;
                isCurrentConnectable = false;
                }else if(currentChar == QUESTIONMARK && convertFlag){
                currentPresentationForm = 0xFBD2;
                isCurrentConnectable = false;
                }else{   
                currentPresentationForm = currentChar;
                isCurrentConnectable = false;
                }
            }

            resultChars.push(String.fromCharCode(currentPresentationForm));

            previousChar = currentChar;
            previousFormSet = currentFormSet;
            previousPresentationForm = currentPresentationForm;
            isPreviousConnectable = isCurrentConnectable;
        }
        	
        	// set resultSting
        	var resultSting = resultChars.join('');
        	
        	// START IF - rtlMarkerFlag true then add rtl mark before result to return
        	if(rtlMarkerFlag){
        		
        		var finalString = Alloy.Globals.rtlMarker+resultSting;
        		
        	}else{
        		
        		var finalString = resultSting;
        		
        	};
        	// END IF - rtlMarkerFlag true then add rtl mark before result to return
        	
        	return finalString;      
    };

//							END U Font Shaper										//
///////////////////////////////////////////////////////////////////////////////////////

module.exports = convertUText;