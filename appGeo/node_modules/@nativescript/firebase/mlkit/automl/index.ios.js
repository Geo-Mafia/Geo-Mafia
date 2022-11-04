import { ImageSource } from "@nativescript/core";
import { MLKitAutoML as MLKitAutoMLBase } from "./automl-common";
export class MLKitAutoML extends MLKitAutoMLBase {
    createDetector() {
        return getDetector(this.localModelResourceFolder, this.confidenceThreshold);
    }
    createSuccessListener() {
        return (labels, error) => {
            if (error !== null) {
                console.log(error.localizedDescription);
            }
            else if (labels !== null && labels.count > 0) {
                const result = {
                    labels: []
                };
                for (let i = 0, l = labels.count; i < l; i++) {
                    const label = labels.objectAtIndex(i);
                    result.labels.push({
                        text: label.text,
                        confidence: label.confidence
                    });
                }
                this.notify({
                    eventName: MLKitAutoML.scanResultEvent,
                    object: this,
                    value: result
                });
            }
        };
    }
    rotateRecording() {
        return true;
    }
}
function getDetector(localModelResourceFolder, confidenceThreshold) {
    const manifestPath = NSBundle.mainBundle.pathForResourceOfTypeInDirectory("manifest", "json", localModelResourceFolder);
    const fIRAutoMLLocalModel = FIRAutoMLLocalModel.alloc().initWithManifestPath(manifestPath);
    const options = FIRVisionOnDeviceAutoMLImageLabelerOptions.alloc().initWithLocalModel(fIRAutoMLLocalModel);
    options.confidenceThreshold = confidenceThreshold || 0.5;
    const fIRVisionImageLabeler = FIRVision.vision().onDeviceAutoMLImageLabelerWithOptions(options);
    return fIRVisionImageLabeler;
}
export function labelImage(options) {
    return new Promise((resolve, reject) => {
        try {
            const labelDetector = getDetector(options.localModelResourceFolder, options.confidenceThreshold);
            labelDetector.processImageCompletion(getImage(options), (labels, error) => {
                if (error !== null) {
                    reject(error.localizedDescription);
                }
                else if (labels !== null) {
                    const result = {
                        labels: []
                    };
                    for (let i = 0, l = labels.count; i < l; i++) {
                        const label = labels.objectAtIndex(i);
                        result.labels.push({
                            text: label.text,
                            confidence: label.confidence
                        });
                    }
                    resolve(result);
                }
            });
        }
        catch (ex) {
            console.log("Error in firebase.mlkit.labelImageOnDevice: " + ex);
            reject(ex);
        }
    });
}
function getImage(options) {
    const image = options.image instanceof ImageSource ? options.image.ios : options.image.imageSource.ios;
    return FIRVisionImage.alloc().initWithImage(image);
}
//# sourceMappingURL=index.ios.js.map