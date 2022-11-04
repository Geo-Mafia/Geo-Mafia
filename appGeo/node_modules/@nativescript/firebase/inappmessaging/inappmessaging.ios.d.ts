import { OnMessageImpressionCallbackData, OnMessageClickedCallbackData } from "./inappmessaging";
export declare function onMessageClicked(callback: (data: OnMessageClickedCallbackData) => void): void;
export declare function onMessageImpression(callback: (data: OnMessageImpressionCallbackData) => void): void;
export declare function triggerEvent(eventName: string): void;
