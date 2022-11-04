import { firebaseFunctions as fNamespace } from "../../firebase";
export declare namespace functions {
    class Functions {
        httpsCallable<I, O>(functionName: string, region?: fNamespace.SupportedRegions): fNamespace.HttpsCallable<I, O>;
    }
}
