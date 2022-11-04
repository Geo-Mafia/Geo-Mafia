import { firebaseUtils } from '../utils';
let functions;
function getFunctions(region) {
    if (!functions) {
        functions = region ? FIRFunctions.functionsForRegion(region) : FIRFunctions.functions();
    }
    return functions;
}
export function httpsCallable(functionName, region) {
    const functions = getFunctions(region);
    return (data) => new Promise((resolve, reject) => {
        const callable = functions.HTTPSCallableWithName(functionName);
        const handleCompletion = (result, err) => {
            if (err) {
                reject(err.localizedDescription);
                return;
            }
            if (result) {
                resolve(firebaseUtils.toJsObject(result.data));
            }
        };
        if (data) {
            callable.callWithObjectCompletion(data, handleCompletion);
        }
        else {
            callable.callWithCompletion(handleCompletion);
        }
    });
}
export function useFunctionsEmulator(origin) {
    const functions = getFunctions();
    functions.useFunctionsEmulatorOrigin(origin);
}
//# sourceMappingURL=functions.ios.js.map