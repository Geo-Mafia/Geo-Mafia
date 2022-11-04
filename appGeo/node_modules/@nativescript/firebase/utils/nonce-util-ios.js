const CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._";
export function getNonce(length) {
    let text = "";
    for (let i = 0; i < length; i++) {
        text += CHARSET.charAt(Math.floor(Math.random() * CHARSET.length));
    }
    return text;
}
export function Sha256(input) {
    const nsStr = NSString.stringWithString(input);
    const nsData = nsStr.dataUsingEncoding(NSUTF8StringEncoding);
    const hash = NSMutableData.dataWithLength(32);
    CC_SHA256(nsData.bytes, nsData.length, hash.mutableBytes);
    const data = NSData.dataWithBytesLength(hash.mutableBytes, 32);
    return _Format(data);
}
function _Format(data) {
    const buffer = interop.bufferFromData(data);
    const view = new Uint8Array(buffer);
    let result = "";
    for (let i = 0; i !== data.length; ++i) {
        let tmp = view[i].toString(16);
        if (tmp.length === 1) {
            result += "0";
        }
        result += tmp;
    }
    return result;
}
//# sourceMappingURL=nonce-util-ios.js.map