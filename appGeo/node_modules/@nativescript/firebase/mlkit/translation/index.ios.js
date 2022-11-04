export function ensureTranslationModelDownloaded(options) {
    return new Promise((resolve, reject) => {
        _downloadTranslationModelIfNeeded(options)
            .then(() => resolve())
            .catch(reject);
    });
}
export function translateText(options) {
    return new Promise((resolve, reject) => {
        try {
            _downloadTranslationModelIfNeeded(options)
                .then(firTranslator => {
                firTranslator.translateTextCompletion(options.text, ((result, error) => {
                    error ? reject(error.localizedDescription) : resolve(result);
                }));
            })
                .catch(reject);
        }
        catch (ex) {
            console.log("Error in firebase.mlkit.translation.translateText: " + ex);
            reject(ex);
        }
    });
}
function _downloadTranslationModelIfNeeded(options) {
    return new Promise((resolve, reject) => {
        try {
            const firTranslatorOptions = FIRTranslatorOptions.alloc().initWithSourceLanguageTargetLanguage(FIRTranslateLanguageForLanguageCode(options.from), FIRTranslateLanguageForLanguageCode(options.to));
            const nl = FIRNaturalLanguage.naturalLanguage();
            const firTranslator = nl.translatorWithOptions(firTranslatorOptions);
            const firModelDownloadConditions = FIRModelDownloadConditions.alloc().initWithAllowsCellularAccessAllowsBackgroundDownloading(false, true);
            firTranslator.downloadModelIfNeededWithConditionsCompletion(firModelDownloadConditions, (error) => {
                error ? reject(error.localizedDescription) : resolve(firTranslator);
            });
        }
        catch (ex) {
            console.log("Error downloading translation model: " + ex);
            reject(ex);
        }
    });
}
//# sourceMappingURL=index.ios.js.map