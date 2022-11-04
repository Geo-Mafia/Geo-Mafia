import { ImageSource, Utils } from "@nativescript/core";
import { BarcodeFormat, MLKitBarcodeScanner as MLKitBarcodeScannerBase } from "./barcodescanning-common";
export { BarcodeFormat };
export class MLKitBarcodeScanner extends MLKitBarcodeScannerBase {
    constructor() {
        super(...arguments);
        this.inverseThrottle = 0;
    }
    createDetector() {
        let formats;
        if (this.formats) {
            formats = [];
            const requestedFormats = this.formats.split(",");
            requestedFormats.forEach(format => formats.push(BarcodeFormat[format.trim().toUpperCase()]));
        }
        if (this.beepOnScan) {
            AVAudioSession.sharedInstance().setCategoryModeOptionsError(AVAudioSessionCategoryPlayback, AVAudioSessionModeDefault, 1);
            const barcodeBundlePath = NSBundle.bundleWithIdentifier("org.nativescript.plugin.firebase.MLKit").bundlePath;
            this.player = new AVAudioPlayer({ contentsOfURL: NSURL.fileURLWithPath(barcodeBundlePath + "/beep.caf") });
            this.player.numberOfLoops = 1;
            this.player.volume = 0.7;
            this.player.prepareToPlay();
        }
        return getBarcodeDetector(formats);
    }
    createSuccessListener() {
        return (barcodes, error) => {
            if (error !== null) {
                console.log(error.localizedDescription);
            }
            else if (barcodes !== null) {
                const result = {
                    barcodes: []
                };
                for (let i = 0, l = barcodes.count; i < l; i++) {
                    const barcode = barcodes.objectAtIndex(i);
                    const image = this.lastVisionImage;
                    let imageWidth = image.size.width;
                    let imageHeight = image.size.height;
                    let { x, y } = barcode.frame.origin;
                    let { width, height } = barcode.frame.size;
                    if (image) {
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
                    result.barcodes.push({
                        value: barcode.rawValue,
                        displayValue: barcode.displayValue,
                        format: BarcodeFormat[barcode.format],
                        ios: barcode,
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
                    });
                }
                this.notify({
                    eventName: MLKitBarcodeScanner.scanResultEvent,
                    object: this,
                    value: result
                });
                if (barcodes.count > 0 && this.player) {
                    this.player.play();
                }
            }
        };
    }
    rotateRecording() {
        return false;
    }
    preProcessImage(image) {
        if (this.supportInverseBarcodes && this.inverseThrottle++ % 2 === 0) {
            const filter = CIFilter.filterWithName('CIColorInvert');
            let ciImg = CIImage.alloc().initWithImage(image);
            filter.setValueForKey(ciImg, kCIInputImageKey);
            filter.setDefaults();
            ciImg = filter.outputImage;
            const context = CIContext.alloc().init();
            const cgImg = context.createCGImageFromRect(ciImg, ciImg.extent);
            image = UIImage.alloc().initWithCGImage(cgImg);
        }
        return image;
    }
}
function getBarcodeDetector(formats) {
    if (formats && formats.length > 0) {
        let barcodeFormats = 0;
        formats.forEach(format => barcodeFormats |= format);
        return FIRVision.vision().barcodeDetectorWithOptions(FIRVisionBarcodeDetectorOptions.alloc().initWithFormats(barcodeFormats));
    }
    else {
        return FIRVision.vision().barcodeDetector();
    }
}
export function scanBarcodesOnDevice(options) {
    return new Promise((resolve, reject) => {
        try {
            const barcodeDetector = getBarcodeDetector(options.formats);
            const image = options.image instanceof ImageSource ? options.image.ios : options.image.imageSource.ios;
            const firImage = FIRVisionImage.alloc().initWithImage(image);
            barcodeDetector.detectInImageCompletion(firImage, (barcodes, error) => {
                if (error !== null) {
                    reject(error.localizedDescription);
                }
                else if (barcodes !== null) {
                    const result = {
                        barcodes: []
                    };
                    for (let i = 0, l = barcodes.count; i < l; i++) {
                        const barcode = barcodes.objectAtIndex(i);
                        result.barcodes.push({
                            value: barcode.rawValue,
                            displayValue: barcode.displayValue,
                            format: BarcodeFormat[barcode.format],
                            ios: barcode,
                            bounds: barcode.frame,
                            image: {
                                width: image.size.width,
                                height: image.size.height
                            }
                        });
                    }
                    resolve(result);
                }
            });
        }
        catch (ex) {
            console.log("Error in firebase.mlkit.scanBarcodesOnDevice: " + ex);
            reject(ex);
        }
    });
}
//# sourceMappingURL=index.ios.js.map