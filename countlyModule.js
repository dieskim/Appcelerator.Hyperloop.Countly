/**
 * countlyModule
 * Cross-platform Hyperloop Module for both the iOS and Android Countly SDK
 * 
 * iOS Hyperloop Setup:
 * Create "Podfile" with the following in the project root:
 * 
 *  # This is required for CocoaPods 1.x
    install! 'cocoapods',
             :integrate_targets => false
     
    platform :ios, '8.0'
    use_frameworks!

    target 'alloy-hyperloop' do

        pod 'Countly', '18.04'
        
    end
 *   
 * Android Setup:
 * Create "build.gradle" with the following in the project root:
 * 
 *  apply plugin: 'java'
 
    repositories {
        google()
        jcenter()
    }
     
    dependencies {
        implementation 'ly.count.android:sdk:18.04'
    }
     
    task getDeps(type: Copy) {
        from sourceSets.main.runtimeClasspath
        exclude 'support-*'                                     // The support libraries are packaged with Titanium already
        into 'app/platform/android/'                            // Use "platform/android/" for Classic or "app/platform/android/" for Alloy
    }
 * 
 * @module countlyModule  
 * 
 * @example    <caption>Require and run an exported function to show the form</caption> 
 * 
 *  // require Countly
    var Countly = require('countlyModule/countlyModule');

    // enable debug
    Countly.enableDebug();
     
    // countly start
    Countly.start({ appKey: "1a0ea80f9fbd222f76ad444414e6fc9da024",         // appKey
                    host: "http://host.com",                                // countly server host
                    iosDeviceID: "CLYOpenUDID",                             // Optional - Defaults to: CLYIDFV - https://resources.count.ly/v1.0/docs/countly-sdk-for-ios-and-os-x#section-using-a-custom-device-id
                    //androidDeviceID: "DeviceId.Type.OPEN_UDID",           // Optional - Defaults to: DeviceId.Type.OPEN_UDID else DeviceId.Type.ADVERTISING_ID / YOUR-OWN-CUSTOM-ID - https://resources.count.ly/v1.0/docs/countly-sdk-for-android#section-setting-up-countly-sdk
     
    });    
 *
 */

// TO DO recordUncaughtException // waiting for Countly to add to SDK
// TO DO crashTest - still not sure on how to make non production android crash
// TO DO ADD Symbolication - https://resources.count.ly/docs/countly-sdk-for-ios-and-os-x#section-symbolication

// START IF - iOS / Android - Require Classes needed
if(OS_IOS){
     
    // require CountlyClass
    var CountlyClass = require('Countly/Countly');
     
    // require CountlyConfig
    var CountlyConfigClass = require('Countly/CountlyConfig');
    var CountlyConfig = new CountlyConfigClass();
    
    // require CountlyUserDetailsClass
    var CountlyUserDetailsClass = require('Countly/CountlyUserDetails');

}else{ // else Android
     
    // require CountlyClass
    var CountlyClass = require('ly.count.android.sdk.Countly');
     
};
// END IF - iOS or Android - Require Classes needed
 
/**
 * Enabled Countl Debug Logging
 * @see {@link https://resources.count.ly/docs/countly-sdk-for-ios-and-os-x#section-debug-mode | iOS Debug} 
 * @see {@link https://resources.count.ly/docs/countly-sdk-for-android#section-enabling-logging | Android Debug} 
 */
exports.enableDebug = function(){
    
    // START IF - iOS / Android - enableDebug
    if(OS_IOS){
 
        CountlyConfig.enableDebug = true;
 
    }else{ // else Android
 
        CountlyClass.sharedInstance().setLoggingEnabled(true);
 
    };
    // END IF - iOS or Android - enableDebug
     
};
 
