import { ImageSource } from "@nativescript/core";
import { MLKitFaceDetection as MLKitFaceDetectionBase } from "./facedetection-common";
export class MLKitFaceDetection extends MLKitFaceDetectionBase {
    createDetector() {
        return getFaceDetector({
            detectionMode: this.detectionMode,
            enableFaceTracking: this.enableFaceTracking,
            minimumFaceSize: this.minimumFaceSize
        });
    }
    createSuccessListener() {
        return new com.google.android.gms.tasks.OnSuccessListener({
            onSuccess: faces => {
                if (!faces || faces.size() === 0)
                    return;
                const result = {
                    faces: []
                };
                for (let i = 0; i < faces.size(); i++) {
                    const face = faces.get(i);
                    result.faces.push({
                        bounds: boundingBoxToBounds(face.getBoundingBox()),
                        smilingProbability: face.getSmilingProbability() !== com.google.firebase.ml.vision.face.FirebaseVisionFace.UNCOMPUTED_PROBABILITY ? face.getSmilingProbability() : undefined,
                        leftEyeOpenProbability: face.getLeftEyeOpenProbability() !== com.google.firebase.ml.vision.face.FirebaseVisionFace.UNCOMPUTED_PROBABILITY ? face.getLeftEyeOpenProbability() : undefined,
                        rightEyeOpenProbability: face.getRightEyeOpenProbability() !== com.google.firebase.ml.vision.face.FirebaseVisionFace.UNCOMPUTED_PROBABILITY ? face.getRightEyeOpenProbability() : undefined,
                        trackingId: face.getTrackingId() !== com.google.firebase.ml.vision.face.FirebaseVisionFace.INVALID_ID ? face.getTrackingId() : undefined,
                        headEulerAngleY: face.getHeadEulerAngleY(),
                        headEulerAngleZ: face.getHeadEulerAngleZ()
                    });
                }
                this.notify({
                    eventName: MLKitFaceDetection.scanResultEvent,
                    object: this,
                    value: result
                });
            }
        });
    }
}
function getFaceDetector(options) {
    const builder = new com.google.firebase.ml.vision.face.FirebaseVisionFaceDetectorOptions.Builder()
        .setPerformanceMode(options.detectionMode === "accurate" ? com.google.firebase.ml.vision.face.FirebaseVisionFaceDetectorOptions.ACCURATE : com.google.firebase.ml.vision.face.FirebaseVisionFaceDetectorOptions.FAST)
        .setLandmarkMode(com.google.firebase.ml.vision.face.FirebaseVisionFaceDetectorOptions.ALL_LANDMARKS)
        .setClassificationMode(com.google.firebase.ml.vision.face.FirebaseVisionFaceDetectorOptions.ALL_CLASSIFICATIONS)
        .setMinFaceSize(options.minimumFaceSize);
    if (options.enableFaceTracking === true) {
        builder.enableTracking();
    }
    return com.google.firebase.ml.vision.FirebaseVision.getInstance().getVisionFaceDetector(builder.build());
}
function boundingBoxToBounds(rect) {
    return {
        origin: {
            x: rect.left,
            y: rect.top
        },
        size: {
            width: rect.width(),
            height: rect.height()
        }
    };
}
export function detectFacesOnDevice(options) {
    return new Promise((resolve, reject) => {
        try {
            const firebaseVisionFaceDetector = getFaceDetector(options);
            const onSuccessListener = new com.google.android.gms.tasks.OnSuccessListener({
                onSuccess: faces => {
                    const result = {
                        faces: []
                    };
                    if (faces) {
                        for (let i = 0; i < faces.size(); i++) {
                            const face = faces.get(i);
                            result.faces.push({
                                bounds: boundingBoxToBounds(face.getBoundingBox()),
                                smilingProbability: face.getSmilingProbability() !== com.google.firebase.ml.vision.face.FirebaseVisionFace.UNCOMPUTED_PROBABILITY ? face.getSmilingProbability() : undefined,
                                leftEyeOpenProbability: face.getLeftEyeOpenProbability() !== com.google.firebase.ml.vision.face.FirebaseVisionFace.UNCOMPUTED_PROBABILITY ? face.getLeftEyeOpenProbability() : undefined,
                                rightEyeOpenProbability: face.getRightEyeOpenProbability() !== com.google.firebase.ml.vision.face.FirebaseVisionFace.UNCOMPUTED_PROBABILITY ? face.getRightEyeOpenProbability() : undefined,
                                trackingId: face.getTrackingId() !== com.google.firebase.ml.vision.face.FirebaseVisionFace.INVALID_ID ? face.getTrackingId() : undefined,
                                headEulerAngleY: face.getHeadEulerAngleY(),
                                headEulerAngleZ: face.getHeadEulerAngleZ()
                            });
                        }
                    }
                    resolve(result);
                    firebaseVisionFaceDetector.close();
                }
            });
            const onFailureListener = new com.google.android.gms.tasks.OnFailureListener({
                onFailure: exception => reject(exception.getMessage())
            });
            firebaseVisionFaceDetector
                .detectInImage(getImage(options))
                .addOnSuccessListener(onSuccessListener)
                .addOnFailureListener(onFailureListener);
        }
        catch (ex) {
            console.log("Error in firebase.mlkit.detectFacesOnDevice: " + ex);
            reject(ex);
        }
    });
}
function getImage(options) {
    const image = options.image instanceof ImageSource ? options.image.android : options.image.imageSource.android;
    return com.google.firebase.ml.vision.common.FirebaseVisionImage.fromBitmap(image);
}
//# sourceMappingURL=index.android.js.map