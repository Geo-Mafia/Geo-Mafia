import { firebase } from "../../firebase";
export var auth;
(function (auth) {
    class Auth {
        loginHelper(options) {
            return new Promise((resolve, reject) => {
                firebase.login(options)
                    .then((user) => {
                    this.currentUser = user;
                    this.authStateChangedHandler && this.authStateChangedHandler(user);
                    resolve({
                        additionalUserInfo: user.additionalUserInfo,
                        credential: null,
                        operationType: "SignIn",
                        user: user,
                    });
                }).catch(err => {
                    let code = 'auth/exception';
                    let message = err.toString();
                    if (message.includes('com.google.firebase.auth.FirebaseAuthInvalidCredentialsException')) {
                        code = 'auth/wrong-password';
                    }
                    else if (message.includes('com.google.firebase.auth.FirebaseAuthInvalidUserException')) {
                        code = 'auth/user-not-found';
                    }
                    this.authStateOnErrorHandler && this.authStateOnErrorHandler(err.toString());
                    reject({
                        code: code,
                        message: message
                    });
                });
            });
        }
        onAuthStateChanged(handler, error, completed) {
            this.authStateChangedHandler = handler;
            if (error)
                this.authStateOnErrorHandler = error;
            console.log(">> added onAuthStateChanged handler");
            handler(this.currentUser);
            return () => {
                this.authStateChangedHandler = undefined;
                this.authStateOnErrorHandler = undefined;
            };
        }
        signOut() {
            return new Promise((resolve, reject) => {
                firebase.logout()
                    .then(() => {
                    this.currentUser = undefined;
                    this.authStateChangedHandler && this.authStateChangedHandler();
                    resolve();
                })
                    .catch(err => {
                    this.authStateOnErrorHandler && this.authStateOnErrorHandler(err);
                    reject({
                        message: err
                    });
                });
            });
        }
        unlink(providerId) {
            return new Promise((resolve, reject) => {
                firebase.unlink(providerId)
                    .then(user => {
                    this.currentUser = user;
                    resolve(user);
                })
                    .catch(err => {
                    reject({
                        message: err
                    });
                });
            });
        }
        signInWithEmailAndPassword(email, password) {
            const emailOption = {
                type: firebase.LoginType.PASSWORD,
                passwordOptions: {
                    email: email,
                    password: password
                }
            };
            return this.loginHelper(emailOption);
        }
        signInWithCustomToken(token) {
            const customTokenOption = {
                type: firebase.LoginType.CUSTOM,
                customOptions: {
                    token: token
                }
            };
            return this.loginHelper(customTokenOption);
        }
        signInAnonymously() {
            const anonymousOption = {
                type: firebase.LoginType.ANONYMOUS
            };
            return this.loginHelper(anonymousOption);
        }
        sendSignInLinkToEmail(email, actionCodeSettings) {
            const sendSignInLinklOption = {
                type: firebase.LoginType.EMAIL_LINK,
                emailLinkOptions: {
                    email: email,
                    url: actionCodeSettings.url,
                }
            };
            return this.loginHelper(sendSignInLinklOption);
        }
        signInWithEmailLink(email, emailLink) {
            const signInWithEmailOption = {
                type: firebase.LoginType.EMAIL_LINK,
                emailLinkOptions: {
                    email: email,
                    url: emailLink
                }
            };
            return this.loginHelper(signInWithEmailOption);
        }
        createUserWithEmailAndPassword(email, password) {
            return new Promise((resolve, reject) => {
                firebase.createUser({
                    email: email,
                    password: password
                }).then((user) => {
                    this.currentUser = user;
                    resolve(user);
                }).catch(err => reject(err));
            });
        }
        updateEmail(newEmail) {
            return new Promise((resolve, reject) => {
                firebase.updateEmail(newEmail)
                    .then(() => resolve())
                    .catch(err => reject(err));
            });
        }
        updatePassword(newPassword) {
            return new Promise((resolve, reject) => {
                firebase.updatePassword(newPassword)
                    .then(() => resolve())
                    .catch(err => reject(err));
            });
        }
        sendPasswordResetEmail(email) {
            return new Promise((resolve, reject) => {
                firebase.sendPasswordResetEmail(email)
                    .then(() => resolve())
                    .catch(err => reject(err));
            });
        }
        fetchSignInMethodsForEmail(email) {
            return firebase.fetchSignInMethodsForEmail(email);
        }
    }
    auth.Auth = Auth;
})(auth || (auth = {}));
//# sourceMappingURL=index.js.map