/**
 * Start Countly
 * 
 * @param       {object}  configVars                    countly startup config vars
 * @param       {string}  configVars.appKey             app key for the countly app
 * @param       {string}  configVars.host               countly server url
 * @param       {string}  configVars.iosDeviceID        Optional - Default: CLYIDFV Possible Values: CLYIDFV / CLYIDFA / CLYOpenUDID - @see {@link https://resources.count.ly/v1.0/docs/countly-sdk-for-ios-and-os-x#section-using-a-custom-device-id | Using a Custom Device ID}
 * @param       {string}  configVars.androidDeviceID    Optional - Default: DeviceId.Type.OPEN_UDID Possible Values: DeviceId.Type.OPEN_UDID / DeviceId.Type.ADVERTISING_ID / YOUR-OWN-CUSTOM-ID - @see {@link https://resources.count.ly/v1.0/docs/countly-sdk-for-android#section-setting-up-countly-sdk | Setting up Countly SDK}
 * @param       {array}   configVars.features           Optional - Array of Features to Enable. Possible Values: CLYCrashReporting / CLYAutoViewTracking (CLYPushNotifications NOT Supported yet) @see {@link https://resources.count.ly/docs/countly-sdk-for-ios-and-os-x#section-additional-features | iOS Additional Features}
 * @param       {object}  configVars.crashSegmentation  Optional - crash segmentation key value pair object @see {@link https://resources.count.ly/docs/countly-sdk-for-ios-and-os-x#section-crash-reporting | iOS Crash Reporting} @see {@link https://resources.count.ly/docs/countly-sdk-for-android#section-adding-a-custom-key-value-segment-to-a-crash-report | Android Adding a custom key-value segment to a crash report}
 * 
 * @see {@link https://resources.count.ly/docs/countly-sdk-for-ios-and-os-x#section-integration | iOS Integration} 
 * @see {@link https://resources.count.ly/docs/countly-sdk-for-android#section-setting-up-countly-sdk | Android Setting up Countly SDK} 
 */ 
exports.start = function(configVars){
     
    Ti.API.log(JSON.stringify(configVars));

    // START IF - iOS / Android
    if(OS_IOS){
 
        // set CountlyConfig vars
        CountlyConfig.appKey = configVars.appKey;
        CountlyConfig.host = configVars.host;
         
        // START IF - iosDeviceID set then set CountlyConfig.deviceID
        if(configVars.iosDeviceID){

            // set CountlyConfig.deviceID
            CountlyConfig.deviceID = configVars.iosDeviceID;
        };
        // END IF - iosDeviceID set then set CountlyConfig.deviceID
        
        // START IF - features set then enable the features
        if(configVars.features){
            
            // set CountlyConfig.features
            CountlyConfig.features = [configVars.features];

        };
        // END IF - features set then enable the features
        
        // START IF - crashSegmentation
        if(configVars.crashSegmentation){
            
            // set CountlyConfig.crashSegmentation
            CountlyConfig.crashSegmentation = configVars.crashSegmentation;

        };
        // END IF - crashSegmentation

        // start countly
        CountlyClass.sharedInstance().startWithConfig(CountlyConfig);
 
    }else{ // else Android
 
        // get app activity
        var Activity = require('android.app.Activity');
        var appActivity = new Activity(Ti.Android.currentActivity);
    
        // START IF - androidDeviceID
        if(configVars.androidDeviceID){
             
            // START IF - androidDeviceID set to DeviceId.Type.OPEN_UDID / DeviceId.Type.ADVERTISING_ID else own custom ID
            if (configVars.androidDeviceID == "DeviceId.Type.OPEN_UDID" || configVars.androidDeviceID == "DeviceId.Type.ADVERTISING_ID"){
                
                // init countly with configVars.androidDeviceID as set to DeviceId.Type.OPEN_UDID / DeviceId.Type.ADVERTISING_ID
                CountlyClass.sharedInstance().init(appActivity, configVars.host, configVars.appKey, null, configVars.androidDeviceID);  
 
            }else{
                
                // init countly with configVars.androidDeviceID as your own custom ID
                CountlyClass.sharedInstance().init(appActivity, configVars.host, configVars.appKey, configVars.androidDeviceID);
 
            };
            // END IF - androidDeviceID set to DeviceId.Type.OPEN_UDID / DeviceId.Type.ADVERTISING_ID else own custom ID

        }else{
            
            // init countly with default - tries oudid else Google Advertising ID 
            CountlyClass.sharedInstance().init(appActivity, configVars.host, configVars.appKey); 
 
        };
        // END IF - androidDeviceID
         
        // start countly
        CountlyClass.sharedInstance().onStart(appActivity);
        
        // START IF - features set then check values and enable features manually
        if(configVars.features){
            
            // set featuresArray
            var featuresArray = configVars.features;

            if (featuresArray.indexOf("CLYCrashReporting") > -1) {
                
                // enable CrashReporting on countly
                CountlyClass.sharedInstance().enableCrashReporting();

                // START IF - crashSegmentation
                if(configVars.crashSegmentation){
                    
                    // setCustomCrashSegments
                    CountlyClass.sharedInstance().setCustomCrashSegments(configVars.crashSegmentation)

                };
                // END IF - crashSegmentation

            };

            if (featuresArray.indexOf("CLYAutoViewTracking") > -1) {
                
                // enable ViewTracking on countly
                CountlyClass.sharedInstance().setViewTracking(true);

            };

        };
        // START END - features set then check values and enable features manually


    };
    // END IF - iOS / Android
 
};

