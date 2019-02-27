# Appcelerator Hyperloop Count.ly Analytics Module
Cross-platform Appcelerator Hyperloop Module for [Count.ly Analytics](https://count.ly) - iOS and Android

## This Appcelerator Hyperloop module is a workd in progress and does not currently support all of Count.ly functions.
### Please log issues via Github issues
### Any pull requests and suggestions welcome!
### Author: Dieskim of (Kiteplans.info)](https://www.kiteplans.info)

## Installation:

1. Git Clone or Download and Copy the countlyModule.js file to your `lib/` (Alloy) or your Resources (Classic) directory
2. Require Count.ly Native SDK via Podfile (iOS) or Gradle (Android)

##### iOS: Create "Podfile" with the following in the project root:
```js
# This is required for CocoaPods 1.x
install! 'cocoapods',
         :integrate_targets => false
 
platform :ios, '8.0'
use_frameworks!

target 'alloy-hyperloop' do

    pod 'Countly', '18.04'
    
end
``` 

##### Android: Create "build.gradle" with the following in the project root:
```js
apply plugin: 'java'
 
repositories {
    google()
    jcenter()
}
 
dependencies {
    implementation 'ly.count.android:sdk:18.04'
}
 
task getDeps(type: Copy) {
    from sourceSets.main.runtimeClasspath
    exclude 'support-*' 									// The support libraries are packaged with Titanium already
    into 'app/platform/android/' 							// Use "platform/android/" for Classic or "app/platform/android/" for Alloy
}
``` 

3. Add Example code to your app

##### Example Usage Code:
```js
// require Countly
    var Countly = require('countlyModule');

    // enable debug
    Countly.enableDebug();
     
    // countly start
    Countly.start({ appKey: "1a0ea80f9fbd222f76ad444414e6fc9da024",             // app key for the countly app
                    host: "http://yourhost.com",                                // countly server url
                    //iosDeviceID: "CLYOpenUDID",                               // Optional - Default: CLYIDFV Possible Values: CLYIDFV / CLYIDFA / CLYOpenUDID / yourCustomDeviceID - @see {@link https://resources.count.ly/v1.0/docs/countly-sdk-for-ios-and-os-x#section-using-a-custom-device-id | Using a Custom Device ID}
                    //androidDeviceID: "DeviceId.Type.OPEN_UDID",               // Optional - Default: DeviceId.Type.OPEN_UDID Possible Values: DeviceId.Type.OPEN_UDID / DeviceId.Type.ADVERTISING_ID / YOUR-OWN-CUSTOM-ID - @see {@link https://resources.count.ly/v1.0/docs/countly-sdk-for-android#section-setting-up-countly-sdk | Setting up Countly SDK}
                    //features: ['CLYCrashReporting','CLYAutoViewTracking'],    // Optional - Array of Features to Enable. Possible Values: CLYCrashReporting / CLYAutoViewTracking (CLYPushNotifications NOT Supported yet) @see {@link https://resources.count.ly/docs/countly-sdk-for-ios-and-os-x#section-additional-features | iOS Additional Features}
                    //crashSegmentation: {key1: "value1"},                                     // Optional - crash segmentation key value pair object @see {@link https://resources.count.ly/docs/countly-sdk-for-ios-and-os-x#section-crash-reporting | iOS Crash Reporting} @see {@link https://resources.count.ly/docs/countly-sdk-for-android#section-adding-a-custom-key-value-segment-to-a-crash-report | Android Adding a custom key-value segment to a crash report}
     
    });

    function getDeviceID(){
     
        Ti.API.info("Countly - getDeviceID");
         
        var deviceID = Countly.getDeviceID();
         
        Ti.API.info(deviceID);
     
    }
     
    function sendEvent(){
         
        Ti.API.info("Countly - event");
         
        var eventData = {key: "test2", segmentation:{test1: "test1"}, count: 1};
         
        Ti.API.info("Countly - after eventData");
     
        Countly.recordEvent(eventData);
         
         
    }
     
    function userDetails(){
         
        Ti.API.info("Countly - userDetails");
         
        // set userData object
        var userData = {};
        userData['name'] = 'testName2';
        userData['email'] = 'testEmail2@gmail.com';
        userData['username'] = 'testUserName2';
        userData['birthYear'] = '1983';
        
        // set customUserData object
        var customUserData = {};
        customUserData['OUDID'] = "testOUDID";

        // set args as userData and customUserData
        var args = {    userData:userData,
                        customUserData:customUserData,
                    };
                                
        // run Countly.userData
        Countly.userData(args); 
         
    }

    function recordHandledException(){
        
        Ti.API.info("Countly - recordCrashLog");

        Countly.recordCrashLog("This is the log before the Exception");

        Ti.API.info("Countly - recordHandledException");
        
        // run Countly.crashTest
        Countly.recordHandledException({name: "exceptionType", 
                                        reason: "exceptionName",
                                        userInfo: {exceptionUserInfoKey: "exceptionUserInfoValue"}}); 
        
    }

    function recordUnhandledException(){
        
        Ti.API.info("Countly - recordUnhandledException");
        
        // run Countly.crashTest
        Countly.recordUnhandledException({name: "exceptionType", 
                                        reason: "exceptionName",
                                        userInfo: {exceptionUserInfoKey: "exceptionUserInfoValue"}}); 
        
    }

    function recordLocation(){
         
        Ti.API.info("Countly - recordLocation");

        // run Countly.crashTest
        Countly.recordLocation({gpsLocation: {latitude: "33.6895", longitude: "139.6917"}}); 

    }

    function crashTest(){
         
        // run Countly.crashTest
        Countly.crashTest(); 

    }
    
    /*  
    // APPCELERATOR ANDROID APP PAUSE RESUME EVENTS
    // USE: https://github.com/dieskim/Appcelerator.Hyperloop.appPauseResume

    // require appPauseResumeModule
    var appPauseResume = require('appPauseResume');

    // run appPauseResume and add resume and pause callbacks
    appPauseResume({pause: function(){

                        Ti.API.info("appPauseResume - pause");

                        if(OS_ANDROID){

                            // stop countly on app pause
                            Countly.stop();
                        };

                    },
                    resume: function(){

                        Ti.API.info("appPauseResume - resume");

                        if(OS_ANDROID){

                            // resume countly on app pause
                            Countly.resume();
                        };
                       

                    },
                    setIntervalTime: 1000,  // optional - Default: 1000 miliseconds (1 second) 
    });
    */
``` 

4. Edit Example code, Build and Enjoy!

## Usage:
## [SEE DOCUMENTATION](https://github.com/dieskim/Appcelerator.Hyperloop.Countly/blob/master/DOCUMENTATION.md)

## License
MIT

## Copyright
&copy; 2018 by Dieskim