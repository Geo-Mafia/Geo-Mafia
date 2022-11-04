export function suggestReplies(options) {
    return new Promise((resolve, reject) => {
        try {
            const conversation = new java.util.ArrayList();
            options.conversation.forEach(m => {
                if (m.localUser) {
                    conversation.add(com.google.firebase.ml.naturallanguage.smartreply.FirebaseTextMessage.createForLocalUser(m.text, m.timestamp));
                }
                else {
                    conversation.add(com.google.firebase.ml.naturallanguage.smartreply.FirebaseTextMessage.createForRemoteUser(m.text, m.timestamp, m.userId));
                }
            });
            const smartReply = com.google.firebase.ml.naturallanguage.FirebaseNaturalLanguage.getInstance().getSmartReply();
            smartReply.suggestReplies(conversation)
                .addOnSuccessListener(new com.google.android.gms.tasks.OnSuccessListener({
                onSuccess: (result) => {
                    if (result.getStatus() == com.google.firebase.ml.naturallanguage.smartreply.SmartReplySuggestionResult.STATUS_NOT_SUPPORTED_LANGUAGE) {
                        reject("Unsupported language");
                    }
                    else if (result.getStatus() == com.google.firebase.ml.naturallanguage.smartreply.SmartReplySuggestionResult.STATUS_NO_REPLY) {
                        reject("No reply");
                    }
                    else if (result.getStatus() == com.google.firebase.ml.naturallanguage.smartreply.SmartReplySuggestionResult.STATUS_SUCCESS) {
                        const suggestions = [];
                        for (let i = 0; i < result.getSuggestions().size(); i++) {
                            const s = result.getSuggestions().get(i);
                            suggestions.push(s.getText());
                        }
                        resolve(suggestions);
                    }
                    else {
                        reject();
                    }
                }
            }))
                .addOnFailureListener(new com.google.android.gms.tasks.OnFailureListener({
                onFailure: exception => reject(exception.getMessage())
            }));
        }
        catch (ex) {
            console.log("Error in firebase.mlkit.suggestReplies: " + ex);
            reject(ex);
        }
    });
}
//# sourceMappingURL=index.android.js.map