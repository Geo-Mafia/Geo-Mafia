export function onMessageClicked(callback) {
    const listener = new com.google.firebase.inappmessaging.FirebaseInAppMessagingClickListener({
        messageClicked: (message, action) => {
            callback({
                campaignName: message.getCampaignName()
            });
        }
    });
    com.google.firebase.inappmessaging.FirebaseInAppMessaging.getInstance().addClickListener(listener);
}
export function onMessageImpression(callback) {
    const listener = new com.google.firebase.inappmessaging.FirebaseInAppMessagingImpressionListener({
        impressionDetected: (message) => {
            callback({
                campaignName: message.getCampaignName()
            });
        }
    });
    com.google.firebase.inappmessaging.FirebaseInAppMessaging.getInstance().addImpressionListener(listener);
}
export function triggerEvent(eventName) {
    com.google.firebase.inappmessaging.FirebaseInAppMessaging.getInstance().triggerEvent(eventName);
}
//# sourceMappingURL=inappmessaging.android.js.map