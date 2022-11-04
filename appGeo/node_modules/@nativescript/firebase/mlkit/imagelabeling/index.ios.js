import { ImageSource } from "@nativescript/core";
import { MLKitImageLabeling as MLKitImageLabelingBase } from "./imagelabeling-common";
export class MLKitImageLabeling extends MLKitImageLabelingBase {
    createDetector() {
        return getDetector(this.confidenceThreshold);
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
                    eventName: MLKitImageLabeling.scanResultEvent,
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
function getDetector(confidenceThreshold) {
    const firVision = FIRVision.vision();
    const fIRVisionOnDeviceImageLabelerOptions = FIRVisionOnDeviceImageLabelerOptions.new();
    fIRVisionOnDeviceImageLabelerOptions.confidenceThreshold = confidenceThreshold || 0.5;
    return firVision.onDeviceImageLabelerWithOptions(fIRVisionOnDeviceImageLabelerOptions);
}
export function labelImageOnDevice(options) {
    return new Promise((resolve, reject) => {
        try {
            const labelDetector = getDetector(options.confidenceThreshold);
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
export function labelImageCloud(options) {
    return new Promise((resolve, reject) => {
        try {
            const fIRVisionCloudImageLabelerOptions = FIRVisionCloudImageLabelerOptions.new();
            fIRVisionCloudImageLabelerOptions.confidenceThreshold = options.confidenceThreshold || 0.5;
            const firVision = FIRVision.vision();
            const labeler = firVision.cloudImageLabelerWithOptions(fIRVisionCloudImageLabelerOptions);
            labeler.processImageCompletion(getImage(options), (labels, error) => {
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
                    console.log(">>> cloud image labeling result: " + JSON.stringify(result.labels));
                    resolve(result);
                }
            });
        }
        catch (ex) {
            console.log("Error in firebase.mlkit.labelImageCloud: " + ex);
            reject(ex);
        }
    });
}
function getImage(options) {
    const image = options.image instanceof ImageSource ? options.image.ios : options.image.imageSource.ios;
    return FIRVisionImage.alloc().initWithImage(image);
}
//# sourceMappingURL=index.ios.js.map