/**
 * Stops Countly Tracking - ANDROID ONLY
 * @see {@link https://resources.count.ly/docs/countly-sdk-for-android#section-setting-up-countly-sdk | Android Setting up Countly SDK} 
 */  
exports.stop = function(){
     
    // run countly onStop
    CountlyClass.sharedInstance().onStop();
 
};
 
/**
 * Resume Countly Tracking - ANDROID ONLY
 * @see {@link https://resources.count.ly/docs/countly-sdk-for-android#section-setting-up-countly-sdk | Android Setting up Countly SDK}
 */ 
exports.resume = function(){
     
    // get app activity
    var Activity = require('android.app.Activity');
    var appActivity = new Activity(Ti.Android.currentActivity);
    
    // run countly onStart
    CountlyClass.sharedInstance().onStart(appActivity);
 
};

/**
 * Returns Countly Device ID
 * @return     {string}  current countly id for app as used on server
 * @see {@link https://resources.count.ly/docs/countly-sdk-for-ios-and-os-x#section-device-id | iOS Device ID} 
 * @see {@link https://resources.count.ly/docs/countly-sdk-for-android#section-retrieving-the-device-id-and-its-type | Android Retrieving the device id and its type} 
 */ 
exports.getDeviceID = function(){
     
    // START IF - iOS / Android
    if (OS_IOS){
         
        // get deviceID
        var deviceID = CountlyClass.sharedInstance().deviceID();
     
    }else{
         
        // get deviceID
        var deviceID = CountlyClass.sharedInstance().getDeviceID();
         
    };
    // END IF - iOS / Android
     
    // return deviceID
    return deviceID;
     
};

/**
 * Adds crash log record that will be send with the crash report
 * 
 * @param      {string}     crashLogVar                       crash log to store and send with crash
 *  
 * @see {@link https://resources.count.ly/docs/countly-sdk-for-ios-and-os-x#section-crash-reporting | iOS Crash Reporting} 
 * @see {@link https://resources.count.ly/docs/countly-sdk-for-android#section-adding-breadcrumbs | Android Adding breadcrumbs} 
 */ 
exports.recordCrashLog = function(crashLogVars){
    
    // set vars
    var crashLog = crashLogVars;

    // START IF - iOS / Android
    if (OS_IOS){
         
        CountlyClass.sharedInstance().recordCrashLog(crashLog);
     
    }else{
         
        CountlyClass.sharedInstance().addCrashLog(crashLog);
         
    };
    // END IF - iOS / Android
     
};

/**
 * Records Handled Exception
 * 
 * @param      {object}     exceptionData                       exceptionData key value object
 * @param      {string}     exceptionData.name                  exception type
 * @param      {string}     exceptionData.reason                exception name
 * @param      {object}     exceptionData.userInfo              exception userInfo (extra data you want to provide)
 *  
 * @see {@link https://resources.count.ly/docs/countly-sdk-for-ios-and-os-x#section-manually-handled-exceptions | iOS Manually Handled Exceptions} 
 * @see {@link https://resources.count.ly/docs/countly-sdk-for-android#section-logging-handled-exceptions | Android Logging handled exceptions} 
 */ 
