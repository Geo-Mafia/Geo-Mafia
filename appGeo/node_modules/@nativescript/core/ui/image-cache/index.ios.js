import * as common from './image-cache-common';
import { Trace } from '../../trace';
import * as utils from '../../utils';
let httpRequest;
function ensureHttpRequest() {
    if (!httpRequest) {
        httpRequest = require('../../http/http-request');
    }
}
var MemmoryWarningHandler = /** @class */ (function (_super) {
    __extends(MemmoryWarningHandler, _super);
    function MemmoryWarningHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MemmoryWarningHandler.new = function () {
        return _super.new.call(this);
    };
    MemmoryWarningHandler.prototype.initWithCache = function (cache) {
        this._cache = cache;
        NSNotificationCenter.defaultCenter.addObserverSelectorNameObject(this, 'clearCache', 'UIApplicationDidReceiveMemoryWarningNotification', null);
        if (Trace.isEnabled()) {
            Trace.write('[MemmoryWarningHandler] Added low memory observer.', Trace.categories.Debug);
        }
        return this;
    };
    MemmoryWarningHandler.prototype.dealloc = function () {
        NSNotificationCenter.defaultCenter.removeObserverNameObject(this, 'UIApplicationDidReceiveMemoryWarningNotification', null);
        if (Trace.isEnabled()) {
            Trace.write('[MemmoryWarningHandler] Removed low memory observer.', Trace.categories.Debug);
        }
        _super.prototype.dealloc.call(this);
    };
    MemmoryWarningHandler.prototype.clearCache = function () {
        if (Trace.isEnabled()) {
            Trace.write('[MemmoryWarningHandler] Clearing Image Cache.', Trace.categories.Debug);
        }
        this._cache.removeAllObjects();
        utils.GC();
    };
    MemmoryWarningHandler.ObjCExposedMethods = {
        clearCache: { returns: interop.types.void, params: [] },
    };
    return MemmoryWarningHandler;
}(NSObject));
export class Cache extends common.Cache {
    constructor() {
        super();
        this._cache = new NSCache();
        this._memoryWarningHandler = MemmoryWarningHandler.new().initWithCache(this._cache);
    }
    _downloadCore(request) {
        ensureHttpRequest();
        httpRequest.request({ url: request.url, method: 'GET' }).then((response) => {
            try {
                const image = UIImage.alloc().initWithData(response.content.raw);
                if (image) {
                    this._onDownloadCompleted(request.key, image);
                }
                else {
                    this._onDownloadError(request.key, new Error('No result for provided url'));
                }
            }
            catch (err) {
                this._onDownloadError(request.key, err);
            }
        }, (err) => {
            this._onDownloadError(request.key, err);
        });
    }
    get(key) {
        return this._cache.objectForKey(key);
    }
    set(key, image) {
        this._cache.setObjectForKey(image, key);
    }
    remove(key) {
        this._cache.removeObjectForKey(key);
    }
    clear() {
        this._cache.removeAllObjects();
        utils.GC();
    }
}
//# sourceMappingURL=index.ios.js.map