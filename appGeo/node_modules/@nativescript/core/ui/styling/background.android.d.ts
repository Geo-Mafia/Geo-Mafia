import { View } from '../core/view';
export * from './background-common';
export declare function refreshBorderDrawable(view: View, borderDrawable: org.nativescript.widgets.BorderDrawable): void;
export declare enum CacheMode {
    none = 0,
    memory = 1,
    diskAndMemory = 2
}
export declare function initImageCache(context: android.content.Context, mode?: CacheMode, memoryCacheSize?: number, diskCacheSize?: number): void;
