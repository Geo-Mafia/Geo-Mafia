import { MLKitImageLabelingOptions, MLKitImageLabelingCloudResult, MLKitImageLabelingOnDeviceResult } from "./";
import { MLKitImageLabeling as MLKitImageLabelingBase } from "./imagelabeling-common";
export declare class MLKitImageLabeling extends MLKitImageLabelingBase {
    protected createDetector(): any;
    protected createSuccessListener(): any;
}
export declare function labelImageOnDevice(options: MLKitImageLabelingOptions): Promise<MLKitImageLabelingOnDeviceResult>;
export declare function labelImageCloud(options: MLKitImageLabelingOptions): Promise<MLKitImageLabelingCloudResult>;
