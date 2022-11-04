import { firebase } from "../../firebase";
export declare namespace auth {
    class Auth {
        private authStateChangedHandler;
        private authStateOnErrorHandler;
        currentUser: firebase.User;
        languageCode: string | null;
        private loginHelper;
        onAuthStateChanged(handler: (user: firebase.User) => void, error?: (err: any) => any, completed?: firebase.Unsubscribe): firebase.Unsubscribe;
        signOut(): Promise<any>;
        unlink(providerId: string): Promise<any>;
        signInWithEmailAndPassword(email: string, password: string): Promise<any>;
        signInWithCustomToken(token: string): Promise<any>;
        signInAnonymously(): Promise<any>;
        sendSignInLinkToEmail(email: string, actionCodeSettings: firebase.FirebaseEmailLinkActionCodeSettings): Promise<any>;
        signInWithEmailLink(email: string, emailLink: string): Promise<any>;
        createUserWithEmailAndPassword(email: string, password: string): Promise<firebase.User>;
        updateEmail(newEmail: string): Promise<void>;
        updatePassword(newPassword: string): Promise<void>;
        sendPasswordResetEmail(email: string): Promise<void>;
        fetchSignInMethodsForEmail(email: string): Promise<any>;
    }
}
