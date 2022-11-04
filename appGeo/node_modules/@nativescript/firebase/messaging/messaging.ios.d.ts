import { firebase as fbNamespace } from "../firebase";
import { IosInteractiveNotificationAction, IosInteractiveNotificationCategory } from "./messaging";
export declare function initFirebaseMessaging(options: any): void;
export declare function addOnMessageReceivedCallback(callback: Function): Promise<unknown>;
export declare function getCurrentPushToken(): Promise<string>;
export declare function registerForPushNotifications(options?: fbNamespace.MessagingOptions): Promise<void>;
export declare function unregisterForPushNotifications(): Promise<void>;
export declare function handleRemoteNotification(app: any, userInfo: any): void;
export declare function addOnPushTokenReceivedCallback(callback: any): Promise<unknown>;
export declare function addBackgroundRemoteNotificationHandler(appDelegate: any): void;
export declare function registerForInteractivePush(model?: PushNotificationModel): void;
export declare function prepAppDelegate(): void;
export declare function subscribeToTopic(topicName: any): Promise<unknown>;
export declare function unsubscribeFromTopic(topicName: any): Promise<unknown>;
export declare const onTokenRefreshNotification: (token: any) => void;
export declare class IosInteractivePushSettings {
    actions: Array<IosInteractiveNotificationAction>;
    categories: Array<IosInteractiveNotificationCategory>;
}
export declare enum IosInteractiveNotificationActionOptions {
    authenticationRequired = 1,
    destructive = 2,
    foreground = 4
}
export declare class IosPushSettings {
    badge: boolean;
    sound: boolean;
    alert: boolean;
    notificationCallback: Function;
    interactiveSettings: IosInteractivePushSettings;
}
export declare class PushNotificationModel {
    androidSettings: any;
    iosSettings: IosPushSettings;
    onNotificationActionTakenCallback: Function;
}
export declare class NotificationActionResponse {
    androidSettings: any;
    iosSettings: IosPushSettings;
    onNotificationActionTakenCallback: Function;
}
export declare function areNotificationsEnabled(): boolean;
