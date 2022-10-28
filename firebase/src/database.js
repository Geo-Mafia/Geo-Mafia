import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, child, get, update} from "firebase/database";

const firebaseConfig = {
    // ...
    // The value of `databaseURL` depends on the location of the database
    databaseURL: "https://geo-mafia-default-rtdb.firebaseio.com/",
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);


/*
    writeData(dir, data)
    args
        dir: directory in string (ex: users/files/...) 
        data : JSON file to be written 
    
    Pushes JSON to directory in Firebase Realtime Database, return true if successful, false if not successful
*/ 
export function writeData(dir, data) {
    const db = getDatabase();
    try {
        set(ref(db, dir), data);
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}


/*
    readData(dir)
    args
        dir: directory in string (ex: users/files/...) 
    
    Find JSON of name, return JSON if data was found, null if data named dir not found or error
*/ 
export function readData(dir) {
    const dbRef = ref(getDatabase());
    var ret = [0];
    get(child(dbRef, dir)).then((snapshot) => {
      if (snapshot.exists()) {
        ret[0] = snapshot.toJSON();
        return snapshot.toJSON();
      }
    }).catch((error) => {
      console.error(error)
    });
    console.log(ret);
    return ret[0];
}


/*
    updateData(dir, data)
    args:
        dir: directory in string (ex: users/files/...) to be updated 
        data : JSON file to be updated
    
    Find data in database, return true on a successful update, return false otherwise
*/
export function updateData(dir, data) {
    const db = getDatabase();
    try {
        const dbref = (child(ref(db), dir));
        dbref.set(data);
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}


/*
    deleteData(dir)
    args:
        dir: directory in string (ex: users/files/...) to be deleted
    
    Find data in database, return true on a successful delete, return false otherwise
*/
export function deleteData(dir) {
    try {
        let userRef = database.ref(dir);
        userRef.remove();
    }
    catch (error) {
        console.log(error);
        return false;
    }
}


/*
    resetDatabase()
    resets database, delete all nodes
    return true if successful, return false otherwise 
*/
export function resetDatabase() {
    try {
        const db = getDatabase();
        db.ref().remove();
        return true;
    }
    catch (error) {
        console.log(error)
        return false;
    }
}