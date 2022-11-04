export function identifyNaturalLanguage(options) {
    return new Promise((resolve, reject) => {
        try {
            if (!options.text) {
                reject("'text' property not set to a valid value");
                return;
            }
            const naturalLanguage = FIRNaturalLanguage.naturalLanguage();
            const languageId = naturalLanguage.languageIdentificationWithOptions(FIRLanguageIdentificationOptions.alloc().initWithConfidenceThreshold(options.confidenceThreshold || 0.5));
            languageId.identifyLanguageForTextCompletion(options.text, (languageCode, error) => {
                if (error !== null) {
                    console.log("Failed with error: " + error.localizedDescription);
                    reject(error.localizedDescription);
                }
                else if (languageCode !== null && languageCode !== "und") {
                    console.log("Identified language: " + languageCode);
                    resolve({ languageCode });
                }
                else {
                    console.log("No language was identified");
                    resolve();
                }
            });
        }
        catch (ex) {
            console.log("Error in firebase.mlkit.identifyNaturalLanguage: " + ex);
            reject(ex);
        }
    });
}
export function indentifyPossibleLanguages(options) {
    return new Promise((resolve, reject) => {
        try {
            const naturalLanguage = FIRNaturalLanguage.naturalLanguage();
            const languageId = naturalLanguage.languageIdentificationWithOptions(FIRLanguageIdentificationOptions.alloc().initWithConfidenceThreshold(options.confidenceThreshold || 0.01));
            languageId.identifyPossibleLanguagesForTextCompletion(options.text, (languages, error) => {
                if (error !== null) {
                    console.log("Failed with error: " + error.localizedDescription);
                    reject(error.localizedDescription);
                }
                else if (languages.count === 1 && languages.objectAtIndex(0).languageCode === "und") {
                    console.log("No language was identified");
                    resolve([]);
                }
                else {
                    const langs = [];
                    for (let i = 0; i < languages.count; i++) {
                        const l = languages.objectAtIndex(i);
                        langs.push({
                            languageCode: l.languageCode,
                            confidence: l.confidence
                        });
                    }
                    resolve(langs);
                }
            });
        }
        catch (ex) {
            console.log("Error in firebase.mlkit.indentifyPossibleLanguages: " + ex);
            reject(ex);
        }
    });
}
//# sourceMappingURL=index.ios.js.map