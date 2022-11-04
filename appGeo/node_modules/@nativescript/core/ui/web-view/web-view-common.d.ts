import { LoadEventData, WebViewNavigationType } from './web-view-interfaces';
import { ContainerView } from '../core/view';
import { Property } from '../core/properties';
import { EventData } from '../../data/observable';
export * from './web-view-interfaces';
export declare const srcProperty: any;
export declare const disableZoomProperty: Property<WebViewBase, boolean>;
export declare abstract class WebViewBase extends ContainerView {
    static loadStartedEvent: string;
    static loadFinishedEvent: string;
    src: string;
    disableZoom: boolean;
    _onLoadFinished(url: string, error?: string): void;
    _onLoadStarted(url: string, navigationType: WebViewNavigationType): void;
    abstract _loadUrl(src: string): void;
    abstract _loadData(src: string): void;
    abstract stopLoading(): void;
    get canGoBack(): boolean;
    get canGoForward(): boolean;
    abstract goBack(): void;
    abstract goForward(): void;
    abstract reload(): void;
}
export interface WebViewBase {
    on(eventNames: string, callback: (data: EventData) => void, thisArg?: any): void;
    on(event: 'loadFinished', callback: (args: LoadEventData) => void, thisArg?: any): void;
    on(event: 'loadStarted', callback: (args: LoadEventData) => void, thisArg?: any): void;
}
