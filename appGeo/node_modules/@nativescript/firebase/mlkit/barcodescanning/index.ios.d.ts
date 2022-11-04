import { MLKitScanBarcodesOnDeviceOptions, MLKitScanBarcodesOnDeviceResult } from "./index";
import { BarcodeFormat, MLKitBarcodeScanner as MLKitBarcodeScannerBase } from "./barcodescanning-common";
export { BarcodeFormat };
export declare class MLKitBarcodeScanner extends MLKitBarcodeScannerBase {
    private player;
    private inverseThrottle;
    protected createDetector(): any;
    protected createSuccessListener(): any;
    protected rotateRecording(): boolean;
    protected preProcessImage(image: any): any;
}
export declare function scanBarcodesOnDevice(options: MLKitScanBarcodesOnDeviceOptions): Promise<MLKitScanBarcodesOnDeviceResult>;
