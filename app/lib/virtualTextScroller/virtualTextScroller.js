/**
 * virtualScroller
 * - build a scrollableView with html views that reload as the users scrolls
 *
 * Alloy.Globals:
 * - {@link Alloy.Globals.backgroundColor Alloy.Globals.backgroundColor}
 * - {@link Alloy.Globals.languageDirection Alloy.Globals.languageDirection}
 *
 * @module virtualScroller 
 * 
 * @example    <caption>Require and run virtualScroller with getView to build the scroller</caption>
 * 
 *  // Include the virtualScroller module in app/lib/virtualScroller/virtualScroller.js
    var virtualScrollerModule = require('virtualScroller/virtualScroller');
    
    // Set virtualscroller as virtualScrollerModule with Webview
    var virtualScroller = virtualScrollerModule({
        getView: function(i) {

            //Define webview creation
            var web_view = Ti.UI.createWebView({
                    html: html,                             
                    scalesPageToFit : false, 
                    enableZoomControls : false,
                    chapterID: currentLoopChapterID,
                    borderRadius: 0.1,
                    backgroundColor: "#F1EECD",
                    hideLoadIndicator: true,
                    loadValue: "start",
                });     

            scrollerDirectionChange: function(directionData) {
            var directionChange = directionData.direction;
            // Set Next Chapter Actions
            if (directionChange == "next"){
                changeButton("next");
                chapterOpenedFunction(directionData);   
            }
            // Set Prev Chapter Actions
            else if (directionChange == "prev") {           
                changeButton("prev");
                chapterOpenedFunction(directionData);
            }   
        },  
        start: startChapterID,
        itemCount: totalChapterAmount,
    });

    // set virtualScrollerScrollText
    var virtualScrollerScrollText = virtualScrollerModule.view;
    
 * 
 *  
 */

/**
 * Builds the virtualScroller and function
 *
 * @param      {object}         options                                 The options for building the scroller
 * @param      {integer}        options.start                           start index integer
 * @param      {integer}        options.itemCount                       total item count integer
 * @param      {function}       options.getView                         function that builds the views inside the scrollable view
 * @param      {callback}       options.scrollerDirectionCallback       callback function that fires after scroller scrolled
 * 
 * @return     {object}         - returns the object with view as the scrollable and dispose as the dispose function  
 */
