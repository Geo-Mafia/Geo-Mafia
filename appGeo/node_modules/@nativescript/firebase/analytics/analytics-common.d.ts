import { LogEventParameter } from "./analytics";
export declare const ENABLE_ANALYTICS_HINT = "\u26A0\uFE0F You're calling an Analytics function but have not enabled it. Please add 'analytics: true' to 'firebase.nativescript.json' and remove the 'node_modules' and 'platforms' folders.";
export declare function validateAnalyticsKey(key: string): string | undefined;
export declare function validateAnalyticsParam(param: LogEventParameter): string | undefined;
