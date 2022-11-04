import { IOSActionItemSettings } from '.';
import { ActionItemBase, ActionBarBase } from './action-bar-common';
export * from './action-bar-common';
export declare class ActionItem extends ActionItemBase {
    private _ios;
    get ios(): IOSActionItemSettings;
    set ios(value: IOSActionItemSettings);
}
export declare class NavigationButton extends ActionItem {
    _navigationItem: UINavigationItem;
    _onVisibilityChanged(visibility: string): void;
}
export declare class ActionBar extends ActionBarBase {
    get ios(): UIView;
    createNativeView(): UIView;
    _addChildFromBuilder(name: string, value: any): void;
    get _getActualSize(): {
        width: number;
        height: number;
    };
    layoutInternal(): void;
    private _getIconRenderingMode;
    private _getNavigationItem;
    update(): void;
    private populateMenuItems;
    private createBarButtonItem;
    private updateColors;
    private setColor;
    private setBackgroundColor;
    _onTitlePropertyChanged(): void;
    private updateFlatness;
    private _getAppearance;
    private _updateAppearance;
    onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void;
    onLayout(left: number, top: number, right: number, bottom: number): void;
    layoutNativeView(left: number, top: number, right: number, bottom: number): void;
    private get navBar();
}
