export function identifyNaturalLanguage(options) {
    return new Promise((resolve, reject) => {
        try {
            if (!options.text) {
                reject("'text' property not set to a valid value");
                return;
            }
            const languageIdentifier = com.google.firebase.ml.naturallanguage.FirebaseNaturalLanguage.getInstance().getLanguageIdentification(new com.google.firebase.ml.naturallanguage.languageid.FirebaseLanguageIdentificationOptions.Builder()
                .setConfidenceThreshold(options.confidenceThreshold || 0.5)
                .build());
            languageIdentifier.identifyLanguage(options.text)
                .addOnSuccessListener(new com.google.android.gms.tasks.OnSuccessListener({
                onSuccess: languageCode => {
                    if (languageCode && languageCode !== "und") {
                        resolve({ languageCode });
                    }
                    else {
                        resolve();
                    }
                }
            }))
                .addOnFailureListener(new com.google.android.gms.tasks.OnFailureListener({
                onFailure: exception => reject(exception.getMessage())
            }));
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
            const languageIdentifier = com.google.firebase.ml.naturallanguage.FirebaseNaturalLanguage.getInstance().getLanguageIdentification(new com.google.firebase.ml.naturallanguage.languageid.FirebaseLanguageIdentificationOptions.Builder()
                .setConfidenceThreshold(options.confidenceThreshold || 0.01)
                .build());
            languageIdentifier.identifyPossibleLanguages(options.text)
                .addOnSuccessListener(new com.google.android.gms.tasks.OnSuccessListener({
                onSuccess: languages => {
                    const langs = [];
                    if (languages && languages.get(0).getLanguageCode() !== "und") {
                        for (let i = 0; i < languages.size(); i++) {
                            const l = languages.get(i);
                            langs.push({
                                languageCode: l.getLanguageCode(),
                                confidence: l.getConfidence()
                            });
                        }
                    }
                    resolve(langs);
                }
            }))
                .addOnFailureListener(new com.google.android.gms.tasks.OnFailureListener({
                onFailure: exception => reject(exception.getMessage())
            }));
        }
        catch (ex) {
            console.log("Error in firebase.mlkit.indentifyPossibleLanguages: " + ex);
            reject(ex);
        }
    });
}
//# sourceMappingURL=index.android.js.map