import { ImageSource, Application } from "@nativescript/core";
import { BarcodeFormat, MLKitBarcodeScanner as MLKitBarcodeScannerBase } from "./barcodescanning-common";
export { BarcodeFormat };
export class MLKitBarcodeScanner extends MLKitBarcodeScannerBase {
    constructor() {
        super(...arguments);
        this.inverseThrottle = 0;
    }
    disposeNativeView() {
        super.disposeNativeView();
        if (this.player) {
            this.player.release();
            this.player = undefined;
        }
    }
    createDetector() {
        let formats;
        if (this.formats) {
            formats = [];
            const requestedFormats = this.formats.split(",");
            requestedFormats.forEach(format => formats.push(BarcodeFormat[format.trim().toUpperCase()]));
        }
        if (this.beepOnScan) {
            const activity = (Application.android.foregroundActivity || Application.android.startActivity);
            activity.setVolumeControlStream(android.media.AudioManager.STREAM_MUSIC);
            try {
                const file = Application.android.context.getResources().getIdentifier("beep", "raw", Application.android.context.getPackageName());
                if (file === 0) {
                    console.log("No 'beep.*' soundfile found in the resources /raw folder. There will be no audible feedback upon scanning a barcode.");
                }
                else {
                    this.player = new android.media.MediaPlayer();
                    const fileDescriptor = Application.android.context.getResources().openRawResourceFd(file);
                    try {
                        this.player.setDataSource(fileDescriptor.getFileDescriptor(), fileDescriptor.getStartOffset(), fileDescriptor.getLength());
                    }
                    finally {
                        fileDescriptor.close();
                    }
                    this.player.setAudioStreamType(android.media.AudioManager.STREAM_MUSIC);
                    this.player.setLooping(false);
                    this.player.setVolume(0.10, 0.10);
                    this.player.prepare();
                }
            }
            catch (e) {
                console.log(e);
                this.player.release();
                this.player = undefined;
            }
        }
        return getBarcodeDetector(formats);
    }
    createSuccessListener() {
        return new com.google.android.gms.tasks.OnSuccessListener({
            onSuccess: barcodes => {
                const result = {
                    barcodes: []
                };
                if (barcodes && barcodes.size() > 0) {
                    const image = this.lastVisionImage && this.lastVisionImage.getBitmap ? this.lastVisionImage.getBitmap() : null;
                    for (let i = 0; i < barcodes.size(); i++) {
                        const barcode = barcodes.get(i);
                        result.barcodes.push({
                            value: barcode.getRawValue(),
                            displayValue: barcode.getDisplayValue(),
                            format: BarcodeFormat[barcode.getFormat()],
                            android: barcode,
                            bounds: boundingBoxToBounds(barcode.getBoundingBox()),
                            image: !image ? null : {
                                width: image.getWidth(),
                                height: image.getHeight()
                            }
                        });
                    }
                    if (this.player) {
                        this.player.start();
                    }
                }
                this.notify({
                    eventName: MLKitBarcodeScanner.scanResultEvent,
                    object: this,
                    value: result
                });
            }
        });
    }
    preProcessImage(byteArray) {
        if (this.supportInverseBarcodes && this.inverseThrottle++ % 2 === 0) {
            return byteArray = org.nativescript.plugins.firebase.mlkit.BitmapUtil.byteArrayBitwiseNotHelper(byteArray);
        }
        return byteArray;
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
function getBarcodeDetector(formats) {
    if (formats && formats.length > 0) {
        const firebaseVisionBarcodeDetectorOptions = new com.google.firebase.ml.vision.barcode.FirebaseVisionBarcodeDetectorOptions.Builder()
            .setBarcodeFormats(formats[0], formats)
            .build();
        return com.google.firebase.ml.vision.FirebaseVision.getInstance().getVisionBarcodeDetector(firebaseVisionBarcodeDetectorOptions);
    }
    else {
        return com.google.firebase.ml.vision.FirebaseVision.getInstance().getVisionBarcodeDetector();
    }
}
export function scanBarcodesOnDevice(options) {
    return new Promise((resolve, reject) => {
        try {
            const firebaseVisionBarcodeDetector = getBarcodeDetector(options.formats);
            const image = options.image instanceof ImageSource ? options.image.android : options.image.imageSource.android;
            const firImage = com.google.firebase.ml.vision.common.FirebaseVisionImage.fromBitmap(image);
            const onSuccessListener = new com.google.android.gms.tasks.OnSuccessListener({
                onSuccess: barcodes => {
                    const result = {
                        barcodes: []
                    };
                    if (barcodes) {
                        for (let i = 0; i < barcodes.size(); i++) {
                            const barcode = barcodes.get(i);
                            result.barcodes.push({
                                value: barcode.getRawValue(),
                                displayValue: barcode.getDisplayValue(),
                                format: BarcodeFormat[barcode.getFormat()],
                                android: barcode,
                                bounds: boundingBoxToBounds(barcode.getBoundingBox()),
                                image: {
                                    width: image.getWidth(),
                                    height: image.getHeight()
                                }
                            });
                        }
                    }
                    resolve(result);
                    firebaseVisionBarcodeDetector.close();
                }
            });
            const onFailureListener = new com.google.android.gms.tasks.OnFailureListener({
                onFailure: exception => reject(exception.getMessage())
            });
            firebaseVisionBarcodeDetector
                .detectInImage(firImage)
                .addOnSuccessListener(onSuccessListener)
                .addOnFailureListener(onFailureListener);
        }
        catch (ex) {
            console.log("Error in firebase.mlkit.scanBarcodesOnDevice: " + ex);
            reject(ex);
        }
    });
}
//# sourceMappingURL=index.android.js.map