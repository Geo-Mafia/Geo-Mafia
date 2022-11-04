import * as observable from '../../data/observable';
export class Cache extends observable.Observable {
    constructor() {
        super(...arguments);
        this.maxRequests = 5;
        this._enabled = true;
        this._pendingDownloads = {};
        this._queue = [];
        this._currentDownloads = 0;
    }
    enableDownload() {
        if (this._enabled) {
            return;
        }
        // schedule all pending downloads
        this._enabled = true;
        let request;
        while (this._queue.length > 0 && this._currentDownloads < this.maxRequests) {
            request = this._queue.pop();
            if (!(request.key in this._pendingDownloads)) {
                this._download(request);
            }
        }
    }
    disableDownload() {
        if (!this._enabled) {
            return;
        }
        this._enabled = false;
    }
    push(request) {
        this._addRequest(request, true);
    }
    enqueue(request) {
        this._addRequest(request, false);
    }
    _addRequest(request, onTop) {
        if (request.key in this._pendingDownloads) {
            const existingRequest = this._pendingDownloads[request.key];
            this._mergeRequests(existingRequest, request);
        }
        else {
            // TODO: Potential performance bottleneck - traversing the whole queue on each download request.
            let queueRequest;
            for (let i = 0; i < this._queue.length; i++) {
                if (this._queue[i].key === request.key) {
                    queueRequest = this._queue[i];
                    break;
                }
            }
            if (queueRequest) {
                this._mergeRequests(queueRequest, request);
            }
            else {
                if (this._shouldDownload(request, onTop)) {
                    this._download(request);
                }
            }
        }
    }
    _mergeRequests(existingRequest, newRequest) {
        if (existingRequest.completed) {
            if (newRequest.completed) {
                const existingCompleted = existingRequest.completed;
                const stackCompleted = function (result, key) {
                    existingCompleted(result, key);
                    newRequest.completed(result, key);
                };
                existingRequest.completed = stackCompleted;
            }
        }
        else {
            existingRequest.completed = newRequest.completed;
        }
        if (existingRequest.error) {
            if (newRequest.error) {
                const existingError = existingRequest.error;
                const stackError = function (key) {
                    existingError(key);
                    newRequest.error(key);
                };
                existingRequest.error = stackError;
            }
        }
        else {
            existingRequest.error = newRequest.error;
        }
    }
    get(key) {
        // This method is intended to be overridden by the android and ios implementations
        throw new Error('Abstract');
    }
    set(key, image) {
        // This method is intended to be overridden by the android and ios implementations
        throw new Error('Abstract');
    }
    remove(key) {
        // This method is intended to be overridden by the android and ios implementations
        throw new Error('Abstract');
    }
    clear() {
        // This method is intended to be overridden by the android and ios implementations
        throw new Error('Abstract');
    }
    /* tslint:disable:no-unused-variable */
    _downloadCore(request) {
        // This method is intended to be overridden by the android and ios implementations
        throw new Error('Abstract');
    }
    /* tslint:enable:no-unused-variable */
    _onDownloadCompleted(key, image) {
        const request = this._pendingDownloads[key];
        this.set(request.key, image);
        this._currentDownloads--;
        if (request.completed) {
            request.completed(image, request.key);
        }
        if (this.hasListeners(Cache.downloadedEvent)) {
            this.notify({
                eventName: Cache.downloadedEvent,
                object: this,
                key: key,
                image: image,
            });
        }
        delete this._pendingDownloads[request.key];
        this._updateQueue();
    }
    _onDownloadError(key, err) {
        const request = this._pendingDownloads[key];
        this._currentDownloads--;
        if (request.error) {
            request.error(request.key);
        }
        if (this.hasListeners(Cache.downloadErrorEvent)) {
            this.notify({
                eventName: Cache.downloadErrorEvent,
                object: this,
                key: key,
                error: err,
            });
        }
        delete this._pendingDownloads[request.key];
        this._updateQueue();
    }
    _shouldDownload(request, onTop) {
        if (this.get(request.key) || request.key in this._pendingDownloads) {
            return false;
        }
        if (this._currentDownloads >= this.maxRequests || !this._enabled) {
            if (onTop) {
                this._queue.push(request);
            }
            else {
                this._queue.unshift(request);
            }
            return false;
        }
        return true;
    }
    _download(request) {
        this._currentDownloads++;
        this._pendingDownloads[request.key] = request;
        this._downloadCore(request);
    }
    _updateQueue() {
        if (!this._enabled || this._queue.length === 0 || this._currentDownloads === this.maxRequests) {
            return;
        }
        const request = this._queue.pop();
        this._download(request);
    }
}
Cache.downloadedEvent = 'downloaded';
Cache.downloadErrorEvent = 'downloadError';
//# sourceMappingURL=image-cache-common.js.map