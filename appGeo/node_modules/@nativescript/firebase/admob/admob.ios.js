import { Device, Enums } from "@nativescript/core";
import { firebase } from "../firebase-common";
import { AD_SIZE, BANNER_DEFAULTS, rewardedVideoCallbacks } from "./admob-common";
export { AD_SIZE };
let _bannerOptions = undefined;
let _rewardBasedVideoAdDelegate = undefined;
export function showBanner(arg) {
    return new Promise((resolve, reject) => {
        try {
            if (typeof (GADRequest) === "undefined") {
                reject("Uncomment AdMob in the plugin's Podfile first");
                return;
            }
            if (firebase.admob.adView !== null && firebase.admob.adView !== undefined) {
                firebase.admob.adView.removeFromSuperview();
                firebase.admob.adView = null;
            }
            BANNER_DEFAULTS.view = UIApplication.sharedApplication.keyWindow.rootViewController.view;
            const settings = firebase.merge(arg, BANNER_DEFAULTS);
            _bannerOptions = settings;
            const view = settings.view;
            const bannerType = _getBannerType(settings.size);
            const adWidth = bannerType.size.width === 0 ? view.frame.size.width : bannerType.size.width;
            const adHeight = bannerType.size.smartHeight ? bannerType.size.smartHeight : bannerType.size.height;
            const originX = (view.frame.size.width - adWidth) / 2;
            const originY = settings.margins.top > -1 ? settings.margins.top : (settings.margins.bottom > -1 ? view.frame.size.height - adHeight - settings.margins.bottom : 0.0);
            const origin = CGPointMake(originX, originY);
            firebase.admob.adView = GADBannerView.alloc().initWithAdSizeOrigin(bannerType, origin);
            firebase.admob.adView.adUnitID = settings.iosBannerId;
            const adRequest = GADRequest.request();
            if (settings.testing) {
                let testDevices = [];
                try {
                    testDevices.push("Simulator");
                }
                catch (ignore) {
                }
                if (settings.iosTestDeviceIds) {
                    testDevices = testDevices.concat(settings.iosTestDeviceIds);
                }
                adRequest.testDevices = testDevices;
            }
            if (settings.keywords !== undefined) {
                adRequest.keywords = settings.keywords;
            }
            firebase.admob.adView.rootViewController = UIApplication.sharedApplication.keyWindow.rootViewController;
            firebase.admob.adView.loadRequest(adRequest);
            let delegate = GADBannerViewDelegateImpl.new().initWithOptionsAndCallback(arg, (ad, error) => {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve();
                }
            }, () => {
                arg.onClosed && arg.onClosed();
                CFRelease(delegate);
                delegate = undefined;
            });
            CFRetain(delegate);
            firebase.admob.adView.delegate = delegate;
            view.addSubview(firebase.admob.adView);
        }
        catch (ex) {
            console.log("Error in firebase.admob.showBanner: " + ex);
            reject(ex);
        }
    });
}
export function preloadInterstitial(arg) {
    return new Promise((resolve, reject) => {
        try {
            if (typeof (GADRequest) === "undefined") {
                reject("Uncomment AdMob in the plugin's Podfile first");
                return;
            }
            const settings = firebase.merge(arg, BANNER_DEFAULTS);
            firebase.admob.interstitialView = GADInterstitial.alloc().initWithAdUnitID(settings.iosInterstitialId);
            let delegate = GADInterstitialDelegateImpl.new().initWithOptionsAndCallback(arg, (ad, error) => {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve();
                }
            }, () => {
                arg.onAdClosed && arg.onAdClosed();
                arg.onClosed && arg.onClosed();
                CFRelease(delegate);
                delegate = undefined;
            });
            CFRetain(delegate);
            firebase.admob.interstitialView.delegate = delegate;
            const adRequest = GADRequest.request();
            if (settings.testing) {
                let testDevices = [];
                try {
                    testDevices.push("Simulator");
                }
                catch (ignore) {
                }
                if (settings.iosTestDeviceIds) {
                    testDevices = testDevices.concat(settings.iosTestDeviceIds);
                }
                adRequest.testDevices = testDevices;
            }
            firebase.admob.interstitialView.loadRequest(adRequest);
        }
        catch (ex) {
            console.log("Error in firebase.admob.preloadInterstitial: " + ex);
            reject(ex);
        }
    });
}
export function showInterstitial(arg) {
    return new Promise((resolve, reject) => {
        try {
            if (typeof (GADRequest) === "undefined") {
                reject("Uncomment AdMob in the plugin's Podfile first");
                return;
            }
            if (!arg) {
                if (firebase.admob.interstitialView) {
                    firebase.admob.interstitialView.presentFromRootViewController(UIApplication.sharedApplication.keyWindow.rootViewController);
                    resolve();
                }
                else {
                    reject("Please call 'preloadInterstitial' first");
                }
                return;
            }
            const settings = firebase.merge(arg, BANNER_DEFAULTS);
            firebase.admob.interstitialView = GADInterstitial.alloc().initWithAdUnitID(settings.iosInterstitialId);
            let delegate = GADInterstitialDelegateImpl.new().initWithOptionsAndCallback(arg, (ad, error) => {
                if (error) {
                    reject(error.localizedDescription);
                }
                else {
                    firebase.admob.interstitialView.presentFromRootViewController(UIApplication.sharedApplication.keyWindow.rootViewController);
                    resolve();
                }
                CFRelease(delegate);
                delegate = undefined;
            }, () => console.log("Ad closed"));
            CFRetain(delegate);
            firebase.admob.interstitialView.delegate = delegate;
            const adRequest = GADRequest.request();
            if (settings.testing) {
                let testDevices = [];
                try {
                    testDevices.push("Simulator");
                }
                catch (ignore) {
                }
                if (settings.iosTestDeviceIds) {
                    testDevices = testDevices.concat(settings.iosTestDeviceIds);
                }
                adRequest.testDevices = testDevices;
            }
            firebase.admob.interstitialView.loadRequest(adRequest);
        }
        catch (ex) {
            console.log("Error in firebase.admob.showInterstitial: " + ex);
            reject(ex);
        }
    });
}
export function preloadRewardedVideoAd(arg) {
    return new Promise((resolve, reject) => {
        try {
            if (typeof (GADRequest) === "undefined") {
                reject("Enable AdMob first - see the plugin documentation");
                return;
            }
            const onLoaded = () => resolve();
            const onError = err => reject(err);
            _rewardBasedVideoAdDelegate = GADRewardBasedVideoAdDelegateImpl.new().initWithCallback(onLoaded, onError);
            CFRetain(_rewardBasedVideoAdDelegate);
            firebase.admob.rewardedAdVideoView = GADRewardBasedVideoAd.sharedInstance();
            firebase.admob.rewardedAdVideoView.delegate = _rewardBasedVideoAdDelegate;
            const settings = firebase.merge(arg, BANNER_DEFAULTS);
            const adRequest = GADRequest.request();
            if (settings.testing) {
                let testDevices = [];
                try {
                    testDevices.push("Simulator");
                }
                catch (ignore) {
                }
                if (settings.iosTestDeviceIds) {
                    testDevices = testDevices.concat(settings.iosTestDeviceIds);
                }
                adRequest.testDevices = testDevices;
            }
            firebase.admob.rewardedAdVideoView.loadRequestWithAdUnitID(adRequest, settings.iosAdPlacementId);
        }
        catch (ex) {
            console.log("Error in firebase.admob.preloadRewardedVideoAd: " + ex);
            reject(ex);
        }
    });
}
export function showRewardedVideoAd(arg) {
    return new Promise((resolve, reject) => {
        try {
            if (typeof (GADRequest) === "undefined") {
                reject("Enable AdMob first - see the plugin documentation");
                return;
            }
            if (!firebase.admob.rewardedAdVideoView) {
                reject("Please call 'preloadRewardedVideoAd' first");
                return;
            }
            if (arg.onRewarded) {
                rewardedVideoCallbacks.onRewarded = arg.onRewarded;
            }
            if (arg.onLeftApplication) {
                rewardedVideoCallbacks.onLeftApplication = arg.onLeftApplication;
            }
            if (arg.onClosed) {
                rewardedVideoCallbacks.onClosed = arg.onClosed;
            }
            if (arg.onOpened) {
                rewardedVideoCallbacks.onOpened = arg.onOpened;
            }
            if (arg.onStarted) {
                rewardedVideoCallbacks.onStarted = arg.onStarted;
            }
            if (arg.onCompleted) {
                rewardedVideoCallbacks.onCompleted = arg.onCompleted;
            }
            firebase.admob.rewardedAdVideoView.presentFromRootViewController(UIApplication.sharedApplication.keyWindow.rootViewController);
            resolve();
        }
        catch (ex) {
            console.log("Error in firebase.admob.showRewardedVideoAd: " + ex);
            reject(ex);
        }
    });
}
export function hideBanner() {
    return new Promise((resolve, reject) => {
        try {
            if (firebase.admob.adView !== null) {
                firebase.admob.adView.removeFromSuperview();
                firebase.admob.adView = null;
            }
            resolve();
        }
        catch (ex) {
            console.log("Error in firebase.admob.hideBanner: " + ex);
            reject(ex);
        }
    });
}
function _getBannerType(size) {
    if (size === AD_SIZE.BANNER) {
        return { "size": { "width": 320, "height": 50 }, "flags": 0 };
    }
    else if (size === AD_SIZE.LARGE_BANNER) {
        return { "size": { "width": 320, "height": 100 }, "flags": 0 };
    }
    else if (size === AD_SIZE.MEDIUM_RECTANGLE) {
        return { "size": { "width": 300, "height": 250 }, "flags": 0 };
    }
    else if (size === AD_SIZE.FULL_BANNER) {
        return { "size": { "width": 468, "height": 60 }, "flags": 0 };
    }
    else if (size === AD_SIZE.LEADERBOARD) {
        return { "size": { "width": 728, "height": 90 }, "flags": 0 };
    }
    else if (size === AD_SIZE.SKYSCRAPER) {
        return { "size": { "width": 120, "height": 600 }, "flags": 0 };
    }
    else if (size === AD_SIZE.SMART_BANNER || size === AD_SIZE.FLUID) {
        const orientation = UIDevice.currentDevice.orientation;
        const isIPad = Device.deviceType === Enums.DeviceType.Tablet;
        if (orientation === 1 || orientation === 2) {
            return { "size": { "width": 0, "height": 0, "smartHeight": isIPad ? 90 : 50 }, "flags": 18 };
        }
        else {
            return { "size": { "width": 0, "height": 0, "smartHeight": isIPad ? 90 : 32 }, "flags": 26 };
        }
    }
    else {
        return { "size": { "width": -1, "height": -1 }, "flags": 0 };
    }
}
var GADInterstitialDelegateImpl = /** @class */ (function (_super) {
    __extends(GADInterstitialDelegateImpl, _super);
    function GADInterstitialDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GADInterstitialDelegateImpl.new = function () {
        if (GADInterstitialDelegateImpl.ObjCProtocols.length === 0 && typeof (GADInterstitialDelegate) !== "undefined") {
            GADInterstitialDelegateImpl.ObjCProtocols.push(GADInterstitialDelegate);
        }
        return _super.new.call(this);
    };
    GADInterstitialDelegateImpl.prototype.initWithOptionsAndCallback = function (options, callback, onAdCloseCallback) {
        if (onAdCloseCallback === void 0) { onAdCloseCallback = null; }
        this.options = options;
        this.callback = callback;
        this.onAdCloseCallback = onAdCloseCallback;
        return this;
    };
    GADInterstitialDelegateImpl.prototype.interstitialDidReceiveAd = function (ad) {
        this.callback(ad);
    };
    GADInterstitialDelegateImpl.prototype.interstitialDidDismissScreen = function (ad) {
        this.onAdCloseCallback();
    };
    GADInterstitialDelegateImpl.prototype.interstitialDidFailToReceiveAdWithError = function (ad, error) {
        this.callback(ad, error);
    };
    GADInterstitialDelegateImpl.prototype.interstitialWillLeaveApplication = function (ad) {
        this.options.onLeftApplication && this.options.onLeftApplication();
    };
    GADInterstitialDelegateImpl.ObjCProtocols = [];
    return GADInterstitialDelegateImpl;
}(NSObject));
var GADBannerViewDelegateImpl = /** @class */ (function (_super) {
    __extends(GADBannerViewDelegateImpl, _super);
    function GADBannerViewDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GADBannerViewDelegateImpl.new = function () {
        if (GADBannerViewDelegateImpl.ObjCProtocols.length === 0 && typeof (GADBannerViewDelegate) !== "undefined") {
            GADBannerViewDelegateImpl.ObjCProtocols.push(GADBannerViewDelegate);
        }
        return _super.new.call(this);
    };
    GADBannerViewDelegateImpl.prototype.initWithOptionsAndCallback = function (options, callback, onAdCloseCallback) {
        if (onAdCloseCallback === void 0) { onAdCloseCallback = null; }
        this.options = options;
        this.callback = callback;
        this.onAdCloseCallback = onAdCloseCallback;
        return this;
    };
    GADBannerViewDelegateImpl.prototype.adViewDidReceiveAd = function (bannerView) {
        this.callback(bannerView, null);
    };
    GADBannerViewDelegateImpl.prototype.adViewDidFailToReceiveAdWithError = function (bannerView, error) {
        this.callback(bannerView, error);
    };
    GADBannerViewDelegateImpl.prototype.adViewDidDismissScreen = function (bannerView) {
        this.onAdCloseCallback();
    };
    GADBannerViewDelegateImpl.prototype.adViewWillLeaveApplication = function (bannerView) {
        this.options.onLeftApplication && this.options.onLeftApplication();
    };
    GADBannerViewDelegateImpl.ObjCProtocols = [];
    return GADBannerViewDelegateImpl;
}(NSObject));
var GADRewardBasedVideoAdDelegateImpl = /** @class */ (function (_super) {
    __extends(GADRewardBasedVideoAdDelegateImpl, _super);
    function GADRewardBasedVideoAdDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GADRewardBasedVideoAdDelegateImpl.new = function () {
        if (GADRewardBasedVideoAdDelegateImpl.ObjCProtocols.length === 0 && typeof (GADRewardBasedVideoAdDelegate) !== "undefined") {
            GADRewardBasedVideoAdDelegateImpl.ObjCProtocols.push(GADRewardBasedVideoAdDelegate);
        }
        return _super.new.call(this);
    };
    GADRewardBasedVideoAdDelegateImpl.prototype.initWithCallback = function (loaded, error) {
        this._loaded = loaded;
        this._error = error;
        return this;
    };
    GADRewardBasedVideoAdDelegateImpl.prototype.rewardBasedVideoAdDidClose = function (rewardBasedVideoAd) {
        firebase.admob.rewardedAdVideoView = undefined;
        rewardedVideoCallbacks.onClosed();
        setTimeout(function () {
            CFRelease(_rewardBasedVideoAdDelegate);
            _rewardBasedVideoAdDelegate = undefined;
        });
    };
    GADRewardBasedVideoAdDelegateImpl.prototype.rewardBasedVideoAdDidCompletePlaying = function (rewardBasedVideoAd) {
        rewardedVideoCallbacks.onCompleted();
    };
    GADRewardBasedVideoAdDelegateImpl.prototype.rewardBasedVideoAdDidFailToLoadWithError = function (rewardBasedVideoAd, error) {
        this._error(error.localizedDescription);
    };
    GADRewardBasedVideoAdDelegateImpl.prototype.rewardBasedVideoAdDidOpen = function (rewardBasedVideoAd) {
        rewardedVideoCallbacks.onOpened();
    };
    GADRewardBasedVideoAdDelegateImpl.prototype.rewardBasedVideoAdDidReceiveAd = function (rewardBasedVideoAd) {
        this._loaded();
    };
    GADRewardBasedVideoAdDelegateImpl.prototype.rewardBasedVideoAdDidRewardUserWithReward = function (rewardBasedVideoAd, reward) {
        rewardedVideoCallbacks.onRewarded({
            amount: reward.amount ? reward.amount.doubleValue : undefined,
            type: reward.type
        });
    };
    GADRewardBasedVideoAdDelegateImpl.prototype.rewardBasedVideoAdDidStartPlaying = function (rewardBasedVideoAd) {
        rewardedVideoCallbacks.onStarted();
    };
    GADRewardBasedVideoAdDelegateImpl.prototype.rewardBasedVideoAdWillLeaveApplication = function (rewardBasedVideoAd) {
        rewardedVideoCallbacks.onLeftApplication();
    };
    GADRewardBasedVideoAdDelegateImpl.ObjCProtocols = [];
    return GADRewardBasedVideoAdDelegateImpl;
}(NSObject));
//# sourceMappingURL=admob.ios.js.map