import { ImageSource } from "@nativescript/core";
import { MLKitObjectDetection as MLKitObjectDetectionBase, ObjectDetectionCategory } from "./objectdetection-common";
export class MLKitObjectDetection extends MLKitObjectDetectionBase {
    createDetector() {
        return getDetector(this.classify, this.multiple);
    }
    createSuccessListener() {
        return new com.google.android.gms.tasks.OnSuccessListener({
            onSuccess: objects => {
                console.log(">> onSuccess @ " + new Date().getTime() + ", objects: " + objects.size());
                if (objects.size() === 0)
                    return;
                const result = {
                    objects: []
                };
                const image = this.lastVisionImage && this.lastVisionImage.getBitmap ? this.lastVisionImage.getBitmap() : null;
                for (let i = 0; i < objects.size(); i++) {
                    result.objects.push(getMLKitObjectDetectionResultItem(objects.get(i), image));
                }
                this.notify({
                    eventName: MLKitObjectDetection.scanResultEvent,
                    object: this,
                    value: result
                });
            }
        });
    }
}
function getDetector(classify, multiple) {
    const builder = new com.google.firebase.ml.vision.objects.FirebaseVisionObjectDetectorOptions.Builder()
        .setDetectorMode(com.google.firebase.ml.vision.objects.FirebaseVisionObjectDetectorOptions.SINGLE_IMAGE_MODE);
    if (classify) {
        builder.enableClassification();
    }
    if (multiple) {
        builder.enableMultipleObjects();
    }
    return com.google.firebase.ml.vision.FirebaseVision.getInstance().getOnDeviceObjectDetector(builder.build());
}
export function detectObjects(options) {
    return new Promise((resolve, reject) => {
        try {
            const firebaseObjectDetector = getDetector(options.classify, options.multiple);
            const image = options.image instanceof ImageSource ? options.image.android : options.image.imageSource.android;
            const firImage = com.google.firebase.ml.vision.common.FirebaseVisionImage.fromBitmap(image);
            const onSuccessListener = new com.google.android.gms.tasks.OnSuccessListener({
                onSuccess: objects => {
                    const result = {
                        objects: []
                    };
                    if (objects) {
                        for (let i = 0; i < objects.size(); i++) {
                            result.objects.push(getMLKitObjectDetectionResultItem(objects.get(i), image));
                        }
                    }
                    resolve(result);
                    firebaseObjectDetector.close();
                }
            });
            const onFailureListener = new com.google.android.gms.tasks.OnFailureListener({
                onFailure: exception => reject(exception.getMessage())
            });
            firebaseObjectDetector
                .processImage(firImage)
                .addOnSuccessListener(onSuccessListener)
                .addOnFailureListener(onFailureListener);
        }
        catch (ex) {
            console.log("Error in firebase.mlkit.labelImageOnDevice: " + ex);
            reject(ex);
        }
    });
}
function getMLKitObjectDetectionResultItem(obj, image) {
    return {
        id: obj.getTrackingId() ? obj.getTrackingId().intValue() : undefined,
        confidence: obj.getClassificationConfidence() ? obj.getClassificationConfidence().doubleValue() : undefined,
        category: ObjectDetectionCategory[obj.getClassificationCategory()],
        bounds: boundingBoxToBounds(obj.getBoundingBox()),
        image: !image ? null : {
            width: image.getWidth(),
            height: image.getHeight()
        }
    };
}
function getImage(options) {
    const image = options.image instanceof ImageSource ? options.image.android : options.image.imageSource.android;
    return com.google.firebase.ml.vision.common.FirebaseVisionImage.fromBitmap(image);
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
//# sourceMappingURL=index.android.js.map