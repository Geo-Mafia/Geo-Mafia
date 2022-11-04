import { ControlStateChangeListener as ControlStateChangeListenerDefinition } from '.';
export declare class ControlStateChangeListener implements ControlStateChangeListenerDefinition {
    constructor(control: any, callback: (state: string) => void);
    start(): void;
    stop(): void;
}
