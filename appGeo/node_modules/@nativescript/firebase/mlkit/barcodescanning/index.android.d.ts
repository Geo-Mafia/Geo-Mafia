import { MLKitScanBarcodesOnDeviceOptions, MLKitScanBarcodesOnDeviceResult } from "./";
import { BarcodeFormat, MLKitBarcodeScanner as MLKitBarcodeScannerBase } from "./barcodescanning-common";
export { BarcodeFormat };
export declare class MLKitBarcodeScanner extends MLKitBarcodeScannerBase {
    private player;
    private inverseThrottle;
    disposeNativeView(): void;
    protected createDetector(): any;
    protected createSuccessListener(): any;
    protected preProcessImage(byteArray: any): any;
}
export declare function scanBarcodesOnDevice(options: MLKitScanBarcodesOnDeviceOptions): Promise<MLKitScanBarcodesOnDeviceResult>;
