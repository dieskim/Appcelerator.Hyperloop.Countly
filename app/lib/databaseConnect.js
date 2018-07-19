// START FUNCTION - storeDatabaseVersions
function storeDatabaseVersions(databaseName, databaseVersion){
	
	// get databaseVerionsObject
	var databaseVerionsObject = JSON.parse(Ti.App.Properties.getString('databaseVerions','{}'));		// object of databaseVerions
	
	//Ti.API.info("databaseVerionsObject - Before adding data");
	//Ti.API.info(JSON.stringify(databaseVerionsObject));

	// set databaseVersion of databaseName
	databaseVerionsObject[databaseName] = databaseVersion;
	
	//Ti.API.info("databaseVerionsObject - After adding data");
	//Ti.API.info(JSON.stringify(databaseVerionsObject));
	
	// set databaseVerionsObject to databaseVerions	
	Ti.App.Properties.setString('databaseVerions',JSON.stringify(databaseVerionsObject));	 
	
};
// END FUNCTION - storeDatabaseVersions


///////////////////////////////////////////////////////////////////////////////////////////////////
// 					START FUNCTION TO BUILD PAGEARRAY FROM STRING								//

function databaseConnect(data) {
		
///////////////////////////////////////////////////////////////////////////////////////////////////
//  					Start Databse Connection and Content extraction					//
		
	// SET DATABASE ARRAYS
	var bookDataArray = [];
	
	// set databaseNameReadable
	var databaseNameReadable = data.databaseNameReadable || 'textData';
	
	// Set databaseName to use
	var databaseName = data.database || Alloy.Globals.databaseData.textData.databaseName;
	
	// Set checkUpdateVersion
	var checkUpdateVersion = data.checkUpdateVersion || "1.0";
	
	// Set Table
	var table = data.table || "bookData";
	
	// Set method
	var method = data.method || "getValue";
	
	// Set sql
	var sql = data.sql || '';
	
	// Set field to get by
	var field = data.field || "rowid";
	
	// Set field to get by
	var lookupField = data.lookupField || "rowid";
	
	// Set value to get or set
	var value = data.value || "1";
	
	// Set rowNum to get or set
	var rowNum = data.rowNum || 1;
	
	// Set newValue to set
	var newValue = data.newValue || "TRUE";
	
	// Set orderBy
	var orderBy = data.orderBy || false;
	
	// Set db as database with databaseName
	var db = Ti.Database.install('/database/'+ databaseName, databaseName);
	
	// START IF - prevent iCloud Backup
	if (OS_IOS){
		db.file.setRemoteBackup(false);
	};
	// END IF - prevent iCloud Backup
	
		///////////////////////////////////////////////
		// 		First check Database Version 		//
			
			// START IF - Different Methods
			// START CHECKVERION METHOD
			if (method == "checkVersion"){
				
				//Ti.API.info("Check Database Version - " + databaseName);
				
				// set versionRS
				var versionRS = db.execute('SELECT version_number FROM version WHERE rowid=1');
				
				// set currentVersionNumber var as version number found
				var currentVersionNumber = versionRS.fieldByName('version_number');
				
				// Close the verseRS database call
				versionRS.close();
				
				// START IF - currentVersionNumber vs checkUpdateVersion
				if (versionCompare(currentVersionNumber,checkUpdateVersion) != true){
									
					Ti.API.info("DATABASE " + databaseNameReadable + " v" + currentVersionNumber + "SHIPPED/UPDATE DATABASE v" + checkUpdateVersion + " - Update");
					
					// START IF - databaseNameReadable usageData then patch else delete and install new
					if(databaseNameReadable == "usageData"){
						
						// Close Database
						db.close();
						
						// get patchFile
						var patchFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'/database_patch/' + databaseNameReadable + '.xml');
						
						// START IF - patchFile exists - then patch
						if (patchFile.exists()) {
							// read file and get patch string
							var xmlText= patchFile.read().text;
							var xmlDoc = Ti.XML.parseString(xmlText);		
							var xmlPatchStatement = xmlDoc.getElementsByTagName("patch_" + currentVersionNumber + "-" + checkUpdateVersion).item(0).textContent;
								
							//Ti.API.info("xmlText" + xmlText);
							//Ti.API.info("xmlPatchStatement" + xmlPatchStatement);
							
							// run databaseConnect patch
							databaseConnect({
								databaseNameReadable: "usageData",
								database: Alloy.Globals.databaseData.usageData.databaseName,
								checkUpdateVersion: Alloy.Globals.databaseData.usageData.shippedVersion,
								sql: xmlPatchStatement,
								method: "patch",
							});
						
						};					
						// END IF - patchFile exists - then patch
						
					}else{
						
						// Close Database
						db.close();
						
						// Remove Database
						db.remove();
					
						// install newDB as database with databaseName
						var newDB = Ti.Database.install('/database/'+ databaseName, databaseName);
						
						// START IF - prevent iCloud Backup
						if (OS_IOS){
							newDB.file.setRemoteBackup(false);
						};
						// END IF - prevent iCloud Backup
		
						// Close Database
						newDB.close();
					
						// run storeDatabaseVersions set version as new shipped and installed checkUpdateVersion
						storeDatabaseVersions(databaseNameReadable, checkUpdateVersion);
					
					};
					// END IF - databaseNameReadable usageData then patch else delete and install new
					
				}else{
					
					//Ti.API.info("DATABASE " + databaseNameReadable + " v" + currentVersionNumber +" - CURRENT - Do Nothing");
					
					// Close Database
					db.close();
					
					// run storeDatabaseVersions set version as currentVersionNumber
					storeDatabaseVersions(databaseNameReadable, currentVersionNumber);

				};
				// END IF - currentVersionNumber vs checkUpdateVersion
				
			//  END CHECKVERION METHOD  //	
			//////////////////////////////
			// START DELETE METHOD
			}else if (method == "deleteDatabase"){
				
				Ti.API.info("Delete Database - " + databaseName);

				db.remove();
				
				// Close Database
				db.close();				
				
			//  	END DELETE METHOD  	//	
			//////////////////////////////
			// START PATCH METHOD
			}else if (method == "patch"){
				
				//Ti.API.info("run database patch");
				
				// START TRY / CATCH
				try {	
					// set sqlArray
					var sqlArray = sql.split(";");
				
					//Ti.API.info(sqlArray);
						
					// START LOOP - loop through sqlArray and update
					for (var i=0;i<sqlArray.length;i++) {
					
							//Ti.API.info(sqlArray[i]);
					
							// START IF - if sqlArray[i] not null
							if(sqlArray[i]){
						
								// execute each line of sql
								db.execute(sqlArray[i]);
									
							};
							// END IF - if sqlArray[i] not null
					
					};
					// END LOOP -loop through sqlArray and update
					
					// execute database version update
					db.execute('UPDATE "version" SET "version_number" = ' + checkUpdateVersion + ' WHERE  "rowid" = 1');
				
					// close database
					db.close();
				
					// run storeDatabaseVersions
					storeDatabaseVersions(databaseNameReadable, checkUpdateVersion);
					
					// set succesData 
					var returnData = {success: true, database: databaseNameReadable, databaseVersion: checkUpdateVersion};
									
					// return returnData
					return returnData;
					
				}
				catch (e){
					
					//Ti.API.info("Database Patch Error: " + e);
					
					// close database
					db.close();
					
					// set succesData 
					var returnData = {success: false, database: databaseNameReadable, databaseVersion: checkUpdateVersion, error: String(e)};
					
					// return returnData
					return returnData;
					
				}	
				// END TRY / CATCH
				
			//  END PATCH METHOD  //	
			//////////////////////////////
			// START COUNT METHOD
			}else if (method == "count"){
				
				//Ti.API.info("run database count");
				
				var countRS = db.execute('SELECT COUNT(rowid) FROM ' + table);
				var countValue = countRS.field(0);
				
				db.close();
				
				// return countRS
				return countValue;
						
			//  END COUNT METHOD  //	
			//////////////////////////////
			//   START GETVOD METHOD	//
			
			}else if (method == "getVOD"){
				//Ti.API.info("run database getVOD");
				
				// get all Data for verse
				var bookRS = db.execute('SELECT * FROM ' + table + ' WHERE rowid=' + rowNum);
				
				// set verseData
				var verseData = {	bookID:bookRS.fieldByName('bookID'),
									startChapter:bookRS.fieldByName('startChapter'),
									endChapter:bookRS.fieldByName('endChapter'),
									startVerse:bookRS.fieldByName('startVerse'),
									endVerse:bookRS.fieldByName('endVerse'),
									scrollVerse:bookRS.fieldByName('scrollVerse'),
							};
				
				// Close Database
				db.close();
				
				// return bookDataArray with Data
				return verseData;
			
			//    END GETVOD METHOD    //	
			//////////////////////////////
			//   START GETALLTABLEVALUESBYFIELDVALUE METHOD	//
			
			}else if (method == "getAllTableValuesByFieldValue"){
				//Ti.API.info("run database getAllTableValuesByFieldValue");
				
				// START IF - orderBy set then add order else dont
				if(orderBy){
					// get all data in table order by orderBy
					var bookRS = db.execute('SELECT rowid,* FROM ' + table + ' WHERE ' + field + '=' + value + ' ORDER BY ' + orderBy);
				}else{
					// get all data in table
					var bookRS = db.execute('SELECT rowid,* FROM ' + table + ' WHERE ' + field + '=' + value);
				};
				// END IF - orderBy set then add order else dont
						
				// START FOR - loop through rows
				for (var i=0; i<bookRS.rowCount; i++) {
					
					// set bookData object
					var bookData = {};
					
					// START FOR - loop through fields
					for (var f=0; f<bookRS.fieldCount; f++) {
					
						var fieldName = bookRS.fieldName(f);
						var fieldValue = bookRS.field(f);
						
						// add data to bookData object
						bookData[fieldName] = fieldValue;
						
					};	
					// END FOR - loop through fields
									
					// Push bookData to bookDataArray
					bookDataArray.push(bookData);
							
					// Advance to next row	
					bookRS.next();
				
				};	
				// END FOR - - loop through rows
				
				// Close Database
				db.close();
				
				// return bookDataArray with Data
				return bookDataArray;
			
			//    END GETALLTABLEVALUESBYFIELDVALUE METHOD    //	
			//////////////////////////////
			//   START GETALLTABLEVALUES METHOD	//
							
			}else if (method == "getAllTableValues"){
				//Ti.API.info("run database getAllTableValues");
				
				// START IF - orderBy set then add order else dont
				if(orderBy){
					// get all data in table order by orderBy
					var bookRS = db.execute('SELECT * FROM ' + table + ' ORDER BY ' + orderBy);
				}else{
					// get all data in table
					var bookRS = db.execute('SELECT * FROM ' + table);
				};
				// END IF - orderBy set then add order else dont
				
						
				// START FOR - loop through rows
				for (var i=0; i<bookRS.rowCount; i++) {
					
					// set bookData object
					var bookData = {};
					
					// START FOR - loop through fields
					for (var f=0; f<bookRS.fieldCount; f++) {
					
						var fieldName = bookRS.fieldName(f);
						var fieldValue = bookRS.field(f);
						
						// add data to bookData object
						bookData[fieldName] = fieldValue;
						
					};	
					// END FOR - loop through fields
									
					// Push bookData to bookDataArray
					bookDataArray.push(bookData);
							
					// Advance to next row	
					bookRS.next();
				
				};	
				// END FOR - - loop through rows
				
				// Close Database
				db.close();
				
				// return bookDataArray with Data
				return bookDataArray;
			
			//    END GETALLTABLEVALUES METHOD    //	
			//////////////////////////////
			//   START GETTOPICPASSAGES METHOD	//
				
			}else if (method == "getTopicPassages"){
				//Ti.API.info("run database getTopicPassages");
				
				var passageArray = [];
				
				// get all Data for passages in specified topic
				var topicRS = db.execute('SELECT * FROM ' + table + ' WHERE topicID = ' + rowNum);
						
				// START FOR - To populate passagesArray from Database
				for (var i=0; i<topicRS.rowCount; i++) {
					
					var passageData = {id:topicRS.fieldByName('id'),
										topicID:topicRS.fieldByName('topicID'),
										bookID:topicRS.fieldByName('bookID'),
										startChapter:topicRS.fieldByName('startChapter'),
										startVerse:topicRS.fieldByName('startVerse'),
										endChapter:topicRS.fieldByName('endChapter'),
										endVerse:topicRS.fieldByName('endVerse')
									};
							
					// Push passageData to passageArray
					passageArray.push(passageData);
								
					// Advance to next row	
					topicRS.next();
				
				};	
				// END FOR - To populate passageArray from Database
				
				// Close Database
				db.close();

				// return passageArray with Data
				return passageArray;
			
			//    END GETTOPICPASSAGES METHOD    //	
			//////////////////////////////
			//   START GETVALUE METHOD	//
				
			}else if (method == "getValue"){			
				//Ti.API.info("run database getValue = " + value);
				
				// set valueToGet 
				var valueToGet = value;
				// get all Data for books
				var bookRS = db.execute('SELECT ' + valueToGet + ' FROM ' + table + ' WHERE rowid=' + rowNum);	
				
				// set bookData value		
				var bookData = { value: bookRS.fieldByName(valueToGet)};
				
				// Push bookData to bookDataArray
				bookDataArray.push(bookData);
				
				// Close the bookRS database call
				bookRS.close();
				
				// Close Database
				db.close();
					
				// return bookDataArray with Data
				return bookDataArray;
			
			//    END GETVALUE METHOD    //	
			//////////////////////////////
			//   START GETFIELDVALUE METHOD	//
				
			}else if (method == "getFieldValue"){			
				//Ti.API.info("run database getFieldValue = " + field);
				
				// get all Data for books
				var bookRS = db.execute('SELECT ' + field + ' FROM ' + table + ' WHERE ' +  lookupField + '="' + value + '"');	
				
				// set bookData value		
				//var bookData = { value: bookRS.fieldByName(valueToGet)};
				var fieldValue = bookRS.fieldByName(field);
				
				// Push bookData to bookDataArray
				//bookDataArray.push(bookData);
				
				// Close the bookRS database call
				bookRS.close();
				
				// Close Database
				db.close();
					
				// return bookDataArray with Data
				return fieldValue; //bookDataArray;
			
			//    END GETFIELDVALUE METHOD    //	
			//////////////////////////////
			//   START SETVALUE METHOD	//
						
			}else if (method == "setValue"){ 			
				//Ti.API.info("run database setValue = " + value);
				
				// set valueToSet
				var valueToSet = value;
	
				//update table row value with newValue
				db.execute('UPDATE ' + table + ' SET ' + valueToSet + '="' + newValue + '" WHERE rowid=' + rowNum);
				
				// Close Database
				db.close();
			
			//    END GETVALUE METHOD    //	
			//////////////////////////////				
			}; // END Different Methods
			
//  					End Databse Connection and Content Extraction							//
//////////////////////////////////////////////////////////////////////////////////////////////////	

};

// 						END FUNCTION TO BUILD PAGEARRAY FROM STRING								//
///////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = databaseConnect;