exports.recordHandledException = function(exceptionData){
    
    // set vars
    var exceptionName = exceptionData.name;
    var exceptionReason = exceptionData.reason;
    var exceptionUserInfo = exceptionData.userInfo;

    // START IF - iOS / Android
    if (OS_IOS){
          
        // require NSException class
        var NSException = require('Foundation/NSException');

        // build crashException from NSException
        var crashException = NSException.exceptionWithNameReasonUserInfo(exceptionName, exceptionReason, exceptionUserInfo);

        // build crashStackTraceArray as array of all data in exceptionData
        var crashStackTraceArray = [];

        // START LOOP - add exceptionData to crashStackTraceArray
        for (var key in exceptionData) {
            if (exceptionData.hasOwnProperty(key)) {
                var arrayValueString = key + ":" + JSON.stringify(exceptionData[key]);
                crashStackTraceArray.push(arrayValueString);
            }
        };
        // END LOOP - add exceptionData to crashStackTraceArray

        // run recordHandledExceptionWithStackTrace
        CountlyClass.sharedInstance().recordHandledExceptionWithStackTrace(crashException, crashStackTraceArray);
     
    }else{
         
        // require Exception and Throwable
        var Exception = require('java.lang.Exception');
        var Throwable = require('java.lang.Throwable');

        // build exceptionDataString
        var exceptionDataString = JSON.stringify(exceptionData);

        // build exceptionTrowable
        var exceptionTrowable = new Throwable(exceptionDataString);

        // build crashException
        var crashException = new Exception(exceptionName, exceptionTrowable);

        // run logException - TO DO - change to recordHandledException when pulling in new SDK
        CountlyClass.sharedInstance().logException(crashException)
         
    };
    // END IF - iOS / Android
     
};

// TO DO - add when Countly Adds functions to SDK
exports.recordUnHandledException = function(exceptionData){

    // USE - Ti.App.addEventListener('uncaughtException', function(exception) {
    // LOG WHOLE EXCEPTTION AS - crashStackTraceArray
    // IF THERE IS A FIX FOR NSThread.callStackSymbols the we could use that and push exception as USERINFO?
    // 
    //var NSArray = require('Foundation/NSArray');
    //var NSThread = require('Foundation/NSThread');
    //var crashStackTrace = NSThread.callStackSymbols;
    //var crashStackTrace = NSArray.alloc().initWithArray(NSArray.cast(NSThread.callStackSymbols));
    //Ti.API.log(Object.prototype.toString.call(crashStackTrace));
    //Ti.API.log(Object.keys(crashStackTrace));
    //Ti.API.log(Object.values(crashStackTrace));
    // 
};

/**
 * Crash Tests
 * - iOS crashes on device (even when not in production)
 * - Android should crash on production
 */ 
exports.crashTest = function (){
    
    Ti.API.log("Countly - crashTest");

    if(OS_IOS){

        // CRASH ON DEVICE (COMPLETE HARD CRASH)
        Ti.Media.openPhotoGallery({
            mediaTypes: [ Titanium.Media.MEDIA_TYPE_PHOTO ]
        });

        // crash on simulator
        //var NSException = require('Foundation/NSException');
        //var crashException = new NSException();

    }else{

        throw new RuntimeException("This is a crash");

        //var test = null;
        //while(1){
        //    test = {test};
        //}
        
    }

};

/**
 * Record an Event to Countly
 * 
 * @param      {object}     eventVars                       event variable object
 * @param      {string}     eventVars.key                   event key (name)
 * @param      {object}     eventVars.segmentation          event key value pair segmentaion object
 * @param      {integer}    eventVars.count                 event count
 * @param      {double}     eventVars.sum                   event sum
 * @see {@link https://resources.count.ly/docs/countly-sdk-for-ios-and-os-x#section-recording-events | iOS Recording Events} 
 * @see {@link https://resources.count.ly/docs/countly-sdk-for-android#section-setting-up-custom-events | Android Setting up custom events}  
 */
