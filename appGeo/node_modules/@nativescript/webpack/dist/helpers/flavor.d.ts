import { defaultConfigs } from '@nativescript/webpack';
/**
 * Utility to determine the project flavor based on installed dependencies
 * (vue, angular, react, svelete, typescript, javascript...)
 */
export declare function determineProjectFlavor(): keyof typeof defaultConfigs | false;
