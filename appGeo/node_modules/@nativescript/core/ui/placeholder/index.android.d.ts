import { CreateViewEventData } from './placeholder-common';
import { View } from '../core/view';
import { EventData } from '../../data/observable';
export * from './placeholder-common';
export declare class Placeholder extends View {
    static creatingViewEvent: string;
    createNativeView(): globalAndroid.view.View;
}
export interface Placeholder {
    on(eventNames: string, callback: (args: EventData) => void): any;
    on(event: 'creatingView', callback: (args: CreateViewEventData) => void): any;
}
