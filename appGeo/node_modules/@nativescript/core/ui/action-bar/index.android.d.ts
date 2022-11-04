import { AndroidActionItemSettings, AndroidActionBarSettings as AndroidActionBarSettingsDefinition } from '.';
import { ActionItemBase, ActionBarBase } from './action-bar-common';
import { View } from '../core/view';
import type { Background } from '../styling/background';
export * from './action-bar-common';
export declare class ActionItem extends ActionItemBase {
    private _androidPosition;
    private _itemId;
    constructor();
    get android(): AndroidActionItemSettings;
    set android(value: AndroidActionItemSettings);
    _getItemId(): any;
}
export declare class AndroidActionBarSettings implements AndroidActionBarSettingsDefinition {
    private _actionBar;
    private _icon;
    private _iconVisibility;
    constructor(actionBar: ActionBar);
    get icon(): string;
    set icon(value: string);
    get iconVisibility(): 'auto' | 'never' | 'always';
    set iconVisibility(value: 'auto' | 'never' | 'always');
}
export declare class NavigationButton extends ActionItem {
}
export declare class ActionBar extends ActionBarBase {
    private _android;
    nativeViewProtected: androidx.appcompat.widget.Toolbar;
    constructor();
    get android(): AndroidActionBarSettings;
    _addChildFromBuilder(name: string, value: any): void;
    createNativeView(): androidx.appcompat.widget.Toolbar;
    initNativeView(): void;
    disposeNativeView(): void;
    onLoaded(): void;
    update(): void;
    _applyBackground(background: Background, isBorderDrawable: any, onlyColor: boolean, backgroundDrawable: any): void;
    _onAndroidItemSelected(itemId: number): boolean;
    _updateNavigationButton(): void;
    _updateIcon(): void;
    _updateTitleAndTitleView(): void;
    _addActionItems(): void;
    private static _setOnClickListener;
    _onTitlePropertyChanged(): void;
    _onIconPropertyChanged(): void;
    _addViewToNativeVisualTree(child: View, atIndex?: number): boolean;
    _removeViewFromNativeVisualTree(child: View): void;
    accessibilityScreenChanged(): void;
}
