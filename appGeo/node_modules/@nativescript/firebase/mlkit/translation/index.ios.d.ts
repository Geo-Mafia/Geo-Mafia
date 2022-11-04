import { MLKitTranslationModelDownloadOptions, MLKitTranslationOptions } from "./";
export declare function ensureTranslationModelDownloaded(options: MLKitTranslationModelDownloadOptions): Promise<void>;
export declare function translateText(options: MLKitTranslationOptions): Promise<string>;
