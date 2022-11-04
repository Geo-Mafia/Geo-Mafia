import { ImageSource } from "@nativescript/core";
import { MLKitImageLabeling as MLKitImageLabelingBase } from "./imagelabeling-common";
export class MLKitImageLabeling extends MLKitImageLabelingBase {
    createDetector() {
        return getDetector(this.confidenceThreshold);
    }
    createSuccessListener() {
        return new com.google.android.gms.tasks.OnSuccessListener({
            onSuccess: labels => {
                if (labels.size() === 0)
                    return;
                const result = {
                    labels: []
                };
                for (let i = 0; i < labels.size(); i++) {
                    const label = labels.get(i);
                    result.labels.push({
                        text: label.getText(),
                        confidence: label.getConfidence()
                    });
                }
                this.notify({
                    eventName: MLKitImageLabeling.scanResultEvent,
                    object: this,
                    value: result
                });
            }
        });
    }
}
function getDetector(confidenceThreshold) {
    const labelDetectorOptions = new com.google.firebase.ml.vision.label.FirebaseVisionOnDeviceImageLabelerOptions.Builder()
        .setConfidenceThreshold(confidenceThreshold)
        .build();
    return com.google.firebase.ml.vision.FirebaseVision.getInstance().getOnDeviceImageLabeler(labelDetectorOptions);
}
export function labelImageOnDevice(options) {
    return new Promise((resolve, reject) => {
        try {
            const firebaseVisionLabelDetector = getDetector(options.confidenceThreshold || 0.5);
            const onSuccessListener = new com.google.android.gms.tasks.OnSuccessListener({
                onSuccess: labels => {
                    const result = {
                        labels: []
                    };
                    if (labels) {
                        for (let i = 0; i < labels.size(); i++) {
                            const label = labels.get(i);
                            result.labels.push({
                                text: label.getText(),
                                confidence: label.getConfidence()
                            });
                        }
                    }
                    resolve(result);
                    firebaseVisionLabelDetector.close();
                }
            });
            const onFailureListener = new com.google.android.gms.tasks.OnFailureListener({
                onFailure: exception => reject(exception.getMessage())
            });
            firebaseVisionLabelDetector
                .processImage(getImage(options))
                .addOnSuccessListener(onSuccessListener)
                .addOnFailureListener(onFailureListener);
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
            const cloudDetectorOptions = new com.google.firebase.ml.vision.label.FirebaseVisionCloudImageLabelerOptions.Builder()
                .setConfidenceThreshold(options.confidenceThreshold || 0.5)
                .build();
            const firebaseVisionCloudLabelDetector = com.google.firebase.ml.vision.FirebaseVision.getInstance().getCloudImageLabeler(cloudDetectorOptions);
            const onSuccessListener = new com.google.android.gms.tasks.OnSuccessListener({
                onSuccess: labels => {
                    const result = {
                        labels: []
                    };
                    if (labels) {
                        for (let i = 0; i < labels.size(); i++) {
                            const label = labels.get(i);
                            result.labels.push({
                                text: label.getText(),
                                confidence: label.getConfidence()
                            });
                        }
                    }
                    resolve(result);
                    firebaseVisionCloudLabelDetector.close();
                }
            });
            const onFailureListener = new com.google.android.gms.tasks.OnFailureListener({
                onFailure: exception => reject(exception.getMessage())
            });
            firebaseVisionCloudLabelDetector
                .processImage(getImage(options))
                .addOnSuccessListener(onSuccessListener)
                .addOnFailureListener(onFailureListener);
        }
        catch (ex) {
            console.log("Error in firebase.mlkit.labelImageCloud: " + ex);
            reject(ex);
        }
    });
}
function getImage(options) {
    const image = options.image instanceof ImageSource ? options.image.android : options.image.imageSource.android;
    return com.google.firebase.ml.vision.common.FirebaseVisionImage.fromBitmap(image);
}
//# sourceMappingURL=index.android.js.map