function virtualScroller(options) {

    // set default vars
    var startIndex = parseInt(options.start, 10) || 0;           // start index number
    var itemCount = parseInt(options.itemCount) || 5;       // itemCount total number of views
    var getView = options.getView;
    var scrollerDirectionCallback = options.scrollerDirectionChange;

    // set initial index vars
    var lastVirtualIndex = itemCount - 1;
    var currentVirtualIndex = startIndex;
    
    // START FUNCTION - to load the view with the specified virtual index into the specified container, replacing all existing views in the container
    function loadView(container, passedVIndex) {
        
        // empty container of old view
        emptyView(container);

        // set container vIndex as vIndex passed
        container.vIndex = passedVIndex;

        // create new view
        var newView = getView(passedVIndex);

        // container add newView
        container.add(newView);

    };
    // END FUNCTION - to load the view with the specified virtual index into the specified container, replacing all existing views in the container
    
    // create scrollable
    var scrollable = Ti.UI.createScrollableView({
        showPagingControl: false,
        cacheSize: 7,
    });

    // create containers views
    var containers = [];
    
    // START LOOP - create views
    for (var i = 0; i < 5; i++) {
        
        // create containerView
        var containerView = Ti.UI.createView({
            backgroundColor: Alloy.Globals.backgroundColor,
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        });

        // push containerView to containers
        containers.push(containerView);

    };
    // END LOOP - create views

    // set scrollable views as containers
    scrollable.views = containers;

    // set scrollable currentPage
    scrollable.currentPage = getPageFromIndex(startIndex, lastVirtualIndex);

    // set initialState
    var initialState = [];

    // DUE TO HOW ARRAYS WORK I DONT THING THERE IS AN EASIER WAY TO DO LTR AND RTL
    // START IF - build initialState array according to what start index we are in regards to itemCount
    if (startIndex <= 2) {

        // START IF - LTR or RTL - Page 0, 1, or 2 is active
        if(Alloy.Globals.languageDirection == 'ltr'){          
            initialState = [0, 1, 2, 3, 4];
        }else{
            // Page 0, 1, or 2 is active
            initialState = [4, 3, 2, 1, 0];
        };
        // END IF - LTR or RTL - Page 0, 1, or 2 is active

    } else if (startIndex == lastVirtualIndex - 1) {
        
        // START IF - LTR or RTL - Second Last element active
        if(Alloy.Globals.languageDirection == 'ltr'){          
            initialState = [startIndex - 3, startIndex - 2, startIndex - 1, startIndex, startIndex + 1];
        }else{        
            initialState = [startIndex + 1, startIndex, startIndex - 1, startIndex - 2, startIndex - 3];
        };
        // END IF - LTR or RTL - Second Last element active

    } else if (startIndex == lastVirtualIndex) {
        
        // START IF - LTR or RTL - Last element active
        if(Alloy.Globals.languageDirection == 'ltr'){          
            initialState = [startIndex - 4, startIndex - 3, startIndex - 2, startIndex - 1, startIndex];
        }else{        
            initialState = [startIndex, startIndex - 1, startIndex - 2, startIndex - 3, startIndex - 4];
        }; 
        // END IF - LTR or RTL - Last element active
        
    } else {
        
        // START IF - LTR or RTL - Somewhere in the middle is active
        if(Alloy.Globals.languageDirection == 'ltr'){          
            initialState = [startIndex - 2, startIndex - 1, startIndex, startIndex + 1, startIndex + 2];
        }else{        
            initialState = [startIndex + 2, startIndex + 1, startIndex, startIndex - 1, startIndex - 2];
        }; 
        // END IF - LTR or RTL - Somewhere in the middle is active
        
    };
    // END IF - build initialState array according to what start index we are in regards to itemCount

    // START LOOP = loadView into containers 
    for (var j = 0; j < 5; j++) {
        
        // run loadView with container and initialState value
        loadView(containers[j], initialState[j]);

    };
    // END LOOP = loadView into containers 

    // clear initialState as we are done with it
    initialState = null;

    // The virtual index of the last page that was active
    var previousVirtualIndex = currentVirtualIndex;
    
    // START FUNCTION - scrollEndListener
    function scrollEndListener(e) {
        
        // set currentPage
        var currentPage = e.currentPage;    
                                
        // disable scrollable scrolling
        scrollable.scrollingEnabled = false;
        
        // set currentVirtualIndex        
        currentVirtualIndex = containers[currentPage].vIndex;

        // Determine scroll direction
        var nextPrev;

        // START IF - if moved set nextPrev as 'prev' or 'next else return
        if (previousVirtualIndex > currentVirtualIndex) {           
            // prev page
            nextPrev = 'prev';      
        }else if(previousVirtualIndex < currentVirtualIndex) {         
            // next page
            nextPrev = 'next';
        }else{
            // DID NOT MOVE - enable scrolling and return    
            scrollable.scrollingEnabled = true;
            return;
        };
        // END IF - if moved set nextPrev as 'prev' or 'next else return

        // set chapterID to return
        var chapterID = scrollable.views[currentPage].children[0].chapterID;     
        
        // run scrollerDirectionCallback
        scrollerDirectionCallback({
            direction: nextPrev,
            chapterID: chapterID, 
        });         
        
        // What page will the scrollable need to be on?
        var targetPage = getPageFromIndex(currentVirtualIndex, lastVirtualIndex);
        
        // Do we need to move any pages around?
        if (targetPage !== currentPage) {
            
            // DUE TO HOW ARRAYS WORK I DONT THING THERE IS AN EASIER WAY TO DO LTR AND RTL
            // START IF - manipulate containers according to Alloy.Globals.languageDirection and nextPrev   
            if(Alloy.Globals.languageDirection == 'ltr'){
                
                if(nextPrev == 'next'){

                    // Shift a view off the beginning of the collection and move it to the end
                    containers.push(containers.shift());
                    // Update virtual index and load new view
                    containers[4].vIndex = containers[3].vIndex + 1;
                    loadView(containers[4], containers[4].vIndex);

                }else{

                     // Pop a view off the end of the collection and move it to the front
                    containers.unshift(containers.pop());
                    // Update virtual index and load new view
                    containers[0].vIndex = containers[1].vIndex - 1;
                    loadView(containers[0], containers[0].vIndex);

                };

            }else{
                
                if (nextPrev == 'next') {
                    
                    // Pop a view off the end of the collection and move it to the front
                    containers.unshift(containers.pop());
                    // Update virtual index and load new view
                    containers[0].vIndex = containers[1].vIndex + 1;
                    loadView(containers[0], containers[0].vIndex);

                } else {
                    
                    // Shift a view off the beginning of the collection and move it to the end
                    containers.push(containers.shift());
                    // Update virtual index and load new view
                    containers[4].vIndex = containers[3].vIndex - 1;
                    loadView(containers[4], containers[4].vIndex);

                };

            };
            // END IF - manipulate containers according to Alloy.Globals.languageDirection and nextPrev

        };      
        
        // Set previousVirtualIndex to currentVirtualIndex
        previousVirtualIndex = currentVirtualIndex;  
        
        // set newOldPageArrayIndex
        var oldPageArrayIndex = getOldPageArrayIndex(nextPrev,currentPage) 

        // get oldHTML
        var oldHTML = scrollable.views[oldPageArrayIndex].children[0].html;
       
        // addEventListener to old page (left or right of current page)
        scrollable.views[oldPageArrayIndex].children[0].addEventListener('load', afterLoadEvent);
        
        // set html old page (left or right of current page) to html of current page
        scrollable.views[oldPageArrayIndex].children[0].html =  scrollable.views[currentPage].children[0].html; 
            
        // START FUNCTION - to run after old page content has loaded    
        function afterLoadEvent(){
            
            // removeEventListener from old page (left or right of current page) 
            scrollable.views[oldPageArrayIndex].children[0].removeEventListener('load', afterLoadEvent);

            // START - TIMEOUT - before we change old page html back and enable scrolling
            setTimeout(function(){          
                
                 // set scrollable currentPage and views
                scrollable.currentPage = targetPage;
                scrollable.views = containers;

                // set newOldPageArrayIndex
                var newOldPageArrayIndex = getOldPageArrayIndex(nextPrev,targetPage);  
                
                // set html of old page (left or right of current page) back to oldHTML - correct content
                scrollable.views[newOldPageArrayIndex].children[0].html = oldHTML;
            
                // enable scrolling
                scrollable.scrollingEnabled = true; 
             

            }, 1000); 
            // END - TIMEOUT - before we change old page html back and enable scrolling
            
        };       
        // START FUNCTION - to run after old page content has loaded
        
    };
    // END FUNCTION - scrollEndListener

    // addEventListener scrollend to scrollable
    scrollable.addEventListener("scrollend", scrollEndListener);    

    this.view = scrollable;

    this.dispose = function () {
        for (var i = 0; i < 5; i++) {
            scrollable.remove(containers[i]);
            emptyView(containers[i]);
            containers[i] = null;
        }
        containers = null;
        scrollable.removeEventListener("scrollend", scrollEndListener);
        scrollable = null;
    };

    return this;
};

