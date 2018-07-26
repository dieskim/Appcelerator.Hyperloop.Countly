<a name="module_countlyModule"></a>

## countlyModule
countlyModule
Cross-platform Hyperloop Module for both the iOS and Android Countly SDK

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
    exclude 'support-*'                                     // The support libraries are packaged with Titanium already
    into 'app/platform/android/'                            // Use "platform/android/" for Classic or "app/platform/android/" for Alloy
}
``` 

**Example**
```js

 // require Countly
var Countly = require('countlyModule/countlyModule');

// enable debug
Countly.enableDebug();

// countly start
Countly.start({ appKey: "1a0ea80f9fbd222f76ad444414e6fc9da024",             // app key for the countly app
                host: "http://yourhost.com",                                // countly server url
                //iosDeviceID: "CLYOpenUDID",                               // Optional - Default: CLYIDFV Possible Values: CLYIDFV / CLYIDFA / CLYOpenUDID / yourCustomDeviceID - @see [| Using a Custom Device ID](https://resources.count.ly/v1.0/docs/countly-sdk-for-ios-and-os-x#section-using-a-custom-device-id)
                //androidDeviceID: "DeviceId.Type.OPEN_UDID",               // Optional - Default: DeviceId.Type.OPEN_UDID Possible Values: DeviceId.Type.OPEN_UDID / DeviceId.Type.ADVERTISING_ID / YOUR-OWN-CUSTOM-ID - @see [| Setting up Countly SDK](https://resources.count.ly/v1.0/docs/countly-sdk-for-android#section-setting-up-countly-sdk)
                //features: ['CLYCrashReporting','CLYAutoViewTracking'],    // Optional - Array of Features to Enable. Possible Values: CLYCrashReporting / CLYAutoViewTracking (CLYPushNotifications NOT Supported yet) @see [| iOS Additional Features](https://resources.count.ly/docs/countly-sdk-for-ios-and-os-x#section-additional-features)
                //crashSegmentation: {key1: "value1"},                                     // Optional - crash segmentation key value pair object @see [| iOS Crash Reporting](https://resources.count.ly/docs/countly-sdk-for-ios-and-os-x#section-crash-reporting) @see [| Android Adding a custom key-value segment to a crash report](https://resources.count.ly/docs/countly-sdk-for-android#section-adding-a-custom-key-value-segment-to-a-crash-report)

});

function getDeviceID(){

    Ti.API.log("Countly - getDeviceID");

    var deviceID = Countly.getDeviceID();

    Ti.API.log(deviceID);

}

function sendEvent(){

    Ti.API.log("Countly - event");

    var eventData = {key: "test2", segmentation:{test1: "test1"}, count: 1};

    Ti.API.log("Countly - after eventData");

    Countly.recordEvent(eventData);


}

function userDetails(){

    Ti.API.log("Countly - userDetails");

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

    Ti.API.log("Countly - recordCrashLog");

    Countly.recordCrashLog("This is the log before the Exception");

    Ti.API.log("Countly - recordHandledException");

    // run Countly.crashTest
    Countly.recordHandledException({name: "exceptionType",
                                    reason: "exceptionName",
                                    userInfo: {exceptionUserInfoKey: "exceptionUserInfoValue"}});

}

function recordUnhandledException(){

    Ti.API.log("Countly - recordUnhandledException");

    // run Countly.crashTest
    Countly.recordUnhandledException({name: "exceptionType",
                                    reason: "exceptionName",
                                    userInfo: {exceptionUserInfoKey: "exceptionUserInfoValue"}});

}

function recordLocation(){

    Ti.API.log("Countly - recordLocation");

    // run Countly.crashTest
    Countly.recordLocation({gpsLocation: {latitude: "33.6895", longitude: "139.6917"}});

}

