let _firInAppMessagingDisplayDelegate;
export function onMessageClicked(callback) {
    ensureDelegate();
    _firInAppMessagingDisplayDelegate.setOnMessageClickedCallback(callback);
}
export function onMessageImpression(callback) {
    ensureDelegate();
    _firInAppMessagingDisplayDelegate.setOnMessageImpressionCallback(callback);
}
export function triggerEvent(eventName) {
    FIRInAppMessaging.inAppMessaging().triggerEvent(eventName);
}
function ensureDelegate() {
    if (!_firInAppMessagingDisplayDelegate) {
        FIRInAppMessaging.inAppMessaging().delegate = _firInAppMessagingDisplayDelegate = FIRInAppMessagingDisplayDelegateImpl.new();
    }
}
var FIRInAppMessagingDisplayDelegateImpl = /** @class */ (function (_super) {
    __extends(FIRInAppMessagingDisplayDelegateImpl, _super);
    function FIRInAppMessagingDisplayDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FIRInAppMessagingDisplayDelegateImpl.new = function () {
        if (FIRInAppMessagingDisplayDelegateImpl.ObjCProtocols.length === 0 && typeof (FIRInAppMessagingDisplayDelegate) !== "undefined") {
            FIRInAppMessagingDisplayDelegateImpl.ObjCProtocols.push(FIRInAppMessagingDisplayDelegate);
        }
        return _super.new.call(this);
    };
    FIRInAppMessagingDisplayDelegateImpl.prototype.setOnMessageClickedCallback = function (callback) {
        this.onMessageClickedCallback = callback;
    };
    FIRInAppMessagingDisplayDelegateImpl.prototype.setOnMessageImpressionCallback = function (callback) {
        this.onMessageImpressionCallback = callback;
    };
    FIRInAppMessagingDisplayDelegateImpl.prototype.displayErrorForMessageError = function (inAppMessage, error) {
        console.log("InAppMessaging error: " + error.localizedDescription);
    };
    FIRInAppMessagingDisplayDelegateImpl.prototype.impressionDetectedForMessage = function (inAppMessage) {
        console.log("InAppMessaging impression");
        this.onMessageImpressionCallback && this.onMessageImpressionCallback({
            campaignName: inAppMessage.campaignInfo.campaignName
        });
    };
    FIRInAppMessagingDisplayDelegateImpl.prototype.messageClicked = function (inAppMessage) {
        console.log("InAppMessaging clicked");
        this.onMessageClickedCallback && this.onMessageClickedCallback({
            campaignName: inAppMessage.campaignInfo.campaignName
        });
    };
    FIRInAppMessagingDisplayDelegateImpl.prototype.messageClickedWithAction = function (inAppMessage, action) {
        console.log("InAppMessaging clicked with action, text: " + action.actionText + ", url: " + action.actionURL);
        this.onMessageClickedCallback && this.onMessageClickedCallback({
            campaignName: inAppMessage.campaignInfo.campaignName,
            actionText: action.actionText,
            actionURL: action.actionURL.absoluteString
        });
    };
    FIRInAppMessagingDisplayDelegateImpl.prototype.messageDismissedDismissType = function (inAppMessage, dismissType) {
        console.log("InAppMessaging dismissed");
    };
    FIRInAppMessagingDisplayDelegateImpl.ObjCProtocols = [];
    return FIRInAppMessagingDisplayDelegateImpl;
}(NSObject));
//# sourceMappingURL=inappmessaging.ios.js.map