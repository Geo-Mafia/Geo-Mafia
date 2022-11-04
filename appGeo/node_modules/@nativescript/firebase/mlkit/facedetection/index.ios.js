import { ImageSource, Utils } from "@nativescript/core";
import { MLKitFaceDetection as MLKitFaceDetectionBase } from "./facedetection-common";
export class MLKitFaceDetection extends MLKitFaceDetectionBase {
    createDetector() {
        return getDetector({
            detectionMode: this.detectionMode,
            enableFaceTracking: this.enableFaceTracking,
            minimumFaceSize: this.minimumFaceSize
        });
    }
    createSuccessListener() {
        return (faces, error) => {
            if (error !== null) {
                console.log(error.localizedDescription);
            }
            else if (faces !== null && faces.count > 0) {
                const result = {
                    faces: []
                };
                for (let i = 0, l = faces.count; i < l; i++) {
                    const face = faces.objectAtIndex(i);
                    result.faces.push({
                        smilingProbability: face.hasSmilingProbability ? face.smilingProbability : undefined,
                        leftEyeOpenProbability: face.hasLeftEyeOpenProbability ? face.leftEyeOpenProbability : undefined,
                        rightEyeOpenProbability: face.hasRightEyeOpenProbability ? face.rightEyeOpenProbability : undefined,
                        trackingId: face.hasTrackingID ? face.trackingID : undefined,
                        bounds: face.frame,
                        headEulerAngleY: face.headEulerAngleY,
                        headEulerAngleZ: face.headEulerAngleZ
                    });
                }
                this.notify({
                    eventName: MLKitFaceDetection.scanResultEvent,
                    object: this,
                    value: result
                });
            }
        };
    }
    rotateRecording() {
        return false;
    }
    getVisionOrientation(imageOrientation) {
        if (imageOrientation === 0 && !Utils.ios.isLandscape()) {
            return 6;
        }
        else {
            return super.getVisionOrientation(imageOrientation);
        }
    }
}
function getDetector(options) {
    const firVision = FIRVision.vision();
    const firOptions = FIRVisionFaceDetectorOptions.new();
    firOptions.performanceMode = options.detectionMode === "accurate" ? 2 : 1;
    firOptions.landmarkMode = 2;
    firOptions.classificationMode = 2;
    firOptions.minFaceSize = options.minimumFaceSize;
    firOptions.trackingEnabled = options.enableFaceTracking === true;
    return firVision.faceDetectorWithOptions(firOptions);
}
export function detectFacesOnDevice(options) {
    return new Promise((resolve, reject) => {
        try {
            const faceDetector = getDetector(options);
            faceDetector.processImageCompletion(getImage(options), (faces, error) => {
                if (error !== null) {
                    reject(error.localizedDescription);
                }
                else if (faces !== null) {
                    const result = {
                        faces: []
                    };
                    for (let i = 0, l = faces.count; i < l; i++) {
                        const face = faces.objectAtIndex(i);
                        result.faces.push({
                            smilingProbability: face.hasSmilingProbability ? face.smilingProbability : undefined,
                            leftEyeOpenProbability: face.hasLeftEyeOpenProbability ? face.leftEyeOpenProbability : undefined,
                            rightEyeOpenProbability: face.hasRightEyeOpenProbability ? face.rightEyeOpenProbability : undefined,
                            trackingId: face.hasTrackingID ? face.trackingID : undefined,
                            bounds: face.frame,
                            headEulerAngleY: face.headEulerAngleY,
                            headEulerAngleZ: face.headEulerAngleZ
                        });
                    }
                    resolve(result);
                }
            });
        }
        catch (ex) {
            console.log("Error in firebase.mlkit.detectFaces: " + ex);
            reject(ex);
        }
    });
}
function getImage(options) {
    const image = options.image instanceof ImageSource ? options.image.ios : options.image.imageSource.ios;
    const newImage = UIImage.alloc().initWithCGImageScaleOrientation(image.CGImage, 1, 0);
    return FIRVisionImage.alloc().initWithImage(newImage);
}
//# sourceMappingURL=index.ios.js.map