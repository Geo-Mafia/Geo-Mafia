import { ImageSource } from "@nativescript/core";
function getDetector(modelType, confidenceThreshold) {
    const landmarkDetectorOptions = new com.google.firebase.ml.vision.cloud.FirebaseVisionCloudDetectorOptions.Builder()
        .setModelType(modelType === "latest" ? com.google.firebase.ml.vision.cloud.FirebaseVisionCloudDetectorOptions.LATEST_MODEL : com.google.firebase.ml.vision.cloud.FirebaseVisionCloudDetectorOptions.STABLE_MODEL)
        .setMaxResults(confidenceThreshold || 10)
        .build();
    return com.google.firebase.ml.vision.FirebaseVision.getInstance().getVisionCloudLandmarkDetector(landmarkDetectorOptions);
}
export function recognizeLandmarksCloud(options) {
    return new Promise((resolve, reject) => {
        try {
            const firebaseVisionLandmarkDetector = getDetector(options.modelType, options.maxResults);
            const onSuccessListener = new com.google.android.gms.tasks.OnSuccessListener({
                onSuccess: landmarks => {
                    const result = {
                        landmarks: []
                    };
                    if (landmarks) {
                        for (let i = 0; i < landmarks.size(); i++) {
                            const landmark = landmarks.get(i);
                            result.landmarks.push({
                                name: landmark.getLandmark(),
                                confidence: landmark.getConfidence()
                            });
                        }
                    }
                    resolve(result);
                    firebaseVisionLandmarkDetector.close();
                }
            });
            const onFailureListener = new com.google.android.gms.tasks.OnFailureListener({
                onFailure: exception => reject(exception.getMessage())
            });
            firebaseVisionLandmarkDetector
                .detectInImage(getImage(options))
                .addOnSuccessListener(onSuccessListener)
                .addOnFailureListener(onFailureListener);
        }
        catch (ex) {
            console.log("Error in firebase.mlkit.recognizeLandmarksCloud: " + ex);
            reject(ex);
        }
    });
}
function getImage(options) {
    const image = options.image instanceof ImageSource ? options.image.android : options.image.imageSource.android;
    return com.google.firebase.ml.vision.common.FirebaseVisionImage.fromBitmap(image);
}
//# sourceMappingURL=index.android.js.map