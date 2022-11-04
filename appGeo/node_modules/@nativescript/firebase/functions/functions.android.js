import { firebase as firebaseCommon } from "../firebase-common";
export function httpsCallable(functionName, region = "us-central1") {
    const instance = com.google.firebase.functions.FirebaseFunctions.getInstance(region);
    return (data) => new Promise((resolve, reject) => {
        const actData = firebaseCommon.toValue(data);
        return instance.getHttpsCallable(functionName)
            .call(actData)
            .continueWith(new com.google.android.gms.tasks.Continuation({
            then: (task) => {
                try {
                    const result = task.getResult();
                    const resultData = result.getData();
                    resolve(firebaseCommon.toJsObject(resultData));
                }
                catch (e) {
                    console.log('Error Caught:', e);
                    reject(e.message);
                }
            }
        }));
    });
}
export function useFunctionsEmulator(origin) {
    com.google.firebase.functions.FirebaseFunctions.getInstance()
        .useFunctionsEmulator(origin);
}
//# sourceMappingURL=functions.android.js.map