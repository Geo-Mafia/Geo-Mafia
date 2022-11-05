import { firebase } from "@nativescript/firebase";

/**
 * @author Kyu Park gypark23
 * @date 11/4/22
 */


/**
 * Initiates the firebase database
 * @param
 * @returns none
 */
export function databaseInit() {
    firebase.init({
        // Optionally pass in properties for database, authentication and cloud messaging,
        // see their respective docs.
    }).then(
        () => {
            console.log("firebase.init done");
        },
        error => {
            console.log(`firebase.init error: ${error}`);
        }
    );
}

/**
 * Add the data object to the initialized firebase database.
 * Must have the firebase database already initialized by calling databaseInit().
 * @param path - the exact node where the data will be put (ex. users/gypark23)
 * @param data - the JSON object that will be put in the database
 * @returns none
 */
export function databaseAdd(path: string, data: object): void {
    try {
        firebase.setValue(path, data);
    } catch (error) {
        console.log(`error in databaseAdd: ${error}`);
    }
}

/**
 * "Fetch" the JSON from the database and runs the given function.
 * Note that the function WILL NOT return the JSON object
 * but will execute the given function with the fetched JSON object.
 * @param path - the exact node where the data is located (ex. users/gypark23)
 * @param func - the function that will be executed taking the fetched JSON as an argument 
 * @returns none
 */
export function databaseGet(path: string, func: Function): void {
    firebase.getValue(path)
        .then(result => {
            func(JSON.stringify(result));
        })
        .catch(error => console.log(`error in databaseGet: ${error}`));
}

/**
 * Update the entry in the database
 * @param path - the exact node where the data is located (ex. users/gypark23)
 * @param data - the new updated JSON  
 * @returns none
 */
export function databaseUpdate(path: string, data: object): void {
    try {
        firebase.update(path, data);
    } catch (error) {
        console.log(`error in databaseUpdate: ${error}`);
    }
}

/**
 * Remove the node in database, including children 
 * @param path - the exact node where the node to be deleted is located (ex. users/gypark23)  
 * @returns none
 */
export function databaseRemove(path: string): void {
    try {
        firebase.remove(path)
    } catch (error) {
        console.log(`error in databaseRemove: ${path}`);
    }
}

/**
 * Add a listener (when there is a change detected in the node, execute a function) 
 * @param path - the exact node to be listened (ex. users/gypark23)  
 * @param func - function that will be executed once the change in the node is detected
 * @returns none
 */
export function databaseEventListener(path: string, func: (data: firebase.FBData) => void): void {
    try {
        firebase.addValueEventListener(func, path)
            .then(function (listenerWrapper) {
                var path = listenerWrapper.path;
                var listeners = listenerWrapper.listeners;
            })
    } catch (error) {
        console.log(`error in databaseEventListener: ${error}`);
    }
}