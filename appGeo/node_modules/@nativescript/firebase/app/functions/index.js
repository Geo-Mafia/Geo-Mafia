import { firebaseFunctions as fNamespace } from "../../firebase";
export var functions;
(function (functions) {
    class Functions {
        httpsCallable(functionName, region) {
            return fNamespace.httpsCallable(functionName, region);
        }
    }
    functions.Functions = Functions;
})(functions || (functions = {}));
//# sourceMappingURL=index.js.map