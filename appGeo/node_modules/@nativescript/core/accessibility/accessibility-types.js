export var AccessibilityTrait;
(function (AccessibilityTrait) {
    /**
     * The element allows direct touch interaction for VoiceOver users.
     */
    AccessibilityTrait["AllowsDirectInteraction"] = "allowsDirectInteraction";
    /**
     * The element should cause an automatic page turn when VoiceOver finishes reading the text within it.
     * Note: Requires custom view with accessibilityScroll(...)
     */
    AccessibilityTrait["CausesPageTurn"] = "pageTurn";
    /**
     * The element is not enabled and does not respond to user interaction.
     */
    AccessibilityTrait["NotEnabled"] = "disabled";
    /**
     * The element is currently selected.
     */
    AccessibilityTrait["Selected"] = "selected";
    /**
     * The element frequently updates its label or value.
     */
    AccessibilityTrait["UpdatesFrequently"] = "frequentUpdates";
})(AccessibilityTrait || (AccessibilityTrait = {}));
export var AccessibilityRole;
(function (AccessibilityRole) {
    /**
     * The element allows continuous adjustment through a range of values.
     */
    AccessibilityRole["Adjustable"] = "adjustable";
    /**
     * The element should be treated as a button.
     */
    AccessibilityRole["Button"] = "button";
    /**
     * The element behaves like a Checkbox
     */
    AccessibilityRole["Checkbox"] = "checkbox";
    /**
     * The element is a header that divides content into sections, such as the title of a navigation bar.
     */
    AccessibilityRole["Header"] = "header";
    /**
     * The element should be treated as an image.
     */
    AccessibilityRole["Image"] = "image";
    /**
     * The element should be treated as a image button.
     */
    AccessibilityRole["ImageButton"] = "imageButton";
    /**
     * The element behaves as a keyboard key.
     */
    AccessibilityRole["KeyboardKey"] = "keyboardKey";
    /**
     * The element should be treated as a link.
     */
    AccessibilityRole["Link"] = "link";
    /**
     * The element has no traits.
     */
    AccessibilityRole["None"] = "none";
    /**
     * The element plays its own sound when activated.
     */
    AccessibilityRole["PlaysSound"] = "plays";
    /**
     * The element behaves like a ProgressBar
     */
    AccessibilityRole["ProgressBar"] = "progressBar";
    /**
     * The element behaves like a RadioButton
     */
    AccessibilityRole["RadioButton"] = "radioButton";
    /**
     * The element should be treated as a search field.
     */
    AccessibilityRole["Search"] = "search";
    /**
     * The element behaves like a SpinButton
     */
    AccessibilityRole["SpinButton"] = "spinButton";
    /**
     * The element starts a media session when it is activated.
     */
    AccessibilityRole["StartsMediaSession"] = "startsMedia";
    /**
     * The element should be treated as static text that cannot change.
     */
    AccessibilityRole["StaticText"] = "text";
    /**
     * The element provides summary information when the application starts.
     */
    AccessibilityRole["Summary"] = "summary";
    /**
     * The element behaves like a switch
     */
    AccessibilityRole["Switch"] = "switch";
})(AccessibilityRole || (AccessibilityRole = {}));
export var AccessibilityState;
(function (AccessibilityState) {
    AccessibilityState["Selected"] = "selected";
    AccessibilityState["Checked"] = "checked";
    AccessibilityState["Unchecked"] = "unchecked";
    AccessibilityState["Disabled"] = "disabled";
})(AccessibilityState || (AccessibilityState = {}));
export var AccessibilityLiveRegion;
(function (AccessibilityLiveRegion) {
    AccessibilityLiveRegion["None"] = "none";
    AccessibilityLiveRegion["Polite"] = "polite";
    AccessibilityLiveRegion["Assertive"] = "assertive";
})(AccessibilityLiveRegion || (AccessibilityLiveRegion = {}));
export var IOSPostAccessibilityNotificationType;
(function (IOSPostAccessibilityNotificationType) {
    IOSPostAccessibilityNotificationType["Announcement"] = "announcement";
    IOSPostAccessibilityNotificationType["Screen"] = "screen";
    IOSPostAccessibilityNotificationType["Layout"] = "layout";
})(IOSPostAccessibilityNotificationType || (IOSPostAccessibilityNotificationType = {}));
export var AndroidAccessibilityEvent;
(function (AndroidAccessibilityEvent) {
    /**
     * Invalid selection/focus position.
     */
    AndroidAccessibilityEvent["INVALID_POSITION"] = "invalid_position";
    /**
     * Maximum length of the text fields.
     */
    AndroidAccessibilityEvent["MAX_TEXT_LENGTH"] = "max_text_length";
    /**
     * Represents the event of clicking on a android.view.View like android.widget.Button, android.widget.CompoundButton, etc.
     */
    AndroidAccessibilityEvent["VIEW_CLICKED"] = "view_clicked";
    /**
     * Represents the event of long clicking on a android.view.View like android.widget.Button, android.widget.CompoundButton, etc.
     */
    AndroidAccessibilityEvent["VIEW_LONG_CLICKED"] = "view_long_clicked";
    /**
     * Represents the event of selecting an item usually in the context of an android.widget.AdapterView.
     */
    AndroidAccessibilityEvent["VIEW_SELECTED"] = "view_selected";
    /**
     * Represents the event of setting input focus of a android.view.View.
     */
    AndroidAccessibilityEvent["VIEW_FOCUSED"] = "view_focused";
    /**
     * Represents the event of changing the text of an android.widget.EditText.
     */
    AndroidAccessibilityEvent["VIEW_TEXT_CHANGED"] = "view_text_changed";
    /**
     * Represents the event of opening a android.widget.PopupWindow, android.view.Menu, android.app.Dialog, etc.
     */
    AndroidAccessibilityEvent["WINDOW_STATE_CHANGED"] = "window_state_changed";
    /**
     * Represents the event showing a android.app.Notification.
     */
    AndroidAccessibilityEvent["NOTIFICATION_STATE_CHANGED"] = "notification_state_changed";
    /**
     * Represents the event of a hover enter over a android.view.View.
     */
    AndroidAccessibilityEvent["VIEW_HOVER_ENTER"] = "view_hover_enter";
    /**
     * Represents the event of a hover exit over a android.view.View.
     */
    AndroidAccessibilityEvent["VIEW_HOVER_EXIT"] = "view_hover_exit";
    /**
     * Represents the event of starting a touch exploration gesture.
     */
    AndroidAccessibilityEvent["TOUCH_EXPLORATION_GESTURE_START"] = "touch_exploration_gesture_start";
    /**
     * Represents the event of ending a touch exploration gesture.
     */
    AndroidAccessibilityEvent["TOUCH_EXPLORATION_GESTURE_END"] = "touch_exploration_gesture_end";
    /**
     * Represents the event of changing the content of a window and more specifically the sub-tree rooted at the event's source.
     */
    AndroidAccessibilityEvent["WINDOW_CONTENT_CHANGED"] = "window_content_changed";
    /**
     * Represents the event of scrolling a view.
     */
    AndroidAccessibilityEvent["VIEW_SCROLLED"] = "view_scrolled";
    /**
     * Represents the event of changing the selection in an android.widget.EditText.
     */
    AndroidAccessibilityEvent["VIEW_TEXT_SELECTION_CHANGED"] = "view_text_selection_changed";
    /**
     * Represents the event of an application making an announcement.
     */
    AndroidAccessibilityEvent["ANNOUNCEMENT"] = "announcement";
    /**
     * Represents the event of gaining accessibility focus.
     */
    AndroidAccessibilityEvent["VIEW_ACCESSIBILITY_FOCUSED"] = "view_accessibility_focused";
    /**
     * Represents the event of clearing accessibility focus.
     */
    AndroidAccessibilityEvent["VIEW_ACCESSIBILITY_FOCUS_CLEARED"] = "view_accessibility_focus_cleared";
    /**
     * Represents the event of traversing the text of a view at a given movement granularity.
     */
    AndroidAccessibilityEvent["VIEW_TEXT_TRAVERSED_AT_MOVEMENT_GRANULARITY"] = "view_text_traversed_at_movement_granularity";
    /**
     * Represents the event of beginning gesture detection.
     */
    AndroidAccessibilityEvent["GESTURE_DETECTION_START"] = "gesture_detection_start";
    /**
     * Represents the event of ending gesture detection.
     */
    AndroidAccessibilityEvent["GESTURE_DETECTION_END"] = "gesture_detection_end";
    /**
     * Represents the event of the user starting to touch the screen.
     */
    AndroidAccessibilityEvent["TOUCH_INTERACTION_START"] = "touch_interaction_start";
    /**
     * Represents the event of the user ending to touch the screen.
     */
    AndroidAccessibilityEvent["TOUCH_INTERACTION_END"] = "touch_interaction_end";
    /**
     * Mask for AccessibilityEvent all types.
     */
    AndroidAccessibilityEvent["ALL_MASK"] = "all";
})(AndroidAccessibilityEvent || (AndroidAccessibilityEvent = {}));
//# sourceMappingURL=accessibility-types.js.map