// TO DO - add duration  
// TO DO - add timed events https://resources.count.ly/docs/countly-sdk-for-ios-and-os-x#section-timed-events
exports.recordEvent = function(eventVars){

    // set vars
    var key = eventVars.key;
    var segmentation = eventVars.segmentation || false;
    var count = eventVars.count || false;
    var sum = eventVars.sum || false;

    // START IF - iOS / Android
    if (OS_IOS){
         
        // START IF - segmentation else count / sum else only key 
        if(segmentation){
             
            // START IF - count / sum
            if(count && sum){ // if segmentation + count + sum
                 
                // recordEvent with key, segmentation, count, sum
                CountlyClass.sharedInstance().recordEventSegmentationCountSum(key, segmentation, count, sum);
                 
            }else if (count){ // else if only segmentation + count
                 
                // recordEvent with key, segmentation, count
                CountlyClass.sharedInstance().recordEventSegmentationCount(key, segmentation, count);
                 
            }else{  // else only segmentation
                 
                // recordEvent with key, segmentation
                CountlyClass.sharedInstance().recordEventSegmentation(key, segmentation);
                 
            };
            // END IF - count / sum                  
             
        }else if (count || sum){ // else count / sum
             
            // START IF - count / sum
            if(count && sum){ // if count + sum
                 
                // recordEvent with key, count, sum
                CountlyClass.sharedInstance().recordEventCountSum(key, count, sum);
                 
            }else if (count && !sum){   // else only count
                 
                // recordEvent with key, count
                CountlyClass.sharedInstance().recordEventCount(key, count);
                 
            }else if (sum && !count){   // else only sum
                 
                // recordEvent with key, sum
                CountlyClass.sharedInstance().recordEventSum(key, sum);
                 
            };
            // END IF - count / sum
             
        }else{ // else only key
            
            // recordEvent with only key
            CountlyClass.sharedInstance().recordEvent(key);
             
        };
        // END IF - segmentation else count / sum else only key 
         
    }else{ // else Android

        // START IF - segmentation else count / sum else only key 
        if(segmentation){
             
            // START IF - count / sum
            if(count && sum){ // if segmentation + count + sum
                 
                // recordEvent with key, segmentation, count, sum
                CountlyClass.sharedInstance().recordEvent(key, segmentation, count, sum);
                 
            }else if (count){ // else if only segmentation + count
                 
                // recordEvent with key, segmentation, count
                CountlyClass.sharedInstance().recordEvent(key, segmentation, count);
                 
            }else{ // else only segmentation
                 
                // recordEvent with key, segmentation
                CountlyClass.sharedInstance().recordEvent(key, segmentation, 1);
                 
            };          
            // END IF - count / sum 
             
        }else if (count || sum){ // else count or sum
            
            // START IF - count / sum
            if(count && sum){
                 
                // recordEvent with key, count, sum
                CountlyClass.sharedInstance().recordEvent(key, count, sum);
                 
            }else if (count && !sum){
                 
                // recordEvent with key, count
                CountlyClass.sharedInstance().recordEvent(key, count);
                 
            }else if (sum && !count){
                
                // recordEvent with key, sum 
                CountlyClass.sharedInstance().recordEvent(key, 1, sum);
                 
            };
            // END IF - count / sum
             
        }else{ // else only key
             
            // recordEvent with only key
            CountlyClass.sharedInstance().recordEvent(key);
             
        }; 
        // END IF - segmentation else count / sum else only key 

    };  
    // END IF - iOS / Android 
     
};

/**
 * Set and Send UserData to Countly
 *
 * @param      {object}  userVars                       userVars valiable object
 * @param      {object}  userVars.userData              userData - pre-defined user data object
 * @param      {object}  userVars.customUserData        customUserData - custom user data object
 * @see {@link https://resources.count.ly/docs/countly-sdk-for-ios-and-os-x#section-user-profiles | iOS User Profiles} 
 * @see {@link https://resources.count.ly/docs/countly-sdk-for-android#section-setting-up-user-profiles | Android Setting up User Profiles} 
 */ 