function crashTest(){

    // run Countly.crashTest
    Countly.crashTest();

}

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
```

* [countlyModule](#module_countlyModule)
    * [.enableDebug()](#module_countlyModule.enableDebug)
    * [.start(configVars)](#module_countlyModule.start)
    * [.stop()](#module_countlyModule.stop)
    * [.resume()](#module_countlyModule.resume)
    * [.getDeviceID()](#module_countlyModule.getDeviceID) ⇒ <code>string</code>
    * [.recordCrashLog(crashLogVar)](#module_countlyModule.recordCrashLog)
    * [.recordHandledException(exceptionData)](#module_countlyModule.recordHandledException)
    * [.recordUnhandledException()](#module_countlyModule.recordUnhandledException)
    * [.crashTest()](#module_countlyModule.crashTest)
    * [.recordEvent(eventVars)](#module_countlyModule.recordEvent)
    * [.userData(userVars)](#module_countlyModule.userData)
    * [.recordLocation(locationVars)](#module_countlyModule.recordLocation)

<a name="module_countlyModule.enableDebug"></a>

### countlyModule.enableDebug()
Enabled Countly Debug Logging - Run before Starting Countly

**Kind**: static method of [<code>countlyModule</code>](#module_countlyModule)

**See**

- [| iOS Debug](https://resources.count.ly/docs/countly-sdk-for-ios-and-os-x#section-debug-mode)
- [| Android Debug](https://resources.count.ly/docs/countly-sdk-for-android#section-enabling-logging)

<a name="module_countlyModule.start"></a>

### countlyModule.start(configVars)
Start Countly

**Kind**: static method of [<code>countlyModule</code>](#module_countlyModule)

**See**

- [| iOS Integration](https://resources.count.ly/docs/countly-sdk-for-ios-and-os-x#section-integration)
- [| Android Setting up Countly SDK](https://resources.count.ly/docs/countly-sdk-for-android#section-setting-up-countly-sdk)


| Param | Type | Description |
| --- | --- | --- |
| configVars | <code>object</code> | countly startup config vars |
| configVars.appKey | <code>string</code> | app key for the countly app |
| configVars.host | <code>string</code> | countly server url |
| configVars.iosDeviceID | <code>string</code> | Optional - Default: CLYIDFV Possible Values: CLYIDFV / CLYIDFA / CLYOpenUDID / yourCustomDeviceID - @see [| Using a Custom Device ID](https://resources.count.ly/v1.0/docs/countly-sdk-for-ios-and-os-x#section-using-a-custom-device-id) |
| configVars.androidDeviceID | <code>string</code> | Optional - Default: DeviceId.Type.OPEN_UDID Possible Values: DeviceId.Type.OPEN_UDID / DeviceId.Type.ADVERTISING_ID / YOUR-OWN-CUSTOM-ID - @see [| Setting up Countly SDK](https://resources.count.ly/v1.0/docs/countly-sdk-for-android#section-setting-up-countly-sdk) |
| configVars.features | <code>array</code> | Optional - Array of Features to Enable. Possible Values: CLYCrashReporting / CLYAutoViewTracking (CLYPushNotifications NOT Supported yet) @see [| iOS Additional Features](https://resources.count.ly/docs/countly-sdk-for-ios-and-os-x#section-additional-features) |
| configVars.crashSegmentation | <code>object</code> | Optional - crash segmentation key value pair object @see [| iOS Crash Reporting](https://resources.count.ly/docs/countly-sdk-for-ios-and-os-x#section-crash-reporting) @see [| Android Adding a custom key-value segment to a crash report](https://resources.count.ly/docs/countly-sdk-for-android#section-adding-a-custom-key-value-segment-to-a-crash-report) |

<a name="module_countlyModule.stop"></a>

### countlyModule.stop()
Stops Countly Tracking - ANDROID ONLY

**Kind**: static method of [<code>countlyModule</code>](#module_countlyModule)

**See**: [| Android Setting up Countly SDK](https://resources.count.ly/docs/countly-sdk-for-android#section-setting-up-countly-sdk)
<a name="module_countlyModule.resume"></a>

### countlyModule.resume()
Resume Countly Tracking - ANDROID ONLY

**Kind**: static method of [<code>countlyModule</code>](#module_countlyModule)

**See**: [| Android Setting up Countly SDK](https://resources.count.ly/docs/countly-sdk-for-android#section-setting-up-countly-sdk)
<a name="module_countlyModule.getDeviceID"></a>

### countlyModule.getDeviceID() ⇒ <code>string</code>
Returns Countly Device ID

**Kind**: static method of [<code>countlyModule</code>](#module_countlyModule)

**Returns**: <code>string</code> - current countly id for app as used on server

**See**

- [| iOS Device ID](https://resources.count.ly/docs/countly-sdk-for-ios-and-os-x#section-device-id)
- [| Android Retrieving the device id and its type](https://resources.count.ly/docs/countly-sdk-for-android#section-retrieving-the-device-id-and-its-type)

<a name="module_countlyModule.recordCrashLog"></a>

### countlyModule.recordCrashLog(crashLogVar)
Adds crash log record that will be send with the crash report

**Kind**: static method of [<code>countlyModule</code>](#module_countlyModule)

**See**

- [| iOS Crash Reporting](https://resources.count.ly/docs/countly-sdk-for-ios-and-os-x#section-crash-reporting)
- [| Android Adding breadcrumbs](https://resources.count.ly/docs/countly-sdk-for-android#section-adding-breadcrumbs)


| Param | Type | Description |
| --- | --- | --- |
| crashLogVar | <code>string</code> | crash log to store and send with crash |

<a name="module_countlyModule.recordHandledException"></a>

### countlyModule.recordHandledException(exceptionData)
Records Handled Exception

**Kind**: static method of [<code>countlyModule</code>](#module_countlyModule)

**See**

- [| iOS Manually Handled Exceptions](https://resources.count.ly/docs/countly-sdk-for-ios-and-os-x#section-manually-handled-exceptions)
- [| Android Logging handled exceptions](https://resources.count.ly/docs/countly-sdk-for-android#section-logging-handled-exceptions)


| Param | Type | Description |
| --- | --- | --- |
| exceptionData | <code>object</code> | exceptionData key value object |
| exceptionData.name | <code>string</code> | exception type |
| exceptionData.reason | <code>string</code> | exception name |
| exceptionData.userInfo | <code>object</code> | exception userInfo (extra data you want to provide) |

<a name="module_countlyModule.recordUnhandledException"></a>

### countlyModule.recordUnhandledException()
Records Unandled Exception

**Kind**: static method of [<code>countlyModule</code>](#module_countlyModule)

**Todo**

- [ ] add when Countly Adds functions to SDK

<a name="module_countlyModule.crashTest"></a>

### countlyModule.crashTest()
Crash Tests
- iOS crashes on device (even when not in production)
- Android should crash on production

**Kind**: static method of [<code>countlyModule</code>](#module_countlyModule)

**Todo**

- [ ] add android dev crash - still not sure on how to make non production android crash

<a name="module_countlyModule.recordEvent"></a>

### countlyModule.recordEvent(eventVars)
Record an Event to Countly

**Kind**: static method of [<code>countlyModule</code>](#module_countlyModule)

**See**

- [| iOS Recording Events](https://resources.count.ly/docs/countly-sdk-for-ios-and-os-x#section-recording-events)
- [| Android Setting up custom events](https://resources.count.ly/docs/countly-sdk-for-android#section-setting-up-custom-events)

**Todo**

- [ ] add duration
- [ ] add timed events https://resources.count.ly/docs/countly-sdk-for-ios-and-os-x#section-timed-events


| Param | Type | Description |
| --- | --- | --- |
| eventVars | <code>object</code> | event variable object |
| eventVars.key | <code>string</code> | event key (name) |
| eventVars.segmentation | <code>object</code> | event key value pair segmentaion object |
| eventVars.count | <code>integer</code> | event count |
| eventVars.sum | <code>double</code> | event sum |

<a name="module_countlyModule.userData"></a>

### countlyModule.userData(userVars)
Set and Send UserData to Countly

**Kind**: static method of [<code>countlyModule</code>](#module_countlyModule)

**See**

- [| iOS User Profiles](https://resources.count.ly/docs/countly-sdk-for-ios-and-os-x#section-user-profiles)
- [| Android Setting up User Profiles](https://resources.count.ly/docs/countly-sdk-for-android#section-setting-up-user-profiles)


| Param | Type | Description |
| --- | --- | --- |
| userVars | <code>object</code> | userVars valiable object |
| userVars.userData | <code>object</code> | userData - pre-defined user data object |
| userVars.customUserData | <code>object</code> | customUserData - custom user data object |

<a name="module_countlyModule.recordLocation"></a>

### countlyModule.recordLocation(locationVars)
Record User Location - GPS

**Kind**: static method of [<code>countlyModule</code>](#module_countlyModule)

**See**

- [| iOS GeoLocation](https://resources.count.ly/docs/countly-sdk-for-ios-and-os-x#section-geolocation)
- [| Android User location](https://resources.count.ly/docs/countly-sdk-for-android#section-user-location)

**Todo**

- [ ] ADD OTHER LOCATION SETTINGS LIKE CITY, COUNTRY, IP


| Param | Type | Description |
| --- | --- | --- |
| locationVars | <code>object</code> | location key value object |
| locationVars.gpsLocation | <code>object</code> | gpsLocation key value object with keys latitude and longitude |