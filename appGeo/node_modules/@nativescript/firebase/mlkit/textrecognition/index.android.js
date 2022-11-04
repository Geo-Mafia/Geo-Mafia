import { ImageSource } from "@nativescript/core";
import { MLKitTextRecognition as MLKitTextRecognitionBase } from "./textrecognition-common";
export class MLKitTextRecognition extends MLKitTextRecognitionBase {
    createDetector() {
        return com.google.firebase.ml.vision.FirebaseVision.getInstance().getOnDeviceTextRecognizer();
    }
    createSuccessListener() {
        return new com.google.android.gms.tasks.OnSuccessListener({
            onSuccess: firebaseVisionText => {
                if (firebaseVisionText.getTextBlocks().size() > 0) {
                    this.notify({
                        eventName: MLKitTextRecognition.scanResultEvent,
                        object: this,
                        value: getResult(firebaseVisionText)
                    });
                }
            }
        });
    }
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
function getResult(firebaseVisionText) {
    if (firebaseVisionText === null) {
        return {};
    }
    const result = {
        text: firebaseVisionText.getText(),
        blocks: [],
        android: firebaseVisionText
    };
    for (let i = 0; i < firebaseVisionText.getTextBlocks().size(); i++) {
        const textBlock = firebaseVisionText.getTextBlocks().get(i);
        const lines = textBlock.getLines();
        const lns = [];
        for (let j = 0; j < lines.size(); j++) {
            const line = lines.get(j);
            const elements = line.getElements();
            const elms = [];
            for (let k = 0; k < elements.size(); k++) {
                const element = elements.get(k);
                elms.push({
                    text: element.getText(),
                    bounds: boundingBoxToBounds(element.getBoundingBox())
                });
            }
            lns.push({
                text: line.getText(),
                confidence: line.getConfidence(),
                bounds: boundingBoxToBounds(line.getBoundingBox()),
                elements: elms
            });
        }
        result.blocks.push({
            text: textBlock.getText(),
            confidence: textBlock.getConfidence(),
            bounds: boundingBoxToBounds(textBlock.getBoundingBox()),
            lines: lns
        });
    }
    return result;
}
export function recognizeTextOnDevice(options) {
    return new Promise((resolve, reject) => {
        try {
            const firebaseVisionTextRecognizer = com.google.firebase.ml.vision.FirebaseVision.getInstance().getOnDeviceTextRecognizer();
            const onSuccessListener = new com.google.android.gms.tasks.OnSuccessListener({
                onSuccess: firebaseVisionText => {
                    resolve(getResult(firebaseVisionText));
                    firebaseVisionTextRecognizer.close();
                }
            });
            const onFailureListener = new com.google.android.gms.tasks.OnFailureListener({
                onFailure: exception => reject(exception.getMessage())
            });
            firebaseVisionTextRecognizer
                .processImage(getImage(options))
                .addOnSuccessListener(onSuccessListener)
                .addOnFailureListener(onFailureListener);
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
            const firebaseVisionCloudTextRecognizer = com.google.firebase.ml.vision.FirebaseVision.getInstance().getCloudTextRecognizer();
            const onSuccessListener = new com.google.android.gms.tasks.OnSuccessListener({
                onSuccess: firebaseVisionText => {
                    resolve(getResult(firebaseVisionText));
                    firebaseVisionCloudTextRecognizer.close();
                }
            });
            const onFailureListener = new com.google.android.gms.tasks.OnFailureListener({
                onFailure: exception => reject(exception.getMessage())
            });
            firebaseVisionCloudTextRecognizer
                .processImage(getImage(options))
                .addOnSuccessListener(onSuccessListener)
                .addOnFailureListener(onFailureListener);
        }
        catch (ex) {
            console.log("Error in firebase.mlkit.recognizeTextCloud: " + ex);
            reject(ex);
        }
    });
}
function getImage(options) {
    const image = options.image instanceof ImageSource ? options.image.android : options.image.imageSource.android;
    return com.google.firebase.ml.vision.common.FirebaseVisionImage.fromBitmap(image);
}
//# sourceMappingURL=index.android.js.map