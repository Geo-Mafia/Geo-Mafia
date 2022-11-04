import { booleanConverter, Property } from "@nativescript/core";
import { MLKitCameraView } from "../mlkit-cameraview";
export var BarcodeFormat;
(function (BarcodeFormat) {
    BarcodeFormat[BarcodeFormat["CODE_128"] = 1] = "CODE_128";
    BarcodeFormat[BarcodeFormat["CODE_39"] = 2] = "CODE_39";
    BarcodeFormat[BarcodeFormat["CODE_93"] = 4] = "CODE_93";
    BarcodeFormat[BarcodeFormat["CODABAR"] = 8] = "CODABAR";
    BarcodeFormat[BarcodeFormat["DATA_MATRIX"] = 16] = "DATA_MATRIX";
    BarcodeFormat[BarcodeFormat["EAN_13"] = 32] = "EAN_13";
    BarcodeFormat[BarcodeFormat["EAN_8"] = 64] = "EAN_8";
    BarcodeFormat[BarcodeFormat["ITF"] = 128] = "ITF";
    BarcodeFormat[BarcodeFormat["QR_CODE"] = 256] = "QR_CODE";
    BarcodeFormat[BarcodeFormat["UPC_A"] = 512] = "UPC_A";
    BarcodeFormat[BarcodeFormat["UPC_E"] = 1024] = "UPC_E";
    BarcodeFormat[BarcodeFormat["PDF417"] = 2048] = "PDF417";
    BarcodeFormat[BarcodeFormat["AZTEC"] = 4096] = "AZTEC";
})(BarcodeFormat || (BarcodeFormat = {}));
export const formatsProperty = new Property({
    name: "formats",
    defaultValue: null,
});
export const beepOnScanProperty = new Property({
    name: "beepOnScan",
    defaultValue: true,
    valueConverter: booleanConverter
});
export const reportDuplicatesProperty = new Property({
    name: "reportDuplicates",
    defaultValue: false,
    valueConverter: booleanConverter
});
export const supportInverseBarcodesProperty = new Property({
    name: "supportInverseBarcodes",
    defaultValue: false,
    valueConverter: booleanConverter
});
export class MLKitBarcodeScanner extends MLKitCameraView {
    [formatsProperty.setNative](value) {
        this.formats = value;
    }
    [beepOnScanProperty.setNative](value) {
        this.beepOnScan = value;
    }
    [reportDuplicatesProperty.setNative](value) {
        this.reportDuplicates = value;
    }
    [supportInverseBarcodesProperty.setNative](value) {
        this.supportInverseBarcodes = value;
    }
}
formatsProperty.register(MLKitBarcodeScanner);
beepOnScanProperty.register(MLKitBarcodeScanner);
reportDuplicatesProperty.register(MLKitBarcodeScanner);
supportInverseBarcodesProperty.register(MLKitBarcodeScanner);
//# sourceMappingURL=barcodescanning-common.js.map