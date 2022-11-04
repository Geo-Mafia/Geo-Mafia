import { ImageSource } from "@nativescript/core";
import { MLKitAutoML as MLKitAutoMLBase } from "./automl-common";
export class MLKitAutoML extends MLKitAutoMLBase {
    createDetector() {
        return getDetector(this.localModelResourceFolder, this.confidenceThreshold);
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
                    eventName: MLKitAutoML.scanResultEvent,
                    object: this,
                    value: result
                });
            }
        });
    }
}
function getDetector(localModelResourceFolder, confidenceThreshold) {
    const model = new com.google.firebase.ml.vision.automl.FirebaseAutoMLLocalModel.Builder()
        .setAssetFilePath(localModelResourceFolder + "/manifest.json")
        .build();
    const labelDetectorOptions = new com.google.firebase.ml.vision.label.FirebaseVisionOnDeviceAutoMLImageLabelerOptions.Builder(model)
        .setConfidenceThreshold(confidenceThreshold)
        .build();
    return com.google.firebase.ml.vision.FirebaseVision.getInstance()
        .getOnDeviceAutoMLImageLabeler(labelDetectorOptions);
}
export function labelImage(options) {
    return new Promise((resolve, reject) => {
        try {
            const firebaseVisionAutoMLImageLabeler = getDetector(options.localModelResourceFolder, options.confidenceThreshold || 0.5);
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
                    firebaseVisionAutoMLImageLabeler.close();
                }
            });
            const onFailureListener = new com.google.android.gms.tasks.OnFailureListener({
                onFailure: exception => reject(exception.getMessage())
            });
            firebaseVisionAutoMLImageLabeler
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
function getImage(options) {
    const image = options.image instanceof ImageSource ? options.image.android : options.image.imageSource.android;
    return com.google.firebase.ml.vision.common.FirebaseVisionImage.fromBitmap(image);
}
//# sourceMappingURL=index.android.js.map