import { ImageSource } from "@nativescript/core";
import { MLKitTextRecognition as MLKitTextRecognitionBase } from "./textrecognition-common";
export class MLKitTextRecognition extends MLKitTextRecognitionBase {
    createDetector() {
        const firVision = FIRVision.vision();
        return firVision.onDeviceTextRecognizer();
    }
    createSuccessListener() {
        return (visionText, error) => {
            if (error !== null) {
                console.log(error.localizedDescription);
            }
            else if (visionText !== null) {
                this.notify({
                    eventName: MLKitTextRecognition.scanResultEvent,
                    object: this,
                    value: getResult(visionText)
                });
            }
        };
    }
    rotateRecording() {
        return true;
    }
}
function getResult(visionText) {
    if (visionText === null) {
        return {};
    }
    const result = {
        text: visionText.text,
        blocks: [],
        ios: visionText
    };
    for (let i = 0, l = visionText.blocks.count; i < l; i++) {
        const feature = visionText.blocks.objectAtIndex(i);
        const resultFeature = {
            text: feature.text,
            confidence: feature.confidence,
            bounds: feature.frame,
            lines: []
        };
        const addLineToResult = (line) => {
            const resultLine = {
                text: feature.text,
                confidence: line.confidence,
                bounds: line.frame,
                elements: []
            };
            for (let a = 0, m = line.elements.count; a < m; a++) {
                const element = line.elements.objectAtIndex(a);
                resultLine.elements.push({
                    text: element.text,
                    bounds: element.frame,
                });
            }
            resultFeature.lines.push(resultLine);
        };
        if (feature instanceof FIRVisionTextBlock) {
            const textBlock = feature;
            for (let j = 0, k = textBlock.lines.count; j < k; j++) {
                addLineToResult(textBlock.lines.objectAtIndex(j));
            }
        }
        if (feature instanceof FIRVisionTextLine) {
            addLineToResult(feature);
        }
        result.blocks.push(resultFeature);
    }
    return result;
}
export function recognizeTextOnDevice(options) {
    return new Promise((resolve, reject) => {
        try {
            const firVision = FIRVision.vision();
            const textDetector = firVision.onDeviceTextRecognizer();
            textDetector.processImageCompletion(getImage(options), (visionText, error) => {
                if (error !== null) {
                    reject(error.localizedDescription);
                }
                else {
                    resolve(getResult(visionText));
                }
            });
        }
        catch (ex) {
            console.log("Error in firebase.mlkit.recognizeTextOnDevice: " + ex);
            reject(ex);
        }
    });
}
export function recognizeTextCloud(options) {
    return new Promise((resolve, reject) => {
        try {
            const fIRVisionCloudDetectorOptions = FIRVisionCloudTextRecognizerOptions.new();
            fIRVisionCloudDetectorOptions.modelType = 0;
            const firVision = FIRVision.vision();
            const textDetector = firVision.cloudTextRecognizerWithOptions(fIRVisionCloudDetectorOptions);
            textDetector.processImageCompletion(getImage(options), (visionText, error) => {
                console.log(">>> recognizeTextCloud error? " + error + ", visionText? " + visionText);
                if (error !== null) {
                    reject(error.localizedDescription);
                }
                else if (visionText !== null) {
                    resolve(getResult(visionText));
                }
                else {
                    reject("Unknown error :'(");
                }
            });
        }
        catch (ex) {
            console.log("Error in firebase.mlkit.recognizeTextCloud: " + ex);
            reject(ex);
        }
    });
}
function getImage(options) {
    const image = options.image instanceof ImageSource ? options.image.ios : options.image.imageSource.ios;
    return FIRVisionImage.alloc().initWithImage(image);
}
//# sourceMappingURL=index.ios.js.map