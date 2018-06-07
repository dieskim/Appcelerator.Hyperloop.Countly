// TO DO EVENT - ANDROID
// TO DO USERDATA
// TO DO ADD CRASH - https://resources.count.ly/docs/countly-sdk-for-ios-and-os-x#section-crash-reporting
// TO DO recordUncaughtException
// TO DO addCrashLog
// TO DO recordHandledException
// TO DO crashTest
// TO DO ADD GEOLOCTION - https://resources.count.ly/docs/countly-sdk-for-ios-and-os-x#section-geolocation
// TO DO ADD Symbolication - https://resources.count.ly/docs/countly-sdk-for-ios-and-os-x#section-symbolication
// 
// test 6
if(OS_IOS){
     
    //var CountlyDeviceInfoClass = require('Countly/CountlyDeviceInfo');
     
    // require CountlyClass
    var CountlyClass = require('Countly/Countly');
     
    // require CountlyConfig
    var CountlyConfigClass = require('Countly/CountlyConfig');
    var CountlyConfig = new CountlyConfigClass;
     
}else{
     
    // require CountlyClass
    var CountlyClass = require('ly.count.android.sdk.Countly');
     
};
 
// TO RUN BEFORE START
exports.enableDebug = function(){
     
    if(OS_IOS){
 
        CountlyConfig.enableDebug = true;
 
    }else{
 
        CountlyClass.sharedInstance().setLoggingEnabled(true);
 
    }
     
};
 
 
exports.start = function(configVars){
     
    if(OS_IOS){
 
        // set CountlyConfig vars
        CountlyConfig.appKey = configVars.appKey;
        CountlyConfig.host = configVars.host;
         
        if(configVars.iosDeviceID){
            CountlyConfig.deviceID = configVars.iosDeviceID;
        }
         
        // start countly
        CountlyClass.sharedInstance().startWithConfig(CountlyConfig);
 
    }else{
 
        // get app activity
        var Activity = require('android.app.Activity');
        var appActivity = new Activity(Ti.Android.currentActivity);
 
        if(configVars.androidDeviceID){
             
            if (configVars.androidDeviceID == "DeviceId.Type.OPEN_UDID" || configVars.androidDeviceID == "DeviceId.Type.ADVERTISING_ID"){
 
                CountlyClass.sharedInstance().init(appActivity, configVars.host, configVars.appKey, null, configVars.androidDeviceID);  
 
            }else{
 
                CountlyClass.sharedInstance().init(appActivity, configVars.host, configVars.appKey, configVars.androidDeviceID);
 
            }
        }else{
 
            CountlyClass.sharedInstance().init(appActivity, configVars.host, configVars.appKey); // Default - tries oudid else Google Advertising ID
 
        }
         
        CountlyClass.sharedInstance().onStart(appActivity);
 
    }
 
};
 
// ANDROID ONLY METHOD STOP
exports.stop = function(){
     
    CountlyClass.sharedInstance().onStop();
 
};
 
// ANDROID ONLY METHOD RESUME
exports.resume = function(){
     
    // get app activity
    var Activity = require('android.app.Activity');
    var appActivity = new Activity(Ti.Android.currentActivity);
 
    CountlyClass.sharedInstance().onStart(appActivity);
 
};
 
exports.getDeviceID = function(){
     
    if (OS_IOS){
         
        // get deviceID
        var deviceID = CountlyClass.sharedInstance().deviceID();
     
    }else{
         
        // get deviceID
        var deviceID = CountlyClass.sharedInstance().getDeviceID();
         
    };
     
    // return deviceID
    return deviceID;
     
};
 
// TO DO - add timed events https://resources.count.ly/docs/countly-sdk-for-ios-and-os-x#section-timed-events
exports.recordEvent = function(eventVars){
     
    Ti.API.log("inside - recordEvent");
 
    if (OS_IOS){
         
        Ti.API.log("inside - ios");
 
        var key = eventVars.key;
        var segmentation = eventVars.segmentation || false;
        var count = eventVars.count || false;
        var sum = eventVars.sum || false;
         
        if(segmentation){
             
            Ti.API.log("inside - segmentation");
 
            if(count && sum){
                 
                CountlyClass.sharedInstance().recordEventSegmentationCountSum(key, segmentation, count, sum);
                 
            }else if (count){
                 
                CountlyClass.sharedInstance().recordEventSegmentationCount(key, segmentation, count);
                 
            }else{
                 
                CountlyClass.sharedInstance().recordEventSegmentation(key, segmentation);
                 
            };          
             
             
        }else if (count || sum){
             
            Ti.API.log("inside - count sum");
 
            if(count && sum){
                 
                CountlyClass.sharedInstance().recordEventCountSum(key, count, sum);
                 
            }else if (count && !sum){
                 
                CountlyClass.sharedInstance().recordEventCount(key, count);
                 
            }else if (sum && !count){
                 
                CountlyClass.sharedInstance().recordEventSum(key, sum);
                 
            };
             
        }else{
             
            Ti.API.log("inside - key");
             
            CountlyClass.sharedInstance().recordEvent(key);
             
        };  
         
         
    }else{

    };  
     
     
};
 
exports.userData = function (userVars){
     
    if(OS_IOS){
         
        // require CountlyUserDetailsClass
        var CountlyUserDetailsClass = require('Countly/CountlyUserDetails'); // to do - move or try to do
        //var CountlyUserDetailsClass = CountlyClass.user; // to do - move or try to do 
        //var CountlyUserDetails = new CountlyUserDetailsClass;
         
        //var CountlyUserDetails = CountlyClass.sharedInstance().user;
        CountlyUserDetailsClass.sharedInstance().name = "testName2";
         
        CountlyUserDetailsClass.sharedInstance().save();
         
    }else{
         
    };
};