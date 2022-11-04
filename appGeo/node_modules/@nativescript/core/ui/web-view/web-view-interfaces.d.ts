import { WebView } from '.';
import { EventData } from '../../data/observable';
export declare type WebViewNavigationType = 'linkClicked' | 'formSubmitted' | 'backForward' | 'reload' | 'formResubmitted' | 'other' | undefined;
export interface LoadEventData extends EventData {
    url: string;
    navigationType: WebViewNavigationType;
    error: string;
}
export interface WebViewClient {
    new (owner: WebView): any;
}
