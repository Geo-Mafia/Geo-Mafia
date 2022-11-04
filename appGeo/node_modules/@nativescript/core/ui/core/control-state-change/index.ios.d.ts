import { ControlStateChangeListener as ControlStateChangeListenerDefinition } from '.';
export declare class ControlStateChangeListener implements ControlStateChangeListenerDefinition {
    private _observer;
    private _control;
    private _observing;
    private _callback;
    constructor(control: UIControl, callback: (state: string) => void);
    start(): void;
    stop(): void;
    private _onEnabledChanged;
    private _onSelectedChanged;
    private _onHighlightedChanged;
    private _updateState;
}
