import { View, CustomLayoutView } from '../core/view';
import { layout } from '../../utils';
/**
 * Represents a View that has a single child - content.
 * The View itself does not have visual representation and serves as a placeholder for its content in the logical tree.
 */
export class ContentView extends CustomLayoutView {
    /**
     * Gets or sets the single child of the view.
     */
    get content() {
        return this._content;
    }
    set content(value) {
        const oldView = this._content;
        if (this._content) {
            this._removeView(this._content);
        }
        this._content = value;
        if (this._content) {
            this._addView(this._content);
        }
        this._onContentChanged(oldView, value);
        if (global.isIOS && oldView !== value) {
            this.requestLayout();
        }
    }
    get layoutView() {
        let result;
        if (this._content) {
            let first = true;
            this._content._eachLayoutView((child) => {
                if (first) {
                    first = false;
                    result = child;
                }
                else {
                    throw new Error('More than one layout child inside a ContentView');
                }
            });
        }
        return result;
    }
    get _childrenCount() {
        return this._content ? 1 : 0;
    }
    //@private
    /**
     * Called when the content property has changed.
     * @private
     * @param oldView The previous content.
     * @param newView The new content.
     */
    _onContentChanged(oldView, newView) {
        //
    }
    _addChildFromBuilder(name, value) {
        if (value instanceof View) {
            this.content = value;
        }
    }
    eachChildView(callback) {
        const content = this._content;
        if (content) {
            callback(content);
        }
    }
    // This method won't be called in Android because we use the native android layout.
    onMeasure(widthMeasureSpec, heightMeasureSpec) {
        const result = View.measureChild(this, this.layoutView, widthMeasureSpec, heightMeasureSpec);
        const width = layout.getMeasureSpecSize(widthMeasureSpec);
        const widthMode = layout.getMeasureSpecMode(widthMeasureSpec);
        const height = layout.getMeasureSpecSize(heightMeasureSpec);
        const heightMode = layout.getMeasureSpecMode(heightMeasureSpec);
        const measureWidth = Math.max(result.measuredWidth, this.effectiveMinWidth);
        const measureHeight = Math.max(result.measuredHeight, this.effectiveMinHeight);
        const widthAndState = View.resolveSizeAndState(measureWidth, width, widthMode, 0);
        const heightAndState = View.resolveSizeAndState(measureHeight, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    }
    // This method won't be called in Android because we use the native android layout.
    onLayout(left, top, right, bottom) {
        View.layoutChild(this, this.layoutView, 0, 0, right - left, bottom - top);
    }
}
ContentView.prototype.recycleNativeView = 'auto';
//# sourceMappingURL=index.js.map