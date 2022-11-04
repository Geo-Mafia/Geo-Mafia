import * as firebase from "../firebase";
import { HttpsCallable } from './functions';
export declare function httpsCallable<I = {}, O = {}>(functionName: string, region?: firebase.firebaseFunctions.SupportedRegions): HttpsCallable<I, O>;
export declare function useFunctionsEmulator(origin: string): void;
