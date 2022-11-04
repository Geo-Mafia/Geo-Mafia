import { Property } from "@nativescript/core";
import { MLKitCameraView } from "../mlkit-cameraview";
export declare enum ObjectDetectionCategory {
    Unknown = 0,
    HomeGoods = 1,
    FashionGoods = 2,
    Food = 3,
    Places = 4,
    Plants = 5
}
export declare const classifyProperty: any;
export declare const multipleProperty: Property<MLKitObjectDetection, boolean>;
export declare abstract class MLKitObjectDetection extends MLKitCameraView {
    static scanResultEvent: string;
    protected classify: boolean;
    protected multiple: boolean;
}
