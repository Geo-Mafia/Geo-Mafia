import { ImageSource, Utils } from "@nativescript/core";
import { MLKitObjectDetection as MLKitObjectDetectionBase, ObjectDetectionCategory } from "./objectdetection-common";
export class MLKitObjectDetection extends MLKitObjectDetectionBase {
    createDetector() {
        return getDetector(true, this.classify, this.multiple);
    }
    createSuccessListener() {
        return (objects, error) => {
            if (error !== null) {
                console.log(error.localizedDescription);
            }
            else if (objects !== null && objects.count > 0) {
                const result = {
                    objects: []
                };
                for (let i = 0, l = objects.count; i < l; i++) {
                    const obj = objects.objectAtIndex(i);
                    result.objects.push(getMLKitObjectDetectionResultItem(obj, this.lastVisionImage));
                }
                this.notify({
                    eventName: MLKitObjectDetection.scanResultEvent,
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
function getDetector(stream, classify, multiple) {
    const firVision = FIRVision.vision();
    const fIRVisionObjectDetectorOptions = FIRVisionObjectDetectorOptions.new();
    fIRVisionObjectDetectorOptions.detectorMode = stream ? 1 : 0;
    fIRVisionObjectDetectorOptions.shouldEnableClassification = classify || false;
    fIRVisionObjectDetectorOptions.shouldEnableMultipleObjects = multiple || false;
    return firVision.objectDetectorWithOptions(fIRVisionObjectDetectorOptions);
}
export function detectObjects(options) {
    return new Promise((resolve, reject) => {
        try {
            const detector = getDetector(false, options.classify, options.multiple);
            detector.processImageCompletion(getImage(options), (objects, error) => {
                if (error !== null) {
                    reject(error.localizedDescription);
                }
                else if (objects !== null) {
                    const result = {
                        objects: []
                    };
                    const image = options.image instanceof ImageSource ? options.image.ios : options.image.imageSource.ios;
                    for (let i = 0, l = objects.count; i < l; i++) {
                        const obj = objects.objectAtIndex(i);
                        result.objects.push(getMLKitObjectDetectionResultItem(obj, image));
                    }
                    resolve(result);
                }
            });
        }
        catch (ex) {
            console.log("Error in firebase.mlkit.detectObjects: " + ex);
            reject(ex);
        }
    });
}
function getMLKitObjectDetectionResultItem(obj, image) {
    console.log(">> getMLKitObjectDetectionResultItem, image: " + image);
    let imageWidth;
    let imageHeight;
    let { x, y } = obj.frame.origin;
    let { width, height } = obj.frame.size;
    if (image) {
        imageWidth = image.size.width;
        imageHeight = image.size.height;
        const origX = x;
        const origWidth = width;
        const origImageWidth = imageWidth;
        if (Utils.ios.isLandscape()) {
            if (UIDevice.currentDevice.orientation === 4) {
                x = image.size.width - (width + x);
                y = image.size.height - (height + y);
            }
        }
        else {
            x = image.size.height - (height + y);
            y = origX;
            width = height;
            height = origWidth;
            imageWidth = imageHeight;
            imageHeight = origImageWidth;
        }
    }
    return {
        id: obj.trackingID,
        category: ObjectDetectionCategory[obj.classificationCategory],
        confidence: obj.confidence,
        ios: obj,
        bounds: {
            origin: {
                x,
                y
            },
            size: {
                width,
                height
            }
        },
        image: {
            width: imageWidth,
            height: imageHeight
        }
    };
}
function getImage(options) {
    const image = options.image instanceof ImageSource ? options.image.ios : options.image.imageSource.ios;
    return FIRVisionImage.alloc().initWithImage(image);
}
//# sourceMappingURL=index.ios.js.map