import * as common from './image-cache-common';
import { Trace } from '../../trace';
let LruBitmapCacheClass;
function ensureLruBitmapCacheClass() {
    if (LruBitmapCacheClass) {
        return;
    }
    var LruBitmapCache = /** @class */ (function (_super) {
    __extends(LruBitmapCache, _super);
    function LruBitmapCache(cacheSize) {
        var _this = _super.call(this, cacheSize) || this;
        return global.__native(_this);
    }
    LruBitmapCache.prototype.sizeOf = function (key, bitmap) {
        // The cache size will be measured in kilobytes rather than
        // number of items.
        var result = Math.round(bitmap.getByteCount() / 1024);
        return result;
    };
    return LruBitmapCache;
}(android.util.LruCache));
    LruBitmapCacheClass = LruBitmapCache;
}
export class Cache extends common.Cache {
    constructor() {
        super();
        ensureLruBitmapCacheClass();
        const maxMemory = java.lang.Runtime.getRuntime().maxMemory() / 1024;
        const cacheSize = maxMemory / 8;
        this._cache = new LruBitmapCacheClass(cacheSize);
        const that = new WeakRef(this);
        this._callback = new org.nativescript.widgets.Async.CompleteCallback({
            onComplete: function (result, context) {
                const instance = that.get();
                if (instance) {
                    if (result) {
                        instance._onDownloadCompleted(context, result);
                    }
                    else {
                        instance._onDownloadError(context, new Error('No result in CompletionCallback'));
                    }
                }
            },
            onError: function (err, context) {
                const instance = that.get();
                if (instance) {
                    instance._onDownloadError(context, new Error(err));
                }
            },
        });
    }
    _downloadCore(request) {
        org.nativescript.widgets.Async.Image.download(request.url, this._callback, request.key);
    }
    get(key) {
        const result = this._cache.get(key);
        return result;
    }
    set(key, image) {
        try {
            if (key && image) {
                this._cache.put(key, image);
            }
        }
        catch (err) {
            Trace.write('Cache set error: ' + err, Trace.categories.Error, Trace.messageType.error);
        }
    }
    remove(key) {
        this._cache.remove(key);
    }
    clear() {
        this._cache.evictAll();
    }
}
//# sourceMappingURL=index.android.js.map