module.exports = virtualScroller;

/**
 * Gets the old page array index.
 *
 * @param      {string}     nextPrev     next / previous
 * @param      {integer}    currentPage  The current page
 * 
 * @return     {integer}    The old page array index.
 */
function getOldPageArrayIndex(nextPrev,currentPage){

    // set oldPageArrayIndex
    var oldPageArrayIndex;

    // START IF - Alloy.Globals.languageDirection and nextPrev
    if(Alloy.Globals.languageDirection == 'ltr'){

        // START - nextPrev
        if (nextPrev == 'next') {
            oldPageArrayIndex = currentPage-1;
        }else {         
            oldPageArrayIndex = currentPage+1;    
        };
        // START - nextPrev

    }else{

        // START - nextPrev
        if (nextPrev == 'next') {
            oldPageArrayIndex = currentPage+1;
        }else {         
            oldPageArrayIndex = currentPage-1;    
        };
        // START - nextPrev

    };
    // END IF - Alloy.Globals.languageDirection and nextPrev
      
    // return oldPageArrayIndex
    return oldPageArrayIndex;

}

/**
 * emptryView function - to remove and clean out the old view
 *
 * @param      {Ti.UI.View}  container  The container
 */
function emptyView(container) {
    // Empty out any children
    if (container.children) {
        for (var c = container.children.length - 1; c >= 0; c--) {
            container.children[c] = null;
            container.remove(container.children[c]);
        };
    };
};

/**
 * Gets the page from index.
 *
 * @param      {integer}  vIndex  The vIndex
 * 
 * @return     {integer}  The page from index.
 */
function getPageFromIndex(vIndex, lastVirtualIndex) {
    
    // START IF - First two pages
    if (vIndex == 0) {
        if(Alloy.Globals.languageDirection == 'ltr'){
            return 0;
        }else{
            return 4;
        };
    } else if (vIndex == 1){
        if(Alloy.Globals.languageDirection == 'ltr'){
            return 1;           
        }else{
            return 3;           
        };          
    };
    // END IF - First two pages

    // START IF - Last two pages
    if (vIndex === lastVirtualIndex) {
        if(Alloy.Globals.languageDirection == 'ltr'){
            return 4;
        }else{
            return 0;
        };
    } else if (vIndex === lastVirtualIndex - 1) {
        if(Alloy.Globals.languageDirection == 'ltr'){
            return 3;
        }else{
            return 1;
        };
    };
    // END IF - Last two pages

    // Somewhere in the middle
    return 2;

};