import * as definition from './fps-native';
export declare class FPSCallback implements definition.FPSCallback {
    running: boolean;
    private onFrame;
    private displayLink;
    private impl;
    constructor(onFrame: (currentTimeMillis: number) => void);
    start(): void;
    stop(): void;
    _handleFrame(sender: CADisplayLink): void;
}
