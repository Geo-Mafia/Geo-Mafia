import * as httpRequest from './http-request';
export * from './http-request';
export var HttpResponseEncoding;
(function (HttpResponseEncoding) {
    HttpResponseEncoding[HttpResponseEncoding["UTF8"] = 0] = "UTF8";
    HttpResponseEncoding[HttpResponseEncoding["GBK"] = 1] = "GBK";
})(HttpResponseEncoding || (HttpResponseEncoding = {}));
export function getString(arg) {
    return new Promise((resolve, reject) => {
        httpRequest.request(typeof arg === 'string' ? { url: arg, method: 'GET' } : arg).then((r) => {
            try {
                const str = r.content.toString();
                resolve(str);
            }
            catch (e) {
                reject(e);
            }
        }, (e) => reject(e));
    });
}
export function getJSON(arg) {
    return new Promise((resolve, reject) => {
        httpRequest.request(typeof arg === 'string' ? { url: arg, method: 'GET' } : arg).then((r) => {
            try {
                const json = r.content.toJSON();
                resolve(json);
            }
            catch (e) {
                reject(e);
            }
        }, (e) => reject(e));
    });
}
export function getImage(arg) {
    return new Promise((resolve, reject) => {
        httpRequest.request(typeof arg === 'string' ? { url: arg, method: 'GET' } : arg).then((r) => {
            try {
                resolve(r.content.toImage());
            }
            catch (err) {
                reject(err);
            }
        }, (err) => {
            reject(err);
        });
    });
}
export function getFile(arg, destinationFilePath) {
    return new Promise((resolve, reject) => {
        httpRequest.request(typeof arg === 'string' ? { url: arg, method: 'GET' } : arg).then((r) => {
            try {
                const file = r.content.toFile(destinationFilePath);
                resolve(file);
            }
            catch (e) {
                reject(e);
            }
        }, (e) => reject(e));
    });
}
export function getBinary(arg) {
    return new Promise((resolve, reject) => {
        httpRequest.request(typeof arg === 'string' ? { url: arg, method: 'GET' } : arg).then((r) => {
            try {
                const arrayBuffer = r.content.toArrayBuffer();
                resolve(arrayBuffer);
            }
            catch (e) {
                reject(e);
            }
        }, (e) => reject(e));
    });
}
//# sourceMappingURL=index.js.map