exports.userData = function (userVars){
    
    // set vars
    var userData = userVars.userData || false;
    var customUserData = userVars.customUserData || false;

    // START IF - iOS / Android
    if(OS_IOS){
        
        // START IF - userData
        if (userData){

            // START IF - name
            if (userData.name){

                // set name to user profile
                CountlyUserDetailsClass.sharedInstance().name = userData.name;

            };
            // END IF - name

            // START IF - username
            if (userData.username){

                // set username to user profile
                CountlyUserDetailsClass.sharedInstance().username = userData.username;

            };
            // END IF - username

            // START IF - email
            if (userData.email){

                // set email to user profile
                CountlyUserDetailsClass.sharedInstance().email = userData.email;

            }; 
            // END IF - email

            // START IF - birthYear
            if (userData.birthYear){

                // set birthYear to user profile
                CountlyUserDetailsClass.sharedInstance().birthYear = userData.birthYear;

            };
            // END IF - birthYear

            // START IF - organization
            if (userData.organization){

                // set organization to user profile
                CountlyUserDetailsClass.sharedInstance().organization = userData.organization;

            };
            // END IF - organization

            // START IF - gender
            if (userData.gender){

                // set gender to user profile
                CountlyUserDetailsClass.sharedInstance().gender = userData.gender;

            };
            // END IF - gender

            // START IF - phone
            if (userData.phone){

                // set phone to user profile
                CountlyUserDetailsClass.sharedInstance().phone = userData.phone;

            };
            // END IF - phone     

        };
        // END IF - userData
        
        // START IF - customUserData
        if (customUserData){

            // set custom user data to user profile
            CountlyUserDetailsClass.sharedInstance().custom = customUserData;

        };
        // END IF - customUserData

        // send user details
        CountlyUserDetailsClass.sharedInstance().save();
         
    }else{ // else Android
        
        // START IF - userData
        if (userData){

            // START IF - birthYear FIX ANDROID SDK DIFFERENCE
            if (userData.birthYear){
                
                // add byear
                userData['byear'] = userData.birthYear

                // delete birthYear
                delete userData['birthYear']; 

            };
            // END IF - birthYear FIX ANDROID SDK DIFFERENCE       

        };
        // END IF - userData
        
        // START IF - customUserData
        if (customUserData){

            // set userData and customUserData to user profile
            CountlyClass.userData.setUserData(userData, customUserData);

        }else{

            // set userData to user profile
            CountlyClass.userData.setUserData(userData);

        };
        // END IF - customUserData

        // send user details
        CountlyClass.userData.save();

    };
    // END IF - iOS / Android
};

/**
 * Record User Location - GPS
 * @param     {object}  locationVars   location key value object
 * @see {@link https://resources.count.ly/docs/countly-sdk-for-ios-and-os-x#section-geolocation | iOS GeoLocation} 
 * @see {@link https://resources.count.ly/docs/countly-sdk-for-android#section-user-location | Android User location} 
 */ 
// TO DO - ADD OTHER LOCATION SETTINGS LIKE CITY, COUNTRY, IP
exports.recordLocation = function(locationVars){
    
    // set vars
    var gpsLocation = locationVars.gpsLocation || false;

    // START IF - iOS / Android
    if (OS_IOS){
        
        // START IF - gpsLocation
        if (gpsLocation && gpsLocation.latitude && gpsLocation.longitude){
            
            // require CoreLocation
            var CoreLocation = require('CoreLocation');

            // build CLLocationCoordinate2D
            var CLLocationCoordinate2D = CoreLocation.CLLocationCoordinate2DMake(gpsLocation.latitude,gpsLocation.longitude);
            
            // set location
            CountlyClass.sharedInstance().recordLocation(CLLocationCoordinate2D);

        };
        // END IF - gpsLocation      
     
    }else{
        
        // START IF - gpsLocation
        if (gpsLocation && gpsLocation.latitude && gpsLocation.longitude){

            // set gpsLocationString
            var gpsLocationString = gpsLocation.latitude + "," + gpsLocation.longitude;

            // set location
            CountlyClass.sharedInstance().setLocation(null,null,gpsLocationString,null);

        };
        // END IF - gpsLocation

    };
    // END IF - iOS / Android
     
};