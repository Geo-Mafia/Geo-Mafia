export function suggestReplies(options) {
    return new Promise((resolve, reject) => {
        try {
            const naturalLanguage = FIRNaturalLanguage.naturalLanguage();
            const smartReply = naturalLanguage.smartReply();
            const conversation = NSMutableArray.new();
            options.conversation.forEach(m => conversation.addObject(FIRTextMessage.alloc().initWithTextTimestampUserIDIsLocalUser(m.text, m.timestamp, m.userId, m.localUser)));
            smartReply.suggestRepliesForMessagesCompletion(conversation, (result, error) => {
                if (error) {
                    reject(error.localizedDescription);
                }
                else if (!result) {
                    reject("No results");
                }
                else if (result.status === 1) {
                    reject("Unsupported language");
                }
                else if (result.status === 2) {
                    reject("No reply");
                }
                else if (result.status === 0) {
                    const suggestions = [];
                    for (let i = 0; i < result.suggestions.count; i++) {
                        const s = result.suggestions.objectAtIndex(i);
                        suggestions.push(s.text);
                    }
                    resolve(suggestions);
                }
                else {
                    reject();
                }
            });
        }
        catch (ex) {
            console.log("Error in firebase.mlkit.suggestReplies: " + ex);
            reject(ex);
        }
    });
}
//# sourceMappingURL=index.ios.js.map