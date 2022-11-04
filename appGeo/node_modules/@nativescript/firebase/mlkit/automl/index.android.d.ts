import { MLKitAutoMLOptions, MLKitAutoMLResult } from "./";
import { MLKitAutoML as MLKitAutoMLBase } from "./automl-common";
export declare class MLKitAutoML extends MLKitAutoMLBase {
    protected createDetector(): any;
    protected createSuccessListener(): any;
}
export declare function labelImage(options: MLKitAutoMLOptions): Promise<MLKitAutoMLResult>;
