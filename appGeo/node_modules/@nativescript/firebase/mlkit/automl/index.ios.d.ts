import { MLKitAutoMLResult, MLKitAutoMLOptions } from "./index";
import { MLKitAutoML as MLKitAutoMLBase } from "./automl-common";
export declare class MLKitAutoML extends MLKitAutoMLBase {
    protected createDetector(): any;
    protected createSuccessListener(): any;
    protected rotateRecording(): boolean;
}
export declare function labelImage(options: MLKitAutoMLOptions): Promise<MLKitAutoMLResult>;
