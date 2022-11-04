export var connectionType;
(function (connectionType) {
    connectionType[connectionType["none"] = 0] = "none";
    connectionType[connectionType["wifi"] = 1] = "wifi";
    connectionType[connectionType["mobile"] = 2] = "mobile";
    connectionType[connectionType["ethernet"] = 3] = "ethernet";
    connectionType[connectionType["bluetooth"] = 4] = "bluetooth";
    connectionType[connectionType["vpn"] = 5] = "vpn";
})(connectionType || (connectionType = {}));
// Get Connection Type
function _createReachability(host) {
    if (host) {
        return SCNetworkReachabilityCreateWithName(null, host);
    }
    else {
        const zeroAddress = new interop.Reference(sockaddr, {
            sa_len: 16,
            sa_family: 2,
        });
        return SCNetworkReachabilityCreateWithAddress(null, zeroAddress);
    }
}
function _getReachabilityFlags(host) {
    const reachability = _createReachability(host);
    const flagsRef = new interop.Reference();
    const gotFlags = SCNetworkReachabilityGetFlags(reachability, flagsRef);
    if (!gotFlags) {
        return null;
    }
    return flagsRef.value;
}
function _getConnectionType(host) {
    const flags = _getReachabilityFlags(host);
    return _getConnectionTypeFromFlags(flags);
}
function _getConnectionTypeFromFlags(flags) {
    if (!flags) {
        return connectionType.none;
    }
    const isReachable = flags & 2 /* SCNetworkReachabilityFlags.kSCNetworkReachabilityFlagsReachable */;
    const connectionRequired = flags & 4 /* SCNetworkReachabilityFlags.kSCNetworkReachabilityFlagsConnectionRequired */;
    if (!isReachable || connectionRequired) {
        return connectionType.none;
    }
    const isWWAN = flags & 262144 /* SCNetworkReachabilityFlags.kSCNetworkReachabilityFlagsIsWWAN */;
    if (isWWAN) {
        return connectionType.mobile;
    }
    let keys;
    if (typeof CFNetworkCopySystemProxySettings !== 'undefined') {
        const cfDict = CFNetworkCopySystemProxySettings();
        // Only works on iOS device so guarded to help Simulator testing
        if (cfDict && cfDict.takeUnretainedValue) {
            const nsDict = cfDict.takeUnretainedValue();
            keys = nsDict.objectForKey('__SCOPED__');
        }
    }
    if (isVPNConnected(keys)) {
        return connectionType.vpn;
    }
    /*
    TODO try improving with CBCentralManager since toggling bluetooth
      with multiple connections fails to detect switch, require key added
      to Info.plist.
     */
    if (isBluetoothConnected(keys)) {
        return connectionType.bluetooth;
    }
    return connectionType.wifi;
}
function isBluetoothConnected(keys) {
    if (!keys) {
        return false;
    }
    const allKeys = keys.allKeys;
    const size = allKeys.count;
    let isBlueTooth = false;
    for (let i = 0; i < size; i++) {
        const key = allKeys.objectAtIndex(i);
        if (key === 'en4') {
            isBlueTooth = true;
            break;
        }
    }
    return isBlueTooth;
}
function isVPNConnected(keys) {
    if (!keys) {
        return false;
    }
    const allKeys = keys.allKeys;
    const size = allKeys.count;
    let isVPN = false;
    for (let i = 0; i < size; i++) {
        const key = allKeys.objectAtIndex(i);
        if (key === 'tap' || key === 'tun' || key === 'ppp' || key === 'ipsec' || key === 'ipsec0' || key === 'utun1') {
            isVPN = true;
            break;
        }
    }
    return isVPN;
}
export function getConnectionType() {
    return _getConnectionType();
}
// Start/Stop Monitoring
function _reachabilityCallback(target, flags, info) {
    if (_connectionTypeChangedCallback) {
        const newConnectionType = _getConnectionTypeFromFlags(flags);
        _connectionTypeChangedCallback(newConnectionType);
    }
}
const _reachabilityCallbackFunctionRef = new interop.FunctionReference(_reachabilityCallback);
let _monitorReachabilityRef;
let _connectionTypeChangedCallback;
export function startMonitoring(connectionTypeChangedCallback) {
    if (!_monitorReachabilityRef) {
        _monitorReachabilityRef = _createReachability();
        _connectionTypeChangedCallback = zonedCallback(connectionTypeChangedCallback);
        SCNetworkReachabilitySetCallback(_monitorReachabilityRef, _reachabilityCallbackFunctionRef, null);
        SCNetworkReachabilityScheduleWithRunLoop(_monitorReachabilityRef, CFRunLoopGetCurrent(), kCFRunLoopDefaultMode);
        _connectionTypeChangedCallback(_getConnectionType());
    }
}
export function stopMonitoring() {
    if (_monitorReachabilityRef) {
        SCNetworkReachabilityUnscheduleFromRunLoop(_monitorReachabilityRef, CFRunLoopGetCurrent(), kCFRunLoopDefaultMode);
        _monitorReachabilityRef = undefined;
        _connectionTypeChangedCallback = undefined;
    }
}
//# sourceMappingURL=index.ios.js.map