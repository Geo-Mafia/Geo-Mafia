import { FrameBase } from './frame-common';
export declare const frameStack: Array<FrameBase>;
export declare function topmost(): FrameBase;
export declare function _pushInFrameStack(frame: FrameBase): void;
export declare function _popFromFrameStack(frame: FrameBase): void;
export declare function _removeFromFrameStack(frame: FrameBase): void;
