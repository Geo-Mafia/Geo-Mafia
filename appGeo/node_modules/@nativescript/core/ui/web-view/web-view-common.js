var WebViewBase_1;
import { ContainerView, CSSType } from '../core/view';
import { Property } from '../core/properties';
import { knownFolders } from '../../file-system';
import { booleanConverter } from '../core/view-base';
export * from './web-view-interfaces';
export const srcProperty = new Property({ name: 'src' });
export const disableZoomProperty = new Property({ name: 'disableZoom', defaultValue: false, valueConverter: booleanConverter });
let WebViewBase = WebViewBase_1 = class WebViewBase extends ContainerView {
    _onLoadFinished(url, error) {
        const args = {
            eventName: WebViewBase_1.loadFinishedEvent,
            object: this,
            url: url,
            navigationType: undefined,
            error: error,
        };
        this.notify(args);
    }
    _onLoadStarted(url, navigationType) {
        const args = {
            eventName: WebViewBase_1.loadStartedEvent,
            object: this,
            url: url,
            navigationType: navigationType,
            error: undefined,
        };
        this.notify(args);
    }
    get canGoBack() {
        throw new Error('This member is abstract.');
    }
    get canGoForward() {
        throw new Error('This member is abstract.');
    }
    [srcProperty.getDefault]() {
        return '';
    }
    [srcProperty.setNative](src) {
        this.stopLoading();
        // Add file:// prefix for local files.
        // They should be loaded with _loadUrl() method as it handles query params.
        if (src.indexOf('~/') === 0) {
            let appPath = knownFolders.currentApp().path;
            if (appPath && appPath.indexOf('/') !== 0) {
                // ensure slash is correct
                appPath = `/${appPath}`;
            }
            src = `file://${appPath}/` + src.substr(2);
        }
        else if (src.indexOf('/') === 0) {
            src = 'file://' + src;
        }
        // loading local files from paths with spaces may fail
        if (src.toLowerCase().indexOf('file:///') === 0) {
            src = encodeURI(src);
        }
        if (src.toLowerCase().indexOf('http://') === 0 || src.toLowerCase().indexOf('https://') === 0 || src.toLowerCase().indexOf('file:///') === 0) {
            this._loadUrl(src);
        }
        else {
            this._loadData(src);
        }
    }
};
WebViewBase.loadStartedEvent = 'loadStarted';
WebViewBase.loadFinishedEvent = 'loadFinished';
WebViewBase = WebViewBase_1 = __decorate([
    CSSType('WebView')
], WebViewBase);
export { WebViewBase };
srcProperty.register(WebViewBase);
disableZoomProperty.register(WebViewBase);
//# sourceMappingURL=web-view-common.js.map