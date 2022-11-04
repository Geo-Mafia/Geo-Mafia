import { ContentView, Property } from "@nativescript/core";
export declare const processEveryNthFrameProperty: any;
export declare const preferFrontCameraProperty: Property<MLKitCameraView, boolean>;
export declare const torchOnProperty: Property<MLKitCameraView, boolean>;
export declare const pauseProperty: Property<MLKitCameraView, boolean>;
export declare abstract class MLKitCameraView extends ContentView {
    static scanResultEvent: string;
    lastVisionImage: any;
    protected processEveryNthFrame: number;
    protected preferFrontCamera: boolean;
    protected torchOn: boolean;
    protected pause: boolean;
    protected updateTorch(): void;
    protected pauseScanning(): void;
    protected resumeScanning(): void;
    protected preProcessImage(image: any): any;
}
