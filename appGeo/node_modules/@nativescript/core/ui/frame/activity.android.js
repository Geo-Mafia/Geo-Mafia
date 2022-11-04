import '../../globals';
import { setActivityCallbacks } from '.';
const appModule = require('../../application');
/**
 * NOTE: We cannot use NativeClass here because this is used in appComponents in webpack.config
 * Whereby it bypasses the decorator transformation, hence pure es5 style written here
 */
const superProto = androidx.appcompat.app.AppCompatActivity.prototype;
androidx.appcompat.app.AppCompatActivity.extend('com.tns.NativeScriptActivity', {
    init() {
        // init must at least be defined
    },
    onCreate(savedInstanceState) {
        appModule.android.init(this.getApplication());
        // Set isNativeScriptActivity in onCreate.
        // The JS constructor might not be called because the activity is created from Android.
        this.isNativeScriptActivity = true;
        if (!this._callbacks) {
            setActivityCallbacks(this);
        }
        this._callbacks.onCreate(this, savedInstanceState, this.getIntent(), superProto.onCreate);
    },
    onNewIntent(intent) {
        this._callbacks.onNewIntent(this, intent, superProto.setIntent, superProto.onNewIntent);
    },
    onSaveInstanceState(outState) {
        this._callbacks.onSaveInstanceState(this, outState, superProto.onSaveInstanceState);
    },
    onStart() {
        this._callbacks.onStart(this, superProto.onStart);
    },
    onStop() {
        this._callbacks.onStop(this, superProto.onStop);
    },
    onDestroy() {
        this._callbacks.onDestroy(this, superProto.onDestroy);
    },
    onPostResume() {
        this._callbacks.onPostResume(this, superProto.onPostResume);
    },
    onBackPressed() {
        this._callbacks.onBackPressed(this, superProto.onBackPressed);
    },
    onRequestPermissionsResult(requestCode, permissions, grantResults) {
        this._callbacks.onRequestPermissionsResult(this, requestCode, permissions, grantResults, undefined /*TODO: Enable if needed*/);
    },
    onActivityResult(requestCode, resultCode, data) {
        this._callbacks.onActivityResult(this, requestCode, resultCode, data, superProto.onActivityResult);
    },
});
//# sourceMappingURL=activity.android.js.map