/**
 * reviewDialog Module
 * Hyperloop Module iOS review dialog
 * @see {@link https://github.com/hansemannn/titanium-review-dialog | Original Titanium-review-dialog} 
 * 
 * @module reviewDialog 
 * 
 * @example    <caption>Require and run an exported function to show</caption> 
 *  // require reviewDialog
	var Review = require('reviewDialog/reviewDialog');
	
	if (Review.isSupported()) {
		Review.requestReview();
	};
 * 
 */
 
var SKStoreReviewController = require('StoreKit/SKStoreReviewController');
var UIDevice = require('UIKit/UIDevice');
var NSNumericSearch = require('Foundation').NSNumericSearch;
var NSOrderedAscending = require('Foundation').NSOrderedAscending;

exports.isSupported = function() {
    return UIDevice.currentDevice.systemVersion.compareOptions('10.3', NSNumericSearch) != NSOrderedAscending;
};

exports.requestReview = function() {
    SKStoreReviewController.requestReview();
};